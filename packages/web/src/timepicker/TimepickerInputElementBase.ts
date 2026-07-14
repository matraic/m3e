import { LitElement, PropertyValues } from "lit";
import { property } from "lit/decorators.js";

import { TimepickerFormat } from "./TimepickerFormat";
import { TimepickerView } from "./TimepickerView";
import { TimepickerPeriod } from "./TimepickerPeriod";
import { timeConverter, TimeParts } from "../core";

/** A base implementation for an element used to input time. This class must be inherited. */
export class TimepickerInputElementBase extends LitElement {
  /** @private */ #hour: number | null = null;
  /** @private */ #minute: number | null = null;
  /** @private */ #format: Exclude<TimepickerFormat, "auto"> = "12";

  /**
   * The hour, in 24-hour time, from 0..23.
   * @default null
   */
  @property({ type: Number }) get hour(): number | null {
    return this.#hour;
  }
  set hour(value: number | null) {
    this.#hour = value === null ? null : Math.max(0, Math.min(value, 23));
  }

  /**
   * The minute, from 0..59.
   * @default null
   */
  @property({ type: Number }) get minute(): number | null {
    return this.#minute;
  }
  set minute(value: number | null) {
    this.#minute = value === null ? null : Math.max(0, Math.min(value, 59));
  }

  /**
   * Whether to use a 12‑hour or 24‑hour clock.
   * @default "12"
   */
  @property() format: TimepickerFormat = "12";

  /**
   * The view used to input time.
   * @default "hour"
   */
  @property() view: TimepickerView = "hour";

  /**
   * The 12-hour time period.
   * @default "am"
   */
  @property() period: TimepickerPeriod = "am";

  /**
   * The minimum time that can be selected.
   * @default null
   */
  @property({ attribute: "min-time", converter: timeConverter }) minTime: TimeParts | null = null;

  /**
   * The maximum time that can be selected.
   * @default null
   */
  @property({ attribute: "max-time", converter: timeConverter }) maxTime: TimeParts | null = null;

  /** A function used to determine whether a time cannot be selected. */
  @property() blackoutTimes?: (time: TimeParts) => boolean;

  /** The hour in 12‑hour time from 1..12. */
  get hourOfPeriod(): number | null {
    if (this.hour === null) return null;
    const h = this.hour % 12;
    return h === 0 ? 12 : h;
  }
  set hourOfPeriod(value: number | null) {
    if (value === null) {
      this.hour = null;
    } else {
      const h = Math.max(1, Math.min(value, 12));
      this.hour = this.period === "am" ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
    }
  }

  /** The current time format. */
  get currentFormat(): Exclude<TimepickerFormat, "auto"> {
    return this.#format;
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("format")) {
      this.#format =
        this.format !== "auto"
          ? this.format
          : new Intl.DateTimeFormat(undefined, { hour: "numeric" }).resolvedOptions().hour12
            ? "12"
            : "24";
    }

    // If the hour changes, ensure the correct period; otherwise, if period changes, adjust hour.
    if (_changedProperties.has("hour")) {
      this.period = this.hour !== null && this.hour >= 12 ? "pm" : "am";
    } else if (_changedProperties.has("period")) {
      if (this.hour !== null) {
        const h = this.hour % 12 || 12;
        this.hour = this.period === "am" ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
      }
    }
  }

  /**
   * Determines whether the given hour is disabled.
   * @param {number} hour The hour to test.
   * @returns Whether `hour` is disabled.
   */
  isHourDisabled(hour: number): boolean {
    if ((this.minTime && hour < this.minTime.hour) || (this.maxTime && hour > this.maxTime.hour)) {
      return true;
    }
    if (this.blackoutTimes) {
      for (let minute = 0; minute < 60; minute++) {
        if (!this.blackoutTimes({ hour, minute })) {
          return false;
        }
      }
      return true;
    }
    return false;
  }

  /**
   * Determines whether the given minute of an hour is disabled.
   * @param {number} hour The hour to test.
   * @param {number} minute The minute to test.
   * @returns Whether `minute` is disabled for `hour`.
   */
  isMinuteDisabled(hour: number, minute: number): boolean {
    if (this.minTime) {
      if (hour < this.minTime.hour || (hour === this.minTime.hour && minute < this.minTime.minute)) {
        return true;
      }
    }

    if (this.maxTime) {
      if (hour > this.maxTime.hour || (hour === this.maxTime.hour && minute > this.maxTime.minute)) {
        return true;
      }
    }

    if (this.blackoutTimes?.({ hour, minute })) {
      return true;
    }

    return false;
  }
}
