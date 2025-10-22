import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  AttachInternals,
  Checked,
  DesignToken,
  Dirty,
  Disabled,
  hasAssignedNodes,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  Role,
  Touched,
} from "@m3e/core";

import { selectionManager } from "@m3e/core/a11y";

/**
 * @summary
 * A option that can be selected within a segmented button.
 *
 * @description
 * The `m3e-button-segment` component represents a single selectable option within a segmented button group.
 * It behaves like a toggle-able button, supporting icon and label content, selection state, and accessibility
 * roles. Segments are visually unified but independently interactive, adapting shape, color, and ripple feedback
 * based on their position and state.
 *
 * @example
 * The following example illustrates a single-select segmented button with four segments.
 * ```html
 * <m3e-segmented-button>
 *  <m3e-button-segment checked>8 oz</m3e-button-segment>
 *  <m3e-button-segment>12 oz</m3e-button-segment>
 *  <m3e-button-segment>16 oz</m3e-button-segment>
 *  <m3e-button-segment>20 oz</m3e-button-segment>
 * </m3e-segmented-button>
 * ```
 * @example
 * The next example illustrates a multiselect segmented button designated using the `multi` attribute.
 * ```html
 * <m3e-segmented-button multi>
 *  <m3e-button-segment checked>$</m3e-button-segment>
 *  <m3e-button-segment checked>$$</m3e-button-segment>
 *  <m3e-button-segment>$$$</m3e-button-segment>
 *  <m3e-button-segment>$$$$</m3e-button-segment>
 * </m3e-segmented-button>
 * ```
 *
 * @tag m3e-button-segment
 *
 * @slot - Renders the label of the option.
 * @slot icon - Renders an icon before the option's label.
 *
 * @attr checked - Whether the element is checked.
 * @attr disabled - Whether the element is disabled.
 * @attr value - A string representing the value of the segment.
 *
 * @fires input - Emitted when the checked state changes.
 * @fires change - Emitted when the checked state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-segmented-button-height - Total height of the segmented button.
 * @cssprop --m3e-segmented-button-outline-thickness - Thickness of the button’s border.
 * @cssprop --m3e-segmented-button-outline-color - Color of the button’s border.
 * @cssprop --m3e-segmented-button-padding-start - Padding on the leading edge of the button content.
 * @cssprop --m3e-segmented-button-padding-end - Padding on the trailing edge of the button content.
 * @cssprop --m3e-segmented-button-spacing - Horizontal gap between icon and label.
 * @cssprop --m3e-segmented-button-font-size - Font size of the label text.
 * @cssprop --m3e-segmented-button-font-weight - Font weight of the label text.
 * @cssprop --m3e-segmented-button-line-height - Line height of the label text.
 * @cssprop --m3e-segmented-button-tracking - Letter spacing of the label text.
 * @cssprop --m3e-segmented-button-with-icon-padding-start - Leading padding when an icon is present.
 * @cssprop --m3e-segmented-button-selected-container-color - Background color of a selected segment.
 * @cssprop --m3e-segmented-button-selected-container-hover-color - Hover state-layer color for selected segments.
 * @cssprop --m3e-segmented-button-selected-container-focus-color - Focus state-layer color for selected segments.
 * @cssprop --m3e-segmented-button-selected-ripple-color - Ripple color for selected segments.
 * @cssprop --m3e-segmented-button-selected-label-text-color - Label text color for selected segments.
 * @cssprop --m3e-segmented-button-selected-icon-color - Icon color for selected segments.
 * @cssprop --m3e-segmented-button-unselected-container-hover-color - Hover state-layer color for unselected segments.
 * @cssprop --m3e-segmented-button-unselected-container-focus-color - Focus state-layer color for unselected segments.
 * @cssprop --m3e-segmented-button-unselected-ripple-color - Ripple color for unselected segments.
 * @cssprop --m3e-segmented-button-unselected-label-text-color - Label text color for unselected segments.
 * @cssprop --m3e-segmented-button-unselected-icon-color - Icon color for unselected segments.
 * @cssprop --m3e-segmented-button-icon-size - Font size of the icon.
 * @cssprop --m3e-segmented-button-disabled-outline-color - Base color for disabled segment borders.
 * @cssprop --m3e-segmented-button-disabled-outline-opacity - Opacity applied to disabled segment borders.
 * @cssprop --m3e-segmented-button-disabled-label-text-color - Base color for disabled label text.
 * @cssprop --m3e-segmented-button-disabled-label-text-opacity - Opacity applied to disabled label text.
 * @cssprop --m3e-segmented-button-disabled-icon-color - Base color for disabled icons.
 * @cssprop --m3e-segmented-button-disabled-icon-opacity - Opacity applied to disabled icons.
 */
