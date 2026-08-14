/** Specifies the possible appearance variants of a card. */
export type CardVariant = "elevated" | "filled" | "outlined";

/**
 * Determines whether a value is a `CardVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CardVariant`.
 */
export function isCardVariant(value: unknown): value is CardVariant {
  return value === "elevated" || value === "filled" || value === "outlined";
}
