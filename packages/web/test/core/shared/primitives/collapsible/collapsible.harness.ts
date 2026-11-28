import type { Page } from "@playwright/test";

type Recorded = HTMLElement & { recordedEvents: string[] };

export class CollapsibleHarness {
  attributes = "";
  motion = false;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get element() {
    return this.page.locator("m3e-collapsible");
  }

  async show() {
    await this.page.emulateMedia({ reducedMotion: this.motion ? "no-preference" : "reduce" });
    await this.renderFixture(`<m3e-collapsible ${this.attributes}>
      <div style="height: 100px; width: 100px">Content</div>
    </m3e-collapsible>`);
    await this.element.evaluate((element: Recorded) => {
      element.recordedEvents = [];
      for (const name of ["opening", "opened", "closing", "closed"]) {
        element.addEventListener(name, () => element.recordedEvents.push(name));
      }
    });
  }

  events() {
    return this.element.evaluate((element: Recorded) => element.recordedEvents);
  }

  state(name: string) {
    return this.element.evaluate((element, value) => element.matches(`:state(--${value})`), name);
  }
}
