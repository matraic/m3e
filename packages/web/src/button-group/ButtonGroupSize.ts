/** Specifies the possible sizes of a button a group. */
export type ButtonGroupSize = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Determines whether a value is a `ButtonGroupSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ButtonGroupSize`.
 */
export function isButtonGroupSize(value: unknown): value is ButtonGroupSize {
  return (
    value === "extra-small" || value === "small" || value === "medium" || value === "large" || value === "extra-large"
  );
}
