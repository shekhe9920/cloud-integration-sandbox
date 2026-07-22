import type { ForecastData } from "../../types/forecast";
import type { WeatherData } from "../../types/weather";

const jsonHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};
/**
 * Build a JSON error response for Lambda handlers.
 */
export function errorResponse(statusCode: number, errMsg: string, msg: string) {
  return {
    statusCode: statusCode,
    headers: jsonHeaders,
    body: JSON.stringify({
      error: errMsg,
      message: msg,
    }),
  };
}

/**
 * Build a JSON success response for weather or forecast data.
 */
export function successResponse(data: ForecastData | WeatherData) {
  return {
    statusCode: 200,
    headers: jsonHeaders,
    body: JSON.stringify({
      data,
    }),
  };
}
