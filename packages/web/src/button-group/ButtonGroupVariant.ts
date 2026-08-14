/** Specifies the possible appearance variants of a button group. */
export type ButtonGroupVariant = "standard" | "connected";

/**
 * Determines whether a value is a `ButtonGroupVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ButtonGroupVariant`.
 */
export function isButtonGroupVariant(value: unknown): value is ButtonGroupVariant {
  return value === "standard" || value === "connected";
}
