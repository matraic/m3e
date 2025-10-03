import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports a required state. */
export interface RequiredMixin {
  /**
   * A value indicating whether the element is required.
   * @default false
   */
  required: boolean;

  /** A value indicating whether the element is not required. */
  readonly optional: boolean;
}

/**
 * Determines whether a value is a `RequiredMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `RequiredMixin`.
 */
export function isRequiredMixin(value: unknown): value is RequiredMixin {
  return hasKeys<RequiredMixin>(value, "required", "optional");
}

/**
 * Mixin to augment an element with behavior that supports a required state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<RequiredMixin> & T} A constructor that implements `RequiredMixin`.
 */
export function Required<T extends Constructor<LitElement>>(base: T): Constructor<RequiredMixin> & T {
  abstract class _RequiredMixin extends base implements RequiredMixin {
    @property({ type: Boolean, reflect: true }) required = false;

    get optional() {
      return !this.required;
    }

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);
      if (changedProperties.has("required")) {
        this.ariaRequired = `${this.required}`;
      }
    }
  }
  return _RequiredMixin;
}
