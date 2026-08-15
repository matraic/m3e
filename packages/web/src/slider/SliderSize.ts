/** Specifies the possible sizes of a slider. */
export type SliderSize = "extra-small" | "small" | "medium" | "large" | "extra-large";

/**
 * Determines whether a value is a `SliderSize`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SliderSize`.
 */
export function isSliderSize(value: unknown): value is SliderSize {
  return (
    value === "extra-small" || value === "small" || value === "medium" || value === "large" || value === "extra-large"
  );
}
