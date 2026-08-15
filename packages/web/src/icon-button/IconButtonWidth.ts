/** Specifies the possible width variants of an icon button. */
export type IconButtonWidth = "default" | "narrow" | "wide";

/**
 * Determines whether a value is an `IconButtonWidth`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `IconButtonWidth`.
 */
export function isIconButtonWidth(value: unknown): value is IconButtonWidth {
  return value === "default" || value === "narrow" || value === "wide";
}
