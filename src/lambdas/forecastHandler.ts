import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";
import { getCoordinatesForCity } from "../services/weatherService";
import { getForecastByCoordinates } from "../services/forecastService";
import { errorResponse, successResponse } from "./utils/httpResponses";

/**
 * AWS Lambda handler for the forecast endpoint.
 *
 * Expected API Gateway route:
 * GET /forecast/{city}?unit=celsius|fahrenheit
 */
export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  // The city comes from the API Gateway path parameter: /forecast/{city}.
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
    // Resolve the city name into coordinates before calling the forecast API.
    const coords = await getCoordinatesForCity(city);
    if (coords === null) {
      return errorResponse(404, "Not Found", "City not found");
    }

    // Fetch the normalized forecast data used by both Lambda and app tests.
    const forecastData = await getForecastByCoordinates(
      city,
      coords.latitude,
      coords.longitude,
      unit,
    );
    if (forecastData === null) {
      return errorResponse(
        500,
        "Internal Server Error",
        "Failed to fetch forecast data",
      );
    }

    return successResponse(forecastData);
  } catch (error) {
    console.error("Forecast Lambda failed: ", error);

    return errorResponse(
      500,
      "Internal Server Error",
      "An unexpected error occurred",
    );
  }
}
