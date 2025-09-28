/**
 * Adapted from Angular Material Progress Bar
 * Source: https://github.com/angular/components/blob/main/src/material/progress-bar/progress-bar.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { css, CSSResultGroup, html, isServer } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, safeStyleMap } from "@m3e/core";

import { LinearProgressMode } from "./LinearProgressMode";
import { ProgressElementIndicatorBase } from "./ProgressElementIndicatorBase";

/**
 * @summary
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
 *
 * @cssprop --m3e-linear-progress-indicator-thickness - Thickness (height) of the progress bar.
 * @cssprop --m3e-linear-progress-indicator-shape - Border radius of the progress bar.
 * @cssprop --m3e-progress-indicator-track-color - Track color of the progress bar (background/buffer).
 * @cssprop --m3e-progress-indicator-color - Color of the progress indicator (foreground).
 */
@customElement("m3e-linear-progress-indicator")
export class M3eLinearProgressIndicatorElement extends ProgressElementIndicatorBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      height: var(--m3e-linear-progress-indicator-thickness, 0.25rem);
      overflow: hidden;
      position: relative;
      transform: opacity var(--_piece-animation-duration) linear;
      border-radius: var(--m3e-linear-progress-indicator-shape, ${DesignToken.shape.corner.extraSmall});

      --_piece-animation-duration: 250ms;
      --_full-animation-duration: 2000ms;
    }
    :host([mode="indeterminate"]),
    :host([mode="query"]) {
      content-visibility: auto;
    }
    .progress {
      pointer-events: none;
    }
    .progress,
    .wrapper {
      height: 100%;
    }
    .element,
    .fill::after {
      position: absolute;
      height: 100%;
      width: 100%;
    }
    .background {
      width: calc(100% + 0.625rem);
      fill: var(--m3e-progress-indicator-track-color, ${DesignToken.color.secondaryContainer});
    }
    .buffer {
      transform-origin: top left;
      transition: transform var(--_piece-animation-duration) ease;
      background-color: var(--m3e-progress-indicator-track-color, ${DesignToken.color.secondaryContainer});
    }
    .primary {
      transform: scale3d(calc(var(--_value, 0) / var(--_max)), 1, 1);
    }
    .secondary {
      display: none;
    }
    .fill {
      animation: none;
      transform-origin: top left;
      transition: transform var(--_piece-animation-duration) ease;
    }
    .fill::after {
      animation: none;
      content: "";
      display: inline-block;
      left: 0;
      background-color: var(--m3e-progress-indicator-color, ${DesignToken.color.primary});
    }
    :host([mode="query"]) {
      transform: rotateZ(180deg);
    }
    :host([mode="indeterminate"]) .fill,
    :host([mode="query"]) .fill {
      transition: none;
    }
    :host([mode="indeterminate"]) .primary,
    :host([mode="query"]) .primary {
      backface-visibility: hidden;
      animation: primary-indeterminate-translate var(--_full-animation-duration) infinite linear;
      left: -145.166611%;
    }
    :host([mode="indeterminate"]) .primary.fill::after,
    :host([mode="query"]) .primary.fill::after {
      backface-visibility: hidden;
      animation: primary-indeterminate-scale var(--_full-animation-duration) infinite linear;
    }
    :host([mode="indeterminate"]) .secondary,
    :host([mode="query"]) .secondary {
      display: block;
      backface-visibility: hidden;
      animation: secondary-indeterminate-translate var(--_full-animation-duration) infinite linear;
      left: -54.888891%;
    }
    :host([mode="indeterminate"]) .secondary.fill::after,
    :host([mode="query"]) .secondary.fill::after {
      backface-visibility: hidden;
      animation: secondary-indeterminate-scale var(--_full-animation-duration) infinite linear;
    }
    :host([mode="determinate"]) .background,
    :host([mode="indeterminate"]) .background,
    :host([mode="query"]) .background {
      fill: transparent !important;
    }
    :host([mode="buffer"]) .buffer {
      transform: scale3d(calc(var(--_buffer-value, 0) / var(--_max)), 1, 1);
    }
    :host([mode="buffer"]) .background {
      display: block;
      backface-visibility: hidden;
      animation: background-scroll var(--_piece-animation-duration) infinite linear;
    }
    @keyframes primary-indeterminate-translate {
      0% {
        transform: translateX(0);
      }
      20% {
        animation-timing-function: cubic-bezier(0.5, 0, 0.701732, 0.495819);
        transform: translateX(0);
      }
      59.15% {
        animation-timing-function: cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);
        transform: translateX(83.67142%);
      }
      100% {
        transform: translateX(200.611057%);
      }
    }
    @keyframes primary-indeterminate-scale {
      0% {
        transform: scaleX(0.08);
      }
      36.65% {
        animation-timing-function: cubic-bezier(0.334731, 0.12482, 0.785844, 1);
        transform: scaleX(0.08);
      }
      69.15% {
        animation-timing-function: cubic-bezier(0.06, 0.11, 0.6, 1);
        transform: scaleX(0.661479);
      }
      100% {
        transform: scaleX(0.08);
      }
    }
    @keyframes secondary-indeterminate-translate {
      0% {
        animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
        transform: translateX(0);
      }
      25% {
        animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
        transform: translateX(37.651913%);
      }
      48.35% {
        animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
        transform: translateX(84.386165%);
      }
      100% {
        transform: translateX(160.277782%);
      }
    }
    @keyframes secondary-indeterminate-scale {
      0% {
        animation-timing-function: cubic-bezier(0.15, 0, 0.515058, 0.409685);
        transform: scaleX(0.08);
      }
      19.15% {
        animation-timing-function: cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);
        transform: scaleX(0.457104);
      }
      44.15% {
        animation-timing-function: cubic-bezier(0.4, 0.627035, 0.6, 0.902026);
        transform: scaleX(0.72796);
      }
      100% {
        transform: scaleX(0.08);
      }
    }
    @keyframes background-scroll {
      to {
        transform: translateX(calc(calc(0px - 0.25rem) * 2));
      }
    }
  `;

  /** @private */ private static __nextPatternId = 0;
  /** @private */ #patternId = `m3e-progress-pattern-${M3eLinearProgressIndicatorElement.__nextPatternId++}`;
  /** @private */ #patternFill = "";

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
  override connectedCallback(): void {
    super.connectedCallback();

    if (!isServer) {
      // Prefix the SVG reference with the current path, otherwise they will not work
      // in Safari if the page has a <base> tag.

      const location = document?.location ?? null;
      const path = location ? (location.pathname + location.search).split("#")[0] : "";
      this.#patternFill = `url(${path}#${this.#patternId})`;
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="progress" aria-hidden="true">
      <div
        class="wrapper"
        style=${safeStyleMap({
          "--_value": `${this.value}`,
          "--_buffer-value": `${this.bufferValue}`,
          "--_max": `${this.max}`,
        })}
      >
        <svg width="100%" height="4" class="background element">
          <defs>
            <pattern id="${this.#patternId}" x="4" y="0" width="8" height="4" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="2" />
            </pattern>
          </defs>
          <rect fill="${this.#patternFill}" width="100%" height="100%" />
        </svg>
        <div class="buffer element"></div>
        <div class="primary fill element"></div>
        <div class="secondary fill element"></div>
      </div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-linear-progress-indicator": M3eLinearProgressIndicatorElement;
  }
}
