import { mergeTests } from "@playwright/test";
import type { M3eNavRailElement } from "@m3e/web/nav-rail";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { NavRailHarness } from "./nav-rail.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  navRail: NavRailHarness;
}>({
  navRail: async ({ page, render }, use) => use(new NavRailHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a navigation rail with a menu toggle and home, search, and disabled settings destinations", ({ navRail }) =>
  navRail.prepare(),
);
When("the navigation rail renders", async ({ navRail }) => navRail.render());
Then("the rail is exposed as the {string} navigation landmark", async ({ page }, name: string) =>
  expect(page.getByRole("navigation", { name })).toBeVisible(),
);
Then("rail destination {string} is the current page", async ({ navRail }, name: string) =>
  expect(navRail.destination(name)).toHaveAttribute("aria-current", "true"),
);
Then("rail destination {string} is not the current page", async ({ navRail }, name: string) =>
  expect(navRail.destination(name)).toHaveAttribute("aria-current", "false"),
);
Then("rail destination {string} is exposed as disabled", async ({ navRail }, name: string) =>
  expect(navRail.destination(name)).toHaveAttribute("aria-disabled", "true"),
);
Then("the rail mode is {string}", async ({ navRail }, mode: string) =>
  expect.poll(() => navRail.rail.evaluate((rail: M3eNavRailElement) => rail.currentMode)).toBe(mode),
);
Then("every rail destination is laid out {string}", async ({ navRail }, orientation: string) => {
  for (const item of await navRail.items.all()) {
    await expect(item).toHaveAttribute("orientation", orientation);
  }
});
Then("the rail is {int}px wide", async ({ navRail }, width: number) =>
  expect(navRail.rail).toHaveCSS("width", `${width}px`),
);

When("the user clicks rail destination {string}", async ({ navRail }, name: string) =>
  navRail.destination(name).click(),
);
Then("the rail reports {string} as selected", async ({ navRail }, value: string) =>
  expect.poll(() => navRail.selectedValue()).toBe(value),
);

When("the user focuses rail destination {string}", async ({ navRail }, name: string) =>
  navRail.destination(name).focus(),
);
When("the user presses {string} on the navigation rail", async ({ page }, key: string) => page.keyboard.press(key));

When("the user attempts to click disabled rail destination {string}", async ({ navRail }, name: string) =>
  navRail.destination(name).dispatchEvent("click"),
);

When("the user focuses the control before the rail", async ({ page }) => page.locator("#before").focus());
Then("rail destination {string} is focused", async ({ navRail }, name: string) =>
  expect(navRail.destination(name)).toBeFocused(),
);
Then("focus moves past the navigation rail", async ({ page }) => expect(page.locator("#after")).toBeFocused());

Then("the rail menu button is focused", async ({ navRail }) => expect(navRail.menuButton).toBeFocused());

Given(
  "a navigation rail with a menu toggle and home, search, and disabled settings destinations in mode {string}",
  ({ navRail }, mode: string) => navRail.prepare(`mode="${mode}"`),
);
When("the application sets the rail mode to {string}", async ({ navRail }, mode: string) =>
  navRail.rail.evaluate((rail, mode) => rail.setAttribute("mode", mode), mode),
);

Given("a narrow viewport", async ({ page }) => page.setViewportSize({ width: 400, height: 800 }));
When("the viewport widens", async ({ page }) => page.setViewportSize({ width: 1400, height: 800 }));
When("the viewport narrows", async ({ page }) => page.setViewportSize({ width: 400, height: 800 }));

Given("a navigation rail with a compose action", ({ navRail }) => navRail.prepareWithAction());
Then("the compose action is not extended", async ({ page }) =>
  expect(page.getByRole("button", { name: "Compose" })).not.toHaveAttribute("extended"),
);
Then("the compose action is extended", async ({ page }) =>
  expect(page.getByRole("button", { name: "Compose" })).toHaveAttribute("extended", ""),
);

Given("a navigation rail with a compose action in mode {string}", ({ navRail }, mode: string) =>
  navRail.prepareWithAction(`mode="${mode}"`),
);
When("the application adds a second action to the rail", async ({ navRail }) => navRail.appendAction());
Then("the added action is extended", async ({ page }) =>
  expect(page.locator("#added-action")).toHaveAttribute("extended", ""),
);

Then("the rail animates width changes", async ({ navRail }) =>
  expect.poll(() => navRail.transitionDuration()).not.toBe("0s"),
);

Given("the user has reduced motion enabled", async ({ page }) => page.emulateMedia({ reducedMotion: "reduce" }));
Then("the rail does not animate width changes", async ({ navRail }) =>
  expect.poll(() => navRail.transitionDuration()).toBe("0s"),
);

Then("the rail menu button controls the rail", async ({ navRail }) =>
  expect(navRail.menuButton).toHaveAttribute("aria-controls", "rail"),
);
Then("the rail menu button is collapsed and not selected", async ({ navRail }) => {
  await expect(navRail.menuButton).toHaveAttribute("aria-expanded", "false");
  await expect(navRail.menuButton).not.toHaveAttribute("selected");
});
When("the user clicks the rail menu button", async ({ navRail }) => navRail.menuButton.click());
Then("the rail menu button is expanded and selected", async ({ navRail }) => {
  await expect(navRail.menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(navRail.menuButton).toHaveAttribute("selected", "");
});

When("the user focuses the rail menu button", async ({ navRail }) => navRail.menuButton.focus());

Given("a navigation rail with a plain menu button toggle", ({ navRail }) => navRail.preparePlainToggle());
Then("the rail menu button is expanded and not selected", async ({ navRail }) => {
  await expect(navRail.menuButton).toHaveAttribute("aria-expanded", "true");
  await expect(navRail.menuButton).not.toHaveAttribute("selected");
});

When("the application removes the rail toggle", async ({ page }) =>
  page.locator("m3e-nav-rail-toggle").evaluate((element) => element.remove()),
);
Then("the rail menu button has no expansion state and controls nothing", async ({ navRail }) => {
  await expect(navRail.menuButton).not.toHaveAttribute("aria-expanded");
  await expect(navRail.menuButton).not.toHaveAttribute("aria-controls");
});

When("the application retargets the rail toggle to {string}", async ({ page }, id: string) =>
  page.locator("m3e-nav-rail-toggle").evaluate((element, id) => element.setAttribute("for", id), id),
);
Given("a navigation rail with a menu toggle and a secondary rail", ({ navRail }) => navRail.prepareWithSecondary());
Then("the rail menu button controls {string}", async ({ navRail }, id: string) =>
  expect(navRail.menuButton).toHaveAttribute("aria-controls", id),
);
Then("the rail {string} is {int}px wide", async ({ page }, id: string, width: number) =>
  expect(page.locator(`#${id}`)).toHaveCSS("width", `${width}px`),
);
When("the application clears the rail toggle target", async ({ page }) =>
  page.locator("m3e-nav-rail-toggle").evaluate((element) => element.removeAttribute("for")),
);
Then("the rail {string} has {string} selected", async ({ page }, id: string, value: string) =>
  expect(page.locator(`#${id}`).locator("m3e-nav-item[selected]")).toHaveAttribute("value", value),
);

When("the application adds rail destination {string}", async ({ navRail }, name: string) =>
  navRail.appendDestination(name),
);

When("the application moves the rail to another container", async ({ navRail }) =>
  navRail.rail.evaluate((rail) => document.querySelector("#destination")!.append(rail)),
);
