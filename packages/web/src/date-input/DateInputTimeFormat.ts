/** Specifies the time formats used to edit time. */
export type DateInputTimeFormat = "12" | "24" | "auto";

/**
 * Determines whether a value is a `DateInputTimeFormat`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `DateInputTimeFormat`.
 */
export function isDateInputTimeFormat(value: unknown): value is DateInputTimeFormat {
  return value === "12" || value === "24" || value === "auto";
}
