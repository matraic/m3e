import { css, CSSResultGroup, html, nothing, PropertyValues, svg } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, ResizeController, resolveFragmentUrl, safeStyleMap } from "@m3e/core";

import { LinearProgressMode } from "./LinearProgressMode";
import { ProgressElementIndicatorBase } from "./ProgressElementIndicatorBase";

/**
 * A horizontal bar for indicating progress and activity.
 *
 * @description
 * The `m3e-linear-progress-indicator` component displays a horizontal progress bar for tracking
 * the completion of a task or process. It supports `determinate`, `indeterminate`, `buffer`,
 * and `query` modes, and can be customized with CSS custom properties for thickness, shape, and color.
 * The component is accessible, animates smoothly, and adapts to various use cases including loading,
 * buffering, and activity indication.
 *
 * @example
 * The following example illustrates a determinate linear progress indicator.
 * ```html
 * <m3e-linear-progress-indicator value="30"></m3e-linear-progress-indicator>
 * ```
 * @example
 * The next example illustrates an indeterminate linear progress indicator using the `mode` attribute.
 * ```html
 * <m3e-linear-progress-indicator mode="indeterminate"></m3e-linear-progress-indicator>
 * ```
 *
 * @tag m3e-linear-progress-indicator
 *
 * @attr buffer-value - A fractional value, between 0 and `max`, indicating buffer progress.
 * @attr max - The maximum progress value.
 * @attr mode - The mode of the progress bar.
 * @attr value - A fractional value, between 0 and `max`, indicating progress.
 * @attr variant - The appearance of the indicator.
 *
 * @cssprop --m3e-linear-progress-indicator-thickness - Thickness (height) of the progress bar.
 * @cssprop --m3e-linear-progress-indicator-shape - Border radius of the progress bar.
 * @cssprop --m3e-progress-indicator-track-color - Track color of the progress bar (background/buffer).
 * @cssprop --m3e-progress-indicator-color - Color of the progress indicator (foreground).
 * @cssprop --m3e-linear-wavy-progress-indicator-amplitude - Amplitude of the `wavy` variant.
 * @cssprop --m3e-linear-wavy-progress-indicator-wavelength - Wavelength of the `wavy` variant.
 * @cssprop --m3e-linear-wavy-indeterminate-progress-indicator-wavelength - Wavelength of the indeterminate/query `wavy` variant.
 */
