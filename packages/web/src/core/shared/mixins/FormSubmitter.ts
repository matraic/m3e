import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import { AttachInternalsMixin, internals, isAttachInternalsMixin } from "./AttachInternals";
import { Constructor } from "./Constructor";
import { hasKeys } from "./hasKeys";
import { isDisabledMixin } from "./Disabled";
import { isDisabledInteractiveMixin } from "./DisabledInteractive";

/** Specifies the form submission behaviors. */
export type FormSubmitterType = "button" | "submit" | "reset";

/** Defines functionality for an element which can be used to submit a form. */
export interface FormSubmitterMixin extends AttachInternalsMixin {
  /**
   * The name of the element, submitted as a pair with the element's `value`
   * as part of form data, when the element is used to submit a form.
   */
  name: string;

  /** The value associated with the element's name when it's submitted with form data. */
  value: string | null;

  /**
   * The type of the element.
   * @default "button"
   */
  type: FormSubmitterType;
}

/**
 * Determines whether a value is a `FormSubmitterMixin`.
 * @param {unknown} value The value to test.
 * @returns {value is FormSubmitterMixin} Whether `value` is a `FormSubmitterMixin`.
 */
export function isFormSubmitterMixin(value: unknown): value is FormSubmitterMixin {
  return hasKeys<FormSubmitterMixin>(value, "name", "type", "value") && isAttachInternalsMixin(value);
}

const _clickHandler = Symbol("_clickHandler");

/**
 * Mixin to augment an element with behavior used to submit a form.
 * @template T The type of the base class.
 * @param {T} base The base class.
 * @returns {Constructor<FormSubmitterMixin>} A constructor that implements `FormSubmitterMixin`.
 */
export function FormSubmitter<T extends Constructor<LitElement & AttachInternalsMixin>>(
  base: T
): Constructor<FormSubmitterMixin> & T {
  abstract class _FormSubmitterMixin extends base implements FormSubmitterMixin {
    /** Indicates that this custom element participates in form submission, validation, and form state restoration. */
    static readonly formAssociated = true;

    /**
     * The name of the element, submitted as a pair with the element's `value`
     * as part of form data, when the element is used to submit a form.
     */
    @property() get name() {
      return this.getAttribute("name") ?? "";
    }
    set name(value: string) {
      if (value) {
        this.setAttribute("name", value);
      } else {
        this.removeAttribute("name");
      }
    }

    /** The value associated with the element's name when it's submitted with form data. */
    @property() get value() {
      return this.getAttribute("value");
    }
    set value(value: string | null) {
      if (value !== null && value !== undefined) {
        this.setAttribute("value", value);
      } else {
        this.removeAttribute("value");
      }
    }

    /**
     * The type of the element.
     * @default "button"
     */
    @property() type: FormSubmitterType = "button";

    /** @inheritdoc */
    override connectedCallback(): void {
      super.connectedCallback();
      this.addEventListener("click", this[_clickHandler]);
    }

    /** @inheritdoc */
    override disconnectedCallback(): void {
      super.disconnectedCallback();
      this.removeEventListener("click", this[_clickHandler]);
    }

    /** @private */
    private [_clickHandler] = async (e: Event) => {
      if (
        e.defaultPrevented ||
        (isDisabledMixin(this) && this.disabled) ||
        (isDisabledInteractiveMixin(this) && this.disabledInteractive)
      ) {
        return;
      }

      const form = this[internals].form;
      if (!form || this.type === "button") {
        return;
      }

      await new Promise<void>((resolve) => setTimeout(resolve));

      if (e.defaultPrevented) {
        return;
      }

      switch (this.type) {
        case "reset":
          form.reset();
          break;

        case "submit":
          form.addEventListener(
            "submit",
            (e) =>
              Object.defineProperty(e, "submitter", {
                configurable: true,
                enumerable: true,
                get: () => this,
              }),
            { capture: true, once: true }
          );

          this[internals].setFormValue(this.value);
          form.requestSubmit();
          break;
      }
    };
  }

  return _FormSubmitterMixin;
}
