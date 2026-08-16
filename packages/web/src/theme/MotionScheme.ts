/** Specifies the possible motion schemes of a theme. */
export type MotionScheme = "standard" | "expressive";

/**
 * Determines whether a value is a `MotionScheme`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `MotionScheme`.
 */
export function isMotionScheme(value: unknown): value is MotionScheme {
  return value === "standard" || value === "expressive";
}
