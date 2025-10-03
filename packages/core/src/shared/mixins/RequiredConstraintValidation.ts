import { LitElement } from "lit";

import { Constructor } from "./Constructor";
import { ConstraintValidationMixin, isConstraintValidationMixin, validate } from "./ConstraintValidation";
import { isCheckedMixin } from "./Checked";
import { isRequiredMixin, RequiredMixin } from "./Required";

/** Defines functionality for an element which supports validating a required state. */
export interface RequiredConstraintValidationMixin extends RequiredMixin, ConstraintValidationMixin {}

/**
 * Determines whether a value is a `RequiredConstraintValidationMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `RequiredConstraintValidationMixin`.
 */
export function isRequiredConstraintValidationMixin(value: unknown): value is RequiredConstraintValidationMixin {
  return isRequiredMixin(value) && isConstraintValidationMixin(value);
}

/**
 * Mixin to augment an element with behavior that supports a required state.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<RequiredConstraintValidationMixin> & T} A constructor that implements `RequiredConstraintValidationMixin`.
 */
export function RequiredConstraintValidation<
  T extends Constructor<LitElement & RequiredMixin & ConstraintValidationMixin>
>(base: T): Constructor<RequiredConstraintValidationMixin> & T {
  abstract class _RequiredConstraintValidation extends base implements RequiredConstraintValidationMixin {
    override [validate](): ValidityStateFlags | undefined {
      const validity = super[validate]();
      if (!validity && this.required) {
        if (isCheckedMixin(this) && !this.checked) {
          return { valueMissing: true };
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if (!(<any>this).value) {
          return { valueMissing: true };
        }
      }
      return validity;
    }
  }
  return _RequiredConstraintValidation;
}
