/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { css, CSSResultGroup, html, LitElement } from "lit";
import { property, query, state } from "lit/decorators.js";

import {
  addCustomState,
  AttachInternals,
  AttachInternalsMixin,
  customElement,
  deleteCustomState,
  DesignToken,
  hasAssignedNodes,
  ResizeController,
  Role,
  setCustomState,
  spaceSeparatedStringConverter,
} from "@m3e/web/core";

import { M3eDirectionality, SupportsDirectionality } from "@m3e/web/core/bidi";

import { GestureDetail } from "@m3e/web/gestures";
import { SwipeGestureDetail, SwipeGestureDirection } from "@m3e/web/gestures/swipe";

import "@m3e/web/gestures/swipe";
import "@m3e/web/gestures/tap";
import "@m3e/web/gestures/repeat";
import "@m3e/web/gestures/long-press";

import { M3eSwipeRevealGroupElement } from "./SwipeRevealGroupElement";
import { SwipeRevealTrigger } from "./SwipeRevealTrigger";
import { SwipeRevealSide } from "./SwipeRevealSide";
import { SwipeRevealState } from "./SwipeRevealState";
import { SwipeRevealDefaults } from "./SwipeRevealDefaults";
import { SwipeRevealDismiss } from "./SwipeRevealDismiss";
import { SwipeRevealElastic } from "./SwipeRevealElastic";
import { SwipeRevealEventDetail } from "./SwipeRevealEventDetail";

type StaggerItem = {
  el: HTMLElement;
  distance: number;
  spacer: HTMLElement | null;
  original: string | null;
};

/** Properties the UA popover stylesheet overrides, which must be pinned to keep a promoted sibling's appearance. */
const PROMOTED_STYLES = [
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-top-width",
  "border-right-width",
  "border-bottom-width",
  "border-left-width",
  "border-top-style",
  "border-right-style",
  "border-bottom-style",
  "border-left-style",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "background-color",
  "color",
  "overflow-x",
  "overflow-y",
];

/**
 * Reveals contextual actions behind content when swiped, and optionally dismisses the item.
 *
 * @description
 * The `m3e-swipe-reveal` component uncovers leading and trailing actions as its content is dragged. While
 * dragging, the content is promoted to the top layer so it is never clipped by the item or by a scrolling
 * ancestor, and siblings can be staggered to follow the drag. Actions fade, clip and squish as they are
 * uncovered. Reveal can also be triggered by tap, double tap or long press. When `dismissible`, continuing a swipe
 * past the actions dismisses the item, using the outermost action as the dismiss action. Direction is
 * mirrored for right-to-left layouts. Wrap items in an `m3e-swipe-reveal-group` to coordinate them.
 *
 * @example
 * The following example illustrates an item with a leading and a trailing action which can be dismissed
 * by swiping toward the trailing side.
 * ```html
 * <m3e-swipe-reveal dismissible="trailing">
 *   <m3e-icon-button slot="leading" aria-label="Pin">…</m3e-icon-button>
 *   <m3e-icon-button slot="trailing" aria-label="Delete">…</m3e-icon-button>
 *   Content
 * </m3e-swipe-reveal>
 * ```
 *
 * @tag m3e-swipe-reveal
 *
 * @slot - Renders the content which is dragged to reveal actions.
 * @slot leading - Renders the actions revealed at the leading edge.
 * @slot trailing - Renders the actions revealed at the trailing edge.
 *
 * @attr dismissible - Which side, if any, can be swiped past its actions to dismiss the item.
 * @attr elastic - Which sides' actions squish and grow as the content is dragged.
 * @attr dismiss-threshold - The fraction of the content's width at which a slow release dismisses.
 * @attr overshoot - The distance, in pixels, content can be dragged past the actions.
 * @attr stagger - How far (0 to 1) the nearest sibling follows a dragged item.
 * @attr stagger-count - The number of siblings on each side that are staggered.
 * @attr threshold - The fraction of the actions' width at which a release reveals or covers.
 * @attr triggers - Space separated interactions that reveal actions.
 *
 * @fires revealing - Emitted when the item begins to reveal actions.
 * @fires revealed - Emitted when actions are revealed.
 * @fires covered - Emitted when actions are covered.
 * @fires dismiss - Emitted, cancelable, before the item is dismissed.
 * @fires dismissed - Emitted after the item has been dismissed.
 *
 * @cssprop --m3e-swipe-reveal-actions-padding - The inline padding around the leading and trailing actions.
 * @cssprop --m3e-swipe-reveal-actions-gap - The gap between adjacent actions.
 * @cssprop --m3e-swipe-reveal-actions-container-color - The background color of the leading and trailing actions.
 * @cssprop --m3e-swipe-reveal-actions-container-shape - The corner shape of the leading and trailing actions.
 * @cssprop --m3e-swipe-reveal-actions-underlap - How far the actions' container extends beneath the content.
 * @cssprop --m3e-swipe-reveal-leading-actions-underlap - How far the leading actions' container extends beneath the content.
 * @cssprop --m3e-swipe-reveal-trailing-actions-underlap - How far the trailing actions' container extends beneath the content.
 * @cssprop --m3e-swipe-reveal-leading-actions-padding - The inline padding around the leading actions.
 * @cssprop --m3e-swipe-reveal-leading-actions-gap - The gap between adjacent leading actions.
 * @cssprop --m3e-swipe-reveal-leading-actions-container-color - The background color of the leading actions.
 * @cssprop --m3e-swipe-reveal-leading-actions-container-shape - The corner shape of the leading actions.
 * @cssprop --m3e-swipe-reveal-trailing-actions-padding - The inline padding around the trailing actions.
 * @cssprop --m3e-swipe-reveal-trailing-actions-gap - The gap between adjacent trailing actions.
 * @cssprop --m3e-swipe-reveal-trailing-actions-container-color - The background color of the trailing actions.
 * @cssprop --m3e-swipe-reveal-trailing-actions-container-shape - The corner shape of the trailing actions.
 */
