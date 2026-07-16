import type { TemperatureUnit } from "../types/unit";

/**
 * One normalized forecast item for a single date.
 */
export interface ForecastItem {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
}

/**
 * Normalized multi-day forecast response returned by this app.
 */
export interface ForecastData {
  city: string;
  unit: TemperatureUnit;
  forecast: ForecastItem[];
}
