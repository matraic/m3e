import type { Page } from "@playwright/test";

export class SlideHarness {
  index: number | null = null;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get slide() {
    return this.page.locator("m3e-slide");
  }

  item(name: string) {
    return this.page.getByText(name, { exact: true });
  }

  async show() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    const index = this.index === null ? "" : `selected-index="${this.index}"`;
    await this.renderFixture(`<m3e-slide ${index}>
      <div id="a">One</div><div id="b">Two</div><div id="c">Three</div>
    </m3e-slide>`);
  }

  state(name: string) {
    return this.item(name).evaluate((element) => ({
      before: element.classList.contains("-before"),
      after: element.classList.contains("-after"),
      inert: element.hasAttribute("inert"),
    }));
  }
}
