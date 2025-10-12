import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { DesignToken, prefersReducedMotion, ResizeController, Role, safeStyleMap } from "@m3e/core";

import { M3eSliderThumbElement } from "./SliderThumbElement";
import { SliderSize } from "./SliderSize";

/**
 * @summary
 * Allows for the selection of numeric values from a range.
 *
 * @description
 * The `m3e-slider` component enables users to select a numeric value from a continuous or discrete range.
 * Designed according to Material 3 principles, it supports labeled value indicators, tick marks, and
 * snapping behavior.
 *
 * @example
 * The following example illustrates a labelled slider with thumb used to select a single numeric value.
 * ```html
 * <m3e-slider labelled>
 *  <m3e-slider-thumb value="50"></m3e-slider-thumb>
 * </m3e-slider>
 * ```
 *
 * @example
 * The next example illustrates a labelled range slider with two thumbs used to select a minimum and maximum numeric value.
 * ```html
 * <m3e-slider labelled>
 *  <m3e-slider-thumb value="25"></m3e-slider-thumb>
 *  <m3e-slider-thumb value="75"></m3e-slider-thumb>
 * </m3e-slider>
 * ```
 *
 * @tag m3e-slider
 *
 * @attr disabled - Whether the element is disabled.
 * @attr discrete - Whether to show tick marks.
 * @attr labelled - Whether to show value labels when activated.
 * @attr max - The maximum allowable value.
 * @attr min - The minimum allowable value.
 * @attr step - The value at which the thumb will snap.
 * @attr size - The size of the slider.
 *
 * @cssprop --m3e-slider-min-width - Minimum inline size of the slider host.
 * @cssprop --m3e-slider-small-height - Height of the slider when size is small or extra-small.
 * @cssprop --m3e-slider-medium-height - Height of the slider when size is medium.
 * @cssprop --m3e-slider-large-height - Height of the slider when size is large.
 * @cssprop --m3e-slider-extra-large-height - Height of the slider when size is extra-large.
 * @cssprop --m3e-slider-small-active-track-shape - Corner shape of the active track for small sliders.
 * @cssprop --m3e-slider-small-inactive-active-track-start-shape - Corner shape of the inactive track start for small sliders.
 * @cssprop --m3e-slider-small-inactive-track-end-shape - Corner shape of the inactive track end for small sliders.
 * @cssprop --m3e-slider-medium-active-track-shape - Corner shape of the active track for medium sliders.
 * @cssprop --m3e-slider-medium-inactive-active-track-start-shape - Corner shape of the inactive track start for medium sliders.
 * @cssprop --m3e-slider-medium-inactive-track-end-shape - Corner shape of the inactive track end for medium sliders.
 * @cssprop --m3e-slider-large-active-track-shape - Corner shape of the active track for large sliders.
 * @cssprop --m3e-slider-large-inactive-active-track-start-shape - Corner shape of the inactive track start for large sliders.
 * @cssprop --m3e-slider-large-inactive-track-end-shape - Corner shape of the inactive track end for large sliders.
 * @cssprop --m3e-slider-extra-large-active-track-shape - Corner shape of the active track for extra-large sliders.
 * @cssprop --m3e-slider-extra-large-inactive-active-track-start-shape - Corner shape of the inactive track start for extra-large sliders.
 * @cssprop --m3e-slider-extra-large-inactive-track-end-shape - Corner shape of the inactive track end for extra-large sliders.
 * @cssprop --m3e-slider-extra-small-track-height - Height of the track for extra-small sliders.
 * @cssprop --m3e-slider-small-track-height - Height of the track for small sliders.
 * @cssprop --m3e-slider-medium-track-height - Height of the track for medium sliders.
 * @cssprop --m3e-slider-large-track-height - Height of the track for large sliders.
 * @cssprop --m3e-slider-extra-large-track-height - Height of the track for extra-large sliders.
 * @cssprop --m3e-slider-tick-size - Size of each tick mark.
 * @cssprop --m3e-slider-tick-shape - Corner shape of each tick mark.
 * @cssprop --m3e-slider-inactive-track-color - Background color of the inactive track when enabled.
 * @cssprop --m3e-slider-disabled-inactive-track-color - Base color of the inactive track when disabled.
 * @cssprop --m3e-slider-disabled-inactive-track-opacity - Opacity of the inactive track when disabled.
 * @cssprop --m3e-slider-active-track-color - Background color of the active track when enabled.
 * @cssprop --m3e-slider-disabled-active-track-color - Base color of the active track when disabled.
 * @cssprop --m3e-slider-disabled-active-track-opacity - Opacity of the active track when disabled.
 * @cssprop --m3e-slider-tick-active-color - Color of active ticks when enabled.
 * @cssprop --m3e-slider-disabled-tick-active-color - Color of active ticks when disabled.
 * @cssprop --m3e-slider-tick-inactive-color - Color of inactive ticks when enabled.
 * @cssprop --m3e-slider-disabled-tick-inactive-color - Color of inactive ticks when disabled.
 */
