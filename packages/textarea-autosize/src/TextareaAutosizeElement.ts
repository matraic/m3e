/**
 * Adapted from Angular Material CDK Text Field
 * Source: https://github.com/angular/components/blob/main/src/cdk/text-field/autosize.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { css, CSSResultGroup, LitElement, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { debounce, HtmlFor, Role } from "@m3e/core";

/**
 * @summary
 * A non-visual element used to automatically resize a `textarea` to fit its content.
 *
 * @description
 * The `m3e-textarea-autosize` component automatically adjusts the height of a linked `textarea` to fit its content,
 * preserving layout integrity and user experience. This non-visual element listens to input changes and applies
 * dynamic resizing, constrained by optional row limits. It supports declarative configuration via attributes and
 * can be disabled when manual control is preferred.
 *
 * @example
 * The following example illustrates the `m3e-textarea-autosize` in conjunction with the `m3e-form-field` to
 * automatically resize a field's `textarea` with a 5 row limit.
 * ```html
 * <m3e-form-field>
 *  <label slot="label" for="fld">Textarea Autosize</label>
 *  <textarea id="fld"></textarea>
 *  <m3e-textarea-autosize for="fld" max-rows="5"></m3e-textarea-autosize>
 * </m3e-form-field>
 * ```
 *
 * @tag m3e-textarea-autosize
 *
 * @attr disabled - Whether auto-sizing is disabled.
 * @attr for - The query selector used to specify the element related to this element.
 * @attr max-rows - The maximum amount of rows in the `textarea`.
 * @attr min-rows - The minimum amount of rows in the `textarea`.
 */
