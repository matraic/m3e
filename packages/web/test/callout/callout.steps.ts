import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { CalloutHarness } from "./callout.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ callout: CalloutHarness }>({
  callout: async ({ page, render }, use) => use(new CalloutHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a callout with an icon, label, and supporting content", ({ callout }) => {
  callout.icon = "i";
  callout.label = "Account notice";
  callout.content = "Your profile needs attention.";
});
When("the callout renders", async ({ callout }) => callout.show());
Then("the callout is exposed as complementary content", async ({ page }) =>
  expect(page.getByRole("complementary")).toBeVisible(),
);
Then("the callout label {string} is visible", async ({ callout }, label: string) =>
  expect(callout.callout.getByText(label, { exact: true })).toBeVisible(),
);
Then("the callout content {string} is visible", async ({ callout }, content: string) =>
  expect(callout.callout.getByText(content)).toBeVisible(),
);
Then("the callout icon {string} is visible", async ({ callout }, icon: string) =>
  expect(callout.callout.getByText(icon, { exact: true })).toBeVisible(),
);

Given("a callout with supporting content", ({ callout }) => {
  callout.content = "Information";
});
Then("the callout's effective variant is {string}", async ({ callout }, variant: string) =>
  expect.poll(() => callout.readVariant()).toBe(variant),
);
Then("the callout's effective shape is {string}", async ({ callout }, shape: string) =>
  expect.poll(() => callout.readShape()).toBe(shape),
);

Given("a callout with variant {string}", ({ callout }, variant: string) => {
  callout.variant = variant;
});
Then("the callout reflects variant {string}", async ({ callout }, variant: string) =>
  expect(callout.callout).toHaveAttribute("variant", variant),
);

Given("a callout with shape {string}", ({ callout }, shape: string) => {
  callout.shape = shape;
});
Then("the callout reflects shape {string}", async ({ callout }, shape: string) =>
  expect(callout.callout).toHaveAttribute("shape", shape),
);
When("the application moves the callout to a new DOM parent", async ({ callout }) => callout.moveToNewParent());
Then("the callout is in the new DOM parent", async ({ page }) =>
  expect(page.locator("#callout-new-parent > m3e-callout")).toBeVisible(),
);
