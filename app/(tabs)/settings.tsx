import React from "react";
import { View, Text, Pressable, StyleSheet, Switch, Alert } from "react-native";
import { router } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import GlassCard from "../../src/components/GlassCard";
import { theme } from "../../src/constants/theme";
import { useAppSettings } from "../../src/hooks/useAppSettings";
import { supabase } from "../../src/lib/supabase";

export default function SettingsScreen() {
  const { unit, setUnit } = useAppSettings();
  const isCelsius = unit === "metric";

  async function onSignOut() {
    try {
      await supabase.auth.signOut();
      router.replace("/(auth)/login");
    } catch (e: any) {
      Alert.alert("Error", e?.message ?? "Failed to sign out");
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Customize your experience</Text>

      <GlassCard style={{ marginTop: 18 }}>
        <View style={styles.row}>
          <View>
            <Text style={styles.rowTitle}>Temperature Unit</Text>
            <Text style={styles.rowSub}>{isCelsius ? "Celsius (°C)" : "Fahrenheit (°F)"}</Text>
          </View>

          <Switch
            value={isCelsius}
            onValueChange={(v) => setUnit(v ? "metric" : "imperial")}
          />
        </View>
      </GlassCard>

      <GlassCard style={{ marginTop: 16 }}>
        <Pressable onPress={onSignOut} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </Pressable>
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowTitle: {
    color: theme.colors.text,
    fontWeight: "900",
    fontSize: 16,
  },
  rowSub: {
    color: theme.colors.muted,
    marginTop: 4,
  },
  logoutBtn: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
  },
  logoutText: {
    fontWeight: "900",
  },
});
