import { supabase } from "../lib/supabase";

export type FavoriteCity = {
  id: string;
  city_name: string;
  created_at: string;
};

export async function addFavoriteCity(cityName: string) {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;

  if (!userId) throw new Error("User not logged in");

  const { error } = await supabase.from("favorite_cities").insert([
    {
      user_id: userId,
      city_name: cityName,
    },
  ]);

  if (error) throw error;
}

export async function getFavoriteCities(): Promise<FavoriteCity[]> {
  const { data: authData } = await supabase.auth.getUser();
  const userId = authData.user?.id;

  if (!userId) return [];

  const { data, error } = await supabase
    .from("favorite_cities")
    .select("id, city_name, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data ?? [];
}

export async function removeFavoriteCity(id: string) {
  const { error } = await supabase.from("favorite_cities").delete().eq("id", id);
  if (error) throw error;
}
