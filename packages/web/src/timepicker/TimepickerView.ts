/** Specifies the possible views of a timepicker. */
export type TimepickerView = "hour" | "minute" | "second";

/**
 * Determines whether a value is a `TimepickerView`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TimepickerView`.
 */
export function isTimepickerView(value: unknown): value is TimepickerView {
  return value === "hour" || value === "minute" || value === "second";
}
