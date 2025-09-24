/**
 * Adapted from Angular Material CDK KeyManager
 * Source: https://github.com/angular/components/blob/main/src/cdk/a11y/key-manager/list-key-manager.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { hasModifierKey, isModifierAllowed, ModifierKey } from "../keycodes";
import { isDisabledMixin } from "../../shared/mixins/Disabled";

import { ListManager } from "./ListManager";
import { Typeahead, TypeaheadItem } from "./Typeahead";

/**
 * Utility for managing keyboard events for selectable lists.
 * @template T The type of managed item.
 */
export class ListKeyManager<T extends HTMLElement & TypeaheadItem> extends ListManager<T> {
  /** @private */ #typeahead?: Typeahead<T>;

  /**
   * Whether the active item will wrap to the other end of
   * list when there are no more items in the given direction.
   * @default false
   */
  public wrap = false;

  /**
   * Whether to activate the first and last items respectively when
   * the `HOME` or `END` key is pressed.
   * @default false
   */
  public homeAndEnd = false;

  /**
   * Whether to activate every 10th (or configured) first/last item
   * in the up/down direction when the `PAGEUP` or `PAGEDOWN` key is pressed.
   * @default false
   */
  public pageUpAndDown = false;

  /**
   * The number of items to skip when the `PAGEUP` or `PAGEDOWN` key is pressed.
   * @default 10
   */
  public pageDelta = 10;

  /**
   * Whether to the list is oriented vertically.
   * @default false
   */
  public vertical = false;

  /** The allowed modifier keys.
   * @default []
   */
  public allowedModifiers: ModifierKey[] = [];

  /**
   * A function used to skip items.
   * @param {T} item The item to test.
   * @returns {boolean} Whether `item` should be skipped.
   */
  public skipPredicate: (item: T) => boolean = (item) => isDisabledMixin(item) && item.disabled;

  /** @inheritdoc */
  override setItems(items: T[]): { added: readonly T[]; removed: readonly T[] } {
    this.#typeahead?.setItems(items);
    return super.setItems(items);
  }

  /** @inheritdoc */
  override updateActiveItem(item: T | null | undefined): void {
    super.updateActiveItem(item);
    if (this.#typeahead) {
      this.#typeahead.setSelectedIndex(item ? this.items.indexOf(item) : -1);
    }
  }

  /**
   * Configures the key manager to activate the first and last items respectively when the `HOME` or `END` key is pressed.
   * @param {boolean} [enabled = true] Whether to activate the first and last items respectively when
   * the `HOME` or `END` key is pressed.
   * @returns {ListKeyManager<T>} The configured key manager.
   */
  withHomeAndEnd(enabled: boolean = true): this {
    this.homeAndEnd = enabled;
    return this;
  }

  /**
   * Configures the key manager to page up and down when the `PAGEUP` or `PAGEDOWN` key is pressed.
   * @param {boolean} [enabled = true] Whether to activate page up and down when the `PAGEUP` or `PAGEDOWN` key is pressed.
   * @param {number} [pageDelta=10] The number of items to skip when the `PAGEUP` or `PAGEDOWN` key is pressed.
   * @returns {ListKeyManager<T>} The configured key manager.
   */
  withPageUpAndDown(enabled: boolean = true, pageDelta: number = 10): this {
    this.pageUpAndDown = enabled;
    this.pageDelta = pageDelta;
    return this;
  }

  /**
   * Configures wrapping mode, which determines whether the active item will wrap to the other end of list when there are no more items in the given direction.
   * @param {boolean} [enabled = true] Whether the active item will wrap to the other end of
   * list when there are no more items in the given direction.
   * @returns {ListKeyManager<T>} The configured key manager.
   */
  withWrap(enabled: boolean = true): this {
    this.wrap = enabled;
    return this;
  }

  /**
   * Configures whether to move the selection vertically.
   * @param {boolean} [enabled = true] Whether to move selection vertically.
   * @returns {ListKeyManager<T>} The configured key manager.
   */
  withVerticalOrientation(enabled: boolean = true): this {
    this.vertical = enabled;
    return this;
  }

  /**
   * Configured allowed modifier keys.
   * @param {ModifierKey[]} modifiers The allowed modifier keys.
   * @returns {ListKeyManager<T>} The configured key manager.
   */
  withAllowedModifiers(...modifiers: ModifierKey[]): this {
    this.allowedModifiers = modifiers;
    return this;
  }

  /**
   * Configures whether typeahead is enabled.
   * @param {boolean} [enabled = true] Whether typeahead is enabled.
   * @returns {ListKeyManager<T>} The configured key manager.
   */
  withTypeahead(enabled: boolean = true): this {
    if (enabled) {
      this.#typeahead = new Typeahead<T>({ callback: (item) => this.setActiveItem(item) });
    } else {
      this.#typeahead = undefined;
    }
    return this;
  }

