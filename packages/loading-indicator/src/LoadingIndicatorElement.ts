import { LitElement, html, css, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { DesignToken, Role } from "@m3e/core";

import { LoadingIndicatorVariant } from "./LoadingIndicatorVariant";
import { LoadingIndicatorToken } from "./LoadingIndicatorToken";
import { ShapePolygon } from "./ShapePolygon";

/**
 * @summary
 * Shows indeterminate progress for a short wait time.
 *
 * @description
 * The `m3e-loading-indicator` component uses animation to grab attention, mitigate perceived latency, and indicate
 * that an activity is in progress.
 *
 * When placed over other content, use the `variant` attribute to change the appearance from `uncontained` (the default),
 * to `contained` so that it has strong contrast to help it stand out better.
 *
 * @example
 * The following example illustrates an uncontained loading indicator.
 * ```html
 * <m3e-loading-indicator></m3e-loading-indicator>
 * ```
 *
 * @tag m3e-loading-indicator
 *
 * @attr variant - The appearance variant of the indicator.
 *
 * @cssprop --m3e-loading-indicator-active-indicator-color - Uncontained active indicator color.
 * @cssprop --m3e-loading-indicator-contained-active-indicator-color - Contained active indicator color.
 * @cssprop --m3e-loading-indicator-contained-container-color - Contained container (background) color.
 * @cssprop --m3e-loading-indicator-active-indicator-size - Size of the active indicator.
 * @cssprop --m3e-loading-indicator-container-shape - Container shape.
 * @cssprop --m3e-loading-indicator-container-size - Container size.
 */
@customElement("m3e-loading-indicator")
export class M3eLoadingIndicatorElement extends Role(LitElement, "progressbar") {
  /** The styles of the element. */
  static override styles = css`
    :host {
      display: inline-block;
      aspect-ratio: 1 / 1;
      contain: strict;
      vertical-align: middle;
      content-visibility: auto;
    }
    :host([variant="uncontained"]) {
      width: ${LoadingIndicatorToken.activeIndicatorSize};
    }
    :host([variant="contained"]) {
      width: ${LoadingIndicatorToken.containerSize};
    }
    :host([variant="uncontained"]) .active-indicator {
      background-color: ${LoadingIndicatorToken.activeIndicatorColor};
    }
    :host([variant="contained"]) .active-indicator {
      background-color: ${LoadingIndicatorToken.containedActiveIndicatorColor};
    }
    :host([variant="contained"]) .container {
      background-color: ${LoadingIndicatorToken.containedContainerColor};
    }
    .container {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: ${LoadingIndicatorToken.containerShape};
    }
    .active-indicator {
      margin: auto;
      aspect-ratio: 1 / 1;
      width: calc(${LoadingIndicatorToken.activeIndicatorSize} * 0.842);
      transform-origin: center;
      clip-path: var(--_polygon);
      transition: clip-path ${DesignToken.motion.spring.slowEffects};
      will-change: transform, clip-path;
    }
    .active-indicator.animate {
      animation:
        rotate 4998ms infinite,
        noop 714ms steps(1, end) infinite;
    }
    @keyframes noop {
      from {
        opacity: 1;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes rotate {
      0% {
        transform: rotate(0deg);
        animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
      }
      14% {
        transform: rotate(154deg);
        animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
      }
      29% {
        transform: rotate(309deg);
        animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
      }
      43% {
        transform: rotate(463deg);
        animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
      }
      57% {
        transform: rotate(617deg);
        animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
      }
      71% {
        transform: rotate(771deg);
        animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
      }
      83% {
        transform: rotate(926deg);
        animation-timing-function: cubic-bezier(0.5, 0.2, 0, 0.8);
      }
      100% {
        transform: rotate(1080deg);
      }
    }
    @media (forced-colors: active) {
      .active-indicator {
        background-color: CanvasText !important;
      }
    }
  `;

  /** @private */
  @query(".active-indicator") private readonly _activeIndicator?: HTMLElement;

  /** @private */
  #shapes: Array<keyof typeof ShapePolygon> = [
    "soft-burst",
    "7-sided-cookie",
    "pentagon",
    "pill",
    "very-sunny",
    "4-sided-cookie",
    "oval",
  ];

  /** @private */ #shapeIndex = 1;

  readonly #animationIterationHandler = (e: AnimationEvent) => {
    if (e.animationName === "noop") {
      if (this._activeIndicator) {
        this._activeIndicator?.style.setProperty(
          "--_polygon",
          `polygon(${ShapePolygon[this.#shapes[this.#shapeIndex]]})`
        );
      }
      this.#shapeIndex = (this.#shapeIndex + 1) % this.#shapes.length;
    }
  };

  /**
   * The appearance variant of the indicator.
   * @default "uncontained"
   */
  @property({ reflect: true }) variant: LoadingIndicatorVariant = "uncontained";

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.ariaValueMin = this.ariaValueMin || "0";
    this.ariaValueMax = this.ariaValueMax || "100";
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this._activeIndicator?.removeEventListener("animationiteration", this.#animationIterationHandler);
    this._activeIndicator?.classList.toggle("animate", false);
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this._activeIndicator?.style.setProperty("--_polygon", `polygon(${ShapePolygon[this.#shapes[0]]})`);

    this._activeIndicator?.addEventListener("animationiteration", this.#animationIterationHandler);
    this._activeIndicator?.classList.toggle("animate", true);
  }

  /** @inheritdoc */
  override render() {
    return html`<div class="container" aria-hidden="true">
      <div class="active-indicator"></div>
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-loading-indicator": M3eLoadingIndicatorElement;
  }
}
