/** Specifies the possible display modes for a drawer. */
export type DrawerMode = "over" | "push" | "side" | "auto";

/**
 * Determines whether a value is a `DrawerMode`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `DrawerMode`.
 */
export function isDrawerMode(value: unknown): value is DrawerMode {
  return value === "over" || value === "push" || value === "side" || value === "auto";
}
