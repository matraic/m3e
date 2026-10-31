import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";

import {
  customElement,
  hasAssignedNodes,
  HtmlFor,
  Role,
  AttachInternals,
  setCustomEnumState,
  prefersReducedMotion,
} from "@m3e/web/core";

import { AppBarScrollBehavior, isAppBarScrollBehavior } from "./AppBarScrollBehavior";
import { AppBarSize, isAppBarSize } from "./AppBarSize";

import { AppBarSizeStyle, AppBarStyle } from "./styles";

/**
 * A bar, placed a the top of a screen, used to help users navigate through an application.
 *
 * @description
 * The `m3e-app-bar` component is a prominent user interface component that provides consistent
 * access to key actions, navigation, and contextual information at the top of an application screen.
 * Designed according to Material 3 principles, it organizes content with clear hierarchy, supports
 * dynamic color, elevation, and shape, and adapts to scrolling behavior.
 *
 * @example
 * ```html
 * <m3e-app-bar size="medium">
 *  <m3e-icon-button slot="leading-icon" aria-label="Back">
 *    <m3e-icon name="arrow_back"></m3e-icon>
 *  </m3e-icon-button>
 *  <span slot="title">Top 10 hiking trails</span>
 *  <span slot="subtitle">Discover popular trails</span>
 *  <m3e-icon-button slot="trailing-icon" aria-label="Bookmark" variant="tonal">
 *    <m3e-icon name="bookmark" filled></m3e-icon>
 *  </m3e-icon-button>
 * <m3e-app-bar>
 * ```
 * @example
 * The next example illustrates how to attach an app bar to a parenting scroll container
 * to produce elevation on scroll. In this example, the `for` attribute is used to attach a
 * sticky positioned `m3e-app-bar` to a parenting container styled to overflow vertically.
 * When scrolled, the app bar will automatically transition to an elevated state.
 * ```html
 * <div style="overflow-y: auto; height: 300px" id="scrollContainer">
 *  <m3e-app-bar for="scrollContainer" style="position: sticky; top: 0">
 *    <span slot="title">Title</span>
 *  </m3e-app-bar>
 *  <div style="height: 400px; display: flex; align-items: center; justify-content: center">
 *    I am scrolling content
 *  </div>
 * </div>
 * ```
 *
 * @tag m3e-app-bar
 *
 * @slot leading - Renders content positioned at the start of the bar.
 * @slot subtitle - Renders the subtitle of the bar.
 * @slot title - Renders the title of the bar.
 * @slot trailing - Renders one or more action buttons aligned to the end of the bar.
 * @slot leading-icon - Deprecated: use the `leading` slot.
 * @slot trailing-icon - Deprecated: use the `trailing` slot.
 *
 * @attr centered - Whether the title and subtitle are centered.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr scroll-behavior - The behavior applied when the attached scroll container is scrolled.
 * @attr size - The size of the bar.
 *
 * @cssprop --m3e-app-bar-container-color - Background color of the app bar container.
 * @cssprop --m3e-app-bar-container-color-on-scroll - Background color of the app bar container when scrolled.
 * @cssprop --m3e-app-bar-container-elevation - Elevation (shadow) of the app bar container.
 * @cssprop --m3e-app-bar-container-elevation-on-scroll - Elevation (shadow) of the app bar container when scrolled.
 * @cssprop --m3e-app-bar-title-text-color - Color of the app bar title text.
 * @cssprop --m3e-app-bar-subtitle-text-color - Color of the app bar subtitle text.
 * @cssprop --m3e-app-bar-padding-left - Left padding for the app bar container.
 * @cssprop --m3e-app-bar-padding-right - Right padding for the app bar container.
 * @cssprop --m3e-app-bar-small-container-height - Height of the small app bar container.
 * @cssprop --m3e-app-bar-small-title-text-font-size - Font size for the small app bar title text.
 * @cssprop --m3e-app-bar-small-title-text-font-weight - Font weight for the small app bar title text.
 * @cssprop --m3e-app-bar-small-title-text-line-height - Line height for the small app bar title text.
 * @cssprop --m3e-app-bar-small-subtitle-text-tracking - Letter spacing (tracking) for the small app bar title text.
 * @cssprop --m3e-app-bar-small-subtitle-text-font-size - Font size for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-subtitle-text-font-weight - Font weight for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-subtitle-text-line-height - Line height for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-subtitle-text-tracking - Letter spacing (tracking) for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-heading-padding-left - Left padding for the small app bar heading.
 * @cssprop --m3e-app-bar-small-heading-padding-right - Right padding for the small app bar heading.
 * @cssprop --m3e-app-bar-medium-container-height - Height of the medium app bar container.
 * @cssprop --m3e-app-bar-medium-container-height-with-subtitle - Height of the medium app bar container with subtitle.
 * @cssprop --m3e-app-bar-medium-title-text-font-size - Font size for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-title-text-font-weight - Font weight for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-title-text-line-height - Line height for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-tracking - Letter spacing (tracking) for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-font-size - Font size for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-font-weight - Font weight for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-line-height - Line height for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-tracking - Letter spacing (tracking) for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-heading-padding-left - Left padding for the medium app bar heading.
 * @cssprop --m3e-app-bar-medium-heading-padding-right - Right padding for the medium app bar heading.
 * @cssprop --m3e-app-bar-medium-padding-top - Top padding for the medium app bar.
 * @cssprop --m3e-app-bar-medium-padding-bottom - Bottom padding for the medium app bar.
 * @cssprop --m3e-app-bar-medium-title-max-lines - Maximum number of lines for the medium app bar title.
 * @cssprop --m3e-app-bar-medium-subtitle-max-lines - Maximum number of lines for the medium app bar subtitle.
 * @cssprop --m3e-app-bar-large-container-height - Height of the large app bar container.
 * @cssprop --m3e-app-bar-large-container-height-with-subtitle - Height of the large app bar container with subtitle.
 * @cssprop --m3e-app-bar-large-title-text-font-size - Font size for the large app bar title text.
 * @cssprop --m3e-app-bar-large-title-text-font-weight - Font weight for the large app bar title text.
 * @cssprop --m3e-app-bar-large-title-text-line-height - Line height for the large app bar title text.
 * @cssprop --m3e-app-bar-large-subtitle-text-tracking - Letter spacing (tracking) for the large app bar title text.
 * @cssprop --m3e-app-bar-large-subtitle-text-font-size - Font size for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-subtitle-text-font-weight - Font weight for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-subtitle-text-line-height - Line height for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-subtitle-text-tracking - Letter spacing (tracking) for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-heading-padding-left - Left padding for the large app bar heading.
 * @cssprop --m3e-app-bar-large-heading-padding-right - Right padding for the large app bar heading.
 * @cssprop --m3e-app-bar-large-padding-top - Top padding for the large app bar.
 * @cssprop --m3e-app-bar-large-padding-bottom - Bottom padding for the large app bar.
 * @cssprop --m3e-app-bar-large-title-max-lines - Maximum number of lines for the large app bar title.
 * @cssprop --m3e-app-bar-large-subtitle-max-lines - Maximum number of lines for the large app bar subtitle.
 */
