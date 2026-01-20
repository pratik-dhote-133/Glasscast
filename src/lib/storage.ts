import AsyncStorage from "@react-native-async-storage/async-storage";

const UNIT_KEY = "glasscast_unit"; // metric | imperial

export async function saveUnit(unit: "metric" | "imperial") {
  await AsyncStorage.setItem(UNIT_KEY, unit);
}

export async function loadUnit(): Promise<"metric" | "imperial"> {
  const v = await AsyncStorage.getItem(UNIT_KEY);
  if (v === "imperial") return "imperial";
  return "metric";
}
