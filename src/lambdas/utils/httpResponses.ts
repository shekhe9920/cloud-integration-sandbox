import type { ForecastData } from "../../types/forecast";
import type { WeatherData } from "../../types/weather";

export function errorResponse(statusCode: number, errMsg: string, msg: string) {
  return {
    statusCode: statusCode,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      error: errMsg,
      message: msg,
    }),
  };
}

export function successResponse(data: ForecastData | WeatherData) {
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      data,
    }),
  };
}
