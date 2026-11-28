import type { Page } from "@playwright/test";

export class ScrollContainerHarness {
  attributes = "";
  short = false;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-scroll-container");
  }

  show() {
    const height = this.short ? 50 : 500;
    return this.renderFixture(`<m3e-scroll-container ${this.attributes} style="height: 100px">
      <div style="height: ${height}px">Content</div>
    </m3e-scroll-container>`);
  }

  state(name: string) {
    return this.element.evaluate((element, value) => element.matches(`:state(--${value})`), name);
  }
}