  /**
   * Configures a function used to test whether an item should be skipped.
   * @param skipPredicate A function used to determine whether an item should be skipped.
   * @returns {ListKeyManager<T>} The configured key manager.
   */
  withSkipPredicate(skipPredicate: (item: T) => boolean): this {
    this.skipPredicate = skipPredicate;
    return this;
  }

  /**
   * Sets the active item depending on the key event passed in.
   * @param {KeyboardEvent} e The keyboard event to be used for determining which element should be active.
   */
  onKeyDown(e: KeyboardEvent): void {
    if (e.defaultPrevented) return;

    const modifierAllowed = isModifierAllowed(e, ...this.allowedModifiers);

    switch (e.key) {
      case "Left":
      case "ArrowLeft":
        if (modifierAllowed && !this.vertical) {
          e.preventDefault();
          const prev = this.#findPrevious();
          if (prev) {
            this.setActiveItem(prev);
          }
        }
        break;
      case "Up":
      case "ArrowUp":
        if (modifierAllowed) {
          e.preventDefault();
          const prev = this.#findPrevious();
          if (prev) {
            this.setActiveItem(prev);
          }
        }

        break;

      case "Right":
      case "ArrowRight":
        if (modifierAllowed && !this.vertical) {
          e.preventDefault();
          const next = this.#findNext();
          if (next) {
            this.setActiveItem(next);
          }
        }
        break;

      case "Down":
      case "ArrowDown":
        if (modifierAllowed) {
          e.preventDefault();
          const next = this.#findNext();
          if (next) {
            this.setActiveItem(next);
          }
        }

        break;

      case "Home":
        if (modifierAllowed && this.homeAndEnd) {
          e.preventDefault();
          const first = this.#findFirst();
          if (first) {
            this.setActiveItem(first);
          }
        }

        break;

      case "End":
        if (modifierAllowed && this.homeAndEnd) {
          e.preventDefault();
          const last = this.#findLast();
          if (last) {
            this.setActiveItem(last);
          }
        }

        break;

      case "PageUp":
        if (modifierAllowed && this.pageUpAndDown) {
          e.preventDefault();
          const prev = this.#findPreviousByIndex(
            this.activeItem ? Math.max(0, this.items.indexOf(this.activeItem) - this.pageDelta) : 0
          );
          if (prev) {
            this.setActiveItem(prev);
          }
        }

        break;

      case "PageDown":
        if (modifierAllowed && this.pageUpAndDown) {
          e.preventDefault();
          const next = this.#findNextByIndex(
            this.activeItem
              ? Math.min(this.items.length - 1, this.items.indexOf(this.activeItem) + this.pageDelta)
              : this.items.length - 1
          );
          if (next) {
            this.setActiveItem(next);
          }
        }

        break;

      default:
        if (modifierAllowed || hasModifierKey(e, "shift")) {
          this.#typeahead?.onKeyDown(e);
        }
        break;
    }
  }

  /** @private */
  #findFirst(): T | null {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === this.activeItem) break;
      const test = this.items[i];
      if (!this.skipPredicate(test)) {
        return test;
      }
    }
    return null;
  }

  /** @private */
  #findLast(): T | null {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.items[i] === this.activeItem) break;
      const test = this.items[i];
      if (!this.skipPredicate(test)) {
        return test;
      }
    }
    return null;
  }

  /** @private */
  #findNext(): T | null {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === this.activeItem) {
        for (let j = i + 1; j < this.items.length; j++) {
          const test = this.items[j];
          if (!this.skipPredicate(test)) {
            return test;
          }
        }
        break;
      }
    }
    return this.wrap ? this.#findFirst() : null;
  }

  /** @private */
  #findPrevious(): T | null {
    for (let i = 0; i < this.items.length; i++) {
      if (this.items[i] === this.activeItem) {
        for (let j = i - 1; j >= 0; j--) {
          const test = this.items[j];
          if (!this.skipPredicate(test)) {
            return test;
          }
        }
        break;
      }
    }
    return this.wrap ? this.#findLast() : null;
  }

  /** @private */
  #findPreviousByIndex(index: number): T | null {
    for (let i = index; i >= 0; i--) {
      const test = this.items[i];
      if (!this.skipPredicate(test)) {
        return test;
      }
    }
    return null;
  }

  /** @private */
  #findNextByIndex(index: number): T | null {
    for (let i = index; i < this.items.length; i++) {
      const test = this.items[i];
      if (!this.skipPredicate(test)) {
        return test;
      }
    }
    return null;
  }
}
