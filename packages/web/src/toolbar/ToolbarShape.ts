/** Specifies the possible shape variants of a toolbar. */
export type ToolbarShape = "rounded" | "square";

/**
 * Determines whether a value is a `ToolbarShape`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ToolbarShape`.
 */
export function isToolbarShape(value: unknown): value is ToolbarShape {
  return value === "rounded" || value === "square";
}
