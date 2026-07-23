import type { TemperatureUnit } from "./unit";

export type WeatherData = {
  city: string;
  temperature: number;
  unit: TemperatureUnit;
  windSpeed: number;
  condition: string;
};
