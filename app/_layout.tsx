import "react-native-url-polyfill/auto";
import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppSettingsProvider } from "../src/hooks/useAppSettings";

export default function RootLayout() {
  return (
    <AppSettingsProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }} />
    </AppSettingsProvider>
  );
}
