/**
 * Adapted from Angular Material Form Field
 * Source: https://github.com/angular/components/blob/main/src/material/form-field/form-field.ts
 *
 * @license MIT
 * Copyright (c) 2025 Google LLC
 * See LICENSE file in the project root for full license text.
 */

import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  FocusController,
  getTextContent,
  hasAssignedNodes,
  HoverController,
  interceptProperty,
  isReadOnlyMixin,
  MutationController,
  PressedController,
  ResizeController,
} from "@m3e/web/core";

import { M3eAriaDescriber } from "@m3e/web/core/a11y";

import { findFormFieldControl, FormFieldControl } from "./FormFieldControl";
import { FormFieldVariant } from "./FormFieldVariant";
import { HideSubscriptType } from "./HideSubscriptType";
import { FloatLabelType } from "./FloatLabelType";

/**
 * A container for form controls that applies Material Design styling and behavior.
 *
 * @description
 * The `m3e-form-field` component is a semantic, expressive container for form controls that anchors
 * label behavior, subscript messaging, and variant-specific layout. Designed according to Material Design 3
 * guidelines, it supports two visual variants—`outlined` and `filled`—each with dynamic elevation,
 * shape transitions, and adaptive color theming. The component responds to control state changes
 * (focus, hover, press, disabled, invalid) with smooth motion and semantic clarity, ensuring
 * visual hierarchy and emotional resonance.

 * The component is accessible by default, with ARIA annotations, contrast-safe color tokens,
 * and dynamic descriptions for hint and error messaging. It supports prefix and suffix content,
 * floating labels, and adaptive subscript visibility. When hosting a control with validation,
 * error messages are surfaced with `aria-invalid` and described for assistive technology.

 * Native form controls may not expose full state or messaging on their own. `m3e-form-field` bridges
 * these gaps by coordinating label floating, container styling, and subscript feedback.
 *
 * @example
 * The following example illustrates a basic usage of the `m3e-form-field`.
 * ```html
 * <m3e-form-field>
 *  <label slot="label" for="field">Text field</label>
 *  <input id="field" />
 * </m3e-form-field>
 * ```
 * 
 * @tag m3e-form-field
 *
 * @slot - Renders the control of the field.
 * @slot prefix - Renders content before the fields's control.
 * @slot prefix-text - Renders text before the fields's control.
 * @slot suffix - Renders content after the fields's control.
 * @slot suffix-text - Renders text after the fields's control.
 * @slot hint - Renders hint text in the fields's subscript, when the control is valid.
 * @slot error - Renders error text in the fields's subscript, when the control is invalid.
 *
 * @attr float-label - Specifies whether the label should float always or only when necessary.
 * @attr hide-required-marker - Whether the required marker should be hidden.
 * @attr hide-subscript - Whether subscript content is hidden.
 * @attr variant - The appearance variant of the field.
 *
 * @cssprop --m3e-form-field-font-size - Font size for the form field container text.
 * @cssprop --m3e-form-field-font-weight - Font weight for the form field container text.
 * @cssprop --m3e-form-field-line-height - Line height for the form field container text.
 * @cssprop --m3e-form-field-tracking - Letter spacing for the form field container text.
 * @cssprop --m3e-form-field-label-font-size - Font size for the floating label.
 * @cssprop --m3e-form-field-label-font-weight - Font weight for the floating label.
 * @cssprop --m3e-form-field-label-line-height - Line height for the floating label.
 * @cssprop --m3e-form-field-label-tracking - Letter spacing for the floating label.
 * @cssprop --m3e-form-field-subscript-font-size - Font size for hint and error text.
 * @cssprop --m3e-form-field-subscript-font-weight - Font weight for hint and error text.
 * @cssprop --m3e-form-field-subscript-line-height - Line height for hint and error text.
 * @cssprop --m3e-form-field-subscript-tracking - Letter spacing for hint and error text.
 * @cssprop --m3e-form-field-color - Text color for the form field container.
 * @cssprop --m3e-form-field-subscript-color - Color for hint and error text.
 * @cssprop --m3e-form-field-invalid-color - Color used when the control is invalid.
 * @cssprop --m3e-form-field-focused-outline-color - Outline color when focused.
 * @cssprop --m3e-form-field-focused-color - Label color when focused.
 * @cssprop --m3e-form-field-outline-color - Outline color in outlined variant.
 * @cssprop --m3e-form-field-container-color - Background color in filled variant.
 * @cssprop --m3e-form-field-hover-container-color - Hover background color in filled variant.
 * @cssprop --m3e-form-field-width - Width of the form field container.
 * @cssprop --m3e-form-field-icon-size - Size of prefix and suffix icons.
 * @cssprop --m3e-outlined-form-field-container-shape - Corner radius for outlined container.
 * @cssprop --m3e-form-field-container-shape - Corner radius for filled container.
 * @cssprop --m3e-form-field-hover-container-opacity - Opacity for hover background in filled variant.
 * @cssprop --m3e-form-field-disabled-opacity - Opacity for disabled text.
 * @cssprop --m3e-form-field-disabled-container-opacity - Opacity for disabled container background.
 */
