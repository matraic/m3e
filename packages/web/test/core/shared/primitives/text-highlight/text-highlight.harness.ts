import type { M3eTextHighlightElement } from "@m3e/web/core";
import type { Page } from "@playwright/test";

export class TextHighlightHarness {
  markup = "";
  eventRanges: string[] = [];

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-text-highlight").first();
  }

  show() {
    return this.renderFixture(this.markup);
  }

  ranges(selector = "m3e-text-highlight") {
    return this.page
      .locator(selector)
      .evaluate((element: M3eTextHighlightElement) => element.ranges.map((range) => range.toString()));
  }
}
