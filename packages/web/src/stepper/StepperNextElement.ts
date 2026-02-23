import { customElement } from "lit/decorators.js";

import { StepperButtonElementBase } from "./StepperButtonElementBase";

/**
 * An element, nested within a clickable element, used to move a stepper to the next step.
 * @tag m3e-stepper-previous
 *
 * @slot - Renders the content of the action.
 */
@customElement("m3e-stepper-next")
export class M3eStepperNextElement extends StepperButtonElementBase {
  constructor() {
    super("next");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-stepper-next": M3eStepperNextElement;
  }
}
