/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import { addCustomState, AttachInternals, deleteCustomState, setCustomEnumState, setCustomState } from "../mixins";
import { DesignToken } from "../tokens";
import { prefersReducedMotion } from "../utils";
import { customElement } from "../decorators";
import { CollapsibleOrientation, isCollapsibleOrientation } from "./CollapsibleOrientation";

/**
 * A container used to expand and collapse content.
 *
 * @example
 * ```html
 * <m3e-collapsible>
 *  <!-- Collapsible content -->
 * </m3e-collapsible>
 * ```
 *
 * @tag m3e-collapsible
 *
 * @slot - Renders the collapsible content.
 *
 * @attr open - Whether content is visible.
 * @attr orientation - Orientation of collapsible content.
 * @attr no-animate - Whether to disable animation.
 * @attr slide - Whether content is docked to the trailing edge so it slides into view as the size animates.
 *
 * @fires opening - Dispatched when the collapsible begins to open.
 * @fires opened - Dispatched when the collapsible has opened.
 * @fires closing - Dispatched when the collapsible begins to close.
 * @fires closed - Dispatched when the collapsible has closed.
 *
 * @cssprop --m3e-collapsible-animation - The animation shorthand for expanding and collapsing content.
 * @cssprop --m3e-collapsible-animation-duration - The duration of the expand / collapse animation.
 * @cssprop --m3e-collapsible-animation-function - The timing function of the expand / collapse animation.
 */
