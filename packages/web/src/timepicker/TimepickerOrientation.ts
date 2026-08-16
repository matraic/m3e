/** Specifies the possible layout orientations of a timepicker. */
export type TimepickerOrientation = "horizontal" | "vertical" | "auto";

/**
 * Determines whether a value is a `TimepickerOrientation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TimepickerOrientation`.
 */
export function isTimepickerOrientation(value: unknown): value is TimepickerOrientation {
  return value === "horizontal" || value === "vertical" || value === "auto";
}
