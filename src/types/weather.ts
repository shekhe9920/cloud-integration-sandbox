export type TemperatureUnit = "celsius" | "fahrenheit";

export interface WeatherData {
  city: string;
  temperature: number;
  unit: TemperatureUnit;
  windSpeed: number;
  condition: string;
}
