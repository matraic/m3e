import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { SegmentedButtonHarness } from "./segmented-button.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ segmented: SegmentedButtonHarness }>({
  segmented: async ({ page, render }, use) => use(new SegmentedButtonHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a single-select segmented button labelled {string}", ({ segmented }, label: string) =>
  segmented.prepare(false, label),
);
When("the segmented button renders", async ({ segmented }) => segmented.render());
Then("the segmented button is exposed as the {string} radiogroup", async ({ segmented }, name: string) =>
  expect(segmented.page.getByRole("radiogroup", { name })).toBeVisible(),
);
Then("the segmented button has {int} radios", async ({ segmented }, count: number) =>
  expect(segmented.page.getByRole("radio")).toHaveCount(count),
);
Then("no segment is selected", async ({ segmented }) =>
  expect(segmented.page.locator("m3e-button-segment[checked]")).toHaveCount(0),
);

When("the user clicks the {string} segment", async ({ segmented }, name: string) => segmented.segment(name).click());
Then("the {string} segment is selected", async ({ segmented }, name: string) =>
  expect.poll(() => segmented.isSelected(name)).toBe(true),
);
Then("the {string} segment is not selected", async ({ segmented }, name: string) =>
  expect.poll(() => segmented.isSelected(name)).toBe(false),
);

Given("the {string} segment starts checked", ({ segmented }, name: string) =>
  segmented.setSegmentAttribute(name, "checked"),
);
Then("the segmented button value is {string}", async ({ segmented }, value: string) =>
  expect(await segmented.value()).toBe(value),
);
Then("the segmented button value is none", async ({ segmented }) => expect(await segmented.value()).toBeNull());

When("the application checks the {string} segment", async ({ segmented }, name: string) => segmented.check(name));

When(
  "the application adds a checked {string} segment with value {string}",
  async ({ segmented }, name: string, value: string) => segmented.add(name, value, true),
);

When("the application removes the {string} segment", async ({ segmented }, name: string) => segmented.remove(name));

Given("the {string} segment starts disabled", ({ segmented }, name: string) =>
  segmented.setSegmentAttribute(name, "disabled"),
);

When("the segmented button records the events {string}", async ({ segmented }, types: string) =>
  segmented.recordEvents(types.split(",")),
);
Then("the segmented button recorded the events {string}", async ({ segmented }, events: string) =>
  expect.poll(() => segmented.events()).toBe(events),
);

When("the application cancels beforeinput on the segmented button", async ({ segmented }) =>
  segmented.cancelBeforeInput(),
);

When(/^the user tabs (\d+) times? from the "(.*)" button$/, async ({ segmented }, count: string, name: string) => {
  await segmented.page.getByRole("button", { name, exact: true }).focus();
  for (let i = 0; i < Number(count); i++) await segmented.page.keyboard.press("Tab");
});
When(/^the user tabs (\d+) times? from the "(.*)" segment$/, async ({ segmented }, count: string, name: string) => {
  await segmented.segment(name).focus();
  for (let i = 0; i < Number(count); i++) await segmented.page.keyboard.press("Tab");
});
Then("the {string} segment is focused", async ({ segmented }, name: string) =>
  expect(segmented.segment(name)).toBeFocused(),
);
Then("the {string} button is focused", async ({ segmented }, name: string) =>
  expect(segmented.page.getByRole("button", { name, exact: true })).toBeFocused(),
);

When("the user presses {string} in the segmented button", async ({ segmented }, key: string) =>
  segmented.page.keyboard.press(key),
);

Given(/^the segmented button page reads right to left$/, ({ segmented }) => {
  segmented.direction = "rtl";
});

When("the application clicks the {string} segment", async ({ segmented }, name: string) =>
  segmented.segment(name).dispatchEvent("click"),
);

Given("the segmented button starts disabled", ({ segmented }) => segmented.setGroupAttribute("disabled"));
Then("every segment is disabled", async ({ segmented }) =>
  expect
    .poll(() => segmented.segment("").evaluateAll((all) => all.every((x) => (x as HTMLInputElement).disabled)))
    .toBe(true),
);

