import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { BlurView } from "expo-blur";
import { theme } from "../constants/theme";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export default function GlassCard({ children, style }: Props) {
  return (
    <View style={[styles.wrapper, style]}>
      <BlurView intensity={35} tint="dark" style={styles.blur}>
        <View style={styles.inner}>{children}</View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: theme.radius.xl,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.card,
  },
  blur: {
    borderRadius: theme.radius.xl,
  },
  inner: {
    padding: 18,
  },
});
