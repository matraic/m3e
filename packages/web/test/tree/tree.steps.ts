import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { TreeHarness } from "./tree.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  tree: TreeHarness;
}>({
  tree: async ({ page, render }, use) => use(new TreeHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an M3E tree", ({ tree }) => tree.prepare());
When("the tree renders", async ({ tree }) => tree.render());
Then("the tree is focusable and exposes {int} root tree items", async ({ tree }, count: number) => {
  await expect(tree.page.getByRole("tree")).toBeVisible();
  await expect(tree.tree).toHaveAttribute("tabindex", "0");
  await expect(tree.page.getByRole("treeitem")).toHaveCount(count);
});
Then("the tree is not multiselectable", async ({ tree }) =>
  expect(tree.tree).not.toHaveAttribute("aria-multiselectable"),
);
When("the application adds a root tree item {string} named {string}", async ({ tree }, id: string, name: string) =>
  tree.addRootItem(id, name),
);
Then("the new item is tracked without becoming a tab stop", async ({ tree }) => {
  await expect.poll(() => tree.itemCount()).toBe(8);
  await expect(tree.item("new")).not.toHaveAttribute("tabindex", "0");
});

When("the application enables multi-selection", async ({ tree }) => tree.setMulti(true));
Then("the tree exposes aria-multiselectable {string}", async ({ tree }, value: string) =>
  expect(tree.tree).toHaveAttribute("aria-multiselectable", value),
);
When("the application disables multi-selection", async ({ tree }) => tree.setMulti(false));
Then("the tree does not expose aria-multiselectable", async ({ tree }) =>
  expect(tree.tree).not.toHaveAttribute("aria-multiselectable"),
);
Then("tree items report their levels, parents, paths, and children", async ({ tree }) =>
  expect(await tree.hierarchyIsExpected()).toBe(true),
);
Then("item {string} exposes aria-expanded {string}", async ({ tree }, id: string, value: string) =>
  expect(tree.item(id)).toHaveAttribute("aria-expanded", value),
);
Then("item {string} has no aria-expanded attribute", async ({ tree }, id: string) =>
  expect(tree.item(id)).not.toHaveAttribute("aria-expanded"),
);
When("the application expands item {string}", async ({ tree }, id: string) => tree.expandItem(id));
When("the application adds a child beneath item {string}", async ({ tree }, id: string) => tree.addChild(id));
Then("item {string} is expandable and collapsed", async ({ tree }, id: string) => {
  await expect(tree.item(id)).toHaveAttribute("aria-expanded", "false");
  await expect.poll(() => tree.itemState(id, "hasChildItems")).toBe(true);
});
Then("tree item {string} is open", async ({ tree }, id: string) =>
  expect.poll(() => tree.itemState(id, "open")).toBe(true),
);
When("the application collapses item {string}", async ({ tree }, id: string) => tree.collapseItem(id));
Then("tree item {string} is closed", async ({ tree }, id: string) =>
  expect.poll(() => tree.itemState(id, "open")).toBe(false),
);
When("the application toggles item {string}", async ({ tree }, id: string) => tree.toggleItem(id));
When("the application expands all tree items and descendants", async ({ tree }) => tree.expandAll());
Then("tree item expansion states are {string}", async ({ tree }, states: string) =>
  expect(await tree.openStates()).toEqual(states.split(",").map((state) => state === "true")),
);
When("the application collapses all tree items and descendants", async ({ tree }) => tree.collapseAll());
Then("every tree item is closed", async ({ tree }) =>
  expect(await tree.openStates()).toEqual(Array.from({ length: 7 }, () => false)),
);
Then("the tree has accessible name {string}", async ({ tree }, name: string) =>
  expect(tree.page.getByRole("tree", { name, exact: true })).toBeVisible(),
);
Then("the root tree items have accessible names {string}", async ({ tree }, names: string) => {
  for (const name of names.split(",").map((item) => item.trim())) {
    await expect(tree.page.getByRole("treeitem", { name, exact: true })).toBeVisible();
  }
});
Then("all tree items have accessible names {string}", async ({ tree }, names: string) => {
  for (const name of names.split(",").map((item) => item.trim())) {
    await expect(tree.page.getByRole("treeitem", { name, exact: true })).toBeVisible();
  }
});
Then("tree item {string} is visible", async ({ tree }, id: string) =>
  expect.poll(() => tree.itemState(id, "visible")).toBe(true),
);
Then("tree item {string} is hidden", async ({ tree }, id: string) =>
  expect.poll(() => tree.itemState(id, "visible")).toBe(false),
);
When("the application records expansion events for item {string}", async ({ tree }, id: string) =>
  tree.recordItemEvents(id),
);
Then("item {string} emits events {string}", async ({ tree }, id: string, events: string) =>
  expect.poll(() => tree.itemEvents(id)).toEqual(events.split(",").map((event) => event.trim())),
);

When("the user clicks the label of item {string}", async ({ tree }, id: string) => tree.label(id).click());
Then("the selected tree items are {string}", async ({ tree }, items: string) =>
  expect((await tree.selectedIds()).sort()).toEqual(
    items
      .split(",")
      .map((item) => item.trim())
      .sort(),
  ),
);
Then("item {string} has aria-selected {string}", async ({ tree }, id: string, value: string) =>
  expect(tree.item(id)).toHaveAttribute("aria-selected", value),
);
Then("the selected tree items are still {string}", async ({ tree }, items: string) =>
  expect(await tree.selectedIds()).toEqual(items.split(",").map((item) => item.trim())),
);
When("the application records tree change events", async ({ tree }) => tree.recordChangeEvents());
Then("the tree has emitted at least {int} change events", async ({ tree }, count: number) =>
  expect.poll(() => tree.changeCount()).toBeGreaterThanOrEqual(count),
);
Given("an M3E tree with multi-selection", ({ tree }) => tree.prepare("multi"));
Then("item {string} has aria-checked {string}", async ({ tree }, id: string, value: string) =>
  expect(tree.item(id)).toHaveAttribute("aria-checked", value),
);
Then("item {string} has no aria-selected attribute", async ({ tree }, id: string) =>
  expect(tree.item(id)).not.toHaveAttribute("aria-selected"),
);
Then("there are no selected tree items", async ({ tree }) => expect(await tree.selectedIds()).toEqual([]));
Then("the checkbox for item {string} is visible", async ({ tree }, id: string) =>
  expect(tree.checkbox(id)).toBeVisible(),
);
When("the user clicks the checkbox for item {string}", async ({ tree }, id: string) => tree.checkbox(id).click());
Given("an M3E tree with cascading multi-selection", ({ tree }) => tree.prepare("multi cascade"));
Then("tree item {string} is indeterminate", async ({ tree }, id: string) =>
  expect.poll(() => tree.itemState(id, "indeterminate")).toBe(true),
);
Then("tree item {string} is not indeterminate", async ({ tree }, id: string) =>
  expect.poll(() => tree.itemState(id, "indeterminate")).toBe(false),
);
When("the application selects item {string}", async ({ tree }, id: string) => tree.select(id));
When("the application deselects item {string}", async ({ tree }, id: string) => tree.deselect(id));
Then("the tree has emitted exactly {int} change events", async ({ tree }, count: number) =>
  expect(await tree.changeCount()).toBe(count),
);
Given("an M3E tree with item {string} disabled", ({ tree }, id: string) => tree.prepare("", { [id]: "disabled" }));
Then("tree item {string} exposes aria-disabled {string}", async ({ tree }, id: string, value: string) =>
  expect(tree.item(id)).toHaveAttribute("aria-disabled", value),
);
When("the user force-clicks the label of item {string}", async ({ tree }, id: string) =>
  tree.label(id).click({ force: true }),
);
When("the application disables tree item {string}", async ({ tree }, id: string) =>
  tree.item(id).evaluate((element) => {
    element.setAttribute("disabled", "");
  }),
);
Then("tree item {string} is disabled", async ({ tree }, id: string) =>
  expect.poll(() => tree.itemState(id, "disabled")).toBe(true),
);

When("the user focuses the tree", async ({ tree }) => tree.focus());
When("the user presses tree key {string}", async ({ tree }, key: string) => tree.press(key));
Then("the active tree item is {string}", async ({ tree }, id: string) => expect.poll(() => tree.activeId()).toBe(id));
When("the application sets the tree direction to right-to-left", async ({ tree }) => tree.setRightToLeft());
When("the user types {string} in the tree", async ({ tree }, text: string) => tree.type(text));
Given("an M3E tree with a linked item", ({ tree }) => {
  tree.markup = `
    <m3e-tree>
      <m3e-tree-item id="l"><a slot="label" href="#target">Link</a></m3e-tree-item>
    </m3e-tree>`;
});
Then("the page navigates to {string}", async ({ tree }, hash: string) =>
  expect.poll(() => tree.page.evaluate(() => location.hash)).toBe(hash),
);
Then("the nested link is not an additional tab stop", async ({ tree }) =>
  expect(tree.item("l").locator("a")).toHaveAttribute("tabindex", "-1"),
);
Given("an M3E tree with an icon item", ({ tree }) => {
  tree.markup = `
    <m3e-tree>
      <m3e-tree-item id="i">
        <m3e-icon slot="icon" name="home"></m3e-icon>
        <span slot="label">Home</span>
      </m3e-tree-item>
    </m3e-tree>`;
});
Then("the item's icon is filled", async ({ tree }) =>
  expect(tree.item("i").locator("m3e-icon")).toHaveAttribute("filled", ""),
);
