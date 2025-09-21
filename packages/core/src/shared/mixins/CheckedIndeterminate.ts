import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { Checked, CheckedMixin, isCheckedMixin } from "./Checked";
import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";

/** Defines functionality for an element which supports a mixed checked state. */
export interface CheckedIndeterminateMixin extends CheckedMixin {
  /**
   * Whether the element's checked state is indeterminate.
   * @default false
   */
  indeterminate: boolean;
}

/**
 * Determines whether a value is a `CheckedIndeterminateMixin`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `CheckedIndeterminateMixin`.
 */
export function isCheckedIndeterminateMixin(value: unknown): value is CheckedIndeterminateMixin {
  return hasKeys<CheckedIndeterminateMixin>(value, "indeterminate") && isCheckedMixin(value);
}

/**
 * Mixin to augment an element with behavior that supports a mixed checked state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<CheckedIndeterminateMixin> & T} A constructor that implements `CheckedIndeterminateMixin`.
 */
export function CheckedIndeterminate<T extends Constructor<LitElement>>(
  base: T
): Constructor<CheckedIndeterminateMixin> & T {
  abstract class _CheckedIndeterminateMixin extends Checked(base) implements CheckedIndeterminateMixin {
    @property({ type: Boolean, reflect: true }) indeterminate = false;

    protected override update(changedProperties: PropertyValues<this>): void {
      super.update(changedProperties);

      if (changedProperties.has("indeterminate") && this.role && this.role !== "none" && this.role !== "presentation") {
        this.ariaChecked = !this.checked && this.indeterminate ? "mixed" : `${this.checked}`;
      }
    }
  }
  return _CheckedIndeterminateMixin;
}
