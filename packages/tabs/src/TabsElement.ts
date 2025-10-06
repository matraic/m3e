import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { AttachInternals, DesignToken, ResizeController } from "@m3e/core";
import { SelectionManager, selectionManager } from "@m3e/core/a11y";

import { TabVariant } from "./TabVariant";
import { M3eTabElement } from "./TabElement";
import { TabHeaderPosition } from "./TabHeaderPosition";

const MIN_PRIMARY_TAB_WIDTH = 24;

/**
 * @summary
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
 * @fires change - Emitted when the selected tab changes.
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
    .tablist {
      position: relative;
      box-sizing: border-box;
      flex: none;
    }
    ::slotted(prev-icon),
    ::slotted(next-icon),
    .icon {
      width: 1em;
      font-size: var(--m3e-tabs-paginator-button-icon-size, var(--m3e-icon-button-icon-size, 1.5rem)) !important;
    }
    .header {
      display: flex;
      flex-direction: column;
    }
    .tabs {
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
    }
    .ink-bar {
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
        width var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard}`
      )};
    }
    :host([header-position="after"]) .header {
      flex-direction: column-reverse;
    }
    :host([header-position="before"]) .ink-bar {
      margin-top: calc(0px - var(--_tabs-active-indicator-thickness));
    }
    :host([header-position="before"]) .tablist {
      --m3e-slide-group-divider-bottom: var(--m3e-divider-thickness, 1px) solid
        var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
    }
    :host([header-position="after"]) .ink-bar {
      margin-bottom: calc(0px - var(--_tabs-active-indicator-thickness));
    }
    :host([header-position="after"]) .tablist {
      --m3e-slide-group-divider-top: var(--m3e-divider-thickness, 1px) solid
        var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
    }
    :host([header-position="before"][variant="primary"]) .active-indicator {
      border-radius: var(--m3e-tabs-primary-before-active-indicator-shape, ${DesignToken.shape.corner.extraSmallTop});
    }
    :host([header-position="after"][variant="primary"]) .active-indicator {
      border-radius: var(--m3e-tabs-primary-after-active-indicator-shape, ${DesignToken.shape.corner.extraSmallBottom});
    }
    .tabs {
      flex: 1 1 auto;
    }
    :host([variant="primary"]) .tablist {
      --_tabs-activate-indicator-inset: var(--m3e-tabs-primary-active-indicator-inset, 0.125rem);
      --_tabs-active-indicator-thickness: var(--m3e-tabs-primary-active-indicator-thickness, 0.1875rem);
      --_tab-height: 4rem;
    }
    :host([header-position="before"]) .tablist {
      --_tab-focus-ring-bottom-offset: calc(var(--_tabs-active-indicator-thickness) + 1px);
    }
    :host([header-position="after"]) .tablist {
      --_tab-focus-ring-top-offset: calc(var(--_tabs-active-indicator-thickness) + 2px);
    }
    :host([header-position="before"][variant="primary"]) .tablist {
      --_tab-direction: column;
    }
    :host([header-position="after"][variant="primary"]) .tablist {
      --_tab-direction: column-reverse;
    }
    :host([variant="secondary"]) .tablist {
      --_tabs-active-indicator-thickness: var(--m3e-tabs-secondary-active-indicator-thickness, 0.125rem);
      --_tab-height: 3rem;
    }
    :host([stretch]) .header {
      width: 100%;
      --_tab-grow: 1;
    }
    :host(.-no-animate) .active-indicator {
      transition: none;
    }
    @media (prefers-reduced-motion) {
      .active-indicator {
        transition: none;
      }
    }
  `;

  /** @private */ @query(".tablist") private readonly _tablist!: HTMLElement;
  /** @private */ @state() _selectedIndex: number | null = null;

  /** @internal */
  readonly [selectionManager] = new SelectionManager<M3eTabElement>()
    .onSelectedItemsChange(() => this.#handleSelectedChange())
    .withHomeAndEnd()
    .withWrap();

  constructor() {
    super();
    new ResizeController(this, {
      skipInitial: true,
      callback: () => {
        this.classList.toggle("-no-animate", true);
        this.#updateInkBar();
      },
    });
  }

  /**
   * Whether scroll buttons are disabled.
   * @default false
   */
  @property({ attribute: "disable-pagination", type: Boolean }) disablePagination = false;

  /**
   * The position of the tab headers.
   * @default "before"
   */
  @property({ attribute: "header-position", reflect: true }) headerPosition: TabHeaderPosition = "before";

  /**
   * The appearance variant of the tabs.
   * @default "secondary"
   */
  @property({ reflect: true }) variant: TabVariant = "secondary";

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
    return this._selectedIndex !== null ? this.tabs[this._selectedIndex] ?? null : null;
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
    this.classList.toggle("-no-animate", true);
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
    let panelIndex: number | null = null;
    if (this.selectedTab?.control) {
      panelIndex = [...this.querySelectorAll("[slot='panel']")].indexOf(this.selectedTab.control);
      if (panelIndex === -1) {
        panelIndex = null;
      }
    }

    return html` ${this.headerPosition === "before" ? this.#renderHeader() : nothing}
      <m3e-slide class="tabs" .selectedIndex="${panelIndex}">
        <slot name="panel"></slot>
      </m3e-slide>
      ${this.headerPosition === "after" ? this.#renderHeader() : nothing}`;
  }

  /** @private */
  #renderHeader(): unknown {
    return html`<m3e-slide-group
      class="tablist"
      threshold="8"
      previous-page-label="${this.previousPageLabel}"
      next-page-label="${this.nextPageLabel}"
      ?disabled="${this.disablePagination}"
    >
      <slot name="prev-icon" slot="prev-icon">
        <svg class="prev icon" viewBox="0 -960 960 960" fill="currentColor">
          <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
        </svg>
      </slot>
      <slot name="next-icon" slot="next-icon">
        <svg class="next icon" viewBox="0 -960 960 960" fill="currentColor">
          <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
        </svg>
      </slot>
      <div class="header" role="tablist">
        <div class="tabs">
          <slot
            @slotchange="${this.#handleSlotChange}"
            @keydown="${this.#handleKeyDown}"
            @change="${this.#handleChange}"
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

    if (width > 0 && this.classList.contains("-no-animate")) {
      setTimeout(() => this.classList.toggle("-no-animate", false));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tabs": M3eTabsElement;
  }
}
