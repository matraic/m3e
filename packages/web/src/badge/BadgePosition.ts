/** Specifies the possible positions of a badge, when attached to another element. */
export type BadgePosition =
  | "above-after"
  | "above-before"
  | "below-before"
  | "below-after"
  | "before"
  | "after"
  | "above"
  | "below";

/**
 * Determines whether a value is a `BadgePosition`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `BadgePosition`.
 */
export function isBadgePosition(value: unknown): value is BadgePosition {
  return (
    value === "above-after" ||
    value === "above-before" ||
    value === "below-before" ||
    value === "below-after" ||
    value === "before" ||
    value === "after" ||
    value === "above" ||
    value === "below"
  );
}
