import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { PaginatorHarness } from "./paginator.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ paginator: PaginatorHarness }>({
  paginator: async ({ page, render }, use) => use(new PaginatorHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given(
  "a paginator of {int} items in pages of {word} labelled {string}",
  ({ paginator }, length: number, size: string, label: string) => paginator.configure(length, size, 0, label),
);
When("the paginator renders", async ({ paginator }) => paginator.render());
Then("the paginator is exposed as the {string} group", async ({ page }, name: string) =>
  expect(page.getByRole("group", { name })).toBeVisible(),
);
Then("the paginator shows the range {string}", async ({ page }, range: string) =>
  expect(page.getByText(range)).toBeVisible(),
);
Then("the paginator shows the label {string}", async ({ page }, label: string) =>
  expect(page.getByText(label)).toBeVisible(),
);

Given(
  "a paginator of {int} items in pages of {word} on page index {int}",
  ({ paginator }, length: number, size: string, index: number) => paginator.configure(length, size, index),
);

Given("a paginator of {int} items in pages of {word}", ({ paginator }, length: number, size: string) =>
  paginator.configure(length, size),
);
When("the application empties the paginator", async ({ paginator }) => paginator.empty());

When("the application formats the range as the page number and page count", async ({ paginator }) =>
  paginator.formatRangeAsPages(),
);
When("the application moves the paginator to page index {int}", async ({ paginator }, index: number) =>
  paginator.setPageIndex(index),
);

Then(
  "the paginator reports {int} pages with previous {word} and next {word}",
  async ({ paginator }, count: number, previous: string, next: string) =>
    expect(await paginator.availability()).toEqual({ count, previous, next }),
);

When("the paginator starts recording page events", async ({ paginator }) => paginator.recordPageEvents());
Then("the {string} button is disabled", async ({ paginator }, name: string) =>
  expect(paginator.button(name)).toBeDisabled(),
);
When("the user activates the {string} button", async ({ paginator }, name: string) => paginator.button(name).click());
Then("the {string} button is enabled", async ({ paginator }, name: string) =>
  expect(paginator.button(name)).toBeEnabled(),
);
Then("the paginator has recorded {int} page event(s)", async ({ paginator }, count: number) =>
  expect(await paginator.pageEvents()).toHaveLength(count),
);
Then(
  "the last page event moved from page index {int} to {int} with page size {int} of {int} items",
  async ({ paginator }, previousPageIndex: number, pageIndex: number, pageSize: number, length: number) =>
    expect((await paginator.pageEvents()).at(-1)).toEqual({ previousPageIndex, pageIndex, pageSize, length }),
);

Then("the paginator has no {string} button", async ({ paginator }, name: string) =>
  expect(paginator.button(name)).toHaveCount(0),
);

Given("the paginator shows first and last buttons", ({ paginator }) =>
  paginator.attributes.set("show-first-last-buttons", ""),
);

When("the user presses {string} on the {string} button", async ({ paginator, page }, key: string, name: string) => {
  await paginator.button(name).focus();
  await page.keyboard.press(key);
});

When("the application attempts every navigation that is not possible", async ({ paginator }) =>
  paginator.attemptImpossibleNavigation(),
);

Given("the paginator has a custom next page icon", ({ paginator }) => {
  paginator.content = `<span slot="next-page-icon" id="custom-next">Next</span>`;
});
Then("the custom next page icon is visible", async ({ page }) => expect(page.locator("#custom-next")).toBeVisible());

Given("the paginator offers the page sizes {string}", ({ paginator }, sizes: string) =>
  paginator.attributes.set("page-sizes", sizes),
);
When("the user chooses the page size {string}", async ({ paginator }, name: string) => paginator.chooseSize(name));
Then("the paginator page size is {string}", async ({ paginator }, size: string) =>
  expect(`${await paginator.pageSize()}`).toBe(size),
);
Then("the {string} button is hidden", async ({ paginator }, name: string) =>
  expect(paginator.button(name)).toBeHidden(),
);

When("the user opens the page size selector", async ({ paginator }) => paginator.sizeSelector.click());
Then("the page size choices are {string}", async ({ page }, sizes: string) =>
  expect(page.getByRole("option")).toHaveText(sizes.split(", ")),
);
When("the application sets the paginator page size to {int}", async ({ paginator }, size: number) =>
  paginator.setPageSize(size),
);
Then("the page size selector is disabled", async ({ paginator }) =>
  expect(paginator.sizeSelector).toHaveAttribute("aria-disabled", "true"),
);
Given("the user prefers reduced motion in the paginator", async ({ page }) =>
  page.emulateMedia({ reducedMotion: "reduce" }),
);

Given("the paginator hides its page size selector", ({ paginator }) => paginator.attributes.set("hide-page-size", ""));
Then("the paginator hides the label {string}", async ({ page }, label: string) =>
  expect(page.getByText(label)).toBeHidden(),
);
When("the application sets the paginator page size to {string}", async ({ paginator }, size: string) =>
  paginator.setPageSize(size === "all" ? "all" : Number(size)),
);
Then("the paginator hides the range {string}", async ({ page }, range: string) =>
  expect(page.getByText(range)).toBeHidden(),
);

Given(
  "the paginator uses the labels {string}, {string}, {string}, {string}, and {string}",
  ({ paginator }, items: string, first: string, previous: string, next: string, last: string) => {
    paginator.attributes.set("items-per-page-label", items);
    paginator.attributes.set("first-page-label", first);
    paginator.attributes.set("previous-page-label", previous);
    paginator.attributes.set("next-page-label", next);
    paginator.attributes.set("last-page-label", last);
  },
);
Then("the paginator has a {string} button", async ({ paginator }, name: string) =>
  expect(paginator.button(name)).toHaveCount(1),
);

Given("the paginator is disabled", ({ paginator }) => paginator.attributes.set("disabled", ""));

Given("the paginator is rendered {word}", ({ paginator }, direction: string) => {
  paginator.direction = direction === "right-to-left" ? "rtl" : "ltr";
});
Then("the {string} button icon is mirrored", async ({ paginator }, name: string) =>
  expect(await paginator.iconTransform(name)).not.toBe("none"),
);
Then("the {string} button icon is not mirrored", async ({ paginator }, name: string) =>
  expect(await paginator.iconTransform(name)).toBe("none"),
);
