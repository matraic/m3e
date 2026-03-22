/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";

import {
  AttachInternals,
  setCustomState,
  customElement,
  DesignToken,
  ScrollController,
  SuppressInitialAnimation,
} from "@m3e/web/core";

import { M3eDirectionality } from "@m3e/web/core/bidi";

import { positionAnchor } from "./positionAnchor";
import { FloatingPanelScrollStrategy } from "./FloatingPanelScrollStrategy";

/**
 * A lightweight, generic floating surface used to present content above the page.
 *
 * @tag m3e-floating-panel
 *
 * @attr scroll-strategy - The strategy that controls how the panel behaves when its trigger scrolls.
 *
 * @slot - Renders the contents of the panel.
 *
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-floating-panel-container-shape - Corner radius of the panel container.
 * @cssprop --m3e-floating-panel-container-min-width - Minimum width of the panel container.
 * @cssprop --m3e-floating-panel-container-max-width - Maximum width of the panel container.
 * @cssprop --m3e-floating-panel-container-max-height - Maximum height of the panel container.
 * @cssprop --m3e-floating-panel-container-padding-block - Vertical padding inside the panel container.
 * @cssprop --m3e-floating-panel-container-padding-inline - Horizontal padding inside the panel container.
 * @cssprop --m3e-floating-panel-container-color - Background color of the panel container.
 * @cssprop --m3e-floating-panel-container-elevation - Box shadow elevation of the panel container.
 */
