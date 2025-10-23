import { css, CSSResultGroup, html, PropertyValues } from "lit";
import { customElement } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Disabled,
  DisabledInteractive,
  Focusable,
  KeyboardClick,
  Role,
  Selected,
} from "@m3e/core";

import { selectionManager } from "@m3e/core/a11y";

import { M3eChipElement } from "./ChipElement";

/**
 * A chip users interact with to select/deselect options.
 *
 * @description
 * The `m3e-filter-chip` component presents a chip that users can select or deselect to filter
 * content or data sets. It supports single and multi-selection, keyboard interaction, accessibility,
 * and expressive state styling, providing a modern and interactive filtering experience in line
 * with Material 3 guidelines.  Appearance variants include `elevated` and `outlined`, enabling visual
 * differentiation and contextual emphasis.
 *
 * @tag m3e-filter-chip
 *
 * @slot - Renders the label of the chip.
 * @slot icon - Renders an icon before the chip's label.
 * @slot trailing-icon - Renders an icon after the chip's label.
 *
 * @attr disabled - A value indicating whether the element is disabled.
 * @attr disabled-interactive - A value indicating whether the element is disabled and interactive.
 * @attr selected - A value indicating whether the element is selected.
 * @attr value - A string representing the value of the chip.
 * @attr variant - The appearance variant of the chip.
 *
 * @fires input - Emitted when the selected state changes.
 * @fires change - Emitted when the selected state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-chip-container-shape - Border radius of the chip container.
 * @cssprop --m3e-chip-container-height - Base height of the chip container before density adjustment.
 * @cssprop --m3e-chip-label-text-font-size - Font size of the chip label text.
 * @cssprop --m3e-chip-label-text-font-weight - Font weight of the chip label text.
 * @cssprop --m3e-chip-label-text-line-height - Line height of the chip label text.
 * @cssprop --m3e-chip-label-text-tracking - Letter spacing of the chip label text.
 * @cssprop --m3e-chip-icon-size - Font size of leading/trailing icons.
 * @cssprop --m3e-chip-spacing - Horizontal gap between chip content elements.
 * @cssprop --m3e-chip-padding-start - Default start padding when no icon is present.
 * @cssprop --m3e-chip-padding-end - Default end padding when no trailing icon is present.
 * @cssprop --m3e-chip-with-icon-padding-start - Start padding when leading icon is present.
 * @cssprop --m3e-chip-with-icon-padding-end - End padding when trailing icon is present.
 * @cssprop --m3e-chip-disabled-label-text-color - Base color for disabled label text.
 * @cssprop --m3e-chip-disabled-label-text-opacity - Opacity applied to disabled label text.
 * @cssprop --m3e-chip-disabled-icon-color - Base color for disabled icons.
 * @cssprop --m3e-chip-disabled-icon-opacity - Opacity applied to disabled icons.
 * @cssprop --m3e-elevated-chip-container-color - Background color for elevated variant.
 * @cssprop --m3e-elevated-chip-elevation - Elevation level for elevated variant.
 * @cssprop --m3e-elevated-chip-hover-elevation - Elevation level on hover.
 * @cssprop --m3e-elevated-chip-disabled-container-color - Background color for disabled elevated variant.
 * @cssprop --m3e-elevated-chip-disabled-container-opacity - Opacity applied to disabled elevated background.
 * @cssprop --m3e-elevated-chip-disabled-elevation - Elevation level for disabled elevated variant.
 * @cssprop --m3e-outlined-chip-outline-thickness - Outline thickness for outlined variant.
 * @cssprop --m3e-outlined-chip-outline-color - Outline color for outlined variant.
 * @cssprop --m3e-outlined-chip-disabled-outline-color - Outline color for disabled outlined variant.
 * @cssprop --m3e-outlined-chip-disabled-outline-opacity - Opacity applied to disabled outline.
 * @cssprop --m3e-chip-selected-outline-thickness - Outline thickness for selected state.
 * @cssprop --m3e-chip-selected-label-text-color - Text color in selected state.
 * @cssprop --m3e-chip-selected-container-color - Background color in selected state.
 * @cssprop --m3e-chip-selected-container-hover-color - Hover state layer color in selected state.
 * @cssprop --m3e-chip-selected-container-focus-color - Focus state layer color in selected state.
 * @cssprop --m3e-chip-selected-hover-elevation - Elevation on hover in selected state.
 * @cssprop --m3e-chip-selected-ripple-color - Ripple color in selected state.
 * @cssprop --m3e-chip-selected-state-layer-focus-color - Focus state layer color in selected state.
 * @cssprop --m3e-chip-selected-state-layer-hover-color - Hover state layer color in selected state.
 * @cssprop --m3e-chip-selected-leading-icon-color - Leading icon color in selected state.
 * @cssprop --m3e-chip-selected-trailing-icon-color - Trailing icon color in selected state.
 * @cssprop --m3e-chip-unselected-label-text-color - Text color in unselected state.
 * @cssprop --m3e-chip-unselected-ripple-color - Ripple color in unselected state.
 * @cssprop --m3e-chip-unselected-state-layer-focus-color - Focus state layer color in unselected state.
 * @cssprop --m3e-chip-unselected-state-layer-hover-color - Hover state layer color in unselected state.
 * @cssprop --m3e-chip-unselected-leading-icon-color - Leading icon color in unselected state.
 * @cssprop --m3e-chip-unselected-trailing-icon-color - Trailing icon color in unselected state.
 */
