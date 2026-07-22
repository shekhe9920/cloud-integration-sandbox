import type { WeatherData } from "../types/weather";

const API_URL = import.meta.env.VITE_BACKEND_URL;
if (!API_URL) {
  throw new Error("Missing VITE_BACKEND_URL");
}

type WeatherApiResponse = {
  data: WeatherData;
};

export async function getCurrentWeather(
  city: string,
): Promise<WeatherData | null> {
  try {
    const unit = "celsius";
    const url = `${API_URL}/weather/${encodeURIComponent(city)}?unit=${unit}`;

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as WeatherApiResponse;

    if (
      !result.data ||
      typeof result.data.city !== "string" ||
      (result.data.unit !== "celsius" && result.data.unit !== "fahrenheit") ||
      typeof result.data.temperature !== "number" ||
      typeof result.data.windSpeed !== "number" ||
      typeof result.data.condition !== "string"
    ) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Weather fetch failed!", error);
    return null;
  }
}
