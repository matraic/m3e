import { expect, test } from "./fixtures";

type Toolbar = HTMLElement & { variant: string; shape: string; elevated: boolean; vertical: boolean };

const toolbar = (attrs = "") => `
  <m3e-toolbar ${attrs}>
    <m3e-icon-button aria-label="One"></m3e-icon-button>
    <m3e-icon-button aria-label="Two"></m3e-icon-button>
    <m3e-icon-button aria-label="Three"></m3e-icon-button>
  </m3e-toolbar>
`;

test.describe("m3e-toolbar", () => {
  test("has the toolbar role and defaults", async ({ page, render }) => {
    await render(toolbar());
    const el = page.locator("m3e-toolbar");

    await expect(page.getByRole("toolbar")).toBeVisible();
    await expect(el).toHaveAttribute("role", "toolbar");
    expect(await el.evaluate((e) => [(e as Toolbar).variant, (e as Toolbar).shape, (e as Toolbar).elevated])).toEqual([
      "standard",
      "square",
      false,
    ]);
  });

  test("vertical sets aria-orientation", async ({ page, render }) => {
    await render(toolbar());
    const el = page.locator("m3e-toolbar");

    await el.evaluate((e) => ((e as Toolbar).vertical = true));
    await expect(el).toHaveAttribute("aria-orientation", "vertical");
    await expect(el).toHaveAttribute("vertical", "");

    await el.evaluate((e) => ((e as Toolbar).vertical = false));
    await expect(el).not.toHaveAttribute("aria-orientation", "vertical");
  });

  test("reflects variant, shape and elevated", async ({ page, render }) => {
    await render(toolbar(`variant="vibrant" shape="rounded" elevated`));
    const el = page.locator("m3e-toolbar");

    await expect(el).toHaveAttribute("variant", "vibrant");
    await expect(el).toHaveAttribute("shape", "rounded");
    await expect(el).toHaveAttribute("elevated", "");
    expect(await el.evaluate((e) => e.matches(":state(--vibrant):state(--rounded)"))).toBe(true);
  });

  test("elevated raises the elevation level", async ({ page, render }) => {
    await render(toolbar());
    const level = () =>
      page.locator("m3e-toolbar").evaluate((e) => e.shadowRoot!.querySelector("m3e-elevation")!.getAttribute("level"));

    expect(await level()).toBe("0");

    await page.locator("m3e-toolbar").evaluate((e) => ((e as Toolbar).elevated = true));

    await expect.poll(level).toBe("3");
  });

  test("falls back to defaults for invalid variant and shape", async ({ page, render }) => {
    await render(toolbar(`variant="x" shape="x"`));
    const el = page.locator("m3e-toolbar");

    await expect(el).toHaveAttribute("variant", "standard");
    await expect(el).toHaveAttribute("shape", "square");
  });

  test("only the first item is in the tab order initially", async ({ page, render }) => {
    await render(toolbar());
    const items = page.locator("m3e-icon-button");

    await expect(items.nth(0)).toHaveAttribute("tabindex", "0");
    await expect(items.nth(1)).toHaveAttribute("tabindex", "-1");
    await expect(items.nth(2)).toHaveAttribute("tabindex", "-1");
  });

  test("arrow keys, Home and End move focus between items", async ({ page, render }) => {
    await render(toolbar());
    const items = page.locator("m3e-icon-button");

    await items.nth(0).focus();
    await page.keyboard.press("ArrowRight");
    await expect(items.nth(1)).toBeFocused();
    await expect(items.nth(1)).toHaveAttribute("tabindex", "0");
    await expect(items.nth(0)).toHaveAttribute("tabindex", "-1");

    await page.keyboard.press("End");
    await expect(items.nth(2)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(items.nth(0)).toBeFocused();
  });

  test("arrow keys wrap at the ends", async ({ page, render }) => {
    await render(toolbar());
    const items = page.locator("m3e-icon-button");

    await items.nth(0).focus();
    await page.keyboard.press("ArrowLeft");
    await expect(items.nth(2)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(items.nth(0)).toBeFocused();
  });

  test("vertical toolbars use the up and down arrows", async ({ page, render }) => {
    await render(toolbar(`vertical`));
    const items = page.locator("m3e-icon-button");

    await items.nth(0).focus();
    await page.keyboard.press("ArrowDown");
    await expect(items.nth(1)).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(items.nth(0)).toBeFocused();
  });

  test("arrow keys are reversed in right-to-left", async ({ page, render }) => {
    await render(toolbar());
    await page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
    const items = page.locator("m3e-icon-button");

    await items.nth(0).focus();
    await page.keyboard.press("ArrowLeft");

    await expect(items.nth(1)).toBeFocused();
    await page.evaluate(() => document.documentElement.removeAttribute("dir"));
  });

  test("clicking an item makes it the tab stop", async ({ page, render }) => {
    await render(toolbar());
    const items = page.locator("m3e-icon-button");

    await items.nth(2).click();

    await expect(items.nth(2)).toHaveAttribute("tabindex", "0");
    await expect(items.nth(0)).toHaveAttribute("tabindex", "-1");
  });

  test("the first enabled item is the initial tab stop", async ({ page, render }) => {
    await render(`
      <m3e-toolbar>
        <m3e-icon-button disabled aria-label="One"></m3e-icon-button>
        <m3e-icon-button aria-label="Two"></m3e-icon-button>
      </m3e-toolbar>
    `);

    await expect(page.locator("m3e-icon-button").nth(1)).toHaveAttribute("tabindex", "0");
  });
});
