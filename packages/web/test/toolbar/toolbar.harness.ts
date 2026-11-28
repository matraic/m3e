import type { M3eToolbarElement } from "@m3e/web/toolbar";
import type { Page } from "@playwright/test";

export function toolbarFixture(attrs = "", disabled = "") {
  return `<m3e-toolbar ${attrs}>
    ${["One", "Two", "Three"].map((name) => `<m3e-icon-button aria-label="${name}" ${name === disabled ? "disabled" : ""}></m3e-icon-button>`).join("")}
  </m3e-toolbar>`;
}

export class ToolbarHarness {
  markup = "";
  direction = "ltr";
  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}
  get toolbar() {
    return this.page.locator("m3e-toolbar");
  }
  get actions() {
    return this.toolbar.locator("m3e-icon-button");
  }
  action(name: string) {
    return this.toolbar.getByRole("button", { name, exact: true });
  }
  async show() {
    await this.renderFixture(this.markup);
    await this.page.evaluate((direction) => {
      document.documentElement.dir = direction;
    }, this.direction);
  }
  setVertical(vertical: boolean) {
    return this.toolbar.evaluate((element: M3eToolbarElement, value) => {
      element.vertical = value;
    }, vertical);
  }
}
