/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, DisabledMixin, Role, ScrollController } from "@m3e/core";
import { RovingTabIndexManager } from "@m3e/core/a11y";
import { M3eDirectionality } from "@m3e/core/bidi";
import { positionAnchor } from "@m3e/core/anchoring";

import { M3eFabElement } from "@m3e/fab";

import { FabMenuVariant } from "./FabMenuVariant";
import { M3eFabMenuItemElement } from "./FabMenuItemElement";

/**
 * @summary
 * A menu, opened from a floating action button (FAB), used to display multiple related actions.
 *
 * @description
 * The `m3e-fab-menu` component presents a dynamic menu of related actions, elegantly revealed from a
 * floating action button (FAB). Designed using expressive, adaptive surfaces, it enables seamless access
 * to contextual actions in modern, visually rich interfaces.
 *
 * @example
 * The following example illustrates triggering a `m3e-fab-menu` from an `m3e-fab` using a `m3e-fab-menu-trigger`.
 * ```html
 * <m3e-fab variant="primary" size="large">
 *  <m3e-fab-menu-trigger for="fabmenu">
 *    <m3e-icon name="edit"></m3e-icon>
 *  </m3e-fab-menu-trigger>
 * </m3e-fab>
 * <m3e-fab-menu id="fabmenu" variant="secondary">
 *  <m3e-fab-menu-item>First</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Second</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Third</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Forth</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Fifth</m3e-fab-menu-item>
 *  <m3e-fab-menu-item>Sixth</m3e-fab-menu-item>
 * </m3e-fab-menu>
 * ```
 *
 * @tag m3e-fab-menu
 *
 * @slot - Renders the contents of the menu.
 *
 * @attr variant - The appearance variant of the menu.
 *
 * @cssprop --m3e-fab-menu-spacing - Vertical gap between menu items.
 * @cssprop --m3e-fab-menu-max-width - Maximum width of the menu.
 * @cssprop --m3e-primary-fab-color - Foreground color for primary variant items.
 * @cssprop --m3e-primary-fab-container-color - Container color for primary variant items.
 * @cssprop --m3e-primary-fab-hover-color - Hover background color for primary variant items.
 * @cssprop --m3e-primary-fab-focus-color - Focus background color for primary variant items.
 * @cssprop --m3e-primary-fab-ripple-color - Ripple color for primary variant items.
 * @cssprop --m3e-secondary-fab-color - Foreground color for secondary variant items.
 * @cssprop --m3e-secondary-fab-container-color - Container color for secondary variant items.
 * @cssprop --m3e-secondary-fab-hover-color - Hover background color for secondary variant items.
 * @cssprop --m3e-secondary-fab-focus-color - Focus background color for secondary variant items.
 * @cssprop --m3e-secondary-fab-ripple-color - Ripple color for secondary variant items.
 * @cssprop --m3e-tertiary-fab-color - Foreground color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-container-color - Container color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-hover-color - Hover background color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-focus-color - Focus background color for tertiary variant items.
 * @cssprop --m3e-tertiary-fab-ripple-color - Ripple color for tertiary variant items.
 */
