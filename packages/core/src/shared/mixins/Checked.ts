import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports a checked state. */
export interface CheckedMixin {
  /**
   * Whether the element is checked.
   * @default false
   */
  checked: boolean;
}

/**
 * Determines whether a value is a `CheckedMixin`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CheckedMixin`.
 */
export function isCheckedMixin(value: unknown): value is CheckedMixin {
  return hasKeys<CheckedMixin>(value, "checked");
}

/**
 * Mixin to augment an element with behavior that supports a checked state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<CheckedMixin> & T} A constructor that implements `CheckedMixin`.
 */
export function Checked<T extends Constructor<LitElement>>(base: T): Constructor<CheckedMixin> & T {
  abstract class _CheckedMixin extends base implements CheckedMixin {
    @property({ type: Boolean, reflect: true }) checked = false;

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("checked")) {
        if (this.role === "button") {
          this.ariaPressed = `${this.checked}`;
          this.ariaChecked = null;
        } else if (this.role && this.role !== "none" && this.role !== "presentation") {
          this.ariaChecked = `${this.checked}`;
          this.ariaPressed = null;
        }
      }
    }
  }
  return _CheckedMixin;
}
