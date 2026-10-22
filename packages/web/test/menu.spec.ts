import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

async function openMenu(page: Page, menu = page.getByRole("menu")): Promise<void> {
  await page.locator("m3e-button").first().click();
  await expect(menu).toBeVisible();
  await expect(menu).toBeInViewport();
}

const basic = `
  <m3e-button><m3e-menu-trigger for="menu">Open</m3e-menu-trigger></m3e-button>
  <m3e-menu id="menu">
    <m3e-menu-item>Apple</m3e-menu-item>
    <m3e-menu-item disabled>Apricot</m3e-menu-item>
    <m3e-menu-item>Avocado</m3e-menu-item>
  </m3e-menu>
`;

test.describe("m3e-menu", () => {
  test("wires up the trigger with popup semantics and opens and closes on click", async ({ page, render }) => {
    await render(basic);
    const button = page.locator("m3e-button");
    const menu = page.getByRole("menu");

    await expect(button).toHaveAttribute("aria-haspopup", "menu");
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toHaveAttribute("aria-controls", "menu");
    await expect(menu).toBeHidden();

    await button.click();
    await expect(menu).toBeVisible();
    await expect(button).toHaveAttribute("aria-expanded", "true");
    await expect(menu.getByRole("menuitem")).toHaveCount(3);

    await button.click();
    await expect(menu).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
  });

  test("closes and restores focus to the trigger when an item is activated", async ({ page, render }) => {
    await render(basic);
    const button = page.locator("m3e-button");

    await openMenu(page);
    await page.getByRole("menuitem", { name: "Apple" }).click();

    await expect(page.getByRole("menu")).toBeHidden();
    await expect(button).toHaveAttribute("aria-expanded", "false");
    await expect(button).toBeFocused();
  });

  test("does not close when a disabled item is clicked", async ({ page, render }) => {
    await render(basic);

    await openMenu(page);
    await page.getByRole("menuitem", { name: "Apricot" }).dispatchEvent("click");

    await expect(page.getByRole("menu")).toBeVisible();
  });

  test("closes on Escape and restores focus to the trigger", async ({ page, render }) => {
    await render(basic);
    const button = page.locator("m3e-button");

    await openMenu(page);
    await page.getByRole("menuitem", { name: "Apple" }).focus();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("menu")).toBeHidden();
    await expect(button).toBeFocused();
  });

  test("closes on Tab", async ({ page, render }) => {
    await render(basic);

    await openMenu(page);
    await page.getByRole("menuitem", { name: "Apple" }).focus();
    await page.keyboard.press("Tab");

    await expect(page.getByRole("menu")).toBeHidden();
  });

  test("moves focus between enabled items with the arrow keys, skipping disabled ones", async ({ page, render }) => {
    await render(basic);

    await openMenu(page);
    const apple = page.getByRole("menuitem", { name: "Apple" });
    const avocado = page.getByRole("menuitem", { name: "Avocado" });

    await apple.focus();
    await page.keyboard.press("ArrowDown");
    await expect(avocado).toBeFocused();

    await page.keyboard.press("ArrowUp");
    await expect(apple).toBeFocused();
  });

  test("toggles checkbox items and keeps the menu open when toggled with Space", async ({ page, render }) => {
    await render(`
      <m3e-button><m3e-menu-trigger for="menu">Format</m3e-menu-trigger></m3e-button>
      <m3e-menu id="menu">
        <m3e-menu-item-checkbox>Bold</m3e-menu-item-checkbox>
        <m3e-menu-item-checkbox checked>Italic</m3e-menu-item-checkbox>
      </m3e-menu>
    `);
    const bold = page.getByRole("menuitemcheckbox", { name: "Bold" });
    const italic = page.getByRole("menuitemcheckbox", { name: "Italic" });

    await openMenu(page);
    await expect(bold).not.toBeChecked();
    await expect(italic).toBeChecked();

    await bold.focus();
    await page.keyboard.press("Space");
    await expect(bold).toBeChecked();
    await expect(page.getByRole("menu")).toBeVisible();

    await italic.click();
    await expect(italic).not.toBeChecked();
    await expect(page.getByRole("menu")).toBeHidden();
  });

  test("allows only one radio item to be checked within a group", async ({ page, render }) => {
    await render(`
      <m3e-button><m3e-menu-trigger for="menu">Sort</m3e-menu-trigger></m3e-button>
      <m3e-menu id="menu">
        <m3e-menu-item-group aria-label="Order">
          <m3e-menu-item-radio checked>Ascending</m3e-menu-item-radio>
          <m3e-menu-item-radio>Descending</m3e-menu-item-radio>
        </m3e-menu-item-group>
      </m3e-menu>
    `);
    const ascending = page.getByRole("menuitemradio", { name: "Ascending" });
    const descending = page.getByRole("menuitemradio", { name: "Descending" });

    await openMenu(page);
    await expect(page.getByRole("group", { name: "Order" })).toBeVisible();
    await expect(ascending).toBeChecked();
    await expect(descending).not.toBeChecked();

    await descending.click();
    await openMenu(page);
    await expect(descending).toBeChecked();
    await expect(ascending).not.toBeChecked();
  });

  test("opens a submenu from an item and closes every menu when a submenu item is activated", async ({
    page,
    render,
  }) => {
    await render(`
      <m3e-button><m3e-menu-trigger for="menu">Open</m3e-menu-trigger></m3e-button>
      <m3e-menu id="menu">
        <m3e-menu-item><m3e-menu-trigger for="sub">Fruits</m3e-menu-trigger></m3e-menu-item>
        <m3e-menu-item>Grapes</m3e-menu-item>
      </m3e-menu>
      <m3e-menu id="sub">
        <m3e-menu-item>Apricot</m3e-menu-item>
        <m3e-menu-item>Avocado</m3e-menu-item>
      </m3e-menu>
    `);
    const fruits = page.getByRole("menuitem", { name: "Fruits" });
    const apricot = page.getByRole("menuitem", { name: "Apricot" });

    await openMenu(page);
    await expect(fruits).toHaveAttribute("aria-haspopup", "menu");
    await expect(fruits).toHaveAttribute("aria-expanded", "false");
    await expect(apricot).toBeHidden();

    await fruits.click();
    await expect(apricot).toBeVisible();
    await expect(fruits).toHaveAttribute("aria-expanded", "true");

    await apricot.click();
    await expect(apricot).toBeHidden();
    await expect(page.getByRole("menuitem", { name: "Grapes" })).toBeHidden();
    await expect(page.locator("m3e-button")).toHaveAttribute("aria-expanded", "false");
  });

  test("opens a submenu with ArrowRight and closes only the submenu with ArrowLeft", async ({ page, render }) => {
    await render(`
      <m3e-button><m3e-menu-trigger for="menu">Open</m3e-menu-trigger></m3e-button>
      <m3e-menu id="menu">
        <m3e-menu-item><m3e-menu-trigger for="sub">Fruits</m3e-menu-trigger></m3e-menu-item>
        <m3e-menu-item>Grapes</m3e-menu-item>
      </m3e-menu>
      <m3e-menu id="sub">
        <m3e-menu-item>Apricot</m3e-menu-item>
      </m3e-menu>
    `);
    const fruits = page.getByRole("menuitem", { name: "Fruits" });
    const apricot = page.getByRole("menuitem", { name: "Apricot" });

    await openMenu(page);
    await fruits.focus();
    await page.keyboard.press("ArrowRight");
    await expect(apricot).toBeVisible();

    await apricot.focus();
    await page.keyboard.press("ArrowLeft");
    await expect(apricot).toBeHidden();
    await expect(page.getByRole("menuitem", { name: "Grapes" })).toBeVisible();
    await expect(fruits).toBeFocused();
  });

  test("falls back to the standard variant for an invalid value", async ({ page, render }) => {
    await render(`<m3e-menu variant="bogus"></m3e-menu>`);

    await expect(page.locator("m3e-menu")).toHaveAttribute("variant", "standard");
  });
});
