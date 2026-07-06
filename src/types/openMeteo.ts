export interface OpenMeteoCurrentWeatherResponse {
  current?: {
    temperature_2m: number;
    wind_speed_10m: number;
    weather_code: number;
  };
}

export interface OpenMeteoCurrentForecastResponse {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum?: number[];
  };
}
