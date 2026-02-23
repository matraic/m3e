import { customElement } from "lit/decorators.js";

import { StepperButtonElementBase } from "./StepperButtonElementBase";

/**
 * An element, nested within a clickable element, used to move a stepper to the previous step.
 * @tag m3e-stepper-previous
 *
 * @slot - Renders the content of the action.
 */
@customElement("m3e-stepper-previous")
export class M3eStepperPreviousElement extends StepperButtonElementBase {
  constructor() {
    super("previous");
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-stepper-previous": M3eStepperPreviousElement;
  }
}
