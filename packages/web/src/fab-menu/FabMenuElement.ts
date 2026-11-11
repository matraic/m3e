/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import {
  AttachInternals,
  ClickOutsideController,
  customElement,
  DesignToken,
  DisabledMixin,
  forcedColorsActive,
  hasCustomState,
  prefersReducedMotion,
  Role,
  ScrollController,
  setCustomEnumState,
  setCustomState,
  SuppressInitialAnimation,
} from "@m3e/web/core";

import { RovingTabIndexManager } from "@m3e/web/core/a11y";
import { M3eDirectionality } from "@m3e/web/core/bidi";
import { positionAnchor } from "@m3e/web/core/anchoring";

import { M3eFabElement } from "@m3e/web/fab";

import { FabMenuVariant, isFabMenuVariant } from "./FabMenuVariant";

/** The minimum space, in pixels, kept between the menu and the top and bottom of the viewport. */
const viewportMargin = 8;

/** The space, in pixels, between the menu and its trigger. */
const menuOffset = 8;

/**
 * Returns when each item of a menu appears or disappears, as in Compose's `FloatingActionButtonMenu`: a counter animates
 * between 0 and the number of items with the slow effects spring (damping ratio 1, stiffness 800 in both motion
 * schemes) and is truncated to an integer, and an item shows while the counter is at least the number of items minus
 * its index. The counter reaches the number of items only when its animation ends, at a remaining distance of 1, so the
 * top two items appear together.
 * @param {number} count The number of items.
 * @param {boolean} open Whether the menu is opening.
 * @returns {Array<number>} The delay of each item, from top to bottom, in whole milliseconds as Compose advances the
 * counter.
 */
function staggerDelays(count: number, open: boolean): number[] {
  const w = Math.sqrt(800);

  // The time, in milliseconds, at which the remaining distance of the counter, count * (1 + wt) * e^-wt, drops to
  // `remaining`.
  const crossing = (remaining: number) => {
    if (remaining >= count) return 0;
    let [low, high] = [0, 1];
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      if (count * (1 + w * mid) * Math.exp(-w * mid) > remaining) low = mid;
      else high = mid;
    }
    return high * 1000;
  };

  // The animation snaps to its target at its estimated duration, truncated to a whole millisecond.
  const end = Math.floor(crossing(1));
  return Array.from({ length: count }, (_, i) => Math.min(Math.ceil(crossing(open ? Math.max(i, 1) : count - i)), end));
}

