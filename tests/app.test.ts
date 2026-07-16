import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app";

describe("API Route Setup Integration Test", () => {
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
    const res = await request(app)
      .get("/weather/oslo")
      .set("Accept", "application/json"); // "client tels the server it wants json response"

    expect(res.status).toBe(200);

    expect(res.body.city).toBe("oslo");
    expect(res.body.temperature).toBeTypeOf("number");
    expect(res.body.unit).toBe("celsius");
    expect(res.body.windSpeed).toBeTypeOf("number");
    expect(res.body.condition).toBeTypeOf("string");
  });

  it("GET /forecast/oslo should return 200 OK and forecast data for oslo", async () => {
    const res = await request(app)
      .get("/forecast/oslo")
      .set("Accept", "application/json");

    console.log("Feilmelding fra server:", res.body);
    expect(res.status).toBe(200);

    expect(res.body.city).toBe("oslo");

    expect(res.body.unit).toBe("celsius");

    expect(Array.isArray(res.body.forecast)).toBe(true);
    expect(res.body.forecast).toHaveLength(3);

    const firsDay = res.body.forecast[0];

    expect(firsDay.date).toBeTypeOf("string");
    expect(firsDay.temperatureMax).toBeTypeOf("number");
    expect(firsDay.temperatureMin).toBeTypeOf("number");
    expect(firsDay.precipitation).toBeTypeOf("number");
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
