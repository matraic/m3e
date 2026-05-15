/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { html, LitElement, nothing } from "lit";
import { property } from "lit/decorators.js";

import { AttachInternals, customElement, hasAssignedNodes, registerStyleSheet, setCustomState } from "@m3e/web/core";

import "@m3e/web/icon-button";

import { SearchBarLightDomStyle, SearchBarStyle } from "./styles";

/**
 * A bar that provides a prominent entry point for search.
 *
 * @description
 * The `m3e-search-bar` component provides a prominent entry point for search,
 * capturing user input and emitting `query` and `clear` events as the text
 * changes. It reflects focus and interaction states through customizable CSS
 * properties for container, icons, and text styling.
 *
 * @example
 * The following example illustrates typical usage with a leading icon and the
 * ability to clear the current search text.
 * ```html
 * <m3e-search-bar clearable>
 *  <m3e-icon name="search" slot="leading"></m3e-icon>
 *  <input slot="input" placeholder="Search..." />
 *  </m3e-search-bar>
 * ```
 *
 * @tag m3e-search-bar
 *
 * @attr clearable - Whether the bar presents a button used to clear the search term.
 * @attr clear-label - The accessible label given to the button used to clear the search term.
 *
 * @slot leading - Renders content before the input of the bar.
 * @slot input - Renders the input of the bar.
 * @slot trailing - Renders content after the input of the bar.
 *
 * @fires clear - Dispatched when the search term is cleared.
 *
 * @cssprop --m3e-search-bar-container-color - Background color of the search bar container.
 * @cssprop --m3e-search-bar-leading-icon-color - Color of the leading icon.
 * @cssprop --m3e-search-bar-trailing-icon-color - Color of the trailing icon.
 * @cssprop --m3e-search-bar-container-height - Height of the search bar container.
 * @cssprop --m3e-search-bar-container-shape - Shape (border radius) of the search bar container.
 * @cssprop --m3e-search-bar-icon-size - Size of icons inside the search bar.
 * @cssprop --m3e-search-bar-supporting-text-color - Color of the supporting text.
 * @cssprop --m3e-search-bar-supporting-text-font-size - Font size of the supporting text.
 * @cssprop --m3e-search-bar-supporting-text-font-weight - Font weight of the supporting text.
 * @cssprop --m3e-search-bar-supporting-text-line-height - Line height of the supporting text.
 * @cssprop --m3e-search-bar-supporting-text-tracking - Letter spacing of the supporting text.
 * @cssprop --m3e-search-bar-input-color - Color of the input text.
 * @cssprop --m3e-search-bar-input-text-font-size - Font size of the input text.
 * @cssprop --m3e-search-bar-input-text-font-weight - Font weight of the input text.
 * @cssprop --m3e-search-bar-input-text-line-height - Line height of the input text.
 * @cssprop --m3e-search-bar-input-text-tracking - Letter spacing of the input text.
 * @cssprop --m3e-search-bar-leading-space - Space before the leading icon.
 * @cssprop --m3e-search-bar-trailing-space - Space after the trailing icon.
 * @cssprop --m3e-search-bar-no-actions-leading-space - Leading padding when no actions are present.
 * @cssprop --m3e-search-bar-no-actions-trailing-space - Trailing padding when no actions are present.
 * @cssprop --m3e-search-bar-leading-actions-trailing-space - Space between leading actions and the input.
 * @cssprop --m3e-search-bar-trailing-actions-leading-space - Space between the input and trailing actions.
 * @cssprop --m3e-search-bar-actions-gap - Gap between action icons.
 */
@customElement("m3e-search-bar")
export class M3eSearchBarElement extends AttachInternals(LitElement) {
  static {
    registerStyleSheet(SearchBarLightDomStyle);
  }

  /** The styles of the element. */
  static override styles = SearchBarStyle;

  /** @private */ #input?: HTMLInputElement;
  /** @private */ readonly #inputInputHandler = () => this.#handleInputInput();

  /**
   * Whether the bar presents a button used to clear the search term.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) clearable = false;

  /**
   * The accessible label given to the button used to clear the search term.
   * @default "Clear"
   */
  @property({ attribute: "clear-label" }) clearLabel = "Clear";

  /** Clears the search term. */
  clear(): void {
    if (!this.#input) return;
    this.#input.value = "";
    this.#handleInputInput();

    this.dispatchEvent(new Event("clear", { bubbles: true, composed: true }));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`
      <div class="base" @click="${this.#handleContainerClick}">
        <slot name="leading" @slotchange="${this.#handleLeadingSlotChange}"></slot>
        <slot name="input" @slotchange="${this.#handleInputSlotChange}"></slot>
        ${this.#renderClearButton()}
        <slot name="trailing" @slotchange="${this.#handleTrailingSlotChange}"></slot>
      </div>
    `;
  }

  /** @private */
  #renderClearButton(): unknown {
    return this.clearable
      ? html`<div class="clear">
          <m3e-icon-button aria-label="${this.clearLabel}" @click="${this.#handleClearClick}">
            <slot name="clear-icon">
              <svg class="clear-icon" viewBox="0 -960 960 960" fill="currentColor">
                <path
                  d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"
                />
              </svg>
            </slot>
          </m3e-icon-button>
        </div>`
      : nothing;
  }

  /** @private */
  #handleContainerClick(): void {
    if (!this.matches(":focus-within")) {
      this.#input?.focus();
    }
  }

  /** @private */
  #handleLeadingSlotChange(e: Event): void {
    setCustomState(this, "-with-leading", hasAssignedNodes(e.target as HTMLSlotElement));
  }

  /** @private */
  #handleTrailingSlotChange(e: Event): void {
    setCustomState(this, "-with-trailing", hasAssignedNodes(e.target as HTMLSlotElement));
  }

  /** @private */
  #handleInputSlotChange(e: Event): void {
    const input = (e.target as HTMLSlotElement)
      .assignedElements({ flatten: true })
      .find((x) => x instanceof HTMLInputElement);

    if (input != this.#input) {
      this.#input?.removeEventListener("input", this.#inputInputHandler);
      this.#input = input;
      this.#input?.addEventListener("input", this.#inputInputHandler);

      if (this.#input) {
        this.#input.role = this.#input.role || "searchbox";
        this.#input.inputMode = this.#input.inputMode || "search";
        this.#input.type = "text";
      }

      this.#handleInputInput();
    }
  }

  /** @private */
  #handleInputInput(): void {
    setCustomState(this, "-clearable", this.clearable && (this.#input?.value ?? "").length > 0);
  }

  /** @private */
  #handleClearClick(): void {
    this.clear();
    this.#input?.focus();
  }
}

interface M3eSearchBarElementEventMap extends HTMLElementEventMap {
  clear: Event;
}

export interface M3eSearchBarElement {
  addEventListener<K extends keyof M3eSearchBarElementEventMap>(
    type: K,
    listener: (this: M3eSearchBarElement, ev: M3eSearchBarElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eSearchBarElementEventMap>(
    type: K,
    listener: (this: M3eSearchBarElement, ev: M3eSearchBarElementEventMap[K]) => void,
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
    "m3e-search-bar": M3eSearchBarElement;
  }
}
