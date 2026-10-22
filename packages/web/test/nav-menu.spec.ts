import type { M3eNavMenuElement, M3eNavMenuItemElement } from "../src/nav-menu";
import { expect, test } from "./fixtures";

const menu = `
  <m3e-nav-menu aria-label="Docs">
    <m3e-nav-menu-item>
      <span slot="label">Overview</span>
    </m3e-nav-menu-item>
    <m3e-nav-menu-item id="guides">
      <span slot="label">Guides</span>
      <m3e-nav-menu-item id="start"><span slot="label">Getting started</span></m3e-nav-menu-item>
      <m3e-nav-menu-item id="advanced">
        <span slot="label">Advanced</span>
        <m3e-nav-menu-item id="theming"><span slot="label">Theming</span></m3e-nav-menu-item>
      </m3e-nav-menu-item>
    </m3e-nav-menu-item>
    <m3e-nav-menu-item disabled>
      <span slot="label">Archive</span>
    </m3e-nav-menu-item>
  </m3e-nav-menu>
`;

test.describe("m3e-nav-menu", () => {
  test("exposes a tree with treeitems and assigns each item an id", async ({ page, render }) => {
    await render(menu);

    await expect(page.getByRole("tree", { name: "Docs" })).toBeVisible();
    await expect(page.getByRole("treeitem")).toHaveCount(3);
    await page.locator("m3e-nav-menu").evaluate((element) => (element as M3eNavMenuElement).expand(true));
    await expect(page.getByRole("treeitem")).toHaveCount(6);
    const ids = await page.locator("m3e-nav-menu-item").evaluateAll((items) => items.map((x) => x.id));
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test("only items with children are expandable and they start collapsed", async ({ page, render }) => {
    await render(menu);

    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#advanced")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#start")).not.toHaveAttribute("aria-expanded");
    await expect(page.getByText("Overview")).not.toHaveAttribute("aria-expanded");
    await expect(page.getByText("Getting started")).toBeHidden();
  });

  test("toggles a parent item when clicked", async ({ page, render }) => {
    await render(menu);
    const guides = page.locator("#guides");

    await page.getByText("Guides", { exact: true }).click();
    await expect(guides).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Getting started")).toBeVisible();

    await page.getByText("Guides", { exact: true }).click();
    await expect(guides).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Getting started")).toBeHidden();
  });

  test("selects a leaf item, marks it current, and deselects the previous one", async ({ page, render }) => {
    await render(menu);
    const overview = page.locator("m3e-nav-menu-item").first();
    const start = page.locator("#start");

    await overview.getByText("Overview").click();
    await expect(overview).toHaveAttribute("aria-current", "true");

    await page.locator("#guides").evaluate((element) => element.setAttribute("open", ""));
    await start.getByText("Getting started").click();
    await expect(start).toHaveAttribute("aria-current", "true");
    await expect(overview).toHaveAttribute("aria-current", "false");
    expect(await page.locator("m3e-nav-menu").evaluate((element) => (element as M3eNavMenuElement).selected?.id)).toBe(
      "start",
    );
  });

  test("marks every ancestor of the selected item as selected without making them current", async ({
    page,
    render,
  }) => {
    await render(menu);

    await page.locator("#guides").evaluate((element) => (element as M3eNavMenuItemElement).expand(true));
    await page.getByText("Theming").click();

    for (const id of ["guides", "advanced"]) {
      expect(await page.locator(`#${id}`).evaluate((element) => (element as M3eNavMenuItemElement).selected)).toBe(
        true,
      );
      await expect(page.locator(`#${id}`)).not.toHaveAttribute("aria-current", "true");
    }
    await expect(page.locator("#theming")).toHaveAttribute("aria-current", "true");
  });

  test("does not select a disabled item", async ({ page, render }) => {
    await render(menu);
    const archive = page.locator("m3e-nav-menu-item[disabled]");

    await archive.getByText("Archive").click({ force: true });

    expect(
      await page.locator("m3e-nav-menu").evaluate((element) => (element as M3eNavMenuElement).selected),
    ).toBeNull();
  });

  test("expands and collapses all items through the public API", async ({ page, render }) => {
    await render(menu);
    const nav = page.locator("m3e-nav-menu");

    await nav.evaluate((element) => (element as M3eNavMenuElement).expand(true));
    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#advanced")).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByText("Theming")).toBeVisible();

    await nav.evaluate((element) => (element as M3eNavMenuElement).collapse(true));
    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#advanced")).toHaveAttribute("aria-expanded", "false");
    await expect(page.getByText("Theming")).toBeHidden();
  });

  test("reports the hierarchy of each item", async ({ page, render }) => {
    await render(menu);

    const info = await page.locator("#theming").evaluate((element) => {
      const item = element as M3eNavMenuItemElement;
      return {
        level: item.level,
        parent: item.parentItem?.id,
        path: item.path.map((x) => x.id),
        hasChildItems: item.hasChildItems,
      };
    });
    expect(info).toEqual({
      level: 3,
      parent: "advanced",
      path: ["guides", "advanced", "theming"],
      hasChildItems: false,
    });
    expect(
      await page
        .locator("#guides")
        .evaluate((element) => (element as M3eNavMenuItemElement).childItems.map((x) => x.id)),
    ).toEqual(["start", "advanced"]);
  });

  test("navigates with the arrow keys and tracks the active descendant", async ({ page, render }) => {
    await render(menu);
    const nav = page.locator("m3e-nav-menu");
    const items = page.locator("m3e-nav-menu-item");

    await nav.focus();
    await expect(nav).toHaveAttribute("aria-activedescendant", (await items.first().getAttribute("id"))!);

    await page.keyboard.press("ArrowDown");
    await expect(nav).toHaveAttribute("aria-activedescendant", "guides");

    await page.keyboard.press("ArrowRight");
    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("ArrowDown");
    await expect(nav).toHaveAttribute("aria-activedescendant", "start");

    await page.keyboard.press("ArrowLeft");
    await expect(nav).toHaveAttribute("aria-activedescendant", "guides");

    await page.keyboard.press("ArrowLeft");
    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "false");
  });

  test("skips disabled items and supports Home and End", async ({ page, render }) => {
    await render(menu);
    const nav = page.locator("m3e-nav-menu");

    await nav.focus();
    await page.keyboard.press("End");
    await expect(nav).toHaveAttribute("aria-activedescendant", "guides");

    await page.keyboard.press("Home");
    await expect(nav).toHaveAttribute(
      "aria-activedescendant",
      (await page.locator("m3e-nav-menu-item").first().getAttribute("id"))!,
    );
  });

  test("toggles with Enter and expands all descendants with *", async ({ page, render }) => {
    await render(menu);
    const nav = page.locator("m3e-nav-menu");

    await nav.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");
    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "true");

    await page.keyboard.press("Enter");
    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "false");

    await page.keyboard.press("*");
    await expect(page.locator("#guides")).toHaveAttribute("aria-expanded", "true");
    await expect(page.locator("#advanced")).toHaveAttribute("aria-expanded", "true");
  });

  test("selects the active leaf item with Enter and clicks its link", async ({ page, render }) => {
    await render(`
      <m3e-nav-menu>
        <m3e-nav-menu-item id="home"><a slot="label" href="#home-page">Home</a></m3e-nav-menu-item>
      </m3e-nav-menu>
    `);

    await page.locator("m3e-nav-menu").focus();
    await page.keyboard.press("Enter");

    await expect(page.locator("#home")).toHaveAttribute("aria-current", "true");
    expect(page.url()).toContain("#home-page");
  });

  test("labels a group of items", async ({ page, render }) => {
    await render(`
      <m3e-nav-menu>
        <m3e-nav-menu-item-group>
          <span slot="label">Reference</span>
          <m3e-nav-menu-item><span slot="label">API</span></m3e-nav-menu-item>
        </m3e-nav-menu-item-group>
      </m3e-nav-menu>
    `);

    await expect(page.getByRole("group", { name: "Reference" })).toBeVisible();
  });
});
