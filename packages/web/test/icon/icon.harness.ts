import type { Page } from "@playwright/test";

export class IconHarness {
  html = "";
  setupScript?: string;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl", setupScript?: string) => Promise<void>,
  ) {}

  icon(index = 0) {
    return this.page.locator("m3e-icon").nth(index);
  }

  glyph(index = 0) {
    return this.icon(index).locator(".icon");
  }

  markup(name: string, attributes = "") {
    return `<m3e-icon name="${name}" ${attributes}></m3e-icon>`;
  }

  async render() {
    await this.renderFixture(this.html, undefined, this.setupScript);
  }
}
