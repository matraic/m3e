import { isServer } from "lit";

/**
 * Determines whether reduced motion is preferred.
 * @returns {boolean} Whether reduced motion is preferred.
 */
export function prefersReducedMotion(): boolean {
  return isServer || matchMedia("(prefers-reduced-motion)").matches;
}
