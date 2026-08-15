/** Specifies the various appearance variants of a progress indicator. */
export type ProgressIndicatorVariant = "flat" | "wavy";

/**
 * Determines whether a value is a `ProgressIndicatorVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ProgressIndicatorVariant`.
 */
export function isProgressIndicatorVariant(value: unknown): value is ProgressIndicatorVariant {
  return value === "flat" || value === "wavy";
}
