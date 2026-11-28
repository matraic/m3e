import { expect } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { ListKeyHarness } from "./list-key.harness";

export const test = bddTest.extend<{ listKey: ListKeyHarness }>({
  // eslint-disable-next-line no-empty-pattern
  listKey: async ({}, use) => use(new ListKeyHarness()),
});
const { Given, When, Then } = createBdd(test);

Given("a list key manager with direction {string} and 25 items", ({ listKey }, direction: "ltr" | "rtl") => {
  listKey.manager.withDirectionality(direction);
  listKey.manager.setItems(listKey.items);
});
Given("items 8 and 13 are disabled for navigation", ({ listKey }) => {
  listKey.manager.withSkipPredicate((item) => item === listKey.items[8] || item === listKey.items[13]);
});
When("the active item is {int} and {} is pressed", ({ listKey }, index: number, key: string) => {
  listKey.press(index, key);
});
Then("the active item is {int} and the key is handled", ({ listKey }, index: number) => {
  expect(listKey.manager.activeItem).toBe(listKey.items[index]);
  expect(listKey.handled).toBe(true);
});
