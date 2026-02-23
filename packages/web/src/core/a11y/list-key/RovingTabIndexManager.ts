import { FocusKeyManager } from "./FocusKeyManager";

/**
 * Utility for managing keyboard events and a roving tab index for selectable lists whose items directly receive focus.
 * @template T The type of managed item.
 */
export class RovingTabIndexManager<T extends HTMLElement> extends FocusKeyManager<T> {
  /** @private */ #disableRovingTabIndex = false;

  /** @inheritdoc */
  override updateActiveItem(item: T | null | undefined): void {
    super.updateActiveItem(item);

    if (!this.#disableRovingTabIndex) {
      item?.setAttribute("tabindex", "0");
      for (const other of this.items) {
        if (other !== item && other.hasAttribute("tabindex")) {
          other.setAttribute("tabindex", "-1");
        }
      }
    }
  }

  /** @inheritdoc */
  override setItems(items: T[]): { added: readonly T[]; removed: readonly T[] } {
    const result = super.setItems(items);

    if (!this.#disableRovingTabIndex) {
      for (const added of result.added) {
        if (added !== this.activeItem && !this.skipPredicate(added)) {
          added.setAttribute("tabindex", "-1");
        }
      }
    }

    return result;
  }

  /**
   * Configures whether roving tab index is disabled.
   * @param {boolean} [disabled=true] Whether the roving tab index is disabled.
   * @returns {RovingTabIndexManager<T>} The configured roving tab index manager.
   */
  disableRovingTabIndex(disabled: boolean = true): this {
    if (disabled !== this.#disableRovingTabIndex) {
      this.#disableRovingTabIndex = disabled;
      for (const item of this.items) {
        if (!this.skipPredicate(item)) {
          item?.setAttribute("tabindex", this.#disableRovingTabIndex || item === this.activeItem ? "0" : "-1");
        }
      }
    }

    return this;
  }
}
