import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { MenuHarness } from "./menu.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ menu: MenuHarness }>({
  menu: async ({ page, render }, use) => use(new MenuHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a menu with a Fruits submenu", ({ menu }) => menu.submenuMenu());
When("the submenu fixture renders", async ({ menu }) => menu.render());
Then("the submenu action exposes collapsed popup semantics", async ({ page }) => {
  const fruits = page.locator("#menu m3e-menu-item").first();
  await expect(fruits).toHaveAttribute("aria-haspopup", "menu");
  await expect(fruits).toHaveAttribute("aria-expanded", "false");
  await expect(fruits).toHaveAttribute("aria-controls", "submenu");
});
Then("the submenu is hidden from the accessibility tree", async ({ page }) => {
  await expect(page.getByRole("menu", { name: "Fruits" })).toBeHidden();
  await expect(page.getByRole("menuitem", { name: "Apricot" })).toHaveCount(0);
});
When("the user opens the root menu", async ({ menu }) => {
  await menu.trigger.click();
  await expect(menu.menu.locator("m3e-menu-item").first()).toBeFocused();
});
When("the user activates submenu action {string}", async ({ page }, name: string) =>
  page.getByRole("menuitem", { name }).click(),
);
Then("the submenu is visible and announced as expanded", async ({ page }) => {
  await expect(page.getByRole("menu", { name: "Fruits" })).toBeVisible();
  await expect(page.getByRole("menuitem", { name: "Fruits" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menuitem", { name: "Apricot" })).toBeVisible();
});
When("the user selects submenu action {string}", async ({ page }, name: string) =>
  page.getByRole("menuitem", { name }).click(),
);
Then("the menu hierarchy is closed and focus returns to the root trigger", async ({ menu }) => {
  await expect(menu.menu).toBeHidden();
  await expect(menu.submenu).toBeHidden();
  await expect(menu.trigger).toHaveAttribute("aria-expanded", "false");
  await expect(menu.trigger).toBeFocused();
});
When("the user focuses submenu action {string}", async ({ page }, name: string) =>
  page.getByRole("menuitem", { name }).focus(),
);
When("the user presses {string} in the submenu parent", async ({ page }, key: string) => page.keyboard.press(key));
Then("the submenu is visible", async ({ menu }) => expect(menu.submenu).toBeVisible());
When("the user presses {string} in the submenu", async ({ page }, key: string) => page.keyboard.press(key));
Then("the submenu is hidden and focus returns to {string}", async ({ page, menu }, name: string) => {
  await expect(menu.submenu).toBeHidden();
  await expect(page.getByRole("menuitem", { name })).toBeFocused();
});
Then("the root menu remains visible", async ({ menu }) => expect(menu.menu).toBeVisible());

Given("a scrollable menu with a submenu", ({ menu }) => menu.scrollingMenu());
When("the scrollable menu fixture renders", async ({ menu }) => menu.render());
When("the user opens submenu {string}", async ({ page }, name: string) => page.getByRole("menuitem", { name }).click());
Then("both open menus follow their scrolling ancestors", async ({ page, menu }) => {
  const rootBefore = await menu.menu.boundingBox();
  const submenuBefore = await menu.submenu.boundingBox();
  if (!rootBefore || !submenuBefore) throw new Error("Open menus must have bounds before scrolling.");

  await page.mouse.move(0, 0);
  await page.locator("#scroller").evaluate((element) => (element.scrollTop = 40));
  await expect.poll(() => page.locator("#scroller").evaluate((element) => element.scrollTop)).toBe(40);
  await expect
    .poll(async () => {
      const bounds = await menu.menu.boundingBox();
      return bounds ? Math.round(rootBefore.y - bounds.y) : null;
    })
    .toBe(40);
  await expect
    .poll(async () => {
      const bounds = await menu.submenu.boundingBox();
      return bounds ? Math.abs(submenuBefore.y - bounds.y - 40) : null;
    })
    .toBeLessThanOrEqual(8);

  const submenuAfterAncestorScroll = await menu.submenu.boundingBox();
  if (!submenuAfterAncestorScroll) throw new Error("The open submenu must have bounds after scrolling.");
  await menu.menu.evaluate((element) => (element.scrollTop = 25));
  await expect.poll(() => menu.menu.evaluate((element) => element.scrollTop)).toBe(25);
  await expect
    .poll(async () => {
      const bounds = await menu.submenu.boundingBox();
      return bounds ? Math.abs(submenuAfterAncestorScroll.y - bounds.y - 25) : null;
    })
    .toBeLessThanOrEqual(8);
  await expect(menu.menu).toBeVisible();
  await expect(menu.submenu).toBeVisible();
});

Given("a movable menu with enabled and disabled actions", ({ menu }) => menu.standard());
When("the menu movement fixture renders", async ({ menu }) => menu.render());
When("the application moves the closed menu to another parent", async ({ menu }) =>
  menu.menu.evaluate((element) => {
    const destination = document.querySelector("#menu-destination");
    if (!destination) throw new Error("Menu destination is missing.");
    destination.append(element);
  }),
);
Then("the trigger still controls the menu", async ({ menu }) => {
  await expect(menu.trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(menu.trigger).toHaveAttribute("aria-controls", "menu");
  await expect(menu.trigger).toHaveAttribute("aria-expanded", "false");
});
When("the user opens the moved menu", async ({ menu }) => menu.trigger.click());
Then("the moved menu is visible with all accessible actions", async ({ menu }) => {
  await expect(menu.menu).toBeVisible();
  await expect(menu.menu.getByRole("menuitem")).toHaveCount(3);
});
Given("a menu with two trigger buttons", ({ menu }) => menu.twoTriggerMenu());
When("the user opens the first root menu", async ({ menu, page }) => {
  await page.locator("#first-trigger").click();
  await expect(menu.menu.locator("m3e-menu-item").first()).toBeFocused();
});
Then("the root menu is visible", async ({ menu }) => expect(menu.menu).toBeVisible());
When("the application moves the menu trigger to the second button", async ({ page }) =>
  page.locator("#first-trigger m3e-menu-trigger").evaluate((element) => {
    const destination = document.querySelector("#second-trigger");
    if (!destination) throw new Error("Second menu trigger button is missing.");
    destination.append(element);
  }),
);
Then("the first button no longer announces a menu", async ({ page }) => {
  await expect(page.locator("#first-trigger")).not.toHaveAttribute("aria-haspopup");
  await expect(page.locator("#first-trigger")).not.toHaveAttribute("aria-expanded");
  await expect(page.locator("#first-trigger")).not.toHaveAttribute("aria-controls");
});
Then("the second button announces a collapsed menu", async ({ page }) => {
  await expect(page.locator("#second-trigger")).toHaveAttribute("aria-haspopup", "menu");
  await expect(page.locator("#second-trigger")).toHaveAttribute("aria-controls", "menu");
  await expect(page.locator("#second-trigger")).toHaveAttribute("aria-expanded", "false");
});
Then("the root menu is hidden", async ({ menu }) => expect(menu.menu).toBeHidden());
When("the user opens the root menu from the second button", async ({ menu, page }) => {
  await page.locator("#second-trigger").click();
  await expect(menu.menu.locator("m3e-menu-item").first()).toBeFocused();
});
Then("the second button announces an expanded menu", async ({ page }) =>
  expect(page.locator("#second-trigger")).toHaveAttribute("aria-expanded", "true"),
);
