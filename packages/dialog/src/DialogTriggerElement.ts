import { customElement } from "lit/decorators.js";

import { ActionElementBase, HtmlFor } from "@m3e/core";

import { M3eDialogElement } from "./DialogElement";

/**
 * An element, nested within a clickable element, used to open a dialog.
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
