import type { TemperatureUnit } from "../types/unit";

/**
 * Convert a Celsius temperature to the requested unit.
 *
 * Open-Meteo returns Celsius by default, so celsius values are returned unchanged.
 */
export function convertTemperature(
  temp: number | undefined,
  unit: TemperatureUnit,
): number {
  const safeTemp = temp ?? 0;

  if (unit === "fahrenheit") {
    return (safeTemp * 9) / 5 + 32;
  }

  return safeTemp;
}
