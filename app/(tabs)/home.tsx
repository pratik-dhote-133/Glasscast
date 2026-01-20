import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import ScreenContainer from "../../src/components/ScreenContainer";
import GlassCard from "../../src/components/GlassCard";
import { theme } from "../../src/constants/theme";
import { OPENWEATHER_API_KEY } from "../../src/constants/env";
import {
  fetchCurrentWeatherByCity,
  fetch5DayForecastByCity,
  type CurrentWeather,
  type ForecastDay,
} from "../../src/services/weather";
import ForecastRow from "../../src/components/ForecastRow";
import { useAppSettings } from "../../src/hooks/useAppSettings";

export default function HomeScreen() {
  const { unit } = useAppSettings();
  const unitSymbol = unit === "metric" ? "°C" : "°F";

  const [city] = useState("Nagpur");
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    try {
      setErr(null);
      setLoading(true);

      const cw = await fetchCurrentWeatherByCity(city, OPENWEATHER_API_KEY, unit);
      const fc = await fetch5DayForecastByCity(city, OPENWEATHER_API_KEY, unit);

      setCurrent(cw);
      setForecast(fc);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to load weather");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [unit]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>Glasscast</Text>
      <Text style={styles.subtitle}>Live weather + 5-day forecast</Text>

      <GlassCard style={{ marginTop: 18 }}>
        {loading ? (
          <View style={{ paddingVertical: 30, alignItems: "center" }}>
            <ActivityIndicator />
            <Text style={styles.muted}>Loading weather...</Text>
          </View>
        ) : err ? (
          <View style={{ gap: 10 }}>
            <Text style={{ color: "white", fontWeight: "800" }}>Error</Text>
            <Text style={styles.muted}>{err}</Text>
            <Pressable onPress={load} style={styles.btn}>
              <Text style={styles.btnText}>Retry</Text>
            </Pressable>
          </View>
        ) : current ? (
          <View style={{ gap: 6 }}>
            <Text style={styles.bigTemp}>
              {current.temp}{unitSymbol}
            </Text>
            <Text style={styles.city}>{current.city}</Text>
            <Text style={styles.muted}>
              {current.condition} • H: {current.high}{unitSymbol}  L: {current.low}{unitSymbol}
            </Text>
          </View>
        ) : null}
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ color: theme.colors.text, fontWeight: "800", fontSize: 16 }}>
            Forecast
          </Text>
          <Pressable onPress={load} style={{ paddingHorizontal: 10, paddingVertical: 6 }}>
            <Text style={{ color: theme.colors.muted }}>Refresh</Text>
          </Pressable>
        </View>

        <View style={{ marginTop: 10 }}>
          {loading ? (
            <Text style={styles.muted}>Loading forecast...</Text>
          ) : err ? (
            <Text style={styles.muted}>Forecast unavailable</Text>
          ) : (
            forecast.map((item) => (
              <ForecastRow key={item.date} item={item} unitSymbol={unitSymbol} />
            ))
          )}
        </View>
      </GlassCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    color: theme.colors.text,
    fontSize: 34,
    fontWeight: "900",
    marginTop: 14,
  },
  subtitle: {
    color: theme.colors.muted,
    marginTop: 6,
  },
  bigTemp: {
    color: theme.colors.text,
    fontSize: 62,
    fontWeight: "900",
    letterSpacing: -1,
  },
  city: {
    color: theme.colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  muted: {
    color: theme.colors.muted,
    marginTop: 4,
  },
  btn: {
    backgroundColor: "white",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    width: 120,
  },
  btnText: {
    fontWeight: "800",
  },
});
