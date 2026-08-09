import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  addCustomState,
  AttachInternals,
  ConstraintValidation,
  customElement,
  dateConverter,
  defaultValidationMessages,
  deleteCustomState,
  DesignToken,
  Dirty,
  Disabled,
  FormAssociated,
  formValue,
  hasCustomState,
  isDisabledMixin,
  ReadOnly,
  Required,
  Role,
  setCustomState,
  timeConverter,
  TimeParts,
  Touched,
  validate,
  ValidationMessages,
  waitForUpdate,
} from "@m3e/web/core";

import type { FormFieldControl } from "@m3e/web/form-field";

import { DateInputType } from "./DateInputType";
import { DateInputTimeFormat } from "./DateInputTimeFormat";

/** Identifies which segment of the date input is being edited. */
type DateInputFieldSegment = "month" | "day" | "year" | "hour" | "minute" | "second" | "period";

/** An input buffer for date parts. */
type DateInputBuffer<T> = {
  year?: T;
  month?: T;
  day?: T;
  hour?: T;
  minute?: T;
  second?: T;
  period?: T;
};

/**
 * A segmented input for entering date and/or time values using a keyboard.
 *
 * @description
 * The `m3e-date-input` component provides a segmented input for editing
 * date and/or time values. It supports date-only, time-only, and combined date/time entry,
 * and integrates with `m3e-form-field`, `m3e-datepicker`, and `m3e-timepicker`. Each segment
 * is independently editable for precise, accessible, form-friendly interaction.
 *
 * @example
 * The following example shows the `m3e-date-input` used with `m3e-form-field` and `m3e-datepicker`.
 * ```html
 * <m3e-form-field>
 *  <label slot="label" for="fld1">Date Field</label>
 *  <m3e-date-input id="fld1"></m3e-date-input>
 *  <m3e-icon-button slot="suffix">
 *    <m3e-icon name="calendar_today"></m3e-icon>
 *    <m3e-datepicker-toggle for="picker"></m3e-datepicker-toggle>
 *  </m3e-icon-button>
 *  <span slot="hint">MM/DD/YYYY</span>
 * </m3e-form-field>
 * <m3e-datepicker id="picker" for="fld1"></m3e-datepicker>
 * ```
 *
 * @tag m3e-date-input
 *
 * @attr value - The value of the input.
 * @attr type - The interaction mode for editing date and/or time values.
 * @attr show-seconds - Whether to show seconds.
 * @attr time-format - Format used when editing time values.
 * @attr min-date - The minimum date that can be selected.
 * @attr max-date - The maximum date that can be selected.
 * @attr min-time - The minimum time that can be selected.
 * @attr max-time - The maximum time that can be selected.
 * @attr month-label - The accessible label given to the month segment.
 * @attr day-label - The accessible label given to the day segment.
 * @attr year-label - The accessible label given to the year segment.
 * @attr hour-label - The accessible label given to the hour segment.
 * @attr minute-label - The accessible label given to the minute segment.
 * @attr second-label - The accessible label given to the second segment.
 * @attr period-label - The accessible label given to the period segment (AM/PM).
 * @attr disabled - Whether the element is disabled.
 * @attr readonly - Whether the element is read-only.
 * @attr required - Whether a value is required for the element.
 * @attr name - The name that identifies the element when submitting the associated form.
 *
 * @fires beforeinput - Dispatched before the value changes.
 * @fires input - Dispatched when the value changes.
 * @fires change - Dispatched when the value changes.
 * @fires invalid - Dispatched when a form is submitted and the element fails constraint validation.
 *
 * @cssprop --m3e-date-input-color - Color of the date input text when enabled.
 * @cssprop --m3e-date-input-disabled-color - Color of the date input text when disabled.
 * @cssprop --m3e-date-input-disabled-opacity - Opacity applied to the disabled date input text.
 * @cssprop --m3e-date-input-focused-container-color - Background color of the selected date input segment when focused.
 * @cssprop --m3e-date-input-focused-color - Text color of the selected date input segment when focused.
 */
