/** Specifies the various appearance variants of a timepicker. */
export type TimepickerVariant = "docked" | "modal" | "auto";

/**
 * Determines whether a value is a `TimepickerVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TimepickerVariant`.
 */
export function isTimepickerVariant(value: unknown): value is TimepickerVariant {
  return value === "docked" || value === "modal" || value === "auto";
}
