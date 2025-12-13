import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";
import { classMap } from "lit/directives/class-map.js";

import { DesignToken, prefersReducedMotion } from "@m3e/core";
import { M3eDirectionality } from "@m3e/core/bidi";

import { CalendarView } from "./CalendarView";

const yearsPerPage = 24;
const yearsPerRow = 4;
const monthsPerRow = 4;

/**
 * A calendar used to select a date.
 *
 * @description
 * The `m3e-calendar` component provides structured navigation and selection across
 * month, year, and multi‑year views. It supports single‑date and range selection,
 * applies disabled rules including minimum, maximum, and blackout constraints, and
 * provides styling hooks for special date states.
 *
 * @example
 * The following example illustrates use of the `m3e-calendar`. In this example, a calendar is displayed
 * with a selected date.
 *
 * ```html
 * <m3e-calendar date="2025-12-13"></m3e-calendar>
 * ```
 *
 * @tag m3e-calendar
 *
 * @slot header - Renders the header of the calendar.
 *
 * @attr date - The selected date.
 * @attr max-date - The maximum date that can be selected.
 * @attr min-date - The minimum date that can be selected.
 * @attr range-end - End of a date range.
 * @attr range-start - Start of a date range.
 * @attr start-at - A date specifying the period (month or year) to start the calendar in.
 * @attr start-view - The initial view used to select a date.
 *
 * @fires change - Emitted when the selected date changes.
 *
 * @cssprop --m3e-calendar-padding - Padding applied to the calendar header and body.
 * @cssprop --m3e-calendar-period-button-text-color - Text color used for the period‑navigation buttons in the header.
 * @cssprop --m3e-calendar-weekday-font-size - Font size of weekday labels in month view.
 * @cssprop --m3e-calendar-weekday-font-weight - Font weight of weekday labels in month view.
 * @cssprop --m3e-calendar-weekday-line-height - Line height of weekday labels in month view.
 * @cssprop --m3e-calendar-weekday-tracking - Letter spacing of weekday labels in month view.
 * @cssprop --m3e-calendar-date-font-size - Font size of date cells in month view.
 * @cssprop --m3e-calendar-date-font-weight - Font weight of date cells in month view.
 * @cssprop --m3e-calendar-date-line-height - Line height of date cells in month view.
 * @cssprop --m3e-calendar-date-tracking - Letter spacing of date cells in month view.
 * @cssprop --m3e-calendar-item-font-size - Font size of items in year and multi‑year views.
 * @cssprop --m3e-calendar-item-font-weight - Font weight of items in year and multi‑year views.
 * @cssprop --m3e-calendar-item-line-height - Line height of items in year and multi‑year views.
 * @cssprop --m3e-calendar-item-tracking - Letter spacing of items in year and multi‑year views.
 * @cssprop --m3e-calendar-item-selected-color - Text color for selected date items.
 * @cssprop --m3e-calendar-item-selected-container-color - Background color for selected date items.
 * @cssprop --m3e-calendar-item-selected-ripple-color - Ripple color used when interacting with selected date items.
 * @cssprop --m3e-calendar-item-current-outline-thickness - Outline thickness used to indicate the current date.
 * @cssprop --m3e-calendar-item-current-outline-color - Outline color used to indicate the current date.
 * @cssprop --m3e-calendar-special-date-color - Text color for dates marked as special.
 * @cssprop --m3e-calendar-special-date-container-color - Background color for dates marked as special.
 * @cssprop --m3e-calendar-range-container-color - Background color applied to the selected date range.
 * @cssprop --m3e-calendar-range-color - Text color for dates within a selected range.
 * @cssprop --m3e-calendar-item-disabled-color - Color used for disabled date items.
 * @cssprop --m3e-calendar-item-disabled-color-opacity - Opacity applied to the disabled item color.
 * @cssprop --m3e-calendar-slide-animation-duration - Duration of slide transitions between calendar views.
 */
