import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { SlideGroupHarness } from "./slide-group.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ slideGroup: SlideGroupHarness }>({
  slideGroup: async ({ page, render }, use) => use(new SlideGroupHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a slide group with {int} items in a {int} pixel width", ({ slideGroup }, count: number, width: number) => {
  slideGroup.count = count;
  slideGroup.width = width;
});
When("the slide group renders", async ({ slideGroup }) => slideGroup.render());
Then("the slide group has no paging buttons", async ({ slideGroup }) => {
  await expect(slideGroup.group.locator(".prev-button, .next-button")).toHaveCount(0);
});

Then("both slide-group paging buttons are visible", async ({ slideGroup }) => {
  await expect(slideGroup.previous).toBeVisible();
  await expect(slideGroup.next).toBeVisible();
});
Then("the slide-group previous button is disabled", async ({ slideGroup }) =>
  expect(slideGroup.previous).toBeDisabled(),
);
Then("the slide-group next button is enabled", async ({ slideGroup }) => expect(slideGroup.next).toBeEnabled());

When("the user pages the slide group forward", async ({ slideGroup }) => slideGroup.pageOnce("next"));
Then("the slide group has scrolled forward on its main axis only", async ({ slideGroup }) => {
  const { position, crossPosition } = await slideGroup.metrics();
  expect(position).toBeGreaterThan(0);
  expect(crossPosition).toBe(0);
});
Then("the slide-group previous button is enabled", async ({ slideGroup }) => expect(slideGroup.previous).toBeEnabled());
When("the user pages the slide group backward", async ({ slideGroup }) => slideGroup.pageOnce("previous"));
Then("the slide group is at the start", async ({ slideGroup }) =>
  expect.poll(async () => (await slideGroup.metrics()).position).toBe(0),
);
When("the user pages to the end of the slide group", async ({ slideGroup }) => slideGroup.pageToEnd());
Then("the slide group is at the end", async ({ slideGroup }) => {
  await expect
    .poll(async () => {
      const { position, max } = await slideGroup.metrics();
      return Math.abs(position - max);
    })
    .toBeLessThan(1);
});
Then("the slide-group next button is disabled", async ({ slideGroup }) => expect(slideGroup.next).toBeDisabled());

Given(
  "the slide-group previous and next labels are {string} and {string}",
  ({ slideGroup }, previous: string, next: string) => {
    slideGroup.attributes.set("previous-page-label", previous);
    slideGroup.attributes.set("next-page-label", next);
  },
);
Then(
  "the slide-group paging buttons are named {string} and {string}",
  async ({ slideGroup }, previous: string, next: string) => {
    await expect(slideGroup.group.getByRole("button", { name: previous, exact: true })).toBeVisible();
    await expect(slideGroup.group.getByRole("button", { name: next, exact: true })).toBeVisible();
  },
);

When("the application resizes the slide group to {int} pixels wide", async ({ slideGroup }, width: number) =>
  slideGroup.resize(width),
);

Given("the slide group is vertical", ({ slideGroup }) => {
  slideGroup.attributes.set("vertical", "");
});

Given("the slide group is hidden", ({ slideGroup }) => {
  slideGroup.attributes.set("hidden", "");
});
Then("the slide group is not displayed", async ({ slideGroup }) => expect(slideGroup.group).toBeHidden());

Given("the slide group is disabled", ({ slideGroup }) => {
  slideGroup.attributes.set("disabled", "");
});
When("the application sets slide-group {string} to {string}", async ({ slideGroup }, name: string, value: string) =>
  slideGroup.setAttribute(name, value),
);
When("the application removes slide-group {string}", async ({ slideGroup }, name: string) =>
  slideGroup.group.evaluate((group, name) => group.removeAttribute(name), name),
);

Given("each slide-group item is {int} pixels wide", ({ slideGroup }, width: number) => {
  slideGroup.itemWidth = width;
});
Given("the slide-group threshold is {int} pixels", ({ slideGroup }, threshold: number) => {
  slideGroup.attributes.set("threshold", String(threshold));
});

Given("the slide group is {int} pixels high", ({ slideGroup }, height: number) => {
  slideGroup.height = height;
});

Given("the slide-group document reads right to left", ({ slideGroup }) => {
  slideGroup.direction = "rtl";
});
When("the slide-group document changes to right to left", async ({ slideGroup }) =>
  slideGroup.page.locator("body").evaluate((body) => (body.dir = "rtl")),
);

When("the application changes the slide group to {int} items", async ({ slideGroup }, count: number) =>
  slideGroup.setItemCount(count),
);

When("the application moves the slide group between containers twice", async ({ slideGroup }) => {
  await slideGroup.move();
  await slideGroup.move();
});

Given("the slide group has custom paging icons", ({ slideGroup }) => {
  slideGroup.customIcons = true;
});
Then("the slide-group custom paging icons are visible", async ({ slideGroup }) => {
  await expect(slideGroup.group.getByText("Back icon")).toBeVisible();
  await expect(slideGroup.group.getByText("Forward icon")).toBeVisible();
  await expect(slideGroup.previous).toHaveAccessibleName("Previous page");
  await expect(slideGroup.next).toHaveAccessibleName("Next page");
});

Given("the slide-group items are focusable", ({ slideGroup }) => {
  slideGroup.focusableItems = true;
});
When("the user tabs into the slide group", async ({ slideGroup }) => {
  await slideGroup.page.locator("#before").focus();
  await slideGroup.page.keyboard.press("Tab");
});
Then("the first slide-group item has focus", async ({ slideGroup }) =>
  expect(slideGroup.group.getByRole("button", { name: "Item 1", exact: true })).toBeFocused(),
);
When("the user tabs through the slide-group items", async ({ slideGroup }) => {
  for (let i = 0; i < slideGroup.count; i++) await slideGroup.page.keyboard.press("Tab");
});
Then("focus is after the slide group", async ({ slideGroup }) =>
  expect(slideGroup.page.locator("#after")).toBeFocused(),
);
