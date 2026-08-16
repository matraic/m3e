/** Specifies the possible appearance variants of a tab. */
export type TabVariant = "primary" | "secondary";

/**
 * Determines whether a value is a `TabVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TabVariant`.
 */
export function isTabVariant(value: unknown): value is TabVariant {
  return value === "primary" || value === "secondary";
}
