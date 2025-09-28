/**
 * Adapted from Angular Material Progress Spinner
 * Source: https://github.com/angular/components/tree/main/src/material/progress-spinner
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { css, CSSResultGroup, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import { ProgressElementIndicatorBase } from "./ProgressElementIndicatorBase";
import { DesignToken } from "@m3e/core";

const DEFAULT_DIAMETER = 40;
const DEFAULT_STROKE_WIDTH = 10;

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
 * @attr diameter - The diameter, in pixels, of the progress spinner.
 * @attr indeterminate - Whether to show something is happening without conveying progress.
 * @attr max - The maximum progress value.
 * @attr stroke-width - The stroke width, in pixels, of the progress spinner.
 * @attr value - A fractional value, between 0 and `max`, indicating progress.
 *
 * @cssprop --m3e-progress-indicator-track-color - Track color of the progress bar (background/buffer).
 * @cssprop --m3e-progress-indicator-color - Color of the progress indicator (foreground).
 */
@customElement("m3e-circular-progress-indicator")
export class M3eCircularProgressIndicatorElement extends ProgressElementIndicatorBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      vertical-align: middle;
      width: var(--_diameter);
      height: var(--_diameter);
      position: relative;
      align-items: center;
      justify-content: center;
      contain: strict;

      --_arc-duration: 1333ms;
      --_cycle-duration: calc(4 * var(--_arc-duration));
      --_linear-rotate-duration: calc(var(--_arc-duration) * 360 / 306);
      --_indeterminate-easing: cubic-bezier(0.4, 0, 0.2, 1);
      --_container-padding: 0px;
      --_diameter: ${DEFAULT_DIAMETER}px;
      --_stroke-width: ${DEFAULT_STROKE_WIDTH};
    }
    svg {
      transform: rotate(-90deg);
    }
    circle {
      cx: 50%;
      cy: 50%;
      r: calc(50% * (1 - var(--_stroke-width) / 100));
      stroke-width: calc(var(--_stroke-width) * 1%);
      stroke-dasharray: 100;
      fill: transparent;
    }
    .active-track {
      transition: stroke-dashoffset 500ms cubic-bezier(0, 0, 0.2, 1);
      stroke: var(--m3e-progress-indicator-color, ${DesignToken.color.primary});
    }
    .track {
      stroke: var(--m3e-progress-indicator-track-color, ${DesignToken.color.secondaryContainer});
    }
    .progress {
      flex: 1;
      align-self: stretch;
      margin: var(--_container-padding);
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
    :host([indeterminate]) {
      content-visibility: auto;
    }
    :host([indeterminate]) .progress {
      animation: linear infinite linear-rotate;
      animation-duration: var(--_linear-rotate-duration);
    }
    .spinner {
      animation: infinite both rotate-arc;
      animation-duration: var(--_cycle-duration);
      animation-timing-function: var(--_indeterminate-easing);
    }
    .left {
      overflow: hidden;
      inset: 0 50% 0 0;
    }
    .right {
      overflow: hidden;
      inset: 0 0 0 50%;
    }
    .circle {
      box-sizing: border-box;
      border-radius: 50%;
      border: solid calc(calc(var(--_stroke-width) / 100) * calc(var(--_diameter) - 2 * var(--_container-padding)));
      border-color: var(--m3e-progress-indicator-color, ${DesignToken.color.primary})
        var(--m3e-progress-indicator-color, ${DesignToken.color.primary}) transparent transparent;
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
  `;

  /** @private */ #diameter = DEFAULT_DIAMETER;
  /** @private */ #strokeWidth = DEFAULT_STROKE_WIDTH;

  /**
   * Whether to show something is happening without conveying progress.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

  /**
   * The diameter, in pixels, of the progress spinner.
   * @default 40
   */
  @property({ type: Number }) get diameter(): number {
    return this.#diameter;
  }
  set diameter(value: number) {
    this.#diameter = value;
    this.style.setProperty("--_diameter", `${value}`);
  }

  /**
   * The stroke width, in pixels, of the progress spinner.
   * @default 10
   */
  @property({ attribute: "stroke-width", type: Number }) get strokeWidth(): number {
    return this.#strokeWidth;
  }
  set strokeWidth(value: number) {
    this.#strokeWidth = value;
    this.style.setProperty("--_stroke-width", `${value}`);
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="progress" aria-hidden="true">
        ${this.indeterminate
          ? html`<div class="spinner">
              <div class="left"><div class="circle"></div></div>
              <div class="right"><div class="circle"></div></div>
            </div>`
          : html`<svg viewBox="0 0 4800 4800">
              <circle class="track" pathLength="100"></circle>
              <circle
                class="active-track"
                pathLength="100"
                stroke-dashoffset="${(1 - this.value / this.max) * 100}"
              ></circle>
            </svg>`}
      </div>
      <div class="content"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-circular-progress-indicator": M3eCircularProgressIndicatorElement;
  }
}
