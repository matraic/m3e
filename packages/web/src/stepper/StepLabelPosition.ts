/** Specifies the possible positions of a horizontal step's label. */
export type StepLabelPosition = "below" | "end";

/**
 * Determines whether a value is a `StepLabelPosition`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `StepLabelPosition`.
 */
export function isStepLabelPosition(value: unknown): value is StepLabelPosition {
  return value === "below" || value === "end";
}
