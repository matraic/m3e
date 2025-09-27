import { css, CSSResultGroup, html, isServer, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Disabled,
  DisabledInteractive,
  Focusable,
  KeyboardClick,
  LinkButton,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  renderPseudoLink,
  Role,
  Selected,
} from "@m3e/core";

import { selectionManager } from "@m3e/core/a11y";

import type { M3eNavBarElement } from "./NavBarElement";
import { NavItemOrientation } from "./NavItemOrientation";

/**
 * @summary
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
 * @attr disabled - A value indicating whether the element is disabled.
 * @attr disabled-interactive - A value indicating whether the element is disabled and interactive.
 * @attr download - A value indicating whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr orientation - The layout orientation of the item.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr selected - A value indicating whether the element is selected.
 * @attr target - The target of the link button.
 *
 * @fires input - Emitted when the selected state changes.
 * @fires change - Emitted when the selected state changes.
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
export class M3eNavItemElement extends LinkButton(
  Selected(KeyboardClick(Focusable(DisabledInteractive(Disabled(AttachInternals(Role(LitElement, "button")))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    css`
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
        letter-spacing: var(
          --m3e-nav-item-label-text-tracking,
          ${DesignToken.typescale.standard.label.medium.tracking}
        );
        border-radius: var(--m3e-nav-item-shape, ${DesignToken.shape.corner.full});
        min-width: var(--_nav-item-min-width);
        align-self: var(--_nav-item-align-self);
      }
      :host([orientation="horizontal"]) {
        max-width: fit-content;
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
      }
      .base {
        justify-content: unset;
        box-sizing: border-box;
        vertical-align: middle;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;
        width: 100%;
      }
      .icon {
        position: absolute;
      }
      .label {
        vertical-align: middle;
      }
      ::slotted([slot="icon"]),
      ::slotted([slot="selected-icon"]) {
        width: 1em;
        font-size: var(--m3e-nav-item-icon-size, 1.5rem) !important;
      }
      :host(:not([selected]):not(:disabled):not([disabled-interactive])) .outer {
        --m3e-state-layer-hover-color: var(
          --m3e-nav-item-inactive-hover-state-layer-color,
          ${DesignToken.color.onSecondaryContainer}
        );
        --m3e-state-layer-focus-color: var(
          --m3e-nav-item-inactive-focus-state-layer-color,
          ${DesignToken.color.onSecondaryContainer}
        );
        --m3e-ripple-color: var(
          --m3e-nav-item-inactive-pressed-state-layer-color,
          ${DesignToken.color.onSecondaryContainer}
        );
      }
      :host(:not([selected]):not(:disabled):not([disabled-interactive])) .label {
        color: var(--m3e-nav-item-inactive-label-text-color, ${DesignToken.color.onSurfaceVariant});
      }
      :host(:not([selected]):not(:disabled):not([disabled-interactive])) .icon {
        color: var(--m3e-nav-item-inactive-icon-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host([selected]:not(:disabled):not([disabled-interactive])) .outer {
        --m3e-state-layer-hover-color: var(
          --m3e-nav-item-active-hover-state-layer-color,
          ${DesignToken.color.onSecondaryContainer}
        );
        --m3e-state-layer-focus-color: var(
          --m3e-nav-item-active-focus-state-layer-color,
          ${DesignToken.color.onSecondaryContainer}
        );
        --m3e-ripple-color: var(
          --m3e-nav-item-active-pressed-state-layer-color,
          ${DesignToken.color.onSecondaryContainer}
        );
      }
      :host([selected]:not(:disabled):not([disabled-interactive])) .label {
        color: var(--m3e-nav-item-active-label-text-color, ${DesignToken.color.secondary});
      }
      :host([selected]:not(:disabled):not([disabled-interactive])) .state-layer {
        background-color: var(--m3e-nav-item-active-container-color, ${DesignToken.color.secondaryContainer});
      }
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
        row-gap: var(--m3e-nav-item-spacing, 0.25rem);
      }
      :host([orientation="vertical"]) .base {
        margin-block: var(--m3e-vertical-nav-item-active-indicator-margin, 0.375rem);
      }
      :host([orientation="vertical"]) .state-layer,
      :host([orientation="vertical"]) .ripple {
        top: var(--m3e-vertical-nav-item-active-indicator-margin, 0.375rem);
        bottom: unset;
      }
      :host([orientation="vertical"]) .state-layer,
      :host([orientation="vertical"]) .ripple,
      :host([orientation="vertical"]) .icon-wrapper {
        width: var(--m3e-vertical-nav-item-active-indicator-width, 3.5rem);
      }
      :host([orientation="vertical"]) .state-layer,
      :host([orientation="vertical"]) .ripple,
      :host([orientation="vertical"]) .icon-wrapper {
        height: var(--m3e-vertical-nav-item-active-indicator-height, 2rem);
      }
      :host([orientation="vertical"]) .icon {
        top: calc(
          calc(var(--m3e-vertical-nav-item-active-indicator-height, 2rem) / 2) -
            calc(var(--m3e-nav-item-icon-size, 1.5rem) / 2)
        );
        left: calc(
          calc(var(--m3e-vertical-nav-item-active-indicator-width, 3.5rem) / 2) -
            calc(var(--m3e-nav-item-icon-size, 1.5rem) / 2)
        );
      }
      :host([orientation="vertical"]) .focus-ring {
        border-radius: var(--m3e-nav-item-focus-ring-shape, ${DesignToken.shape.corner.extraSmall});
      }
      :host([orientation="horizontal"]) .icon-wrapper {
        width: var(--m3e-nav-item-icon-size, 1.5rem);
        height: var(--m3e-nav-item-icon-size, 1.5rem);
      }
      :host([orientation="horizontal"]) .base {
        padding: var(--m3e-horizontal-nav-item-padding, 1rem);
      }
      :host([orientation="horizontal"]) .label {
        flex: 1 1 auto;
      }
      :host([orientation="horizontal"]) .base {
        column-gap: var(--m3e-nav-item-spacing, 0.25rem);
      }
      :host([orientation="horizontal"]) .inner {
        height: var(--m3e-horizontal-nav-item-active-indicator-height, 2.5rem);
        width: fit-content;
      }
      :host([orientation="horizontal"]) {
        height: var(--_horizontal-nav-item-height);
      }
      .state-layer,
      .ripple {
        margin-inline: auto;
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
    `,
  ];

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

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
    super.connectedCallback();

    if (!isServer) {
      this.addEventListener("click", this.#clickHandler);
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (!isServer) {
      this.removeEventListener("click", this.#clickHandler);
    }
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
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const disabled = this.disabled || this.disabledInteractive;
    return html`${this.orientation === "vertical"
        ? html`<m3e-focus-ring class="focus-ring" inward></m3e-focus-ring>`
        : nothing}
      <div class="outer">
        ${this[renderPseudoLink]()}
        <div class="inner">
          ${this.orientation === "horizontal" ? html`<m3e-focus-ring class="focus-ring"></m3e-focus-ring>` : nothing}
          <m3e-state-layer class="state-layer" ?disabled="${disabled}"></m3e-state-layer>
          <m3e-ripple class="ripple" centered ?disabled="${disabled}"></m3e-ripple>
          <div class="touch" aria-hidden="true"></div>
          <div class="base">
            <div class="icon-wrapper" aria-hidden="true">
              <div class="icon">
                <slot name="icon" aria-hidden="true"></slot>
              </div>
            </div>
            <div class="label">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented) return;

    this.selected = true;
    if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      this.navBar?.[selectionManager].notifySelectionChange(this);
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      this.selected = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-item": M3eNavItemElement;
  }
}