@customElement("m3e-collapsible")
export class M3eCollapsibleElement extends AttachInternals(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      overflow: hidden;
      --_collapsible-animation: var(
        --m3e-collapsible-animation,
        var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
          var(--m3e-collapsible-animation-function, ${DesignToken.motion.easing.standard})
      );
    }
    :host([hidden]) {
      display: none;
    }
    :host(:is(:state(--vertical), :--vertical)) {
      height: 0px;
    }
    :host(:is(:state(--vertical), :--vertical):not([slide])) {
      transition: ${unsafeCSS(`visibility var(--_collapsible-animation),
        height var(--_collapsible-animation),
        padding-top var(--_collapsible-animation),
        padding-bottom var(--_collapsible-animation)`)};
    }
    :host(:is(:state(--vertical), :--vertical)[slide]) {
      transition: ${unsafeCSS(`visibility var(--_collapsible-animation),
        height var(--_collapsible-animation),
        padding-top var(--_collapsible-animation),
        padding-bottom var(--_collapsible-animation)`)};
    }
    :host(:is(:state(--horizontal), :--horizontal)) {
      width: 0px;
    }
    :host(:is(:state(--horizontal), :--horizontal):not([slide])) {
      transition: ${unsafeCSS(`visibility var(--_collapsible-animation),
        width var(--_collapsible-animation),
        padding-left var(--_collapsible-animation),
        padding-right var(--_collapsible-animation)`)};
    }
    :host(:is(:state(--horizontal), :--horizontal)[slide]) {
      transition: ${unsafeCSS(`visibility var(--_collapsible-animation),
        width var(--_collapsible-animation),
        padding-left var(--_collapsible-animation),
        padding-right var(--_collapsible-animation)`)};
    }
    :host(:is(:state(--both), :--both)) {
      height: 0px;
      width: 0px;
    }
    :host(:is(:state(--both), :--both):not([slide])) {
      transition: ${unsafeCSS(`visibility var(--_collapsible-animation),
        width var(--_collapsible-animation),
        height var(--_collapsible-animation),
        padding var(--_collapsible-animation)`)};
    }
    :host(:is(:state(--both), :--both)[slide]) {
      transition: ${unsafeCSS(`visibility var(--_collapsible-animation),
        width var(--_collapsible-animation),
        height var(--_collapsible-animation),
        padding var(--_collapsible-animation)`)};
    }
    :host(:not(:is(:state(--closing), :--closing)):not([open])) {
      visibility: hidden;
    }
    :host(:is(:state(--vertical), :--vertical):not([open])) {
      min-height: unset !important;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }
    :host(:is(:state(--horizontal), :--horizontal):not([open])) {
      min-width: unset !important;
      padding-left: 0px !important;
      padding-right: 0px !important;
    }
    :host(:is(:state(--both), :--both):not([open])) {
      min-height: unset !important;
      min-width: unset !important;
      padding: 0px !important;
    }
    :host([no-animate]),
    :host(:is(:state(--no-animate), :--no-animate)) {
      transition-duration: 0ms;
    }
    :host(:is(:state(--vertical), :--vertical):is(:state(--opening), :--opening)),
    :host(:is(:state(--vertical), :--vertical):is(:state(--closing), :--closing)) {
      overflow-y: hidden !important;
    }
    :host(:is(:state(--horizontal), :--horizontal):is(:state(--opening), :--opening)),
    :host(:is(:state(--horizontal), :--horizontal):is(:state(--closing), :--closing)) {
      overflow-x: hidden !important;
    }
    :host(:is(:state(--both), :--both):is(:state(--opening), :--opening)),
    :host(:is(:state(--both), :--both):is(:state(--closing), :--closing)) {
      overflow-y: hidden !important;
      overflow-x: hidden !important;
    }
    :host(:is(:state(--overflows), :--overflows)) {
      scrollbar-gutter: stable;
    }
    .content {
      display: flow-root;
      flex: none;
    }
    :host([slide]:not([hidden]):is(:not([open]), :state(--opening), :state(--closing), :--opening, :--closing)) {
      display: flex;
      justify-content: var(--m3e-collapsible-slide-dock, flex-end);
    }
    :host(
      :is(:state(--vertical), :--vertical)[slide]:not([hidden]):is(
          :not([open]),
          :state(--opening),
          :state(--closing),
          :--opening,
          :--closing
        )
    ) {
      flex-direction: column;
    }
    :host(
      :is(:state(--both), :--both)[slide]:not([hidden]):is(
          :not([open]),
          :state(--opening),
          :state(--closing),
          :--opening,
          :--closing
        )
    ) {
      align-items: flex-end;
    }
    ::slotted(*) {
      --m3e-collapsible-animation: initial;
      --m3e-collapsible-animation-duration: initial;
      --m3e-collapsible-animation-function: initial;
    }
    @media (prefers-reduced-motion) {
      :host(:is(:state(--vertical), :--vertical):not([slide])),
      :host(:is(:state(--vertical), :--vertical)[slide]),
      :host(:is(:state(--horizontal), :--horizontal):not([slide])),
      :host(:is(:state(--horizontal), :--horizontal)[slide]),
      :host(:is(:state(--both), :--both):not([slide])),
      :host(:is(:state(--both), :--both)[slide]) {
        transition: none;
      }
    }
  `;

  /** @private */ #slotChanged = false;
  /** @private */ #hasOpened = false;

  /**
   * Whether content is visible.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * Orientation of collapsible content.
   * @default "vertical"
   */
  @property({ reflect: true, useDefault: true }) orientation: CollapsibleOrientation = "vertical";

  /**
   * Whether to disable animation.
   * @default false
   */
  @property({ attribute: "no-animate", type: Boolean, reflect: true }) noAnimate = false;

  /**
   * Whether content slides into view.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) slide = false;

  /** @private */
  get #contentHeight(): number {
    const style = getComputedStyle(this);
    const content = this.shadowRoot?.querySelector<HTMLElement>(".content");
    return (content?.scrollHeight ?? 0) + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
  }

  /** @private */
  get #contentWidth(): number {
    const style = getComputedStyle(this);
    const content = this.shadowRoot?.querySelector<HTMLElement>(".content");
    return (content?.scrollWidth ?? 0) + parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.#applyOrientation();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("orientation")) {
      this.#applyOrientation();
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    const noAnimate =
      this.noAnimate ||
      ((changedProperties.has("orientation") || changedProperties.has("slide")) && !changedProperties.has("open"));

    addCustomState(this, "--no-animate");

    if (!this.#slotChanged) {
      if (this.open) {
        this.#hasOpened = true;
        this.#autoSize();
      }
      this.#slotChanged = true;
      return;
    }

    this.toggleAttribute("inert", !this.open);

    if (this.open) {
      this.#hasOpened = true;

      if (!(noAnimate || prefersReducedMotion())) {
        this.#autoSize();
        setCustomState(
          this,
          "--overflows",
          this.orientation === "vertical"
            ? this.clientHeight < this.#contentHeight
            : this.orientation === "horizontal"
              ? this.clientWidth < this.#contentWidth
              : this.clientHeight < this.#contentHeight || this.clientWidth < this.#contentWidth,
        );
        this.#clearSize();
      }

      deleteCustomState(this, "--closing");
      addCustomState(this, "--opening");
      this.dispatchEvent(new Event("opening"));

      this.#clearSize();
      deleteCustomState(this, "--no-animate");
      this.#actualSize();

      if (noAnimate || prefersReducedMotion()) {
        this.#autoSize();
        deleteCustomState(this, "--opening");
        this.dispatchEvent(new Event("opened"));
      } else {
        this.addEventListener(
          "transitionend",
          () => {
            if (this.open) {
              this.#autoSize();
              deleteCustomState(this, "--opening");
              this.dispatchEvent(new Event("opened"));
            }
          },
          { once: true },
        );
      }
    } else {
      deleteCustomState(this, "--opening");
      addCustomState(this, "--closing");
      this.dispatchEvent(new Event("closing"));

      this.#actualSize();
      if (this.#hasOpened) {
        deleteCustomState(this, "--no-animate");
      }

      if (noAnimate || prefersReducedMotion()) {
        this.#clearSize();
        deleteCustomState(this, "--closing");
        this.dispatchEvent(new Event("closed"));
      } else {
        // Commit the explicit size so the collapse transitions from it rather than from `auto`.
        void this.offsetHeight;
        this.#clearSize();
        this.addEventListener(
          "transitionend",
          () => {
            if (!this.open) {
              deleteCustomState(this, "--closing");
              this.dispatchEvent(new Event("closed"));
            }
          },
          { once: true },
        );
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="content"><slot @slotchange=${this.#handleSlotChange}></slot></div>`;
  }

  /** @private */
  #applyOrientation(): void {
    if (!isCollapsibleOrientation(this.orientation)) {
      this.orientation = "horizontal";
    }
    setCustomEnumState(this, this.orientation, "both", "horizontal", "vertical");
  }

  /** @private */
  #handleSlotChange() {
    this.#slotChanged = true;
  }

  /** @private */
  #autoSize(): void {
    switch (this.orientation) {
      case "vertical":
        this.style.height = "auto";
        break;
      case "horizontal":
        this.style.width = "auto";
        break;
      case "both":
        this.style.height = this.style.width = "auto";
        break;
    }
  }

  /** @private */
  #clearSize(): void {
    switch (this.orientation) {
      case "vertical":
        this.style.height = "";
        break;
      case "horizontal":
        this.style.width = "";
        break;
      case "both":
        this.style.height = this.style.width = "";
        break;
    }
  }

  /** @private */
  #actualSize(): void {
    switch (this.orientation) {
      case "vertical":
        this.style.height = `${this.#contentHeight}px`;
        break;
      case "horizontal":
        this.style.width = `${this.#contentWidth}px`;
        break;
      case "both":
        this.style.height = `${this.#contentHeight}px`;
        this.style.width = `${this.#contentWidth}px`;
        break;
    }
  }
}

interface M3eCollapsibleElementEventMap extends HTMLElementEventMap {
  opening: Event;
  opened: Event;
  closing: Event;
  closed: Event;
}

export interface M3eCollapsibleElement {
  addEventListener<K extends keyof M3eCollapsibleElementEventMap>(
    type: K,
    listener: (this: M3eCollapsibleElement, ev: M3eCollapsibleElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eCollapsibleElementEventMap>(
    type: K,
    listener: (this: M3eCollapsibleElement, ev: M3eCollapsibleElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-collapsible": M3eCollapsibleElement;
  }
}
