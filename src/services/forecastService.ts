import type { ForecastData, ForecastItem } from "../types/forecast";
import type { TemperatureUnit } from "../types/unit";
import type { OpenMeteoCurrentForecastResponse } from "../types/openMeteo";

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

    let temperature_max = data.daily.temperature_2m_max;
    let temperature_min = data.daily.temperature_2m_min;

    if (unit === "fahrenheit") {
      for (let i = 0; i < temperature_max.length; i++) {
        temperature_max[i] = (temperature_max[i] * 9) / 5 + 32;
        temperature_min[i] = (temperature_min[i] * 9) / 5 + 32;
      }
    }

    const forecastList: ForecastItem[] = data.daily.time.map(
      (dateStr, index) => {
        return {
          date: dateStr,
          temperatureMax: temperature_max[index],
          temperatureMin: temperature_min[index],
          precipitation: data.daily!.precipitation_sum
            ? data.daily!.precipitation_sum[index]
            : 0,
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
