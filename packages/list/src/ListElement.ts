import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { Role } from "@m3e/core";

/**
 * @summary
 * A list of items.
 *
 * @description
 * The `m3e-list` component provides a list container for organizing and displaying
 * multiple list items. It supports flexible layout, custom padding, and divider insets
 * via CSS custom properties.
 *
 * @example
 * The following example illustrates a list with a single item using all supported slots.
 *
 * Note: This example uses the `@mwc/icon` package to present Material Design symbols, but any icon package can be
 * substituted depending on your design system or preferences
 *
 * ```html
 * <m3e-list>
 *  <m3e-list-item>
 *    <m3e-icon slot="leading-icon" name="person"></m3e-icon>
 *    <span slot="overline">Overline</span>
 *    Headline
 *    <span slot="supporting-text">Supporting text</span>
 *    <span slot="trailing-supporting-text">100+</span>
 *    <m3e-icon slot="trailing-icon" name="arrow_right"></m3e-icon>
 *  </m3e-list-item>
 * </m3e-list>
 * ```
 *
 * @tag m3e-list
 *
 * @slot - Renders the items of the list.
 *
 * @cssprop --m3e-list-block-padding - Vertical padding for the list container.
 * @cssprop --m3e-list-divider-inset-start-size - Start inset for dividers within the list.
 * @cssprop --m3e-list-divider-inset-end-size - End inset for dividers within the list.
 */
@customElement("m3e-list")
export class M3eListElement extends Role(LitElement, "list") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      padding-block: var(--m3e-list-block-padding, 0.5rem);

      --m3e-divider-inset-start-size: var(--m3e-list-divider-inset-start-size, 1rem);
      --m3e-divider-inset-end-size: var(--m3e-list-divider-inset-end-size, 1.5rem);
    }
  `;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list": M3eListElement;
  }
}
