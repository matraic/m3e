/** Specifies the possible sizes of a heading. */
export type HeadingSize = "small" | "medium" | "large";

/**
 * Determines whether a value is a `HeadingSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `HeadingSize`.
 */
export function isHeadingSize(value: unknown): value is HeadingSize {
  return value === "small" || value === "medium" || value === "large";
}
