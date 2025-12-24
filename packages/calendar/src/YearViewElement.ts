/**
 * Adapted from Angular Material Datepicker
 * Source: https://github.com/angular/components/blob/main/src/material/datepicker/year-view.ts
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
import { addCalendarMonths, addCalendarYears, clampDate, MONTHS_PER_ROW } from "./utils";

/**
 * An internal component used to display a single year in a calendar.
 * @internal
 */
@customElement("m3e-year-view")
export class M3eYearViewElement extends CalendarViewElementBase {
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
    const months = new Array<Array<{ date: Date; long: string; narrow: string }>>();
    const shortFormat = new Intl.DateTimeFormat(navigator.language, { month: "short" });
    const longFormat = new Intl.DateTimeFormat(navigator.language, { month: "long" });
    const year = this.activeDate.getFullYear();

    for (let month = 0, row = new Array<{ date: Date; long: string; narrow: string }>(); month < 12; month++) {
      const date = new Date(year, month, 1);
      row.push({ narrow: shortFormat.format(date), long: longFormat.format(date), date: date });

      if (row.length == MONTHS_PER_ROW) {
        months.push(row);
        row = [];
      }
    }

    return html`<table role="grid">
      <thead aria-hidden="true">
        <tr>
          <th colspan="${MONTHS_PER_ROW}"></th>
        </tr>
      </thead>
      <tbody>
        ${months.map(
          (row) =>
            html`<tr role="row">
              ${row.map((month) => this.#renderItem(month))}
            </tr>`
        )}
      </tbody>
    </table>`;
  }

  /** @private */
  #renderItem(month: { date: Date; long: string; narrow: string }): unknown {
    const active =
      this.activeDate.getFullYear() === month.date.getFullYear() &&
      this.activeDate.getMonth() === month.date.getMonth();

    const selected =
      this.date?.getFullYear() === month.date.getFullYear() && this.date?.getMonth() === month.date.getMonth();

    const current =
      this.today.getFullYear() === month.date.getFullYear() && this.today.getMonth() === month.date.getMonth();

    const disabled =
      (this.minDate &&
        (month.date.getFullYear() < this.minDate.getFullYear() ||
          (month.date.getFullYear() === this.minDate.getFullYear() &&
            month.date.getMonth() < this.minDate.getMonth()))) ||
      (this.maxDate &&
        (month.date.getFullYear() > this.maxDate.getFullYear() ||
          (month.date.getFullYear() === this.maxDate.getFullYear() &&
            month.date.getMonth() > this.maxDate.getMonth())));

    const id = `month-${month.date.getMonth()}`;

    return html`<td role="gridcell" class="${classMap({ current, selected, active })}">
      <div
        id="${id}"
        class="item"
        role="button"
        tabindex="${active ? "0" : "-1"}"
        data-value="${month.date.toISOString()}"
        aria-disabled="${ifDefined(disabled || undefined)}"
        aria-current="${ifDefined(current ? "date" : undefined)}"
        aria-pressed="${selected}"
        @click="${this.#handleItemClick}"
        @keydown="${this.#handleItemKeyDown}"
      >
        <m3e-focus-ring class="focus-ring" for="${id}"></m3e-focus-ring>
        <m3e-state-layer class="state-layer" for="${id}" ?disable-hover="${disabled}"></m3e-state-layer>
        <m3e-ripple class="ripple" centered for="${id}" ?disabled="${disabled}"></m3e-ripple>
        <div class="touch"></div>
        <span class="visually-hidden">${month.long}</span>
        <span aria-hidden="true">${month.narrow}</span>
      </div>
    </td>`;
  }

  /** @private */
  #handleItemClick(e: Event): void {
    const item = e.currentTarget as HTMLElement;
    if (item.ariaDisabled === "true" || !item.dataset["value"]) return;

    this.activeDate = clampDate(new Date(item.dataset["value"]), this.minDate, this.maxDate);
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
        activeDate = addCalendarMonths(this.activeDate, M3eDirectionality.current === "rtl" ? 1 : -1);
        break;

      case "ArrowRight":
      case "Right":
        activeDate = addCalendarMonths(this.activeDate, M3eDirectionality.current === "rtl" ? -1 : 1);
        break;

      case "ArrowUp":
      case "Up":
        activeDate = addCalendarMonths(this.activeDate, -4);
        break;

      case "ArrowDown":
      case "Down":
        activeDate = addCalendarMonths(this.activeDate, 4);
        break;

      case "Home":
        activeDate = addCalendarMonths(this.activeDate, -this.activeDate.getMonth());
        break;

      case "End":
        activeDate = addCalendarMonths(this.activeDate, 11 - this.activeDate.getMonth());
        break;

      case "PageUp":
        activeDate = addCalendarYears(this.activeDate, e.altKey ? -10 : -1);
        break;

      case "PageDown":
        activeDate = addCalendarYears(this.activeDate, e.altKey ? 10 : 1);
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
    "m3e-year-view": M3eYearViewElement;
  }
}
