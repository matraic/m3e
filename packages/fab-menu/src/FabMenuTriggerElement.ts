import { customElement } from "lit/decorators.js";

import { ActionElementBase, HtmlFor } from "@m3e/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/core/a11y";

import { M3eFabMenuElement } from "./FabMenuElement";

/**
 * An element, nested within a clickable element, used to open a floating action button (FAB) menu.
 *
 * @example
 * The following example illustrates triggering a `m3e-fab-menu` from an `m3e-fab` using a `m3e-fab-menu-trigger`.
 * ```html
 * <m3e-fab variant="primary" size="large">
 *  <m3e-fab-menu-trigger for="fabmenu">
 *    <m3e-icon name="edit"></m3e-icon>
 *  </m3e-fab-menu-trigger>
 * </m3e-fab>
 * <m3e-fab-menu id="fabmenu" variant="secondary">
 *  <m3e-fab-menu-item>First</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Second</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Third</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Forth</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Fifth</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Sixth</m3e-fab-menu-item>
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
