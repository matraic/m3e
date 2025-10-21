import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, HtmlFor, Role } from "@m3e/core";
import { M3eDirectionality } from "@m3e/core/bidi";
import { AnchorPosition, positionAnchor } from "@m3e/core/anchoring";

import { BadgeSize } from "./BadgeSize";
import { BadgePosition } from "./BadgePosition";

/**
 * @summary
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
export class M3eBadgeElement extends HtmlFor(Role(LitElement, "status")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
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
    :host([for]:not([dir])) {
      visibility: hidden;
    }
    :host([for][position^="above"]) {
      margin-block-start: var(--_badge-offset, 0px);
    }
    :host([for][position^="below"]) {
      margin-block-start: calc(0px - var(--_badge-offset, 0px));
    }
    :host([for][position$="before"][dir="ltr"]),
    :host([for][position$="after"][dir="rtl"]) {
      margin-left: var(--_badge-offset, 0px);
    }
    :host([for][position$="before"][dir="rtl"]),
    :host([for][position$="after"][dir="ltr"]) {
      margin-left: calc(0px - var(--_badge-offset, 0px));
    }
    :host([size="small"]) {
      height: var(--m3e-badge-small-size, 0.375rem);
      max-height: var(--m3e-badge-small-size, 0.375rem);
      width: var(--m3e-badge-small-size, 0.375rem);
      min-width: var(--m3e-badge-small-size, 0.375rem);
      font-size: 0;
      --_badge-offset: var(--m3e-badge-small-offset, 0.375rem);
    }
    :host([size="medium"]) {
      height: var(--m3e-badge-medium-size, 1.375rem);
      min-width: var(--m3e-badge-medium-size, 1.375rem);
      font-size: var(--m3e-badge-medium-font-size, ${DesignToken.typescale.standard.label.small.fontSize});
      font-weight: var(--m3e-badge-medium-font-weight, ${DesignToken.typescale.standard.label.small.fontWeight});
      line-height: var(--m3e-badge-medium-line-height, ${DesignToken.typescale.standard.label.small.lineHeight});
      letter-spacing: var(--m3e-badge-medium-tracking, ${DesignToken.typescale.standard.label.small.tracking});
      --_badge-offset: var(--m3e-badge-small-offset, 0.75rem);
    }
    :host([size="large"]) {
      height: var(--m3e-badge-large-size, 1.75rem);
      min-width: var(--m3e-badge-large-size, 1.75rem);
      font-size: var(--m3e-badge-large-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-badge-large-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-badge-large-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-badge-large-tracking, ${DesignToken.typescale.standard.label.large.tracking});
      --_badge-offset: var(--m3e-badge-small-offset, 1rem);
    }
    @media (forced-colors: active) {
      :host {
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
    return html`<slot @slotchange="${this.#handleSlotChange}"> <span aria-hidden="true">&nbsp;</span></slot>`;
  }

  /** @internal */
  #handleSlotChange() {
    if (!this.isConnected) return;
    this.style.setProperty(
      "--_badge-padding",
      this.textContent && this.textContent.length > 2
        ? `0 ${this.size === "medium" ? "0.25rem" : this.size === "large" ? "0.5rem" : "0"}`
        : ""
    );
  }

  /** @private */
  #detach(): void {
    this.#anchorCleanup?.();
    this.#anchorCleanup = undefined;
    this.dir = "";
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
      this.dir = M3eDirectionality.current;
      if (this.position.includes("before") && this.position !== "before") {
        if (this.dir == "rtl") {
          x += this.clientWidth;
        } else {
          x -= this.clientWidth;
        }
      }
      if (this.position.includes("after") && this.position !== "after") {
        if (this.dir == "rtl") {
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
