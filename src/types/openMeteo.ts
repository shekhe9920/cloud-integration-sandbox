/**
 * Subset of the Open-Meteo current weather response used by the app.
 */
export interface OpenMeteoCurrentWeatherResponse {
  current?: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

/**
 * Subset of the Open-Meteo daily forecast response used by the app.
 */
export interface OpenMeteoCurrentForecastResponse {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum?: number[];
  };
}
