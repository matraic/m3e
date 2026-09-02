import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  addCustomState,
  AttachInternals,
  customElement,
  deleteCustomState,
  DesignToken,
  hasCustomState,
  prefersReducedMotion,
  ResizeController,
  setCustomEnumState,
  setCustomState,
} from "@m3e/web/core";

import { SelectionManager, selectionManager } from "@m3e/web/core/a11y";
import { M3eDirectionality } from "@m3e/web/core/bidi";
import { M3eSlideGroupElement } from "@m3e/web/slide-group";
import { PanGestureDetail } from "@m3e/web/gestures/pan";
import { FlingGestureDetail } from "@m3e/web/gestures/fling";

import "@m3e/web/slide-group";
import "@m3e/web/gestures/pan";
import "@m3e/web/gestures/fling";

import { M3eTabElement } from "./TabElement";
import { isTabVariant, TabVariant } from "./TabVariant";
import { isTabHeaderPosition, TabHeaderPosition } from "./TabHeaderPosition";

const MIN_PRIMARY_TAB_WIDTH = 24;

/**
 * Organizes content into separate views where only one view can be visible at a time.
 *
 * @description
 * The `m3e-tabs` component provides a structured navigation surface for organizing content into distinct views,
 * where only one view is visible at a time. It supports scrollable tab headers with optional pagination,
 * accessible labeling for navigation controls, and configurable header positioning to suit various layout
 * contexts. Two visual variants are available: `primary`, which emphasizes active indicators and shape styling
 * for prominent navigation, and `secondary`, which offers a more subtle presentation with reduced indicator
 * thickness. Stretch behavior allows tabs to expand and align rhythmically within their container, consistent
 * with Material 3 guidance.
 *
 * @example
 * The following example illustrates using the `m3e-tabs`, `m3e-tab`, and `m3e-tab-panel` components to present
 * secondary tabs.
 * ```html
 * <m3e-tabs>
 *  <m3e-tab selected for="videos"><m3e-icon slot="icon" name="videocam"></m3e-icon>Video</m3e-tab>
 *  <m3e-tab for="photos"><m3e-icon slot="icon" name="photo"></m3e-icon>Photos</m3e-tab>
 *  <m3e-tab for="audio"><m3e-icon slot="icon" name="music_note"></m3e-icon>Audio</m3e-tab>
 *  <m3e-tab-panel id="videos">Videos</m3e-tab-panel>
 *  <m3e-tab-panel id="photos">Photos</m3e-tab-panel>
 *  <m3e-tab-panel id="audio">Audio</m3e-tab-panel>
 * </m3e-tabs>
 * ```
 *
 * @tag m3e-tabs
 *
 * @slot - Renders the tabs.
 * @slot panel - Renders the panels of the tabs.
 * @slot next-icon - Renders the icon to present for the next button used to paginate.
 * @slot prev-icon - Renders the icon to present for the previous button used to paginate.
 *
 * @attr disable-pagination - Whether scroll buttons are disabled.
 * @attr header-position - The position of the tab headers.
 * @attr next-page-label - The accessible label given to the button used to move to the previous page.
 * @attr previous-page-label - The accessible label given to the button used to move to the next page.
 * @attr stretch - Whether tabs are stretched to fill the header.
 * @attr variant - The appearance variant of the tabs.
 *
 * @fires beforeinput - Dispatched before the selected state of a tab changes.
 * @fires input - Dispatched when the selected state of a tab changes.
 * @fires change - Dispatched when the selected tab changes.
 *
 * @cssprop --m3e-tabs-paginator-button-icon-size - Overrides the icon size for paginator buttons.
 * @cssprop --m3e-tabs-active-indicator-color - Color of the active tab indicator.
 * @cssprop --m3e-tabs-primary-before-active-indicator-shape - Border radius for active indicator when header is before and variant is primary.
 * @cssprop --m3e-tabs-primary-after-active-indicator-shape - Border radius for active indicator when header is after and variant is primary.
 * @cssprop --m3e-tabs-primary-active-indicator-inset - Inset for primary variant's active indicator.
 * @cssprop --m3e-tabs-primary-active-indicator-thickness - Thickness for primary variant's active indicator.
 * @cssprop --m3e-tabs-secondary-active-indicator-thickness - Thickness for secondary variant's active indicator.
 */
