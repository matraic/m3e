import { customElement } from "lit/decorators.js";

import { ActionElementBase } from "@m3e/core";

/**
 * An element, nested within a clickable element, used to close a parenting bottom sheet.
 * @tag m3e-bottom-sheet-action
 *
 * @slot - Renders the content of the action.
 */
@customElement("m3e-bottom-sheet-action")
export class M3eBottomSheetActionElement extends ActionElementBase {
  /** @inheritdoc */
  protected override _onClick(): void {
    this.closest("m3e-bottom-sheet")?.hide();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-bottom-sheet-action": M3eBottomSheetActionElement;
  }
}
