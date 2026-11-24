import type { Page } from "@playwright/test";
import type { M3eNavRailElement } from "@m3e/web/nav-rail";

const destinations = `
  <m3e-nav-item value="home" selected><m3e-icon slot="icon" name="home"></m3e-icon>Home</m3e-nav-item>
  <m3e-nav-item value="search"><m3e-icon slot="icon" name="search"></m3e-icon>Search</m3e-nav-item>
  <m3e-nav-item value="settings" disabled><m3e-icon slot="icon" name="settings"></m3e-icon>Settings</m3e-nav-item>`;

const toggle = `
  <m3e-icon-button toggle aria-label="Menu">
    <m3e-nav-rail-toggle for="rail"></m3e-nav-rail-toggle>
    <m3e-icon name="menu"></m3e-icon>
  </m3e-icon-button>`;

export class NavRailHarness {
  html = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get rail() {
    return this.page.locator("#rail");
  }

  get items() {
    return this.rail.locator("m3e-nav-item");
  }

  get menuButton() {
    return this.page.getByRole("button", { name: "Menu", exact: true });
  }

  destination(name: string) {
    return this.page.getByRole("button", { name, exact: true });
  }

  prepare(attributes = "") {
    this.html = this.markup(`${toggle}${destinations}`, attributes);
  }

  prepareWithSecondary() {
    this.html = `${this.markup(`${toggle}${destinations}`)}
      <m3e-nav-rail id="secondary" aria-label="Secondary"><m3e-nav-item value="inbox" selected>Inbox</m3e-nav-item></m3e-nav-rail>`;
  }

  prepareWithAction(attributes = "") {
    this.html = this.markup(
      `<m3e-fab aria-label="Compose"><m3e-icon name="edit"></m3e-icon>Compose</m3e-fab>
      <m3e-nav-item value="home" selected>Home</m3e-nav-item>`,
      attributes,
    );
  }

  preparePlainToggle() {
    this.html = this.markup(
      `<m3e-icon-button aria-label="Menu">
        <m3e-nav-rail-toggle for="rail"></m3e-nav-rail-toggle>
        <m3e-icon name="menu"></m3e-icon>
      </m3e-icon-button>${destinations}`,
    );
  }

  async render() {
    await this.renderFixture(`${this.html}<div id="destination"></div>`);
  }

  selectedValue() {
    return this.rail.evaluate((rail: M3eNavRailElement) => rail.selected?.getAttribute("value") ?? null);
  }

  appendDestination(label: string) {
    return this.rail.evaluate((rail, label) => {
      const item = document.createElement("m3e-nav-item");
      item.setAttribute("value", label.toLowerCase());
      item.textContent = label;
      rail.append(item);
    }, label);
  }

  appendAction() {
    return this.rail.evaluate((rail) => {
      const fab = document.createElement("m3e-fab");
      fab.id = "added-action";
      fab.setAttribute("aria-label", "Added");
      fab.textContent = "Added";
      rail.append(fab);
    });
  }

  transitionDuration() {
    return this.rail.evaluate((rail) => getComputedStyle(rail).transitionDuration);
  }

  private markup(content: string, attributes = "") {
    return `<button id="before">Before</button>
      <m3e-nav-rail id="rail" aria-label="Primary" ${attributes}>${content}</m3e-nav-rail>
      <button id="after">After</button>`;
  }
}
