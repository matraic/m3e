import type { Page } from "@playwright/test";

export class SelectionIndicatorHarness {
  attributes = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-selection-indicator");
  }

  get layer() {
    return this.element.locator(".layer");
  }

  async show(motion = false) {
    if (motion) await this.page.emulateMedia({ reducedMotion: "no-preference" });
    await this.renderFixture(`<button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
      Press <m3e-selection-indicator for="c" ${this.attributes}></m3e-selection-indicator>
    </button>`);
  }

  opacity() {
    return this.element.locator(".indicator").evaluate((element) => parseFloat(getComputedStyle(element).opacity));
  }

  origin() {
    return this.element.locator(".base").evaluate((element) => element.style.getPropertyValue("--_pressed-origin-x"));
  }
}
