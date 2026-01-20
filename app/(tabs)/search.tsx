import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import ScreenContainer from "../../src/components/ScreenContainer";
import GlassCard from "../../src/components/GlassCard";
import { theme } from "../../src/constants/theme";
import { OPENWEATHER_API_KEY } from "../../src/constants/env";
import { fetchCurrentWeatherByCity, type CurrentWeather } from "../../src/services/weather";
import {
  addFavoriteCity,
  getFavoriteCities,
  removeFavoriteCity,
  type FavoriteCity,
} from "../../src/services/favorites";
import { useAppSettings } from "../../src/hooks/useAppSettings";
import FavoriteWeatherRow from "../../src/components/FavoriteWeatherRow";

export default function SearchScreen() {
  const { unit } = useAppSettings();
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CurrentWeather | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [favLoading, setFavLoading] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteCity[]>([]);

  async function loadFavorites() {
    try {
      setFavLoading(true);
      const list = await getFavoriteCities();
      setFavorites(list);
    } catch (e) {
      // ignore for now
    } finally {
      setFavLoading(false);
    }
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  // If unit changes, refetch current search result (if exists)
  useEffect(() => {
    if (result?.city) {
      fetchCurrentWeatherByCity(result.city, OPENWEATHER_API_KEY, unit)
        .then(setResult)
        .catch(() => {});
    }
  }, [unit]);

  async function onSearch() {
    if (!query.trim()) return;
    try {
      setErr(null);
      setLoading(true);
      setResult(null);

      const data = await fetchCurrentWeatherByCity(query.trim(), OPENWEATHER_API_KEY, unit);
      setResult(data);
    } catch (e: any) {
      setErr("City not found. Try another name.");
    } finally {
      setLoading(false);
    }
  }

  async function onAddFavorite() {
    if (!result?.city) return;
    try {
      await addFavoriteCity(result.city);
      Alert.alert("Saved ✅", `${result.city} added to favorites`);
      await loadFavorites();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to save favorite");
    }
  }

  async function onRemoveFavorite(id: string, city: string) {
    try {
      await removeFavoriteCity(id);
      Alert.alert("Removed", `${city} removed from favorites`);
      await loadFavorites();
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to remove");
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Search City</Text>
      <Text style={styles.subtitle}>Find weather for any location</Text>

      <GlassCard style={{ marginTop: 18 }}>
        <Text style={styles.label}>City Name</Text>

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="e.g. Mumbai, London"
          placeholderTextColor="#64748B"
          style={styles.input}
          onSubmitEditing={onSearch}
        />

        <Pressable onPress={onSearch} style={styles.btn}>
          <Text style={styles.btnText}>Search</Text>
        </Pressable>
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        {loading ? (
          <View style={{ alignItems: "center", paddingVertical: 20 }}>
            <ActivityIndicator />
            <Text style={styles.muted}>Searching...</Text>
          </View>
        ) : err ? (
          <Text style={styles.muted}>{err}</Text>
        ) : result ? (
          <View style={{ gap: 8 }}>
            <Text style={styles.city}>{result.city}</Text>
            <Text style={styles.temp}>
              {result.temp}{unitSymbol}
            </Text>
            <Text style={styles.muted}>
              {result.condition} • H: {result.high}{unitSymbol}  L: {result.low}{unitSymbol}
            </Text>

            <Pressable onPress={onAddFavorite} style={[styles.btn, { marginTop: 10 }]}>
              <Text style={styles.btnText}>Add to Favorites</Text>
            </Pressable>
          </View>
        ) : (
          <Text style={styles.muted}>Search a city to preview weather.</Text>
        )}
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        <View style={styles.favHeader}>
          <Text style={styles.favTitle}>Favorites</Text>
          <Pressable onPress={loadFavorites}>
            <Text style={styles.refresh}>Refresh</Text>
          </Pressable>
        </View>

        {favLoading ? (
          <View style={{ paddingVertical: 10 }}>
            <ActivityIndicator />
          </View>
        ) : favorites.length === 0 ? (
          <Text style={styles.muted}>No favorites yet.</Text>
        ) : (
          favorites.map((fav) => (
            <FavoriteWeatherRow
              key={fav.id}
              city={fav.city_name}
              onRemove={() => onRemoveFavorite(fav.id, fav.city_name)}
            />
          ))
        )}
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: 30,
    fontWeight: "900",
    marginTop: 14,
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: 6,
  },
  label: {
    color: theme.colors.muted,
    fontWeight: "700",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "white",
    fontSize: 16,
  },
  btn: {
    marginTop: 12,
    backgroundColor: "white",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  btnText: {
    fontWeight: "900",
  },
  muted: {
    color: theme.colors.muted,
  },
  city: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "900",
  },
  temp: {
    color: theme.colors.text,
    fontSize: 46,
    fontWeight: "900",
  },

  favHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  favTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "900",
  },
  refresh: {
    color: theme.colors.muted,
    fontWeight: "700",
  },
});
