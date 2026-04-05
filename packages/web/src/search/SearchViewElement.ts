/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { html, LitElement, PropertyValues, svg } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  AttachInternals,
  customElement,
  debounce,
  EventAttribute,
  FocusController,
  prefersReducedMotion,
  registerStyleSheet,
  ScrollLockController,
  setCustomState,
} from "@m3e/web/core";

import { positionAnchor } from "@m3e/web/core/anchoring";
import { M3eDirectionality } from "@m3e/web/core/bidi";

import "@m3e/web/core/a11y";

import { SearchViewLightDomStyle, SearchViewStyle } from "./styles";
import { SearchViewMode } from "./SearchViewMode";
import { SearchViewQueryEventDetail } from "./SearchViewQueryEventDetail";

import "./SearchBarElement";

/**
 * A surface that presents suggestions and results for a search.
 *
 * @description
 * The `m3e-search-view` component presents the surface for suggestions,
 * history, and results, managing the open and close lifecycle around an
 * embedded search bar. It emits `query`, `clear`, and `toggle`, events to
 * support application driven search logic, and exposes CSS properties for
 * container, shape, spacing, and layout across contained, docked, and full
 * screen configurations.
 *
 * @example
 * The following example shows a contained view in docked mode with a simple set of search results.
 * ```html
 * <m3e-search-view mode="docked" contained>
 *   <input slot="input" placeholder="Search..." />
 *   <m3e-list>
 *     <m3e-list-item>Result One</m3e-list-item>
 *     <m3e-list-item>Result Two</m3e-list-item>
 *     <m3e-list-item>Result Three</m3e-list-item>
 *   </m3e-list>
 * </m3e-search-view>
 * ```
 *
 * @tag m3e-search-view
 *
 * @attr contained - Whether the view features a persistent, filled search container.
 * @attr mode - The behavior mode of the view.
 * @attr open - Whether the view is expanded to show results.
 * @attr clear-label - The accessible label given to the button used to clear the search term.
 * @attr close-label - The accessible label given to the button used to collapse the view.
 *
 * @fires clear - Dispatched when the search term is cleared.
 * @fires query - Dispatched when the view is opened or when the user modifies the search term.
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-search-view-container-color - Background color of the view container.
 * @cssprop --m3e-search-view-contained-container-color - Background color of the contained view container.
 * @cssprop --m3e-search-view-divider-color - Color of the divider separating header and results.
 * @cssprop --m3e-search-view-divider-thickness - Thickness of the divider separating header and results.
 * @cssprop --m3e-search-view-full-screen-container-shape - Shape of the fullscreen view container.
 * @cssprop --m3e-search-view-full-screen-header-container-height - Height of the header container in fullscreen mode.
 * @cssprop --m3e-search-view-docked-container-shape - Shape of the docked view container.
 * @cssprop --m3e-search-view-docked-header-container-height - Height of the header container in docked mode.
 * @cssprop --m3e-search-view-contained-leading-margin - Leading margin for the contained view.
 * @cssprop --m3e-search-view-contained-trailing-margin - Trailing margin for the contained view.
 * @cssprop --m3e-search-view-contained-focused-leading-margin - Leading margin when the contained view is focused.
 * @cssprop --m3e-search-view-contained-focused-trailing-margin - Trailing margin when the contained view is focused.
 * @cssprop --m3e-search-view-contained-docked-bar-results-gap - Gap between the contained docked bar and results.
 * @cssprop --m3e-search-view-contained-docked-results-shape - Shape of the results container in contained docked mode.
 * @cssprop --m3e-search-view-contained-docked-bar-shape - Shape of the bar in contained docked mode.
 * @cssprop --m3e-search-view-contained-full-screen-bar-container-height - Height of the bar container in contained fullscreen mode.
 * @cssprop --m3e-search-view-docked-container-min-height - Minimum height of the docked view container.
 * @cssprop --m3e-search-view-docked-container-max-height - Maximum height of the docked view container.
 * @cssprop --m3e-search-view-contained-docked-results-space - Space above the results in contained docked mode.
 * @cssprop --m3e-search-view-docked-results-bottom-space - Space below the results in docked mode.
 * @cssprop --m3e-search-view-docked-scrim-color - Color of the scrim behind the docked view.
 * @cssprop --m3e-search-view-docked-scrim-opacity - Opacity of the scrim behind the docked view.
 */
@customElement("m3e-search-view")
export class M3eSearchViewElement extends EventAttribute(AttachInternals(LitElement), "clear", "query") {
  static {
    registerStyleSheet(SearchViewLightDomStyle);
  }

