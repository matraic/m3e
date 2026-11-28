import { mergeTests, type Page } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eTimepickerElement } from "@m3e/web/timepicker";

import { expect, test as componentTest } from "../fixtures";
import { TimepickerHarness } from "./timepicker.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  timepicker: TimepickerHarness;
}>({
  timepicker: async ({ page, render }, use) => use(new TimepickerHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);
const field = (page: Page, name: string) =>
  page.getByRole("dialog", { name: "Choose a time" }).getByRole("spinbutton", { name, exact: true });

Given("a standard timepicker", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="24" mode="input"';
});
When("the timepicker renders", async ({ timepicker }) => timepicker.render());
When("the application opens the timepicker", async ({ timepicker }) => timepicker.open());
Then("the timepicker trigger is expanded", async ({ timepicker }) =>
  expect(timepicker.trigger).toHaveAttribute("aria-expanded", "true"),
);
Then("the timepicker dialog is named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("dialog", { name, exact: true })).toBeVisible(),
);
Then("timepicker action {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeVisible(),
);
Then("the timepicker header is {string}", async ({ page }, text: string) =>
  expect(page.getByText(text, { exact: true })).toBeVisible(),
);
Then("timepicker field {string} has value {string}", async ({ page }, name: string, value: string) =>
  expect(field(page, name)).toHaveValue(value),
);
Then(
  "timepicker field {string} has spinbutton range {string} to {string}",
  async ({ page }, name: string, min: string, max: string) => {
    const input = field(page, name);
    await expect(input).toHaveAttribute("aria-valuemin", min);
    await expect(input).toHaveAttribute("aria-valuemax", max);
  },
);
Then("the timepicker has no period control", async ({ page }) => expect(page.getByRole("radiogroup")).toHaveCount(0));
Given("a 12-hour timepicker", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="12" mode="input"';
});
Then("the timepicker radio {string} is checked", async ({ page }, name: string) =>
  expect(page.getByRole("radio", { name, exact: true })).toHaveAttribute("aria-checked", "true"),
);
Then("the timepicker radio {string} is not checked", async ({ page }, name: string) =>
  expect(page.getByRole("radio", { name, exact: true })).toHaveAttribute("aria-checked", "false"),
);
Given("a timepicker with seconds", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="24" mode="input" show-seconds';
});
Given("a timepicker with custom labels", ({ timepicker }) => {
  timepicker.attributes =
    'date="2026-01-15T14:30:00" format="24" mode="input" confirm-label="Apply" dismiss-label="Close" input-label="Type time" hour-label="HH" minute-label="MM"';
});
Then("timepicker field {string} is visible", async ({ page }, name: string) => expect(field(page, name)).toBeVisible());
Given("a dial timepicker", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="24" mode="dial"';
});
Given("a dial timepicker with seconds", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="24" mode="dial" show-seconds';
});
Then("the timepicker mode toggle controls the dial", async ({ page, timepicker }) => {
  const toggle = page.getByRole("button", { name: "Toggle input picker" });
  await expect(toggle).toHaveAttribute("aria-controls", "dial");
  await expect(timepicker.dial).toHaveAttribute("id", "dial");
});
Then("the timepicker mode toggle has expanded state {string}", async ({ page }, value: string) =>
  expect(page.getByRole("button", { name: "Toggle input picker" })).toHaveAttribute("aria-expanded", value),
);
When("the user toggles the timepicker mode", async ({ page }) =>
  page.getByRole("button", { name: "Toggle input picker" }).click(),
);
Given("a timepicker with the mode toggle hidden", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="24" mode="input" hide-mode-toggle';
});
Then("the timepicker mode toggle is absent", async ({ page }) =>
  expect(page.getByRole("button", { name: "Toggle input picker" })).toHaveCount(0),
);

When("the application observes timepicker changes", async ({ timepicker }) => timepicker.observeChanges());
When("the user presses {string} in timepicker field {string}", async ({ page }, key: string, name: string) =>
  field(page, name).press(key),
);
Then("the timepicker time is {string}", async ({ timepicker }, time: string) =>
  expect.poll(() => timepicker.time()).toBe(time),
);
When("the user activates timepicker action {string}", async ({ page }, name: string) =>
  page.getByRole("button", { name, exact: true }).click(),
);
Then("the timepicker trigger is collapsed", async ({ timepicker }) =>
  expect(timepicker.trigger).toHaveAttribute("aria-expanded", "false"),
);
Then("the timepicker dispatches {int} change event", async ({ timepicker }, count: number) =>
  expect(timepicker.picker).toHaveAttribute("data-changes", String(count)),
);
Then("the timepicker dispatches {int} change events", async ({ timepicker }, count: number) =>
  expect(timepicker.picker).toHaveAttribute("data-changes", String(count)),
);
When("the user clears timepicker field {string}", async ({ page }, name: string) =>
  field(page, name).press("Backspace"),
);
When("the user types {string} into timepicker field {string}", async ({ page }, value: string, name: string) =>
  field(page, name).pressSequentially(value),
);
When("the user fills timepicker field {string} with {string}", async ({ page }, name: string, value: string) =>
  field(page, name).fill(value),
);
When("the user activates timepicker radio {string}", async ({ page }, name: string) =>
  page.getByRole("radio", { name, exact: true }).click(),
);
Then("the timepicker confirm action is disabled", async ({ page }) =>
  expect(page.getByRole("button", { name: "OK", exact: true })).toBeDisabled(),
);
Then("the timepicker confirm action is enabled", async ({ page }) =>
  expect(page.getByRole("button", { name: "OK", exact: true })).toBeEnabled(),
);
Given("a timepicker with minimum time {string}", ({ timepicker }, min: string) => {
  timepicker.attributes = `date="2026-01-15T14:30:00" format="24" mode="input" min-time="${min}"`;
});
When("the user replaces timepicker field {string} with {string}", async ({ page }, name: string, value: string) => {
  const input = field(page, name);
  await input.press("Backspace");
  await input.pressSequentially(value);
});
Given("a timepicker with maximum time {string}", ({ timepicker }, max: string) => {
  timepicker.attributes = `date="2026-01-15T14:30:00" format="24" mode="input" max-time="${max}"`;
});
When("the application blacks out timepicker hour {string}", async ({ timepicker }, hour: string) => {
  await timepicker.picker.evaluate((element, blackoutHour) => {
    (element as M3eTimepickerElement).blackoutTimes = (time) => time.hour === Number(blackoutHour);
  }, hour);
});
When("the user selects hour {string} on the timepicker dial", async ({ timepicker }, hour: string) =>
  timepicker.selectDialHour(Number(hour)),
);
Then("the timepicker dial is on the {string} view", async ({ timepicker }, view: string) =>
  expect.poll(() => timepicker.dialView()).toBe(view),
);
When("the user selects minute {string} on the timepicker dial", async ({ timepicker }, minute: string) =>
  timepicker.selectDialMinute(Number(minute)),
);
When("the user selects second {string} on the timepicker dial", async ({ timepicker }, second: string) =>
  timepicker.selectDialSecond(Number(second)),
);

