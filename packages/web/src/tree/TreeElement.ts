import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import {
  customElement,
  DesignToken,
  FocusController,
  forcedColorsActive,
  PressedController,
  registerStyleSheet,
  Role,
  scrollIntoViewIfNeeded,
} from "@m3e/web/core";

import { SelectionManager, selectionManager } from "@m3e/web/core/a11y";
import { M3eDirectionality } from "@m3e/web/core/bidi";

import { M3eTreeItemElement } from "./TreeItemElement";

/**
 * Presents hierarchical data in a tree structure.
 *
 * @description
 * The `m3e-tree` component presents hierarchical data in a structure that users can
 * navigate, with nested levels that open and collapse as needed.
 *
 * @example
 * The following example illustrates a simple tree with nested child items.
 * ```html
 * <m3e-tree>
 *   <m3e-tree-item open>
 *     <span slot="label">Getting Started</span>
 *     <m3e-tree-item>
 *       <span slot="label">Overview</span>
 *     </m3e-tree-item>
 *     <m3e-tree-item>
 *       <span slot="label">Installation</span>
 *     </m3e-tree-item>
 *   </m3e-tree-item>
 *   <m3e-tree-item>
 *     <span slot="label">Components</span>
 *     <m3e-tree-item>
 *       <span slot="label">Button</span>
 *     </m3e-tree-item>
 *     <m3e-tree-item>
 *       <span slot="label">Card</span>
 *     </m3e-tree-item>
 *   </m3e-tree-item>
 * </m3e-tree>
 * ```
 *
 * @example
 * The next example demonstrates multi-selection with cascading selection state.
 * ```html
 * <m3e-tree multi cascade>
 *   <m3e-tree-item>
 *     <span slot="label">Fruits</span>
 *     <m3e-tree-item>
 *       <span slot="label">Apples</span>
 *     </m3e-tree-item>
 *     <m3e-tree-item>
 *       <span slot="label">Oranges</span>
 *     </m3e-tree-item>
 *     <m3e-tree-item>
 *       <span slot="label">Bananas</span>
 *     </m3e-tree-item>
 *   </m3e-tree-item>
 *   <m3e-tree-item>
 *     <span slot="label">Vegetables</span>
 *     <m3e-tree-item>
 *       <span slot="label">Carrots</span>
 *     </m3e-tree-item>
 *     <m3e-tree-item>
 *       <span slot="label">Broccoli</span>
 *     </m3e-tree-item>
 *     <m3e-tree-item>
 *       <span slot="label">Spinach</span>
 *     </m3e-tree-item>
 *   </m3e-tree-item>
 * </m3e-tree>
 * ```
 *
 * @tag m3e-tree
 *
 * @slot - Renders the items of the tree.
 *
 * @attr multi - Whether multiple items can be selected.
 * @attr cascade -Whether multiple item selection cascades to child items.
 *
 * @fires change - Emitted when the selected state changes.
 *
 * @cssprop --m3e-tree-scrollbar-width - Width of the tree scrollbar.
 * @cssprop --m3e-tree-scrollbar-color - Color of the tree scrollbar.
 */
