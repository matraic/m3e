import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { CarouselLifecycleHarness } from "./carousel-lifecycle.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ lifecycle: CarouselLifecycleHarness }>({
  lifecycle: async ({ page, render }, use) => use(new CarouselLifecycleHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a lifecycle {string} collection with four items", ({ lifecycle }, tag: string) => {
  lifecycle.tag = tag;
});
When("the lifecycle collection renders", async ({ lifecycle }) => lifecycle.show());
When("the application selects lifecycle item {int}", async ({ lifecycle }, number: number) =>
  lifecycle.selectItem(number),
);
When("the application observes lifecycle selection changes", async ({ lifecycle }) => lifecycle.observeChanges());
When("the application moves the lifecycle collection to a new DOM parent", async ({ lifecycle }) => lifecycle.move());
Then("the lifecycle collection is in its new parent", async ({ lifecycle, page }) =>
  expect(page.locator(`#lifecycle-parent > ${lifecycle.tag}`)).toBeVisible(),
);
Then("the lifecycle collection remains a grid named {string}", async ({ lifecycle }, name: string) => {
  await expect(lifecycle.host).toHaveRole("grid");
  await expect(lifecycle.host).toHaveAccessibleName(name);
});
Then("lifecycle item {int} remains selected", async ({ lifecycle }, number: number) =>
  expect(lifecycle.host).toHaveAttribute("selected-index", String(number - 1)),
);
When("the user focuses lifecycle item {string}", async ({ lifecycle }, name: string) => lifecycle.action(name).focus());
When("the user presses {string} in the lifecycle collection", async ({ page }, key: string) =>
  page.keyboard.press(key),
);
Then("lifecycle item {string} has keyboard focus", async ({ lifecycle }, name: string) =>
  expect(lifecycle.action(name)).toBeFocused(),
);
Then("lifecycle item {int} is selected", async ({ lifecycle }, number: number) =>
  expect(lifecycle.host).toHaveAttribute("selected-index", String(number - 1)),
);
Then("exactly {int} lifecycle selection change was emitted", async ({ lifecycle }, count: number) =>
  expect(lifecycle.host).toHaveAttribute("data-lifecycle-changes", String(count)),
);
When("the application resizes the lifecycle collection to {int} pixels", async ({ lifecycle }, width: number) =>
  lifecycle.resize(width),
);
Then("all lifecycle items fit the resized collection", async ({ lifecycle }) => {
  await expect(lifecycle.host).toHaveCSS("width", "200px");
  await expect
    .poll(async () => {
      const sizes = await lifecycle.readItemDimensions();
      return sizes.length === 4 && sizes.every(({ width, height }) => width > 0 && width <= 200 && height > 0);
    })
    .toBe(true);
});
