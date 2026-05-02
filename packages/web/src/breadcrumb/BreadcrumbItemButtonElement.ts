import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  AttachInternals,
  customElement,
  DesignToken,
  Disabled,
  Focusable,
  KeyboardClick,
  LinkButton,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  renderPseudoLink,
  Role,
  setCustomState,
} from "@m3e/web/core";

import { BreadcrumbItemCurrent } from "./BreadcrumbItemCurrent";
import { isIconOnly } from "./isIconOnly";

/**
 * @internal
 * An internal interactive element used to present the content of a breadcrumb item.
 */
@customElement("m3e-breadcrumb-item-button")
export class M3eBreadcrumbItemButtonElement extends KeyboardClick(
  LinkButton(Focusable(Disabled(AttachInternals(Role(LitElement, "button"), true)))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      outline: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .base {
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      border-radius: var(--m3e-breadcrumb-item-shape, ${DesignToken.shape.corner.full});
      height: calc(var(--m3e-breadcrumb-item-container-height, 2.5rem) + ${DesignToken.density.calc(-1)});
    }
    :host(:state(-icon-only)) .overflow {
      flex: none;
    }
    :host(:not(:state(-icon-only))),
    :host(:not(:state(-icon-only))) .base {
      min-width: 0;
    }
    :host(:state(-icon-only):not([current]):not(:disabled)) .base {
      color: var(--m3e-breadcrumb-item-icon-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:state(-icon-only)) .base {
      width: calc(var(--m3e-breadcrumb-item-container-height, 2.5rem) + ${DesignToken.density.calc(-1)});
      padding-inline: var(--m3e-breadcrumb-item-icon-padding-inline, 0px);
      --m3e-state-layer-hover-color: var(
        --m3e-breadcrumb-item-icon-hover-state-layer-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-breadcrumb-item-icon-focus-state-layer-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-ripple-color: var(--m3e-breadcrumb-item-icon-pressed-state-layer-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:state(-icon-only)):not([current]):not(:disabled)) .base {
      color: var(--m3e-breadcrumb-item-label-color, ${DesignToken.color.primary});
    }
    :host(:not(:state(-icon-only))) .base {
      font-size: var(--m3e-breadcrumb-item-label-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(
        --m3e-breadcrumb-item-label-font-weight,
        ${DesignToken.typescale.standard.label.large.fontWeight}
      );
      line-height: var(
        --m3e-breadcrumb-item-label-line-height,
        ${DesignToken.typescale.standard.label.large.lineHeight}
      );
      letter-spacing: var(--m3e-breadcrumb-item-label-tracking, ${DesignToken.typescale.standard.label.large.tracking});
    }
    :host(:not(:state(-icon-only))) .base {
      padding-inline: var(--m3e-breadcrumb-item-label-padding-inline, 0.75rem);
      --m3e-state-layer-hover-color: var(
        --m3e-breadcrumb-item-label-hover-state-layer-color,
        ${DesignToken.color.primary}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-breadcrumb-item-label-focus-state-layer-color,
        ${DesignToken.color.primary}
      );
      --m3e-ripple-color: var(--m3e-breadcrumb-item-label-pressed-state-layer-color, ${DesignToken.color.primary});
    }
    :host([current]:not(:disabled)) .base {
      color: var(--m3e-breadcrumb-item-last-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:disabled):not([current])) {
      cursor: pointer;
      user-select: none;
    }
    :host(:disabled) .base {
      color: color-mix(
        in srgb,
        var(--m3e-breadcrumb-item-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-breadcrumb-item-disabled-opacity, 38%),
        transparent
      );
    }
    .touch {
      position: absolute;
      height: 3rem;
      width: max(3rem, 100%);
      margin: auto;
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
    @media (forced-colors: active) {
      :host(:state(-icon-only):not([current]):not(:disabled)) .base,
      :host(:not(:state(-icon-only)):not([current]):not(:disabled)) .base {
        color: LinkText;
        outline: 1px solid LinkText;
      }
      :host(:disabled) .base {
        color: GrayText;
      }
    }
  `;

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** @private */ #clickHandler = (e: Event) => this.#handleClick(e);

  /**
   * Indicates the current item in the breadcrumb path.
   * @default undefined
   */
  @property({ reflect: true }) current?: BreadcrumbItemCurrent;

  /** @inheritdoc */
  override connectedCallback(): void {
    this.addEventListener("click", this.#clickHandler);
    super.connectedCallback();
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" aria-current="${ifDefined(this.current)}">
      ${this.current
        ? nothing
        : html`<m3e-state-layer class="state-layer" ?disabled="${this.disabled}"> </m3e-state-layer>
            <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
            <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
            ${this[renderPseudoLink]()}`}
      <m3e-text-overflow class="overflow">
        <slot @slotchange="${this.#handleSlotChange}"></slot>
      </m3e-text-overflow>
      ${this.current ? nothing : html`<div class="touch" aria-hidden="true"></div>`}
    </div>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    setCustomState(this, "-icon-only", isIconOnly(e.target as HTMLSlotElement));
  }

  /** @private */
  #handleClick(e: Event): void {
    // If current and link, disable default link click handler behavior.
    if (this.current && this.href) {
      e.preventDefault();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-breadcrumb-item-button": M3eBreadcrumbItemButtonElement;
  }
}
