import { describe, it, expect } from "vitest";
import { parseTemperatureUnits } from "../../src/utils/parseTemperatureUnit";

describe("parseTemperatureUnit", () => {
  it("should default to celsius when unit is undefined", () => {
    const res = parseTemperatureUnits(undefined);

    expect(res).toBe("celsius");
  });

  it("should accept celsius", () => {
    const res = parseTemperatureUnits("celsius");

    expect(res).toBe("celsius");
  });

  it("should accept fahrenheit", () => {
    const res = parseTemperatureUnits("fahrenheit");

    expect(res).toBe("fahrenheit");
  });

  it("should reject invalid unit", () => {
    const res = parseTemperatureUnits("kelvin");

    expect(res).toBe(null);
  });

  it("should reject non-string values", () => {
    expect(parseTemperatureUnits(123)).toBe(null);
    expect(parseTemperatureUnits(true)).toBe(null);
    expect(parseTemperatureUnits(null)).toBe(null);
  });
});
