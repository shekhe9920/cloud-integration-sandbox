import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../services/weatherService";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";
import { errorResponse, successResponse } from "./utils/httpResponses";

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const city = event.pathParameters?.city;
  if (!city) {
    return errorResponse(
      400,
      "Bad Request",
      "Missing 'city' parameter in the URL",
    );
  }

  const rawUnit = event.queryStringParameters?.unit;
  const unit = parseTemperatureUnits(rawUnit);
  if (unit === null) {
    return errorResponse(
      400,
      "Bad Request",
      "Invalid unit. Use celsius or fahrenheit",
    );
  }

  try {
    const coords = await getCoordinatesForCity(city);
    if (coords === null) {
      return errorResponse(404, "Not Found", "City not found");
    }

    const weatherData = await getWeatherByCoordinates(
      city,
      coords.latitude,
      coords.longitude,
      unit,
    );

    if (weatherData === null) {
      return errorResponse(
        500,
        "Internal Server Error",
        "Failed to fetch weather data",
      );
    }

    return successResponse(weatherData);
  } catch (error) {
    console.error("Weather Lambda failed: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