@customElement("m3e-floating-panel")
export class M3eFloatingPanelElement extends SuppressInitialAnimation(AttachInternals(LitElement)) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      position: absolute;
      flex-direction: column;
      padding: unset;
      margin: unset;
      border: unset;
      overflow-y: auto;
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
      scrollbar-color: ${DesignToken.scrollbar.color};
      scroll-padding-block: calc(
        var(--m3e-focus-ring-thickness, 3px) + var(--m3e-floating-panel-container-padding-block, 0.25rem)
      );
      border-radius: var(--m3e-floating-panel-container-shape, ${DesignToken.shape.corner.large});
      min-width: var(--m3e-floating-panel-container-min-width, 7rem);
      max-width: var(--m3e-floating-panel-container-max-width, 17.5rem);
      max-height: var(--m3e-floating-panel-container-max-height, 17.5rem);
      background-color: var(--m3e-floating-panel-container-color, ${DesignToken.color.surfaceContainer});
      box-shadow: var(--m3e-floating-panel-container-elevation, ${DesignToken.elevation.level3});
      opacity: 0;
      display: none;
    }
    .base {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      padding-block: var(--m3e-floating-panel-container-padding-block, 0.25rem);
      padding-inline: var(--m3e-floating-panel-container-padding-inline, 0.25rem);
    }
    :host(:not(:state(-no-animate))) {
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}, 
            transform ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard},
            overlay ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete,
            display ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host {
      transform: scaleY(0.8);
    }
    :host(:popover-open) {
      transform: scaleY(1);
      display: block;
      opacity: 1;
    }
    :host::backdrop {
      background-color: transparent;
    }
    :host(:state(-bottom)) {
      transform-origin: top;
    }
    :host(:state(-top)) {
      transform-origin: bottom;
    }
    @starting-style {
      :host(:popover-open) {
        transform: scaleY(0.8);
      }
    }
    @media (prefers-reduced-motion) {
      :host(:not(:state(-no-animate))) {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      :host {
        background-color: Menu;
        color: MenuText;
        outline: 1px solid MenuText;
      }
    }
  `;

  /** @private */ #trigger?: HTMLElement;
  /** @private */ #anchor?: HTMLElement;
  /** @private */ #anchorCleanup?: () => void;

  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);

  /** @private */ readonly #toggleHandler = (e: ToggleEvent) => {
    if (e.newState === "closed") {
      this.#anchorCleanup?.();
      this.#anchorCleanup = undefined;
    }
  };

  /** @private */
  readonly #scrollController = new ScrollController(this, {
    target: null,
    callback: () => this.hide(false),
  });

  /** The strategy that controls how the panel behaves when its trigger scrolls. */
  @property({ attribute: "scroll-strategy" }) scrollStrategy: FloatingPanelScrollStrategy = "hide";

  /** Whether the panel is open. */
  get isOpen() {
    return this.#trigger !== undefined;
  }

  /** The element that triggered the panel to open. */
  get trigger(): HTMLElement | null {
    return this.#trigger ?? null;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("popover", "manual");
    this.addEventListener("toggle", this.#toggleHandler);
    document.addEventListener("click", this.#documentClickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("toggle", this.#toggleHandler);
    document.removeEventListener("click", this.#documentClickHandler);
  }

  /**
   * Opens the panel.
   * @param {HTMLElement} trigger The element that triggered the panel.
   * @param {HTMLElement | undefined} anchor The element used to position the panel.
   * @returns {Promise<void>} A `Promise` that resolves when the panel is opened.
   */
  async show(trigger: HTMLElement, anchor?: HTMLElement): Promise<void> {
    if (this.#trigger && this.#trigger !== trigger) {
      this.hide();
    }

    this.#anchorCleanup = await positionAnchor(
      this,
      anchor ?? trigger,
      {
        position: "bottom-start",
        inline: true,
        flip: true,
      },
      (x, y, position) => {
        setCustomState(this, "-top", position.includes("top"));
        setCustomState(this, "-bottom", position.includes("bottom"));

        if (M3eDirectionality.current === "rtl") {
          this.style.right = `${window.innerWidth - x - this.clientWidth}px`;
          this.style.left = "";
        } else {
          this.style.left = `${x}px`;
          this.style.right = "";
        }

        this.style.top = `${y}px`;
      },
    );

    this.showPopover();

    this.#trigger = trigger;
    this.#trigger.ariaExpanded = "true";
    this.#anchor = anchor;

    if (this.scrollStrategy === "hide") {
      this.#scrollController.observe(this.#anchor ?? this.#trigger);
    }
  }

  /**
   * Hides the panel.
   * @param {boolean} [restoreFocus=false] Whether to restore focus to the panel's trigger.
   */
  hide(restoreFocus: boolean = false): void {
    this.hidePopover();

    if (this.#trigger) {
      this.#trigger.ariaExpanded = "false";
      if (restoreFocus) {
        this.#trigger.focus();
      }

      this.#scrollController.unobserve(this.#anchor ?? this.#trigger);

      this.#trigger = undefined;
      this.#anchor = undefined;
    }
  }

  /**
   * Toggles the panel.
   * @param {HTMLElement} trigger The element that triggered the panel.
   * @param {HTMLElement | undefined} anchor The element used to position the panel.
   * @returns {Promise<void>} A `Promise` that resolves when the panel is opened or closed.
   */
  async toggle(trigger: HTMLElement, anchor?: HTMLElement): Promise<void> {
    if (this.#trigger) {
      this.hide();
    } else {
      await this.show(trigger, anchor);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base"><slot></slot></div>`;
  }

  /** @private */
  #handleDocumentClick(e: MouseEvent): void {
    if (this.isOpen && !e.composedPath().some((x) => x === this || x === this.#trigger || x === this.#anchor)) {
      this.hide();
    }
  }
}

interface M3eFloatingPanelElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eFloatingPanelElement {
  addEventListener<K extends keyof M3eFloatingPanelElementEventMap>(
    type: K,
    listener: (this: M3eFloatingPanelElement, ev: M3eFloatingPanelElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eFloatingPanelElementEventMap>(
    type: K,
    listener: (this: M3eFloatingPanelElement, ev: M3eFloatingPanelElementEventMap[K]) => void,
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
    "m3e-floating-panel": M3eFloatingPanelElement;
  }
}
