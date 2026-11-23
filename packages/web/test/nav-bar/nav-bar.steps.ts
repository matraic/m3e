import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { NavBarHarness } from "./nav-bar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ navBar: NavBarHarness }>({
  navBar: async ({ page, render }, use) => use(new NavBarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a navigation bar with home, search, and disabled settings destinations", ({ navBar }) => navBar.standard());
When("the navigation bar renders", async ({ navBar }) => navBar.render());
Then("the bar is exposed as the {string} navigation landmark", async ({ page }, name: string) =>
  expect(page.getByRole("navigation", { name })).toBeVisible(),
);
Then("destination {string} is the current page", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toHaveAttribute("aria-current", "true"),
);
Then("destination {string} is not the current page", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toHaveAttribute("aria-current", "false"),
);
Then("destinations do not expose selected or pressed states", async ({ navBar }) => {
  for (const item of await navBar.items.all()) {
    await expect(item).not.toHaveAttribute("aria-selected");
    await expect(item).not.toHaveAttribute("aria-pressed");
  }
});
Then("destination {string} is exposed as disabled", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toHaveAttribute("aria-disabled", "true"),
);
Then("only the icon of destination {string} is filled", async ({ navBar }, name: string) => {
  await expect(navBar.bar.locator("m3e-icon[filled]")).toHaveCount(1);
  await expect(navBar.destination(name).locator("m3e-icon")).toHaveAttribute("filled");
});

Given("a navigation bar with a linked destination", ({ navBar }) => navBar.linked());
Then("destination link {string} points to {string}", async ({ page }, name: string, href: string) =>
  expect(page.getByRole("link", { name })).toHaveAttribute("href", href),
);

When("the application listens for navigation events", async ({ navBar }) => navBar.recordEvents());
When("the user clicks destination {string}", async ({ navBar }, name: string) => navBar.destination(name).click());
Then("the bar reports {string} as selected", async ({ navBar }, value: string) =>
  expect.poll(() => navBar.selectedValue()).toBe(value),
);
Then("the navigation events {string} were dispatched", async ({ navBar }, events: string) =>
  expect.poll(() => navBar.events()).toEqual(events.split(", ")),
);

When("the user focuses destination {string}", async ({ navBar }, name: string) => navBar.destination(name).focus());
When("the user presses {string} on the navigation bar", async ({ page }, key: string) => page.keyboard.press(key));

When("the application cancels navigation changes", async ({ navBar }) =>
  navBar.bar.evaluate((bar) => bar.addEventListener("beforeinput", (e) => e.preventDefault())),
);

When("the user attempts to click disabled destination {string}", async ({ navBar }, name: string) =>
  navBar.destination(name).dispatchEvent("click"),
);
Then("no navigation events were dispatched", async ({ navBar }) => expect(await navBar.events()).toEqual([]));

Given("a navigation bar with a disabled interactive search destination", ({ navBar }) => navBar.disabledInteractive());
Then("destination {string} is focused", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toBeFocused(),
);

When("the user focuses the control before the bar", async ({ page }) => page.locator("#before").focus());
Then("focus moves past the navigation bar", async ({ page }) => expect(page.locator("#after")).toBeFocused());

When("the application adds destination {string}", async ({ navBar }, name: string) => navBar.appendDestination(name));

When("the application adds selected destination {string}", async ({ navBar }, name: string) =>
  navBar.appendDestination(name, true),
);

When("the application removes destination {string}", async ({ navBar }, name: string) =>
  navBar.destination(name).evaluate((item) => item.remove()),
);
Then("the bar reports no selection", async ({ navBar }) => expect.poll(() => navBar.selectedValue()).toBeNull());
Then("the bar has {int} destinations", async ({ navBar }, count: number) => expect(navBar.items).toHaveCount(count));

Given("a compact primary bar and an expanded secondary bar", ({ navBar }) => navBar.primaryAndSecondary());
When("the application moves destination {string} to the secondary bar", async ({ navBar }, name: string) =>
  navBar.destination(name).evaluate((item) => document.querySelector("#secondary")!.append(item)),
);
Then("the primary bar has {int} destination", async ({ navBar }, count: number) =>
  expect(navBar.items).toHaveCount(count),
);
Then("destination {string} is laid out {string}", async ({ navBar }, name: string, orientation: string) =>
  expect(navBar.destination(name)).toHaveAttribute("orientation", orientation),
);
