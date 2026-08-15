/** Specifies the possible appearance variants of a form field. */
export type FormFieldVariant = "filled" | "outlined";

/**
 * Determines whether a value is a `FormFieldVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `FormFieldVariant`.
 */
export function isFormFieldVariant(value: unknown): value is FormFieldVariant {
  return value === "filled" || value === "outlined";
}
