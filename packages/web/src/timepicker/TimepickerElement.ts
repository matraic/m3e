/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, svg, unsafeCSS } from "lit";
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
  ReconnectedCallback,
  prefersReducedMotion,
  timeConverter,
  TimeParts,
} from "@m3e/web/core";

import { positionAnchor } from "@m3e/web/core/anchoring";
import { Direction, M3eDirectionality } from "@m3e/web/core/bidi";
import { Breakpoint, M3eBreakpointObserver } from "@m3e/web/core/layout";

import "@m3e/web/core/a11y";
import "@m3e/web/button";
import "@m3e/web/icon-button";

import { M3eTimepickerInputElement } from "./TimepickerInputElement";
import { TimepickerVariant } from "./TimepickerVariant";
import { TimepickerMode } from "./TimepickerMode";
import { TimepickerOrientation } from "./TimepickerOrientation";
import { TimepickerFormat } from "./TimepickerFormat";

import "./TimepickerDialElement";
import "./TimepickerInputElement";

/**
 * Presents a time picker on a temporary surface.
 * @description
 * The `m3e-timepicker` component provides a time-selection experience consistent
 * with Material 3 guidance for layout, motion, and accessibility. It displays a
 * temporary surface that allows users to choose a time using both keyboard-based
 * input and clock-face dial controls.
 *
 * While open, the picker ensures users can review their selection and complete
 * the interaction through confirm, dismiss, or toggle actions, making updates
 * intentional and accessible.
 *
 * It accepts and emits plain `Date` values, allowing applications to apply their
 * own formatting, parsing, and localization.
 *
 * @tag m3e-timepicker
 *
 * @attr variant - The appearance variant of the picker.
 * @attr mode - The mode in which to select time.
 * @attr orientation - The orientation of the picker.
 * @attr date - The selected date.
 * @attr format - Whether to use a 12‑hour or 24‑hour clock.
 * @attr max-time - The maximum time that can be selected.
 * @attr min-time - The minimum time that can be selected.
 * @attr confirm-label - Label given to the button used apply the selected date and close the picker.
 * @attr dismiss-label - Label given to the button used discard the selected date and close the picker.
 * @attr dial-label - Label given to the the picker when in dial mode.
 * @attr input-label - Label given to the the picker when in input mode.
 * @attr hour-label - Label for the hour field.
 * @attr minute-label - Label for the minute field.
 * @attr mode-toggle-label - The accessible label given to the mode toggle button.
 * @attr hide-mode-toggle - Whether to hide the mode toggle button.
 * @attr period-toggle-label - The accessible label given to the period toggle.
 *
 * @fires change - Dispatched when the selected time is confirmed.
 * @fires beforetoggle - Dispatched before the picker toggles.
 * @fires toggle - Dispatched when the picker toggles.
 *
 * @cssprop --m3e-timepicker-container-padding-block - Block padding inside the picker container.
 * @cssprop --m3e-timepicker-container-padding-inline - Inline padding inside the picker container.
 * @cssprop --m3e-timepicker-container-color - Background color of the picker container.
 * @cssprop --m3e-timepicker-container-elevation - Box shadow / elevation of the picker container.
 * @cssprop --m3e-timepicker-docked-container-color - Background color of the docked picker container.
 * @cssprop --m3e-timepicker-docked-container-shape - Border radius of the docked picker container.
 * @cssprop --m3e-timepicker-modal-container-color - Background color of the modal picker container.
 * @cssprop --m3e-timepicker-modal-container-shape - Border radius of the modal picker container.
 * @cssprop --m3e-timepicker-headline-color - Color of the headline.
 * @cssprop --m3e-timepicker-headline-font-size - Font size of the headline.
 * @cssprop --m3e-timepicker-headline-font-weight - Font weight of the headline.
 * @cssprop --m3e-timepicker-headline-line-height - Line height of the headline.
 * @cssprop --m3e-timepicker-headline-tracking - Letter spacing of the headline.
 * @cssprop --m3e-timepicker-headline-top-space - Top margin above the headline.
 * @cssprop --m3e-timepicker-actions-space - Space above the action buttons.
 * @cssprop --m3e-timepicker-label-input-space - Space between Label and the input.
 * @cssprop --m3e-timepicker-vertical-input-dial-space - Space between the input and dial in vertical orientation.
 * @cssprop --m3e-timepicker-horizontal-input-dial-space - Space between the input and dial in horizontal orientation.
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
 * @cssprop --m3e-timepicker-dial-container-size - Size of the dial container.
 * @cssprop --m3e-timepicker-dial-container-shape - Corner radius of the dial container.
 * @cssprop --m3e-timepicker-dial-container-color - Background color of the dial container.
 * @cssprop --m3e-timepicker-dial-inset - Inset offset applied to the dial surface.
 * @cssprop --m3e-timepicker-dial-center-size - Size of the dial center.
 * @cssprop --m3e-timepicker-dial-handle-color - Color of the active handle.
 * @cssprop --m3e-timepicker-dial-handle-size - Size of the handle.
 * @cssprop --m3e-timepicker-dial-handle-disabled-color - Color of a disabled handle.
 * @cssprop --m3e-timepicker-dial-handle-disabled-opacity - Opacity of a disabled handle.
 * @cssprop --m3e-timepicker-dial-dial-inset - Inset applied to the handle area.
 * @cssprop --m3e-timepicker-dial-numeral-size - Size of the dial numerals.
 * @cssprop --m3e-timepicker-dial-numeral-color - Text color of inactive numerals.
 * @cssprop --m3e-timepicker-dial-numeral-shape - Corner radius of the numerals.
 * @cssprop --m3e-timepicker-dial-numeral-font-size - Font size of the outer numerals.
 * @cssprop --m3e-timepicker-dial-numeral-font-weight - Font weight of the outer numerals.
 * @cssprop --m3e-timepicker-dial-numeral-line-height - Line height of the outer numerals.
 * @cssprop --m3e-timepicker-dial-numeral-tracking - Letter spacing of the outer numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-font-size - Font size of the inner numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-font-weight - Font weight of the inner numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-line-height - Line height of the inner numerals.
 * @cssprop --m3e-timepicker-dial-inner-numeral-tracking - Letter spacing of the inner numerals.
 * @cssprop --m3e-timepicker-dial-numeral-active-color - Color of active numerals.
 * @cssprop --m3e-timepicker-dial-numeral-disabled-color - Color of disabled numerals.
 * @cssprop --m3e-timepicker-dial-numeral-disabled-opacity - Opacity of disabled numerals.
 * @cssprop --m3e-timepicker-dial-handle-center-size - Size of the handle center indicator.
 */