@customElement("m3e-tabs")
export class M3eTabsElement extends AttachInternals(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
    }
    :host([hidden]) {
      display: none;
    }
    .tablist {
      contain: layout style;
      position: relative;
      box-sizing: border-box;
      flex: none;
    }
    ::slotted(prev-icon),
    ::slotted(next-icon),
    .icon {
      width: 1em;
      font-size: var(--m3e-tabs-paginator-button-icon-size, var(--m3e-icon-button-icon-size, 24px)) !important;
    }
    .header {
      display: flex;
      flex-direction: column;
    }
    .tabs {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      touch-action: pan-y;
    }
    .ink-bar {
      contain: layout style paint;
      box-sizing: border-box;
      height: var(--_tabs-active-indicator-thickness);
    }
    .active-indicator {
      position: relative;
      height: var(--_tabs-active-indicator-thickness);
      left: calc(var(--_tabs-active-tab-position) + var(--_tabs-activate-indicator-inset, 0px));
      width: calc(var(--_tabs-active-tab-size) - calc(var(--_tabs-activate-indicator-inset, 0px) * 2));
      background-color: var(--m3e-tabs-active-indicator-color, ${DesignToken.color.primary});
      transition: ${unsafeCSS(
        `left var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard},
        width var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard}`,
      )};
    }
    :host(:is(:state(--header-position-after), :--header-position-after)) .header {
      flex-direction: column-reverse;
    }
    :host(:is(:state(--header-position-before), :--header-position-before)) .ink-bar {
      margin-top: calc(0px - var(--_tabs-active-indicator-thickness));
    }
    :host(:is(:state(--header-position-before), :--header-position-before)) .tablist {
      --m3e-slide-group-divider-bottom: var(--m3e-divider-thickness, 1px) solid
        var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
    }
    :host(:is(:state(--header-position-after), :--header-position-after)) .ink-bar {
      margin-bottom: calc(0px - var(--_tabs-active-indicator-thickness));
    }
    :host(:is(:state(--header-position-after), :--header-position-after)) .tablist {
      --m3e-slide-group-divider-top: var(--m3e-divider-thickness, 1px) solid
        var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
    }
    :host(:is(:state(--header-position-before), :--header-position-before):is(:state(--primary), :--primary))
      .active-indicator {
      border-radius: var(--m3e-tabs-primary-before-active-indicator-shape, ${DesignToken.shape.corner.extraSmallTop});
    }
    :host(:is(:state(--header-position-after), :--header-position-after):is(:state(--primary), :--primary))
      .active-indicator {
      border-radius: var(--m3e-tabs-primary-after-active-indicator-shape, ${DesignToken.shape.corner.extraSmallBottom});
    }
    .tabs {
      flex: 1 1 auto;
    }
    :host(:is(:state(--primary), :--primary)) .tablist {
      --_tabs-activate-indicator-inset: var(--m3e-tabs-primary-active-indicator-inset, 2px);
      --_tabs-active-indicator-thickness: var(--m3e-tabs-primary-active-indicator-thickness, 3px);
      --_tab-height: 64px;
    }
    :host(:is(:state(--header-position-before), :--header-position-before)) .tablist {
      --_tab-focus-ring-bottom-offset: calc(var(--_tabs-active-indicator-thickness) + 1px);
    }
    :host(:is(:state(--header-position-after), :--header-position-after)) .tablist {
      --_tab-focus-ring-top-offset: calc(var(--_tabs-active-indicator-thickness) + 2px);
    }
    :host(:is(:state(--header-position-before), :--header-position-before):is(:state(--primary), :--primary)) .tablist {
      --_tab-direction: column;
    }
    :host(:is(:state(--header-position-after), :--header-position-after):is(:state(--primary), :--primary)) .tablist {
      --_tab-direction: column-reverse;
    }
    :host(:is(:state(--secondary), :--secondary)) .tablist {
      --_tabs-active-indicator-thickness: var(--m3e-tabs-secondary-active-indicator-thickness, 2px);
      --_tab-height: 48px;
      --_tab-selected-color: ${DesignToken.color.onSurface};
      --_tab-selected-container-hover-color: ${DesignToken.color.onSurface};
      --_tab-selected-container-focus-color: ${DesignToken.color.onSurface};
      --_tab-selected-ripple-color: ${DesignToken.color.onSurface};
    }
    :host([stretch]) .header {
      width: 100%;
      --_tab-grow: 1;
    }
    .tabs.sliding ::slotted([slot="panel"]) {
      transform: translateX(var(--_tabs-slide-offset-x));
      visibility: var(--_tabs-slide-visibility, "hidden");
    }
    .tabs.snap ::slotted([slot="panel"]) {
      transition: ${unsafeCSS(
        `inset-inline-start var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard},
        transform var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard},
        visibility var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    .tabs:not(.sliding) ::slotted([slot="panel"]) {
      transform: translateX(0);
    }
    :host(:is(:state(--no-animate), :--no-animate)) .active-indicator {
      transition: none;
    }
    @media (prefers-reduced-motion) {
      .active-indicator {
        transition: none;
      }
      .tabs.snap ::slotted([slot="panel"]) {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .active-indicator {
        background-color: ButtonText;
        --m3e-divider-color: GrayText;
      }
    }
  `;

  /** @private */ #directionalitySubscription?: () => void;
  /** @private */ @query(".tablist") private readonly _tablist!: M3eSlideGroupElement;
  /** @private */ @state() _selectedIndex: number | null = null;

  /** @internal */
  readonly [selectionManager] = new SelectionManager<M3eTabElement>()
    .onSelectedItemsChange(() => this.#handleSelectedChange())
    .onActiveItemChange(() => this.#handleActiveItemChange())
    .withHomeAndEnd()
    .withWrap()
    .withDirectionality(M3eDirectionality.current);

  constructor() {
    super();
    new ResizeController(this, {
      skipInitial: true,
      callback: () => {
        addCustomState(this, "--no-animate");
        const activeTab = this[selectionManager].activeItem ?? this.selectedTab;
        if (activeTab) {
          this.#scrollTabIntoView(activeTab, true);
        } else {
          this.#updateInkBar();
        }
      },
    });
  }

  /**
   * Whether scroll buttons are disabled.
   * @default false
   */
  @property({ attribute: false }) get disablePagination(): boolean | "auto" {
    switch (this.getAttribute("disable-pagination")) {
      case "auto":
        return "auto";
      case "":
      case "true":
        return true;
      default:
        return false;
    }
  }
  set disablePagination(value: boolean | "auto") {
    switch (value) {
      case false:
        this.removeAttribute("disable-pagination");
        break;
      case true:
        this.toggleAttribute("disable-pagination", true);
        break;
      case "auto":
        this.setAttribute("disable-pagination", "auto");
        break;
    }
  }

  /**
   * The position of the tab headers.
   * @default "before"
   */
  @property({ attribute: "header-position", reflect: true, useDefault: true }) headerPosition: TabHeaderPosition =
    "before";

  /**
   * The appearance variant of the tabs.
   * @default "secondary"
   */
  @property({ reflect: true, useDefault: true }) variant: TabVariant = "secondary";

  /**
   * Whether tabs are stretched to fill the header.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) stretch = false;

  /**
   * The accessible label given to the button used to move to the previous page.
   * @default "Previous page"
   */
  @property({ attribute: "previous-page-label" }) previousPageLabel = "Previous page";

  /**
   * The accessible label given to the button used to move to the next page.
   * @default "Next page"
   */
  @property({ attribute: "next-page-label" }) nextPageLabel = "Next page";

  /** The tabs. */
  get tabs(): readonly M3eTabElement[] {
    return this[selectionManager]?.items ?? [];
  }

  /** The selected tab. */
  get selectedTab(): M3eTabElement | null {
    return this._selectedIndex !== null ? (this.tabs[this._selectedIndex] ?? null) : null;
  }

  /** The zero-based index of the selected tab. */
  get selectedIndex(): number {
    return this._selectedIndex ?? -1;
  }
  set selectedIndex(value: number) {
    if (value >= 0 && value < this.tabs.length) {
      this.tabs[value].selected = true;
    } else {
      const selectedTab = this.selectedTab;
      if (selectedTab) {
        selectedTab.selected = false;
      }
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#applyVariant();
    this.#applyHeaderPosition();

    addCustomState(this, "--no-animate");
    this.#directionalitySubscription = M3eDirectionality.observe(() => {
      this.requestUpdate();
      this[selectionManager].directionality = M3eDirectionality.current;
    });
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.#directionalitySubscription?.();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("variant")) {
      this.#applyVariant();
    }
    if (_changedProperties.has("headerPosition")) {
      this.#applyHeaderPosition();
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);

    if (!_changedProperties.has("variant") && this._selectedIndex !== null) {
      this.#updateInkBar();
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if ((_changedProperties.has("variant") || _changedProperties.has("stretch")) && this._selectedIndex !== null) {
      this.#updateInkBar();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    let panelIndex: number | undefined;
    if (this.selectedTab?.control) {
      panelIndex = [...this.querySelectorAll("[slot='panel']")].indexOf(this.selectedTab.control);
      if (panelIndex === -1) {
        panelIndex = undefined;
      }
    }

    return html` ${this.headerPosition === "before" ? this.#renderHeader() : nothing}
      <m3e-slide id="tabs" class="tabs" selected-index="${ifDefined(panelIndex)}">
        <slot name="panel"></slot>
      </m3e-slide>
      <m3e-pan-gesture
        for="tabs"
        lock-axis="x"
        pointer-types="touch pen"
        @gesture=${this.#handlePanGesture}
      ></m3e-pan-gesture>
      <m3e-fling-gesture
        for="tabs"
        directions="left right"
        pointer-types="touch pen"
        @gesture=${this.#handleFlingGesture}
      ></m3e-fling-gesture>
      ${this.headerPosition === "after" ? this.#renderHeader() : nothing}`;
  }

  /** @private */
  #applyVariant(): void {
    if (!isTabVariant(this.variant)) {
      this.variant = "secondary";
    }
    setCustomEnumState(this, this.variant, "primary", "secondary");
  }

  /** @private */
  #applyHeaderPosition(): void {
    if (!isTabHeaderPosition(this.headerPosition)) {
      this.headerPosition = "before";
    }
    setCustomState(this, "--header-position-before", this.headerPosition === "before");
    setCustomState(this, "--header-position-after", this.headerPosition === "after");
  }

  /** @private */
  #renderHeader(): unknown {
    return html`<m3e-slide-group
      class="tablist"
      threshold="8"
      previous-page-label="${this.previousPageLabel}"
      next-page-label="${this.nextPageLabel}"
      ?disabled="${this.disablePagination === "auto"
        ? matchMedia("(hover: none) and (pointer: coarse)").matches
        : this.disablePagination}"
      @pagination-changed=${this.#handleTabsPaginationChange}
    >
      <slot name="prev-icon" slot="prev-icon">
        ${M3eDirectionality.current === "ltr"
          ? html`<svg class="prev icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>`
          : html`<svg class="next icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>`}
      </slot>
      <slot name="next-icon" slot="next-icon">
        ${M3eDirectionality.current === "ltr"
          ? html`<svg class="next icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>`
          : html`<svg class="prev icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>`}
      </slot>
      <div class="header" role="tablist">
        <div class="tabs">
          <slot
            @slotchange=${this.#handleSlotChange}
            @keydown=${this.#handleKeyDown}
            @change=${this.#handleChange}
          ></slot>
        </div>
        <div class="ink-bar" aria-hidden="true">
          <div class="active-indicator"></div>
        </div>
      </div>
    </m3e-slide-group>`;
  }

  /** @private */
  #handleSlotChange(): void {
    this[selectionManager].setItems([...this.querySelectorAll("m3e-tab")]);
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this[selectionManager].onKeyDown(e);
  }

  /** @private */
  #handleChange(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #handleSelectedChange(): void {
    const selected = this[selectionManager].selectedItems[0];
    let selectedIndex = selected ? this.tabs.indexOf(selected) : null;
    if (selectedIndex === -1) {
      selectedIndex = null;
    }
    this._selectedIndex = selectedIndex;

    if (selected) {
      this.#scrollTabIntoView(selected, hasCustomState(this, "--no-animate"));
    } else {
      this.#updateInkBar();
    }
  }

  /** @private */
  #handleActiveItemChange(): void {
    if (this[selectionManager].activeItem) {
      this.#scrollTabIntoView(this[selectionManager].activeItem, hasCustomState(this, "--no-animate"));
    }
  }

  /** @private */
  #handleTabsPaginationChange(): void {
    if (this.disablePagination) return;
    const activeTab = this[selectionManager].activeItem ?? this.selectedTab;
    if (activeTab) {
      this.#scrollTabIntoView(activeTab, true);
    }
  }

  /** @private */
  #handlePanGesture(e: CustomEvent<PanGestureDetail>): void {
    const slide = this.shadowRoot?.querySelector("m3e-slide");

    switch (e.detail.phase) {
      case "move":
        {
          let dx = e.detail.totalDeltaX;
          if (this.selectedIndex === 0 && dx > 0) {
            dx = 0;
          }
          if (this.selectedIndex === this.tabs.length - 1 && dx < 0) {
            dx = 0;
          }

          slide?.classList.add("sliding");
          this.selectedTab?.control?.style.setProperty("--_tabs-slide-offset-x", `${dx}px`);

          const nextTab = this.tabs[dx > 0 ? this.selectedIndex - 1 : this.selectedIndex + 1];
          nextTab?.control?.style.setProperty("--_tabs-slide-offset-x", `${dx}px`);
          nextTab?.control?.style.setProperty("--_tabs-slide-visibility", "visible");

          const prevTab = this.tabs[dx > 0 ? this.selectedIndex + 1 : this.selectedIndex - 1];
          prevTab?.control?.style.removeProperty("--_tabs-slide-offset-x");
          prevTab?.control?.style.removeProperty("--_tabs-slide-visibility");
        }
        break;

      case "end":
      case "cancel":
        this.#endSwipeGesture();
        break;
    }
  }

  /** @private */
  #handleFlingGesture(e: CustomEvent<FlingGestureDetail>): void {
    switch (e.detail.direction) {
      case "left":
        // go to the next tab only if its not disabled.
        if (this.selectedIndex < this.tabs.length - 1 && !this.tabs[this.selectedIndex + 1].disabled) {
          this.selectedIndex++;
        }
        break;
      case "right":
        // go to the previous tab only if its not disabled.
        if (this.selectedIndex > 0 && this.tabs.length > 1 && !this.tabs[this.selectedIndex - 1].disabled) {
          this.selectedIndex--;
        }
        break;
    }
  }

  /** @private */
  #endSwipeGesture(): void {
    const slide = this.shadowRoot?.querySelector("m3e-slide");
    if (!slide || !slide.classList.contains("sliding")) {
      return;
    }
    slide.classList.add("snap");

    if (!prefersReducedMotion()) {
      slide.addEventListener("transitionend", () => slide.classList.remove("snap"), { once: true });
    }
    slide.classList.remove("sliding");
    this.tabs.forEach((x) => {
      x.control?.style.removeProperty("--_tabs-slide-offset-x");
      x.control?.style.removeProperty("--_tabs-slide-visibility");
    });
  }

  /** @private */
  async #scrollTabIntoView(tab: M3eTabElement, instant: boolean): Promise<void> {
    await this.updateComplete;
    for (const tab of this.tabs) {
      await tab.updateComplete;
    }

    await this._tablist?.updateComplete;

    const scrollMargin = 48;
    const scrollContainer = this._tablist?.scrollContainer;
    if (!scrollContainer) return;

    scrollContainer?.scrollTo({
      behavior: instant ? "instant" : "smooth",
      top: 0,
      left: Math.min(
        tab.offsetLeft - scrollContainer.offsetLeft - scrollMargin,
        Math.max(
          tab.offsetLeft + tab.offsetWidth - scrollContainer.offsetWidth - scrollContainer.offsetLeft + scrollMargin,
          scrollContainer.scrollLeft,
        ),
      ),
    });

    this.#updateInkBar();
  }

  /** @private */
  #updateInkBar(): void {
    if (!this._tablist) return;
    const selected = this[selectionManager].selectedItems[0];
    let left = 0;
    let width = 0;

    if (selected && this._selectedIndex !== null) {
      for (let i = 0; i < this._selectedIndex; i++) {
        left += this.tabs[i].clientWidth;
      }

      width = selected.clientWidth;
      if (this.variant === "primary" && selected.label) {
        left += selected.label.offsetLeft;
        width = selected.label.clientWidth;
        if (width < MIN_PRIMARY_TAB_WIDTH) {
          left -= (MIN_PRIMARY_TAB_WIDTH - width) / 2;
          width = MIN_PRIMARY_TAB_WIDTH;
        }
      }
    }

    this._tablist.style.setProperty("--_tabs-active-tab-position", `${left}px`);
    this._tablist.style.setProperty("--_tabs-active-tab-size", `${width}px`);

    if (width > 0 && hasCustomState(this, "--no-animate")) {
      setTimeout(() => deleteCustomState(this, "--no-animate"));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tabs": M3eTabsElement;
  }
}
