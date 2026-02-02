import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import { AttachInternals, DesignToken } from "@m3e/core";
import { SelectionManager, selectionManager } from "@m3e/core/a11y";
import { Breakpoint, M3eBreakpointObserver } from "@m3e/core/layout";

import { M3eStepElement } from "./StepElement";
import { StepLabelPosition } from "./StepLabelPosition";
import { StepHeaderPosition } from "./StepHeaderPosition";
import { StepperOrientation } from "./StepperOrientation";

/**
 * Provides a wizard-like workflow by dividing content into logical steps.
 *
 * @description
 * The `m3e-stepper` component orchestrates a structured, wizard-like workflow by dividing
 * content into discrete, navigable steps. It supports horizontal and vertical orientations,
 * linear progression, and configurable label and header positioning.
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
 * @tag m3e-stepper
 *
 * @attr header-position - The position of the step header, when oriented horizontally.
 * @attr label-position - The position of the step labels, when oriented horizontally.
 * @attr linear - Whether the validity of previous steps should be checked or not.
 * @attr orientation - The orientation of the stepper.
 *
 * @slot step - Renders a step.
 * @slot panel - Renders a panel.
 *
 * @fires change - Emitted when the selected step changes.
 *
 * @cssprop --m3e-step-divider-thickness - Thickness of the divider line between steps.
 * @cssprop --m3e-step-divider-color - Color of the divider line between steps.
 * @cssprop --m3e-step-divider-inset - Inset offset for divider alignment within step layout.
 */
