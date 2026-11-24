import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { OptionHarness } from "./option.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ options: OptionHarness }>({
  options: async ({ page, render }, use) => use(new OptionHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an option {string}", ({ options }, name: string) => {
  options.html = `<m3e-option>${name}</m3e-option>`;
});
When("the options render", async ({ options }) => options.render());
Then("option {string} is exposed as an option", async ({ page }, name: string) =>
  expect(page.getByRole("option", { name })).toBeVisible(),
);
Then(
  "option {string} has value {string} and label {string}",
  async ({ options }, name: string, value: string, label: string) =>
    expect(await options.resolve(name)).toEqual({ value, label }),
);
Given("an option {string} with value {string}", ({ options }, name: string, value: string) => {
  options.html = `<m3e-option value="${value}">${name}</m3e-option>`;
});
Then("option {string} is empty", async ({ options }, name: string) =>
  expect.poll(() => options.isEmpty(name)).toEqual({ property: true, state: true }),
);
Then("option {string} is not empty", async ({ options }, name: string) =>
  expect.poll(() => options.isEmpty(name)).toEqual({ property: false, state: false }),
);

Given("a selected option {string}", ({ options }, name: string) => {
  options.html = `<m3e-option selected>${name}</m3e-option>`;
});
Then("option {string} is exposed as selected", async ({ options }, name: string) =>
  expect(options.option(name)).toHaveAttribute("aria-selected", "true"),
);
When("the application deselects option {string}", async ({ options }, name: string) =>
  options.setSelected(name, false),
);
Then("option {string} is exposed as not selected", async ({ options }, name: string) =>
  expect(options.option(name)).toHaveAttribute("aria-selected", "false"),
);

Given("a disabled option {string}", ({ options }, name: string) => {
  options.html = `<m3e-option disabled>${name}</m3e-option>`;
});
Then("option {string} is exposed as disabled", async ({ options }, name: string) =>
  expect(options.option(name)).toHaveAttribute("aria-disabled", "true"),
);
When("the application enables option {string}", async ({ options }, name: string) => options.setDisabled(name, false));
Then("option {string} is not exposed as disabled", async ({ options }, name: string) =>
  expect(options.option(name)).not.toHaveAttribute("aria-disabled", "true"),
);

Given("an option {string} inside a host", ({ options }, name: string) => {
  options.html = `<div id="host"><m3e-option>${name}</m3e-option></div>`;
});
When("the host starts counting state-change events", async ({ options }) => options.countStateChanges());
When("the application selects option {string}", async ({ options }, name: string) => options.setSelected(name, true));
Then("the host has received {int} state-change event(s)", async ({ options }, count: number) =>
  expect.poll(() => options.stateChanges()).toBe(count),
);
When("the application disables option {string}", async ({ options }, name: string) => options.setDisabled(name, true));

Given(
  "a single-select listbox with selected option {string} and option {string}",
  ({ options }, selected: string, other: string) => {
    options.html = `<div role="listbox"><m3e-option selected>${selected}</m3e-option><m3e-option>${other}</m3e-option></div>`;
  },
);
Given(
  "a multi-select listbox with selected option {string} and option {string}",
  ({ options }, selected: string, other: string) => {
    options.html = `<div role="listbox" aria-multiselectable="true"><m3e-option selected>${selected}</m3e-option><m3e-option>${other}</m3e-option></div>`;
  },
);

Given("an option {string} with search term {string}", ({ options }, name: string, term: string) => {
  options.html = `<m3e-option term="${term}">${name}</m3e-option>`;
});
Then("option {string} highlights its search term", async ({ options }, name: string) =>
  expect.poll(() => options.isDisabledPart(name, "m3e-text-highlight")).toBe(false),
);
Given(
  "an option {string} with search term {string} and highlighting disabled",
  ({ options }, name: string, term: string) => {
    options.html = `<m3e-option term="${term}" disable-highlight>${name}</m3e-option>`;
  },
);
Then("option {string} does not highlight its search term", async ({ options }, name: string) =>
  expect.poll(() => options.isDisabledPart(name, "m3e-text-highlight")).toBe(true),
);
Given("a selected option {string} with search term {string}", ({ options }, name: string, term: string) => {
  options.html = `<m3e-option term="${term}" selected>${name}</m3e-option>`;
});
Then("option {string} disables its state layer", async ({ options }, name: string) =>
  expect.poll(() => options.isDisabledPart(name, "m3e-state-layer")).toBe(true),
);

Given("an option group labelled {string} containing option {string}", ({ options }, label: string, name: string) => {
  options.html = `<m3e-optgroup><span slot="label">${label}</span><m3e-option>${name}</m3e-option></m3e-optgroup>`;
});
Then("option group {string} is exposed as a group", async ({ page }, name: string) =>
  expect(page.getByRole("group", { name })).toBeVisible(),
);
Given("an option group labelled {string} with label ID {string}", ({ options }, label: string, id: string) => {
  options.html = `<m3e-optgroup><span slot="label" id="${id}">${label}</span><m3e-option>Apple</m3e-option></m3e-optgroup>`;
});
Then("the option group is labelled by {string}", async ({ options }, id: string) =>
  expect(options.group).toHaveAttribute("aria-labelledby", id),
);
Then("only one element has ID {string}", async ({ page }, id: string) =>
  expect(page.locator(`[id="${id}"]`)).toHaveCount(1),
);
Then("the option group is labelled by a generated label", async ({ options }) =>
  expect(options.group).toHaveAttribute("aria-labelledby", /m3e-optgroup-label-/),
);
When("the application removes the option group label", async ({ page }) =>
  page.locator("[slot=label]").evaluate((element) => element.remove()),
);
Then("the option group has no labelled-by reference", async ({ options }) =>
  expect.poll(() => options.group.evaluate((element) => element.getAttribute("aria-labelledby") ?? "")).toBe(""),
);

Given("an option panel containing option {string}", ({ options }, name: string) => {
  options.html = `<m3e-option-panel><m3e-option>${name}</m3e-option></m3e-option-panel>`;
});
Then("the option panel is exposed as a listbox", async ({ options }) =>
  expect(options.panel).toHaveAttribute("role", "listbox"),
);
Given(
  "an option panel containing options {string}, {string}, and {string}",
  ({ options }, first: string, second: string, third: string) => {
    options.html = `<m3e-option-panel><m3e-option>${first}</m3e-option><m3e-option>${second}</m3e-option><m3e-option>${third}</m3e-option></m3e-option-panel>`;
  },
);
Then("option {string} is marked as {string}", async ({ options }, name: string, marks: string) =>
  expect.poll(() => options.marks(name)).toBe(marks),
);
Given(
  "an option panel containing hidden option {string}, option {string}, and hidden option {string}",
  ({ options }, first: string, second: string, third: string) => {
    options.html = `<m3e-option-panel><m3e-option hidden>${first}</m3e-option><m3e-option>${second}</m3e-option><m3e-option hidden>${third}</m3e-option></m3e-option-panel>`;
  },
);
When("the application appends option {string} to the option panel", async ({ options }, name: string) =>
  options.appendOption(name),
);
Given("an option panel containing option {string} inside a host", ({ options }, name: string) => {
  options.html = `<div id="host"><m3e-option-panel><m3e-option>${name}</m3e-option></m3e-option-panel></div>`;
});