When("the application toggles the timepicker", async ({ timepicker }) =>
  timepicker.picker.evaluate(async (element) => {
    const trigger = document.querySelector<HTMLElement>("#trigger");
    if (!trigger) throw new Error("Timepicker trigger is missing.");
    await (element as HTMLElement & { toggle(trigger: HTMLElement): Promise<void> }).toggle(trigger);
  }),
);
Given("a timepicker with a toggle", ({ timepicker }) => {
  timepicker.withToggle = true;
});
Then("the timepicker trigger has a dialog popup", async ({ timepicker }) =>
  expect(timepicker.trigger).toHaveAttribute("aria-haspopup", "dialog"),
);
When("the user clicks the timepicker trigger", async ({ timepicker }) => timepicker.trigger.click());
Given("a timepicker associated with a time-enabled date input", ({ timepicker }) => {
  timepicker.withTimeInput = true;
});
When("the application observes timepicker and date input changes", async ({ timepicker }) =>
  timepicker.observeChanges(true),
);
Then("the associated date input time is {string}", async ({ timepicker }, value: string) =>
  expect.poll(() => timepicker.inputTime()).toBe(value),
);
Then("the timepicker's date input dispatches {int} change event", async ({ timepicker }, count: number) =>
  expect(timepicker.timeInput).toHaveAttribute("data-changes", String(count)),
);
Then("the timepicker's date input dispatches {int} change events", async ({ timepicker }, count: number) =>
  expect(timepicker.timeInput).toHaveAttribute("data-changes", String(count)),
);

Given("a modal timepicker", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="24" mode="input" variant="modal"';
});
Then("the timepicker is exposed as a modal dialog", async ({ timepicker }) => {
  await expect(timepicker.picker).toHaveRole("dialog");
  await expect(timepicker.picker).toHaveAttribute("aria-modal", "true");
  await expect(timepicker.picker).toHaveAccessibleName("Choose a time");
});
When("the user presses {string} in the timepicker", async ({ page }, key: string) => page.keyboard.press(key));
Then("the timepicker trigger has focus", async ({ timepicker }) => expect(timepicker.trigger).toBeFocused());
When("the user tabs through the timepicker in both directions", async ({ page, timepicker }) => {
  const confirm = timepicker.picker.getByRole("button", {
    name: "OK",
    exact: true,
  });
  await confirm.focus();
  await page.keyboard.press("Tab");
  await expect.poll(() => timepicker.picker.evaluate((picker) => document.activeElement === picker)).toBe(true);
  await expect(confirm).not.toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(confirm).toBeFocused();
});
Then("focus remains inside the timepicker", async ({ timepicker }) =>
  expect.poll(() => timepicker.picker.evaluate((picker) => document.activeElement === picker)).toBe(true),
);
When("the application hides the timepicker and restores focus", async ({ timepicker }) =>
  timepicker.picker.evaluate((element) => (element as HTMLElement & { hide(restoreFocus: boolean): void }).hide(true)),
);
Then("the timepicker is closed", async ({ timepicker }) => expect.poll(() => timepicker.isOpen()).toBe(false));
When("the user clicks outside the timepicker", async ({ page }) => page.locator("#outside").click());
Given("an automatic timepicker", ({ timepicker }) => {
  timepicker.attributes = 'date="2026-01-15T14:30:00" format="24" mode="input" variant="auto" orientation="auto"';
});
When("the timepicker viewport changes to {int} pixels wide", async ({ page }, width: number) =>
  page.setViewportSize({ width, height: 800 }),
);
Then("the timepicker uses the {string} variant", async ({ timepicker }, variant: string) =>
  expect.poll(() => timepicker.currentVariant()).toBe(variant),
);
Then("the timepicker uses the {string} orientation", async ({ timepicker }, orientation: string) =>
  expect.poll(() => timepicker.currentOrientation()).toBe(orientation),
);
Then("the timepicker is not modal", async ({ timepicker }) =>
  expect(timepicker.picker).not.toHaveAttribute("aria-modal"),
);
Given("a timepicker with invalid options", ({ timepicker }) => {
  timepicker.attributes = 'variant="x" orientation="x" format="x" mode="x"';
});
Then("the timepicker options are {string}", async ({ timepicker }, options: string) =>
  expect.poll(() => timepicker.options()).toEqual(options.split(",")),
);
