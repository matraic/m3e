/** Specifies the various appearance variants of a datepicker. */
export type DatepickerVariant = "docked" | "modal" | "auto";

/**
 * Determines whether a value is a `DatepickerVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `DatepickerVariant`.
 */
export function isDatepickerVariant(value: unknown): value is DatepickerVariant {
  return value === "docked" || value === "modal" || value === "auto";
}
