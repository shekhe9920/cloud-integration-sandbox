import type { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../services/weatherService";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";
//n
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
    if (!coords) {
      return {
        statusCode: 404,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Not Found",
          message: `Could not find coordinates for city: ${city}`,
        }),
      };
    }

    const weatherData = await getWeatherByCoordinates(
      city,
      coords.latitude,
      coords.longitude,
      unit,
    );

    if (weatherData === null) {
      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Internal Server Error",
          message: "Failed to fetch weather data",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        weatherData,
      }),
    };
  } catch (error) {
    console.error("Weather Lambda failed: ", error);

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
