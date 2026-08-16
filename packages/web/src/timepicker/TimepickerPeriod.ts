/**
 * Represents the 12‑hour clock period.
 *
 * `"am"` indicates the time range from midnight to noon.
 * `"pm"` indicates the time range from noon to midnight.
 */
export type TimepickerPeriod = "am" | "pm";

/**
 * Determines whether a value is a `TimepickerPeriod`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TimepickerPeriod`.
 */
export function isTimepickerPeriod(value: unknown): value is TimepickerPeriod {
  return value === "am" || value === "pm";
}