@customElement("m3e-textarea-autosize")
export class M3eTextareaAutosizeElement extends HtmlFor(Role(LitElement, "none")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: none;
    }
  `;

  /** @private */ #initialHeight?: string;
  /** @private */ #cachedLineHeight?: number;
  /** @private */ #cachedPlaceholderHeight?: number;
  /** @private */ #previousMinRows?: number;
  /** @private */ #previousValue?: string;
  /** @private */ #hasFocus = false;

  /** @private */ readonly #windowResizeHandler = () => this._handleWindowResize();
  /** @private */ readonly #focusHandler = (e: FocusEvent) => (this.#hasFocus = e.type === "focus");
  /** @private */ readonly #inputHandler = () => this.resizeToFitContent();

  /**
   * The maximum amount of rows in the `textarea`.
   * @default 0
   */
  @property({ attribute: "max-rows", type: Number }) maxRows = 0;

  /**
   * The minimum amount of rows in the `textarea`.
   * @default 0
   */
  @property({ attribute: "min-rows", type: Number }) minRows = 0;

  /**
   * Whether auto-sizing is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (control instanceof HTMLTextAreaElement) {
      control.style.resize = "none";

      this.#initialHeight = control.style.height;
      control.addEventListener("focus", this.#focusHandler);
      control.addEventListener("blur", this.#focusHandler);
      control.addEventListener("input", this.#inputHandler);
      window.addEventListener("resize", this.#windowResizeHandler);
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control instanceof HTMLTextAreaElement) {
      window.removeEventListener("resize", this.#windowResizeHandler);
      this.control.removeEventListener("focus", this.#focusHandler);
      this.control.removeEventListener("blur", this.#focusHandler);
      this.control.removeEventListener("input", this.#inputHandler);
    }
    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    this.ariaHidden = "true";
    super.connectedCallback();
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("disabled")) {
      if (this.disabled) {
        this.reset();
      } else {
        this.resizeToFitContent(true);
      }
    }
  }

  /**
   * Resize the `textarea` to fit its content.
   * @param {boolean} [force=false] - Whether to force a height recalculation.
   */
  resizeToFitContent(force: boolean = false): void {
    if (this.disabled || !(this.control instanceof HTMLTextAreaElement)) {
      return;
    }

    this.#cacheTextareaLineHeight();
    this.#cacheTextareaPlaceholderHeight();

    if (!this.#cachedLineHeight) {
      return;
    }

    const value = this.control.value;
    if (!force && this.minRows === this.#previousMinRows && value === this.#previousValue) {
      return;
    }

    const scrollHeight = this.#measureScrollHeight();
    const height = Math.max(scrollHeight, this.#cachedPlaceholderHeight || 0);
    this.control.style.height = `${height}px`;

    setTimeout(() => this.#scrollToCaretPosition());

    this.#previousValue = value;
    this.#previousMinRows = this.minRows;
  }

  /** Resets the `textarea` to its original size. */
  reset() {
    if (this.#initialHeight !== undefined && this.control instanceof HTMLTextAreaElement) {
      this.control.style.height = this.#initialHeight;
    }
  }

  /** @private */
  #cacheTextareaLineHeight(): void {
    if (this.#cachedLineHeight || !(this.control instanceof HTMLTextAreaElement)) {
      return;
    }

    const clone = <HTMLTextAreaElement>this.control.cloneNode(false);
    clone.rows = 1;
    clone.style.position = "absolute";
    clone.style.visibility = "hidden";
    clone.style.border = "none";
    clone.style.padding = "0";
    clone.style.height = "";
    clone.style.minHeight = "";
    clone.style.maxHeight = "";
    clone.style.top = clone.style.bottom = clone.style.left = clone.style.right = "auto";
    clone.style.overflow = "hidden";

    this.control.parentElement?.appendChild(clone);
    this.#cachedLineHeight = clone.clientHeight;
    clone.remove();

    this.#setMinHeight();
    this.#setMaxHeight();
  }

  /** @private */
  #cacheTextareaPlaceholderHeight(): void {
    if (!(this.control instanceof HTMLTextAreaElement) || this.#cachedPlaceholderHeight != undefined) {
      return;
    }

    if (!this.control.placeholder) {
      this.#cachedPlaceholderHeight = 0;
      return;
    }

    const value = this.control.value;
    this.control.value = this.control.placeholder;
    this.#cachedPlaceholderHeight = this.#measureScrollHeight();
    this.control.value = value;
  }

  /** @private */
  #setMinHeight(): void {
    const minHeight = this.minRows && this.#cachedLineHeight ? `${this.minRows * this.#cachedLineHeight}px` : null;
    if (minHeight && this.control) {
      this.control.style.minHeight = minHeight;
    }
  }

  /** @private */
  #setMaxHeight(): void {
    const maxHeight = this.maxRows && this.#cachedLineHeight ? `${this.maxRows * this.#cachedLineHeight}px` : null;
    if (maxHeight && this.control) {
      this.control.style.maxHeight = maxHeight;
    }
  }

  /** @private */
  #measureScrollHeight(): number {
    if (!this.control) {
      return 0;
    }

    const element = this.control;
    const previousMargin = element.style.marginBottom || "";
    const isFirefox = navigator.userAgent.includes("Firefox");
    const needsMarginFiller = isFirefox && this.#hasFocus;

    if (needsMarginFiller) {
      element.style.marginBottom = `${element.clientHeight}px`;
    }

    const initialStyle: Pick<CSSStyleDeclaration, "padding" | "boxSizing" | "height" | "overflow"> = {
      padding: element.style.padding,
      boxSizing: element.style.boxSizing,
      height: element.style.height,
      overflow: element.style.overflow,
    };

    element.style.padding = "2px 0";
    element.style.boxSizing = "content-box";

    if (!isFirefox) {
      element.style.height = "auto";
      element.style.overflow = "hidden";
    } else {
      element.style.height = "0";
    }

    const scrollHeight = element.scrollHeight - 4;

    element.style.padding = initialStyle.padding;
    element.style.boxSizing = initialStyle.boxSizing;
    element.style.height = initialStyle.height;
    element.style.overflow = initialStyle.overflow;

    if (needsMarginFiller) {
      element.style.marginBottom = previousMargin;
    }

    return scrollHeight;
  }

  /** @private */
  #scrollToCaretPosition() {
    if (!(this.control instanceof HTMLTextAreaElement) || !this.#hasFocus) {
      return;
    }

    const { selectionStart, selectionEnd } = this.control;
    this.control.setSelectionRange(selectionStart, selectionEnd);
  }

  /** @private */
  @debounce(16)
  private _handleWindowResize(): void {
    this.#cachedLineHeight = this.#cachedPlaceholderHeight = undefined;
    this.resizeToFitContent(true);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-textarea-autosize": M3eTextareaAutosizeElement;
  }
}
