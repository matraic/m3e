import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { IconButtonHarness } from "./icon-button.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ iconButton: IconButtonHarness }>({
  iconButton: async ({ page, render }, use) => use(new IconButtonHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an icon button with variant {string} labelled {string}", ({ iconButton }, variant: string, label: string) => {
  iconButton.html = iconButton.markup(`variant="${variant}" aria-label="${label}"`);
});
When("the icon button renders", async ({ iconButton }) => iconButton.show());
Then("an icon button named {string} is visible", async ({ page }, label: string) =>
  expect(page.getByRole("button", { name: label })).toBeVisible(),
);
When("keyboard focus moves to the icon button", async ({ page }) => page.keyboard.press("Tab"));
Then("the icon button is focused", async ({ iconButton }) => expect(iconButton.button).toBeFocused());

Given(
  "an icon button labelled by referenced text {string} with icon {string}",
  ({ iconButton }, label: string, name: string) => {
    iconButton.html = `<span id="icon-button-label">${label}</span>${iconButton.markup(
      'aria-labelledby="icon-button-label"',
      `<m3e-icon name="${name}"></m3e-icon>`,
    )}`;
  },
);
Then("no icon button icon is exposed as an image", async ({ page }) => expect(page.getByRole("img")).toHaveCount(0));

Given("a toggle icon button labelled {string}", ({ iconButton }, label: string) => {
  iconButton.html = iconButton.markup(`toggle aria-label="${label}"`);
});
When("the application records icon button input events", async ({ iconButton }) => iconButton.recordInputEvents());
When("the user clicks the icon button", async ({ iconButton }) => iconButton.click());
Then("the icon button's pressed state is {string}", async ({ iconButton }, state: string) =>
  expect(iconButton.button).toHaveAttribute("aria-pressed", state),
);
Then("the icon button has its selected attribute", async ({ iconButton }) =>
  expect(iconButton.button).toHaveAttribute("selected", ""),
);
Then("icon button input events are {string}", async ({ iconButton }, events: string) =>
  expect(await iconButton.readInputEvents()).toEqual(events.split(", ")),
);
When("the user presses {string} on the icon button", async ({ page }, key: string) => page.keyboard.press(key));

Given("a radio toggle icon button labelled {string}", ({ iconButton }, label: string) => {
  iconButton.html = iconButton.markup(`toggle role="radio" aria-label="${label}"`);
});
Then("the radio icon button checked state is {string}", async ({ iconButton }, state: string) =>
  expect(iconButton.button).toHaveAttribute("aria-checked", state),
);
Then("the radio icon button has no pressed state", async ({ iconButton }) =>
  expect(iconButton.button).not.toHaveAttribute("aria-pressed"),
);

When("the application records icon button input events and cancels beforeinput", async ({ iconButton }) =>
  iconButton.recordInputEvents(true),
);
When(/^the application sets icon button selected state to (true|false)$/, async ({ iconButton }, value: string) =>
  iconButton.setState("selected", value === "true"),
);
When(/^the application sets icon button toggle state to (true|false)$/, async ({ iconButton }, value: string) =>
  iconButton.setState("toggle", value === "true"),
);
Then("the icon button has no pressed state", async ({ iconButton }) =>
  expect(iconButton.button).not.toHaveAttribute("aria-pressed"),
);
When(/^the application sets icon button disabled state to (true|false)$/, async ({ iconButton }, value: string) =>
  iconButton.setState("disabled", value === "true"),
);
Then("the icon button has aria-disabled set to {string}", async ({ iconButton }, value: string) =>
  expect(iconButton.button).toHaveAttribute("aria-disabled", value),
);
When("the application clicks the icon button programmatically", async ({ iconButton }) =>
  iconButton.clickProgrammatically(),
);
Then("the icon button no longer has aria-disabled", async ({ iconButton }) =>
  expect(iconButton.button).not.toHaveAttribute("aria-disabled"),
);

Given("a disabled toggle icon button labelled {string}", ({ iconButton }, label: string) => {
  iconButton.html = iconButton.markup(`toggle disabled aria-label="${label}"`);
});
Then("the icon button has no tabindex", async ({ iconButton }) =>
  expect(iconButton.button).not.toHaveAttribute("tabindex"),
);
Given("a disabled-interactive toggle icon button labelled {string}", ({ iconButton }, label: string) => {
  iconButton.html = iconButton.markup(`toggle disabled-interactive aria-label="${label}"`);
});

