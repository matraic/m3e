import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { DesignToken, prefersReducedMotion } from "@m3e/core";
import { M3eDirectionality } from "@m3e/core/bidi";

import { CalendarView } from "./CalendarView";
import { CalendarViewElementBase } from "./CalendarViewElementBase";
import { M3eMonthViewElement } from "./MonthViewElement";
import { maxYearOfPage, minYearOfPage, parseDate } from "./utils";

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
 * @attr previous-month-label - The accessible label given to the button used to move to the previous month.
 * @attr next-month-label - The accessible label given to the button used to move to the next month.
 * @attr previous-year-label - The accessible label given to the button used to move to the previous year.
 * @attr next-year-label - The accessible label given to the button used to move to the next year.
 * @attr previous-multi-year-label - The accessible label given to the button used to move to the previous 24 years.
 * @attr next-multi-year-label - The accessible label given to the button used to move to the next 24 years.
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
    svg {
      transition: transform ${DesignToken.motion.spring.fastEffects};
    }
    svg.rotate {
      transform: rotate(-180deg);
    }
    .body {
      position: relative;
      overflow: hidden;
      padding-inline: var(--m3e-calendar-padding, 0.5rem);
      padding-block-end: var(--m3e-calendar-padding, 0.5rem);
    }
    .view:not(.no-animate) {
      transition: ${unsafeCSS(
        `margin var(--m3e-calendar-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard},
        visibility var(--m3e-calendar-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    .view.before,
    .view.after {
      visibility: hidden;
      position: absolute;
    }
    .view.before {
      margin-inline-start: -100%;
    }
    .view.after {
      margin-inline-start: 100%;
    }
    .view:not(.before):not(.after) {
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
    .body.month > .row:not(.month) .view:not(.before):not(.after),
    .body.year > .row:not(.year) .view:not(.before):not(.after),
    .body.multi-year > .row:not(.multi-year) .view:not(.before):not(.after) {
      visibility: hidden;
      transition: none;
    }

    @media (prefers-reduced-motion) {
      .row:not(.multi-year),
      .row.multi-year,
      .view:not(.no-animate),
      svg {
        transition: none;
      }
    }
  `;

  /** @private */ #transitionComplete?: Promise<void>;
  /** @private */ @state() private _today = new Date();
  /** @private */ @state() private _activeView: CalendarView = "month";
  /** @private */ @state() private _activeDate: Date = new Date();
  /** @private */ @query(".active") private readonly _view?: CalendarViewElementBase;

  /**
   * The initial view used to select a date.
   * @default "month"
   */
  @property({ attribute: "start-view" }) startView: CalendarView = "month";

  /**
   * The selected date.
   * @default null
   */
  @property({ converter: { fromAttribute: parseDate } })
  date: Date | null = null;

  /**
   * A date specifying the period (month or year) to start the calendar in.
   * @default null
   */
  @property({ attribute: "start-at", converter: { fromAttribute: parseDate } })
  startAt: Date | null = null;

  /**
   * The minimum date that can be selected.
   * @default null
   */
  @property({ attribute: "min-date", converter: { fromAttribute: parseDate } })
  minDate: Date | null = null;

  /**
   * The maximum date that can be selected.
   * @default null
   */
  @property({ attribute: "max-date", converter: { fromAttribute: parseDate } })
  maxDate: Date | null = null;

  /**
   * Start of a date range.
   * @default null
   */
  @property({ attribute: "range-start", converter: { fromAttribute: parseDate } })
  rangeStart: Date | null = null;

  /**
   * End of a date range.
   * @default null
   */
  @property({ attribute: "range-end", converter: { fromAttribute: parseDate } })
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
        return new Intl.DateTimeFormat(navigator.language, { year: "numeric" }).format(
          new Date(this._activeDate.getFullYear(), 0, 1)
        );

      case "multi-year":
        return new Intl.DateTimeFormat(navigator.language, { year: "numeric" }).formatRange(
          new Date(minYearOfPage(this._activeDate, this.minDate, this.maxDate), 0, 1),
          new Date(maxYearOfPage(this._activeDate, this.minDate, this.maxDate), 0, 1)
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

      case "multi-year":
        return new Date(minYearOfPage(this._activeDate, this.minDate, this.maxDate) - 1, 12, 1) >= this.minDate;
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

      case "multi-year":
        return new Date(maxYearOfPage(this._activeDate, this.minDate, this.maxDate) + 1, 12, 1) <= this.maxDate;
    }
  }

  /**
   * Asynchronously focuses the active date.
   * @returns {Promise<void>} A promise that resolves after the active date has been focused.
   */
  async focusActiveCell(): Promise<void> {
    if (this.isUpdatePending) {
      await this.updateComplete;
    }
    await this._view?.focusActiveCell();
  }

  /** Updates today's date. */
  updateTodayDate(): void {
    this._today = new Date();
  }

  /**
   * Moves the calendar to the previous period.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async movePreviousPeriod(): Promise<void> {
    if (!this.canMovePreviousPeriod) return;
    if (prefersReducedMotion()) {
      this._activeDate = this.#getPreviousPeriod(this._activeView);
      return;
    }

    await this.#transitionComplete;

    const views = [...(this.shadowRoot?.querySelectorAll<HTMLElement>(`.row.${this._activeView} .view`) ?? [])];
    if (views.length != 3) return;

    this.#transitionComplete = new Promise<void>((resolve) => {
      views[0].addEventListener(
        "transitionend",
        () => {
          this._activeDate = this.#getPreviousPeriod(this._activeView);
          views.forEach((x) => x.classList.add("no-animate"));
          views[1].classList.remove("after");
          views[0].classList.add("before");
          setTimeout(() => {
            views.forEach((x) => x.classList.remove("no-animate"));
            resolve();
          });
        },
        { once: true }
      );
    });

    views[1].classList.add("after");
    views[0].classList.remove("before");

    await this.#transitionComplete;
  }

  /**
   * Moves the calendar to the next period.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async moveNextPeriod(): Promise<void> {
    if (!this.canMoveNextPeriod) return;
    if (prefersReducedMotion()) {
      this._activeDate = this.#getNextPeriod(this._activeView);
      return;
    }

    await this.#transitionComplete;

    const views = [...(this.shadowRoot?.querySelectorAll<HTMLElement>(`.row.${this._activeView} .view`) ?? [])];
    if (views.length != 3) return;

    this.#transitionComplete = new Promise<void>((resolve) => {
      views[2].addEventListener(
        "transitionend",
        () => {
          this._activeDate = this.#getNextPeriod(this._activeView);
          views.forEach((x) => x.classList.add("no-animate"));
          views[1].classList.remove("before");
          views[2].classList.add("after");
          setTimeout(() => {
            views.forEach((x) => x.classList.remove("no-animate"));
            resolve();
          });
        },
        { once: true }
      );
    });

    views[1].classList.add("before");
    views[2].classList.remove("after");

    await this.#transitionComplete;
  }

  /**
   * Toggles the current period.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async togglePeriod(): Promise<void> {
    await this.#transitionComplete;
    this._activeView = this._activeView === "month" ? "multi-year" : "month";
    await this.focusActiveCell();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("date")) {
      this._activeDate = new Date(this.date ?? this._today);
    }
    if (changedProperties.has("startAt")) {
      this._activeDate = new Date(this.startAt ?? this.date ?? this._today);
    }
    if (changedProperties.has("startView")) {
      this._activeView = this.startView;
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (this._view instanceof M3eMonthViewElement) {
      if (_changedProperties.has("specialDates") || _changedProperties.has("blackoutDates")) {
        this.shadowRoot?.querySelectorAll("m3e-month-view").forEach((x) => {
          x.specialDates = this.specialDates;
          x.blackoutDates = this.blackoutDates;
        });
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot name="header">${this.#renderHeader()}</slot>
      <div class="body ${this._activeView}">
        <div class="row multi-year">
          ${this.#renderView("multi-year", -1)}${this.#renderView("multi-year", 0)}${this.#renderView("multi-year", 1)}
        </div>
        <div class="row year">
          ${this.#renderView("year", -1)}${this.#renderView("year", 0)}${this.#renderView("year", 1)}
        </div>
        <div class="row month">
          ${this.#renderView("month", -1)}${this.#renderView("month", 0)}${this.#renderView("month", 1)}
        </div>
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
  #renderView(view: CalendarView, offset: -1 | 0 | 1): unknown {
    const activeDate =
      offset < 0 ? this.#getPreviousPeriod(view) : offset > 0 ? this.#getNextPeriod(view) : new Date(this._activeDate);

    switch (view) {
      case "month":
        return html`<m3e-month-view
          class="view ${classMap({
            before: offset < 0,
            after: offset > 0,
            active: view === this._activeView && offset === 0,
          })}"
          ?inert="${offset !== 0}"
          today="${this._today.toISOString()}"
          date="${ifDefined(this.date?.toISOString())}"
          active-date="${activeDate.toISOString()}"
          min-date="${ifDefined(this.minDate?.toISOString())}"
          max-date="${ifDefined(this.maxDate?.toISOString())}"
          range-start="${ifDefined(this.rangeStart?.toISOString())}"
          range-end="${ifDefined(this.rangeEnd?.toISOString())}"
          @active-change="${offset === 0 ? this.#handleActiveChange : undefined}"
          @change="${offset === 0 ? this.#handleDateChange : undefined}"
        >
        </m3e-month-view>`;

      case "year":
        return html`<m3e-year-view
          class="view ${classMap({
            before: offset < 0,
            after: offset > 0,
            active: view === this._activeView && offset === 0,
          })}"
          ?inert="${offset !== 0}"
          today="${this._today.toISOString()}"
          date="${ifDefined(this.date?.toISOString())}"
          active-date="${activeDate.toISOString()}"
          min-date="${ifDefined(this.minDate?.toISOString())}"
          max-date="${ifDefined(this.maxDate?.toISOString())}"
          @active-change="${offset === 0 ? this.#handleActiveChange : undefined}"
          @change="${offset === 0 ? this.#handleMonthChange : undefined}"
        ></m3e-year-view>`;

      case "multi-year":
        return html`<m3e-multi-year-view
          class="view ${classMap({
            before: offset < 0,
            after: offset > 0,
            active: view === this._activeView && offset === 0,
          })}"
          ?inert="${offset !== 0}"
          today="${this._today.toISOString()}"
          date="${ifDefined(this.date?.toISOString())}"
          active-date="${activeDate.toISOString()}"
          min-date="${ifDefined(this.minDate?.toISOString())}"
          max-date="${ifDefined(this.maxDate?.toISOString())}"
          @active-change="${offset === 0 ? this.#handleActiveChange : undefined}"
          @change="${offset === 0 ? this.#handleYearChange : undefined}"
        >
        </m3e-multi-year-view>`;
    }
  }

  /** @private */
  #handleDateChange(e: Event): void {
    const monthView = e.currentTarget as M3eMonthViewElement;
    this._activeDate = new Date(monthView.activeDate);
    this.rangeStart = monthView.rangeStart;
    this.rangeEnd = monthView.rangeEnd;
    this.date = new Date(this._activeDate);
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  async #handleMonthChange(e: Event): Promise<void> {
    this._activeDate = new Date((e.currentTarget as CalendarViewElementBase).activeDate);
    this._activeView = "month";
    this.focusActiveCell();
  }

  /** @private */
  #handleYearChange(e: Event): void {
    this._activeDate = new Date((e.currentTarget as CalendarViewElementBase).activeDate);
    this._activeView = "year";
    this.focusActiveCell();
  }

  /** @private */
  async #handleActiveChange(e: Event): Promise<void> {
    this._activeDate = new Date((e.currentTarget as CalendarViewElementBase).activeDate);
    await this.focusActiveCell();
  }

  /** @private */
  #getPreviousPeriod(view: CalendarView): Date {
    const activeDate = new Date(this._activeDate);
    switch (view) {
      case "month":
        activeDate.setMonth(this._activeDate.getMonth() - 1);
        while (activeDate.getMonth() === this._activeDate.getMonth()) {
          activeDate.setDate(activeDate.getDate() - 1);
        }

        break;

      case "year":
        activeDate.setFullYear(this._activeDate.getFullYear() - 1);
        break;

      case "multi-year": {
        activeDate.setDate(1);
        activeDate.setFullYear(minYearOfPage(this._activeDate, this.minDate, this.maxDate) - 1);
      }
    }
    return activeDate;
  }

  /** @private */
  #getNextPeriod(view: CalendarView): Date {
    const activeDate = new Date(this._activeDate);
    switch (view) {
      case "month":
        activeDate.setMonth(this._activeDate.getMonth() + 1);
        while (activeDate.getMonth() === this._activeDate.getMonth()) {
          activeDate.setDate(activeDate.getDate() + 1);
        }
        break;

      case "year":
        activeDate.setFullYear(this._activeDate.getFullYear() + 1);
        break;

      case "multi-year":
        activeDate.setDate(1);
        activeDate.setFullYear(maxYearOfPage(this._activeDate, this.minDate, this.maxDate) + 1);
        break;
    }
    return activeDate;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-calendar": M3eCalendarElement;
  }
}
