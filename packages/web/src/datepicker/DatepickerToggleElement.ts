import { customElement, ActionElementBase, HtmlFor } from "@m3e/web/core";
import type { M3eFormFieldElement } from "@m3e/web/form-field";

import { M3eDatepickerElement } from "./DatepickerElement";

/**
 * An element, nested within a clickable element, used to toggle a datepicker.
 *
 * @example
 * Nest a datepicker toggle in a clickable element and connect it to the picker using `for`. Import `@m3e/web/form-field` for the form field. Import `@m3e/web/icon-button` and `@m3e/web/icon` for the icon button and icon. Give the icon button an accessible label. With a native input, handle the picker's `change` event to update the field.
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
  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    if (this.parentElement) {
      this.parentElement.ariaHasPopup = "dialog";
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.parentElement) {
      this.parentElement.ariaHasPopup = null;
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
