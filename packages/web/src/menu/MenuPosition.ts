/** Specifies the possible positions for a menu, on the x-axis, relative to its trigger. */
export type MenuPositionX = "before" | "after";

/** Specifies the possible positions for a menu, on the x-axis, relative to its trigger. */
export type MenuPositionY = "above" | "below";

/**
 * Determines whether a value is a `MenuPositionX`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `MenuPositionX`.
 */
export function isMenuPositionX(value: unknown): value is MenuPositionX {
  return value === "before" || value === "after";
}

/**
 * Determines whether a value is a `MenuPositionY`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `MenuPositionY`.
 */
export function isMenuPositionY(value: unknown): value is MenuPositionY {
  return value === "above" || value === "below";
}
