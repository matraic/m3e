import { css, CSSResultGroup, html, LitElement } from "lit";
import { property } from "lit/decorators.js";

import { customElement, DesignToken, Role } from "@m3e/web/core";

/**
 * A thin line that separates content in lists or other containers.
 *
 * @description
 * The `m3e-divider` component visually separates content within layouts, lists, or containers using a thin, unobtrusive line.
 * It supports horizontal and vertical orientation, with optional inset variants to align with layout padding and visual hierarchy.
 * The divider thickness, color, and inset behavior are customizable via CSS properties to maintain consistency across surfaces.
 * It is designed to reinforce spatial relationships without drawing attention, preserving focus on primary content.
 *
 * @example
 * Separate list items with dividers. Import `@m3e/web/list` for the list elements.
 * ```html
 * <m3e-list>
 *   <m3e-list-item>Item 1</m3e-list-item>
 *   <m3e-divider></m3e-divider>
 *   <m3e-list-item>Item 2</m3e-list-item>
 *   <m3e-divider></m3e-divider>
 *   <m3e-list-item>Item 3</m3e-list-item>
 * </m3e-list>
 * ```
 *
 * @example
 * Use `inset`, `inset-start`, or `inset-end` to indent a horizontal divider.
 * ```html
 * <m3e-divider></m3e-divider>
 * <m3e-divider inset></m3e-divider>
 * <m3e-divider inset-start></m3e-divider>
 * <m3e-divider inset-end></m3e-divider>
 * ```
 *
 * @example
 * Use `vertical` for vertical dividers. Give their container a definite height.
 * ```html
 * <m3e-divider vertical></m3e-divider>
 * <m3e-divider vertical inset></m3e-divider>
 * <m3e-divider vertical inset-start></m3e-divider>
 * <m3e-divider vertical inset-end></m3e-divider>
 * ```
 *
 * @tag m3e-divider
 *
 * @attr inset - Whether the divider is indented with equal padding on both sides.
 * @attr inset-start - Whether the divider is indented with padding on the leading side.
 * @attr inset-end - Whether the divider is indented with padding on the trailing side.
 * @attr vertical - Whether the divider is vertically aligned with adjacent content.
 *
 * @cssprop --m3e-divider-thickness - Thickness of the divider line.
 * @cssprop --m3e-divider-color - Color of the divider line.
 * @cssprop --m3e-divider-inset-size - When inset, fallback inset size used when no specific start or end inset is provided.
 * @cssprop --m3e-divider-inset-start-size - When inset, leading inset size.
 * @cssprop --m3e-divider-inset-end-size - When inset, trailing inset size.
 */
@customElement("m3e-divider")
export class M3eDividerElement extends Role(LitElement, "separator") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      position: relative;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:not([vertical])) {
      height: var(--m3e-divider-thickness, 1px);
      width: 100%;
    }
    :host([vertical]) {
      width: var(--m3e-divider-thickness, 1px);
      height: 100%;
    }
    .line {
      contain: layout style paint;
      box-sizing: border-box;
      position: absolute;
    }
    :host(:not([vertical])) .line {
      border-bottom: var(--m3e-divider-thickness, 1px) solid
        var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
      height: inherit;
    }
    :host([vertical]) .line {
      border-right: var(--m3e-divider-thickness, 1px) solid
        var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
      width: inherit;
    }
    :host([vertical][inset]) .line,
    :host([vertical][inset-start]) .line {
      top: var(--m3e-divider-inset-start-size, var(--m3e-divider-inset-size, ${DesignToken.measurement.space200}));
    }
    :host(:not([vertical])[inset]) .line,
    :host(:not([vertical])[inset-start]) .line {
      left: var(--m3e-divider-inset-start-size, var(--m3e-divider-inset-size, ${DesignToken.measurement.space200}));
    }
    :host([vertical][inset]) .line,
    :host([vertical][inset-end]) .line {
      bottom: var(--m3e-divider-inset-end-size, var(--m3e-divider-inset-size, ${DesignToken.measurement.space200}));
    }
    :host(:not([vertical])[inset]) .line,
    :host(:not([vertical])[inset-end]) .line {
      right: var(--m3e-divider-inset-end-size, var(--m3e-divider-inset-size, ${DesignToken.measurement.space200}));
    }
    :host([vertical]:not([inset]):not([inset-start])) .line {
      top: 0;
    }
    :host(:not([vertical]):not([inset]):not([inset-start])) .line {
      left: 0;
    }
    :host([vertical]:not([inset]):not([inset-end])) .line {
      bottom: 0;
    }
    :host(:not([vertical]):not([inset]):not([inset-end])) .line {
      right: 0;
    }
    @media (forced-colors: active) {
      .line {
        border-color: GrayText;
      }
    }
  `;

  /**
   * Whether the divider is vertically aligned with adjacent content.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) vertical = false;

  /**
   * Whether the divider is indented with equal padding on both sides.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) inset = false;

  /**
   * Whether the divider is indented with padding on the leading side.
   * @default false
   */
  @property({ attribute: "inset-start", type: Boolean, reflect: true }) insetStart = false;

  /**
   * Whether the divider is indented with padding on the trailing side.
   * @default false
   */
  @property({ attribute: "inset-end", type: Boolean, reflect: true }) insetEnd = false;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="line"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-divider": M3eDividerElement;
  }
}