@customElement("m3e-calendar")
export class M3eCalendarElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      user-select: none;
      vertical-align: top;
    }
    .header {
      display: flex;
      align-items: center;
      padding-block-start: var(--m3e-calendar-padding, 0.5rem);
      padding-inline: var(--m3e-calendar-padding, 0.5rem);
      --m3e-text-button-label-text-color: var(
        --m3e-calendar-period-button-text-color,
        ${DesignToken.color.onSurfaceVariant}
      );
      --m3e-text-button-hover-label-text-color: var(
        --m3e-calendar-period-button-text-color,
        ${DesignToken.color.onSurfaceVariant}
      );
      --m3e-text-button-focus-label-text-color: var(
        --m3e-calendar-period-button-text-color,
        ${DesignToken.color.onSurfaceVariant}
      );
      --m3e-text-button-pressed-label-text-color: var(
        --m3e-calendar-period-button-text-color,
        ${DesignToken.color.onSurfaceVariant}
      );
    }
    .spacer {
      flex: 1 1 auto;
    }
    .visually-hidden {
      position: absolute;
      appearance: none;
      visibility: hidden;
      border: none;
      outline: none;
      overflow: hidden;
      left: 0;
      height: 1px;
      width: 1px;
      margin: -1px;
      padding: 0;
      white-space: nowrap;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      width: 17.75rem;
    }
    .month thead {
      font-size: var(--m3e-calendar-weekday-font-size, ${DesignToken.typescale.standard.title.small.fontSize});
      font-weight: var(--m3e-calendar-weekday-font-weight, ${DesignToken.typescale.standard.title.small.fontWeight});
      line-height: var(--m3e-calendar-weekday-line-height, ${DesignToken.typescale.standard.title.small.lineHeight});
      letter-spacing: var(--m3e-calendar-weekday-tracking, ${DesignToken.typescale.standard.title.small.tracking});
    }
    .month tbody {
      font-size: var(--m3e-calendar-date-font-size, ${DesignToken.typescale.standard.body.medium.fontSize});
      font-weight: var(--m3e-calendar-date-font-weight, ${DesignToken.typescale.standard.body.medium.fontWeight});
      line-height: var(--m3e-calendar-date-line-height, ${DesignToken.typescale.standard.body.medium.lineHeight});
      letter-spacing: var(--m3e-calendar-date-tracking, ${DesignToken.typescale.standard.body.medium.tracking});
    }
    .year tbody,
    .multi-year tbody {
      font-size: var(--m3e-calendar-item-font-size, ${DesignToken.typescale.standard.body.medium.fontSize});
      font-weight: var(--m3e-calendar-item-font-weight, ${DesignToken.typescale.standard.body.medium.fontWeight});
      line-height: var(--m3e-calendar-item-line-height, ${DesignToken.typescale.standard.body.medium.lineHeight});
      letter-spacing: var(--m3e-calendar-item-tracking, ${DesignToken.typescale.standard.body.medium.tracking});
    }
    td,
    th {
      font: inherit;
      text-align: center;
      padding: unset;
    }
    th {
      height: 2.5rem;
    }
    td {
      box-sizing: border-box;
      height: 2.375rem;
      padding-inline: 0.1875rem;
      padding-block: 0.125rem;
    }
    td:not(:has(.item[aria-disabled])).selected,
    td:not(:has(.item[aria-disabled])).range-start,
    td:not(:has(.item[aria-disabled])).range-end {
      color: var(--m3e-calendar-item-selected-color, ${DesignToken.color.onPrimary});
      --m3e-ripple-color: var(--m3e-calendar-item-selected-ripple-color, ${DesignToken.color.onPrimary});
    }
    td:not(:has(.item[aria-disabled])).selected .background,
    td:not(:has(.item[aria-disabled])).range-start .background,
    td:not(:has(.item[aria-disabled])).range-end .background {
      background-color: var(--m3e-calendar-item-selected-container-color, ${DesignToken.color.primary});
    }
    td.current:not(.selected):not(.range-start):not(.range-end) .background {
      border-style: solid;
      border-width: var(--m3e-calendar-item-current-outline-thickness, 0.0625rem);
      border-color: var(--m3e-calendar-item-current-outline-color, ${DesignToken.color.primary});
    }
    svg {
      transition: transform ${DesignToken.motion.spring.fastEffects};
    }
    svg.rotate {
      transform: rotate(-180deg);
    }
    .item,
    .item > span {
      position: relative;
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: inherit;
      outline: none;
      width: 100%;
      height: 100%;
      border-radius: ${DesignToken.shape.corner.full};
    }
    .item:not([aria-disabled]) {
      cursor: pointer;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .touch {
      position: absolute;
      height: 3rem;
      width: 3rem;
      margin: auto;
    }
    .body.multi-year .touch,
    .body.year .touch {
      width: 100%;
    }
    td:not(:has(.item[aria-disabled])):not(.selected):not(.range-start):not(.range-end).special {
      color: var(--m3e-calendar-special-date-color, ${DesignToken.color.onSecondary});
    }
    td:not(:has(.item[aria-disabled])):not(.selected):not(.range-start):not(.range-end).special .background {
      background-color: var(--m3e-calendar-special-date-container-color, ${DesignToken.color.secondary});
    }
    td:not(:has(.item[aria-disabled])).range,
    td:not(:has(.item[aria-disabled])).range-start-range,
    td:not(:has(.item[aria-disabled])).range-end {
      background-color: var(--m3e-calendar-range-container-color, ${DesignToken.color.primaryContainer});
    }
    td:not(:has(.item[aria-disabled])):not(.selected).range {
      color: var(--m3e-calendar-range-color, ${DesignToken.color.onPrimaryContainer});
    }
    td:not(:has(.item[aria-disabled])).range-start {
      border-start-start-radius: ${DesignToken.shape.corner.full};
      border-end-start-radius: ${DesignToken.shape.corner.full};
    }
    td:not(:has(.item[aria-disabled])).range-end {
      border-start-end-radius: ${DesignToken.shape.corner.full};
      border-end-end-radius: ${DesignToken.shape.corner.full};
    }
    td:not(:has(.item[aria-disabled])).range-highlight-start .item::after,
    td:not(:has(.item[aria-disabled])).range-highlight .item::after,
    td:not(:has(.item[aria-disabled])).range-highlight-end .item::after {
      content: "";
      position: absolute;
      top: 0;
      left: calc(0px - 0.1875rem);
      right: calc(0px - 0.1875rem);
      bottom: 0;
      border-style: dashed;
      border-color: ${DesignToken.color.primary};
      border-width: 1px;
    }
    td:not(:has(.item[aria-disabled])).range-highlight-start .item::after {
      margin-inline-start: 50%;
    }
    td:not(:has(.item[aria-disabled])).range-highlight-end .item::after {
      margin-inline-end: 0.1875rem;
    }
    td:not(:has(.item[aria-disabled])).range-highlight-start .item::after,
    td:not(:has(.item[aria-disabled])).range-highlight .item::after {
      border-inline-style: none;
    }
    td:not(:has(.item[aria-disabled])).range-highlight-end .item::after {
      border-start-end-radius: ${DesignToken.shape.corner.full};
      border-end-end-radius: ${DesignToken.shape.corner.full};
      border-inline-start-style: none;
    }
    td:has(.item[aria-disabled]) {
      color: color-mix(
        in srgb,
        var(--m3e-calendar-item-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-calendar-item-disabled-color-opacity, 38%),
        transparent
      );
    }
    .body {
      position: relative;
      overflow: hidden;
      padding-inline: var(--m3e-calendar-padding, 0.5rem);
      padding-block-end: var(--m3e-calendar-padding, 0.5rem);
    }
    table {
      top: 0;
    }
    table:not(.no-animate) {
      transition: ${unsafeCSS(
        `margin var(--m3e-calendar-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard},
        visibility var(--m3e-calendar-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    table.before,
    table.after {
      visibility: hidden;
      position: absolute;
    }
    table.before {
      margin-inline-start: -100%;
    }
    table.after {
      margin-inline-start: 100%;
    }
    table:not(.before):not(.after) {
      visibility: visible;
      position: relative;
      left: 0;
      margin-inline-start: 0;
    }
    .row {
      opacity: 1;
      transform: translateY(0);
    }
    .row.multi-year {
      transition: ${unsafeCSS(
        `transform var(--m3e-calendar-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard} allow-discrete,
        opacity var(--m3e-calendar-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    .row:not(.multi-year) {
      transition: ${unsafeCSS(
        `opacity var(--m3e-calendar-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    .body.month > .row:not(.month),
    .body.year > .row:not(.year),
    .body.multi-year > .row:not(.multi-year) {
      visibility: hidden;
      position: absolute;
      transform: translateY(-10%);
      opacity: 0;
    }
    .body.month > .row:not(.month) table:not(.before):not(.after),
    .body.year > .row:not(.year) table:not(.before):not(.after),
    .body.multi-year > .row:not(.multi-year) table:not(.before):not(.after) {
      visibility: hidden;
      transition: none;
    }

    @media (prefers-reduced-motion) {
      .row:not(.multi-year),
      .row.multi-year,
      table:not(.no-animate),
      svg {
        transition: none;
      }
    }
  `;

  /** @private */ @state() private _today = new Date();
  /** @private */ @state() private _activeView: CalendarView = "month";
  /** @private */ @state() private _activeDate: Date = new Date();
  /** @private */ #transitioning = false;

  /**
   * The initial view used to select a date.
   * @default "month"
   */
  @property({ attribute: "start-view" }) startView: CalendarView = "month";

  /**
   * The selected date.
   * @default null
   */
  @property({ converter: { fromAttribute: parseLocalDate } })
  date: Date | null = null;

  /**
   * A date specifying the period (month or year) to start the calendar in.
   * @default null
   */
  @property({ attribute: "start-at", converter: { fromAttribute: parseLocalDate } })
  startAt: Date | null = null;

  /**
   * The minimum date that can be selected.
   * @default null
   */
  @property({ attribute: "min-date", converter: { fromAttribute: parseLocalDate } })
  minDate: Date | null = null;

  /**
   * The maximum date that can be selected.
   * @default null
   */
  @property({ attribute: "max-date", converter: { fromAttribute: parseLocalDate } })
  maxDate: Date | null = null;

  /**
   * Start of a date range.
   * @default null
   */
  @property({ attribute: "range-start", converter: { fromAttribute: parseLocalDate } })
  rangeStart: Date | null = null;

  /**
   * End of a date range.
   * @default null
   */
  @property({ attribute: "range-end", converter: { fromAttribute: parseLocalDate } })
  rangeEnd: Date | null = null;

  /**
   * A function used to determine whether a date cannot be selected.
   * @default null
   */
  @property({ attribute: false }) blackoutDates: ((date: Date) => boolean) | null = null;

  /**
   * A function used to determine whether a date is special.
   * @default null
   */
  @property({ attribute: false }) specialDates: ((date: Date) => boolean) | null = null;

  /**
   * The accessible label given to the button used to move to the previous month.
   * @default "Previous month"
   */
  @property({ attribute: "previous-month-label" }) previousMonthLabel = "Previous month";

  /**
   * The accessible label given to the button used to move to the previous year.
   * @default "Previous year"
   */
  @property({ attribute: "previous-year-label" }) previousYearLabel = "Previous year";

  /**
   * The accessible label given to the button used to move to the previous 24 years.
   * @default "Previous 24 years"
   */
  @property({ attribute: "previous-multi-year-label" }) previousMultiYearLabel = "Previous 24 years";

  /**
   * The accessible label given to the button used to move to the next month.
   * @default "Next month"
   */
  @property({ attribute: "next-month-label" }) nextMonthLabel = "Next month";

  /**
   * The accessible label given to the button used to move to the next year.
   * @default "Next year"
   */
  @property({ attribute: "next-year-label" }) nextYearLabel = "Next year";

  /**
   * The accessible label given to the button used to move to the next 24 years.
   * @default "Next 24 years"
   */
  @property({ attribute: "next-multi-year-label" }) nextMultiYearLabel = "Next 24 years";

  /** The label to present for the current period. */
  get periodLabel(): string {
    switch (this._activeView) {
      case "month":
        return new Intl.DateTimeFormat(navigator.language, { month: "short", year: "numeric" }).format(
          this._activeDate
        );

      case "year":
        return new Intl.DateTimeFormat(navigator.language, { year: "numeric" }).format(this._activeDate);

      case "multi-year":
        return new Intl.DateTimeFormat(navigator.language, { year: "numeric" }).formatRange(
          new Date(this.#minYearOfPage, 1, 1),
          new Date(this.#maxYearOfPage, 1, 1)
        );
    }
  }

  /** Whether the calendar can move to the previous period. */
  get canMovePreviousPeriod(): boolean {
    if (!this.minDate) return true;
    switch (this._activeView) {
      case "month":
        return new Date(this._activeDate.getFullYear(), this._activeDate.getMonth(), 0) >= this.minDate;

      case "year":
        return new Date(this._activeDate.getFullYear() - 1, 12, 1) >= this.minDate;

      case "multi-year": {
        return new Date(this.#minYearOfPage - 1, 12, 1) >= this.minDate;
      }
    }
  }

  /** Whether the calendar can move to the next period. */
  get canMoveNextPeriod(): boolean {
    if (!this.maxDate) return true;
    switch (this._activeView) {
      case "month":
        return new Date(this._activeDate.getFullYear(), this._activeDate.getMonth() + 1, 1) <= this.maxDate;

      case "year":
        return new Date(this._activeDate.getFullYear() + 1, 1, 1) <= this.maxDate;

      case "multi-year": {
        return new Date(this.#maxYearOfPage + 1, 12, 1) <= this.maxDate;
      }
    }
  }

  /** @private */
  get #minYearOfPage(): number {
    return (
      this._activeDate.getFullYear() -
      M3eCalendarElement.__getActiveOffset(this._activeDate, this.minDate, this.maxDate)
    );
  }

  /** @private */
  get #maxYearOfPage(): number {
    return this.#minYearOfPage + yearsPerPage - 1;
  }

  /**
   * Asynchronously focuses the active date.
   * @returns {Promise<void>} A promise that resolves after the active date has been focused.
   */
  async focusActiveCell(): Promise<void> {
    if (this.isUpdatePending) {
      await this.updateComplete;
    }

    this.shadowRoot
      ?.querySelector<HTMLTableCellElement>(
        `.row.${this._activeView} table:not(.before):not(.after) .item[tabindex='0']`
      )
      ?.focus();
  }

  /** Updates today's date. */
  updateTodayDate(): void {
    this._today = new Date();
  }

  /**
   * Moves the calendar to the previous period.
   * @returns {Promise<void>} A promise that resolves when transitioning is complete.
   */
  movePreviousPeriod(): Promise<void> {
    return new Promise((resolve) => {
      if (this.#transitioning || !this.canMovePreviousPeriod) {
        resolve();
        return;
      }

      const tables = [...(this.shadowRoot?.querySelectorAll(`.row.${this._activeView} table`) ?? [])];
      if (tables.length != 3) {
        resolve();
        return;
      }

      if (prefersReducedMotion()) {
        this.#movePreviousPeriod();
        resolve();
        return;
      }

      this.#transitioning = true;
      tables[1].classList.toggle("after", true);
      tables[0].classList.remove("before");

      tables[0].addEventListener(
        "transitionend",
        () => {
          this.#movePreviousPeriod();

          tables.forEach((x) => x.classList.add("no-animate"));
          tables[1].classList.remove("after");
          tables[0].classList.add("before");

          setTimeout(() => {
            tables.forEach((x) => x.classList.remove("no-animate"));
            this.#transitioning = false;
            resolve();
          });
        },
        {
          once: true,
        }
      );
    });
  }

  /**
   * Moves the calendar to the next period.
   * @returns {Promise<void>} A promise that resolves when transitioning is complete.
   */
  moveNextPeriod(): Promise<void> {
    return new Promise((resolve) => {
      if (this.#transitioning || !this.canMoveNextPeriod) {
        resolve();
        return;
      }

      const tables = [...(this.shadowRoot?.querySelectorAll(`.row.${this._activeView} table`) ?? [])];
      if (tables.length != 3) {
        resolve();
        return;
      }

      if (prefersReducedMotion()) {
        this.#moveNextPeriod();
        resolve();
        return;
      }

      this.#transitioning = true;
      tables[1].classList.toggle("before", true);
      tables[2].classList.remove("after");

      tables[2].addEventListener(
        "transitionend",
        () => {
          this.#moveNextPeriod();

          tables.forEach((x) => x.classList.add("no-animate"));
          tables[1].classList.remove("before");
          tables[2].classList.add("after");

          setTimeout(() => {
            tables.forEach((x) => x.classList.remove("no-animate"));
            this.#transitioning = false;
            resolve();
          });
        },
        {
          once: true,
        }
      );
    });
  }

  /**
   * Toggles the current period.
   * @returns {Promise<void>} A promise that resolves when transitioning is complete.
   */
  togglePeriod(): Promise<void> {
    return new Promise((resolve) => {
      this._activeView = this._activeView === "month" ? "multi-year" : "month";

      if (!prefersReducedMotion()) {
        this.shadowRoot?.querySelector(".row.multi-year")?.addEventListener(
          "transitionend",
          () => {
            this.focusActiveCell();
            resolve();
          },
          { once: true }
        );
      } else {
        this.focusActiveCell();
        resolve();
      }
    });
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("startAt") || changedProperties.has("date")) {
      this._activeDate = new Date(this.date ?? this.startAt ?? this._activeDate);
    }

    if (changedProperties.has("startView")) {
      this._activeView = this.startView;
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    let activeCell = this.shadowRoot?.querySelector<HTMLTableCellElement>(
      `.row.${this._activeView} table:not(.before):not(.after) .item[tabindex='0']`
    );
    if (!activeCell) {
      activeCell = this.shadowRoot?.querySelector<HTMLTableCellElement>(
        `.row.${this._activeView} table:not(.before):not(.after) .item[tabindex='-1']`
      );
      if (activeCell) {
        activeCell.tabIndex = 0;
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot name="header">${this.#renderHeader()}</slot>
      <div class="body ${this._activeView}">
        <div class="row multi-year">
          ${this.#renderMultiYearView(-1)}${this.#renderMultiYearView(0)}${this.#renderMultiYearView(1)}
        </div>
        <div class="row year">${this.#renderYearView(-1)}${this.#renderYearView(0)}${this.#renderYearView(1)}</div>
        <div class="row month">${this.#renderMonthView(-1)}${this.#renderMonthView(0)}${this.#renderMonthView(1)}</div>
      </div>`;
  }

  /** @private */
  #renderHeader(): unknown {
    return html`<div class="header">
      <m3e-button @click="${this.togglePeriod}">
        ${this.periodLabel}
        <svg
          class="${classMap({ rotate: this._activeView !== "month" })}"
          slot="trailing-icon"
          viewBox="0 -960 960 960"
          fill="currentColor"
        >
          <path d="M480-360 280-560h400L480-360Z" />
        </svg>
      </m3e-button>
      <div class="spacer"></div>
      <m3e-icon-button
        ?disabled="${!this.canMovePreviousPeriod}"
        @click="${this.movePreviousPeriod}"
        aria-label="${this._activeView === "month"
          ? this.previousMonthLabel
          : this._activeView === "year"
            ? this.previousYearLabel
            : this.previousMultiYearLabel}"
      >
        ${M3eDirectionality.current === "ltr"
          ? html`<svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>`
          : html`<svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>`}
      </m3e-icon-button>
      <m3e-icon-button
        ?disabled="${!this.canMoveNextPeriod}"
        @click="${this.moveNextPeriod}"
        aria-label="${this._activeView === "month"
          ? this.nextMonthLabel
          : this._activeView === "year"
            ? this.nextYearLabel
            : this.nextMultiYearLabel}"
      >
        ${M3eDirectionality.current === "ltr"
          ? html`<svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>`
          : html`<svg viewBox="0 -960 960 960" fill="currentColor">
              <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" />
            </svg>`}
      </m3e-icon-button>
    </div>`;
  }

  /** @private */
  #renderMonthView(offset: -1 | 0 | 1): unknown {
    const date = new Date(this._today);
    date.setDate(1);

    while (date.getDay() != 0) {
      date.setDate(date.getDate() + 1);
    }

    const weekdays = new Array<{ long: string; narrow: string; id: number }>();

    for (let i = 0; i < 7; i++) {
      weekdays.push({
        id: i,
        narrow: new Intl.DateTimeFormat(navigator.language, { weekday: "narrow" }).format(date),
        long: new Intl.DateTimeFormat(navigator.language, { weekday: "long" }).format(date),
      });

      date.setDate(date.getDate() + 1);
    }

    const year = this._activeDate.getFullYear();
    const month = this._activeDate.getMonth() + offset;
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const numDays = lastDate.getDate();

    let weeks: number[][] = [];
    let dayOfWeek = firstDate.getDay();

    for (let date = 1; date <= numDays; date++) {
      if (dayOfWeek === 0 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(date);
      dayOfWeek = (dayOfWeek + 1) % 7;
    }

    weeks = weeks.filter((x) => !!x.length);

    return html`<table
      .inert="${offset !== 0}"
      class="${classMap({ month: true, before: offset < 0, after: offset > 0 })}"
      role="grid"
    >
      <thead>
        <tr>
          ${weekdays.map(
            (x) =>
              html`<th scope="col" id="weekday-${x.id}-month-${month}">
                <span class="visually-hidden">${x.long}</span>
                <span aria-hidden="true">${x.narrow}</span>
                ${offset == 0
                  ? html`<m3e-tooltip for="weekday-${x.id}-month-${month}">${x.long}</m3e-tooltip>`
                  : nothing}
              </th>`
          )}
        </tr>
      </thead>
      <tbody>
        ${weeks.map(
          (x, i) =>
            html`<tr role="row">
              ${i === 0 && x.length < 7 ? html`<td colspan="${7 - x.length}"></td>` : nothing}
              ${x.map((y) => this.#renderDate(new Date(year, month, y), offset !== 0))}
              ${i > 0 && x.length < 7 ? html`<td colspan="${7 - x.length}"></td>` : nothing}
            </tr>`
        )}
      </tbody>
    </table>`;
  }

  /** @private */
  #renderDate(value: Date, hidden: boolean): unknown {
    const long = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(value);

    const special = this.specialDates?.(value) ?? false;
    const selected =
      this.date != null &&
      this.date.getFullYear() === value.getFullYear() &&
      this.date.getMonth() === value.getMonth() &&
      this.date.getDate() === value.getDate();

    const current =
      this._today.getFullYear() === value.getFullYear() &&
      this._today.getMonth() === value.getMonth() &&
      this._today.getDate() === value.getDate();

    let disabled =
      (this.minDate &&
        (value.getFullYear() < this.minDate.getFullYear() ||
          (value.getFullYear() === this.minDate.getFullYear() &&
            (value.getMonth() < this.minDate.getMonth() ||
              (value.getMonth() === this.minDate.getMonth() && value.getDate() < this.minDate.getDate()))))) ||
      (this.maxDate &&
        (value.getFullYear() > this.maxDate.getFullYear() ||
          (value.getFullYear() === this.maxDate.getFullYear() &&
            (value.getMonth() > this.maxDate.getMonth() ||
              (value.getMonth() === this.maxDate.getMonth() && value.getDate() > this.maxDate.getDate())))));

    if (!disabled && this.blackoutDates) {
      disabled = this.blackoutDates(value);
    }

    const id = `date-${value.getMonth()}-${value.getDate()}-${value.getFullYear()}`;

    let range = false,
      rangeStart = false,
      rangeEnd = false,
      rangeStartRange = false;

    if (this.rangeStart) {
      if (!this.rangeEnd) {
        rangeStart =
          value >= this.rangeStart &&
          value < new Date(new Date(this.rangeStart).setDate(this.rangeStart.getDate() + 1));
      } else {
        range = value > this.rangeStart && value < this.rangeEnd;
        if (!range) {
          rangeStart = value >= this.rangeStart && value < this.rangeEnd;
          if (!rangeStart) {
            rangeEnd = value > this.rangeStart && value <= this.rangeEnd;
          } else {
            rangeStartRange = true;
          }
        }
      }
    }

    return html`<td
      role="gridcell"
      class="${classMap({
        special,
        current,
        selected,
        range,
        "range-start": rangeStart,
        "range-start-range": rangeStartRange,
        "range-end": rangeEnd,
      })}"
    >
      <div
        id="${id}"
        role="button"
        class="item"
        data-value="${value.toISOString()}"
        tabindex="${ifDefined(disabled ? undefined : (this.date ? selected : current) ? "0" : "-1")}"
        aria-disabled="${ifDefined(disabled || undefined)}"
        aria-current="${ifDefined(current ? "date" : undefined)}"
        aria-pressed="${selected || rangeStart || rangeEnd}"
        @click="${!hidden ? this.#handleDateClick : undefined}"
        @mouseenter="${!hidden ? this.#handleDateRangeHighlight : undefined}"
        @focus="${!hidden ? this.#handleDateRangeHighlight : undefined}"
        @mouseleave="${!hidden ? this.#clearRangeHighlight : undefined}"
        @blur="${!hidden ? this.#clearRangeHighlight : undefined}"
        @keydown="${!hidden ? this.#handleItemKeyDown : undefined}"
      >
        <m3e-focus-ring
          class="focus-ring"
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-focus-ring>
        <m3e-state-layer
          class="background"
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-state-layer>
        <m3e-ripple
          class="ripple"
          centered
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-ripple>
        <div class="touch"></div>
        <span class="visually-hidden">${long}</span>
        <span aria-hidden="true">${value.getDate()}</span>
      </div>
    </td>`;
  }

  /** @private */
  #renderYearView(offset: -1 | 0 | 1): unknown {
    const months = new Array<{ id: number; date: Date; long: string; narrow: string }[]>();
    const shortFormat = new Intl.DateTimeFormat(navigator.language, { month: "short" });
    const longFormat = new Intl.DateTimeFormat(navigator.language, { month: "long" });
    const year = this._activeDate.getFullYear() + offset;
    for (let i = 0, row = new Array<{ id: number; long: string; narrow: string; date: Date }>(); i < 12; i++) {
      const date = new Date(year, i, 1);
      row.push({ id: i, narrow: shortFormat.format(date), long: longFormat.format(date), date: date });
      if (row.length == monthsPerRow) {
        months.push(row);
        row = [];
      }
    }

    return html`<table
      .inert="${offset !== 0}"
      class="year ${offset < 0 ? "before" : offset > 0 ? "after" : ""}"
      role="grid"
    >
      <thead aria-hidden="true">
        <tr>
          <th colspan="${monthsPerRow}"></th>
        </tr>
      </thead>
      <tbody>
        ${months.map(
          (x) =>
            html`<tr role="row">
              ${x.map((y) => this.#renderMonth(y.id, y.long, y.narrow, y.date, offset !== 0))}
            </tr>`
        )}
      </tbody>
    </table>`;
  }

  /** @private */
  #renderMonth(month: number, long: string, narrow: string, date: Date, hidden: boolean): unknown {
    const selected = this.date?.getFullYear() === date.getFullYear() && this.date?.getMonth() === month;
    const current = this._today.getFullYear() === date.getFullYear() && this._today.getMonth() === month;
    const disabled =
      (this.minDate &&
        (date.getFullYear() < this.minDate.getFullYear() ||
          (date.getFullYear() === this.minDate.getFullYear() && month < this.minDate.getMonth()))) ||
      (this.maxDate &&
        (date.getFullYear() > this.maxDate.getFullYear() ||
          (date.getFullYear() === this.maxDate.getFullYear() && month > this.maxDate.getMonth())));

    const id = `month-${month}-${date.getFullYear()}`;

    return html`<td role="gridcell" class="${classMap({ current, selected })}">
      <div
        id="${id}"
        class="item"
        role="button"
        tabindex="${ifDefined(disabled ? undefined : (this.date ? selected : current) ? "0" : "-1")}"
        data-value="${month}"
        aria-disabled="${ifDefined(disabled || undefined)}"
        aria-current="${ifDefined(current ? "date" : undefined)}"
        aria-pressed="${selected}"
        @click="${!hidden ? this.#handleMonthClick : undefined}"
        @keydown="${!hidden ? this.#handleItemKeyDown : undefined}"
      >
        <m3e-focus-ring
          class="focus-ring"
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-focus-ring>
        <m3e-state-layer
          class="background"
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-state-layer>
        <m3e-ripple
          class="ripple"
          centered
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-ripple>
        <div class="touch"></div>
        <span class="visually-hidden">${long}</span>
        <span aria-hidden="true">${narrow}</span>
      </div>
    </td>`;
  }

  /** @private */
  #renderMultiYearView(offset: -1 | 0 | 1): unknown {
    const years = new Array<number[]>();
    let minYearOfPage = this.#minYearOfPage;
    switch (offset) {
      case -1:
        minYearOfPage -= yearsPerPage;
        break;
      case 1:
        minYearOfPage += yearsPerPage;
        break;
    }

    for (let i = 0, row: number[] = []; i < yearsPerPage; i++) {
      row.push(minYearOfPage + i);
      if (row.length === yearsPerRow) {
        years.push(row);
        row = new Array<number>();
      }
    }

    return html`<table
      .inert="${offset !== 0}"
      class="multi-year ${offset < 0 ? "before" : offset > 0 ? "after" : ""}"
      role="grid"
    >
      <thead aria-hidden="true">
        <tr>
          <th colspan="${yearsPerRow}"></th>
        </tr>
      </thead>
      <tbody>
        ${years.map(
          (x) =>
            html`<tr role="row">
              ${x.map((y) => this.#renderYear(y, offset !== 0))}
            </tr>`
        )}
      </tbody>
    </table>`;
  }

  /** @private */
  #renderYear(year: number, hidden: boolean): unknown {
    const selected = this.date?.getFullYear() === year;
    const current = this._today.getFullYear() === year;
    const disabled =
      (this.minDate && year < this.minDate.getFullYear()) || (this.maxDate && year > this.maxDate.getFullYear());

    const id = `year-${year}`;

    return html`<td role="gridcell" class="${classMap({ current, selected })}">
      <div
        id="${id}"
        class="item"
        role="button"
        tabindex="${ifDefined(disabled ? undefined : (this.date ? selected : current) ? "0" : "-1")}"
        data-value="${year}"
        aria-disabled="${ifDefined(disabled || undefined)}"
        aria-current="${ifDefined(current ? "date" : undefined)}"
        aria-pressed="${selected}"
        @click="${!hidden ? this.#handleYearClick : undefined}"
        @keydown="${!hidden ? this.#handleItemKeyDown : undefined}"
      >
        <m3e-focus-ring
          class="focus-ring"
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-focus-ring>
        <m3e-state-layer
          class="background"
          for="${ifDefined(!hidden ? id : undefined)}"
          ?disabled="${disabled}"
        ></m3e-state-layer>
        <m3e-ripple
          class="ripple"
          for="${ifDefined(!hidden ? id : undefined)}"
          centered
          ?disabled="${disabled}"
        ></m3e-ripple>
        <div class="touch"></div>
        <span>${year}</span>
      </div>
    </td>`;
  }

  /** @private */
  #handleDateClick(e: Event): void {
    const item = <HTMLElement>e.currentTarget;
    if (item.ariaDisabled === "true") return;

    this.#activateItem(item);
    const value = item.dataset["value"];
    if (value && value !== this.date?.toISOString()) {
      this.date = new Date(value);
      this._activeDate = new Date(this.date);

      if (this.rangeStart) {
        if (this.date < this.rangeStart) {
          this.rangeStart = this.date;
          this.rangeEnd = null;
        } else {
          this.rangeEnd = this.date;
        }
        this.#clearRangeHighlight();
      }

      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /** @private */
  #handleDateRangeHighlight(e: MouseEvent): void {
    this.#setRangeHighlight(<HTMLElement>e.currentTarget);
  }

  /** @private */
  #setRangeHighlight(item: HTMLElement): void {
    this.#clearRangeHighlight();

    if (this.rangeStart) {
      if (new Date(item.dataset["value"]!) > this.rangeStart) {
        item.parentElement!.classList.add("range-highlight-end");
      }
      for (const cell of item.closest("table")?.querySelectorAll<HTMLElement>(".item") ?? []) {
        if (cell === item) break;
        const value = new Date(cell.dataset["value"]!);
        if (value > this.rangeStart) {
          cell.parentElement!.classList.add("range-highlight");
        } else if (value >= this.rangeStart) {
          cell.parentElement!.classList.add("range-highlight-start");
        }
      }
    }
  }

  /** @private */
  #clearRangeHighlight(): void {
    if (this.rangeStart) {
      this.shadowRoot
        ?.querySelectorAll(".range-highlight,.range-highlight-end,.range-highlight-start")
        .forEach((x) => x.classList.remove("range-highlight", "range-highlight-end", "range-highlight-start"));
    }
  }

  /** @private */
  #handleMonthClick(e: Event): void {
    const item = <HTMLElement>e.currentTarget;
    if (item.ariaDisabled === "true") return;

    this.#activateItem(item);
    const value = item.dataset["value"];
    if (value) {
      this._activeDate = new Date(this._activeDate);
      this._activeDate.setMonth(Number(value));
      this._activeView = "month";

      if (!prefersReducedMotion()) {
        this.shadowRoot
          ?.querySelector(".row.year")
          ?.addEventListener("transitionend", () => this.focusActiveCell(), { once: true });
      } else {
        this.focusActiveCell();
      }
    }
  }

  /** @private */
  #handleYearClick(e: Event): void {
    const item = <HTMLElement>e.currentTarget;
    if (item.ariaDisabled === "true") return;

    this.#activateItem(item);
    const value = item.dataset["value"];
    if (value) {
      this._activeDate = new Date(this._activeDate);
      this._activeDate.setFullYear(Number(value));
      this._activeView = "year";

      if (!prefersReducedMotion()) {
        this.shadowRoot
          ?.querySelector(".row.multi-year")
          ?.addEventListener("transitionend", () => this.focusActiveCell(), { once: true });
      } else {
        this.focusActiveCell();
      }
    }
  }

  /** @private */
  async #handleItemKeyDown(e: KeyboardEvent): Promise<void> {
    const item = <HTMLElement>e.currentTarget;
    if (item.ariaDisabled === "true") return;

    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        item.click();
        break;

      case "ArrowLeft":
      case "Left":
        e.preventDefault();
        if (M3eDirectionality.current === "ltr") {
          if (item.parentElement?.previousElementSibling?.firstElementChild?.hasAttribute("tabindex")) {
            this.#activateItem(<HTMLElement>item.parentElement?.previousElementSibling?.firstElementChild);
          }
        } else if (item.parentElement?.nextElementSibling?.firstElementChild?.hasAttribute("tabindex")) {
          this.#activateItem(<HTMLElement>item.parentElement?.nextElementSibling?.firstElementChild);
        }

        break;

      case "ArrowRight":
      case "Right":
        e.preventDefault();
        if (M3eDirectionality.current === "ltr") {
          if (item.parentElement?.nextElementSibling?.firstElementChild?.hasAttribute("tabindex")) {
            this.#activateItem(<HTMLElement>item.parentElement?.nextElementSibling?.firstElementChild);
          }
        } else if (item.parentElement?.previousElementSibling?.firstElementChild?.hasAttribute("tabindex")) {
          this.#activateItem(<HTMLElement>item.parentElement?.previousElementSibling?.firstElementChild);
        }
        break;

      case "ArrowUp":
      case "Up":
        {
          e.preventDefault();
          const row = item.closest("tr");
          if (row && item.parentElement) {
            const cellCount = row.cells.length;
            const index = [...row.cells].indexOf(<HTMLTableCellElement>item.parentElement);
            const previousRow = row.previousElementSibling;

            if (previousRow instanceof HTMLTableRowElement) {
              let previousIndex = index;
              if (cellCount > previousRow.cells.length) {
                previousIndex -= cellCount - previousRow.cells.length;
              }
              if (previousRow.cells[previousIndex]?.firstElementChild?.hasAttribute("tabindex")) {
                this.#activateItem(<HTMLElement>previousRow.cells[previousIndex].firstElementChild);
              }
            }
          }
        }
        break;

      case "ArrowDown":
      case "Down":
        {
          e.preventDefault();
          const row = item.closest("tr");
          if (row && item.parentElement) {
            let index = [...row.cells].indexOf(<HTMLTableCellElement>item.parentElement);
            const nextRow = row.nextElementSibling;

            if (nextRow instanceof HTMLTableRowElement) {
              if (row.cells.length < nextRow.cells.length) {
                index += nextRow.cells.length - row.cells.length;
              }
              if (nextRow.cells[index]?.firstElementChild?.hasAttribute("tabindex")) {
                this.#activateItem(<HTMLElement>nextRow.cells[index].firstElementChild);
              }
            }
          }
        }
        break;

      case "PageUp":
        this.movePreviousPeriod();
        e.preventDefault();
        break;

      case "PageDown":
        this.moveNextPeriod();
        e.preventDefault();
        break;
    }
  }

  /** @private */
  #movePreviousPeriod(): void {
    const activeDate = new Date(this._activeDate);
    switch (this._activeView) {
      case "month":
        activeDate.setMonth(activeDate.getMonth() - 1);
        break;
      case "year":
        activeDate.setFullYear(activeDate.getFullYear() - 1);
        break;
      case "multi-year":
        activeDate.setDate(1);
        activeDate.setFullYear(this.#minYearOfPage - 1);
        break;
    }

    this._activeDate = activeDate;
  }

  /** @private */
  #moveNextPeriod(): void {
    const activeDate = new Date(this._activeDate);
    switch (this._activeView) {
      case "month":
        activeDate.setMonth(this._activeDate.getMonth() + 1);
        break;
      case "year":
        activeDate.setFullYear(this._activeDate.getFullYear() + 1);
        break;

      case "multi-year":
        activeDate.setDate(1);
        activeDate.setFullYear(this.#maxYearOfPage + 1);
        break;
    }

    this._activeDate = activeDate;
  }

  /** @private */
  #activateItem(item: HTMLElement): void {
    this.shadowRoot
      ?.querySelectorAll<HTMLTableCellElement>(
        `.row.${this._activeView} table:not(.before):not(.after) .item[tabindex='0']`
      )
      .forEach((x) => (x.tabIndex = -1));
    item.tabIndex = 0;
    item.focus();
  }

  /** @private */
  private static __getActiveOffset(activeDate: Date, minDate: Date | null, maxDate: Date | null): number {
    return M3eCalendarElement.__euclideanModulo(
      activeDate.getFullYear() - M3eCalendarElement.__getStartingYear(minDate, maxDate),
      yearsPerPage
    );
  }

  /** @private */
  private static __getStartingYear(minDate: Date | null, maxDate: Date | null): number {
    if (maxDate) {
      return maxDate.getFullYear() - yearsPerPage + 1;
    } else if (minDate) {
      return minDate.getFullYear();
    }
    return 0;
  }

  /** @private */
  private static __euclideanModulo(a: number, b: number): number {
    return ((a % b) + b) % b;
  }
}

function parseLocalDate(value: string | null): Date | null {
  if (!value) return null;
  const date = new Date(value);
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-calendar": M3eCalendarElement;
  }
}
