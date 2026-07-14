import { customElement, ActionElementBase, HtmlFor } from "@m3e/web/core";
import type { M3eFormFieldElement } from "@m3e/web/form-field";

import { M3eTimepickerElement } from "./TimepickerElement";

/**
 * An element, nested within a clickable element, used to toggle a timepicker.
 * @tag m3e-timepicker-toggle
 */
@customElement("m3e-timepicker-toggle")
export class M3eTimepickerToggleElement extends HtmlFor(ActionElementBase) {
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
    if (this.control instanceof M3eTimepickerElement && this.parentElement) {
      this.control.toggle(this.parentElement, this.closest<M3eFormFieldElement>("m3e-form-field") ?? undefined);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-timepicker-toggle": M3eTimepickerToggleElement;
  }
}
