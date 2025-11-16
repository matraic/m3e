import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  DesignToken,
  Disabled,
  getTextContent,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  Role,
  Selected,
} from "@m3e/core";

import { typeaheadLabel } from "@m3e/core/a11y";

/**
 * An option that can be selected.
 *
 * @description
 * The `m3e-option` component represents an individual selectable item within an option list,
 * adhering to Material Design 3 specifications. It provides visual feedback through state layers and ripple effects,
 * supports single and multiple selection modes, and includes comprehensive accessibility features including
 * keyboard navigation and focus management. The component automatically manages its visual appearance based on
 * selection and disabled states, with configurable styling for interactive and non-interactive variants.
 *
 * @tag m3e-option
 *
 * @slot - Renders the label of the option.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr selected - Whether the element is selected.
 * @attr value - A string representing the value of the option.
 *
 * @cssprop --m3e-option-container-height - The height of the option container.
 * @cssprop --m3e-option-color - The text color of the option.
 * @cssprop --m3e-option-container-hover-color - The color for the hover state layer.
 * @cssprop --m3e-option-container-focus-color - The color for the focus state layer.
 * @cssprop --m3e-option-ripple-color - The color of the ripple effect.
 * @cssprop --m3e-option-selected-color - The text color when the option is selected.
 * @cssprop --m3e-option-selected-container-color - The background color when the option is selected.
 * @cssprop --m3e-option-selected-container-hover-color - The hover color for the selected state layer.
 * @cssprop --m3e-option-selected-container-focus-color - The focus color for the selected state layer.
 * @cssprop --m3e-option-selected-ripple-color - The ripple color when the option is selected.
 * @cssprop --m3e-option-disabled-color - The text color when the option is disabled.
 * @cssprop --m3e-option-disabled-opacity - The opacity level applied to the disabled text color.
 * @cssprop --m3e-option-icon-label-space - The spacing between the icon and label.
 * @cssprop --m3e-option-padding-start - The left padding of the option content.
 * @cssprop --m3e-option-padding-end - The right padding of the option content.
 * @cssprop --m3e-option-label-text-font-size - The font size of the option label.
 * @cssprop --m3e-option-label-text-font-weight - The font weight of the option label.
 * @cssprop --m3e-option-label-text-line-height - The line height of the option label.
 * @cssprop --m3e-option-label-text-tracking - The letter spacing of the option label.
 * @cssprop --m3e-option-focus-ring-shape - The corner radius of the focus ring.
 * @cssprop --m3e-option-icon-size - The size of the option icons.
 */
@customElement("m3e-option")
export class M3eOptionElement extends Selected(Disabled(Role(LitElement, "option"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      outline: none;
      user-select: none;
      flex: none;
      height: var(--m3e-option-container-height, 3rem);
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    :host(:not([aria-disabled="false"])) .base {
      color: var(--m3e-option-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-hover-color: var(--m3e-option-container-hover-color, ${DesignToken.color.onSurface});
      --m3e-state-layer-focus-color: var(--m3e-option-container-focus-color, ${DesignToken.color.onSurface});
      --m3e-ripple-color: var(--m3e-option-ripple-color, ${DesignToken.color.onSurface});
    }
    :host(:not([aria-disabled="false"]):not(.-empty)[selected]) .base {
      color: var(--m3e-option-selected-color, ${DesignToken.color.onSecondaryContainer});
      background-color: var(--m3e-option-selected-container-color, ${DesignToken.color.secondaryContainer});
      --m3e-state-layer-hover-color: var(
        --m3e-option-selected-container-hover-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-state-layer-focus-color: var(
        --m3e-option-selected-container-focus-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-ripple-color: var(--m3e-option-selected-ripple-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:not([aria-disabled="false"])) {
      cursor: pointer;
    }
    :host([aria-disabled="false"]) .base {
      color: color-mix(
        in srgb,
        var(--m3e-option-disabled-color, ${DesignToken.color.onSurface}) var(--m3e-option-disabled-opacity, 38%),
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
      width: 100%;
      column-gap: var(--m3e-option-icon-label-space, 0.75rem);
      padding-inline-start: var(--m3e-option-padding-start, 0.75rem);
      padding-inline-end: var(--m3e-option-padding-end, 0.75rem);
      font-size: var(--m3e-option-label-text-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-option-label-text-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-option-label-text-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-option-label-text-tracking, ${DesignToken.typescale.standard.label.large.tracking});
    }
    .focus-ring {
      border-radius: var(--m3e-option-focus-ring-shape, ${DesignToken.shape.corner.medium});
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
      font-size: var(--m3e-option-icon-size, 1.5rem) !important;
    }
    :host(.-empty) .leading-icon,
    :host(.-empty) .trailing-icon,
    :host(:not(.-multi):not([selected])) .trailing-icon,
    :host(.-multi) .trailing-icon,
    :host(:not(.-multi)) .leading-icon,
    :host(.-hide-selection-indicator) .leading-icon,
    :host(.-hide-selection-indicator) .trailing-icon {
      display: none;
    }
    @media (forced-colors: active) {
      .base {
        background-color: Menu;
        color: MenuText;
      }
      :host([aria-disabled="false"]) .base {
        color: GrayText;
      }
    }
  `;

  /** @private */ #value?: string;
  /** @private */ #textContent = "";

  /** @internal */ @query(".focus-ring") readonly focusRing?: M3eFocusRingElement;
  /** @internal */ @query(".state-layer") readonly stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** A string representing the value of the option. */
  @property() get value() {
    return this.#value ?? this.#textContent;
  }
  set value(value: string) {
    this.#value = value;
  }

  /** @internal */
  [typeaheadLabel](): string {
    return this.#textContent;
  }

  /** Whether the option represents an empty option. */
  get isEmpty() {
    return this.value === "";
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    [this.focusRing, this.stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this.focusRing, this.stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selected") && this.selected && !this.classList.contains("-multi")) {
      (this.closest("[role='listbox']") ?? this.closest("m3e-select"))?.querySelectorAll("m3e-option").forEach((x) => {
        if (x !== this && x.selected) {
          x.selected = false;
        }
      });
    }
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<div class="base">
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" inward ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      <div class="touch" aria-hidden="true"></div>
      <div class="wrapper">
        <m3e-pseudo-checkbox class="leading-icon" ?checked="${this.selected}" ?disabled="${this.disabled}">
        </m3e-pseudo-checkbox>
        <m3e-text-overflow class="label"><slot @slotchange="${this.#handleSlotChange}"></slot></m3e-text-overflow>
        <div class="trailing-icon">
          <svg class="check" viewBox="0 -960 960 960" aria-hidden="true">
            <path fill="currentColor" d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </div>
      </div>
    </div>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#textContent = getTextContent(<HTMLSlotElement>e.target);
    this.classList.toggle("-empty", this.isEmpty);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-option": M3eOptionElement;
  }
}