Given("a toggle icon button labelled {string} with icon {string}", ({ iconButton }, label: string, name: string) => {
  iconButton.html = iconButton.markup(`toggle aria-label="${label}"`, `<m3e-icon id="icon" name="${name}"></m3e-icon>`);
});
Then("its icon is filled", async ({ iconButton }) => expect(iconButton.icon).toHaveAttribute("filled", ""));
Then("its icon is not filled", async ({ iconButton }) => expect(iconButton.icon).not.toHaveAttribute("filled"));
Given(
  "a toggle icon button labelled {string} with unselected icon {string} and selected icon {string}",
  ({ iconButton }, label: string, unselected: string, selected: string) => {
    iconButton.html = iconButton.markup(
      `toggle aria-label="${label}"`,
      `<m3e-icon id="unselected-icon" name="${unselected}"></m3e-icon>
      <m3e-icon id="selected-icon" slot="selected" name="${selected}"></m3e-icon>`,
    );
  },
);
Then("the unselected icon is visible", async ({ iconButton }) => expect(iconButton.unselectedIcon).toBeVisible());
Then("the icon button's selected icon is hidden", async ({ iconButton }) =>
  expect(iconButton.selectedIcon).toBeHidden(),
);
Then("the unselected icon is hidden", async ({ iconButton }) => expect(iconButton.unselectedIcon).toBeHidden());
Then("the icon button's selected icon is visible and filled", async ({ iconButton }) => {
  await expect(iconButton.selectedIcon).toBeVisible();
  await expect(iconButton.selectedIcon).toHaveAttribute("filled", "");
});
Then("the icon button's selected icon is hidden and not filled", async ({ iconButton }) => {
  await expect(iconButton.selectedIcon).toBeHidden();
  await expect(iconButton.selectedIcon).not.toHaveAttribute("filled");
});
When("the application moves the icon button to a new DOM parent", async ({ iconButton }) =>
  iconButton.moveToNewParent(),
);

Given("a reset form with a text field and an icon button", ({ iconButton }) => {
  iconButton.html = `<form><input id="name" value="Original" />${iconButton.markup(
    'type="reset" aria-label="Reset"',
  )}</form>`;
});
When("the user changes the icon button form field to {string}", async ({ page }, value: string) =>
  page.locator("#name").fill(value),
);
Then("the icon button form field value is {string}", async ({ page }, value: string) =>
  expect(page.locator("#name")).toHaveValue(value),
);
Given("a disabled reset icon button with a text field in a form", ({ iconButton }) => {
  iconButton.html = `<form><input id="name" value="Original" />${iconButton.markup(
    'type="reset" disabled aria-label="Reset"',
  )}</form>`;
});
Given(
  "a form with a submit icon button named {string} and value {string}",
  ({ iconButton }, name: string, value: string) => {
    iconButton.html = `<form>${iconButton.markup(
      `type="submit" name="${name}" value="${value}" aria-label="Save"`,
    )}</form>`;
  },
);
When("the application records the icon button form submission", async ({ iconButton }) =>
  iconButton.recordFormSubmission(),
);
Then("the form submission includes the icon button and its value", async ({ iconButton }) =>
  expect
    .poll(() => iconButton.readFormSubmission())
    .toEqual({
      submitter: "m3e-icon-button",
      values: [["action", "save"]],
    }),
);
Given("a disabled submit icon button in a form", ({ iconButton }) => {
  iconButton.html = `<form>${iconButton.markup('type="submit" disabled aria-label="Save"')}</form>`;
});
Then("no icon button form submission occurs", async ({ iconButton }) =>
  expect(iconButton.readFormSubmission()).resolves.toBeUndefined(),
);
Given("a default-type icon button inside a form", ({ iconButton }) => {
  iconButton.html = `<form>${iconButton.markup('aria-label="Continue"')}</form>`;
});
Then("the icon button's effective type is {string}", async ({ iconButton }, type: string) =>
  expect(iconButton.readType()).resolves.toBe(type),
);
When("the application cancels icon button clicks", async ({ iconButton }) => iconButton.cancelClicks());
When("deferred icon button actions have completed", async ({ iconButton }) => iconButton.waitForDeferredActions());