@customElement("m3e-linear-progress-indicator")
export class M3eLinearProgressIndicatorElement extends ProgressElementIndicatorBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    ProgressElementIndicatorBase.styles,
    css`
      :host {
        display: block;
        position: relative;
      }
      .progress {
        width: 100%;
        height: 100%;
        position: relative;
        align-items: center;
        border-radius: var(--m3e-linear-progress-indicator-shape, ${DesignToken.shape.corner.extraSmall});
      }
      .stroke,
      .amplitude-and-wavelength {
        visibility: hidden;
        position: absolute;
      }
      .stroke {
        width: 100%;
        height: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
      }
      .amplitude-and-wavelength {
        height: var(--m3e-linear-wavy-progress-indicator-amplitude, 0.1875rem);
        width: var(--m3e-linear-wavy-progress-indicator-wavelength, 2.5rem);
      }
      :host([mode="indeterminate"]) .amplitude-and-wavelength,
      :host([mode="query"]) .amplitude-and-wavelength {
        width: var(--m3e-linear-wavy-indeterminate-progress-indicator-wavelength, 1.5rem);
      }
      .primary,
      .secondary,
      .stop {
        height: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
        border-radius: inherit;
      }
      .stop {
        aspect-ratio: 1;
        flex: none;
      }
      :host([variant="flat"]) {
        height: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
      }
      :host([variant="wavy"]) {
        height: calc(
          var(--m3e-linear-progress-indicator-thickness, 0.25rem) +
            calc(var(--m3e-linear-wavy-progress-indicator-amplitude, 0.1875rem) * 2)
        );
      }
      :host([variant="wavy"]) .primary,
      :host([variant="wavy"]) .secondary {
        position: relative;
        height: 100%;
        overflow: hidden;
      }
      :host([variant="wavy"]) .complete {
        position: absolute;
        margin: auto;
        top: calc(50% - calc(var(--m3e-linear-progress-indicator-thickness, 0.25rem) / 2));
        left: 0;
        right: 0;
        height: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
        border-radius: inherit;
      }
      :host([variant="wavy"]) .secondary {
        height: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
      }
      .wave {
        position: absolute;
        display: block;
      }
      .primary .wave,
      .secondary .wave {
        margin-inline-start: calc(0px - var(--m3e-linear-wavy-progress-indicator-wavelength, 2.5rem));
      }
      :host([variant="wavy"][mode="determinate"]) .primary path,
      :host([variant="wavy"][mode="buffer"]) .primary path {
        animation: wave-slide 1.5s linear infinite;
      }
      @keyframes wave-slide {
        from {
          transform: translateX(0);
        }
        to {
          transform: translateX(calc(0px - var(--m3e-linear-wavy-progress-indicator-wavelength, 2.5rem)));
        }
      }
      :host([mode="determinate"]) .progress,
      :host([mode="buffer"]) .progress {
        display: flex;
        overflow: hidden;
      }
      :host([mode="determinate"]) .primary,
      :host([mode="buffer"]) .primary {
        width: var(--_value, 0px);
        flex: none;
      }
      :host([mode="determinate"]) .gap,
      :host([mode="buffer"]) .gap {
        flex-basis: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
        flex-shrink: 1;
      }
      :host([mode="determinate"]) .secondary,
      :host([mode="buffer"]) .buffer {
        flex: 1 1 auto;
      }
      :host([mode="buffer"]) .buffer {
        flex-shrink: 5;
        height: 100%;
        width: 100%;
        background-color: var(--m3e-progress-indicator-track-color, ${DesignToken.color.secondaryContainer});
        mask-image: radial-gradient(
          circle,
          black 0,
          black calc(var(--m3e-linear-progress-indicator-thickness, 0.25rem) / 2),
          transparent calc(var(--m3e-linear-progress-indicator-thickness, 0.25rem) / 2)
        );
        mask-size: calc(var(--m3e-linear-progress-indicator-thickness, 0.25rem) * 2) 100%;
        mask-repeat: repeat;
        animation: buffer 250ms linear infinite;
      }
      :host(:dir(rtl)[mode="buffer"]) .buffer {
        transform: scaleX(-1);
      }
      @keyframes buffer {
        from {
          mask-position: 0 0;
        }
        to {
          mask-position: calc(-1 * calc(var(--m3e-linear-progress-indicator-thickness, 0.25rem) * 2)) 0;
        }
      }
      :host([mode="buffer"]) .secondary {
        width: var(--_buffer-value, 0px);
        flex: none;
      }
      :host([mode="indeterminate"]) .primary,
      :host([mode="query"]) .primary {
        position: absolute;
        top: 0;
        height: 100%;
        border-radius: inherit;
        animation: indeterminate-primary 2.1s infinite linear;
      }
      :host([variant="wavy"][mode="indeterminate"]) .primary,
      :host([variant="wavy"][mode="query"]) .primary {
        animation-name: wavy-indeterminate-primary;
      }
      :host([mode="indeterminate"]) .secondary,
      :host([mode="query"]) .secondary {
        position: absolute;
        top: 0;
        height: 100%;
        border-radius: inherit;
        animation: indeterminate-secondary 2.1s infinite linear;
        animation-delay: 1.15s;
        animation-fill-mode: backwards;
      }
      :host([variant="wavy"][mode="indeterminate"]) .secondary,
      :host([variant="wavy"][mode="query"]) .secondary {
        animation-name: wavy-indeterminate-secondary;
      }
      :host([mode="indeterminate"]) .progress,
      :host([mode="query"]) .progress {
        overflow: hidden;
        position: relative;
      }
      :host(:not(:dir(rtl))[mode="query"]) .progress,
      :host(:dir(rtl)[mode="indeterminate"]) .progress {
        transform: scaleX(-1);
      }
      :host([variant="flat"]) .primary,
      :host([variant="flat"][mode="indeterminate"]) .secondary,
      :host([variant="flat"][mode="query"]) .secondary,
      :host([variant="wavy"]) .complete,
      .stop {
        background-color: var(--m3e-progress-indicator-color, ${DesignToken.color.primary});
      }
      :host([variant="wavy"]) .progress {
        color: var(--m3e-progress-indicator-color, ${DesignToken.color.primary});
      }
      :host([mode="determinate"]) .secondary,
      :host([mode="buffer"]) .secondary,
      :host([variant="flat"][mode="indeterminate"]) .track,
      :host([variant="flat"][mode="query"]) .track {
        background-color: var(--m3e-progress-indicator-track-color, ${DesignToken.color.secondaryContainer});
      }
      :host([variant="wavy"][mode="indeterminate"]) .track,
      :host([variant="wavy"][mode="query"]) .track {
        color: var(--m3e-progress-indicator-track-color, ${DesignToken.color.secondaryContainer});
      }
      :host([variant="wavy"][mode="indeterminate"]) .track,
      :host([variant="wavy"][mode="query"]) .track {
        y: calc(50% - calc(var(--m3e-linear-progress-indicator-thickness, 0.25rem) / 2));
        border-radius: inherit;
      }
      :host([variant="flat"][mode="indeterminate"]) .track,
      :host([variant="flat"][mode="query"]) .track {
        position: absolute;
        margin: auto;
        top: calc(50% - calc(var(--m3e-linear-progress-indicator-thickness, 0.25rem) / 2));
        left: 0;
        right: 0;
        height: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
        border-radius: inherit;
      }
      @keyframes indeterminate-primary {
        0% {
          left: -145.167%;
          width: 8%;
        }
        20% {
          left: -113.333%;
          width: 48%;
        }
        60% {
          left: 56.333%;
          width: 78%;
        }
        100% {
          left: 100%;
          width: 8%;
        }
      }
      @keyframes indeterminate-secondary {
        0% {
          left: -54.888%;
          width: 8%;
        }
        20% {
          left: -20%;
          width: 48%;
        }
        60% {
          left: 60%;
          width: 78%;
        }
        100% {
          left: 160%;
          width: 8%;
        }
      }
      @keyframes wavy-indeterminate-primary {
        0% {
          transform: translateX(-145.167%);
          width: 8%;
        }
        20% {
          transform: translateX(-113.333%);
          width: 48%;
        }
        60% {
          transform: translateX(56.333%);
          width: 78%;
        }
        100% {
          transform: translateX(100%);
          width: 8%;
        }
      }
      @keyframes wavy-indeterminate-secondary {
        0% {
          transform: translateX(-54.888%);
          width: 8%;
        }
        20% {
          transform: translateX(-20%);
          width: 48%;
        }
        60% {
          transform: translateX(60%);
          width: 78%;
        }
        100% {
          transform: translateX(160%);
          width: 8%;
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
  /** @private */ #maskId = `m3e-linear-progress-mask-${M3eLinearProgressIndicatorElement.__nextMaskId++}`;

  /** @private */ #strokeWidth = 0;
  /** @private */ #amplitude = 0;
  /** @private */ #wavelength = 0;

  /** @private */ readonly #resizeController = new ResizeController(this, {
    skipInitial: true,
    target: null,
    callback: () => {
      this.#updateStroke();
      this.#updateAmplitudeAndWavelength();
    },
  });

  /**
   * The mode of the progress bar.
   * @default "determinate"
   */
  @property({ reflect: true }) mode: LinearProgressMode = "determinate";

  /**
   * A fractional value, between 0 and `max`, indicating buffer progress.
   * @default 0
   */
  @property({ attribute: "buffer-value", type: Number, reflect: true }) bufferValue = 0;

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.#updateStroke();
    this.#updateAmplitudeAndWavelength();

    const stroke = this.shadowRoot?.querySelector<HTMLElement>(".stroke");
    if (stroke) {
      this.#resizeController.observe(stroke);
    }

    const amplitudeAndWavelength = this.shadowRoot?.querySelector<HTMLElement>(".amplitude-and-wavelength");
    if (amplitudeAndWavelength) {
      this.#resizeController.observe(amplitudeAndWavelength);
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("mode")) {
      this.ariaValueNow = this.mode === "indeterminate" || this.mode === "query" ? null : `${this.value}`;
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("value") || _changedProperties.has("bufferValue") || _changedProperties.has("max")) {
      const progress = this.shadowRoot?.querySelector<HTMLElement>(".progress");
      progress?.style.setProperty("--_value", `${(this.value / this.max) * 100}%`);
      progress?.style.setProperty("--_buffer-value", `${(this.bufferValue / this.max) * 100}%`);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const clampedValue = Math.max(0, Math.min(this.value, this.max));
    const activeWidth = (clampedValue / this.max) * this.clientWidth;
    const waveWidth =
      this.mode === "indeterminate" || this.mode === "query" ? this.clientWidth : activeWidth + this.#wavelength * 3;

    const wave =
      this.variant === "wavy" && this.#strokeWidth > 0 && this.#amplitude > 0 && this.#wavelength > 0
        ? this.#drawWavyPath(waveWidth)
        : undefined;

    return html`<div
        class="progress"
        aria-hidden="true"
        style="${safeStyleMap({
          "--_translate-x": `-${activeWidth}px`,
        })}"
      >
        ${!wave ? html`<div class="track"></div>` : nothing}
        ${(this.mode === "determinate" || this.mode === "buffer") && this.value <= 0
          ? nothing
          : html`<div class="primary">
                ${wave && (this.mode === "determinate" || this.mode === "buffer")
                  ? this.#renderWave(waveWidth, wave.height, wave.viewBox, wave.path)
                  : nothing}
              </div>
              ${this.mode === "determinate" || this.mode === "buffer" ? html`<div class="gap"></div>` : nothing}`}
        ${this.mode !== "buffer" || this.bufferValue > 0 ? html`<div class="secondary"></div>` : nothing}
        ${this.mode === "buffer" && this.bufferValue > 0 ? html`<div class="gap"></div>` : nothing}
        ${this.mode === "buffer" ? html`<div class="buffer"></div>` : nothing}
        ${(this.mode === "determinate" || this.mode === "buffer") && this.value > 0
          ? html`<div class="gap"></div>
              <div class="stop"></div>`
          : nothing}
        ${wave && !(this.mode === "determinate" || this.mode === "buffer")
          ? this.#renderWave(waveWidth, wave.height, wave.viewBox, wave.path)
          : nothing}
      </div>
      ${this.#renderResizeObservedElements()}`;
  }

  /** @private */
  #renderWave(width: number, height: number, viewBox: string, path: string): unknown {
    const masked = this.mode === "indeterminate" || this.mode === "query";
    if (!masked && this.value / this.max === 1) {
      return html`<div class="complete"></div>`;
    }
    return html`<svg class="wave" width="${width}" height="${height}" viewBox="${viewBox}" preserveAspectRatio="none">
      ${masked
        ? svg`
        <mask id="${this.#maskId}" maskUnits="userSpaceOnUse">
          <rect width="${width}" height="${height}" fill="black" />
          <rect class="primary" height="${height}" fill="white" />
          <rect class="secondary" height="${height}" fill="white" />
        </mask>
        <mask id="${`${this.#maskId}-inverse`}" maskUnits="userSpaceOnUse">
          <rect width="${width}" height="${height}" fill="white" />
          <rect class="primary" height="${height}" fill="black" />
          <rect class="secondary" height="${height}" fill="black" />
        </mask>
        <g mask="${resolveFragmentUrl(this.#maskId)}">
          <path d="${path}" stroke="currentColor" stroke-width=${this.#strokeWidth} fill="none" stroke-linecap="round" />
        </g>
        <g mask="${resolveFragmentUrl(`${this.#maskId}-inverse`)}">
          <rect class="track" width="100%" height="${this.#strokeWidth}" fill="currentColor" />
        </g>`
        : svg`<path d="${path}" stroke="currentColor" stroke-width=${this.#strokeWidth} fill="none" stroke-linecap="round" />`}
    </svg>`;
  }

  /** @private */
  #renderResizeObservedElements(): unknown {
    return html`<div class="stroke" aria-hidden="true"></div>
      <div class="amplitude-and-wavelength" aria-hidden="true"></div>`;
  }

  /** @private */
  #updateStroke(): void {
    const element = this.shadowRoot?.querySelector<HTMLElement>(".stroke");
    if (element) {
      this.#strokeWidth = element.clientHeight;
    }
  }

  /** @private */
  #updateAmplitudeAndWavelength(): void {
    const element = this.shadowRoot?.querySelector<HTMLElement>(".amplitude-and-wavelength");
    if (element) {
      this.#amplitude = element.clientHeight;
      this.#wavelength = element.clientWidth;
    }
  }

  /** @private */
  #drawWavyPath(width: number, phase: number = 0) {
    const amplitude = this.#amplitude + this.#strokeWidth / 2;
    const y = amplitude;

    const path: string[] = [];
    const step = this.#wavelength / 2;
    let x = 0;

    path.push(`M ${x},${y}`);

    while (x <= width) {
      const endX = x + step;
      const endY = y + amplitude * Math.sin((2 * Math.PI * endX) / this.#wavelength + phase);
      const cpX = x + step / 2;
      const cpY = y + amplitude * Math.sin((2 * Math.PI * (x + step / 2)) / this.#wavelength + phase);

      path.push(`Q ${cpX},${cpY} ${endX},${endY}`);
      x += step;
    }

    const padding = 1;
    const viewBox = `0 ${-padding} ${width} ${amplitude * 2 + padding * 2}`;

    return { path: path.join(" "), viewBox, height: this.#strokeWidth + this.#amplitude * 2, padding };
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-linear-progress-indicator": M3eLinearProgressIndicatorElement;
  }
}
