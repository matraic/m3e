/**
 * Adapted from Angular Material Paginator
 * Source: https://github.com/angular/components/blob/main/src/material/paginator/paginator.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, EventAttribute, Role } from "@m3e/core";
import type { M3eSelectElement } from "@m3e/select";
import type { FormFieldVariant } from "@m3e/form-field";

import { PageEventDetail } from "./PageEventDetail";

/**
 * Provides navigation for paged information, typically used with a table.
 *
 * @description
 * The `m3e-paginator` component is a compact, accessible paginator control for navigating
 * paged data sets. It provides semantic first/previous/next/last navigation controls and an
 * optional page-size selector that integrates with Material design tokens and `m3e-form-field` variants
 * to ensure consistent typography, density, and spacing across applications.
 *
 * @example
 * The following example illustrates use of the `m3e-paginator`. In this example, there are 300 total
 * records and the first/last navigation controls are shown.
 * ```html
 * <m3e-paginator show-first-last-buttons length="300"></m3e-paginator>
 * ```
 *
 * @tag m3e-paginator
 *
 * @slot first-page-icon - Slot for a custom first-page icon.
 * @slot previous-page-icon - Slot for a custom previous-page icon.
 * @slot next-page-icon - Slot for a custom next-page icon.
 * @slot last-page-icon - Slot for a custom last-page icon.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr first-page-label - The accessible label given to the button used to move to the first page.
 * @attr hide-page-size - Whether to hide page size selection.
 * @attr items-per-page-label - The label for the page size selector.
 * @attr last-page-label - The accessible label given to the button used to move to the last page.
 * @attr length - The length of the total number of items which are being paginated.
 * @attr next-page-label - The accessible label given to the button used to move to the next page.
 * @attr page-index - The zero-based page index of the displayed list of items.
 * @attr page-size - The number of items to display in a page.
 * @attr page-sizes - A comma separated list of available page sizes.
 * @attr page-size-variant - The appearance variant of the page size field.
 * @attr previous-page-label - The accessible label given to the button used to move to the previous page.
 * @attr show-first-last-buttons - Whether to show first/last buttons.
 *
 * @fires page - Emitted when a user selects a different page size or navigates to another page.
 *
 * @cssprop --m3e-paginator-font-size - The font size used for paginator text.
 * @cssprop --m3e-paginator-font-weight - The font weight used for paginator text.
 * @cssprop --m3e-paginator-line-height - The line height used for paginator text.
 * @cssprop --m3e-paginator-tracking - The letter-spacing used for paginator text.
 *
 */
