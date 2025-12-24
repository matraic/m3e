/**
 * Adapted from Angular Material Datepicker
 * Source: https://github.com/angular/components/blob/main/src/material/datepicker/multi-year-view.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { css, CSSResultGroup, html } from "lit";
import { customElement } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { DesignToken } from "@m3e/core";
import { M3eDirectionality } from "@m3e/core/bidi";

import { CalendarViewElementBase } from "./CalendarViewElementBase";
import { addCalendarYears, clampDate, getActiveOffset, minYearOfPage, YEARS_PER_PAGE, YEARS_PER_ROW } from "./utils";

/**
 * An internal component used to display a year selector in a calendar.
 * @internal
 */
@customElement("m3e-multi-year-view")
export class M3eMultiYearViewElement extends CalendarViewElementBase {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [
    CalendarViewElementBase.styles,
    css`
      .item {
        height: 2.25rem;
      }
      .touch {
        width: 100%;
      }
      th {
        height: 1rem;
      }
      tbody {
        font-size: var(--m3e-calendar-item-font-size, ${DesignToken.typescale.standard.body.medium.fontSize});
        font-weight: var(--m3e-calendar-item-font-weight, ${DesignToken.typescale.standard.body.medium.fontWeight});
        line-height: var(--m3e-calendar-item-line-height, ${DesignToken.typescale.standard.body.medium.lineHeight});
        letter-spacing: var(--m3e-calendar-item-tracking, ${DesignToken.typescale.standard.body.medium.tracking});
      }
    `,
  ];

  /** @inheritdoc */
  protected override render(): unknown {
    const years = new Array<number[]>();
    const minYear = minYearOfPage(this.activeDate, this.minDate, this.maxDate);
    for (let i = 0, row: number[] = []; i < YEARS_PER_PAGE; i++) {
      row.push(minYear + i);
      if (row.length === YEARS_PER_ROW) {
        years.push(row);
        row = new Array<number>();
      }
    }

    return html`<table role="grid">
      <thead aria-hidden="true">
        <tr>
          <th colspan="${YEARS_PER_ROW}"></th>
        </tr>
      </thead>
      <tbody>
        ${years.map(
          (row) =>
            html`<tr role="row">
              ${row.map((year) => this.#renderItem(year))}
            </tr>`
        )}
      </tbody>
    </table>`;
  }

  /** @private */
  #renderItem(year: number): unknown {
    const yearFormat = new Intl.DateTimeFormat(navigator.language, { year: "numeric" });
    const active = this.activeDate.getFullYear() === year;
    const selected = this.date?.getFullYear() === year;
    const current = this.today.getFullYear() === year;
    const disabled =
      (this.minDate && year < this.minDate.getFullYear()) || (this.maxDate && year > this.maxDate.getFullYear());

    const id = `year-${year}`;

    return html`<td role="gridcell" class="${classMap({ current, selected, active })}">
      <div
        id="${id}"
        class="item"
        role="button"
        tabindex="${active ? "0" : "-1"}"
        data-value="${year}"
        aria-disabled="${ifDefined(disabled || undefined)}"
        aria-current="${ifDefined(current ? "date" : undefined)}"
        aria-pressed="${selected}"
        @click="${this.#handleItemClick}"
        @keydown="${this.#handleItemKeyDown}"
      >
        <m3e-focus-ring class="focus-ring" for="${id}"></m3e-focus-ring>
        <m3e-state-layer class="state-layer" for="${id}" ?disable-hover="${disabled}"></m3e-state-layer>
        <m3e-ripple class="ripple" for="${id}" centered ?disabled="${disabled}"></m3e-ripple>
        <div class="touch"></div>
        <span>${yearFormat.format(new Date(year, 0, 1))}</span>
      </div>
    </td>`;
  }

  /** @private */
  #handleItemClick(e: Event): void {
    const item = e.currentTarget as HTMLElement;
    if (item.ariaDisabled === "true" || !item.dataset["value"]) return;

    this.activeDate = new Date(this.activeDate);
    this.activeDate.setFullYear(Number(item.dataset["value"]));
    this.activeDate = clampDate(this.activeDate, this.minDate, this.maxDate);
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
        activeDate = addCalendarYears(this.activeDate, M3eDirectionality.current === "rtl" ? 1 : -1);
        break;

      case "ArrowRight":
      case "Right":
        activeDate = addCalendarYears(this.activeDate, M3eDirectionality.current === "rtl" ? -1 : 1);
        break;

      case "ArrowUp":
      case "Up":
        activeDate = addCalendarYears(this.activeDate, -YEARS_PER_ROW);
        break;

      case "ArrowDown":
      case "Down":
        activeDate = addCalendarYears(this.activeDate, YEARS_PER_ROW);
        break;

      case "Home":
        activeDate = addCalendarYears(this.activeDate, -getActiveOffset(this.activeDate, this.minDate, this.maxDate));
        break;

      case "End":
        activeDate = addCalendarYears(
          this.activeDate,
          YEARS_PER_PAGE - getActiveOffset(this.activeDate, this.minDate, this.maxDate) - 1
        );
        break;

      case "PageUp":
        activeDate = addCalendarYears(this.activeDate, e.altKey ? -YEARS_PER_PAGE * 10 : -YEARS_PER_PAGE);
        break;

      case "PageDown":
        activeDate = addCalendarYears(this.activeDate, e.altKey ? YEARS_PER_PAGE * 10 : YEARS_PER_PAGE);
        break;

      default:
        return;
    }

    e.preventDefault();
    this._changeActiveDate(activeDate);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-multi-year-view": M3eMultiYearViewElement;
  }
}
