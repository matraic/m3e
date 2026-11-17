/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { CSSResultGroup, html, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { customElement, MutationController, prefersReducedMotion, setCustomEnumState } from "@m3e/web/core";

import { M3eDirectionality } from "@m3e/web/core/bidi";
import { SwipeGestureDetail, SwipeGestureDirection } from "@m3e/web/gestures/swipe";

import "@m3e/web/gestures/swipe";

import { CarouselVariant, isCarouselVariant } from "./CarouselVariant";
import { CarouselGeometry, createCarouselGeometry } from "./CarouselGeometry";
import { CarouselChangeDetail, CarouselElementBase } from "./CarouselElementBase";
import { M3eCarouselItemActionElement } from "./CarouselItemActionElement";
import { M3eCarouselItemElement } from "./CarouselItemElement";

import { CarouselStyle } from "./styles";

/** @private */ const FLING_DECAY_MS = 325;
/** @private */ const FLING_STOP_VELOCITY = 0.02;
/** @private */ const OVERSCROLL_LIMIT = 48;
/** @private */ const OVERSCROLL_FRICTION = 0.4;

/** @private */
interface CarouselPresentation {
  layout: CarouselGeometry;
  scroll: number;
  position: number;
  items: CarouselItemPresentation[];
}

/** @private */
interface CarouselItemPresentation {
  translation: number;
  inset: number;
  leadingClip: number;
  trailingClip: number;
  opacity: number;
  titleOpacity: number;
  subtitleOpacity: number;
}

/**
 * Arranges items in responsive, scrollable Material 3 carousel layouts.
 *
 * @description
 * The `m3e-carousel` component offers layouts that vary item sizes to preview neighboring content, keep items at a
 * fixed width, or display one edge-to-edge item at a time in a vertically scrolling fullscreen layout. Items can
 * contain media or custom content, with optional title and subtitle overlays.
 *
 * @example
 * Display items with media, title and subtitle overlays. Replace the image placeholder and add more items.
 * The CSS enables a text scrim behind the overlays.
 * ```html
 * <m3e-carousel class="carousel" aria-label="Featured destinations">
 *   <m3e-carousel-item>
 *     <img src="[YOUR IMAGE URL HERE]" alt="" loading="lazy" />
 *     <span slot="title">Coast</span>
 *     <span slot="subtitle">Follow the ocean breeze</span>
 *   </m3e-carousel-item>
 *   <!-- Additional items omitted for brevity -->
 * </m3e-carousel>
 * ```
 * ```css
 * .carousel {
 *   --m3e-carousel-item-scrim-opacity: 0.65;
 * }
 * ```
 *
 * @example
 * Use the default multi-browse layout to show multiple items and a preview.
 * ```html
 * <m3e-carousel variant="multi-browse" aria-label="Destinations">
 *   <m3e-carousel-item>
 *     <img src="[YOUR IMAGE URL HERE]" alt="" loading="lazy" />
 *     <span slot="title">Coast</span>
 *     <span slot="subtitle">Follow the ocean breeze</span>
 *   </m3e-carousel-item>
 *   <!-- Additional items omitted for brevity -->
 * </m3e-carousel>
 * ```
 *
 * @example
 * Use fixed-width items in an uncontained layout.
 * ```html
 * <m3e-carousel variant="uncontained" aria-label="Destinations">
 *   <!-- Items omitted for brevity -->
 * </m3e-carousel>
 * ```
 *
 * @example
 * Use a hero layout, optionally setting a preferred width for the large item.
 * ```html
 * <m3e-carousel variant="hero" aria-label="Destinations">
 *   <!-- Items omitted for brevity -->
 * </m3e-carousel>
 * ```
 * ```html
 * <m3e-carousel class="custom-width" variant="hero" aria-label="Destinations">
 *   <!-- Items omitted for brevity -->
 * </m3e-carousel>
 * ```
 * ```css
 * .custom-width {
 *   --m3e-carousel-item-width: 256px;
 * }
 * ```
 *
 * @example
 * Center the hero item, optionally setting a preferred width.
 * ```html
 * <m3e-carousel variant="hero-centered" aria-label="Destinations">
 *   <!-- Items omitted for brevity -->
 * </m3e-carousel>
 * ```
 * ```html
 * <m3e-carousel class="custom-width" variant="hero-centered" aria-label="Destinations">
 *   <!-- Items omitted for brevity -->
 * </m3e-carousel>
 * ```
 * ```css
 * .custom-width {
 *   --m3e-carousel-item-width: 256px;
 * }
 * ```
 *
 * @example
 * Display edge-to-edge items in a vertically scrolling fullscreen layout. Set the carousel's height in CSS.
 * ```html
 * <m3e-carousel class="carousel" variant="fullscreen" aria-label="Destinations">
 *   <!-- Items omitted for brevity -->
 * </m3e-carousel>
 * ```
 * ```css
 * .carousel {
 *   height: 256px;
 * }
 * ```
 *
 * @example
 * Set the preferred or fixed item width on a carousel with `class="carousel"`.
 * ```css
 * .carousel {
 *   --m3e-carousel-item-width: 320px;
 * }
 * ```
 *
 * @example
 * Set the height of a carousel with `class="carousel"`.
 * ```css
 * .carousel {
 *   height: 256px;
 * }
 * ```
 *
 * @example
 * Customize the spacing between items and the feedback gutters on a carousel with `class="carousel"`.
 * ```css
 * .carousel {
 *   --m3e-carousel-item-gap: 16px;
 *   --m3e-carousel-inline-gutter: 24px;
 *   --m3e-carousel-block-gutter: 12px;
 * }
 * ```
 *
 * @example
 * Customize title and subtitle sizes for items in a carousel with `class="carousel"`.
 * ```css
 * .carousel {
 *   --m3e-carousel-item-title-font-size: 20px;
 *   --m3e-carousel-item-subtitle-font-size: 12px;
 * }
 * ```
 *
 * @example
 * Enable a text scrim for items in a carousel with `class="carousel"`. Check contrast against the actual media.
 * ```css
 * .carousel {
 *   --m3e-carousel-item-scrim-opacity: 0.65;
 * }
 * ```
 *
 * @example
 * Listen for navigation changes and move to an item. The carousel must contain at least three visible items.
 * ```js
 * const carousel = document.querySelector("m3e-carousel");
 *
 * carousel.addEventListener("change", event => {
 *   console.log(event.detail.index, event.detail.item);
 * });
 *
 * carousel.moveTo(2);
 * ```
 *
 * @example
 * Disable an item's action or hide an item from the layout.
 * ```html
 * <m3e-carousel aria-label="Destinations">
 *   <m3e-carousel-item>Coast</m3e-carousel-item>
 *   <m3e-carousel-item disabled>Forest unavailable</m3e-carousel-item>
 *   <m3e-carousel-item hidden>Mountains</m3e-carousel-item>
 * </m3e-carousel>
 * ```
 *
 * @example
 * Customize the resting and pressed item shapes on a carousel with `class="carousel"`.
 * ```css
 * .carousel {
 *   --m3e-carousel-item-shape: 24px;
 *   --m3e-carousel-item-shape-pressed-morph: 12px;
 * }
 * ```
 *
 * @tag m3e-carousel
 *
 * @slot - A sequence of `m3e-carousel-item` elements.
 *
 * @attr selected-index - The zero-based index of the current item.
 * @attr variant - The Material 3 carousel layout variant.
 *
 * @fires change - Dispatched when navigation changes the current item.
 *
 * @cssprop --m3e-carousel-height - The default block size of the carousel.
 * @cssprop --m3e-carousel-min-height - The minimum block size of the carousel.
 * @cssprop --m3e-carousel-fullscreen-item-gap - The spacing between fullscreen items.
 * @cssprop --m3e-carousel-item-gap - The spacing between adjacent items.
 * @cssprop --m3e-carousel-item-width - Fixed item width for uncontained and preferred large item width for multi-browse and hero layouts; ignored for fullscreen.
 * @cssprop --m3e-carousel-inline-gutter - Feedback space at horizontal edges; ignored for fullscreen.
 * @cssprop --m3e-carousel-block-gutter - Feedback space above and below items; ignored for fullscreen.
 * @cssprop --m3e-carousel-small-item-min-width - Minimum small preview width.
 * @cssprop --m3e-carousel-small-item-max-width - Maximum small preview width.
 * @cssprop --m3e-carousel-large-item-max-width - Maximum large item width.
 */
@customElement("m3e-carousel")
export class M3eCarouselElement extends CarouselElementBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = CarouselStyle;

  /** @private */ @query(".viewport") private _viewport!: HTMLElement;
  /** @private */ @query(".track") private _track!: HTMLElement;
  /** @private */ @query("slot") private _slot!: HTMLSlotElement;

  /** @private */ @query(".small-min") private _smallMin!: HTMLElement;
  /** @private */ @query(".small-max") private _smallMax!: HTMLElement;
  /** @private */ @query(".large-max") private _largeMax!: HTMLElement;
  /** @private */ @query(".item-width") private _itemWidthProbe!: HTMLElement;
  /** @private */ @query(".item-gap") private _gapProbe!: HTMLElement;
  /** @private */ @query(".inline-gutter") private _gutterProbe!: HTMLElement;

  /** @private */ readonly #probeSizes = new WeakMap<Element, number>();

  /** @private */ #viewportSize?: { width: number; height: number; contentWidth: number; contentHeight: number };
  /** @private */ #items: M3eCarouselItemElement[] = [];

  /** @private */ #resizeScrollPending = false;
  /** @private */ #scrollTimer?: number;
  /** @private */ #flingFrame?: number;
  /** @private */ #programmaticScroll = false;
  /** @private */ #indexChangedByScroll = false;

  /** @private */ #layout?: CarouselGeometry;
  /** @private */ #presentation?: CarouselPresentation;
  /** @private */ #itemGap = 0;
  /** @private */ #itemAreaSize = 0;

  /** @private */ #renderedDirection?: string;
  /** @private */ #motionQuery?: MediaQueryList;

  /** @private */ #pressedPointer?: number;
  /** @private */ #suppressPointerClick = false;

  /** @private */ #swipeFocusedAction?: M3eCarouselItemActionElement;
  /** @private */ #repairingSwipeFocus = false;

  /** @private */ #overscrollOffset = 0;
  /** @private */ #dragStart?: { scroll: number; index: number; axis: "x" | "y" };
  /** @private */ #touch?: { id: number; dragging: boolean };

  /** @private */
  readonly #handlePointerEnd = (event: PointerEvent): void => {
    if (event.pointerId !== this.#pressedPointer) return;

    this.#clearPressedPointer(event.type === "pointercancel");

    if (
      this.#dragStart ||
      this.#flingFrame !== undefined ||
      this.#programmaticScroll ||
      this.variant === "uncontained"
    ) {
      return;
    }

    this.#setSelectedIndex(this.#findSelectedIndex(), false, true);
    this.#scrollToSelected();
  };

  /** @private */
  readonly #handleMotionChange = (): void => {
    if (!this.hasUpdated) return;

    if (this.#dragStart || (this.#flingFrame !== undefined && !this.#programmaticScroll)) {
      this.#setSelectedIndex(this.#findSelectedIndex(), false, true);
    }

    this.#dragStart = undefined;
    this.#cancelFling();
    this.#resetOverscroll();

    if (this.variant === "uncontained" && !this.#programmaticScroll) return;

    this.#layoutItems();
    this.#scrollToSelected(false);
  };

  /** @private */
  readonly #generatedPositions = new WeakMap<HTMLElement, { attribute: string; value: string }>();

  /** @private */
  readonly #originalStyles = new WeakMap<HTMLElement, Map<string, { value: string; priority: string }>>();

  /** @private */ private static _resizeObserver?: ResizeObserver | null;
  /** @private */ private static readonly _resizeOwners = new WeakMap<Element, M3eCarouselElement>();
  /** @private */ readonly #resizeTargets = new Set<HTMLElement>();

  /** @private */
  private static _handleResize(entries: ResizeObserverEntry[]): void {
    const batches = new Map<M3eCarouselElement, ResizeObserverEntry[]>();

    for (const entry of entries) {
      const owner = this._resizeOwners.get(entry.target);

      if (!owner?.isConnected) continue;

      const batch = batches.get(owner);

      if (batch) batch.push(entry);
      else batches.set(owner, [entry]);
    }

    const updates: Array<{ owner: M3eCarouselElement; align: boolean; scroll: number }> = [];

    for (const [owner, batch] of batches) {
      const align = owner.#prepareResize(batch);

      if (align !== undefined) updates.push({ owner, align, scroll: owner.#scrollOffset() });
    }

    // All carousel scroll reads and writes precede any item style writes.
    for (const update of updates) {
      if (update.align) update.owner.#scrollToSelected(false, false, update.scroll);
    }

    for (const update of updates) {
      if (update.align) update.scroll = update.owner.#scrollOffset();
    }

    for (const { owner, scroll } of updates) {
      owner.#renderItems(scroll);
    }
  }

  /** @private */
  #prepareResize(entries: ResizeObserverEntry[]): boolean | undefined {
    let sizingChanged = false;
    let trackResized = false;

    for (const entry of entries) {
      if (entry.target === this._track) {
        trackResized = true;
        continue;
      }

      sizingChanged = true;

      if (entry.target === this._viewport) {
        const borderSize: ResizeObserverSize = Array.isArray(entry.borderBoxSize)
          ? entry.borderBoxSize[0]
          : entry.borderBoxSize;

        this.#viewportSize = {
          width: borderSize.inlineSize,
          height: borderSize.blockSize,
          contentWidth: entry.contentRect.width,
          contentHeight: entry.contentRect.height,
        };
      } else {
        this.#probeSizes.set(entry.target, entry.contentRect.width);
      }
    }

    if (!sizingChanged) {
      if (!trackResized || !this.#resizeScrollPending) return;

      this.#resizeScrollPending = false;

      return true;
    }

    const itemSize = this.#layout?.itemSize;
    const gap = this.#itemGap;

    this.#layoutItems(false);

    if (!this.#layout) return;

    // Let layout update the scroll extents before setting the new offset.
    this.#resizeScrollPending =
      this.#layout.maxScroll > 0 && (itemSize !== this.#layout.itemSize || gap !== this.#itemGap);

    return !this.#resizeScrollPending;
  }

  /** @private */
  #observeResize(target: HTMLElement): void {
    if (M3eCarouselElement._resizeObserver === undefined) {
      M3eCarouselElement._resizeObserver =
        typeof ResizeObserver === "undefined"
          ? null
          : new ResizeObserver((entries) => M3eCarouselElement._handleResize(entries));
    }

    if (!M3eCarouselElement._resizeObserver) return;

    M3eCarouselElement._resizeOwners.set(target, this);
    this.#resizeTargets.add(target);
    M3eCarouselElement._resizeObserver.observe(target);
  }

  /** @private */
  readonly #mutationController = new MutationController(this, {
    target: null,
    config: { attributes: true, attributeFilter: ["hidden", "disabled"] },
    callback: () => this.#handleSlotChange(),
  });

  /** @private */ #directionalityUnsubscribe?: () => void;

  /**
   * The appearance variant of the carousel.
   * @default "multi-browse"
   */
  @property({ reflect: true, useDefault: true }) variant: CarouselVariant = "multi-browse";

  /** @inheritdoc */
  override get items(): readonly M3eCarouselItemElement[] {
    return this.#items;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#applyVariant();
    this.#directionalityUnsubscribe ??= M3eDirectionality.observe(() => this.requestUpdate());
    this.#motionQuery = matchMedia("(prefers-reduced-motion)");
    this.#motionQuery.addEventListener("change", this.#handleMotionChange);

    if (this.hasUpdated) {
      this.#observeResize(this._viewport);
      this.#observeResize(this._track);
      this.#observeSizeProbes();
      this.#mutationController.observe(this._slot);
      this.#layoutItems();

      if (this.variant !== "uncontained") {
        this.#scrollToSelected(false);
      }
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#cancelFling();

    if (this.#scrollTimer !== undefined) {
      window.clearTimeout(this.#scrollTimer);
      this.#scrollTimer = undefined;
    }

    this.#programmaticScroll = false;
    this.#resizeScrollPending = false;
    this.#presentation = undefined;

    for (const target of this.#resizeTargets) {
      M3eCarouselElement._resizeObserver?.unobserve(target);
      M3eCarouselElement._resizeOwners.delete(target);
    }

    this.#resizeTargets.clear();

    this.#dragStart = undefined;
    this.#touch = undefined;
    this.#suppressPointerClick = false;
    this.#swipeFocusedAction = undefined;

    if (this.hasUpdated) this.#resetOverscroll();

    this.#clearPressedPointer();
    this.#directionalityUnsubscribe?.();
    this.#directionalityUnsubscribe = undefined;

    this.#motionQuery?.removeEventListener("change", this.#handleMotionChange);
    this.#motionQuery = undefined;
  }

  /** @inheritdoc */
  protected override firstUpdated(changedProperties: PropertyValues<this>): void {
    super.firstUpdated(changedProperties);

    this.#observeResize(this._viewport);
    this.#observeResize(this._track);
    this.#observeSizeProbes();
    this.#mutationController.observe(this._slot);
    this.#syncItems();
    this.#layoutItems();
    this.#scrollToSelected();
    this.requestUpdate();
  }

  /** @inheritdoc */
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("variant")) {
      if (this.hasUpdated) {
        this.#dragStart = undefined;
        this.#swipeFocusedAction = undefined;
        this.#resetOverscroll();
      }

      this.#applyVariant();
    }
  }

  /** @inheritdoc */
  protected override updated(changedProperties: PropertyValues<this>): void {
    super.updated(changedProperties);

    const direction = M3eDirectionality.current;

    if (changedProperties.has("variant") || direction !== this.#renderedDirection) {
      if (this.#renderedDirection !== undefined && direction !== this.#renderedDirection) {
        this.#dragStart = undefined;
        this.#swipeFocusedAction = undefined;
        this.#resetOverscroll();
      }

      this.#renderedDirection = direction;

      if (changedProperties.has("variant")) {
        this.#syncItems();
      }

      this.#layoutItems();
      this.#scrollToSelected(false);
    }

    if (changedProperties.has("selectedIndex")) {
      const selectedIndex = this._clampIndex(this.selectedIndex);

      if (selectedIndex !== this.selectedIndex) {
        this.selectedIndex = selectedIndex;
      }

      if (this.#indexChangedByScroll) {
        this.#indexChangedByScroll = false;
      } else {
        this.#dragStart = undefined;
        this.#swipeFocusedAction = undefined;
        this.#resetOverscroll();
        this.#scrollToSelected();
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const vertical = this.variant === "fullscreen";
    const direction: SwipeGestureDirection[] = vertical ? ["up", "down"] : ["left", "right"];

    return html`
      <div class="size-probe small-min" aria-hidden="true"></div>
      <div class="size-probe small-max" aria-hidden="true"></div>
      <div class="size-probe large-max" aria-hidden="true"></div>
      <div class="size-probe item-width" aria-hidden="true"></div>
      <div class="size-probe item-gap" aria-hidden="true"></div>
      <div class="size-probe inline-gutter" aria-hidden="true"></div>
      <div class="viewport-frame">
        <div
          class="viewport"
          id="viewport"
          tabindex="-1"
          @keydown=${this.#handleKeyDown}
          @focusin=${this.#handleFocusIn}
          @focusout=${this.#handleFocusOut}
          @click=${{
            handleEvent: (event: MouseEvent) => this.#handleClick(event),
            capture: true,
          }}
          @dragstart=${this.#preventNativeDrag}
          @pointerdown=${this.#handlePointerDown}
          @touchstart=${this.#handleTouchStart}
          @touchmove=${{ handleEvent: this.#handleTouchMove, passive: false }}
          @touchend=${this.#handleTouchEnd}
          @touchcancel=${this.#handleTouchEnd}
          @wheel=${this.#cancelProgrammaticScroll}
          @scroll=${this.#handleScroll}
        >
          <div
            class="track"
            role=${vertical ? "presentation" : "row"}
            aria-rowindex=${ifDefined(vertical ? undefined : "1")}
          >
            <slot @slotchange=${this.#handleSlotChange}></slot>
          </div>
        </div>
      </div>
      <m3e-swipe-gesture
        for="viewport"
        .directions=${direction}
        ?disabled=${this.#items.length === 0}
        @gesture=${this.#handleSwipeGesture}
      ></m3e-swipe-gesture>
    `;
  }

  /** @private */
  #observeSizeProbes(): void {
    this.#observeResize(this._smallMin);
    this.#observeResize(this._smallMax);
    this.#observeResize(this._largeMax);
    this.#observeResize(this._itemWidthProbe);
    this.#observeResize(this._gapProbe);
    this.#observeResize(this._gutterProbe);
  }

  /** @private */
  #applyVariant(): void {
    if (!isCarouselVariant(this.variant)) {
      this.variant = "multi-browse";
    }

    setCustomEnumState(this, this.variant, "multi-browse", "uncontained", "hero", "hero-centered", "fullscreen");
  }

  /** @private */
  #handleSlotChange(): void {
    this.#syncItems();
    this.#layoutItems();
    this.#scrollToSelected();
    this.requestUpdate();
  }

  /** @private */
  #syncItems(): void {
    const previousItems = this.#items;

    this.#items = this._slot
      .assignedElements({ flatten: true })
      .filter(
        (item): item is M3eCarouselItemElement =>
          item instanceof M3eCarouselItemElement && !item.hasAttribute("hidden"),
      );

    for (const item of previousItems) {
      if (this.#items.includes(item)) continue;

      this.#restoreItemStyles(item);

      const generatedPosition = this.#generatedPositions.get(item);

      if (generatedPosition && item.getAttribute(generatedPosition.attribute) === generatedPosition.value) {
        item.removeAttribute(generatedPosition.attribute);
      }

      item.vertical = false;
    }

    const vertical = this.variant === "fullscreen";

    this.ariaRowCount = `${vertical ? this.#items.length : 1}`;
    this.ariaColCount = `${vertical ? 1 : this.#items.length}`;

    this.#items.forEach((item, index) => {
      const generatedPosition = this.#generatedPositions.get(item);
      const attribute = vertical ? "aria-rowindex" : "aria-colindex";
      const value = `${index + 1}`;

      if (
        generatedPosition &&
        generatedPosition.attribute !== attribute &&
        item.getAttribute(generatedPosition.attribute) === generatedPosition.value
      ) {
        item.removeAttribute(generatedPosition.attribute);
      }

      if (!item.hasAttribute(attribute) || item.getAttribute(attribute) === generatedPosition?.value) {
        item.setAttribute(attribute, value);
        this.#generatedPositions.set(item, { attribute, value });
      }

      item.vertical = vertical;
    });

    const selectedIndex = this._clampIndex(this.selectedIndex);

    if (selectedIndex !== this.selectedIndex) {
      this.selectedIndex = selectedIndex;
    }

    void this._syncFocusActions(this.#items);
  }

  /** @private */
  #layoutItems(render = true): void {
    if (!this._viewport || !this._track || !this._smallMin || !this._smallMax || !this._largeMax) {
      return;
    }

    if (!this.#items.length) {
      this.#layout = undefined;
      this.#presentation = undefined;
      this._track.style.removeProperty("--_carousel-track-size");

      return;
    }

    const viewport = this.#viewportSize;
    const probes = [
      this._itemWidthProbe,
      this._gapProbe,
      this._gutterProbe,
      this._smallMin,
      this._smallMax,
      this._largeMax,
    ];

    if (!viewport || probes.some((probe) => !this.#probeSizes.has(probe))) {
      return;
    }

    const vertical = this.variant === "fullscreen";
    const extent = vertical
      ? viewport.contentHeight
      : Math.max(0, viewport.contentWidth - 2 * this.#probeSizes.get(this._gutterProbe)!);

    if (!extent) {
      return;
    }

    this.#itemAreaSize = extent;

    const gap = this.#probeSizes.get(this._gapProbe)!;

    this.#itemGap = gap;

    const itemWidth = this.#probeSizes.get(this._itemWidthProbe)!;

    this.#layout = createCarouselGeometry({
      variant: this.variant,
      viewportSize: extent,
      gap,
      count: this.#items.length,
      baseSize: this.variant === "uncontained" && itemWidth > 0 ? itemWidth : 280,
      preferredSize: itemWidth > 0 ? itemWidth : undefined,
      reducedMotion: prefersReducedMotion(),
      minSmallSize: this.#probeSizes.get(this._smallMin)!,
      maxSmallSize: this.#probeSizes.get(this._smallMax)!,
      maxLargeSize: this.#probeSizes.get(this._largeMax)!,
    });

    if (!this.#layout) return;

    if (render) this.#renderItems();
  }

  /** @private */
  #renderItems(scrollOffset?: number): void {
    if (!this.#layout) return;

    const vertical = this.variant === "fullscreen";
    const layout = this.#layout;
    const scroll = scrollOffset ?? this.#scrollOffset();
    const target = layout.scrollForIndex(this.selectedIndex);

    // Native scroll extents and offsets are rounded, unlike the fitted item widths.
    const settled =
      this.variant !== "uncontained" &&
      !this.#dragStart &&
      this.#pressedPointer === undefined &&
      this.#flingFrame === undefined &&
      Math.abs(scroll - target) < 1;

    const position = settled ? target : scroll;
    const previous = this.#presentation;

    if (previous?.layout === layout && previous.scroll === scroll && previous.position === position) return;

    const layoutChanged = previous?.layout !== layout;
    const positions = layout.itemsAt(position);
    const rtl = !vertical && this.#renderedDirection === "rtl";
    const uncontained = this.variant === "uncontained";
    const feedbackWidth = this.#viewportSize!.width;
    const feedbackHeight = this.#viewportSize!.height;

    const items: CarouselItemPresentation[] = positions.map(({ position, size }, index) => {
      const unadjusted = index * (layout.itemSize + this.#itemGap) + layout.itemSize / 2 - scroll;
      const leadingClip = vertical ? 0 : Math.min(size, Math.max(0, size / 2 - position));
      const trailingClip = vertical ? 0 : Math.min(size, Math.max(0, position + size / 2 - this.#itemAreaSize));

      return {
        translation: position - unadjusted,
        inset: Math.max(0, (layout.itemSize - size) / 2),
        leadingClip,
        trailingClip,
        opacity: vertical || size > leadingClip + trailingClip ? 1 : 0,
        titleOpacity:
          vertical || uncontained
            ? 1
            : Math.min(1, Math.max(0, (size - layout.mediumSize) / (layout.itemSize - layout.mediumSize))),
        subtitleOpacity:
          vertical || uncontained
            ? 1
            : Math.min(1, Math.max(0, (size - layout.smallSize) / (layout.mediumSize - layout.smallSize))),
      };
    });

    // WebKit can size a max-content flex track as if its slotted items were absent.
    if (layoutChanged && !vertical) {
      const trackSize = `${this.#items.length * layout.itemSize + (this.#items.length - 1) * this.#itemGap}px`;

      if (this._track.style.getPropertyValue("--_carousel-track-size") !== trackSize) {
        this._track.style.setProperty("--_carousel-track-size", trackSize);
      }
    }

    this.#items.forEach((item, index) => {
      const frame = items[index];
      const last = layoutChanged ? undefined : previous?.items[index];
      const { translation, inset, leadingClip, trailingClip } = frame;
      const insetChanged = last?.inset !== inset;
      const edgesChanged = last?.leadingClip !== leadingClip || last?.trailingClip !== trailingClip;

      if (layoutChanged) {
        this.#setItemStyle(item, "flex-basis", `${layout.itemSize}px`);
        this.#setItemStyle(item, vertical ? "--_carousel-translate-x" : "--_carousel-translate-y", "0px");
        this.#setItemStyle(item, vertical ? "--_carousel-inset-x" : "--_carousel-inset-y", "0px");
      }

      if (last?.translation !== translation) {
        this.#setItemStyle(
          item,
          vertical ? "--_carousel-translate-y" : "--_carousel-translate-x",
          `${rtl ? -translation : translation}px`,
        );
      }

      if (insetChanged) {
        this.#setItemStyle(item, vertical ? "--_carousel-inset-y" : "--_carousel-inset-x", `${inset}px`);
        this.#setItemStyle(
          item,
          "--_carousel-clip",
          vertical
            ? `inset(${inset}px 0 round var(--_carousel-clip-shape, var(--m3e-carousel-item-shape, var(--md-sys-shape-corner-extra-large, var(--md-sys-shape-corner-value-extra-large, 28px)))))`
            : `inset(0 ${inset}px round var(--_carousel-clip-shape, var(--m3e-carousel-item-shape, var(--md-sys-shape-corner-extra-large, var(--md-sys-shape-corner-value-extra-large, 28px)))))`,
        );
      }

      if (insetChanged || edgesChanged) {
        this.#setItemStyle(
          item,
          "--_carousel-inset-left",
          `${vertical ? 0 : inset + (rtl ? trailingClip : leadingClip)}px`,
        );
        this.#setItemStyle(
          item,
          "--_carousel-inset-right",
          `${vertical ? 0 : inset + (rtl ? leadingClip : trailingClip)}px`,
        );
      }

      if (last?.opacity !== frame.opacity) {
        this.#setItemStyle(item, "--_carousel-item-opacity", `${frame.opacity}`);
      }

      if (last?.titleOpacity !== frame.titleOpacity) {
        this.#setItemStyle(item, "--_carousel-title-opacity", `${frame.titleOpacity}`);
      }

      if (last?.subtitleOpacity !== frame.subtitleOpacity) {
        this.#setItemStyle(item, "--_carousel-subtitle-opacity", `${frame.subtitleOpacity}`);
      }

      if (layoutChanged || (uncontained && edgesChanged)) {
        const surfaceLeft = uncontained ? (rtl ? trailingClip : leadingClip) : 0;
        const surfaceRight = uncontained ? (rtl ? leadingClip : trailingClip) : 0;
        this.#setItemStyle(item, "--_carousel-surface-left", `${surfaceLeft}px`);
        this.#setItemStyle(item, "--_carousel-surface-right", `${surfaceRight}px`);

        // Only cut edges clip feedback; leave the rest of the viewport available for shadows and focus rings.
        this.#setItemStyle(
          item,
          "--_carousel-surface-clip",
          surfaceLeft > 0 || surfaceRight > 0
            ? `inset(${-feedbackHeight}px ${surfaceRight > 0 ? 0 : -feedbackWidth}px ${-feedbackHeight}px ${surfaceLeft > 0 ? 0 : -feedbackWidth}px)`
            : "none",
        );
      }
    });

    this.#presentation = { layout, scroll, position, items };
  }

  /** @private */
  #setItemStyle(item: HTMLElement, name: string, value: string): void {
    let original = this.#originalStyles.get(item);

    if (!original) {
      original = new Map();
      this.#originalStyles.set(item, original);
    }

    const currentValue = item.style.getPropertyValue(name);

    if (!original.has(name)) {
      original.set(name, {
        value: currentValue,
        priority: item.style.getPropertyPriority(name),
      });
    }

    if (currentValue !== value) {
      item.style.setProperty(name, value);
    }
  }

  /** @private */
  #restoreItemStyles(item: HTMLElement): void {
    this.#originalStyles.get(item)?.forEach(({ value, priority }, name) => {
      if (value) item.style.setProperty(name, value, priority);
      else item.style.removeProperty(name);
    });

    this.#originalStyles.delete(item);
  }

  /** @private */
  #scrollOffset(): number {
    const scroll =
      this.variant === "fullscreen"
        ? this._viewport.scrollTop
        : this._viewport.scrollLeft * (this.#renderedDirection === "rtl" ? -1 : 1);

    return Math.max(0, Math.min(this.#layout?.maxScroll ?? Number.POSITIVE_INFINITY, scroll));
  }

  /** @private */
  #handleScroll(): void {
    this.#renderItems();
    this.#scheduleScrollSettle();
  }

  /** @private */
  #scheduleScrollSettle(): void {
    if (!this.isConnected || this.#flingFrame !== undefined) return;

    if (this.#scrollTimer !== undefined) {
      window.clearTimeout(this.#scrollTimer);
    }

    this.#scrollTimer = window.setTimeout(() => {
      this.#scrollTimer = undefined;

      if (this.#dragStart || this.#pressedPointer !== undefined || this.#flingFrame !== undefined) return;

      if (this.#programmaticScroll) {
        this.#programmaticScroll = false;

        // Native momentum can continue after a programmatic settle finishes, leaving the track between snap points.
        if (
          !this.#layout ||
          Math.abs(this.#scrollOffset() - this.#layout.scrollForIndex(this._clampIndex(this.selectedIndex))) < 1
        ) {
          return;
        }
      }

      const index = this.#findSelectedIndex();

      this.#setSelectedIndex(index, false, true);

      if (this.variant !== "uncontained") {
        this.#scrollToSelected();
      }
    }, 100);
  }

  /** @private */
  #findSelectedIndex(scroll = this.#scrollOffset()): number {
    const layout = this.#layout;

    if (!layout || !this.#items.length) return 0;

    let nearestIndex = this._clampIndex(this.selectedIndex);
    let nearestDistance = Math.abs(layout.scrollForIndex(nearestIndex) - scroll);

    this.#items.forEach((_, index) => {
      const distance = Math.abs(layout.scrollForIndex(index) - scroll);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });

    return nearestIndex;
  }

  /** @private */
  protected override _moveTo(index: number, scroll: boolean, emit: boolean): void {
    this.#setSelectedIndex(index, scroll, emit);
  }

  /** @private */
  #setSelectedIndex(index: number, scroll: boolean, emit = false): void {
    if (!this.#items.length || !Number.isFinite(index)) return;

    if (scroll) {
      this.#dragStart = undefined;
      this.#swipeFocusedAction = undefined;
      this.#cancelFling();
      this.#resetOverscroll();
    }

    const selectedIndex = this._clampIndex(index);

    if (selectedIndex === this.selectedIndex) {
      if (scroll) this.#scrollToSelected();

      return;
    }

    this.#indexChangedByScroll = !scroll;
    this._setSelectedIndex(selectedIndex, emit);
  }

  /** @private */
  #scrollToSelected(smooth = true, render = true, scrollOffset?: number): void {
    if (!this.#layout || !this.#items.length) return;

    this.#cancelFling();

    if (this.#scrollTimer !== undefined) {
      window.clearTimeout(this.#scrollTimer);
      this.#scrollTimer = undefined;
    }

    const target = this.#layout.scrollForIndex(this._clampIndex(this.selectedIndex));
    const start = scrollOffset ?? this.#scrollOffset();

    if (Math.abs(target - start) < 1) {
      this.#programmaticScroll = false;

      if (render) this.#renderItems(start);

      this.#repairSwipeFocus();

      return;
    }

    const vertical = this.variant === "fullscreen";
    const rtl = this.#renderedDirection === "rtl";

    this.#programmaticScroll = true;

    if (smooth && !prefersReducedMotion()) {
      // Native smooth scrolling can move the track before its masks are updated.
      this.#startFling((2 * (target - start)) / FLING_DECAY_MS, this.selectedIndex, this.selectedIndex);

      return;
    }

    this._viewport.scrollTo({
      top: vertical ? target : 0,
      left: vertical ? 0 : rtl ? -target : target,
      behavior: "auto",
    });

    if (render) {
      this.#renderItems();
    }

    this.#repairSwipeFocus();
  }

  /** @private */
  #cancelProgrammaticScroll(): void {
    const wasFlinging = this.#flingFrame !== undefined && !this.#programmaticScroll;

    this.#programmaticScroll = false;

    this.#cancelFling();
    this.#resetOverscroll();

    if (wasFlinging) {
      this.#setSelectedIndex(this.#findSelectedIndex(), false, true);
    }
  }

  /** @private */
  #handleTouchStart(event: TouchEvent): void {
    this.#cancelProgrammaticScroll();

    if (!this.#touch && event.touches.length === 1) {
      this.#touch = { id: event.changedTouches[0].identifier, dragging: false };
    }
  }

  /** @private */
  readonly #handleTouchMove = (event: TouchEvent): void => {
    const touch = this.#touch;

    if (
      touch?.dragging &&
      event.touches.length === 1 &&
      [...event.changedTouches].some((item) => item.identifier === touch.id) &&
      event.cancelable
    ) {
      event.preventDefault();
    }
  };

  /** @private */
  #handleTouchEnd(event: TouchEvent): void {
    const touch = this.#touch;

    if (touch && [...event.changedTouches].some((item) => item.identifier === touch.id)) {
      this.#touch = undefined;
    }
  }

  /** @private */
  #handlePointerDown(event: PointerEvent): void {
    this.#swipeFocusedAction = undefined;
    this.#cancelProgrammaticScroll();

    if (!event.isPrimary) return;

    this.#suppressPointerClick = false;
    this.#pressedPointer = event.pointerId;
    window.addEventListener("pointerup", this.#handlePointerEnd);
    window.addEventListener("pointercancel", this.#handlePointerEnd);
  }

  /** @private */
  #clearPressedPointer(cancelPress = true): void {
    this.#pressedPointer = undefined;
    window.removeEventListener("pointerup", this.#handlePointerEnd);
    window.removeEventListener("pointercancel", this.#handlePointerEnd);
    if (cancelPress) {
      this.#releaseItemPresses();
    }
  }

  /** @private */
  #releaseItemPresses(): void {
    for (const item of this.#items) {
      item.cancelPress();
    }
  }

  /** @private */
  #cancelFling(): void {
    if (this.#flingFrame !== undefined) {
      cancelAnimationFrame(this.#flingFrame);
      this.#flingFrame = undefined;

      if (this.#scrollTimer !== undefined) {
        window.clearTimeout(this.#scrollTimer);
        this.#scrollTimer = undefined;
      }
    }
  }

  /** @private */
  #flingIndex(velocity: number, startIndex: number, start: number, projected: number): number {
    const direction = velocity > 0 ? 1 : -1;
    const nearest = this.#findSelectedIndex(projected);

    let index = nearest === startIndex ? this._clampIndex(startIndex + direction) : nearest;

    while (
      this.#layout &&
      (this.#layout.scrollForIndex(index) - start) * direction < -0.5 &&
      index + direction >= 0 &&
      index + direction < this.#items.length
    ) {
      index += direction;
    }

    return index;
  }

  /** @private */
  #startFling(velocity: number, startIndex: number, singleItemTarget?: number): void {
    if (!this.#layout || !Number.isFinite(velocity)) return;

    const layout = this.#layout;
    const start = this.#scrollOffset();
    const started = performance.now();
    const vertical = this.variant === "fullscreen";
    const rtl = this.#renderedDirection === "rtl";
    const projected = Math.max(0, Math.min(layout.maxScroll, start + velocity * FLING_DECAY_MS));
    const index =
      singleItemTarget ??
      (this.variant === "multi-browse" ? this.#flingIndex(velocity, startIndex, start, projected) : undefined);

    const target = index === undefined ? undefined : layout.scrollForIndex(index);
    const duration =
      target === undefined ? 0 : Math.max(140, Math.min(1200, (2 * Math.abs(target - start)) / Math.abs(velocity)));

    const step = (now: number) => {
      const elapsed = Math.max(0, now - started);
      const remaining = Math.exp(-elapsed / FLING_DECAY_MS);
      const progress = target === undefined ? 0 : Math.min(1, elapsed / duration);
      const position =
        target === undefined
          ? Math.max(0, Math.min(layout.maxScroll, start + velocity * FLING_DECAY_MS * (1 - remaining)))
          : start + (target - start) * (1 - (1 - progress) ** 2);

      this._viewport.scrollTo({
        top: vertical ? position : 0,
        left: vertical ? 0 : rtl ? -position : position,
        behavior: "auto",
      });

      this.#renderItems();

      if (
        target === undefined
          ? Math.abs(velocity * remaining) > FLING_STOP_VELOCITY && position > 0 && position < layout.maxScroll
          : progress < 1
      ) {
        this.#flingFrame = requestAnimationFrame(step);

        return;
      }

      this.#flingFrame = undefined;
      this.#setSelectedIndex(index ?? this.#findSelectedIndex(), false, true);
      this.#renderItems();
      this.#repairSwipeFocus();

      // The final frame may not change the rounded native scroll offset enough to produce a scroll event.
      this.#scheduleScrollSettle();
    };

    this.#flingFrame = requestAnimationFrame(step);
  }

  /** @private */
  #handleKeyDown(event: KeyboardEvent): void {
    const target = event.composedPath()[0];

    if (!(target instanceof M3eCarouselItemActionElement) || !this._focusKeyManager.items.includes(target)) return;

    const vertical = this.variant === "fullscreen";
    const isArrowKey = vertical
      ? event.key === "ArrowUp" || event.key === "ArrowDown"
      : event.key === "ArrowLeft" || event.key === "ArrowRight";
    const isPageKey = event.key === "PageUp" || event.key === "PageDown";

    if (event.key !== "Home" && event.key !== "End" && !isArrowKey && !isPageKey) return;

    let pageDelta = 1;

    if (isPageKey && !vertical && this.#layout) {
      const index = this._itemIndexFromEvent(event);
      const step = event.key === "PageDown" ? 1 : -1;
      const offset = this.#layout.scrollForIndex(index) + step * this.#itemAreaSize;

      pageDelta = Math.max(1, step * (this.#findSelectedIndex(offset) - index));
    }

    this._focusKeyManager.withPageUpAndDown(true, pageDelta);

    if (!event.defaultPrevented && !event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
      this.#swipeFocusedAction = undefined;
    }

    this._handleLinearKeyDown(event, vertical, this.#renderedDirection === "rtl" ? "rtl" : "ltr");
  }

  /** @private */
  #preventNativeDrag(event: DragEvent): void {
    event.preventDefault();
  }

  /** @private */
  #handleFocusIn(event: FocusEvent): void {
    const index = this._handleItemFocusIn(event);

    if (index < 0) return;

    if (this.#pressedPointer !== undefined || this.#repairingSwipeFocus) return;

    this.#swipeFocusedAction = undefined;
    this.#setSelectedIndex(index, false);
    this.#scrollToSelected();
  }

  /** @private */
  #handleFocusOut(event: FocusEvent): void {
    this._handleItemFocusOut(event);
  }

  /** @private */
  #handleClick(event: MouseEvent): void {
    if (this.#suppressPointerClick && event.detail > 0) {
      this.#suppressPointerClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();

      return;
    }

    if (event.button !== 0) return;

    const index = this._itemIndexFromEvent(event);

    if (index < 0) return;

    const item = this.#items[index];

    if (item.disabled) return;

    this._setActiveAction(index);
    this.#setSelectedIndex(index, true, true);
  }

  /** @private */
  #handleSwipeGesture(event: CustomEvent<SwipeGestureDetail>): void {
    if (!this.#layout) return;

    const detail = event.detail;
    const vertical = this.variant === "fullscreen";
    const axis = vertical ? "y" : "x";
    const rtl = this.#renderedDirection === "rtl";

    if (detail.phase === "start") {
      if (detail.axis !== axis) return;

      this.#cancelProgrammaticScroll();

      if (this.#touch) this.#touch.dragging = true;

      const focused = this._focusKeyManager.activeItem;

      this.#swipeFocusedAction = focused?.matches(":focus") ? focused : undefined;
      this.#suppressPointerClick = true;
      this.#releaseItemPresses();

      this.#dragStart = {
        scroll: this.#scrollOffset(),
        index: this.selectedIndex,
        axis,
      };
    }

    if (!this.#dragStart || this.#dragStart.axis !== axis) return;

    const drag = this.#dragStart;
    const delta = vertical ? detail.translationY : detail.translationX * (rtl ? -1 : 1);
    const requested = drag.scroll - delta;
    const target = Math.max(0, Math.min(this.#layout.maxScroll, requested));

    if (detail.phase === "start" || detail.phase === "update" || detail.phase === "end") {
      this.#setOverscroll(requested - target, vertical, rtl);
      this._viewport.scrollTo({
        top: vertical ? target : 0,
        left: vertical ? 0 : rtl ? -target : target,
        behavior: "auto",
      });
      this.#renderItems();

      if (detail.phase !== "end") return;
    }

    this.#dragStart = undefined;
    this.#releaseOverscroll();

    if (detail.phase !== "end") this.#swipeFocusedAction = undefined;

    if (detail.phase === "end" && requested !== target) {
      this.#setSelectedIndex(this.#findSelectedIndex(target), false, true);

      if (this.variant !== "uncontained") this.#scrollToSelected();
      else this.#repairSwipeFocus();

      return;
    }

    if (detail.phase === "end" && (this.variant === "multi-browse" || this.variant === "uncontained")) {
      const velocity = -detail.velocityX * (rtl ? -1 : 1);
      const startIndex = this.#findSelectedIndex(drag.scroll);

      if (Number.isFinite(velocity) && Math.abs(velocity) > FLING_STOP_VELOCITY) {
        if (!prefersReducedMotion()) {
          this.#startFling(velocity, startIndex);

          return;
        }

        if (this.variant === "multi-browse") {
          const start = this.#scrollOffset();
          const target = Math.max(0, Math.min(this.#layout.maxScroll, start + velocity * FLING_DECAY_MS));

          this.#setSelectedIndex(this.#flingIndex(velocity, startIndex, start, target), false, true);
          this.#scrollToSelected(false);

          return;
        }
      }
    }

    let index = this.#findSelectedIndex();

    if (detail.phase === "end" && (this.variant === "multi-browse" || vertical)) {
      index = drag.index + (delta < 0 ? 1 : -1);
    }

    if (
      detail.phase === "end" &&
      (this.variant === "hero" || this.variant === "hero-centered") &&
      index === drag.index &&
      delta !== 0
    ) {
      index = drag.index + (delta < 0 ? 1 : -1);
    }

    this.#setSelectedIndex(index, false, true);

    if (
      detail.phase === "end" &&
      (this.variant === "hero" || this.variant === "hero-centered" || vertical) &&
      !prefersReducedMotion()
    ) {
      const velocity = vertical ? -detail.velocityY : -detail.velocityX * (rtl ? -1 : 1);

      if (Number.isFinite(velocity) && Math.abs(velocity) > FLING_STOP_VELOCITY) {
        this.#startFling(velocity, drag.index, this._clampIndex(index));

        return;
      }
    }

    if (this.variant !== "uncontained") {
      this.#scrollToSelected();
    } else {
      this.#repairSwipeFocus();
    }
  }

  /** @private */
  #setOverscroll(excess: number, vertical: boolean, rtl: boolean): void {
    const limit = Math.min(OVERSCROLL_LIMIT, this.#itemAreaSize * 0.15);
    const offset =
      limit > 0 ? -Math.sign(excess) * limit * (1 - Math.exp((-Math.abs(excess) * OVERSCROLL_FRICTION) / limit)) : 0;

    this.#overscrollOffset = offset;
    this._viewport.classList.remove("-overscroll-return");

    const physicalOffset = rtl ? -offset : offset;

    this._viewport.style.transform =
      offset === 0 ? "" : `translate(${vertical ? 0 : physicalOffset}px, ${vertical ? offset : 0}px)`;
  }

  /** @private */
  #releaseOverscroll(): void {
    if (this.#overscrollOffset === 0) return;

    this.#overscrollOffset = 0;
    this._viewport.classList.toggle("-overscroll-return", !prefersReducedMotion());
    this._viewport.style.transform = "";
  }

  /** @private */
  #resetOverscroll(): void {
    this.#overscrollOffset = 0;

    if (this._viewport.classList.contains("-overscroll-return")) {
      for (const animation of this._viewport.getAnimations()) animation.cancel();
    }

    this._viewport.classList.remove("-overscroll-return");
    this._viewport.style.transform = "";
  }

  /** @private */
  #repairSwipeFocus(): void {
    const focused = this.#swipeFocusedAction;

    this.#swipeFocusedAction = undefined;

    if (!focused?.matches(":focus") || !this.#layout) return;

    const positions = this.#layout.itemsAt(this.#scrollOffset());
    const isVisible = (index: number): boolean => {
      const item = positions[index];

      return (
        !!item &&
        item.size > 0 &&
        item.position + item.size / 2 > 0 &&
        item.position - item.size / 2 < this.#itemAreaSize
      );
    };

    const focusedIndex = this.#items.findIndex((item) => item.action === focused);

    if (focusedIndex < 0 || isVisible(focusedIndex)) return;

    let target: M3eCarouselItemActionElement | undefined;
    let distance = Infinity;

    for (const [index, item] of this.#items.entries()) {
      const action = item.action;
      const candidateDistance = Math.abs(index - this.selectedIndex);

      if (
        action &&
        !item.disabled &&
        !this._focusKeyManager.skipPredicate(action) &&
        isVisible(index) &&
        candidateDistance < distance &&
        this._focusKeyManager.items.includes(action)
      ) {
        target = action;
        distance = candidateDistance;
      }
    }

    if (!target) return;

    this.#repairingSwipeFocus = true;

    try {
      target.focus({ preventScroll: true });
    } finally {
      this.#repairingSwipeFocus = false;
    }
  }
}

interface M3eCarouselElementEventMap extends HTMLElementEventMap {
  change: CustomEvent<CarouselChangeDetail>;
}

export interface M3eCarouselElement {
  addEventListener<K extends keyof M3eCarouselElementEventMap>(
    type: K,
    listener: (this: M3eCarouselElement, ev: M3eCarouselElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eCarouselElementEventMap>(
    type: K,
    listener: (this: M3eCarouselElement, ev: M3eCarouselElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-carousel": M3eCarouselElement;
  }
}
