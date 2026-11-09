import { property } from "lit/decorators.js";

import { ActionElementBase, customElement, HtmlFor } from "@m3e/web/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/web/core/a11y";

import { M3eBottomSheetElement } from "./BottomSheetElement";

/**
 * An element, nested within a clickable element, used to trigger a bottom sheet.
 *
 * @example
 * Nest the trigger inside a clickable element and use `for` to reference the sheet.
 * Import `@m3e/web/button` and `@m3e/web/list` for the other components.
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
 * @example
 * Set `detent` on the trigger to select the initial height. Supply the sheet content
 * from the basic example and import `@m3e/web/button`.
 * ```html
 * <m3e-button>
 *   <m3e-bottom-sheet-trigger for="bottomSheet" detent="1">
 *     Open draggable modal bottom sheet with detents at half via trigger
 *   </m3e-bottom-sheet-trigger>
 * </m3e-button>
 * <m3e-bottom-sheet id="bottomSheet" modal handle detents="fit half full">
 *   <!-- Content omitted for brevity -->
 * </m3e-bottom-sheet>
 * ```
 *
 * @tag m3e-bottom-sheet-trigger
 *
 * @slot - Renders the content of the trigger.
 *
 * @attr detent - The zero‑based index of the detent the sheet should open to.
 * @attr secondary - Marks this trigger as a secondary trigger for accessibility. Secondary triggers do not receive ARIA ownership.
 */
@customElement("m3e-bottom-sheet-trigger")
export class M3eBottomSheetTriggerElement extends HtmlFor(ActionElementBase) {
  /**
   * The zero‑based index of the detent the sheet should open to.
   * @default undefined
   */
  @property({ type: Number }) detent?: number;

  /**
   * Marks this trigger as a secondary trigger for accessibility. Secondary triggers do not receive ARIA ownership.
   * @default false
   */
  @property({ type: Boolean }) secondary = false;

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    if (control instanceof M3eBottomSheetElement) {
      super.attach(control);

      if (this.parentElement) {
        if (!control.modal) {
          if (!this.secondary) {
            this.parentElement.ariaExpanded = "false";
            addAriaReferencedId(this.parentElement, "aria-controls", control.id);
            if (this.parentElement.id) {
              addAriaReferencedId(control, "aria-labelledby", this.parentElement.id);
            }
          }
        } else {
          this.parentElement.ariaHasPopup = "dialog";
        }
      }
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control && this.parentElement && !this.secondary) {
      removeAriaReferencedId(this.parentElement, "aria-controls", this.control.id);
    }
    super.detach();
  }

  /** @inheritdoc */
  protected override _onClick(): void {
    if (this.control instanceof M3eBottomSheetElement) {
      if (this.control.modal) {
        this.control.show(this.detent);
      } else {
        this.control.toggle(this.detent);
        if (!this.secondary && this.parentElement) {
          this.parentElement.ariaExpanded = `${this.control.open}`;
        }
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-bottom-sheet-trigger": M3eBottomSheetTriggerElement;
  }
}
