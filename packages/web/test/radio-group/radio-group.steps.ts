import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { RadioGroupHarness } from "./radio-group.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ radioGroup: RadioGroupHarness }>({
  radioGroup: async ({ page, render }, use) => use(new RadioGroupHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a {string} radio group with Small, Medium, and Large radios", ({ radioGroup }, label: string) =>
  radioGroup.prepare(label),
);
When("the radio group renders", async ({ radioGroup }) => radioGroup.render());
Then("the radio group is exposed as the {string} radiogroup", async ({ page }, name: string) =>
  expect(page.getByRole("radiogroup", { name })).toBeVisible(),
);
Then("the radio group exposes {int} radios", async ({ page }, count: number) =>
  expect(page.getByRole("radio")).toHaveCount(count),
);
Then("no radio is checked", async ({ page }) => expect(page.getByRole("radio", { checked: true })).toHaveCount(0));
Then("the radio group value is none", async ({ radioGroup }) => expect(await radioGroup.value()).toBeNull());

When("the user clicks the {string} radio", async ({ radioGroup }, name: string) => radioGroup.radio(name).click());
Then("the {string} radio is checked", async ({ radioGroup }, name: string) =>
  expect(radioGroup.radio(name)).toBeChecked(),
);
Then("the radio group value is {string}", async ({ radioGroup }, value: string) =>
  expect(await radioGroup.value()).toBe(value),
);
Then("the {string} radio is not checked", async ({ radioGroup }, name: string) =>
  expect(radioGroup.radio(name)).not.toBeChecked(),
);

Given("the {string} radio starts checked", ({ radioGroup }, name: string) =>
  radioGroup.setRadioAttribute(name, "checked"),
);

Given("each radio is wrapped in a label", ({ radioGroup }) => radioGroup.wrapRadios());
When("the user clicks the label text {string}", async ({ page }, text: string) => page.getByText(text).click());

When("the application checks the {string} radio", async ({ radioGroup }, name: string) =>
  radioGroup.radio(name).evaluate((radio) => ((radio as HTMLInputElement).checked = true)),
);

When("the application removes the {string} radio", async ({ radioGroup }, name: string) =>
  radioGroup.radio(name).evaluate((radio) => radio.remove()),
);

When(
  "the application adds a checked {string} radio with value {string}",
  async ({ radioGroup }, label: string, value: string) => radioGroup.add(label, value, true),
);

When("the radio group starts recording events", async ({ radioGroup }) => radioGroup.recordEvents());
Then("the radio group recorded the events {string}", async ({ radioGroup }, events: string) =>
  expect(await radioGroup.events()).toBe(events),
);

When("the radio group cancels beforeinput", async ({ radioGroup }) => radioGroup.cancelBeforeInput());

When("the user tabs into the radio group", async ({ radioGroup }) => radioGroup.tabIntoGroup());
Then("the {string} radio is focused", async ({ radioGroup }, name: string) =>
  expect(radioGroup.radio(name)).toBeFocused(),
);
When("the user presses {string} in the radio group", async ({ page }, key: string) => page.keyboard.press(key));
Then("the button {string} is focused", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeFocused(),
);

Given("the {string} radio starts disabled", ({ radioGroup }, name: string) =>
  radioGroup.setRadioAttribute(name, "disabled"),
);

When("the user focuses the {string} radio", async ({ radioGroup }, name: string) => radioGroup.radio(name).focus());

Given("the radio group is rendered right-to-left", ({ radioGroup }) => {
  radioGroup.direction = "rtl";
});

When("the user clicks the {string} radio without actionability checks", async ({ radioGroup }, name: string) =>
  radioGroup.radio(name).dispatchEvent("click"),
);
Then("the {string} radio is exposed as disabled", async ({ radioGroup }, name: string) =>
  expect(radioGroup.radio(name)).toHaveAttribute("aria-disabled", "true"),
);

