import type { TemperatureUnit } from "../types/unit";

export interface WeatherData {
  city: string;
  temperature: number;
  unit: TemperatureUnit;
  windSpeed: number;
  condition: string;
}
