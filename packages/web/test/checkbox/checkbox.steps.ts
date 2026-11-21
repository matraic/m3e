import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { CheckboxHarness } from "./checkbox.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ checkbox: CheckboxHarness }>({
  checkbox: async ({ page, render }, use) => use(new CheckboxHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a checkbox wrapped in its Receive updates label", ({ checkbox }) => {
  checkbox.markup = '<label><m3e-checkbox aria-label="Receive updates"></m3e-checkbox>Receive updates</label>';
});
When("the checkbox renders", async ({ checkbox }) => checkbox.show());
Then("a checkbox named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("checkbox", { name, exact: true })).toBeVisible(),
);
When("the user presses {string} on the checkbox", async ({ page }, key: string) => page.keyboard.press(key));
Then("the checkbox has keyboard focus", async ({ checkbox }) => expect(checkbox.checkbox).toBeFocused());
When("the user clicks checkbox label {string}", async ({ page }, label: string) =>
  page.getByText(label, { exact: true }).click(),
);
Then("the checkbox is checked", async ({ checkbox }) => expect(checkbox.checkbox).toHaveAttribute("checked", ""));

Given("an unchecked checkbox", ({ checkbox }) => {
  checkbox.markup = '<m3e-checkbox aria-label="Receive updates"></m3e-checkbox>';
});
When("the application observes checkbox events", async ({ checkbox }) => checkbox.recordEvents());
When("the user clicks the checkbox", async ({ checkbox }) => checkbox.checkbox.click());
Then("the checkbox exposes checked state {string}", async ({ checkbox }, state: string) =>
  expect(checkbox.checkbox).toHaveAttribute("aria-checked", state),
);
Then("the checkbox events are {string}", async ({ checkbox }, events: string) =>
  expect(checkbox.checkbox).toHaveAttribute("data-events", events),
);
Then("the checkbox is unchecked", async ({ checkbox }) => expect(checkbox.checkbox).not.toHaveAttribute("checked"));
When("the application cancels checkbox beforeinput", async ({ checkbox }) => checkbox.recordEvents(true));

Given("an indeterminate checkbox", ({ checkbox }) => {
  checkbox.markup = '<m3e-checkbox indeterminate aria-label="Select all"></m3e-checkbox>';
});
Then("the checkbox is not indeterminate", async ({ checkbox }) =>
  expect(checkbox.checkbox).not.toHaveAttribute("indeterminate"),
);
When("the user focuses the checkbox", async ({ checkbox }) => checkbox.checkbox.focus());

Given("a disabled checkbox", ({ checkbox }) => {
  checkbox.markup = '<m3e-checkbox disabled aria-label="Unavailable"></m3e-checkbox>';
});
Then("the checkbox exposes disabled state", async ({ checkbox }) =>
  expect(checkbox.checkbox).toHaveAttribute("aria-disabled", "true"),
);
Then("the checkbox is not keyboard focusable", async ({ checkbox }) =>
  expect(checkbox.checkbox).not.toHaveAttribute("tabindex"),
);
When("the application clicks the checkbox", async ({ checkbox }) => checkbox.clickProgrammatically());

Given("a checkbox named {string} with value {string} in a form", ({ checkbox }, name: string, value: string) => {
  checkbox.markup = `<form id="preferences">
    <m3e-checkbox name="${name}" value="${value}" aria-label="Weekly updates"></m3e-checkbox>
    <button type="reset">Reset</button>
  </form>`;
});
Then("the preferences form has no checkbox values", async ({ checkbox }) =>
  expect.poll(() => checkbox.formValues()).toEqual([]),
);
Then("the preferences form includes {string} with value {string}", async ({ checkbox }, name: string, value: string) =>
  expect.poll(() => checkbox.formValues()).toEqual([[name, value]]),
);

Given("an initially checked checkbox in a form", ({ checkbox }) => {
  checkbox.markup = `<form id="preferences">
    <m3e-checkbox checked aria-label="Receive updates"></m3e-checkbox>
    <button type="reset">Reset</button>
  </form>`;
});
When("the user resets the preferences form", async ({ page }) => page.getByRole("button", { name: "Reset" }).click());

