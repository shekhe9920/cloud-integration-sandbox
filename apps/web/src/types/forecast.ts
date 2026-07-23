import type { TemperatureUnit } from "./unit";

export type ForecastItem = {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
};

export type ForecastData = {
  city: string;
  unit: TemperatureUnit;
  forecast: ForecastItem[];
};
