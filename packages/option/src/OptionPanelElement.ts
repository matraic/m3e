/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement } from "lit/decorators.js";

import { DesignToken, ScrollController, Role } from "@m3e/core";
import { positionAnchor } from "@m3e/core/anchoring";

/**
 * Presents a list of options on a temporary surface.
 *
 * @description
 * The `m3e-option-panel` component renders a scrollable container for displaying selectable options
 * as a Material Design 3 menu surface. It provides dynamic positioning and anchoring to trigger elements,
 * automatic viewport boundary detection with intelligent repositioning, and smooth enter/exit animations.
 *
 * @tag m3e-option-panel
 *
 * @slot - Renders the contents of the list.
 *
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-option-panel-container-shape - Controls the corner radius of the menu container.
 * @cssprop --m3e-option-panel-container-min-width - Minimum width of the menu container.
 * @cssprop --m3e-option-panel-container-max-width - Maximum width of the menu container.
 * @cssprop --m3e-option-panel-container-max-height - Maximum height of the menu container.
 * @cssprop --m3e-option-panel-container-padding-block - Vertical padding inside the menu container.
 * @cssprop --m3e-option-panel-container-color - Background color of the menu container.
 * @cssprop --m3e-option-panel-container-elevation - Box shadow elevation of the menu container.
 * @cssprop --m3e-option-panel-divider-spacing - Vertical spacing around slotted `m3e-divider` elements.
 */
@customElement("m3e-option-panel")
export class M3eOptionPanelElement extends Role(LitElement, "listbox") {
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
      border-radius: var(--m3e-option-panel-container-shape, ${DesignToken.shape.corner.extraSmall});
      min-width: var(--m3e-option-panel-container-min-width, 7rem);
      max-width: var(--m3e-option-panel-container-max-width, 17.5rem);
      max-height: var(--m3e-option-panel-container-max-height, 17.5rem);
      padding-block: var(--m3e-option-panel-container-padding-block, 0.5rem);
      background-color: var(--m3e-option-panel-container-color, ${DesignToken.color.surfaceContainer});
      box-shadow: var(--m3e-option-panel-container-elevation, ${DesignToken.elevation.level3});
      opacity: 0;
      display: none;
    }
    :host(:not(.-no-animate)) {
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}, 
        transform ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard},
        overlay ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete,
        display ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    :host {
      transform: scaleY(0.8);
    }
    :host(:popover-open) {
      transform: scaleY(1);
      display: inline-flex;
      opacity: 1;
    }
    :host::backdrop {
      background-color: transparent;
    }
    :host(.-bottom) {
      transform-origin: top;
    }
    :host(.-top) {
      transform-origin: bottom;
    }
    ::slotted(m3e-divider) {
      margin-block: var(--m3e-option-panel-divider-spacing, 0.5rem);
    }
    @starting-style {
      :host(:popover-open) {
        transform: scaleY(0.8);
      }
    }
    @media (prefers-reduced-motion) {
      :host(:not(.-no-animate)) {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      :host {
        background-color: Menu;
        color: MenuText;
        border: 1px solid CanvasText;
      }
    }
  `;

  /** @private */ #trigger?: HTMLElement;
  /** @private */ #anchor?: HTMLElement;
  /** @private */ #anchorCleanup?: () => void;

  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);
  /** @private */ readonly #scrollController = new ScrollController(this, {
    target: null,
    callback: () => this.hide(false),
  });

  /** @private */ readonly #toggleHandler = (e: ToggleEvent) => {
    if (e.newState === "closed") {
      this.#anchorCleanup?.();
      this.#anchorCleanup = undefined;
    }
  };

  /** Whether the menu is open. */
  get isOpen() {
    return this.#trigger !== undefined;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.classList.add("-no-animate");
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
   * Opens the menu.
   * @param {HTMLElement} trigger The element that triggered the menu.
   * @param {HTMLElement | undefined} anchor The element used to position the menu.
   * @returns {Promise<void>} A `Promise` that resolves when the menu is opened.
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
        shift: true,
      },
      (x, y, position) => {
        this.classList.toggle("-top", position.includes("top"));
        this.classList.toggle("-bottom", position.includes("bottom"));

        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
      }
    );

    this.showPopover();

    this.#trigger = trigger;
    this.#trigger.ariaExpanded = "true";
    this.#anchor = anchor;
    this.#scrollController.observe(this.#trigger);
  }

  /**
   * Hides the menu.
   * @param {boolean} [restoreFocus=false] Whether to restore focus to the menu's trigger.
   */
  hide(restoreFocus: boolean = false): void {
    this.hidePopover();

    if (this.#trigger) {
      this.#trigger.ariaExpanded = "false";
      if (restoreFocus) {
        this.#trigger.focus();
      }
      this.#scrollController.unobserve(this.#trigger);
      this.#trigger = undefined;
    }
  }

  /**
   * Toggles the menu.
   * @param {HTMLElement} trigger The element that triggered the menu.
   * @param {HTMLElement | undefined} anchor The element used to position the menu.
   * @returns {Promise<void>} A `Promise` that resolves when the menu is opened or closed.
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
    return html`<slot></slot>`;
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    requestAnimationFrame(() => this.classList.remove("-no-animate"));
  }

  /** @private */
  #handleDocumentClick(e: MouseEvent): void {
    if (
      !e.composedPath().some((x) => x instanceof M3eOptionPanelElement || x === this.#trigger || x === this.#anchor)
    ) {
      this.hide();
    }
  }
}

interface M3eOptionPanelElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eOptionPanelElement {
  addEventListener<K extends keyof M3eOptionPanelElementEventMap>(
    type: K,
    listener: (this: M3eOptionPanelElement, ev: M3eOptionPanelElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eOptionPanelElementEventMap>(
    type: K,
    listener: (this: M3eOptionPanelElement, ev: M3eOptionPanelElementEventMap[K]) => void,
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
    "m3e-option-panel": M3eOptionPanelElement;
  }
}
