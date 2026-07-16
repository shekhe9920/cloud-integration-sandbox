import type { Request, Response } from "express";
import { getCoordinatesForCity } from "../services/weatherService";
import { getForecastByCoordinates } from "../services/forecastService";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";

type CityParams = {
  city: string;
};

/**
 * Express controller for the forecast endpoint.
 *
 * Expected route:
 * GET /forecast/:city?unit=celsius|fahrenheit
 */
export async function getForecast(
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

  // Resolve the city name into coordinates before calling the forecast service.
  const coords = await getCoordinatesForCity(city);
  if (coords === null) {
    res.status(404).json({
      error: "City not found",
    });
    return;
  }

  // Fetch forecast data in the requested temperature unit.
  const forecastData = await getForecastByCoordinates(
    city,
    coords.latitude,
    coords.longitude,
    unit,
  );

  if (forecastData === null) {
    res.status(500).json({
      error: "Failed to fetch forecast data",
    });

    return;
  }

  res.json(forecastData);
}
