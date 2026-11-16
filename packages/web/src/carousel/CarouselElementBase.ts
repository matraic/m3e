import { LitElement } from "lit";
import { property } from "lit/decorators.js";

import { AttachInternals, Role } from "@m3e/web/core";
import { RovingTabIndexManager } from "@m3e/web/core/a11y";

import { M3eCarouselItemActionElement } from "./CarouselItemActionElement";
import { M3eCarouselItemElement } from "./CarouselItemElement";

/** Describes a change to the current carousel item. */
export interface CarouselChangeDetail {
  /** The zero-based index of the new current carousel item. */
  readonly index: number;

  /** The new current carousel item. */
  readonly item: M3eCarouselItemElement;
}

/**
 * Provides the shared item, navigation, and focus behavior for carousel presentations.
 * This class must be inherited.
 * @internal
 */
export abstract class CarouselElementBase extends AttachInternals(Role(LitElement, "grid")) {
  /** @private */ protected _focusWithin = false;

  /** @private */
  protected readonly _focusKeyManager = new RovingTabIndexManager<M3eCarouselItemActionElement>()
    .withHomeAndEnd()
    .withOptions({ preventScroll: true })
    .onActiveItemChange(() => {
      const index = this.items.findIndex((item) => item.action === this._focusKeyManager.activeItem);

      if (index >= 0) this._moveTo(index, false, true);
    });

  /**
   * The zero-based index of the current item.
   * @default 0
   */
  @property({ attribute: "selected-index", type: Number, reflect: true }) selectedIndex = 0;

  /** The visible carousel items in slot order. */
  abstract get items(): readonly M3eCarouselItemElement[];

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._focusWithin = false;
  }

  /** Moves to the previous item. */
  movePrevious(): void {
    this._moveTo(this.selectedIndex - 1, true, true);
  }

  /** Moves to the next item. */
  moveNext(): void {
    this._moveTo(this.selectedIndex + 1, true, true);
  }

  /**
   * Moves to the specified item.
   * @param {number} index The zero-based index of the item to navigate to.
   */
  moveTo(index: number): void {
    this._moveTo(index, true, true);
  }

  /** @private */
  protected abstract _moveTo(index: number, scroll: boolean, emit: boolean): void;

  /** @private */
  protected _clampIndex(index: number): number {
    if (!this.items.length || !Number.isFinite(index)) return 0;

    return Math.max(0, Math.min(this.items.length - 1, Math.trunc(index)));
  }

  /** @private */
  protected _setSelectedIndex(index: number, emit: boolean): number {
    if (!this.items.length || !Number.isFinite(index)) return this.selectedIndex;

    const selectedIndex = this._clampIndex(index);

    if (selectedIndex === this.selectedIndex) return selectedIndex;

    this.selectedIndex = selectedIndex;

    if (emit) {
      this.dispatchEvent(
        new CustomEvent<CarouselChangeDetail>("change", {
          detail: { index: selectedIndex, item: this.items[selectedIndex] },
          bubbles: true,
          composed: true,
        }),
      );
    }

    return selectedIndex;
  }

  /** @private */
  protected async _syncFocusActions(items: readonly M3eCarouselItemElement[] = this.items): Promise<void> {
    await Promise.all(items.map((item) => item.updateComplete));

    const actions = items.map((item) => item.action).filter((action) => action !== undefined);

    await Promise.all(actions.map((action) => action.updateComplete));

    if (!this.isConnected || items !== this.items) return;

    const previous = this._focusKeyManager.activeItem;
    const previousIndex = previous ? this._focusKeyManager.items.indexOf(previous) : this.selectedIndex;
    const { removed } = this._focusKeyManager.setItems(actions);

    for (const action of removed) {
      const root = action.getRootNode();
      const retained = this.contains(root instanceof ShadowRoot ? root.host : action);

      if (!action.hasAttribute("disabled")) action.setAttribute("tabindex", retained ? "-1" : "0");
    }

    const enabled = actions.filter((action) => !this._focusKeyManager.skipPredicate(action));
    const active =
      previous && enabled.includes(previous)
        ? previous
        : (enabled.find((action) => actions.indexOf(action) >= previousIndex) ?? enabled[enabled.length - 1]);

    this._focusKeyManager.updateActiveItem(active);

    if (previous && previous !== active && this._focusWithin) {
      if (active) this._focusKeyManager.setActiveItem(active);
      else this._focusFallback()?.focus({ preventScroll: true });
    }
  }

  /** @private */
  protected _handleItemFocusIn(event: FocusEvent): number {
    this._focusWithin = true;

    const path = event.composedPath();
    const index = this.items.findIndex((item) => path.includes(item));

    if (index < 0) return -1;

    this._focusKeyManager.updateActiveItem(this.items[index].action);

    return index;
  }

  /** @private */
  protected _handleItemFocusOut(event: FocusEvent): void {
    const item = event.composedPath().find((target) => target instanceof M3eCarouselItemElement);

    if (event.relatedTarget === null && item instanceof M3eCarouselItemElement) {
      queueMicrotask(() => {
        if (!item.disabled && !item.hidden && this.contains(item) && !this.matches(":focus-within")) {
          this._focusWithin = false;
        }
      });

      return;
    }

    if (!(event.relatedTarget instanceof Node) || !this.contains(event.relatedTarget)) this._focusWithin = false;
  }

  /** @private */
  protected _itemIndexFromEvent(event: Event): number {
    const path = event.composedPath();

    return this.items.findIndex((item) => path.includes(item));
  }

  /** @private */
  protected _setActiveAction(index: number): void {
    this._focusKeyManager.updateActiveItem(this.items[index]?.action);
  }

  /** @private */
  protected _handleLinearKeyDown(event: KeyboardEvent, vertical: boolean, directionality: "ltr" | "rtl"): void {
    this._focusKeyManager
      .withVerticalOrientation(vertical)
      .withDirectionality(vertical ? "ltr" : directionality)
      .onKeyDown(event);
  }

  /** @private */
  protected _focusFallback(): HTMLElement | undefined {
    return this.shadowRoot?.querySelector<HTMLElement>(".viewport") ?? undefined;
  }
}
