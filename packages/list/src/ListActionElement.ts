import { css, CSSResultGroup, html } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { LinkButton } from "@m3e/core";
import { selectionManager } from "@m3e/core/a11y";

import { M3eListItemElement } from "./ListItemElement";
import { M3eListItemButtonElement } from "./ListItemButtonElement";

/**
 * An item in a list that performs an action.
 *
 * @description
 * The `m3e-list-action` component represents an interactive list item that performs a
 * user-initiated action. It combines the semantic structure of a list item with
 * button-like interactions, supporting keyboard navigation, ripple effects, and state layers.
 *
 * @tag m3e-list-action
 *
 * @slot - Renders the content of the list item.
 * @slot leading - Renders the leading content of the list item.
 * @slot overline - Renders the overline of the list item.
 * @slot supporting-text - Renders the supporting text of the list item.
 * @slot trailing - Renders the trailing content of the list item.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr download - A value indicating whether the `target` of the link button will be downloaded, optionally specifying the new name of the file.
 * @attr href - The URL to which the link button points.
 * @attr rel - The relationship between the `target` of the link button and the document.
 * @attr target - The target of the link button.
 *
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
 * @cssprop --m3e-list-item-three-line-top-offset - Top offset for media in three line items.
 * @cssprop --m3e-list-item-disabled-media-opacity - Opacity for media when disabled.
 */
@customElement("m3e-list-action")
export class M3eListActionElement extends LinkButton(M3eListItemElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .button {
      width: 100%;
    }
  `;

  /** @internal */
  @query(".button") readonly button!: M3eListItemButtonElement;

  /**
   * Whether the element is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-list-item-button
      class="button"
      ?disabled="${this.disabled}"
      href="${ifDefined(this.href || undefined)}"
      target="${ifDefined(this.target || undefined)}"
      download="${ifDefined(this.download || undefined)}"
      rel="${ifDefined(this.rel || undefined)}"
      @click="${this.#handleClick}"
    >
      <slot name="leading" slot="leading" @slotchange="${this._handleLeadingSlotChange}"></slot>
      <slot name="overline" slot="overline"></slot>
      <slot></slot>
      <slot name="supporting-text" slot="supporting-text"></slot>
      <slot name="trailing" slot="trailing" @slotchange="${this._handleTrailingSlotChange}"></slot>
    </m3e-list-item-button>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented) {
      this.closest("m3e-action-list")?.[selectionManager].updateActiveItem(this.button);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list-action": M3eListActionElement;
  }
}
