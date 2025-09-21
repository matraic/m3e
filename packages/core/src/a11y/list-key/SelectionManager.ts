import { LitElement } from "lit";

import { CheckedOrSelectedMixin, checkOrSelect, isCheckedOrSelected } from "../../shared/mixins/CheckedOrSelected";
import { DisabledMixin } from "../../shared/mixins/Disabled";

import { RadioKeyManager } from "./RadioKeyManager";
import { ListManagerEventMap } from "./ListManager";

/** A symbol through which to access an element's selection manager. */
export const selectionManager = Symbol("selectionManager");

/**
 * Utility for managing keyboard events for selectable lists where one or more items can be selected.
 * @template T The type of managed item.
 */

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class SelectionManager<
  T extends LitElement & DisabledMixin & CheckedOrSelectedMixin
> extends RadioKeyManager<T> {
  /** @private */ #selectedItems = new Array<T>();
  /** @private */ #multi = false;

  /** A value indicating whether multiple items can be selected. */
  get multi(): boolean {
    return this.#multi;
  }
  set multi(value: boolean) {
    this.#multi = value;
    this.#enforceSingleSelect(true);
  }

  /** The selected items. */
  get selectedItems(): readonly T[] {
    return this.#selectedItems;
  }

  /**
   * Selects or deselects the item based on the item's checked or selected state.
   * @param {T} item The item whose selection state has changed.
   */
  notifySelectionChange(item: T): void {
    if (isCheckedOrSelected(item)) {
      this.select(item);
    } else {
      this.deselect(item);
    }
  }

  /**
   * Deselects the specified item.
   * @param {T} item The item to deselect.
   */
  deselect(item: T): void {
    if (isCheckedOrSelected(item)) {
      checkOrSelect(item, false);
    }

    const index = this.#selectedItems.indexOf(item);
    if (index >= 0) {
      this.#selectedItems.splice(index, 1);
      this.dispatchEvent(new Event("selectionChange"));
    }
  }

  /**
   * Updates the selected item.
   * @param {T | null | undefined} item The selected item.
   * @param {boolean} [activate=true] A value indicating whether to activate the item.
   */
  select(item: T | null | undefined, activate: boolean = true): void {
    if (!this.multi) {
      for (const selected of this.#selectedItems) {
        if (selected !== item) {
          checkOrSelect(selected, false);
        }
      }
      this.#selectedItems.length = 0;
    }

    if (item) {
      this.#selectedItems.push(item);
      if (!isCheckedOrSelected(item)) {
        checkOrSelect(item, true);
      }
    }

    if (activate) {
      this.updateActiveItem(item);
    }

    this.dispatchEvent(new Event("selectionChange"));
  }

  /** @inheritdoc */
  override setItems(items: T[]): { added: readonly T[]; removed: readonly T[] } {
    const { added, removed } = super.setItems(items);

    this.#selectedItems = this.#selectedItems.filter((x) => !removed.includes(x));
    this.#selectedItems.push(...added.filter((x) => isCheckedOrSelected(x)));
    this.#enforceSingleSelect();
    this.dispatchEvent(new Event("selectionChange"));
    return { added, removed };
  }

  /** @private */
  #enforceSingleSelect(emit = false): void {
    if (!this.multi && this.#selectedItems.length > 1) {
      for (let i = 1; i < this.#selectedItems.length; i++) {
        checkOrSelect(this.#selectedItems[i], false);
      }
      this.#selectedItems.length = 1;
      if (emit) {
        this.dispatchEvent(new Event("selectionChange"));
      }
    }
  }
}

export interface SelectionManagerEventMap extends ListManagerEventMap {
  selectionChange: Event;
}

export interface SelectionManager<T> {
  addEventListener<K extends keyof SelectionManagerEventMap>(
    type: K,
    listener: (this: SelectionManager<T>, ev: SelectionManagerEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof SelectionManagerEventMap>(
    type: K,
    listener: (this: SelectionManager<T>, ev: SelectionManagerEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}
