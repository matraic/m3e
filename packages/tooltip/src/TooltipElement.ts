import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { M3eAriaDescriber } from "@m3e/core/a11y";
import { M3ePlatform } from "@m3e/core/platform";
import { positionAnchor } from "@m3e/core/anchoring";
import { M3eDirectionality } from "@m3e/core/bidi";

import {
  AttachInternals,
  DesignToken,
  getTextContent,
  HoverController,
  HtmlFor,
  isDisabledMixin,
  LongPressController,
} from "@m3e/core";

import { TooltipPosition } from "./TooltipPosition";
import { TooltipTouchGestures } from "./TooltipTouchGestures";

/** The space, in pixels, between the tooltip and anchor. */
const TOOLTIP_OFFSET = 4;

/** The default time, in milliseconds, before hiding a tooltip. */
const TOOLTIP_HIDE_DELAY = 200;

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
export class M3eTooltipElement extends HtmlFor(AttachInternals(LitElement)) {
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
      visibility: hidden;
      opacity: 0;
      transform: scale(0.8);
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        transform ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard},
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host(.-multiline) .base {
      text-align: start;
    }
    .base::backdrop {
      background-color: transparent;
    }
    .base:not(:popover-open) {
      visibility: hidden;
      opacity: 0;
      transform: scale(0.8);
    }
    .base:popover-open {
      visibility: visible;
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

  /** @private */ private static __openTooltips = new Array<M3eTooltipElement>();

  /** @private */ @query(".base") private readonly _base!: HTMLElement;
  /** @private */ #message?: string | null;
  /** @private */ #for: HTMLElement | null = null;
  /** @private */ #anchorCleanup?: () => void;

  /** @private */ readonly #clickHandler = () => this.hide();

  /** @private */
  readonly #hoverController = new HoverController(this, {
    target: null,
    endDelay: TOOLTIP_HIDE_DELAY,
    callback: (hovering) => {
      if (hovering) {
        this.show();
      } else {
        this.hide();
      }
    },
  });

  /** @private */
  readonly #longPressController = new LongPressController(this, {
    target: null,
    callback: (pressed) => {
      if (pressed) {
        this.show();
      } else {
        this.hide();
      }
    },
  });

  /**
   * Whether the element is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The position of the tooltip.
   * @default "below"
   */
  @property() position: TooltipPosition = "below";

  /**
   * The amount of time, in milliseconds, before showing the tooltip.
   * @default 0
   */
  @property({ attribute: "show-delay", type: Number }) get showDelay(): number {
    return this.#hoverController.startDelay;
  }
  set showDelay(value: number) {
    this.#hoverController.startDelay = value;
  }

  /**
   * The amount of time, in milliseconds, before hiding the tooltip.
   * @default 200
   */
  @property({ attribute: "hide-delay", type: Number }) get hideDelay(): number {
    return this.#hoverController.endDelay;
  }
  set hideDelay(value: number) {
    this.#hoverController.endDelay = value;
  }

  /**
   * The mode in which to handle touch gestures.
   * @default "auto"
   */
  @property({ attribute: "touch-gestures" }) touchGestures: TooltipTouchGestures = "auto";

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (this.#message) {
      M3eAriaDescriber.describe(control, this.#message);
    }

    if (M3ePlatform.iOS || M3ePlatform.Android) {
      this.#longPressController.observe(control);
      this.#disableNativeGesturesIfNecessary();
    } else {
      this.#hoverController.observe(control);
    }

    control.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      if (this.#message) {
        M3eAriaDescriber.removeDescription(this.control, this.#message);
      }

      this.#hoverController.unobserve(this.control);
      this.#longPressController.observe(this.control);
      this.control.removeEventListener("click", this.#clickHandler);
      this.hide();
    }
    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.ariaHidden = "true";
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("disabled") && this.disabled) {
      this.hide();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" popover="manual" @toggle="${this.#handleToggle}">
      <slot @slotchange="${this.#handleSlotChange}"></slot>
    </div>`;
  }

  /**
   * Manually shows the tooltip.
   * @returns {Promise<void>} A `Promise` that resolves when the tooltip is shown.
   */
  async show(): Promise<void> {
    if (!this.control || this.disabled || (isDisabledMixin(this.control) && this.control.disabled)) return;

    console.log(M3eTooltipElement.__openTooltips);

    M3eTooltipElement.__openTooltips.filter((x) => x !== this).forEach((x) => x.hide());

    this._base.showPopover();
    this.#anchorCleanup = await positionAnchor(
      this._base,
      this.control,
      {
        position:
          this.position === "above"
            ? "top"
            : this.position === "below"
              ? "bottom"
              : this.position === "before"
                ? M3eDirectionality.current === "ltr"
                  ? "left"
                  : "right"
                : M3eDirectionality.current === "ltr"
                  ? "right"
                  : "left",
        inline: true,
        flip: true,
        shift: true,
        offset: TOOLTIP_OFFSET,
      },
      (x, y) => {
        if (M3eDirectionality.current === "rtl") {
          this._base.style.right = `${window.innerWidth - x - this._base.clientWidth}px`;
          this._base.style.left = "";
        } else {
          this._base.style.left = `${x}px`;
          this._base.style.right = "";
        }
        this._base.style.top = `${y}px`;
      },
    );

    if (!M3eTooltipElement.__openTooltips.includes(this)) {
      M3eTooltipElement.__openTooltips.push(this);
    }
  }

  /** Manually hides the tooltip. */
  hide(): void {
    this._base.hidePopover();
    this.#anchorCleanup?.();
    this.#anchorCleanup = undefined;
    this.#hoverController.clearDelays();

    M3eTooltipElement.__openTooltips = [...M3eTooltipElement.__openTooltips].filter((x) => x !== this);
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

  /** @private */
  #disableNativeGesturesIfNecessary() {
    if (this.touchGestures !== "off" && this.#for) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const style: any = this.#for.style;

      // If gestures are set to `auto`, we don't disable text selection on inputs and
      // textareas, because it prevents the user from typing into them on iOS Safari.

      if (this.touchGestures === "on" || (this.#for.nodeName !== "INPUT" && this.#for.nodeName !== "TEXTAREA")) {
        style.userSelect = style.msUserSelect = style.webkitUserSelect = style.MozUserSelect = "none";
      }

      // If we have `auto` gestures and the element uses native HTML dragging,
      // we don't set `-webkit-user-drag` because it prevents the native behavior.

      if (this.touchGestures === "on" || !this.#for.draggable) {
        style.webkitUserDrag = "none";
      }

      style.touchAction = "none";
      style.webkitTapHighlightColor = "transparent";
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tooltip": M3eTooltipElement;
  }
}
