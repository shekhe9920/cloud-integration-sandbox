import type { WeatherData } from "../types/weather";
import type { TemperatureUnit } from "../types/unit";
import type { OpenMeteoCurrentWeatherResponse } from "../types/openMeteo";

export async function getCoordinatesForCity(
  city: string,
): Promise<{ latitude: number; longitude: number } | null> {
  const encodedCity = encodeURIComponent(city);

  const url =
    `https://geocoding-api.open-meteo.com/v1/search` +
    `?name=${encodedCity}` +
    `&count=1` +
    `&language=en` +
    `&format=json`;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;

    const data = await response.json();

    if (!data.results || data.results.length === 0) return null;

    // console.log(`${data.results[0].latitude}, ${data.results[0].longitude}`);
    return {
      latitude: data.results[0].latitude,
      longitude: data.results[0].longitude,
    };
  } catch (error) {
    console.error("Geocoding failed!", error);
    return null;
  }
}

export async function getWeatherByCoordinates(
  city: string,
  latitude: number,
  longitude: number,
  unit: TemperatureUnit,
): Promise<WeatherData | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,wind_speed_10m,weather_code` +
    `&timezone=auto`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OpenMeteoCurrentWeatherResponse;

    if (
      !data.current ||
      data.current.temperature_2m === undefined ||
      data.current.wind_speed_10m === undefined ||
      data.current.weather_code === undefined
    ) {
      return null;
    }

    let temperature = data.current.temperature_2m;

    if (unit === "fahrenheit") {
      temperature = (temperature * 9) / 5 + 32;
    }

    return {
      city,
      temperature: Math.round(temperature * 10) / 10,
      unit,
      windSpeed: data.current.wind_speed_10m,
      condition: mapWeatherCodeToCondition(data.current.weather_code),
    };
  } catch (error) {
    console.error("Weather fetch failed!", error);
    return null;
  }
}

function mapWeatherCodeToCondition(weatherCode: number): string {
  if (weatherCode === 0) {
    return "Clear";
  }

  if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) {
    return "Cloudy";
  }

  if (weatherCode >= 45 && weatherCode <= 48) {
    return "Fog";
  }

  if (weatherCode >= 51 && weatherCode <= 67) {
    return "Rain";
  }

  if (weatherCode >= 71 && weatherCode <= 77) {
    return "Snow";
  }

  if (weatherCode >= 80 && weatherCode <= 82) {
    return "Rain showers";
  }

  if (weatherCode >= 95) {
    return "Thunderstorm";
  }

  return "Unknown";
}
