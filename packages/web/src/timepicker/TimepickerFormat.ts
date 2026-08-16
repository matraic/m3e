/** Specifies the time formats used by a timepicker. */
export type TimepickerFormat = "12" | "24" | "auto";

/**
 * Determines whether a value is a `TimepickerFormat`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TimepickerFormat`.
 */
export function isTimepickerFormat(value: unknown): value is TimepickerFormat {
  return value === "12" || value === "24" || value === "auto";
}
