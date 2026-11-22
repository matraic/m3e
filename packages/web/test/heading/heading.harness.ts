import type { Page } from "@playwright/test";

export class HeadingHarness {
  html = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  heading(index = 0) {
    return this.page.locator("m3e-heading").nth(index);
  }

  markup(content: string, attributes = "") {
    return `<m3e-heading ${attributes}>${content}</m3e-heading>`;
  }

  async render() {
    await this.renderFixture(this.html);
  }

  async appearance(index = 0) {
    return this.heading(index).evaluate((element) => {
      const heading = element as HTMLElement & { variant: string; size: string; emphasized: boolean };
      return { variant: heading.variant, size: heading.size, emphasized: heading.emphasized };
    });
  }

  async typography(index = 0) {
    return this.heading(index).evaluate((element) => {
      const style = getComputedStyle(element);
      return {
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        lineHeight: style.lineHeight,
        letterSpacing: style.letterSpacing,
      };
    });
  }
}
