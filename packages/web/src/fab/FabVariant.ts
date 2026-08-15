/** Specifies the possible appearance variants of a floating action button. */
export type FabVariant =
  | "primary"
  | "primary-container"
  | "secondary"
  | "secondary-container"
  | "tertiary"
  | "tertiary-container"
  | "surface";

/**
 * Determines whether a value is a `FabVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `FabVariant`.
 */
export function isFabVariant(value: unknown): value is FabVariant {
  return (
    value === "primary" ||
    value === "primary-container" ||
    value === "secondary" ||
    value === "secondary-container" ||
    value === "tertiary" ||
    value === "tertiary-container" ||
    value === "surface"
  );
}