@customElement("m3e-tree")
export class M3eTreeElement extends Role(LitElement, "tree") {
  static {
    // NOTE: unsafeCSS used here due to linting error with use of '>'.
    registerStyleSheet(css`
      ${unsafeCSS(`m3e-tree:has(> m3e-tree-item:state(-with-items)) {
        --_tree-item-toggle-display: flex;
      }`)}
    `);
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      outline: none;
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 0;
      scrollbar-width: ${DesignToken.scrollbar.width};
      scrollbar-color: ${DesignToken.scrollbar.color};
    }
    .base {
      width: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      min-height: inherit;
      box-sizing: border-box;
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ #ignoreFocusVisible = false;
  /** @private */ #ignoreFocus = false;

  /** @private */
  readonly [selectionManager] = new SelectionManager<M3eTreeItemElement>()
    .withVerticalOrientation()
    .withHomeAndEnd()
    .withPageUpAndDown()
    .withTypeahead()
    .withSkipPredicate((x) => x.disabled || !x.visible)
    .disableRovingTabIndex()
    .onActiveItemChange(() => {
      if (this[selectionManager].activeItem) {
        this.#activateItem(this[selectionManager].activeItem);
      }
    });

  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #keyUpHandler = () => this.#handleKeyUp();
  /** @private */ readonly #pointerDownHandler = (e: Event) => this.#handlePointerDown(e);

  constructor() {
    super();

    new PressedController(this, { callback: (pressed) => (this.#ignoreFocus = pressed) });
    new FocusController(this, {
      callback: () => {
        if (!this.#ignoreFocus) {
          this.#updateFocusVisible();
        }
      },
    });
  }

  /**
   * Whether multiple items can be selected.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) multi = false;

  /**
   * Whether multiple item selection cascades to child items.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) cascade = false;

  /** The selected items of the tree. */
  get selected(): readonly M3eTreeItemElement[] {
    return this[selectionManager].selectedItems;
  }

  /** All the items of the tree. */
  get items(): readonly M3eTreeItemElement[] {
    return this[selectionManager].items;
  }

  /**
   * Expands all items, and optionally, all descendants.
   * @param {boolean} [descendants=false] Whether to expand all descendants.
   */
  expand(descendants?: boolean): void;

  /**
   * Expands the specified items, and optionally, all descendants.
   * @param {M3eTreeItemElement[]} items The items to expand.
   * @param {boolean} [descendants=false] Whether to expand all descendants.
   */
  expand(items: M3eTreeItemElement[], descendants?: boolean): void;

  /** @internal */
  expand(itemsOrDescendants?: M3eTreeItemElement[] | boolean, maybeDescendants: boolean = false): void {
    const items = Array.isArray(itemsOrDescendants) ? itemsOrDescendants : this[selectionManager].items;
    const descendants = typeof itemsOrDescendants === "boolean" ? itemsOrDescendants : maybeDescendants;
    items.forEach((x) => x.expand(descendants));
  }

  /**
   * Collapses all items, and optionally, all descendants.
   * @param {boolean} [descendants=false] Whether to collapse all descendants.
   */
  collapse(descendants?: boolean): void;

  /**
   * Collapses the specified items, and optionally, all descendants.
   * @param {M3eTreeItemElement[]} items The items to collapse.
   * @param {boolean} [descendants=false] Whether to collapse all descendants.
   */
  collapse(items: M3eTreeItemElement[], descendants?: boolean): void;

  /** @internal */
  collapse(itemsOrDescendants?: M3eTreeItemElement[] | boolean, maybeDescendants: boolean = false): void {
    const items = Array.isArray(itemsOrDescendants) ? itemsOrDescendants : this[selectionManager].items;
    const descendants = typeof itemsOrDescendants === "boolean" ? itemsOrDescendants : maybeDescendants;

    items.forEach((x) => x.collapse(descendants));
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

  /**
   * Selects the specified item.
   * @param {M3eTreeItemElement} item The item to select.
   * @param {boolean} [activate=false] A value indicating whether to activate the item.
   */
  select(item: M3eTreeItemElement, activate: boolean = false): void {
    this[selectionManager].select(item, activate);
    item.indeterminate = false;
    if (this.multi && this.cascade) {
      if (item.hasChildItems) {
        item.childItems.forEach((x) => this.select(x));
      }

      this.#cascadeAncestorSelected(item);
    }
    if (activate) {
      this.#activateItem(item);
    }
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /**
   * Deselects the specified item.
   * @param {M3eTreeItemElement} item The item to deselect.
   */
  deselect(item: M3eTreeItemElement): void {
    this[selectionManager].deselect(item);
    item.indeterminate = false;
    if (this.multi && this.cascade) {
      if (item.hasChildItems) {
        item.childItems.forEach((x) => this.deselect(x));
      }

      this.#cascadeAncestorSelected(item);
    }
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("tabindex", "0");

    this.addEventListener("keydown", this.#keyDownHandler);
    this.addEventListener("keyup", this.#keyUpHandler);
    this.addEventListener("pointerdown", this.#pointerDownHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("keydown", this.#keyDownHandler);
    this.removeEventListener("keyup", this.#keyUpHandler);
    this.removeEventListener("pointerdown", this.#pointerDownHandler);
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("multi")) {
      this[selectionManager].multi = this.multi;
      if (this.multi) {
        this.setAttribute("aria-multiselectable", "true");
      } else {
        this.removeAttribute("aria-multiselectable");
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <slot @slotchange="${this.#handleSlotChange}"></slot>
    </div>`;
  }

  /** @private */
  #handleSlotChange(): void {
    const { added } = this[selectionManager].setItems([...this.querySelectorAll("m3e-tree-item")]);
    for (const item of added) {
      item.id = item.id || `m3e-tree-item-${M3eTreeElement.__nextId++}`;
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
        if (!this.multi) {
          if (!item.selected) {
            this.select(item);
            item.link?.click();
          }
        } else {
          if (item.ripple && !item.ripple.visible) {
            item.ripple.centered = true;
            item.ripple.show(0, 0, true);
            item.ripple.centered = false;
          }
          item.link?.click();
        }
        break;

      case " ":
        e.preventDefault();

        if (this.multi) {
          if (item.selected) {
            this.deselect(item);
          } else {
            this.select(item);
          }
        } else {
          if (item.ripple && !item.ripple.visible) {
            item.ripple.centered = true;
            item.ripple.show(0, 0, true);
            item.ripple.centered = false;
          }
          this.select(item);
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
        if (M3eDirectionality.current === "ltr") {
          if (item.hasChildItems && item.open) {
            requestAnimationFrame(() => item.collapse());
          } else {
            const parent = item.parentItem;
            if (parent) {
              this[selectionManager].setActiveItem(parent);
            }
          }
        } else if (item.hasChildItems && !item.open) {
          item.expand();
        }

        break;

      case "Right":
      case "ArrowRight":
        e.preventDefault();
        if (M3eDirectionality.current === "rtl") {
          if (item.hasChildItems && item.open) {
            requestAnimationFrame(() => item.collapse());
          } else {
            const parent = item.parentItem;
            if (parent) {
              this[selectionManager].setActiveItem(parent);
            }
          }
        } else if (item.hasChildItems && !item.open) {
          item.expand();
        }
        break;

      default:
        this[selectionManager].onKeyDown(e);
        break;
    }
  }

  /** @private */
  #handleKeyUp(): void {
    const item = this[selectionManager].activeItem;
    if (item && !item.disabled && item.ripple?.visible) {
      item.ripple.hide();
    }
  }

  /** @private */
  #handlePointerDown(e: Event): void {
    if (!e.defaultPrevented && !this.#ignoreFocusVisible && !forcedColorsActive()) {
      this.#ignoreFocusVisible = true;

      const item = e
        .composedPath()
        .reverse()
        .find((x) => x instanceof M3eTreeItemElement);

      if (item && !item.disabled) {
        this.#updateItemFocusVisible(item, true, false);
      }
    }
  }

  /** @private */
  #activateItem(item: M3eTreeItemElement): void {
    this.setAttribute("aria-activedescendant", item.id);
    if (item.label) {
      scrollIntoViewIfNeeded(item.label, this, { block: "nearest", behavior: "smooth" });
    }
    this.#updateFocusVisible();
  }

  /** @private */
  #updateFocusVisible(): void {
    const focusWithin = this.matches(":focus-within");
    const focused = focusWithin || this.matches(":focus");
    const focusVisible =
      focused &&
      !this.#ignoreFocusVisible &&
      (forcedColorsActive() ||
        this.matches(":focus-visible") ||
        (focusWithin && this.querySelector("a:focus-visible") !== null));

    this[selectionManager].items.forEach((x) => {
      const active = x === this[selectionManager].activeItem;
      this.#updateItemFocusVisible(x, active && focused, active && focusVisible);
    });
  }

  /** @private */
  #updateItemFocusVisible(item: M3eTreeItemElement, focused: boolean, focusVisible: boolean): void {
    if (focused && focusVisible) {
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

  /** @private */
  #cascadeAncestorSelected(item: M3eTreeItemElement): void {
    for (let parent = item.parentItem; parent; parent = parent.parentItem) {
      let hasSelected = false,
        hasDeselected = false;

      for (const child of parent.querySelectorAll("m3e-tree-item")) {
        hasSelected = hasSelected || child.selected;
        hasDeselected = hasDeselected || !child.selected;
        if (hasSelected && hasDeselected) {
          break;
        }
      }
      if (hasDeselected) {
        this[selectionManager].deselect(parent);
        parent.indeterminate = hasSelected;
      } else {
        this[selectionManager].select(parent, false);
        parent.indeterminate = false;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tree": M3eTreeElement;
  }
}
