/** Specifies the possible orientations of a card. */
export type CardOrientation = "horizontal" | "vertical";

/**
 * Determines whether a value is a `CardOrientation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CardOrientation`.
 */
export function isCardOrientation(value: unknown): value is CardOrientation {
  return value === "horizontal" || value === "vertical";
}
