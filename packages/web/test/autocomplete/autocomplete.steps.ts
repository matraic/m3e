import { mergeTests, type JSHandle } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { AutocompleteHarness } from "./autocomplete.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  autocomplete: AutocompleteHarness;
  queries: { terms?: JSHandle<string[]> };
}>({
  autocomplete: async ({ page, render }, use) => {
    const autocomplete = new AutocompleteHarness(page, render);
    await use(autocomplete);
    await autocomplete.dispose();
  },
  queries: async ({ page }, use) => {
    const queries: { terms?: JSHandle<string[]> } = {};
    await use(queries);
    if (!page.isClosed()) await queries.terms?.dispose();
  },
});
const { Given, When, Then } = createBdd(test);

Given("an autocomplete with fruit suggestions", async ({ autocomplete }) => autocomplete.show());
When("the user focuses the input", async ({ autocomplete }) => autocomplete.input.focus());
Then("the input is exposed as an expanded combobox linked to a listbox", async ({ autocomplete }) => {
  await expect(autocomplete.input).toHaveAttribute("aria-autocomplete", "list");
  await expect(autocomplete.input).toHaveAttribute("aria-expanded", "true");
  const panelId = await autocomplete.input.getAttribute("aria-controls");
  expect(panelId).toBeTruthy();
  await expect(autocomplete.panel).toHaveAttribute("id", panelId!);
  await expect(autocomplete.panel).toHaveRole("listbox");
});
Then("the visible suggestions are {string}", async ({ autocomplete }, labels: string) => {
  const suggestions = labels ? labels.split(", ") : [];
  await expect(autocomplete.suggestions).toHaveCount(suggestions.length);
  for (const label of suggestions) {
    await expect(autocomplete.suggestion(label)).toBeVisible();
  }
});

Given("an autocomplete with the fruit suggestions open", async ({ autocomplete }) => {
  await autocomplete.show();
  await autocomplete.input.focus();
  await expect(autocomplete.input).toHaveAttribute("aria-expanded", "true");
});
When("the user presses {string}", async ({ page }, key: string) => page.keyboard.press(key));

Then("{string} is the active suggestion", async ({ autocomplete }, label: string) => {
  await expect(autocomplete.suggestion(label)).toBeVisible();
  await expect.poll(() => autocomplete.activeSuggestion()).toBe(label);
});
Then(/^focus (?:stays on|returns to) the input$/, async ({ autocomplete }) => expect(autocomplete.input).toBeFocused());
When("the user presses {string} and then {string}", async ({ page }, first: string, second: string) => {
  await page.keyboard.press(first);
  await page.keyboard.press(second);
});
Then("the input shows {string}", async ({ autocomplete }, label: string) =>
  expect(autocomplete.input).toHaveValue(label),
);

Then(
  "the {string} option is selected with a component value of {string}",
  async ({ autocomplete }, option: string, value: string) => {
    await expect(autocomplete.originalOption(option)).toHaveAttribute("selected", "");
    await expect(autocomplete.component).toHaveJSProperty("value", value);
  },
);

Given("the user prefers reduced motion", async ({ page }) => page.emulateMedia({ reducedMotion: "reduce" }));

Then("the combobox is collapsed", async ({ autocomplete }) =>
  expect(autocomplete.input).toHaveAttribute("aria-expanded", "false"),
);
Then("the suggestion panel is removed", async ({ autocomplete }) => expect(autocomplete.panel).toHaveCount(0));

Then("the input no longer references an active suggestion", async ({ autocomplete }) => {
  await expect(autocomplete.input).not.toHaveAttribute("aria-activedescendant");
});

Given("an autocomplete that automatically activates its first suggestion", async ({ autocomplete }) =>
  autocomplete.show({ attributes: "auto-activate" }),
);
Then(/^focus (?:moves to|stays on) the next control$/, async ({ autocomplete }) =>
  expect(autocomplete.nextControl).toBeFocused(),
);
When("focus leaves and immediately returns to the input", async ({ autocomplete }) => autocomplete.refocusInput());

Given("an autocomplete with {string} disabled", async ({ autocomplete }, label: string) =>
  autocomplete.show({ disabled: label }),
);

