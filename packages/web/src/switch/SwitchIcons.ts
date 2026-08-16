/** Specifies the possible icons to display in a switch. */
export type SwitchIcons = "none" | "selected" | "both";

/**
 * Determines whether a value is a `SwitchIcons`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `SwitchIcons`.
 */
export function isSwitchIcons(value: unknown): value is SwitchIcons {
  return value === "none" || value === "selected" || value === "both";
}
