import { css, CSSResultGroup, html, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, getTextContent } from "@m3e/web/core";
import { M3eAriaDescriber } from "@m3e/web/core/a11y";
import { AnchorPosition } from "@m3e/web/core/anchoring";
import { M3eDirectionality } from "@m3e/web/core/bidi";

import { TooltipPosition } from "./TooltipPosition";
import { TooltipElementBase } from "./TooltipElementBase";

/**
 * Adds additional context to a button or other UI element.
 *
 * @description
 * The `m3e-tooltip` component provides contextual information in response to user interaction, enhancing comprehension
 * and reducing ambiguity. Tooltips are positioned relative to a target element and support configurable delays for
 * show and hide behavior. The component is designed to reinforce accessibility and usability, especially in dense or
 * icon-driven interfaces. Use the `for` attribute to designate the element for which to provide a tooltip.
 *
 * @example
 * The following example illustrates connecting a tooltip to a button using the `for` attribute.
 * ```html
 * <m3e-icon-button id="button" aria-label="Back">
 *  <m3e-icon name="arrow_back"></m3e-icon>
 * </m3e-icon-button>
 * <m3e-tooltip for="button">Go Back</m3e-tooltip>
 * ```
 *
 * @tag m3e-tooltip
 *
 * @slot - Renders the content of the tooltip.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr hide-delay - The amount of time, in milliseconds, before hiding the tooltip.
 * @attr position - The position of the tooltip.
 * @attr show-delay - The amount of time, in milliseconds, before showing the tooltip.
 *
 * @cssprop --m3e-tooltip-padding - Internal spacing of the tooltip container.
 * @cssprop --m3e-tooltip-min-width - Minimum width of the tooltip.
 * @cssprop --m3e-tooltip-max-width - Maximum width of the tooltip.
 * @cssprop --m3e-tooltip-min-height - Minimum height of the tooltip container.
 * @cssprop --m3e-tooltip-max-height - Maximum height of the tooltip.
 * @cssprop --m3e-tooltip-shape - Border radius of the tooltip container.
 * @cssprop --m3e-tooltip-container-color - Background color of the tooltip.
 * @cssprop --m3e-tooltip-supporting-text-color - Text color of supporting text.
 * @cssprop --m3e-tooltip-supporting-text-font-size - Font size of supporting text.
 * @cssprop --m3e-tooltip-supporting-text-font-weight - Font weight of supporting text.
 * @cssprop --m3e-tooltip-supporting-text-line-height - Line height of supporting text.
 * @cssprop --m3e-tooltip-supporting-text-tracking - Letter spacing of supporting text.
 */
@customElement("m3e-tooltip")
export class M3eTooltipElement extends TooltipElementBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    .base {
      position: absolute;
      pointer-events: none;
      margin: unset;
      border: unset;
      word-break: normal;
      overflow-wrap: anywhere;
      padding: var(--m3e-tooltip-padding, 0.25rem 0.5rem);
      min-width: var(--m3e-tooltip-min-width, 2.5rem);
      max-width: var(--m3e-tooltip-max-width, 12.5rem);
      min-height: var(--m3e-tooltip-min-height, 1.5rem);
      max-height: var(--m3e-tooltip-max-height, 40vh);
      box-sizing: border-box;
      overflow: hidden;
      text-align: center;
      border-radius: var(--m3e-tooltip-shape, ${DesignToken.shape.corner.extraSmall});
      background-color: var(--m3e-tooltip-container-color, ${DesignToken.color.inverseSurface});
      color: var(--m3e-tooltip-supporting-text-color, ${DesignToken.color.inverseOnSurface});
      font-size: var(--m3e-tooltip-supporting-text-font-size, ${DesignToken.typescale.standard.body.small.fontSize});
      font-weight: var(
        --m3e-tooltip-supporting-text-font-weight,
        ${DesignToken.typescale.standard.body.small.fontWeight}
      );
      line-height: var(
        --m3e-tooltip-supporting-text-line-height,
        ${DesignToken.typescale.standard.body.small.lineHeight}
      );
      letter-spacing: var(
        --m3e-tooltip-supporting-text-tracking,
        ${DesignToken.typescale.standard.body.small.tracking}
      );
      display: none;
      opacity: 0;
      transform: scale(0.8);
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        transform ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard},
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        display ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host(.-multiline) .base {
      text-align: start;
    }
    .base::backdrop {
      background-color: transparent;
    }
    .base:popover-open {
      display: block;
      opacity: 1;
      transform: scale(1);
    }
    @starting-style {
      .base:popover-open {
        opacity: 0;
        transform: scale(0.8);
      }
    }
    @media (prefers-reduced-motion) {
      .base {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      .base {
        background-color: Canvas;
        color: CanvasText;
        box-sizing: border-box;
        border: 1px solid CanvasText;
      }
    }
  `;

  /** @private */ #message?: string | null;

  /**
   * The position of the tooltip.
   * @default "below"
   */
  @property() position: TooltipPosition = "below";

  /** @inheritdoc */
  protected get _anchorPosition(): AnchorPosition {
    return this.position === "above"
      ? "top"
      : this.position === "below"
        ? "bottom"
        : this.position === "before"
          ? M3eDirectionality.current === "ltr"
            ? "left"
            : "right"
          : M3eDirectionality.current === "ltr"
            ? "right"
            : "left";
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (this.#message) {
      M3eAriaDescriber.describe(control, this.#message);
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control && this.#message) {
      M3eAriaDescriber.removeDescription(this.control, this.#message);
    }
    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.ariaHidden = "true";
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" popover="manual" @toggle="${this.#handleToggle}">
      <slot @slotchange="${this.#handleSlotChange}"></slot>
    </div>`;
  }

  /** @inheritdoc */
  protected _updatePosition(base: HTMLElement, x: number, y: number): void {
    if (M3eDirectionality.current === "rtl") {
      base.style.right = `${window.innerWidth - x - base.clientWidth}px`;
      base.style.left = "";
    } else {
      base.style.left = `${x}px`;
      base.style.right = "";
    }
    base.style.top = `${y}px`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    const message = getTextContent(e.target as HTMLSlotElement, true);
    if (this.isConnected && this.control) {
      if (this.#message) {
        M3eAriaDescriber.removeDescription(this.control, this.#message);
      }

      this.#message = message;

      if (this.#message) {
        M3eAriaDescriber.describe(this.control, this.#message);
      }
    } else {
      this.#message = message;
    }
  }

  /** @private */
  #handleToggle(e: ToggleEvent): void {
    if (e.newState === "open") {
      const multiline = this._base.getBoundingClientRect().height > parseFloat(getComputedStyle(this._base).minHeight);
      this.classList.toggle("-multiline", multiline);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tooltip": M3eTooltipElement;
  }
}
