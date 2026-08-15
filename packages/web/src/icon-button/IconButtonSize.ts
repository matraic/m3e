/** Specifies the possible sizes of an icon button. */
export type IconButtonSize = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Determines whether a value is an `IconButtonSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is an `IconButtonSize`.
 */
export function isIconButtonSize(value: unknown): value is IconButtonSize {
  return (
    value === "extra-small" || value === "small" || value === "medium" || value === "large" || value === "extra-large"
  );
}
