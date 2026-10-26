import { expect, test } from "./fixtures";

test.describe("m3e-icon", () => {
  test("renders the icon name as a decorative symbol by default", async ({ page, render }) => {
    await render(`<m3e-icon name="home"></m3e-icon>`);
    const icon = page.locator("m3e-icon");

    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon.locator(".icon")).toHaveText("home");
    await expect(icon.locator(".icon")).toHaveAttribute("aria-hidden", "true");
    await expect(icon.locator(".icon")).toHaveAttribute("translate", "no");
    await expect(page.getByRole("img")).toHaveCount(0);
  });

  test("exposes a labeled icon to assistive technology", async ({ page, render }) => {
    await render(`<m3e-icon name="home" aria-label="Home"></m3e-icon>`);
    const icon = page.getByRole("img", { name: "Home" });

    await expect(icon).toBeVisible();
    await expect(icon).not.toHaveAttribute("aria-hidden", "true");
  });

  test("supports variants, fill, grade, weight, and optical size", async ({ page, render }) => {
    await render(`
      <m3e-icon id="icon" name="favorite" variant="rounded" filled grade="high" weight="600" optical-size="32"></m3e-icon>
    `);
    const icon = page.locator("#icon");

    await expect(icon).toHaveAttribute("variant", "rounded");
    await expect(icon).toHaveAttribute("filled", "");
    await expect(icon).toHaveJSProperty("grade", "high");
    await expect(icon).toHaveJSProperty("weight", 600);
    await expect(icon).toHaveJSProperty("opticalSize", 32);
    await expect(icon.locator(".icon")).toHaveCSS("--_icon-fill", "1");
    await expect(icon.locator(".icon")).toHaveCSS("--_icon-grade", "200");
    await expect(icon.locator(".icon")).toHaveCSS("--_icon-weight", "600");
    await expect(icon.locator(".icon")).toHaveCSS("--_icon-optical-size", "32");
    expect(await icon.evaluate((element) => element.matches(":state(--rounded)"))).toBe(true);
  });

  test("falls back to supported variant, grade, and weight values", async ({ page, render }) => {
    await render(`
      <m3e-icon id="icon" name="home" variant="unsupported" grade="unsupported" weight="450"></m3e-icon>
    `);
    const icon = page.locator("#icon");

    await expect(icon).toHaveJSProperty("variant", "outlined");
    await expect(icon).toHaveJSProperty("grade", "medium");
    await expect(icon).toHaveJSProperty("weight", 400);
    expect(await icon.evaluate((element) => element.matches(":state(--outlined)"))).toBe(true);
  });

  test("keeps an accessible label when the icon name changes", async ({ page, render }) => {
    await render(`<m3e-icon id="icon" name="home" aria-label="Current icon"></m3e-icon>`);
    const icon = page.locator("#icon");

    await icon.evaluate((element) => {
      element.setAttribute("name", "settings");
    });

    await expect(icon.locator(".icon")).toHaveText("settings");
    await expect(page.getByRole("img", { name: "Current icon" })).toBeVisible();
  });
});
