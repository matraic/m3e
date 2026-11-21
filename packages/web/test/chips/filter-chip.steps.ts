import type { M3eFilterChipSetElement } from "@m3e/web/chips";
import { createBdd } from "playwright-bdd";

import { expect } from "../fixtures";
import { test } from "./chips.steps";

const { Given, When, Then } = createBdd(test);

Given("a filter chip set with one Design chip", ({ chips }) => {
  chips.markup = `<m3e-filter-chip-set aria-label="Topics">
    <m3e-filter-chip value="design">Design</m3e-filter-chip>
  </m3e-filter-chip-set>`;
});
When("the filter chips render", async ({ chips }) => chips.show());
Then("filter chip {string} exposes radio state {string}", async ({ page }, name: string, state: string) =>
  expect(page.getByRole("radio", { name, exact: true })).toHaveAttribute("aria-checked", state),
);
When("the user clicks filter chip {string}", async ({ chips }, name: string) => chips.filterChip(name).click());
Then("filter chip {string} is selected", async ({ chips }, name: string) =>
  expect(chips.filterChip(name)).toHaveAttribute("selected", ""),
);
Then("filter chip {string} is not selected", async ({ chips }, name: string) =>
  expect(chips.filterChip(name)).not.toHaveAttribute("selected"),
);

Given("a filter chip set with Design initially selected and Accessibility unselected", ({ chips }) => {
  chips.markup = `<m3e-filter-chip-set aria-label="Topics">
    <m3e-filter-chip selected value="design">Design</m3e-filter-chip>
    <m3e-filter-chip value="accessibility">Accessibility</m3e-filter-chip>
  </m3e-filter-chip-set>`;
});
When("the application sets filter set attribute {string} to {string}", async ({ chips }, name: string, value: string) =>
  chips.setAttribute(chips.filterSet, name, value),
);
Then("the Topics filter set is a group", async ({ page }) =>
  expect(page.getByRole("group", { name: "Topics" })).toBeVisible(),
);
Then("filter chip {string} exposes pressed state {string}", async ({ page }, name: string, state: string) =>
  expect(page.getByRole("button", { name, exact: true })).toHaveAttribute("aria-pressed", state),
);
When("the application cancels filter chip beforeinput", async ({ chips }) =>
  chips.recordEvents(chips.filterSet, ["beforeinput", "input", "change"], "beforeinput"),
);
Then("the filter set events are {string}", async ({ chips }, events: string) =>
  expect(chips.filterSet).toHaveAttribute("data-events", events),
);
When("the application observes filter set events", async ({ chips }) =>
  chips.recordEvents(chips.filterSet, ["beforeinput", "input", "change"]),
);

Given("a filter chip set with a disabled middle chip", ({ chips }) => {
  chips.markup = `<m3e-filter-chip-set aria-label="Topics">
    <m3e-filter-chip>Design</m3e-filter-chip><m3e-filter-chip disabled>Accessibility</m3e-filter-chip>
    <m3e-filter-chip>Motion</m3e-filter-chip>
  </m3e-filter-chip-set>`;
});
Then("the Topics filter set is a radiogroup", async ({ page }) =>
  expect(page.getByRole("radiogroup", { name: "Topics" })).toBeVisible(),
);
When("the user focuses filter chip {string}", async ({ chips }, name: string) => chips.filterChip(name).focus());
When("the user presses {string} in the filter set", async ({ page }, key: string) => page.keyboard.press(key));
Then("filter chip {string} has focus", async ({ chips }, name: string) => expect(chips.filterChip(name)).toBeFocused());
Then("filter chip {string} has no radio state", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).not.toHaveAttribute("aria-checked"),
);
When("the application removes filter set attribute {string}", async ({ chips }, name: string) =>
  chips.removeAttribute(chips.filterSet, name),
);
Then("filter chip {string} has no pressed state", async ({ page }, name: string) =>
  expect(page.getByRole("radio", { name, exact: true })).not.toHaveAttribute("aria-pressed"),
);
Then("filter chip {string} exposes disabled state", async ({ chips }, name: string) =>
  expect(chips.filterChip(name)).toHaveAttribute("aria-disabled", "true"),
);
When("the application clicks filter chip {string}", async ({ chips }, name: string) =>
  chips.filterChip(name).evaluate((element: HTMLElement) => element.click()),
);
When("the application selects filter chip {string}", async ({ chips }, name: string) =>
  chips.setAttribute(chips.filterChip(name), "selected"),
);

Given("a multi-select filter set in a form", ({ chips }) => {
  chips.markup = `<form id="chip-form"><m3e-filter-chip-set multi name="topic" aria-label="Topics">
    <m3e-filter-chip value="design">Design</m3e-filter-chip>
    <m3e-filter-chip value="accessibility">Accessibility</m3e-filter-chip>
  </m3e-filter-chip-set></form>`;
});
Then("the filter form values are Design and Accessibility", async ({ chips }) =>
  expect
    .poll(() => chips.formValues())
    .toEqual([
      ["topic", "design"],
      ["topic", "accessibility"],
    ]),
);
Then("the filter form includes only {string}", async ({ chips }, value: string) =>
  expect.poll(() => chips.formValues()).toEqual([["topic", value]]),
);
Then("the filter form has no values", async ({ chips }) => expect.poll(() => chips.formValues()).toEqual([]));
When("the application moves the filter set to a new parent", async ({ chips }) =>
  chips.moveToNewParent(chips.filterSet),
);
Then("the filter set is in the new parent", async ({ page }) =>
  expect(page.locator("#chip-parent-2 > m3e-filter-chip-set")).toBeVisible(),
);

Given("a filter chip with a multi-select destination set", ({ chips }) => {
  chips.markup = `<m3e-filter-chip-set aria-label="Topics"><m3e-filter-chip>Design</m3e-filter-chip></m3e-filter-chip-set>
    <m3e-filter-chip-set id="destination-filter-set" multi aria-label="Destination"></m3e-filter-chip-set>`;
});
When("the application moves Design into the destination filter set", async ({ chips, page }) =>
  chips.moveToSet(page.locator("m3e-filter-chip"), "destination-filter-set"),
);
Then("the destination filter set contains Design", async ({ page }) =>
  expect(page.locator("#destination-filter-set > m3e-filter-chip")).toHaveText("Design"),
);
Then("the original filter set has no selected values", async ({ chips }) =>
  expect.poll(() => chips.filterSet.evaluate((set: M3eFilterChipSetElement) => set.value)).toBeNull(),
);

Given("an initially selected filter set in a form", ({ chips }) => {
  chips.markup = `<form id="chip-form"><m3e-filter-chip-set name="topic" aria-label="Topics">
    <m3e-filter-chip value="design" selected>Design</m3e-filter-chip>
    <m3e-filter-chip value="accessibility">Accessibility</m3e-filter-chip>
  </m3e-filter-chip-set></form>`;
});
When(
  "the application sets filter chip {string} attribute {string}",
  async ({ chips }, name: string, attribute: string) => chips.setAttribute(chips.filterChip(name), attribute),
);
