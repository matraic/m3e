import { ActionElementBase, customElement, HtmlFor } from "@m3e/web/core";

import { M3eDialogElement } from "./DialogElement";

/**
 * An element, nested within a clickable element, used to open a dialog.
 *
 * @example
 * Nest a trigger inside a clickable element and connect it to the dialog by id.
 * Import `@m3e/web/button` for the button.
 * ```html
 * <m3e-button variant="filled">
 *   <m3e-dialog-trigger for="dlg">Open Dialog</m3e-dialog-trigger>
 * </m3e-button>
 * <m3e-dialog id="dlg" dismissible>
 *   <!-- Content omitted for brevity -->
 * </m3e-dialog>
 * ```
 *
 * @tag m3e-dialog-trigger
 */
@customElement("m3e-dialog-trigger")
export class M3eDialogTriggerElement extends HtmlFor(ActionElementBase) {
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
    if (this.control instanceof M3eDialogElement) {
      this.control.show();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-dialog-trigger": M3eDialogTriggerElement;
  }
}
