import { css, CSSResultGroup, html, nothing, PropertyValues, svg } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { AnimationLoopController, DesignToken, ResizeController, resolveFragmentUrl } from "@m3e/core";

import { ProgressElementIndicatorBase } from "./ProgressElementIndicatorBase";

const WAVY_INDETERMINATE_DURATION = 1.575;
/**
 * A circular indicator of progress and activity.
 *
 * @description
 * The `m3e-circular-progress-indicator` component displays a circular progress spinner for
 * tracking the completion of a task or process. It supports determinate and indeterminate
 * modes, and can be customized with CSS custom properties for diameter, stroke width, and
 * color. The component is accessible, animates smoothly, and adapts to various use cases including
 * loading and activity indication.
 *
 * @example
 * The following example illustrates a determinate circular progress indicator.
 * ```html
 * <m3e-circular-progress-indicator value="30"></m3e-circular-progress-indicator>
 * ```
 * @example
 * The next example illustrates an indeterminate circular progress indicator using the `indeterminate` attribute.
 * ```html
 * <m3e-circular-progress-indicator indeterminate></m3e-circular-progress-indicator>
 * ```
 *
 * @tag m3e-circular-progress-indicator
 *
 * @slot - Renders the content inside the progress indicator.
 *
 * @attr indeterminate - Whether to show something is happening without conveying progress.
 * @attr max - The maximum progress value.
 * @attr value - A fractional value, between 0 and `max`, indicating progress.
 * @attr variant - The appearance of the indicator.
 *
 * @cssprop --m3e-circular-flat-progress-indicator-diameter - Diameter of the `flat` variant.
 * @cssprop --m3e-circular-wavy-progress-indicator-diameter - Diameter of the `wavy` variant.
 * @cssprop --m3e-circular-wavy-progress-indicator-amplitude - Amplitude of the `wavy` variant.
 * @cssprop --m3e-circular-wavy-progress-indicator-wavelength - Wavelength of the `wavy` variant.
 * @cssprop --m3e-circular-progress-indicator-thickness - Thickness of the progress indicator.
 * @cssprop --m3e-progress-indicator-track-color - Track color of the progress indicator (background).
 * @cssprop --m3e-progress-indicator-color - Color of the progress indicator (foreground).
 */
