import { expect, test } from "./fixtures";

const bar = `
  <m3e-nav-bar aria-label="Primary">
    <m3e-nav-item value="home" selected>
      <m3e-icon slot="icon" name="home"></m3e-icon>
      Home
    </m3e-nav-item>
    <m3e-nav-item value="search">
      <m3e-icon slot="icon" name="search"></m3e-icon>
      Search
    </m3e-nav-item>
    <m3e-nav-item value="settings" disabled>
      <m3e-icon slot="icon" name="settings"></m3e-icon>
      Settings
    </m3e-nav-item>
  </m3e-nav-bar>
`;

test.describe("m3e-nav-bar", () => {
  test("exposes navigation semantics and marks the selected item as current", async ({ page, render }) => {
    await render(bar);
    const home = page.getByRole("button", { name: "Home" });
    const search = page.getByRole("button", { name: "Search" });

    await expect(page.getByRole("navigation", { name: "Primary" })).toBeVisible();
    await expect(home).toHaveAttribute("aria-current", "true");
    await expect(search).toHaveAttribute("aria-current", "false");
    await expect(home).not.toHaveAttribute("aria-selected");
    await expect(home).not.toHaveAttribute("aria-pressed");
  });

  test("selects a clicked item, deselects the previous one, and dispatches input and change", async ({
    page,
    render,
  }) => {
    await render(bar);
    const home = page.getByRole("button", { name: "Home" });
    const search = page.getByRole("button", { name: "Search" });
    await page.evaluate(() => {
      const events: string[] = [];
      (window as unknown as { events: string[] }).events = events;
      const bar = document.querySelector("m3e-nav-bar")!;
      for (const type of ["beforeinput", "input", "change"]) {
        bar.addEventListener(type, () => events.push(type));
      }
    });

    await search.click();

    await expect(search).toHaveAttribute("aria-current", "true");
    await expect(home).toHaveAttribute("aria-current", "false");
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual([
      "beforeinput",
      "input",
      "change",
    ]);
  });

  test("does not select when beforeinput is canceled or the item is disabled", async ({ page, render }) => {
    await render(bar);
    const home = page.getByRole("button", { name: "Home" });
    const search = page.getByRole("button", { name: "Search" });
    const settings = page.getByRole("button", { name: "Settings" });

    await settings.click({ force: true });
    await expect(settings).toHaveAttribute("aria-current", "false");
    await expect(home).toHaveAttribute("aria-current", "true");

    await page
      .locator("m3e-nav-bar")
      .evaluate((element) => element.addEventListener("beforeinput", (e) => e.preventDefault()));
    await search.click();
    await expect(search).toHaveAttribute("aria-current", "false");
    await expect(home).toHaveAttribute("aria-current", "true");
  });

  test("lays items out vertically when compact and horizontally when expanded", async ({ page, render }) => {
    await render(bar);
    const navBar = page.locator("m3e-nav-bar");
    const items = page.locator("m3e-nav-item");

    await expect(items.first()).toHaveAttribute("orientation", "vertical");

    await navBar.evaluate((element) => element.setAttribute("mode", "expanded"));
    await expect(items.first()).toHaveAttribute("orientation", "horizontal");
    await expect(items.last()).toHaveAttribute("orientation", "horizontal");

    await navBar.evaluate((element) => element.setAttribute("mode", "compact"));
    await expect(items.first()).toHaveAttribute("orientation", "vertical");
  });

  test("falls back to compact for an invalid mode", async ({ page, render }) => {
    await render(`<m3e-nav-bar mode="bogus"><m3e-nav-item>Home</m3e-nav-item></m3e-nav-bar>`);

    await expect(page.locator("m3e-nav-item")).toHaveAttribute("orientation", "vertical");
  });

  test("auto mode is compact on small viewports and expanded on large ones", async ({ page, render }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await render(`<m3e-nav-bar mode="auto"><m3e-nav-item>Home</m3e-nav-item></m3e-nav-bar>`);
    const item = page.locator("m3e-nav-item");

    await expect(item).toHaveAttribute("orientation", "vertical");

    await page.setViewportSize({ width: 1400, height: 800 });
    await expect(item).toHaveAttribute("orientation", "horizontal");

    await page.setViewportSize({ width: 400, height: 800 });
    await expect(item).toHaveAttribute("orientation", "vertical");
  });

  test("applies the current orientation to items added later", async ({ page, render }) => {
    await render(`<m3e-nav-bar mode="expanded"><m3e-nav-item>Home</m3e-nav-item></m3e-nav-bar>`);

    await page.locator("m3e-nav-bar").evaluate((element) => {
      const item = document.createElement("m3e-nav-item");
      item.textContent = "Added";
      element.append(item);
    });

    await expect(page.getByRole("button", { name: "Added" })).toHaveAttribute("orientation", "horizontal");
  });

  test("renders a link when an item has an href", async ({ page, render }) => {
    await render(`
      <m3e-nav-bar>
        <m3e-nav-item href="/home">Home</m3e-nav-item>
      </m3e-nav-bar>
    `);

    await expect(page.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/home");
  });
});