@customElement("m3e-timepicker")
export class M3eTimepickerElement extends SuppressInitialAnimation(
  ReconnectedCallback(AttachInternals(Role(LitElement, "dialog"))),
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      flex-direction: column;
      margin: unset;
      border: unset;
      padding-block: var(--m3e-timepicker-container-padding-block, 0.75rem);
      padding-inline: var(--m3e-timepicker-container-padding-inline, 1.75rem);
      background-color: var(--m3e-timepicker-container-color, ${DesignToken.color.surfaceContainer});
      box-shadow: var(--m3e-timepicker-container-elevation, ${DesignToken.elevation.level3});
      opacity: 0;
      display: none;
    }
    .headline {
      color: var(--m3e-timepicker-headline-color, ${DesignToken.color.onSurfaceVariant});
      font-size: var(--m3e-timepicker-headline-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-timepicker-headline-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-timepicker-headline-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-timepicker-headline-tracking, ${DesignToken.typescale.standard.label.large.tracking});
      margin-block-start: var(--m3e-timepicker-headline-top-space, 1rem);
    }
    .actions {
      margin-block-start: var(--m3e-timepicker-actions-space, 1.5rem);
      display: flex;
      align-items: center;
      column-gap: 0.5rem;
    }
    .spacer {
      flex: 1 1 auto;
    }
    :host(:is(:state(--docked), :--docked)) {
      position: absolute;
      background-color: var(--m3e-timepicker-docked-container-color, ${DesignToken.color.surfaceContainer});
      border-radius: var(--m3e-timepicker-docked-container-shape, ${DesignToken.shape.corner.large});
    }
    :host(:is(:state(--modal), :--modal)) {
      position: fixed;
      inset: 0;
      margin: auto;
      transform-origin: top;
      background-color: var(--m3e-timepicker-modal-container-color, ${DesignToken.color.surfaceContainerHigh});
      border-radius: var(--m3e-timepicker-modal-container-shape, ${DesignToken.shape.corner.extraLarge});
    }
    :host(:not(:is(:state(--no-animate), :--no-animate))) {
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
    :host(:is(:state(--docked), :--docked))::backdrop {
      background-color: transparent;
    }
    :host(:is(:state(--modal), :--modal))::backdrop {
      background-color: color-mix(in srgb, var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) 0%, transparent);
      margin-inline-end: -20px;
    }
    :host(:is(:state(--modal), :--modal):not(:popover-open))::backdrop {
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard}, 
        overlay ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete,
        visibility ${DesignToken.motion.duration.short3} ${DesignToken.motion.easing.standard} allow-discrete`,
      )};
    }
    :host(:is(:state(--modal), :--modal):popover-open)::backdrop {
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
    :host(:is(:state(--bottom), :--bottom)) {
      transform-origin: top;
    }
    :host(:is(:state(--top), :--top)) {
      transform-origin: bottom;
    }
    @starting-style {
      :host(:popover-open) {
        transform: scaleY(0.8);
      }
      :host(:is(:state(--modal), :--modal):popover-open)::backdrop {
        background-color: color-mix(in srgb, var(--m3e-dialog-scrim-color, ${DesignToken.color.scrim}) 0%, transparent);
      }
    }
    .base {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :host(:not(:is(:state(--horizontal), :--horizontal))) .base {
      flex-direction: column;
    }
    .input {
      margin-top: var(--m3e-timepicker-label-input-space, 1.25rem);
    }
    .dial-wrapper {
      display: flex;
      transition: ${unsafeCSS(
        `opacity var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1}) ${DesignToken.motion.easing.standard}`,
      )};
    }
    .dial-spacer,
    .dial {
      flex: none;
    }
    :host(:not([mode="dial"])) .dial-wrapper {
      opacity: 0;
    }
    :host([mode="dial"]) .dial-wrapper {
      opacity: 1;
    }
    :host(:not(:is(:state(--horizontal), :--horizontal))) .dial-wrapper {
      flex-direction: column;
    }
    :host(:not(:is(:state(--horizontal), :--horizontal))) .dial-spacer {
      height: var(--m3e-timepicker-vertical-input-dial-space, 2.25rem);
    }
    :host(:is(:state(--horizontal), :--horizontal)) .dial-spacer {
      width: var(--m3e-timepicker-horizontal-input-dial-space, 3.25rem);
    }
    @media (prefers-reduced-motion) {
      :host(:not(:is(:state(--no-animate), :--no-animate))) {
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

  /** @private */ #closeTimeout = -1;
  /** @private */ #date?: Date | null;

  /** @private */ @state() private _open = false;

  /** @private */ @query("m3e-timepicker-input") private readonly _input!: M3eTimepickerInputElement;
  /** @private */ @state() _invalid = false;
  /** @private */ @state() private _variant?: Exclude<TimepickerVariant, "auto">;
  /** @private */ @state() private _orientation?: Exclude<TimepickerOrientation, "auto">;
  /** @private */ @state() private _mode?: TimepickerMode;

  /** @private */ #breakpointUnobserve?: () => void;

  /** @private */ #trigger?: HTMLElement;
  /** @private */ #anchor?: HTMLElement;
  /** @private */ #anchorCleanup?: () => void;
  /** @private */ #anchorLastPosition?: { x: number; y: number; dir: Direction };

  /** @private */ readonly #scrollLockController = new ScrollLockController(this);
  /** @private */ readonly #inertController = new InertController(this);
  /** @private */ readonly #documentClickHandler = (e: MouseEvent) => this.#handleDocumentClick(e);
  /** @private */ readonly #documentKeyDownHandler = (e: KeyboardEvent) => this.#handleDocumentKeyDown(e);
  /** @private */ readonly #toggleHandler = (e: ToggleEvent) => this.#handleToggle(e);

  /**
   * The appearance variant of the picker.
   * @default "docked"
   */
  @property() variant: TimepickerVariant = "docked";

  /**
   * The mode in which to select time.
   * @default "dial"
   */
  @property({ reflect: true }) mode: TimepickerMode = "dial";

  /**
   * The orientation of the picker.
   * @default "vertical"
   */
  @property({ reflect: true }) orientation: TimepickerOrientation = "vertical";

  /**
   * The selected date.
   * @default null
   */
  @property({ converter: dateConverter }) date: Date | null = null;

  /**
   * Whether to use a 12‑hour or 24‑hour clock.
   * @default "12"
   */
  @property() format: TimepickerFormat = "12";

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

  /**
   * Whether to hide the mode toggle button.
   * @default false
   */
  @property({ attribute: "hide-mode-toggle", type: Boolean }) hideModeToggle = false;

  /**
   * Label given to the button used apply the selected date and close the picker.
   * @default "OK"
   */
  @property({ attribute: "confirm-label" }) confirmLabel = "OK";

  /**
   * Label given to the button used discard the selected date and close the picker.
   * @default "Cancel"
   */
  @property({ attribute: "dismiss-label" }) dismissLabel = "Cancel";

  /**
   * Label given to the the picker when in dial mode.
   * @default "Select time"
   */
  @property({ attribute: "dial-label" }) dialLabel = "Select time";

  /**
   * Label given to the the picker when in input mode.
   * @default "Edit time"
   */
  @property({ attribute: "input-label" }) inputLabel = "Edit time";

  /**
   * Label for the hour field.
   * @default "Hour"
   */
  @property({ attribute: "hour-label" }) hourLabel = "Hour";

  /**
   * Label for the minute field.
   * @default "Minute"
   */
  @property({ attribute: "minute-label" }) minuteLabel = "Minute";

  /**
   * The accessible label given to the mode toggle button.
   * @default "Toggle input picker"
   */
  @property({ attribute: "mode-toggle-label" }) modeToggleLabel = "Toggle input picker";

  /**
   * The accessible label given to the period toggle.
   * @default "AM or PM"
   */
  @property({ attribute: "period-toggle-label" }) periodToggleLabel = "AM or PM";

  /** Whether the picker is open. */
  get isOpen() {
    return this.#trigger !== undefined;
  }

  /** The current variant applied to the picker. */
  get currentVariant(): Exclude<TimepickerVariant, "auto"> {
    return this._variant ?? (this.variant !== "modal" ? "docked" : "modal");
  }

  /** The current orientation applied to the picker. */
  get currentOrientation(): Exclude<TimepickerOrientation, "auto"> {
    return this._orientation ?? (this.orientation !== "horizontal" ? "vertical" : "horizontal");
  }

  /** The current input mode applied to the picker. */
  get currentMode(): Exclude<TimepickerMode, "auto"> {
    return this._mode ?? this.mode;
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.setAttribute("popover", "manual");
    this.addEventListener("toggle", this.#toggleHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this._variant = undefined;
    this.#breakpointUnobserve?.();

    this.#clearAnchoring();

    deleteCustomState(this, "--docked");
    deleteCustomState(this, "--modal");

    this.removeEventListener("toggle", this.#toggleHandler);
    document.removeEventListener("click", this.#documentClickHandler);
    document.removeEventListener("keydown", this.#documentKeyDownHandler);
  }

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();

    if (this.variant === "auto" || this.orientation === "auto") {
      this.#initBreakpointMonitoring();
    }
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

    clearTimeout(this.#closeTimeout);

    if (this.currentVariant === "modal") {
      this.#scrollLockController.lock();
      this.#inertController.lock();
    }

    // Validate the current value prior to opening
    this.#validate();

    // The picker is rendered on demand
    this._open = true;

    // Wait for the picker to render
    if (this.isUpdatePending) {
      await this.updateComplete;
    }

    const input = this._input;
    input.hour = this.date?.getHours() ?? null;
    input.minute = this.date?.getMinutes() ?? null;
    input.minTime = this.minTime;
    input.maxTime = this.maxTime;
    input.blackoutTimes = this.blackoutTimes;

    if (input.isUpdatePending) {
      await input.updateComplete;
    }

    this.#date = undefined;
    this.#trigger = trigger;
    this.#trigger.ariaExpanded = "true";
    this.#anchor = anchor;

    await this.#updatePosition();
    this.showPopover();

    document.addEventListener("click", this.#documentClickHandler);
    document.addEventListener("keydown", this.#documentKeyDownHandler);
  }

  /**
   * Hides the picker.
   * @param {boolean} [restoreFocus=false] Whether to restore focus to the picker's trigger.
   */
  hide(restoreFocus: boolean = false): void {
    if (!this.isOpen) return;

    document.removeEventListener("click", this.#documentClickHandler);
    document.removeEventListener("keydown", this.#documentKeyDownHandler);

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
    return html`<m3e-focus-trap ?disabled="${!this._open}">
      ${this.#renderHeader()}${this.#renderPicker()}${this.#renderActions()}
    </m3e-focus-trap>`;
  }

  /** @inheritdoc */
  #renderHeader(): unknown {
    return html`<div class="headline">${this.currentMode === "dial" ? this.dialLabel : this.inputLabel}</div>`;
  }

  /** @private */
  #renderPicker(): unknown {
    // Picker is rendered only when open
    return this._open
      ? html`<div class="base">
          <m3e-timepicker-input
            class="input"
            for="${ifDefined(this.currentMode === "input" ? undefined : "dial")}"
            ?hide-labels="${this.currentMode === "dial"}"
            period-toggle-label="${this.periodToggleLabel}"
            hour-label="${this.hourLabel}"
            minute-label="${this.minuteLabel}"
            orientation="${this.currentOrientation === "vertical" ? "horizontal" : "vertical"}"
            format="${this.format}"
            @change="${this.#handleInputChange}"
          ></m3e-timepicker-input>

          <m3e-collapsible
            orientation="${this.currentOrientation === "horizontal" ? "both" : "vertical"}"
            ?open="${this.currentMode === "dial"}"
          >
            <div class="dial-wrapper">
              <div class="dial-spacer"></div>
              <m3e-timepicker-dial id="dial" class="dial"></m3e-timepicker-dial>
            </div>
          </m3e-collapsible>
        </div>`
      : nothing;
  }

  /** @private */
  #renderActions(): unknown {
    return html`<div class="actions">
      ${this.#renderModeToggleButton()}
      <div class="spacer" aria-hidden="true"></div>
      <m3e-button @click="${this.#handleDismissClick}">${this.dismissLabel}</m3e-button>
      <m3e-button ?disabled="${this._invalid}" @click="${this.#handleConfirmClick}">${this.confirmLabel}</m3e-button>
    </div>`;
  }

  /** @private */
  #renderModeToggleButton(): unknown {
    if (this.hideModeToggle) return nothing;
    return html`<m3e-icon-button
      aria-label="${this.modeToggleLabel}"
      aria-expanded="${this.currentMode === "dial"}"
      aria-controls="dial"
      @click="${this.#handleModeClick}"
    >
      ${this.currentMode === "dial"
        ? svg`<svg viewBox="0 -960 960 960" fill="currentColor">
              <path
                d="M160-200q-33 0-56.5-23.5T80-280v-400q0-33 23.5-56.5T160-760h640q33 0 56.5 23.5T880-680v400q0 33-23.5 56.5T800-200H160Zm0-80h640v-400H160v400Zm160-40h320v-80H320v80ZM200-440h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM200-560h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80Zm120 0h80v-80h-80v80ZM160-280v-400 400Z"
              />
            </svg>`
        : svg`<svg viewBox="0 -960 960 960" fill="currentColor">
              <path
                d="m612-292 56-56-148-148v-184h-80v216l172 172ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-400Zm0 320q133 0 226.5-93.5T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 133 93.5 226.5T480-160Z"
              />
            </svg>`}
    </m3e-icon-button>`;
  }

  /** @private */
  #handleModeClick(): void {
    this._mode = this.currentMode === "dial" ? "input" : "dial";
  }

  /** @inheritdoc */
  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties);

    if (changedProperties.has("date")) {
      this.#clearSelectionState();
    }
    if (changedProperties.has("variant") || changedProperties.has("orientation")) {
      this.#breakpointUnobserve?.();

      if (this.variant !== "auto") {
        this._variant = undefined;
        this.#updateVariant();
      }
      if (this.orientation !== "auto") {
        this._orientation = undefined;
        this.#updateOrientation();
      }

      if (this.variant === "auto" || this.orientation === "auto") {
        this.#initBreakpointMonitoring();
      }
    }
  }

  /** @private */
  #handleDocumentClick(e: MouseEvent): void {
    if (this.isOpen && !e.composedPath().some((x) => x === this || x === this.#trigger)) {
      this.hide();
    }
  }

  /** @private */
  #handleInputChange(e: Event): void {
    const input = <M3eTimepickerInputElement>e.target;

    if (input.hour === null || input.minute === null) {
      this.#date = null;
    } else {
      this.#date = new Date(this.date ?? Date.now());
      this.#date.setHours(input.hour);
      this.#date.setMinutes(input.minute);
      this.#date.setSeconds(0);
      this.#date.setMilliseconds(0);
    }

    this.#validate();
  }

  /** @private */
  #handleDismissClick(): void {
    this.hide(true);
  }

  /** @private */
  #handleConfirmClick(): void {
    if (this.#date !== undefined) {
      this.date = this.#date;
    }

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
  #handleToggle(e: ToggleEvent): void {
    if (e.newState === "closed") {
      this.#clearSelectionState();
      this.#anchorCleanup?.();
      this.#anchorCleanup = undefined;
      this.#anchorLastPosition = undefined;

      clearTimeout(this.#closeTimeout);

      if (!prefersReducedMotion()) {
        this.#closeTimeout = setTimeout(() => (this._open = false), 100);
      } else {
        this._open = false;
      }
    }
  }

  /** @private */
  #initBreakpointMonitoring(): void {
    this.#breakpointUnobserve = M3eBreakpointObserver.observe([Breakpoint.XSmall, Breakpoint.Small], (matches) => {
      if (this.variant === "auto") {
        this._variant = matches.get(Breakpoint.XSmall) || matches.get(Breakpoint.Small) ? "modal" : "docked";
        this.#updateVariant();
      }
      if (this.orientation === "auto") {
        this._orientation = matches.get(Breakpoint.Small) ? "horizontal" : "vertical";
        this.#updateOrientation();
      }
    });
  }

  /** @private */
  #updateVariant(): void {
    switch (this.currentVariant) {
      case "docked":
        this.ariaModal = null;
        deleteCustomState(this, "--modal");
        addCustomState(this, "--docked");
        this.#scrollLockController.unlock();
        this.#inertController.unlock();
        break;

      case "modal":
        this.ariaModal = "true";
        deleteCustomState(this, "--docked");
        addCustomState(this, "--modal");
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
  #updateOrientation(): void {
    switch (this.currentOrientation) {
      case "horizontal":
        addCustomState(this, "--horizontal");
        break;

      case "vertical":
        deleteCustomState(this, "--horizontal");
        break;
    }
  }

  /** @private */
  async #updatePosition(): Promise<void> {
    if (this.currentVariant === "docked" && this.#trigger) {
      this.#anchorCleanup?.();
      this.#anchorLastPosition = undefined;
      this.#anchorCleanup = await positionAnchor(
        this,
        this.#anchor ?? this.#trigger,
        {
          position: "bottom-start",
          inline: true,
          flip: true,
          shift: "both",
        },
        (x, y, position) => {
          setCustomState(this, "--top", position.includes("top"));
          setCustomState(this, "--bottom", position.includes("bottom"));

          if (this.#anchorLastPosition?.dir !== M3eDirectionality.current || this.#anchorLastPosition?.x !== x) {
            if (M3eDirectionality.current === "rtl") {
              this.style.right = `${window.innerWidth - x - this.clientWidth}px`;
              this.style.left = "";
            } else {
              this.style.left = `${x}px`;
              this.style.right = "";
            }
          }

          if (this.#anchorLastPosition?.y !== y) {
            this.style.top = `${y}px`;
          }

          this.#anchorLastPosition = { x, y, dir: M3eDirectionality.current };
        },
      );
    } else {
      this.#clearAnchoring();
    }
  }

  /** @private */
  #clearAnchoring(): void {
    this.#anchorCleanup?.();
    this.#anchorCleanup = undefined;
    this.#anchorLastPosition = undefined;
    this.style.left = "";
    this.style.right = "";
    this.style.top = "";
  }

  /** @private */
  #clearSelectionState(): void {
    this.#date = undefined;
  }

  /** @private */
  #validate(): void {
    if (this.#date === undefined && this.date) {
      // There is a value, but the value didn't change
      this._invalid = false;
      return;
    }

    if (this.#date === null || this.#date === undefined) {
      this._invalid = true;
      return;
    }

    const hour = this.#date.getHours();
    const minute = this.#date.getMinutes();

    if (this.minTime) {
      if (hour < this.minTime.hour || (hour === this.minTime.hour && minute < this.minTime.minute)) {
        this._invalid = true;
        return;
      }
    }

    if (this.maxTime) {
      if (hour > this.maxTime.hour || (hour === this.maxTime.hour && minute > this.maxTime.minute)) {
        this._invalid = true;
        return;
      }
    }

    if (this.blackoutTimes?.({ hour, minute })) {
      this._invalid = true;
      return;
    }

    this._invalid = false;
  }
}

interface M3eTimepickerElementEventMap extends HTMLElementEventMap {
  beforetoggle: ToggleEvent;
  toggle: ToggleEvent;
}

export interface M3eTimepickerElement {
  addEventListener<K extends keyof M3eTimepickerElementEventMap>(
    type: K,
    listener: (this: M3eTimepickerElement, ev: M3eTimepickerElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eTimepickerElementEventMap>(
    type: K,
    listener: (this: M3eTimepickerElement, ev: M3eTimepickerElementEventMap[K]) => void,
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
    "m3e-timepicker": M3eTimepickerElement;
  }
}
