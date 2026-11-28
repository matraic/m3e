import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { SplitButtonHarness } from "./split-button.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ splitButton: SplitButtonHarness }>({
  splitButton: async ({ page, render }, use) => use(new SplitButtonHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a split button", ({ splitButton }) => splitButton.prepare());
When("the split button renders", async ({ splitButton }) => splitButton.render());
Then("the split button exposes a group with both buttons", async ({ page }) => {
  await expect(page.getByRole("group")).toBeVisible();
  await expect(page.getByRole("button", { name: "Edit" })).toBeVisible();
  await expect(page.getByRole("button", { name: "More actions" })).toBeVisible();
});
Then("the split button defaults to filled and small", async ({ splitButton }) =>
  expect(await splitButton.buttonProperties("m3e-split-button")).toMatchObject({ variant: "filled", size: "small" }),
);

Given("a split button with variant {string} and size {string}", ({ splitButton }, variant: string, size: string) =>
  splitButton.prepare(`variant="${variant}" size="${size}"`),
);
Then(
  "both split-button buttons use variant {string} and size {string}",
  async ({ splitButton }, variant: string, size: string) => {
    await expect.poll(() => splitButton.buttonProperties("m3e-button")).toMatchObject({ variant, size });
    await expect.poll(() => splitButton.buttonProperties("m3e-icon-button")).toMatchObject({ variant, size });
  },
);

When("the application changes the split-button variant to {string}", async ({ splitButton }, variant: string) =>
  splitButton.changeAttribute("variant", variant),
);
Then("both split-button buttons use variant {string}", async ({ splitButton }, variant: string) => {
  await expect.poll(() => splitButton.buttonProperties("m3e-button")).toMatchObject({ variant });
  await expect(splitButton.trailingButton).toHaveAttribute("variant", variant);
});

When("the application changes the split-button size to {string}", async ({ splitButton }, size: string) =>
  splitButton.changeAttribute("size", size),
);
Then("both split-button buttons use size {string}", async ({ splitButton }, size: string) => {
  await expect.poll(() => splitButton.buttonProperties("m3e-button")).toMatchObject({ size });
  await expect.poll(() => splitButton.buttonProperties("m3e-icon-button")).toMatchObject({ size });
});

Given("a split button with invalid variant and size", ({ splitButton }) =>
  splitButton.prepare('variant="bogus" size="bogus"'),
);
Then("the split button falls back to filled and small", async ({ splitButton }) => {
  await expect(splitButton.splitButton).toHaveAttribute("variant", "filled");
  await expect(splitButton.splitButton).toHaveAttribute("size", "small");
  expect(await splitButton.buttonProperties("m3e-split-button")).toMatchObject({ variant: "filled", size: "small" });
});

Then("both split-button buttons use a rounded shape", async ({ splitButton }) => {
  await expect.poll(() => splitButton.buttonProperties("m3e-button")).toMatchObject({ shape: "rounded" });
  await expect.poll(() => splitButton.buttonProperties("m3e-icon-button")).toMatchObject({ shape: "rounded" });
});

When("the split button renders and records the primary action", async ({ splitButton }) => {
  await splitButton.render();
  await splitButton.recordPrimaryAction();
});
When("the user activates the leading button", async ({ splitButton }) =>
  splitButton.page.getByRole("button", { name: "Edit" }).click(),
);
Then("the primary action runs once", async ({ splitButton }) => expect(await splitButton.primaryActionCount()).toBe(1));
Then("the split-button menu stays closed", async ({ splitButton }) => expect(splitButton.menu).toBeHidden());

When("the user activates the trailing button", async ({ splitButton }) =>
  splitButton.page.getByRole("button", { name: "More actions" }).click(),
);
Then("the split-button menu is visible in the viewport", async ({ splitButton }) => {
  await expect(splitButton.menu).toBeVisible();
  await expect(splitButton.menu).toBeInViewport();
});
Then("the trailing button is expanded", async ({ splitButton }) =>
  expect(splitButton.page.getByRole("button", { name: "More actions" })).toHaveAttribute("aria-expanded", "true"),
);
Then("the split-button menu has {int} menu items", async ({ splitButton }, count: number) =>
  expect(splitButton.menu.getByRole("menuitem")).toHaveCount(count),
);

When("the user chooses the {string} split-button menu item", async ({ splitButton }, name: string) =>
  splitButton.menu.getByRole("menuitem", { name }).click(),
);
Then("the split-button menu is hidden", async ({ splitButton }) => expect(splitButton.menu).toBeHidden());
Then("the trailing button is collapsed", async ({ splitButton }) =>
  expect(splitButton.page.getByRole("button", { name: "More actions" })).toHaveAttribute("aria-expanded", "false"),
);
Then("focus returns to the trailing button", async ({ splitButton }) =>
  expect(splitButton.page.getByRole("button", { name: "More actions" })).toBeFocused(),
);

Given("a hidden split button", ({ splitButton }) => splitButton.prepare("hidden"));
Then("the split button is hidden", async ({ splitButton }) => expect(splitButton.splitButton).toBeHidden());

When("the application replaces both split-button buttons", async ({ splitButton }) => splitButton.replaceButtons());
Then(
  "both replacement buttons use variant {string} and size {string}",
  async ({ splitButton }, variant: string, size: string) => {
    await expect
      .poll(() => splitButton.buttonProperties('m3e-button[slot="leading-button"]'))
      .toMatchObject({
        variant,
        size,
      });
    await expect
      .poll(() => splitButton.buttonProperties('m3e-icon-button[slot="trailing-button"]'))
      .toMatchObject({ variant, size });
  },
);
Then("both replacement buttons use a rounded shape", async ({ splitButton }) => {
  await expect
    .poll(() => splitButton.buttonProperties('m3e-button[slot="leading-button"]'))
    .toMatchObject({ shape: "rounded" });
  await expect
    .poll(() => splitButton.buttonProperties('m3e-icon-button[slot="trailing-button"]'))
    .toMatchObject({ shape: "rounded" });
});
