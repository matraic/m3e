/** Specifies the possible behavior modes used to hide subscript content in a form field. */
export type HideSubscriptType = "always" | "auto" | "never";

/**
 * Determines whether a value is a `HideSubscriptType`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `HideSubscriptType`.
 */
export function isHideSubscriptType(value: unknown): value is HideSubscriptType {
  return value === "always" || value === "auto" || value === "never";
}
