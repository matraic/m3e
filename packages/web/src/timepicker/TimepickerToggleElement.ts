import { customElement, ActionElementBase, HtmlFor } from "@m3e/web/core";
import type { M3eFormFieldElement } from "@m3e/web/form-field";

import { M3eTimepickerElement } from "./TimepickerElement";

/**
 * An element, nested within a clickable element, used to toggle a timepicker.
 * @example
 * Showcase: Basic usage. Import `@m3e/web/timepicker`. Also import `@m3e/web/form-field`, `@m3e/web/icon-button`, `@m3e/web/icon`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names. The native input is not automatically bound: handle the picker's `change` event to format and update its value.
 *
 * ```html
 * <m3e-form-field variant="outlined">
 *   <label slot="label" for="field">Time Field</label>
 *   <input autocomplete="off" id="field" />
 *   <m3e-icon-button slot="suffix">
 *     <m3e-icon name="schedule"></m3e-icon>
 *     <m3e-timepicker-toggle for="timepicker"></m3e-timepicker-toggle>
 *   </m3e-icon-button>
 *   <span slot="hint">HH:MM</span>
 * </m3e-form-field>
 * <m3e-timepicker id="timepicker" variant="auto"></m3e-timepicker>
 * ```
 *
 * @example
 * Showcase: Time input. Import `@m3e/web/timepicker`. Also import `@m3e/web/form-field`, `@m3e/web/date-input`, `@m3e/web/icon-button`, `@m3e/web/icon`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names.
 *
 * ```html
 * <m3e-form-field variant="outlined">
 *   <label slot="label" for="field">Time Picker</label>
 *   <m3e-date-input id="field" type="time"></m3e-date-input>
 *   <m3e-icon-button aria-label="Open time picker" slot="suffix">
 *     <m3e-icon name="schedule"></m3e-icon>
 *     <m3e-timepicker-toggle for="timepicker"></m3e-timepicker-toggle>
 *   </m3e-icon-button>
 *   <span slot="hint">HH:MM</span>
 * </m3e-form-field>
 * <m3e-timepicker id="timepicker" for="field"></m3e-timepicker>
 * ```
 *
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