@customElement("m3e-form-field")
export class M3eFormFieldElement extends AttachInternals(LitElement) {
  static {
    if (document) {
      const lightDomStyle = new CSSStyleSheet();
      lightDomStyle.replaceSync(
        css`
          m3e-form-field input::placeholder,
          m3e-form-field textarea::placeholder {
            user-select: none;
            color: currentColor;
            transition: opacity ${DesignToken.motion.duration.extraLong1};
          }
          m3e-form-field[float-label="auto"]:not(.-float-label).-with-label input::placeholder,
          m3e-form-field[float-label="auto"]:not(.-float-label).-with-label textarea::placeholder {
            opacity: 0;
            transition: opacity 0s;
          }
          m3e-form-field[variant="outlined"] m3e-input-chip-set {
            margin-block: calc(calc(3.5rem + ${DesignToken.density.calc(-2)}) / 4);
          }
          @media (prefers-reduced-motion) {
            m3e-form-field input::placeholder,
            m3e-form-field textarea::placeholder {
              transition: none !important;
            }
          }
        `.toString(),
      );

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, lightDomStyle];
    }
  }
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      flex-direction: column;
      vertical-align: middle;
      font-size: var(--m3e-form-field-font-size, ${DesignToken.typescale.standard.body.large.fontSize});
      font-weight: var(--m3e-form-field-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight});
      line-height: var(--m3e-form-field-line-height, ${DesignToken.typescale.standard.body.large.lineHeight});
      letter-spacing: var(--m3e-form-field-tracking, ${DesignToken.typescale.standard.body.large.tracking});
      width: var(--m3e-form-field-width, 14.5rem);
      color: var(--_form-field-color);
    }
    :host(:not(.-disabled)) .base {
      cursor: var(--_form-field-cursor);
    }
    .base {
      display: flex;
      align-items: center;
      position: relative;
      min-height: calc(3.5rem + ${DesignToken.density.calc(-2)});
      --_form-field-label-font-size: var(
        --m3e-form-field-label-font-size,
        ${DesignToken.typescale.standard.body.small.fontSize}
      );
      --_form-field-label-line-height: var(
        --m3e-form-field-label-line-height,
        ${DesignToken.typescale.standard.body.small.lineHeight}
      );
    }
    .content {
      display: flex;
      align-items: center;
      position: relative;
      flex: 1 1 auto;
      min-width: 0;
      min-height: var(--m3e-form-field-icon-size, 1.5rem);
    }
    .prefix,
    .suffix {
      display: flex;
      align-items: center;
      position: relative;
      user-select: none;
      flex: none;
      font-size: var(--m3e-form-field-icon-size, 1.5rem);
    }
    .prefix-text,
    .suffix-text {
      opacity: 1;
      transition: opacity ${DesignToken.motion.duration.extraLong1};
      user-select: none;
      flex: none;
    }
    .input {
      display: inline-flex;
      flex-wrap: wrap;
      flex: 1 1 auto;
      min-width: 0;
    }
    .label {
      display: flex;
      position: absolute;
      pointer-events: none;
      user-select: none;
      top: 0;
      left: 0;
      right: 0;
      font-size: var(--m3e-form-field-label-font-size, ${DesignToken.typescale.standard.body.small.fontSize});
      font-weight: var(--m3e-form-field-label-font-weight, ${DesignToken.typescale.standard.body.small.fontWeight});
      line-height: var(--m3e-form-field-label-line-height, ${DesignToken.typescale.standard.body.small.lineHeight});
      letter-spacing: var(--m3e-form-field-label-tracking, ${DesignToken.typescale.standard.body.small.tracking});
      color: var(--_form-field-label-color, inherit);
      transition: ${unsafeCSS(
        `top ${DesignToken.motion.duration.short4}, 
        font-size ${DesignToken.motion.duration.short4}, 
        line-height ${DesignToken.motion.duration.short4}`,
      )};
    }
    :host(.-with-select) .label {
      margin-inline-end: 1.5rem;
    }
    ::slotted([slot="label"]) {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .subscript {
      display: inline-flex;
      width: 100%;
      margin-top: 0.25rem;
      font-size: var(--m3e-form-field-subscript-font-size, ${DesignToken.typescale.standard.body.small.fontSize});
      font-weight: var(--m3e-form-field-subscript-font-weight, ${DesignToken.typescale.standard.body.small.fontWeight});
      line-height: var(--m3e-form-field-subscript-line-height, ${DesignToken.typescale.standard.body.small.lineHeight});
      letter-spacing: var(--m3e-form-field-subscript-tracking, ${DesignToken.typescale.standard.body.small.tracking});
      min-height: var(--m3e-form-field-subscript-line-height, ${DesignToken.typescale.standard.body.small.lineHeight});
      color: var(--m3e-form-field-subscript-color, ${DesignToken.color.onSurfaceVariant});
    }
    .error,
    .hint {
      flex: 1 1 auto;
    }
    :host([hide-subscript="always"]) .subscript {
      display: none;
    }
    :host([hide-subscript="auto"]:not(.-invalid)) .subscript {
      opacity: 0;
      margin-top: 0px;
      margin-bottom: 0.25rem;
      transition: ${unsafeCSS(
        `opacity ${DesignToken.motion.duration.short4}, 
        margin-top ${DesignToken.motion.duration.short4}, 
        margin-bottom ${DesignToken.motion.duration.short4}`,
      )};
    }
    :host([hide-subscript="auto"]:not(.-invalid):focus-within) .subscript,
    :host([hide-subscript="auto"]:not(.-invalid).-pressed) .subscript {
      opacity: 1;
      margin-top: 0.25rem;
      margin-bottom: 0;
    }
    :host(.-invalid) .hint {
      display: none;
    }
    :host(:not(.-invalid)) .error {
      display: none;
    }
    ::slotted(input),
    ::slotted(textarea),
    ::slotted(select) {
      outline: unset;
      border: unset;
      background-color: transparent;
      box-shadow: none;
      font-family: inherit;
      font-size: inherit;
      line-height: initial;
      letter-spacing: inherit;
      color: var(--_form-field-input-color, inherit);
      flex: 1 1 auto;
      min-width: 0;
      padding: unset;
    }
    ::slotted(textarea) {
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
      scrollbar-color: ${DesignToken.scrollbar.color};
    }
    ::slotted(m3e-select),
    ::slotted(m3e-input-chip-set) {
      flex: 1 1 auto;
      min-width: 0;
    }
    :host([float-label="auto"]:not(.-float-label):not(.-pressed)) .label {
      font-size: inherit;
    }

    :host([float-label="auto"]:not(.-float-label).-with-label) .prefix-text,
    :host([float-label="auto"]:not(.-float-label).-with-label) .suffix-text {
      opacity: 0;
      transition: opacity 0s;
    }
    .prefix {
      margin-inline-start: 1rem;
    }
    :host(.-with-prefix) .prefix {
      margin-inline-end: 1rem;
      margin-inline-start: 0.75rem;
    }
    .suffix {
      margin-inline-end: 1rem;
    }
    :host(.-with-suffix) .suffix {
      margin-inline-start: 0.25rem;
      margin-inline-end: 0.5rem;
    }
    :host(.-with-suffix.-with-select) .suffix {
      margin-inline-start: unset;
    }
    :host(.-with-select) .suffix-text {
      display: none;
    }
    :host([variant="outlined"]) .label {
      margin-top: calc(0px - var(--_form-field-label-line-height) / 2);
    }
    :host([variant="outlined"]) .outline {
      position: absolute;
      display: flex;
      pointer-events: none;
      left: 0;
      top: 0;
      bottom: 0;
      right: 0;
    }
    :host([variant="outlined"]) .pseudo-label {
      visibility: hidden;
      margin-inline-end: 0.25rem;
      font-size: var(--_form-field-label-font-size);
      line-height: var(--_form-field-label-line-height);
      letter-spacing: var(--_form-field-label-tracking);
      max-width: 100%;
      transition-property: max-width, margin-inline-end;
      transition-duration: 1ms;
    }
    :host([variant="outlined"][float-label="auto"]:not(.-float-label):not(.-pressed)) .pseudo-label {
      max-width: 0;
      margin-inline-end: 0px;
      transition-delay: ${DesignToken.motion.duration.short2};
    }
    :host([variant="outlined"]) .outline-start,
    :host([variant="outlined"]) .outline-notch,
    :host([variant="outlined"]) .outline-end {
      box-sizing: border-box;
      border-width: var(--_form-field-outline-size, 0.0625rem);
      border-color: var(--_form-field-outline-color);
      transition: border-color ${DesignToken.motion.duration.short4};
    }
    :host([variant="outlined"]:not(.-with-label)) .outline-notch {
      display: none;
    }
    :host([variant="outlined"]) .outline-start {
      min-width: 0.75rem;
      border-top-style: solid;
      border-inline-start-style: solid;
      border-bottom-style: solid;
      border-start-start-radius: var(--m3e-outlined-form-field-container-shape, ${DesignToken.shape.corner.extraSmall});
      border-end-start-radius: var(--m3e-outlined-form-field-container-shape, ${DesignToken.shape.corner.extraSmall});
    }
    :host([variant="outlined"]) .outline-notch {
      border-bottom-style: solid;
    }
    :host([variant="outlined"]) .outline-end {
      flex-grow: 1;
      min-width: 1rem;
      border-top-style: solid;
      border-inline-end-style: solid;
      border-bottom-style: solid;
      border-start-end-radius: var(--m3e-outlined-form-field-container-shape, ${DesignToken.shape.corner.extraSmall});
      border-end-end-radius: var(--m3e-outlined-form-field-container-shape, ${DesignToken.shape.corner.extraSmall});
    }
    :host([variant="outlined"].-with-prefix) .outline-start {
      min-width: calc(1.25rem + var(--_prefix-width, 0px) + 0.25rem);
    }
    :host([variant="outlined"]:not(.-disabled)) .base:hover .outline,
    :host([variant="outlined"]:not(.-disabled):focus-within) .outline,
    :host([variant="outlined"]:not(.-disabled).-pressed) .outline {
      --_form-field-outline-size: 0.125rem;
    }
    :host([variant="outlined"]) .subscript {
      margin-inline: 1rem;
      width: calc(100% - 2rem);
    }
    :host([variant="outlined"]) .content {
      min-height: calc(3.5rem + ${DesignToken.density.calc(-2)});
      --_form-field-label-font-size: var(
        --m3e-form-field-label-font-size,
        ${DesignToken.typescale.standard.body.small.fontSize}
      );
    }
    :host([variant="outlined"][float-label="auto"]:not(.-float-label):not(.-pressed)) .label {
      margin-top: unset;
      line-height: calc(3.5rem + ${DesignToken.density.calc(-2)});
      --_form-field-label-font-size: var(
        --m3e-form-field-label-font-size,
        ${DesignToken.typescale.standard.body.small.fontSize}
      );
    }
    :host([variant="filled"]) .base {
      --_select-arrow-margin-top: calc(
        0px - calc(1rem / max(calc(0 - calc(var(--md-sys-density-scale, 0) + var(--md-sys-density-scale, 0))), 1))
      );
    }
    :host([variant="filled"]) .base::before {
      content: "";
      box-sizing: border-box;
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-bottom-style: solid;
      border-width: 0.0625rem;
      border-radius: var(--m3e-form-field-container-shape, ${DesignToken.shape.corner.extraSmallTop});
      border-color: var(--_form-field-outline-color);
      background-color: var(--_form-field-container-color);
    }
    :host([variant="filled"]:not(.-disabled)) .base:hover::before,
    :host([variant="filled"]:not(.-disabled):focus-within) .base::before,
    :host([variant="filled"]:not(.-disabled).-pressed) .base::before {
      border-width: 0.1875rem;
    }
    :host([variant="filled"]) .base::after {
      content: "";
      box-sizing: border-box;
      position: absolute;
      pointer-events: none;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: var(--_form-field-hover-container-color);
      transition: background-color ${DesignToken.motion.duration.short4};
    }
    :host([variant="filled"]) .subscript {
      margin-inline: 1rem;
      width: calc(100% - 2rem);
    }
    :host([variant="filled"]) .content {
      padding-top: calc(1.5rem + ${DesignToken.density.calc(-2)});
      margin-bottom: 0.5rem;
    }
    :host([variant="filled"]) .label {
      top: calc(0.5rem + ${DesignToken.density.calc(-2)});
    }
    :host([variant="filled"][float-label="auto"]:not(.-float-label):not(.-pressed)) .label {
      top: 0px;
      line-height: calc(3.5rem + ${DesignToken.density.calc(-2)} - 0.0625rem);
      --_form-field-label-font-size: var(
        --m3e-form-field-label-font-size,
        ${DesignToken.typescale.standard.body.small.fontSize}
      );
    }
    :host(:not(.-disabled):not(:focus-within):not(.-pressed)) .base:hover {
      --_form-field-hover-container-color: color-mix(
        in srgb,
        var(--m3e-form-field-hover-container-color, ${DesignToken.color.onSurface})
          var(--m3e-form-field-hover-container-opacity, 8%),
        transparent
      );
    }
    :host(:not(.-disabled):not(.-invalid)) {
      color: var(--m3e-form-field-color, ${DesignToken.color.onSurface});
    }
    :host([variant="outlined"]:not(.-disabled):not(.-invalid)) .base {
      --_form-field-outline-color: var(--m3e-form-field-outline-color, ${DesignToken.color.outline});
    }
    :host([variant="filled"]:not(.-disabled):not(.-invalid)) .base {
      --_form-field-outline-color: var(--m3e-form-field-outline-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host([variant="outlined"]:not(.-disabled):not(.-invalid):focus-within) .base,
    :host([variant="outlined"]:not(.-disabled):not(.-invalid).-pressed) .base,
    :host([variant="filled"]:not(.-disabled):not(.-invalid):focus-within) .base,
    :host([variant="filled"]:not(.-disabled):not(.-invalid).-pressed) .base {
      --_form-field-outline-color: var(--m3e-form-field-focused-outline-color, ${DesignToken.color.primary});
      --_form-field-label-color: var(--m3e-form-field-focused-color, ${DesignToken.color.primary});
    }
    :host(:not(.-disabled)) .base {
      --_form-field-container-color: var(
        --m3e-form-field-container-color,
        ${DesignToken.color.surfaceContainerHighest}
      );
    }
    :host(:not(.-disabled).-invalid) .base {
      --_form-field-label-color: var(--m3e-form-field-invalid-color, ${DesignToken.color.error});
      --_form-field-outline-color: var(--m3e-form-field-invalid-color, ${DesignToken.color.error});
    }
    :host(:not(.-disabled).-invalid) .subscript {
      color: var(--m3e-form-field-invalid-color, ${DesignToken.color.error});
    }
    :host(.-disabled) {
      color: color-mix(
        in srgb,
        var(--m3e-form-field-disabled-color, ${DesignToken.color.onSurface}) var(--m3e-form-field-disabled-opacity, 38%),
        transparent
      );
    }
    :host(.-disabled) .base {
      --_form-field-container-color: color-mix(
        in srgb,
        var(--m3e-form-field-disabled-container-color, ${DesignToken.color.onSurface})
          var(--m3e-form-field-disabled-container-opacity, 4%),
        transparent
      );
    }
    :host(.-no-animate) *,
    :host(.-no-animate) *::before,
    :host(.-no-animate) *::after {
      transition: none !important;
    }
    @media (forced-colors: active) {
      :host([variant="filled"]) .base::after {
        transition: none;
      }
      :host {
        --_form-field-outline-color: CanvasText;
      }
      :host(.-disabled) {
        --_form-field-input-color: GrayText;
        --_form-field-color: GrayText;
        --_form-field-label-color: GrayText;
        --_form-field-outline-color: GrayText;
      }
    }
    @media (prefers-reduced-motion) {
      .base::before,
      .prefix-text,
      .suffix-text,
      .label,
      .subscript,
      .outline-start,
      .outline-notch,
      .outline-end,
      .pseudo-label {
        transition: none !important;
      }
    }
  `;

  /** @private */ #control: FormFieldControl | null = null;
  /** @private */ #removeValueInterceptor?: () => void;
  /** @private */ readonly #formResetHandler = () => this.#handleFormReset();
  /** @private */ readonly #controlInvalidHandler = () => this.#handleControlInvalid();

  /** @private */
  readonly #controlMutationController = new MutationController(this, {
    target: null,
    config: { attributeFilter: ["disabled", "readonly", "required"] },
    callback: () => this.notifyControlStateChange(),
  });

  /** @private */
  readonly #resizeController = new ResizeController(this, {
    target: null,
    callback: () => this.#handlePrefixResize(),
  });

  /** @private */
  readonly #focusController = new FocusController(this, {
    target: null,
    callback: (focused) => {
      focused = focused && !(this.#control?.disabled ?? true);
      this.classList.toggle("-no-animate", false);
      this.#focused = focused;
      if (focused) {
        this.classList.toggle("-float-label", true);
      } else {
        this._invalid = !(this.#control?.checkValidity?.() ?? true);
        this.notifyControlStateChange();
      }
    },
  });

  /** @private */ @query(".base") private readonly _base!: HTMLElement;
  /** @private */ @query(".prefix") private readonly _prefix!: HTMLElement;
  /** @private */ @query(".error") private readonly _error!: HTMLElement;
  /** @private */ @query(".hint") private readonly _hint!: HTMLElement;

  /** @private */
  readonly #hintMutationController = new MutationController(this, {
    target: null,
    config: { childList: true, subtree: true },
    callback: () => this.#handleHintChange(),
  });

  /** @private */
  readonly #errorMutationController = new MutationController(this, {
    target: null,
    config: { childList: true, subtree: true },
    callback: () => this.#handleErrorChange(),
  });

  /** @private */ #focused = false;
  /** @private */ @state() private _pseudoLabel = "";
  /** @private */ @state() private _required = false;
  /** @private */ @state() private _invalid = false;
  /** @private */ @state() private _validationMessage = "";
  /** @private */ #hintText = "";
  /** @private */ #errorText = "";

  constructor() {
    super();

    new HoverController(this, { callback: () => this.classList.toggle("-no-animate", false) });
    new PressedController(this, {
      callback: (pressed) => this.classList.toggle("-pressed", pressed && !(this.#control?.disabled ?? true)),
    });
  }

  /** @private */
  get #shouldFloatLabel(): boolean {
    return this.#control?.shouldLabelFloat !== undefined
      ? this.#control.shouldLabelFloat === true
      : typeof this.#control?.value == "string" && this.#control.value.length > 0;
  }

  /** A reference to the element used to anchor dropdown menus. */
  get menuAnchor() {
    return this._base;
  }

  /** A reference to the hosted form field control. */
  get control() {
    return this.#control;
  }

  /**
   * The appearance variant of the field.
   * @default "outlined"
   */
  @property({ reflect: true }) variant: FormFieldVariant = "outlined";

  /**
   * Whether the required marker should be hidden.
   * @default false
   */
  @property({ attribute: "hide-required-marker", type: Boolean, reflect: true }) hideRequiredMarker = false;

  /**
   * Whether subscript content is hidden.
   * @default "auto"
   */
  @property({ attribute: "hide-subscript", reflect: true }) hideSubscript: HideSubscriptType = "auto";

  /**
   * Specifies whether the label should float always or only when necessary.
   * @default "auto"
   */
  @property({ attribute: "float-label", reflect: true }) floatLabel: FloatLabelType = "auto";

  /**
   * Notifies the form field that the state of the hosted `control` has changed.
   * @param {boolean} [checkValidity=false] Whether to check validity.
   */
  notifyControlStateChange(checkValidity: boolean = false): void {
    this._required = this.#control?.required === true;
    this.classList.toggle("-required", this._required);
    this.classList.toggle("-disabled", this.#control?.disabled === true);
    this.classList.toggle("-readonly", isReadOnlyMixin(this.#control) && this.#control.readOnly === true);
    if (this.floatLabel === "auto") {
      this.classList.toggle("-float-label", this.#shouldFloatLabel || this.#focused);
    }

    if (checkValidity) {
      this._invalid = !(this.#control?.checkValidity?.() ?? true);
    }

    this.classList.toggle("-invalid", this._invalid);

    this._validationMessage = this.#control?.validationMessage ?? "";
    if (!this.isUpdatePending) {
      this.performUpdate();
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    // Label animations are disabled on initial paint.
    this.classList.toggle("-no-animate", true);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#changeControl(null);
  }

  /** @private */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    this.#focusController.observe(this._base);

    this.#hintMutationController.observe(this._hint);
    this.#handleHintChange();

    this.#errorMutationController.observe(this._error);
    this.#handleErrorChange();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has("_invalid") && this.#control) {
      this.#control.ariaInvalid = this._invalid ? "true" : null;

      if (this.#errorText) {
        if (this._invalid) {
          M3eAriaDescriber.describe(this.#control, this.#errorText);
        } else {
          M3eAriaDescriber.removeDescription(this.#control, this.#errorText);
        }
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" @click="${this.#handleContainerClick}">
        ${this.variant === "outlined"
          ? html`<div class="outline" aria-hidden="true">
              <div class="outline-start"></div>
              <div class="outline-notch">
                <div class="pseudo-label">
                  ${this._pseudoLabel} ${!this.hideRequiredMarker && this._required ? html`&nbsp;*` : nothing}
                </div>
              </div>
              <div class="outline-end"></div>
            </div>`
          : nothing}
        <div class="prefix">
          <slot name="prefix" @slotchange="${this.#handlePrefixSlotChange}"></slot>
        </div>
        <div class="content">
          <span class="prefix-text"><slot name="prefix-text"></slot></span>
          <span class="input">
            <slot @slotchange="${this.#handleSlotChange}" @change="${this.#handleControlChange}"></slot>
          </span>
          <span class="suffix-text"><slot name="suffix-text"></slot></span>
          <span class="label">
            <slot name="label" @slotchange="${this.#handleLabelSlotChange}"></slot>
            ${!this.hideRequiredMarker && this._required
              ? html`<span class="required-marker" aria-hidden="true">&nbsp;*</span>`
              : nothing}
          </span>
        </div>
        <div
          class="suffix"
          @click="${this.#stopPropagation}"
          @focusin="${this.#stopPropagation}"
          @focusout="${this.#stopPropagation}"
          @pointerdown="${this.#stopPropagation}"
          @keydown="${this.#stopPropagation}"
          @keyup="${this.#stopPropagation}"
        >
          <slot name="suffix" @slotchange="${this.#handleSuffixSlotChange}"></slot>
        </div>
      </div>
      <span class="subscript" aria-hidden="true">
        <span class="error"><slot name="error">${this._validationMessage}</slot></span>
        <span class="hint"><slot name="hint"></slot></span>
      </span>`;
  }

  /** @private */
  #stopPropagation(e: Event): void {
    e.stopImmediatePropagation();
    e.stopPropagation();
  }

  /** @private */
  #handleLabelSlotChange(e: Event): void {
    const assignedElements = (<HTMLSlotElement>e.target).assignedElements({ flatten: true });
    this.classList.toggle("-with-label", assignedElements.length > 0);
    this._pseudoLabel = assignedElements[0]?.textContent ?? "";
  }

  /** @private */
  #handlePrefixSlotChange(e: Event): void {
    this.classList.toggle("-with-prefix", hasAssignedNodes(<HTMLSlotElement>e.target));
    this.#resizeController.observe(this._prefix);
  }

  /** @private */
  #handleSuffixSlotChange(e: Event): void {
    this.classList.toggle("-with-suffix", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handlePrefixResize(): void {
    if (this.variant === "outlined") {
      this._base.style.setProperty("--_prefix-width", `${this._prefix.clientWidth}px`);
    }
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#changeControl(findFormFieldControl(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleContainerClick(e: MouseEvent): void {
    if (this.#control && !this.#focused && !this.#control.disabled) {
      if (this.#control.onContainerClick) {
        this.#control.onContainerClick(e);
      } else {
        this.#control.focus();
      }
    }
  }

  /** @private */
  #handleControlInvalid(): void {
    this._invalid = true;
    this.notifyControlStateChange();
  }

  /** @private */
  #handleControlChange(): void {
    this._invalid = !(this.#control?.checkValidity?.() ?? true);
    this.notifyControlStateChange();
  }

  /** @private */
  #handleFormReset(): void {
    this._invalid = false;
    setTimeout(() => this.notifyControlStateChange());
  }

  /** @private */
  #changeControl(control: FormFieldControl | null): void {
    if (this.#control === control) return;
    if (this.#control) {
      if (this.#hintText) {
        M3eAriaDescriber.removeDescription(this.#control, this.#hintText);
      }
      if (this.#errorText) {
        M3eAriaDescriber.removeDescription(this.#control, this.#errorText);
      }

      this.#controlMutationController.unobserve(this.#control);
      this.#control.removeEventListener("invalid", this.#controlInvalidHandler);
      this.#control.form?.removeEventListener("reset", this.#formResetHandler);
      this.#removeValueInterceptor?.();
      this.#removeValueInterceptor = undefined;
    }
    this.#control = control;

    if (["INPUT", "TEXTAREA"].includes(this.#control?.tagName ?? "")) {
      this._base.style.setProperty("--_form-field-cursor", "text");
    } else {
      this._base.style.removeProperty("--_form-field-cursor");
    }

    this.classList.toggle("-with-select", this.#control?.tagName === "M3E-SELECT");
    if (this.classList.contains("-with-select")) {
      this._base.style.setProperty("--_form-field-cursor", "pointer");
    }

    if (this.#control) {
      this.#controlMutationController.observe(this.#control);
      this.#control.addEventListener("invalid", this.#controlInvalidHandler);
      this.#control.form?.addEventListener("reset", this.#formResetHandler);
      this.#control.removeAttribute("aria-invalid");

      if (this.#hintText) {
        M3eAriaDescriber.describe(this.#control, this.#hintText);
      }

      this.notifyControlStateChange();

      const tagname = this.#control.tagName.toLowerCase();
      if (tagname.startsWith("m3e-") && !customElements.get(tagname)) {
        customElements.whenDefined(tagname).then(() => this.#bindValueInterceptor());
      } else {
        this.#bindValueInterceptor();
      }
    }
  }

  /** @private */
  #bindValueInterceptor(): void {
    if (!this.#control) return;
    this.#removeValueInterceptor = interceptProperty(this.#control, "value", {
      set: (value, setter) => {
        setter(value);
        this.notifyControlStateChange(true);
      },
    });
  }

  /** @private */
  #handleHintChange(): void {
    const hintText = getTextContent(this._hint, true);
    if (hintText === this.#hintText) return;

    if (this.#control && this.#hintText) {
      M3eAriaDescriber.removeDescription(this.#control, this.#hintText);
    }

    this.#hintText = hintText;

    if (this.#control && this.#hintText) {
      M3eAriaDescriber.describe(this.#control, this.#hintText);
    }
  }

  /** @private */
  #handleErrorChange(): void {
    const errorText = getTextContent(this._error, true);
    if (errorText === this.#errorText) return;

    if (this.#control && this.#errorText) {
      M3eAriaDescriber.removeDescription(this.#control, this.#errorText);
    }

    this.#errorText = errorText;

    if (this.#control && this.#errorText && this._invalid) {
      M3eAriaDescriber.describe(this.#control, this.#errorText);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-form-field": M3eFormFieldElement;
  }
}
