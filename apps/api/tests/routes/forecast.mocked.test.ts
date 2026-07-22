import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

vi.mock("../../src/services/forecastService", () => ({
  getForecastByCoordinates: vi.fn(),
}));

vi.mock("../../src/services/weatherService", () => ({
  getCoordinatesForCity: vi.fn(),
  getWeatherByCoordinates: vi.fn(),
}));

import app from "../../src/app";

import { getForecastByCoordinates } from "../../src/services/forecastService";
import { getCoordinatesForCity } from "../../src/services/weatherService";

describe("GET /forecast/:city with mocked service", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should return forecast data without calling the real Open-Meteo API", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getForecastByCoordinates).mockResolvedValue({
      city: "oslo",
      unit: "celsius",
      forecast: [
        {
          date: "2026-07-07",
          temperatureMax: 20.1,
          temperatureMin: 11.9,
          precipitation: 0,
        },
        {
          date: "2026-07-08",
          temperatureMax: 26.7,
          temperatureMin: 12.8,
          precipitation: 0,
        },
        {
          date: "2026-07-09",
          temperatureMax: 24.7,
          temperatureMin: 14.6,
          precipitation: 0,
        },
      ],
    });

    const res = await request(app).get("/forecast/oslo");

    expect(res.status).toBe(200);

    expect(res.body).toEqual({
      city: "oslo",
      unit: "celsius",
      forecast: [
        {
          date: "2026-07-07",
          temperatureMax: 20.1,
          temperatureMin: 11.9,
          precipitation: 0,
        },
        {
          date: "2026-07-08",
          temperatureMax: 26.7,
          temperatureMin: 12.8,
          precipitation: 0,
        },
        {
          date: "2026-07-09",
          temperatureMax: 24.7,
          temperatureMin: 14.6,
          precipitation: 0,
        },
      ],
    });

    expect(getCoordinatesForCity).toHaveBeenCalledWith("oslo");

    expect(getForecastByCoordinates).toHaveBeenCalledWith(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );
  });

  it("should return 400 for invalid temperature unit", async () => {
    const res = await request(app).get("/forecast/oslo?unit=kelvin");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Invalid unit. Use celsius or fahrenheit!");
    expect(getCoordinatesForCity).not.toHaveBeenCalled();
    expect(getForecastByCoordinates).not.toHaveBeenCalled();
  });

  it("should return 404 if the city is not found", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue(null);

    const res = await request(app).get("/forecast/kardemomme_by");

    expect(res.status).toBe(404);
    expect(res.body.error).toBe("City not found");
    expect(getCoordinatesForCity).toHaveBeenCalledWith("kardemomme_by");
    expect(getForecastByCoordinates).not.toHaveBeenCalled();
  });

  it("should return 500 if forecast service fails", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getForecastByCoordinates).mockResolvedValue(null);

    const res = await request(app).get("/forecast/oslo");

    expect(res.status).toBe(500);
    expect(res.body.error).toBe("Failed to fetch forecast data");

    expect(getCoordinatesForCity).toHaveBeenCalledWith("oslo");
    expect(getForecastByCoordinates).toHaveBeenCalledWith(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );
  });
});