/**
 * A menu, opened from a floating action button (FAB), used to display multiple related actions.
 *
 * @description
 * The `m3e-fab-menu` component presents a dynamic menu of related actions, elegantly revealed from a
 * floating action button (FAB). Designed using expressive, adaptive surfaces, it enables seamless access
 * to contextual actions in modern, visually rich interfaces.
 *
 * When the items do not fit above the FAB, they scroll behind it and can be revealed below it up to the viewport edge.
 * On devices with a touch-capable pointer, the scrollable menu also receives touches in its empty space.
 *
 * @example
 * Nest a menu trigger in a FAB and associate it with the menu by id. Import `@m3e/web/fab` and `@m3e/web/icon` for the FAB and icons. Give the icon-only FAB an accessible label.
 *
 * ```html
 * <m3e-fab variant="primary" size="large">
 *   <m3e-fab-menu-trigger for="fabmenu">
 *     <m3e-icon name="edit"></m3e-icon>
 *   </m3e-fab-menu-trigger>
 * </m3e-fab>
 * <m3e-fab-menu id="fabmenu">
 *   <m3e-fab-menu-item>
 *     <m3e-icon slot="icon" name="email" filled></m3e-icon>
 *     Email
 *   </m3e-fab-menu-item>
 *   <m3e-fab-menu-item>
 *     <m3e-icon slot="icon" name="chat" filled></m3e-icon>
 *     Message
 *   </m3e-fab-menu-item>
 *   <m3e-fab-menu-item>
 *     <m3e-icon slot="icon" name="folder" filled></m3e-icon>
 *     Folder
 *   </m3e-fab-menu-item>
 * </m3e-fab-menu>
 * ```
 *
 * @example
 * Use `variant` to select the menu appearance. Import `@m3e/web/fab` and `@m3e/web/icon` for the FAB and icon. Give the icon-only FAB an accessible label.
 *
 * ```html
 * <m3e-fab variant="secondary" size="large">
 *   <m3e-fab-menu-trigger for="fabmenu">
 *     <m3e-icon name="edit"></m3e-icon>
 *   </m3e-fab-menu-trigger>
 * </m3e-fab>
 * <m3e-fab-menu id="fabmenu" variant="secondary">
 *   <!-- Items omitted for brevity -->
 * </m3e-fab-menu>
 * <!-- Other variants omitted for brevity -->
 * ```
 *
 * @tag m3e-fab-menu
 *
 * @slot - Renders the contents of the menu.
 *
 * @attr variant - The appearance variant of the menu.
 *
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-fab-menu-spacing - Vertical gap between menu items.
 * @cssprop --m3e-fab-menu-max-width - Maximum width of the menu.
 * @cssprop --m3e-primary-fab-color - Foreground color for primary variant items.
 * @cssprop --m3e-primary-fab-container-color - Container color for primary variant items.
 * @cssprop --m3e-primary-fab-hover-color - Hover background color for primary variant items.
 * @cssprop --m3e-primary-fab-focus-color - Focus background color for primary variant items.
 * @cssprop --m3e-primary-fab-ripple-color - Ripple color for primary variant items.
 * @cssprop --m3e-secondary-fab-color - Foreground color for secondary variant items.
 * @cssprop --m3e-secondary-fab-container-color - Container color for secondary variant items.
 * @cssprop --m3e-secondary-fab-hover-color - Hover background color for secondary variant items.
 * @cssprop --m3e-secondary-fab-focus-color - Focus background color for secondary variant items.
 * @cssprop --m3e-secondary-fab-ripple-color - Ripple color for secondary variant items.
 * @cssprop --m3e-tertiary-fab-color - Foreground color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-container-color - Container color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-hover-color - Hover background color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-focus-color - Focus background color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-ripple-color - Ripple color for tertiary variant items.
 */
