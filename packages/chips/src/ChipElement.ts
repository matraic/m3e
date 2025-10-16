import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  DesignToken,
  getTextContent,
  hasAssignedNodes,
  isDisabledInteractiveMixin,
  isDisabledMixin,
  isLinkButtonMixin,
  M3eElevationElement,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  renderPseudoLink,
  Role,
} from "@m3e/core";

import { ChipVariant } from "./ChipVariant";

/**
 * @summary
 * A non-interactive chip used to convey small pieces of information.
 *
 * @description
 * The `m3e-chip` component establishes the foundational structure for chips. It supports expressive styling,
 * accessible interaction, and flexible content projection, aligning with Material 3 guidelines. Appearance
 * variants include `elevated` and `outlined`, enabling visual differentiation and contextual emphasis.
 *
 * @example
 * The following example illustrates use of the `m3e-chip` and `m3e-chip-set` components to present non-interactive chips.
 * ```html
 * <m3e-chip-set>
 *  <m3e-chip><m3e-icon slot="icon" name="palette"></m3e-icon>Design</m3e-chip>
 *  <m3e-chip><m3e-icon slot="icon" name="accessibility_new"></m3e-icon>Accessibility</m3e-chip>
 *  <m3e-chip><m3e-icon slot="icon" name="motion_photos_on"></m3e-icon>Motion</m3e-chip>
 *  <m3e-chip><m3e-icon slot="icon" name="description"></m3e-icon>Documentation</m3e-chip>
 * </m3e-chip-set>
 * ```
 *
 * @tag m3e-chip
 *
 * @slot - Renders the label of the chip.
 * @slot icon - Renders an icon before the chip's label.
 * @slot trailing-icon - Renders an icon after the chip's label.
 *
 * @attr value - A string representing the value of the chip.
 * @attr variant - The appearance variant of the chip.
 *
 * @cssprop --m3e-chip-container-shape - Border radius of the chip container.
 * @cssprop --m3e-chip-container-height - Base height of the chip container before density adjustment.
 * @cssprop --m3e-chip-label-text-font-size - Font size of the chip label text.
 * @cssprop --m3e-chip-label-text-font-weight - Font weight of the chip label text.
 * @cssprop --m3e-chip-label-text-line-height - Line height of the chip label text.
 * @cssprop --m3e-chip-label-text-tracking - Letter spacing of the chip label text.
 * @cssprop --m3e-chip-label-text-color - Label text color in default state.
 * @cssprop --m3e-chip-icon-color - Icon color in default state.
 * @cssprop --m3e-chip-icon-size - Font size of leading/trailing icons.
 * @cssprop --m3e-chip-spacing - Horizontal gap between chip content elements.
 * @cssprop --m3e-chip-padding-start - Default start padding when no icon is present.
 * @cssprop --m3e-chip-padding-end - Default end padding when no trailing icon is present.
 * @cssprop --m3e-chip-with-icon-padding-start - Start padding when leading icon is present.
 * @cssprop --m3e-chip-with-icon-padding-end - End padding when trailing icon is present.
 * @cssprop --m3e-elevated-chip-container-color - Background color for elevated variant.
 * @cssprop --m3e-elevated-chip-elevation - Elevation level for elevated variant.
 * @cssprop --m3e-elevated-chip-hover-elevation - Elevation level on hover.
 * @cssprop --m3e-outlined-chip-outline-thickness - Outline thickness for outlined variant.
 * @cssprop --m3e-outlined-chip-outline-color - Outline color for outlined variant.
 */
