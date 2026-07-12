import { describe, it, expect, vi, afterEach } from "vitest";
import {
  getCoordinatesForCity,
  getWeatherByCoordinates,
} from "../../src/services/weatherService";
import { accessSync } from "node:fs";

const fakeGeocodingResponse = {
  results: [
    {
      name: "oslo",
      latitude: 59.91273,
      longitude: 10.74609,
      country: "Norway",
    },
  ],
};

const fakeOpenMeteoWeatherResponse = {
  current: {
    temperature_2m: 20.1,
    wind_speed_10m: 11.9,
    weather_code: 1,
  },
};

function mockFetchOk(data: unknown) {
  const fakeFetchResponse = {
    ok: true,
    json: async () => data,
  };

  const fakeFetch = vi.fn().mockResolvedValue(fakeFetchResponse);
  vi.stubGlobal("fetch", fakeFetch);

  return fakeFetch;
}

function mockFetchNotOk() {
  const fakeFetchResponse = {
    ok: false,
    json: async () => ({}),
  };

  const fakeFetch = vi.fn().mockResolvedValue(fakeFetchResponse);
  vi.stubGlobal("fetch", fakeFetch);
}

function mockFetchThrows() {
  const fakeFetch = vi.fn().mockRejectedValue(new Error("Fetch Failed"));

  vi.stubGlobal("fetch", fakeFetch);
}

describe("getCoordinatesForCity", async () => {
  it("should return coordinated from mocked fetch response", async () => {
    mockFetchOk(fakeGeocodingResponse);

    const res = await getCoordinatesForCity("oslo");

    expect(res).toEqual({
      latitude: 59.91273,
      longitude: 10.74609,
    });
  });

  it("should return null when fetch response is not ok", async () => {
    mockFetchNotOk();

    const res = await getCoordinatesForCity("oslo");

    expect(res).toBe(null);
  });

  it("should return null when API response has no results", async () => {
    mockFetchOk({
      results: [],
    });

    const res = await getCoordinatesForCity("oslo");

    expect(res).toBe(null);
  });

  it("should return null when fetch throws an error", async () => {
    const consoleErrSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockFetchThrows();

    const res = await getCoordinatesForCity("oslo");

    expect(res).toBe(null);
    expect(consoleErrSpy).toHaveBeenCalledWith(
      "Geocoding failed!",
      expect.any(Error),
    );
  });

  it("should call fetch with the correct geocoding URL", async () => {
    const fetchSpy = mockFetchOk(fakeGeocodingResponse);

    await getCoordinatesForCity("oslo");

    const url =
      `https://geocoding-api.open-meteo.com/v1/search` +
      `?name=oslo` +
      `&count=1` +
      `&language=en` +
      `&format=json`;

    expect(fetchSpy).toHaveBeenCalledWith(url);
  });
});

describe("getWeatherByCoordinates", async () => {
  it("should return weather data from mocked fetch response", async () => {});

  it("should convert temperature to fahrenheit when unit is fahrenheit", async () => {});

  it("should return null when fetch response is not ok", async () => {});

  it("should return null when fetch throws an error", async () => {});

  it("should return null when current weather data is missing from the API response", async () => {});

  it("should return null when temperature is missing from the API response", async () => {});

  it("should return null when wind speed is missing from the API response", async () => {});

  it("should return a condition string based on weather code", async () => {});

  it("should return Unknown condition for unknown weather code", async () => {});

  it("should call fetch with the correct Open-Meteo weather URL", async () => {});
});
