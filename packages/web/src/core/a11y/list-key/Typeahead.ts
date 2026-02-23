/**
 * Adapted from Angular Material CDK KeyManager
 * Source: https://github.com/angular/components/blob/main/src/cdk/a11y/key-manager/typeahead.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { getKeyCode, KeyCode } from "../keycodes";
import { hasKeys } from "../../shared/mixins/hasKeys";

/** A symbol through which to access an element's textual content used for typeahead search. */
export const typeaheadLabel = Symbol("typeaheadLabel");

/** Defines functionality required for an item that supports searching using typeahead. */
export interface TypeaheadItem {
  /** Returns the textual content to search. */
  [typeaheadLabel]?(): string;
}

/**
 * Determines whether a value is a `TypeaheadItem`.
 * @param {unknown} value The value to test.
 * @returns A value indicating whether `value` is an `TypeaheadItem`.
 */
export function isTypeaheadItem(value: unknown): value is TypeaheadItem {
  return hasKeys<TypeaheadItem>(value, typeaheadLabel);
}

/** Encapsulates options used to select items based on typeahead.
 * @template T The type of `TypeaheadItem`.
 */
export interface TypeaheadOptions<T extends TypeaheadItem = TypeaheadItem> {
  /** The interval, in milliseconds, before searching items. */
  debounceInterval?: number;

  /** Function used to determine whether an item should be skipped. */
  skipPredicate?: (item: T) => boolean;

  /** Function invoked when an item is selected. */
  callback: (item: T) => void;
}

/**
 * Implements typeahead functionality which selects items based on keyboard input.
 * @template T The type of `TypeaheadItem`.
 */
export class Typeahead<T extends TypeaheadItem = TypeaheadItem> {
  /** @private */ #debounceInterval: number;
  /** @private */ #timeoutId = -1;
  /** @private */ #callback: (item: T) => void;
  /** @private */ #skipPredicate?: (item: T) => boolean;

  /** @private */ #pressedKeys = new Array<string>();
  /** @private */ #selectedIndex = -1;
  /** @private */ #items: readonly T[] = [];

  /**
   * Initializes a new instance of this class.
   * @param {TypeaheadOptions<T>} options Options that control typeahead behavior.
   */
  constructor(options: TypeaheadOptions<T>) {
    this.#debounceInterval = options.debounceInterval ?? 200;
    this.#callback = options.callback;
    this.#skipPredicate = options.skipPredicate;
  }

  /** A value indicating whether the user is currently typing. */
  get isTyping(): boolean {
    return this.#pressedKeys.length > 0;
  }

  /**
   * Sets the items to search.
   * @param {readonly T[]} items The items to search.
   */
  setItems(items: readonly T[]): void {
    this.#items = items;
  }

  /**
   * Sets the index of the selected item.
   * @param {number} index The index of the selected item.
   */
  setSelectedIndex(index: number): void {
    this.#selectedIndex = index;
  }

  /** Resets the stored sequence of typed characters. */
  reset(): void {
    this.#pressedKeys.length = 0;
  }

  /**
   * Sets the selected item depending on the key event passed in.
   * @param {KeyboardEvent} e The keyboard event to be used for determining which element should be active.
   */
  onKeyDown(e: KeyboardEvent): void {
    if (e.key && e.key.length === 1) {
      this.#appendKey(e.key);
    } else {
      const keycode = getKeyCode(e);
      if ((keycode >= KeyCode.A && keycode <= KeyCode.Z) || (keycode >= KeyCode.Zero && keycode <= KeyCode.Nine)) {
        this.#appendKey(String.fromCharCode(keycode));
      }
    }
  }

  /** @private */
  #appendKey(key: string): void {
    this.#pressedKeys.push(key.toLocaleUpperCase());
    clearTimeout(this.#timeoutId);
    this.#timeoutId = setTimeout(() => this.#searchItems(), this.#debounceInterval);
  }

  /** @private */
  #searchItems(): void {
    const term = this.#pressedKeys.join("");
    for (let i = 1; i < this.#items.length + 1; i++) {
      const index = (this.#selectedIndex + i) % this.#items.length;
      const item = this.#items[index];
      const label = item[typeaheadLabel]?.().toLocaleUpperCase().trim();
      if (!this.#skipPredicate?.(item) && label?.indexOf(term) === 0) {
        this.#callback(item);
        break;
      }
    }
    this.reset();
  }
}