@customElement("m3e-slider")
export class M3eSliderElement extends Role(LitElement, "none") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      min-inline-size: var(--m3e-slider-min-width, 12.5rem);
    }
    :host(:not([disabled])) {
      cursor: pointer;
    }
    :host([size="extra-small"]),
    :host([size="small"]) {
      height: var(--m3e-slider-small-height, 2.75rem);
    }
    :host([size="extra-small"]) .base,
    :host([size="small"]) .base {
      --_slider-active-track-shape: var(--m3e-slider-small-active-track-shape, ${DesignToken.shape.corner.smallStart});
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-small-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.smallStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-small-inactive-track-end-shape,
        ${DesignToken.shape.corner.smallEnd}
      );
    }
    :host([size="extra-small"]) .track {
      height: calc(var(--m3e-slider-extra-small-track-height, 1rem));
    }
    :host([size="small"]) .track {
      height: calc(var(--m3e-slider-small-track-height, 1.5rem));
    }
    :host([size="medium"]) {
      height: var(--m3e-slider-medium-height, 3.25rem);
    }
    :host([size="medium"]) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-medium-active-track-shape,
        ${DesignToken.shape.corner.mediumStart}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-medium-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.mediumStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-medium-inactive-track-end-shape,
        ${DesignToken.shape.corner.mediumEnd}
      );
    }
    :host([size="medium"]) .track {
      height: var(--m3e-slider-medium-track-height, 2.5rem);
    }
    :host([size="large"]) {
      height: var(--m3e-slider-large-height, 4.25rem);
    }
    :host([size="large"]) .base {
      --_slider-active-track-shape: var(--m3e-slider-large-active-track-shape, ${DesignToken.shape.corner.largeStart});
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-large-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.largeStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.largeEnd}
      );
    }
    :host([size="large"]) .track {
      height: var(--m3e-slider-large-track-height, 3.5rem);
    }
    :host([size="extra-large"]) {
      height: var(--m3e-slider-extra-large-height, 6.75rem);
    }
    :host([size="extra-large"]) .base {
      --_slider-active-track-shape: var(
        --m3e-slider-extra-large-active-track-shape,
        ${DesignToken.shape.corner.extraLargeStart}
      );
      --_slider-inactive-track-start-shape: var(
        --m3e-slider-extra-large-inactive-active-track-start-shape,
        ${DesignToken.shape.corner.extraLargeStart}
      );
      --_slider-inactive-track-end-shape: var(
        --m3e-slider-extra-large-inactive-track-end-shape,
        ${DesignToken.shape.corner.extraLargeEnd}
      );
    }
    :host([size="extra-large"]) .track {
      height: var(--m3e-slider-extra-large-track-height, 6rem);
    }
    :host(.-animating) .track-active,
    :host(.-animating) .track-inactive.start,
    :host(.-animating) .track-inactive.end {
      transition: ${unsafeCSS(`margin-left ${DesignToken.motion.spring.fastEffects},
        width ${DesignToken.motion.spring.fastEffects}`)};
    }
    .base {
      display: inline-flex;
      align-items: center;
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: inherit;
      outline: none;
    }
    .track {
      position: relative;
      flex: 1 1 auto;
    }
    .track-inactive,
    .track-active {
      position: absolute;
      height: 100%;
    }
    .track-active {
      margin-left: var(--_slider-active-track-offset, 0px);
      width: var(--_slider-active-track-size, 0px);
      border-radius: var(--_slider-active-track-middle-shape, var(--_slider-active-track-shape));
    }
    .track-inactive.start {
      width: var(--_slider-inactive-track-before-size, 0px);
      border-radius: var(--_slider-inactive-track-start-shape);
    }
    .track-inactive.end {
      margin-left: var(--_slider-inactive-track-after-offset, 0px);
      width: var(--_slider-inactive-track-after-size, 0px);
      border-radius: var(--_slider-inactive-track-end-shape);
    }
    .ticks {
      position: absolute;
      width: 100%;
      height: var(--m3e-slider-tick-size, 0.25rem);
      overflow: visible;
    }
    .tick {
      position: absolute;
      top: 0;
      left: calc(var(--m3e-slider-tick-size, 0.25rem) + calc(var(--m3e-slider-tick-size, 0.25rem) / 2));
      width: var(--m3e-slider-tick-size, 0.25rem);
      height: var(--m3e-slider-tick-size, 0.25rem);
      border-radius: var(--m3e-slider-tick-shape, ${DesignToken.shape.corner.full});
    }
    :host(:not([disabled])) .track-inactive {
      background-color: var(--m3e-slider-inactive-track-color, ${DesignToken.color.secondaryContainer});
    }
    :host([disabled]) .track-inactive {
      background-color: color-mix(
        in srgb,
        var(--m3e-slider-disabled-inactive-track-color, ${DesignToken.color.onSurface})
          var(--m3e-slider-disabled-inactive-track-opacity, 12%),
        transparent
      );
    }
    :host(:not([disabled])) .track-active {
      background-color: var(--m3e-slider-active-track-color, ${DesignToken.color.primary});
    }
    :host([disabled]) .track-active {
      background-color: color-mix(
        in srgb,
        var(--m3e-slider-disabled-active-track-color, ${DesignToken.color.onSurface})
          var(--m3e-slider-disabled-active-track-opacity, 38%),
        transparent
      );
    }
    :host(:not([disabled])) .tick.active {
      background-color: var(--m3e-slider-tick-active-color, ${DesignToken.color.onPrimary});
    }
    :host([disabled]) .tick.active {
      background-color: var(--m3e-slider-disabled-tick-active-color, ${DesignToken.color.inverseOnSurface});
    }
    :host(:not([disabled])) .tick.inactive {
      background-color: var(--m3e-slider-tick-inactive-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host([disabled]) .tick.inactive {
      background-color: var(--m3e-slider-disabled-tick-inactive-color, ${DesignToken.color.onSurface});
    }
    :host(:not([discrete])) .tick.active {
      display: none;
    }
    :host(:hover[labelled]) .base,
    :host(:focus-within[labelled]) .base {
      --_slider-label-visibility: visible;
      --_slider-label-opacity: 1;
      --_slider-label-transform: scale(1);
    }
    @media (forced-colors: active) {
      :host(:not([disabled])) .track-inactive {
        background-color: unset;
      }
      :host(:not([disabled])) .base.range .track-inactive.start,
      :host(:not([disabled])) .track-inactive.end {
        border: 1px solid CanvasText;
        box-sizing: border-box;
      }
      :host(:not([disabled])) .tick.inactive {
        background-color: CanvasText;
      }
      :host(:not([disabled])) .tick.active {
        background-color: Canvas;
      }
      :host(:not([disabled])) .track-active {
        background-color: CanvasText;
      }
      :host([disabled]) .base.range .track-inactive.start,
      :host([disabled]) .track-inactive.end {
        border: 1px solid GrayText;
        box-sizing: border-box;
      }
      :host([disabled]) .track-active {
        background-color: GrayText;
      }
      :host([disabled]) .tick.inactive {
        background-color: GrayText;
      }
      :host([disabled]) .tick.active {
        background-color: Canvas;
      }
    }
  `;

  /** @private */
  @query(".base") private readonly _base?: HTMLElement;

  /** @private */
  @state() private _ticks = new Array<{ value: number; active: boolean }>();

  /** @private */ #thumbs = new Array<M3eSliderThumbElement>();
  /** @private */ #activeThumb?: M3eSliderThumbElement;
  /** @private */ #cachedWidth = 0;
  /** @private */ #cachedThumbWidth = 0;
  /** @private */ #cachedLeft = 0;

  constructor() {
    super();
    new ResizeController(this, { callback: () => this.#updateDimensions(true) });
  }

  /**
   * The size of the slider.
   * @default "extra-small"
   */
  @property({ reflect: true }) size: SliderSize = "extra-small";

  /**
   * Whether the element is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether to show tick marks.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) discrete = false;

  /**
   * The minimum allowable value.
   * @default 0
   */
  @property({ type: Number }) min = 0;

  /**
   * The maximum allowable value.
   * @default 100
   */
  @property({ type: Number }) max = 100;

  /**
   * The value at which the thumb will snap.
   * @default 1
   */
  @property({ type: Number }) step = 1;

  /**
   * Whether to show value labels when activated.
   * @default false
   */
  @property({ type: Boolean }) labelled = false;

  /** The function used to format display values. */
  @property({ attribute: false }) displayWith: ((value: number | null) => string) | null = null;

  /** The thumbs used to select values. */
  get thumbs(): readonly M3eSliderThumbElement[] {
    return this.#thumbs;
  }

  /** Whether the slider is a range slider. */
  get isRange(): boolean {
    return this.#thumbs.length > 1;
  }

  /** The thumb used to select a value. */
  get thumb(): M3eSliderThumbElement | null {
    return this.#thumbs[0] ?? null;
  }

  /** The thumb used to select the lower value of a range slider. */
  get lowerThumb(): M3eSliderThumbElement | null {
    return this.thumb;
  }

  /** The thumb used to select the upper value of a range slider. */
  get upperThumb(): M3eSliderThumbElement | null {
    return this.#thumbs[1] ?? null;
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("disabled")) {
      this.#thumbs.forEach((x) => (x.disabled = this.disabled));
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div
      class="base"
      tabindex="${ifDefined(!this.disabled ? "-1" : undefined)}"
      @pointerdown="${this.#handlePointerDown}"
      @pointermove="${this.#handlePointerMove}"
      @pointerup="${this.#handlePointerUp}"
      @keydown="${this.#handleKeyDown}"
      @value-change="${this.#handleThumbChange}"
    >
      <div class="track" aria-hidden="true">
        <div class="track-inactive start"></div>
        <div class="track-active"></div>
        <div class="track-inactive end"></div>
      </div>
      <div class="ticks" aria-hidden="true">${this._ticks.map((x) => this.#renderTick(x))}</div>
      <slot @slotchange="${this.#handleSlotChange}"></slot>
    </div>`;
  }

  /** @private */
  #renderTick(tick: { value: number; active: boolean }) {
    return html`<div
      class="tick ${tick.active ? "active" : "inactive"}"
      style="${safeStyleMap({
        transform: `translate(${this.#pointFromValue(tick.value)}px, 0)`,
      })}"
    ></div>`;
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#thumbs = (<HTMLSlotElement>e.target)
      .assignedElements({ flatten: true })
      .filter((x) => x instanceof M3eSliderThumbElement);

    if (this.#thumbs.length > 2) {
      this.#thumbs.length = 2;
    }
    if (this.isRange) {
      this._base?.style.setProperty("--_slider-active-track-middle-shape", `0`);
    } else {
      this._base?.style.removeProperty("--_slider-active-track-middle-shape");
    }

    this.#updateThumbs();
  }

  /** @private */
  #updateThumbs(): void {
    this.#thumbs.forEach((thumb, i) => {
      if (this.disabled) {
        thumb.disabled = true;
      }
      thumb.ariaValueMin = `${this.#thumbs[i - 1]?.value ?? this.min}`;
      thumb.ariaValueMax = `${this.#thumbs[i + 1]?.value ?? this.max}`;
      thumb.ariaValueNow = `${thumb.value ?? this.#thumbs[i - 1]?.value ?? this.min}`;
    });
  }

  /** @private */
  #pointFromValue(value: number): number {
    return (this.#cachedWidth - this.#cachedThumbWidth) * ((value - this.min) / (this.max - this.min));
  }

  /** @private */
  #valueFromPoint(e: PointerEvent): number {
    const pos = e.clientX - this.#cachedLeft;
    const step = this.step === 0 ? 1 : this.step;
    const numSteps = Math.floor((this.max - this.min) / step);
    const percentage = pos / this.#cachedWidth;
    const fixedPercentage = Math.round(percentage * numSteps) / numSteps;
    const impreciseValue = fixedPercentage * (this.max - this.min) + this.min;
    return Math.round(impreciseValue / step) * step;
  }

  /** @private */
  #updateCachedDimensions(force = false): void {
    if (!this.lowerThumb) return;
    this.#cachedWidth = !force && this.#cachedWidth > 0 ? this.#cachedWidth : this.clientWidth;
    this.#cachedThumbWidth =
      !force && this.#cachedThumbWidth > 0 ? this.#cachedThumbWidth : this.lowerThumb.clientWidth;
    this.#cachedLeft = !force && this.#cachedLeft > 0 ? this.#cachedLeft : this.getBoundingClientRect().left;
  }

  /** @private */
  #updateDimensions(force = false): void {
    this.#updateCachedDimensions(force);
    if (!this.lowerThumb) return;

    const lowerValue = this.lowerThumb.value ?? this.min;
    const lowerPos = this.#pointFromValue(lowerValue);
    this.lowerThumb.style.transform = `translate(${lowerPos}px, 0)`;

    if (!this.upperThumb) {
      this._base?.classList.toggle("range", false);
      this._base?.style.setProperty("--_slider-active-track-size", `${lowerPos}px`);
      this._base?.style.setProperty("--_slider-inactive-track-after-offset", `${lowerPos + this.#cachedThumbWidth}px`);
      this._base?.style.setProperty(
        "--_slider-inactive-track-after-size",
        `${this.#cachedWidth - lowerPos - this.#cachedThumbWidth}px`
      );

      this.#updateTicks((i) => i < lowerValue);
    } else {
      const upperValue = this.upperThumb.value ?? lowerValue;
      const upperPos = this.#pointFromValue(upperValue);
      this.upperThumb.style.transform = `translate(${upperPos}px, 0)`;

      this._base?.classList.toggle("range", true);
      this._base?.style.setProperty("--_slider-inactive-track-before-size", `${lowerPos}px`);
      this._base?.style.setProperty("--_slider-active-track-offset", `${lowerPos + this.#cachedThumbWidth}px`);
      this._base?.style.setProperty("--_slider-active-track-size", `${upperPos - lowerPos - this.#cachedThumbWidth}px`);
      this._base?.style.setProperty("--_slider-inactive-track-after-offset", `${upperPos + this.#cachedThumbWidth}px`);
      this._base?.style.setProperty(
        "--_slider-inactive-track-after-size",
        `${this.#cachedWidth - this.#cachedThumbWidth - upperPos}px`
      );

      this.#updateTicks((i) => i > lowerValue && i < upperValue);
    }
  }

  /** @private */
  #updateTicks(active: (value: number) => boolean): void {
    this._ticks = [];
    if (this.discrete && this.step > 1) {
      for (let i = this.min; i <= this.max; i += this.step) {
        this._ticks.push({ value: i, active: active(i) });
      }
    } else {
      this._ticks.push({ value: this.min, active: active(this.min) });
      if (this.min < 0 && this.max > 0) {
        this._ticks.push({ value: 0, active: active(0) });
      }
      this._ticks.push({ value: this.max, active: active(this.max) });
    }
  }

  /** @private */
  #handlePointerDown(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;
    if (!this.lowerThumb || this.disabled) return;

    if (e.target instanceof HTMLElement) {
      e.target.setPointerCapture(e.pointerId);
    }

    this.#activeThumb = e.composedPath().find((x) => x instanceof M3eSliderThumbElement) as
      | M3eSliderThumbElement
      | undefined;

    if (this.#activeThumb) {
      return;
    }

    const value = this.#valueFromPoint(e);
    if (!this.upperThumb) {
      if (!this.lowerThumb.disabled) {
        this.#changeThumb(this.lowerThumb, value, true);
        this.#activeThumb = this.lowerThumb;
      }
    } else {
      const lowerValue = this.lowerThumb.value ?? this.min;
      const upperValue = this.upperThumb.value ?? lowerValue;

      if (value < lowerValue) {
        if (!this.lowerThumb.disabled) {
          this.#changeThumb(this.lowerThumb, value, true);
          this.#activeThumb = this.lowerThumb;
        }
      } else if (value > upperValue) {
        if (!this.upperThumb.disabled) {
          this.#changeThumb(this.upperThumb, value, true);
          this.#activeThumb = this.upperThumb;
        }
      } else {
        const mid = (lowerValue + upperValue) / 2;
        if (value < mid && !this.lowerThumb.disabled) {
          this.#changeThumb(this.lowerThumb, value, true);
          this.#activeThumb = this.lowerThumb;
        } else if (!this.upperThumb.disabled) {
          this.#changeThumb(this.upperThumb, value, true);
          this.#activeThumb = this.upperThumb;
        }
      }
    }
  }

  #handlePointerMove(e: PointerEvent): void {
    if (!(e.target instanceof HTMLElement) || !e.target.hasPointerCapture(e.pointerId) || !this.#activeThumb) return;

    const value = this.#valueFromPoint(e);
    let min = this.min;
    let max = this.max;

    if (this.#activeThumb === this.upperThumb) {
      min = Math.max(min, this.lowerThumb?.value ?? 0);
    } else if (this.upperThumb) {
      max = Math.min(max, this.upperThumb.value ?? this.max);
    }

    if (this.classList.contains("-animating")) {
      this.classList.toggle("-animating", false);
      this.#activeThumb.style.transition = "";
    }

    this.#changeThumb(this.#activeThumb, Math.min(max, Math.max(min, value)));
  }

  /** @private */
  #handlePointerUp(e: PointerEvent): void {
    if (e.pointerType === "mouse" && e.button > 1) return;
    if (!this.lowerThumb || this.disabled) return;

    if (e.target instanceof HTMLElement) {
      e.target.releasePointerCapture(e.pointerId);
    }

    if (this.#activeThumb) {
      this.#activeThumb.focus();
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#activeThumb = e.composedPath().find((x) => x instanceof M3eSliderThumbElement) as
      | M3eSliderThumbElement
      | undefined;

    if (!this.#activeThumb) return;

    const value = this.#activeThumb.value ?? 0;

    let min = this.min;
    let max = this.max;

    if (this.#activeThumb === this.upperThumb) {
      min = Math.max(min, this.lowerThumb?.value ?? 0);
    } else if (this.upperThumb) {
      max = Math.max(max, this.upperThumb.value ?? this.max);
    }

    switch (e.key) {
      case "Home":
        this.#changeThumb(this.#activeThumb, min);
        e.preventDefault();
        break;

      case "End":
        this.#changeThumb(this.#activeThumb, max);
        e.preventDefault();
        break;

      case "PageUp":
        this.#changeThumb(this.#activeThumb, Math.min(max, value + (this.step > 1 ? this.step : 10)));
        e.preventDefault();
        break;

      case "PageDown":
        this.#changeThumb(this.#activeThumb, Math.max(min, value - (this.step > 1 ? this.step : 10)));
        e.preventDefault();
        break;

      case "Down":
      case "ArrowDown":
      case "Left":
      case "ArrowLeft":
        this.#changeThumb(this.#activeThumb, Math.max(min, value - this.step));
        e.preventDefault();
        break;

      case "Up":
      case "ArrowUp":
      case "Right":
      case "ArrowRight":
        this.#changeThumb(this.#activeThumb, Math.min(max, value + this.step));
        e.preventDefault();
        break;

      case " ":
        e.preventDefault();
        break;
    }
  }

  /** @private */
  #handleThumbChange(e: Event): void {
    e.stopPropagation();
    this.#updateThumbs();
    this.#updateDimensions();
  }

  /** @private */
  #changeThumb(thumb: M3eSliderThumbElement, value: number, animate = false): void {
    if (thumb.value === value) return;
    const prev = thumb.value;
    if (animate && !prefersReducedMotion()) {
      this.classList.toggle("-animating", true);
      thumb.addEventListener(
        "transitionend",
        () => {
          thumb.style.transition = "";
          this.classList.toggle("-animating", false);
        },
        { once: true }
      );
      thumb.style.transition = `transform ${DesignToken.motion.spring.fastEffects}`;
    }
    thumb.value = value;
    thumb.markAsDirty();
    thumb.markAsTouched();
    if (thumb.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true }))) {
      thumb.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    } else {
      thumb.value = prev;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-slider": M3eSliderElement;
  }
}
