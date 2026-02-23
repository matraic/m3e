import { LitElement, PropertyValues } from "lit";
import { property, query } from "lit/decorators.js";

import { HoverController, HtmlFor, isDisabledMixin, LongPressController } from "@m3e/web/core";
import { M3ePlatform } from "@m3e/web/core/platform";
import { AnchorPosition, positionAnchor } from "@m3e/web/core/anchoring";

import { TooltipTouchGestures } from "./TooltipTouchGestures";

/** The space, in pixels, between the tooltip and anchor. */
const TOOLTIP_OFFSET = 4;

/** The default time, in milliseconds, before hiding a tooltip. */
const TOOLTIP_HIDE_DELAY = 200;

/** Provides a base implementation for a tooltip. This class must be inherited. */
export abstract class TooltipElementBase extends HtmlFor(LitElement) {
  /** @private */ private static __openTooltips = new Array<TooltipElementBase>();

  /** @internal */ @query(".base") protected readonly _base!: HTMLElement;
  /** @private */ #for: HTMLElement | null = null;
  /** @private */ #anchorCleanup?: () => void;
  /** @private */ #tooltipHovering = false;

  /** @private */ readonly #controlClickHandler = () => this.#handleControlClick();

  /** @private */
  readonly #hoverController = new HoverController(this, {
    target: null,
    endDelay: TOOLTIP_HIDE_DELAY,
    callback: (hovering, target) => {
      if (this._isInteractive) return;
      if (hovering) {
        if (target === this._base) {
          this.#tooltipHovering = true;
          return;
        }
        this.show();
      } else if (!this.#tooltipHovering || target === this._base) {
        this.#tooltipHovering = false;
        this.hide();
      }
    },
  });

  /** @private */
  readonly #longPressController = new LongPressController(this, {
    target: null,
    callback: (pressed) => {
      if (this._isInteractive) return;
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

  /** Whether the tooltip is currently open. */
  get isOpen(): boolean {
    return TooltipElementBase.__openTooltips.includes(this);
  }

  /**
   * Whether the tooltip is interactive.
   * @internal
   */
  protected get _isInteractive() {
    return false;
  }

  /**
   * The position in which to anchor the tooltip relative to its trigger.
   * @internal
   */
  protected abstract get _anchorPosition(): AnchorPosition;

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (M3ePlatform.iOS || M3ePlatform.Android) {
      this.#longPressController.observe(control);
      this.#disableNativeGesturesIfNecessary();
    } else {
      this.#hoverController.observe(control);
    }

    control.addEventListener("click", this.#controlClickHandler);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      this.#hoverController.unobserve(this.control);
      this.#longPressController.observe(this.control);
      this.control.removeEventListener("click", this.#controlClickHandler);
      this.hide();
    }
    super.detach();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has("disabled") && this.disabled) {
      this.hide();
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);

    if (this._base) {
      this.#hoverController.observe(this._base);
    }
  }

  /**
   * Manually shows the tooltip.
   * @returns {Promise<void>} A `Promise` that resolves when the tooltip is shown.
   */
  async show(): Promise<void> {
    if (!this.control || this.disabled || (isDisabledMixin(this.control) && this.control.disabled)) return;

    TooltipElementBase.__openTooltips.filter((x) => x !== this).forEach((x) => x.hide());

    this._base.showPopover();

    this.#anchorCleanup = await positionAnchor(
      this._base,
      this.control,
      {
        position: this._anchorPosition,
        inline: true,
        flip: true,
        shift: true,
        offset: TOOLTIP_OFFSET,
      },
      (x, y) => this._updatePosition(this._base, x, y),
    );

    if (!TooltipElementBase.__openTooltips.includes(this)) {
      TooltipElementBase.__openTooltips.push(this);
    }
  }

  /** Manually hides the tooltip. */
  hide(): void {
    this._base.hidePopover();
    this.#anchorCleanup?.();
    this.#anchorCleanup = undefined;
    this.#hoverController.clearDelays();

    if (TooltipElementBase.__openTooltips.includes(this)) {
      TooltipElementBase.__openTooltips = TooltipElementBase.__openTooltips.filter((x) => x !== this);
    }
  }

  /**
   * Updates the position of the tooltip.
   * @internal
   * @param {HTMLElement} base The internal element of the tooltip to position.
   * @param {number} x The x-coordinate, in pixels, to which to position `base`.
   * @param {number} y The y-coordinate, in pixels, to which to position `base`.
   */
  protected abstract _updatePosition(base: HTMLElement, x: number, y: number): void;

  /** @private */
  #handleControlClick(): void {
    if (this._isInteractive) {
      if (TooltipElementBase.__openTooltips.includes(this)) {
        this.hide();
      } else {
        this.show();
      }
    } else {
      this.hide();
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
