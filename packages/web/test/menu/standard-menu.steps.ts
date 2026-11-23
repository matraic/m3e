import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { MenuHarness } from "./menu.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ menu: MenuHarness }>({
  menu: async ({ page, render }, use) => use(new MenuHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a standard menu with enabled and disabled actions", ({ menu }) => menu.standard());
When("the menu fixture renders", async ({ menu }) => menu.render());
Then("the trigger exposes collapsed menu semantics", async ({ menu }) => {
  await expect(menu.trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(menu.trigger).toHaveAttribute("aria-expanded", "false");
  await expect(menu.trigger).toHaveAttribute("aria-controls", "menu");
});
Then("the menu and its actions are hidden", async ({ page, menu }) => {
  await expect(page.getByRole("menu", { name: "Main menu" })).toBeHidden();
  await expect(menu.menu.getByRole("menuitem")).toHaveCount(0);
});
When("the user opens the menu", async ({ menu }) => {
  await menu.trigger.click();
  await expect(menu.menu.locator("m3e-menu-item").first()).toBeFocused();
});
Then("the menu is visible with all accessible actions", async ({ page, menu }) => {
  await expect(page.getByRole("menu", { name: "Main menu" })).toBeVisible();
  await expect(menu.menu.getByRole("menuitem")).toHaveCount(3);
  await expect(menu.action("Apricot")).toHaveAttribute("aria-disabled", "true");
});
When("the user closes the menu", async ({ menu }) => menu.trigger.click());
Then("the menu is hidden and the trigger is collapsed", async ({ page, menu }) => {
  await expect(page.getByRole("menu", { name: "Main menu" })).toBeHidden();
  await expect(menu.trigger).toHaveAttribute("aria-expanded", "false");
});
When("the user selects menu action {string}", async ({ menu }, name: string) => menu.action(name).click());
Then("the menu closes and focus returns to its trigger", async ({ page, menu }) => {
  await expect(page.getByRole("menu", { name: "Main menu" })).toBeHidden();
  await expect(menu.trigger).toHaveAttribute("aria-expanded", "false");
  await expect(menu.trigger).toBeFocused();
});
When("the user attempts to activate disabled menu action {string}", async ({ menu }, name: string) =>
  menu.action(name).dispatchEvent("click"),
);
Then("the disabled action remains unavailable and the menu stays open", async ({ menu }) => {
  await expect(menu.action("Apricot")).toHaveAttribute("aria-disabled", "true");
  await expect(menu.menu).toBeVisible();
});
When("the user focuses menu action {string}", async ({ menu }, name: string) => menu.action(name).focus());
When("the user presses {string} in the menu", async ({ page }, key: string) => page.keyboard.press(key));
Then("the menu is hidden", async ({ menu }) => expect(menu.menu).toBeHidden());
Then("focus moves past the menu", async ({ page }) => expect(page.locator("#after-menu")).toBeFocused());
Then("menu action {string} is focused", async ({ menu }, name: string) => expect(menu.action(name)).toBeFocused());
When("the user clicks outside the menu", async ({ page }) => page.mouse.click(0, 0));

Given("a menu with an invalid variant", ({ menu }) => {
  menu.html = `<m3e-menu id="menu" variant="invalid"></m3e-menu>`;
});
Then("the menu uses the standard variant", async ({ menu }) =>
  expect(menu.menu).toHaveAttribute("variant", "standard"),
);
