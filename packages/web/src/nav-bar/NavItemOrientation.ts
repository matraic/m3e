/** Specifies the possible layout orientations of a navigation item. */
export type NavItemOrientation = "vertical" | "horizontal";

/**
 * Determines whether a value is a `NavItemOrientation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `NavItemOrientation`.
 */
export function isNavItemOrientation(value: unknown): value is NavItemOrientation {
  return value === "vertical" || value === "horizontal";
}
