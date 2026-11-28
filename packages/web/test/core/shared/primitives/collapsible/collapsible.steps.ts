import type { M3eCollapsibleElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { CollapsibleHarness } from "./collapsible.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ collapsible: CollapsibleHarness }>({
  collapsible: async ({ page, render }, use) => use(new CollapsibleHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a collapsible", ({ collapsible }) => {
  collapsible.attributes = "";
});
When("the collapsible renders", async ({ collapsible }) => collapsible.show());
Then("the collapsible has its default properties", async ({ collapsible }) =>
  expect(
    await collapsible.element.evaluate((element: M3eCollapsibleElement) => [
      element.open,
      element.orientation,
      element.noAnimate,
      element.slide,
    ]),
  ).toEqual([false, "vertical", false, false]),
);
Then("the collapsible content is hidden", async ({ page, collapsible }) => {
  await expect(page.getByText("Content")).toBeHidden();
  expect(await collapsible.element.evaluate((element) => getComputedStyle(element).visibility)).toBe("hidden");
});

Given("a collapsible with {string}", ({ collapsible }, attributes: string) => {
  collapsible.attributes = attributes;
});
Then("the collapsible content is visible and not inert", async ({ page, collapsible }) => {
  await expect(page.getByText("Content")).toBeVisible();
  await expect(collapsible.element).not.toHaveAttribute("inert", "");
});
Then("the collapsible has emitted no events", async ({ collapsible }) =>
  expect(await collapsible.events()).toEqual([]),
);
When("the application sets the collapsible properties", async ({ collapsible }) =>
  collapsible.element.evaluate((element: M3eCollapsibleElement) => {
    element.open = true;
    element.orientation = "horizontal";
    element.noAnimate = true;
    element.slide = true;
  }),
);
Then("the collapsible reflects its properties", async ({ collapsible }) => {
  await expect(collapsible.element).toHaveAttribute("open", "");
  await expect(collapsible.element).toHaveAttribute("orientation", "horizontal");
  await expect(collapsible.element).toHaveAttribute("no-animate", "");
  await expect(collapsible.element).toHaveAttribute("slide", "");
});
When("the application opens the collapsible", async ({ collapsible }) =>
  collapsible.element.evaluate((element: M3eCollapsibleElement) => {
    element.open = true;
  }),
);
Then("the collapsible events are {string}", async ({ collapsible }, events: string) =>
  expect.poll(() => collapsible.events()).toEqual(events.split(", ")),
);
When("the application closes the collapsible", async ({ collapsible }) =>
  collapsible.element.evaluate((element: M3eCollapsibleElement) => {
    element.open = false;
  }),
);
Then("the collapsible content is hidden and inert", async ({ page, collapsible }) => {
  await expect(page.getByText("Content")).toBeHidden();
  await expect(collapsible.element).toHaveAttribute("inert", "");
});

Given("a collapsible with motion enabled", ({ collapsible }) => {
  collapsible.motion = true;
});
Given("a collapsible with {string} and motion enabled", ({ collapsible }, attributes: string) => {
  collapsible.attributes = attributes;
  collapsible.motion = true;
});

Then("the collapsible state is {string} instead of {string}", async ({ collapsible }, current: string, old: string) => {
  await expect.poll(() => collapsible.state(current)).toBe(true);
  expect(await collapsible.state(old)).toBe(false);
});
When("the application sets collapsible orientation to {string}", async ({ collapsible }, orientation: string) =>
  collapsible.element.evaluate((element, value) => element.setAttribute("orientation", value), orientation),
);
Then("the collapsible reflects orientation {string}", async ({ collapsible }, orientation: string) =>
  expect(collapsible.element).toHaveAttribute("orientation", orientation),
);
Then("the collapsible width is zero", async ({ collapsible }) =>
  expect.poll(() => collapsible.element.evaluate((element) => element.getBoundingClientRect().width)).toBe(0),
);
Then("the collapsible width is greater than zero", async ({ collapsible }) =>
  expect
    .poll(() => collapsible.element.evaluate((element) => element.getBoundingClientRect().width))
    .toBeGreaterThan(0),
);
