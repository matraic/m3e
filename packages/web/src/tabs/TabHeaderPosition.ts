/** Specifies the possible positions of a tab header. */
export type TabHeaderPosition = "before" | "after";

/**
 * Determines whether a value is a `TabHeaderPosition`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TabHeaderPosition`.
 */
export function isTabHeaderPosition(value: unknown): value is TabHeaderPosition {
  return value === "before" || value === "after";
}
