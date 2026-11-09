import { property } from "lit/decorators.js";

import { ActionElementBase, customElement } from "@m3e/web/core";

/**
 * An element, nested within a clickable element, used to dismiss a parenting rich tooltip.
 * @example
 * Showcase: Actions. Import `@m3e/web/tooltip`. Also import `@m3e/web/icon-button`, `@m3e/web/icon`, `@m3e/web/button`. Load a matching Material Symbols font or register the icons. Give icon-only buttons accessible names.
 *
 * ```html
 * <m3e-icon-button id="button">
 *   <m3e-icon name="settings"></m3e-icon>
 * </m3e-icon-button>
 * <m3e-rich-tooltip for="button">
 *   <span slot="subhead">New settings available</span>
 *   Now you can adjust the uploaded image quality, and upgrade your available storage space.
 *   <div slot="actions">
 *     <m3e-button>
 *       <m3e-rich-tooltip-action>Learn more</m3e-rich-tooltip-action>
 *     </m3e-button>
 *   </div>
 * </m3e-rich-tooltip>
 * ```
 *
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
