import { CSSResultGroup, css, PropertyValues, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  KeyboardClick,
  Focusable,
  Disabled,
  AttachInternals,
  Role,
  Selected,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  DesignToken,
  getTextContent,
} from "@m3e/core";

import { selectionManager } from "@m3e/core/a11y";

import { M3eListItemElement } from "./ListItemElement";

/**
 * A selectable option in a list.
 *
 * @description
 * The `m3e-list-option` component represents a selectable item within a list container. It extends
 * the base `m3e-list-item` functionality with selection state management, providing visual feedback
 * for selected and unselected states. The component is designed for use with `m3e-selection-list`
 * and supports rich content through multiple slots, comprehensive styling via CSS custom properties,
 * and accessible interactions following Material 3 design principles.
 *
 * @tag m3e-list-option
 *
 * @slot - Renders the content of the list item.
 * @slot leading - Renders the leading content of the list item.
 * @slot overline - Renders the overline of the list item.
 * @slot supporting-text - Renders the supporting text of the list item.
 * @slot trailing - Renders the trailing content of the list item.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr selected - Whether the element is selected.
 *
 * @fires input - Emitted when the selected state changes.
 * @fires change - Emitted when the selected state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-list-item-between-space - Horizontal gap between elements.
 * @cssprop --m3e-list-item-padding-inline - Horizontal padding for the list item.
 * @cssprop --m3e-list-item-padding-block - Vertical padding for the list item.
 * @cssprop --m3e-list-item-height - Minimum height of the list item.
 * @cssprop --m3e-list-item-font-size - Font size for main content.
 * @cssprop --m3e-list-item-font-weight - Font weight for main content.
 * @cssprop --m3e-list-item-line-height - Line height for main content.
 * @cssprop --m3e-list-item-tracking - Letter spacing for main content.
 * @cssprop --m3e-list-item-overline-font-size - Font size for overline slot.
 * @cssprop --m3e-list-item-overline-font-weight - Font weight for overline slot.
 * @cssprop --m3e-list-item-overline-line-height - Line height for overline slot.
 * @cssprop --m3e-list-item-overline-tracking - Letter spacing for overline slot.
 * @cssprop --m3e-list-item-supporting-text-font-size - Font size for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-font-weight - Font weight for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-line-height - Line height for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-tracking - Letter spacing for supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-font-size - Font size for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-font-weight - Font weight for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-line-height - Line height for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-tracking - Letter spacing for trailing supporting text slot.
 * @cssprop --m3e-list-item-icon-size - Size for leading/trailing icons.
 * @cssprop --m3e-list-item-label-text-color - Color for the main content.
 * @cssprop --m3e-list-item-overline-color - Color for the overline slot.
 * @cssprop --m3e-list-item-supporting-text-color - Color for the supporting text slot.
 * @cssprop --m3e-list-item-leading-color - Color for the leading content.
 * @cssprop --m3e-list-item-trailing-color - Color for the trailing content.
 * @cssprop --m3e-list-item-container-color - Background color of the list item.
 * @cssprop --m3e-list-item-container-shape - Border radius of the list item.
 * @cssprop --m3e-list-item-hover-container-shape - Border radius of the list item on hover.
 * @cssprop --m3e-list-item-focus-container-shape - Border radius of the list item on focus.
 * @cssprop --m3e-list-item-video-width - Width of the video slot.
 * @cssprop --m3e-list-item-video-height - Height of the video slot.
 * @cssprop --m3e-list-item-video-shape - Border radius of the video slot.
 * @cssprop --m3e-list-item-image-width - Width of the image slot.
 * @cssprop --m3e-list-item-image-height - Height of the image slot.
 * @cssprop --m3e-list-item-image-shape - Border radius of the image slot.
 * @cssprop --m3e-list-item-disabled-container-color - Background color of the list item when disabled.
 * @cssprop --m3e-list-item-disabled-label-text-color - Color for the main content when disabled.
 * @cssprop --m3e-list-item-disabled-label-text-opacity - Opacity for the main content when disabled.
 * @cssprop --m3e-list-item-disabled-overline-color - Color for the overline slot when disabled.
 * @cssprop --m3e-list-item-disabled-overline-opacity - Opacity for the overline slot when disabled.
 * @cssprop --m3e-list-item-disabled-supporting-text-color - Color for the supporting text slot when disabled.
 * @cssprop --m3e-list-item-disabled-supporting-text-opacity - Opacity for the supporting text slot when disabled.
 * @cssprop --m3e-list-item-disabled-leading-color - Color for the leading icon when disabled.
 * @cssprop --m3e-list-item-disabled-leading-opacity - Opacity for the leading icon when disabled.
 * @cssprop --m3e-list-item-disabled-trailing-color - Color for the trailing icon when disabled.
 * @cssprop --m3e-list-item-disabled-trailing-opacity - Opacity for the trailing icon when disabled.
 * @cssprop --m3e-list-item-hover-state-layer-color - Color for the hover state layer.
 * @cssprop --m3e-list-item-hover-state-layer-opacity - Opacity for the hover state layer.
 * @cssprop --m3e-list-item-focus-state-layer-color - Color for the focus state layer.
 * @cssprop --m3e-list-item-focus-state-layer-opacity - Opacity for the focus state layer.
 * @cssprop --m3e-list-item-pressed-state-layer-color - Color for the pressed state layer.
 * @cssprop --m3e-list-item-pressed-state-layer-opacity - Opacity for the pressed state layer.
 * @cssprop --m3e-list-item-selected-label-text-color - Selected color for the main content.
 * @cssprop --m3e-list-item-selected-overline-color - Selected color for the overline slot.
 * @cssprop --m3e-list-item-selected-supporting-text-color - Selected color for the supporting text slot.
 * @cssprop --m3e-list-item-selected-leading-color - Selected color for the leading content.
 * @cssprop --m3e-list-item-selected-trailing-color - Selected color for the trailing content.
 * @cssprop --m3e-list-item-selected-container-color - Selected background color of the list item.
 * @cssprop --m3e-list-item-selected-container-shape - Selected border radius of the list item.
 * @cssprop --m3e-list-item-selected-disabled-container-color - Selected background color when disabled.
 * @cssprop --m3e-list-item-selected-disabled-container-opacity - Selected opacity when disabled.
 * @cssprop --m3e-list-item-selected-hover-state-layer-color - Color for the hover state layer when selected.
 * @cssprop --m3e-list-item-selected-hover-state-layer-opacity - Opacity for the hover state layer when selected.
 * @cssprop --m3e-list-item-selected-focus-state-layer-color - Color for the focus state layer when selected.
 * @cssprop --m3e-list-item-selected-focus-state-layer-opacity - Opacity for the focus state layer when selected.
 * @cssprop --m3e-list-item-selected-pressed-state-layer-color - Color for the pressed state layer when selected.
 * @cssprop --m3e-list-item-selected-pressed-state-layer-opacity - Opacity for the pressed state layer when selected.
 * @cssprop --m3e-list-item-three-line-top-offset - Top offset for media in three line items.
 * @cssprop --m3e-list-item-disabled-media-opacity - Opacity for media when disabled.
 */
