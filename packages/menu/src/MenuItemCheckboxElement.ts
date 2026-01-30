import { css, CSSResultGroup, html } from "lit";
import { customElement } from "lit/decorators.js";

import { Checked, hasAssignedNodes, Role } from "@m3e/core";

import { M3eMenuItemElement } from "./MenuItemElement";
import { MenuItemElementBase } from "./MenuItemElementBase";

/**
 * An item of a menu which supports a checkable state.
 *
 * @description
 * The `m3e-menu-item-checkbox` component represents a menu item that supports an independent checkable state.
 * It allows users to toggle options on or off without affecting other items in the menu, making it ideal for
 * multi-select scenarios such as filters, visibility toggles, or feature flags. This component encodes a persistent
 * selection contract and can coexist with other checkbox or radio items within the same menu.
 *
 * @example
 * The following example illustrates use of the `m3e-menu-item-checkbox` to present multiple independent checkable
 * items in a menu.
 * ```html
 * <m3e-button>
 *   <m3e-menu-trigger for="menu">Format</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu">
 *   <m3e-menu-item-checkbox>Bold</m3e-menu-item-checkbox>
 *   <m3e-menu-item-checkbox>Italic</m3e-menu-item-checkbox>
 *   <m3e-menu-item-checkbox>Underline</m3e-menu-item-checkbox>
 * </m3e-menu>
 * ```
 *
 * @tag m3e-menu-item-checkbox
 *
 * @slot - Renders the label of the item.
 * @slot icon - Renders an icon before the items's label.
 * @slot trailing-icon - Renders an icon after the item's label.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr checked - Whether the element is checked.
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
 * @cssprop --m3e-vibrant-menu-item-disabled-color - Base color for disabled items for vibrant variant
 * @cssprop --m3e-menu-item-icon-label-space - Horizontal gap between icon and content.
 * @cssprop --m3e-menu-item-padding-start - Start padding for the item wrapper.
 * @cssprop --m3e-menu-item-padding-end - End padding for the item wrapper.
 * @cssprop --m3e-menu-item-label-text-font-size - Font size for menu item text.
 * @cssprop --m3e-menu-item-label-text-font-weight - Font weight for menu item text.
 * @cssprop --m3e-menu-item-label-text-line-height - Line height for menu item text.
 * @cssprop --m3e-menu-item-label-text-tracking - Letter spacing for menu item text.
 * @cssprop --m3e-menu-item-focus-ring-shape - Border radius for the focus ring.
 * @cssprop --m3e-menu-item-icon-size - Font size for leading and trailing icons.
 */
@customElement("m3e-menu-item-checkbox")
export class M3eMenuItemCheckboxElement extends Checked(Role(MenuItemElementBase, "menuitemcheckbox")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    MenuItemElementBase.styles,
    css`
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host(:not(.-with-icon)) .icon {
        margin-inline-start: calc(0px - var(--m3e-menu-item-icon-label-space, 0.75rem));
      }
      .check {
        width: 1em;
        font-size: var(--m3e-menu-item-icon-size, 1.25rem) !important;
      }
      :host(:not([checked])) .check {
        display: none;
      }
      :host([checked]) .icon {
        margin-inline-start: 0;
      }
      :host([checked]) ::slotted([slot="icon"]) {
        display: none !important;
      }
    `,
  ];

  /** @internal */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @internal */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @internal */ readonly #keyUpHandler = () => this.#handleKeyUp();
  /** @internal */ readonly #mouseEnterHandler = () => this.#handleMouseEnter();
  /** @internal */ #spacePressed = false;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.addEventListener("click", this.#clickHandler);
    this.addEventListener("keydown", this.#keyDownHandler);
    this.addEventListener("keyup", this.#keyUpHandler);
    this.addEventListener("mouseenter", this.#mouseEnterHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("click", this.#clickHandler);
    this.removeEventListener("keydown", this.#keyDownHandler);
    this.removeEventListener("keyup", this.#keyUpHandler);
    this.removeEventListener("mouseenter", this.#mouseEnterHandler);
  }

  /** @internal @inheritdoc */
  protected override _renderContent(): unknown {
    return html` <div class="icon">
        <svg class="check" viewBox="0 -960 960 960" aria-hidden="true">
          <path fill="currentColor" d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
        </svg>
        <slot name="icon" @slotchange="${this.#handleIconSlotChange}"></slot>
      </div>
      <slot></slot>
      <slot name="trailing-icon" aria-hidden="true" @slotchange="${this.#handleTrailingIconSlotChange}"></slot>`;
  }

  /** @internal */
  #handleIconSlotChange(e: Event): void {
    this.classList.toggle("-with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @internal */
  #handleTrailingIconSlotChange(e: Event): void {
    this.classList.toggle("-with-trailing-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @internal */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented) {
      this.checked = !this.checked;
      this.performUpdate();

      if (!this.#spacePressed) {
        this.menu?.hideAll(true);
      }
    }
  }

  /** @internal */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#spacePressed = e.key === " ";
  }

  /** @internal */
  #handleKeyUp(): void {
    this.#spacePressed = false;
  }

  /** @internal */
  #handleMouseEnter(): void {
    this.menu?.items.forEach((item) => {
      if (item instanceof M3eMenuItemElement && item.submenu?.isOpen) {
        item.submenu.hide();
      }
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-menu-item-checkbox": M3eMenuItemCheckboxElement;
  }
}