Given("a required checkbox in a form", ({ checkbox }) => {
  checkbox.markup = `<form id="preferences">
    <m3e-checkbox required name="terms" value="accepted" aria-label="Accept terms"></m3e-checkbox>
  </form>`;
});
Then("the preferences form is invalid", async ({ checkbox }) => expect.poll(() => checkbox.formIsValid()).toBe(false));
Then("the preferences form is valid", async ({ checkbox }) => expect.poll(() => checkbox.formIsValid()).toBe(true));

Given("a checkbox with an explicit Receive updates label", ({ checkbox }) => {
  checkbox.markup = '<m3e-checkbox id="updates"></m3e-checkbox><label for="updates">Receive updates</label>';
});
Then("the checkbox has native accessible name {string}", async ({ checkbox }, name: string) => {
  await expect(checkbox.checkbox).toBeVisible();
  await expect.poll(() => checkbox.nativeAccessibleNames()).toEqual([name]);
});

Given("a checkbox with a native wrapping label", ({ checkbox }) => {
  checkbox.markup = "<label><m3e-checkbox></m3e-checkbox>Receive updates</label>";
});
When("the application sets checkbox attribute {string}", async ({ checkbox }, name: string) => checkbox.setAttribute(name));
When("the application removes checkbox attribute {string}", async ({ checkbox }, name: string) =>
  checkbox.removeAttribute(name),
);
Then("the checkbox remains indeterminate", async ({ checkbox }) =>
  expect(checkbox.checkbox).toHaveAttribute("indeterminate", ""),
);
Then("the checkbox is keyboard focusable", async ({ checkbox }) =>
  expect(checkbox.checkbox).toHaveAttribute("tabindex", "0"),
);
Then("the checkbox is not exposed as disabled", async ({ checkbox }) =>
  expect(checkbox.checkbox).not.toHaveAttribute("aria-disabled", "true"),
);

Given("forced colors are active for checkboxes", async ({ page }) => page.emulateMedia({ forcedColors: "active" }));
Then("the checkbox outline uses the system text color", async ({ checkbox }) => {
  const { color, width, expected } = await checkbox.readOutlineColors();
  expect(color).toBe(expected);
  expect(parseFloat(width)).toBeGreaterThan(0);
});

Given("a checked checkbox named {string} with no explicit value in a form", ({ checkbox }, name: string) => {
  checkbox.markup = `<form id="preferences">
    <m3e-checkbox checked name="${name}" aria-label="Receive updates"></m3e-checkbox>
  </form>`;
});

Given("an initially indeterminate checkbox in a form", ({ checkbox }) => {
  checkbox.markup = `<form id="preferences">
    <m3e-checkbox indeterminate aria-label="Select all"></m3e-checkbox>
    <button type="reset">Reset</button>
  </form>`;
});

Given("a checked checkbox inside a disabled fieldset", ({ checkbox }) => {
  checkbox.markup = `<form id="preferences"><fieldset disabled>
    <m3e-checkbox checked name="updates" value="weekly" aria-label="Receive updates"></m3e-checkbox>
  </fieldset></form>`;
});
When("the application enables the checkbox fieldset", async ({ checkbox }) => checkbox.enableFieldset());
When("the application moves the checkbox to a new DOM parent", async ({ checkbox }) => checkbox.moveToNewParent());
Then("the checkbox is in the new DOM parent", async ({ page }) =>
  expect(page.locator("#checkbox-new-parent > m3e-checkbox")).toBeVisible(),
);

Given("a checked checkbox with a destination form", ({ checkbox }) => {
  checkbox.markup = `<form id="preferences">
    <m3e-checkbox checked name="updates" value="weekly" aria-label="Receive updates"></m3e-checkbox>
  </form><form id="destination"></form>`;
});
When("the application moves the checkbox to the destination form", async ({ checkbox }) => checkbox.moveToDestinationForm());
Then("the destination form includes the checkbox value", async ({ checkbox }) =>
  expect.poll(() => checkbox.formValues("destination")).toEqual([["updates", "weekly"]]),
);
Then("the destination form has no checkbox values", async ({ checkbox }) =>
  expect.poll(() => checkbox.formValues("destination")).toEqual([]),
);
When("the application moves the checkbox into a new label", async ({ checkbox }) => checkbox.moveToNewLabel());
