/** Specifies the possible size variants for a badge. */
export type BadgeSize = "small" | "medium" | "large";

/**
 * Determines whether a value is a `BadgeSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `BadgeSize`.
 */
export function isBadgeSize(value: unknown): value is BadgeSize {
  return value === "small" || value === "medium" || value === "large";
}
