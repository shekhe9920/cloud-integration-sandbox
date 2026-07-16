import type { Request, Response } from "express";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";

import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../services/weatherService";

type CityParams = {
  city: string;
};

/**
 * Express controller for the weather endpoint.
 *
 * Expected route:
 * GET /weather/:city?unit=celsius|fahrenheit
 */
export async function getWeather(
  req: Request<CityParams>,
  res: Response,
): Promise<void> {
  // Read the city from the route parameter and the optional unit from the query string.
  const city = req.params.city;
  const rawUnit = req.query.unit;

  let unit = parseTemperatureUnits(rawUnit);
  if (unit === null) {
    res.status(400).json({
      error: "Invalid unit. Use celsius or fahrenheit!",
    });
    return;
  }

  // Resolve the city name into coordinates before calling the weather service.
  const coords = await getCoordinatesForCity(city);
  if (coords === null) {
    res.status(404).json({
      error: "City not found",
    });
    return;
  }

  // Fetch current weather data in the requested temperature unit.
  const weatherData = await getWeatherByCoordinates(
    city,
    coords.latitude,
    coords.longitude,
    unit,
  );

  if (weatherData === null) {
    res.status(500).json({
      error: "Failed to fetch weather data",
    });
    return;
  }

  res.json(weatherData);
}
