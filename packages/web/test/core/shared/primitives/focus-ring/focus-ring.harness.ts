import type { Page } from "@playwright/test";

export class FocusRingHarness {
  attributes = "";
  disconnectedClasses = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get ring() {
    return this.page.locator("m3e-focus-ring");
  }

  get outline() {
    return this.page.locator("m3e-focus-ring .outline");
  }

  show() {
    return this.renderFixture(`<button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
      Press <m3e-focus-ring for="c" ${this.attributes}></m3e-focus-ring>
    </button>`);
  }
}
