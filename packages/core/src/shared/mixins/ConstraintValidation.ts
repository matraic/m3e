import { LitElement, PropertyDeclaration, PropertyValues, isServer } from "lit";

import { internals } from "./AttachInternals";
import { Constructor } from "./Constructor";
import { FormAssociatedMixin, isFormAssociatedMixin } from "./FormAssociated";
import { hasKeys } from "./hasKeys";
import { isTouchedMixin } from "./Touched";
import { isLabelledMixin, updateLabels } from "./Labelled";

/** A symbol through which a "Form Associated" custom element validates its current state. */
export const validate = Symbol("validate");

/** Defines functionality for a "Form Associated" custom element that supports constraint validation. */
export interface ConstraintValidationMixin extends FormAssociatedMixin {
  /** Whether the element is a submittable element that is a candidate for constraint validation. */
  readonly willValidate: boolean;

  /** The validity state of the element. */
  readonly validity: ValidityState;

  /** The error message that would be displayed if the user submits the form, or an empty string if no error message. */
  readonly validationMessage: string;

  /**
   * Validates the current state of the control.
   * @returns {ValidityStateFlags | undefined} The current validity state.
   */
  [validate](): ValidityStateFlags | undefined;

  /**
   * Returns `true` if the element has no validity problems; otherwise, returns `false`, fires
   * an invalid event, and (if the event isn't canceled) reports the problem to the user.
   */
  reportValidity(): boolean;

  /**
   * Returns `true` if the element has no validity problems; otherwise,
   * returns `false`, fires an invalid event.
   */
  checkValidity(): boolean;

  /**
   * Sets a custom validity message for the element.
   * @param error The message to use for validity errors.
   */
  setCustomValidity(error: string): void;
}

/**
 * Determines whether a value is a `ConstraintValidationMixin`.
 * @param {unknown} value The value to test.
 * @returns Whether `value` is a `ConstraintValidationMixin`.
 */
export function isConstraintValidationMixin(value: unknown): value is ConstraintValidationMixin {
  return (
    hasKeys<ConstraintValidationMixin>(
      value,
      "willValidate",
      "validity",
      "validationMessage",
      "reportValidity",
      "checkValidity",
      "setCustomValidity"
    ) && isFormAssociatedMixin(value)
  );
}

const _updateValidity = Symbol("_updateValidity");
const _validityMessage = Symbol("_validityMessage");

/**
 * Mixin to augment an element with "Form Associated" behavior that supports constraint validation.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<ConstraintValidationMixin> & T} A constructor that implements `ConstraintValidationMixin`.
 */
export function ConstraintValidation<T extends Constructor<LitElement & FormAssociatedMixin>>(
  base: T
): Constructor<ConstraintValidationMixin> & T {
  abstract class _ConstraintValidation extends base implements ConstraintValidationMixin {
    private [_validityMessage]?: string;

    /** Whether the element is a submittable element that is a candidate for constraint validation. */
    get willValidate(): boolean {
      return this[internals].willValidate;
    }

    /** The validity state of the element. */
    get validity(): ValidityState {
      this[_updateValidity]();
      return this[internals].validity;
    }

    /** The error message that would be displayed if the user submits the form, or an empty string if no error message. */
    get validationMessage(): string {
      this[_updateValidity]();
      return this[internals].validationMessage;
    }

    /** @internal */
    [validate](): ValidityStateFlags | undefined {
      return this[_validityMessage] ? { customError: true } : undefined;
    }

    /**
     * Returns `true` if the element has no validity problems; otherwise, returns `false`, fires
     * an invalid event, and (if the event isn't canceled) reports the problem to the user.
     */
    reportValidity(): boolean {
      if (isTouchedMixin(this)) {
        this.markAsTouched();
      }

      this[_updateValidity]();
      return this[internals].reportValidity();
    }

    /**
     * Returns `true` if the element has no validity problems; otherwise,
     * returns `false`, fires an invalid event.
     */
    checkValidity(): boolean {
      this[_updateValidity]();
      return this[internals].checkValidity();
    }

    /**
     * Sets a custom validity message for the element.
     * @param error The message to use for validity errors.
     */
    setCustomValidity(error: string): void {
      if (error) {
        this[_validityMessage] = error;
      } else {
        this[_validityMessage] = undefined;
      }

      this[_updateValidity]();
    }

    /** @inheritdoc */
    override requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration): void {
      super.requestUpdate(name, oldValue, options);
      this[_updateValidity]();
    }

    /** @inheritdoc */
    protected override firstUpdated(_changedProperties: PropertyValues): void {
      super.firstUpdated(_changedProperties);
      this[_updateValidity]();
    }

    /** @private */
    private [_updateValidity](): void {
      if (isServer || !this.isConnected) return;

      const validity = this[validate]();
      const invalid = validity && Object.keys(validity).some((x) => validity[<keyof ValidityStateFlags>x] === true);

      let validityMessage = validity?.customError ? this[_validityMessage] : "";
      if (validity && !validityMessage) {
        validityMessage = this.#getNativeMessage(validity);
      }

      this[internals].setValidity(validity, validityMessage);
      this.ariaInvalid = invalid ? "true" : null;
      this.classList.toggle("-invalid", invalid === true);

      if (isLabelledMixin(this)) {
        this[updateLabels]?.();
      }
    }

    /** @private */
    #getNativeMessage(flags: ValidityStateFlags): string {
      const input = document.createElement("input");

      // Default to text input unless overridden
      input.type = "text";

      // Simulate constraints and values based on flags
      if (flags.valueMissing) {
        input.required = true;
        input.value = ""; // triggers valueMissing
      }

      if (flags.typeMismatch) {
        input.type = "email";
        input.value = "not-an-email"; // triggers typeMismatch
      }

      if (flags.patternMismatch) {
        input.pattern = "[0-9]{4}";
        input.value = "abcd"; // triggers patternMismatch
      }

      if (flags.tooShort) {
        input.minLength = 5;
        input.value = "abc"; // triggers tooShort
      }

      if (flags.tooLong) {
        input.maxLength = 2;
        input.value = "abcdef"; // triggers tooLong
      }

      if (flags.rangeUnderflow) {
        input.type = "number";
        input.min = "10";
        input.value = "5"; // triggers rangeUnderflow
      }

      if (flags.rangeOverflow) {
        input.type = "number";
        input.max = "5";
        input.value = "10"; // triggers rangeOverflow
      }

      if (flags.stepMismatch) {
        input.type = "number";
        input.step = "2";
        input.value = "3"; // triggers stepMismatch
      }

      if (flags.badInput) {
        input.type = "number";
        input.value = "abc"; // triggers badInput
      }

      input.setCustomValidity("");
      input.checkValidity();

      return input.validationMessage;
    }
  }

  return _ConstraintValidation;
}
