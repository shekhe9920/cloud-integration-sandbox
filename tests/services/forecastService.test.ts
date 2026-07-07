import { describe, it, expect, vi, afterEach } from "vitest";
import { getForecastByCoordinates } from "../../src/services/forecastService";
import { error } from "node:console";

const fakeOpenMeteoResponse = {
  daily: {
    time: ["2026-07-07", "2026-07-08", "2026-07-09"],
    temperature_2m_max: [20.1, 26.7, 24.7],
    temperature_2m_min: [11.9, 12.8, 14.6],
    precipitation_sum: [0, 0, 2.5],
  },
};

function mockFetchOk(data: unknown = fakeOpenMeteoResponse) {
  const fakeFetchResponse = {
    ok: true,
    json: async () => data,
  };

  const fakeFetch = vi.fn().mockResolvedValue(fakeFetchResponse);

  vi.stubGlobal("fetch", fakeFetch);
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
  const fakeFetch = vi.fn().mockRejectedValue(new Error("Fetch failed"));

  vi.stubGlobal("fetch", fakeFetch);
}

describe("getForecastByCoordinates", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should return forecast data from mocked fetch response", async () => {
    mockFetchOk();

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toEqual({
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
          precipitation: 2.5,
        },
      ],
    });
  });

  it("should convert forecast temperatures to fahrenheit when unit is fahrenheit", async () => {
    mockFetchOk();

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "fahrenheit",
    );

    expect(res?.unit).toBe("fahrenheit");
    expect(res).toEqual({
      city: "oslo",
      unit: "fahrenheit",
      forecast: [
        {
          date: "2026-07-07",
          temperatureMax: 68.18,
          temperatureMin: 53.42,
          precipitation: 0,
        },
        {
          date: "2026-07-08",
          temperatureMax: 80.06,
          temperatureMin: 55.04,
          precipitation: 0,
        },
        {
          date: "2026-07-09",
          temperatureMax: 76.46,
          temperatureMin: 58.28,
          precipitation: 2.5,
        },
      ],
    });
  });

  it("should return null when fetch response is not ok", async () => {
    mockFetchNotOk();

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toBe(null);
  });

  it("should return null when daily data is missing from the API response", async () => {
    mockFetchOk({});

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toBe(null);
  });

  it("should return null when daily time is missing from the API response", async () => {
    const data = {
      daily: {
        temperature_2m_max: [20.1, 26.7, 24.7],
        temperature_2m_min: [11.9, 12.8, 14.6],
        precipitation_sum: [0, 0, 2.5],
      },
    };

    mockFetchOk(data);

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toBe(null);
  });

  it("should return null when daily max temperature is missing from the API response", async () => {
    const data = {
      daily: {
        time: ["2026-07-07", "2026-07-08", "2026-07-09"],
        temperature_2m_min: [11.9, 12.8, 14.6],
        precipitation_sum: [0, 0, 2.5],
      },
    };

    mockFetchOk(data);

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toBe(null);
  });

  it("should return null when daily min temperature is missing from the API response", async () => {
    const data = {
      daily: {
        time: ["2026-07-07", "2026-07-08", "2026-07-09"],
        temperature_2m_max: [20.1, 26.7, 24.7],
        precipitation_sum: [0, 0, 2.5],
      },
    };

    mockFetchOk(data);

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toBe(null);
  });

  it("should use 0 as precipitation when precipitation_sum is missing", async () => {
    const data = {
      daily: {
        time: ["2026-07-07", "2026-07-08", "2026-07-09"],
        temperature_2m_max: [20.1, 26.7, 24.7],
        temperature_2m_min: [11.9, 12.8, 14.6],
      },
    };

    mockFetchOk(data);

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toEqual({
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
  });

  it("should return null when fetch throws an error", async () => {
    const consoleErrSpy = vi
      .spyOn(console, "error")
      .mockImplementation(() => {});

    mockFetchThrows();

    const res = await getForecastByCoordinates(
      "oslo",
      59.91273,
      10.74609,
      "celsius",
    );

    expect(res).toBe(null);
    expect(consoleErrSpy).toHaveBeenCalledWith(
      "Forecast fetch failed!",
      expect.any(Error),
    );
  });
});
