import type { M3eSwitchElement } from "@m3e/web/switch";
import type { Page } from "@playwright/test";

export class SwitchHarness {
  markup = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get switch() {
    return this.page.locator("m3e-switch");
  }

  show() {
    return this.renderFixture(this.markup);
  }

  recordEvents(cancelBeforeInput = false) {
    return this.switch.evaluate((element, cancel) => {
      const events: string[] = [];
      element.setAttribute("data-events", "");
      for (const type of ["beforeinput", "input", "change"]) {
        element.addEventListener(type, (event) => {
          events.push(type);
          element.setAttribute("data-events", events.join(", "));
          if (cancel && type === "beforeinput") event.preventDefault();
        });
      }
    }, cancelBeforeInput);
  }

  icons(index = 0) {
    return this.switch.nth(index).evaluate((element: M3eSwitchElement) => element.icons);
  }

  formValues(id = "switch-form") {
    return this.page.locator(`#${id}`).evaluate((form: HTMLFormElement) => Array.from(new FormData(form).entries()));
  }

  async nativeAccessibleNames() {
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const tree = await session.send("Accessibility.getFullAXTree");
      return tree.nodes.filter((node) => node.role?.value === "switch").map((node) => node.name?.value);
    } finally {
      await session.detach();
    }
  }
}
