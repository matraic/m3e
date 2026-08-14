/** Specifies the possible sizes of a button. */
export type ButtonSize = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Determines whether a value is a `ButtonSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ButtonSize`.
 */
export function isButtonSize(value: unknown): value is ButtonSize {
  return (
    value === "extra-small" || value === "small" || value === "medium" || value === "large" || value === "extra-large"
  );
}
