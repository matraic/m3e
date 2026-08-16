/** Specifies the possible positions for a rich tooltip. */
export type RichTooltipPosition =
  | "above-after"
  | "above-before"
  | "below-before"
  | "below-after"
  | "before"
  | "after"
  | "above"
  | "below";

/**
 * Determines whether a value is a `RichTooltipPosition`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `RichTooltipPosition`.
 */
export function isRichTooltipPosition(value: unknown): value is RichTooltipPosition {
  return (
    value === "above-after" ||
    value === "above-before" ||
    value === "below-before" ||
    value === "below-after" ||
    value === "before" ||
    value === "after" ||
    value === "above" ||
    value === "below"
  );
}
