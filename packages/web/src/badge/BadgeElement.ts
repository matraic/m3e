import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import {
  AttachInternals,
  customElement,
  DesignToken,
  HtmlFor,
  MutationController,
  ReconnectedCallback,
  setCustomEnumState,
} from "@m3e/web/core";

import { M3eDirectionality, SupportsDirectionality } from "@m3e/web/core/bidi";
import { AnchorPosition, positionAnchor } from "@m3e/web/core/anchoring";

import { BadgeSize, isBadgeSize } from "./BadgeSize";
import { BadgePosition, isBadgePosition } from "./BadgePosition";

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
export class M3eBadgeElement extends ReconnectedCallback(HtmlFor(SupportsDirectionality(AttachInternals(LitElement)))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host([for]) .outer,
    :host(:not([for])) {
      display: inline-block;
      vertical-align: baseline;
      pointer-events: none;
    }
    :host(:not([for])[hidden]),
    :host([for][hidden]) .outer {
      display: none;
    }
    :host(:not([for])) .outer,
    :host([for]) .inner {
      contain: layout style paint;
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
    :host(:not([for])) .inner,
    :host([for]) {
      display: contents;
    }
    :host([for]) .outer {
      position: absolute;
      z-index: 1;
    }
    :host([for]:is(:state(--above), :--above)) .outer {
      transform: translateY(var(--_badge-offset, 0px));
    }
    :host([for]:is(:state(--above-after), :--above-after):not(:is(:state(--rtl), :--rtl))) .outer {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), var(--_badge-offset, 0px), 0);
    }
    :host([for]:is(:state(--above-after), :--above-after):is(:state(--rtl), :--rtl)) .outer {
      transform: translate3d(var(--_badge-offset, 0px), var(--_badge-offset, 0px), 0);
    }
    :host([for]:is(:state(--above-before), :--above-before):not(:is(:state(--rtl), :--rtl))) .outer {
      transform: translate3d(var(--_badge-offset, 0px), var(--_badge-offset, 0px), 0);
    }
    :host([for]:is(:state(--above-before), :--above-before):is(:state(--rtl), :--rtl)) .outer {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), var(--_badge-offset, 0px), 0);
    }
    :host([for]:is(:state(--below), :--below)) .outer {
      transform: translateY(calc(0px - var(--_badge-offset, 0px)));
    }
    :host([for]:is(:state(--below-after), :--below-after):not(:is(:state(--rtl), :--rtl))) .outer {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for]:is(:state(--below-after), :--below-after):is(:state(--rtl), :--rtl)) .outer {
      transform: translate3d(var(--_badge-offset, 0px), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for]:is(:state(--below-before), :--below-before):not(:is(:state(--rtl), :--rtl))) .outer {
      transform: translate3d(var(--_badge-offset, 0px), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for]:is(:state(--below-before), :--below-before):is(:state(--rtl), :--rtl)) .outer {
      transform: translate3d(calc(0px - var(--_badge-offset, 0px)), calc(0px - var(--_badge-offset, 0px)), 0);
    }
    :host([for]:is(:state(--before), :--before):not(:is(:state(--rtl), :--rtl))) .outer,
    :host([for]:is(:state(--before), :--before):is(:state(--rtl), :--rtl)) .outer {
      transform: translateX(var(--_badge-offset, 0px));
    }
    :host([for]:is(:state(--after), :--after):not(:is(:state(--rtl), :--rtl))) .outer,
    :host([for]:is(:state(--after), :--after):is(:state(--rtl), :--rtl)) .outer {
      transform: translateX(calc(0px - var(--_badge-offset, 0px)));
    }
    :host(:is(:state(--small), :--small):not([for])),
    :host(:is(:state(--small), :--small)[for]) .outer {
      height: var(--m3e-badge-small-size, 6px);
      max-height: var(--m3e-badge-small-size, 6px);
      width: var(--m3e-badge-small-size, 6px);
      min-width: var(--m3e-badge-small-size, 6px);
      --_badge-offset: var(--m3e-badge-small-offset, 6px);
    }
    :host(:is(:state(--small), :--small)) .outer {
      font-size: 0;
    }
    :host(:is(:state(--medium), :--medium):not([for])),
    :host(:is(:state(--medium), :--medium)[for]) .outer {
      height: var(--m3e-badge-medium-size, 22px);
      min-width: var(--m3e-badge-medium-size, 22px);
      --_badge-offset: var(--m3e-badge-small-offset, 12px);
    }
    :host(:is(:state(--medium), :--medium)) .outer {
      font-size: var(--m3e-badge-medium-font-size, ${DesignToken.typescale.standard.label.small.fontSize});
      font-weight: var(--m3e-badge-medium-font-weight, ${DesignToken.typescale.standard.label.small.fontWeight});
      line-height: var(--m3e-badge-medium-line-height, ${DesignToken.typescale.standard.label.small.lineHeight});
      letter-spacing: var(--m3e-badge-medium-tracking, ${DesignToken.typescale.standard.label.small.tracking});
    }
    :host(:is(:state(--large), :--large):not([for])),
    :host(:is(:state(--large), :--large)[for]) .outer {
      height: var(--m3e-badge-large-size, 28px);
      min-width: var(--m3e-badge-large-size, 28px);
      --_badge-offset: var(--m3e-badge-small-offset, 16px);
    }
    :host(:is(:state(--large), :--large)) .outer {
      font-size: var(--m3e-badge-large-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-badge-large-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-badge-large-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-badge-large-tracking, ${DesignToken.typescale.standard.label.large.tracking});
    }
    @media (forced-colors: active) {
      .outer {
        background-color: ButtonFace;
        color: ButtonText;
        outline: 1px solid ButtonText;
      }
    }
  `;

  constructor() {
    super();

    new MutationController(this, {
      skipInitial: true,
      config: {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: false,
      },
      callback: () => this.#updatePadding(),
    });
  }

  /** @private */ #directionalitySubscription?: () => void;
  /** @private */ #anchorCleanup?: () => void;
  /** @private */ #anchorLastPosition?: { x: number; y: number };

  /**
   * The size of the badge.
   * @default "medium"
   */
  @property({ reflect: true, useDefault: true }) size: BadgeSize = "medium";

  /**
   * The position of the badge, when attached to another element.
   * @default "above-after"
   */
  @property({ reflect: true, useDefault: true }) position: BadgePosition = "above-after";

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

    this.#applySize();
    this.#applyPosition();
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#directionalitySubscription?.();
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();
    this.#initAnchoring();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("size")) {
      this.#applySize();
    }
    if (_changedProperties.has("position")) {
      this.#applyPosition();
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.#initAnchoring();
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
    return html`<div class="outer">
      <div class="inner">
        <slot @slotchange=${this.#updatePadding}><span aria-hidden="true">&nbsp;</span></slot>
      </div>
    </div>`;
  }

  /** @private */
  #applySize(): void {
    if (!isBadgeSize(this.size)) {
      this.size = "medium";
    }
    setCustomEnumState(this, this.size, "small", "medium", "large");
  }

  /** @private */
  #applyPosition(): void {
    if (!isBadgePosition(this.position)) {
      this.position = "above-after";
    }
    setCustomEnumState(
      this,
      this.position,
      "above",
      "above-after",
      "above-before",
      "after",
      "before",
      "below",
      "below-after",
      "below-before",
    );
  }

  /** @private */
  #updatePadding() {
    if (!this.isConnected) return;
    this.shadowRoot
      ?.querySelector<HTMLElement>(".outer")
      ?.style.setProperty(
        "--_badge-padding",
        this.textContent && this.textContent.length > 2
          ? `0 ${this.size === "medium" ? "4px" : this.size === "large" ? "8px" : "0"}`
          : "",
      );
  }

  /** @private */
  #detach(): void {
    this.#anchorCleanup?.();
    this.#anchorCleanup = undefined;
    this.#anchorLastPosition = undefined;
  }

  /** @private */
  #attach(): void {
    this.#detach();
    this.#initAnchoring();
  }

  /** @private */
  async #initAnchoring(): Promise<void> {
    if (this.#anchorCleanup) return;
    if (!this.control) return;

    const outer = this.shadowRoot?.querySelector<HTMLElement>(".outer");
    if (!outer) return;

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

    this.#anchorCleanup = await positionAnchor(outer, this.control, { position }, (x, y) => {
      if (this.position.includes("before") && this.position !== "before") {
        if (M3eDirectionality.current === "rtl") {
          x += outer.clientWidth;
        } else {
          x -= outer.clientWidth;
        }
      }
      if (this.position.includes("after") && this.position !== "after") {
        if (M3eDirectionality.current === "rtl") {
          x -= outer.clientWidth;
        } else {
          x += outer.clientWidth;
        }
      }

      if (this.#anchorLastPosition?.x !== x) {
        outer.style.left = `${x}px`;
      }

      if (this.#anchorLastPosition?.y !== y) {
        outer.style.top = `${y}px`;
      }

      this.#anchorLastPosition = { x, y };
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-badge": M3eBadgeElement;
  }
}