@customElement("m3e-filter-chip")
export class M3eFilterChipElement extends Selected(
  KeyboardClick(Focusable(DisabledInteractive(Disabled(AttachInternals(Role(M3eChipElement, "option"), true)))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    M3eChipElement.styles,
    css`
      :host([selected]:not(.-hide-selection)) .wrapper {
        padding-inline-start: var(--m3e-chip-with-icon-padding-start, 0.5rem);
      }
      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .check {
        width: 1em;
        font-size: var(--m3e-chip-icon-size, 1.125rem);
      }
      :host(:not(:disabled):not([disabled-interactive])) .check {
        color: var(--m3e-chip-selected-leading-icon-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host(:not([selected])) .check,
      :host(.-hide-selection) .check,
      :host(.-hide-selection:not(.-with-icon)) .icon {
        display: none;
      }
      :host(:not(.-with-icon)) .icon {
        margin-inline-start: calc(0px - var(--m3e-chip-with-icon-padding-start, 0.5rem));
        transition: margin-inline-start ${DesignToken.motion.spring.fastEffects};
      }
      :host([selected]) .icon {
        margin-inline-start: 0;
      }
      :host([selected]:not(.-hide-selection)) ::slotted([slot="icon"]) {
        display: none !important;
      }
      :host(:not(:disabled):not([disabled-interactive]):not([selected])) .base {
        color: var(--m3e-chip-unselected-label-text-color, ${DesignToken.color.onSurfaceVariant});
        --m3e-ripple-color: var(--m3e-chip-unselected-ripple-color, ${DesignToken.color.onSurfaceVariant});
        --m3e-state-layer-focus-color: var(
          --m3e-chip-unselected-state-layer-focus-color,
          ${DesignToken.color.onSurfaceVariant}
        );
        --m3e-state-layer-hover-color: var(
          --m3e-chip-unselected-state-layer-hover-color,
          ${DesignToken.color.onSurfaceVariant}
        );
      }
      :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="icon"]) {
        color: var(--m3e-chip-unselected-leading-icon-color, ${DesignToken.color.primary});
      }
      :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="trailing-icon"]) {
        color: var(--m3e-chip-unselected-trailing-icon-color, ${DesignToken.color.onSurfaceVariant});
      }
      :host(:not(:disabled):not([disabled-interactive])[selected]) .base {
        outline-offset: unset;
        outline-width: var(--m3e-chip-selected-outline-thickness, 0);
        color: var(--m3e-chip-selected-label-text-color, ${DesignToken.color.onSecondaryContainer});
        background-color: var(--m3e-chip-selected-container-color, ${DesignToken.color.secondaryContainer});
        --m3e-state-layer-hover-color: var(
          --m3e-chip-selected-container-hover-color,
          ${DesignToken.color.onSecondaryContainer}
        );
        --m3e-state-layer-focus-color: var(
          --m3e-chip-selected-container-focus-color,
          ${DesignToken.color.onSecondaryContainer}
        );
        --m3e-elevation-hover-level: var(--m3e-chip-selected-hover-elevation, ${DesignToken.elevation.level1});
        --m3e-ripple-color: var(--m3e-chip-selected-ripple-color, ${DesignToken.color.onSecondaryContainer});
        --m3e-state-layer-focus-color: var(
          --m3e-chip-selected-state-layer-focus-color,
          ${DesignToken.color.onSecondaryContainer}
        );
        --m3e-state-layer-hover-color: var(
          --m3e-chip-selected-state-layer-hover-color,
          ${DesignToken.color.onSecondaryContainer}
        );
      }
      :host(:not(:disabled):not([disabled-interactive])[selected]) ::slotted([slot="icon"]) {
        color: var(--m3e-chip-selected-leading-icon-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="trailing-icon"]) {
        color: var(--m3e-chip-selected-trailing-icon-color, ${DesignToken.color.onSecondaryContainer});
      }
      @media (prefers-reduced-motion) {
        .base,
        :host(:not(.-with-icon)) .icon {
          transition: none;
        }
      }
      @media (forced-colors: active) {
        :host(:not(:disabled):not([disabled-interactive]):not([selected])) .base,
        :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="icon"]),
        :host(:not(:disabled):not([disabled-interactive]):not([selected])) ::slotted([slot="trailing-icon"]) {
          color: CanvasText;
        }
        :host(:not(:disabled):not([disabled-interactive])[selected]) .base,
        :host(:not(:disabled):not([disabled-interactive])[selected]) ::slotted([slot="icon"]),
        :host(:not(:disabled):not([disabled-interactive])[selected]) ::slotted([slot="trailing-icon"]),
        :host(:not(:disabled):not([disabled-interactive])) .check {
          color: ButtonText;
        }
        :host(:not(:disabled):not([disabled-interactive])[selected]) .base {
          outline-offset: calc(0px - var(--m3e-outlined-chip-outline-thickness, 1px));
          outline-width: var(--m3e-outlined-chip-outline-thickness, 1px);
          outline-color: ButtonText;
        }
      }
    `,
  ];

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

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
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selected")) {
      this.closest("m3e-filter-chip-set")?.[selectionManager].notifySelectionChange(this);
    }
  }

  /** @inheritdoc @private */
  protected override _renderIcon(): unknown {
    return html`<div class="icon" aria-hidden="true">
      <svg class="check" viewBox="0 -960 960 960" aria-hidden="true">
        <path fill="currentColor" d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </svg>
      ${super._renderIcon()}
    </div>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.defaultPrevented) return;

    const selected = this.selected;
    this.selected = !this.selected;
    if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      this.closest("m3e-filter-chip-set")?.[selectionManager].notifySelectionChange(this);
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      this.selected = selected;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-filter-chip": M3eFilterChipElement;
  }
}
