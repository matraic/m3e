/** Specifies the possible appearance variants of a loading indicator. */
export type LoadingIndicatorVariant = "uncontained" | "contained";

/**
 * Determines whether a value is a `LoadingIndicatorVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `LoadingIndicatorVariant`.
 */
export function isLoadingIndicatorVariant(value: unknown): value is LoadingIndicatorVariant {
  return value === "uncontained" || value === "contained";
}
