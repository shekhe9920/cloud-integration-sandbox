import type { ForecastData } from "../types/forecast";

const API_URL = import.meta.env.VITE_BACKEND_URL;
if (!API_URL) {
  throw new Error("Missing VITE_BACKEND_URL");
}

type ForecastApiResponse = {
  data: ForecastData;
};

export async function getCurrentForecast(
  city: string,
): Promise<ForecastData | null> {
  try {
    const unit = "celsius";
    const url = `${API_URL}/forecast/${encodeURIComponent(city)}?unit=${unit}`;

    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const result = (await response.json()) as ForecastApiResponse;

    if (
      !result.data ||
      !Array.isArray(result.data.forecast) ||
      typeof result.data.city !== "string" ||
      (result.data.unit !== "celsius" && result.data.unit !== "fahrenheit")
    ) {
      return null;
    }

    return result.data;
  } catch (error) {
    console.error("Forecast fetch failed!", error);
    return null;
  }
}
