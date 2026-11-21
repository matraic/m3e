import type { M3eCalloutElement } from "@m3e/web/callout";
import type { Page } from "@playwright/test";

export class CalloutHarness {
  content = "Information";
  icon?: string;
  label?: string;
  variant?: string;
  shape?: string;

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get callout() {
    return this.page.locator("m3e-callout");
  }

  show() {
    return this.renderFixture(`
      <m3e-callout ${this.variant ? `variant="${this.variant}"` : ""} ${this.shape ? `shape="${this.shape}"` : ""}>
        ${this.icon ? `<span slot="icon" aria-hidden="true">${this.icon}</span>` : ""}
        ${this.label ? `<span slot="label">${this.label}</span>` : ""}
        ${this.content}
      </m3e-callout>
    `);
  }

  readVariant() {
    return this.callout.evaluate((element: M3eCalloutElement) => element.variant);
  }

  readShape() {
    return this.callout.evaluate((element: M3eCalloutElement) => element.shape);
  }

  moveToNewParent() {
    return this.callout.evaluate((element) => {
      const parent = document.createElement("div");
      parent.id = "callout-new-parent";
      document.body.append(parent);
      parent.append(element);
    });
  }
}
