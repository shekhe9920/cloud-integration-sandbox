import type { TemperatureUnit } from "../types/unit";

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
