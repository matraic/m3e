import type { M3eDateInputElement } from "@m3e/web/date-input";
import type { Page } from "@playwright/test";

export class DateInputHarness {
  markup = "";
  initialHour = 0;
  initialValue = "";
  nextHourValue = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get input() {
    return this.page.locator("m3e-date-input").first();
  }

  segment(name: string) {
    return this.input.getByRole("spinbutton", { name, exact: true });
  }

  async show() {
    if (!this.markup) throw new Error("Date input markup is missing.");
    await this.renderFixture(this.markup);
    this.initialValue = (await this.value()) ?? "";
    if (this.initialValue) this.nextHourValue = await this.expectedNextHour();
    const hour = this.segment("Hour");
    if (await hour.count()) this.initialHour = Number(await hour.getAttribute("aria-valuenow"));
  }

  value() {
    return this.input.evaluate((input: M3eDateInputElement) => input.value?.toISOString() ?? null);
  }

  async nativeAccessibleName() {
    // Playwright's name computation omits labels associated with custom form controls.
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector: "m3e-date-input" });
      if (!nodeId) throw new Error("Date input is missing from the DOM.");
      const { nodes } = await session.send("Accessibility.getPartialAXTree", { nodeId, fetchRelatives: false });
      return nodes[0]?.name?.value;
    } finally {
      await session.detach();
    }
  }

  expectedNextHour() {
    return this.input.evaluate((input: M3eDateInputElement) => {
      if (!input.value) throw new Error("Date input has no initial value.");
      const date = input.value;
      return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        (date.getHours() + 1) % 24,
        date.getMinutes(),
      ).toISOString();
    });
  }

  recordEvents(cancel = false) {
    return this.input.evaluate((input, shouldCancel) => {
      const events: string[] = [];
      input.setAttribute("data-events", "");
      for (const type of ["beforeinput", "input", "change"]) {
        input.addEventListener(type, (event) => {
          events.push(event.type);
          input.setAttribute("data-events", events.join(", "));
          if (shouldCancel && event.type === "beforeinput") event.preventDefault();
        });
      }
    }, cancel);
  }

  formValues(id = "schedule") {
    return this.page.locator(`#${id}`).evaluate((form: HTMLFormElement) => Array.from(new FormData(form).entries()));
  }

  validity() {
    return this.input.evaluate((input: M3eDateInputElement) => {
      const valid = input.checkValidity();
      return {
        valid,
        valueMissing: input.validity.valueMissing,
        typeMismatch: input.validity.typeMismatch,
        rangeUnderflow: input.validity.rangeUnderflow,
        rangeOverflow: input.validity.rangeOverflow,
        customError: input.validity.customError,
      };
    });
  }

  moveToNewParent() {
    return this.input.evaluate((input) => {
      for (let i = 1; i <= 2; i++) {
        const parent = document.createElement("div");
        parent.id = `date-input-parent-${i}`;
        document.body.append(parent);
        parent.append(input);
      }
    });
  }

  moveToDestinationForm() {
    return this.input.evaluate((input) => {
      const form = document.getElementById("destination");
      if (!form) throw new Error("Destination form is missing.");
      form.append(input);
    });
  }
}