Given("an icon button labelled {string} with destination {string}", ({ iconButton }, label: string, href: string) => {
  iconButton.html = iconButton.markup(`href="${href}" aria-label="${label}"`);
});
Then("an icon button link named {string} is visible", async ({ page }, label: string) =>
  expect(page.getByRole("link", { name: label })).toBeVisible(),
);
Then("the icon button browser navigates to {string}", async ({ page }, hash: string) =>
  expect.poll(() => page.evaluate(() => window.location.hash)).toBe(hash),
);
Given("an icon button labelled {string} without a destination", ({ iconButton }, label: string) => {
  iconButton.html = iconButton.markup(`aria-label="${label}"`);
});
When("the application sets the icon button destination to {string}", async ({ iconButton }, href: string) =>
  iconButton.setHref(href),
);
When("the application removes the icon button destination", async ({ iconButton }) => iconButton.setHref(null));
Then("no icon button link named {string} is exposed", async ({ page }, label: string) =>
  expect(page.getByRole("link", { name: label })).toHaveCount(0),
);
Given(
  "an icon button labelled {string} with the custom role {string}",
  ({ iconButton }, label: string, role: string) => {
    iconButton.html = iconButton.markup(`aria-label="${label}" role="${role}"`);
  },
);
Then("the icon button retains the role {string}", async ({ iconButton }, role: string) =>
  expect(iconButton.button).toHaveAttribute("role", role),
);
Given("a {string} link icon button labelled {string}", ({ iconButton }, state: string, label: string) => {
  if (state !== "disabled" && state !== "disabled-interactive") {
    throw new Error(`Unknown disabled state: ${state}`);
  }
  iconButton.html = iconButton.markup(
    `href="#destination" aria-label="${label}"${state === "disabled" ? " disabled" : " disabled-interactive"}`,
  );
});
Then("the icon button browser remains at {string}", async ({ page }, hash: string) =>
  expect(page.evaluate(() => window.location.hash)).resolves.toBe(hash),
);
Given(
  "a link icon button targeting {string}, rel {string}, and download name {string}",
  ({ iconButton }, target: string, rel: string, download: string) => {
    iconButton.html = iconButton.markup(
      `href="#destination" target="${target}" rel="${rel}" download="${download}" aria-label="Download"`,
    );
  },
);
Then(
  "the icon button's internal link has target {string}, rel {string}, and download name {string}",
  async ({ iconButton }, target: string, rel: string, download: string) =>
    expect(await iconButton.readLinkAttributes()).toMatchObject({ target, rel, download }),
);
Then("the icon button's internal link is hidden from assistive technology", async ({ iconButton }) =>
  expect((await iconButton.readLinkAttributes()).ariaHidden).toBe("true"),
);

Given("an icon button with variant {string}", ({ iconButton }, variant: string) => {
  iconButton.html = iconButton.markup(`variant="${variant}"`);
});
Then("the icon button reflects variant {string}", async ({ iconButton }, variant: string) =>
  expect(iconButton.button).toHaveAttribute("variant", variant),
);
Given("an icon button with default appearance", ({ iconButton }) => {
  iconButton.html = iconButton.markup();
});
Then("its effective appearance is standard, small, rounded, and default", async ({ iconButton }) =>
  expect(await iconButton.readAppearance()).toEqual({
    variant: "standard",
    size: "small",
    shape: "rounded",
    width: "default",
  }),
);
Given("an icon button with unsupported appearance values", ({ iconButton }) => {
  iconButton.html = iconButton.markup('variant="bogus" size="bogus" shape="bogus" width="bogus"');
});
Then("the icon button reflects size {string}", async ({ iconButton }, size: string) =>
  expect(iconButton.button).toHaveAttribute("size", size),
);
Then("the icon button reflects shape {string}", async ({ iconButton }, shape: string) =>
  expect(iconButton.button).toHaveAttribute("shape", shape),
);
Then("the icon button reflects width {string}", async ({ iconButton }, width: string) =>
  expect(iconButton.button).toHaveAttribute("width", width),
);
Given("an icon button with size {string}", ({ iconButton }, size: string) => {
  iconButton.html = iconButton.markup(`size="${size}"`);
});
Given("an icon button with shape {string}", ({ iconButton }, shape: string) => {
  iconButton.html = iconButton.markup(`shape="${shape}"`);
});
Given("an icon button with width {string}", ({ iconButton }, width: string) => {
  iconButton.html = iconButton.markup(`width="${width}"`);
});
Given("icon buttons in every supported size", ({ iconButton }) => {
  iconButton.html = "";
});
When("the icon buttons render", async ({ iconButton }) => iconButton.showAllSizes());
Then("every icon button keeps a 48 by 48 pixel touch target", async ({ iconButton }) => {
  for (const target of await iconButton.readTouchTargets()) {
    expect(target.width).toBeGreaterThanOrEqual(48);
    expect(target.height).toBeGreaterThanOrEqual(48);
  }
});
