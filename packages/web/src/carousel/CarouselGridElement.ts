/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { CSSResultGroup, html, PropertyValues } from "lit";
import { query } from "lit/decorators.js";

import { customElement, MutationController } from "@m3e/web/core";
import { M3eDirectionality } from "@m3e/web/core/bidi";

import { CarouselChangeDetail, CarouselElementBase } from "./CarouselElementBase";
import { M3eCarouselItemActionElement } from "./CarouselItemActionElement";
import { M3eCarouselItemElement } from "./CarouselItemElement";

import { CarouselGridStyle } from "./styles";

/**
 * Arranges items in a responsive, vertically scrolling grid.
 *
 * @description
 * The `m3e-carousel-grid` component presents `m3e-carousel-item` elements in rows and columns, adding columns as
 * space permits. CSS custom properties control the minimum item width, spacing, and aspect ratio.
 *
 * The grid supports two-dimensional keyboard navigation with one Tab stop and shares the carousel's navigation
 * properties and methods. It can stand alone or provide a Show all view for a carousel, with the application
 * rendering the same collection in both components.
 *
 * @tag m3e-carousel-grid
 *
 * @slot - A sequence of `m3e-carousel-item` elements.
 *
 * @attr selected-index - The zero-based index of the current item.
 *
 * @fires change - Dispatched when user navigation changes the active item.
 *
 * @cssprop --m3e-carousel-grid-item-min-width - Minimum item width before another grid column is added.
 * @cssprop --m3e-carousel-grid-item-gap - The spacing between grid items.
 * @cssprop --m3e-carousel-grid-item-aspect-ratio - The aspect ratio of each grid item.
 *
 * @example
 * Display items in a responsive grid. Replace the image placeholder and add more items.
 * ```html
 * <m3e-carousel-grid class="carousel-grid-demo" aria-label="Featured destinations">
 *   <m3e-carousel-item>
 *     <img src="[YOUR IMAGE URL HERE]" alt="" loading="lazy" />
 *     <span slot="title">Coast</span>
 *     <span slot="subtitle">Follow the ocean breeze</span>
 *   </m3e-carousel-item>
 *   <!-- Additional items omitted for brevity -->
 * </m3e-carousel-grid>
 * ```
 * ```css
 * .carousel-grid-demo {
 *   --m3e-carousel-grid-item-min-width: 186px;
 *   --m3e-carousel-item-scrim-opacity: 0.65;
 * }
 * ```
 *
 * @example
 * ```html
 * <m3e-carousel-grid aria-label="All destinations">
 *   <m3e-carousel-item href="/destinations/coast">Coast</m3e-carousel-item>
 *   <m3e-carousel-item href="/destinations/forest">Forest</m3e-carousel-item>
 * </m3e-carousel-grid>
 * ```
 */
