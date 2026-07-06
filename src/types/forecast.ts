import type { TemperatureUnit } from "../types/unit";

export interface ForecastItem {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
}

export interface ForecastData {
  city: string;
  unit: TemperatureUnit;
  forecast: ForecastItem[];
}
