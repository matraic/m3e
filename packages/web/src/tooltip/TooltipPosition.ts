/** Specifies the possible positions for a tooltip. */
export type TooltipPosition = "above" | "below" | "before" | "after";

/**
 * Determines whether a value is a `TooltipPosition`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `TooltipPosition`.
 */
export function isTooltipPosition(value: unknown): value is TooltipPosition {
  return value === "above" || value === "below" || value === "before" || value === "after";
}
