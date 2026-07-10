import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import { customElement, DesignToken, ReconnectedCallback, registerStyleSheet, waitForUpgrade } from "@m3e/web/core";
import { positionAnchor } from "@m3e/web/core/anchoring";

import { SkeletonShape } from "./SkeletonShape";
import { SkeletonAnimation } from "./SkeletonAnimation";

/**
 * A visual placeholder that mimics the layout of content while it's still loading.
 * @description
 * The `m3e-skeleton` component provides a loading placeholder surface with flexible shape variants and
 * motion-based animations that communicate loading state while preserving layout stability. It mimics
 * the layout of content while it's still loading, ensuring a smooth user experience during data fetching
 * or rendering delays. The component supports different animation effects (`pulse`, `wave`, `none`) and
 * shape variants (`circular`, `rounded`, `square`, `auto`) to adapt to various content types. When the
 * content is loaded, the skeleton fades out with a smooth transition.
 *
 * @example
 * The following example illustrates a skeleton shaped and sized by the slotted `m3e-card`.
 * ```html
 * <m3e-skeleton>
 *  <m3e-card></m3e-card>
 * </m3e-skeleton>
 * ```
 *
 * @tag m3e-skeleton
 *
 * @attr animation - The animation effect of the skeleton.
 * @attr shape - The shape of the skeleton.
 * @attr loaded - Whether the content of the skeleton has been loaded.
 *
 * @slot - Renders the content to be mimicked by the skeleton.
 *
 * @cssprop --m3e-skeleton-color - Base fill color for the skeleton surface.
 * @cssprop --m3e-skeleton-tint-color - Tint fill color for the skeleton surface.
 * @cssprop --m3e-skeleton-tint-opacity - Tint Opacity applied when the skeleton animation is not pulsating.
 * @cssprop --m3e-skeleton-accent-color - Accent color used in wave animation.
 * @cssprop --m3e-skeleton-accent-opacity - Opacity of the accent effect in animations.
 * @cssprop --m3e-skeleton-rounded-shape - Corner radius for the rounded skeleton shape.
 * @cssprop --m3e-skeleton-circular-shape - Corner radius for the circular skeleton shape.
 * @cssprop --m3e-skeleton-square-shape - Corner radius for the square skeleton shape.
 * @cssprop --m3e-skeleton-shape - Corner radius for the skeleton shape.
 */
@customElement("m3e-skeleton")
export class M3eSkeletonElement extends ReconnectedCallback(LitElement) {
  /** Skeletons with a live per-instance animation, so preference changes re-sync them all. @private */
  private static __animating = new Set<M3eSkeletonElement>();

  /** Shared timeline origin so every skeleton's wave/pulse stays in phase. @private */
  private static __motionOrigin: number | null = null;

  /** @private */ private static __reducedMediaQuery: MediaQueryList;
  /** @private */ private static __forcedColorsMediaQuery: MediaQueryList;

