import type { TemperatureUnit } from "../types/unit";

export function parseTemperatureUnits(
  rawUnit: unknown,
): TemperatureUnit | null {
  if (rawUnit === undefined) {
    return "celsius";
  } else if (rawUnit === "celsius" || rawUnit === "fahrenheit") {
    return rawUnit;
  } else {
    return null;
  }
}
