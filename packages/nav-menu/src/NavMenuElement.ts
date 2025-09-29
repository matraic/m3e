import { css, CSSResultGroup, html, isServer, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { DesignToken, FocusController, Role, scrollIntoViewIfNeeded } from "@m3e/core";
import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { M3eNavMenuItemElement } from "./NavMenuItemElement";

/**
 * @summary
 * Presents a hierarchical menu.
 *
 * @description
 * The `m3e-nav-menu` component provides a hierarchical, accessible navigation menu supporting
 * nested expandable items, keyboard navigation, and focus management. It is highly customizable
 * via slots and CSS custom properties, and is designed for use in sidebars, navigation drawers,
 * and complex menu structures.
 *
 * @example
 * The following example illustrates a multilevel navigation menu.
 * ```html
 * <m3e-nav-menu>
 *   <m3e-nav-menu-item open>
 *     <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
 *     <span slot="label">Getting Started</span>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="widgets"></m3e-icon>
 *       <span slot="label">Overview</span>
 *     </m3e-nav-menu-item>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="package_2"></m3e-icon>
 *       <span slot="label">Installation</span>
 *     </m3e-nav-menu-item>
 *   </m3e-nav-menu-item>
 *   <m3e-nav-menu-item>
 *     <span slot="label">Actions</span>
 *     <m3e-nav-menu-item><span slot="label">Button</span></m3e-nav-menu-item>
 *     <m3e-nav-menu-item><span slot="label">Icon</span></m3e-nav-menu-item>
 *     <m3e-nav-menu-item><span slot="label">Icon Button</span></m3e-nav-menu-item>
 *   </m3e-nav-menu-item>
 * </m3e-nav-menu>
 * ```
 *
 * @tag m3e-nav-menu
 *
 * @slot - Renders the items of the menu.
 *
 * @cssprop --m3e-nav-menu-padding-top - Top padding for the menu.
 * @cssprop --m3e-nav-menu-padding-bottom - Bottom padding for the menu.
 * @cssprop --m3e-nav-menu-padding-left - Left padding for the menu.
 * @cssprop --m3e-nav-menu-padding-right - Right padding for the menu.
 * @cssprop --m3e-nav-menu-divider-margin - Margin for divider elements in the menu.
 * @cssprop --m3e-nav-menu-scrollbar-width - Width of the menu scrollbar.
 * @cssprop --m3e-nav-menu-scrollbar-color - Color of the menu scrollbar.
 */
@customElement("m3e-nav-menu")
export class M3eNavMenuElement extends Role(LitElement, "tree") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      flex-direction: column;
      outline: none;
      overflow-y: auto;
      overflow-x: hidden;
      position: relative;
      min-height: 0;
      padding-block-start: var(--m3e-nav-menu-padding-top, 0.5rem);
      padding-block-end: var(--m3e-nav-menu-padding-bottom, 0.5rem);
      padding-inline-start: var(--m3e-nav-menu-padding-left, 0.75rem);
      padding-inline-end: var(--m3e-nav-menu-padding-right, 0.75rem);
      scrollbar-width: ${DesignToken.scrollbar.width};
      scrollbar-color: ${DesignToken.scrollbar.color};
    }
    ::slotted(m3e-divider) {
      margin-block: var(--m3e-nav-menu-divider-margin, 0.25rem);
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ #ignoreFocusVisible = false;

  /** @private */
  readonly [selectionManager] = new SelectionManager<M3eNavMenuItemElement>()
    .withVerticalOrientation()
    .withHomeAndEnd()
    .withTypeahead()
    .withSkipPredicate((x) => x.disabled || !x.visible);

  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #keyUpHandler = (e: KeyboardEvent) => this.#handleKeyUp(e);
  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  constructor() {
    super();

    this[selectionManager].disableRovingTabIndex = true;
    this[selectionManager].addEventListener("activeItemChange", () => {
      if (this[selectionManager].activeItem) {
        this.#activateItem(this[selectionManager].activeItem);
      }
    });

    new FocusController(this, { callback: () => this.#updateFocusVisible() });
  }

  /** The selected item of the menu. */
  get selected(): M3eNavMenuItemElement | null {
    return this[selectionManager].selectedItems[0] ?? null;
  }

  /** All the items of the menu. */
  get items(): readonly M3eNavMenuItemElement[] {
    return this[selectionManager].items;
  }

  /**
   * Expands the specified items, or all items if no items are provided.
   * @param {M3eNavMenuItemElement | undefined} items The items to expand.
   */
  expand(items?: M3eNavMenuItemElement[]): void {
    (items ?? this[selectionManager].items).forEach((x) => x.expand());
  }

  /**
   * Collapses the specified items, or all items if no items are provided.
   * @param {M3eNavMenuItemElement | undefined} items The items to collapse.
   */
  collapse(items?: M3eNavMenuItemElement[]): void {
    (items ?? this[selectionManager].items).forEach((x) => x.collapse());

    const activeItem = this[selectionManager].activeItem;
    if (activeItem && !activeItem.visible) {
      for (let parent = activeItem.parentItem; parent; parent = parent.parentItem) {
        if (parent.visible) {
          this[selectionManager].setActiveItem(parent);
          break;
        }
      }
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("tabindex", "0");

    if (!isServer) {
      this.addEventListener("keydown", this.#keyDownHandler);
      this.addEventListener("keyup", this.#keyUpHandler);
      this.addEventListener("click", this.#clickHandler);
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (!isServer) {
      this.removeEventListener("keydown", this.#keyDownHandler);
      this.removeEventListener("keyup", this.#keyUpHandler);
      this.removeEventListener("click", this.#clickHandler);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @private */
  #handleSlotChange(): void {
    const { added } = this[selectionManager].setItems([...this.querySelectorAll("m3e-nav-menu-item")]);
    for (const item of added) {
      item.id = item.id || `m3e-nav-menu-item-${M3eNavMenuElement.__nextId++}`;
    }
    if (this[selectionManager].activeItem) {
      this.setAttribute("aria-activedescendant", this[selectionManager].activeItem.id);
      this.#updateFocusVisible();
    } else {
      this.removeAttribute("aria-activedescendant");
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#ignoreFocusVisible = false;
    this.#updateFocusVisible();

    const item = this[selectionManager].activeItem;
    if (e.defaultPrevented || !item || item.disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();

        if (item.ripple && !item.ripple.visible) {
          item.ripple.show(0, 0, true);
        }

        if (item.hasChildItems) {
          item.toggle();
        } else if (!item.selected) {
          this[selectionManager].select(item);
          item.link?.click();
        }
        break;

      case "*":
        e.preventDefault();
        item.expand(true);
        break;

      case "Left":
      case "ArrowLeft":
        e.preventDefault();
        if (item.hasChildItems && item.open) {
          item.collapse();
        } else {
          const parent = item.parentItem;
          if (parent) {
            parent.collapse();
            this[selectionManager].setActiveItem(parent);
          }
        }
        break;

      case "Right":
      case "ArrowRight":
        if (item.hasChildItems) {
          if (!item.open) {
            e.preventDefault();
            item.expand();
          } else {
            try {
              this[selectionManager].vertical = false;
              this[selectionManager].onKeyDown(e);
            } finally {
              this[selectionManager].vertical = true;
            }
          }
        } else {
          e.preventDefault();
        }
        break;

      default:
        this[selectionManager].onKeyDown(e);
        break;
    }
  }

  /** @private */
  #handleKeyUp(e: KeyboardEvent): void {
    const item = this[selectionManager].activeItem;
    if (e.defaultPrevented || !item || item.disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        item.ripple?.hide();
        break;
    }
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented && !this.#ignoreFocusVisible) {
      this.#ignoreFocusVisible = true;
      if (this[selectionManager].activeItem) {
        this.#updateItemFocusVisible(this[selectionManager].activeItem, true, false);
      }
    }
  }

  /** @private */
  #activateItem(item: M3eNavMenuItemElement): void {
    this.setAttribute("aria-activedescendant", item.id);
    scrollIntoViewIfNeeded(item, this, "instant");
    this.#updateFocusVisible();
  }

  /** @private */
  #updateFocusVisible(): void {
    const focused = this.matches(":focus");
    const focusVisible = !this.#ignoreFocusVisible && this.matches(":focus-visible");
    this[selectionManager].items.forEach((x) => {
      const active = x === this[selectionManager].activeItem;
      this.#updateItemFocusVisible(x, active && focused, active && focusVisible);
    });
  }

  /** @private */
  #updateItemFocusVisible(item: M3eNavMenuItemElement, focused: boolean, focusVisible: boolean): void {
    if (focused) {
      item.stateLayer?.show("focused");
    } else {
      item.stateLayer?.hide("focused");
    }
    if (focusVisible) {
      item.focusRing?.show();
    } else {
      item.focusRing?.hide();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-menu": M3eNavMenuElement;
  }
}
