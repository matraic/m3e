import type { M3eElevationElement } from "@m3e/web/core";
import type { Page } from "@playwright/test";

export class ElevationHarness {
  attributes = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-elevation");
  }

  get shadow() {
    return this.element.locator(".shadow");
  }

  show() {
    return this.renderFixture(`<button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
      Press <m3e-elevation for="c" ${this.attributes}></m3e-elevation>
    </button>`);
  }

  setLevel(level: number) {
    return this.element.evaluate(async (element: M3eElevationElement, value) => {
      Reflect.set(element, "level", value);
      await element.updateComplete;
    }, level);
  }
}
