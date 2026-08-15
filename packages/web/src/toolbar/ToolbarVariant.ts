/** Specifies the possible appearance variants of a toolbar. */
export type ToolbarVariant = "standard" | "vibrant";

/**
 * Determines whether a value is a `ToolbarVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ToolbarVariant`.
 */
export function isToolbarVariant(value: unknown): value is ToolbarVariant {
  return value === "standard" || value === "vibrant";
}
