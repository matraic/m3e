import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { HtmlFor } from "@m3e/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/core/a11y";

import type { M3eMenuElement } from "./MenuElement";

/**
 * @summary
 * An element, nested within a clickable element, used to open a menu.
 *
 * @description
 * The `m3e-menu-trigger` component is used to open a menu when nested within a clickable element
 * such as a button or menu item. It anchors the menu to its invoker, enabling contextual flows and
 * nested hierarchies.
 *
 * @example
 * The following example illustrates a basic menu.  The `m3e-menu-trigger` is used to trigger a `m3e-menu` specified
 * by the `for` attribute when its parenting element is activated.
 * ```html
 * <m3e-button>
 *   <m3e-menu-trigger for="menu1">Basic menu</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu1">
 *   <m3e-menu-item>Apple</m3e-menu-item>
 *   <m3e-menu-item>Apricot</m3e-menu-item>
 *   <m3e-menu-item>Avocado</m3e-menu-item>
 *   <m3e-menu-item>Green Apple</m3e-menu-item>
 *   <m3e-menu-item>Green Grapes</m3e-menu-item>
 *   <m3e-menu-item>Olive</m3e-menu-item>
 *   <m3e-menu-item>Orange</m3e-menu-item>
 * </m3e-menu>
 * ```
 *
 * @example
 * The next example illustrates nested menus.  Submenus are triggered by placing a `m3e-menu-trigger` inside a `m3e-menu-item`.
 * ```html
 * <m3e-button>
 *   <m3e-menu-trigger for="menu2">Nested menus</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu2">
 *   <m3e-menu-item>
 *     <m3e-menu-trigger for="menu3">Fruits with A</m3e-menu-trigger>
 *   </m3e-menu-item>
 *   <m3e-menu-item>Grapes</m3e-menu-item>
 *   <m3e-menu-item>Olive</m3e-menu-item>
 *   <m3e-menu-item>Orange</m3e-menu-item>
 * </m3e-menu>
 * <m3e-menu id="menu3">
 *   <m3e-menu-item>Apricot</m3e-menu-item>
 *   <m3e-menu-item>Avocado</m3e-menu-item>
 *   <m3e-menu-item>
 *     <m3e-menu-trigger for="menu4">Apples</m3e-menu-trigger>
 *   </m3e-menu-item>
 * </m3e-menu>
 * <m3e-menu id="menu4">
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
export class M3eMenuTriggerElement extends HtmlFor(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    ::slotted(.material-icons) {
      font-size: inherit !important;
    }
  `;

  /** @private */ readonly #clickHandler = async (e: Event) => this.#handleClick(e);

  /** The menu triggered by the element. */
  get menu(): M3eMenuElement | null {
    return this.control?.tagName === "M3E-MENU" ? <M3eMenuElement>this.control : null;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.parentElement?.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.parentElement?.removeEventListener("click", this.#clickHandler);
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
  protected override render(): unknown {
    return html`<slot></slot>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented && this.parentElement) {
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
