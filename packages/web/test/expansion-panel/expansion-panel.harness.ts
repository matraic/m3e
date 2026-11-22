import type { Page } from "@playwright/test";

export class ExpansionPanelHarness {
  html = "";
  reducedMotion: "reduce" | "no-preference" = "reduce";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  panel(name: string) {
    return this.page.locator(`#panel-${name.toLowerCase().replaceAll(" ", "-")}`);
  }

  header(name: string) {
    return this.page.getByRole("button", { name, exact: true });
  }

  get firstPanel() {
    return this.page.locator("m3e-expansion-panel").first();
  }

  get region() {
    return this.firstPanel.locator("m3e-collapsible");
  }

  panelMarkup(name: string, attributes = "", content = "Panel content") {
    const id = name.toLowerCase().replaceAll(" ", "-");
    return `<m3e-expansion-panel id="panel-${id}" ${attributes}>
      <span slot="header">${name}</span>${content}
    </m3e-expansion-panel>`;
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: this.reducedMotion });
    await this.renderFixture(`${this.html}<button id="after-panel">After panel</button>`);
  }

  observeEvents() {
    return this.firstPanel.evaluate((panel) => {
      const events: string[] = [];
      for (const name of ["opening", "opened", "closing", "closed"]) {
        document.addEventListener(name, (event) => {
          if (event.target === panel) {
            events.push(event.type);
            panel.setAttribute("data-events", events.join(","));
          }
        });
      }
    });
  }

  async indicatorBefore(name: string) {
    return this.panel(name).evaluate((panel) => {
      const text = panel.querySelector('[slot="header"]');
      const toggle = panel.shadowRoot?.querySelector("m3e-expansion-header")?.shadowRoot?.querySelector(".toggle");
      if (!text || !toggle) throw new Error("Expansion header or indicator is missing.");
      return toggle.getBoundingClientRect().left < text.getBoundingClientRect().left;
    });
  }
}
