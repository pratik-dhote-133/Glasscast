import { Platform } from "react-native";
import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SUPABASE_URL = "https://cipdjigqlqwxmkjmednn.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_0riqArCwxGIoj1A1GGnkQg_oyfDHBCH";

const storage =
  Platform.OS === "web"
    ? {
        getItem: (key: string) => {
          if (typeof window === "undefined") return null;
          return Promise.resolve(window.localStorage.getItem(key));
        },
        setItem: (key: string, value: string) => {
          if (typeof window === "undefined") return Promise.resolve();
          window.localStorage.setItem(key, value);
          return Promise.resolve();
        },
        removeItem: (key: string) => {
          if (typeof window === "undefined") return Promise.resolve();
          window.localStorage.removeItem(key);
          return Promise.resolve();
        },
      }
    : AsyncStorage;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
