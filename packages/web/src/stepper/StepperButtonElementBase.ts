import { ActionElementBase } from "@m3e/web/core";

/** A base implementation for a button used to move to a step in a stepper. This class must be inherited. */
export abstract class StepperButtonElementBase extends ActionElementBase {
  /** @private */ readonly #action: "next" | "previous" | "reset";

  constructor(action: "next" | "previous" | "reset") {
    super();
    this.#action = action;
  }

  /** @inheritdoc */
  override _onClick(): void {
    switch (this.#action) {
      case "next":
        this.closest("m3e-stepper")?.moveNext();
        break;
      case "previous":
        this.closest("m3e-stepper")?.movePrevious();
        break;

      case "reset":
        this.closest("m3e-stepper")?.reset();
        break;
    }
  }
}
