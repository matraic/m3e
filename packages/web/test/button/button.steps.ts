import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ButtonHarness } from "./button.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ button: ButtonHarness }>({
  button: async ({ page, render }, use) => use(new ButtonHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a filled button labeled {string}", ({ button }, label: string) => {
  button.options = { label, variant: "filled" };
});
Given("a toggle button labeled {string}", ({ button }, label: string) => {
  button.options = { label, toggle: true };
});
Given("a disabled toggle button labeled {string}", ({ button }, label: string) => {
  button.options = { label, toggle: true, disabled: true };
});
Given("a disabled-interactive toggle button labeled {string}", ({ button }, label: string) => {
  button.options = { label, toggle: true, disabledInteractive: true };
});
Given(
  "a toggle button labeled {string} with selected label {string}",
  ({ button }, label: string, selectedLabel: string) => {
    button.options = { label, selectedLabel, toggle: true };
  },
);
Given(
  "a selected toggle button labeled {string} with selected label {string}",
  ({ button }, label: string, selectedLabel: string) => {
    button.options = { label, selected: true, selectedLabel, toggle: true };
  },
);
Given("a button labeled {string} with leading and trailing icons", ({ button }, label: string) => {
  button.options = { label, leadingIcon: "send", trailingIcon: "open_in_new_window" };
});
Given(
  'a toggle button labeled {string} with selected label {string}, leading icon {string}, and selected icon {string}',
  ({ button }, label: string, selectedLabel: string, leadingIcon: string, selectedIcon: string) => {
    button.options = { label, selectedLabel, leadingIcon, selectedIcon, toggle: true };
  },
);
Given("a reset form with a text field and a button", ({ button }) => {
  button.options = { formType: "reset", label: "Reset" };
});
Given("a disabled reset button with a text field in a form", ({ button }) => {
  button.options = { disabled: true, formType: "reset", label: "Reset" };
});
Given("a default-type button inside a form", ({ button }) => {
  button.options = { formType: "button", label: "Continue" };
});
Given("a disabled submit button in a form", ({ button }) => {
  button.options = { disabled: true, formType: "submit", label: "Save" };
});
Given("a form with a submit button named {string} and value {string}", ({ button }, name: string, value: string) => {
  button.options = { formType: "submit", label: "Save", name, value };
});
Given("a link button labeled {string}", ({ button }, label: string) => {
  button.options = { label, href: "#destination" };
});
Given("a button labeled {string} without a destination", ({ button }, label: string) => {
  button.options = { label };
});
Given("a button labeled {string} with the custom role {string}", ({ button }, label: string, role: string) => {
  button.options = { label, role };
});
Given("a {string} link button labeled {string}", ({ button }, state: string, label: string) => {
  if (state !== "disabled" && state !== "disabled-interactive") throw new Error(`Unknown disabled state: ${state}`);
  button.options = {
    label,
    href: "#destination",
    disabled: state === "disabled",
    disabledInteractive: state === "disabled-interactive",
  };
});
Given("a link button targeting a new page", ({ button }) => {
  button.options = { label: "Open", href: "about:blank#destination", target: "_blank" };
});
Given("a link button for a file named {string}", ({ button }, download: string) => {
  button.options = { label: "Download", href: "data:text/plain,Button%20download", download };
});
Given(
  'a link button with target {string}, rel {string}, and download name {string}',
  ({ button }, target: string, rel: string, download: string) => {
    button.options = { label: "Download", href: "#destination", target, rel, download };
  },
);
Given("a button with variant {string}", ({ button }, variant: string) => {
  button.options = { variant };
});
Given("a button with default appearance", ({ button }) => {
  button.options = {};
});
Given("a button with size {string}", ({ button }, size: string) => {
  button.options = { size };
});
Given("a button with shape {string}", ({ button }, shape: string) => {
  button.options = { shape };
});
Given("buttons in every supported size", ({ button }) => {
  button.options = {};
});
Given("rounded and square filled buttons", ({ button }) => {
  button.options = {};
});
Given("a rounded filled button", ({ button }) => {
  button.options = { shape: "rounded", variant: "filled" };
});
Given("buttons at every density for size {string}", ({ button }, size: string) => {
  button.options = { size };
});