  /** The styles of the element. */
  static override styles = SearchViewStyle;

  /** @private */ #input?: HTMLInputElement;
  /** @private */ #closeOnInputFocus = false;
  /** @private */ readonly #inputInputHandler = () => this.#handleInputInput();
  /** @private */ readonly #inputFocusHandler = () => this.#handleInputFocus();
  /** @private */ readonly #inputKeyDownHandler = (e: KeyboardEvent) => this.#handleInputKeyDown(e);
  /** @private */ readonly #inputPointerHandler = () => this.#handleInputPointerDown();

  /** @private */ readonly #scrollLockController = new ScrollLockController(this);

  /** @private */ @state() _clearable = false;
  /** @private */ #anchorCleanup?: () => void;
  /** @private */ @query(".anchor") private readonly _anchor!: HTMLElement;
  /** @private */ @query(".view") private readonly _view!: HTMLElement;

  constructor() {
    super();

    new FocusController(this, {
      callback: (focused) => this._handleFocusChange(focused),
    });
  }

  /**
   * Whether the view features a persistent, filled search container.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) contained = false;

  /**
   * The behavior mode of the view.
   * @default "docked"
   */
  @property({ reflect: true }) mode: SearchViewMode = "docked";

  /**
   * Whether the view is expanded to show results.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * The accessible label given to the button used to clear the search term.
   * @default "Clear"
   */
  @property({ attribute: "clear-label" }) clearLabel = "Clear";

  /**
   * The accessible label given to the button used to collapse the view.
   * @default "Close"
   */
  @property({ attribute: "close-label" }) closeLabel = "Close";

  /** Clears the search term. */
  clear(): void {
    if (!this.#input) return;
    this.#input.value = "";
    this.#updateClearableState();

    this.dispatchEvent(new Event("clear", { bubbles: true, composed: true }));
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);
    if (_changedProperties.has("open")) {
      switch (this.mode) {
        case "docked":
          if (this.open) {
            this.#openDocked();
          } else {
            this.#closeDocked();
          }
          break;

        case "fullscreen":
          if (this.open) {
            this.#openFullscreen();
          } else {
            this.#closeFullscreen();
          }
          break;
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html` <div class="base">
      <div class="anchor"></div>
      <div
        role="${ifDefined(this.open ? "dialog" : undefined)}"
        aria-modal="${ifDefined(this.open ? "true" : undefined)}"
        aria-labelledby="${ifDefined(this.open ? "header" : undefined)}"
        class="view"
        tabindex="-1"
        @keydown="${this.#handleKeyDown}"
      >
        <m3e-focus-trap ?disabled="${!this.open}">
          <div class="header" id="header">
            <m3e-search-bar class="bar">
              ${this.#renderIconOrBackButton()}
              <slot name="leading" slot="leading"></slot>
              <slot name="input" slot="input" @slotchange="${this.#handleInputSlotChange}"></slot>
              ${this.#renderClearButton()}
              <slot name="trailing" slot="trailing"></slot>
            </m3e-search-bar>
          </div>
          <div class="results">
            <div class="scroll-container">
              <slot></slot>
            </div>
          </div>
        </m3e-focus-trap>
      </div>
    </div>`;
  }

  /** @private */
  #renderIconOrBackButton(): unknown {
    return html`<div class="icon" slot="leading">${this.open ? this.#renderBackButton() : this.#renderIcon()}</div>`;
  }

  /** @private */
  #renderIcon(): unknown {
    return html`<slot name="search-icon">
      <svg class="search-icon" viewBox="0 -960 960 960" fill="currentColor">
        <path
          d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"
        />
      </svg>
    </slot>`;
  }

