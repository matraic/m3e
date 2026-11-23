import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { MenuHarness } from "./menu.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ menu: MenuHarness }>({
  menu: async ({ page, render }, use) => use(new MenuHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a menu with unchecked Bold and checked Italic options", ({ menu }) => {
  menu.html = `<m3e-button id="trigger"><m3e-menu-trigger for="menu">Format</m3e-menu-trigger></m3e-button>
    <m3e-menu id="menu" aria-label="Format">
      <m3e-menu-item-checkbox>Bold</m3e-menu-item-checkbox>
      <m3e-menu-item-checkbox checked>Italic</m3e-menu-item-checkbox>
    </m3e-menu>`;
});
When("the selection menu renders", async ({ menu }) => menu.render());
When("the user opens the selection menu", async ({ menu }) => {
  await menu.trigger.click();
  await expect(
    menu.menu.locator("m3e-menu-item-checkbox:not([disabled]), m3e-menu-item-radio:not([disabled])").first(),
  ).toBeFocused();
});
Then("Bold is unchecked and Italic is checked", async ({ page }) => {
  await expect(page.getByRole("menuitemcheckbox", { name: "Bold" })).not.toBeChecked();
  await expect(page.getByRole("menuitemcheckbox", { name: "Italic" })).toBeChecked();
});
When("the user focuses menu option {string}", async ({ page }, name: string) =>
  page.getByRole("menuitemcheckbox", { name }).focus(),
);
When("the user presses Space in the selection menu", async ({ page }) => page.keyboard.press("Space"));
Then("Bold is checked and the selection menu remains open", async ({ page }) => {
  await expect(page.getByRole("menuitemcheckbox", { name: "Bold" })).toBeChecked();
  await expect(page.getByRole("menu", { name: "Format" })).toBeVisible();
});
When("the user selects menu option {string}", async ({ page }, name: string) =>
  page.getByRole("menuitemcheckbox", { name }).click(),
);
Then("Italic is unchecked and the selection menu is closed", async ({ page }) => {
  await expect(page.locator("m3e-menu-item-checkbox").last()).not.toHaveAttribute("checked");
  await expect(page.getByRole("menu", { name: "Format" })).toBeHidden();
});

Given("a menu with a disabled checkbox option", ({ menu }) => {
  menu.html = `<m3e-button id="trigger"><m3e-menu-trigger for="menu">Format</m3e-menu-trigger></m3e-button>
    <m3e-menu id="menu" aria-label="Format">
      <m3e-menu-item-checkbox disabled>Locked</m3e-menu-item-checkbox>
      <m3e-menu-item-checkbox>Available</m3e-menu-item-checkbox>
    </m3e-menu>`;
});
When("the user attempts to activate the disabled checkbox", async ({ page }) =>
  page.getByRole("menuitemcheckbox", { name: "Locked" }).dispatchEvent("click"),
);
Then("the disabled checkbox remains unchecked and the menu stays open", async ({ page }) => {
  const locked = page.getByRole("menuitemcheckbox", { name: "Locked" });
  await expect(locked).not.toBeChecked();
  await expect(locked).toHaveAttribute("aria-disabled", "true");
  await expect(page.getByRole("menu", { name: "Format" })).toBeVisible();
});

Given("a menu with an Order radio group", ({ menu }) => {
  menu.html = `<m3e-button id="trigger"><m3e-menu-trigger for="menu">Sort</m3e-menu-trigger></m3e-button>
    <m3e-menu id="menu" aria-label="Sort">
      <m3e-menu-item-group aria-label="Order">
        <m3e-menu-item-radio checked>Ascending</m3e-menu-item-radio>
        <m3e-menu-item-radio>Descending</m3e-menu-item-radio>
      </m3e-menu-item-group>
    </m3e-menu>`;
});
Then("the Order group exposes its radio actions and current choice", async ({ page }) => {
  await expect(page.getByRole("group", { name: "Order" })).toBeVisible();
  await expect(page.getByRole("menuitemradio", { name: "Ascending" })).toBeChecked();
  await expect(page.getByRole("menuitemradio", { name: "Descending" })).not.toBeChecked();
});
When("the user selects radio action {string}", async ({ page }, name: string) =>
  page.getByRole("menuitemradio", { name }).click(),
);
Then("Descending is checked and Ascending is unchecked", async ({ page }) => {
  await expect(page.locator("m3e-menu-item-radio").last()).toHaveAttribute("checked", "");
  await expect(page.locator("m3e-menu-item-radio").first()).not.toHaveAttribute("checked");
});
Then("the selection menu is closed", async ({ page }) => expect(page.getByRole("menu", { name: "Sort" })).toBeHidden());
