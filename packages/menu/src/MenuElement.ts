/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, ScrollController, Role } from "@m3e/core";
import { RovingTabIndexManager } from "@m3e/core/a11y";
import { positionAnchor } from "@m3e/core/anchoring";
import { M3eDirectionality } from "@m3e/core/bidi";

import { M3eMenuItemElement } from "./MenuItemElement";
import { MenuPositionX, MenuPositionY } from "./MenuPosition";
import { MenuItemElementBase } from "./MenuItemElementBase";

/**
 * Presents a list of choices on a temporary surface.
 *
 * @description
 * The `m3e-menu` component presents a list of choices on a temporary surface, typically anchored to a trigger element.
 * It supports dynamic positioning via `position-x` and `position-y` attributes, and renders its contents through the default slot.
 *
 * @example
 * The following example illustrates a basic menu.  The `m3e-menu-trigger` is used to trigger a `m3e-menu` specified
 * by the `for` attribute when its parenting element is activated.
 * ```html
 * <m3e-button>
 *   <m3e-menu-trigger for="menu1">Basic menu</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu1">
 *   <m3e-menu-item>Apple</m3e-menu-item>
 *   <m3e-menu-item>Apricot</m3e-menu-item>
 *   <m3e-menu-item>Avocado</m3e-menu-item>
 *   <m3e-menu-item>Green Apple</m3e-menu-item>
 *   <m3e-menu-item>Green Grapes</m3e-menu-item>
 *   <m3e-menu-item>Olive</m3e-menu-item>
 *   <m3e-menu-item>Orange</m3e-menu-item>
 * </m3e-menu>
 * ```
 *
 * @example
 * The next example illustrates nested menus.  Submenus are triggered by placing a `m3e-menu-trigger` inside a `m3e-menu-item`.
 * ```html
 * <m3e-button>
 *   <m3e-menu-trigger for="menu2">Nested menus</m3e-menu-trigger>
 * </m3e-button>
 * <m3e-menu id="menu2">
 *   <m3e-menu-item>
 *     <m3e-menu-trigger for="menu3">Fruits with A</m3e-menu-trigger>
 *   </m3e-menu-item>
 *   <m3e-menu-item>Grapes</m3e-menu-item>
 *   <m3e-menu-item>Olive</m3e-menu-item>
 *   <m3e-menu-item>Orange</m3e-menu-item>
 * </m3e-menu>
 * <m3e-menu id="menu3">
 *   <m3e-menu-item>Apricot</m3e-menu-item>
 *   <m3e-menu-item>Avocado</m3e-menu-item>
 *   <m3e-menu-item>
 *     <m3e-menu-trigger for="menu4">Apples</m3e-menu-trigger>
 *   </m3e-menu-item>
 * </m3e-menu>
 * <m3e-menu id="menu4">
 *   <m3e-menu-item>Fuji</m3e-menu-item>
 *   <m3e-menu-item>Granny Smith</m3e-menu-item>
 *   <m3e-menu-item>Red Delicious</m3e-menu-item>
 * </m3e-menu>
 * ```
 *
 * @tag m3e-menu
 *
 * @slot - Renders the contents of the menu.
 *
 * @attr position-x - The position of the menu, on the x-axis.
 * @attr position-y - The position of the menu, on the y-axis.
 *
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-menu-container-shape - Controls the corner radius of the menu container.
 * @cssprop --m3e-menu-container-min-width - Minimum width of the menu container.
 * @cssprop --m3e-menu-container-max-width - Maximum width of the menu container.
 * @cssprop --m3e-menu-container-max-height - Maximum height of the menu container.
 * @cssprop --m3e-menu-container-padding-block - Vertical padding inside the menu container.
 * @cssprop --m3e-menu-container-color - Background color of the menu container.
 * @cssprop --m3e-menu-container-elevation - Box shadow elevation of the menu container.
 * @cssprop --m3e-menu-divider-spacing - Vertical spacing around slotted `m3e-divider` elements.
 */
