import { describe, it, expect } from "vitest";
import { convertTemperature } from "../../src/utils/convertTemperature";

describe("convertTemperature", () => {
  it("should convert temperature from celsius to kelvin", () => {
    const f = convertTemperature(20, "fahrenheit");

    expect(f).toBe(68);
  });

  it("should return same temperature when unit is celsius", () => {
    const f = convertTemperature(20, "celsius");

    expect(f).toBe(20);
  });

  it("should return 0 if temperature is not given", () => {
    const f = convertTemperature(undefined, "celsius");

    expect(f).toBe(0);
  });

  it("should handle undefined temperature as 32 for fahrenheit", () => {
    const result = convertTemperature(undefined, "fahrenheit");

    expect(result).toBe(32);
  });
});
