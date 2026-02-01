import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, HtmlFor } from "@m3e/core";
import { M3eDirectionality } from "@m3e/core/bidi";
import { AnchorPosition, positionAnchor } from "@m3e/core/anchoring";

import { BadgeSize } from "./BadgeSize";
import { BadgePosition } from "./BadgePosition";

/**
 * A visual indicator used to label content.
 *
 * @description
 * The `m3e-badge` component is a compact visual indicator used to label content. Designed
 * according to Material Design 3 guidelines, it can display counts, presence, or semantic
 * emphasis, and is attachable to icons, buttons, or other components. Badges support dynamic
 * sizing, color, and shape, ensuring clarity and accessibility while maintaining a consistent,
 * expressive appearance across surfaces.
 *
 * @example
 * The following example illustrates attaching a `m3e-badge` to another element using the `for` attribute.
 * ```html
 * <m3e-button id="button">Button</m3e-button>
 * <m3e-badge for="button">10</m3e-badge>
 * ```
 *
 * @tag m3e-badge
 *
 * @slot - Renders the content of the badge.
 *
 * @attr size - The size of the badge.
 *
 * @cssprop --m3e-badge-shape - Corner radius of the badge.
 * @cssprop --m3e-badge-color - Foreground color of badge content.
 * @cssprop --m3e-badge-container-color - Background color of the badge.
 * @cssprop --m3e-badge-small-size - Fixed dimensions for small badge. Used for minimal indicators (e.g. dot).
 * @cssprop --m3e-badge-medium-size - Height and min-width for medium badge.
 * @cssprop --m3e-badge-medium-font-size - Font size for medium badge label.
 * @cssprop --m3e-badge-medium-font-weight - Font weight for medium badge label.
 * @cssprop --m3e-badge-medium-line-height - Line height for medium badge label.
 * @cssprop --m3e-badge-medium-tracking - Letter spacing for medium badge label.
 * @cssprop --m3e-badge-large-size - Height and min-width for large badge.
 * @cssprop --m3e-badge-large-font-size - Font size for large badge label.
 * @cssprop --m3e-badge-large-font-weight - Font weight for large badge label.
 * @cssprop --m3e-badge-large-line-height - Line height for large badge label.
 * @cssprop --m3e-badge-large-tracking - Letter spacing for large badge label.
 */
