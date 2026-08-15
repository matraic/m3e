/** Specifies the possible behaviors used to float labels in a form field. */
export type FloatLabelType = "always" | "auto";

/**
 * Determines whether a value is a `FloatLabelType`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `FloatLabelType`.
 */
export function isFloatLabelType(value: unknown): value is FloatLabelType {
  return value === "always" || value === "auto";
}
