import type { M3eRippleElement } from "@m3e/web/core";
import type { Page } from "@playwright/test";

export class RippleHarness {
  attributes = "";
  detachedVisible = false;
  bounds = { left: 0, top: 0, width: 0, height: 0 };

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-ripple");
  }

  get ripples() {
    return this.element.locator(".ripple");
  }

  show() {
    return this.renderFixture(`<button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
      Press <m3e-ripple for="c" ${this.attributes}></m3e-ripple>
    </button>`);
  }

  visible() {
    return this.element.evaluate((element: M3eRippleElement) => element.visible);
  }
}
