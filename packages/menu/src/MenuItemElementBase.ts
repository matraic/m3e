import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { query } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Disabled,
  Focusable,
  isLinkButtonMixin,
  KeyboardClick,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  renderPseudoLink,
} from "@m3e/core";

import type { M3eMenuElement } from "./MenuElement";

/** A base implementation for an item of a menu. This class must be inherited. */
export abstract class MenuItemElementBase extends KeyboardClick(
  Focusable(AttachInternals(Disabled(LitElement), true)),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      outline: none;
      user-select: none;
      flex: none;
      height: var(--m3e-menu-item-container-height, 3rem);
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    :host(:not(:disabled):not([aria-expanded="true"])) .base {
      color: var(--m3e-menu-item-color, ${DesignToken.color.onSurface});
    }
    :host(:not([aria-expanded="true"])) .base {
      --m3e-state-layer-hover-color: var(--m3e-menu-item-container-hover-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-focus-color: var(--m3e-menu-item-container-focus-color, ${DesignToken.color.onSurface});
      --m3e-ripple-color: var(--m3e-menu-item-ripple-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:disabled)[checked]) .base,
    :host(:not(:disabled)[aria-expanded="true"]) .base {
      color: var(--m3e-menu-selected-color, ${DesignToken.color.onSecondaryContainer});
      background-color: var(--m3e-menu-selected-container-color, ${DesignToken.color.secondaryContainer});
    }
    :host([checked]) .base,
    :host([aria-expanded="true"]) .base {
      --m3e-state-layer-hover-color: var(
        --m3e-menu-item-selected-container-hover-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-menu-item-selected-container-focus-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-ripple-color: var(--m3e-menu-item-selected-ripple-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:not(:disabled)) {
      cursor: pointer;
    }
    :host(:disabled) .base {
      color: color-mix(
        in srgb,
        var(--m3e-menu-item-disabled-color, ${DesignToken.color.onSurface}) var(--m3e-menu-item-disabled-opacity, 38%),
        transparent
      );
    }
    .base {
      box-sizing: border-box;
      vertical-align: middle;
      display: inline-flex;
      align-items: center;
      position: relative;
      width: 100%;
      height: 100%;
    }
    .touch {
      position: absolute;
      height: 3rem;
      left: 0;
      right: 0;
    }
    .wrapper {
      display: inline-flex;
      align-items: center;
      column-gap: var(--m3e-menu-item-icon-label-space, 0.75rem);
      padding-inline-start: var(--m3e-menu-item-padding-start, 0.75rem);
      padding-inline-end: var(--m3e-menu-item-padding-end, 0.75rem);
      font-size: var(--m3e-menu-item-label-text-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(
        --m3e-menu-item-label-text-font-weight,
        ${DesignToken.typescale.standard.label.large.fontWeight}
      );
      line-height: var(
        --m3e-menu-item-label-text-line-height,
        ${DesignToken.typescale.standard.label.large.lineHeight}
      );
      letter-spacing: var(--m3e-menu-item-label-text-tracking, ${DesignToken.typescale.standard.label.large.tracking});
    }
    .focus-ring {
      border-radius: var(--m3e-menu-item-focus-ring-shape, ${DesignToken.shape.corner.medium});
    }
    .content {
      flex: 1 1 auto;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    ::slotted([slot="icon"]),
    ::slotted([slot="trailing-icon"]),
    .trailing-icon {
      flex: none;
      width: 1em;
      font-size: var(--m3e-menu-item-icon-size, 1.5rem) !important;
    }
    @media (forced-colors: active) {
      .base {
        background-color: Menu;
        color: MenuText;
      }
      :host(:disabled) .base {
        color: GrayText;
      }
    }
  `;

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** The menu to which this item belongs. */
  get menu(): M3eMenuElement | null {
    return this.closest("m3e-menu");
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<div class="base">
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" inward ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      ${isLinkButtonMixin(this) ? this[renderPseudoLink]() : nothing}
      <div class="wrapper">${this._renderContent()}</div>
    </div>`;
  }

  /** @internal Renders the content of the item. */
  protected abstract _renderContent(): unknown;
}
