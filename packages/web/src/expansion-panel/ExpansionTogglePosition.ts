/** Specifies the possible positions of an expansion toggle. */
export type ExpansionTogglePosition = "before" | "after";

/**
 * Determines whether a value is an `ExpansionTogglePosition`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `ExpansionTogglePosition`.
 */
export function isExpansionTogglePosition(value: unknown): value is ExpansionTogglePosition {
  return value === "before" || value === "after";
}
