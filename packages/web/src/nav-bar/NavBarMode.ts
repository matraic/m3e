/** Specifies the possible modes in which to present items in a navigation bar. */
export type NavBarMode = "compact" | "expanded" | "auto";

/**
 * Determines whether a value is a `NavBarMode`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `NavBarMode`.
 */
export function isNavBarMode(value: unknown): value is NavBarMode {
  return value === "compact" || value === "expanded" || value === "auto";
}
