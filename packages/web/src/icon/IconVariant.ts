/** Specifies the possible appearance variants of an icon. */
export type IconVariant = "outlined" | "rounded" | "sharp";

/**
 * Determines whether a value is an `IconVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `IconVariant`.
 */
export function isIconVariant(value: unknown): value is IconVariant {
  return value === "outlined" || value === "rounded" || value === "sharp";
}
