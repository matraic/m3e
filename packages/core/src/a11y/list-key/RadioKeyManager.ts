import { LitElement } from "lit";

import { CheckedOrSelectedMixin, isCheckedOrSelected } from "../../shared/mixins/CheckedOrSelected";
import { DisabledMixin } from "../../shared/mixins/Disabled";

import { RovingTabIndexManager } from "./RovingTabIndexManager";

/**
 * Utility for managing keyboard events for selectable lists whose items behave like a radio.
 * @template T The type of managed item.
 */
export class RadioKeyManager<
  T extends LitElement & DisabledMixin & CheckedOrSelectedMixin
> extends RovingTabIndexManager<T> {
  /** @private */ #disabled = false;

  /** A value indicating whether managed items are disabled. */
  get disabled(): boolean {
    return this.#disabled;
  }
  set disabled(value: boolean) {
    this.#disabled = value;
    this.items.forEach((x) => (x.disabled = value));
  }

  /** @inheritdoc */
  override setItems(items: T[]): { added: readonly T[]; removed: readonly T[] } {
    if (this.disabled) {
      items.forEach((x) => (x.disabled = true));
    }

    const { added, removed } = super.setItems(items);

    if (added.length > 0 || removed.length > 0) {
      if (!this.activeItem) {
        this.updateActiveItem(added.find((x) => !this.skipPredicate(x)) ?? null);
      }

      if (this.activeItem && (this.activeItem.disabled || !isCheckedOrSelected(this.activeItem))) {
        const checked = added.find((x) => !this.skipPredicate(x) && isCheckedOrSelected(x));
        if (checked) {
          this.updateActiveItem(checked);
        }
      }
    }

    return { added, removed };
  }
}
