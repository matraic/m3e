/** Specifies the possible interaction modes for editing date and/or time values. */
export type DateInputType = "date" | "datetime" | "time";

/**
 * Determines whether a value is a `DateInputType`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `DateInputType`.
 */
export function isDateInputType(value: unknown): value is DateInputType {
  return value === "date" || value === "datetime" || value === "time";
}
