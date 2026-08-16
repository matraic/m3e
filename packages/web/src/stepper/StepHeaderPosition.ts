/** Specifies the possible positions for the steps of a horizontal stepper. */
export type StepHeaderPosition = "above" | "below";

/**
 * Determines whether a value is a `StepHeaderPosition`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `StepHeaderPosition`.
 */
export function isStepHeaderPosition(value: unknown): value is StepHeaderPosition {
  return value === "above" || value === "below";
}
