import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadUnit, saveUnit } from "../lib/storage";

export type WeatherUnit = "metric" | "imperial";

type AppSettingsContextType = {
  unit: WeatherUnit;
  setUnit: (u: WeatherUnit) => void;
};

const AppSettingsContext = createContext<AppSettingsContextType | null>(null);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [unit, setUnitState] = useState<WeatherUnit>("metric");

  useEffect(() => {
    loadUnit().then(setUnitState).catch(() => {});
  }, []);

  const value = useMemo(
    () => ({
      unit,
      setUnit: (u: WeatherUnit) => {
        setUnitState(u);
        saveUnit(u).catch(() => {});
      },
    }),
    [unit]
  );

  return <AppSettingsContext.Provider value={value}>{children}</AppSettingsContext.Provider>;
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error("useAppSettings must be used inside AppSettingsProvider");
  return ctx;
}
