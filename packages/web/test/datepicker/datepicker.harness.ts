import type { M3eDatepickerElement } from "@m3e/web/datepicker";
import type { M3eDateInputElement } from "@m3e/web/date-input";
import type { Page } from "@playwright/test";

export class DatepickerHarness {
  attributes = 'start-at="2026-01-15"';
  withToggle = false;
  withInput = false;

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get picker() {
    return this.page.locator("m3e-datepicker");
  }
  get trigger() {
    return this.page.locator("#trigger");
  }
  get input() {
    return this.page.locator("m3e-date-input");
  }

  async show() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(`
      <button id="trigger">Choose date${this.withToggle ? '<m3e-datepicker-toggle for="picker"></m3e-datepicker-toggle>' : ""}</button>
      <button id="other-trigger">Other date</button>
      ${this.withInput ? '<m3e-date-input id="date-input" value="2026-01-15"></m3e-date-input>' : ""}
      <m3e-datepicker id="picker" aria-label="Choose a date" ${this.withInput ? 'for="date-input"' : ""} ${this.attributes}></m3e-datepicker>
    `);
    if (this.withInput) {
      await this.page.waitForFunction(() => {
        const picker = document.querySelector("m3e-datepicker") as M3eDatepickerElement | null;
        return picker?.control?.id === "date-input";
      });
    }
    if (this.withToggle) {
      await this.page.waitForFunction(() => {
        const toggle = document.querySelector("m3e-datepicker-toggle");
        return toggle?.parentElement?.getAttribute("aria-haspopup") === "dialog";
      });
    }
  }

  open() {
    return this.picker.evaluate(async (picker: M3eDatepickerElement) => {
      const trigger = document.querySelector<HTMLElement>("#trigger");
      if (!trigger) throw new Error("Datepicker trigger is missing.");
      await picker.show(trigger);
    });
  }

  observeChanges(includeInput = false) {
    return this.page.evaluate((include) => {
      const picker = document.querySelector("m3e-datepicker");
      if (!picker) throw new Error("Datepicker is missing.");
      const input = document.querySelector("m3e-date-input");
      if (include && !input) throw new Error("Date input is missing.");
      for (const element of include && input ? [picker, input] : [picker]) {
        element.setAttribute("data-changes", "0");
        element.addEventListener("change", (event) => {
          if (event.target === element) {
            element.setAttribute("data-changes", String(Number(element.getAttribute("data-changes")) + 1));
          }
        });
      }
    }, includeInput);
  }

  selectFiveDaysLater() {
    return this.page.keyboard.press("ArrowRight").then(async () => {
      for (let i = 1; i < 5; i++) await this.page.keyboard.press("ArrowRight");
      await this.page.keyboard.press("Enter");
    });
  }

  dates() {
    return this.picker.evaluate((picker: M3eDatepickerElement) => {
      const local = (date: Date | null) =>
        date &&
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return { date: local(picker.date), start: local(picker.rangeStart), end: local(picker.rangeEnd) };
    });
  }

  inputDate() {
    return this.input.evaluate((input: M3eDateInputElement) => {
      const date = input.value;
      return (
        date &&
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
      );
    });
  }
}
