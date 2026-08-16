/** Specifies the possible layout orientations of a stepper. */
export type StepperOrientation = "horizontal" | "vertical" | "auto";

/**
 * Determines whether a value is a `StepperOrientation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `StepperOrientation`.
 */
export function isStepperOrientation(value: unknown): value is StepperOrientation {
  return value === "horizontal" || value === "vertical" || value === "auto";
}
