import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ListHarness } from "./list.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ list: ListHarness }>({
  list: async ({ page, render }, use) => use(new ListHarness(page, render)),
});

const { Given, When, Then } = createBdd(test);

Given("a single-selection list with two color options", ({ list }) => {
  list.html = `<m3e-selection-list aria-label="Color">
    <m3e-list-option value="blue">Blue</m3e-list-option>
    <m3e-list-option value="green">Green</m3e-list-option>
  </m3e-selection-list>`;
});
When("the selection list fixture renders", async ({ list }) => list.render());
When("selection events are observed", async ({ list }) => list.observeSelectionEvents());
When("the user selects Blue", async ({ page }) => page.getByRole("option", { name: "Blue" }).click());
Then("Blue is selected and the list value is {string}", async ({ page, list }, value: string) => {
  await expect(page.getByRole("option", { name: "Blue" })).toHaveAttribute("aria-selected", "true");
  expect(await list.selectionValue()).toBe(value);
});
When("the user selects Green", async ({ page }) => page.getByRole("option", { name: "Green" }).click());
Then("Green is selected and the list value is {string}", async ({ page, list }, value: string) => {
  await expect(page.getByRole("option", { name: "Blue" })).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("option", { name: "Green" })).toHaveAttribute("aria-selected", "true");
  expect(await list.selectionValue()).toBe(value);
});
When("the user selects Green again", async ({ page }) => page.getByRole("option", { name: "Green" }).click());
Then("Green remains selected without additional selection events", async ({ page, list }) => {
  await expect(page.getByRole("option", { name: "Green" })).toHaveAttribute("aria-selected", "true");
  expect(await list.selectionEvents()).toEqual([
    { type: "input", value: "blue" },
    { type: "change", value: "blue" },
    { type: "input", value: "green" },
    { type: "change", value: "green" },
  ]);
});

Given("a multi-selection list with Search and Share options", ({ list }) => {
  list.html = `<m3e-selection-list multi aria-label="Features">
    <m3e-list-option value="search">Search</m3e-list-option>
    <m3e-list-option value="share">Share</m3e-list-option>
  </m3e-selection-list>`;
});
When("the user selects Search and Share", async ({ page }) => {
  await page.getByRole("option", { name: "Search" }).click();
  await page.getByRole("option", { name: "Share" }).click();
});
Then("both options are selected and the list value contains {string}", async ({ page, list }, values: string) => {
  await expect(page.getByRole("option", { name: "Search" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("option", { name: "Share" })).toHaveAttribute("aria-selected", "true");
  expect(await list.selectionValue()).toEqual(values.split(","));
});
When("the user deselects Search", async ({ page }) => page.getByRole("option", { name: "Search" }).click());
Then("only Share is selected and the list value contains {string}", async ({ page, list }, values: string) => {
  await expect(page.getByRole("option", { name: "Search" })).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("option", { name: "Share" })).toHaveAttribute("aria-selected", "true");
  const expected = values.split(",");
  expect(await list.selectionValue()).toEqual(expected.length === 1 ? expected[0] : expected);
});
Then("selection change events report each updated value", async ({ list }) => {
  expect(await list.selectionEvents()).toEqual([
    { type: "input", value: "search" },
    { type: "change", value: "search" },
    { type: "input", value: ["search", "share"] },
    { type: "change", value: ["search", "share"] },
    { type: "input", value: "share" },
    { type: "change", value: "share" },
  ]);
});
Given("a selection list with visible selection indicators", ({ list }) => {
  list.html = `<m3e-selection-list aria-label="Indicator options">
    <m3e-list-option>First</m3e-list-option>
    <m3e-list-option>Second</m3e-list-option>
  </m3e-selection-list>`;
});
Then("both selection indicators are visible", async ({ page }) => {
  const indicators = page.locator("m3e-list-option .indicator");
  await expect(indicators).toHaveCount(2);
  for (const indicator of await indicators.all()) {
    await expect(indicator).toBeVisible();
  }
});
When("the application hides selection indicators", async ({ page }) => {
  await page.locator("m3e-selection-list").evaluate((list) => list.setAttribute("hide-selection-indicator", ""));
});
Then("both selection indicators are hidden", async ({ page }) => {
  const indicators = page.locator("m3e-list-option .indicator");
  await expect(indicators).toHaveCount(2);
  for (const indicator of await indicators.all()) {
    await expect(indicator).toBeHidden();
  }
});
When("the application restores selection indicators", async ({ page }) => {
  await page.locator("m3e-selection-list").evaluate((list) => list.removeAttribute("hide-selection-indicator"));
});
When("the user selects Search", async ({ page }) => page.getByRole("option", { name: "Search" }).click());
When("the application adds the Analyze option", async ({ list }) => list.addOption("Analyze", "analyze"));
Then("Analyze is unselected and outside the tab order", async ({ page }) => {
  const analyze = page.getByRole("option", { name: "Analyze" });
  await expect(analyze).toHaveAttribute("aria-selected", "false");
  await expect(analyze).toHaveAttribute("tabindex", "-1");
});
When("the application removes Search", async ({ list }) => list.removeOption("Search"));
Then("Search is removed and the remaining options update list state", async ({ page, list }) => {
  await expect(page.getByRole("option", { name: "Search" })).toHaveCount(0);
  await expect(page.getByRole("option", { name: "Share" })).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("option", { name: "Share" })).toHaveAttribute("tabindex", "0");
  await expect(page.getByRole("option", { name: "Analyze" })).toHaveAttribute("tabindex", "-1");
  await expect.poll(() => list.selectionValue()).toBeNull();
});

