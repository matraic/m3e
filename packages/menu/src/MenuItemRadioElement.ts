import { CSSResultGroup, html, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import { Checked, hasAssignedNodes, Role } from "@m3e/core";

import { M3eMenuItemCheckboxElement } from "./MenuItemCheckboxElement";
import { M3eMenuItemElement } from "./MenuItemElement";
import { MenuItemElementBase } from "./MenuItemElementBase";

/**
 * An item of a menu which supports a mutually exclusive checkable state.
 *
 * @description
 * The `m3e-menu-item-radio` component represents a selectable menu item that participates in a mutually exclusive group.
 * It reflects a singular choice within a shared context—such as sort order, theme selection, or view mode—and updates
 * group state when selected. This component can be nested within an `m3e-menu-item-group`, allowing multiple exclusive
 * groups to coexist within a single menu.
 *
 * @example
 * The following example illustrates use of the `m3e-menu-item-radio` in a `m3e-menu` to allow a user to select a sort order.
 * The `m3e-menu-trigger` is used to trigger a `m3e-menu` specified by the `for` attribute when its parenting element is activated.
 * ```html
 * <m3e-button>
 *  <m3e-menu-trigger for="menu">Sort order</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu">
 *  <m3e-menu-item-radio>Ascending</m3e-menu-item-radio>
 *  <m3e-menu-item-radio>Descending</m3e-menu-item-radio>
 * </m3e-menu>
 * ```
 *
 * @tag m3e-menu-item-radio
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
 * @cssprop --m3e-menu-selected-color - Text color for selected or expanded items.
 * @cssprop --m3e-menu-selected-container-color - Background color for selected or expanded items.
 * @cssprop --m3e-menu-item-selected-container-hover-color - State layer hover color for selected items.
 * @cssprop --m3e-menu-item-selected-container-focus-color - State layer focus color for selected items.
 * @cssprop --m3e-menu-item-selected-ripple-color - Ripple color for selected items.
 * @cssprop --m3e-menu-item-disabled-color - Base color for disabled items.
 * @cssprop --m3e-menu-item-disabled-opacity - Opacity percentage for disabled item color mix.
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
@customElement("m3e-menu-item-radio")
export class M3eMenuItemRadioElement extends Checked(Role(MenuItemElementBase, "menuitemradio")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = M3eMenuItemCheckboxElement.styles;

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #keyUpHandler = () => this.#handleKeyUp();
  /** @private */ readonly #mouseEnterHandler = () => this.#handleMouseEnter();

  /** @private */ #spacePressed = false;

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

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("checked") && this.checked) {
      (this.closest("[role='group']") ?? this.closest("m3e-menu"))
        ?.querySelectorAll("m3e-menu-item-radio")
        .forEach((x) => {
          if (x !== this && x.checked) {
            x.checked = false;
          }
        });
    }
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

  /** @private */
  #handleIconSlotChange(e: Event): void {
    this.classList.toggle("-with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleTrailingIconSlotChange(e: Event): void {
    this.classList.toggle("-with-trailing-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented) {
      this.checked = true;
      this.performUpdate();

      if (!this.#spacePressed) {
        this.menu?.hideAll(true);
      }
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#spacePressed = e.key === " ";
  }

  /** @private */
  #handleKeyUp(): void {
    this.#spacePressed = false;
  }

  /** @private */
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
    "m3e-menu-item-radio": M3eMenuItemRadioElement;
  }
}
