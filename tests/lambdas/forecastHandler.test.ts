import { describe, it, expect, vi, beforeEach } from "vitest";
import { handler } from "../../src/lambdas/forecastHandler";
import { createMockApiGatewayEvent } from "../helpers/mockApiGatewayEvent";

vi.mock("../../src/services/weatherService", () => ({
  getCoordinatesForCity: vi.fn(),
}));
vi.mock("../../src/services/forecastService", () => ({
  getForecastByCoordinates: vi.fn(),
}));

import { getForecastByCoordinates } from "../../src/services/forecastService";
import { getCoordinatesForCity } from "../../src/services/weatherService";

describe("Test Forecast Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully return forecast data", async () => {
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

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "oslo",
      },
      queryStringParameters: {
        unit: "celsius",
      },
    });

    const res = await handler(mockEvent);

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body).toEqual({
      data: {
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
      },
    });
  });

  it("should return Bad Request if city is missing", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {},
      queryStringParameters: {
        unit: "celsius",
      },
    });

    const res = await handler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "Missing 'city' parameter in the URL",
    });
  });

  it("should return Bad Request if invalid unit is given", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "oslo",
      },
      queryStringParameters: {
        unit: "",
      },
    });

    const res = await handler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(body).toEqual({
      error: "Bad Request",
      message: "Invalid unit. Use celsius or fahrenheit",
    });
  });

  it("should return 404 if city is not found", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue(null);

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "Bob",
      },
      queryStringParameters: {
        unit: "celsius",
      },
    });

    const res = await handler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(404);
    expect(body).toEqual({
      error: "Not Found",
      message: "City not found",
    });
  });

  it("should return 500 if forecast data is null", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getForecastByCoordinates).mockResolvedValue(null);

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "oslo",
      },
      queryStringParameters: {
        unit: "celsius",
      },
    });

    const res = await handler(mockEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(500);
    expect(body).toEqual({
      error: "Internal Server Error",
      message: "Failed to fetch forecast data",
    });
  });

  it("should catch exception when getForecastByCoordinates throws error", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getForecastByCoordinates).mockRejectedValue(
      new Error("Forecast fetch failed!"),
    );

    const mockedEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "oslo",
      },
    });

    const res = await handler(mockedEvent);
    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(500);
    expect(body).toEqual({
      error: "Internal Server Error",
      message: "An unexpected error occurred",
    });
  });
});
