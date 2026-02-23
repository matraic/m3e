import { hasModifierKey } from "./hasModifierKey";
import { ModifierKey, ModifierKeys } from "./ModifierKeys";

/**
 * Determines whether the specified modifier keys are allowed.
 * @param {KeyboardEvent} e The `KeyboardEvent` to test.
 * @param {ModifierKey[]} modifiers The allowed modifier keys.
 * @returns {boolean} A value indicating whether `modifiers` are allowed.
 */
export function isModifierAllowed(e: KeyboardEvent, ...modifiers: ModifierKey[]): boolean {
  return ModifierKeys.every((x) => !hasModifierKey(e, x) || modifiers.includes(x));
}
