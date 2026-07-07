import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/services/weatherService", () => ({
  getCoordinatesForCity: vi.fn(),
  getWeatherByCoordinates: vi.fn(),
}));

import app from "../../src/app";

import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../../src/services/weatherService";

describe("GET /weather/:city with mocked service", () => {
  // To reset all mock for each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return weather data without calling the real Open-Meteo API", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getWeatherByCoordinates).mockResolvedValue({
      city: "oslo",
      temperature: 18.5,
      unit: "celsius",
      windSpeed: 4.2,
      condition: "Cloudy",
    });

    const res = await request(app).get("/weather/oslo");
    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      city: "oslo",
      temperature: 18.5,
      unit: "celsius",
      windSpeed: 4.2,
      condition: "Cloudy",
    });

    expect(getCoordinatesForCity).toHaveBeenCalledWith("oslo");

    expect(getWeatherByCoordinates).toHaveBeenCalledWith(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );
  });

  it("should return 404 if the city is not found", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue(null);

    const res = await request(app).get("/weather/kardemomme_by");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("City not found");

    expect(getCoordinatesForCity).toHaveBeenCalledWith("kardemomme_by");
    expect(getWeatherByCoordinates).not.toHaveBeenCalled();
  });

  it("should return 500 for failed weather fetch attempt", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });
    vi.mocked(getWeatherByCoordinates).mockResolvedValue(null);

    const weatherData = await request(app).get("/weather/oslo");

    expect(weatherData.status).toBe(500);
    expect(weatherData.body.error).toBe("Failed to fetch weather data");

    expect(getWeatherByCoordinates).toHaveBeenCalledWith(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );
  });
});
