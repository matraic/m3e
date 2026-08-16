/** Specifies the possible layout orientations of collapsible content. */
export type CollapsibleOrientation = "vertical" | "horizontal" | "both";

/**
 * Determines whether a value is a `CollapsibleOrientation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CollapsibleOrientation`.
 */
export function isCollapsibleOrientation(value: unknown): value is CollapsibleOrientation {
  return value === "vertical" || value === "horizontal" || value === "both";
}
