import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { property, query } from "lit/decorators.js";

import {
  AttachInternals,
  customElement,
  DesignToken,
  Disabled,
  DisabledInteractive,
  Focusable,
  hasAssignedNodes,
  KeyboardClick,
  LinkButton,
  M3eFocusRingElement,
  M3eSelectionIndicatorElement,
  ReconnectedCallback,
  renderPseudoLink,
  ResizeController,
  Role,
  Selected,
  setCustomState,
  SuppressInitialAnimation,
} from "@m3e/web/core";

import { selectionManager } from "@m3e/web/core/a11y";
import { SupportsDirectionality } from "@m3e/web/core/bidi";

import type { M3eNavBarElement } from "./NavBarElement";
import { NavItemOrientation } from "./NavItemOrientation";

/**
 * An item, placed in a navigation bar or rail, used to navigate to destinations in an application.
 *
 * @description
 * The `m3e-nav-item` component represents an interactive navigation item for use in navigation bars
 * or rails. Designed according to Material 3 principles, it supports icon and label slots, selection state,
 * orientation, and extensive theming via CSS custom properties.
 *
 * @example
 * The following example illustrates a nav bar with vertically oriented items.
 * ```html
 * <m3e-nav-bar>
 *   <m3e-nav-item><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="star"></m3e-icon>For you</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="newsstand"></m3e-icon>Trending</m3e-nav-item>
 * </m3e-nav-bar>
 * ```
 *
 * @tag m3e-nav-item
 *
 * @slot - Renders the label of the item.
 * @slot icon - Renders the icon of the item.
 * @slot selected-icon - Renders the icon of the item when selected.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr disabled-interactive - Whether the element is disabled and interactive.
 * @attr download - Whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr orientation - The layout orientation of the item.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr selected - Whether the element is selected.
 * @attr target - The target of the link button.
 *
 * @fires beforeinput - Dispatched before the selected state changes.
 * @fires input - Dispatched when the selected state changes.
 * @fires change - Dispatched when the selected state changes.
 * @fires click - Dispatched when the element is clicked.
 *
 * @cssprop --m3e-nav-item-label-text-font-size - Font size for the label text.
 * @cssprop --m3e-nav-item-label-text-font-weight - Font weight for the label text.
 * @cssprop --m3e-nav-item-label-text-line-height - Line height for the label text.
 * @cssprop --m3e-nav-item-label-text-tracking - Letter spacing for the label text.
 * @cssprop --m3e-nav-item-shape - Border radius of the nav item.
 * @cssprop --m3e-nav-item-icon-size - Size of the icon.
 * @cssprop --m3e-nav-item-spacing - Spacing between icon and label.
 * @cssprop --m3e-nav-item-inactive-label-text-color - Color of the label text when inactive.
 * @cssprop --m3e-nav-item-inactive-icon-color - Color of the icon when inactive.
 * @cssprop --m3e-nav-item-inactive-hover-state-layer-color - State layer color on hover when inactive.
 * @cssprop --m3e-nav-item-inactive-focus-state-layer-color - State layer color on focus when inactive.
 * @cssprop --m3e-nav-item-inactive-pressed-state-layer-color - State layer color on press when inactive.
 * @cssprop --m3e-nav-item-active-label-text-color - Color of the label text when active/selected.
 * @cssprop --m3e-nav-item-active-icon-color - Color of the icon when active/selected.
 * @cssprop --m3e-nav-item-active-container-color - Container color when active/selected.
 * @cssprop --m3e-nav-item-active-hover-state-layer-color - State layer color on hover when active.
 * @cssprop --m3e-nav-item-active-focus-state-layer-color - State layer color on focus when active.
 * @cssprop --m3e-nav-item-active-pressed-state-layer-color - State layer color on press when active.
 * @cssprop --m3e-nav-item-focus-ring-shape - Border radius for the focus ring.
 * @cssprop --m3e-nav-item-disabled-label-text-color - Color of the label text when disabled.
 * @cssprop --m3e-nav-item-disabled-label-text-opacity - Opacity of the label text when disabled.
 * @cssprop --m3e-nav-item-disabled-icon-color - Color of the icon when disabled.
 * @cssprop --m3e-nav-item-disabled-icon-opacity - Opacity of the icon when disabled.
 * @cssprop --m3e-horizontal-nav-item-padding - Padding for horizontal orientation.
 * @cssprop --m3e-horizontal-nav-item-active-indicator-height - Height of the active indicator in horizontal orientation.
 * @cssprop --m3e-vertical-nav-item-active-indicator-width - Width of the active indicator in vertical orientation.
 * @cssprop --m3e-vertical-nav-item-active-indicator-height - Height of the active indicator in vertical orientation.
 * @cssprop --m3e-vertical-nav-item-active-indicator-margin - Margin for the active indicator in vertical orientation.
 */
