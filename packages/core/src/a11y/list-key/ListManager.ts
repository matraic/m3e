/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

/**
 * Utility for managing a list of items which supports activation.
 * @template T The type of managed item.
 *
 * @fires activeItemChange - Emitted when the active item changes.
 */
export class ListManager<T> extends EventTarget {
  /** @private */ #items = new Array<T>();
  /** @private */ #activeItem: T | null = null;

  /** The items being managed. */
  get items(): ReadonlyArray<T> {
    return this.#items;
  }

  /** The active item. */
  get activeItem(): T | null {
    return this.#activeItem;
  }

  /**
   * Sets the items to manage.
   * @param {Array<T>} items The new items.
   * @returns {{ added: ReadonlyArray<T>; removed: ReadonlyArray<T> }} An object specifying added and removed items.
   */
  setItems(items: Array<T>): { added: ReadonlyArray<T>; removed: ReadonlyArray<T> } {
    const removed = this.items.filter((x) => !items.includes(x));
    const added = items.filter((x) => !this.items.includes(x));

    this.#items = items;

    if (this.activeItem && !this.items.includes(this.activeItem)) {
      this.updateActiveItem(null);
    }

    return { added, removed };
  }

  /**
   * Sets the active item.
   * @param {T | null | undefined} item The new active item.
   */
  setActiveItem(item: T | null | undefined): void {
    if (this.activeItem !== item) {
      this.updateActiveItem(item);
      this.dispatchEvent(new Event("activeItemChange"));
    }
  }

  /**
   * Updates the active item.
   * @param {T | null | undefined} item The active item.
   */
  updateActiveItem(item: T | null | undefined): void {
    this.#activeItem = item ?? null;
  }
}

export interface ListManagerEventMap {
  activeItemChange: Event;
}

export interface ListManager<T> {
  addEventListener<K extends keyof ListManagerEventMap>(
    type: K,
    listener: (this: ListManager<T>, ev: ListManagerEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof ListManagerEventMap>(
    type: K,
    listener: (this: ListManager<T>, ev: ListManagerEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}