Given("a selection list with an enabled option and a disabled option", ({ list }) => {
  list.html = `<m3e-selection-list aria-label="Options">
    <m3e-list-option value="first">First</m3e-list-option>
    <m3e-list-option value="disabled" disabled>Disabled option</m3e-list-option>
  </m3e-selection-list>`;
});
When("the application cancels changes to the enabled option", async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector("m3e-list-option")!.addEventListener("beforeinput", (event) => event.preventDefault());
  });
});
When("the user attempts to select both options", async ({ page }) => {
  await page.getByRole("option", { name: "First" }).click();
  await page.getByRole("option", { name: "Disabled option" }).evaluate((option) => (option as HTMLElement).click());
});
Then("neither option is selected and the list value is empty", async ({ page, list }) => {
  await expect(page.getByRole("option", { name: "First" })).toHaveAttribute("aria-selected", "false");
  await expect(page.getByRole("option", { name: "Disabled option" })).toHaveAttribute("aria-selected", "false");
  expect(await list.selectionValue()).toBeNull();
});

Given("a multi-selection list with Search selected and Share unselected", ({ list }) => {
  list.html = `<m3e-selection-list multi aria-label="Features">
    <m3e-list-option value="search" selected>Search</m3e-list-option>
    <m3e-list-option value="share">Share</m3e-list-option>
  </m3e-selection-list>`;
});
When("the application disables the selection list", async ({ list }) => list.setDisabled(true));
Then("the list and both options expose disabled state", async ({ page }) => {
  const list = page.getByRole("listbox", { name: "Features" });
  await expect(list).toHaveAttribute("aria-disabled", "true");
  await expect(list.getByRole("option", { name: "Search" })).toHaveAttribute("aria-disabled", "true");
  await expect(list.getByRole("option", { name: "Share" })).toHaveAttribute("aria-disabled", "true");
});
When("the user attempts to select Share in the disabled list", async ({ page }) =>
  page.getByRole("option", { name: "Share" }).evaluate((option) => (option as HTMLElement).click()),
);
Then("Search remains selected and Share remains unselected", async ({ page, list }) => {
  await expect(page.getByRole("option", { name: "Search" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("option", { name: "Share" })).toHaveAttribute("aria-selected", "false");
  expect(await list.selectionValue()).toBeNull();
});
When("the application enables the selection list", async ({ list }) => list.setDisabled(false));
Then("the list and both options are enabled", async ({ page }) => {
  const list = page.getByRole("listbox", { name: "Features" });
  await expect(list).not.toHaveAttribute("aria-disabled", "true");
  await expect(list.getByRole("option", { name: "Search" })).not.toHaveAttribute("aria-disabled", "true");
  await expect(list.getByRole("option", { name: "Share" })).not.toHaveAttribute("aria-disabled", "true");
});
When("the user selects Share", async ({ page }) => page.getByRole("option", { name: "Share" }).click());

Given("a selection list with enabled and disabled navigation options", ({ list }) => {
  list.html = `<m3e-selection-list aria-label="Navigation">
    <m3e-list-option>First</m3e-list-option>
    <m3e-list-option>Second</m3e-list-option>
    <m3e-list-option disabled>Unavailable</m3e-list-option>
    <m3e-list-option>Last</m3e-list-option>
  </m3e-selection-list>`;
});
When("the user moves down through the enabled options", async ({ page }) => {
  await page.getByRole("option", { name: "First" }).focus();
  await page.keyboard.press("ArrowDown");
});
When("the user moves down once more", async ({ page }) => page.keyboard.press("ArrowDown"));
Then("the second enabled option is focused", async ({ page }) =>
  expect(page.getByRole("option", { name: "Second" })).toBeFocused(),
);
Then("the last option is focused", async ({ page }) => expect(page.getByRole("option", { name: "Last" })).toBeFocused());
When("the user selects the focused option with Space", async ({ page }) => page.keyboard.press("Space"));
Then("the last option is selected", async ({ page }) =>
  expect(page.getByRole("option", { name: "Last" })).toHaveAttribute("aria-selected", "true"),
);
Given("a selection list with a disabled option between two enabled options", ({ list }) => {
  list.html = `<m3e-selection-list aria-label="Keyboard">
    <m3e-list-option>First</m3e-list-option>
    <m3e-list-option disabled>Unavailable</m3e-list-option>
    <m3e-list-option>Last</m3e-list-option>
  </m3e-selection-list>`;
});
When("the user moves up from the first option", async ({ page }) => {
  await page.getByRole("option", { name: "First" }).focus();
  await page.keyboard.press("ArrowUp");
});
When("the user presses Home", async ({ page }) => page.keyboard.press("Home"));
Then("the first option is focused", async ({ page }) =>
  expect(page.getByRole("option", { name: "First" })).toBeFocused(),
);
When("the user presses End", async ({ page }) => page.keyboard.press("End"));
When("the user moves down from the last option", async ({ page }) => page.keyboard.press("ArrowDown"));

Given("a single-selection list in a form with Blue selected", ({ list }) => {
  list.html = `<form><m3e-selection-list name="color" aria-label="Color">
    <m3e-list-option value="blue" selected>Blue</m3e-list-option>
    <m3e-list-option value="green">Green</m3e-list-option>
  </m3e-selection-list></form>`;
});
When("the user selects Green in the form list", async ({ page }) => page.getByRole("option", { name: "Green" }).click());
When("the application reads the selection list form data", async ({ list }) => list.readFormData());
Then("the form value for {string} is {string}", async ({ list }, name: string, value: string) =>
  expect(list.formValues(name)).toEqual([value]),
);
Given("a multi-selection form list with enabled and disabled selections", ({ list }) => {
  list.html = `<form><m3e-selection-list name="feature" multi aria-label="Features">
    <m3e-list-option value="search" selected>Search</m3e-list-option>
    <m3e-list-option value="share" selected>Share</m3e-list-option>
    <m3e-list-option value="hidden" selected disabled>Hidden</m3e-list-option>
  </m3e-selection-list></form>`;
});
When("the application resets the selection list form", async ({ list }) => list.resetForm());
Then("resetting the form restores Blue and clears Green", async ({ page, list }) => {
  await expect(page.getByRole("option", { name: "Blue" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("option", { name: "Green" })).toHaveAttribute("aria-selected", "false");
  expect(await list.selectionValue()).toBe("blue");
});
Then("the form values for {string} are {string}", ({ list }, name: string, values: string) =>
  expect(list.formValues(name)).toEqual(values.split(",")),
);
