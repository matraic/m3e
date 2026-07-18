/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, nothing, PropertyValues } from "lit";
import { property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { customElement, DesignToken, HtmlFor } from "@m3e/web/core";

import { TimepickerOrientation } from "./TimepickerOrientation";
import { M3eTimepickerDialElement } from "./TimepickerDialElement";
import { M3eTimepickerInputPeriodToggleElement } from "./TimepickerInputPeriodToggleElement";
import { TimepickerInputElementBase } from "./TimepickerInputElementBase";
import { TimepickerView } from "./TimepickerView";

import "./TimepickerInputPeriodToggleElement";

/**
 * A keyboard‑based time surface for choosing hours and minutes.
 * @description
 * The `m3e-timepicker-input` component provides a keyboard-focused time
 * entry surface, allowing users to type or navigate hour and minute fields,
 * toggle AM/PM, and receive accessible validation feedback.
 *
 * @tag m3e-timepicker-input
 *
 * @attr format - Whether to use a 12‑hour or 24‑hour clock.
 * @attr hide-labels - Whether to hide field labels.
 * @attr hour - The hour, in 24-hour time, from 0..23.
 * @attr max-time - The maximum time that can be selected.
 * @attr min-time - The minimum time that can be selected.
 * @attr minute - The minute, from 0..59.
 * @attr second - The second, from 0..59.
 * @attr show-seconds - Whether to show seconds.
 * @attr orientation - The orientation of the input.
 * @attr period - The 12-hour time period.
 * @attr view - The view used to input time.
 * @attr hour-label - The label for the hour field.
 * @attr minute-label - The label for the minute field.
 * @attr second-label - The label for the second field.
 * @attr period-toggle-label - The accessible label given to the period toggle.
 *
 * @fires change - Dispatched when the selected time changes.
 * @fires view-change - Dispatched when the view changes.
 *
 * @cssprop --m3e-timepicker-input-field-container-width - Width of the input field container.
 * @cssprop --m3e-timepicker-input-field-height - Height of the input fields.
 * @cssprop --m3e-timepicker-input-field-container-shape - Corner radius of the input field container.
 * @cssprop --m3e-timepicker-input-field-font-size - Font size of the input field text.
 * @cssprop --m3e-timepicker-input-field-font-weight - Font weight of the input field text.
 * @cssprop --m3e-timepicker-input-field-line-height - Line height of the input field text.
 * @cssprop --m3e-timepicker-input-field-tracking - Letter spacing of the input field text.
 * @cssprop --m3e-timepicker-input-field-label-unselected-color - Text color of unselected input field labels.
 * @cssprop --m3e-timepicker-input-field-unselected-container-color - Background color of unselected input fields.
 * @cssprop --m3e-timepicker-input-field-label-selected-color - Text color of selected input field labels.
 * @cssprop --m3e-timepicker-input-field-selected-container-color - Background color of selected input fields.
 * @cssprop --m3e-timepicker-input-field-label-invalid-color - Text color of invalid input field labels.
 * @cssprop --m3e-timepicker-input-field-invalid-container-color - Background color of invalid input fields.
 * @cssprop --m3e-timepicker-input-field-supporting-text-color - Text color of supporting labels.
 * @cssprop --m3e-timepicker-input-field-supporting-text-font-size - Font size of supporting labels.
 * @cssprop --m3e-timepicker-input-field-supporting-text-font-weight - Font weight of supporting labels.
 * @cssprop --m3e-timepicker-input-field-supporting-text-line-height - Line height of supporting labels.
 * @cssprop --m3e-timepicker-input-field-supporting-text-tracking - Letter spacing of supporting labels.
 * @cssprop --m3e-timepicker-input-field-separator-width - Width of the field separator.
 * @cssprop --m3e-timepicker-input-field-separator-color - Color of the field separator.
 * @cssprop --m3e-timepicker-input-field-separator-font-size - Font size of the field separator.
 * @cssprop --m3e-timepicker-input-field-separator-font-weight - Font weight of the field separator.
 * @cssprop --m3e-timepicker-input-field-separator-tracking - Letter spacing of the field separator.
 * @cssprop --m3e-timepicker-input-horizontal-period-toggle-space - Space between the fields and period toggle in horizontal orientation.
 * @cssprop --m3e-timepicker-input-vertical-period-toggle-space - Space between the fields and period toggle in vertical orientation.
 */
@customElement("m3e-timepicker-input")
export class M3eTimepickerInputElement extends HtmlFor(TimepickerInputElementBase) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .base {
      display: flex;
      align-items: flex-start;
      height: 100%;
    }
    .field-wrapper {
      display: flex;
      flex-direction: column;
      justify-content: stretch;
      position: relative;
    }
    .field,
    .focus-ring {
      width: var(--m3e-timepicker-input-field-container-width, 6rem);
      height: var(--m3e-timepicker-input-field-height, 5rem);
      border-radius: var(--m3e-timepicker-input-field-container-shape, ${DesignToken.shape.corner.small});
    }
    .field {
      display: block;
      text-align: center;
      cursor: text;
      outline: none;
      border: unset;
      box-shadow: none;
      padding: unset;

      font-size: var(--m3e-timepicker-input-field-font-size, ${DesignToken.typescale.standard.display.medium.fontSize});
      font-weight: var(
        --m3e-timepicker-input-field-font-weight,
        ${DesignToken.typescale.standard.display.medium.fontWeight}
      );
      line-height: var(
        --m3e-timepicker-input-field-line-height,
        ${DesignToken.typescale.standard.display.medium.lineHeight}
      );
      letter-spacing: var(
        --m3e-timepicker-input-field-tracking,
        ${DesignToken.typescale.standard.display.medium.tracking}
      );
    }
    .field:not(.selected):not(.invalid) {
      color: var(--m3e-timepicker-input-field-label-unselected-color, ${DesignToken.color.onSurface});
      background-color: var(
        --m3e-timepicker-input-field-unselected-container-color,
        ${DesignToken.color.surfaceContainerHighest}
      );
    }
    .field.selected:not(.invalid) {
      color: var(--m3e-timepicker-input-field-label-selected-color, ${DesignToken.color.onPrimaryContainer});
      background-color: var(
        --m3e-timepicker-input-field-selected-container-color,
        ${DesignToken.color.primaryContainer}
      );
    }
    .field.invalid {
      color: var(--m3e-timepicker-input-field-label-invalid-color, ${DesignToken.color.onErrorContainer});
      background-color: var(--m3e-timepicker-input-field-invalid-container-color, ${DesignToken.color.errorContainer});
    }
    .field::placeholder {
      user-select: none;
      color: currentColor;
      transition: opacity ${DesignToken.motion.duration.short4};
    }
    .field:focus::placeholder {
      opacity: 0;
    }
    .label {
      user-select: none;
      margin-top: 0.25rem;
      color: var(--m3e-timepicker-input-field-supporting-text-color, ${DesignToken.color.onSurfaceVariant});
      font-size: var(
        --m3e-timepicker-input-field-supporting-text-font-size,
        ${DesignToken.typescale.standard.body.small.fontSize}
      );
      font-weight: var(
        --m3e-timepicker-input-field-supporting-text-font-weight,
        ${DesignToken.typescale.standard.body.small.fontWeight}
      );
      line-height: var(
        --m3e-timepicker-input-field-supporting-text-line-height,
        ${DesignToken.typescale.standard.body.small.lineHeight}
      );
      letter-spacing: var(
        --m3e-timepicker-input-field-supporting-text-tracking,
        ${DesignToken.typescale.standard.body.small.tracking}
      );
    }
    .field-separator {
      user-select: none;
      display: flex;
      align-items: center;
      justify-content: center;
      width: var(--m3e-timepicker-input-field-separator-width, 1.5rem);
      height: var(--m3e-timepicker-input-field-height, 5rem);
      color: var(--m3e-timepicker-input-field-separator-color, ${DesignToken.color.onSurface});
      font-size: var(
        --m3e-timepicker-input-field-separator-font-size,
        ${DesignToken.typescale.standard.display.large.fontSize}
      );
      font-weight: var(
        --m3e-timepicker-input-field-separator-font-weight,
        ${DesignToken.typescale.standard.display.large.fontWeight}
      );
      letter-spacing: var(
        --m3e-timepicker-input-field-separator-tracking,
        ${DesignToken.typescale.standard.display.large.tracking}
      );
    }
    :host([orientation="horizontal"]) .period-toggle {
      margin-inline-start: var(--m3e-timepicker-input-horizontal-period-toggle-space, 0.75rem);
    }
    :host([orientation="vertical"]) .period-toggle {
      margin-block-start: var(--m3e-timepicker-input-vertical-period-toggle-space, 1rem);
    }
  `;

  /** @private */ readonly #clockChangeHandler = () => this.#handleClockChange();
  /** @private */ readonly #clockInputHandler = () => this.#handleClockInput();
  /** @private */ readonly #clockViewChangeHandler = () => this.#handleClockViewChange();

  /**
   * The orientation of the input.
   * @default "horizontal"
   */
  @property({ reflect: true }) orientation: Exclude<TimepickerOrientation, "auto"> = "horizontal";

  /**
   * Whether to hide field labels.
   * @default false
   */
  @property({ attribute: "hide-labels", type: Boolean }) hideLabels = false;

  /**
   * The label for the hour field.
   * @default "Hour"
   */
  @property({ attribute: "hour-label" }) hourLabel = "Hour";

  /**
   * The label for the minute field.
   * @default "Minute"
   */
  @property({ attribute: "minute-label" }) minuteLabel = "Minute";

  /**
   * The label for the second field.
   * @default "Second"
   */
  @property({ attribute: "second-label" }) secondLabel = "Second";

  /**
   * The accessible label given to the period toggle.
   * @default "AM or PM"
   */
  @property({ attribute: "period-toggle-label" }) periodToggleLabel = "AM or PM";

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (this.control instanceof M3eTimepickerDialElement) {
      this.#syncControl();
      this.control.addEventListener("change", this.#clockChangeHandler);
      this.control.addEventListener("input", this.#clockInputHandler);
      this.control.addEventListener("view-change", this.#clockViewChangeHandler);
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control instanceof M3eTimepickerDialElement) {
      this.control.removeEventListener("change", this.#clockChangeHandler);
      this.control.removeEventListener("input", this.#clockInputHandler);
      this.control.removeEventListener("view-change", this.#clockViewChangeHandler);
    }
    super.detach();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (
      _changedProperties.has("hour") ||
      _changedProperties.has("minute") ||
      _changedProperties.has("second") ||
      _changedProperties.has("showSeconds") ||
      _changedProperties.has("view") ||
      _changedProperties.has("period") ||
      _changedProperties.has("format") ||
      _changedProperties.has("minTime") ||
      _changedProperties.has("maxTime") ||
      _changedProperties.has("blackoutTimes")
    ) {
      this.#syncControl();
    }
  }

  /** @private */
  #syncControl(): void {
    if (this.control instanceof M3eTimepickerDialElement) {
      this.control.view = this.view;
      this.control.format = this.currentFormat;
      this.control.hour = this.hour;
      this.control.minute = this.minute;
      this.control.second = this.second;
      this.control.showSeconds = this.showSeconds;
      this.control.minTime = this.minTime;
      this.control.maxTime = this.maxTime;
      this.control.blackoutTimes = this.blackoutTimes;
      this.control.period = this.period;
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
        ${this.#renderField("hour")}
        <div class="field-separator">:</div>
        ${this.#renderField("minute")}
        ${this.showSeconds
          ? html`<div class="field-separator">:</div>
              ${this.#renderField("second")}`
          : nothing}
        ${this.currentFormat === "12" && this.orientation === "horizontal"
          ? html`<m3e-timepicker-input-period-toggle
              class="period-toggle"
              period="${this.period}"
              orientation="vertical"
              aria-label="${this.periodToggleLabel}"
              @change="${this.#handlePeriodChange}"
            ></m3e-timepicker-input-period-toggle>`
          : nothing}
      </div>
      ${this.currentFormat === "12" && this.orientation === "vertical"
        ? html`<m3e-timepicker-input-period-toggle
            class="period-toggle"
            period="${this.period}"
            orientation="horizontal"
            @change="${this.#handlePeriodChange}"
          ></m3e-timepicker-input-period-toggle>`
        : nothing}`;
  }

  /** @private */
  #renderField(view: TimepickerView): unknown {
    const pad = (n: number | null) => (n === null ? "" : n < 10 ? "0" + n : String(n));
    const label = view === "hour" ? this.hourLabel : view === "minute" ? this.minuteLabel : this.secondLabel;
    const invalid = this.#isDisabled(this[view], view);

    let valueText: string | undefined;

    if (this[view] !== null) {
      const date = new Date();
      date.setHours(this.hour ?? 0, this.minute ?? 0, 0, 0);

      valueText = new Intl.DateTimeFormat(
        navigator.language,
        view === "hour"
          ? { hour: "numeric", hour12: this.currentFormat === "12" }
          : view === "minute"
            ? { minute: "2-digit" }
            : { second: "2-digit" },
      ).format(date);
    }

    return html`<div class="field-wrapper">
      <input
        id="${view}"
        class="${classMap({
          field: true,
          selected: this.view === view,
          invalid,
        })}"
        role="spinbutton"
        placeholder="––"
        inputmode="numeric"
        autocomplete="off"
        aria-label="${label}"
        aria-valuemin="0"
        aria-valuemax="${view === "hour" ? 23 : 59}"
        aria-valuenow="${ifDefined(valueText ? pad(this[view]) : undefined)}"
        aria-valuetext="${ifDefined(valueText)}"
        @focus="${this.#handleFieldFocus}"
        @keydown="${this.#handleFieldKeyDown}"
        @input="${this.#handleFieldInput}"
        @wheel="${this.#handleFieldWheel}"
        .value="${pad(
          view === "hour"
            ? this.currentFormat === "12"
              ? this.hourOfPeriod
              : this.hour
            : view === "minute"
              ? this.minute
              : this.second,
        )}"
      />
      <m3e-collapsible aria-hidden="true" ?open="${!this.hideLabels}">
        <span class="label">${label}</span>
      </m3e-collapsible>
      <m3e-focus-ring class="focus-ring" for="${view}"></m3e-focus-ring>
    </div>`;
  }

  /** @private */
  #handleFieldFocus(e: Event): void {
    const input = <HTMLInputElement>e.target;
    const view = <TimepickerView>input.id;
    if (this.view !== view) {
      this.view = view;
      this.dispatchEvent(new CustomEvent("view-change"));
    }
  }

  /** @private */
  #handleFieldKeyDown(e: KeyboardEvent): void {
    const input = <HTMLInputElement>e.target;
    const view = <TimepickerView>input.id;

    switch (e.key) {
      case "Up":
      case "ArrowUp":
        e.preventDefault();
        this.#increment(view, 1, true);
        this.dispatchEvent(new Event("change", { bubbles: true }));
        return;

      case "PageUp":
        e.preventDefault();
        this.#increment(view, view === "hour" ? 1 : 5);
        this.dispatchEvent(new Event("change", { bubbles: true }));
        return;

      case "Down":
      case "ArrowDown":
        e.preventDefault();
        this.#increment(view, -1, true);
        this.dispatchEvent(new Event("change", { bubbles: true }));
        return;

      case "PageDown":
        e.preventDefault();
        this.#increment(view, view === "hour" ? -1 : -5);
        this.dispatchEvent(new Event("change", { bubbles: true }));
        return;

      case "Backspace":
      case "Delete":
        e.preventDefault();
        this[view] = null;
        input.value = "";
        this.dispatchEvent(new Event("change", { bubbles: true }));
        break;

      case "Tab":
      case "ArrowLeft":
      case "Left":
      case "ArrowRight":
      case "Right":
        return;
    }

    if (e.ctrlKey || e.metaKey) {
      return;
    }

    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  }

  /** @private */
  #handleFieldWheel(e: WheelEvent): void {
    const input = <HTMLInputElement>e.target;
    const view = <TimepickerView>input.id;

    e.preventDefault();
    const delta = Math.sign(e.deltaY);

    if (delta > 0) {
      this.#increment(view, -1, true);
    } else if (delta < 0) {
      this.#increment(view, 1, true);
    }

    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #handleFieldInput(e: InputEvent): void {
    if (e.isComposing) return;

    const input = e.target as HTMLInputElement;
    const view = input.id as TimepickerView;

    const raw = input.value.replace(/\D/g, "");
    if (raw.length === 0) {
      this[view] = null;
      input.value = "";
      this.requestUpdate();
      this.dispatchEvent(new Event("change", { bubbles: true }));
      return;
    }

    const isValid = (v: number) =>
      view === "hour" ? (this.currentFormat === "12" ? v >= 1 && v <= 12 : v >= 0 && v <= 23) : v >= 0 && v <= 59;

    const cursor = input.selectionStart ?? input.value.length;
    const atEnd = cursor === input.value.length;

    // Typed digit (only valid for insertText)
    const typedDigit = typeof e.data === "string" && /^\d$/.test(e.data) ? Number(e.data) : null;

    let value: number;

    if (typedDigit !== null && !atEnd) {
      // Cursor not at end, always treat as fresh single-digit overwrite
      value = typedDigit;
    } else if (raw.length >= 2 && atEnd && raw.startsWith("0")) {
      // Natural 2-digit typing or paste
      const candidate = parseInt(raw.slice(-2));
      value = isValid(candidate) ? candidate : Number(raw.slice(-1));
    } else {
      // Single-digit typing or fallback
      value = typedDigit !== null ? typedDigit : Number(raw.slice(-1));
    }

    // 12-hour correction
    if (view === "hour" && this.currentFormat === "12" && value === 0) {
      value = 12;
    }

    input.value = value < 10 ? `0${value}` : String(value);

    try {
      input.setSelectionRange(input.value.length, input.value.length);
    } catch {
      // ignore
    }

    if (view === "hour" && this.currentFormat === "12") {
      this.hourOfPeriod = value;
    } else {
      this[view] = value;
    }

    this.requestUpdate();
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #increment(view: TimepickerView, by: number, wrap: boolean = false): void {
    const max = view === "hour" ? 24 : 60;

    const step = Math.sign(by);
    let candidate = this[view] ?? 0;
    let remaining = Math.abs(by);

    while (remaining > 0) {
      candidate += step;

      if (!wrap) {
        if (candidate < 0) {
          candidate = 0;
          break;
        }
        if (candidate >= max) {
          candidate = max - 1;
          break;
        }
      }

      candidate = ((candidate % max) + max) % max;
      remaining--;
    }

    let skipStep = step;

    if (!wrap) {
      if (candidate === 0) skipStep = +1;
      else if (candidate === max - 1) skipStep = -1;
    }

    if (this.#isDisabled(candidate, view)) {
      let attempts = 0;

      while (this.#isDisabled(candidate, view)) {
        candidate += skipStep;
        if (!wrap) {
          if (candidate < 0 || candidate >= max) return;
        }

        candidate = ((candidate % max) + max) % max;
        if (++attempts > max) return;
      }
    }

    this[view] = candidate;
  }

  /** @private */
  #handlePeriodChange(e: Event): void {
    e.stopPropagation();
    this.period = (<M3eTimepickerInputPeriodToggleElement>e.currentTarget).period;
    if (this.hour !== null) {
      const h = this.hour % 12 || 12;
      this.hour = this.period === "am" ? (h === 12 ? 0 : h) : h === 12 ? 12 : h + 12;
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /** @private */
  #handleClockInput(): void {
    if (!this.control) return;
    const dial = <M3eTimepickerDialElement>this.control;
    this.hour = dial.hour;
    this.minute = dial.minute;
    this.second = dial.second;
  }

  /** @private */
  #handleClockChange(): void {
    if (!this.control) return;
    const dial = <M3eTimepickerDialElement>this.control;
    this.hour = dial.hour;
    this.minute = dial.minute;
    this.second = dial.second;
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #handleClockViewChange(): void {
    if (!this.control) return;
    this.view = (<M3eTimepickerDialElement>this.control).view;
    this.dispatchEvent(new CustomEvent("view-change"));
  }

  /** @private */
  #isDisabled(value: number | null, view: TimepickerView): boolean {
    if (value === null) return false;
    switch (view) {
      case "hour":
        return this.isHourDisabled(value);
      case "minute":
        return this.hour !== null && this.isMinuteDisabled(this.hour, value);

      case "second":
        return this.hour != null && this.minute !== null && this.isSecondDisabled(this.hour, this.minute, value);
    }
  }
}

interface M3eTimepickerInputElementEventMap extends HTMLElementEventMap {
  "view-change": CustomEvent;
}

export interface M3eTimepickerInputElement {
  addEventListener<K extends keyof M3eTimepickerInputElementEventMap>(
    type: K,
    listener: (this: M3eTimepickerInputElement, ev: M3eTimepickerInputElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eTimepickerInputElementEventMap>(
    type: K,
    listener: (this: M3eTimepickerInputElement, ev: M3eTimepickerInputElementEventMap[K]) => void,
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
    "m3e-timepicker-input": M3eTimepickerInputElement;
  }
}
