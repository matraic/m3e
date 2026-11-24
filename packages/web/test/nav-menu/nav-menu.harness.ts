import type {
  M3eNavMenuElement,
  M3eNavMenuItemElement,
} from "@m3e/web/nav-menu";
import type { Page } from "@playwright/test";

export class NavMenuHarness {
  html = "";
  direction: "ltr" | "rtl" = "ltr";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (
      html: string,
      direction?: "ltr" | "rtl",
    ) => Promise<void>,
  ) {}

  get menu() {
    return this.page.locator("#menu");
  }

  item(id: string) {
    return this.page.locator(`#${id}`);
  }

  standard() {
    this.html = `<m3e-nav-menu id="menu" aria-label="Docs">
      <m3e-nav-menu-item id="overview"><span slot="label">Overview</span></m3e-nav-menu-item>
      <m3e-nav-menu-item id="guides"><span slot="label">Guides</span>
        <m3e-nav-menu-item id="start"><span slot="label">Getting started</span></m3e-nav-menu-item>
        <m3e-nav-menu-item id="advanced"><span slot="label">Advanced</span>
          <m3e-nav-menu-item id="theming"><span slot="label">Theming</span></m3e-nav-menu-item>
        </m3e-nav-menu-item>
      </m3e-nav-menu-item>
      <m3e-nav-menu-item id="archive" disabled><span slot="label">Archive</span></m3e-nav-menu-item>
    </m3e-nav-menu>`;
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(
      `${this.html}<div id="destination"></div>`,
      this.direction,
    );
  }

  async all(action: "expand" | "collapse") {
    await this.menu.evaluate(
      (menu, action) => (menu as M3eNavMenuElement)[action](true),
      action,
    );
  }

  async targeted(action: "expand" | "collapse", id: string, descendants: boolean) {
    await this.menu.evaluate((menu: M3eNavMenuElement, { action, id, descendants }) => {
      const item = menu.items.find((item) => item.id === id);
      if (!item) throw new Error(`Missing navigation item ${id}`);
      menu[action]([item], descendants);
    }, { action, id, descendants });
  }

  initialSelection(disabled: boolean) {
    this.html = `<m3e-nav-menu id="menu">
      <m3e-nav-menu-item id="overview"><span slot="label">Overview</span></m3e-nav-menu-item>
      <m3e-nav-menu-item id="archive" selected ${disabled ? "disabled" : ""}>
        <span slot="label">Archive</span></m3e-nav-menu-item>
    </m3e-nav-menu>`;
  }

  async hierarchy(id: string) {
    return this.item(id).evaluate((element) => {
      const item = element as M3eNavMenuItemElement;
      return {
        level: item.level,
        parent: item.parentItem?.id ?? null,
        path: item.path.map((x) => x.id),
        children: item.childItems.map((x) => x.id),
      };
    });
  }

  async selected() {
    return this.menu.evaluate(
      (menu) => (menu as M3eNavMenuElement).selected?.id ?? null,
    );
  }

  async itemIds() {
    return this.menu.evaluate((menu) =>
      (menu as M3eNavMenuElement).items.map((item) => item.id),
    );
  }
}
