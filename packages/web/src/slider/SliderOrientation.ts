/** Specifies the possible orientations of a slider. */
export type SliderOrientation = "horizontal" | "vertical";

/**
 * Determines whether a value is a `SliderOrientation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SliderOrientation`.
 */
export function isSliderOrientation(value: unknown): value is SliderOrientation {
  return value === "horizontal" || value === "vertical";
}
