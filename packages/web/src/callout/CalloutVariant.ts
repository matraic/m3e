/** Specifies the possible appearance variants of a callout. */
export type CalloutVariant = "primary" | "secondary" | "tertiary" | "error" | "surface";

/**
 * Determines whether a value is a `CalloutVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CalloutVariant`.
 */
export function isCalloutVariant(value: unknown): value is CalloutVariant {
  return (
    value === "primary" || value === "secondary" || value === "tertiary" || value === "error" || value === "surface"
  );
}
