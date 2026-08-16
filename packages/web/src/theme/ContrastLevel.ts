/** Specifies the contrast level in which to generate a color palette. */
export type ContrastLevel = "high" | "medium" | "standard";

/**
 * Determines whether a value is a `ContrastLevel`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ContrastLevel`.
 */
export function isContrastLevel(value: unknown): value is ContrastLevel {
  return value === "high" || value === "medium" || value === "standard";
}
