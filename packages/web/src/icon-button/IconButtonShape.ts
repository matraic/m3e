/** Specifies the possible shape variants of an icon button. */
export type IconButtonShape = "rounded" | "square";

/**
 * Determines whether a value is an `IconButtonShape`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `IconButtonShape`.
 */
export function isIconButtonShape(value: unknown): value is IconButtonShape {
  return value === "rounded" || value === "square";
}
