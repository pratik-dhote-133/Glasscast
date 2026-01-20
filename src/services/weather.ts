import axios from "axios";

const BASE_URL = "https://api.openweathermap.org/data/2.5";

export type WeatherUnit = "metric" | "imperial";

export type CurrentWeather = {
  city: string;
  temp: number;
  condition: string;
  icon: string;
  high: number;
  low: number;
};

export type ForecastDay = {
  date: string;
  dayName: string;
  tempMin: number;
  tempMax: number;
  condition: string;
  icon: string;
};

function round(n: number) {
  return Math.round(n);
}

export async function fetchCurrentWeatherByCity(
  city: string,
  apiKey: string,
  unit: WeatherUnit
): Promise<CurrentWeather> {
  const res = await axios.get(`${BASE_URL}/weather`, {
    params: { q: city, appid: apiKey, units: unit },
  });

  const d = res.data;

  return {
    city: d.name,
    temp: round(d.main.temp),
    condition: d.weather?.[0]?.main ?? "Unknown",
    icon: d.weather?.[0]?.icon ?? "01d",
    high: round(d.main.temp_max),
    low: round(d.main.temp_min),
  };
}

export async function fetch5DayForecastByCity(
  city: string,
  apiKey: string,
  unit: WeatherUnit
): Promise<ForecastDay[]> {
  const res = await axios.get(`${BASE_URL}/forecast`, {
    params: { q: city, appid: apiKey, units: unit },
  });

  const list = res.data?.list ?? [];

  // Group forecast items by date
  const daysMap = new Map<string, any[]>();

  for (const item of list) {
    const date = item.dt_txt.split(" ")[0];
    if (!daysMap.has(date)) daysMap.set(date, []);
    daysMap.get(date)!.push(item);
  }

  const days = Array.from(daysMap.entries())
    .slice(0, 5)
    .map(([date, items]) => {
      const noonItem =
        items.find((x) => x.dt_txt.includes("12:00:00")) ??
        items[Math.floor(items.length / 2)];

      const mins = items.map((x) => x.main.temp_min);
      const maxs = items.map((x) => x.main.temp_max);

      const dt = new Date(date);
      const dayName = dt.toLocaleDateString(undefined, { weekday: "short" });

      return {
        date,
        dayName,
        tempMin: round(Math.min(...mins)),
        tempMax: round(Math.max(...maxs)),
        condition: noonItem.weather?.[0]?.main ?? "Unknown",
        icon: noonItem.weather?.[0]?.icon ?? "01d",
      };
    });

  return days;
}
