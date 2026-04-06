/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  addCustomState,
  customElement,
  AttachInternals,
  dateConverter,
  deleteCustomState,
  DesignToken,
  Role,
  ScrollLockController,
  setCustomState,
  SuppressInitialAnimation,
  InertController,
} from "@m3e/web/core";

import { positionAnchor } from "@m3e/web/core/anchoring";
import { M3eDirectionality } from "@m3e/web/core/bidi";
import { Breakpoint, M3eBreakpointObserver } from "@m3e/web/core/layout";
import { M3eCalendarElement, CalendarView } from "@m3e/web/calendar";

import "@m3e/web/core/a11y";
import "@m3e/web/button";
import "@m3e/web/calendar";

import { DatepickerVariant } from "./DatepickerVariant";

/**
 * Presents a date picker on a temporary surface.
 *
 * @description
 * The `m3e-datepicker` component provides a date‑selection experience
 * consistent with Material 3 guidance for layout, motion, and accessibility.
 * It displays a temporary surface that allows users to select a date or date
 * range using calendar-based views. The picker supports month, year, and
 * multi‑year views, enabling users to navigate across time efficiently.
 *
 * While open, the picker uses a focused selection flow. Users review their
 * choice and complete the interaction through confirm, dismiss, or clear
 * actions, ensuring intentional updates to the field or control that invoked it.
 *
 * It accepts and emits plain `Date` values, allowing applications to apply their
 * own formatting, parsing, and localization.
 *
 * @tag m3e-datepicker
 *
 * @attr variant - The appearance variant of the picker.
 * @attr clearable - Whether the user can clear the selected date and close the picker.
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
 * @attr clear-label - The label given to the button used clear the selected date and close the picker.
 * @attr confirm-label - The label given to the button used apply the selected date and close the picker.
 * @attr dismiss-label - The label given to the button used discard the selected date and close the picker.
 * @attr label - The label given to the the picker.
 *
 * @fires change - Dispatched when the selected date changes.
 * @fires beforetoggle - Dispatched before the toggle state changes.
 * @fires toggle - Dispatched after the toggle state has changed.
 *
 * @cssprop --m3e-datepicker-container-padding-block - Block‑axis padding of the date picker container.
 * @cssprop --m3e-datepicker-container-padding-inline - Inline‑axis padding of the date picker container.
 * @cssprop --m3e-datepicker-container-color - Background color of the standard container surface.
 * @cssprop --m3e-datepicker-container-elevation - Elevation shadow applied to the container surface.
 * @cssprop --m3e-datepicker-modal-headline-font-size - Font size used for the modal headline text.
 * @cssprop --m3e-datepicker-modal-headline-font-weight - Font weight used for the modal headline text.
 * @cssprop --m3e-datepicker-modal-headline-line-height - Line height used for the modal headline text.
 * @cssprop --m3e-datepicker-modal-headline-tracking - Letter spacing used for the modal headline text.
 * @cssprop --m3e-datepicker-modal-supporting-text-font-size - Font size used for supporting text in modal mode.
 * @cssprop --m3e-datepicker-modal-supporting-text-font-weight - Font weight used for supporting text in modal mode.
 * @cssprop --m3e-datepicker-modal-supporting-text-line-height - Line height used for supporting text in modal mode.
 * @cssprop --m3e-datepicker-modal-supporting-text-tracking - Letter spacing used for supporting text in modal mode.
 * @cssprop --m3e-datepicker-actions-padding-inline - Inline‑axis padding of the action row.
 * @cssprop --m3e-datepicker-docked-container-color - Background color of the container in docked mode.
 * @cssprop --m3e-datepicker-docked-container-shape - Corner radius of the container in docked mode.
 * @cssprop --m3e-datepicker-modal-container-color - Background color of the container in modal mode.
 * @cssprop --m3e-datepicker-modal-container-shape - Corner radius of the container in modal mode.
 * @cssprop --m3e-divider-thickness - Thickness of divider elements within the picker.
 * @cssprop --m3e-divider-color - Color of divider rules within the picker.
 * @cssprop --m3e-dialog-scrim-color - Base color used for the modal scrim behind the picker.
 * @cssprop --m3e-dialog-scrim-opacity - Opacity applied to the scrim color in modal mode.
 */
