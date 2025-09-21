import { LitElement } from "lit";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element that can be marked as touched. */
export interface TouchedMixin {
  /** Whether the user has interacted when the element. */
  readonly touched: boolean;

  /** Whether the user has not interacted when the element. */
  readonly untouched: boolean;

  /** Marks the element as touched. */
  markAsTouched(): void;

  /** Marks the element as untouched. */
  markAsUntouched(): void;
}

/**
 * Determines whether a value is a `TouchedMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `TouchedMixin`.
 */
export function isTouchedMixin(value: unknown): value is TouchedMixin {
  return hasKeys<TouchedMixin>(value, "touched", "untouched", "markAsTouched", "markAsUntouched");
}

const _eventHandler = Symbol("_eventHandler");

/**
 * Mixin to augment an element with functionality used to mark it as touched.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<TouchedMixin> & T} A constructor that implements `TouchedMixin`.
 */
export function Touched<T extends Constructor<LitElement>>(base: T): Constructor<TouchedMixin> & T {
  abstract class _Touched extends base implements TouchedMixin {
    private [_eventHandler] = () => this.markAsTouched();

    get touched(): boolean {
      return this.classList.contains("-touched");
    }

    get untouched(): boolean {
      return !this.touched;
    }

    override connectedCallback(): void {
      this.markAsUntouched();
      super.connectedCallback();
      this.addEventListener("focusout", this[_eventHandler]);
    }

    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("focusout", this[_eventHandler]);
    }

    markAsTouched(): void {
      this.classList.toggle("-touched", true);
    }

    markAsUntouched(): void {
      this.classList.toggle("-touched", false);
    }
  }

  return _Touched;
}
