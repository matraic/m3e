import { css, CSSResultGroup, html, LitElement, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import { customElement, DesignToken, ReconnectedCallback, waitForUpgrade } from "@m3e/web/core";
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
      animation: pulse 1.2s ease-in-out infinite;
      background-color: var(--m3e-skeleton-tint-color, ${DesignToken.color.surfaceDim});
    }
    :host([animation="wave"]:not([loaded])) .shape::after {
      content: "";
      position: absolute;
      top: 0;
      left: -150%;
      height: 100%;
      width: 150%;
      opacity: var(--m3e-skeleton-accent-opacity, 6%);
      background: linear-gradient(
        90deg,
        transparent,
        var(--m3e-skeleton-accent-color, ${DesignToken.color.onSurface}),
        transparent
      );
      animation: wave 2.1s linear infinite;
    }
    @keyframes pulse {
      0% {
        opacity: 1;
      }
      50% {
        opacity: var(--m3e-skeleton-accent-opacity, 6%);
      }
      100% {
        opacity: 1;
      }
    }
    @keyframes wave {
      0% {
        left: -150%;
      }
      100% {
        left: 100%;
      }
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
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();
    this.#createShapes();
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
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-skeleton": M3eSkeletonElement;
  }
}
