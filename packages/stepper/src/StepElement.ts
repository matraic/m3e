import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  AttachInternals,
  DesignToken,
  Disabled,
  Focusable,
  HtmlFor,
  KeyboardClick,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  Role,
  Selected,
} from "@m3e/core";

import { addAriaReferencedId, removeAriaReferencedId, selectionManager } from "@m3e/core/a11y";

import type { M3eStepperElement } from "./StepperElement";
import { M3eStepPanelElement } from "./StepPanelElement";

/**
 * A step in a wizard-like workflow.
 *
 * @description
 * The `m3e-step` component represents a single step in a structured, wizard-like workflow.
 * It supports semantic labeling, stateful styling, and optional interaction for completed,
 * selected, invalid, or disabled states. It aligns with Material Design guidance for progressive
 * disclosure, accessible navigation, and visual continuity across horizontal and vertical layouts.
 *
 * @example
 * The following example demonstrates a linear multi-step form flow using the `m3e-stepper`
 * component. Each `m3e-step` defines a navigable step label, linked to its corresponding
 * `m3e-step-panel` via the `for` attribute. Navigation is orchestrated using the
 * `m3e-stepper-next`, `m3e-stepper-previous`, and `m3e-stepper-reset` components.
 *
 * <m3e-stepper>
 *  <m3e-step for="step1">Fill out your name</m3e-step>
 *  <m3e-step for="step2">Fill out your address</m3e-step>
 *  <m3e-step for="step3">Done</m3e-step>
 *  <m3e-step-panel id="step1">
 *    <form>
 *      <m3e-form-field>
 *        <label slot="label" for="name">Name</label>
 *        <input name="name" id="name" required />
 *      </m3e-form-field>
 *    </form>
 *    <div slot="actions">
 *      <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
 *    </div>
 *  </m3e-step-panel>
 *  <m3e-step-panel id="step2">
 *    <form>
 *      <m3e-form-field>
 *        <label slot="label" for="address">Address</label>
 *        <input name="address" id="address" required />
 *      </m3e-form-field>
 *    </form>
 *    <div slot="actions">
 *      <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
 *      <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
 *    </div>
 *  </m3e-step-panel>
 *  <m3e-step-panel id="step3">Done
 *    <div slot="actions">
 *      <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
 *      <m3e-button><m3e-stepper-reset>Reset</m3e-stepper-reset></m3e-button>
 *    </div>
 *  </m3e-step-panel>
 * </m3e-stepper>
 *
 * @tag m3e-step
 *
 * @slot - Renders the label of the step.
 * @slot icon - Renders the icon of the step.
 * @slot done-icon - Renders the icon of a completed step.
 * @slot edit-icon - Renders the icon of a completed editable step.
 * @slot error-icon - Renders icon of an invalid step.
 * @slot hint - Renders the hint text of the step.
 * @slot error - Renders the error message for an invalid step.
 *
 * @attr completed - Whether the step has been completed.
 * @attr disabled - Whether the element is disabled.
 * @attr editable - Whether the step is editable and users can return to it after completion.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr optional - Whether the step is optional.
 * @attr selected - Whether the element is selected.
 *
 * @fires input - Emitted when the selected state changes.
 * @fires change - Emitted when the selected state changes.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-step-shape - Border radius of the step container, defining its visual shape.
 * @cssprop --m3e-step-padding - Internal padding of the step container, used for layout spacing.
 * @cssprop --m3e-step-icon-shape - Border radius of the icon container, controlling its geometric form.
 * @cssprop --m3e-step-icon-size - Width and height of the icon container and icon glyph.
 * @cssprop --m3e-step-selected-icon-container-color - Background color of the icon when the step is selected.
 * @cssprop --m3e-step-selected-icon-color - Foreground color of the icon when the step is selected.
 * @cssprop --m3e-step-completed-icon-container-color - Background color of the icon when the step is completed.
 * @cssprop --m3e-step-completed-icon-color - Foreground color of the icon when the step is completed.
 * @cssprop --m3e-step-unselected-icon-container-color - Background color of the icon when the step is inactive.
 * @cssprop --m3e-step-unselected-icon-color - Foreground color of the icon when the step is inactive.
 * @cssprop --m3e-step-icon-error-color - Foreground color of the icon when the step is invalid.
 * @cssprop --m3e-step-disabled-icon-container-color - Base color used to mix the disabled icon background.
 * @cssprop --m3e-step-disabled-icon-color - Base color used to mix the disabled icon foreground.
 * @cssprop --m3e-step-label-color - Text color of the step label in its default state.
 * @cssprop --m3e-step-label-error-color - Text color of the step label when the step is invalid.
 * @cssprop --m3e-step-disabled-label-color - Base color used to mix the disabled label foreground.
 * @cssprop --m3e-step-font-size - Font size of the step label.
 * @cssprop --m3e-step-font-weight - Font weight of the step label.
 * @cssprop --m3e-step-line-height - Line height of the step label.
 * @cssprop --m3e-step-tracking - Letter spacing of the step label.
 * @cssprop --m3e-step-icon-label-space - Gap between icon and label.
 * @cssprop --m3e-step-hint-font-size - Font size of hint and error messages.
 * @cssprop --m3e-step-hint-font-weight - Font weight of hint and error messages.
 * @cssprop --m3e-step-hint-line-height - Line height of hint and error messages.
 * @cssprop --m3e-step-hint-tracking - Letter spacing of hint and error messages.
 * @cssprop --m3e-step-hint-color - Text color of hint messages in valid state.
 * @cssprop --m3e-step-disabled-hint-color - Base color used to mix the disabled hint foreground.
 */
