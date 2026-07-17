const weatherApiUrl = process.env.WEATHER_API_URL;

// The forecast service depends on the weather API base URL being configured.
if (!weatherApiUrl) {
  throw new Error("Missing required environment variables");
}

import type { ForecastData, ForecastItem } from "../types/forecast";
import type { TemperatureUnit } from "../types/unit";
import type { OpenMeteoCurrentForecastResponse } from "../types/openMeteo";
import { convertTemperature } from "../utils/convertTemperature";

/**
 * Fetch a 3-day forecast for a coordinate pair using the configured weather API.
 *
 * The base URL comes from WEATHER_API_URL. The response is normalized into the
 * app's ForecastData shape, or null if required data is missing.
 */
export async function getForecastByCoordinates(
  city: string,
  latitude: number,
  longitude: number,
  unit: TemperatureUnit,
): Promise<ForecastData | null> {
  const url =
    weatherApiUrl +
    `?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum` +
    `&forecast_days=3` +
    `&timezone=auto`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OpenMeteoCurrentForecastResponse;
    // Ensure the required daily forecast arrays exist before mapping the response.
    if (
      !data.daily ||
      data.daily.time === undefined ||
      data.daily.temperature_2m_max === undefined ||
      data.daily.temperature_2m_min === undefined
    ) {
      return null;
    }

    const daily = data.daily;

    // Map Open-Meteo daily arrays into the app's forecast item shape.
    const forecastList: ForecastItem[] = daily.time.map(
      (dateStr, index): ForecastItem => {
        return {
          date: dateStr,
          temperatureMax: convertTemperature(
            daily.temperature_2m_max[index],
            unit,
          ),
          temperatureMin: convertTemperature(
            daily.temperature_2m_min[index],
            unit,
          ),
          precipitation: daily.precipitation_sum?.[index] ?? 0,
        };
      },
    );

    return {
      city,
      unit,
      forecast: forecastList,
    };
  } catch (error) {
    console.error("Forecast fetch failed!", error);
    return null;
  }
}