Then("the {string} suggestion is exposed as disabled", async ({ autocomplete }, label: string) =>
  expect(autocomplete.suggestion(label)).toHaveAttribute("aria-disabled", "true"),
);

Given("an autocomplete linked to a read-only input", async ({ autocomplete }) => autocomplete.show({ readOnly: true }));

Then("no suggestion panel is visible", async ({ autocomplete }) => expect(autocomplete.panel).toBeHidden());
When("the application removes the autocomplete", async ({ autocomplete }) => autocomplete.remove());
Then("the remaining input is a textbox with no suggestion references", async ({ autocomplete }) => {
  await expect(autocomplete.detachedInput).toBeVisible();
  await expect(autocomplete.detachedInput).not.toHaveAttribute("aria-controls");
  await expect(autocomplete.detachedInput).not.toHaveAttribute("aria-activedescendant");
});
When("the application moves autocomplete to a new DOM parent", async ({ autocomplete }) =>
  autocomplete.moveToNewParent(),
);

Given("an autocomplete with the panel classes {string}", async ({ autocomplete }, classes: string) =>
  autocomplete.show({ attributes: `panel-class="${classes}"` }),
);
Then("the suggestion panel has both custom classes", async ({ autocomplete }) => {
  await expect(autocomplete.panel).toContainClass("fancy wide");
});

When("the user types {string}", async ({ autocomplete }, term: string) => autocomplete.input.fill(term));

Given("an autocomplete with case-sensitive filtering", async ({ autocomplete }) =>
  autocomplete.show({ attributes: "case-sensitive" }),
);

Then("no suggestions match", async ({ autocomplete }) => expect(autocomplete.suggestions).toHaveCount(0));

Given("an autocomplete with the {string} filter", async ({ autocomplete }, filter: string) =>
  autocomplete.show({ attributes: `filter="${filter}"` }),
);

Given("an autocomplete with a custom case-insensitive prefix filter", async ({ autocomplete }) => {
  await autocomplete.show();
  await autocomplete.setCustomPrefixFilter();
});

Given("an autocomplete with grouped fruit suggestions", async ({ autocomplete }) =>
  autocomplete.show({ grouped: true }),
);
Then("the {string} group contains the {string} suggestion", async ({ autocomplete }, group: string, label: string) =>
  expect(autocomplete.group(group).getByRole("option", { name: label, exact: true })).toBeVisible(),
);
Then("the {string} group is not exposed", async ({ autocomplete }, group: string) =>
  expect(autocomplete.group(group)).toHaveCount(0),
);

When("the user clears the input", async ({ autocomplete }) => autocomplete.input.clear());

Given("an autocomplete without suggestions that records queries", async ({ autocomplete, queries }) => {
  await autocomplete.show({ hasSuggestions: false });
  queries.terms = await autocomplete.recordQueries();
});
Then("a query is emitted with an empty term", async ({ queries }) => {
  await expect.poll(() => queries.terms!.jsonValue()).toEqual([""]);
});

Then("the latest query contains {string}", async ({ queries }, term: string) => {
  await expect.poll(async () => (await queries.terms!.jsonValue()).at(-1)).toBe(term);
});
When("the application clears the old suggestions and starts loading", async ({ autocomplete }) =>
  autocomplete.startLoading(),
);
Then("the suggestion panel displays {string}", async ({ autocomplete }, label: string) =>
  expect(autocomplete.panel.getByText(label, { exact: true })).toBeVisible(),
);
Then("the polite live region contains {string}", async ({ autocomplete }, message: string) =>
  expect(autocomplete.liveRegion).toHaveText(message),
);
When("the application receives {string}", async ({ autocomplete }, labels: string) =>
  autocomplete.receiveSuggestions(labels.split(", ")),
);

Then("the suggestion panel does not display {string}", async ({ autocomplete }, label: string) =>
  expect(autocomplete.panel.getByText(label, { exact: true })).toBeHidden(),
);
When("the application receives no suggestions", async ({ autocomplete }) => autocomplete.receiveSuggestions([]));

