/** Specifies the possible appearance variants of a floating-action button menu. */
export type FabMenuVariant = "primary" | "secondary" | "tertiary";

/**
 * Determines whether a value is a `FabMenuVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `FabMenuVariant`.
 */
export function isFabMenuVariant(value: unknown): value is FabMenuVariant {
  return value === "primary" || value === "secondary" || value === "tertiary";
}
