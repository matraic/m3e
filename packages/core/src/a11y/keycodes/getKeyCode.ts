/**
 * Resolves the key code for the specified `KeyboardEvent`.
 * @param {KeyboardEvent} e The `KeyboardEvent` for which to resolve the key code.
 * @returns {number} The key code for `e`.
 */
export function getKeyCode(e: KeyboardEvent): number {
  return e.which || e.charCode || e.keyCode;
}
