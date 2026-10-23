import { expect, test } from "./fixtures";

test.describe("m3e-breadcrumb", () => {
  test("exposes a navigation landmark and identifies the current item", async ({ page, render }) => {
    await render(`
      <m3e-breadcrumb>
        <m3e-breadcrumb-item href="/dashboard">Dashboard</m3e-breadcrumb-item>
        <m3e-breadcrumb-item href="/reports">Reports</m3e-breadcrumb-item>
        <m3e-breadcrumb-item>Annual</m3e-breadcrumb-item>
      </m3e-breadcrumb>
    `);

    await expect(page.getByRole("navigation")).toBeVisible();
    await expect(page.getByRole("link", { name: "Dashboard" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Reports" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Annual" })).toHaveCount(0);
    await expect(page.locator("m3e-breadcrumb-item").nth(0)).not.toHaveAttribute("current");
    await expect(page.locator("m3e-breadcrumb-item").nth(1)).not.toHaveAttribute("current");
    const currentItem = page.locator("m3e-breadcrumb-item").nth(2);
    await expect(currentItem).toHaveAttribute("current", "page");
    await expect(currentItem.locator('[aria-current="page"]')).toBeVisible();
  });

  test("uses item-label as the accessible name for icon-only items", async ({ page, render }) => {
    await render(`
      <m3e-breadcrumb>
        <m3e-breadcrumb-item item-label="Home"><span aria-hidden="true">⌂</span></m3e-breadcrumb-item>
        <m3e-breadcrumb-item>Settings</m3e-breadcrumb-item>
      </m3e-breadcrumb>
    `);

    await expect(page.getByRole("button", { name: "Home" })).toBeVisible();
  });

  for (const current of ["page", "step", "location", "date", "time", "true"]) {
    test(`supports current="${current}"`, async ({ page, render }) => {
      await render(
        `<m3e-breadcrumb><m3e-breadcrumb-item current="${current}">Current</m3e-breadcrumb-item></m3e-breadcrumb>`,
      );

      const item = page.locator("m3e-breadcrumb-item");
      await expect(item).toHaveAttribute("current", current);
      await expect(item.locator(`[aria-current="${current}"]`)).toBeVisible();
    });
  }

  test("supports disabled breadcrumb items", async ({ page, render }) => {
    await render(`
      <m3e-breadcrumb>
        <m3e-breadcrumb-item href="/dashboard" disabled>Dashboard</m3e-breadcrumb-item>
        <m3e-breadcrumb-item>Current</m3e-breadcrumb-item>
      </m3e-breadcrumb>
    `);

    const item = page.getByRole("link", { name: "Dashboard" });
    await expect(item).toHaveAttribute("aria-disabled", "true");
    await expect(item).not.toHaveAttribute("tabindex");
  });
});

test.describe("m3e-breadcrumb wrap", () => {
  const items = Array.from(
    { length: 12 },
    (_, i) => `<m3e-breadcrumb-item href="/${i}">Section number ${i}</m3e-breadcrumb-item>`,
  ).join("");
  const tops = (page: import("@playwright/test").Page) =>
    page
      .locator("m3e-breadcrumb-item")
      .evaluateAll((els) => new Set(els.map((x) => Math.round(x.getBoundingClientRect().top))).size);

  test("does not wrap by default", async ({ page, render }) => {
    await render(`<m3e-breadcrumb style="width: 300px">${items}</m3e-breadcrumb>`);

    await expect(page.locator("m3e-breadcrumb")).not.toHaveAttribute("wrap");
    expect(await tops(page)).toBe(1);
  });

  test("wraps onto multiple lines when wrap is set", async ({ page, render }) => {
    await render(`<m3e-breadcrumb wrap style="width: 300px">${items}</m3e-breadcrumb>`);

    await expect(page.locator("m3e-breadcrumb")).toHaveAttribute("wrap", "");
    expect(await tops(page)).toBeGreaterThan(1);
  });

  test("toggling wrap at runtime changes the layout", async ({ page, render }) => {
    await render(`<m3e-breadcrumb style="width: 300px">${items}</m3e-breadcrumb>`);
    await page.locator("m3e-breadcrumb").evaluate((el) => el.toggleAttribute("wrap", true));

    await expect.poll(() => tops(page)).toBeGreaterThan(1);
  });
});