@customElement("m3e-stepper")
export class M3eStepperElement extends AttachInternals(LitElement) {
  static {
    if (document) {
      const lightDomStyle = new CSSStyleSheet();
      lightDomStyle.replaceSync(
        css`
          m3e-stepper:not(.-vertical) > .-m3e-step-divider::before {
            border-bottom-width: var(--m3e-step-divider-thickness, 1px);
            border-bottom-style: solid;
            border-bottom-color: var(--m3e-step-divider-color, ${DesignToken.color.outline});
          }
          m3e-stepper:not(.-vertical) > [slot="step"]:not(.-m3e-step-divider):not(:first-of-type)::before,
          m3e-stepper:not(.-vertical) > [slot="step"]:not(.-m3e-step-divider):not(:last-of-type)::after {
            border-bottom-width: var(--m3e-step-divider-thickness, 1px);
            border-bottom-style: solid;
            border-bottom-color: var(--m3e-step-divider-color, ${DesignToken.color.outline});
          }
          m3e-stepper:not(.-vertical)[label-position="end"] > .-m3e-step-divider {
            margin-block: auto;
          }
          m3e-stepper:not(.-vertical)[label-position="below"] > .-m3e-step-divider::before,
          m3e-stepper:not(.-vertical)[label-position="below"]
            > [slot="step"]:not(.-m3e-step-divider):not(:first-of-type)::before,
          m3e-stepper:not(.-vertical)[label-position="below"]
            > [slot="step"]:not(.-m3e-step-divider):not(:last-of-type)::after {
            margin-block-start: calc(var(--m3e-step-padding, 1.5rem) + calc(var(--m3e-step-icon-size, 1.5rem) / 2));
          }
          m3e-stepper.-vertical > [slot="panel"] {
            margin-inline-start: calc(var(--m3e-step-padding, 1.5rem) + calc(var(--m3e-step-icon-size, 1.5rem) / 2));
          }
          m3e-stepper.-vertical > [slot="panel"]:not(:last-of-type) {
            border-inline-start-width: var(--m3e-step-divider-thickness, 1px);
            border-inline-start-style: solid;
            border-inline-start-color: var(--m3e-step-divider-color, ${DesignToken.color.outline});
          }
          m3e-stepper.-vertical > [slot="step"]:not(.-m3e-step-divider):not(:first-of-type)::before,
          m3e-stepper.-vertical > [slot="step"]:not(.-m3e-step-divider):not(:last-of-type)::after {
            margin-inline-start: calc(var(--m3e-step-padding, 1.5rem) + calc(var(--m3e-step-icon-size, 1.5rem) / 2));
            border-inline-start-width: var(--m3e-step-divider-thickness, 1px);
            border-inline-start-style: solid;
            border-inline-start-color: var(--m3e-step-divider-color, ${DesignToken.color.outline});
          }
        `.toString(),
      );

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, lightDomStyle];
    }
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
    }
    :host(:not(.-vertical)) .header {
      display: flex;
      align-items: flex-start;
      flex-wrap: nowrap;
    }
    :host(:not(.-vertical)) ::slotted(.-m3e-step-divider) {
      flex: 1 1 auto;
      position: relative;
      min-width: 2rem;
    }
    :host(:not(.-vertical)) ::slotted(.-m3e-step-divider)::before {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
    }
    :host(:not(.-vertical):not([label-position="below"])) ::slotted(.-m3e-step-divider)::before {
      top: 50%;
    }
    :host(:not(.-vertical)) ::slotted([slot="step"]) {
      align-self: stretch;
    }
    :host(:not(.-vertical)) ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before,
    :host(:not(.-vertical)) ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      content: "";
      display: block;
      position: absolute;
      top: 0;
    }
    :host(:not(.-vertical)[label-position="end"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before,
    :host(:not(.-vertical)[label-position="end"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      top: 50%;
    }
    :host(:not(:dir(rtl)):not(.-vertical)[label-position="end"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before {
      left: 0;
      right: calc(100% - var(--m3e-step-padding, 1.5rem) + var(--m3e-step-divider-inset, 0.5rem));
    }
    :host(:dir(rtl):not(.-vertical)[label-position="end"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before {
      right: 0;
      left: calc(100% - var(--m3e-step-padding, 1.5rem) + var(--m3e-step-divider-inset, 0.5rem));
    }
    :host(:not(:dir(rtl)):not(.-vertical)[label-position="end"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      left: calc(100% - var(--m3e-step-padding, 1.5rem) + var(--m3e-step-divider-inset, 0.5rem));
      right: 0;
    }
    :host(:dir(rtl):not(.-vertical)[label-position="end"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      right: calc(100% - var(--m3e-step-padding, 1.5rem) + var(--m3e-step-divider-inset, 0.5rem));
      left: 0;
    }
    :host(:not(:dir(rtl)):not(.-vertical)[label-position="below"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before {
      left: 0;
      right: calc(50% + calc(var(--m3e-step-icon-size, 1.5rem) / 2) + var(--m3e-step-divider-inset, 0.5rem));
    }
    :host(:dir(rtl):not(.-vertical)[label-position="below"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before {
      right: 0;
      left: calc(50% + calc(var(--m3e-step-icon-size, 1.5rem) / 2) + var(--m3e-step-divider-inset, 0.5rem));
    }
    :host(:not(:dir(rtl)):not(.-vertical)[label-position="below"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      left: calc(50% + calc(var(--m3e-step-icon-size, 1.5rem) / 2) + var(--m3e-step-divider-inset, 0.5rem));
      right: 0;
    }
    :host(:dir(rtl):not(.-vertical)[label-position="below"])
      ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      right: calc(50% + calc(var(--m3e-step-icon-size, 1.5rem) / 2) + var(--m3e-step-divider-inset, 0.5rem));
      left: 0;
    }
    :host(:not(.-vertical)[label-position="below"]) {
      --_step-direction: column;
      --_step-label-align-items: center;
    }
    :host(.-vertical) .header {
      display: contents;
    }
    :host(.-vertical) ::slotted([slot="step"]:not(.-m3e-step-divider)) {
      flex: none;
    }
    :host(.-vertical) ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before,
    :host(.-vertical) ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      content: "";
      display: block;
      position: absolute;
      left: 0;
    }
    :host(.-vertical) ::slotted([slot="step"]:not(.-m3e-step-divider):not(:first-of-type))::before {
      top: 0;
      bottom: calc(100% - var(--m3e-step-padding, 1.5rem) + var(--m3e-step-divider-inset, 0.5rem));
    }
    :host(.-vertical) ::slotted([slot="step"]:not(.-m3e-step-divider):not(:last-of-type))::after {
      top: calc(100% - var(--m3e-step-padding, 1.5rem) + var(--m3e-step-divider-inset, 0.5rem));
      bottom: 0;
    }
    :host(:not(.-vertical)) {
      --m3e-collapsible-animation-duration: 0ms;
    }
    :host(.-no-animate) {
      --m3e-collapsible-animation-duration: 0ms;
    }
  `;

  /** @private */ #breakpointUnobserve?: () => void;
  /** @private */ @state() private _orientation?: Exclude<StepperOrientation, "auto">;
  /** @private */ @state() private _selectedIndex: number | null = null;
  /** @internal */ readonly [selectionManager] = new SelectionManager<M3eStepElement>()
    .withHomeAndEnd()
    .withWrap()
    .onSelectedItemsChange(() => this.#handleSelectedChange());

  /**
   * The position of the step header, when oriented horizontally.
   * @default "above"
   */
  @property({ attribute: "header-position", reflect: true }) headerPosition: StepHeaderPosition = "above";

  /**
   * The position of the step labels, when oriented horizontally.
   * @default "end"
   */
  @property({ attribute: "label-position", reflect: true }) labelPosition: StepLabelPosition = "end";

  /**
   * Whether the validity of previous steps should be checked or not.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) linear = false;

  /**
   * The orientation of the stepper.
   * @default "horizontal"
   */
  @property({ reflect: true }) orientation: StepperOrientation = "horizontal";

  /** The steps. */
  get steps(): readonly M3eStepElement[] {
    return this[selectionManager]?.items ?? [];
  }

  /** The selected step. */
  get selectedStep(): M3eStepElement | null {
    return this._selectedIndex !== null ? (this.steps[this._selectedIndex] ?? null) : null;
  }

  /** The zero-based index of the selected step. */
  get selectedIndex(): number {
    return this._selectedIndex ?? -1;
  }

  /**
   * Moves the stepper to the previous step.
   * @returns {boolean} Whether the stepper moved to the previous step.
   */
  movePrevious(): boolean {
    return this.moveTo((this._selectedIndex ?? 1) - 1);
  }

  /**
   * Moves the stepper to the next step.
   * @returns {boolean} Whether the stepper moved to the next step.
   */
  moveNext(): boolean {
    return this.moveTo((this._selectedIndex ?? -1) + 1);
  }

  /**
   * Moves the stepper to the step with the specified index.
   * @param index The zero-based index of the step to which to move.
   * @returns {boolean} Whether the stepper moved to the specified `index`.
   */
  moveTo(index: number): boolean {
    const selectedStep = this.selectedStep;
    if (selectedStep && selectedStep.index === index) {
      return true;
    }

    if (this.steps[index]?.disabled) {
      return false;
    }

    if (index >= 0 && index < this.steps.length) {
      if (selectedStep) {
        const valid = this.#checkValidity();
        if (this.linear) {
          if (index < selectedStep.index) {
            const previousStep = this[selectionManager].items[index];
            if (!previousStep || (previousStep.completed && !previousStep.editable)) {
              return false;
            }
          } else if (index > selectedStep.index + 1) {
            const nextStep = this[selectionManager].items[index];
            if (!nextStep || !nextStep.completed) {
              return false;
            }
          } else if (!valid && !selectedStep.optional) {
            return false;
          }
        }

        selectedStep.completed = true;
      }

      this._selectedIndex = index;
      this[selectionManager].select(this.selectedStep);
      this.dispatchEvent(new Event("change", { bubbles: true }));
      return true;
    } else {
      if (selectedStep) {
        this[selectionManager].deselect(selectedStep);
        this.dispatchEvent(new Event("change", { bubbles: true }));
      }
      return false;
    }
  }

  /** Resets the stepper to its initial state, clearing any form data. */
  reset(): void {
    this.steps.forEach((x) => x.reset());
    const index = this.steps.findIndex((x) => !x.disabled);
    if (index !== this._selectedIndex) {
      this._selectedIndex = index;
      this[selectionManager].select(this.selectedStep);
      this.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.classList.toggle("-no-animate", true);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this._orientation = undefined;
    this.#breakpointUnobserve?.();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has("orientation")) {
      this.#breakpointUnobserve?.();

      if (this.orientation === "auto") {
        this.#breakpointUnobserve = M3eBreakpointObserver.observe([Breakpoint.XSmall], (matches) => {
          this._orientation = matches.get(Breakpoint.XSmall) ? "vertical" : "horizontal";
          this.#updateDisplayOrder();
        });
      } else {
        this._orientation = undefined;
        this.#updateDisplayOrder();
      }
    }
    if (changedProperties.has("_orientation")) {
      this.#updateDisplayOrder();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    let panelIndex: number | undefined;
    if (this.selectedStep?.panel) {
      panelIndex = [...this.querySelectorAll("[slot='panel']")].indexOf(this.selectedStep.panel);
      if (panelIndex === -1) {
        panelIndex = undefined;
      }
    }

    if (!this[selectionManager].vertical) {
      return html`${this.headerPosition === "above" ? this.#renderHeader() : nothing}
        <m3e-slide class="steps" selected-index="${ifDefined(panelIndex)}">
          <slot name="panel"></slot>
        </m3e-slide>
        ${this.headerPosition === "below" ? this.#renderHeader() : nothing}`;
    }

    return html`${this.#renderHeader()} <slot name="panel"></slot>`;
  }

  /** @private */
  #renderHeader(): unknown {
    return html`<div
      class="header"
      role="tablist"
      aria-orientation="${ifDefined(this[selectionManager].vertical ? "vertical" : undefined)}"
      @change="${this.#handleChange}"
    >
      <slot name="step" @slotchange="${this.#handleSlotChange}" @keydown="${this.#handleKeyDown}"></slot>
    </div>`;
  }

  /** @private */
  #handleChange(e: Event): void {
    e.stopPropagation();
    // Note: change event emitted from moveTo.
  }

  /** @private */
  #handleSlotChange(): void {
    const { added, removed } = this[selectionManager].setItems([...this.querySelectorAll("m3e-step")]);
    if (added.length > 0 || removed.length > 0) {
      this.querySelectorAll(".-m3e-step-divider").forEach((x) => x.remove());
      for (let i = 0; i < this[selectionManager].items.length; i++) {
        const step = this[selectionManager].items[i];
        step.index = i;
        if (i > 0) {
          const divider = document.createElement("div");
          divider.ariaHidden = "true";
          divider.classList.add("-m3e-step-divider");
          divider.slot = "step";
          step.insertAdjacentElement("beforebegin", divider);
        }
      }

      this.#updateDisplayOrder();

      if (this[selectionManager].selectedItems.length == 0) {
        this[selectionManager].select(this[selectionManager].items.find((x) => !x.disabled));
      }
    }
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this[selectionManager].onKeyDown(e);
  }

  /** @private */
  #handleSelectedChange(): void {
    const selected = this[selectionManager].selectedItems[0];
    let selectedIndex = selected ? this.steps.indexOf(selected) : null;
    if (selectedIndex === -1) {
      selectedIndex = null;
    }
    this._selectedIndex = selectedIndex;

    for (const step of this[selectionManager].items) {
      if (step.panel) {
        step.panel.active = step.index === selectedIndex;
      }
    }

    if (selected && this.matches(":focus-within") && !selected.matches(":focus")) {
      selected.focus();
    }

    if (this.classList.contains("-no-animate")) {
      requestAnimationFrame(() => this.classList.toggle("-no-animate", false));
    }
  }

  /** @private */
  #checkValidity(): boolean {
    let valid = false;
    if (this.selectedStep) {
      valid = this.selectedStep.panel?.querySelector("form")?.checkValidity() ?? true;
      if (this.selectedStep.optional) {
        valid = true;
      }
      this.selectedStep.invalid = !valid;
    }
    return valid;
  }

  /** @private */
  #updateDisplayOrder(): void {
    this[selectionManager].vertical = (this._orientation ?? this.orientation) === "vertical";
    this.classList.toggle("-vertical", this[selectionManager].vertical);

    if (!this[selectionManager].vertical) {
      this.steps.forEach((x) => {
        x.style.order = "";
        if (x.panel) {
          x.panel.style.order = "";
        }
      });
    } else {
      this.steps.forEach((x, i) => {
        x.style.order = `${i}`;
        if (x.panel) {
          x.panel.style.order = `${i}`;
        }
      });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-stepper": M3eStepperElement;
  }
}
