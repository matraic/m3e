import type { Page } from "@playwright/test";
import type { M3eNavBarElement } from "@m3e/web/nav-bar";

type EventLog = { navEvents: string[] };

export class NavBarHarness {
  html = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get bar() {
    return this.page.locator("#bar");
  }

  get items() {
    return this.bar.locator("m3e-nav-item");
  }

  destination(name: string) {
    return this.page.getByRole("button", { name, exact: true });
  }

  standard(attributes = "") {
    this.html = `<button id="before">Before</button>
      <m3e-nav-bar id="bar" aria-label="Primary" ${attributes}>
        <m3e-nav-item value="home" selected><m3e-icon slot="icon" name="home"></m3e-icon>Home</m3e-nav-item>
        <m3e-nav-item value="search"><m3e-icon slot="icon" name="search"></m3e-icon>Search</m3e-nav-item>
        <m3e-nav-item value="settings" disabled><m3e-icon slot="icon" name="settings"></m3e-icon>Settings</m3e-nav-item>
      </m3e-nav-bar>
      <button id="after">After</button>`;
  }

  linked() {
    this.html = `<m3e-nav-bar id="bar"><m3e-nav-item href="/home">Home</m3e-nav-item></m3e-nav-bar>`;
  }

  disabledInteractive() {
    this.html = `<m3e-nav-bar id="bar">
        <m3e-nav-item value="home" selected>Home</m3e-nav-item>
        <m3e-nav-item value="search" disabled-interactive>Search</m3e-nav-item>
      </m3e-nav-bar>`;
  }

  primaryAndSecondary() {
    this.html = `<m3e-nav-bar id="bar" aria-label="Primary">
        <m3e-nav-item value="home" selected>Home</m3e-nav-item>
        <m3e-nav-item value="search">Search</m3e-nav-item>
      </m3e-nav-bar>
      <m3e-nav-bar id="secondary" aria-label="Secondary" mode="expanded">
        <m3e-nav-item value="inbox" selected>Inbox</m3e-nav-item>
      </m3e-nav-bar>`;
  }

  layout(attributes = "") {
    this.html = `<div id="source"><m3e-nav-bar id="bar" ${attributes}>
        <m3e-nav-item selected>Home</m3e-nav-item>
        <m3e-nav-item>Search</m3e-nav-item>
      </m3e-nav-bar></div>`;
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(`${this.html}<div id="destination"></div>`);
  }

  async recordEvents() {
    await this.bar.evaluate((bar) => {
      const log = window as unknown as EventLog;
      log.navEvents = [];
      for (const type of ["beforeinput", "input", "change"]) {
        bar.addEventListener(type, () => log.navEvents.push(type));
      }
    });
  }

  events() {
    return this.page.evaluate(() => (window as unknown as EventLog).navEvents);
  }

  selectedValue() {
    return this.bar.evaluate((bar: M3eNavBarElement) => bar.selected?.getAttribute("value") ?? null);
  }

  async membership(selector = "#bar") {
    return this.page.locator(selector).evaluate((bar: M3eNavBarElement) => ({
      values: bar.items.map((item) => item.getAttribute("value")),
      ownersMatch: bar.items.every((item) => item.navBar === bar),
    }));
  }

  appendDestination(label: string, selected = false) {
    return this.bar.evaluate(
      (bar, { label, selected }) => {
        const item = document.createElement("m3e-nav-item");
        item.setAttribute("value", label.toLowerCase());
        item.textContent = label;
        item.toggleAttribute("selected", selected);
        bar.append(item);
      },
      { label, selected },
    );
  }
}
