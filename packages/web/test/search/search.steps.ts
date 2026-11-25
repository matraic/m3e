import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { SearchHarness } from "./search.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ search: SearchHarness }>({
  search: async ({ page, render }, use) => use(new SearchHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a search bar", ({ search }) => search.prepareBar(""));
Given("a clearable search bar labelled {string}", ({ search }, label: string) =>
  search.prepareBar(`clearable clear-label="${label}"`),
);
When("the search renders", async ({ search }) => search.render());
Then("the search input is exposed as a searchbox named {string}", async ({ search }, name: string) =>
  expect(search.page.getByRole("searchbox", { name })).toBeVisible(),
);
Then("the search input has input mode {string}", async ({ search }, mode: string) =>
  expect(search.input).toHaveAttribute("inputmode", mode),
);

When("the user clicks the empty space of the search bar", async ({ search }) =>
  search.host.click({ position: { x: 150, y: 20 } }),
);
Then("the search input is focused", async ({ search }) => expect(search.input).toBeFocused());

When("the application replaces the search input", async ({ search }) => search.replaceInput());
When("the user types {string} in the search input", async ({ search }, text: string) => search.input.fill(text));
Then("the {string} search button is visible", async ({ search }, name: string) =>
  expect(search.button(name)).toBeVisible(),
);

Then("the {string} search button is hidden", async ({ search }, name: string) =>
  expect(search.button(name)).toBeHidden(),
);
When("the user empties the search input", async ({ search }) => search.input.fill(""));

Then("the search has no buttons", async ({ search }) => expect(search.page.getByRole("button")).toHaveCount(0));

When("the search records the events {string}", async ({ search }, types: string) =>
  search.recordEvents(types.split(",")),
);
When("the user activates the {string} search button", async ({ search }, name: string) => search.button(name).click());
Then("the search input is empty", async ({ search }) => expect(search.input).toHaveValue(""));
Then("the search events are {string}", async ({ search }, events: string) =>
  expect.poll(() => search.events()).toBe(events),
);

When("the application clears the search", async ({ search }) => search.clear());

Given("a search view", ({ search }) => search.prepareView(""));
Then("the search input has popup {string}", async ({ search }, popup: string) =>
  expect(search.input).toHaveAttribute("aria-haspopup", popup),
);

Then("the search view is closed", async ({ search }) => expect(search.host).not.toHaveAttribute("open"));
Then("the search results are hidden", async ({ search }) => expect(search.results).toBeHidden());
Then("the search has no dialog", async ({ search }) => expect(search.dialog).toHaveCount(0));

Given("a search view that is open", ({ search }) => search.prepareView("open"));
Then("the search view has a dialog", async ({ search }) => expect(search.dialog).toBeVisible());
Then("the search results are visible", async ({ search }) => expect(search.results).toBeVisible());
Then("the content outside the search view is inert", async ({ search }) =>
  expect.poll(() => search.isOutsideInert()).toBe(true),
);

Then("the search text {string} is visible", async ({ search }, text: string) =>
  expect(search.page.getByText(text)).toBeVisible(),
);
Then("the search text {string} is hidden", async ({ search }, text: string) =>
  expect(search.page.getByText(text)).toBeHidden(),
);
When("the user focuses the search input", async ({ search }) => search.input.focus());

Given("a search view that hides its search icon", ({ search }) => search.prepareView("hide-search-icon"));
Then("the search icon is hidden", async ({ search }) => expect(search.page.locator(".search-icon")).toHaveCount(0));

Then("the search view is open", async ({ search }) => expect(search.host).toHaveAttribute("open", ""));

When("the application dispatches an input event on the search input", async ({ search }) => search.dispatchInput());

When("the user presses {string} in the search view", async ({ search }, key: string) => search.press(key));
When("the user clicks the search input", async ({ search }) => search.input.click());

When("the user focuses the {string} search button", async ({ search }, name: string) =>
  search.button(name).first().focus(),
);

When("the user activates the leading search button", async ({ search }) => search.leadingButton.click());

Then("the content outside the search view is not inert", async ({ search }) =>
  expect.poll(() => search.isOutsideInert()).toBe(false),
);
Then("the page scrolling is not locked", async ({ search }) => expect.poll(() => search.readOverflow()).toBe(""));

When("the application sets the search mode to {string}", async ({ search }, mode: string) => search.setMode(mode));

When("the search view finishes opening", async ({ search }) => expect(search.results).toBeVisible());

When("the application cancels the search toggle to {string}", async ({ search }, state: string) =>
  search.cancelToggleTo(state),
);

When("the user types {string} one key at a time in the search input", async ({ search }, text: string) =>
  search.input.pressSequentially(text),
);

Given("a search view whose input starts with {string}", ({ search }, term: string) => {
  search.prepareView("");
  search.term = term;
});

Then("the trailing search button is named {string}", async ({ search }, name: string) =>
  expect(search.trailingButton).toHaveAttribute("aria-label", name),
);
When("the user activates the trailing search button", async ({ search }) => search.trailingButton.click());

Given(
  "a search view with the clear label {string} and the close label {string}",
  ({ search }, clear: string, close: string) => search.prepareView(`clear-label="${clear}" close-label="${close}"`),
);

When("focus leaves the search view", async ({ search }) => search.blurFocus());

Given(/^the page reads (left to right|right to left)$/, ({ search }, direction: string) => {
  search.direction = direction === "left to right" ? "ltr" : "rtl";
});
Then("the search results panel is aligned with the bar", async ({ search }) => {
  await expect.poll(async () => (await search.readPanelAlignment()).start).toBeLessThanOrEqual(2);
  await expect.poll(async () => (await search.readPanelAlignment()).end).toBeLessThanOrEqual(2);
});

Then("the page scrolling is locked", async ({ search }) => expect.poll(() => search.readOverflow()).toBe("hidden"));

Given("a fullscreen search view", ({ search }) => search.prepareView('mode="fullscreen"'));
Given(/^(normal|reduced) motion for the search$/, async ({ search }, motion: string) =>
  search.page.emulateMedia({ reducedMotion: motion === "reduced" ? "reduce" : "no-preference" }),
);
Then("the search results panel fills the viewport", async ({ search }) => {
  await expect.poll(async () => Math.abs((await search.readPanelSize()).width)).toBeLessThanOrEqual(2);
  await expect.poll(async () => Math.abs((await search.readPanelSize()).height)).toBeLessThanOrEqual(2);
});

Given("a fullscreen search view that is open", ({ search }) => search.prepareView('mode="fullscreen" open'));

Given("a search view with mode {string}", ({ search }, mode: string) => search.prepareView(`mode="${mode}"`));
Then("the search view reports the current mode {string}", async ({ search }, mode: string) =>
  expect.poll(() => search.currentMode()).toBe(mode),
);

Given("a viewport {int} pixels wide", async ({ search }, width: number) =>
  search.page.setViewportSize({ width, height: 720 }),
);

Given("a search view with mode {string} that is open", ({ search }, mode: string) =>
  search.prepareView(`mode="${mode}" open`),
);
When("the search viewport becomes {int} pixels wide", async ({ search }, width: number) =>
  search.page.setViewportSize({ width, height: 720 }),
);

When("the application moves the search view", async ({ search }) => search.moveAway());
