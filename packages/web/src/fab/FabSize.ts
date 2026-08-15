/** Specifies the possible sizes of a floating action button. */
export type FabSize = "small" | "medium" | "large";

/**
 * Determines whether a value is a `FabSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `FabSize`.
 */
export function isFabSize(value: unknown): value is FabSize {
  return value === "small" || value === "medium" || value === "large";
}
