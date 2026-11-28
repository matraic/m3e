import type { Page } from "@playwright/test";

type ButtonProperties = {
  variant: string;
  size: string;
  shape: string;
};

declare global {
  interface Window {
    splitButtonPrimaryActions: number;
  }
}

export class SplitButtonHarness {
  html = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get splitButton() {
    return this.page.locator("m3e-split-button");
  }

  get leadingButton() {
    return this.page.locator('m3e-split-button > [slot="leading-button"]');
  }

  get trailingButton() {
    return this.page.locator('m3e-split-button > [slot="trailing-button"]');
  }

  get menu() {
    return this.page.getByRole("menu");
  }

  prepare(attributes = "") {
    this.html = `
      <m3e-split-button ${attributes}>
        <m3e-button slot="leading-button">Edit</m3e-button>
        <m3e-icon-button slot="trailing-button" aria-label="More actions">
          <m3e-icon name="keyboard_arrow_down"></m3e-icon>
          <m3e-menu-trigger for="menu"></m3e-menu-trigger>
        </m3e-icon-button>
      </m3e-split-button>
      <m3e-menu id="menu">
        <m3e-menu-item>Duplicate</m3e-menu-item>
        <m3e-menu-item>Delete</m3e-menu-item>
      </m3e-menu>`;
  }

  render() {
    return this.renderFixture(this.html);
  }

  buttonProperties(selector: string) {
    return this.page.locator(selector).evaluate((element) => {
      const { variant, size, shape } = element as HTMLElement & ButtonProperties;
      return { variant, size, shape };
    });
  }

  changeAttribute(name: string, value: string) {
    return this.splitButton.evaluate((element, input) => element.setAttribute(input.name, input.value), {
      name,
      value,
    });
  }

  recordPrimaryAction() {
    return this.leadingButton.evaluate((button) => {
      window.splitButtonPrimaryActions = 0;
      button.addEventListener("click", () => window.splitButtonPrimaryActions++);
    });
  }

  primaryActionCount() {
    return this.page.evaluate(() => window.splitButtonPrimaryActions);
  }

  replaceButtons() {
    return this.splitButton.evaluate((element) => {
      element
        .querySelectorAll(":scope > [slot='leading-button'], :scope > [slot='trailing-button']")
        .forEach((button) => button.remove());

      const leading = document.createElement("m3e-button");
      leading.slot = "leading-button";
      leading.textContent = "Run";

      const trailing = document.createElement("m3e-icon-button");
      trailing.slot = "trailing-button";
      trailing.setAttribute("aria-label", "More actions");
      element.append(leading, trailing);
    });
  }
}