@customElement("m3e-list-option")
export class M3eListOptionElement extends KeyboardClick(
  Focusable(Selected(Disabled(AttachInternals(Role(M3eListItemElement, "option"), true)))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    M3eListItemElement.styles,
    css`
      :host {
        outline: none;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      .base {
        position: relative;
      }
      .indicator {
        min-width: 1.5rem;
        min-height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      :host(:not(:disabled)) {
        cursor: pointer;
      }
      :host(.-three-line) .indicator {
        align-self: flex-start;
        margin-top: var(--m3e-list-item-three-line-top-offset, 0.25rem);
      }
      :host([selected]) .base,
      :host([selected]) .state-layer,
      :host([selected]) .ripple,
      :host([selected]) .focus-ring {
        border-radius: var(--m3e-list-item-selected-container-shape, ${DesignToken.shape.corner.large});
      }
      :host([selected]:not(:disabled)) .base {
        color: var(--m3e-list-item-selected-label-text-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host([selected]:not(:disabled)) ::slotted([slot="overline"]) {
        color: var(--m3e-list-item-selected-overline-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host([selected]:not(:disabled)) ::slotted([slot="supporting-text"]) {
        color: var(--m3e-list-item-selected-supporting-text-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host([selected]:not(:disabled)) ::slotted([slot="leading"]) {
        color: var(--m3e-list-item-selected-leading-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host([selected]:not(:disabled)) ::slotted([slot="trailing"]) {
        color: var(--m3e-list-item-selected-trailing-color, ${DesignToken.color.onSecondaryContainer});
      }
      :host([selected]:not(:disabled)) .base {
        background-color: var(--m3e-list-item-selected-container-color, ${DesignToken.color.secondaryContainer});
      }
      :host([selected]:disabled) .base {
        background-color: color-mix(
          in srgb,
          var(--m3e-list-item-selected-disabled-container-color, ${DesignToken.color.onSurface})
            var(--m3e-list-item-selected-disabled-container-opacity, 10%),
          transparent
        );
      }
      :host([selected]:not(:disabled)) .state-layer {
        --m3e-state-layer-hover-color: var(
          --m3e-list-item-selected-hover-state-layer-color,
          ${DesignToken.color.onSurface}
        );
        --m3e-state-layer-hover-opacity: var(
          --m3e-list-item-selected-hover-state-layer-opacity,
          ${DesignToken.state.hoverStateLayerOpacity}
        );
        --m3e-state-layer-focus-color: var(
          --m3e-list-item-selected-focus-state-layer-color,
          ${DesignToken.color.onSurface}
        );
        --m3e-state-layer-focus-opacity: var(
          --m3e-list-item-selected-focus-state-layer-opacity,
          ${DesignToken.state.focusStateLayerOpacity}
        );
      }
      :host([selected]:not(:disabled)) .ripple {
        --m3e-ripple-color: var(--m3e-list-item-selected-pressed-state-layer-color, ${DesignToken.color.onSurface});
        --m3e-ripple-opacity: var(
          --m3e-list-item-selected-pressed-state-layer-opacity,
          ${DesignToken.state.pressedStateLayerOpacity}
        );
      }
      :host(.-hide-selection) .indicator,
      :host(:not(.-hide-selection)) ::slotted([slot="trailing"]) {
        display: none;
      }
      @media (forced-colors: active) {
        :host([selected]:not(:disabled)) .content,
        :host([selected]:not(:disabled)) ::slotted([slot="overline"]),
        :host([selected]:not(:disabled)) ::slotted([slot="supporting-text"]),
        :host([selected]:not(:disabled)) ::slotted([slot="leading"]),
        :host([selected]:not(:disabled)) ::slotted([slot="trailing"]) {
          color: HighlightText;
          forced-color-adjust: none;
        }
        :host([selected]:not(:disabled)) .base {
          background-color: Highlight;
        }
      }
    `,
  ];

  /** @private */ #value?: string;
  /** @private */ #textContent = "";

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  /** A string representing the value of the option. */
  @property() get value() {
    return this.#value ?? this.#textContent;
  }
  set value(value: string) {
    this.#value = value;
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
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selected")) {
      this.closest("m3e-selection-list")?.[selectionManager].notifySelectionChange(this);

      for (const icon of this.querySelectorAll("m3e-icon")) {
        icon.toggleAttribute("filled", this.selected);
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"> </m3e-state-layer>
      <m3e-focus-ring class="focus-ring" inward ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      <slot name="leading" @slotchange="${this._handleLeadingSlotChange}"></slot>
      <div class="content">
        <slot name="overline"></slot>
        <slot @slotchange="${this.#handleSlotChange}"></slot>
        <slot name="supporting-text"></slot>
      </div>
      <slot name="trailing" @slotchange="${this._handleTrailingSlotChange}"></slot>
      <div class="indicator">
        ${this.closest("m3e-selection-list")?.multi
          ? html`<m3e-pseudo-checkbox ?checked="${this.selected}" ?disabled="${this.disabled}"></m3e-pseudo-checkbox>`
          : html`<m3e-pseudo-radio ?checked="${this.selected}" ?disabled="${this.disabled}"></m3e-pseudo-radio>`}
      </div>
    </div>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#textContent = getTextContent(<HTMLSlotElement>e.target);
  }

  /** @private */
  #handleClick(e: Event): void {
    const selectionList = this.closest("m3e-selection-list");
    if (e.defaultPrevented || !selectionList) return;

    if (selectionList.multi || !this.selected) {
      const selected = this.selected;
      this.selected = !this.selected;
      if (this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
        selectionList[selectionManager].notifySelectionChange(this);
        this.dispatchEvent(new Event("change", { bubbles: true }));
      } else {
        this.selected = selected;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list-option": M3eListOptionElement;
  }
}
