/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { EventAttribute } from "../mixins";
import { DesignToken } from "../tokens";
import { prefersReducedMotion } from "../utils";

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
 *
 * @fires opening - Emitted when the collapsible begins to open.
 * @fires opened - Emitted when the collapsible has opened.
 * @fires closing - Emitted when the collapsible begins to close.
 * @fires closed - Emitted when the collapsible has closed.
 *
 * @cssprop --m3e-collapsible-animation-duration - The duration of the expand / collapse animation.
 */
@customElement("m3e-collapsible")
export class M3eCollapsibleElement extends EventAttribute(LitElement, "opening", "opened", "closing", "closed") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      height: 0px;
      overflow: hidden;
      transition: ${unsafeCSS(`visibility var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
          ${DesignToken.motion.easing.standard},
        height var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
          ${DesignToken.motion.easing.standard},
        padding-top var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
          ${DesignToken.motion.easing.standard},
        padding-bottom var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
          ${DesignToken.motion.easing.standard}`)};
    }
    :host(:not(.-closing):not([open])) {
      visibility: hidden;
    }
    :host(:not([open])) {
      min-height: unset !important;
      padding-top: 0px !important;
      padding-bottom: 0px !important;
    }
    :host(.-no-animate) {
      transition-duration: 0ms;
    }
    ::slotted(*) {
      --m3e-collapsible-animation-duration: initial;
    }
    @media (prefers-reduced-motion) {
      :host {
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

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    this.classList.toggle("-no-animate", true);

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
      this.classList.toggle("-closing", false);
      this.classList.toggle("-opening", true);
      this.dispatchEvent(new Event("opening"));

      this.#clearSize();
      this.classList.toggle("-no-animate", false);
      this.#actualSize();

      if (prefersReducedMotion()) {
        this.classList.toggle("-opening", false);
        this.dispatchEvent(new Event("opened"));
      } else {
        this.addEventListener(
          "transitionend",
          () => {
            if (this.open) {
              this.#autoSize();
              this.classList.toggle("-opening", false);
              this.dispatchEvent(new Event("opened"));
            }
          },
          { once: true }
        );
      }
    } else {
      this.classList.toggle("-opening", false);
      this.classList.toggle("-closing", true);
      this.dispatchEvent(new Event("closing"));

      this.#actualSize();
      if (this.#hasOpened) {
        this.classList.toggle("-no-animate", false);
      }

      if (prefersReducedMotion()) {
        this.#clearSize();
        this.classList.toggle("-closing", false);
        this.dispatchEvent(new Event("closed"));
      } else {
        requestAnimationFrame(() => {
          this.#clearSize();
          this.addEventListener(
            "transitionend",
            () => {
              if (!this.open) {
                this.classList.toggle("-closing", false);
                this.dispatchEvent(new Event("closed"));
              }
            },
            { once: true }
          );
        });
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @private */
  #handleSlotChange() {
    this.#slotChanged = true;
  }

  /** @private */
  #autoSize(): void {
    this.style.height = "auto";
  }

  /** @private */
  #clearSize(): void {
    this.style.height = "";
  }

  /** @private */
  #actualSize(): void {
    this.style.height = `${this.scrollHeight}px`;
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
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eCollapsibleElementEventMap>(
    type: K,
    listener: (this: M3eCollapsibleElement, ev: M3eCollapsibleElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-collapsible": M3eCollapsibleElement;
  }
}
