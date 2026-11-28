import type { M3eDateInputElement } from "@m3e/web/date-input";
import type { M3eTimepickerDialElement, M3eTimepickerElement } from "@m3e/web/timepicker";
import type { Page } from "@playwright/test";

export class TimepickerHarness {
  attributes = 'date="2026-01-15T14:30:00" format="24" mode="input"';
  withToggle = false;
  withTimeInput = false;

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get picker() {
    return this.page.locator("#picker");
  }

  get trigger() {
    return this.page.locator("#trigger");
  }

  get dial() {
    return this.page.locator("m3e-timepicker-dial");
  }

  get timeInput() {
    return this.page.locator("#time-input");
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(`
      ${
        this.withToggle
          ? '<m3e-button id="trigger">Choose time<m3e-timepicker-toggle for="picker"></m3e-timepicker-toggle></m3e-button>'
          : '<button id="trigger">Choose time</button>'
      }
      <button id="outside" style="margin-top: 400px">Outside</button>
      ${
        this.withTimeInput
          ? '<m3e-date-input id="time-input" type="time" time-format="24" value="2026-01-15T14:30:00"></m3e-date-input>'
          : ""
      }
      <m3e-timepicker id="picker" aria-label="Choose a time" ${
        this.withTimeInput ? 'for="time-input"' : ""
      } ${this.attributes}></m3e-timepicker>
    `);

    if (this.withToggle) {
      await this.page.waitForFunction(
        () => document.querySelector("#trigger")?.getAttribute("aria-haspopup") === "dialog",
      );
    }

    if (this.withTimeInput) {
      await this.page.waitForFunction(() => {
        const picker = document.querySelector<M3eTimepickerElement>("#picker");
        return picker?.control?.id === "time-input";
      });
    }
  }

  async open() {
    await this.picker.evaluate(async (element) => {
      const trigger = document.querySelector<HTMLElement>("#trigger");
      if (!trigger) throw new Error("Timepicker trigger is missing.");
      await (element as M3eTimepickerElement).show(trigger);
    });
  }

  async observeChanges(includeTimeInput = false) {
    await this.page.evaluate((includeInput) => {
      const picker = document.querySelector("#picker");
      if (!picker) throw new Error("Timepicker is missing.");
      const input = document.querySelector("#time-input");
      if (includeInput && !input) throw new Error("Time-enabled date input is missing.");

      const elements = includeInput && input ? [picker, input] : [picker];
      for (const element of elements) {
        element.setAttribute("data-changes", "0");
        element.addEventListener("change", () => {
          element.setAttribute("data-changes", String(Number(element.getAttribute("data-changes")) + 1));
        });
      }
    }, includeTimeInput);
  }

  time() {
    return this.picker.evaluate((element) => {
      const date = (element as M3eTimepickerElement).date;
      if (!date) return null;
      const pad = (value: number) => String(value).padStart(2, "0");
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    });
  }

  inputTime() {
    return this.timeInput.evaluate((element) => {
      const date = (element as M3eDateInputElement).value;
      if (!date) return null;
      const pad = (value: number) => String(value).padStart(2, "0");
      return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    });
  }

  async selectDialHour(hour: number) {
    await this.#clickDialAt((hour % 12) * 30);
  }

  async selectDialMinute(minute: number) {
    await this.#clickDialAt(minute * 6);
  }

  async selectDialSecond(second: number) {
    await this.#clickDialAt(second * 6);
  }

  dialView() {
    return this.dial.evaluate((element) => (element as M3eTimepickerDialElement).view);
  }

  currentVariant() {
    return this.picker.evaluate((element) => (element as M3eTimepickerElement).currentVariant);
  }

  currentOrientation() {
    return this.picker.evaluate((element) => (element as M3eTimepickerElement).currentOrientation);
  }

  isOpen() {
    return this.picker.evaluate((element) => (element as M3eTimepickerElement).isOpen);
  }

  options() {
    return this.picker.evaluate((element) => {
      const picker = element as M3eTimepickerElement;
      return [picker.currentVariant, picker.currentOrientation, picker.format, picker.mode];
    });
  }

  async #clickDialAt(angle: number) {
    const base = this.dial.locator(".base");
    const box = await base.boundingBox();
    if (!box) throw new Error("Timepicker dial is not visible.");

    const radians = (angle * Math.PI) / 180;
    const radius = Math.min(box.width, box.height) * 0.4;
    await base.click({
      position: {
        x: box.width / 2 + Math.sin(radians) * radius,
        y: box.height / 2 - Math.cos(radians) * radius,
      },
    });
  }
}
