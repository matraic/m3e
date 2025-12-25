import { css, CSSResultGroup, LitElement } from "lit";
import { property, query } from "lit/decorators.js";

import { DesignToken, focusWhenReady } from "@m3e/core";

import { clampDate, parseDate, sameDate } from "./utils";

/**
 * A base implementation for a view in a calendar. This class must be inherited.
 * @internal
 */
export abstract class CalendarViewElementBase extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      user-select: none;
      vertical-align: top;
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
      width: calc(3rem * 7);
    }
    td,
    th {
      font: inherit;
      text-align: center;
      padding: unset;
    }
    td {
      box-sizing: border-box;
      height: 3rem;
      padding: 0.25rem;
      position: relative;
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
    td:not(:has(.item[aria-disabled])).selected {
      color: var(--m3e-calendar-item-selected-color, ${DesignToken.color.onPrimary});
      --m3e-ripple-color: var(--m3e-calendar-item-selected-ripple-color, ${DesignToken.color.onPrimary});
      --m3e-state-layer-hover-color: var(--m3e-calendar-item-selected-hover-color, ${DesignToken.color.onPrimary});
      --m3e-state-layer-focus-color: var(--m3e-calendar-item-selected-focus-color, ${DesignToken.color.onPrimary});
    }
    td:not(:has(.item[aria-disabled])).selected .state-layer {
      background-color: var(--m3e-calendar-item-selected-container-color, ${DesignToken.color.primary});
    }
    td.current:not(.selected):not(.special):not(.range-start):not(.range-end) {
      color: var(--m3e-calendar-item-current-outline-color, ${DesignToken.color.primary});
    }
    td.current:not(.selected):not(.special):not(.range-start):not(.range-end) .state-layer {
      border-style: solid;
      border-width: var(--m3e-calendar-item-current-outline-thickness, 0.0625rem);
      border-color: var(--m3e-calendar-item-current-outline-color, ${DesignToken.color.primary});
    }
    td:has(.item[aria-disabled]) {
      color: color-mix(
        in srgb,
        var(--m3e-calendar-item-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-calendar-item-disabled-color-opacity, 38%),
        transparent
      );
    }
  `;

  /** @private */ @query(".active > .item") private readonly _activeItem?: HTMLElement;

  /** Today's date. */
  @property({ converter: { fromAttribute: parseDate } }) today: Date = new Date();

  /** The selected date. */
  @property({ converter: { fromAttribute: parseDate } }) date: Date | null = null;

  /** The active date. */
  @property({ attribute: "active-date", converter: { fromAttribute: parseDate } }) activeDate: Date = new Date();

  /** The minimum date that can be selected. */
  @property({ attribute: "min-date", converter: { fromAttribute: parseDate } }) minDate: Date | null = null;

  /** The maximum date that can be selected. */
  @property({ attribute: "max-date", converter: { fromAttribute: parseDate } }) maxDate: Date | null = null;

  /**
   * Asynchronously focuses the active date.
   * @returns {Promise<void>} A promise that resolves after the active date has been focused.
   */
  async focusActiveCell(): Promise<void> {
    if (this.isUpdatePending) {
      await this.updateComplete;
    }

    if (this._activeItem) {
      await focusWhenReady(this._activeItem);
    }
  }

  /** @internal */
  protected _changeActiveDate(activeDate: Date): void {
    activeDate = clampDate(activeDate, this.minDate, this.maxDate);
    if (!sameDate(activeDate, this.activeDate)) {
      this._activeItem?.style.setProperty("--m3e-state-layer-duration", "0ms");
      this._activeItem?.blur();
      this._activeItem?.style.removeProperty("--m3e-state-layer-duration");

      this.activeDate = activeDate;
      this.dispatchEvent(new Event("active-change", { bubbles: false }));
    }
  }
}