@customElement("m3e-fab-menu")
export class M3eFabMenuElement extends SuppressInitialAnimation(AttachInternals(Role(LitElement, "menu"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      contain: layout style;
      position: absolute;
      flex-direction: column;
      row-gap: var(--m3e-fab-menu-spacing, ${DesignToken.measurement.space50});
      padding: unset;
      margin: unset;
      border: unset;
      overflow: visible;
      overscroll-behavior: contain;
      scrollbar-width: none;
      width: var(--_fab-menu-width, fit-content);
      max-width: var(--m3e-fab-menu-max-width, 280px);
      background-color: transparent;
      display: none;
      will-change: clip-path;
    }
    :host::-webkit-scrollbar {
      display: none;
    }
    :host(:is(:state(--scrolls), :--scrolls)) {
      --_fab-menu-ring-space: max(
        0px,
        calc(
          var(--m3e-focus-ring-outward-offset, 2px) + var(--m3e-focus-ring-thickness, 3px) *
            max(1, var(--m3e-focus-ring-growth-factor, 2))
        )
      );
      padding-block-start: var(--_fab-menu-ring-space);
      padding-inline: var(--_fab-menu-ring-space);
      max-width: max(0px, calc(var(--m3e-fab-menu-max-width, 280px) - 2 * var(--_fab-menu-ring-space)));
      scroll-padding-top: var(--_fab-menu-ring-space);
      scroll-padding-bottom: calc(var(--_fab-menu-inset, 0px) + var(--_fab-menu-ring-space));
      pointer-events: none;
    }
    :host(:is(:state(--scrolls), :--scrolls)) ::slotted(m3e-fab-menu-item) {
      pointer-events: auto;
    }
    @media (any-pointer: coarse) {
      :host(:is(:state(--scrolls), :--scrolls)) {
        pointer-events: auto;
      }
    }
    .spacer {
      display: none;
      flex: none;
      height: max(
        0px,
        calc(var(--_fab-menu-inset, 0px) - var(--m3e-fab-menu-spacing, ${DesignToken.measurement.space50}))
      );
    }
    :host(:is(:state(--scrolls), :--scrolls)) .spacer {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) {
      transition: ${unsafeCSS(
        `overlay ${DesignToken.motion.spring.fastSpatial} allow-discrete,
        display ${DesignToken.motion.spring.fastSpatial} allow-discrete`,
      )};
    }
    ::slotted(m3e-fab-menu-item) {
      width: 0;
      opacity: 0;
    }
    :host(:popover-open:not(:is(:state(--closing), :--closing))) ::slotted(m3e-fab-menu-item) {
      width: var(--_fab-menu-item-width, auto);
      opacity: 1;
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) ::slotted(m3e-fab-menu-item) {
      transition: ${unsafeCSS(
        `width ${DesignToken.motion.spring.fastSpatial} var(--_fab-menu-item-delay, 0ms),
        opacity ${DesignToken.motion.spring.fastEffects} var(--_fab-menu-item-delay, 0ms)`,
      )};
    }
    .base {
      display: contents;
    }
    :host(:is(:state(--primary), :--primary)) .base {
      --_fab-menu-item-color: var(--m3e-primary-fab-color, ${DesignToken.color.onPrimaryContainer});
      --_fab-menu-item-container-color: var(--m3e-primary-fab-container-color, ${DesignToken.color.primaryContainer});
      --_fab-menu-background-hover-color: var(--m3e-primary-fab-hover-color, ${DesignToken.color.onPrimaryContainer});
      --_fab-menu-background-focus-color: var(--m3e-primary-fab-focus-color, ${DesignToken.color.onPrimaryContainer});
      --_fab-menu-ripple-color: var(--m3e-primary-fab-ripple-color, ${DesignToken.color.onPrimaryContainer});
    }
    :host(:is(:state(--secondary), :--secondary)) .base {
      --_fab-menu-item-color: var(--m3e-secondary-fab-color, ${DesignToken.color.onSecondaryContainer});
      --_fab-menu-item-container-color: var(
        --m3e-secondary-fab-container-color,
        ${DesignToken.color.secondaryContainer}
      );
      --_fab-menu-background-hover-color: var(
        --m3e-secondary-fab-hover-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --_fab-menu-background-focus-color: var(
        --m3e-secondary-fab-focus-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --_fab-menu-ripple-color: var(--m3e-secondary-fab-ripple-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:is(:state(--tertiary), :--tertiary)) .base {
      --_fab-menu-item-color: var(--m3e-tertiary-fab-color, ${DesignToken.color.onTertiaryContainer});
      --_fab-menu-item-container-color: var(--m3e-tertiary-fab-container-color, ${DesignToken.color.tertiaryContainer});
      --_fab-menu-background-hover-color: var(--m3e-tertiary-fab-hover-color, ${DesignToken.color.onTertiaryContainer});
      --_fab-menu-background-focus-color: var(--m3e-tertiary-fab-focus-color, ${DesignToken.color.onTertiaryContainer});
      --_fab-menu-ripple-color: var(--m3e-tertiary-fab-ripple-color, ${DesignToken.color.onTertiaryContainer});
    }
    :host(:is(:state(--left), :--left)) {
      align-items: flex-start;
      --_fab-menu-item-justify: flex-start;
    }
    :host(:is(:state(--right), :--right)) {
      align-items: flex-end;
      --_fab-menu-item-justify: flex-end;
    }
    :host(:popover-open) {
      display: inline-flex;
    }
    :host::backdrop {
      background-color: transparent;
    }
    @starting-style {
      :host(:popover-open) ::slotted(m3e-fab-menu-item) {
        opacity: 0;
      }
    }
    @media (prefers-reduced-motion) {
      :host(:not(:is(:state(--no-animate), :--no-animate))),
      :host(:not(:is(:state(--no-animate), :--no-animate))) ::slotted(m3e-fab-menu-item) {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      :host(:not(:is(:state(--no-animate), :--no-animate))),
      :host(:not(:is(:state(--no-animate), :--no-animate))) ::slotted(m3e-fab-menu-item) {
        transition: none;
      }
      :host {
        border-radius: ${DesignToken.shape.corner.medium};
        outline: 1px solid MenuText;
        background-color: Menu;
      }
    }
  `;

  /** @private */ #fabTabIndex?: number;
  /** @private */ #trigger?: HTMLElement;
  /** @private */ #anchoringCleanup?: () => void;
  /** @private */ #clipFrame?: number;
  /** @private */ #focusTimer?: number;
  /** @private */ #closing = false;
  /** @private */ #scrollToEnd = false;
  /** @private */ #lastY = 0;
  /** @private */ #closeId = 0;

  /** @private */
  readonly #listManager = new RovingTabIndexManager<LitElement & DisabledMixin>()
    .withWrap()
    .withHomeAndEnd()
    .withVerticalOrientation();

  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #transitionEndHandler = (e: TransitionEvent) => this.#handleTransitionEnd(e);

  /** @private */
  readonly #scrollController = new ScrollController(this, {
    target: null,
    callback: () => this.#hide(false, false),
  });

  /** @private */ readonly #clickOutsideController = new ClickOutsideController(this, {
    target: null,
    callback: () => this.hide(),
  });

  /** @private */
  readonly #toggleHandler = (e: ToggleEvent) => {
    switch (e.newState) {
      case "open":
        this.#clickOutsideController.observe(this);
        if (this.#trigger) {
          this.#clickOutsideController.observe(this.#trigger);
        }
        this.#focusTimer = setTimeout(() => {
          this.#focusTimer = undefined;
          if (!this.#trigger) return;
          const item = this.#listManager.items.find((x) => !x.disabled);
          this.#listManager.updateActiveItem(item);
          // Focusing must not scroll the menu away from its items nearest the trigger, unless the keyboard opened it.
          item?.focus({
            preventScroll: !this.#trigger?.matches(":focus-visible"),
          });
        }, 40);
        break;

      case "closed":
        this.#clickOutsideController.unobserveAll();
        if (!this.#trigger && !this.#closing && getComputedStyle(this).display === "none") {
          this.#finishClose();
        }
        break;
    }
  };

  /**
   * The appearance variant of the menu.
   * @default "primary"
   */
  @property({ reflect: true, useDefault: true }) variant: FabMenuVariant = "primary";

  /** Whether the menu is open. */
  get isOpen() {
    return this.#trigger !== undefined;
  }

  /**
   * Opens the menu.
   * @param {HTMLElement} trigger The element that triggered the menu.
   * @returns {Promise<void>} A `Promise` that resolves when the menu is opened.
   */
  async show(trigger: HTMLElement): Promise<void> {
    if (this.#trigger && this.#trigger !== trigger) {
      this.hide();
    }

    this.#cancelClose();
    this.#anchoringCleanup?.();
    this.#anchoringCleanup = await positionAnchor(
      this,
      trigger,
      {
        position: "top-end",
        inline: true,
        shift: "main",

        offset: menuOffset,
      },
      (x, y, position) => {
        setCustomState(this, "--right", position.includes("end"));
        setCustomState(this, "--left", position.includes("start"));
        this.#lastY = y;
        this.#fit(trigger, y);
        const style = getComputedStyle(this);
        if (M3eDirectionality.current === "rtl") {
          const inset = parseFloat(style.paddingLeft) || 0;
          this.style.right = `${window.innerWidth - x - this.clientWidth + inset}px`;
          this.style.left = "";
        } else {
          const inset = parseFloat(style.paddingRight) || 0;
          this.style.left = `${x + inset}px`;
          this.style.right = "";
        }

        if (this.#clipTrigger(trigger) && this.#clipFrame === undefined && this.#trigger) {
          this.#startClipping(trigger);
        }
      },
    );

    const items = this.#items();
    const animate = this.#animates();

    // A menu still closing keeps the widths its items close from, so they grow back from where they are.
    const closing = animate && getComputedStyle(this).display !== "none";

    this.#stagger(items, true);
    if (!closing) {
      this.#unpin(items);
    }

    // A menu still closing is still open, so it has nothing to show and keeps its scroll position.
    if (!this.matches(":popover-open")) {
      this.#scrollToEnd = true;
      this.showPopover();

      // Anchoring may have last measured the menu while it was not displayed, and does not always update again.
      this.#pinToEnd(trigger);
    }

    if (animate && !closing) {
      this.#grow(items);
    }

    this.#trigger = trigger;
    this.#trigger.ariaExpanded = "true";
    this.#scrollController.observe(this.#trigger);
    this.#startClipping(trigger);

    this.#attachFab();
  }

  /**
   * Hides the menu.
   * @param {boolean} [restoreFocus=false] Whether to restore focus to the menu's trigger.
   */
  hide(restoreFocus: boolean = false): void {
    this.#hide(restoreFocus, true);
  }

  /** @private */
  #hide(restoreFocus: boolean, animate: boolean): void {
    clearTimeout(this.#focusTimer);
    this.#focusTimer = undefined;
    if (this.#closing) {
      // The page is moving, so the menu must not keep animating against a trigger that is moving with it.
      if (!animate) {
        this.#cancelClose();
        this.hidePopover();
        this.#finishClose();
      }
      return;
    }

    if (this.#trigger) {
      this.#trigger.ariaExpanded = "false";
      if (restoreFocus) {
        this.#trigger.focus();
      }

      this.#detachFab();

      this.#scrollController.unobserve(this.#trigger);
      this.#trigger = undefined;
    }

    const items = this.#items();
    this.#stagger(items, false);

    if (animate && this.#animates() && this.matches(":popover-open")) {
      this.#pin(items);
      this.#beginClose(items);
    } else {
      this.hidePopover();
      this.#finishClose();
    }
  }

  /**
   * Toggles the menu.
   * @param {HTMLElement} trigger The element that triggered the menu.
   * @returns {Promise<void>} A `Promise` that resolves when the menu is opened or closed.
   */
  async toggle(trigger: HTMLElement): Promise<void> {
    if (this.#trigger) {
      this.hide();
    } else {
      await this.show(trigger);
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#applyVariant();
    this.tabIndex = -1;
    this.setAttribute("popover", "manual");
    this.addEventListener("keydown", this.#keyDownHandler);
    this.addEventListener("wheel", this.#userScrollHandler, { passive: true });
    this.addEventListener("touchstart", this.#userScrollHandler, {
      passive: true,
    });
    this.addEventListener("toggle", this.#toggleHandler);
    this.addEventListener("transitionend", this.#transitionEndHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    clearTimeout(this.#focusTimer);
    this.#focusTimer = undefined;
    this.removeEventListener("keydown", this.#keyDownHandler);
    this.removeEventListener("wheel", this.#userScrollHandler);
    this.removeEventListener("touchstart", this.#userScrollHandler);
    this.removeEventListener("toggle", this.#toggleHandler);
    this.removeEventListener("transitionend", this.#transitionEndHandler);
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);
    if (_changedProperties.has("variant")) {
      this.#applyVariant();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <slot @slotchange=${this.#handleSlotChange}></slot>
      <div class="spacer" aria-hidden="true"></div>
    </div>`;
  }

  /**
   * Fits the menu above its trigger. When its items are taller than the space above the trigger, the menu instead
   * spans the viewport and its items scroll behind the trigger. The menu begins scrolled to its last item,
   * nearest the trigger.
   * @private
   */
  #fit(trigger: HTMLElement, y: number): void {
    const items = this.#items();
    const gap = parseFloat(getComputedStyle(this).rowGap) || 0;
    const natural =
      items.reduce((sum, x) => sum + x.getBoundingClientRect().height, 0) + gap * Math.max(0, items.length - 1);

    const rect = trigger.getBoundingClientRect();
    const scrolls = natural > rect.top - menuOffset - viewportMargin;
    setCustomState(this, "--scrolls", scrolls);

    if (scrolls) {
      const bottom = window.innerHeight;
      this.style.setProperty(
        "--_fab-menu-inset",
        `calc(${Math.max(0, bottom - rect.top)}px + max(${menuOffset}px, var(--_fab-menu-ring-space)))`,
      );
      this.style.maxHeight = `max(0px, calc(${Math.max(0, bottom - viewportMargin)}px - var(--_fab-menu-ring-space)))`;
      this.style.overflowY = "auto";
      this.style.overflowX = "hidden";
      // The menu is positioned against the document, so the viewport's top edge is offset by the page scroll.
      this.style.top = `${window.scrollY + viewportMargin}px`;
    } else {
      this.style.removeProperty("--_fab-menu-inset");
      this.style.maxHeight = "";
      this.style.overflowY = "";
      this.style.overflowX = "";
      this.style.top = `${Math.max(y, viewportMargin)}px`;
    }

    // The menu's layout keeps settling as it opens, so it stays pinned to its end until the user takes over.
    if (scrolls && this.#scrollToEnd && this.matches(":popover-open")) {
      this.scrollTop = this.scrollHeight;
    }
  }

  /** @private */
  readonly #userScrollHandler = (): void => {
    this.#scrollToEnd = false;
  };

  /** @private */
  #pinToEnd(trigger: HTMLElement): void {
    const start = performance.now();
    const step = () => {
      if (!this.#scrollToEnd || this.#trigger !== trigger || performance.now() - start > 800) {
        this.#scrollToEnd = false;
        return;
      }
      this.#fit(trigger, this.#lastY);
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /**
   * Clips the menu where it overlaps its trigger, so the trigger appears above the menu even though the menu
   * is in the top layer.
   * @private
   */
  #startClipping(trigger: HTMLElement): void {
    this.#stopClipping();
    if (!this.#clipTrigger(trigger)) return;

    const tick = () => {
      // Clipping continues while the items close, and ends once the menu is no longer displayed or no longer
      // overlaps the trigger. It resumes when repositioning finds the two overlapping again.
      const hidden = !this.#trigger && !this.matches(":popover-open") && getComputedStyle(this).display === "none";
      if (hidden) {
        this.#finishClose();
        return;
      }
      if (!this.#clipTrigger(trigger)) {
        this.#stopClipping();
        return;
      }
      this.#clipFrame = requestAnimationFrame(tick);
    };
    this.#clipFrame = requestAnimationFrame(tick);
  }

  /** @private */
  #finishClose(): void {
    this.#anchoringCleanup?.();
    this.#anchoringCleanup = undefined;
    this.#stopClipping();
  }

  /**
   * Closes the items while the menu stays open. Not every browser keeps a menu displayed, and in the top layer, while
   * it transitions out, so the menu is hidden only once its items have closed. Until then it stays anchored to its
   * trigger, which resizes as the menu closes.
   * @private
   */
  #beginClose(items: HTMLElement[]): void {
    const id = ++this.#closeId;
    this.#closing = true;
    setCustomState(this, "--closing", true);
    void this.offsetWidth;

    const animations = items.flatMap((x) => x.getAnimations());
    Promise.allSettled(animations.map((x) => x.finished)).then(() => {
      if (id !== this.#closeId) return;
      this.#closing = false;
      this.hidePopover();
      setCustomState(this, "--closing", false);
      this.#finishClose();
    });
  }

  /** @private */
  #cancelClose(): void {
    this.#closeId++;
    this.#closing = false;
    setCustomState(this, "--closing", false);
  }

  /** @private */
  #stopClipping(): void {
    if (this.#clipFrame !== undefined) {
      cancelAnimationFrame(this.#clipFrame);
      this.#clipFrame = undefined;
    }
    this.style.clipPath = "";
  }

  /** @private */
  #clipTrigger(trigger: HTMLElement): boolean {
    const fab = trigger.closest<HTMLElement>("m3e-fab") ?? trigger;
    const menu = this.getBoundingClientRect();
    const fabRect = fab.getBoundingClientRect();

    // The strong focus indicator is drawn outside the fab, so the cut-out grows to include it.
    const outline = fab.shadowRoot?.querySelector("m3e-focus-ring")?.shadowRoot?.querySelector(".outline");
    const outlineStyle = outline ? getComputedStyle(outline) : undefined;
    const ring =
      outlineStyle && outlineStyle.outlineStyle !== "none" && outlineStyle.visibility !== "hidden"
        ? Math.max(0, (parseFloat(outlineStyle.outlineOffset) || 0) + (parseFloat(outlineStyle.outlineWidth) || 0))
        : 0;

    const rect = {
      left: fabRect.left - ring,
      top: fabRect.top - ring,
      right: fabRect.right + ring,
      bottom: fabRect.bottom + ring,
      width: fabRect.width + 2 * ring,
      height: fabRect.height + 2 * ring,
    };

    const overlaps =
      rect.left < menu.right && rect.right > menu.left && rect.top < menu.bottom && rect.bottom > menu.top;
    if (!overlaps) {
      this.style.clipPath = "";
      return false;
    }

    const base = fab.shadowRoot?.querySelector(".base") ?? fab;
    const radius = Math.min(
      (parseFloat(getComputedStyle(base).borderTopLeftRadius) || 0) + ring,
      rect.width / 2,
      rect.height / 2,
    );

    const l = rect.left - menu.left;
    const t = rect.top - menu.top;
    const r = l + rect.width;
    const b = t + rect.height;
    const c = radius;
    const pad = 1000; // keeps anything that overflows the menu, like shadows, visible

    const clipPath =
      `path(evenodd, "M ${-pad} ${-pad} H ${menu.width + pad} V ${menu.height + pad} H ${-pad} Z ` +
      `M ${l + c} ${t} H ${r - c} A ${c} ${c} 0 0 1 ${r} ${t + c} V ${b - c} A ${c} ${c} 0 0 1 ${r - c} ${b} ` +
      `H ${l + c} A ${c} ${c} 0 0 1 ${l} ${b - c} V ${t + c} A ${c} ${c} 0 0 1 ${l + c} ${t} Z")`;

    if (this.style.clipPath !== clipPath) {
      this.style.clipPath = clipPath;
    }
    return true;
  }

  /** @private */
  #applyVariant(): void {
    if (!isFabMenuVariant(this.variant)) {
      this.variant = "primary";
    }
    setCustomEnumState(this, this.variant, "primary", "secondary", "tertiary");
  }

  /** @private */
  #handleSlotChange(): void {
    const { added } = this.#listManager.setItems([...this.querySelectorAll("m3e-fab-menu-item")]);
    if (!this.#listManager.activeItem) {
      this.#listManager.updateActiveItem(added.find((x) => !x.disabled));
    }
  }

  /** @private */
  #items(): HTMLElement[] {
    return [...this.querySelectorAll<HTMLElement>("m3e-fab-menu-item")].filter((x) => !x.hidden);
  }

  /** @private */
  #animates(): boolean {
    return !hasCustomState(this, "--no-animate") && !prefersReducedMotion() && !forcedColorsActive();
  }

  /** @private */
  #stagger(items: HTMLElement[], open: boolean): void {
    const delays = staggerDelays(items.length, open);
    items.forEach((x, i) => x.style.setProperty("--_fab-menu-item-delay", `${delays[i]}ms`));
  }

  /** @private */
  #grow(items: HTMLElement[]): void {
    // Items are measured at their natural widths and grow to them from zero, as Compose measures an item before
    // animating its width. The menu takes the width of its widest item meanwhile, so its anchored position does not
    // move. Its own box is not measured: its first position was computed while it was hidden.
    const widths = items.map((x) => x.getBoundingClientRect().width);
    this.style.setProperty("--_fab-menu-width", `${Math.max(0, ...widths)}px`);

    // Commit zero so the items transition from it rather than from `auto`.
    items.forEach((x) => x.style.setProperty("--_fab-menu-item-width", "0px"));
    void this.offsetWidth;

    items.forEach((x, i) => x.style.setProperty("--_fab-menu-item-width", `${widths[i]}px`));
  }

  /** @private */
  #pin(items: HTMLElement[]): void {
    // Commit explicit widths so the items close from them rather than from `auto`, and keep their content laid out at
    // them while clipped. Items still growing keep the widths they grow to.
    for (const item of items) {
      if (!item.style.getPropertyValue("--_fab-menu-item-width")) {
        item.style.setProperty("--_fab-menu-item-width", `${item.getBoundingClientRect().width}px`);
      }
    }
    if (!this.style.getPropertyValue("--_fab-menu-width")) {
      const style = getComputedStyle(this);
      const padding = (parseFloat(style.paddingLeft) || 0) + (parseFloat(style.paddingRight) || 0);
      this.style.setProperty("--_fab-menu-width", `${Math.max(0, this.getBoundingClientRect().width - padding)}px`);
    }
    void this.offsetWidth;
  }

  /** @private */
  #unpin(items: HTMLElement[]): void {
    this.style.removeProperty("--_fab-menu-width");
    items.forEach((x) => x.style.removeProperty("--_fab-menu-item-width"));
  }

  /** @private */
  #handleTransitionEnd(e: TransitionEvent): void {
    // Once grown, an item returns to its natural width, so that it follows later changes to its content.
    if (e.propertyName !== "width" || !this.matches(":popover-open") || this.#closing) return;
    const items = this.#items();
    const item = items.find((x) => x === e.target);
    if (!item) return;

    item.style.removeProperty("--_fab-menu-item-width");
    if (items.every((x) => !x.style.getPropertyValue("--_fab-menu-item-width"))) {
      this.style.removeProperty("--_fab-menu-width");
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "Tab":
        this.hide();
        break;

      case "Escape":
        if (!e.shiftKey && !e.ctrlKey) {
          this.hide(true);
        }
        break;

      default:
        this.#listManager.onKeyDown(e);
        break;
    }
  }

  /** @private */
  #attachFab(): void {
    const fab = this.#trigger?.closest<M3eFabElement>("m3e-fab");
    if (fab) {
      this.#fabTabIndex = fab.tabIndex;
      fab.addEventListener("keydown", this.#keyDownHandler);
      this.#listManager.setItems([...this.#listManager.items, fab]);
    }
  }

  /** @private */
  #detachFab(): void {
    const fab = this.#trigger?.closest<M3eFabElement>("m3e-fab");
    if (fab) {
      if (this.#fabTabIndex !== undefined) {
        fab.tabIndex = this.#fabTabIndex;
      }
      fab.removeEventListener("keydown", this.#keyDownHandler);
      this.#listManager.setItems([...this.#listManager.items.filter((x) => x !== fab)]);
    }
  }
}

interface M3eFabMenuElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eFabMenuElement {
  addEventListener<K extends keyof M3eFabMenuElementEventMap>(
    type: K,
    listener: (this: M3eFabMenuElement, ev: M3eFabMenuElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eFabMenuElementEventMap>(
    type: K,
    listener: (this: M3eFabMenuElement, ev: M3eFabMenuElementEventMap[K]) => void,
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
    "m3e-fab-menu": M3eFabMenuElement;
  }
}
