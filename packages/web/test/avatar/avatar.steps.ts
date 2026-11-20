import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { AvatarHarness } from "./avatar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ avatar: AvatarHarness }>({
  avatar: async ({ page, render }, use) => use(new AvatarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an avatar with slotted initials", ({ avatar }) => avatar.prepareInitials());
Given("an avatar with a slotted image", ({ avatar }) => avatar.prepareImage());
Given("an avatar with a slotted icon", ({ avatar }) => avatar.prepareIcon());
When("the avatar renders", async ({ avatar }) => avatar.render());
Then("the avatar is visible", async ({ avatar }) => expect(avatar.avatar).toBeVisible());
Then('the initials "AB" are visible', async ({ page }) => expect(page.getByText("AB", { exact: true })).toBeVisible());
Then("the slotted image has accessible name {string}", async ({ avatar }, name: string) =>
  expect(avatar.graphic(name)).toBeVisible(),
);
Then("the slotted icon has accessible name {string}", async ({ avatar }, name: string) =>
  expect(avatar.graphic(name)).toBeVisible(),
);