@customElement("m3e-date-input")
export class M3eDateInputElement
  extends Dirty(
    Touched(
      Required(
        ConstraintValidation(FormAssociated(ReadOnly(Disabled(AttachInternals(Role(LitElement, "group")))))),
        false,
      ),
    ),
  )
  implements FormFieldControl
{
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      text-align: start;
    }
    .base {
      display: inline-flex;
      width: 100%;
      align-items: center;
      flex-wrap: nowrap;
      overflow: hidden;
      vertical-align: middle;
      user-select: none;
    }
    :host(:not([aria-disabled="true"])) .base {
      color: var(--m3e-date-input-color, ${DesignToken.color.onSurface});
    }
    :host([aria-disabled="true"]) .base {
      color: color-mix(
        in srgb,
        var(--m3e-date-input-disabled-color, ${DesignToken.color.onSurface}) var(--m3e-date-input-disabled-opacity, 38%),
        transparent
      );
    }
    .segment {
      flex: none;
    }
    .field {
      caret-color: transparent;
      outline: none;
    }
    .literal {
      white-space: pre;
    }
    .base,
    .segment {
      direction: ltr;
    }
    :host(:not(:is(:state(--focus), :--focus)):is(:state(--empty), :--empty)) .segment {
      opacity: 0;
    }
    :host(:not([aria-disabled="true"])) .base,
    :host(:not([aria-disabled="true"])) .segment {
      cursor: text;
    }
    :host(:not([aria-disabled="true"])) .segment {
      user-select: none;
    }
    :host([aria-disabled="true"]) .segment {
      user-select: text;
    }
    :host(:not([aria-disabled="true"])) .segment:focus,
    :host(:not([aria-disabled="true"])) .segment::selection {
      background-color: var(--m3e-date-input-focused-container-color, Highlight);
      color: var(--m3e-date-input-focused-color, HighlightText);
    }
  `;

  /** @private */ _val: Date | null = null;

  /** @private */ #format: Intl.DateTimeFormatPart[] = [];
  /** @private */ #timeFormat: Exclude<DateInputTimeFormat, "auto"> = "12";
  /** @private */ #changed = false;
  /** @private */ #ignoreValueUpdate = false;

  /** @private */ @state() private _activeField: DateInputFieldSegment = "month";
  /** @private */ @state() private _value: DateInputBuffer<number> = {};
  /** @private */ @state() private _buffer: DateInputBuffer<string> = {};

  /**
   * The value of the input.
   * @default null
   */
  @property({ converter: dateConverter }) get value(): Date | null {
    return this._val;
  }
  set value(value: Date | null) {
    if (value && Number.isNaN(value.getTime())) {
      console.error("[m3e-date-input] Invalid date assigned to value");
      return;
    }
    this._val = value;
  }

  /** The interaction mode for editing date and/or time values. */
  @property() type: DateInputType = "date";

  /**
   * Whether to show seconds.
   * @default false
   */
  @property({ attribute: "show-seconds", type: Boolean }) showSeconds = false;

  /**
   * Format used when editing time values.
   * @default "12"
   */
  @property({ attribute: "time-format" }) timeFormat: DateInputTimeFormat = "12";

  /**
   * The minimum date that can be selected.
   * @default null
   */
  @property({ attribute: "min-date", converter: dateConverter }) minDate: Date | null = null;

  /**
   * The maximum date that can be selected.
   * @default null
   */
  @property({ attribute: "max-date", converter: dateConverter }) maxDate: Date | null = null;

  /**
   * A function used to determine whether a date cannot be selected.
   * @default null
   */
  @property({ attribute: false }) blackoutDates: ((date: Date) => boolean) | null = null;

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
  @property({ attribute: false }) blackoutTimes?: (time: TimeParts) => boolean;

  /**
   * The accessible label given to the month segment.
   * @default "Month"
   */
  @property({ attribute: "month-label" }) monthLabel = "Month";

  /**
   * The accessible label given to the day segment.
   * @default "Day"
   */
  @property({ attribute: "day-label" }) dayLabel = "Day";

  /**
   * The accessible label given to the year segment.
   * @default "Year"
   */
  @property({ attribute: "year-label" }) yearLabel = "Year";

  /**
   * The accessible label given to the hour segment.
   * @default "Hour"
   */
  @property({ attribute: "hour-label" }) hourLabel = "Hour";

  /**
   * The accessible label given to the minute segment.
   * @default "Minute"
   */
  @property({ attribute: "minute-label" }) minuteLabel = "Minute";

  /**
   * The accessible label given to the second segment.
   * @default "Second"
   */
  @property({ attribute: "second-label" }) secondLabel = "Second";

  /**
   * The accessible label given to the period segment (AM/PM).
   * @default "Period"
   */
  @property({ attribute: "period-label" }) periodLabel = "Period";

  /** @inheritdoc @private */
  override get [formValue](): string | File | FormData | null {
    return !this.disabled ? (this.value?.toISOString() ?? null) : null;
  }

  /** @inheritdoc */
  get shouldLabelFloat(): boolean {
    return hasCustomState(this, "--focus") || !this._isEmpty;
  }

  /** @private */
  private get _isEmpty(): boolean {
    if (this.value) return false;

    switch (this.type) {
      case "date":
        return this._value.year === undefined && this._value.month === undefined && this._value.day === undefined;

      case "time":
        return (
          this._value.hour === undefined &&
          this._value.minute === undefined &&
          (!this.showSeconds || this._value.second === undefined) &&
          (this.#timeFormat === "24" || this._value.period === undefined)
        );

      case "datetime":
        return (
          this._value.year === undefined &&
          this._value.month === undefined &&
          this._value.day === undefined &&
          this._value.hour === undefined &&
          this._value.minute === undefined &&
          (!this.showSeconds || this._value.second === undefined) &&
          (this.#timeFormat === "24" || this._value.period === undefined)
        );
    }
  }

  /** @private */
  private get _isPartiallyEmpty(): boolean {
    if (this.type === "date") {
      const any = this._value.year !== undefined || this._value.month !== undefined || this._value.day !== undefined;
      const all = this._value.year !== undefined && this._value.month !== undefined && this._value.day !== undefined;
      return any && !all;
    }

    if (this.type === "time") {
      const any =
        this._value.hour !== undefined ||
        this._value.minute !== undefined ||
        (this.showSeconds && this._value.second !== undefined) ||
        (this.#timeFormat === "12" && this._value.period !== undefined);
      const all =
        this._value.hour !== undefined &&
        this._value.minute !== undefined &&
        (!this.showSeconds || this._value.second !== undefined) &&
        (this.#timeFormat === "24" || this._value.period !== undefined);
      return any && !all;
    }

    const any =
      this._value.year !== undefined ||
      this._value.month !== undefined ||
      this._value.day !== undefined ||
      this._value.hour !== undefined ||
      this._value.minute !== undefined ||
      (this.showSeconds && this._value.second !== undefined) ||
      (this.#timeFormat === "12" && this._value.period !== undefined);

    const all =
      this._value.year !== undefined &&
      this._value.month !== undefined &&
      this._value.day !== undefined &&
      this._value.hour !== undefined &&
      this._value.minute !== undefined &&
      (!this.showSeconds || this._value.second !== undefined) &&
      (this.#timeFormat === "24" || this._value.period !== undefined);

    return any && !all;
  }

  /** @inheritdoc */
  override get [defaultValidationMessages](): Readonly<ValidationMessages> {
    switch (this.type) {
      case "date":
        return {
          ...super[defaultValidationMessages],
          typeMismatch: "Enter a valid date.",
          rangeUnderflow: "Date is too early.",
          rangeOverflow: "Date is too late.",
          customError: "Date is within a disabled range.",
        };

      case "time":
        return {
          ...super[defaultValidationMessages],
          typeMismatch: "Enter a valid time.",
          rangeUnderflow: "Time is too early.",
          rangeOverflow: "Time is too late.",
          customError: "Time is within a disabled range.",
        };

      case "datetime":
        return {
          ...super[defaultValidationMessages],
          typeMismatch: "Enter a valid date and time.",
          rangeUnderflow: "Date and time are too early.",
          rangeOverflow: "Date and time are too late.",
          customError: "Date and time are within a disabled range.",
        };
    }
  }

  /** @internal */
  override [validate](): ValidityStateFlags | undefined {
    const validity = super[validate]();
    if (!validity && this._value && this.touched && !this.readOnly) {
      // Value is missing when required and empty
      if (this.required && this._isEmpty) {
        return { valueMissing: true };
      }

      // Type mismatch if partially populated
      if (this._isPartiallyEmpty) {
        return { typeMismatch: true };
      }

      if (this.value) {
        const validateDate = (date: Date): ValidityStateFlags | undefined => {
          if (this.minDate && date < this.minDate) return { rangeUnderflow: true };
          if (this.maxDate && date > this.maxDate) return { rangeOverflow: true };
          if (this.blackoutDates?.(date)) return { customError: true };
          return undefined;
        };

        const validateTime = (date: Date): ValidityStateFlags | undefined => {
          const parts = { hour: date.getHours(), minute: date.getMinutes(), second: date.getSeconds() };
          const mins = parts.hour * 60 + parts.minute + (parts.second ? parts.second / 60 : 0);

          if (this.minTime) {
            const min =
              this.minTime.hour * 60 + this.minTime.minute + (this.minTime.second ? this.minTime.second / 60 : 0);
            if (mins < min) return { rangeUnderflow: true };
          }

          if (this.maxTime) {
            const max =
              this.maxTime.hour * 60 + this.maxTime.minute + (this.maxTime.second ? this.maxTime.second / 60 : 0);
            if (mins > max) return { rangeOverflow: true };
          }

          if (this.blackoutTimes?.(parts)) return { customError: true };
          return undefined;
        };

        switch (this.type) {
          case "date":
            return validateDate(this.value);
          case "time":
            return validateTime(this.value);
          case "datetime":
            return validateDate(this.value) ?? validateTime(this.value);
        }
      }
    }
    return validity;
  }

  /** @inheritdoc */
  override focus(options?: FocusOptions): void {
    this.shadowRoot?.querySelector<HTMLSpanElement>("[tabindex='0']")?.focus(options);
  }

  /** @inheritdoc */
  override blur(): void {
    this.shadowRoot?.querySelector<HTMLSpanElement>("[tabindex='0']")?.blur();
  }

  /** @inheritdoc */
  protected override willUpdate(_changedProperties: PropertyValues<this>): void {
    super.willUpdate(_changedProperties);

    if (_changedProperties.has("timeFormat")) {
      this.#timeFormat =
        this.timeFormat !== "auto"
          ? this.timeFormat
          : new Intl.DateTimeFormat(navigator.language, { hour: "numeric" }).resolvedOptions().hour12
            ? "12"
            : "24";
    }

    if (_changedProperties.has("type")) {
      switch (this.type) {
        case "date":
          this.#format = new Intl.DateTimeFormat(navigator.language, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }).formatToParts();
          break;

        case "time":
          this.#format = new Intl.DateTimeFormat(navigator.language, {
            hour: "numeric",
            minute: "numeric",
            hour12: this.#timeFormat === "12",
            ...(this.showSeconds ? { second: "numeric" } : {}),
          }).formatToParts();
          break;

        case "datetime":
          this.#format = new Intl.DateTimeFormat(navigator.language, {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: this.#timeFormat === "12",
            ...(this.showSeconds ? { second: "numeric" } : {}),
          }).formatToParts();
          break;
      }

      this._activeField = <DateInputFieldSegment>(
        this.#format.filter((x) => ["month", "day", "year", "hour", "minute", "second"].includes(x.type))[0].type
      );
    }

    if (_changedProperties.has("value")) {
      if (!this.#ignoreValueUpdate) {
        this.#updateValueBuffer();
      }
    }

    if (_changedProperties.has("value") || _changedProperties.has(<keyof M3eDateInputElement>"_value")) {
      setCustomState(this, "--empty", this._isEmpty);
    }

    if (this.id && (_changedProperties.has("disabled") || _changedProperties.has("readOnly"))) {
      // When disabled or readonly and attached to a picker, automatically disable the picker's toggle button.
      const root = this.getRootNode() as ParentNode;
      if (root) {
        // There could be a datepicker and timepicker associated with the input.
        const datepicker = root.querySelector(`m3e-datepicker[for="${this.id}"]`);
        if (datepicker?.id) {
          const toggle = root.querySelector(`m3e-datepicker-toggle[for="${datepicker.id}"]`);
          if (toggle && isDisabledMixin(toggle.parentElement)) {
            toggle.parentElement.disabled = this.disabled || this.readOnly;
          }
        }

        const timepicker = root.querySelector(`m3e-timepicker[for="${this.id}"]`);
        if (timepicker?.id) {
          const toggle = root.querySelector(`m3e-timepicker-toggle[for="${timepicker.id}"]`);
          if (toggle && isDisabledMixin(toggle.parentElement)) {
            toggle.parentElement.disabled = this.disabled || this.readOnly;
          }
        }
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    // Intl is used to determine the order to present segments.
    return html` <div
      class="base"
      tabindex="-1"
      @pointerdown=${this.#handlePointerDown}
      @focusout=${this.#handleFocusOut}
    >
      ${this.#format.map((part) => {
        switch (part.type) {
          case "month": {
            // Use the long month name for ARIA value text.
            const valueText =
              this._value.month !== undefined
                ? new Intl.DateTimeFormat(navigator.language, { month: "long" }).format(
                    new Date(2000, this._value.month - 1, 1),
                  )
                : undefined;
            return this.#renderField(
              part.type,
              this._buffer.month ?? this._value.month,
              2,
              "mm",
              1,
              12,
              this.monthLabel,
              valueText,
            );
          }

          case "day": {
            // To get max day: if year is undefined, use 2000; if month is undefined, use January
            const max = new Date(this._value.year ?? 2000, this._value.month ?? 1, 0).getDate();
            return this.#renderField(part.type, this._buffer.day ?? this._value.day, 2, "dd", 1, max, this.dayLabel);
          }

          case "year":
            return this.#renderField(
              part.type,
              this._buffer.year ?? this._value.year,
              4,
              "yyyy",
              1,
              9999,
              this.yearLabel,
            );

          case "hour": {
            const numeric = this._buffer.hour ?? this._value.hour;

            let displayValue = numeric;
            if (this.#timeFormat === "12" && numeric !== undefined) {
              displayValue = Number(numeric) % 12 || 12;
            }

            return this.#renderField(
              "hour",
              this._buffer.hour ?? this._value.hour,
              2,
              "––",
              0,
              23,
              this.hourLabel,
              displayValue ? String(displayValue) : undefined,
              displayValue ? String(displayValue)?.padStart(2, "0") : undefined,
            );
          }

          case "minute":
            return this.#renderField(
              "minute",
              this._buffer.minute ?? this._value.minute,
              2,
              "––",
              0,
              59,
              this.minuteLabel,
            );

          case "second":
            return this.#renderField(
              "second",
              this._buffer.second ?? this._value.second,
              2,
              "––",
              0,
              59,
              this.secondLabel,
            );

          // Treat AM/PM as a spinbutton with numeric values 0/1.
          case "dayPeriod": {
            const raw = this._buffer.period ?? this._value.period;
            const numeric = typeof raw === "string" ? Number(raw) : raw;

            // Locale-specific AM/PM text
            const valueText =
              new Intl.DateTimeFormat(navigator.language, { hour: "numeric", hour12: true })
                .formatToParts(new Date(2000, 0, 1, numeric === 1 ? 13 : 1))
                .find((x) => x.type === "dayPeriod")?.value ?? (numeric === 1 ? "PM" : "AM");

            const displayValue = numeric !== undefined ? valueText : undefined;

            return this.#renderField("period", numeric, 2, "––", 0, 1, this.periodLabel, valueText, displayValue);
          }

          case "literal":
            return html`<span class="segment literal" aria-hidden="true" @pointerdown=${this.#handleLiteralPointerDown}
              >${part.value}</span
            >`;

          default:
            return nothing;
        }
      })}
    </div>`;
  }

  /** @private */
  #renderField(
    id: DateInputFieldSegment,
    value: number | string | undefined,
    maxLength: number,
    placeholder: string,
    minValue: number,
    maxValue: number,
    label: string,
    valueText?: string,
    displayValue?: string,
  ): unknown {
    if (!valueText && value !== undefined) {
      valueText = String(value).padStart(maxLength, "0");
    }
    return html`<span
      id="${id}"
      class="segment field"
      role="spinbutton"
      aria-label="${label}"
      aria-valuemin="${minValue}"
      aria-valuemax="${maxValue}"
      aria-valuenow="${ifDefined(value)}"
      aria-valuetext="${ifDefined(valueText)}"
      aria-disabled="${this.disabled}"
      aria-readonly="${this.readOnly}"
      contenteditable="${ifDefined(this.disabled ? undefined : true)}"
      spellcheck="false"
      autocapitalize="none"
      autocorrect="off"
      inputmode="${ifDefined(id !== "period" ? "numeric" : undefined)}"
      tabindex="${ifDefined(this.disabled ? undefined : id === this._activeField ? 0 : -1)}"
      @focus=${this.#handleFieldFocus}
      @keydown=${this.#handleFieldKeyDown}
      @wheel=${this.#handleFieldWheel}
      @pointerdown=${this.#handleFieldPointerDown}
      @drop=${this.#handleFieldPreventDefault}
      @paste=${this.#handleFieldPreventDefault}
      @beforeinput=${this.#handleFieldPreventDefaultReadonly}
      @input=${this.#handleFieldPreventDefaultReadonly}
      >${displayValue ?? (value !== undefined ? String(value).padStart(maxLength, "0") : placeholder)}</span
    >`;
  }

  /** @private */
  #handlePointerDown(e: PointerEvent): void {
    if (this.disabled) return;
    if (!e.defaultPrevented) {
      e.preventDefault();
      queueMicrotask(() => this.focus());
    }
  }

  /** @private */
  #handleFocusOut(e: FocusEvent): void {
    if (
      e.relatedTarget instanceof HTMLSpanElement &&
      e.relatedTarget.classList.contains("field") &&
      this.shadowRoot?.contains(e.relatedTarget)
    ) {
      this.#commitBuffer(this._activeField, true);
      return;
    }

    // Commit active buffer.
    this.#commitBuffer(this._activeField, false);

    // Always clear buffer and deselect all when leaving input
    this._buffer = {};
    this.#deselectAll();

    // Reset the active field to the first field segment when leaving input.
    this._activeField = <DateInputFieldSegment>(
      this.#format.filter((x) => ["month", "day", "year", "hour", "minute", "second"].includes(x.type))[0].type
    );

    deleteCustomState(this, "--focus");

    if (this.#changed) {
      this.#changed = false;
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /** @private */
  #commitBuffer(id: DateInputFieldSegment, emitEvent: boolean): void {
    // Commit segment if buffer exists
    if (this._buffer[id] !== undefined) {
      const old = this._value[id];
      const next = Number(this._buffer[id]); // works for period too ("0"/"1")

      if (next !== old) {
        this._value = { ...this._value, [id]: next };
      }
    }

    // Clear only this segment's buffer
    this._buffer = { ...this._buffer, [id]: undefined };

    const { month, day, year, hour, minute, second, period } = this._value;

    let newDate: Date | null = null;

    switch (this.type) {
      case "date": {
        if (year !== undefined && month !== undefined && day !== undefined) {
          // Use existing time if set; otherwise, these default to 0 (midnight).
          newDate = new Date(
            year,
            month - 1,
            this.#clampDay(day, month, year),
            this.#adjustHourForPeriod(hour, period) ?? 0,
            minute ?? 0,
            second ?? 0,
          );
        }
        break;
      }

      case "time": {
        if (
          hour !== undefined &&
          minute !== undefined &&
          period !== undefined &&
          (!this.showSeconds || second !== undefined) &&
          (this.#timeFormat === "24" || this._value.period !== undefined)
        ) {
          // Use existing date if set; otherwise, use current date.
          const current =
            year !== undefined && month !== undefined && day !== undefined ? { month, day, year } : this.#getCurrent();

          newDate = new Date(
            current.year,
            current.month - 1,
            current.day,
            this.#adjustHourForPeriod(hour, period),
            minute,
            second ?? 0,
          );
        }
        break;
      }

      case "datetime": {
        if (
          year !== undefined &&
          month !== undefined &&
          day !== undefined &&
          hour !== undefined &&
          minute !== undefined &&
          (!this.showSeconds || second !== undefined) &&
          (this.#timeFormat === "24" || this._value.period !== undefined)
        ) {
          newDate = new Date(
            year,
            month - 1,
            this.#clampDay(day, month, year),
            this.#adjustHourForPeriod(hour, period),
            minute,
            second ?? 0,
          );
        }
        break;
      }
    }

    // If neither date nor time was complete, nothing to update
    if (!newDate) return;

    // Emit change only if the date actually changed
    const oldValue = this.value;
    if (!oldValue || oldValue.getTime() !== newDate.getTime()) {
      this.value = newDate;

      if (emitEvent) {
        if (this.dispatchEvent(new Event("beforeinput", { bubbles: true, cancelable: true }))) {
          this.#changed = true;
          this.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          this.value = oldValue;
          this.#updateValueBuffer();
        }
        this.dispatchEvent(new Event("input", { bubbles: true }));
      } else {
        this.#changed = true;
      }
    }
  }

  /** @private */
  #handleFieldFocus(e: FocusEvent): void {
    const field = <HTMLSpanElement>e.target;
    this._activeField = <DateInputFieldSegment>field.id;
    this.#selectAll(field);
    addCustomState(this, "--focus");
  }

  /** @private */
  #handleFieldKeyDown(e: KeyboardEvent): void {
    const field = <HTMLSpanElement>e.target;
    const id = <DateInputFieldSegment>field.id;

    switch (e.key) {
      case "Backspace":
      case "Delete":
        e.preventDefault();
        if (!this.readOnly) {
          if (this._value[id] !== undefined) {
            this._value = { ...this._value };
            this._value[id] = undefined;
            this._buffer = { ...this._buffer };
            this._buffer[id] = undefined;
            this.#updateValue();
          } else {
            const fields = [...(this.shadowRoot?.querySelectorAll<HTMLSpanElement>(".field") ?? [])];
            const index = fields.indexOf(field);
            fields[index - 1]?.focus();
          }
        }
        break;

      case "ArrowLeft":
      case "Left":
        {
          e.preventDefault();
          const fields = [...(this.shadowRoot?.querySelectorAll<HTMLSpanElement>(".field") ?? [])];
          const index = fields.indexOf(field);
          fields[index - 1]?.focus();
        }
        break;

      case "ArrowRight":
      case "Right":
        {
          e.preventDefault();
          const fields = [...(this.shadowRoot?.querySelectorAll<HTMLSpanElement>(".field") ?? [])];
          const index = fields.indexOf(field);
          fields[index + 1]?.focus();
        }
        break;

      case "ArrowUp":
      case "Up":
        e.preventDefault();
        if (!this.readOnly) {
          this.#commitBuffer(id, false);

          const now = Number(field.ariaValueNow);
          const min = Number(field.ariaValueMin);
          const max = Number(field.ariaValueMax);

          this._value = { ...this._value };
          this._value[id] = !field.ariaValueNow ? this.#getCurrent()[id] : now >= max ? min : now + 1;

          // Special handling for period (AM/PM)
          if (id === "hour") {
            this.#updatePeriodFromHour();
          } else if (id === "period") {
            this.#updateHourFromPeriod();
          }

          this.#updateValue();
        }
        break;

      case "ArrowDown":
      case "Down":
        e.preventDefault();
        if (!this.readOnly) {
          this.#commitBuffer(id, false);

          const now = Number(field.ariaValueNow);
          const min = Number(field.ariaValueMin);
          const max = Number(field.ariaValueMax);

          this._value = { ...this._value };
          this._value[id] = !field.ariaValueNow ? this.#getCurrent()[id] : now <= min ? max : now - 1;

          // Special handling for period (AM/PM)
          if (id === "hour") {
            this.#updatePeriodFromHour();
          } else if (id === "period") {
            this.#updateHourFromPeriod();
          }

          this.#updateValue();
        }
        break;

      case "Home":
        e.preventDefault();
        if (!this.readOnly) {
          this.#commitBuffer(id, false);
          this._value = { ...this._value };
          this._value[id] = Number(field.ariaValueMin);

          // Special handling for period (AM/PM)
          if (id === "hour") {
            this.#updatePeriodFromHour();
          } else if (id === "period") {
            this.#updateHourFromPeriod();
          }

          this.#updateValue();
        }

        break;

      case "End":
        e.preventDefault();
        if (!this.readOnly) {
          this.#commitBuffer(id, false);
          this._value = { ...this._value };
          this._value[id] = Number(field.ariaValueMax);

          // Special handling for period (AM/PM)
          if (id === "hour") {
            this.#updatePeriodFromHour();
          } else if (id === "period") {
            this.#updateHourFromPeriod();
          }

          this.#updateValue();
        }

        break;

      case "PageUp":
        e.preventDefault();
        if (!this.readOnly) {
          this.#commitBuffer(id, false);

          const now = Number(field.ariaValueNow);
          const min = Number(field.ariaValueMin);
          const max = Number(field.ariaValueMax);

          this._value = { ...this._value };
          if (!field.ariaValueNow) {
            this._value[id] = this.#getCurrent()[id];
          } else {
            const next = now + 5;
            this._value[id] = next > max ? min + ((next - min) % (max - min + 1)) : next;
          }

          // Special handling for period (AM/PM)
          if (id === "hour") {
            this.#updatePeriodFromHour();
          } else if (id === "period") {
            this.#updateHourFromPeriod();
          }

          this.#updateValue();
        }
        break;

      case "PageDown":
        e.preventDefault();
        if (!this.readOnly) {
          this.#commitBuffer(id, false);

          const now = Number(field.ariaValueNow);
          const min = Number(field.ariaValueMin);
          const max = Number(field.ariaValueMax);

          this._value = { ...this._value };
          if (!field.ariaValueNow) {
            this._value[id] = this.#getCurrent()[id];
          } else {
            const next = now - 5;
            this._value[id] = next < min ? max - ((min - next) % (max - min + 1)) : next;
          }

          // Special handling for period (AM/PM)
          if (id === "hour") {
            this.#updatePeriodFromHour();
          } else if (id === "period") {
            this.#updateHourFromPeriod();
          }

          this.#updateValue();
        }
        break;

      case "Tab":
        break;

      default: {
        if (this.readOnly) {
          e.preventDefault();
          return;
        }

        // Special handling for period (AM/PM)
        if (id === "period") {
          if (e.key.toLowerCase() === "a") {
            this._buffer = { ...this._buffer };
            this._buffer.period = "0";
          } else if (e.key.toLowerCase() === "p") {
            this._buffer = { ...this._buffer };
            this._buffer.period = "1";
          }

          e.preventDefault();
          break;
        }

        // Block ctrl/meta combos and non‑digits
        if (this.readOnly || e.ctrlKey || e.metaKey || !/^\d$/.test(e.key)) {
          e.preventDefault();
          break;
        }

        const prev = this._buffer[id] ?? "";
        let min = Number(field.ariaValueMin);
        let max = Number(field.ariaValueMax);

        // Special handling for 12-hour clock typing.
        if (id === "hour" && this.#timeFormat === "12") {
          min = 1;
          max = 12;
        }

        // Build candidate buffer
        let next = prev + e.key;
        let num = Number(next);

        // If candidate exceeds max, try overwrite with single digit
        if (num > max) {
          const single = Number(e.key);
          if (single < min || single > max) {
            // Digit alone is invalid, reject
            e.preventDefault();
            break;
          }

          next = e.key;
          num = single;
        }

        if (num < min || num > max) {
          e.preventDefault();
          break;
        }

        this._buffer = { ...this._buffer };
        this._buffer[id] = next;

        // Auto‑advance if no more digits possible
        if (num * 10 > max) {
          const fields = [...(this.shadowRoot?.querySelectorAll<HTMLSpanElement>(".field") ?? [])];
          const index = fields.indexOf(field);
          fields[index + 1]?.focus();
        }

        e.preventDefault();
        break;
      }
    }
  }

  /** @private */
  #handleFieldWheel(e: WheelEvent): void {
    const field = <HTMLSpanElement>e.target;
    const id = <DateInputFieldSegment>field.id;

    e.preventDefault();

    if (!this.readOnly) {
      this.#commitBuffer(id, false);

      const now = Number(field.ariaValueNow);
      const min = Number(field.ariaValueMin);
      const max = Number(field.ariaValueMax);
      const delta = Math.sign(e.deltaY);

      this._value = { ...this._value };

      if (delta > 0) {
        this._value[id] = !field.ariaValueNow ? this.#getCurrent()[id] : now <= min ? max : now - 1;
      } else if (delta < 0) {
        this._value[id] = !field.ariaValueNow ? this.#getCurrent()[id] : now >= max ? min : now + 1;
      }

      // Special handling for period (AM/PM)
      if (id === "hour") {
        this.#updatePeriodFromHour();
      } else if (id === "period") {
        this.#updateHourFromPeriod();
      }

      this.#updateValue();
    }
  }

  /** @private */
  #handleFieldPointerDown(e: PointerEvent): void {
    if (this.disabled) return;
    e.preventDefault();
    const field = <HTMLSpanElement>e.target;
    queueMicrotask(() => field.focus());
  }

  /** @private */
  #handleFieldPreventDefault(e: Event): void {
    e.preventDefault();
  }

  /** @private */
  #handleFieldPreventDefaultReadonly(e: Event): void {
    if (this.readOnly) {
      e.preventDefault();
    }
  }

  /** @private */
  #handleLiteralPointerDown(e: PointerEvent): void {
    if (this.disabled) return;
    e.preventDefault();

    // Focus previous or next field
    let element: Element | null = <Element>e.target;
    while (element) {
      if (element.classList.contains("field")) {
        (<HTMLElement>element).focus();
        return;
      }
      element = element.previousElementSibling;
    }

    element = <Element>e.target;
    while (element) {
      if (element.classList.contains("field")) {
        (<HTMLElement>element).focus();
        return;
      }
      element = element.nextElementSibling;
    }
  }

  /** @private */
  #getCurrent(): {
    month: number;
    day: number;
    year: number;
    hour: number;
    minute: number;
    second: number;
    period: number;
  } {
    const current = new Date();

    return {
      month: current.getMonth() + 1,
      day: current.getDate(),
      year: current.getFullYear(),
      hour: current.getHours(),
      minute: current.getMinutes(),
      second: current.getSeconds(),
      period: current.getHours() >= 12 ? 1 : 0,
    };
  }

  /** @private */
  #updatePeriodFromHour(): void {
    if (this.#timeFormat === "12" && this._value.hour !== undefined && this._value.period !== undefined) {
      if (this._value.hour === 0) this._value.period = 0;
      else if (this._value.hour === 12) this._value.period = 1;
      else this._value.period = this._value.hour >= 12 ? 1 : 0;
    }
  }

  /** @private */
  #updateHourFromPeriod() {
    if (this._value.hour === undefined || this._value.period === undefined) return;
    const hour12 = this._value.hour % 12 || 12;
    let newHour = hour12;
    if (this._value.period === 1) newHour += 12;
    if (this._value.period === 0 && hour12 === 12) newHour = 0;
    this._value.hour = newHour;
  }

  /** @private */
  async #updateValue(): Promise<void> {
    this.#ignoreValueUpdate = true;
    try {
      const oldValue = this.value;
      let base = oldValue ?? new Date();

      switch (this.type) {
        case "date":
          {
            const { year, month, day } = this._value;
            if (year === undefined || month === undefined || day === undefined) {
              this.value = null;
              if (year === undefined && month === undefined && day === undefined) {
                // Reset time to midnight when clearing date.
                this._value = { ...this._value, hour: 0, minute: 0, second: 0, period: 0 };
              }
            } else {
              if (!oldValue) {
                // Use midnight when creating a new date.
                base = new Date(base.getFullYear(), base.getMonth(), base.getDate());
              }

              const clampedDay = this.#clampDay(day, month, year);
              this._value = { ...this._value, day: clampedDay };
              this.value = new Date(year, month - 1, clampedDay, base.getHours(), base.getMinutes(), base.getSeconds());
            }
          }
          break;

        case "time":
          {
            const { hour, minute, second, period } = this._value;
            if (
              hour === undefined ||
              minute === undefined ||
              second === undefined ||
              (this.#timeFormat === "12" && period === undefined)
            ) {
              this.value = null;
              if (hour === undefined && minute === undefined && (!this.showSeconds || second === undefined)) {
                // Reset date to current date when clearing time.
                const { month, day, year } = this.#getCurrent();
                this._value = { ...this._value, month, day, year };
              }
            } else {
              this.value = new Date(
                base.getFullYear(),
                base.getMonth(),
                base.getDate(),
                this.#adjustHourForPeriod(hour, period),
                minute,
                second,
              );
            }
          }
          break;

        case "datetime":
          {
            const { year, month, day, hour, minute, second, period } = this._value;

            if (
              year === undefined ||
              month === undefined ||
              day === undefined ||
              hour === undefined ||
              minute === undefined ||
              second === undefined ||
              (this.#timeFormat === "12" && period === undefined)
            ) {
              this.value = null;
            } else {
              const clampedDay = this.#clampDay(day, month, year);
              this._value = { ...this._value, day: clampedDay };
              this.value = new Date(
                year,
                month - 1,
                clampedDay,
                this.#adjustHourForPeriod(hour, period),
                minute,
                second,
              );
            }
          }
          break;
      }

      if (oldValue?.getTime() !== this.value?.getTime()) {
        if (this.dispatchEvent(new Event("beforeinput", { bubbles: true, cancelable: true }))) {
          this.#changed = true;
          this.dispatchEvent(new Event("input", { bubbles: true }));
        } else {
          this.value = oldValue;
          this.#updateValueBuffer();
        }
      }
      await waitForUpdate(this);
    } finally {
      this.#ignoreValueUpdate = false;
    }
  }

  /** @private */
  #updateValueBuffer(): void {
    this._value = this.value
      ? {
          year: this.value.getFullYear(),
          month: this.value.getMonth() + 1,
          day: this.value.getDate(),
          hour: this.value.getHours(),
          minute: this.value.getMinutes(),
          second: this.value.getSeconds(),
          period: this.value.getHours() >= 12 ? 1 : 0,
        }
      : {};
  }

  /** @private */
  #adjustHourForPeriod(hour: number | undefined, period: number | undefined): number | undefined {
    if (hour !== undefined) {
      if (period === 1 && hour < 12) hour += 12;
      if (period === 0 && hour === 12) hour = 0;
    }
    return hour;
  }

  /** @private */
  #clampDay(day: number, month: number, year: number): number {
    return Math.min(day, new Date(year, month, 0).getDate());
  }

  /** @private */
  #selectAll(field: HTMLSpanElement): void {
    const range = document.createRange();
    range.selectNodeContents(field);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }

  /** @private */
  #deselectAll(): void {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || !this.shadowRoot) return;
    const range = selection.getRangeAt(0);
    if (this.shadowRoot.contains(range.startContainer) || this.shadowRoot.contains(range.endContainer)) {
      selection.removeAllRanges();
    }
  }
}
