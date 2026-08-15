/** Specifies the possible appearance variants of a split button. */
export type SplitButtonVariant = "elevated" | "filled" | "tonal" | "outlined";

/**
 * Determines whether a value is a `SplitButtonVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SplitButtonVariant`.
 */
export function isSplitButtonVariant(value: unknown): value is SplitButtonVariant {
  return value === "elevated" || value === "filled" || value === "tonal" || value === "outlined";
}
