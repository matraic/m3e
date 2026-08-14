/** Specifies the possible shape variants of a button. */
export type ButtonShape = "rounded" | "square";

/**
 * Determines whether a value is a `ButtonShape`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ButtonShape`.
 */
export function isButtonShape(value: unknown): value is ButtonShape {
  return value === "rounded" || value === "square";
}
