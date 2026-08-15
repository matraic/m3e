/** Specifies the possible appearance variants of a heading. */
export type HeadingVariant = "display" | "headline" | "title" | "label";

/**
 * Determines whether a value is a `HeadingVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `HeadingVariant`.
 */
export function isHeadingVariant(value: unknown): value is HeadingVariant {
  return value === "display" || value === "headline" || value === "title" || value === "label";
}
