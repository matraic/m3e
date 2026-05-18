import { LitElement } from "lit";

import { Constructor } from "./Constructor";
import { addCustomState, AttachInternalsMixin, deleteCustomState } from "./AttachInternals";

/** A symbol used to define the function called to resume animation. */
export const resumeAnimation = Symbol("resumeAnimation");

/** Defines functionality for an element whose animation can be suppressed. */
export interface SuppressInitialAnimationMixin {
  /** Invoked to resume animation. */
  [resumeAnimation](): void;
}

/**
 * Mixin to augment an element with behavior that suppresses initial animations.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<SuppressInitialAnimationMixin> & T} A constructor that implements initial animation suppression.
 */
export function SuppressInitialAnimation<T extends Constructor<LitElement & AttachInternalsMixin>>(
  base: T,
): Constructor<SuppressInitialAnimationMixin> & T {
  abstract class _SuppressInitialAnimation extends base {
    override connectedCallback(): void {
      super.connectedCallback();

      addCustomState(this, "-no-animate");
      this[resumeAnimation]();
    }
    /** @internal */
    [resumeAnimation](): void {
      requestAnimationFrame(() => deleteCustomState(this, "-no-animate"));
    }
  }
  return _SuppressInitialAnimation;
}
