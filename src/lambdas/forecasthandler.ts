import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";
import { getCoordinatesForCity } from "../services/weatherService";
import { getForecastByCoordinates } from "../services/forecastService";
import { error } from "node:console";

export async function handler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const city = event.pathParameters?.city;
  if (!city) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Missing 'city' parameter in the URL",
      }),
    };
  }

  const rawUnit = event.queryStringParameters?.unit;
  let unit = parseTemperatureUnits(rawUnit);
  if (unit === null) {
    return {
      statusCode: 400,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Bad Request",
        message: "Invalid unit. Use celsius or fahrenheit",
      }),
    };
  }

  try {
    const coords = await getCoordinatesForCity(city);
    if (coords === null) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Bad Request",
          message: "City not found",
        }),
      };
    }

    const forecastData = await getForecastByCoordinates(
      city,
      coords.latitude,
      coords.longitude,
      unit,
    );
    if (forecastData === null) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to fetch forecast data",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        forecastData,
      }),
    };
  } catch (error) {
    console.error("Forecast Lambda failed: ", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal Server Error",
        message: "An unexpected error occurred",
      }),
    };
  }
}
