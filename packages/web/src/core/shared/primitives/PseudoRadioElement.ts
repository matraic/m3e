import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { Checked, Disabled, Role } from "../mixins";
import { DesignToken } from "../tokens";

/**
 * An element which looks like a radio button.
 *
 * @description
 * The `m3e-pseudo-radio` component is a pseudo-radio supporting checked and disabled
 * states. It is customizable via CSS properties for expressive, accessible UI design.
 *
 * @example
 * The following example illustrates how to render a checked pseudo-radio.
 * ```html
 * <m3e-pseudo-radio checked></m3e-pseudo-radio>
 * ```
 *
 * @tag m3e-pseudo-radio
 *
 * @attr checked - A value indicating whether the element is checked.
 * @attr disabled - A value indicating whether the element is disabled.
 *
 * @cssprop --m3e-radio-icon-size - Size of the radio icon.
 * @cssprop --m3e-radio-unselected-icon-color - Color of the unselected radio icon.
 * @cssprop --m3e-radio-selected-icon-color - Color of the selected radio icon.
 * @cssprop --m3e-radio-disabled-icon-color - Color of the disabled radio icon.
 */
@customElement("m3e-pseudo-radio")
export class M3ePseudoRadioElement extends Checked(Disabled(Role(LitElement, "none"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      box-sizing: border-box;
      width: var(--m3e-radio-icon-size, 1.25rem);
      height: var(--m3e-radio-icon-size, 1.25rem);
      flex: none;
    }
    .circle {
      fill: currentColor;
    }
    :host(:not([checked])) .circle.inner {
      opacity: 0;
    }
    :host(:not([checked])) {
      color: var(--m3e-radio-unselected-icon-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host([checked]) {
      color: var(--m3e-radio-selected-icon-color, ${DesignToken.color.primary});
    }
    :host([disabled]) {
      color: color-mix(in srgb, var(--m3e-radio-disabled-icon-color, ${DesignToken.color.onSurface}) 38%, transparent);
    }
  `;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.ariaHidden = "true";
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<svg class="icon" viewBox="0 0 20 20">
      <mask id="cutout2">
        <rect width="100%" height="100%" fill="white"></rect>
        <circle cx="10" cy="10" r="8" fill="black"></circle>
      </mask>
      <circle class="outer circle" cx="10" cy="10" r="10" mask="url(#cutout2)"></circle>
      <circle class="inner circle" cx="10" cy="10" r="5"></circle>
    </svg>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-pseudo-radio": M3ePseudoRadioElement;
  }
}
