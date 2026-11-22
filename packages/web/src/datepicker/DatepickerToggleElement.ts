import { customElement, ActionElementBase, HtmlFor } from "@m3e/web/core";
import type { M3eFormFieldElement } from "@m3e/web/form-field";

import { M3eDatepickerElement } from "./DatepickerElement";

/**
 * An element, nested within a clickable element, used to toggle a datepicker.
 *
 * @example
 * Nest the toggle in a clickable element and set its `for` to the datepicker's id. With a native input, handle the picker's `change` event to copy the selected date into the field.
 *
 * ```html
 * <m3e-form-field variant="outlined">
 *   <label slot="label" for="field">Date Field</label>
 *   <input autocomplete="off" id="field" />
 *   <m3e-icon-button slot="suffix">
 *     <m3e-icon name="calendar_today"></m3e-icon>
 *     <m3e-datepicker-toggle for="datepicker"></m3e-datepicker-toggle>
 *   </m3e-icon-button>
 *   <span slot="hint">MM/DD/YYYY</span>
 * </m3e-form-field>
 * <m3e-datepicker id="datepicker"></m3e-datepicker>
 * ```
 *
 * @tag m3e-datepicker-toggle
 */
@customElement("m3e-datepicker-toggle")
export class M3eDatepickerToggleElement extends HtmlFor(ActionElementBase) {
  /** @private */ #trigger?: HTMLElement;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#trigger = this.parentElement ?? undefined;
    if (this.#trigger) {
      this.#trigger.ariaHasPopup = "dialog";
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.#trigger) {
      this.#trigger.ariaHasPopup = null;
      this.#trigger = undefined;
    }
  }

  /** @inheritdoc */
  override _onClick(): void {
    if (this.control instanceof M3eDatepickerElement && this.parentElement) {
      this.control.toggle(this.parentElement, this.closest<M3eFormFieldElement>("m3e-form-field") ?? undefined);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-datepicker-toggle": M3eDatepickerToggleElement;
  }
}
