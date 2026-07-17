import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      WEATHER_API_URL: "https://mock-weather.local",
      GEOCODING_API_URL: "https://mock-geo.local",
    },
  },
});