When("the button renders", async ({ button }) => button.show());
When("the buttons render", async ({ button }) => button.showAllSizes());
When("the buttons render for shape comparison", async ({ button }) => button.showShapeComparison());
When("the buttons render at every density", async ({ button }) => button.showDensity(button.options.size ?? "small"));
When("keyboard focus moves to the button", async ({ page }) => page.keyboard.press("Tab"));
When("the user presses {string} on the button", async ({ page }, key: string) => page.keyboard.press(key));
When("the application records button input events", async ({ button }) => button.recordInputEvents());
When("the application records button input events and cancels beforeinput", async ({ button }) =>
  button.recordInputEvents(true),
);
When("the user clicks the button", async ({ button }) => button.click());
When("the application clicks the button programmatically", async ({ button }) => button.clickProgrammatically());
When("the form renders", async ({ button }) => button.show());
When("the user changes the text field to {string}", async ({ page }, value: string) =>
  page.locator("#name").fill(value),
);
When("the application records form submission", async ({ button }) => button.recordFormSubmission());
When("the application cancels button clicks", async ({ button }) => button.cancelClicks());
When("deferred button actions have completed", async ({ button }) => button.waitForDeferredActions());
When(/^the application sets selected to (true|false)$/, async ({ button }, value: string) =>
  button.setState("selected", value === "true"),
);
When(/^the application sets toggle to (true|false)$/, async ({ button }, value: string) =>
  button.setState("toggle", value === "true"),
);
When(/^the application sets disabled to (true|false)$/, async ({ button }, value: string) =>
  button.setState("disabled", value === "true"),
);
When("the application changes the browser fragment to {string}", async ({ page }, hash: string) => {
  await page.evaluate((value) => {
    window.location.hash = value;
  }, hash);
  await expect.poll(() => page.evaluate(() => window.location.hash)).toBe(hash);
});
When("the user opens the link button", async ({ button }) => button.openPopup());
When("the user downloads the link button's destination", async ({ button }) => button.downloadDestination());
When("the application moves the button to a new DOM parent", async ({ button }) => button.moveToNewParent());
When("the application sets the destination to {string}", async ({ button }, href: string) => button.setHref(href));
When("the application removes the destination", async ({ button }) => button.setHref(null));