@customElement("m3e-menu")
export class M3eMenuElement extends Role(LitElement, "menu") {
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
      border-radius: var(--m3e-menu-container-shape, ${DesignToken.shape.corner.extraSmall});
      min-width: var(--m3e-menu-container-min-width, 7rem);
      max-width: var(--m3e-menu-container-max-width, 17.5rem);
      max-height: var(--m3e-menu-container-max-height, 17.5rem);
      padding-block: var(--m3e-menu-container-padding-block, 0.5rem);
      background-color: var(--m3e-menu-container-color, ${DesignToken.color.surfaceContainer});
      box-shadow: var(--m3e-menu-container-elevation, ${DesignToken.elevation.level3});
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
    :host(:not([submenu])) {
      transform: scaleY(0.8);
    }
    :host(:not([submenu]):popover-open) {
      transform: scaleY(1);
    }
    :host::backdrop {
      background-color: transparent;
    }
    :host(:popover-open) {
      display: inline-flex;
      opacity: 1;
    }
    :host(.-bottom) {
      transform-origin: top;
    }
    :host(.-top) {
      transform-origin: bottom;
    }
    :host(.-shift-down) {
      margin-top: calc(0px - var(--m3e-menu-container-padding-block, 0.5rem));
    }
    :host(.-shift-up) {
      margin-top: var(--m3e-menu-container-padding-block, 0.5rem);
    }
    ::slotted(m3e-divider) {
      margin-block: var(--m3e-menu-divider-spacing, 0.5rem);
    }
    @starting-style {
      :host(:popover-open) {
        opacity: 0;
      }
      :host(:not([submenu]):popover-open) {
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
  /** @private */ #anchorCleanup?: () => void;

  /** @private */ readonly #listManager = new RovingTabIndexManager<MenuItemElementBase>()
    .withWrap()
    .withHomeAndEnd()
    .withVerticalOrientation();

  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);
  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);
  /** @private */ readonly #scrollController = new ScrollController(this, {
    target: null,
    callback: (target) =>
      target instanceof M3eMenuElement
        ? target.items.filter((x) => x instanceof M3eMenuItemElement).forEach((x) => x.submenu?.hide())
        : this.hideAll(),
  });

  /** @private */ readonly #toggleHandler = (e: ToggleEvent) => {
    if (e.newState === "closed") {
      this.#anchorCleanup?.();
      this.#anchorCleanup = undefined;
    } else {
      setTimeout(() => {
        this.#listManager.setActiveItem(this.#listManager.items.find((x) => !x.disabled));
      }, 40);
    }
  };

  /**
   * The position of the menu, on the x-axis.
   * @default "after"
   */
  @property({ attribute: "position-x" }) positionX: MenuPositionX = "after";

  /**
   * The position of the menu, on the y-axis.
   * @default "below"
   */
  @property({ attribute: "position-y" }) positionY: MenuPositionY = "below";

  /** The items of the menu. */
  get items(): ReadonlyArray<MenuItemElementBase> {
    return this.#listManager.items;
  }

  /** A value indicating whether the menu is open. */
  get isOpen() {
    return this.#trigger !== undefined;
  }

  /** A value indicating whether the menu is a submenu. */
  @property({ type: Boolean, reflect: true }) submenu = false;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.tabIndex = -1;
    this.classList.add("-no-animate");
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

  /**
   * Opens the menu.
   * @param {HTMLElement} trigger The element that triggered the menu.
   * @returns {Promise<void>} A `Promise` that resolves when the menu is opened.
   */
  async show(trigger: HTMLElement): Promise<void> {
    if (this.#trigger && this.#trigger !== trigger) {
      this.hide();
    }

    let positionX = this.positionX;
    if (M3eDirectionality.current === "rtl") {
      positionX = positionX === "before" ? "after" : "before";
    }

    this.#anchorCleanup = await positionAnchor(
      this,
      trigger,
      {
        position: this.submenu
          ? positionX === "before"
            ? "left-start"
            : "right-start"
          : this.positionY === "above"
            ? positionX === "before"
              ? "top-end"
              : "top-start"
            : positionX === "before"
              ? "bottom-end"
              : "bottom-start",
        inline: true,
        flip: true,
        shift: true,
        offset: !this.submenu ? 4 : undefined,
      },
      (x, y, position) => {
        if (!this.submenu) {
          this.classList.toggle("-top", position.includes("top"));
          this.classList.toggle("-bottom", position.includes("bottom"));
        } else if (this.#trigger) {
          const top = this.#getAbsolutePosition(this.#trigger).y;
          this.classList.toggle("-shift-down", false);
          this.classList.toggle("-shift-up", false);
          this.classList.toggle(Math.round(y) === Math.round(top) ? "-shift-down" : "-shift-up", true);
        }

        if (M3eDirectionality.current === "rtl") {
          this.style.right = `${window.innerWidth - x - this.clientWidth}px`;
        } else {
          this.style.left = `${x}px`;
        }
        this.style.top = `${y}px`;
      }
    );

    this.showPopover();

    this.#trigger = trigger;
    this.#trigger.ariaExpanded = "true";
    this.#scrollController.observe(this.#trigger);
  }

  /**
   * Hides the menu.
   * @param {boolean} [restoreFocus=false] A value indicating whether to restore focus to the menu's trigger.
   */
  hide(restoreFocus: boolean = false): void {
    for (const item of this.#listManager.items) {
      const submenu = (<M3eMenuItemElement>item).submenu;
      if (submenu && submenu.isOpen) {
        submenu.hide();
      }
    }

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
   * Closes this menu and any parenting menus.
   * @param {boolean} [restoreFocus=false] A value indicating whether to restore focus to the menu's trigger.
   */
  hideAll(restoreFocus: boolean = false): void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let menu: M3eMenuElement = this;
    while (menu.#trigger) {
      const parent = menu.#trigger.closest("m3e-menu");
      if (!parent) {
        break;
      }
      menu = parent;
    }
    menu.hide(restoreFocus);
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
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    requestAnimationFrame(() => this.classList.remove("-no-animate"));
  }

  /** @private */
  #handleSlotChange(): void {
    const { added } = this.#listManager.setItems(
      [
        ...this.querySelectorAll<MenuItemElementBase>("m3e-menu-item,m3e-menu-item-checkbox,m3e-menu-item-radio"),
      ].filter((x) => x.closest("m3e-menu") === this)
    );

    if (!this.#listManager.activeItem) {
      this.#listManager.updateActiveItem(added.find((x) => !x.disabled));
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "Right":
      case "ArrowRight":
        if (M3eDirectionality.current === "rtl") {
          e.preventDefault();
          this.hide(true);
        } else {
          this.#listManager.onKeyDown(e);
        }

        break;
      case "Left":
      case "ArrowLeft":
        if (M3eDirectionality.current === "ltr") {
          e.preventDefault();
          this.hide(true);
        } else {
          this.#listManager.onKeyDown(e);
        }

        break;

      case "Tab":
        this.hideAll();
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
    if (!this.submenu && !e.composedPath().some((x) => x instanceof M3eMenuElement || x === this.#trigger)) {
      this.hide();
    }
  }

  /** @private */
  #getAbsolutePosition(element: HTMLElement): { x: number; y: number } {
    let x = 0,
      y = 0;

    for (
      let current: HTMLElement | null = element;
      current;
      current = current.offsetParent instanceof HTMLElement ? current.offsetParent : null
    ) {
      x += current.offsetLeft - current.scrollLeft + current.clientLeft;
      y += current.offsetTop - current.scrollTop + current.clientTop;
    }

    return { x, y };
  }
}

interface M3eMenuElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eMenuElement {
  addEventListener<K extends keyof M3eMenuElementEventMap>(
    type: K,
    listener: (this: M3eMenuElement, ev: M3eMenuElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eMenuElementEventMap>(
    type: K,
    listener: (this: M3eMenuElement, ev: M3eMenuElementEventMap[K]) => void,
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
    "m3e-menu": M3eMenuElement;
  }
}
