import { css, CSSResultGroup, html, nothing, PropertyValues, svg } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";

import { AnimationLoopController, customElement, DesignToken, ResizeController } from "@m3e/web/core";

import { ProgressElementIndicatorBase } from "./ProgressElementIndicatorBase";

import {
  circularProgressArc,
  CircularProgressArcOptions,
  circularProgressSizeToDegrees,
  createCircularProgressCircle,
} from "./CircularProgressGeometry";

import {
  CircularWavyGeometry,
  circularWavyPath,
  circularWavyWaveCount,
  createCircularWavyGeometry,
} from "./CircularWavyGeometry";

import { circularWavyMotion } from "./CircularWavyMotion";
import { WavyAmplitude, wavyAmplitudeTarget, wavyProgress } from "./WavyAmplitude";

const WAVY_DEFAULT_AMPLITUDE = 1.6;

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
 * Set `value` to show circular progress toward `max`. The default slot can display the value.
 *
 * ```html
 * <m3e-circular-progress-indicator value="25">25</m3e-circular-progress-indicator>
 * <m3e-circular-progress-indicator variant="wavy" value="25">25</m3e-circular-progress-indicator>
 * ```
 *
 * @example
 * Use `indeterminate` when circular progress cannot be measured.
 *
 * ```html
 * <m3e-circular-progress-indicator indeterminate></m3e-circular-progress-indicator>
 * <m3e-circular-progress-indicator variant="wavy" indeterminate></m3e-circular-progress-indicator>
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
 * @cssprop --m3e-circular-wavy-progress-indicator-amplitude - Rounded-star deformation of the `wavy` variant; 1.6px is the default shape and 0px is flat.
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
      }
      :host([hidden]) {
        display: none;
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
      :host(:is(:state(--flat), :--flat)) .progress {
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
        height: var(--m3e-circular-progress-indicator-thickness, 4px);
      }
      .amplitude-and-wavelength {
        width: var(--m3e-circular-wavy-progress-indicator-amplitude, ${WAVY_DEFAULT_AMPLITUDE}px);
        height: var(--m3e-circular-wavy-progress-indicator-wavelength, 15px);
      }
      :host(:is(:state(--flat), :--flat)) {
        width: var(--m3e-circular-flat-progress-indicator-diameter, 40px);
      }
      :host(:is(:state(--wavy), :--wavy)) {
        width: var(--m3e-circular-wavy-progress-indicator-diameter, 48px);
      }
      :host(:is(:state(--flat), :--flat)[indeterminate]) .progress {
        animation: linear infinite linear-rotate;
        animation-duration: var(--_linear-rotate-duration);
      }
      :host(:is(:state(--flat), :--flat)[indeterminate]) .spinner {
        animation: infinite both rotate-arc;
        animation-duration: var(--_cycle-duration);
        animation-timing-function: var(--_indeterminate-easing);
      }
      :host(:is(:state(--wavy), :--wavy)[indeterminate]) .progress > svg {
        transform-origin: center;
      }
      :host(:is(:state(--wavy), :--wavy)[indeterminate]) .active-track {
        transition: none;
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
        animation: spin-reverse var(--_circular-wave-duration, 8s) linear infinite;
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
          stroke-dashoffset: 0;
        }
        to {
          transform: rotate(0deg);
          stroke-dashoffset: -100;
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
      @media (forced-colors: active) {
        :host(:is(:state(--flat), :--flat)) circle {
          fill: Canvas;
        }
        :host(:is(:state(--flat), :--flat)) .circle {
          border-color: var(--m3e-progress-indicator-color, ${DesignToken.color.primary})
            var(--m3e-progress-indicator-color, ${DesignToken.color.primary}) Canvas Canvas;
        }
      }
    `,
  ];

  /** @private */ #diameter = 0;
  /** @private */ #strokeWidth = 0;
  /** @private */ #amplitude = 0;
  /** @private */ #wavelength = 0;

  /**
   * Unit-scale circle/star cubics, rebuilt only when the fitted wave count changes.
   * @private
   */
  #geometry?: CircularWavyGeometry;
  /** @private */ #geometryWaveCount = 0;
  /** @private */ readonly #wavyAmplitude = new WavyAmplitude();

  /** @private */ #spinnerActiveTrack?: SVGPathElement | null;
  /** @private */ #spinnerTrack?: SVGPathElement | null;
  /** @private */ #spinnerSvg?: SVGSVGElement | null;

  /**
   * Spinner time origin in seconds, reset when rendered SVG nodes are rebound.
   * @private
   */
  #wavyAnimationStart?: number;

  /** @private */ readonly #resizeController = new ResizeController(this, {
    skipInitial: true,
    target: null,
    callback: () => {
      this.#updateDiameterAndStroke();
      this.#updateAmplitudeAndWavelength();

      queueMicrotask(() => this.requestUpdate());
    },
  });

  /** @private */ readonly #wavyAnimationLoop = new AnimationLoopController(this, (_, t) =>
    this.#updateWavyAnimation(t),
  );

  /**
   * Whether to show something is happening without conveying progress.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("indeterminate") || (changedProperties.has("value") && this.indeterminate)) {
      this.ariaValueNow = this.indeterminate ? null : `${this.value}`;
    }
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();

    this.#initialize();
    this.#syncWavyAnimation();
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.#initialize();
  }

  /**
   * Reads CSS measurement probes and observes the currently rendered instances.
   * @private
   */
  #initialize(): void {
    const diameterAndStroke = this.shadowRoot?.querySelector<HTMLElement>(".diameter-and-stroke");
    if (diameterAndStroke) {
      this.#updateDiameterAndStroke();
      this.#resizeController.observe(diameterAndStroke);
    }

    const amplitudeAndWavelength = this.shadowRoot?.querySelector<HTMLElement>(".amplitude-and-wavelength");
    if (amplitudeAndWavelength) {
      this.#updateAmplitudeAndWavelength();
      this.#resizeController.observe(amplitudeAndWavelength);
    }
  }

  /** @inheritdoc */
  override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("indeterminate") || _changedProperties.has("variant")) {
      this.#resizeController.unobserveAll();
      this.#initialize();
      this.requestUpdate();
      this.#syncWavyAnimation();
    } else if (this.variant === "wavy") {
      this.#syncWavyAmplitude();
    }
  }

  /**
   * Rebinds spinner nodes and restarts their phase after a variant, mode, or connection change.
   * @private
   */
  #syncWavyAnimation(): void {
    this.#wavyAnimationStart = undefined;

    if (this.indeterminate && this.variant === "wavy") {
      this.#spinnerActiveTrack = this.shadowRoot?.querySelector<SVGPathElement>(".spinner.active-track");
      this.#spinnerTrack = this.shadowRoot?.querySelector<SVGPathElement>(".spinner.track");
      this.#spinnerSvg = this.shadowRoot?.querySelector<SVGSVGElement>(".progress > svg");
    } else {
      this.#spinnerActiveTrack = null;
      this.#spinnerTrack = null;
      this.#spinnerSvg = null;
    }

    if (this.variant === "wavy") {
      this.#syncWavyAmplitude();
    } else {
      this.#wavyAnimationLoop.stop();
      this.#wavyAmplitude.reset();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return this.variant === "wavy" ? this.#renderWavyIndicator() : this.#renderFlatIndicator();
  }

  /** @private */
  #renderFlatIndicator(): unknown {
    if (this.indeterminate) {
      // The flat spinner retains its two clipped, CSS-animated halves independently of wavy motion.
      const left = this.#drawArc({ startAngle: -45, endAngle: 90 + this.#strokeWidth });
      const right = this.#drawArc({ startAngle: -this.#strokeWidth, endAngle: 135 });

      return html`<div class="progress" aria-hidden="true">
          <div class="spinner">
            <div class="left">
              <svg width="${this.#diameter}" height="${this.#diameter}" viewBox="${left.viewBox}" class="circle">
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
              <svg width="${this.#diameter}" height="${this.#diameter}" viewBox="${right.viewBox}" class="circle">
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
        <svg width="${this.#diameter}" height="${this.#diameter}" viewBox="${active.viewBox}">
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

  /**
   * Renders a closed morphing path, exposing progress through normalized SVG dash lengths.
   * @private
   */
  #renderWavyIndicator(): unknown {
    if (this.indeterminate) {
      return html`<div class="progress" aria-hidden="true">
          <svg width="${this.#diameter}" height="${this.#diameter}" viewBox="0 0 ${this.#diameter} ${this.#diameter}">
            <path
              class="spinner active-track"
              d="${this.#drawWavyPath().path}"
              pathLength="100"
              stroke-dasharray="10 90"
              style="transform-origin: center"
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
    const progress = this.#getWavyProgress();
    const degrees = progress * 360;
    const amplitude = this.#wavyAmplitude.value ?? this.#getTargetAmplitude();

    const active = this.#drawWavyPath();
    const inactive = this.#drawArc({
      gap: degrees > 0 ? this.#strokeWidth * 2 : 0,
      startAngle: degrees,
      endAngle: 360,
    });

    return html`
      <svg class="progress" viewBox="${inactive.viewBox}" aria-hidden="true">
        ${degrees > 0
          ? svg`<g class="active-track">
          <path
            class="${classMap({ wave: amplitude > 0 })}"
            style="--_circular-wave-duration: ${this.#getWavyCircleWaveCount()}s"
            d="${active.path}"
            pathLength="100"
            stroke-dasharray="${progress * 100} ${(1 - progress) * 100}"
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

  /**
   * Resolves diameter and stroke from CSS, preserving fractional pixels for the unscaled wavy SVG.
   * @private
   */
  #updateDiameterAndStroke(): void {
    const element = this.shadowRoot?.querySelector<HTMLElement>(".diameter-and-stroke");

    if (element) {
      if (this.variant === "wavy") {
        const style = getComputedStyle(element);

        this.#diameter = parseFloat(style.width);
        this.#strokeWidth = parseFloat(style.height);
      } else {
        this.#diameter = element.clientWidth;
        this.#strokeWidth = element.clientHeight;
      }
    }
  }

  /** @private */
  #updateAmplitudeAndWavelength(): void {
    const element = this.shadowRoot?.querySelector<HTMLElement>(".amplitude-and-wavelength");

    if (element) {
      const style = getComputedStyle(element);

      this.#amplitude = parseFloat(style.width);
      this.#wavelength = parseFloat(style.height);
    }
  }

  /** @private */
  #getWavyProgress(): number {
    return wavyProgress(this.value, this.max);
  }

  /** @private */
  #getTargetAmplitude(): number {
    return wavyAmplitudeTarget(this.#getWavyProgress(), this.#amplitude, this.indeterminate);
  }

  /** @private */
  #syncWavyAmplitude(): void {
    this.#wavyAmplitude.setTarget(this.#getTargetAmplitude(), performance.now() / 1000);

    if (this.indeterminate || this.#wavyAmplitude.animating) {
      this.#wavyAnimationLoop.start();
    }
  }

  /**
   * Samples morphing and spinner motion on one clock, stopping when neither needs another frame.
   * @private
   */
  #updateWavyAnimation(t: number): void {
    if (this.#wavyAmplitude.sample(t)) this.requestUpdate();

    if (this.indeterminate) {
      this.#updateWavyIndeterminateSpinner(t);
    } else if (!this.#wavyAmplitude.animating) {
      this.#wavyAnimationLoop.stop();
    }
  }

  /**
   * Applies a motion frame directly to SVG nodes without replacing their animation state.
   * @private
   */
  #updateWavyIndeterminateSpinner(t: number): void {
    if (this.#wavyAnimationStart === undefined) {
      this.#wavyAnimationStart = t;
    }

    const motion = circularWavyMotion(t - this.#wavyAnimationStart, this.#getWavyCircleWaveCount());

    if (this.#spinnerSvg) {
      this.#spinnerSvg.style.transform = `rotate(${motion.rotation}deg)`;
    }

    if (this.#spinnerActiveTrack) {
      this.#spinnerActiveTrack.setAttribute("stroke-dasharray", motion.dashArray);
      this.#spinnerActiveTrack.setAttribute("stroke-dashoffset", `${motion.dashOffset}`);
      this.#spinnerActiveTrack.style.transform = `rotate(${motion.waveRotation}deg)`;
    }

    this.#spinnerTrack?.setAttribute(
      "d",
      this.#drawArc({
        gap: this.#strokeWidth * 2,
        startAngle: motion.sweep,
      }).path,
    );
  }

  /** @private */
  #sizeToDegrees(size: number, padding = this.#amplitude): number {
    return circularProgressSizeToDegrees(size, this.#computeCircle(padding).r);
  }

  /** @private */
  #computeCircle(padding: number) {
    return createCircularProgressCircle(this.#diameter, this.#strokeWidth, this.variant, padding);
  }

  /** @private */
  #drawArc({ padding = this.#amplitude, ...options }: CircularProgressArcOptions) {
    return circularProgressArc(this.#diameter, this.#strokeWidth, this.variant, { ...options, padding });
  }

  /**
   * Fits cached unit geometry to measured pixels and the currently sampled amplitude.
   * @private
   */
  #drawWavyPath() {
    if (this.#diameter === 0 || this.#strokeWidth === 0) return { path: "", viewBox: "0 0 0 0" };

    const circle = this.#computeCircle(0);
    const waveCount = this.#getWavyCircleWaveCount();

    if (!this.#geometry || this.#geometryWaveCount !== waveCount) {
      this.#geometry = createCircularWavyGeometry(waveCount);
      this.#geometryWaveCount = waveCount;
    }

    const amplitude = this.#wavyAmplitude.value ?? this.#getTargetAmplitude();

    return {
      path: circularWavyPath(this.#geometry, circle.r, circle.cx, amplitude / WAVY_DEFAULT_AMPLITUDE),
      viewBox: `0 0 ${this.#diameter} ${this.#diameter}`,
    };
  }

  /** @private */
  #getWavyCircleWaveCount(): number {
    return circularWavyWaveCount(this.#diameter, this.#strokeWidth, this.#wavelength);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-circular-progress-indicator": M3eCircularProgressIndicatorElement;
  }
}
