/** Specifies the possible sizes of an application bar. */
export type AppBarSize = "small" | "medium" | "large";

/**
 * Determines whether a value is an `AppBarSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `AppBarSize`.
 */
export function isAppBarSize(value: unknown): value is AppBarSize {
  return value === "small" || value === "medium" || value === "large";
}
