/** Specifies the possible appearance variants of a chip. */
export type ChipVariant = "outlined" | "elevated";

/**
 * Determines whether a value is a `ChipVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ChipVariant`.
 */
export function isChipVariant(value: unknown): value is ChipVariant {
  return value === "outlined" || value === "elevated";
}
