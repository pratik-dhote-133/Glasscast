import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { theme } from "../constants/theme";
import type { ForecastDay } from "../services/weather";

type Props = {
  item: ForecastDay;
  unitSymbol: "°C" | "°F";
};

export default function ForecastRow({ item, unitSymbol }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.day}>{item.dayName}</Text>
      <Text style={styles.cond}>{item.condition}</Text>
      <Text style={styles.temp}>
        {item.tempMin}{unitSymbol} / {item.tempMax}{unitSymbol}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },
  day: {
    color: theme.colors.text,
    fontWeight: "800",
    width: 60,
  },
  cond: {
    color: theme.colors.muted,
    flex: 1,
    paddingHorizontal: 10,
  },
  temp: {
    color: theme.colors.text,
    fontWeight: "700",
  },
});
