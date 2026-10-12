import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { AttachInternals, customElement, hasAssignedNodes, setCustomEnumState, setCustomState } from "@m3e/web/core";

import { CalloutShape, isCalloutShape } from "./CalloutShape";
import { CalloutVariant, isCalloutVariant } from "./CalloutVariant";

import { CalloutStyle, CalloutVariantStyle } from "./styles";

/**
 * A supporting container used to present content with visual emphasis.
 *
 * @description
 * The `m3e-callout` component provides a visually distinct supporting container
 * for contextual or supplemental information. A callout typically includes an
 * icon, heading, and text-based content that helps draw attention to important details
 * without disrupting the primary content flow.
 *
 * @example
 * The following example illustrates a callout including an icon, label, and text-based content.
 * ```html
 * <m3e-callout>
 *  <m3e-icon slot="icon" name="info"></m3e-icon>
 *  <span slot="label">Lorem ipsum dolor sit amet</span>
 *  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
 *  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
 *  ea commodo consequat.
 * </m3e-callout>
 * ```
 *
 * @tag m3e-callout
 *
 * @slot - Renders the text-based content of the callout.
 * @slot icon - Renders the icon of the callout.
 * @slot label - Renders the label of the callout.
 *
 * @attr variant - The appearance variant of the callout.
 * @attr shape - The shape of the callout.
 *
 * @cssprop --m3e-callout-leading-space - Padding at the start of the callout.
 * @cssprop --m3e-callout-trailing-space - Padding at the end of the callout.
 * @cssprop --m3e-callout-top-space - Padding at the top of the callout.
 * @cssprop --m3e-callout-bottom-space - Padding at the bottom of the callout.
 * @cssprop --m3e-callout-leading-accent-size - Width of the leading accent.
 * @cssprop --m3e-callout-icon-label-space - Space between the icon and label.
 * @cssprop --m3e-callout-icon-size - Size of the icon.
 * @cssprop --m3e-callout-label-font-size - Font size of the label.
 * @cssprop --m3e-callout-label-font-weight - Font weight of the label.
 * @cssprop --m3e-callout-label-line-height - Line height of the label.
 * @cssprop --m3e-callout-label-tracking - Letter spacing of the label.
 * @cssprop --m3e-callout-content-font-size - Font size of the content.
 * @cssprop --m3e-callout-content-font-weight - Font weight of the content.
 * @cssprop --m3e-callout-content-line-height - Line height of the content.
 * @cssprop --m3e-callout-content-tracking - Letter spacing of the content.
 * @cssprop --m3e-callout-label-content-space - Space between the header and content.
 * @cssprop --m3e-callout-rounded-shape - Corner radius of the rounded shape.
 * @cssprop --m3e-callout-square-shape - Corner radius of the square shape.
 * @cssprop --m3e-callout-container-color - Fallback background color for all variants.
 * @cssprop --m3e-callout-label-text-color - Fallback label text color for all variants.
 * @cssprop --m3e-callout-icon-color - Fallback icon color for all variants.
 * @cssprop --m3e-callout-content-color - Fallback content color for all variants.
 * @cssprop --m3e-callout-leading-accent-color - Fallback leading accent color for all variants.
 * @cssprop --m3e-primary-container-callout-container-color - Background color for the primary variant.
 * @cssprop --m3e-primary-container-callout-label-text-color - Label text color for the primary variant.
 * @cssprop --m3e-primary-container-callout-icon-color - Icon color for the primary variant.
 * @cssprop --m3e-primary-container-callout-content-color - Content color for the primary variant.
 * @cssprop --m3e-primary-container-callout-leading-accent-color - Leading accent color for the primary variant.
 * @cssprop --m3e-secondary-container-callout-container-color - Background color for the secondary variant.
 * @cssprop --m3e-secondary-container-callout-label-text-color - Label text color for the secondary variant.
 * @cssprop --m3e-secondary-container-callout-icon-color - Icon color for the secondary variant.
 * @cssprop --m3e-secondary-container-callout-content-color - Content color for the secondary variant.
 * @cssprop --m3e-secondary-container-callout-leading-accent-color - Leading accent color for the secondary variant.
 * @cssprop --m3e-tertiary-container-callout-container-color - Background color for the tertiary variant.
 * @cssprop --m3e-tertiary-container-callout-label-text-color - Label text color for the tertiary variant.
 * @cssprop --m3e-tertiary-container-callout-icon-color - Icon color for the tertiary variant.
 * @cssprop --m3e-tertiary-container-callout-content-color - Content color for the tertiary variant.
 * @cssprop --m3e-tertiary-container-callout-leading-accent-color - Leading accent color for the tertiary variant.
 * @cssprop --m3e-error-container-callout-container-color - Background color for the error variant.
 * @cssprop --m3e-error-container-callout-label-text-color - Label text color for the error variant.
 * @cssprop --m3e-error-container-callout-icon-color - Icon color for the error variant.
 * @cssprop --m3e-error-container-callout-content-color - Content color for the error variant.
 * @cssprop --m3e-error-container-callout-leading-accent-color - Leading accent color for the error variant.
 * @cssprop --m3e-surface-callout-container-color - Background color for the surface variant.
 * @cssprop --m3e-surface-callout-label-text-color - Label text color for the surface variant.
 * @cssprop --m3e-surface-callout-icon-color - Icon color for the surface variant.
 * @cssprop --m3e-surface-callout-content-color - Content color for the surface variant.
 * @cssprop --m3e-surface-callout-leading-accent-color - Leading accent color for the surface variant.
 */
@customElement("m3e-callout")
export class M3eCalloutElement extends AttachInternals(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [CalloutStyle, CalloutVariantStyle];

  /**
   * The appearance variant of the callout.
   * @default "secondary"
   */
  @property({ reflect: true, useDefault: true }) variant: CalloutVariant = "secondary";

  /**
   * The shape of the callout.
   * @default "rounded"
   */
  @property({ reflect: true, useDefault: true }) shape: CalloutShape = "rounded";

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#applyVariant();
    this.#applyShape();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("variant")) {
      this.#applyVariant();
    }
    if (_changedProperties.has("shape")) {
      this.#applyShape();
    }
  }

  /** @private */
  protected override render(): unknown {
    return html`<aside class="base">
      <div class="header">
        <slot name="icon" @slotchange=${this.#handleIconSlotChange}></slot>
        <m3e-text-overflow>
          <slot name="label" @slotchange=${this.#handleLabelSlotChange}></slot>
        </m3e-text-overflow>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </aside>`;
  }

  /** @private */
  #handleIconSlotChange(e: Event): void {
    setCustomState(this, "--with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleLabelSlotChange(e: Event): void {
    setCustomState(this, "--with-label", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #applyVariant(): void {
    if (!isCalloutVariant(this.variant)) {
      this.variant = "secondary";
    }
    setCustomEnumState(this, this.variant, "primary", "secondary", "tertiary", "error", "surface");
  }

  /** @private */
  #applyShape(): void {
    if (!isCalloutShape(this.shape)) {
      this.shape = "rounded";
    }

    setCustomEnumState(this, this.shape, "square", "rounded");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-callout": M3eCalloutElement;
  }
}
