import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Dirty,
  Disabled,
  Focusable,
  FormAssociated,
  formValue,
  M3eFocusRingElement,
  Role,
  Touched,
} from "@m3e/core";

/**
 * A thumb used to select a value in a slider.
 *
 * @description
 * The `m3e-slider-thumb` component is used within a `m3e-slider` to represent and select a specific value.
 * This component supports continuous and discrete input, form association, and accessibility semantics.
 * It emits `input` and `change` events to reflect value updates.
 *
 * @example
 * The following example illustrates a labelled slider with thumb used to select a single numeric value.
 * ```html
 * <m3e-slider labelled>
 *  <m3e-slider-thumb value="50"></m3e-slider-thumb>
 * </m3e-slider>
 * ```
 *
 * @example
 * The next example illustrates a labelled range slider with two thumbs used to select a minimum and maximum numeric value.
 * ```html
 * <m3e-slider labelled>
 *  <m3e-slider-thumb value="25"></m3e-slider-thumb>
 *  <m3e-slider-thumb value="75"></m3e-slider-thumb>
 * </m3e-slider>
 * ```
 *
 * @tag m3e-slider-thumb
 *
 * @attr disabled - Whether the element is disabled.
 * @attr name - The name that identifies the element when submitting the associated form.
 * @attr value - The value of the thumb.
 *
 * @fires input - Emitted when the value changes.
 * @fires change - Emitted when the value changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-slider-thumb-width - Width of the slider thumb.
 * @cssprop --m3e-slider-thumb-padding - Horizontal padding around the thumb.
 * @cssprop --m3e-slider-thumb-color - Active color of the slider thumb when enabled.
 * @cssprop --m3e-slider-thumb-pressed-width - Width of the thumb when pressed.
 * @cssprop --m3e-slider-thumb-disabled-color - Color of the thumb when disabled.
 * @cssprop --m3e-slider-thumb-disabled-opacity - Opacity of the thumb when disabled.
 * @cssprop --m3e-slider-label-width - Width of the floating label above the thumb.
 * @cssprop --m3e-slider-label-container-color - Background color of the label container.
 * @cssprop --m3e-slider-label-color - Text color of the label.
 * @cssprop --m3e-slider-label-font-size - Font size of the label text.
 * @cssprop --m3e-slider-label-font-weight - Font weight of the label text.
 * @cssprop --m3e-slider-label-line-height - Line height of the label text.
 * @cssprop --m3e-slider-label-tracking - Letter spacing of the label text.
 */
@customElement("m3e-slider-thumb")
export class M3eSliderThumbElement extends Dirty(
  Touched(FormAssociated(Focusable(Disabled(AttachInternals(Role(LitElement, "slider"))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      box-sizing: border-box;
      position: absolute;
      outline: none;
      top: 0;
      bottom: 0;
      border-radius: var(--m3e-slider-thumb-shape, ${DesignToken.shape.corner.full});
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
      height: 100%;
      border-radius: inherit;
    }
    .touch {
      position: absolute;
      height: 3rem;
      left: 0;
      right: 0;
      touch-action: none;
    }
    .wrapper {
      display: inline-flex;
      justify-content: center;
      height: 100%;
      border-radius: inherit;
      width: calc(var(--m3e-slider-thumb-width, 0.25rem) + calc(var(--m3e-slider-thumb-padding, 0.375em) * 2));
    }
    .focus-ring {
      --m3e-focus-ring-growth-factor: 1.5;
      top: calc(0px - var(--m3e-focus-ring-thickness, 0.1875rem));
      bottom: calc(0px - var(--m3e-focus-ring-thickness, 0.1875rem));
      left: var(--m3e-focus-ring-thickness, 0.1875rem);
      right: var(--m3e-focus-ring-thickness, 0.1875rem);
    }
    .label {
      user-select: none;
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      visibility: var(--_slider-label-visibility, hidden);
      opacity: var(--_slider-label-opacity, 0);
      transform: var(--_slider-label-transform, scale(0));
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
          transform ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard},
          visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`
      )};
      width: var(--m3e-slider-label-width, 3rem);
      height: var(--_m3e-slider-label-height, 2.75rem);
      top: calc(0px - var(--_m3e-slider-label-height, 2.75rem) - var(--_m3e-slider-label-margin, 0.25rem));
      left: calc(0px - 100%);
      border-radius: var(--m3e-slider-label-shape, ${DesignToken.shape.corner.full});
      background-color: var(--m3e-slider-label-container-color, ${DesignToken.color.inverseSurface});
      color: var(--m3e-slider-label-color, ${DesignToken.color.inverseOnSurface});
      font-size: var(--m3e-slider-label-font-size, ${DesignToken.typescale.standard.label.medium.fontSize});
      font-weight: var(--m3e-slider-label-font-weight, ${DesignToken.typescale.standard.label.medium.fontWeight});
      line-height: var(--m3e-slider-label-line-height, ${DesignToken.typescale.standard.label.medium.lineHeight});
      letter-spacing: var(--m3e-slider-label-tracking, ${DesignToken.typescale.standard.label.medium.tracking});
    }
    @starting-style {
      .label {
        opacity: 0;
        transform: scale(0);
      }
    }
    .handle {
      height: 100%;
      width: var(--m3e-slider-thumb-width, 0.25rem);
      border-radius: inherit;
      transition: ${unsafeCSS(`width ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}`)};
    }
    :host(:active:not([aria-disabled="true"])) .handle {
      width: var(--m3e-slider-thumb-pressed-width, 0.125rem);
    }
    :host(:not([aria-disabled="true"])) .handle {
      background-color: var(--m3e-slider-thumb-color, ${DesignToken.color.primary});
    }
    :host([aria-disabled="true"]) .handle {
      opacity: var(--m3e-slider-thumb-disabled-opacity, 38%);
      background-color: var(--m3e-slider-thumb-disabled-color, ${DesignToken.color.onSurface});
    }
    @media (prefers-reduced-motion) {
      .label {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .label {
        forced-color-adjust: none;
        background-color: CanvasText;
        color: Canvas;
      }
      :host(:not([aria-disabled="true"])) .handle {
        background-color: CanvasText;
      }
      :host([aria-disabled="true"]) .handle {
        opacity: unset;
        background-color: GrayText;
      }
    }
  `;

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;

  /**
   * The value of the thumb.
   * @default null
   */
  @property({ type: Number, reflect: true }) value: number | null = null;

  /** @inheritdoc */
  override get [formValue](): string | File | FormData | null {
    return this.value?.toString() ?? null;
  }

  /** @internal */
  get #labelText(): string {
    return this.closest("m3e-slider")?.displayWith?.(this.value) ?? this.value?.toString() ?? "";
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    this._focusRing?.attach(this);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("value")) {
      this.dispatchEvent(new Event("value-change", { bubbles: true }));
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="label" aria-hidden="true">${this.#labelText}</div>
      <div class="base">
        <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
        <div class="touch" aria-hidden="true"></div>
        <div class="wrapper">
          <div class="handle"></div>
        </div>
      </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-slider-thumb": M3eSliderThumbElement;
  }
}