@customElement("m3e-fab-menu")
export class M3eFabMenuElement extends Role(LitElement, "menu") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      position: absolute;
      flex-direction: column;
      row-gap: var(--m3e-fab-menu-spacing, 0.25rem);
      padding: unset;
      margin: unset;
      border: unset;
      overflow: visible;
      max-width: var(--m3e-fab-menu-max-width, 17.5rem);
      opacity: 0;
      background-color: transparent;
      display: none;
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.spring.fastEffects}, 
        transform ${DesignToken.motion.spring.fastSpatial},
        overlay ${DesignToken.motion.spring.fastEffects} allow-discrete,
        display ${DesignToken.motion.spring.fastEffects} allow-discrete`
      )};
    }
    .base {
      display: contents;
    }
    :host([variant="primary"]) .base {
      --_fab-menu-item-color: var(--m3e-primary-fab-color, ${DesignToken.color.onPrimaryContainer});
      --_fab-menu-item-container-color: var(--m3e-primary-fab-container-color, ${DesignToken.color.primaryContainer});
      --_fab-menu-background-hover-color: var(--m3e-primary-fab-hover-color, ${DesignToken.color.onPrimaryContainer});
      --_fab-menu-background-focus-color: var(--m3e-primary-fab-focus-color, ${DesignToken.color.onPrimaryContainer});
      --_fab-menu-ripple-color: var(--m3e-primary-fab-ripple-color, ${DesignToken.color.onPrimaryContainer});
    }
    :host([variant="secondary"]) .base {
      --_fab-menu-item-color: var(--m3e-secondary-fab-color, ${DesignToken.color.onSecondaryContainer});
      --_fab-menu-item-container-color: var(
        --m3e-secondary-fab-container-color,
        ${DesignToken.color.secondaryContainer}
      );
      --_fab-menu-background-hover-color: var(
        --m3e-secondary-fab-hover-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --_fab-menu-background-focus-color: var(
        --m3e-secondary-fab-focus-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --_fab-menu-ripple-color: var(--m3e-secondary-fab-ripple-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host([variant="tertiary"]) .base {
      --_fab-menu-item-color: var(--m3e-tertiary-fab-color, ${DesignToken.color.onTertiaryContainer});
      --_fab-menu-item-container-color: var(--m3e-tertiary-fab-container-color, ${DesignToken.color.tertiaryContainer});
      --_fab-menu-background-hover-color: var(--m3e-tertiary-fab-hover-color, ${DesignToken.color.onTertiaryContainer});
      --_fab-menu-background-focus-color: var(--m3e-tertiary-fab-focus-color, ${DesignToken.color.onTertiaryContainer});
      --_fab-menu-ripple-color: var(--m3e-tertiary-fab-ripple-color, ${DesignToken.color.onTertiaryContainer});
    }
    :host {
      transform: scaleX(0.8);
    }
    :host(.-left) {
      align-items: flex-start;
      transform-origin: left;
    }
    :host(.-right) {
      align-items: flex-end;
      transform-origin: right;
    }
    :host(:popover-open) {
      transform: scaleX(1);
      display: inline-flex;
      opacity: 1;
    }
    :host::backdrop {
      background-color: transparent;
    }
    @starting-style {
      :host(:popover-open) {
        opacity: 0;
      }
      :host(:popover-open) {
        transform: scaleX(0.8);
      }
    }
    @media (prefers-reduced-motion) {
      :host {
        transition: none;
      }
    }
  `;

  /** @private */ #fabTabIndex?: number;
  /** @private */ #trigger?: HTMLElement;
  /** @private */ #anchoringCleanup?: () => void;

  /** @private */
  readonly #listManager = new RovingTabIndexManager<LitElement & DisabledMixin>()
    .withWrap()
    .withHomeAndEnd()
    .withVerticalOrientation();

  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);

  /** @private */
  readonly #scrollController = new ScrollController(this, { target: null, callback: () => this.hide() });

  /** @private */
  readonly #toggleHandler = (e: ToggleEvent) => {
    if (e.newState === "closed") {
      this.#anchoringCleanup?.();
      this.#anchoringCleanup = undefined;
    } else {
      setTimeout(() => {
        this.#listManager.setActiveItem(this.#listManager.items.find((x) => !x.disabled));
      }, 40);
    }
  };

  /**
   * The appearance variant of the menu.
   * @default "primary"
   */
  @property({ reflect: true }) variant: FabMenuVariant = "primary";

  /** Whether the menu is open. */
  get isOpen() {
    return this.#trigger !== undefined;
  }

  /**
   * Opens the menu.
   * @param {HTMLElement} trigger The element that triggered the menu.
   * @returns {Promise<void>} A `Promise` that resolves when the menu is opened.
   */
  async show(trigger: HTMLElement): Promise<void> {
    if (this.#trigger && this.#trigger !== trigger) {
      this.hide();
    }

    this.#anchoringCleanup?.();
    this.#anchoringCleanup = await positionAnchor(
      this,
      trigger,
      {
        position: M3eDirectionality.current === "ltr" ? "top-end" : "top-start",
        inline: true,
        shift: true,
        flip: true,
        offset: 8,
      },
      (x, y, position) => {
        this.classList.toggle("-right", position.includes("end"));
        this.classList.toggle("-left", position.includes("start"));
        this.style.left = `${x}px`;
        this.style.top = `${y}px`;
      }
    );

    this.showPopover();

    this.#trigger = trigger;
    this.#trigger.ariaExpanded = "true";
    this.#scrollController.observe(this.#trigger);

    this.#attachFab();
  }

  /**
   * Hides the menu.
   * @param {boolean} [restoreFocus=false] A value indicating whether to restore focus to the menu's trigger.
   */
  hide(restoreFocus: boolean = false): void {
    this.hidePopover();

    if (this.#trigger) {
      this.#trigger.ariaExpanded = "false";
      if (restoreFocus) {
        this.#trigger.focus();
      }

      this.#detachFab();

      this.#scrollController.unobserve(this.#trigger);
      this.#trigger = undefined;
    }
  }

  /**
   * Toggles the menu.
   * @param {HTMLElement} trigger The element that triggered the menu.
   * @returns {Promise<void>} A `Promise` that resolves when the menu is opened or closed.
   */
  async toggle(trigger: HTMLElement): Promise<void> {
    if (this.#trigger) {
      this.hide();
    } else {
      await this.show(trigger);
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.tabIndex = -1;
    this.setAttribute("popover", "manual");

    this.addEventListener("keydown", this.#keyDownHandler);
    this.addEventListener("toggle", this.#toggleHandler);
    document.addEventListener("click", this.#documentClickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this.removeEventListener("keydown", this.#keyDownHandler);
    this.removeEventListener("toggle", this.#toggleHandler);
    document.removeEventListener("click", this.#documentClickHandler);
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base"><slot @slotchange="${this.#handleSlotChange}"></slot></div>`;
  }

  /** @private */
  #handleSlotChange(): void {
    const { added } = this.#listManager.setItems([...this.querySelectorAll("m3e-fab-menu-item")]);
    if (!this.#listManager.activeItem) {
      this.#listManager.updateActiveItem(added.find((x) => !x.disabled));
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "Tab":
        this.hide();
        break;

      case "Escape":
        if (!e.shiftKey && !e.ctrlKey) {
          this.hide(true);
        }
        break;

      default:
        this.#listManager.onKeyDown(e);
        break;
    }
  }

  /** @private */
  #handleDocumentClick(e: MouseEvent): void {
    if (!e.composedPath().some((x) => x instanceof M3eFabMenuItemElement || x === this.#trigger)) {
      this.hide();
    }
  }

  /** @private */
  #attachFab(): void {
    const fab = this.#trigger?.closest<M3eFabElement>("m3e-fab");
    if (fab) {
      this.#fabTabIndex = fab.tabIndex;
      fab.addEventListener("keydown", this.#keyDownHandler);
      this.#listManager.setItems([...this.#listManager.items, fab]);
    }
  }

  /** @private */
  #detachFab(): void {
    const fab = this.#trigger?.closest<M3eFabElement>("m3e-fab");
    if (fab) {
      if (this.#fabTabIndex !== undefined) {
        fab.tabIndex = this.#fabTabIndex;
      }
      fab.removeEventListener("keydown", this.#keyDownHandler);
      this.#listManager.setItems([...this.#listManager.items.filter((x) => x !== fab)]);
    }
  }
}

interface M3eFabMenuElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eFabMenuElement {
  addEventListener<K extends keyof M3eFabMenuElementEventMap>(
    type: K,
    listener: (this: M3eFabMenuElement, ev: M3eFabMenuElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eFabMenuElementEventMap>(
    type: K,
    listener: (this: M3eFabMenuElement, ev: M3eFabMenuElementEventMap[K]) => void,
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
    "m3e-fab-menu": M3eFabMenuElement;
  }
}