  static {
    if (typeof window !== "undefined") {
      registerStyleSheet(css`
        @property --_m3e-skeleton-wave-pct {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        @property --_m3e-skeleton-pulse-norm {
          syntax: "<number>";
          inherits: true;
          initial-value: 0;
        }
        :root {
          --_m3e-skeleton-wave-span: 40vw;
          --_m3e-skeleton-pulse-min: 0.06;
        }
      `);

      M3eSkeletonElement.__reducedMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      M3eSkeletonElement.__forcedColorsMediaQuery = window.matchMedia("(forced-colors: active)");
      M3eSkeletonElement.__reducedMediaQuery.addEventListener("change", () => M3eSkeletonElement.__updateMotion());
      M3eSkeletonElement.__forcedColorsMediaQuery.addEventListener("change", () => M3eSkeletonElement.__updateMotion());
    }
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    .shape {
      position: absolute;
      overflow: hidden;
      pointer-events: none;
      opacity: 1;
      background-color: var(--m3e-skeleton-color, ${DesignToken.color.surface});
    }
    .shape::before {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: color-mix(
        in srgb,
        var(--m3e-skeleton-tint-color, ${DesignToken.color.onSurface}) var(--m3e-skeleton-tint-opacity, 8%),
        transparent
      );
    }
    :host(:not([loaded])) {
      contain: layout style paint;
    }
    :host(:not([loaded])) slot {
      visibility: hidden;
    }
    :host([loaded]) .shape {
      opacity: 0;
      transition: ${unsafeCSS(`opacity ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}`)};
    }
    :host([shape="rounded"]) .shape {
      border-radius: var(--m3e-skeleton-rounded-shape, var(--m3e-skeleton-shape, ${DesignToken.shape.corner.large}));
    }
    :host([shape="circular"]) .shape {
      border-radius: var(--m3e-skeleton-circular-shape, var(--m3e-skeleton-shape, ${DesignToken.shape.corner.full}));
    }
    :host([shape="square"]) .shape {
      border-radius: var(--m3e-skeleton-square-shape, var(--m3e-skeleton-shape, 0px));
    }
    :host([animation="pulse"]:not([loaded])) .shape::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: calc(
        var(--m3e-skeleton-accent-opacity, 0.06) + (1 - var(--m3e-skeleton-accent-opacity, 0.06)) *
          var(--_m3e-skeleton-pulse-norm)
      );
      background-color: var(--m3e-skeleton-tint-color, ${DesignToken.color.surfaceDim});
    }
    :host([animation="wave"]:not([loaded])) .shape::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: linear-gradient(
        90deg,
        transparent 0%,
        transparent 35%,
        var(--m3e-skeleton-accent-color, ${DesignToken.color.onSurface}) 50%,
        transparent 65%,
        transparent 100%
      );
      background-attachment: fixed;
      background-size: calc(100vw + var(--_m3e-skeleton-wave-span) * 2) 100%;
      background-position-x: calc(
        var(--_m3e-skeleton-wave-pct) * (100vw + var(--_m3e-skeleton-wave-span) * 2) - var(--_m3e-skeleton-wave-span)
      );

