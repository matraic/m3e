import { property } from "lit/decorators.js";

import { ActionElementBase, customElement } from "@m3e/web/core";

/**
 * An element, nested within a clickable element, used to close a parenting dialog.
 *
 * @example
 * Nest `m3e-dialog-action` inside a button to close the dialog and set its `returnValue` to `ok`.
 * ```html
 * <m3e-button>
 *     <m3e-dialog-action return-value="ok">Close</m3e-dialog-action>
 * </m3e-button>
 * ```
 *
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
