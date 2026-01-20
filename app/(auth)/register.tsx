import React, { useState } from "react";
import { Text, TextInput, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { Link, router } from "expo-router";
import ScreenContainer from "../../src/components/ScreenContainer";
import GlassCard from "../../src/components/GlassCard";
import { theme } from "../../src/constants/theme";
import { supabase } from "../../src/lib/supabase";

export default function RegisterScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function onRegister() {
    try {
      setErr(null);
      setMsg(null);
      setLoading(true);

      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      });

      if (error) throw error;

      setMsg("Account created ✅ You can login now.");
      setTimeout(() => router.replace("/(auth)/login"), 800);
    } catch (e: any) {
      setErr(e?.message ?? "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScreenContainer>
      <Text style={styles.title}>Create account</Text>
      <Text style={styles.subtitle}>Join Glasscast today</Text>

      <GlassCard style={{ marginTop: 18 }}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="you@example.com"
          placeholderTextColor="#64748B"
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Min 6 characters"
          placeholderTextColor="#64748B"
          style={styles.input}
        />

        {err ? <Text style={styles.err}>{err}</Text> : null}
        {msg ? <Text style={styles.msg}>{msg}</Text> : null}

        <Pressable onPress={onRegister} style={styles.btn} disabled={loading}>
          {loading ? <ActivityIndicator /> : <Text style={styles.btnText}>Create Account</Text>}
        </Pressable>

        <Text style={styles.muted}>
          Already have an account?{" "}
          <Link href="/(auth)/login" style={styles.link}>
            Login
          </Link>
        </Text>
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
    marginTop: 14,
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
    marginTop: 14,
  },
  link: {
    color: theme.colors.text,
    fontWeight: "900",
  },
  err: {
    color: "#FCA5A5",
    marginTop: 12,
    fontWeight: "700",
  },
  msg: {
    color: "#86EFAC",
    marginTop: 12,
    fontWeight: "800",
  },
});
