import { CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import {
  AttachInternals,
  Disabled,
  Focusable,
  KeyboardClick,
  M3eFocusRingElement,
  M3eStateLayerElement,
  Role,
} from "@m3e/web/core";

import { ExpansionTogglePosition } from "./ExpansionTogglePosition";
import { ExpansionToggleDirection } from "./ExpansionToggleDirection";

import { ExpansionHeaderStyle } from "./styles";

/**
 * A button used to toggle the expanded state of an expansion panel.
 *
 * @tag m3e-expansion-header
 *
 * @slot - Renders the content of the header.
 * @slot toggle-icon - Renders the icon of the expansion toggle.
 *
 * @attr hide-toggle - Whether to hide the expansion toggle.
 * @attr toggle-direction - The direction of the expansion toggle.
 * @attr toggle-position - The position of the expansion toggle.
 *
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-expansion-header-collapsed-height - Height of the header when the panel is collapsed.
 * @cssprop --m3e-expansion-header-expanded-height - Height of the header when the panel is expanded.
 * @cssprop --m3e-expansion-header-padding-left - Left padding inside the header.
 * @cssprop --m3e-expansion-header-padding-right - Right padding inside the header.
 * @cssprop --m3e-expansion-header-spacing - Spacing between header elements.
 * @cssprop --m3e-expansion-header-toggle-icon-size - Size of the toggle icon (e.g. chevron).
 * @cssprop --m3e-expansion-header-font-size - The font size of the header text.
 * @cssprop --m3e-expansion-header-font-weight - The font weight of the header text.
 * @cssprop --m3e-expansion-header-line-height - The line height of the header text.
 * @cssprop --m3e-expansion-header-tracking - Letter spacing (tracking) of the header text.
 */
@customElement("m3e-expansion-header")
export class M3eExpansionHeaderElement extends KeyboardClick(
  Focusable(Disabled(AttachInternals(Role(LitElement, "button"), true))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = ExpansionHeaderStyle;

  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;

  /**
   * The direction of the expansion toggle.
   * @default "vertical"
   */
  @property({ attribute: "toggle-direction", reflect: true }) toggleDirection: ExpansionToggleDirection = "vertical";

  /**
   * The position of the expansion toggle.
   * @default "after"
   */
  @property({ attribute: "toggle-position", reflect: true }) togglePosition: ExpansionTogglePosition = "after";

  /**
   * Whether to hide the expansion toggle.
   * @default false
   */
  @property({ attribute: "hide-toggle", type: Boolean, reflect: true }) hideToggle = false;

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      ${this.togglePosition === "before" ? this.#renderToggle() : nothing}
      <div class="content">
        <slot></slot>
      </div>
      ${this.togglePosition === "after" ? this.#renderToggle() : nothing}
    </div>`;
  }

  /** @private */
  #renderToggle(): unknown {
    return html`<div class="toggle" aria-hidden="true">
      <slot name="toggle-icon"></slot>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-expansion-header": M3eExpansionHeaderElement;
  }
}