@customElement("m3e-carousel-grid")
export class M3eCarouselGridElement extends CarouselElementBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = CarouselGridStyle;

  /** @private */ @query(".column-probe") private _columnProbe!: HTMLElement;
  /** @private */ @query(".item-width-probe") private _itemWidthProbe!: HTMLElement;
  /** @private */ @query(".gap-probe") private _gapProbe!: HTMLElement;

  /** @private */ #items: M3eCarouselItemElement[] = [];
  /** @private */ #columns = 1;

  /** @private */ readonly #probeSizes = new Map<Element, number>();
  /** @private */ #resizeObserver?: ResizeObserver;
  /** @private */ #managedSlots = new Map<M3eCarouselItemElement, { original: string | null; assigned: string }>();
  /** @private */ #generatedColumnIndices = new WeakMap<M3eCarouselItemElement, string>();

  /** @private */
  readonly #childrenMutationController = new MutationController(this, {
    target: null,
    config: { childList: true },
    callback: () => this.#syncItems(),
  });

  /** @private */
  readonly #itemMutationController = new MutationController(this, {
    target: null,
    config: { attributes: true, attributeFilter: ["hidden", "disabled"] },
    callback: () => this.#syncItems(),
  });

  /** @inheritdoc */
  override get items(): readonly M3eCarouselItemElement[] {
    return this.#items;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    if (this.hasUpdated) {
      this.#childrenMutationController.observe(this);
      this.#syncItems();
      this.#observeColumnProbe();
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#resizeObserver?.disconnect();
    this.#probeSizes.clear();

    for (const [item, slot] of this.#managedSlots) {
      this.#restoreSlot(item, slot);
      this.#restoreColumnIndex(item);
      item.vertical = false;
    }

    this.#managedSlots.clear();
  }

  /** @inheritdoc */
  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    this.#childrenMutationController.observe(this);
    this.#syncItems();
    this.#observeColumnProbe();
  }

  /** @inheritdoc */
  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    this.ariaRowCount = `${Math.ceil(this.#items.length / this.#columns)}`;
    this.ariaColCount = `${this.#columns}`;

    if (changedProperties.has("selectedIndex")) {
      const selectedIndex = this._clampIndex(this.selectedIndex);

      if (selectedIndex !== this.selectedIndex) this.selectedIndex = selectedIndex;
      else this.#scrollToItem(selectedIndex);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const rows: M3eCarouselItemElement[][] = [];

    for (let index = 0; index < this.#items.length; index += this.#columns) {
      rows.push(this.#items.slice(index, index + this.#columns));
    }

    return html`
      <div class="column-probe" aria-hidden="true">
        <div class="item-width-probe"></div>
        <div class="gap-probe"></div>
      </div>
      <div
        class="collection"
        tabindex="-1"
        @keydown=${this.#handleKeyDown}
        @focusin=${this.#handleFocusIn}
        @focusout=${this.#handleFocusOut}
        @click=${this.#handleClick}
      >
        ${rows.map(
          (items, rowIndex) => html`
            <div class="row" role="row" aria-rowindex=${rowIndex + 1}>
              ${items.map((item) => html`<slot name=${this.#managedSlots.get(item)?.assigned ?? ""}></slot>`)}
            </div>
          `,
        )}
      </div>
      <slot class="collector" @slotchange=${this.#handleCollectorSlotChange}></slot>
    `;
  }

  /** @private */
  protected override _moveTo(index: number, scroll: boolean, emit: boolean): void {
    if (!this.#items.length || !Number.isFinite(index)) {
      return;
    }

    const selectedIndex = this._setSelectedIndex(index, emit);

    if (scroll) {
      this.#scrollToItem(selectedIndex);
    }
  }

  /** @private */
  #observeColumnProbe(): void {
    if (!this.#resizeObserver) {
      if (typeof ResizeObserver === "undefined") {
        console.warn("Carousel grid error: the browser does not support ResizeObserver.");

        return;
      }

      this.#resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const size: ResizeObserverSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          this.#probeSizes.set(entry.target, size.inlineSize);
        }

        this.#updateColumns();
      });
    }

    this.#resizeObserver.observe(this._columnProbe);
    this.#resizeObserver.observe(this._itemWidthProbe);
    this.#resizeObserver.observe(this._gapProbe);
  }

  /** @private */
  #updateColumns(): void {
    const width = this.#probeSizes.get(this._columnProbe);
    const itemWidth = this.#probeSizes.get(this._itemWidthProbe);
    const gapProbeWidth = this.#probeSizes.get(this._gapProbe);

    if (!width || itemWidth === undefined || gapProbeWidth === undefined) {
      return;
    }

    // The second probe track occupies the container width minus its column gap.
    const gap = Math.max(0, width - gapProbeWidth);
    // Match auto-fill's minimum track sizing, including its 1px floor for counting tracks.
    const columns = Math.max(1, Math.floor((width + gap) / (Math.max(1, itemWidth) + gap)));

    if (!columns || columns === this.#columns) {
      return;
    }

    this.#columns = columns;
    this.style.setProperty("--_carousel-grid-columns", `${columns}`);
    this.#syncPositions();
    this.requestUpdate();
  }

  /** @private */
  #handleCollectorSlotChange(): void {
    this.#syncItems();
  }

  /** @private */
  #syncItems(): void {
    const children = [...this.children].filter(
      (child): child is M3eCarouselItemElement =>
        child instanceof M3eCarouselItemElement &&
        (this.#managedSlots.has(child) || !child.hasAttribute("slot") || child.slot === ""),
    );

    const childSet = new Set(children);

    for (const target of this.#itemMutationController.targets) {
      if (target instanceof M3eCarouselItemElement && !childSet.has(target)) {
        this.#itemMutationController.unobserve(target);
      }
    }

    for (const item of children) {
      if (!this.#itemMutationController.isObserving(item)) this.#itemMutationController.observe(item);
    }

    const items = children.filter((item) => !item.hidden);
    const itemSet = new Set(items);

    for (const [item, slot] of this.#managedSlots) {
      if (itemSet.has(item)) continue;

      this.#restoreSlot(item, slot);
      this.#restoreColumnIndex(item);
      item.vertical = false;
      this.#managedSlots.delete(item);
    }

    this.#items = items;

    this.#items.forEach((item, index) => {
      let slot = this.#managedSlots.get(item);

      if (!slot) {
        slot = { original: item.getAttribute("slot"), assigned: "" };
        this.#managedSlots.set(item, slot);
      }

      const assigned = `m3e-carousel-grid-item-${index}`;

      if (slot.assigned !== assigned || item.getAttribute("slot") !== assigned) {
        slot.assigned = assigned;
        item.setAttribute("slot", assigned);
      }

      item.vertical = false;
    });

    this.#syncPositions();

    const selectedIndex = this._clampIndex(this.selectedIndex);

    if (selectedIndex !== this.selectedIndex) {
      this.selectedIndex = selectedIndex;
    }

    void this._syncFocusActions(this.#items);
    this.requestUpdate();
  }

  /** @private */
  #syncPositions(): void {
    this.#items.forEach((item, index) => {
      const value = `${(index % this.#columns) + 1}`;
      const generated = this.#generatedColumnIndices.get(item);

      if (!item.hasAttribute("aria-colindex") || item.getAttribute("aria-colindex") === generated) {
        item.setAttribute("aria-colindex", value);
        this.#generatedColumnIndices.set(item, value);
      }
    });
  }

  /** @private */
  #restoreSlot(item: M3eCarouselItemElement, slot: { original: string | null; assigned: string }): void {
    if (item.getAttribute("slot") !== slot.assigned) return;

    if (slot.original === null) item.removeAttribute("slot");
    else item.setAttribute("slot", slot.original);
  }

  /** @private */
  #restoreColumnIndex(item: M3eCarouselItemElement): void {
    const generated = this.#generatedColumnIndices.get(item);

    if (generated && item.getAttribute("aria-colindex") === generated) item.removeAttribute("aria-colindex");

    this.#generatedColumnIndices.delete(item);
  }

  /** @private */
  #scrollToItem(index: number): void {
    this.#items[index]?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  /** @private */
  #pageRows(): number {
    const rows = this.shadowRoot!.querySelectorAll<HTMLElement>(".row");

    if (rows.length < 2) return 1;

    const pitch = rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().top;

    if (pitch <= 0) return 1;

    let height = window.innerHeight;

    if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(this).overflowY))
      height = Math.min(height, this.clientHeight);

    const root = this.getRootNode();
    let ancestor: Element | null =
      this.assignedSlot ?? this.parentElement ?? (root instanceof ShadowRoot ? root.host : null);

    while (ancestor) {
      if (/(auto|scroll|hidden|clip)/.test(getComputedStyle(ancestor).overflowY)) {
        height = Math.min(height, ancestor.clientHeight);
      }

      const root = ancestor.getRootNode();

      ancestor = ancestor.assignedSlot ?? ancestor.parentElement ?? (root instanceof ShadowRoot ? root.host : null);
    }

    return Math.max(1, Math.floor(height / pitch));
  }

  /** @private */
  #handleKeyDown(event: KeyboardEvent): void {
    const target = event.composedPath()[0];

    if (!(target instanceof M3eCarouselItemActionElement)) return;

    const index = this.#items.findIndex((item) => item.action === target);

    if (index < 0) return;

    const key = event.key;
    const isPageKey = key === "PageUp" || key === "PageDown";

    if (isPageKey && (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey))
      return;

    if (
      key !== "ArrowLeft" &&
      key !== "ArrowRight" &&
      key !== "ArrowUp" &&
      key !== "ArrowDown" &&
      key !== "Home" &&
      key !== "End" &&
      !isPageKey
    ) {
      return;
    }

    event.preventDefault();

    const rowStart = Math.floor(index / this.#columns) * this.#columns;
    const rowEnd = Math.min(rowStart + this.#columns, this.#items.length) - 1;
    let targetIndex = index;
    const rtl = M3eDirectionality.current === "rtl";

    if (key === "Home") targetIndex = event.ctrlKey || event.metaKey ? 0 : rowStart;
    else if (key === "End") targetIndex = event.ctrlKey || event.metaKey ? this.#items.length - 1 : rowEnd;
    else if (key === "ArrowLeft") targetIndex += rtl ? 1 : -1;
    else if (key === "ArrowRight") targetIndex += rtl ? -1 : 1;
    else targetIndex += key === "ArrowUp" ? -this.#columns : this.#columns;

    if (key === "Home" || key === "End") {
      const start = event.ctrlKey || event.metaKey ? 0 : rowStart;
      const end = event.ctrlKey || event.metaKey ? this.#items.length - 1 : rowEnd;

      targetIndex = this.#findEnabledIndex(targetIndex, key === "Home" ? end : start, key === "Home" ? 1 : -1);
    } else if (key === "ArrowLeft" || key === "ArrowRight") {
      const step = (key === "ArrowRight" ? 1 : -1) * (rtl ? -1 : 1);

      targetIndex = this.#findEnabledIndex(index + step, step > 0 ? rowEnd : rowStart, step);
    } else {
      const step = key === "ArrowUp" || key === "PageUp" ? -1 : 1;
      const lastRow = Math.ceil(this.#items.length / this.#columns) - 1;
      let targetRow = Math.floor(index / this.#columns) + step * (isPageKey ? this.#pageRows() : 1);

      if (isPageKey) targetRow = Math.max(0, Math.min(lastRow, targetRow));

      const desiredColumn = index % this.#columns;

      do {
        const start = targetRow * this.#columns;
        const end = Math.min(start + this.#columns, this.#items.length) - 1;

        if (start < 0 || start >= this.#items.length) return;

        targetIndex = this.#findNearestEnabledIndex(start, end, desiredColumn);
        targetRow += step;
      } while (isPageKey && targetIndex < 0 && targetRow >= 0 && targetRow <= lastRow);
    }

    if (targetIndex < 0) return;

    const action = this.#items[targetIndex]?.action;

    if (!action) return;

    this._focusKeyManager.setActiveItem(action);
    this.#scrollToItem(targetIndex);
  }

  /** @private */
  #findEnabledIndex(start: number, end: number, step: number): number {
    for (let index = start; step > 0 ? index <= end : index >= end; index += step) {
      const action = this.#items[index]?.action;

      if (action && !this._focusKeyManager.skipPredicate(action)) {
        return index;
      }
    }

    return -1;
  }

  /** @private */
  #findNearestEnabledIndex(start: number, end: number, desiredColumn: number): number {
    for (let distance = 0; distance <= end - start; distance++) {
      const left = start + Math.max(0, desiredColumn - distance);

      if (left <= end) {
        const action = this.#items[left]?.action;

        if (action && !this._focusKeyManager.skipPredicate(action)) {
          return left;
        }
      }

      const right = start + desiredColumn + distance;

      if (distance > 0 && right <= end) {
        const action = this.#items[right]?.action;

        if (action && !this._focusKeyManager.skipPredicate(action)) {
          return right;
        }
      }
    }

    return -1;
  }

  /** @private */
  #handleFocusIn(event: FocusEvent): void {
    const index = this._handleItemFocusIn(event);

    if (index < 0) return;

    this._setSelectedIndex(index, false);
  }

  /** @private */
  #handleFocusOut(event: FocusEvent): void {
    this._handleItemFocusOut(event);
  }

  /** @private */
  #handleClick(event: MouseEvent): void {
    if (event.button !== 0) return;

    const index = this._itemIndexFromEvent(event);

    if (index < 0 || this.#items[index].disabled) return;

    this._setActiveAction(index);
    this._moveTo(index, true, true);
  }

  /** @inheritdoc */
  protected override _focusFallback(): HTMLElement | undefined {
    return this.shadowRoot?.querySelector<HTMLElement>(".collection") ?? undefined;
  }
}

interface M3eCarouselGridElementEventMap extends HTMLElementEventMap {
  change: CustomEvent<CarouselChangeDetail>;
}

export interface M3eCarouselGridElement {
  addEventListener<K extends keyof M3eCarouselGridElementEventMap>(
    type: K,
    listener: (this: M3eCarouselGridElement, ev: M3eCarouselGridElementEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof M3eCarouselGridElementEventMap>(
    type: K,
    listener: (this: M3eCarouselGridElement, ev: M3eCarouselGridElementEventMap[K]) => unknown,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-carousel-grid": M3eCarouselGridElement;
  }
}
