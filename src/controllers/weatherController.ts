import type { Request, Response } from "express";
import type { TemperatureUnit } from "../types/unit";
import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../services/openMeteoService";

export async function getWeather(req: Request, res: Response): Promise<void> {
  const city = req.params.city;
  const rawUnit = req.query.unit;

  let unit: TemperatureUnit = "celsius";

  if (rawUnit === undefined) {
    unit = "celsius";
  } else if (rawUnit === "celsius" || rawUnit === "fahrenheit") {
    unit = rawUnit;
  } else {
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
