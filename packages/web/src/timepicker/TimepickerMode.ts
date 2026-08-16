/** Specifies the modes in which users can input time using a timepicker. */
export type TimepickerMode = "dial" | "input";

/**
 * Determines whether a value is a `TimepickerMode`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TimepickerMode`.
 */
export function isTimepickerMode(value: unknown): value is TimepickerMode {
  return value === "dial" || value === "input";
}
