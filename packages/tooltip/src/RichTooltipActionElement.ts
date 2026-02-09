import { customElement, property } from "lit/decorators.js";

import { ActionElementBase } from "@m3e/core";

/**
 * An element, nested within a clickable element, used to dismiss a parenting rich tooltip.
 * @tag m3e-rich-tooltip-action
 *
 * @slot - Renders the content of the action.
 *
 * @attr disable-restore-focus - Whether to focus should not be restored to the trigger when activated.
 */
@customElement("m3e-rich-tooltip-action")
export class M3eRichTooltipActionElement extends ActionElementBase {
  /** Whether to focus should not be restored to the trigger when activated. */
  @property({ attribute: "disable-restore-focus", type: Boolean }) disableRestoreFocus = false;

  /** @inheritdoc */
  protected override _onClick(): void {
    this.closest("m3e-rich-tooltip")?.hide(!this.disableRestoreFocus);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-rich-tooltip-action": M3eRichTooltipActionElement;
  }
}
