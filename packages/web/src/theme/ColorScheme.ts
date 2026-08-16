/** Specifies schemes for which to generate a color palette. */
export type ColorScheme = "light" | "dark" | "auto";

/**
 * Determines whether a value is a `ColorScheme`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ColorScheme`.
 */
export function isColorScheme(value: unknown): value is ColorScheme {
  return value === "light" || value === "dark" || value === "auto";
}