@customElement("m3e-nav-item")
export class M3eNavItemElement extends SupportsDirectionality(
  ReconnectedCallback(
    SuppressInitialAnimation(
      LinkButton(
        Selected(
          KeyboardClick(Focusable(DisabledInteractive(Disabled(AttachInternals(Role(LitElement, "button"), true))))),
        ),
      ),
    ),
  ),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      position: relative;
      outline: none;
      user-select: none;
      flex: 1;
      font-size: var(--m3e-nav-item-label-text-font-size, ${DesignToken.typescale.standard.label.medium.fontSize});
      font-weight: var(
        --m3e-nav-item-label-text-font-weight,
        ${DesignToken.typescale.standard.label.medium.fontWeight}
      );
      line-height: var(
        --m3e-nav-item-label-text-line-height,
        ${DesignToken.typescale.standard.label.medium.lineHeight}
      );
      letter-spacing: var(--m3e-nav-item-label-text-tracking, ${DesignToken.typescale.standard.label.medium.tracking});
      border-radius: var(--m3e-nav-item-shape, ${DesignToken.shape.corner.full});
      align-self: var(--_nav-item-align-self);
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    :host([hidden]) {
      display: none;
    }
    :host([orientation="vertical"]) {
      min-width: var(--_vertical-nav-item-min-width);
      width: var(--_vertical-nav-item-width);
      margin-inline: var(--_vertical-nav-item-margin-inline);
    }
    :host([orientation="horizontal"]) {
      max-width: fit-content;
    }
    :host([orientation="horizontal"]) .outer {
      margin-inline-start: var(--_horizontal-nav-item-leading-space);
      margin-inline-end: var(--_horizontal-nav-item-trailing-space);
    }
    :host(:not(:disabled):not([disabled-interactive])) {
      cursor: pointer;
    }
    :host([disabled-interactive]) {
      cursor: not-allowed;
    }
    .outer {
      height: 100%;
    }
    .outer,
    .inner {
      display: flex;
      align-items: center;
      justify-content: var(--_nav-item-justify-content, center);
      position: relative;
      border-radius: inherit;
    }
    .icon-wrapper {
      position: relative;
      flex: none;
      line-height: 0;
    }
    .base {
      contain: layout style;
      justify-content: unset;
      box-sizing: border-box;
      vertical-align: middle;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) .base {
      transition: ${unsafeCSS(
        `margin-top ${DesignToken.motion.duration.short1} ${DesignToken.motion.easing.standard}`,
      )};
    }
    .icon {
      position: absolute;
    }
    .label {
      vertical-align: middle;
    }
    * {
      user-select: none;
      -webkit-user-select: none;
    }
    :host([orientation="horizontal"]) .label {
      white-space: nowrap;
    }
    ::slotted([slot="icon"]),
    ::slotted([slot="selected-icon"]) {
      width: 1em;
      font-size: var(--m3e-nav-item-icon-size, 24px) !important;
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) .indicator {
      transition: ${unsafeCSS(`height ${DesignToken.motion.duration.short1} ${DesignToken.motion.easing.standard}`)};
    }
    :host(:not([selected])) slot[name="selected-icon"],
    :host(:not(:is(:state(--with-selected-icon), :--with-selected-icon))) slot[name="selected-icon"],
    :host([selected]:is(:state(--with-selected-icon), :--with-selected-icon)) slot[name="icon"] {
      display: none;
    }
    .indicator {
      --m3e-selection-indicator-color: var(
        --m3e-nav-item-active-container-color,
        ${DesignToken.color.secondaryContainer}
      );
    }
    :host(:not([selected]):not(:disabled):not([disabled-interactive])) .indicator {
      --m3e-selection-indicator-state-layer-hover-color: var(
        --m3e-nav-item-inactive-hover-state-layer-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-selection-indicator-state-layer-focus-color: var(
        --m3e-nav-item-inactive-focus-state-layer-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-selection-indicator-state-layer-pressed-color: var(
        --m3e-nav-item-inactive-pressed-state-layer-color,
        ${DesignToken.color.onSecondaryContainer}
      );
    }
    :host(:not([selected]):not(:disabled):not([disabled-interactive])) .label {
      color: var(--m3e-nav-item-inactive-label-text-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:not([selected]):not(:disabled):not([disabled-interactive])) .icon {
      color: var(--m3e-nav-item-inactive-icon-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host([selected]:not(:disabled):not([disabled-interactive])) .indicator {
      --m3e-selection-indicator-state-layer-hover-color: var(
        --m3e-nav-item-active-hover-state-layer-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-selection-indicator-state-layer-focus-color: var(
        --m3e-nav-item-active-focus-state-layer-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-selection-indicator-state-layer-pressed-color: var(
        --m3e-nav-item-active-pressed-state-layer-color,
        ${DesignToken.color.onSecondaryContainer}
      );
    }
    :host([selected]:not(:disabled):not([disabled-interactive]):not([orientation="horizontal"])) .label {
      color: var(--m3e-nav-item-active-label-text-color, ${DesignToken.color.secondary});
    }
    :host([selected]:not(:disabled):not([disabled-interactive])[orientation="horizontal"]) .label,
    :host([selected]:not(:disabled):not([disabled-interactive])) .icon {
      color: var(--m3e-nav-item-active-icon-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host([orientation="vertical"]) .outer {
      align-self: stretch;
      align-items: flex-start;
    }
    :host([orientation="vertical"]) .label {
      text-align: center;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-clamp: 2;
    }
    :host([orientation="vertical"]) .base {
      flex-direction: column;
      row-gap: var(--m3e-nav-item-spacing, ${DesignToken.measurement.space50});
    }
    :host([orientation="horizongal"]) .base {
      margin-top: 0;
    }
    :host([orientation="vertical"]) .base {
      margin-top: var(--m3e-vertical-nav-item-active-indicator-margin, ${DesignToken.measurement.space75});
      margin-bottom: var(--m3e-vertical-nav-item-active-indicator-margin, ${DesignToken.measurement.space75});
    }
    :host([orientation="vertical"]) .indicator {
      top: var(--m3e-vertical-nav-item-active-indicator-margin, ${DesignToken.measurement.space75});
      bottom: unset;
    }
    :host([orientation="vertical"]:is(:state(--rtl), :--rtl)) .indicator {
      right: var(--_vertical-nav-item-inset-start);
      left: unset;
    }
    :host([orientation="vertical"]:not(:is(:state(--rtl), :--rtl))) .indicator {
      left: var(--_vertical-nav-item-inset-start);
      right: unset;
    }
    :host([orientation="vertical"]) .indicator,
    :host([orientation="vertical"]) .icon-wrapper {
      min-width: var(--m3e-vertical-nav-item-active-indicator-width, 56px);
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"]) .state-layer {
      ${unsafeCSS(
        `collapse ${DesignToken.motion.duration.medium1}, indicator-grow-bounce ${DesignToken.motion.duration.medium2} ${DesignToken.motion.easing.standardAccelerate}`,
      )};
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"]) .indicator {
      animation: collapse ${DesignToken.motion.duration.medium1};
    }
    @keyframes collapse {
      from {
        width: var(--_expanded-width, var(--m3e-vertical-nav-item-active-indicator-width, 56px));
      }
      to {
        width: var(--m3e-vertical-nav-item-active-indicator-width, 56px);
      }
    }
    :host([orientation="vertical"]) .indicator,
    :host([orientation="vertical"]) .icon-wrapper {
      height: var(--m3e-vertical-nav-item-active-indicator-height, 32px);
    }
    :host([orientation="vertical"]) .icon {
      top: calc(
        calc(var(--m3e-vertical-nav-item-active-indicator-height, 32px) / 2) - calc(
            var(--m3e-nav-item-icon-size, 24px) / 2
          )
      );
      left: calc(
        calc(var(--m3e-vertical-nav-item-active-indicator-width, 56px) / 2) - calc(
            var(--m3e-nav-item-icon-size, 24px) / 2
          )
      );
    }
    :host([orientation="vertical"]) .focus-ring {
      border-radius: var(--m3e-nav-item-focus-ring-shape, ${DesignToken.shape.corner.medium});
    }
    :host([orientation="horizontal"]) .icon-wrapper {
      width: var(--m3e-nav-item-icon-size, 24px);
      height: var(--m3e-nav-item-icon-size, 24px);
    }
    :host([orientation="horizontal"]) .base {
      padding: var(--m3e-horizontal-nav-item-padding, ${DesignToken.measurement.space200});
    }
    :host([orientation="horizontal"]) .label {
      flex: 1 1 auto;
    }
    :host([orientation="horizontal"]) .base {
      column-gap: var(--m3e-nav-item-spacing, ${DesignToken.measurement.space50});
    }
    :host([orientation="horizontal"]) .indicator,
    :host([orientation="horizontal"]) .inner {
      height: var(--m3e-horizontal-nav-item-active-indicator-height, 40px);
    }
    :host([orientation="horizontal"]) .inner {
      width: fit-content;
    }
    .indicator {
      margin-inline: auto;
    }
    :host(:is(:state(--first), :--first):not(:is(:state(--no-animate), :--no-animate))[orientation="horizontal"])
      .icon-wrapper,
    :host(:not(:is(:state(--first), :--first)):not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"])
      .icon-wrapper {
      animation: ${unsafeCSS(`slide-down ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}`)};
    }
    :host(:not(:is(:state(--first), :--first)):not(:is(:state(--no-animate), :--no-animate))[orientation="horizontal"])
      .icon-wrapper,
    :host(:is(:state(--first), :--first):not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"])
      .icon-wrapper {
      animation: ${unsafeCSS(`slide-up ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}`)};
    }
    @keyframes slide-down {
      from {
        transform: translateY(-4px);
      }
      to {
        transform: translateY(0);
      }
    }
    @keyframes slide-up {
      from {
        transform: translateY(4px);
      }
      to {
        transform: translateY(0);
      }
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="horizontal"]) .label {
      animation: horizontal-fade-in ${DesignToken.motion.duration.medium1};
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"]) .label {
      animation: vertical-fade-in ${DesignToken.motion.duration.medium1};
    }
    @keyframes horizontal-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes vertical-fade-in {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    :host(:disabled) .label,
    :host([disabled-interactive]) .label {
      color: color-mix(
        in srgb,
        var(--m3e-nav-item-disabled-label-text-color, ${DesignToken.color.onSurface})
          var(--m3e-nav-item-disabled-label-text-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) .icon,
    :host([disabled-interactive]) .icon {
      color: color-mix(
        in srgb,
        var(--m3e-nav-item-disabled-icon-color, ${DesignToken.color.onSurface})
          var(--m3e-nav-item-disabled-icon-opacity, 38%),
        transparent
      );
    }
    a {
      all: unset;
      display: block;
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
      z-index: 1;
    }
    @media (prefers-reduced-motion) {
      :host(:is(:state(--first), :--first):not(:is(:state(--no-animate), :--no-animate))[orientation="horizontal"])
        .icon-wrapper,
      :host(:not(:is(:state(--first), :--first)):not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"])
        .icon-wrapper,
      :host(
          :not(:is(:state(--first), :--first)):not(:is(:state(--no-animate), :--no-animate))[orientation="horizontal"]
        )
        .icon-wrapper,
      :host(:is(:state(--first), :--first):not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"])
        .icon-wrapper,
      :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"]) .state-layer,
      :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"]) .indicator,
      :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="horizontal"]) .label,
      :host(:not(:is(:state(--no-animate), :--no-animate))[orientation="vertical"]) .label {
        animation: none;
      }
      :host(:not(:is(:state(--no-animate), :--no-animate))) .state-layer,
      :host(:not(:is(:state(--no-animate), :--no-animate))) .indicator,
      :host(:not(:is(:state(--no-animate), :--no-animate))) .base {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      :host(:disabled) .label,
      :host([disabled-interactive]) .label,
      :host(:disabled) .icon,
      :host([disabled-interactive]) .icon {
        color: GrayText;
      }
      :host(:not([selected]):not(:disabled):not([disabled-interactive])) .label,
      :host(:not([selected]):not(:disabled):not([disabled-interactive])) .icon {
        color: ButtonText;
      }
      :host([selected]:not(:disabled):not([disabled-interactive])) .indicator {
        --m3e-selection-indicator-color: ButtonText;
      }
      :host([orientation="vertical"][selected]:not(:disabled):not([disabled-interactive])) .label {
        color: ButtonText;
      }
      :host([orientation="horizontal"][selected]:not(:disabled):not([disabled-interactive])) .label,
      :host([selected]:not(:disabled):not([disabled-interactive])) .icon {
        forced-color-adjust: none;
        color: ButtonFace;
      }
    }
  `;

  /** @private */ #inRail = false;
  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".indicator") private readonly _indicator?: M3eSelectionIndicatorElement;
  /** @private */ @query(".inner") private readonly _inner?: HTMLElement;

  /** @private */ readonly #resizeController = new ResizeController(this, {
    target: null,
    callback: (entries) => this.#handleStateLayerResize(entries),
  });

  /**
   * The layout orientation of the item.
   * @default "vertical"
   */
  @property({ reflect: true }) orientation: NavItemOrientation = "vertical";

  /** The navigation bar to which this item belongs. */
  get navBar(): M3eNavBarElement | null {
    return this.closest("m3e-nav-bar") ?? this.closest("m3e-nav-rail") ?? null;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    this.#inRail = this.closest("m3e-nav-rail") !== null;
    super.connectedCallback();
    this.addEventListener("click", this.#clickHandler, { capture: true });
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#clickHandler, { capture: true });
    this.#inRail = false;
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();
    this.#initResizeObserver();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selected")) {
      this.ariaSelected = null;
      this.ariaPressed = null;
      this.ariaCurrent = `${this.selected}`;
      for (const icon of this.querySelectorAll("m3e-icon")) {
        icon.toggleAttribute("filled", this.selected);
      }
      this.navBar?.[selectionManager].notifySelectionChange(this);
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("orientation")) {
      this._focusRing?.attach(this);
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._indicator].forEach((x) => x?.attach(this));
    this.#initResizeObserver();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const disabled = this.disabled || this.disabledInteractive;
    const label = html`<div class="label"><slot></slot></div>`;
    return html`${this.orientation === "vertical"
        ? html`<m3e-focus-ring class="focus-ring" inward></m3e-focus-ring>`
        : nothing}
      <div class="outer">
        ${this[renderPseudoLink]()}
        <div class="inner">
          ${this.orientation === "horizontal" ? html`<m3e-focus-ring class="focus-ring"></m3e-focus-ring>` : nothing}
          <m3e-selection-indicator
            class="indicator"
            bounce
            ?centered="${this.orientation === "vertical"}"
            ?selected="${this.selected}"
            ?disabled="${disabled}"
          ></m3e-selection-indicator>
          <div class="touch" aria-hidden="true"></div>
          <div class="base">
            <div class="icon-wrapper" aria-hidden="true">
              <div class="icon">
                <slot name="icon"></slot>
                <slot name="selected-icon" @slotchange=${this.#handleSelectedIconSlotChange}></slot>
              </div>
            </div>

            <m3e-collapsible
              orientation="horizontal"
              ?no-animate="${!this.#inRail}"
              ?open="${this.orientation === "horizontal"}"
            >
              ${this.orientation === "horizontal" ? label : nothing}
            </m3e-collapsible>

            ${this.orientation === "horizontal" ? nothing : label}
          </div>
        </div>
      </div>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented) return;

    if (this.dispatchEvent(new Event("beforeinput", { bubbles: true, cancelable: true }))) {
      this.selected = true;
      this.navBar?.[selectionManager].notifySelectionChange(this);

      this.dispatchEvent(new Event("input", { bubbles: true }));
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /** @private */
  #handleSelectedIconSlotChange(e: Event): void {
    setCustomState(this, "--with-selected-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleStateLayerResize(entries: ResizeObserverEntry[]): void {
    if (entries.length === 0 || this.orientation === "vertical") return;
    this._inner?.style.setProperty("--_expanded-width", `${entries[0].contentRect.width}px`);
  }

  /** @private */
  #initResizeObserver(): void {
    if (this._indicator && this.#inRail) {
      this.#resizeController.observe(this._indicator);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-item": M3eNavItemElement;
  }
}
