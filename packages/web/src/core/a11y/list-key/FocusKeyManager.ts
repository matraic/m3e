import { ListKeyManager } from "./ListKeyManager";

/**
 * Utility for managing keyboard events for selectable lists whose items directly receive focus.
 * @template T The type of managed item.
 */
export class FocusKeyManager<T extends HTMLElement> extends ListKeyManager<T> {
  /** @private */ #focusOptions?: FocusOptions;

  /** @inheritdoc */
  override setActiveItem(item: T | null | undefined): void {
    super.setActiveItem(item);
    item?.focus(this.#focusOptions);
  }

  /**
   * Configures the key manager with options used to focus items.
   * @param {FocusOptions} options Options used to focus items.
   * @returns {FocusKeyManager<T>} The configured key manager.
   */
  withOptions(options: FocusOptions): this {
    this.#focusOptions = options;
    return this;
  }
}
