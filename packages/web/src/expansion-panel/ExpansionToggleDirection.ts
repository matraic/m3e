/** Specifies the possible directions of an expansion toggle. */
export type ExpansionToggleDirection = "vertical" | "horizontal";

/**
 * Determines whether a value is an `ExpansionToggleDirection`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `ExpansionToggleDirection`.
 */
export function isExpansionToggleDirection(value: unknown): value is ExpansionToggleDirection {
  return value === "vertical" || value === "horizontal";
}
