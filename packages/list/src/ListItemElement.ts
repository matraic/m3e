import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { DesignToken, Role } from "@m3e/core";

/**
 * An item in a list.
 *
 * @description
 * The `m3e-list-item` component represents a single item within a list. It supports rich
 * content, leading/trailing icons, overline, supporting text, and trailing supporting text
 * via named slots. The component is highly customizable through CSS custom properties and
 * is designed for accessibility and flexible layout.
 *
 * @example
 * The following example illustrates a list with a single item using all supported slots.
 *
 * Note: This example uses the `@m3e/icon` package to present Material Design symbols, but any icon package can be
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
 * @tag m3e-list-item
 *
 * @slot - Renders the content of the list item.
 * @slot leading-icon - Renders the leading icon of the list item.
 * @slot overline - Renders the overline of the list item.
 * @slot supporting-text - Renders the supporting text of the list item.
 * @slot trailing-supporting-text - Renders the trailing supporting text of the list item.
 * @slot trailing-icon - Renders the trailing icon of the list item.
 *
 * @cssprop --m3e-list-item-spacing - Horizontal gap between elements.
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
 * @cssprop --m3e-list-item-trailing-supporting-text-font-size - Font size for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-supporting-text-font-weight - Font weight for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-supporting-text-line-height - Line height for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-supporting-text-tracking - Letter spacing for trailing supporting text slot.
 * @cssprop --m3e-list-item-icon-size - Size for leading/trailing icons.
 */
@customElement("m3e-list-item")
export class M3eListItemElement extends Role(LitElement, "listitem") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      column-gap: var(--m3e-list-item-spacing, 1rem);
      padding-inline: var(--m3e-list-item-padding-inline, 1rem);
      padding-block: var(--m3e-list-item-padding-block, 0.75rem);
      min-height: calc(var(--m3e-list-item-height, 3.5rem) + ${DesignToken.density.calc(-3)});
    }
    .base {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      align-items: unset;
      justify-content: unset;
    }
    ::slotted([slot="overline"]) {
      font-size: var(--m3e-list-item-overline-font-size, ${DesignToken.typescale.standard.label.small.fontSize});
      font-weight: var(--m3e-list-item-overline-font-weight, ${DesignToken.typescale.standard.label.small.fontWeight});
      line-height: var(--m3e-list-item-overline-line-height, ${DesignToken.typescale.standard.label.small.lineHeight});
      letter-spacing: var(--m3e-list-item-overline-tracking, ${DesignToken.typescale.standard.label.small.tracking});
    }
    ::slotted([slot="supporting-text"]) {
      font-size: var(--m3e-list-item-supporting-text-font-size, ${DesignToken.typescale.standard.body.medium.fontSize});
      font-weight: var(
        --m3e-list-item-supporting-text-font-weight,
        ${DesignToken.typescale.standard.body.medium.fontWeight}
      );
      line-height: var(
        --m3e-list-item-supporting-text-line-height,
        ${DesignToken.typescale.standard.body.medium.lineHeight}
      );
      letter-spacing: var(
        --m3e-list-item-supporting-text-tracking,
        ${DesignToken.typescale.standard.body.medium.tracking}
      );
    }
    ::slotted(:not([slot])) {
      font-size: var(--m3e-list-item-font-size, ${DesignToken.typescale.standard.body.large.fontSize});
      font-weight: var(--m3e-list-item-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight});
      line-height: var(--m3e-list-item-line-height, ${DesignToken.typescale.standard.body.large.lineHeight});
      letter-spacing: var(--m3e-list-item-tracking, ${DesignToken.typescale.standard.body.large.tracking});
    }
    ::slotted([slot="trailing-supporting-text"]) {
      white-space: nowrap;
      font-size: var(
        --m3e-list-item-trailing-supporting-text-font-size,
        ${DesignToken.typescale.standard.label.small.fontSize}
      );
      font-weight: var(
        --m3e-list-item-trailing-supporting-text-font-weight,
        ${DesignToken.typescale.standard.label.small.fontWeight}
      );
      line-height: var(
        --m3e-list-item-trailing-supporting-text-line-height,
        ${DesignToken.typescale.standard.label.small.lineHeight}
      );
      letter-spacing: var(
        --m3e-list-item-trailing-supporting-text-tracking,
        ${DesignToken.typescale.standard.label.small.tracking}
      );
    }
    ::slotted([slot="leading-icon"]),
    ::slotted([slot="trailing-icon"]) {
      width: 1em;
      font-size: var(--m3e-list-item-icon-size, 1.5rem) !important;
    }
  `;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot name="leading-icon"></slot>
      <div class="base">
        <slot name="overline"></slot>
        <slot></slot>
        <slot name="supporting-text"></slot>
      </div>
      <slot name="trailing-supporting-text"></slot>
      <slot name="trailing-icon"></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-list-item": M3eListItemElement;
  }
}
