import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { NavBarHarness } from "./nav-bar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ navBar: NavBarHarness }>({
  navBar: async ({ page, render }, use) => use(new NavBarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

const small = { width: 400, height: 800 };
const large = { width: 1400, height: 800 };

Given("a navigation bar layout fixture", ({ navBar }) => navBar.layout());
When("the navigation bar layout renders", async ({ navBar }) => navBar.render());
Then("every destination is laid out {string}", async ({ navBar }, orientation: string) => {
  for (const item of await navBar.items.all()) {
    await expect(item).toHaveAttribute("orientation", orientation);
  }
});
When("the application sets the bar mode to {string}", async ({ navBar }, mode: string) =>
  navBar.bar.evaluate((bar, mode) => bar.setAttribute("mode", mode), mode),
);

Given("a navigation bar layout fixture in mode {string}", ({ navBar }, mode: string) =>
  navBar.layout(`mode="${mode}"`),
);
Then("the bar mode is {string}", async ({ navBar }, mode: string) => expect(navBar.bar).toHaveAttribute("mode", mode));

When("the application adds a layout destination", async ({ navBar }) => navBar.appendDestination("Added"));

Given("a small viewport", async ({ page }) => page.setViewportSize(small));
When("the viewport becomes large", async ({ page }) => page.setViewportSize(large));
When("the viewport becomes small", async ({ page }) => page.setViewportSize(small));

When("the application moves the bar to another container", async ({ navBar }) =>
  navBar.bar.evaluate((bar) => document.querySelector("#destination")!.append(bar)),
);

Given("a navigation bar layout fixture with bevel items and a round focus ring", ({ navBar }) =>
  navBar.layout(`style="--m3e-nav-item-shape-family: bevel; --m3e-nav-item-focus-ring-shape-family: round"`),
);
Then("the destination layers use the bevel shape", async ({ navBar }) => {
  for (const surface of await navBar.items.first().locator(".outer, .inner, m3e-selection-indicator.indicator").all()) {
    await expect(surface).toHaveCSS("corner-shape", "superellipse(0)");
  }
});
Then(
  "the destination focus ring is {word} with a {int}px radius",
  async ({ navBar }, shape: string, radius: number) => {
    const ring = navBar.items.first().locator(".focus-ring");
    await expect(ring).toHaveCSS("corner-shape", shape === "round" ? "superellipse(1)" : "superellipse(0)");
    await expect(ring).toHaveCSS("border-radius", `${radius}px`);
  },
);