Given("the radio group is disabled", ({ radioGroup }) => radioGroup.setGroupAttribute("disabled"));
When("the application enables the radio group", async ({ radioGroup }) =>
  radioGroup.group.evaluate((group) => group.removeAttribute("disabled")),
);
Then("the {string} radio is not exposed as disabled", async ({ radioGroup }, name: string) =>
  expect(radioGroup.radio(name)).not.toHaveAttribute("aria-disabled", "true"),
);
When(
  "the application adds a {string} radio with value {string}",
  async ({ radioGroup }, label: string, value: string) => radioGroup.add(label, value, false),
);

Then("every radio is named {string}", async ({ radioGroup }, name: string) =>
  expect(await radioGroup.names()).toEqual(Array(await radioGroup.radios.count()).fill(name)),
);

Given("the {string} radio starts named {string}", ({ radioGroup }, radio: string, name: string) =>
  radioGroup.setRadioAttribute(radio, `name="${name}"`),
);
Then("the {string} radio is named {string}", async ({ radioGroup }, radio: string, name: string) =>
  expect(radioGroup.radio(radio).evaluate((element) => (element as HTMLInputElement).name)).resolves.toBe(name),
);

When("the application renames the radio group to {string}", async ({ radioGroup }, name: string) =>
  radioGroup.group.evaluate((group, name) => ((group as HTMLInputElement).name = name), name),
);

Given("two radios named {string} outside a group", ({ radioGroup }, name: string) =>
  radioGroup.prepareStandalone(name),
);

Given("the radio group is inside a form", ({ radioGroup }) => radioGroup.insideForm());
Then("the form submits {string} for {string}", async ({ radioGroup }, value: string, name: string) =>
  expect(await radioGroup.formValue(name)).toBe(value),
);
Then("the form submits nothing for {string}", async ({ radioGroup }, name: string) =>
  expect(await radioGroup.formValue(name)).toBeNull(),
);
When("the user resets the form", async ({ page }) =>
  page.locator("form").evaluate((form) => (form as HTMLFormElement).reset()),
);

Given("the radio group is required", ({ radioGroup }) => radioGroup.setGroupAttribute("required"));
Then("the radio group is invalid", async ({ radioGroup }) => expect(await radioGroup.isValid()).toBe(false));
Then("the radio group is valid", async ({ radioGroup }) => expect(await radioGroup.isValid()).toBe(true));
Then("the radio group has the invalid state", async ({ radioGroup }) =>
  expect.poll(() => radioGroup.group.evaluate((group) => group.matches(":state(--invalid)"))).toBe(true),
);

When("the application marks the radio group invalid", async ({ radioGroup }) =>
  radioGroup.group.evaluate((group) => group.setAttribute("aria-invalid", "true")),
);
Then("every radio has the invalid state", async ({ radioGroup }) =>
  expect.poll(async () => (await radioGroup.states("--invalid")).every(Boolean)).toBe(true),
);
When("the application marks the radio group valid", async ({ radioGroup }) =>
  radioGroup.group.evaluate((group) => group.setAttribute("aria-invalid", "false")),
);
Then("no radio has the invalid state", async ({ radioGroup }) =>
  expect.poll(async () => (await radioGroup.states("--invalid")).some(Boolean)).toBe(false),
);

When("the application marks the radio group touched and dirty", async ({ radioGroup }) =>
  radioGroup.markTouchedAndDirty(true),
);
Then("every radio is touched and dirty", async ({ radioGroup }) =>
  expect((await radioGroup.states("--touched", "--dirty")).every(Boolean)).toBe(true),
);
When("the application marks the radio group untouched and pristine", async ({ radioGroup }) =>
  radioGroup.markTouchedAndDirty(false),
);
Then("no radio is touched or dirty", async ({ radioGroup }) => {
  expect((await radioGroup.states("--touched")).some(Boolean)).toBe(false);
  expect((await radioGroup.states("--dirty")).some(Boolean)).toBe(false);
});

Given("the user uses forced colors in the radio group", async ({ page }) =>
  page.emulateMedia({ forcedColors: "active" }),
);
Then(
  "the {string} radio is drawn with the {string} system color",
  async ({ radioGroup }, name: string, color: string) => {
    const { actual, expected } = await radioGroup.isDrawnWith(name, color);
    expect(actual).toBe(expected);
  },
);
