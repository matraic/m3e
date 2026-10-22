import { expect, test } from "./fixtures";

const split = (attrs = "") => `
  <m3e-split-button ${attrs}>
    <m3e-button slot="leading-button">Edit</m3e-button>
    <m3e-icon-button slot="trailing-button" aria-label="More actions">
      <m3e-icon name="keyboard_arrow_down"></m3e-icon>
      <m3e-menu-trigger for="menu"></m3e-menu-trigger>
    </m3e-icon-button>
  </m3e-split-button>
  <m3e-menu id="menu">
    <m3e-menu-item>Duplicate</m3e-menu-item>
    <m3e-menu-item>Delete</m3e-menu-item>
  </m3e-menu>
`;

type Buttons = { variant: string; size: string; shape: string };

const buttonProps = (page: import("@playwright/test").Page, selector: string) =>
  page.locator(selector).evaluate((el) => {
    const { variant, size, shape } = el as unknown as Buttons;
    return { variant, size, shape };
  });

test.describe("m3e-split-button", () => {
  test("exposes a group containing both buttons", async ({ page, render }) => {
    await render(split());

    await expect(page.getByRole("group")).toBeVisible();
    await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
    await expect(page.getByRole("button", { name: "More actions" })).toBeVisible();
  });

  test("defaults to the filled variant and small size", async ({ page, render }) => {
    await render(split());

    expect(await buttonProps(page, "m3e-split-button")).toMatchObject({ variant: "filled", size: "small" });
  });

  test("applies the variant and size to both buttons", async ({ page, render }) => {
    await render(split('variant="tonal" size="large"'));

    await expect.poll(() => buttonProps(page, "m3e-button")).toMatchObject({ variant: "tonal", size: "large" });
    await expect(page.locator("m3e-icon-button")).toHaveAttribute("variant", "tonal");
    expect(await buttonProps(page, "m3e-icon-button")).toMatchObject({ size: "large" });
  });

  test("updates both buttons when the variant changes", async ({ page, render }) => {
    await render(split());

    await page.locator("m3e-split-button").evaluate((el) => el.setAttribute("variant", "outlined"));

    await expect.poll(() => buttonProps(page, "m3e-button")).toMatchObject({ variant: "outlined" });
    await expect(page.locator("m3e-icon-button")).toHaveAttribute("variant", "outlined");
  });

  test("updates both buttons when the size changes", async ({ page, render }) => {
    await render(split());

    await page.locator("m3e-split-button").evaluate((el) => el.setAttribute("size", "extra-large"));

    await expect.poll(() => buttonProps(page, "m3e-button")).toMatchObject({ size: "extra-large" });
    await expect.poll(() => buttonProps(page, "m3e-icon-button")).toMatchObject({ size: "extra-large" });
  });

  test("falls back to defaults for invalid values", async ({ page, render }) => {
    await render(split('variant="bogus" size="bogus"'));

    await expect(page.locator("m3e-split-button")).toHaveAttribute("variant", "filled");
    expect(await buttonProps(page, "m3e-split-button")).toMatchObject({ variant: "filled", size: "small" });
  });

  test("gives both buttons a rounded shape", async ({ page, render }) => {
    await render(split());

    await expect.poll(() => buttonProps(page, "m3e-button")).toMatchObject({ shape: "rounded" });
    expect(await buttonProps(page, "m3e-icon-button")).toMatchObject({ shape: "rounded" });
  });

  test("performs the primary action from the leading button", async ({ page, render }) => {
    await render(split());
    await page.locator("m3e-button").evaluate((el) => {
      (window as unknown as { clicks: number }).clicks = 0;
      el.addEventListener("click", () => (window as unknown as { clicks: number }).clicks++);
    });

    await page.getByRole("button", { name: "Edit" }).click();

    expect(await page.evaluate(() => (window as unknown as { clicks: number }).clicks)).toBe(1);
    await expect(page.getByRole("menu")).toBeHidden();
  });

  test("opens the menu from the trailing button and reflects its expanded state", async ({ page, render }) => {
    await render(split());
    const trigger = page.getByRole("button", { name: "More actions" });

    await trigger.click();

    await expect(page.getByRole("menu")).toBeVisible();
    await expect(page.getByRole("menu")).toBeInViewport();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("menuitem")).toHaveCount(2);
  });

  test("closes the menu and restores focus to the trailing button when an item is chosen", async ({ page, render }) => {
    await render(split());
    const trigger = page.getByRole("button", { name: "More actions" });
    await trigger.click();
    await expect(page.getByRole("menu")).toBeInViewport();

    await page.getByRole("menuitem", { name: "Duplicate" }).click();

    await expect(page.getByRole("menu")).toBeHidden();
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
  });

  test("is not displayed when hidden", async ({ page, render }) => {
    await render(split("hidden"));

    await expect(page.locator("m3e-split-button")).toBeHidden();
  });
});
