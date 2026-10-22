import type { M3eNavRailElement } from "../src/nav-rail";
import { expect, test } from "./fixtures";

const rail = `
  <m3e-nav-rail id="rail" aria-label="Primary">
    <m3e-icon-button toggle aria-label="Menu">
      <m3e-nav-rail-toggle for="rail"></m3e-nav-rail-toggle>
      <m3e-icon name="menu"></m3e-icon>
    </m3e-icon-button>
    <m3e-nav-item selected>
      <m3e-icon slot="icon" name="home"></m3e-icon>
      Home
    </m3e-nav-item>
    <m3e-nav-item>
      <m3e-icon slot="icon" name="search"></m3e-icon>
      Search
    </m3e-nav-item>
    <m3e-nav-item disabled>
      <m3e-icon slot="icon" name="settings"></m3e-icon>
      Settings
    </m3e-nav-item>
  </m3e-nav-rail>
`;

test.describe("m3e-nav-rail", () => {
  test("exposes navigation semantics and starts compact", async ({ page, render }) => {
    await render(rail);

    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(page.locator("m3e-nav-item").first()).toHaveAttribute("orientation", "vertical");
    expect(await page.locator("m3e-nav-rail").evaluate((element) => (element as M3eNavRailElement).currentMode)).toBe(
      "compact",
    );
  });

  test("selects an item when clicked and deselects the previous one", async ({ page, render }) => {
    await render(rail);
    const home = page.getByRole("button", { name: "Home" });
    const search = page.getByRole("button", { name: "Search" });

    await expect(home).toHaveAttribute("aria-current", "true");
    await search.click();

    await expect(search).toHaveAttribute("aria-current", "true");
    await expect(home).toHaveAttribute("aria-current", "false");
  });

  test("does not select a disabled item", async ({ page, render }) => {
    await render(rail);
    const settings = page.getByRole("button", { name: "Settings" });

    await settings.click({ force: true });

    await expect(settings).toHaveAttribute("aria-current", "false");
    await expect(page.getByRole("button", { name: "Home" })).toHaveAttribute("aria-current", "true");
  });

  test("expands items horizontally when mode is expanded", async ({ page, render }) => {
    await render(rail);
    const items = page.locator("m3e-nav-item");

    await page.locator("m3e-nav-rail").evaluate((element) => element.setAttribute("mode", "expanded"));

    await expect(items.first()).toHaveAttribute("orientation", "horizontal");
    await expect(items.last()).toHaveAttribute("orientation", "horizontal");
  });

  test("extends a nested fab only when expanded", async ({ page, render }) => {
    await render(`
      <m3e-nav-rail>
        <m3e-fab aria-label="Compose"><m3e-icon name="edit"></m3e-icon>Compose</m3e-fab>
        <m3e-nav-item>Home</m3e-nav-item>
      </m3e-nav-rail>
    `);
    const fab = page.locator("m3e-fab");

    await expect(fab).not.toHaveAttribute("extended");
    await page.locator("m3e-nav-rail").evaluate((element) => element.setAttribute("mode", "expanded"));
    await expect(fab).toHaveAttribute("extended", "");
    await page.locator("m3e-nav-rail").evaluate((element) => element.setAttribute("mode", "compact"));
    await expect(fab).not.toHaveAttribute("extended");
  });

  test("moves focus between enabled controls with the arrow keys", async ({ page, render }) => {
    await render(rail);
    const home = page.getByRole("button", { name: "Home" });
    const search = page.getByRole("button", { name: "Search" });

    await home.focus();
    await page.keyboard.press("ArrowDown");
    await expect(search).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(home).toBeFocused();
  });

  test("toggles between compact and expanded with the rail toggle", async ({ page, render }) => {
    await render(rail);
    const toggle = page.getByRole("button", { name: "Menu" });
    const items = page.locator("m3e-nav-item");

    await expect(toggle).toHaveAttribute("aria-controls", "rail");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    await expect(items.first()).toHaveAttribute("orientation", "horizontal");
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("selected", "");

    await toggle.click();
    await expect(items.first()).toHaveAttribute("orientation", "vertical");
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).not.toHaveAttribute("selected");
  });

  test("keeps the toggle in sync when the mode changes without a click", async ({ page, render }) => {
    await render(rail);
    const toggle = page.getByRole("button", { name: "Menu" });
    const nav = page.locator("m3e-nav-rail");

    await nav.evaluate((element) => element.setAttribute("mode", "expanded"));
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(toggle).toHaveAttribute("selected", "");

    await nav.evaluate((element) => element.setAttribute("mode", "compact"));
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(toggle).not.toHaveAttribute("selected");
  });

  test("keeps the toggle in sync when auto mode crosses a breakpoint", async ({ page, render }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await render(rail.replace('id="rail"', 'id="rail" mode="auto"'));
    const toggle = page.getByRole("button", { name: "Menu" });

    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await page.setViewportSize({ width: 1400, height: 800 });
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await page.setViewportSize({ width: 400, height: 800 });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });
});
