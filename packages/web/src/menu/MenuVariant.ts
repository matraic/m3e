/** Specifies the possible appearance variants of a menu. */
export type MenuVariant = "standard" | "vibrant";

/**
 * Determines whether a value is a `MenuVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `MenuVariant`.
 */
export function isMenuVariant(value: unknown): value is MenuVariant {
  return value === "standard" || value === "vibrant";
}
