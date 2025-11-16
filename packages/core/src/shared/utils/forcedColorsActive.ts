import { isServer } from "lit";

/**
 * Determines whether forced colors are active.
 * @returns {boolean} Whether forced colors are active.
 */
export function forcedColorsActive(): boolean {
  return !isServer && matchMedia("(forced-colors: active)").matches;
}
