/** Specifies the possible appearance variants of an icon button. */
export type IconButtonVariant = "filled" | "tonal" | "outlined" | "standard";

/**
 * Determines whether a value is an `IconButtonVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `IconButtonVariant`.
 */
export function isIconButtonVariant(value: unknown): value is IconButtonVariant {
  return value === "filled" || value === "tonal" || value === "outlined" || value === "standard";
}
