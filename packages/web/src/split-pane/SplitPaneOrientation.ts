/** Specifies the possible layout orientations of a split pane. */
export type SplitPaneOrientation = "horizontal" | "vertical" | "auto";

/**
 * Determines whether a value is a `SplitPaneOrientation`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SplitPaneOrientation`.
 */
export function isSplitPaneOrientation(value: unknown): value is SplitPaneOrientation {
  return value === "horizontal" || value === "vertical" || value === "auto";
}