@customElement("m3e-badge")
export class M3eBadgeElement extends HtmlFor(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: baseline;
    }
    .base {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      box-sizing: border-box;
      user-select: none;
      padding: var(--_badge-padding);
      border-radius: var(--m3e-badge-shape, ${DesignToken.shape.corner.full});
      color: var(--m3e-badge-color, ${DesignToken.color.onError});
      background-color: var(--m3e-badge-container-color, ${DesignToken.color.error});
    }
    :host([for]) {
      position: absolute;
      z-index: 1;
    }
    :host([for][position="above"]) {
      transform: translateY(var(--_badge-offset, 0px));
    }
    :host([for][position="above-after"]:not(:dir(rtl))) {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), var(--_badge-offset, 0px), 0);
    }
    :host([for][position="above-after"]:dir(rtl)) {
      transform: translate3d(var(--_badge-offset, 0px), var(--_badge-offset, 0px), 0);
    }
    :host([for][position="above-before"]:not(:dir(rtl))) {
      transform: translate3d(var(--_badge-offset, 0px), var(--_badge-offset, 0px), 0);
    }
    :host([for][position="above-before"]:dir(rtl)) {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), var(--_badge-offset, 0px), 0);
    }
    :host([for][position="below"]) {
      transform: translateY(calc(0px - var(--_badge-offset, 0px)));
    }
    :host([for][position="below-after"]:not(:dir(rtl))) {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for][position="below-after"]:dir(rtl)) {
      transform: translate3d(var(--_badge-offset, 0px), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for][position="below-before"]:not(:dir(rtl))) {
      transform: translate3d(var(--_badge-offset, 0px), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for][position="below-before"]:dir(rtl)) {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for][position="before"]:not(:dir(rtl))),
    :host([for][position="after"]:dir(rtl)) {
      transform: translateX(var(--_badge-offset, 0px));
    }
    :host([for][position="before"]:dir(rtl)),
    :host([for][position="after"]:not(:dir(rtl))) {
      transform: translateX(calc(0px - var(--_badge-offset, 0px)));
    }
    :host([size="small"]) {
      height: var(--m3e-badge-small-size, 0.375rem);
      max-height: var(--m3e-badge-small-size, 0.375rem);
      width: var(--m3e-badge-small-size, 0.375rem);
      min-width: var(--m3e-badge-small-size, 0.375rem);
      --_badge-offset: var(--m3e-badge-small-offset, 0.375rem);
    }
    :host([size="small"]) .base {
      font-size: 0;
    }
    :host([size="medium"]) {
      height: var(--m3e-badge-medium-size, 1.375rem);
      min-width: var(--m3e-badge-medium-size, 1.375rem);
      --_badge-offset: var(--m3e-badge-small-offset, 0.75rem);
    }
    :host([size="medium"]) .base {
      font-size: var(--m3e-badge-medium-font-size, ${DesignToken.typescale.standard.label.small.fontSize});
      font-weight: var(--m3e-badge-medium-font-weight, ${DesignToken.typescale.standard.label.small.fontWeight});
      line-height: var(--m3e-badge-medium-line-height, ${DesignToken.typescale.standard.label.small.lineHeight});
      letter-spacing: var(--m3e-badge-medium-tracking, ${DesignToken.typescale.standard.label.small.tracking});
    }
    :host([size="large"]) {
      height: var(--m3e-badge-large-size, 1.75rem);
      min-width: var(--m3e-badge-large-size, 1.75rem);
      --_badge-offset: var(--m3e-badge-small-offset, 1rem);
    }
    :host([size="large"]) .base {
      font-size: var(--m3e-badge-large-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-badge-large-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-badge-large-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-badge-large-tracking, ${DesignToken.typescale.standard.label.large.tracking});
    }
    @media (forced-colors: active) {
      .base {
        background-color: ButtonFace;
        color: ButtonText;
        outline: 1px solid ButtonText;
      }
    }
  `;

  /** @private */ #directionalitySubscription?: () => void;
  /** @private */ #anchorCleanup?: () => void;

  /**
   * The size of the badge.
   * @default "medium"
   */
  @property({ reflect: true }) size: BadgeSize = "medium";

  /**
   * The position of the badge, when attached to another element.
   * @default "above-after"
   */
  @property({ reflect: true }) position: BadgePosition = "above-after";

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    this.#attach();
  }

  /** @inheritdoc */
  override detach(): void {
    super.detach();
    this.#detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.#directionalitySubscription = M3eDirectionality.observe(() => this.#attach());
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#directionalitySubscription?.();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("position") || changedProperties.has("size") || changedProperties.has("htmlFor")) {
      this.#attach();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <slot @slotchange="${this.#handleSlotChange}"> <span aria-hidden="true">&nbsp;</span></slot>
    </div>`;
  }

  /** @internal */
  #handleSlotChange() {
    if (!this.isConnected) return;
    this.style.setProperty(
      "--_badge-padding",
      this.textContent && this.textContent.length > 2
        ? `0 ${this.size === "medium" ? "0.25rem" : this.size === "large" ? "0.5rem" : "0"}`
        : "",
    );
  }

  /** @private */
  #detach(): void {
    this.#anchorCleanup?.();
    this.#anchorCleanup = undefined;
  }

  /** @private */
  async #attach(): Promise<void> {
    this.#detach();

    if (!this.control) return;

    let position: AnchorPosition = "top-end";
    switch (this.position) {
      case "above":
        position = "top";
        break;
      case "above-before":
        position = "top-start";
        break;
      case "after":
        position = "right";
        break;
      case "before":
        position = "left";
        break;
      case "below":
        position = "bottom";
        break;
      case "below-after":
        position = "bottom-end";
        break;
      case "below-before":
        position = "bottom-start";
        break;
    }

    this.#anchorCleanup = await positionAnchor(this, this.control, { position }, (x, y) => {
      if (this.position.includes("before") && this.position !== "before") {
        if (M3eDirectionality.current === "rtl") {
          x += this.clientWidth;
        } else {
          x -= this.clientWidth;
        }
      }
      if (this.position.includes("after") && this.position !== "after") {
        if (M3eDirectionality.current === "rtl") {
          x -= this.clientWidth;
        } else {
          x += this.clientWidth;
        }
      }

      this.style.left = `${x}px`;
      this.style.top = `${y}px`;
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-badge": M3eBadgeElement;
  }
}
