import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../src/app";

vi.mock("../src/services/weatherService", () => ({
  getCoordinatesForCity: vi.fn(),
  getWeatherByCoordinates: vi.fn(),
}));
vi.mock("../src/services/forecastService", () => ({
  getForecastByCoordinates: vi.fn(),
}));

import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../src/services/weatherService";
import { getForecastByCoordinates } from "../src/services/forecastService";

describe("API Route Setup Integration Test", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return welcome message from GET /", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);

    expect(res.text).toBe("Weather API is running!");
  });

  it("GET /health 200 OK", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
  });

  it("GET /weather/oslo should return 200 OK and weather data for oslo", async () => {
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

    const res = await request(app)
      .get("/weather/oslo")
      .set("Accept", "application/json"); // "client tels the server it wants json response"

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      city: "oslo",
      temperature: 18.5,
      unit: "celsius",
      windSpeed: 4.2,
      condition: "Cloudy",
    });
  });

  it("GET /forecast/oslo should return 200 OK and forecast data for oslo", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getForecastByCoordinates).mockResolvedValue({
      city: "oslo",
      unit: "celsius",
      forecast: [
        {
          date: "2026-07-16",
          temperatureMax: 32.9,
          temperatureMin: 23.1,
          precipitation: 0,
        },
        {
          date: "2026-07-17",
          temperatureMax: 29.1,
          temperatureMin: 21.9,
          precipitation: 0,
        },
        {
          date: "2026-07-18",
          temperatureMax: 22.5,
          temperatureMin: 13,
          precipitation: 20.35,
        },
      ],
    });

    const res = await request(app)
      .get("/forecast/oslo")
      .set("Accept", "application/json");

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      city: "oslo",
      unit: "celsius",
      forecast: [
        {
          date: "2026-07-16",
          temperatureMax: 32.9,
          temperatureMin: 23.1,
          precipitation: 0,
        },
        {
          date: "2026-07-17",
          temperatureMax: 29.1,
          temperatureMin: 21.9,
          precipitation: 0,
        },
        {
          date: "2026-07-18",
          temperatureMax: 22.5,
          temperatureMin: 13,
          precipitation: 20.35,
        },
      ],
    });
  });

  it("should return 400 error for invalid temperature unit request query", async () => {
    const res = await request(app).get("/weather/oslo?unit=kelvin");

    expect(res.status).toBe(400);

    expect(res.text).toContain("Invalid unit. Use celsius or fahrenheit!");
  });

  it("GET /forecast/oslo?unit=kelvin should return 400 for invalid temperature unit", async () => {
    const res = await request(app).get("/forecast/oslo?unit=kelvin");

    expect(res.status).toBe(400);

    expect(res.text).toContain("Invalid unit. Use celsius or fahrenheit!");
  });
});
