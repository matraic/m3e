import type { Page } from "@playwright/test";

export class StateLayerHarness {
  attributes = "";
  disconnectedClasses = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-state-layer");
  }

  get layer() {
    return this.element.locator(".layer");
  }

  show() {
    return this.renderFixture(`<button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
      Press <m3e-state-layer for="c" ${this.attributes}></m3e-state-layer>
    </button>`);
  }
}
