export type TemperatureUnit = "celsius" | "fahrenheit";

export type WeatherData = {
  city: string;
  temperature: number;
  unit: TemperatureUnit;
  windSpeed: number;
  condition: string;
};