@customElement("m3e-app-bar")
export class M3eAppBarElement extends HtmlFor(Role(AttachInternals(LitElement), "banner")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [AppBarStyle, AppBarSizeStyle];

  /** @private */ readonly #scrollHandler = (e: Event) => this._updateScroll(e);
  /** @private */ readonly #touchStartHandler = () => this.#handleTouchStart();
  /** @private */ readonly #touchEndHandler = () => this.#handleTouchEnd();
  /** @private */ readonly #interruptHandler = () => this.#cancelSnap();
  /** @private */ readonly #frameLoadHandler = () => this.#handleFrameLoad();

  /** @private */ #snapTimer?: ReturnType<typeof setTimeout>;
  /** @private */ #snapFrame = 0;
  /** @private */ #snapping = false;
  /** @private */ #touching = false;
  /** @private */ #direction = 0;
  /** @private */ #collapse = 0;
  /** @private */ #lastScrollTop = 0;
  /** @private */ #scrollTop = 0;
  /** @private */ #expanded = 0;
  /** @private */ #range = 0;

  /** @private */ @query(".base") private readonly _base?: HTMLElement;
  /** @private */ @query(".wrapper") private readonly _wrapper?: HTMLElement;
  /** @private */ @query(".leading-icon") private readonly _leadingIcon?: HTMLElement;
  /** @private */ @query(".trailing-icon") private readonly _trailingIcon?: HTMLElement;

  /**
   * Whether the title and subtitle are centered.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) centered = false;

  /**
   * The behavior applied when the attached scroll container is scrolled.
   * @default "elevate"
   */
  @property({ attribute: "scroll-behavior", reflect: true, useDefault: true })
  scrollBehavior: AppBarScrollBehavior = "elevate";

  /**
   * The size of the bar.
   * @default "small"
   */
  @property({ reflect: true, useDefault: true }) size: AppBarSize = "small";

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (control instanceof HTMLIFrameElement) {
      control.addEventListener("load", this.#frameLoadHandler);
      this.#handleFrameLoad();
    } else {
      this.#listen(control);
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control instanceof HTMLIFrameElement) {
      this.control.removeEventListener("load", this.#frameLoadHandler);
      this.#unlisten(this.control.contentDocument);
    }
    if (this.control) {
      this.#unlisten(this.control);
    }
    this.#cancelSnap();
    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.#applySize();

    // Automatically remove banner role when it is nested inside any element with a disallowed role.
    if (this.role === "banner") {
      const allowed = ["document", "application", "main"];
      const ancestorWithRole = this.parentElement?.closest("[role]");
      if (ancestorWithRole && ancestorWithRole.role && !allowed.includes(ancestorWithRole.role)) {
        this.removeAttribute("role");
      }
    }
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("size")) {
      this.#applySize();
    }

    if (_changedProperties.has("scrollBehavior") && !isAppBarScrollBehavior(this.scrollBehavior)) {
      this.scrollBehavior = "elevate";
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("size") || _changedProperties.has("scrollBehavior")) {
      this.#syncScroll();
    }

    if (_changedProperties.has("centered") || _changedProperties.has("size")) {
      this.#syncCentered();
    }
  }

  /** @private */
  #syncCentered(): void {
    // Centering balances the icon widths, which applies to a small bar and to a compressed (compact) row.
    if (this.centered && (this.size === "small" || this._wrapper?.classList.contains("compact"))) {
      this.#computeCentered();
    } else {
      this.#clearCentered();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    switch (this.size) {
      case "small":
        return html`<div class="base">
          <div class="wrapper">
            <div class="leading-icon">
              <slot name="leading" @slotchange=${this.#handleLeadingIconSlotChange}>
                <slot name="leading-icon" @slotchange=${this.#handleDeprecatedSlotChange}></slot>
              </slot>
            </div>
            <div class="heading">
              <div class="label">
                <div class="title">
                  <slot name="title" @slotchange=${this.#handleTitleSlotChange}></slot>
                </div>
                <div class="subtitle">
                  <slot name="subtitle" @slotchange=${this.#handleSubtitleSlotChange}></slot>
                </div>
              </div>
            </div>
            <div class="trailing-icon">
              <slot name="trailing" @slotchange=${this.#handleTrailingIconsSlotChange}>
                <slot name="trailing-icon" @slotchange=${this.#handleDeprecatedSlotChange}></slot>
              </slot>
            </div>
          </div>
        </div>`;

      default:
        return html`<div class="base">
          <div class="wrapper">
            <div class="heading">
              <div class="leading-icon">
                <slot name="leading" @slotchange=${this.#handleLeadingIconSlotChange}>
                  <slot name="leading-icon" @slotchange=${this.#handleDeprecatedSlotChange}></slot>
                </slot>
              </div>
              <div class="spacer"></div>
              <div class="trailing-icon">
                <slot name="trailing" @slotchange=${this.#handleTrailingIconsSlotChange}>
                  <slot name="trailing-icon" @slotchange=${this.#handleDeprecatedSlotChange}></slot>
                </slot>
              </div>
            </div>
            <div class="spacer"></div>
            <div class="label">
              <div class="title">
                <slot name="title" @slotchange=${this.#handleTitleSlotChange}></slot>
              </div>
              <div class="subtitle">
                <slot name="subtitle" @slotchange=${this.#handleSubtitleSlotChange}></slot>
              </div>
            </div>
          </div>
        </div>`;
    }
  }

  /** @private */
  #applySize(): void {
    if (!isAppBarSize(this.size)) {
      this.size = "small";
    }

    setCustomEnumState(this, this.size, "small", "medium", "large");
  }

  /** @private */
  #handleTitleSlotChange(e: Event): void {
    this._wrapper?.classList.toggle("with-title", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleSubtitleSlotChange(e: Event): void {
    this._wrapper?.classList.toggle("with-subtitle", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleLeadingIconSlotChange(e: Event): void {
    this._wrapper?.classList.toggle("with-leading-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
    setTimeout(() => this.#syncCentered(), 40);
  }

  /** @private */
  #handleTrailingIconsSlotChange(e: Event): void {
    this._wrapper?.classList.toggle("with-trailing-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
    setTimeout(() => this.#syncCentered(), 40);
  }

  /** @private */
  #handleDeprecatedSlotChange(e: Event): void {
    const deprecatedSlot = (e.target as HTMLSlotElement).name;
    const useSlot = deprecatedSlot.replace("-icon", "");

    console.warn(
      `[m3e-app-bar] Slot "${deprecatedSlot}" is deprecated and will be removed in a future release. Use "${useSlot}" instead.`,
    );
  }

  /** @private */
  #clearCentered() {
    this._wrapper?.style.removeProperty("--_leading-icon-min-width");
    this._wrapper?.style.removeProperty("--_trailing-icon-min-width");
  }

  /** @private */
  #computeCentered(): void {
    this.#clearCentered();

    const leadingWidth = this._leadingIcon?.getBoundingClientRect().width ?? 0;
    const trailingWidth = this._trailingIcon?.getBoundingClientRect().width ?? 0;

    if (leadingWidth < trailingWidth) {
      this._wrapper?.style.setProperty("--_leading-icon-min-width", `${trailingWidth}px`);
    } else if (leadingWidth > trailingWidth) {
      this._wrapper?.style.setProperty("--_trailing-icon-min-width", `${leadingWidth}px`);
    }
  }

  /** @private */
  private _updateScroll(e: Event): void {
    let scrollTop = 0;

    if (this.control instanceof HTMLIFrameElement) {
      scrollTop = this.#getFrameScrollTop(this.control);
    } else if (e.target instanceof HTMLElement) {
      scrollTop = e.target.scrollTop;
    }

    this.#scrollTop = scrollTop;

    // Scroll events caused by the snap itself must not feed back into the collapse.
    if (this.#snapping) return;
    this.#syncScroll();
    this.#scheduleSnap();
  }

  /** @private */
  #listen(target: EventTarget | null): void {
    target?.addEventListener("scroll", this.#scrollHandler, { passive: true });
    target?.addEventListener("wheel", this.#interruptHandler, { passive: true });
    target?.addEventListener("touchstart", this.#touchStartHandler, { passive: true });
    target?.addEventListener("touchend", this.#touchEndHandler, { passive: true });
    target?.addEventListener("touchcancel", this.#touchEndHandler, { passive: true });
  }

  /** @private */
  #unlisten(target: EventTarget | null): void {
    target?.removeEventListener("scroll", this.#scrollHandler);
    target?.removeEventListener("wheel", this.#interruptHandler);
    target?.removeEventListener("touchstart", this.#touchStartHandler);
    target?.removeEventListener("touchend", this.#touchEndHandler);
    target?.removeEventListener("touchcancel", this.#touchEndHandler);
  }

  /** @private */
  #handleTouchStart(): void {
    this.#touching = true;
    this.#cancelSnap();
  }

  /** @private */
  #handleTouchEnd(): void {
    this.#touching = false;
    this.#scheduleSnap();
  }

  /** @private*/
  #scheduleSnap(): void {
    // Snaps once scrolling has been idle (no scroll events and no finger down) for a short period.

    clearTimeout(this.#snapTimer);
    if (this.#touching) return;
    this.#snapTimer = setTimeout(() => this.#snap(), 150);
  }

  /** @private */
  #cancelSnap(): void {
    clearTimeout(this.#snapTimer);
    cancelAnimationFrame(this.#snapFrame);
    this.#snapping = false;
  }

  /** @private */
  #snap(): void {
    // Once scrolling is idle part way through a collapse, finishes the collapse in the direction of the last scroll.
    // The scroll position moves by the same amount, so the content stays in step with the bar.

    if (this.scrollBehavior !== "compress" || this.size === "small" || this.#touching) return;
    if (this.#range <= 0 || this.#scrollTop <= 0) return;
    if (this.#collapse <= 0 || this.#collapse >= this.#range) return;

    const scroller =
      this.control instanceof HTMLIFrameElement ? this.control.contentDocument?.scrollingElement : this.control;
    if (!scroller) return;

    const fromCollapse = this.#collapse;
    const toCollapse = this.#direction >= 0 ? this.#range : 0;
    const fromTop = scroller.scrollTop;
    const maxTop = scroller.scrollHeight - scroller.clientHeight;
    const toTop = Math.min(maxTop, Math.max(0, fromTop + (toCollapse - fromCollapse)));
    const distance = toTop - fromTop;

    if (distance === 0) return;

    const duration = prefersReducedMotion() ? 0 : 200;
    const start = performance.now();
    this.#snapping = true;

    const step = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);

      scroller.scrollTop = fromTop + distance * eased;
      this.#scrollTop = scroller.scrollTop;
      this.#lastScrollTop = this.#scrollTop;
      this.#collapse = Math.min(this.#range, Math.max(0, fromCollapse + distance * eased));
      this.#applyCollapse();

      if (t < 1) {
        this.#snapFrame = requestAnimationFrame(step);
      } else {
        this.#snapping = false;
      }
    };

    this.#snapFrame = requestAnimationFrame(step);
  }

  /** @private */
  #handleFrameLoad(): void {
    if (this.control instanceof HTMLIFrameElement) {
      this.#listen(this.control.contentDocument);
      this.#scrollTop = this.#getFrameScrollTop(this.control);
      this.#syncScroll();
    }
  }

  /** @private */
  #releaseCompress(): void {
    this.#cancelSnap();

    this.#direction = 0;
    this._base?.style.removeProperty("--_app-bar-reserved-height");
    this._wrapper?.style.removeProperty("height");
    this._wrapper?.style.removeProperty("--_progress");

    const label = this._wrapper?.querySelector<HTMLElement>(".label");
    label?.style.removeProperty("opacity");
    label?.style.removeProperty("transform");

    this._wrapper?.classList.remove("compressed");

    this.#range = 0;
    this.#collapse = 0;
    this.#lastScrollTop = 0;
  }

  /** @private */
  #syncScroll(): void {
    const base = this._base;
    const wrapper = this._wrapper;
    if (!wrapper || !base) return;

    const scrolled = this.#scrollTop > 0;
    const compress = this.scrollBehavior === "compress";
    const collapses = compress && this.size !== "small";

    // A small bar with the compress behavior has nothing to collapse, so it does not react to scrolling.
    wrapper.classList.toggle("on-scroll", scrolled && (!compress || collapses));
    wrapper.classList.toggle("compress", collapses);

    if (!collapses || !scrolled) {
      this.#releaseCompress();
      this.#setCompact(wrapper, false);
      return;
    }

    // The expanded height is reserved so the shrinking bar never shifts the scrolling content. It is
    // measured only while the bar is unconstrained (before collapsing begins).

    if (!base.style.getPropertyValue("--_app-bar-reserved-height")) {
      this.#expanded = wrapper.offsetHeight;
      base.style.setProperty("--_app-bar-reserved-height", `${this.#expanded}px`);
      wrapper.style.height = "var(--_target)";

      const target = wrapper.offsetHeight;
      wrapper.style.removeProperty("height");
      this.#range = Math.max(0, this.#expanded - target);
    }

    // The collapse amount follows scroll deltas rather than the scroll position. Scrolling up releases it
    // proportionally, so it is fully expanded again exactly at the top.

    const delta = this.#scrollTop - this.#lastScrollTop;
    if (delta !== 0) {
      this.#direction = Math.sign(delta);
      if (delta > 0) {
        this.#collapse += delta;
      } else {
        const ratio = this.#lastScrollTop > 0 ? this.#collapse / this.#lastScrollTop : 0;
        this.#collapse += delta * Math.max(1, ratio);
      }

      this.#collapse = Math.min(this.#range, Math.max(0, this.#collapse));
    }

    this.#lastScrollTop = this.#scrollTop;
    this.#applyCollapse();
  }

  /** @private */
  #applyCollapse(): void {
    const wrapper = this._wrapper;
    if (!wrapper) return;

    const progress = this.#range > 0 ? this.#collapse / this.#range : 0;

    wrapper.style.setProperty("--_progress", `${progress}`);
    wrapper.style.height = `${this.#expanded - this.#collapse}px`;
    wrapper.classList.add("compressed");

    // The title and subtitle fade out while the bar is still expanded, the layout switches while
    // they are invisible, and they fade back in as the bar reaches the small size. They also move in
    // lockstep with the collapse (up while collapsing and down while expanding). Before the switch the
    // label stays attached to the rising bottom edge. After it, the label rises into its resting place.

    const label = wrapper.querySelector<HTMLElement>(".label");
    if (label) {
      // The label is fully hidden before it travels far enough to overlap the icon buttons.

      const fadeOut = Math.max(0, 1 - progress / 0.4);
      const fadeIn = Math.max(0, (progress - 0.6) / 0.4);
      label.style.opacity = `${progress < 0.5 ? fadeOut : fadeIn}`;

      const offset = progress < 0.5 ? -this.#collapse : this.#range - this.#collapse;
      label.style.transform = `translateY(${offset}px)`;
    }

    this.#setCompact(wrapper, progress >= 0.5);
  }

  /** @private */
  #setCompact(wrapper: HTMLElement, compact: boolean): void {
    if (wrapper.classList.contains("compact") === compact) return;

    wrapper.classList.toggle("compact", compact);
    this.#syncCentered();
  }

  /** @private */
  #getFrameScrollTop(frame: HTMLIFrameElement): number {
    // Both document element (<html>) and body are tested for scroll top, taking the maximum.
    return Math.max(
      frame.contentDocument?.documentElement?.scrollTop ?? 0,
      frame.contentDocument?.body?.scrollTop ?? 0,
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-app-bar": M3eAppBarElement;
  }
}
