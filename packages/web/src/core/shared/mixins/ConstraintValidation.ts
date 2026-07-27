import { LitElement, PropertyDeclaration, PropertyValues, isServer } from "lit";
import { property } from "lit/decorators.js";

import { internals, setCustomState } from "./AttachInternals";
import { Constructor } from "./Constructor";
import { FormAssociatedMixin, isFormAssociatedMixin } from "./FormAssociated";
import { hasKeys } from "./hasKeys";
import { isTouchedMixin } from "./Touched";
import { isLabelledMixin, updateLabels } from "./Labelled";

/** Maps validity state flags to validation messages. */
export type ValidationMessages = Record<keyof ValidityStateFlags, string | ((element: HTMLElement) => string)>;

/** A symbol through which a "Form Associated" custom element validates its current state. */
export const validate = Symbol("validate");

/** A symbol through which a "Form Associated" custom element provides default validation messages. */
export const defaultValidationMessages = Symbol("defaultValidationMessages");

/** Defines functionality for a "Form Associated" custom element that supports constraint validation. */
export interface ConstraintValidationMixin extends FormAssociatedMixin {
  /** Whether the element is a submittable element that is a candidate for constraint validation. */
  readonly willValidate: boolean;

  /** The validity state of the element. */
  readonly validity: ValidityState;

  /** The error message that would be displayed if the user submits the form, or an empty string if no error message. */
  readonly validationMessage: string;

  /** Validation messages mapped to individual error types. */
  validationMessages: ValidationMessages;

  /** Default validation messages mapped to individual error types. */
  readonly [defaultValidationMessages]: Readonly<ValidationMessages>;

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
      "setCustomValidity",
    ) && isFormAssociatedMixin(value)
  );
}

const _updateValidity = Symbol("_updateValidity");
const _validityMessage = Symbol("_validityMessage");
const _validationMessages = Symbol("_validationMessages");

/**
 * Mixin to augment an element with "Form Associated" behavior that supports constraint validation.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<ConstraintValidationMixin> & T} A constructor that implements `ConstraintValidationMixin`.
 */
export function ConstraintValidation<T extends Constructor<LitElement & FormAssociatedMixin>>(
  base: T,
): Constructor<ConstraintValidationMixin> & T {
  abstract class _ConstraintValidation extends base implements ConstraintValidationMixin {
    private [_validityMessage]?: string;
    private [_validationMessages]: Partial<ValidationMessages> = {};

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

    /** Default validation messages mapped to individual error types. */
    get [defaultValidationMessages](): Readonly<ValidationMessages> {
      return {
        valueMissing: "This field is required.",
        typeMismatch: "The value is not in the correct format.",
        patternMismatch: "The value does not match the required pattern.",
        tooLong: "The value is too long.",
        tooShort: "The value is too short.",
        rangeUnderflow: "The value is too small.",
        rangeOverflow: "The value is too large.",
        stepMismatch: "The value is not a valid step.",
        badInput: "The value is invalid.",
        customError: "The value is invalid.",
      };
    }

    /** Validation messages mapped to individual error types. */
    @property({ type: Object })
    set validationMessages(value: Partial<ValidationMessages>) {
      this[_validationMessages] = value;
    }
    get validationMessages(): ValidationMessages {
      return { ...this[defaultValidationMessages], ...this[_validationMessages] };
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
      const validityMessage = validity?.customError
        ? this[_validityMessage] || this._getValidityMessage(validity)
        : this._getValidityMessage(validity);

      const invalid = !!validityMessage;

      this[internals].setValidity(validity, validityMessage);
      this.ariaInvalid = invalid ? "true" : null;
      setCustomState(this, "--invalid", invalid === true);

      if (isLabelledMixin(this)) {
        this[updateLabels]?.();
      }
    }

    /** @private */
    private _getValidityMessage(flags?: ValidityStateFlags): string {
      if (flags) {
        const msgs = this.validationMessages;
        for (const key in flags) {
          if (flags[key as keyof ValidityStateFlags]) {
            const msg = msgs[key as keyof ValidationMessages];
            if (typeof msg === "string") return msg;
            if (typeof msg === "function") return msg(this);
          }
        }
      }

      return "";
    }
  }

  return _ConstraintValidation;
}
