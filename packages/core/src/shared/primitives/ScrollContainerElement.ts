import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { debounce } from "../decorators";
import { DesignToken } from "../tokens";

import { ScrollDividers } from "./ScrollDividers";

/**
 * @summary
 * A vertically oriented content container which presents dividers above and below content when scrolled.
 *
 * @description
 * The `m3e-scroll-container` component provides a vertically oriented scrollable container with dynamic
 * dividers above and below content. Designed according to Material 3 principles, it supports custom scrollbar
 * thickness, divider styling, and focus ring theming via CSS custom properties.
 *
 * @example
 * This example shows a scrollable container with dividers above and below the content, and thin scrollbars enabled.
 * ```html
 * <m3e-scroll-container dividers="above-below" thin>
 *   <div>Scrollable content goes here</div>
 * </m3e-scroll-container>
 * ```
 *
 * @tag m3e-scroll-container
 *
 * @slot - Renders the scrollable content.
 *
 * @attr dividers - The dividers used to separate scrollable content.
 * @attr thin - Whether to present thin scrollbars.
 *
 * @cssprop --m3e-divider-thickness - Thickness of the divider lines above and below content.
 * @cssprop --m3e-divider-color - Color of the divider lines when visible.
 * @cssprop --m3e-focus-ring-color - Color of the focus ring outline.
 * @cssprop --m3e-focus-ring-thickness - Thickness of the focus ring outline.
 * @cssprop --m3e-focus-ring-factor - Animation factor for focus ring thickness.
 * @cssprop --m3e-focus-ring-duration - Duration of the focus ring animation.
 */
@customElement("m3e-scroll-container")
export class M3eScrollContainerElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      overflow-y: auto;
      position: relative;
      box-sizing: border-box;
      scrollbar-color: ${DesignToken.scrollbar.color};
      border-top: var(--m3e-divider-thickness, 1px) solid transparent;
      border-bottom: var(--m3e-divider-thickness, 1px) solid transparent;
      outline: var(--m3e-focus-ring-color, ${DesignToken.color.secondary});
      outline-width: var(--m3e-focus-ring-thickness, 0.25rem);
      outline-offset: calc(var(--m3e-focus-ring-thickness, 0.25rem) / 2);
    }
    :host([thin]) {
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
    }
    :host(:not([thin])) {
      scrollbar-width: ${DesignToken.scrollbar.width};
    }
    :host(:not(:focus-visible).-above) {
      border-top-color: var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
    }
    :host(:not(:focus-visible).-below) {
      border-bottom-color: var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
    }
    :host(:focus-visible) {
      outline-style: solid;
      animation: grow-shrink var(--m3e-focus-ring-duration, ${DesignToken.motion.duration.long2});
    }
    @keyframes grow-shrink {
      50% {
        outline-width: calc(var(--m3e-focus-ring-thickness, 0.25rem) * var(--m3e-focus-ring-factor, 2));
      }
    }
    @media (forced-colors: active) {
      :host {
        border-top: var(--m3e-divider-thickness, 1px) solid Canvas;
        border-bottom: var(--m3e-divider-thickness, 1px) solid Canvas;
      }
      :host(:not(:focus-visible).-above) {
        border-top-color: GrayText;
      }
      :host(:not(:focus-visible).-below) {
        border-bottom-color: GrayText;
      }
    }
    @media (prefers-reduced-motion) {
      :host(:focus-visible) {
        animation: none;
      }
    }
  `;

  /** @private */ readonly #scrollHandler = () => this._updateScroll();

  /**
   * The dividers used to separate scrollable content.
   * @default "above-below"
   */
  @property() dividers: ScrollDividers = "above-below";

  /**
   * Whether to present thin scrollbars.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) thin = false;

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("scroll", this.#scrollHandler);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("dividers")) {
      this.removeEventListener("scroll", this.#scrollHandler);
      if (this.dividers !== "none") {
        this.addEventListener("scroll", this.#scrollHandler);
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this._updateScroll}"></slot>`;
  }

  /** @private */
  @debounce(40)
  private _updateScroll(): void {
    const before = (this.dividers === "above" || this.dividers === "above-below") && this.scrollTop > 0;
    const after =
      (this.dividers === "below" || this.dividers === "above-below") &&
      this.scrollHeight - this.scrollTop - this.clientHeight > 1;

    this.classList.toggle("-above", before);
    this.classList.toggle("-below", after);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-scroll-container": M3eScrollContainerElement;
  }
}
