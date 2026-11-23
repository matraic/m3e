import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ListHarness } from "./list.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ list: ListHarness }>({
  list: async ({ page, render }, use) => use(new ListHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an action list with buttons, links, and a disabled action", ({ list }) => {
  list.html = `<m3e-action-list aria-label="Commands">
    <m3e-list-action id="action">Run command</m3e-list-action>
    <m3e-list-action href="#details">View details</m3e-list-action>
    <m3e-list-action disabled>Unavailable</m3e-list-action>
  </m3e-action-list>`;
});
When("the action list renders", async ({ list }) => list.render());
Then("the action list exposes the button and link semantics", async ({ page }) => {
  const actions = page.getByRole("list", { name: "Commands" });
  await expect(actions.getByRole("button", { name: "Run command" })).toBeVisible();
  await expect(actions.getByRole("link", { name: "View details" })).toHaveAttribute("href", "#details");
});
Then("the disabled action cannot be activated", async ({ page }) =>
  expect(page.getByRole("button", { name: "Unavailable" })).toBeDisabled(),
);
