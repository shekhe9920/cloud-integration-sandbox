import { describe, it, expect, vi, beforeEach } from "vitest";
import { handler } from "../../src/lambdas/weatherHandler";
import { createMockApiGatewayEvent } from "../helpers/mockApiGatewayEvent";

vi.mock("../../src/services/weatherService", () => ({
  getCoordinatesForCity: vi.fn(),
  getWeatherByCoordinates: vi.fn(),
}));

import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../../src/services/weatherService";

describe("Test Weather Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should successfully return weather data", async () => {
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
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "oslo",
      },
      queryStringParameters: {
        unit: "celsius",
      },
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(bodyObject).toEqual({
      data: {
        city: "oslo",
        temperature: 18.5,
        unit: "celsius",
        windSpeed: 4.2,
        condition: "Cloudy",
      },
    });
  });

  it("should return Bad Request if city is null", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {},
      queryStringParameters: {
        unit: "celsius",
      },
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(bodyObject).toEqual({
      error: "Bad Request",
      message: "Missing 'city' parameter in the URL",
    });
  });

  it("should return Bad Request if unit is null", async () => {
    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "oslo",
      },
      queryStringParameters: {
        unit: "",
      },
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(400);
    expect(bodyObject).toEqual({
      error: "Bad Request",
      message: "Invalid unit. Use celsius or fahrenheit",
    });
  });

  it("should return 404 if city is not found", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue(null);

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "venus",
      },
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(404);
    expect(bodyObject).toEqual({
      error: "Not Found",
      message: "City not found",
    });
  });

  it("should return Internal Server Error if it fails to fetch weather data", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getWeatherByCoordinates).mockResolvedValue(null);

    const mockEvent = createMockApiGatewayEvent({
      pathParameters: {
        city: "oslo",
      },
      queryStringParameters: {
        unit: "celsius",
      },
    });

    const res = await handler(mockEvent);

    const bodyObject = JSON.parse(res.body);

    expect(res.statusCode).toBe(500);
    expect(bodyObject).toEqual({
      error: "Internal Server Error",
      message: "Failed to fetch weather data",
    });
  });

  it("should catch exception when getWeatherByCoordinates throws error", async () => {
    vi.mocked(getCoordinatesForCity).mockResolvedValue({
      latitude: 59.91273,
      longitude: 10.74609,
    });

    vi.mocked(getWeatherByCoordinates).mockRejectedValue(
      new Error("Weather API failed"),
    );

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
      message: "An unexpected error occurred",
    });
  });
});
