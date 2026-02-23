import { ModifierKey } from "./ModifierKeys";

/**
 * Determines whether a modifier key is pressed.
 * @param {KeyboardEvent} e The `KeyboardEvent` to test.
 * @param {ModifierKey[]} modifiers The modifier keys to test.
 * @returns {boolean} A value indicating whether a modifier key is pressed.
 */
export function hasModifierKey(e: KeyboardEvent, ...modifiers: ModifierKey[]): boolean {
  return modifiers.length ? modifiers.some((x) => e[`${x}Key`]) : e.altKey || e.shiftKey || e.ctrlKey || e.metaKey;
}
