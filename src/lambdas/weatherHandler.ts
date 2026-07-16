import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../services/weatherService";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";
import { errorResponse, successResponse } from "./utils/httpResponses";

/**
 * AWS Lambda handler for the weather endpoint.
 *
 * Expected API Gateway route:
 * GET /weather/{city}?unit=celsius|fahrenheit
 */
export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // The city comes from the API Gateway path parameter: /weather/{city}.
  const city = event.pathParameters?.city;
  if (!city) {
    return errorResponse(
      400,
      "Bad Request",
      "Missing 'city' parameter in the URL",
    );
  }

  // The unit query parameter is optional. If it is missing, celsius is used.
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
    // Resolve the city name into coordinates before calling the weather API.
    const coords = await getCoordinatesForCity(city);
    if (coords === null) {
      return errorResponse(404, "Not Found", "City not found");
    }

    // Fetch the normalized weather data used by both Lambda and app tests.
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