@customElement("m3e-datepicker")
export class M3eDatepickerElement extends SuppressInitialAnimation(AttachInternals(Role(LitElement, "dialog"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      flex-direction: column;
      margin: unset;
      border: unset;
      padding-block: var(--m3e-datepicker-container-padding-block, 0.75rem);
      padding-inline: var(--m3e-datepicker-container-padding-inline, 0.25rem);
      background-color: var(--m3e-datepicker-container-color, ${DesignToken.color.surfaceContainer});
      box-shadow: var(--m3e-datepicker-container-elevation, ${DesignToken.elevation.level3});
      opacity: 0;
      display: none;
    }
    .calendar {
      --m3e-calendar-container-color: transparent;
      --m3e-calendar-container-elevation: ${DesignToken.elevation.level0};
      --m3e-calendar-container-shape: ${DesignToken.shape.corner.none};
    }
    .headline {
      font-size: var(
        --m3e-datepicker-modal-headline-font-size,
        ${DesignToken.typescale.standard.headline.large.fontSize}
      );
      font-weight: var(
        --m3e-datepicker-modal-headline-font-weight,
        ${DesignToken.typescale.standard.headline.large.fontWeight}
      );
      line-height: var(
        --m3e-datepicker-modal-headline-line-height,
        ${DesignToken.typescale.standard.headline.large.lineHeight}
      );
      letter-spacing: var(
        --m3e-datepicker-modal-headline-tracking,
        ${DesignToken.typescale.standard.headline.large.tracking}
      );
      margin-block-start: 2.25rem;
      margin-block-end: 0.75rem;
      margin-inline: 1.5rem;
    }
    .supporting-text {
      font-size: var(
        --m3e-datepicker-modal-supporting-text-font-size,
        ${DesignToken.typescale.standard.label.large.fontSize}
      );
      font-weight: var(
        --m3e-datepicker-modal-supporting-text-font-weight,
        ${DesignToken.typescale.standard.label.large.fontWeight}
      );
      line-height: var(
        --m3e-datepicker-modal-supporting-text-line-height,
        ${DesignToken.typescale.standard.label.large.lineHeight}
      );
      letter-spacing: var(
        --m3e-datepicker-modal-supporting-text-tracking,
        ${DesignToken.typescale.standard.label.large.tracking}
      );
      margin-block-start: 1rem;
      margin-inline: 1.5rem;
    }
    .divider {
      height: var(--m3e-divider-thickness, 1px);
      width: 100%;
      position: relative;
    }
    .divider::before {
      content: "";
      box-sizing: border-box;
      position: absolute;
      border-bottom: var(--m3e-divider-thickness, 1px) solid
        var(--m3e-divider-color, ${DesignToken.color.outlineVariant});
      height: inherit;
      left: -0.25rem;
      right: -0.25rem;
    }
    .actions {
      display: flex;
      align-items: center;
      column-gap: 0.5rem;
      padding-inline: var(--m3e-datepicker-actions-padding-inline, 0.5rem);
    }
    .spacer {
      flex: 1 1 auto;
    }
    :host(:state(-docked)) {
      position: absolute;
      background-color: var(--m3e-datepicker-docked-container-color, ${DesignToken.color.surfaceContainer});
      border-radius: var(--m3e-datepicker-docked-container-shape, ${DesignToken.shape.corner.large});
    }
    :host(:state(-modal)) {
      position: fixed;
      inset: 0;
      margin: auto;
      transform-origin: top;
      background-color: var(--m3e-datepicker-modal-container-color, ${DesignToken.color.surfaceContainerHigh});
      border-radius: var(--m3e-datepicker-modal-container-shape, ${DesignToken.shape.corner.extraLarge});
    }
    :host(:not(:state(-no-animate))) {
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard}, 
        transform ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard},
        overlay ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete,
        display ${DesignToken.motion.duration.short2} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host {
      transform: scaleY(0.8);
    }
    :host(:popover-open) {
      transform: scaleY(1);
      display: inline-flex;
      opacity: 1;
    }
    :host(:state(-docked))::backdrop {
      background-color: transparent;
    }
    :host(:state(-modal))::backdrop {
      background-color: color-mix(in srgb, var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) 0%, transparent);
      margin-inline-end: -20px;
    }
    :host(:state(-modal):not(:popover-open))::backdrop {
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host(:state(-modal):popover-open)::backdrop {
      background-color: color-mix(
        in srgb,
        var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) var(--m3e-dialog-scrim-opacity, 32%),
        transparent
      );
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.long2} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host(:state(-bottom)) {
      transform-origin: top;
    }
    :host(:state(-top)) {
      transform-origin: bottom;
    }
    @starting-style {
      :host(:popover-open) {
        transform: scaleY(0.8);
      }
      :host(:state(-modal):popover-open)::backdrop {
        background-color: color-mix(in srgb, var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) 0%, transparent);
      }
    }
    @media (prefers-reduced-motion) {
      :host(:not(:state(-no-animate))) {
        transition: none;
      }
    }
    @media (forced-colors: active) {
      :host {
        background-color: Menu;
        color: MenuText;
        border: 1px solid CanvasText;
      }
    }
  `;

  /** @private */ @state() private _date?: Date | null;
  /** @private */ @state() private _rangeStart?: Date | null;
  /** @private */ @state() private _rangeEnd?: Date | null;

  /** @private */ @query("m3e-calendar") private readonly _calendar!: M3eCalendarElement;
  /** @private */ @state() private _variant?: Exclude<DatepickerVariant, "auto">;
  /** @private */ #breakpointUnobserve?: () => void;

  /** @private */ #trigger?: HTMLElement;
  /** @private */ #anchor?: HTMLElement;
  /** @private */ #anchorCleanup?: () => void;

  /** @private */ readonly #scrollLockController = new ScrollLockController(this);
  /** @private */ readonly #inertController = new InertController(this);
  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);
  /** @private */ readonly #documentKeyDownHandler = (e: KeyboardEvent) => this.#handleDocumentKeyDown(e);

  /** @private */
  readonly #toggleHandler = (e: ToggleEvent) => {
    if (e.newState === "closed") {
      this.#clearSelectionState();
      this.#anchorCleanup?.();
      this.#anchorCleanup = undefined;
    }
  };

  /**
   * The appearance variant of the picker.
   * @default "docked"
   */
  @property() variant: DatepickerVariant = "docked";

  /**
   * The initial view used to select a date.
   * @default "month"
   */
  @property({ attribute: "start-view" }) startView: CalendarView = "month";

  /**
   * The selected date.
   * @default null
   */
  @property({ converter: dateConverter }) date: Date | null = null;

  /**
   * A date specifying the period (month or year) to start the calendar in.
   * @default null
   */
  @property({ attribute: "start-at", converter: dateConverter }) startAt: Date | null = null;

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
   * Start of a date range.
   * @default null
   */
  @property({ attribute: "range-start", converter: dateConverter }) rangeStart: Date | null = null;

  /**
   * End of a date range.
   * @default null
   */
  @property({ attribute: "range-end", converter: dateConverter }) rangeEnd: Date | null = null;

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

  /**
   * Whether the user can clear the selected date and close the picker.
   * @default false
   */
  @property({ type: Boolean }) clearable = false;

  /**
   * The label given to the button used clear the selected date and close the picker.
   * @default "Clear"
   */
  @property({ attribute: "clear-label" }) clearLabel = "Clear";

  /**
   * The label given to the button used apply the selected date and close the picker.
   * @default "OK"
   */
  @property({ attribute: "confirm-label" }) confirmLabel = "OK";

  /**
   * The label given to the button used discard the selected date and close the picker.
   * @default "Cancel"
   */
  @property({ attribute: "dismiss-label" }) dismissLabel = "Cancel";

  /**
   * The label given to the the picker.
   * @default "Select date"
   */
  @property() label = "Select date";

  /** Whether the picker is open. */
  get isOpen() {
    return this.#trigger !== undefined;
  }

  /** The current variant applied to the picker. */
  get currentVariant(): Exclude<DatepickerVariant, "auto"> {
    return this._variant ?? (this.variant !== "modal" ? "docked" : "modal");
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("popover", "manual");
    this.addEventListener("toggle", this.#toggleHandler);
    document.addEventListener("click", this.#documentClickHandler);
    document.addEventListener("keydown", this.#documentKeyDownHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this._variant = undefined;
    this.#breakpointUnobserve?.();

    deleteCustomState(this, "-docked");
    deleteCustomState(this, "-modal");

    this.removeEventListener("toggle", this.#toggleHandler);
    document.removeEventListener("click", this.#documentClickHandler);
    document.removeEventListener("keydown", this.#documentKeyDownHandler);
  }

  /**
   * Opens the picker.
   * @param {HTMLElement} trigger The element that triggered the picker.
   * @param {HTMLElement | undefined} anchor The element used to position the picker.
   * @returns {Promise<void>} A `Promise` that resolves when the picker is opened.
   */
  async show(trigger: HTMLElement, anchor?: HTMLElement): Promise<void> {
    if (this.#trigger && this.#trigger !== trigger) {
      this.hide();
    }

    if (this.currentVariant === "modal") {
      this.#scrollLockController.lock();
      this.#inertController.lock();
    }

    this._calendar.date = this.date;
    this._calendar.rangeStart = this.rangeStart;
    this._calendar.rangeEnd = this.rangeEnd;

    this.#trigger = trigger;
    this.#trigger.ariaExpanded = "true";
    this.#anchor = anchor;

    await this.#updatePosition();
    this.showPopover();

    await this._calendar.focusActiveCell();
  }

  /**
   * Hides the picker.
   * @param {boolean} [restoreFocus=false] Whether to restore focus to the picker's trigger.
   */
  hide(restoreFocus: boolean = false): void {
    if (this.currentVariant === "modal") {
      this.#scrollLockController.unlock();
      this.#inertController.unlock();
    }

    this.hidePopover();

    if (this.#trigger) {
      this.#trigger.ariaExpanded = "false";
      if (restoreFocus) {
        this.#trigger.focus();
      }
      this.#trigger = undefined;
    }
  }

  /**
   * Toggles the picker.
   * @param {HTMLElement} trigger The element that triggered the picker.
   * @param {HTMLElement | undefined} anchor The element used to position the picker.
   * @returns {Promise<void>} A `Promise` that resolves when the picker is opened or closed.
   */
  async toggle(trigger: HTMLElement, anchor?: HTMLElement): Promise<void> {
    if (this.#trigger) {
      this.hide();
    } else {
      await this.show(trigger, anchor);
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-focus-trap>
      ${this.#renderHeader()}
      <m3e-calendar
        class="calendar"
        start-view="${this.startView}"
        start-at="${ifDefined(this.startAt?.toISOString())}"
        min-date="${ifDefined(this.minDate?.toISOString())}"
        max-date="${ifDefined(this.maxDate?.toISOString())}"
        @change="${this.#handleCalendarChange}"
      ></m3e-calendar>
      <div class="actions">
        ${this.clearable
          ? html`<m3e-button @click="${this.#handleClearClick}">${this.clearLabel}</m3e-button>`
          : nothing}
        <div class="spacer" aria-hidden="true"></div>
        <m3e-button @click="${this.#handleDismissClick}">${this.dismissLabel}</m3e-button>
        <m3e-button @click="${this.#handleConfirmClick}">${this.confirmLabel}</m3e-button>
      </div>
    </m3e-focus-trap>`;
  }

  /** @inheritdoc */
  #renderHeader(): unknown {
    if (this.currentVariant === "docked") return nothing;

    const selectedDate = this._date ?? this.date;

    return html`<div class="supporting-text">${this.label}</div>
      <div class="headline">
        ${selectedDate
          ? new Intl.DateTimeFormat(navigator.language, {
              weekday: "short",
              month: "short",
              day: "numeric",
            }).format(selectedDate)
          : "––"}
      </div>
      <div class="divider"></div>`;
  }

  /** @inheritdoc */
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (["date", "rangeStart", "rangeEnd"].some((x) => changedProperties.has(<keyof M3eDatepickerElement>x))) {
      this.#clearSelectionState();
    }

    if (changedProperties.has("variant")) {
      this.#breakpointUnobserve?.();

      if (this.variant === "auto") {
        this.#breakpointUnobserve = M3eBreakpointObserver.observe([Breakpoint.XSmall, Breakpoint.Small], (matches) => {
          this._variant = matches.get(Breakpoint.XSmall) || matches.get(Breakpoint.Small) ? "modal" : "docked";
          this.#updateVariant();
        });
      } else {
        this._variant = undefined;
        this.#updateVariant();
      }
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("specialDates") || _changedProperties.has("blackoutDates")) {
      this._calendar.specialDates = this.specialDates;
      this._calendar.blackoutDates = this.blackoutDates;
    }
  }

  /** @private */
  #handleDocumentClick(e: MouseEvent): void {
    if (!e.composedPath().some((x) => x instanceof M3eDatepickerElement || x === this.#trigger || x === this.#anchor)) {
      this.hide();
    }
  }

  /** @private */
  #handleCalendarChange(): void {
    this._date = this._calendar.date;
    this._rangeStart = this._calendar.rangeStart;
    this._rangeEnd = this._calendar.rangeEnd;
  }

  /** @private */
  #handleClearClick(): void {
    this.date = null;
    this.rangeStart = null;
    this.rangeEnd = null;

    this.hide(true);
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #handleDismissClick(): void {
    this.hide(true);
  }

  /** @private */
  #handleConfirmClick(): void {
    this.date = this._date ?? this.date;
    this.rangeStart = this._rangeStart ?? this.rangeStart;
    this.rangeEnd = this._rangeEnd ?? this.rangeEnd;
    this.hide(true);
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @private */
  #handleDocumentKeyDown(e: KeyboardEvent): void {
    if (this.isOpen && this.currentVariant === "modal" && e.key === "Escape" && !e.shiftKey && !e.ctrlKey) {
      e.preventDefault();
      this.hide(true);
    }
  }

  /** @private */
  #updateVariant(): void {
    switch (this.currentVariant) {
      case "docked":
        this.ariaModal = null;
        deleteCustomState(this, "-modal");
        addCustomState(this, "-docked");
        this.#scrollLockController.unlock();
        this.#inertController.unlock();
        break;

      case "modal":
        this.ariaModal = "true";
        deleteCustomState(this, "-docked");
        addCustomState(this, "-modal");
        if (this.isOpen) {
          this.#scrollLockController.lock();
          this.#inertController.lock();
        }

        break;
    }

    if (this.isOpen) {
      this.#updatePosition();
    }
  }

  /** @private */
  async #updatePosition(): Promise<void> {
    if (this.currentVariant === "docked" && this.#trigger) {
      this.#anchorCleanup = await positionAnchor(
        this,
        this.#anchor ?? this.#trigger,
        {
          position: "bottom-start",
          inline: true,
          flip: true,
        },
        (x, y, position) => {
          setCustomState(this, "-top", position.includes("top"));
          setCustomState(this, "-bottom", position.includes("bottom"));

          if (M3eDirectionality.current === "rtl") {
            this.style.right = `${window.innerWidth - x - this.clientWidth}px`;
            this.style.left = "";
          } else {
            this.style.left = `${x}px`;
            this.style.right = "";
          }

          this.style.top = `${y}px`;
        },
      );
    } else {
      this.#anchorCleanup?.();
      this.#anchorCleanup = undefined;
      this.style.left = "";
      this.style.right = "";
      this.style.top = "";
    }
  }

  /** @private */
  #clearSelectionState(): void {
    this._date = this._rangeStart = this._rangeEnd = undefined;
  }
}

interface M3eDatepickerElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eDatepickerElement {
  addEventListener<K extends keyof M3eDatepickerElementEventMap>(
    type: K,
    listener: (this: M3eDatepickerElement, ev: M3eDatepickerElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eDatepickerElementEventMap>(
    type: K,
    listener: (this: M3eDatepickerElement, ev: M3eDatepickerElementEventMap[K]) => void,
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
    "m3e-datepicker": M3eDatepickerElement;
  }
}
