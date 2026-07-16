import type { ForecastData, ForecastItem } from "../types/forecast";
import type { TemperatureUnit } from "../types/unit";
import type { OpenMeteoCurrentForecastResponse } from "../types/openMeteo";
import { convertTemperature } from "../utils/convertTemperature";

/**
 * Fetch a 3-day forecast for a coordinate pair from Open-Meteo.
 *
 * Returns normalized ForecastData for the app, or null if the API response is unusable.
 */
export async function getForecastByCoordinates(
  city: string,
  latitude: number,
  longitude: number,
  unit: TemperatureUnit,
): Promise<ForecastData | null> {
  const url =
    `https://api.open-meteo.com/v1/forecast` +
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
