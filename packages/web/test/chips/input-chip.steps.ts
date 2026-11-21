import { createBdd } from "playwright-bdd";

import { expect } from "../fixtures";
import { test } from "./chips.steps";

const { Given, When, Then } = createBdd(test);
const inputMarkup = '<input slot="input" aria-label="New keyword" />';

Given("an input chip set with a custom removal label", ({ chips }) => {
  chips.markup = `<m3e-input-chip-set aria-label="Keywords">
    <m3e-input-chip removable remove-label="Remove keyword">TypeScript</m3e-input-chip>
  </m3e-input-chip-set>`;
});
When("the input chips render", async ({ chips }) => chips.show());
When("the application observes input chip changes", async ({ chips }) => chips.recordInputChanges());
When("the user clicks the chip remove button {string}", async ({ page }, name: string) =>
  page.getByRole("button", { name, exact: true }).click(),
);
Then("the input chip set recorded one remove event", async ({ chips }) =>
  expect(chips.inputSet).toHaveAttribute("data-removes", "1"),
);
Then("the input chip set contains {int} chips", async ({ page }, count: number) =>
  expect(page.locator("m3e-input-chip")).toHaveCount(count),
);

Given("an empty input chip set", ({ chips }) => {
  chips.markup = `<m3e-input-chip-set aria-label="Keywords">${inputMarkup}</m3e-input-chip-set>`;
});
When("the user enters input chip value {string}", async ({ chips }, value: string) => {
  await chips.input.fill(value);
  await chips.input.press("Enter");
});
Then("input chip {string} is visible", async ({ page }, label: string) =>
  expect(page.locator("m3e-input-chip").filter({ hasText: label })).toBeVisible(),
);
Then("the chip input is empty", async ({ chips }) => expect(chips.input).toHaveValue(""));
Then("the input chip changes are {string}", async ({ chips }, changes: string) =>
  expect(chips.inputSet).toHaveAttribute("data-changes", changes),
);

Given("an input chip set with a removable TypeScript chip", ({ chips }) => {
  chips.markup = `<m3e-input-chip-set aria-label="Keywords">
    <m3e-input-chip removable>TypeScript</m3e-input-chip>${inputMarkup}
  </m3e-input-chip-set>`;
});

Given("an input chip set limited to one visible chip", ({ chips }) => {
  chips.markup = `<m3e-input-chip-set aria-label="Keywords" max-chips="1">
    <m3e-input-chip>One</m3e-input-chip><m3e-input-chip>Two</m3e-input-chip>${inputMarkup}
  </m3e-input-chip-set><button>Outside</button>`;
});
Then("input chip {string} is hidden", async ({ page }, label: string) =>
  expect(page.locator("m3e-input-chip").filter({ hasText: label })).toBeHidden(),
);
Then("the input chip overflow count is visible", async ({ page }) =>
  expect(page.getByText("+1", { exact: true })).toBeVisible(),
);
When("the user focuses the chip input", async ({ chips }) => chips.input.focus());
Then("the Keywords input chip set is a grid", async ({ page }) =>
  expect(page.getByRole("grid", { name: "Keywords" })).toBeVisible(),
);
Then("the TypeScript input chip has a labeled grid cell", async ({ page }) =>
  expect(page.getByRole("gridcell", { name: "TypeScript", exact: true })).toBeVisible(),
);
Then("the default Remove button is accessible", async ({ page }) =>
  expect(page.getByRole("button", { name: "Remove", exact: true })).toBeVisible(),
);
When("the user focuses the TypeScript chip cell", async ({ page }) =>
  page.getByRole("gridcell", { name: "TypeScript", exact: true }).focus(),
);
When("the user presses {string} in the input chip set", async ({ page }, key: string) => page.keyboard.press(key));
Then("the chip input has focus", async ({ chips }) => expect(chips.input).toBeFocused());

Given("an input chip set with a non-removable TypeScript chip", ({ chips }) => {
  chips.markup = `<m3e-input-chip-set aria-label="Keywords"><m3e-input-chip>TypeScript</m3e-input-chip>${inputMarkup}</m3e-input-chip-set>`;
});