Then("a button named {string} is visible", async ({ page }, label: string) =>
  expect(page.getByRole("button", { name: label })).toBeVisible(),
);
Then("its leading and trailing icons are visible", async ({ button }) => {
  await expect(button.leadingIcon).toBeVisible();
  await expect(button.trailingIcon).toBeVisible();
});
Then("no icon is exposed as an image", async ({ page }) => expect(page.getByRole("img")).toHaveCount(0));
Then("the leading icon is visible", async ({ button }) => expect(button.leadingIcon).toBeVisible());
Then("the leading icon is hidden", async ({ button }) => expect(button.leadingIcon).toBeHidden());
Then("the selected icon is hidden", async ({ button }) => expect(button.selectedIcon).toBeHidden());
Then("the selected icon is visible and filled", async ({ button }) => {
  await expect(button.selectedIcon).toBeVisible();
  await expect(button.selectedIcon).toHaveAttribute("filled", "");
});
Then("the selected icon is hidden and not filled", async ({ button }) => {
  await expect(button.selectedIcon).toBeHidden();
  await expect(button.selectedIcon).not.toHaveAttribute("filled");
});
Then("the button is focused", async ({ button }) => expect(button.button).toBeFocused());
Then("its pressed state is {string}", async ({ button }, state: string) =>
  expect(button.button).toHaveAttribute("aria-pressed", state),
);
Then("it has no pressed state", async ({ button }) => expect(button.button).not.toHaveAttribute("aria-pressed"));
Then("its selected attribute is present", async ({ button }) => expect(button.button).toHaveAttribute("selected", ""));
Then("the input events are {string}", async ({ button }, events: string) =>
  expect(await button.readInputEvents()).toEqual(events.split(", ")),
);
Then("it has aria-disabled set to {string}", async ({ button }, value: string) =>
  expect(button.button).toHaveAttribute("aria-disabled", value),
);
Then("it no longer has aria-disabled", async ({ button }) => expect(button.button).not.toHaveAttribute("aria-disabled"));
Then("it has no tabindex", async ({ button }) => expect(button.button).not.toHaveAttribute("tabindex"));
Then("the text field value is {string}", async ({ page }, value: string) =>
  expect(page.locator("#name")).toHaveValue(value),
);
Then("the form submission includes the button and its value", async ({ button }) =>
  expect.poll(() => button.readFormSubmission()).toEqual({
    submitter: "m3e-button",
    values: [["action", "save"]],
  }),
);
Then("its effective type is {string}", async ({ button }, type: string) =>
  expect(button.readType()).resolves.toBe(type),
);
Then("no form submission occurs", async ({ button }) => expect(button.readFormSubmission()).resolves.toBeUndefined());
Then("a link named {string} is visible", async ({ page }, label: string) =>
  expect(page.getByRole("link", { name: label })).toBeVisible(),
);
Then("no link named {string} is exposed", async ({ page }, label: string) =>
  expect(page.getByRole("link", { name: label })).toHaveCount(0),
);
Then("the button retains the role {string}", async ({ button }, role: string) =>
  expect(button.button).toHaveAttribute("role", role),
);
Then("the new page has the destination {string}", async ({ button }, hash: string) =>
  expect.poll(() => button.popupUrl()).toBe(`about:blank${hash}`),
);
Then("the downloaded file is named {string} and contains {string}", async ({ button }, name: string, content: string) =>
  expect(await button.readDownload()).toEqual({ name, content }),
);
Then(
  "its internal link has target {string}, rel {string}, and download name {string}",
  async ({ button }, target: string, rel: string, download: string) =>
    expect(await button.readLinkAttributes()).toMatchObject({ target, rel, download }),
);
Then("its internal link is hidden from assistive technology", async ({ button }) =>
  expect((await button.readLinkAttributes()).ariaHidden).toBe("true"),
);
Then("the browser navigates to {string}", async ({ page }, hash: string) =>
  expect.poll(() => page.evaluate(() => window.location.hash)).toBe(hash),
);
Then("the browser remains at {string}", async ({ page }, hash: string) =>
  expect(page.evaluate(() => window.location.hash)).resolves.toBe(hash),
);
Then("it reflects variant {string}", async ({ button }, variant: string) =>
  expect(button.button).toHaveAttribute("variant", variant),
);
Then("its effective button size is {string}", async ({ button }, size: string) =>
  expect(button.readSize()).resolves.toBe(size),
);
Then("its effective button shape is {string}", async ({ button }, shape: string) =>
  expect(button.readShape()).resolves.toBe(shape),
);
Then("it reflects size {string}", async ({ button }, size: string) =>
  expect(button.button).toHaveAttribute("size", size),
);
Then("it reflects shape {string}", async ({ button }, shape: string) =>
  expect(button.button).toHaveAttribute("shape", shape),
);
Then("each button is taller than the previous size", async ({ button }) => {
  const heights = await button.readHeights();
  for (let index = 1; index < heights.length; index++) {
    expect(heights[index]).toBeGreaterThan(heights[index - 1]);
  }
});
Then("their corner radii are different", async ({ button }) =>
  expect(await button.readCornerRadius("rounded")).not.toBe(await button.readCornerRadius("square")),
);
Then("its corner radius is at least half its height", async ({ button }) => {
  expect(await button.readCornerRadius()).toBeGreaterThanOrEqual((await button.readHeight()) / 2 - 1);
});
Then("each density step increases visual height", async ({ button }) => {
  const measurements = await button.readDensityMeasurements();
  for (let index = 1; index < measurements.length; index++) {
    expect(measurements[index].visualHeight).toBeGreaterThan(measurements[index - 1].visualHeight);
  }
});
Then("every density button keeps a 48 by 48 pixel touch target", async ({ button }) => {
  for (const measurement of await button.readDensityMeasurements()) {
    expect(measurement.touchWidth).toBeGreaterThanOrEqual(48);
    expect(measurement.touchHeight).toBeGreaterThanOrEqual(48);
  }
});