@customElement("m3e-button-segment")
export class M3eButtonSegmentElement extends Dirty(
  Touched(Checked(Disabled(AttachInternals(Role(LitElement, "radio"), true))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      position: relative;
      vertical-align: middle;
      outline: none;
      user-select: none;
      flex: 1 1 auto;
      min-width: 0;
    }
    .base {
      display: inline-flex;
      vertical-align: middle;
      align-items: center;
      width: 100%;
      height: calc(var(--m3e-segmented-button-height, 2.5rem) + ${DesignToken.density.calc(-3)});
      box-sizing: border-box;
      border-width: var(--m3e-segmented-button-outline-thickness, 1px);
      border-color: var(--m3e-segmented-button-outline-color, ${DesignToken.color.outline});
      border-style: solid;
      border-radius: inherit;
      border-left-style: var(--_segmented-button-left-border, solid);
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`
      )};
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
      padding-inline-start: var(--m3e-segmented-button-padding-start, 1rem);
      padding-inline-end: var(--m3e-segmented-button-padding-end, 1rem);
      column-gap: var(--m3e-segmented-button-spacing, 0.5rem);
    }
    .label {
      font-size: var(--m3e-segmented-button-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-segmented-button-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-segmented-button-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-segmented-button-tracking, ${DesignToken.typescale.standard.label.large.tracking});
      justify-self: center;
      flex: 1 1 auto;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    }
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      transition: ${unsafeCSS(`color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    }
    :host(:not(:disabled)) {
      cursor: pointer;
    }
    :host([checked]:not(.-hide-selection)) .wrapper,
    :host(.-with-icon) .wrapper {
      padding-inline-start: var(--m3e-segmented-button-with-icon-padding-start, 0.75rem);
    }
    :host(:not(:disabled)[checked]) .base {
      background-color: var(--m3e-segmented-button-selected-container-color, ${DesignToken.color.secondaryContainer});
      --m3e-state-layer-hover-color: var(
        --m3e-segmented-button-selected-container-hover-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-segmented-button-selected-container-focus-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-ripple-color: var(--m3e-segmented-button-selected-ripple-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:not(:disabled)[checked]) .label {
      color: var(--m3e-segmented-button-selected-label-text-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:not(:disabled)[checked]) .icon {
      color: var(--m3e-segmented-button-selected-icon-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:not(:disabled):not([checked])) .base {
      --m3e-state-layer-hover-color: var(
        --m3e-segmented-button-unselected-container-hover-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-segmented-button-unselected-container-focus-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-ripple-color: var(--m3e-segmented-button-unselected-ripple-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:disabled):not([checked])) .label {
      color: var(--m3e-segmented-button-unselected-label-text-color, ${DesignToken.color.onSurface});
    }
    :host(:not(:disabled):not([checked])) .icon {
      color: var(--m3e-segmented-button-unselected-icon-color, ${DesignToken.color.onSurface});
    }
    :host(:not(.-with-icon)) .icon {
      margin-inline-start: calc(0px - var(--m3e-segmented-button-spacing, 0.5rem));
      transition: margin-inline-start ${DesignToken.motion.spring.fastEffects};
    }
    .check,
    ::slotted([slot="icon"]) {
      width: 1em;
      font-size: var(--m3e-segmented-button-icon-size, 1.125rem) !important;
    }
    :host(:not([checked])) .check,
    :host(.-hide-selection) .check,
    :host(.-hide-selection:not(.-with-icon)) .icon {
      display: none;
    }
    :host([checked]) .icon {
      margin-inline-start: 0;
    }
    :host([checked]:not(.-hide-selection)) ::slotted([slot="icon"]) {
      display: none !important;
    }
    :host(:disabled) .base {
      border-color: color-mix(
        in srgb,
        var(--m3e-segmented-button-disabled-outline-color, ${DesignToken.color.onSurface})
          var(--m3e-segmented-button-disabled-outline-opacity, 12%),
        transparent
      );
      border-right-color: var(
        --_segmented-button-disabled-outline-color,
        color-mix(
          in srgb,
          var(--m3e-segmented-button-disabled-outline-color, ${DesignToken.color.onSurface})
            var(--m3e-segmented-button-disabled-outline-opacity, 12%),
          transparent
        )
      );
    }
    :host(:disabled) .label {
      color: color-mix(
        in srgb,
        var(--m3e-segmented-button-disabled-label-text-color, ${DesignToken.color.onSurface})
          var(--m3e-segmented-button-disabled-label-text-opacity, 38%),
        transparent
      );
    }
    :host(:disabled) .icon {
      color: color-mix(
        in srgb,
        var(--m3e-segmented-button-disabled-icon-color, ${DesignToken.color.onSurface})
          var(--m3e-segmented-button-disabled-icon-opacity, 38%),
        transparent
      );
    }
    @media (prefers-reduced-motion) {
      .base,
      .icon,
      .label {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .base,
      .icon,
      .label {
        transition: none !important;
      }

      :host(:disabled) .label,
      :host(:disabled) .icon {
        color: GrayText;
      }
      :host(:not([selected]):not(:disabled)) .label,
      :host(:not([selected]):not(:disabled)) .icon {
        color: ButtonText;
      }
      :host(:not(:disabled)[checked]) .base {
        background-color: ButtonText;
      }
      :host(:not(:disabled)[checked]) .label,
      :host(:not(:disabled)[checked]) .icon {
        forced-color-adjust: none;
        color: ButtonFace;
      }
      :host {
        --m3e-segmented-button-outline-color: ButtonText;
      }
    }
  `;

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;
  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  /**
   * A string representing the value of the segment.
   * @default "on"
   */
  @property() value = "on";

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
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    const segmentedButton = this.closest("m3e-segmented-button");
    if (segmentedButton) {
      this.role = segmentedButton.multi ? "button" : "radio";
    }

    super.update(changedProperties);

    if (changedProperties.has("checked")) {
      segmentedButton?.[selectionManager].notifySelectionChange(this);
    }

    if (changedProperties.has("disabled")) {
      if (this.disabled) {
        if (this.nextElementSibling instanceof M3eButtonSegmentElement) {
          if (!this.nextElementSibling.disabled) {
            this.style.setProperty(
              "--_segmented-button-disabled-outline-color",
              `var(--m3e-segmented-button-outline-color, ${DesignToken.color.outline})`
            );
          } else {
            this.style.removeProperty("--_segmented-button-disabled-outline-color");
          }
        }
      } else {
        this.style.removeProperty("--_segmented-button-disabled-outline-color");
        if (this.previousElementSibling instanceof M3eButtonSegmentElement) {
          if (this.previousElementSibling.disabled) {
            this.previousElementSibling.style.setProperty(
              "--_segmented-button-disabled-outline-color",
              `var(--m3e-segmented-button-outline-color, ${DesignToken.color.outline})`
            );
          } else {
            this.previousElementSibling.style.removeProperty("--_segmented-button-disabled-outline-color");
          }
        }
      }
    }
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<div class="base">
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      <div class="wrapper">
        <div class="icon" aria-hidden="true">
          <svg class="check" viewBox="0 -960 960 960">
            <path fill="currentColor" d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
          <slot name="icon" @slotchange="${this.#handleIconSlotChange}"></slot>
        </div>
        <div class="label">
          <slot></slot>
        </div>
      </div>
    </div>`;
  }

  /** @private */
  #handleIconSlotChange(e: Event): void {
    this.classList.toggle("-with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented) return;

    const segmentedButton = this.closest("m3e-segmented-button");
    if (segmentedButton && (segmentedButton.multi || !this.checked)) {
      const checked = this.checked;
      this.checked = !this.checked;

      if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
        this.closest("m3e-segmented-button")?.[selectionManager].notifySelectionChange(this);
        this.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        this.checked = checked;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-button-segment": M3eButtonSegmentElement;
  }
}
