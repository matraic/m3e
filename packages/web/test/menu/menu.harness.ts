import type { Page } from "@playwright/test";

export class MenuHarness {
  html = "";
  direction: "ltr" | "rtl" = "ltr";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get menu() {
    return this.page.locator("#menu");
  }

  get submenu() {
    return this.page.locator("#submenu");
  }

  get trigger() {
    return this.page.locator("#trigger");
  }

  action(name: string) {
    return this.page.getByRole("menuitem", { name, exact: true });
  }

  standard(
    items = `<m3e-menu-item>Apple</m3e-menu-item>
    <m3e-menu-item disabled>Apricot</m3e-menu-item>
    <m3e-menu-item>Avocado</m3e-menu-item>`,
  ) {
    this.html = `<m3e-button id="trigger"><m3e-menu-trigger for="menu">Open</m3e-menu-trigger></m3e-button>
      <m3e-menu id="menu" aria-label="Main menu">${items}</m3e-menu>`;
  }

  submenuMenu() {
    this.html = `<m3e-button id="trigger"><m3e-menu-trigger for="menu">Open</m3e-menu-trigger></m3e-button>
      <m3e-menu id="menu" aria-label="Main menu">
        <m3e-menu-item><m3e-menu-trigger for="submenu">Fruits</m3e-menu-trigger></m3e-menu-item>
        <m3e-menu-item>Grapes</m3e-menu-item>
      </m3e-menu>
      <m3e-menu id="submenu" aria-label="Fruits">
        <m3e-menu-item>Apricot</m3e-menu-item>
        <m3e-menu-item>Avocado</m3e-menu-item>
      </m3e-menu>`;
  }

  twoTriggerMenu() {
    this.html = `<m3e-button id="first-trigger"><m3e-menu-trigger for="menu">Open</m3e-menu-trigger></m3e-button>
      <m3e-button id="second-trigger">Other</m3e-button>
      <m3e-menu id="menu" aria-label="Main menu"><m3e-menu-item>Apple</m3e-menu-item></m3e-menu>`;
  }

  scrollingMenu() {
    this.html = `<div id="scroller" style="height: 400px; overflow: auto">
        <div style="height: 100px"></div>
        <m3e-button id="trigger"><m3e-menu-trigger for="menu">Open</m3e-menu-trigger></m3e-button>
        <div style="height: 600px"></div>
      </div>
      <m3e-menu id="menu" aria-label="Main menu" style="--m3e-menu-container-max-height: 180px">
        <m3e-menu-item>First</m3e-menu-item>
        <m3e-menu-item><m3e-menu-trigger for="submenu">Fruits</m3e-menu-trigger></m3e-menu-item>
        <m3e-menu-item>Third</m3e-menu-item>
        <m3e-menu-item>Fourth</m3e-menu-item>
        <m3e-menu-item>Fifth</m3e-menu-item>
        <m3e-menu-item>Sixth</m3e-menu-item>
      </m3e-menu>
      <m3e-menu id="submenu" aria-label="Fruits"><m3e-menu-item>Apricot</m3e-menu-item></m3e-menu>`;
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(
      `${this.html}<div id="menu-destination"></div><button id="after-menu">After</button>`,
      this.direction,
    );
  }
}