@customElement("m3e-circular-progress-indicator")
export class M3eCircularProgressIndicatorElement extends ProgressElementIndicatorBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    ProgressElementIndicatorBase.styles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
        aspect-ratio: 1;
        position: relative;
        align-items: center;
        justify-content: center;
        contain: strict;
      }
      .progress {
        --_arc-duration: 1333ms;
        --_cycle-duration: calc(4 * var(--_arc-duration));
        --_linear-rotate-duration: calc(var(--_arc-duration) * 360 / 306);
        --_indeterminate-easing: cubic-bezier(0.4, 0, 0.2, 1);
      }
      .active-track {
        transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
      }
      :host([variant="flat"]) .progress {
        flex: 1;
        align-self: stretch;
        pointer-events: none;
      }
      .progress,
      .spinner,
      .left,
      .right,
      .content,
      .circle {
        position: absolute;
        inset: 0;
      }
      .content {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .diameter-and-stroke,
      .amplitude-and-wavelength {
        visibility: hidden;
        position: absolute;
      }
      .diameter-and-stroke {
        width: inherit;
        height: var(--m3e-circular-progress-indicator-thickness, 0.25rem);
      }
      .amplitude-and-wavelength {
        width: var(--m3e-circular-wavy-progress-indicator-amplitude, 0.1rem);
        height: var(--m3e-circular-wavy-progress-indicator-wavelength, 0.9375rem);
      }
      :host([variant="flat"]) {
        width: var(--m3e-circular-flat-progress-indicator-diameter, 2.5rem);
      }
      :host([variant="wavy"]) {
        width: var(--m3e-circular-wavy-progress-indicator-diameter, 3rem);
      }
      :host([variant="flat"][indeterminate]) {
        content-visibility: auto;
      }
      :host([variant="flat"][indeterminate]) .progress {
        animation: linear infinite linear-rotate;
        animation-duration: var(--_linear-rotate-duration);
      }
      :host([variant="flat"][indeterminate]) .spinner {
        animation: infinite both rotate-arc;
        animation-duration: var(--_cycle-duration);
        animation-timing-function: var(--_indeterminate-easing);
      }
      :host([variant="wavy"][indeterminate]) .spinner {
        transform-origin: 50% 50%;
        animation: wavy-spin ${WAVY_INDETERMINATE_DURATION}s linear infinite;
      }
      .left {
        clip-path: inset(0);
        inset: 0 50% 0 0;
      }
      .right {
        clip-path: inset(0);
        inset: 0 0 0 50%;
      }
      .circle {
        animation: expand-arc;
        animation-iteration-count: infinite;
        animation-fill-mode: both;
        animation-duration: var(--_arc-duration), var(--_cycle-duration);
        animation-timing-function: var(--_indeterminate-easing);
      }
      .left .circle {
        rotate: 135deg;
        inset: 0 -100% 0 0;
      }
      .right .circle {
        rotate: 100deg;
        inset: 0 0 0 -100%;
        animation-delay: calc(-0.5 * var(--_arc-duration)), 0ms;
      }
      .track {
        color: var(--m3e-progress-indicator-track-color, ${DesignToken.color.secondaryContainer});
      }
      .active-track {
        color: var(--m3e-progress-indicator-color, ${DesignToken.color.primary});
      }
      .wave {
        animation: spin-reverse 8s linear infinite;
        transform-origin: 50% 50%;
      }
      @keyframes expand-arc {
        0% {
          transform: rotate(265deg);
        }
        50% {
          transform: rotate(130deg);
        }
        100% {
          transform: rotate(265deg);
        }
      }
      @keyframes rotate-arc {
        12.5% {
          transform: rotate(135deg);
        }
        25% {
          transform: rotate(270deg);
        }
        37.5% {
          transform: rotate(405deg);
        }
        50% {
          transform: rotate(540deg);
        }
        62.5% {
          transform: rotate(675deg);
        }
        75% {
          transform: rotate(810deg);
        }
        87.5% {
          transform: rotate(945deg);
        }
        100% {
          transform: rotate(1080deg);
        }
      }
      @keyframes linear-rotate {
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes spin-reverse {
        from {
          transform: rotate(360deg);
        }
        to {
          transform: rotate(0deg);
        }
      }
      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
      @keyframes wavy-spin {
        0% {
          transform: rotate(0deg);
        }
        10% {
          transform: rotate(90deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      @media (forced-colors: active) {
        :host([variant="flat"]) circle {
          fill: Canvas;
        }
        :host([variant="flat"]) .circle {
          border-color: var(--m3e-progress-indicator-color, ${DesignToken.color.primary})
            var(--m3e-progress-indicator-color, ${DesignToken.color.primary}) Canvas Canvas;
        }
      }
      @media (forced-colors: active) {
        .progress {
          --m3e-progress-indicator-track-color: GrayText;
          --m3e-progress-indicator-color: CanvasText;
        }
      }
    `,
  ];

  /** @private */ private static __nextMaskId = 0;
  /** @private */ #maskId = `m3e-circular-progress-mask-${M3eCircularProgressIndicatorElement.__nextMaskId++}`;

  /** @private */ #diameter = 0;
  /** @private */ #strokeWidth = 0;
  /** @private */ #amplitude = 0;
  /** @private */ #wavelength = 0;

  /** @private */ #spinnerActiveTrack?: SVGPathElement | null;
  /** @private */ #spinnerTrack?: SVGPathElement | null;

  /** @private */ readonly #resizeController = new ResizeController(this, {
    skipInitial: true,
    target: null,
    callback: () => {
      this.#updateDiameterAndStroke();
      this.#updateAmplitudeAndWavelength();
    },
  });

  /** @private */ readonly #indeterminateWavyAnimationLoop = new AnimationLoopController(this, (_, t) =>
    this.#updateWavyIndeterminateSpinner(t)
  );

  /**
   * Whether to show something is happening without conveying progress.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("indeterminate")) {
      this.ariaValueNow = this.indeterminate ? null : `${this.value}`;
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    const diameterAndStroke = this.shadowRoot?.querySelector<HTMLElement>(".diameter-and-stroke");
    if (diameterAndStroke) {
      this.#updateDiameterAndStroke();
      this.#resizeController.observe(diameterAndStroke);
    }

    const amplitudeAndWavelength = this.shadowRoot?.querySelector<HTMLElement>(".amplitude-and-wavelength");
    if (amplitudeAndWavelength) {
      this.#updateDiameterAndStroke();
      this.#resizeController.observe(amplitudeAndWavelength);
    }
  }

  /** @inheritdoc */
  override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("indeterminate")) {
      this.#spinnerActiveTrack = this.shadowRoot?.querySelector<SVGPathElement>(".spinner.active-track");
      this.#spinnerTrack = this.shadowRoot?.querySelector<SVGPathElement>(".spinner.track");

      if (this.indeterminate) {
        this.#indeterminateWavyAnimationLoop.start();
      } else {
        this.#indeterminateWavyAnimationLoop.stop();
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return this.variant === "wavy" ? this.#renderWavyIndicator() : this.#renderFlatIndicator();
  }

  /** @private */
  #renderFlatIndicator(): unknown {
    if (this.indeterminate) {
      const left = this.#drawArc({ startAngle: -45, endAngle: 90 + this.#strokeWidth });
      const right = this.#drawArc({ startAngle: -this.#strokeWidth, endAngle: 135 });

      return html`<div class="progress" aria-hidden="true">
          <div class="spinner">
            <div class="left">
              <svg viewBox="${left.viewBox}" class="circle">
                <path
                  class="active-track"
                  d="${left.path}"
                  stroke="currentColor"
                  stroke-width=${this.#strokeWidth}
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <div class="right">
              <svg viewBox="${right.viewBox}" class="circle">
                <path
                  class="active-track"
                  d="${right.path}"
                  stroke="currentColor"
                  stroke-width=${this.#strokeWidth}
                  fill="none"
                  stroke-linecap="round"
                />
              </svg>
            </div>
          </div>
        </div>
        ${this.#renderResizeObservedElements()}`;
    }

    const minDegrees = this.#sizeToDegrees(this.#strokeWidth * 2, this.#diameter);
    let degrees = (this.value / this.max) * 360;
    if (degrees > 0) {
      degrees = Math.max(0, minDegrees, degrees);
    }

    const active = this.#drawArc({ gap: degrees < 360 ? this.#strokeWidth : 0, endAngle: degrees });
    const inactive = this.#drawArc({ gap: degrees > 0 ? this.#strokeWidth : 0, startAngle: degrees, endAngle: 360 });

    return html`<div class="progress" aria-hidden="true">
        <svg viewBox="${active.viewBox}">
          ${degrees > 0
            ? svg`<path
            class="active-track"
            d="${active.path}"
            stroke="currentColor"
            stroke-width=${this.#strokeWidth}
            fill="none"
            stroke-linecap="round"
          />`
            : nothing}
          ${360 - degrees >= minDegrees
            ? svg`<path
                class="track"
                d="${inactive.path}"
                stroke="currentColor"
                stroke-width=${this.#strokeWidth}
                fill="none"
                stroke-linecap="round"
              />`
            : nothing}
        </svg>
      </div>
      ${this.#renderResizeObservedElements()}${this.#renderContent()}`;
  }

  /** @private */
  #renderWavyIndicator(): unknown {
    if (this.indeterminate) {
      return html`<div class="progress" aria-hidden="true">
          <svg viewBox="${this.#drawWavyArc({ endAngle: 20 }).viewBox}">
            <path
              class="spinner active-track"
              stroke="currentColor"
              stroke-width=${this.#strokeWidth}
              stroke-linecap="round"
              stroke-linejoin="round"
              fill="none"
            />
            <path
              class="spinner track"
              stroke="currentColor"
              stroke-width=${this.#strokeWidth}
              fill="none"
              stroke-linecap="round"
            />
          </svg>
        </div>
        ${this.#renderResizeObservedElements()}`;
    }

    const minDegrees = this.#sizeToDegrees(this.#strokeWidth * 2, this.#diameter);
    let degrees = (this.value / this.max) * 360;
    if (degrees > 0) {
      degrees = Math.max(0, minDegrees, degrees);
    }

    const amplitude = degrees <= minDegrees + minDegrees / 2 || degrees == 360 ? 0 : this.#amplitude;
    const activeArc = this.#drawArc({ gap: degrees < 360 ? this.#strokeWidth : 0, endAngle: degrees });
    const active = amplitude == 0 ? activeArc : this.#drawWavyArc({ endAngle: 360, amplitude });
    const inactive = this.#drawArc({ gap: degrees > 0 ? this.#strokeWidth : 0, startAngle: degrees, endAngle: 360 });
    const padding = amplitude > 0 ? amplitude + this.#strokeWidth / 2 : this.#strokeWidth;

    return html`
      <svg class="progress" viewBox="${inactive.viewBox}" aria-hidden="true">
        ${degrees > 0
          ? svg`${
              amplitude > 0
                ? svg`<defs>
          <mask id="${this.#maskId}">
            <path
              d="${activeArc.path}"
              stroke="white"
              stroke-width="${this.#strokeWidth + padding}"
              fill="none"
              stroke-linecap="round"
            />
          </mask>
        </defs>`
                : nothing
            }
        <g class="active-track" mask="${ifDefined(amplitude > 0 ? resolveFragmentUrl(this.#maskId) : undefined)}">
          <path
            class="${classMap({ wave: amplitude > 0 })}"
            d="${active.path}"
            stroke="currentColor"
            stroke-width=${this.#strokeWidth}
            stroke-linecap="round"
            stroke-linejoin="round"
            fill="none"
          />
        </g>`
          : nothing}
        ${360 - degrees >= minDegrees
          ? svg`<path
                class="track"
                d="${inactive.path}"
                stroke="currentColor"
                stroke-width=${this.#strokeWidth}
                fill="none"
                stroke-linecap="round"
              />`
          : nothing}
      </svg>
      ${this.#renderResizeObservedElements()}${this.#renderContent()}
    `;
  }

  /** @private */
  #renderResizeObservedElements(): unknown {
    return html`<div class="diameter-and-stroke" aria-hidden="true"></div>
      <div class="amplitude-and-wavelength" aria-hidden="true"></div>`;
  }

  /** @private */
  #renderContent(): unknown {
    return html`<div class="content" aria-hidden="true"><slot></slot></div>`;
  }

  /** @private */
  #updateDiameterAndStroke(): void {
    const element = this.shadowRoot?.querySelector<HTMLElement>(".diameter-and-stroke");
    if (element) {
      this.#diameter = element.clientWidth;
      this.#strokeWidth = element.clientHeight;
    }
  }

  /** @private */
  #updateAmplitudeAndWavelength(): void {
    const element = this.shadowRoot?.querySelector<HTMLElement>(".amplitude-and-wavelength");
    if (element) {
      this.#amplitude = element.clientWidth;
      this.#wavelength = element.clientHeight;
    }
  }

  /** @private */
  #updateWavyIndeterminateSpinner(t: number): void {
    if (this.#amplitude === 0 || this.#wavelength === 0) return;

    const sweep = this.#computeWavyIndeterminateSweep(t);
    this.#spinnerActiveTrack?.setAttribute("d", this.#drawWavyArc({ endAngle: sweep }).path);
    this.#spinnerTrack?.setAttribute(
      "d",
      this.#drawArc({
        gap: this.#sizeToDegrees(this.#strokeWidth, this.#diameter),
        startAngle: sweep,
      }).path
    );
  }

  /** @private */
  #computeWavyIndeterminateSweep(t: number): number {
    const sweepPadding = this.#sizeToDegrees(this.#strokeWidth) * 2;
    const minSweep = 18 + sweepPadding;
    const maxSweep = 280 - sweepPadding;

    const duration = WAVY_INDETERMINATE_DURATION;
    const holdMin = duration;
    const growTime = duration;
    const holdMax = duration;
    const shrinkTime = duration;

    const cycle = holdMin + growTime + holdMax + shrinkTime;
    const u = t % cycle;

    if (u < holdMin) {
      return minSweep;
    }

    if (u < holdMin + growTime) {
      const p = (u - holdMin) / growTime;
      return minSweep + (maxSweep - minSweep) * (p * p * (3 - 2 * p));
    }

    if (u < holdMin + growTime + holdMax) {
      return maxSweep;
    }

    const p = (u - (holdMin + growTime + holdMax)) / shrinkTime;
    return maxSweep - (maxSweep - minSweep) * (p * p * (3 - 2 * p));
  }

  /** @private */
  #sizeToDegrees(size: number, padding = this.#amplitude): number {
    return size * (360 / (2 * Math.PI * this.#computeCircle(padding).r));
  }

  /** @private */
  #degreesToRadians(degrees: number) {
    return (degrees - 90) * (Math.PI / 180);
  }

  /** @private */
  #polarToCartesian(circle: { cx: number; cy: number; r: number }, degrees: number) {
    const rad = this.#degreesToRadians(degrees);
    return {
      x: circle.cx + circle.r * Math.cos(rad),
      y: circle.cy + circle.r * Math.sin(rad),
    };
  }

  /** @private */
  #computeCircle(padding: number) {
    padding = padding + this.#strokeWidth / 2;
    const r = this.#diameter / 2;
    const cx = r + padding;
    const cy = r + padding;
    return { cx, cy, r, padding };
  }

  /** @private */
  #drawArc({
    startAngle = 0,
    endAngle = 360,
    gap = 0,
    padding = this.#amplitude,
  }: {
    startAngle?: number;
    endAngle?: number;
    gap?: number;
    padding?: number;
  }) {
    if (this.#diameter === 0 || this.#strokeWidth === 0) return { path: "", viewBox: "0 0 0 0" };

    const circle = this.#computeCircle(padding);
    if (gap > 0) {
      startAngle += this.#sizeToDegrees(gap, padding);
      endAngle -= this.#sizeToDegrees(gap, padding);
    }
    if (endAngle - startAngle >= 360) {
      endAngle = startAngle + 359.999;
    }
    const start = this.#polarToCartesian(circle, endAngle);
    const end = this.#polarToCartesian(circle, startAngle);

    const path = `M ${start.x} ${start.y} A ${circle.r} ${circle.r} 0 ${endAngle - startAngle <= 180 ? "0" : "1"} 0 ${end.x} ${end.y}`;
    const viewBox = `0 0 ${this.#diameter + circle.padding * 2} ${this.#diameter + circle.padding * 2}`;
    return { path, viewBox };
  }

  /** @private */
  #drawWavyArc({
    startAngle = 0,
    endAngle = 360,
    gap = 0,
    padding = this.#amplitude,
    amplitude = this.#amplitude,
    steps = 200,
  }: {
    startAngle?: number;
    endAngle?: number;
    gap?: number;
    padding?: number;
    amplitude?: number;
    steps?: number;
  }) {
    if (this.#diameter === 0 || this.#strokeWidth === 0) return { path: "", viewBox: "0 0 0 0" };

    const circle = this.#computeCircle(padding);

    if (gap > 0) {
      startAngle += this.#sizeToDegrees(gap, padding);
      endAngle -= this.#sizeToDegrees(gap, padding);
    }

    const startRad = this.#degreesToRadians(startAngle);
    let endRad = this.#degreesToRadians(endAngle);

    if (startAngle === endAngle) {
      endRad = startRad;
    } else if (endRad < startRad) {
      endRad += Math.PI * 2;
    }

    const totalAngle = endRad - startRad;
    const waveCount = (2 * Math.PI * circle.r) / this.#wavelength;
    const phase = (Math.PI / 2) * (waveCount - 1);

    const points: [number, number][] = [];

    for (let i = 0; i <= steps; i++) {
      const t = steps === 0 ? 0 : i / steps;
      const angle = startRad + t * totalAngle;
      const wave = Math.sin(angle * waveCount + phase);
      const radius = circle.r - amplitude * wave;
      const x = radius * Math.cos(angle) + circle.cx;
      const y = radius * Math.sin(angle) + circle.cy;
      points.push([x, y]);
    }

    const path =
      points.length === 1
        ? `M ${points[0][0]},${points[0][1]}`
        : `M ${points[0][0]},${points[0][1]} ` +
          points
            .slice(1)
            .map(([x, y]) => `L ${x},${y}`)
            .join(" ");

    const viewBox = `0 0 ${this.#diameter + circle.padding * 2} ${this.#diameter + circle.padding * 2}`;
    return { path, viewBox };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-circular-progress-indicator": M3eCircularProgressIndicatorElement;
  }
}
