import { customElement } from "lit/decorators.js";

import { StepperButtonElementBase } from "./StepperButtonElementBase";

/**
 * An element, nested within a clickable element, used to reset a stepper to its initial state.
 * @tag m3e-stepper-reset
 *
 * @slot - Renders the content of the action.
 */
@customElement("m3e-stepper-reset")
export class M3eStepperResetElement extends StepperButtonElementBase {
  constructor() {
    super("reset");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-stepper-reset": M3eStepperResetElement;
  }
}