@customElement("m3e-chip")
export class M3eChipElement extends Role(LitElement, "none") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      outline: none;
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
        `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`
      )};
      border-radius: var(--m3e-chip-container-shape, ${DesignToken.shape.corner.small});
      height: calc(var(--m3e-chip-container-height, 2rem) + ${DesignToken.density.calc(-2)});
      font-size: var(--m3e-chip-label-text-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-chip-label-text-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-chip-label-text-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-chip-label-text-tracking, ${DesignToken.typescale.standard.label.large.tracking});
    }
    :host(:not(m3e-chip):not(:disabled):not([disabled-interactive])) {
      cursor: pointer;
    }
    :host(:not(m3e-chip):not(:disabled)[disabled-interactive]) {
      cursor: not-allowed;
    }
    :host(:not(m3e-chip):not(:disabled):not([disabled-interactive])) .base {
      user-select: none;
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
      column-gap: var(--m3e-chip-spacing, 0.5rem);
    }
    .label {
      flex: 1 1 auto;
      min-width: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    :host([variant="elevated"]) .base {
      background-color: var(--m3e-elevated-chip-container-color, ${DesignToken.color.surfaceContainerLow});

      --m3e-elevation-level: var(--m3e-elevated-chip-elevation, ${DesignToken.elevation.level1});
      --m3e-elevation-hover-level: var(--m3e-elevated-chip-hover-elevation, ${DesignToken.elevation.level2});
      --m3e-elevation-focus-level: var(--m3e-elevated-chip-elevation, ${DesignToken.elevation.level1});
      --m3e-elevation-pressed-level: var(--m3e-elevated-chip-elevation, ${DesignToken.elevation.level1});
    }
    :host([variant="outlined"]) .base {
      outline-width: var(--m3e-outlined-chip-outline-thickness, 1px);
      outline-style: solid;
      outline-offset: calc(0px - var(--m3e-outlined-chip-outline-thickness, 1px));
    }
    :host(:not(:disabled):not([disabled-interactive])[variant="outlined"]) .base {
      outline-color: var(--m3e-outlined-chip-outline-color, ${DesignToken.color.outlineVariant});
    }
    :host(:disabled[variant="outlined"]) .base,
    :host([disabled-interactive][variant="outlined"]) .base {
      outline-color: color-mix(
        in srgb,
        var(--m3e-outlined-chip-disabled-outline-color, ${DesignToken.color.onSurface})
          var(--m3e-outlined-chip-disabled-outline-opacity, 12%),
        transparent
      );
    }
    :host(.-with-icon) .wrapper {
      padding-inline-start: var(--m3e-chip-with-icon-padding-start, 0.5rem);
    }
    :host(:not(.-with-icon)) .wrapper {
      padding-inline-start: var(--m3e-chip-padding-start, 1rem);
    }
    :host(.-with-trailing-icon) .wrapper {
      padding-inline-end: var(--m3e-chip-with-icon-padding-end, 0.5rem);
    }
    :host(:not(.-with-trailing-icon)) .wrapper {
      padding-inline-end: var(--m3e-chip-padding-end, 1rem);
    }
    ::slotted([slot="icon"]),
    ::slotted([slot="trailing-icon"]) {
      flex: none;
      width: 1em;
      font-size: var(--m3e-chip-icon-size, 1.125rem) !important;
    }
    :host(:not(:disabled):not([disabled-interactive]):not([selected])) .base {
      color: var(--m3e-chip-label-text-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="icon"]),
    :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="trailing-icon"]) {
      color: var(--m3e-chip-icon-color, ${DesignToken.color.primary});
    }
    :host(:disabled) .base,
    :host([disabled-interactive]) .base {
      color: color-mix(
        in srgb,
        var(--m3e-chip-disabled-label-text-color, ${DesignToken.color.onSurface})
          var(--m3e-chip-disabled-label-text-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) ::slotted([slot="icon"]),
    :host([disabled-interactive]) ::slotted([slot="icon"]),
    :host(:disabled) ::slotted([slot="trailing-icon"]),
    :host([disabled-interactive]) ::slotted([slot="trailing-icon"]) {
      color: color-mix(
        in srgb,
        var(--m3e-chip-disabled-icon-color, ${DesignToken.color.onSurface}) var(--m3e-chip-disabled-icon-opacity, 38%),
        transparent
      );
    }
    :host([variant="elevated"]:disabled) .base,
    :host([variant="elevated"][disabled-interactive]) .base {
      background-color: color-mix(
        in srgb,
        var(--m3e-elevated-chip-disabled-container-color, ${DesignToken.color.onSurface})
          var(--m3e-elevated-chip-disabled-container-opacity, 12%),
        transparent
      );
      --m3e-elevation-level: var(--m3e-elevated-chip-disabled-elevation, ${DesignToken.elevation.level0});
    }
    @media (prefers-reduced-motion) {
      .base {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .base {
        transition: none;
      }
      :host(:not(:disabled):not([disabled-interactive]):not([selected])) .base,
      :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="icon"]),
      :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="trailing-icon"]) {
        color: CanvasText;
      }
      :host(:not(:disabled):not([disabled-interactive])[variant="outlined"]) .base {
        outline-color: CanvasText;
      }
      :host(:disabled) .base,
      :host([disabled-interactive]) .base,
      :host(:disabled) ::slotted([slot="icon"]),
      :host([disabled-interactive]) ::slotted([slot="icon"]),
      :host(:disabled) ::slotted([slot="trailing-icon"]),
      :host([disabled-interactive]) ::slotted([slot="trailing-icon"]) {
        color: GrayText;
      }
      :host(:disabled[variant="outlined"]) .base,
      :host([disabled-interactive][variant="outlined"]) .base {
        outline-color: GrayText;
      }
    }
  `;

  /** @private */ @query(".elevation") private readonly _elevation?: M3eElevationElement;
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** @private */ #value?: string;
  /** @private */ #textContent = "";

  /**
   * The appearance variant of the chip.
   * @default "outlined"
   */
  @property({ reflect: true }) variant: ChipVariant = "outlined";

  /** A string representing the value of the chip. */
  @property() get value() {
    return this.#value ?? this.#textContent;
  }
  set value(value: string) {
    this.#value = value;
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    if (this.role === "listitem") {
      this.removeAttribute("tabindex");
    }

    [this._elevation, this._focusRing, this._stateLayer, this._ripple].forEach((x) => {
      if (!x?.htmlFor) {
        x?.attach(this);
      }
    });
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const disabled = !isDisabledMixin(this) || this.disabled;
    const disabledInteractive = isDisabledInteractiveMixin(this) && this.disabledInteractive;

    return html`<div class="base">
      <m3e-elevation class="elevation" ?disabled="${disabled || disabledInteractive}"></m3e-elevation>
      <m3e-state-layer class="state-layer" ?disabled="${disabled || disabledInteractive}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${disabled || disabledInteractive}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      ${isLinkButtonMixin(this) ? this[renderPseudoLink]() : nothing}
      <div class="wrapper">${this.#renderContent()}</div>
    </div>`;
  }

  /** @private */
  #renderContent(): unknown {
    return html`${this._renderIcon()}
      <div class="label">${this._renderSlot()}</div>
      ${this._renderTrailingIcon()}`;
  }

  /** @internal */
  protected _renderIcon(): unknown {
    return html`<slot name="icon" aria-hidden="true" @slotchange="${this.#handleIconSlotChange}"></slot>`;
  }

  /** @internal */
  protected _renderTrailingIcon(): unknown {
    return html`<slot
      name="trailing-icon"
      aria-hidden="true"
      @slotchange="${this.#handleTrailingIconSlotChange}"
    ></slot>`;
  }

  /** @internal */
  protected _renderSlot(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @private */
  #handleIconSlotChange(e: Event): void {
    this.classList.toggle("-with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleTrailingIconSlotChange(e: Event): void {
    this.classList.toggle("-with-trailing-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#textContent = getTextContent(<HTMLSlotElement>e.target);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-chip": M3eChipElement;
  }
}
