import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { theme } from "../constants/theme";
import { OPENWEATHER_API_KEY } from "../constants/env";
import { fetchCurrentWeatherByCity, type CurrentWeather } from "../services/weather";
import { useAppSettings } from "../hooks/useAppSettings";

type Props = {
  city: string;
  onRemove: () => void;
};

export default function FavoriteWeatherRow({ city, onRemove }: Props) {
  const { unit } = useAppSettings();
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CurrentWeather | null>(null);

  async function load() {
    try {
      setLoading(true);
      const res = await fetchCurrentWeatherByCity(city, OPENWEATHER_API_KEY, unit);
      setData(res);
    } catch {
      setData(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [city, unit]);

  return (
    <View style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.city}>{city}</Text>

        {loading ? (
          <View style={{ paddingTop: 6 }}>
            <ActivityIndicator />
          </View>
        ) : data ? (
          <Text style={styles.sub}>
            {data.temp}{unitSymbol} • {data.condition}
          </Text>
        ) : (
          <Text style={styles.sub}>Weather unavailable</Text>
        )}
      </View>

      <Pressable onPress={onRemove}>
        <Text style={styles.remove}>Remove</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
    gap: 10,
  },
  city: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 15,
  },
  sub: {
    color: theme.colors.muted,
    marginTop: 4,
    fontWeight: "600",
    fontSize: 13,
  },
  remove: {
    color: "#FCA5A5",
    fontWeight: "900",
    paddingTop: 2,
  },
});
