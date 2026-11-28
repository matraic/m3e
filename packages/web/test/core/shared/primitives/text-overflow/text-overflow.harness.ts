import type { Page } from "@playwright/test";

export class TextOverflowHarness {
  markup = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-text-overflow");
  }

  get base() {
    return this.element.locator(".base");
  }

  show() {
    return this.renderFixture(this.markup);
  }
}
