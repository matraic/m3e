import type { M3eToolbarElement } from "@m3e/web/toolbar";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ToolbarHarness, toolbarFixture } from "./toolbar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ toolbar: ToolbarHarness }>({
  toolbar: async ({ page, render }, use) => use(new ToolbarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a toolbar with three actions", ({ toolbar }) => {
  toolbar.markup = toolbarFixture();
});
When("the toolbar renders", async ({ toolbar }) => toolbar.show());
Then("the toolbar is visible with role {string}", async ({ page, toolbar }, role: string) => {
  expect(role).toBe("toolbar");
  await expect(page.getByRole("toolbar")).toBeVisible();
  await expect(toolbar.toolbar).toHaveAttribute("role", role);
});
Then("the toolbar defaults to standard, square, and not elevated", async ({ toolbar }) =>
  expect(
    await toolbar.toolbar.evaluate((element: M3eToolbarElement) => [element.variant, element.shape, element.elevated]),
  ).toEqual(["standard", "square", false]),
);
When("the application sets the toolbar vertical", async ({ toolbar }) => toolbar.setVertical(true));
Then("the toolbar exposes vertical orientation", async ({ toolbar }) => {
  await expect(toolbar.toolbar).toHaveAttribute("aria-orientation", "vertical");
  await expect(toolbar.toolbar).toHaveAttribute("vertical", "");
});
When("the application sets the toolbar horizontal", async ({ toolbar }) => toolbar.setVertical(false));
Then("the toolbar does not expose vertical orientation", async ({ toolbar }) =>
  expect(toolbar.toolbar).not.toHaveAttribute("aria-orientation", "vertical"),
);

Given("a toolbar with attributes {string}", ({ toolbar }, attrs: string) => {
  toolbar.markup = toolbarFixture(attrs);
});
Then("the toolbar reflects its vibrant rounded elevated appearance", async ({ toolbar }) => {
  await expect(toolbar.toolbar).toHaveAttribute("variant", "vibrant");
  await expect(toolbar.toolbar).toHaveAttribute("shape", "rounded");
  await expect(toolbar.toolbar).toHaveAttribute("elevated", "");
  expect(await toolbar.toolbar.evaluate((element) => element.matches(":state(--vibrant):state(--rounded)"))).toBe(true);
});
Then("the toolbar elevation level is {string}", async ({ toolbar }, level: string) =>
  expect(toolbar.toolbar.locator("m3e-elevation").first()).toHaveAttribute("level", level),
);
When("the application elevates the toolbar", async ({ toolbar }) =>
  toolbar.toolbar.evaluate((element: M3eToolbarElement) => {
    element.elevated = true;
  }),
);
Then("the toolbar reflects its default variant and shape", async ({ toolbar }) => {
  await expect(toolbar.toolbar).toHaveAttribute("variant", "standard");
  await expect(toolbar.toolbar).toHaveAttribute("shape", "square");
});

Given("a toolbar named {string} with three actions", ({ toolbar }, name: string) => {
  toolbar.markup = toolbarFixture(`aria-label="${name}"`);
});
Then("the toolbar is named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("toolbar", { name, exact: true })).toBeVisible(),
);
Then("the toolbar exposes the actions {string}", async ({ toolbar }, names: string) => {
  for (const name of names.split(", ")) await expect(toolbar.action(name)).toBeVisible();
});

Then("toolbar action tab indexes are {string}", async ({ toolbar }, indexes: string) =>
  expect
    .poll(() => toolbar.actions.evaluateAll((items) => items.map((item) => item.getAttribute("tabindex"))))
    .toEqual(indexes.split(", ")),
);
When("the user focuses toolbar action {string}", async ({ toolbar }, name: string) => toolbar.action(name).focus());
When("the user presses {string} in the toolbar", async ({ page }, key: string) => page.keyboard.press(key));
Then("toolbar action {string} is focused", async ({ toolbar }, name: string) =>
  expect(toolbar.action(name)).toBeFocused(),
);

Given("a vertical toolbar with direction {string}", ({ toolbar }, direction: string) => {
  toolbar.markup = toolbarFixture("vertical");
  toolbar.direction = direction;
});
Given("a toolbar with direction {string}", ({ toolbar }, direction: string) => {
  toolbar.markup = toolbarFixture();
  toolbar.direction = direction;
});
When("the user clicks toolbar action {string}", async ({ toolbar }, name: string) => toolbar.action(name).click());

Given("a toolbar with its first action disabled", ({ toolbar }) => {
  toolbar.markup = toolbarFixture("", "One");
});
Then("toolbar action {string} is a tab stop", async ({ toolbar }, name: string) =>
  expect(toolbar.action(name)).toHaveAttribute("tabindex", "0"),
);
Then("toolbar action {string} is disabled", async ({ toolbar }, name: string) =>
  expect(toolbar.action(name)).toBeDisabled(),
);
Given("a toolbar with its second action disabled", ({ toolbar }) => {
  toolbar.markup = toolbarFixture("", "Two");
});

When("the application adds toolbar action {string}", async ({ toolbar }, name: string) =>
  toolbar.toolbar.evaluate((element, label) => {
    const action = document.createElement("m3e-icon-button");
    action.setAttribute("aria-label", label);
    element.append(action);
  }, name),
);

When("the application reconnects the toolbar", async ({ toolbar }) =>
  toolbar.toolbar.evaluate((element) => {
    const parent = element.parentElement;
    if (!parent) throw new Error("Toolbar parent is missing.");
    element.remove();
    parent.append(element);
  }),
);
When("the application changes toolbar direction to {string}", async ({ page }, direction: string) =>
  page.evaluate((value) => {
    document.documentElement.dir = value;
  }, direction),
);
