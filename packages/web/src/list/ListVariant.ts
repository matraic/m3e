/** Specifies the possible appearance variants of a list. */
export type ListVariant = "standard" | "segmented";

/**
 * Determines whether a value is a `ListVariant`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ListVariant`.
 */
export function isListVariant(value: unknown): value is ListVariant {
  return value === "standard" || value === "segmented";
}
