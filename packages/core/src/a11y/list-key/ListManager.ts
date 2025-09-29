/**
 * Utility for managing a list of items which supports activation.
 * @template T The type of managed item.
 */
export class ListManager<T> {
  /** @private */ #items = new Array<T>();
  /** @private */ #activeItem: T | null = null;
  /** @private */ #onActiveItemChangeCallback?: () => void;

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
      this.#onActiveItemChangeCallback?.();
    }
  }

  /**
   * Updates the active item.
   * @param {T | null | undefined} item The active item.
   */
  updateActiveItem(item: T | null | undefined): void {
    this.#activeItem = item ?? null;
  }

  /**
   * Configures the list manager with a callback invoked when an item is activated.
   * @param {() => void} callback The callback invoked when an item is activated.
   * @returns {ListManager<T>} The configured list manager.
   */
  onActiveItemChange(callback: () => void): this {
    this.#onActiveItemChangeCallback = callback;
    return this;
  }
}
