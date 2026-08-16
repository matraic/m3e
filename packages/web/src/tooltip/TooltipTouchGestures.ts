/** Specifies the possible modes in which a tooltip should handle touch gestures. */
export type TooltipTouchGestures = "auto" | "on" | "off";

/**
 * Determines whether a value is a `TooltipTouchGestures`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TooltipTouchGestures`.
 */
export function isTooltipTouchGestures(value: unknown): value is TooltipTouchGestures {
  return value === "auto" || value === "on" || value === "off";
}
