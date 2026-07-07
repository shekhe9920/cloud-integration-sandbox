import type { Request, Response } from "express";
import { parseTemperatureUnits } from "../utils/parseTemperatureUnit";

import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../services/weatherService";

export async function getWeather(req: Request, res: Response): Promise<void> {
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
      error: "City not found",
    });
    return;
  }

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
