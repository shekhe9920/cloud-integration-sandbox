import type { TemperatureUnit } from "../types/unit";

/**
 * Parse and validate the optional temperature unit query parameter.
 *
 * Defaults to celsius when no unit is provided.
 */
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