Given("an autocomplete that hides its empty-state message", async ({ autocomplete }) =>
  autocomplete.show({ attributes: "hide-no-data" }),
);

Then("the autocomplete has received {string}", async ({ autocomplete }, labels: string) =>
  expect.poll(() => autocomplete.receivedSuggestions()).toEqual(labels.split(", ")),
);

Given("an autocomplete with the fruit suggestions open and changes recorded", async ({ autocomplete }) => {
  await autocomplete.show({ orangeValue: "orange-id" });
  await autocomplete.recordChanges();
  await autocomplete.input.focus();
  await expect(autocomplete.input).toHaveAttribute("aria-expanded", "true");
});
When("the user clicks the {string} suggestion", async ({ autocomplete }, label: string) =>
  autocomplete.suggestion(label).click(),
);
Then("the autocomplete emits {int} change event(s)", async ({ autocomplete }, count: number) =>
  expect.poll(() => autocomplete.changeCount()).toBe(count),
);

Given("an autocomplete with {string} disabled and changes recorded", async ({ autocomplete }, label: string) => {
  await autocomplete.show({ disabled: label });
  await autocomplete.recordChanges();
});
When("the user attempts to click the disabled {string} suggestion", async ({ autocomplete }, label: string) =>
  autocomplete.clickDisabledSuggestion(label),
);

Then("the input is empty", async ({ autocomplete }) => expect(autocomplete.input).toHaveValue(""));
Then("no option is selected", async ({ autocomplete }) => {
  await expect(autocomplete.component).toHaveJSProperty("value", null);
  await expect(autocomplete.component.locator("m3e-option[selected]")).toHaveCount(0);
});
Then("the combobox is expanded", async ({ autocomplete }) =>
  expect(autocomplete.input).toHaveAttribute("aria-expanded", "true"),
);

Then("the {string} suggestion is enabled", async ({ autocomplete }, label: string) =>
  expect(autocomplete.suggestion(label)).toBeEnabled(),
);
When("the application disables the {string} option", async ({ autocomplete }, label: string) =>
  autocomplete.disableOption(label),
);
When(/^the application calls clear\(\)$/, async ({ autocomplete }) => autocomplete.clear());
When("the user leaves the input", async ({ autocomplete }) => autocomplete.leaveInput());

When(/^the application calls clear\(true\)$/, async ({ autocomplete }) => autocomplete.clear(true));

Given("an autocomplete with custom loading and empty-state content", async ({ autocomplete }) =>
  autocomplete.show({ customStateContent: true }),
);

Given("an autocomplete with the default empty-state label", async ({ autocomplete }) => autocomplete.show());

Given("an autocomplete with an empty-state label of {string}", async ({ autocomplete }, label: string) =>
  autocomplete.show({ attributes: `no-data-label="${label}"` }),
);

Given("an autocomplete that is loading with the default loading label", async ({ autocomplete }) =>
  autocomplete.show({ attributes: "loading" }),
);

Given("an autocomplete that is loading with a loading label of {string}", async ({ autocomplete }, label: string) =>
  autocomplete.show({ attributes: `loading loading-label="${label}"` }),
);

Given("an autocomplete that is loading with its loading message hidden", async ({ autocomplete }) =>
  autocomplete.show({ attributes: "loading hide-loading" }),
);
When("the application hides the menu and starts loading", async ({ autocomplete }) =>
  autocomplete.hideMenuWhileLoading(),
);

Given("an autocomplete that requires an option to be selected", async ({ autocomplete }) =>
  autocomplete.show({ attributes: "required" }),
);

Given("a required autocomplete with {string} already selected", async ({ autocomplete }, selected: string) => {
  await autocomplete.show({ attributes: "required" });
  await autocomplete.input.fill(selected);
  await expect(autocomplete.suggestion(selected)).toBeVisible();
  await autocomplete.input.press("ArrowDown");
  await autocomplete.input.press("Enter");
  await expect(autocomplete.input).toHaveValue(selected);
  await expect(autocomplete.originalOption(selected)).toHaveAttribute("selected", "");
  await expect(autocomplete.input).toHaveAttribute("aria-expanded", "false");
});
