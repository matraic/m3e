import { customElement } from "@m3e/web/core";

import { StepperButtonElementBase } from "./StepperButtonElementBase";

/**
 * An element, nested within a clickable element, used to reset a stepper to its initial state.
 * @example
 * Showcase: Basic usage. Import `@m3e/web/stepper`. Also import `@m3e/web/form-field`, `@m3e/web/button`.
 *
 * ```html
 * <m3e-stepper>
 *   <m3e-step for="step1">Fill out your name</m3e-step>
 *   <m3e-step for="step2">Fill out your address</m3e-step>
 *   <m3e-step for="step3">Done</m3e-step>
 *   <m3e-step-panel id="step1">
 *     <form>
 *       <m3e-form-field>
 *         <label slot="label" for="name">Name</label>
 *         <input name="name" id="name" required />
 *       </m3e-form-field>
 *     </form>
 *     <div slot="actions">
 *       <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
 *     </div>
 *   </m3e-step-panel>
 *   <m3e-step-panel id="step2">
 *     <form>
 *       <m3e-form-field>
 *         <label slot="label" for="address">Address</label>
 *         <input name="address" id="address" required />
 *       </m3e-form-field>
 *     </form>
 *     <div slot="actions">
 *       <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
 *       <m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button>
 *     </div>
 *   </m3e-step-panel>
 *   <m3e-step-panel id="step3">
 *     Done
 *     <div slot="actions">
 *       <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
 *       <m3e-button><m3e-stepper-reset>Reset</m3e-stepper-reset></m3e-button>
 *     </div>
 *   </m3e-step-panel>
 * </m3e-stepper>
 * ```
 *
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
