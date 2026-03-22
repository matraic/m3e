import { LitElement } from "lit";

import { Constructor } from "./Constructor";
import { addCustomState, AttachInternalsMixin, deleteCustomState } from "./AttachInternals";

/**
 * Mixin to augment an element with behavior that suppresses initial animations.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {T} A constructor that implements initial animation suppression.
 */
export function SuppressInitialAnimation<T extends Constructor<LitElement & AttachInternalsMixin>>(base: T): T {
  abstract class _SuppressInitialAnimation extends base {
    override connectedCallback(): void {
      super.connectedCallback();

      addCustomState(this, "-no-animate");
      requestAnimationFrame(() => deleteCustomState(this, "-no-animate"));
    }
  }
  return _SuppressInitialAnimation;
}