Given("an input chip set with two removable chips", ({ chips }) => {
  chips.markup = `<m3e-input-chip-set aria-label="Keywords">
    <m3e-input-chip removable>TypeScript</m3e-input-chip><m3e-input-chip removable>JavaScript</m3e-input-chip>${inputMarkup}
  </m3e-input-chip-set>`;
});
When("the user fills the chip input with {string}", async ({ chips }, value: string) => chips.input.fill(value));
When("the user clicks the first chip remove button", async ({ page }) =>
  page.getByRole("button", { name: "Remove", exact: true }).first().click(),
);
Then("the JavaScript chip remove button has focus", async ({ page }) =>
  expect(
    page.locator("m3e-input-chip").filter({ hasText: "JavaScript" }).getByRole("button", { name: "Remove" }),
  ).toBeFocused(),
);
When("the application sets input set attribute {string} to {string}", async ({ chips }, name: string, value: string) =>
  chips.setAttribute(chips.inputSet, name, value),
);
Then("the chip input is disabled", async ({ chips }) => expect(chips.input).toBeDisabled());
Then("the chip remove button is disabled", async ({ page }) =>
  expect(page.getByRole("button", { name: "Remove", exact: true })).toHaveAttribute("aria-disabled", "true"),
);
When("the application clicks the chip remove button", async ({ page }) =>
  page.getByRole("button", { name: "Remove", exact: true }).evaluate((element: HTMLElement) => element.click()),
);
When("the application changes the chip removal label to {string}", async ({ chips, page }, label: string) =>
  chips.setAttribute(page.locator("m3e-input-chip"), "remove-label", label),
);
Then("the Remove TypeScript button is accessible", async ({ page }) =>
  expect(page.getByRole("button", { name: "Remove TypeScript" })).toBeVisible(),
);
Then("the TypeScript chip remove button has focus", async ({ page }) =>
  expect(page.getByRole("button", { name: "Remove", exact: true })).toBeFocused(),
);
When("the application sets input chip attribute {string}", async ({ chips, page }, name: string) =>
  chips.setAttribute(page.locator("m3e-input-chip"), name),
);
Then("the TypeScript chip cell has focus", async ({ page }) =>
  expect(page.getByRole("gridcell", { name: "TypeScript", exact: true })).toBeFocused(),
);
When("the user focuses the outside button", async ({ page }) => page.getByRole("button", { name: "Outside" }).focus());
When("the application removes input set attribute {string}", async ({ chips }, name: string) =>
  chips.removeAttribute(chips.inputSet, name),
);
When("the application replaces the chip input", async ({ chips }) =>
  chips.input.evaluate((input) => {
    const replacement = document.createElement("input");
    replacement.slot = "input";
    replacement.setAttribute("aria-label", "New keyword");
    input.replaceWith(replacement);
  }),
);
When("the application moves the input chip set to a new parent", async ({ chips }) =>
  chips.moveToNewParent(chips.inputSet),
);
Then("the input chip set is in the new parent", async ({ page }) =>
  expect(page.locator("#chip-parent-2 > m3e-input-chip-set")).toBeVisible(),
);

Given("an input chip with a destination input set", ({ chips }) => {
  chips.markup = `<m3e-input-chip-set aria-label="Keywords">
    <m3e-input-chip removable>TypeScript</m3e-input-chip>${inputMarkup}
  </m3e-input-chip-set><m3e-input-chip-set id="destination-input-set" aria-label="Destination"></m3e-input-chip-set>`;
});
When("the application observes both input sets", async ({ chips, page }) => {
  await chips.recordInputChanges();
  await chips.recordInputChanges(page.locator("#destination-input-set"));
});
When("the application moves TypeScript into the destination input set", async ({ chips, page }) =>
  chips.moveToSet(page.locator("m3e-input-chip"), "destination-input-set"),
);
Then("the destination input set contains TypeScript", async ({ page }) =>
  expect(page.locator("#destination-input-set > m3e-input-chip")).toHaveText("TypeScript"),
);
Then("both input sets contain no chips", async ({ page }) => expect(page.locator("m3e-input-chip")).toHaveCount(0));
Then("only the destination input set reports removal", async ({ chips, page }) => {
  await expect(chips.inputSet).toHaveAttribute("data-changes", "");
  await expect(page.locator("#destination-input-set")).toHaveAttribute("data-changes", "remove:TypeScript");
  await expect(page.locator("#destination-input-set")).toHaveAttribute("data-removes", "1");
});
