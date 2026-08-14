/** Specifies the possible appearance variants of a button. */
export type ButtonVariant = "elevated" | "filled" | "tonal" | "outlined" | "text";

/**
 * Determines whether a value is a `ButtonVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ButtonVariant`.
 */
export function isButtonVariant(value: unknown): value is ButtonVariant {
  return value === "elevated" || value === "filled" || value === "tonal" || value === "outlined";
}
