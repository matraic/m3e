/** Specifies the possible dividers used to separate scrollable content. */
export type ScrollDividers = "above" | "below" | "above-below" | "none";

/**
 * Determines whether a value is a `ScrollDividers`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ScrollDividers`.
 */
export function isScrollDividers(value: unknown): value is ScrollDividers {
  return value === "above" || value === "below" || value === "above-below" || value === "none";
}
