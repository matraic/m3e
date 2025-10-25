/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, nothing, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  DisabledInteractive,
  Disabled,
  EventAttribute,
  Role,
  AttachInternals,
  DesignToken,
  hasAssignedNodes,
} from "@m3e/core";

import { M3eIconButtonElement } from "@m3e/icon-button";

import { M3eChipElement } from "./ChipElement";

/**
 * A chip which represents a discrete piece of information entered by a user.
 *
 * @description
 * The `m3e-input-chip` component represents an input chip, allowing users to enter, display,
 * and manage discrete values such as tags or keywords. It supports expressive styling, accessibility,
 * keyboard interaction, and appearance variants including `elevated` and `outlined`.
 *
 * @example
 * The following example illustrates the use of the `m3e-input-chip-set` inside a `m3e-form-field`.
 * In this example, the `input` slot specifies the `input` element used to add input chips and the
 * field label's `for` attribute targets the `input` element to provide an accessible label.
 * ```html
 * <m3e-form-field>
 *  <label slot="label" for="keywords">Keywords</label>
 *  <m3e-input-chip-set aria-label="Enter keywords">
 *    <input id="keywords" slot="input" placeholder="New keyword..." />
 *  </m3e-input-chip-set>
 * </m3e-form-field>
 * ```
 *
 * @tag m3e-input-chip
 *
 * @slot - Renders the label of the chip.
 * @slot avatar - Renders an avatar before the chip's label.
 * @slot icon - Renders an icon before the chip's label.
 * @slot remove-icon - Renders the icon for the button used to remove the chip.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr disabled-interactive - Whether the element is disabled and interactive.
 * @attr removable - Whether the chip is removable.
 * @attr remove-label - The accessible label given to the button used to remove the chip.
 * @attr value - A string representing the value of the chip.
 * @attr variant - The appearance variant of the chip.
 *
 * @fires remove - Emitted when the remove button is clicked or DELETE or BACKSPACE key is pressed.
 * @fires click - Emitted when the element is clicked.
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
 * @cssprop --m3e-chip-avatar-size - Font size of the avatar slot content.
 * @cssprop --m3e-chip-disabled-avatar-opacity - Opacity applied to the avatar when disabled.
 * @cssprop --m3e-chip-with-avatar-padding-start - Start padding when an avatar is present.
 */
@customElement("m3e-input-chip")
export class M3eInputChipElement extends EventAttribute(
  DisabledInteractive(Disabled(AttachInternals(Role(M3eChipElement, "row"), true))),
  "remove"
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    M3eChipElement.styles,
    css`
      .cell {
        display: inline-flex;
        align-items: center;
        outline: none;
        column-gap: var(--m3e-chip-spacing, 0.5rem);
        min-width: 0;
      }
      .remove-button {
        --m3e-icon-button-extra-small-container-height: 1.5rem;
        --m3e-icon-button-extra-small-icon-size: var(--m3e-chip-icon-size, 1.125rem);
        width: 1.5rem;
      }
      .remove-icon {
        flex: none;
        width: var(--m3e-chip-icon-size, 1.125rem);
        height: var(--m3e-chip-icon-size, 1.125rem);
      }
      .touch {
        top: calc(
          0px - calc(calc(3rem - calc(var(--m3e-chip-container-height, 2rem) + ${DesignToken.density.calc(-2)})) / 2)
        );
      }
      .wrapper {
        height: 100%;
        overflow: visible;
        min-width: 0;
      }
      ::slotted([slot="avatar"]) {
        flex: none;
        font-size: var(--m3e-chip-avatar-size, 1.5rem);
      }
      :host(:disabled) ::slotted([slot="avatar"]),
      :host([disabled-interactive]) ::slotted([slot="avatar"]) {
        opacity: var(--m3e-chip-disabled-avatar-opacity, 38%);
        color: var(--m3e-chip-disabled-icon-color, ${DesignToken.color.onSurface});
      }
      :host(.-with-avatar) ::slotted([slot="icon"]) {
        display: none;
      }
      :host(.-with-avatar) .wrapper {
        padding-inline-start: var(--m3e-chip-with-avatar-padding-start, 0.25rem);
      }
      @media (forced-colors: active) {
        :host(:disabled) ::slotted([slot="avatar"]),
        :host([disabled-interactive]) ::slotted([slot="avatar"]) {
          color: CanvasText;
        }
      }
    `,
  ];

  /** A reference to the grid cell of the chip. */
  @query(".cell") readonly cell!: HTMLSpanElement;

  /** A reference to the button used to remove the chip. */
  @query(".remove-button") readonly removeButton!: M3eIconButtonElement | null;

  /**
   * Whether the chip is removable.
   * @default false
   */
  @property({ type: Boolean }) removable = false;

  /**
   * The accessible label given to the button used to remove the chip.
   * @default "Remove"
   */
  @property({ attribute: "remove-label" }) removeLabel = "Remove";

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.removeAttribute("tabindex");
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);
    this.removeAttribute("tabindex");

    if (changedProperties.has("removable")) {
      this.classList.toggle("-with-trailing-icon", this.removable);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <m3e-elevation
        class="elevation"
        for="cell"
        ?disabled="${this.disabled || this.disabledInteractive}"
      ></m3e-elevation>
      <m3e-state-layer
        class="state-layer"
        for="cell"
        ?disabled="${this.disabled || this.disabledInteractive}"
      ></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" for="cell" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" for="cell" ?disabled="${this.disabled || this.disabledInteractive}"></m3e-ripple>
      <div class="wrapper">
        <div
          id="cell"
          class="cell"
          role="gridcell"
          tabindex="${ifDefined(this.disabled ? undefined : "-1")}"
          @keydown="${this.#handleKeyDown}"
        >
          <slot name="avatar" @slotchange="${this.#handleAvatarSlotChange}"></slot>
          ${this._renderIcon()}
          <div class="label">${this._renderSlot()}</div>
          <div class="touch" aria-hidden="true"></div>
        </div>
        ${this._renderTrailingIcon()}
      </div>
    </div>`;
  }

  /** @internal @inheritdoc */
  protected override _renderTrailingIcon(): unknown {
    return this.removable
      ? html`<span role="gridcell" class="remove">
          <m3e-icon-button
            class="remove-button"
            aria-label="${this.removeLabel}"
            size="extra-small"
            tabindex="-1"
            ?disabled="${this.disabled}"
            ?disabled-interactive="${this.disabledInteractive}"
            @click="${this.#handleRemoveButtonClick}"
          >
            <slot name="remove-icon">
              <svg class="remove-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path
                  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
              </svg>
            </slot>
          </m3e-icon-button>
        </span>`
      : nothing;
  }

  /** @private */
  #handleAvatarSlotChange(e: Event): void {
    this.classList.toggle("-with-avatar", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleRemoveButtonClick(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event("remove"));
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (this.removable) {
      switch (e.key) {
        case "Backspace":
        case "Delete":
          this.dispatchEvent(new Event("remove"));
          break;
      }
    }
  }
}

interface M3eInputChipElementEventMap extends HTMLElementEventMap {
  remove: Event;
}

export interface M3eInputChipElement {
  addEventListener<K extends keyof M3eInputChipElementEventMap>(
    type: K,
    listener: (this: M3eInputChipElement, ev: M3eInputChipElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eInputChipElementEventMap>(
    type: K,
    listener: (this: M3eInputChipElement, ev: M3eInputChipElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-input-chip": M3eInputChipElement;
  }
}