When("the application enables the segmented button", async ({ segmented }) =>
  segmented.toggleGroupAttribute("disabled", false),
);
Then("every segment is enabled", async ({ segmented }) =>
  expect
    .poll(() => segmented.segment("").evaluateAll((all) => all.every((x) => !(x as HTMLInputElement).disabled)))
    .toBe(true),
);
Then("the {string} segment has no divider", async ({ segmented }, name: string) =>
  expect.poll(() => segmented.readDivider(name)).toBe(""),
);
Then("the {string} segment has a divider", async ({ segmented }, name: string) =>
  expect.poll(() => segmented.readDivider(name)).not.toBe(""),
);
When("the application enables the {string} segment", async ({ segmented }, name: string) =>
  segmented.setSegmentDisabled(name, false),
);

Given("the segmented button sits in a form", ({ segmented }) => {
  segmented.form = true;
});
Then("the segmented button form submits {string} as {string}", async ({ segmented }, name: string, value: string) =>
  expect(await segmented.formValues(name)).toEqual([value]),
);
Then("the segmented button form submits nothing for {string}", async ({ segmented }, name: string) =>
  expect(await segmented.formValues(name)).toEqual([]),
);

When("the segmented button form is reset", async ({ segmented }) => segmented.resetForm());

Given("a multi-select segmented button labelled {string}", ({ segmented }, label: string) =>
  segmented.prepare(true, label),
);
Then("the segmented button is exposed as the {string} group", async ({ segmented }, name: string) =>
  expect(segmented.page.getByRole("group", { name })).toBeVisible(),
);
Then("the {string} segment is not pressed", async ({ segmented }, name: string) =>
  expect(segmented.segment(name)).toHaveAttribute("aria-pressed", "false"),
);
Then("the {string} segment is pressed", async ({ segmented }, name: string) =>
  expect(segmented.segment(name)).toHaveAttribute("aria-pressed", "true"),
);

Then("the segmented button value is the list {string}", async ({ segmented }, values: string) =>
  expect(await segmented.value()).toEqual(values.split(",")),
);

Then("the {string} segment is a tab stop", async ({ segmented }, name: string) =>
  expect(segmented.segment(name)).toHaveAttribute("tabindex", "0"),
);

Then(
  "the segmented button form submits {string} as the list {string}",
  async ({ segmented }, name: string, values: string) =>
    expect(await segmented.formValues(name)).toEqual(values.split(",")),
);

Then("the segmented button is marked aria-disabled", async ({ segmented }) =>
  expect(segmented.group).toHaveAttribute("aria-disabled", "true"),
);

When("the application turns multi on", async ({ segmented }) => segmented.toggleGroupAttribute("multi", true));
When("the application turns multi off", async ({ segmented }) => segmented.toggleGroupAttribute("multi", false));

Then("the {string} segment has rounded {word} corners", async ({ segmented }, name: string, side: string) =>
  expect.poll(() => segmented.readRadius(name, side as "start" | "end")).not.toBe("0px"),
);
Then("the {string} segment has square {word} corners", async ({ segmented }, name: string, side: string) =>
  expect.poll(() => segmented.readRadius(name, side as "start" | "end")).toBe("0px"),
);

When(
  "the application adds a {string} segment with value {string}",
  async ({ segmented }, name: string, value: string) => segmented.add(name, value, false),
);

Given("the {string} segment has an icon", ({ segmented }, name: string) => segmented.giveIcon(name));
Then("the {string} segment shows its icon", async ({ segmented }, name: string) =>
  expect(segmented.segment(name).locator("m3e-icon")).toBeVisible(),
);
Then("the {string} segment shows no icon", async ({ segmented }, name: string) =>
  expect(segmented.segment(name).locator("m3e-icon")).toBeHidden(),
);
Then("the {string} segment shows a check", async ({ segmented }, name: string) =>
  expect(segmented.segment(name).locator(".check")).toBeVisible(),
);
Then("the {string} segment shows no check", async ({ segmented }, name: string) =>
  expect(segmented.segment(name).locator(".check")).toBeHidden(),
);

Given("the segmented button hides its selection indicator", ({ segmented }) =>
  segmented.setGroupAttribute("hide-selection-indicator"),
);
