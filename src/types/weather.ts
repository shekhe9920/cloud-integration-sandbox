import type { TemperatureUnit } from "../types/unit";

/**
 * Normalized current-weather response returned by this app.
 */
export interface WeatherData {
  city: string;
  temperature: number;
  unit: TemperatureUnit;
  windSpeed: number;
  condition: string;
}