      opacity: var(--m3e-skeleton-accent-opacity, 0.06);
    }
    @media (forced-colors: active) {
      :host([loaded]) .shape {
        transition: none;
      }
      .shape::after {
        display: none;
      }
      .shape {
        background-color: GrayText;
      }
    }
    @media (prefers-reduced-motion) {
      :host([loaded]) .shape {
        transition: none;
      }
      .shape::after {
        display: none;
      }
    }
  `;

  /** @private */ readonly #anchoringCleanupMap = new Map<HTMLElement, () => void>();

  /** @private */ #animation: Animation | null = null;

  /** The animation mode `#animation` was created for, so mode changes recreate it. @private */
  #animationMode: SkeletonAnimation | null = null;

  /**
   * The shape of the skeleton.
   * @default "auto"
   */
  @property({ reflect: true }) shape: SkeletonShape = "auto";

  /**
   * The animation effect of the skeleton.
   * @default "wave"
   */
  @property({ reflect: true }) animation: SkeletonAnimation = "wave";

  /**
   * Whether the content of the skeleton has been loaded.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) loaded = false;

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearShapes();
    this.#stopMotion();
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();
    this.#createShapes();
    this.#updateLoading();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("loaded") || _changedProperties.has("animation")) {
      this.#updateLoading();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot ?inert="${!this.loaded}" @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @private */
  async #handleSlotChange(): Promise<void> {
    this.#createShapes();
  }

  /** @private */
  #clearShapes(): void {
    for (const item of this.#anchoringCleanupMap) {
      item[0].remove();
      item[1]();
    }
    this.#anchoringCleanupMap.clear();
  }

  /** @private */
  async #createShapes(): Promise<void> {
    this.#clearShapes();

    const slot = this.shadowRoot?.querySelector("slot");
    if (!slot) return;

    for (const element of slot.assignedElements({ flatten: true }).filter((x) => x instanceof HTMLElement)) {
      await this.#createShape(element);
    }
  }

  /** @private */
  async #createShape(element: HTMLElement): Promise<void> {
    await waitForUpgrade(element);

    const shape = document.createElement("div");
    shape.classList.add("shape");

    if (this.shape === "auto") {
      let borderRadius = getComputedStyle(element).borderRadius;
      if (!borderRadius || borderRadius === "0px") {
        const firstElement = element.shadowRoot?.firstElementChild;
        if (firstElement && !firstElement.nextElementSibling) {
          borderRadius = getComputedStyle(firstElement).borderRadius;
        }
      }

      if (borderRadius && borderRadius !== "0px") {
        shape.style.borderRadius = borderRadius;
      }
    }

    const anchoringCleanup = await positionAnchor(
      shape,
      element,
      {
        position: "bottom",
      },
      (x, y) => {
        shape.style.left = `${x}px`;
        shape.style.top = `${y - element.clientHeight}px`;
        shape.style.width = `${element.clientWidth}px`;
        shape.style.height = `${element.clientHeight}px`;
      },
    );

    this.#anchoringCleanupMap.set(shape, anchoringCleanup);
    this.shadowRoot?.appendChild(shape);
  }

  /**
   * Starts or stops this skeleton's own wave/pulse animation to reflect its current
   * loaded/animation/connected state, then aligns its play/pause with the active
   * accessibility and forced-colors preferences.
   * @private
   */
  #updateLoading(): void {
    if (this.isConnected && !this.loaded && (this.animation === "wave" || this.animation === "pulse")) {
      this.#startMotion();
    } else {
      this.#stopMotion();
    }
  }

  /**
   * Starts the wave/pulse animation on this skeleton itself rather than on
   * `document.documentElement`. The `--_m3e-skeleton-*` properties are registered
   * `inherits: true`, so animating them on the document root recalculates style for the
   * whole document every frame; scoping to the instance limits that to its own subtree.
   * Aligned to a shared timeline origin so multiple skeletons animate in phase, and
   * re-created when the effect mode (wave vs pulse) changes.
   * @private
   */
  #startMotion(): void {
    if (this.#animation) {
      if (this.#animationMode === this.animation) {
        // Already running for the current mode; nothing to do but re-sync motion state.
        this.#syncMotionState();
        return;
      }
      // Effect mode changed (wave <-> pulse); tear down and recreate below.
      this.#stopMotion();
    }

    M3eSkeletonElement.__motionOrigin ??= (document.timeline.currentTime as number | null) ?? 0;

    const animation =
      this.animation === "pulse"
        ? this.animate(
            [
              { ["--_m3e-skeleton-pulse-norm"]: 0 },
              { ["--_m3e-skeleton-pulse-norm"]: 1 },
              { ["--_m3e-skeleton-pulse-norm"]: 0 },
            ],
            {
              duration: 1200,
              iterations: Infinity,
              easing: "ease-in-out",
            },
          )
        : this.animate([{ ["--_m3e-skeleton-wave-pct"]: 0 }, { ["--_m3e-skeleton-wave-pct"]: 1 }], {
            duration: 2100,
            iterations: Infinity,
            easing: "linear",
          });

    animation.startTime = M3eSkeletonElement.__motionOrigin;

    this.#animation = animation;
    this.#animationMode = this.animation;
    M3eSkeletonElement.__animating.add(this);
    this.#syncMotionState();
  }

  /** @private */
  #stopMotion(): void {
    if (!this.#animation) {
      return;
    }
    this.#animation.cancel();
    this.#animation = null;
    this.#animationMode = null;
    M3eSkeletonElement.__animating.delete(this);
  }

  /** Whether motion is currently suppressed for accessibility or forced-colors reasons. @private */
  private static __motionDisabled(): boolean {
    return M3eSkeletonElement.__reducedMediaQuery.matches || M3eSkeletonElement.__forcedColorsMediaQuery.matches;
  }

  /**
   * Re-applies the current motion preference to every animating skeleton. Invoked when
   * the reduced-motion or forced-colors preference changes.
   * @private
   */
  private static __updateMotion(): void {
    for (const skeleton of M3eSkeletonElement.__animating) {
      skeleton.#syncMotionState();
    }
  }

  /**
   * Aligns this skeleton's animation play state with the current reduced-motion and
   * forced-colors preferences.
   * @private
   */
  #syncMotionState(): void {
    if (!this.#animation) {
      return;
    }
    if (M3eSkeletonElement.__motionDisabled()) {
      this.#animation.pause();
    } else {
      this.#animation.play();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-skeleton": M3eSkeletonElement;
  }
}
