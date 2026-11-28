import type { Page } from "@playwright/test";

type StepperElement = HTMLElement & {
  selectedIndex: number;
  steps: readonly HTMLElement[];
  moveNext(): boolean;
  movePrevious(): boolean;
  moveTo(index: number): boolean;
  reset(): void;
};

const stepNames = ["One", "Two", "Three"];

export class StepperHarness {
  markup = "";
  lastMovement?: boolean;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get stepper() {
    return this.page.locator("m3e-stepper");
  }

  get tabs() {
    return this.stepper.getByRole("tab");
  }

  get panels() {
    return this.stepper.getByRole("tabpanel");
  }

  tab(name: string) {
    return this.stepper.getByRole("tab", { name, exact: true });
  }

  panel(name: string) {
    return this.stepper.locator(`#p${stepNames.indexOf(name) + 1}`);
  }

  prepare(attributes = "", stepAttributes: string[] = ["", "", ""]) {
    this.markup = `
      <m3e-stepper ${attributes}>
        <m3e-step for="p1" ${stepAttributes[0]}>One</m3e-step>
        <m3e-step for="p2" ${stepAttributes[1]}>Two</m3e-step>
        <m3e-step for="p3" ${stepAttributes[2]}>Three</m3e-step>
        <m3e-step-panel id="p1">
          <form><input name="a" aria-label="A" required /></form>
          <div slot="actions"><m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button></div>
        </m3e-step-panel>
        <m3e-step-panel id="p2">
          <form><input name="b" aria-label="B" /></form>
          <div slot="actions">
            <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
            <m3e-button><m3e-stepper-next>Next2</m3e-stepper-next></m3e-button>
          </div>
        </m3e-step-panel>
        <m3e-step-panel id="p3">
          Done
          <div slot="actions">
            <m3e-button><m3e-stepper-previous>Back3</m3e-stepper-previous></m3e-button>
            <m3e-button><m3e-stepper-reset>Reset</m3e-stepper-reset></m3e-button>
          </div>
        </m3e-step-panel>
      </m3e-stepper>`;
  }

  render() {
    return this.renderFixture(this.markup);
  }

  index() {
    return this.stepper.evaluate((element) => (element as StepperElement).selectedIndex);
  }

  moveNext() {
    return this.stepper.evaluate((element) => (element as StepperElement).moveNext());
  }

  movePrevious() {
    return this.stepper.evaluate((element) => (element as StepperElement).movePrevious());
  }

  moveTo(index: number) {
    return this.stepper.evaluate((element, index) => (element as StepperElement).moveTo(index), index);
  }

  reset() {
    return this.stepper.evaluate((element) => (element as StepperElement).reset());
  }

  recordEvents() {
    return this.stepper.evaluate((element) => {
      element.dataset.events = "";
      for (const name of ["beforeinput", "input", "change"]) {
        element.addEventListener(name, () => {
          element.dataset.events = `${element.dataset.events ?? ""}${name},`;
        });
      }
    });
  }

  events() {
    return this.stepper.evaluate((element) => element.dataset.events?.split(",").filter(Boolean) ?? []);
  }

  cancelBeforeInput(name: string) {
    return this.tab(name).evaluate((element) =>
      element.addEventListener("beforeinput", (event) => event.preventDefault()),
    );
  }

  addFourthStep() {
    return this.stepper.evaluate((element) => {
      const step = document.createElement("m3e-step");
      step.setAttribute("for", "p4");
      step.textContent = "Four";

      const panel = document.createElement("m3e-step-panel");
      panel.id = "p4";
      panel.textContent = "Fourth panel";

      element.append(step, panel);
    });
  }

  stepCount() {
    return this.stepper.evaluate((element) => (element as StepperElement).steps.length);
  }
}
