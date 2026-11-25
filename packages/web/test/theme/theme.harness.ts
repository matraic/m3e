import type { Page } from "@playwright/test";

import type { M3eThemeElement } from "@m3e/web/theme";

const SPRINGS = ["fast-spatial", "default-spatial", "slow-spatial", "fast-effects", "default-effects", "slow-effects"];
const TOKENS = [
  "--md-sys-color-primary",
  "--md-sys-color-surface",
  "--md-sys-density-scale",
  "--m3e-focus-ring-visibility",
  ...SPRINGS.map((name) => `--md-sys-motion-spring-${name}`),
];

export class ThemeHarness {
  initialPrimary = "";
  changeDispatched = false;

  constructor(
    readonly page: Page,
    private readonly render: (html: string) => Promise<void>,
  ) {}

  show(html: string) {
    return this.render(html);
  }

  readToken(selector: string, token: string) {
    return this.page.$eval(selector, (element, name) => getComputedStyle(element).getPropertyValue(name).trim(), token);
  }

  readPrimary() {
    return this.readToken("#probe", "--md-sys-color-primary");
  }

  readSprings(selector: string) {
    return this.page.$eval(
      selector,
      (element, names) =>
        names.map((name) => getComputedStyle(element).getPropertyValue(`--md-sys-motion-spring-${name}`).trim()),
      SPRINGS,
    );
  }

  readTokens(selector: string) {
    return this.page.$eval(
      selector,
      (element, names) => names.map((name) => getComputedStyle(element).getPropertyValue(name).trim()),
      TOKENS,
    );
  }

  readProperty(selector: string, property: keyof M3eThemeElement) {
    return this.page.$eval(selector, (element, name) => (element as M3eThemeElement)[name], property);
  }

  removeAttribute(selector: string, attribute: string) {
    return this.page.locator(selector).evaluate(async (element, name) => {
      element.removeAttribute(name);
      await (element as M3eThemeElement).updateComplete;
    }, attribute);
  }
}
