/** Specifies the possible shape variants of a callout. */
export type CalloutShape = "rounded" | "square";

/**
 * Determines whether a value is a `CalloutShape`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CalloutShape`.
 */
export function isCalloutShape(value: unknown): value is CalloutShape {
  return value === "rounded" || value === "square";
}