@customElement("m3e-step")
export class M3eStepElement extends Selected(
  KeyboardClick(Focusable(HtmlFor(Disabled(AttachInternals(Role(LitElement, "tab"))))))
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      position: relative;
      outline: none;
      min-width: 0px;
      border-radius: var(--m3e-step-shape, ${DesignToken.shape.corner.medium});
      padding: var(--m3e-step-padding, 1.5rem);
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    :host(:not([aria-disabled="true"])) {
      cursor: pointer;
    }
    .icon {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--m3e-step-icon-shape, 50%);
      width: var(--m3e-step-icon-size, 1.5rem);
      height: var(--m3e-step-icon-size, 1.5rem);
    }
    .icon svg,
    ::slotted([slot="icon"]),
    ::slotted([slot="edit-icon"]),
    ::slotted([slot="done-icon"]),
    ::slotted([slot="error-icon"]) {
      width: 1em;
      font-size: var(--m3e-step-icon-size, 1.5rem) !important;
    }
    :host(:not([aria-disabled="true"])[selected]) .icon {
      background-color: var(--m3e-step-selected-icon-container-color, ${DesignToken.color.primary});
      color: var(--m3e-step-selected-icon-color, ${DesignToken.color.onPrimary});
    }
    :host(:not([aria-disabled="true"])[completed]:not([invalid])) .icon {
      background-color: var(--m3e-step-completed-icon-container-color, ${DesignToken.color.primary});
      color: var(--m3e-step-completed-icon-color, ${DesignToken.color.onPrimary});
    }
    :host(:not([aria-disabled="true"]):not([selected]):not([completed]):not([invalid])) .icon {
      background-color: var(--m3e-step-unselected-icon-container-color, ${DesignToken.color.inverseSurface});
      color: var(--m3e-step-unselected-icon-color, ${DesignToken.color.inverseOnSurface});
    }
    :host(:not([aria-disabled="true"]):not([selected])[invalid]) .icon {
      color: var(--m3e-step-icon-error-color, ${DesignToken.color.error});
    }
    :host([aria-disabled="true"]) .icon {
      background-color: color-mix(
        in srgb,
        var(--m3e-step-disabled-icon-container-color, ${DesignToken.color.onSurface}) 10%,
        transparent
      );
      color: color-mix(in srgb, var(--m3e-step-disabled-icon-color, ${DesignToken.color.onSurface}) 38%, transparent);
    }

    :host(:not([aria-disabled="true"])) .label {
      color: var(--m3e-step-label-color, ${DesignToken.color.onSurface});
    }
    :host(:not([aria-disabled="true"]):not([selected])[invalid]) .label {
      color: var(--m3e-step-label-error-color, ${DesignToken.color.error});
    }
    :host([aria-disabled="true"]) .label {
      color: color-mix(in srgb, var(--m3e-step-disabled-label-color, ${DesignToken.color.onSurface}) 38%, transparent);
    }
    .wrapper {
      display: flex;
      align-items: center;
      height: 100%;
      border-radius: inherit;
      font-size: var(--m3e-step-font-size, ${DesignToken.typescale.standard.title.small.fontSize});
      font-weight: var(--m3e-step-font-weight, ${DesignToken.typescale.standard.title.small.fontWeight});
      line-height: var(--m3e-step-line-height, ${DesignToken.typescale.standard.title.small.lineHeight});
      letter-spacing: var(--m3e-step-tracking, ${DesignToken.typescale.standard.title.small.tracking});
      flex-direction: var(--_step-direction, row);
      gap: var(--m3e-step-icon-label-space, 0.5rem);
      justify-content: flex-start;
    }
    .label {
      display: flex;
      flex-direction: column;
      align-items: var(--_step-label-align-items, flex-start);
    }
    ::slotted([slot="hint"]),
    .hint,
    ::slotted([slot="error"]) {
      font-size: var(--m3e-step-hint-font-size, ${DesignToken.typescale.standard.body.small.fontSize});
      font-weight: var(--m3e-step-hint-font-weight, ${DesignToken.typescale.standard.body.small.fontWeight});
      line-height: var(--m3e-step-hint-line-height, ${DesignToken.typescale.standard.body.small.lineHeight});
      letter-spacing: var(--m3e-step-hint-tracking, ${DesignToken.typescale.standard.body.small.tracking});
    }
    :host(:not([aria-disabled="true"]):not([invalid])) ::slotted([slot="hint"]),
    :host(:not([aria-disabled="true"]):not([invalid])) .hint {
      color: var(--m3e-step-hint-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host([aria-disabled="true"]) ::slotted([slot="hint"]),
    :host([aria-disabled="true"]) .hint {
      color: color-mix(in srgb, var(--m3e-step-disabled-hint-color, ${DesignToken.color.onSurface}) 38%, transparent);
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @private */ @query(".ripple") private readonly _ripple?: M3eRippleElement;
  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);

  /**
   * Whether the step is optional.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) optional = false;

  /**
   * Whether the step is editable and users can return to it after completion.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) editable = false;

  /**
   * Whether the step has been completed.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) completed = false;

  /**
   * Whether the step has an error.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) invalid = false;

  /** @internal */
  @state() index = -1;

  /** A reference to the panel controlled by the step. */
  get panel(): M3eStepPanelElement | null {
    return this.control instanceof M3eStepPanelElement ? this.control : null;
  }

  /** The stepper to which this step belongs. */
  get stepper(): M3eStepperElement | null {
    return this.closest("m3e-stepper");
  }

  /** Resets the step to its initial state, clearing any form data. */
  reset(): void {
    this.invalid = false;
    this.completed = false;
    this.panel?.querySelector("form")?.reset();
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    if (control instanceof M3eStepPanelElement) {
      control.id = control.id || `m3e-step-panel-${M3eStepElement.__nextId++}`;
      addAriaReferencedId(this, "aria-controls", control.id);
    }
    super.attach(control);
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control?.id) {
      removeAriaReferencedId(this, "aria-controls", this.control.id);
    }

    super.detach();
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    this.slot = "step";

    super.connectedCallback();
    this.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selected")) {
      this.closest("m3e-stepper")?.[selectionManager].notifySelectionChange(this);
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    [this._focusRing, this._stateLayer, this._ripple].forEach((x) => x?.attach(this));
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const hint = html`<slot name="hint">${this.optional ? html`<span class="hint">(Optional)</span>` : nothing}</slot>`;
    const error = html`<slot name="error">${hint}</slot>`;

    return html` <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
      <m3e-focus-ring class="focus-ring" ?disabled="${this.disabled}"></m3e-focus-ring>
      <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
      <div class="wrapper">
        <div class="icon" aria-hidden="true">${this.#renderIcon()}</div>
        <div class="label">
          <slot></slot>
          ${this.invalid ? error : hint}
        </div>
      </div>`;
  }

  /** @private */
  #renderIcon(): unknown {
    if (!this.selected) {
      if (this.invalid) {
        return html`<slot name="error-icon">
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path
              d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"
            />
          </svg>
        </slot>`;
      }
      if (this.completed) {
        if (this.editable) {
          return html`<slot name="edit-icon">
            <svg viewBox="0 -960 960 960" fill="currentColor">
              <path
                d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z"
              />
            </svg>
          </slot>`;
        }
        return html`<slot name="done-icon">
          <svg viewBox="0 -960 960 960" fill="currentColor">
            <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
          </svg>
        </slot>`;
      }
    }

    return html`<slot name="icon">${this.index + 1}</slot>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (this.disabled) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }

    if (e.defaultPrevented || this.selected) return;

    this.selected = true;
    if (
      this.dispatchEvent(new Event("input", { bubbles: true, composed: true, cancelable: true })) &&
      this.closest("m3e-stepper")?.moveTo(this.index)
    ) {
      this.dispatchEvent(new Event("change", { bubbles: true }));
    } else {
      this.selected = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-step": M3eStepElement;
  }
}
