import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, query } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Disabled,
  KeyboardClick,
  LinkButton,
  M3eElevationElement,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  renderPseudoLink,
  Role,
} from "@m3e/web/core";

import type { M3eFabMenuElement } from "./FabMenuElement";

/**
 * An item of a floating action button (FAB) menu.
 *
 * @example
 * The following example illustrates triggering a `m3e-fab-menu` from an `m3e-fab` using a `m3e-fab-menu-trigger`.
 * ```html
 * <m3e-fab variant="primary" size="large">
 *  <m3e-fab-menu-trigger for="fabmenu">
 *    <m3e-icon name="edit"></m3e-icon>
 *  </m3e-fab-menu-trigger>
 * </m3e-fab>
 * <m3e-fab-menu id="fabmenu" variant="secondary">
 *  <m3e-fab-menu-item>First</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Second</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Third</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Forth</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Fifth</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Sixth</m3e-fab-menu-item>
 * </m3e-fab-menu>
 * ```
 *
 * @tag m3e-menu-item
 *
 * @slot - Renders the label of the item.
 * @slot icon - Renders an icon before the items's label.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr download - A value indicating whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr target - The target of the link button.
 *
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-fab-menu-item-height - Height of the menu item.
 * @cssprop --m3e-fab-menu-item-font-size - Font size of the menu item label.
 * @cssprop --m3e-fab-menu-item-font-weight - Font weight of the menu item label.
 * @cssprop --m3e-fab-menu-item-line-height - Line height of the menu item label.
 * @cssprop --m3e-fab-menu-item-tracking - Letter spacing of the menu item label.
 * @cssprop --m3e-fab-menu-item-shape - Border radius of the menu item.
 * @cssprop --m3e-fab-menu-item-leading-space - Padding at the start of the menu item.
 * @cssprop --m3e-fab-menu-item-trailing-space - Padding at the end of the menu item.
 * @cssprop --m3e-fab-menu-item-spacing - Gap between icon and label.
 * @cssprop --m3e-fab-menu-item-icon-size - Size of the icon in the menu item.
 */
@customElement("m3e-fab-menu-item")
export class M3eFabMenuItemElement extends KeyboardClick(
  LinkButton(Disabled(AttachInternals(Role(LitElement, "menuitem"), true))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      outline: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .base {
      box-sizing: border-box;
      vertical-align: middle;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      width: 100%;
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
      )};
      height: var(--m3e-fab-menu-item-height, 3.5rem);
      font-size: var(--m3e-fab-menu-item-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-fab-menu-item-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-fab-menu-item-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-fab-menu-item-tracking, ${DesignToken.typescale.standard.label.large.tracking});
      border-radius: var(--m3e-fab-menu-item-shape, ${DesignToken.shape.corner.full});
    }
    :host(:not(:disabled)) .label,
    :host(:not(:disabled)) .icon {
      color: var(--_fab-menu-item-color);
    }
    :host(:not(:disabled)) .base {
      background-color: var(--_fab-menu-item-container-color);
      --m3e-state-layer-hover-color: var(--_fab-menu-background-hover-color);
      --m3e-state-layer-focus-color: var(--_fab-menu-background-focus-color);
      --m3e-ripple-color: var(--_fab-menu-ripple-color);
    }
    :host(:disabled) .base {
      background-color: color-mix(
        in srgb,
        var(--m3e-fab-menu-item-disabled-container-color, ${DesignToken.color.onSurface})
          var(--m3e-fab-menu-item-disabled-container-opacity, 10%),
        transparent
      );
    }
    :host(:disabled) .label,
    :host(:disabled) .icon {
      color: color-mix(
        in srgb,
        var(--m3e-fab-menu-item-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-fab-menu-item-disabled-opacity, 38%),
        transparent
      );
    }
    .touch {
      position: absolute;
      height: 3rem;
      left: 0;
      right: 0;
    }
    .wrapper {
      width: 100%;
      overflow: hidden;
      display: inline-flex;
      align-items: center;
      padding-inline-start: var(--m3e-fab-menu-item-leading-space, 1.5rem);
      padding-inline-end: var(--m3e-fab-menu-item-trailing-space, 1.5rem);
      column-gap: var(--m3e-fab-menu-item-spacing, 0.5rem);
    }
    .label {
      justify-self: center;
      flex: 1 1 auto;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    }
    .icon {
      font-size: var(--m3e-fab-menu-item-icon-size, 1.5rem);
      transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    }
    :host(:not(:disabled)) {
      cursor: pointer;
    }
    ::slotted([slot="icon"]) {
      font-size: inherit !important;
      flex: none;
    }
    ::slotted(svg[slot="icon"]) {
      width: 1em;
      height: 1em;
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
      .base,
      .label,
      .icon {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .base,
      .label,
      .icon {
        transition: none;
      }
      :host(:not(:disabled)) .base {
        background-color: Menu;
      }
      :host(:not(:disabled)) .label,
      :host(:not(:disabled)) .icon {
        color: MenuText;
      }
      :host(:disabled) .label,
      :host(:disabled) .icon {
        color: GrayText;
      }
    }
  `;

  /** @private */ @query(".elevation") private readonly _elevation?: M3eElevationElement;
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  /** The floating action button (FAB) menu to which this item belongs. */
  get menu(): M3eFabMenuElement | null {
    return this.closest("m3e-fab-menu");
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._elevation, this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<div class="base">
      <m3e-elevation class="elevation" ?disabled="${this.disabled}"></m3e-elevation>
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      ${this[renderPseudoLink]()}
      <div class="wrapper">
        <slot class="icon" name="icon" aria-hidden="true"></slot>
        <div class="label"><slot></slot></div>
      </div>
    </div>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented) {
      this.menu?.hide(true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-fab-menu-item": M3eFabMenuItemElement;
  }
}
