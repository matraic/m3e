import { customElement, property } from "lit/decorators.js";

import { ActionElementBase } from "@m3e/core";

/**
 * An element, nested within a clickable element, used to close a parenting dialog.
 * @tag m3e-dialog-action
 *
 * @slot - Renders the content of the action.
 *
 * @attr return-value - The value to return from the dialog.
 */
@customElement("m3e-dialog-action")
export class M3eDialogActionElement extends ActionElementBase {
  /**
   * The value to return from the dialog.
   * @default ""
   */
  @property({ attribute: "return-value" }) returnValue = "";

  /** @inheritdoc */
  protected override _onClick(): void {
    this.closest("m3e-dialog")?.hide(this.returnValue);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-dialog-action": M3eDialogActionElement;
  }
}