@customElement("m3e-paginator")
export class M3ePaginatorElement extends EventAttribute(Role(LitElement, "group"), "page") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .outer {
      display: flex;
      font-size: var(--m3e-paginator-font-size, ${DesignToken.typescale.standard.body.small.fontSize});
      font-weight: var(--m3e-paginator-font-weight, ${DesignToken.typescale.standard.body.small.fontWeight});
      line-height: var(--m3e-paginator-line-height, ${DesignToken.typescale.standard.body.small.lineHeight});
      letter-spacing: var(--m3e-paginator-tracking, ${DesignToken.typescale.standard.body.small.tracking});
    }
    .inner {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-inline: 0.5rem;
      width: 100%;
    }
    .form-field {
      --md-sys-density-scale: -2;
      --m3e-form-field-font-size: var(--m3e-paginator-font-size, ${DesignToken.typescale.standard.body.small.fontSize});
      --m3e-form-field-font-weight: var(
        --m3e-paginator-font-weight,
        ${DesignToken.typescale.standard.body.small.fontWeight}
      );
      --m3e-form-field-line-height: var(
        --m3e-paginator-line-height,
        ${DesignToken.typescale.standard.body.small.lineHeight}
      );
      --m3e-form-field-tracking: var(--m3e-paginator-tracking, ${DesignToken.typescale.standard.body.small.tracking});
    }
    .items-per-page-label {
      display: flex;
      align-items: center;
      margin-inline-end: 0.5rem;
    }
    .form-field {
      min-width: auto;
      width: 6rem;
      margin-inline: 0.25rem;
    }
    .range-label {
      margin-inline: 1.5rem 2rem;
    }
    :host([hide-page-size]) .range-label {
      margin-inline-start: unset;
    }
    .range-actions {
      display: flex;
      align-items: center;
    }
    ::slotted([slot="first-page-icon"]),
    ::slotted([slot="previous-page-icon"]),
    ::slotted([slot="next-page-icon"]),
    ::slotted([slot="last-page-icon"]),
    svg {
      width: 1em;
      font-size: var(--m3e-icon-button-medium-icon-size, 1.5rem) !important;
    }

    :host(:dir(rtl)) svg {
      transform: rotate(180deg);
    }
  `;

  /* @private */ private static __nextId = 0;
  /* @private */ readonly #pageSizeLabelId = `m3e-paginator-page-size-label-${M3ePaginatorElement.__nextId++}`;

  /* @private */
  readonly #defaultRangeLabelFormatter = (pageIndex: number, pageSize: number | "all", length: number): string => {
    length = Math.max(length, 0);

    if (pageSize === "all") return "";
    if (length === 0 || pageSize <= 0) return `0 of ${length}`;

    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
    return `${startIndex + 1} - ${endIndex} of ${length}`;
  };

  /**
   * Whether the element is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The zero-based page index of the displayed list of items.
   * @default 0
   */
  @property({ attribute: "page-index", type: Number }) pageIndex = 0;

  /**
   * The length of the total number of items which are being paginated.
   * @default 0
   */
  @property({ type: Number }) length = 0;

  /**
   * The number of items to display in a page.
   * @default 50
   */
  @property({ attribute: "page-size", converter: (value) => (value === "all" ? "all" : Number(value)) })
  pageSize: number | "all" = 50;

  /**
   * A comma separated list of available page sizes.
   * @default "5,10,25,50,100"
   */
  @property({ attribute: "page-sizes" }) pageSizes = "5,10,25,50,100";

  /**
   * Whether to hide page size selection.
   * @default false
   */
  @property({ attribute: "hide-page-size", type: Boolean, reflect: true }) hidePageSize = false;

  /**
   * Whether to show first/last buttons.
   * @default false
   */
  @property({ attribute: "show-first-last-buttons", type: Boolean }) showFirstLastButtons = false;

  /**
   * The label for the page size selector.
   * @default "Items per page:"
   */
  @property({ attribute: "items-per-page-label" }) itemsPerPageLabel = "Items per page:";

  /**
   * The accessible label given to the button used to move to the previous page.
   * @default "Previous page"
   */
  @property({ attribute: "previous-page-label" }) previousPageLabel = "Previous page";

  /**
   * The accessible label given to the button used to move to the next page.
   * @default "Next page"
   */
  @property({ attribute: "next-page-label" }) nextPageLabel = "Next page";

  /**
   * The accessible label given to the button used to move to the first page.
   * @default "First page"
   */
  @property({ attribute: "first-page-label" }) firstPageLabel = "First page";

  /**
   * The accessible label given to the button used to move to the last page.
   * @default "Last page"
   */
  @property({ attribute: "last-page-label" }) lastPageLabel = "Last page";

  /**
   * The appearance variant of the page size field.
   * @default "outlined"
   */
  @property({ attribute: "page-size-variant" }) pageSizeVariant: FormFieldVariant = "outlined";

  /** The total number of pages. */
  get pageCount(): number {
    return !this.pageSize || this.pageSize === "all" ? 0 : Math.ceil(this.length / this.pageSize);
  }

  /** Whether a previous page can be displayed. */
  get hasPreviousPage(): boolean {
    return this.pageSize !== "all" && this.pageSize > 0 && this.pageIndex >= 1;
  }

  /** Whether a next page can be displayed. */
  get hasNextPage(): boolean {
    return this.pageSize !== "all" && this.pageSize > 0 && this.pageIndex < this.pageCount - 1;
  }

  /**
   * A function used to format the range label.
   * @param {number} pageIndex The zero-based index of the current page.
   * @param {number | "all"} pageSize The current number of items to display in a page.
   * @param {number} length The current length of the total number of items which are being paginated.
   * @returns {string} The range label.
   */
  rangeLabelFormatter?: (pageIndex: number, pageSize: number | "all", length: number) => string;

  /** Move to the first page. */
  firstPage(): void {
    if (this.hasPreviousPage) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex = 0;
      this.#emitPageEvent(previousPageIndex);
    }
  }

  /** Move to the previous page. */
  previousPage(): void {
    if (this.hasPreviousPage) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex--;
      this.#emitPageEvent(previousPageIndex);
    }
  }

  /** Move to the next page. */
  nextPage(): void {
    if (this.hasNextPage) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex++;
      this.#emitPageEvent(previousPageIndex);
    }
  }

  /** Move to the last page. */
  lastPage(): void {
    if (this.hasNextPage) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex = this.pageCount - 1;
      this.#emitPageEvent(previousPageIndex);
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("pageIndex")) {
      const pageSizes = this.#parsePageSizes();
      if (!pageSizes.includes(this.pageSize)) {
        this.pageSizes = [...pageSizes, this.pageSize].join(",");
        this.pageSizes = this.#parsePageSizes().join(",");
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="outer">
      <div class="inner">${this.#renderPageSize()} ${this.#renderRangeActions()}</div>
    </div>`;
  }

  /** @private */
  #renderPageSize(): unknown {
    const sizes = this.#parsePageSizes();
    return this.hidePageSize
      ? nothing
      : html`<div id="${this.#pageSizeLabelId}" class="items-per-page-label" aria-live="polite">
            ${this.itemsPerPageLabel}
          </div>
          <m3e-form-field class="form-field" variant="${this.pageSizeVariant}" hide-subscript="always">
            <m3e-select
              class="select"
              aria-labelledby="${this.#pageSizeLabelId}"
              hide-selection-indicator
              ?disabled="${this.disabled || sizes.length <= 1}"
              @change="${this.#handleSelectChange}"
            >
              ${sizes.map(
                (x) =>
                  html`<m3e-option value="${x}" ?selected="${x === this.pageSize}">
                    ${x === "all" ? "All" : x}
                  </m3e-option>`
              )}
            </m3e-select>
          </m3e-form-field>`;
  }

  /** @private */
  #parsePageSizes(): Array<number | "all"> {
    const sizes: Array<number | "all"> = this.pageSizes
      .split(",")
      .map((x) => x.trim())
      .filter((x) => x !== "")
      .map((x) => (x === "all" ? x : Number(x)));

    const numericSizes = <Array<number>>sizes.filter((x) => x !== "all");
    numericSizes.sort((a, b) => a - b);
    return sizes.some((x) => x === "all") ? [...numericSizes, "all"] : numericSizes;
  }

  /** @private */
  #renderRangeActions(): unknown {
    const rangeLabelFormatter = this.rangeLabelFormatter ?? this.#defaultRangeLabelFormatter;

    return this.pageSize === "all"
      ? nothing
      : html`<div class="range-actions">
          <div class="range-label">${rangeLabelFormatter(this.pageIndex, this.pageSize, this.length)}</div>
          ${!this.showFirstLastButtons
            ? nothing
            : html`<m3e-icon-button
                  id="firstPageButton"
                  aria-label="${this.firstPageLabel}"
                  ?disabled="${this.disabled || !this.hasPreviousPage}"
                  @click="${this.firstPage}"
                >
                  <slot name="first-page-icon">
                    <svg viewBox="0 -960 960 960" fill="currentColor">
                      <path d="M240-240v-480h80v480h-80Zm440 0L440-480l240-240 56 56-184 184 184 184-56 56Z" />
                    </svg>
                  </slot>
                </m3e-icon-button>
                <m3e-tooltip for="firstPageButton" position="above">${this.firstPageLabel}</m3e-tooltip>`}
          <m3e-icon-button
            id="previousPageButton"
            aria-label="${this.previousPageLabel}"
            ?disabled="${this.disabled || !this.hasPreviousPage}"
            @click="${this.previousPage}"
          >
            <slot name="previous-page-icon">
              <svg viewBox="0 -960 960 960" fill="currentColor">
                <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
              </svg>
            </slot>
          </m3e-icon-button>
          <m3e-tooltip for="previousPageButton" position="above">${this.previousPageLabel}</m3e-tooltip>
          <m3e-icon-button
            id="nextPageButton"
            aria-label="${this.nextPageLabel}"
            ?disabled="${this.disabled || !this.hasNextPage}"
            @click="${this.nextPage}"
          >
            <slot name="next-page-icon">
              <svg viewBox="0 -960 960 960" fill="currentColor">
                <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
              </svg>
            </slot>
          </m3e-icon-button>
          <m3e-tooltip for="nextPageButton" position="above">${this.nextPageLabel}</m3e-tooltip>
          ${!this.showFirstLastButtons
            ? nothing
            : html`<m3e-icon-button
                  id="lastPageButton"
                  aria-label="${this.lastPageLabel}"
                  ?disabled="${this.disabled || !this.hasNextPage}"
                  @click="${this.lastPage}"
                >
                  <slot name="last-page-icon">
                    <svg viewBox="0 -960 960 960" fill="currentColor">
                      <path d="m280-240-56-56 184-184-184-184 56-56 240 240-240 240Zm360 0v-480h80v480h-80Z" />
                    </svg>
                  </slot>
                </m3e-icon-button>
                <m3e-tooltip for="lastPageButton" position="above">${this.lastPageLabel}</m3e-tooltip>`}
        </div>`;
  }

  /** @private */
  #handleSelectChange(e: Event): void {
    const option = (e.target as M3eSelectElement)?.selected[0];
    if (!option) return;

    const pageSize = option.value === "all" ? "all" : Number(option.value);
    if (pageSize !== this.pageSize) {
      const previousPageIndex = this.pageIndex;
      this.pageIndex = 0;
      this.pageSize = pageSize;
      this.#emitPageEvent(previousPageIndex);
    }
  }

  /** @private */
  #emitPageEvent(previousPageIndex: number): void {
    this.dispatchEvent(
      new CustomEvent<PageEventDetail>("page", {
        detail: {
          previousPageIndex: previousPageIndex,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
          length: this.length,
        },
      })
    );
  }
}

interface M3ePaginatorElementEventMap extends HTMLElementEventMap {
  page: CustomEvent<PageEventDetail>;
}

export interface M3ePaginatorElement {
  addEventListener<K extends keyof M3ePaginatorElementEventMap>(
    type: K,
    listener: (this: M3ePaginatorElement, ev: M3ePaginatorElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3ePaginatorElementEventMap>(
    type: K,
    listener: (this: M3ePaginatorElement, ev: M3ePaginatorElementEventMap[K]) => void,
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
    "m3e-paginator": M3ePaginatorElement;
  }
}
