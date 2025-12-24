/**
 * Adapted from Angular Material Datepicker
 * Source: https://github.com/angular/components/blob/main/src/material/datepicker/month-view.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { css, CSSResultGroup, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { DesignToken } from "@m3e/core";
import { M3eDirectionality } from "@m3e/core/bidi";

import { CalendarViewElementBase } from "./CalendarViewElementBase";
import {
  addCalendarDays,
  addCalendarMonths,
  addCalendarYears,
  clampDate,
  compareDate,
  getNumDaysInMonth,
  parseDate,
  sameDate,
} from "./utils";

/**
 * An internal component used to display a single month in a calendar.
 * @internal
 */
@customElement("m3e-month-view")
export class M3eMonthViewElement extends CalendarViewElementBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    CalendarViewElementBase.styles,
    css`
      thead {
        font-size: var(--m3e-calendar-weekday-font-size, ${DesignToken.typescale.standard.title.small.fontSize});
        font-weight: var(--m3e-calendar-weekday-font-weight, ${DesignToken.typescale.standard.title.small.fontWeight});
        line-height: var(--m3e-calendar-weekday-line-height, ${DesignToken.typescale.standard.title.small.lineHeight});
        letter-spacing: var(--m3e-calendar-weekday-tracking, ${DesignToken.typescale.standard.title.small.tracking});
      }
      th {
        height: 1.5rem;
        padding-block-start: 1.875rem;
        padding-block-end: 1rem;
      }
      tbody {
        font-size: var(--m3e-calendar-date-font-size, ${DesignToken.typescale.standard.body.medium.fontSize});
        font-weight: var(--m3e-calendar-date-font-weight, ${DesignToken.typescale.standard.body.medium.fontWeight});
        line-height: var(--m3e-calendar-date-line-height, ${DesignToken.typescale.standard.body.medium.lineHeight});
        letter-spacing: var(--m3e-calendar-date-tracking, ${DesignToken.typescale.standard.body.medium.tracking});
      }
      td:not(:has(.item[aria-disabled])).range-start,
      td:not(:has(.item[aria-disabled])).range-end {
        color: var(--m3e-calendar-item-selected-color, ${DesignToken.color.onPrimary});
        --m3e-ripple-color: var(--m3e-calendar-item-selected-ripple-color, ${DesignToken.color.onPrimary});
      }
      td:not(:has(.item[aria-disabled])).range-start .state-layer,
      td:not(:has(.item[aria-disabled])).range-end .state-layer {
        background-color: var(--m3e-calendar-item-selected-container-color, ${DesignToken.color.primary});
      }
      td:not(:has(.item[aria-disabled])).range::before,
      td:not(:has(.item[aria-disabled])).range-start-range::before,
      td:not(:has(.item[aria-disabled])).range-end::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0.25rem;
        bottom: 0.25rem;
        background-color: var(--m3e-calendar-range-container-color, ${DesignToken.color.primaryContainer});
      }
      td:not(:has(.item[aria-disabled])):not(.selected).range {
        color: var(--m3e-calendar-range-color, ${DesignToken.color.onPrimaryContainer});
      }
      td:not(:has(.item[aria-disabled])).range-start::before {
        inset-inline-start: 50%;
        width: 50%;
      }
      td:not(:has(.item[aria-disabled])).range-end::before {
        inset-inline-end: 50%;
        width: 50%;
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
    `,
  ];

  /** Start of a date range. */
  @property({ attribute: "range-start", converter: { fromAttribute: parseDate } }) rangeStart: Date | null = null;

  /** End of a date range. */
  @property({ attribute: "range-end", converter: { fromAttribute: parseDate } }) rangeEnd: Date | null = null;

  /** A function used to determine whether a date cannot be selected. */
  @property({ attribute: false }) blackoutDates: ((date: Date) => boolean) | null = null;

  /** A function used to determine whether a date is special. */
  @property({ attribute: false }) specialDates: ((date: Date) => boolean) | null = null;

  /** @inheritdoc */
  protected override render(): unknown {
    const date = new Date(this.today);
    date.setDate(1);

    while (date.getDay() != 0) {
      date.setDate(date.getDate() + 1);
    }

    const weekdays = new Array<{ long: string; narrow: string; id: number }>();
    const narrowFormat = new Intl.DateTimeFormat(navigator.language, { weekday: "narrow" });
    const longFormat = new Intl.DateTimeFormat(navigator.language, { weekday: "long" });

    for (let i = 0; i < 7; i++) {
      weekdays.push({ id: i, narrow: narrowFormat.format(date), long: longFormat.format(date) });
      date.setDate(date.getDate() + 1);
    }

    const year = this.activeDate.getFullYear();
    const month = this.activeDate.getMonth();
    const firstDate = new Date(year, month, 1);
    const lastDate = new Date(year, month + 1, 0);
    const numDays = lastDate.getDate();

    let weeks: number[][] = [];
    let dayOfWeek = firstDate.getDay();

    for (let i = 1; i <= numDays; i++) {
      if (dayOfWeek === 0 || weeks.length === 0) {
        weeks.push([]);
      }
      weeks[weeks.length - 1].push(i);
      dayOfWeek = (dayOfWeek + 1) % 7;
    }

    weeks = weeks.filter((x) => !!x.length);

    return html`<table role="grid">
      <thead>
        <tr>
          ${weekdays.map(
            (x) =>
              html`<th scope="col" id="weekday-${x.id}-month-${month}">
                <span class="visually-hidden">${x.long}</span>
                <span aria-hidden="true">${x.narrow}</span>
                <m3e-tooltip for="weekday-${x.id}-month-${month}">${x.long}</m3e-tooltip>
              </th>`
          )}
        </tr>
      </thead>
      <tbody>
        ${weeks.map(
          (row, i) =>
            html`<tr role="row">
              ${i === 0 && row.length < 7 ? html`<td colspan="${7 - row.length}"></td>` : nothing}
              ${row.map((y) => this.#renderItem(new Date(year, month, y)))}
              ${i > 0 && row.length < 7 ? html`<td colspan="${7 - row.length}"></td>` : nothing}
            </tr>`
        )}
      </tbody>
    </table>`;
  }

  /** @private */
  #renderItem(value: Date): unknown {
    const long = new Intl.DateTimeFormat(navigator.language, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(value);

    const special = this.specialDates?.(value) ?? false;
    const selected = sameDate(this.date, value);
    const active = sameDate(this.activeDate, value);
    const current = sameDate(this.today, value);
    const disabled =
      (this.minDate && compareDate(value, this.minDate) < 0) ||
      (this.maxDate && compareDate(value, this.maxDate) > 0) ||
      this.blackoutDates?.(value) === true;

    const id = `date-${value.getMonth()}-${value.getDate()}-${value.getFullYear()}`;

    let range = false,
      rangeStart = false,
      rangeEnd = false,
      rangeStartRange = false;

    if (this.rangeStart) {
      if (!this.rangeEnd) {
        rangeStart = sameDate(value, this.rangeStart);
      } else {
        range = compareDate(value, this.rangeStart) > 0 && compareDate(value, this.rangeEnd) < 0;
        if (!range) {
          rangeStart = compareDate(value, this.rangeStart) >= 0 && compareDate(value, this.rangeEnd) < 0;
          if (!rangeStart) {
            rangeEnd = compareDate(value, this.rangeStart) > 0 && compareDate(value, this.rangeEnd) <= 0;
          } else {
            rangeStartRange = true;
          }
        }
      }
    }

    return html`<td
      role="gridcell"
      class="${classMap({
        current,
        selected,
        active,
        special,
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
        tabindex="${active ? "0" : "-1"}"
        aria-disabled="${ifDefined(disabled || undefined)}"
        aria-current="${ifDefined(current ? "date" : undefined)}"
        aria-pressed="${selected || rangeStart || rangeEnd}"
        @click="${this.#handleItemClick}"
        @mouseenter="${this.#handleDateRangeHighlight}"
        @focus="${this.#handleDateRangeHighlight}"
        @mouseleave="${this.#clearRangeHighlight}"
        @blur="${this.#clearRangeHighlight}"
        @keydown="${this.#handleItemKeyDown}"
      >
        <m3e-focus-ring class="focus-ring" for="${id}"></m3e-focus-ring>
        <m3e-state-layer class="state-layer" for="${id}" ?disable-hover="${disabled}"></m3e-state-layer>
        <m3e-ripple class="ripple" centered for="${id}" ?disabled="${disabled}"></m3e-ripple>
        <div class="touch"></div>
        <span class="visually-hidden">${long}</span>
        <span aria-hidden="true">${value.getDate()}</span>
      </div>
    </td>`;
  }

  /** @private */
  #handleItemClick(e: Event): void {
    const item = e.currentTarget as HTMLElement;
    if (item.ariaDisabled === "true" || !item.dataset["value"]) return;

    this.activeDate = new Date(item.dataset["value"]);
    this.activeDate = clampDate(this.activeDate, this.minDate, this.maxDate);

    if (this.rangeStart) {
      if (compareDate(this.activeDate, this.rangeStart) < 0) {
        this.rangeStart = this.activeDate;
        this.rangeEnd = null;
      } else {
        this.rangeEnd = this.activeDate;
      }
      this.#clearRangeHighlight();
    }

    this.dispatchEvent(new Event("change", { bubbles: false }));
  }

  /** @private */
  #handleItemKeyDown(e: KeyboardEvent): void {
    let activeDate = this.activeDate;

    switch (e.key) {
      case " ":
      case "Enter":
        e.preventDefault();
        (e.currentTarget as HTMLElement).click();
        return;

      case "ArrowLeft":
      case "Left":
        activeDate = addCalendarDays(this.activeDate, M3eDirectionality.current === "rtl" ? 1 : -1);
        break;

      case "ArrowRight":
      case "Right":
        activeDate = addCalendarDays(this.activeDate, M3eDirectionality.current === "rtl" ? -1 : 1);
        break;

      case "ArrowUp":
      case "Up":
        activeDate = addCalendarDays(this.activeDate, -7);
        break;

      case "ArrowDown":
      case "Down":
        activeDate = addCalendarDays(this.activeDate, 7);
        break;

      case "Home":
        activeDate = addCalendarDays(this.activeDate, 1 - this.activeDate.getDate());
        break;

      case "End":
        activeDate = addCalendarDays(this.activeDate, getNumDaysInMonth(this.activeDate) - this.activeDate.getDate());
        break;

      case "PageUp":
        activeDate = e.altKey ? addCalendarYears(this.activeDate, -1) : addCalendarMonths(this.activeDate, -1);
        break;

      case "PageDown":
        activeDate = e.altKey ? addCalendarYears(this.activeDate, 1) : addCalendarMonths(this.activeDate, 1);
        break;

      default:
        return;
    }

    e.preventDefault();
    this._changeActiveDate(activeDate);
  }

  /** @private */
  #handleDateRangeHighlight(e: Event): void {
    this.#setRangeHighlight(e.currentTarget as HTMLElement);
  }

  /** @private */
  #setRangeHighlight(item: HTMLElement): void {
    this.#clearRangeHighlight();

    if (this.rangeStart && item.dataset["value"]) {
      if (compareDate(new Date(item.dataset["value"]), this.rangeStart) > 0) {
        item.parentElement!.classList.add("range-highlight-end");
      }
      for (const cell of item.closest("table")?.querySelectorAll<HTMLElement>(".item") ?? []) {
        if (cell === item) break;

        const value = new Date(cell.dataset["value"]!);
        if (compareDate(value, this.rangeStart) > 0) {
          cell.parentElement!.classList.add("range-highlight");
        } else if (compareDate(value, this.rangeStart) >= 0) {
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
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-month-view": M3eMonthViewElement;
  }
}
