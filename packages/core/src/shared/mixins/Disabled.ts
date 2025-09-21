import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports a disabled state. */
export interface DisabledMixin {
  /**
   * Whether the element is disabled.
   * @default false
   */
  disabled: boolean;
}

/**
 * Determines whether a value is a `DisabledMixin`.
 * @param {unknown} value The value to test.
 * @returns {value is DisabledMixin} Whether `value` is a `DisabledMixin`.
 */
export function isDisabledMixin(value: unknown): value is DisabledMixin {
  return hasKeys<DisabledMixin>(value, "disabled");
}

/**
 * Mixin to augment an element with behavior that supports a disabled state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @param {boolean} [reflect=true] Whether the disabled property is reflected as an attribute.
 * @returns {Constructor<DisabledMixin> & T} A constructor that implements `DisabledMixin`.
 */
export function Disabled<T extends Constructor<LitElement>>(
  base: T,
  reflect: boolean = true
): Constructor<DisabledMixin> & T {
  abstract class _DisabledMixin extends base implements DisabledMixin {
    @property({ type: Boolean, reflect: reflect }) disabled = false;

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("disabled") && this.role && this.role !== "none" && this.role !== "presentation") {
        this.ariaDisabled = this.disabled ? "true" : null;
      }
    }
  }

  return _DisabledMixin;
}