@customElement("m3e-swipe-reveal")
export class M3eSwipeRevealElement extends SupportsDirectionality(AttachInternals(Role(LitElement, "none"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      position: relative;
    }
    .content {
      position: relative;
      touch-action: pan-y;
      z-index: 1;
      transition: transform ${DesignToken.motion.spring.fastSpatial};
      transform: translateX(0px);
      will-change: transform;
    }
    :host(:state(--dragging)) .content {
      user-select: none;
      -webkit-user-select: none;
    }
    .content[popover] {
      margin: 0;
      padding: 0;
      border: 0;
      inset: auto;
      overflow: visible;
      background: none;
      color: inherit;
    }
    .leading,
    .trailing {
      display: flex;
      position: absolute;
      box-sizing: border-box;
      --_actions-padding: var(--m3e-swipe-reveal-actions-padding, ${DesignToken.measurement.space100});
      --_actions-gap: var(--m3e-swipe-reveal-actions-gap, ${DesignToken.measurement.space50});
      --_actions-container-color: var(--m3e-swipe-reveal-actions-container-color, transparent);
      --_actions-container-shape: var(--m3e-swipe-reveal-actions-container-shape, ${DesignToken.shape.corner.none});
      --_actions-underlap: var(--m3e-swipe-reveal-actions-underlap, 0px);
      inset-block: 0;
      background-color: var(--_container-color);
      border-radius: var(--_container-shape);
      inset-inline: 0 auto;
      visibility: var(--_swipe-reveal-actions-visibility, hidden);
      opacity: var(--_swipe-reveal-opacity, 0);
      transition:
        opacity var(--_swipe-reveal-motion, 0s),
        width var(--_swipe-reveal-motion, 0s);
    }
    .leading {
      --_padding: var(--m3e-swipe-reveal-leading-actions-padding, var(--_actions-padding));
      padding-inline: var(--_padding);
      gap: var(--m3e-swipe-reveal-leading-actions-gap, var(--_actions-gap));
      --_container-color: var(--m3e-swipe-reveal-leading-actions-container-color, var(--_actions-container-color));
      --_container-shape: var(--m3e-swipe-reveal-leading-actions-container-shape, var(--_actions-container-shape));
      --_underlap: var(--m3e-swipe-reveal-leading-actions-underlap, var(--_actions-underlap));
      margin-inline-end: var(--_underlap);
    }
    .trailing {
      --_padding: var(--m3e-swipe-reveal-trailing-actions-padding, var(--_actions-padding));
      padding-inline: var(--_padding);
      gap: var(--m3e-swipe-reveal-trailing-actions-gap, var(--_actions-gap));
      --_container-color: var(--m3e-swipe-reveal-trailing-actions-container-color, var(--_actions-container-color));
      --_container-shape: var(--m3e-swipe-reveal-trailing-actions-container-shape, var(--_actions-container-shape));
      --_underlap: var(--m3e-swipe-reveal-trailing-actions-underlap, var(--_actions-underlap));
      inset-inline: auto 0;
      justify-content: flex-end;
      margin-inline-start: var(--_underlap);
    }
    :host(:is(:state(--revealing), :--revealing, :state(--revealed), :--revealed, :state(--dismissing), :--dismissing))
      .leading,
    :host(:is(:state(--revealing), :--revealing, :state(--revealed), :--revealed, :state(--dismissing), :--dismissing))
      .trailing {
      --_swipe-reveal-actions-visibility: visible;
    }
    :host(:is(:state(--dismissed), :--dismissed)) .content {
      visibility: hidden;
    }
    :host(:is(:state(--revealed), :--revealed)) .content {
      cursor: pointer;
    }
    :host(:not(:is(:state(--has-leading), :--has-leading))) .leading,
    :host(:not(:is(:state(--has-trailing), :--has-trailing))) .trailing {
      display: none;
    }
  `;

  /** @private */ #group: M3eSwipeRevealGroupElement | null = null;
  /** @private */ #stagger?: number;
  /** @private */ #staggerCount?: number;
  /** @private */ #threshold?: number;
  /** @private */ #overshoot?: number;
  /** @private */ #triggers?: readonly SwipeRevealTrigger[];
  /** @private */ #dismissible?: SwipeRevealDismiss;
  /** @private */ #elastic?: SwipeRevealElastic;
  /** @private */ #dismissThreshold?: number;
  /** @private */ #armed = false;
  /** @private */ #outermost = new Map<SwipeRevealSide, { el: HTMLElement; width: number }>();

  /** @private */ #squished = new Set<HTMLElement>();
  /** @private */ #actionWidths = new Map<SwipeRevealSide, number>();
  /** @private */ #staggered: StaggerItem[] = [];
  /** @private */ #finishStagger?: () => void;
  /** @private */ #dragging = false;
  /** @private */ #x = 0;
  /** @private */ #base = 0;
  /** @private */ #side: SwipeRevealSide | null = null;
  /** @private */ #restSide: SwipeRevealSide | null = null;
  /** @private */ #suppressClick = false;
  /** @private */ #cancelSettle?: () => void;

  /** @private */ readonly #placeholderResizeController = new ResizeController(this, {
    target: null,
    skipInitial: true,
    callback: () => this.#handlePlaceholderResize(),
  });

  /** @private */ @state() private _state: SwipeRevealState = "covered";
  /** @private */ @state() private _hasLeading: boolean = false;
  /** @private */ @state() private _hasTrailing: boolean = false;

  /** @private */ @query(".content") private _content?: HTMLElement;
  /** @private */ @query(".placeholder") private _placeholder?: HTMLElement;

  /**
   * How far (0 to 1) a nearest sibling follows a dragged item. Each further sibling
   * follows by half as much as the previous. A value of `0` disables staggering.
   * @default 0
   */
  @property({ type: Number }) get stagger(): number {
    return this.#stagger ?? this.#group?.stagger ?? SwipeRevealDefaults.stagger;
  }
  set stagger(value: number) {
    this.#stagger = value;
  }

  /**
   * The maximum number of siblings, on each side, to stagger.
   * @default 3
   */
  @property({ type: Number, attribute: "stagger-count" })
  get staggerCount(): number {
    return this.#staggerCount ?? this.#group?.staggerCount ?? SwipeRevealDefaults.staggerCount;
  }
  set staggerCount(value: number) {
    this.#staggerCount = value;
  }

  /**
   * The fraction (0 to 1) of an actions' width content must be dragged to reveal.
   * Closing a revealed item uses the same fraction in reverse.
   * @default 0.5
   */
  @property({ type: Number }) get threshold(): number {
    return this.#threshold ?? this.#group?.threshold ?? SwipeRevealDefaults.threshold;
  }
  set threshold(value: number) {
    this.#threshold = value;
  }

  /**
   * The maximum distance (px) content can be dragged past fully revealing its actions.
   * Buttons grow with the overshoot. Set to `0` to disable.
   * @default 8
   */
  @property({ type: Number }) get overshoot(): number {
    return this.#overshoot ?? this.#group?.overshoot ?? SwipeRevealDefaults.overshoot;
  }
  set overshoot(value: number) {
    this.#overshoot = value;
  }

  /**
   * The gestures used to reveal actions.
   * @default ["swipe"]
   */
  @property({ converter: spaceSeparatedStringConverter })
  get triggers(): readonly SwipeRevealTrigger[] {
    return this.#triggers ?? this.#group?.triggers ?? [...SwipeRevealDefaults.triggers];
  }
  set triggers(value: readonly SwipeRevealTrigger[]) {
    this.#triggers = value;
  }

  /**
   * The sides whose swipe can continue past the actions to dismiss the item. The outermost
   * action on a side grows to fill the space as the item is dragged toward dismissal.
   * @default "none"
   */
  @property() get dismissible(): SwipeRevealDismiss {
    return this.#dismissible ?? this.#group?.dismissible ?? SwipeRevealDefaults.dismissible;
  }
  set dismissible(value: SwipeRevealDismiss) {
    this.#dismissible = value;
  }

  /**
   * The sides whose actions squish and grow as the content is dragged. When a side is not
   * elastic, its actions keep their size and its container does not grow with overshoot.
   * @default "both"
   */
  @property() get elastic(): SwipeRevealElastic {
    return this.#elastic ?? this.#group?.elastic ?? SwipeRevealDefaults.elastic;
  }
  set elastic(value: SwipeRevealElastic) {
    this.#elastic = value;
  }

  /**
   * The fraction (0 to 1) of the item's width it must be dragged to dismiss it on release.
   * @default 0.6
   */
  @property({ type: Number, attribute: "dismiss-threshold" })
  get dismissThreshold(): number {
    return this.#dismissThreshold ?? this.#group?.dismissThreshold ?? SwipeRevealDefaults.dismissThreshold;
  }
  set dismissThreshold(value: number) {
    this.#dismissThreshold = value;
  }

  /** The side currently revealed or `null` when covered. */
  get side(): SwipeRevealSide | null {
    return this.#side;
  }

  /** The current reveal state. */
  get state(): SwipeRevealState {
    return this._state;
  }

  /**
   * Reveals actions without dragging.
   * @param {SwipeRevealSide | undefined} side The side to reveal; defaults to `"leading"`, or `"trailing"` when there are no leading actions.
   */
  reveal(side?: SwipeRevealSide): void {
    const content = this._content;
    const placeholder = this._placeholder;
    if (!content || !placeholder || this.#dragging || this.#isGone) return;

    side ??= this._hasLeading ? "leading" : "trailing";
    if (!(side === "leading" ? this._hasLeading : this._hasTrailing) || this.#side === side) return;

    this.#cancelSettle?.();

    // Close other open items first and release this element if it was promoted by their stagger.
    this.#closeSiblings();
    this.#promote(content, placeholder);
    this.#lockActions();
    this.#setProgress(0, false);
    void content.offsetWidth; // force reflow
    this.#settle(side);
  }

  /** Covers the content, hiding any revealed actions. */
  close(): void {
    if (this.#isGone) return;

    // Also covers an item that is still settling toward a revealed position.
    if (this.#side || this.#x !== 0) {
      this.#settle(null);
      this.#endStagger();
    }
  }

  /**
   * Dismisses the item by sliding it out and collapsing the space it occupied. A cancelable `dismiss`
   * event is fired first, and `dismissed` once the item is gone. Removing the element is up to the consumer.
   * @param {SwipeRevealSide | undefined} side The side to dismiss toward; defaults to the revealed side.
   */
  dismiss(side?: SwipeRevealSide): void {
    if (this.#isGone || this.#dragging) return;

    side ??= this.#side ?? (this.#canDismiss("leading") ? "leading" : "trailing");
    if (this.#canDismiss(side)) {
      this.#dismiss(side);
    }
  }

  /** Brings back an item that was dismissed, for example when the user chooses to undo. */
  restore(): void {
    if (!this.#isGone) return;

    this.#cancelSettle?.();
    this.#unlockActions();

    const content = this._content;
    const placeholder = this._placeholder;
    if (content && placeholder) {
      this.#demote(content, placeholder);
      placeholder.style.removeProperty("transition");
    }

    this.#x = 0;
    this.#side = this.#restSide = null;
    this.#setState("covered");
  }

  /** @private */
  get #isGone(): boolean {
    return this._state === "dismissing" || this._state === "dismissed";
  }

  /** @private */
  #isElastic(side: SwipeRevealSide): boolean {
    return this.elastic === "both" || this.elastic === side;
  }

  /** @private */
  #canDismiss(side: SwipeRevealSide): boolean {
    const dismissible = this.dismissible;
    return (
      (dismissible === "both" || dismissible === side) && (side === "leading" ? this._hasLeading : this._hasTrailing)
    );
  }

  /** @private */
  #dismissAt(side: SwipeRevealSide): number {
    // Dismissing must take a clearly deliberate drag, beyond the point where the actions are fully revealed.
    return Math.max(this.dismissThreshold * (this._content?.offsetWidth ?? 0), this.#actionWidth(side) * 1.2);
  }

  /** @private */
  #setArmed(armed: boolean): void {
    if (this.#armed === armed) return;
    this.#armed = armed;
    setCustomState(this, "--armed", armed);
  }

  /** @private */
  #whenTransitioned(target: HTMLElement, property: string, timeout: number, done: () => void): void {
    let timer = 0;

    const cleanup = () => {
      target.removeEventListener("transitionend", onEnd);
      clearTimeout(timer);
      if (this.#cancelSettle === cleanup) this.#cancelSettle = undefined;
    };

    const onEnd = (e: TransitionEvent) => {
      if (e.target === target && e.propertyName === property) {
        cleanup();
        done();
      }
    };

    this.#cancelSettle?.();
    target.addEventListener("transitionend", onEnd);
    timer = window.setTimeout(() => {
      cleanup();
      done();
    }, timeout);
    this.#cancelSettle = cleanup;
  }

  /** @private */
  #dismiss(side: SwipeRevealSide): void {
    const content = this._content;
    const placeholder = this._placeholder;
    if (!content || !placeholder) return;

    const event = this.#createEvent("dismiss", side, {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (!this.dispatchEvent(event)) {
      // The consumer declined, so spring back to where the item was resting.
      this.#setArmed(false);
      if (this.#x !== 0 || this.#side) this.#settle(this.#side);
      return;
    }

    this.#cancelSettle?.();
    this.#setArmed(false);
    this.#closeSiblings();
    this.#promote(content, placeholder);
    this.#lockActions();
    this.#setState("dismissing");

    // Slide fully out of view (the content is in the top layer, so it isn't clipped by the container).
    const width = content.offsetWidth;
    const bounds = placeholder.getBoundingClientRect();
    const sign = this.#dir * (side === "leading" ? 1 : -1);
    const to = sign > 0 ? window.innerWidth - bounds.left : -(bounds.left + width);

    this.#x = to;
    this.#side = side;
    this.#setProgress(sign * width, true);
    content.style.transition = "";
    content.style.transform = `translateX(${to}px)`;

    this.#whenTransitioned(content, "transform", 600, () => {
      // Collapse the space so siblings close the gap.
      placeholder.style.transition = "height 250ms cubic-bezier(0.2, 0, 0, 1)";
      void placeholder.offsetHeight; // force reflow
      placeholder.style.height = "0px";

      this.#whenTransitioned(placeholder, "height", 400, () => {
        this.#setState("dismissed");
        this.dispatchEvent(
          this.#createEvent("dismissed", side, {
            bubbles: true,
            composed: true,
          }),
        );
      });
    });
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    setCustomState(this, "--covered", this._state === "covered");
    this.#group = this.closest("m3e-swipe-reveal-group");

    this.#directionalitySubscription?.();
    this.#directionalitySubscription = M3eDirectionality.observe(() => this.#handleDirectionChange());
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#directionalitySubscription?.();
    this.#directionalitySubscription = undefined;

    this.#cancelSettle?.();
    this.#setArmed(false);
    this.#unlockActions();
    this.#finishStagger?.();

    const content = this._content;
    const placeholder = this._placeholder;
    if (content && placeholder) {
      this.#demote(content, placeholder);
    }

    this.#side = this.#restSide = null;
    this.#x = 0;
    this.#setState("covered");

    this.#group = null;
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="leading" role="none">
        <slot name="leading" @slotchange=${this.#handleSlotChange}></slot>
      </div>
      <div class="content" role="none" id="content" @click=${{ handleEvent: this.#handleContentClick, capture: true }}>
        <slot></slot>
      </div>
      <div class="placeholder" aria-hidden="true"></div>
      <div class="trailing" role="none">
        <slot name="trailing" @slotchange=${this.#handleSlotChange}></slot>
      </div>
      ${this.#renderTriggers()}`;
  }

  /** @private */ #directionalitySubscription?: () => void;

  /** @private */
  get #dir(): 1 | -1 {
    return M3eDirectionality.current === "rtl" ? -1 : 1;
  }

  /** @private */
  get #leadingDirection(): SwipeGestureDirection {
    return this.#dir === 1 ? "right" : "left";
  }

  /** @private */
  #handleDirectionChange(): void {
    // Close without animation, as the physical offset no longer matches the new direction.
    this.close();
    this.requestUpdate();
  }

  /** @private */
  #renderTriggers(): unknown {
    const disabled = !this._hasLeading && !this._hasTrailing;
    const swipeDirections: SwipeGestureDirection[] = [];

    // While revealed, the opposite swipe direction is needed to close.
    const revealed = this._state !== "covered";
    const leading = this.#leadingDirection;
    const trailing = leading === "right" ? "left" : "right";
    if (this._hasLeading || (revealed && this._hasTrailing)) {
      swipeDirections.push(leading);
    }

    if (this._hasTrailing || (revealed && this._hasLeading)) {
      swipeDirections.push(trailing);
    }

    return html` <m3e-swipe-gesture
        for="content"
        .directions=${swipeDirections}
        direction-grace-period="1"
        ?disabled="${!this.triggers.includes("swipe") || swipeDirections.length == 0}"
        @gesture=${this.#handleSwipeGesture}
      ></m3e-swipe-gesture>
      <m3e-tap-gesture
        for="content"
        ?disabled=${!this.triggers.includes("tap") || disabled}
        @gesture=${this.#handleTriggerGesture}
      ></m3e-tap-gesture>
      <m3e-repeat-gesture
        for="content"
        ?disabled=${!this.triggers.includes("double-tap") || disabled}
        @gesture=${this.#handleTriggerGesture}
      >
        <m3e-tap-gesture></m3e-tap-gesture>
      </m3e-repeat-gesture>
      <m3e-long-press-gesture
        for="content"
        ?disabled=${!this.triggers.includes("long-press") || disabled}
        @gesture=${this.#handleTriggerGesture}
      ></m3e-long-press-gesture>`;
  }

  /** @private */
  #handleTriggerGesture(e: CustomEvent<GestureDetail>): void {
    if (e.detail.phase !== "end") return;

    switch (this.state) {
      case "revealed":
        this.close();
        break;

      case "covered":
        this.reveal();

        if (e.detail.gestureName === "long-press") {
          // The release that follows a long press would otherwise click the content and close it again.
          this.#suppressClick = true;
          window.addEventListener("pointerup", () => setTimeout(() => (this.#suppressClick = false)), { once: true });
        }
        break;
    }
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    const slot = e.target as HTMLSlotElement;
    const hasSlot = hasAssignedNodes(slot);
    setCustomState(this, `--has-${slot.name}`, hasSlot);

    switch (slot.name) {
      case "leading":
        this._hasLeading = hasSlot;
        break;

      case "trailing":
        this._hasTrailing = hasSlot;
        break;
    }
  }

  /** @private */
  #handlePlaceholderResize(): void {
    const content = this._content;
    const placeholder = this._placeholder;
    if (!content || !placeholder || !content.matches(":popover-open")) return;

    const { width } = placeholder.getBoundingClientRect();
    if (width > 0) content.style.width = `${width}px`;
    this.#sync();
  }

  /** @private */
  #handleSwipeGesture(e: CustomEvent<SwipeGestureDetail>): void {
    const content = this._content;
    const placeholder = this._placeholder;
    if (!content || !placeholder || this.#isGone) return;

    const leadingWidth = this.#actionWidth("leading");
    const trailingWidth = this.#actionWidth("trailing");

    switch (e.detail.phase) {
      case "start":
        this.#cancelSettle?.();
        this.#setDragging(false);
        // Resume from wherever the content visually is, including mid-transition.
        this.#base = this.#x = new DOMMatrixReadOnly(getComputedStyle(content).transform).m41;
        break;

      case "update":
        {
          // Computed in logical space (positive reveals leading), then mapped back to physical.
          const raw = (this.#base + e.detail.translationX) * this.#dir;
          const x =
            this.#dir *
            (raw >= 0
              ? this._hasLeading
                ? this.#drag(raw, "leading", leadingWidth)
                : 0
              : this._hasTrailing
                ? -this.#drag(-raw, "trailing", trailingWidth)
                : 0);
          this.#x = x;

          const begin = !this.#dragging;
          let displaced = 0;

          if (begin) {
            this.#setDragging(true);
            // Must precede measuring: the other item's stagger may have promoted this element.
            displaced = this.#closeSiblings();
          }

          this.#promote(content, placeholder);

          if (begin) {
            // Start visually where the stagger left this element, then ease onto the pointer.
            content.style.transition = "none";
            content.style.translate = `${displaced}px`;
            void content.offsetWidth; // force reflow
          }

          content.style.transition = `translate ${DesignToken.motion.spring.fastSpatial}`;
          content.style.translate = "0px";

          if (begin) {
            this.#setState("revealing", x * this.#dir > 0 ? "leading" : "trailing");
            this.#lockActions();
            this.#beginStagger();
          }

          content.style.transform = `translateX(${x}px)`;
          this.#setProgress(x, false);
          this.#applyStagger(x);

          const logical = x * this.#dir;
          const dragSide: SwipeRevealSide | null = logical > 0 ? "leading" : logical < 0 ? "trailing" : null;
          this.#setArmed(!!dragSide && this.#canDismiss(dragSide) && Math.abs(x) >= this.#dismissAt(dragSide));
        }
        break;

      default: {
        if (!this.#dragging) break;

        this.#setDragging(false);

        // A swipe that is too slow to be recognized is cancelled, so position decides in that case.
        const x = this.#x * this.#dir;
        const side: SwipeRevealSide | null = x > 0 ? "leading" : x < 0 ? "trailing" : null;
        let target: SwipeRevealSide | null = null;
        let dismiss = false;

        if (side) {
          const leading = this.#leadingDirection;
          const sideDirection = side === "leading" ? leading : leading === "right" ? "left" : "right";

          if (e.detail.phase === "end") {
            target = e.detail.direction === sideDirection ? side : null;
            // A fling dismisses only from a revealed or armed item, so a quick swipe from rest still just reveals.
            dismiss =
              !!target &&
              this.#canDismiss(side) &&
              (this.#armed || this.#side === side || Math.abs(x) > this.#actionWidth(side) + 1);
          } else {
            const progress = Math.abs(x) / ((side === "leading" ? leadingWidth : trailingWidth) || Infinity);
            const threshold = this.#side === side ? 1 - this.threshold : this.threshold;
            target = progress >= threshold ? side : null;
            dismiss = this.#canDismiss(side) && Math.abs(x) >= this.#dismissAt(side);
          }
        }

        if (dismiss && side) {
          this.#endStagger();
          this.#dismiss(side);
        } else {
          this.#setArmed(false);
          this.#settle(target);
          this.#endStagger();
        }
        break;
      }
    }
  }

  /** @private */
  #resolveReveals() {
    const reveals = this.#group?.reveals ?? [...(this.parentElement?.querySelectorAll("m3e-swipe-reveal") ?? [])];
    // Dismissed items are only awaiting removal, so they take no part in staggering or closing.
    return reveals.filter((x) => !x.#isGone);
  }

  /** @private */
  #drag(distance: number, side: SwipeRevealSide, actionWidth: number): number {
    // A dismissible side moves freely up to the full width, while others resist past the actions' width.
    return this.#canDismiss(side)
      ? Math.min(distance, this._content?.offsetWidth ?? distance)
      : this.#rubberBand(distance, actionWidth);
  }

  /** @private */
  #closeSiblings(): number {
    // Cover revealed or revealing siblings in the same container (only one item is open at a time) and
    // return how far this element was displaced by their stagger.

    let displaced = 0;

    const siblings = this.#resolveReveals().filter((x) => x !== this);

    // Release any sibling still springing back from its own stagger, so it is back in flow before measuring.
    siblings.forEach((x) => x.#finishStagger?.());

    for (const sibling of siblings) {
      if (sibling._state === "covered" || sibling.#dragging) continue;

      // Take this element out of the other's stagger first, so it is back in flow before it measures itself.
      const index = sibling.#staggered.findIndex((item) => item.el === this);
      if (index >= 0) {
        const [item] = sibling.#staggered.splice(index, 1);
        displaced = new DOMMatrixReadOnly(getComputedStyle(this).transform).m41;
        if (this.matches(":popover-open")) this.hidePopover();
        this.removeAttribute("popover");
        if (item.original === null) this.removeAttribute("style");
        else this.setAttribute("style", item.original);
        item.spacer?.remove();
      }

      sibling.close();
    }

    return displaced;
  }

  /** @private */
  #settle(target: SwipeRevealSide | null): void {
    const content = this._content;
    const placeholder = this._placeholder;
    if (!content || !placeholder) return;

    this.#cancelSettle?.();

    const width = this.#actionWidth(target ?? "leading");
    const to = this.#dir * (target === "leading" ? width : target === "trailing" ? -width : 0);

    this.#x = to;
    this.#side = target;
    this.#setProgress(to, true);
    this.#setState("revealing");

    let timer = 0;

    const cleanup = () => {
      content.removeEventListener("transitionend", onEnd);
      clearTimeout(timer);
      this.#cancelSettle = undefined;
    };

    const finish = () => {
      cleanup();
      content.style.removeProperty("transition");
      this.#unlockActions();

      // A revealed item stays in the top layer so it is never clipped. A closing item that is still being
      // staggered by a sibling's drag stays there too, until that stagger ends.

      if (!target && !this.style.translate) {
        this.#demote(content, placeholder);
      }

      const state = target ? "revealed" : "covered";
      const previous = this.#restSide;
      this.#setState(state);

      if (previous !== target) {
        this.#restSide = target;
        const side = target ?? previous;
        if (side) this.dispatchEvent(this.#createEvent(state, side));
      }
    };

    const onEnd = (e: TransitionEvent) => {
      if (e.target === content && e.propertyName === "transform") {
        finish();
      }
    };

    content.addEventListener("transitionend", onEnd);
    timer = window.setTimeout(finish, 600);
    this.#cancelSettle = cleanup;
    content.style.transition = "";
    content.style.transform = `translateX(${to}px)`;
  }

  /** @private */
  #createEvent(type: string, side: SwipeRevealSide, init: EventInit = {}): CustomEvent<SwipeRevealEventDetail> {
    return new CustomEvent<SwipeRevealEventDetail>(type, {
      ...init,
      detail: { side },
    });
  }

  /** @private */
  /** @private */
  #setDragging(dragging: boolean): void {
    if (this.#dragging === dragging) return;
    this.#dragging = dragging;
    setCustomState(this, "--dragging", dragging);

    // Selection may have begun before the swipe was recognized.
    if (dragging) getSelection()?.removeAllRanges();
  }

  /** @private */
  #setState(state: SwipeRevealState, side: SwipeRevealSide | null = this.#side): void {
    if (this._state === state) return;

    const previous = this._state;
    this._state = state;

    setCustomState(this, "--covered", state === "covered");
    setCustomState(this, "--revealing", state === "revealing");
    setCustomState(this, "--revealed", state === "revealed");
    setCustomState(this, "--dismissing", state === "dismissing");
    setCustomState(this, "--dismissed", state === "dismissed");

    if (state === "revealing" && previous === "covered" && side) {
      this.dispatchEvent(this.#createEvent("revealing", side));
    }
  }

  /** @private */
  readonly #handleContentClick = (e: Event): void => {
    if (this.#suppressClick) {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }

    if (this._state !== "revealed") return;

    e.preventDefault();
    e.stopImmediatePropagation();

    this.close();
  };

  /** @private */
  #promote(content: HTMLElement, placeholder: HTMLElement): void {
    if (content.matches(":popover-open")) return;

    // Promote the content to the top layer so that it is not clipped by ancestor overflow.
    const bounds = content.getBoundingClientRect();
    placeholder.style.height = `${bounds.height}px`;
    content.style.width = `${bounds.width}px`;
    content.style.height = `${bounds.height}px`;
    content.style.position = "fixed";
    content.style.top = `${bounds.top}px`;
    content.style.left = `${bounds.left}px`;
    content.setAttribute("popover", "manual");
    content.showPopover();

    // The placeholder's width is left unpinned so it follows layout; observing it keeps the content in step.
    this.#placeholderResizeController.observe(placeholder);
    this.#track();
  }

  /** @private */
  #demote(content: HTMLElement, placeholder: HTMLElement): void {
    this.#placeholderResizeController.unobserve(placeholder);

    if (content.matches(":popover-open")) {
      content.hidePopover();
    }

    content.removeAttribute("popover");

    for (const p of ["transition", "transform", "translate", "position", "width", "height", "top", "left"]) {
      content.style.removeProperty(p);
    }

    placeholder.style.width = "";
    placeholder.style.height = "";
  }

  /** @private */ #tracking = 0;

  /** @private */
  #track(): void {
    if (this.#tracking) return;

    // Keep top-layer elements aligned every frame while any are promoted.
    const content = this._content;
    const tick = () => {
      if (
        !this.isConnected ||
        this._state === "dismissed" ||
        !(content?.matches(":popover-open") || this.#staggered.length > 0)
      ) {
        this.#tracking = 0;
        return;
      }
      this.#sync();
      this.#tracking = requestAnimationFrame(tick);
    };
    this.#tracking = requestAnimationFrame(tick);
  }

  /** @private */
  readonly #sync = (): void => {
    // Keep top-layer elements aligned with their in-flow placeholders as the page scrolls or resizes.
    const content = this._content;
    const placeholder = this._placeholder;

    if (content && placeholder && content.matches(":popover-open")) {
      const bounds = placeholder.getBoundingClientRect();
      content.style.top = `${bounds.top}px`;
      content.style.left = `${bounds.left}px`;
    }

    for (const { el, spacer } of this.#staggered) {
      if (!spacer) continue;

      const bounds = spacer.getBoundingClientRect();
      el.style.top = `${bounds.top}px`;
      el.style.left = `${bounds.left}px`;
    }
  };

  /** @private */
  #beginStagger(): void {
    this.#finishStagger?.();

    const list: StaggerItem[] = (this.#staggered = []);
    if (this.stagger <= 0) return;

    const reveals = this.#resolveReveals();
    const index = reveals.indexOf(this);
    if (index < 0) return;

    const targets: { el: HTMLElement; distance: number }[] = [];

    for (const step of [-1, 1]) {
      for (let i = 1; i <= this.staggerCount; i++) {
        const sibling = reveals[index + step * i];
        if (!sibling) break;
        if (sibling.hasAttribute("popover")) continue;

        if (sibling._state !== "covered") {
          // An open or closing host keeps its content in the top layer, so it is nudged in place
          // using `translate` (which composes with its content's own transform) and not promoted.

          list.push({ el: sibling, distance: i, spacer: null, original: null });
          sibling.#nudge(this.#staggerOffset(this.#x, i), true);
          continue;
        }

        targets.push({ el: sibling, distance: i });
      }
    }

    // Measure everything before promoting anything (promotion changes layout).
    const snapshots = targets.map(({ el }) => this.#measure(el));
    targets.forEach(({ el, distance }, i) => this.#promoteSibling(el, distance, list, this.#x, snapshots[i]));

    this.#track();
  }

  /** @private */
  #measure(el: HTMLElement) {
    const cs = getComputedStyle(el);
    const styles: Record<string, string> = {};

    for (const p of PROMOTED_STYLES) {
      styles[p] = cs.getPropertyValue(p);
    }

    // Longhands are read because some browsers return an empty string for the `margin` shorthand.
    const margin = ["top", "right", "bottom", "left"].map((x) => cs.getPropertyValue(`margin-${x}`) || "0px").join(" ");

    return { rect: el.getBoundingClientRect(), margin, styles };
  }

  /** @private */
  #promoteSibling(
    sibling: HTMLElement,
    distance: number,
    list: StaggerItem[],
    x: number,
    snapshot = this.#measure(sibling),
  ): void {
    const { rect, margin, styles } = snapshot;
    const spacer = document.createElement("div");

    spacer.style.cssText = `width:${rect.width}px;height:${rect.height}px;margin:${margin};flex:none;pointer-events:none`;
    spacer.setAttribute("aria-hidden", "true");
    sibling.before(spacer);

    const original = sibling.getAttribute("style");

    // The UA popover stylesheet would otherwise override the element's own appearance.
    for (const p of PROMOTED_STYLES) sibling.style.setProperty(p, styles[p]);
    sibling.style.cssText += `;margin:0;inset:auto;position:fixed;box-sizing:border-box;width:${rect.width}px;height:${rect.height}px;top:${rect.top}px;left:${rect.left}px;transition:none;will-change:transform;transform:translateX(${this.#staggerOffset(x, distance)}px)`;
    sibling.setAttribute("popover", "manual");
    sibling.showPopover();

    list.push({ el: sibling, distance, spacer, original });
  }

  /** @private */
  #nudge(px: number | null, animate: boolean): void {
    // The host's translate carries its content too, since a promoted content tracks the placeholder inside the host.
    if (px === null) {
      this.style.removeProperty("translate");
      this.style.removeProperty("transition");
      return;
    }

    const motion = `${DesignToken.motion.spring.fastSpatial}`;
    this.style.transition = animate ? `translate ${motion}` : "none";
    this.style.translate = `${px}px`;
  }

  /** @private */
  #actionWidth(name: SwipeRevealSide): number {
    // The actions' natural width, which stays stable while buttons grow or shrink during a drag.
    const container = this.shadowRoot?.querySelector<HTMLElement>(`.${name}`);
    return Math.max(0, (this.#actionWidths.get(name) ?? container?.offsetWidth ?? 0) - this.#underlap(name));
  }

  /** @private */
  #underlap(name: SwipeRevealSide): number {
    // The underlap is an inner-edge margin, so it resolves to pixels and marks how much of the container lies
    // beneath the content, which is not part of the reveal distance.
    const container = this.shadowRoot?.querySelector<HTMLElement>(`.${name}`);
    if (!container) return 0;
    return parseFloat(getComputedStyle(container)[name === "leading" ? "marginInlineEnd" : "marginInlineStart"]) || 0;
  }

  /** @private */
  #rubberBand(distance: number, width: number): number {
    // Resist dragging past the actions' width, easing toward a maximum overshoot.
    if (distance <= width || !(this.overshoot > 0)) {
      return Math.min(distance, width);
    }

    // Content moves at only a fraction of the pointer's speed past full reveal, tapering to overshoot.
    const friction = 0.4;
    return width + this.overshoot * (1 - Math.exp((-(distance - width) * friction) / this.overshoot));
  }

  /** @private */
  #lockActions(): void {
    // Freeze the actions' size, then squish slotted buttons using their `--squished` state.
    // The container width is frozen so squishing doesn't shrink the distance the content can be dragged.

    for (const name of ["leading", "trailing"] as const) {
      const container = this.shadowRoot?.querySelector<HTMLElement>(`.${name}`);
      if (!container || container.style.width) continue;

      const slot = container.querySelector("slot");
      const width = container.getBoundingClientRect().width;
      const assigned = slot?.assignedElements({ flatten: true }) ?? [];

      if (width > 0) {
        container.style.width = `${width}px`;
        this.#actionWidths.set(name, width);
      }

      if (!this.#isElastic(name)) continue;

      const buttons = assigned.flatMap((x) => [x, ...x.querySelectorAll("m3e-button, m3e-icon-button")]);

      for (const button of buttons) {
        if (!(button instanceof HTMLElement) || !/^m3e-(icon-)?button$/.test(button.localName)) continue;
        if (this.#squished.has(button) || button.style.getPropertyValue("--_button-width")) continue;

        // Measured before the state is applied, so this is the button's natural width.
        button.style.setProperty("--_button-width", `${button.getBoundingClientRect().width}px`);

        addCustomState(button as HTMLElement & AttachInternalsMixin, "--squished");
        this.#squished.add(button);
      }

      // The outermost action (nearest the edge) fills the space as the item is dragged toward dismissal.
      const edge = assigned[name === "leading" ? 0 : assigned.length - 1];
      const edgeWidth = edge instanceof HTMLElement ? parseFloat(edge.style.getPropertyValue("--_button-width")) : 0;

      if (edge instanceof HTMLElement && this.#squished.has(edge) && edgeWidth > 0) {
        this.#outermost.set(name, { el: edge, width: edgeWidth });
      }
    }
  }

  /** @private */
  #unlockActions(): void {
    for (const { el } of this.#outermost.values()) {
      el.style.removeProperty("--_squish-progress");
    }

    this.#outermost.clear();

    for (const button of this.#squished) {
      button.style.removeProperty("--_button-width");
      deleteCustomState(button as HTMLElement & AttachInternalsMixin, "--squished");
    }

    this.#squished.clear();
    this.#actionWidths.clear();

    for (const name of ["leading", "trailing"]) {
      this.shadowRoot?.querySelector<HTMLElement>(`.${name}`)?.style.removeProperty("width");
    }
  }

  /** @private */
  #setProgress(x: number, animate: boolean): void {
    // Drive the actions' fade, clip and scale from how far the content has uncovered them.
    const motion = animate ? `${DesignToken.motion.spring.fastSpatial}` : "0s";

    for (const [name, sign] of [
      ["leading", 1],
      ["trailing", -1],
    ] as const) {
      const el = this.shadowRoot?.querySelector<HTMLElement>(`.${name}`);
      if (!el) continue;

      const natural = this.#actionWidth(name);
      const ratio = (sign * this.#dir * x) / (natural || Infinity);
      const progress = Math.max(0, Math.min(1, ratio));

      // Past 1, buttons grow with the overshoot, and the container grows to hold them.
      const squish = this.#isElastic(name) ? Math.max(0, ratio) : progress;
      // On a dismissible side only the outermost action grows past full reveal, to fill the freed space.
      const outer = this.#canDismiss(name) ? this.#outermost.get(name) : undefined;
      el.style.setProperty("--_swipe-reveal-progress", String(progress));
      el.style.setProperty("--_swipe-reveal-opacity", this.#isElastic(name) ? String(progress) : "1");
      el.style.setProperty("--_squish-progress", String(outer ? Math.min(squish, 1) : squish));
      if (outer) {
        if (ratio > 1) {
          outer.el.style.setProperty("--_squish-progress", String(1 + (natural * (ratio - 1)) / outer.width));
        } else {
          outer.el.style.removeProperty("--_squish-progress");
        }
      }
      // Overshoot extends the container on elastic sides, adding to the underlap beneath the content.
      if (el.style.width) {
        el.style.width = `${natural * Math.max(1, squish) + this.#underlap(name)}px`;
      }
      el.style.setProperty("--_swipe-reveal-motion", motion);
    }
  }

  /** @private */
  #applyStagger(x: number): void {
    for (const { el, distance, spacer } of this.#staggered) {
      const offset = this.#staggerOffset(x, distance);
      if (spacer) {
        el.style.transform = `translateX(${offset}px)`;
      } else {
        (el as M3eSwipeRevealElement).#nudge(offset, true);
      }
    }
  }

  /** @private */
  #staggerOffset(x: number, distance: number): number {
    return x * this.stagger * Math.pow(0.5, distance - 1);
  }

  /** @private */
  #endStagger(): void {
    // Spring staggered siblings back to rest and releases them (only lasts while dragging).
    const staggered = this.#staggered;
    if (staggered.length === 0) return;

    let timer = 0;

    const finish = () => {
      clearTimeout(timer);
      this.#finishStagger = undefined;

      for (const { el, spacer, original } of staggered) {
        el.removeEventListener("transitionend", onEnd);

        if (!spacer) {
          const host = el as M3eSwipeRevealElement;
          host.#nudge(null, false);
          const content = host._content;
          const placeholder = host._placeholder;

          // An item that finished closing while staggered was kept in the top layer. Release it now.
          if (host._state === "covered" && content && placeholder && content.matches(":popover-open")) {
            host.#demote(content, placeholder);
          }

          continue;
        }

        if (el.matches(":popover-open")) el.hidePopover();
        el.removeAttribute("popover");

        if (original === null) {
          el.removeAttribute("style");
        } else {
          el.setAttribute("style", original);
        }

        spacer.remove();
      }

      if (this.#staggered === staggered) {
        this.#staggered = [];
      }
    };

    const onEnd = (e: TransitionEvent) => {
      if (e.propertyName === "transform" || e.propertyName === "translate") finish();
    };

    for (const { el, spacer } of staggered) {
      el.addEventListener("transitionend", onEnd);

      if (spacer) {
        el.style.transition = `transform ${DesignToken.motion.spring.fastSpatial}`;
        el.style.transform = "translateX(0px)";
      } else {
        (el as M3eSwipeRevealElement).#nudge(0, true);
      }
    }

    timer = window.setTimeout(finish, 600);
    this.#finishStagger = finish;
  }
}

interface M3eSwipeRevealElementEventMap extends HTMLElementEventMap {
  revealing: CustomEvent<SwipeRevealEventDetail>;
  revealed: CustomEvent<SwipeRevealEventDetail>;
  covered: CustomEvent<SwipeRevealEventDetail>;
  dismiss: CustomEvent<SwipeRevealEventDetail>;
  dismissed: CustomEvent<SwipeRevealEventDetail>;
}

export interface M3eSwipeRevealElement {
  addEventListener<K extends keyof M3eSwipeRevealElementEventMap>(
    type: K,
    listener: (this: M3eSwipeRevealElement, ev: M3eSwipeRevealElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eSwipeRevealElementEventMap>(
    type: K,
    listener: (this: M3eSwipeRevealElement, ev: M3eSwipeRevealElementEventMap[K]) => void,
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
    "m3e-swipe-reveal": M3eSwipeRevealElement;
  }
}