  /** @private */
  #renderBackButton(): unknown {
    return html`<m3e-icon-button
      class="close"
      slot="leading"
      aria-label="${this.closeLabel}"
      @click="${this.#handleCloseClick}"
    >
      <slot name="close-icon">
        <svg class="close-icon" viewBox="0 -960 960 960" fill="currentColor">
          ${this.mode === "docked"
            ? svg`<path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z"/>`
            : svg`<path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z"/>`}
        </svg>
      </slot>
    </m3e-icon-button>`;
  }

  /** @private */
  #renderClearButton(): unknown {
    return html`<m3e-icon-button
      class="clear"
      slot="trailing"
      aria-label="${this.open && !this._clearable ? this.closeLabel : this.clearLabel}"
      @click="${this.#handleClearClick}"
    >
      <slot name="clear-icon">
        <svg class="clear-icon" viewBox="0 -960 960 960" fill="currentColor">
          <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
        </svg>
      </slot>
    </m3e-icon-button>`;
  }

  /** @private */
  #handleInputSlotChange(e: Event): void {
    const input = (e.target as HTMLSlotElement)
      .assignedElements({ flatten: true })
      .find((x) => x instanceof HTMLInputElement);

    if (input != this.#input) {
      this.#input?.removeEventListener("input", this.#inputInputHandler);
      this.#input?.removeEventListener("focus", this.#inputFocusHandler);
      this.#input?.removeEventListener("keydown", this.#inputKeyDownHandler);
      this.#input?.removeEventListener("pointerdown", this.#inputPointerHandler);

      this.#input = input;

      this.#input?.addEventListener("input", this.#inputInputHandler);
      this.#input?.addEventListener("focus", this.#inputFocusHandler);
      this.#input?.addEventListener("keydown", this.#inputKeyDownHandler);
      this.#input?.addEventListener("pointerdown", this.#inputPointerHandler);

      if (this.#input) {
        this.#input.role = this.#input.role || "searchbox";
        this.#input.inputMode = this.#input.inputMode || "search";
        this.#input.type = "text";
      }

      this.#updateClearableState();
    }
  }

  /** @private */
  #handleInputInput(): void {
    this.#updateClearableState();
    if (this.open) {
      this.dispatchEvent(
        new CustomEvent<SearchViewQueryEventDetail>("query", {
          detail: { term: this.#input?.value ?? "" },
          bubbles: true,
          composed: true,
        }),
      );
    } else {
      this.open = true;
    }
  }

  /** @private */
  #updateClearableState(): void {
    this._clearable = (this.#input?.value ?? "").length > 0;
    setCustomState(this, "-clearable", this._clearable);
  }

  /** @private */
  #handleInputFocus(): void {
    this.open = !this.#closeOnInputFocus;
    this.#closeOnInputFocus = false;
  }

  /** @private */
  #handleCloseClick(): void {
    if (!this.#input) return;
    if (this.#input.value) {
      this.clear();
    }
    this.#closeOnInputFocus = true;
    this.#input?.focus();
  }

  /** @private */
  #handleClearClick(): void {
    if (!this.#input) return;
    if (this.#input.value) {
      this.clear();
    } else {
      this.#closeOnInputFocus = true;
    }
    this.#input?.focus();
  }

  /** @private */
  #handleInputPointerDown(): void {
    if (!this.open && this.#input?.matches(":focus")) {
      this.open = true;
    }
  }

  /** @private */
  #handleInputKeyDown(e: KeyboardEvent): void {
    if (this.open && e.key === "Escape" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();

      const input = e.target as HTMLInputElement;
      if (input.value) {
        this.clear();
      }

      this.open = false;
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    if (this.open && e.key === "Escape" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      this.#handleCloseClick();
    }
  }

  /** @private */
  @debounce(40)
  private _handleFocusChange(focused: boolean) {
    if (!focused && this.mode === "docked") {
      this.clear();
      this.open = false;
    }
  }

  /** @private */
  async #openDocked(): Promise<void> {
    if (
      !this.dispatchEvent(
        new ToggleEvent("beforetoggle", {
          oldState: "closed",
          newState: "open",
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      )
    ) {
      this.open = false;
      return;
    }

    const view = this._view;

    this.#anchorCleanup?.();
    this.#anchorCleanup = await positionAnchor(
      view,
      this._anchor,
      {
        position: "bottom",
      },
      (x, y) => {
        const view = this._view;
        view.style.top = `${y - this._anchor.clientHeight}px`;
        view.style.width = `${this._anchor.clientWidth}px`;

        if (M3eDirectionality.current === "rtl") {
          view.style.right = `${window.innerWidth - x - this.clientWidth}px`;
          view.style.left = "";
        } else {
          view.style.left = `${x}px`;
          view.style.right = "";
        }
      },
    );

    this._anchor.style.position = "relative";
    view.popover = "manual";
    view.style.position = "absolute";
    view.showPopover();
    this.#scrollLockController.lock();

    this.dispatchEvent(
      new ToggleEvent("toggle", {
        oldState: "closed",
        newState: "open",
        bubbles: true,
        composed: true,
      }),
    );

    this.dispatchEvent(
      new CustomEvent<SearchViewQueryEventDetail>("query", {
        detail: { term: this.#input?.value ?? "" },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** @private */
  #closeDocked(): void {
    const view = this._view;
    if (view.popover !== "manual") return;
    if (
      !this.dispatchEvent(
        new ToggleEvent("beforetoggle", {
          oldState: "open",
          newState: "closed",
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      )
    ) {
      this.open = true;
      return;
    }

    this.#scrollLockController.unlock();

    if (prefersReducedMotion()) {
      this.#hideDocked();
    } else {
      view.classList.add("closing");
      view.addEventListener("transitionend", () => this.#hideDocked(), { once: true });
    }
  }

  /** @private */
  #hideDocked(): void {
    this.#anchorCleanup?.();
    this.#anchorCleanup = undefined;

    const view = this._view;
    view.classList.remove("closing");
    view.style.position = "";
    view.style.width = "";
    view.style.top = "";
    view.style.left = "";
    view.style.right = "";
    view.hidePopover();
    view.popover = null;
    this._anchor.style.position = "";

    this.dispatchEvent(
      new ToggleEvent("toggle", {
        oldState: "open",
        newState: "closed",
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** @private */
  async #openFullscreen(): Promise<void> {
    if (
      !this.dispatchEvent(
        new ToggleEvent("beforetoggle", {
          oldState: "closed",
          newState: "open",
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      )
    ) {
      this.open = false;
      return;
    }

    this.#scrollLockController.lock();

    const view = this._view;
    this.#anchorCleanup?.();

    if (!prefersReducedMotion()) {
      const rect = view.getBoundingClientRect();
      const startInline = M3eDirectionality.current === "rtl" ? window.innerWidth - rect.right : rect.left;

      view.style.position = "fixed";
      view.popover = "manual";
      view.showPopover();
      this._anchor.style.position = "relative";

      view.animate(
        [
          {
            transform: `translateX(${startInline}px)`,
            width: `${rect.width}px`,
            top: `${rect.top}px`,
            height: `${rect.height}px`,
          },
          { transform: "translateX(0px)", width: "100vw", top: "0px", height: "100vh" },
        ],
        {
          duration: 150,
          easing: "cubic-bezier(0.2, 0.0, 0, 1.0)",
        },
      );
    } else {
      view.style.position = "fixed";
      view.popover = "manual";
      view.showPopover();
      this._anchor.style.position = "relative";
    }

    this.dispatchEvent(
      new ToggleEvent("toggle", {
        oldState: "closed",
        newState: "open",
        bubbles: true,
        composed: true,
      }),
    );

    this.dispatchEvent(
      new CustomEvent<SearchViewQueryEventDetail>("query", {
        detail: { term: this.#input?.value ?? "" },
        bubbles: true,
        composed: true,
      }),
    );
  }

  /** @private */
  async #closeFullscreen(): Promise<void> {
    const view = this._view;
    if (view.popover !== "manual") return;

    if (
      !this.dispatchEvent(
        new ToggleEvent("beforetoggle", {
          oldState: "open",
          newState: "closed",
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      )
    ) {
      this.open = true;
      return;
    }

    const anchor = this._anchor;
    this.#scrollLockController.unlock();

    if (!prefersReducedMotion()) {
      const start = view.getBoundingClientRect();
      const end = anchor.getBoundingClientRect();

      const startInline = M3eDirectionality.current === "rtl" ? window.innerWidth - start.right : start.left;
      const endInline = M3eDirectionality.current === "rtl" ? window.innerWidth - end.right : end.left;
      const dx = M3eDirectionality.current === "rtl" ? startInline - endInline : endInline - startInline;

      view.classList.add("closing");
      await view.animate(
        [
          {
            transform: `translateX(0px)`,
            width: `${start.width}px`,
            top: `${start.top}px`,
            height: `${start.height}px`,
          },
          {
            transform: `translateX(${dx}px)`,
            width: `${end.width}px`,
            top: `${end.top}px`,
            height: `${end.height}px`,
          },
        ],
        {
          duration: 150,
          easing: "cubic-bezier(0.2, 0.0, 0, 1.0)",
        },
      ).finished;
    }

    view.hidePopover();
    view.style.position = "";
    view.popover = null;
    view.classList.remove("closing");
    anchor.style.position = "";

    this.dispatchEvent(
      new ToggleEvent("toggle", {
        oldState: "open",
        newState: "closed",
        bubbles: true,
        composed: true,
      }),
    );
  }
}

interface M3eSearchViewElementEventMap extends HTMLElementEventMap {
  clear: Event;
  query: CustomEvent<SearchViewQueryEventDetail>;
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eSearchViewElement {
  addEventListener<K extends keyof M3eSearchViewElementEventMap>(
    type: K,
    listener: (this: M3eSearchViewElement, ev: M3eSearchViewElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eSearchViewElementEventMap>(
    type: K,
    listener: (this: M3eSearchViewElement, ev: M3eSearchViewElementEventMap[K]) => void,
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
    "m3e-search-view": M3eSearchViewElement;
  }
}
