import { html } from "lit";
import { customElement, state } from "lit/decorators.js";

import { hasAssignedNodes, HoverController, LinkButton, Role } from "@m3e/core";
import { M3eDirectionality } from "@m3e/core/bidi";

import type { M3eMenuElement } from "./MenuElement";
import { MenuItemElementBase } from "./MenuItemElementBase";
import { M3eMenuTriggerElement } from "./MenuTriggerElement";

/**
 * An item of a menu.
 *
 * @description
 * The `m3e-menu-item` component represents a single actionable item within a menu, supporting standard
 * click behavior, optional link semantics, and flexible icon placement for navigation, commands, or
 * contextual actions. It behaves as a button or link depending on its attributes, and can trigger a submenu
 * when a nested `m3e-menu-trigger` is present—enabling hierarchical flows.
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
 * @tag m3e-menu-item
 *
 * @slot - Renders the label of the item.
 * @slot icon - Renders an icon before the items's label.
 * @slot trailing-icon - Renders an icon after the item's label.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr download - Whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr target - The target of the link button.
 *
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-menu-item-container-height - Height of the menu item container.
 * @cssprop --m3e-menu-item-color - Text color for unselected, enabled menu items.
 * @cssprop --m3e-menu-item-container-hover-color - State layer hover color for unselected items.
 * @cssprop --m3e-menu-item-container-focus-color - State layer focus color for unselected items.
 * @cssprop --m3e-menu-item-ripple-color - Ripple color for unselected items.
 * @cssprop --m3e-menu-item-selected-color - Text color for selected items.
 * @cssprop --m3e-menu-item-selected-container-color - Background color for selected items.
 * @cssprop --m3e-menu-item-selected-container-hover-color - State layer hover color for selected items.
 * @cssprop --m3e-menu-item-selected-container-focus-color - State layer focus color for selected items.
 * @cssprop --m3e-menu-item-selected-ripple-color - Ripple color for selected items.
 * @cssprop --m3e-menu-item-active-state-layer-color - State layer color for expanded items.
 * @cssprop --m3e-menu-item-active-state-layer-opacity - State layer opacity for expanded items.
 * @cssprop --m3e-menu-item-disabled-color - Base color for disabled items.
 * @cssprop --m3e-menu-item-disabled-opacity - Opacity percentage for disabled item color mix.
 * @cssprop --m3e-vibrant-menu-item-color - Text color for unselected, enabled menu items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-container-hover-color - State layer hover color for unselected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-container-focus-color - State layer focus color for unselected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-ripple-color - Ripple color for unselected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-selected-color - Text color for selected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-selected-container-color - Background color for selected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-selected-container-hover-color - State layer hover color for selected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-selected-container-focus-color - State layer focus color for selected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-selected-ripple-color - Ripple color for selected items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-active-state-layer-color - State layer color for expanded items for vibrant variant.
 * @cssprop --m3e-vibrant-menu-item-disabled-color - Base color for disabled items for vibrant variant.
 * @cssprop --m3e-menu-item-icon-label-space - Horizontal gap between icon and content.
 * @cssprop --m3e-menu-item-padding-start - Start padding for the item wrapper.
 * @cssprop --m3e-menu-item-padding-end - End padding for the item wrapper.
 * @cssprop --m3e-menu-item-label-text-font-size - Font size for menu item text.
 * @cssprop --m3e-menu-item-label-text-font-weight - Font weight for menu item text.
 * @cssprop --m3e-menu-item-label-text-line-height - Line height for menu item text.
 * @cssprop --m3e-menu-item-label-text-tracking - Letter spacing for menu item text.
 * @cssprop --m3e-menu-item-focus-ring-shape - Border radius for the focus ring.
 * @cssprop --m3e-menu-item-icon-size - Font size for leading and trailing icons.
 * @cssprop --m3e-menu-item-shape - Base shape of the menu item.
 * @cssprop --m3e-menu-item-first-child-shape - Shape for the first menu item in a menu.
 * @cssprop --m3e-menu-item-last-child-shape - Shape for the last menu item in a menu.
 */
@customElement("m3e-menu-item")
export class M3eMenuItemElement extends LinkButton(Role(MenuItemElementBase, "menuitem")) {
  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #mouseEnterHandler = () => this.#handleMouseEnter();

  /** @private */ @state() private _hasSubmenu = false;
  /** @private */ #submenuTrigger?: M3eMenuTriggerElement;

  constructor() {
    super();

    new HoverController(this, {
      startDelay: 500,
      endDelay: 500,
      callback: (hovering) => {
        if (hovering && !this.disabled && this.#submenuTrigger) {
          this.#submenuTrigger.menu?.show(this);
        }
      },
    });
  }

  /** The submenu triggered by the item. */
  get submenu(): M3eMenuElement | null {
    return this.#submenuTrigger?.menu ?? null;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("click", this.#clickHandler);
    this.addEventListener("keydown", this.#keyDownHandler);
    this.addEventListener("mouseenter", this.#mouseEnterHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("click", this.#clickHandler);
    this.removeEventListener("keydown", this.#keyDownHandler);
    this.removeEventListener("mouseenter", this.#mouseEnterHandler);
  }

  /** @internal @inheritdoc */
  protected override _renderContent(): unknown {
    return html`<slot name="icon" aria-hidden="true" @slotchange="${this.#iconSlotChangeHandler}"></slot>
      <span class="content"><slot @slotchange="${this.#defaultSlotChangeHandler}"></slot></span>
      ${this._hasSubmenu
        ? M3eDirectionality.current === "ltr"
          ? html`<svg class="trailing-icon" aria-hidden="true" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M400-280v-400l200 200-200 200Z" />
            </svg>`
          : html`<svg class="trailing-icon" aria-hidden="true" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M560-280 360-480l200-200v400Z" />
            </svg>`
        : html`<slot name="trailing-icon" aria-hidden="true" @slotchange="${this.#trailingIconSlotChangeHandler}">
          </slot>`}`;
  }

  /** @private */
  #defaultSlotChangeHandler(e: Event): void {
    this.#submenuTrigger = (<HTMLSlotElement>e.target)
      .assignedElements({ flatten: true })
      .find((x) => x instanceof M3eMenuTriggerElement);
    this._hasSubmenu = this.#submenuTrigger !== undefined;
  }

  /** @private */
  #iconSlotChangeHandler(e: Event): void {
    this.classList.toggle("-with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #trailingIconSlotChangeHandler(e: Event): void {
    this.classList.toggle("-with-trailing-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented && !this._hasSubmenu) {
      this.menu?.hideAll(true);
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (e.defaultPrevented || this.disabled) return;

    switch (e.key) {
      case "Right":
      case "ArrowRight":
        if (M3eDirectionality.current === "ltr") {
          e.preventDefault();
          this.submenu?.show(this);
        }

        break;

      case "Left":
      case "ArrowLeft":
        if (M3eDirectionality.current === "rtl") {
          e.preventDefault();
          this.submenu?.show(this);
        }

        break;
    }
  }

  /** @private */
  #handleMouseEnter(): void {
    this.menu?.items.forEach((item) => {
      if (item instanceof M3eMenuItemElement && item !== this && item.submenu?.isOpen) {
        item.submenu.hide();
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-menu-item": M3eMenuItemElement;
  }
}
