import type { ForecastData, ForecastItem } from "../types/forecast";
import type { TemperatureUnit } from "../types/unit";
import type { OpenMeteoCurrentForecastResponse } from "../types/openMeteo";
import { convertTemperature } from "../utils/convertTemperature";

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
    if (
      !data.daily ||
      data.daily.time === undefined ||
      data.daily.temperature_2m_max === undefined ||
      data.daily.temperature_2m_min === undefined
    ) {
      return null;
    }

    const daily = data.daily;

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
