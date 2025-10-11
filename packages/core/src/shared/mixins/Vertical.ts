import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports a vertical orientation. */
export interface VerticalMixin {
  /**
   * Whether the element is oriented vertically.
   * @default false
   */
  vertical: boolean;
}

/**
 * Determines whether a value is a `VerticalMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `VerticalMixin`.
 */
export function isVerticalMixin(value: unknown): value is VerticalMixin {
  return hasKeys<VerticalMixin>(value, "vertical");
}

/**
 * Mixin to augment an element with behavior that supports a vertical orientation.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<VerticalMixin> & T} A constructor that implements `VerticalMixin`.
 */
export function Vertical<T extends Constructor<LitElement>>(base: T): Constructor<VerticalMixin> & T {
  abstract class _VerticalMixin extends base implements VerticalMixin {
    @property({ type: Boolean, reflect: true }) vertical = false;

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("vertical")) {
        this.ariaOrientation = this.vertical ? "vertical" : "horizontal";
      }
    }
  }
  return _VerticalMixin;
}
