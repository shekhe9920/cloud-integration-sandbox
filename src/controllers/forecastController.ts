import type { Request, Response } from "express";
import { getCoordinatesForCity } from "../services/weatherService";
import { getForecastByCoordinates } from "../services/forecastService";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";

export async function getForecast(req: Request, res: Response): Promise<void> {
  const city = req.params.city;
  const rawUnit = req.query.unit;

  let unit = parseTemperatureUnits(rawUnit);
  if (unit === null) {
    res.status(400).json({
      error: "Invalid unit. Use celsius or fahrenheit!",
    });
    return;
  }

  const coords = await getCoordinatesForCity(city);
  if (coords === null) {
    res.status(404).json({
      error: "City not found.",
    });
    return;
  }

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
