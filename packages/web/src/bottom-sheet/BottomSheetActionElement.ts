import { ActionElementBase, customElement } from "@m3e/web/core";

/**
 * An element, nested within a clickable element, used to close a parenting bottom sheet.
 *
 * @example
 * Nest actions inside clickable list items in a bottom sheet. Import `@m3e/web/button`
 * and `@m3e/web/list` for the other components.
 * ```html
 * <m3e-button>
 *   <m3e-bottom-sheet-trigger for="bottomSheet">
 *     Open bottom sheet
 *   </m3e-bottom-sheet-trigger>
 * </m3e-button>
 * <m3e-bottom-sheet id="bottomSheet">
 *   <m3e-action-list>
 *     <m3e-list-action>
 *       <m3e-bottom-sheet-action>Google Keep</m3e-bottom-sheet-action>
 *       <span slot="supporting-text">Add to a note</span>
 *     </m3e-list-action>
 *     <m3e-list-action>
 *       <m3e-bottom-sheet-action>Google Docs</m3e-bottom-sheet-action>
 *       <span slot="supporting-text">Embed in a document</span>
 *     </m3e-list-action>
 *   </m3e-action-list>
 * </m3e-bottom-sheet>
 * ```
 *
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
