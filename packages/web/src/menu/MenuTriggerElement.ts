import { ActionElementBase, customElement, HtmlFor } from "@m3e/web/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/web/core/a11y";

import type { M3eMenuElement } from "./MenuElement";

/**
 * An element, nested within a clickable element, used to open a menu.
 *
 * @description
 * The `m3e-menu-trigger` component is used to open a menu when nested within a clickable element
 * such as a button or menu item. It anchors the menu to its invoker, enabling contextual flows and
 * nested hierarchies.
 *
 * @example
 * Showcase: Basic usage. Import `@m3e/web/menu`. Also import `@m3e/web/button`.
 *
 * ```html
 * <m3e-button>
 *   <m3e-menu-trigger for="menu">Menu</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu">
 *   <m3e-menu-item>Item 1</m3e-menu-item>
 *   <m3e-menu-item>Item 2</m3e-menu-item>
 * </m3e-menu>
 * ```
 *
 * @example
 * Showcase: Submenus. Import `@m3e/web/menu`. Also import `@m3e/web/button`.
 *
 * ```html
 * <m3e-button>
 *   <m3e-menu-trigger for="menu1">Menu with submenus</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu1">
 *   <m3e-menu-item>
 *     <m3e-menu-trigger for="submenu1">Fruits with A</m3e-menu-trigger>
 *   </m3e-menu-item>
 *   <m3e-menu-item>Grapes</m3e-menu-item>
 *   <m3e-menu-item>Olive</m3e-menu-item>
 *   <m3e-menu-item>Orange</m3e-menu-item>
 * </m3e-menu>
 * <m3e-menu id="submenu1">
 *   <m3e-menu-item>Apricot</m3e-menu-item>
 *   <m3e-menu-item>Avocado</m3e-menu-item>
 *   <m3e-menu-item>
 *     <m3e-menu-trigger for="submenu2">Apples</m3e-menu-trigger>
 *   </m3e-menu-item>
 * </m3e-menu>
 * <m3e-menu id="submenu2">
 *   <m3e-menu-item>Fuji</m3e-menu-item>
 *   <m3e-menu-item>Granny Smith</m3e-menu-item>
 *   <m3e-menu-item>Red Delicious</m3e-menu-item>
 * </m3e-menu>
 * ```
 *
 * @tag m3e-menu-trigger
 *
 * @slot - Renders the contents of the trigger.
 */
@customElement("m3e-menu-trigger")
export class M3eMenuTriggerElement extends HtmlFor(ActionElementBase) {
  /** The menu triggered by the element. */
  get menu(): M3eMenuElement | null {
    return this.control?.tagName === "M3E-MENU" ? <M3eMenuElement>this.control : null;
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    const menu = this.menu;
    if (menu) {
      if (this.parentElement) {
        this.parentElement.ariaHasPopup = "menu";
        this.parentElement.ariaExpanded = "false";
        if (menu.id) {
          addAriaReferencedId(this.parentElement, "aria-controls", menu.id);
        }
      }
      if (this.closest("m3e-menu")) {
        menu.submenu = true;
      }
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.parentElement) {
      this.parentElement.ariaHasPopup = null;
      this.parentElement.ariaExpanded = null;

      const menu = this.menu;
      if (menu?.id) {
        removeAriaReferencedId(this.parentElement, "aria-controls", menu.id);
      }
    }

    super.detach();
  }

  /** @inheritdoc */
  override _onClick(): void {
    if (this.parentElement) {
      if (this.parentElement.tagName === "M3E-MENU-ITEM") {
        this.menu?.show(this.parentElement);
      } else {
        this.menu?.toggle(this.parentElement);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-menu-trigger": M3eMenuTriggerElement;
  }
}
