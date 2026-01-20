import React from "react";
import { View, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { theme } from "../constants/theme";

type Props = {
  children: React.ReactNode;
};

export default function ScreenContainer({ children }: Props) {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={[theme.colors.bg, theme.colors.bg2]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
});
