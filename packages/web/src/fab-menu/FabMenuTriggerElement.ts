import { ActionElementBase, customElement, HtmlFor } from "@m3e/web/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/web/core/a11y";

import { M3eFabMenuElement } from "./FabMenuElement";

/**
 * An element, nested within a clickable element, used to open a floating action button (FAB) menu.
 *
 * @example
 * Nest a menu trigger in a FAB and associate it with the menu by id. Import `@m3e/web/fab` and `@m3e/web/icon` for the FAB and icons. Give the icon-only FAB an accessible label.
 *
 * ```html
 * <m3e-fab variant="primary" size="large">
 *   <m3e-fab-menu-trigger for="fabmenu">
 *     <m3e-icon name="edit"></m3e-icon>
 *   </m3e-fab-menu-trigger>
 * </m3e-fab>
 * <m3e-fab-menu id="fabmenu">
 *   <m3e-fab-menu-item>
 *     <m3e-icon slot="icon" name="email" filled></m3e-icon>
 *     Email
 *   </m3e-fab-menu-item>
 *   <m3e-fab-menu-item>
 *     <m3e-icon slot="icon" name="chat" filled></m3e-icon>
 *     Message
 *   </m3e-fab-menu-item>
 *   <m3e-fab-menu-item>
 *     <m3e-icon slot="icon" name="folder" filled></m3e-icon>
 *     Folder
 *   </m3e-fab-menu-item>
 * </m3e-fab-menu>
 * ```
 *
 * @tag m3e-fab-menu-trigger
 */
@customElement("m3e-fab-menu-trigger")
export class M3eFabMenuTriggerElement extends HtmlFor(ActionElementBase) {
  /** The menu triggered by the element. */
  get menu(): M3eFabMenuElement | null {
    return this.control instanceof M3eFabMenuElement ? this.control : null;
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (this.parentElement && control instanceof M3eFabMenuElement) {
      this.parentElement.ariaHasPopup = "menu";
      this.parentElement.ariaExpanded = "false";
      if (control.id) {
        addAriaReferencedId(this.parentElement, "aria-controls", control.id);
      }
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.parentElement) {
      this.parentElement.ariaHasPopup = null;
      this.parentElement.ariaExpanded = null;
      if (this.control?.id) {
        removeAriaReferencedId(this.parentElement, "aria-controls", this.control.id);
      }
    }

    super.detach();
  }

  /** @inheritdoc */
  override _onClick(): void {
    if (this.parentElement) {
      this.menu?.toggle(this.parentElement);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-fab-menu-trigger": M3eFabMenuTriggerElement;
  }
}
