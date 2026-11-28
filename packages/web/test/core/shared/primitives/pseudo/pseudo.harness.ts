import type { Page } from "@playwright/test";

export class PseudoHarness {
  tag = "";
  attributes = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator(this.tag);
  }

  show() {
    return this.renderFixture(`<${this.tag} ${this.attributes}></${this.tag}>`);
  }
}
