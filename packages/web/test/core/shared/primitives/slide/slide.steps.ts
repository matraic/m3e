import type { M3eSlideElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { SlideHarness } from "./slide.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ slide: SlideHarness }>({
  slide: async ({ page, render }, use) => use(new SlideHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a slide with three items and no selection", ({ slide }) => {
  slide.index = null;
});
When("the slide renders", async ({ slide }) => slide.show());
Then("the slide has no selected index", async ({ slide }) =>
  expect(await slide.slide.evaluate((element: M3eSlideElement) => element.selectedIndex)).toBeNull(),
);
Then("slide items {string} are before and inert", async ({ slide }, names: string) => {
  for (const name of names.split(", "))
    await expect.poll(() => slide.state(name)).toEqual({ before: true, after: false, inert: true });
});

Given("a slide with three items and selected index {int}", ({ slide }, index: number) => {
  slide.index = index;
});
Then("slide item {string} is selected and visible", async ({ slide }, name: string) => {
  await expect.poll(() => slide.state(name)).toEqual({ before: false, after: false, inert: false });
  await expect(slide.item(name)).toBeVisible();
});
Then("slide items {string} are after and inert", async ({ slide }, names: string) => {
  for (const name of names.split(", "))
    await expect.poll(() => slide.state(name)).toEqual({ before: false, after: true, inert: true });
});
Then("slide items {string} are hidden", async ({ slide }, names: string) => {
  for (const name of names.split(", ")) await expect(slide.item(name)).toBeHidden();
});
When("the application sets the slide index to {int}", async ({ slide }, index: number) =>
  slide.slide.evaluate((element: M3eSlideElement, value) => {
    element.selectedIndex = value;
  }, index),
);
Then("the slide reflects index {int}", async ({ slide }, index: number) =>
  expect(slide.slide).toHaveAttribute("selected-index", String(index)),
);
When("the application clears the slide index", async ({ slide }) =>
  slide.slide.evaluate((element: M3eSlideElement) => {
    element.selectedIndex = null;
  }),
);
When("the application adds slide item {string}", async ({ slide }, name: string) =>
  slide.slide.evaluate((element, text) => {
    const item = document.createElement("div");
    item.id = "d";
    item.textContent = text;
    element.appendChild(item);
  }, name),
);
When("the application removes slide item {string}", async ({ slide }, name: string) =>
  slide.item(name).evaluate((item) => {
    item.remove();
    document.body.appendChild(item);
  }),
);
Then("slide item {string} is restored", async ({ slide }, name: string) =>
  expect.poll(() => slide.state(name)).toEqual({ before: false, after: false, inert: false }),
);
