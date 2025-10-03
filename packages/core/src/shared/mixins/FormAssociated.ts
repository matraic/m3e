import { LitElement, PropertyDeclaration } from "lit";
import { property } from "lit/decorators.js";

import { AttachInternalsMixin, internals, isAttachInternalsMixin } from "./AttachInternals";
import { Constructor } from "./Constructor";
import { DisabledMixin } from "./Disabled";
import { isCheckedMixin } from "./Checked";
import { isCheckedIndeterminateMixin } from "./CheckedIndeterminate";
import { isDirtyMixin } from "./Dirty";
import { isTouchedMixin } from "./Touched";
import { isLabelledMixin, LabelledMixin } from "./Labelled";
import { hasKeys } from "./hasKeys";

/** A symbol through which a "Form Associated" custom element provides a value for a form. */
export const formValue = Symbol("formValue");

/** A symbol through which a "Form Associated" custom element provides a default value for resetting a form. */
export const defaultValue = Symbol("defaultValue");

/** Defines functionality for a "Form Associated" custom element. */
export interface FormAssociatedMixin extends LabelledMixin, DisabledMixin, AttachInternalsMixin {
  /** The `HTMLFormElement` associated with this element. */
  readonly form: HTMLFormElement | null;

  /** The form value of the element. */
  readonly [formValue]: string | File | FormData | null;

  /** The default value (value or checked state) of the element. */
  readonly [defaultValue]: unknown;

  /** The name that identifies the element when submitting the associated form. */
  name: string;
}

/**
 * Determines whether a value is a `FormAssociatedMixin`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is a `FormAssociatedMixin`.
 */
export function isFormAssociatedMixin(value: unknown): value is FormAssociatedMixin {
  return (
    hasKeys<FormAssociatedMixin>(value, "disabled", "form", "name") &&
    isLabelledMixin(value) &&
    isAttachInternalsMixin(value)
  );
}

const _defaultValue = Symbol("_defaultValue");
const _defaultIndeterminate = Symbol("_defaultIndeterminate");
const _formDisabled = Symbol("_formDisabled");

/**
 * Mixin to augment an element with "Form Associated" behavior.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<FormAssociatedMixin> & T} A constructor that implements `FormAssociatedMixin`.
 */
export function FormAssociated<T extends Constructor<LitElement & DisabledMixin & AttachInternalsMixin>>(
  base: T
): Constructor<FormAssociatedMixin> & T {
  abstract class _FormAssociatedMixin extends base implements FormAssociatedMixin {
    static readonly formAssociated = true;
    private [_defaultValue]: unknown;
    private [_defaultIndeterminate] = false;
    private [_formDisabled] = false;

    get form(): HTMLFormElement | null {
      return this[internals].form;
    }

    get labels(): NodeListOf<HTMLLabelElement> {
      return this[internals].labels as NodeListOf<HTMLLabelElement>;
    }

    get [formValue](): string | File | FormData | null {
      return null;
    }

    get [defaultValue](): unknown {
      return this[_defaultValue];
    }

    @property({ noAccessor: true }) get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(value: string) {
      if (value) {
        this.setAttribute("name", value);
      } else {
        this.removeAttribute("name");
      }
    }

    // Disabled attributes should not be reflected for form associated elements due to
    // how the formDisabledCallback overrides an element's disabled state.
    // See https://github.com/whatwg/html/issues/8365

    @property({ type: Boolean })
    override get disabled(): boolean {
      return super.disabled || this[_formDisabled];
    }
    override set disabled(value: boolean) {
      super.disabled = value;
    }

    override connectedCallback(): void {
      super.connectedCallback();

      if (isCheckedMixin(this)) {
        this[_defaultValue] = this.checked;
        if (isCheckedIndeterminateMixin(this)) {
          this[_defaultIndeterminate] = this.indeterminate;
        }
      } else if ("value" in this) {
        this[_defaultValue] = this.value;
      }
    }

    override requestUpdate(name?: PropertyKey, oldValue?: unknown, options?: PropertyDeclaration): void {
      super.requestUpdate(name, oldValue, options);
      this[internals].setFormValue(this[formValue]);
    }

    formDisabledCallback(disabled: boolean): void {
      const wasDisabled = this.disabled;
      this[_formDisabled] = disabled;
      if (this.disabled != wasDisabled) {
        this.requestUpdate("disabled", wasDisabled);
      }
    }

    formResetCallback(): void {
      if (isCheckedMixin(this)) {
        this.checked = this[_defaultValue] === true;
        if (isCheckedIndeterminateMixin(this)) {
          this.indeterminate = this[_defaultIndeterminate];
        }
      } else if ("value" in this) {
        this.value = this[defaultValue];
      }

      if (isDirtyMixin(this)) {
        this.markAsPristine();
      }
      if (isTouchedMixin(this)) {
        this.markAsUntouched();
      }
    }
  }

  return _FormAssociatedMixin;
}
