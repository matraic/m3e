import { expect, test } from "./fixtures";

test.describe("m3e-fab-menu", () => {
  test("opens from its FAB trigger and exposes menu items", async ({ page, render }) => {
    await render(`
      <m3e-fab aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>First action</m3e-fab-menu-item>
        <m3e-fab-menu-item>Second action</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const fab = page.getByRole("button", { name: "More actions" });
    const menu = page.getByRole("menu");

    await expect(fab).toHaveAttribute("aria-haspopup", "menu");
    await expect(fab).toHaveAttribute("aria-expanded", "false");
    await expect(fab).toHaveAttribute("aria-controls", "actions");

    await fab.click();

    await expect(fab).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem")).toHaveCount(2);
    await expect(menu.getByRole("menuitem", { name: "First action" })).toBeVisible();
  });

  test("closes when a menu item is selected and restores focus to the FAB", async ({ page, render }) => {
    await render(`
      <m3e-fab aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>New document</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    const fab = page.getByRole("button", { name: "More actions" });
    const menu = page.getByRole("menu");

    await fab.click();
    await page.getByRole("menuitem", { name: "New document" }).click();

    await expect(menu).toBeHidden();
    await expect(fab).toHaveAttribute("aria-expanded", "false");
    await expect(fab).toBeFocused();
  });

  test("closes on Escape and restores focus to the FAB", async ({ page, render }) => {
    await render(`
      <m3e-fab aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>First action</m3e-fab-menu-item>
        <m3e-fab-menu-item>Second action</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    const fab = page.getByRole("button", { name: "More actions" });

    await fab.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("menu")).toBeHidden();
    await expect(fab).toHaveAttribute("aria-expanded", "false");
    await expect(fab).toBeFocused();
  });

  test("moves focus through menu items with arrow keys", async ({ page, render }) => {
    await render(`
      <m3e-fab aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>First action</m3e-fab-menu-item>
        <m3e-fab-menu-item disabled>Unavailable action</m3e-fab-menu-item>
        <m3e-fab-menu-item>Last action</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    const fab = page.getByRole("button", { name: "More actions" });
    const first = page.getByRole("menuitem", { name: "First action" });
    const last = page.getByRole("menuitem", { name: "Last action" });

    await fab.click();
    await expect(first).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(last).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(first).toBeFocused();
  });

  test("accepts supported variants and falls back for an unsupported variant", async ({ page, render }) => {
    await render(`
      <m3e-fab-menu variant="primary"></m3e-fab-menu>
      <m3e-fab-menu variant="secondary"></m3e-fab-menu>
      <m3e-fab-menu variant="tertiary"></m3e-fab-menu>
      <m3e-fab-menu variant="unsupported"></m3e-fab-menu>
    `);
    const menus = page.locator("m3e-fab-menu");

    for (const [index, variant] of ["primary", "secondary", "tertiary", "primary"].entries()) {
      await expect.poll(() => menus.nth(index).getAttribute("variant")).toBe(variant);
    }
  });
});
