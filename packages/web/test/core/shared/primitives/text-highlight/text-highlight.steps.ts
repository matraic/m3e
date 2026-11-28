import type { M3eTextHighlightElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { TextHighlightHarness } from "./text-highlight.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ highlight: TextHighlightHarness }>({
  highlight: async ({ page, render }, use) => use(new TextHighlightHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);
const expectedRanges = (ranges: string) => (ranges ? ranges.split(", ") : []);

Given("a text highlighter containing {string}", ({ highlight }, text: string) => {
  highlight.markup = `<m3e-text-highlight>${text}</m3e-text-highlight>`;
});
When("the text highlighter renders", async ({ highlight }) => highlight.show());
Then("text highlighting is supported", async ({ highlight }) =>
  expect(await highlight.element.evaluate((element: M3eTextHighlightElement) => element.isSupported)).toBe(true),
);
Then("the text highlighter ranges are {string}", async ({ highlight }, ranges: string) =>
  expect.poll(() => highlight.ranges()).toEqual(expectedRanges(ranges)),
);

Given("a text highlighter containing {string} with {string}", ({ highlight }, text: string, attributes: string) => {
  highlight.markup = `<m3e-text-highlight ${attributes}>${text}</m3e-text-highlight>`;
});
Given("text highlighters testing starts-with matches", ({ highlight }) => {
  highlight.markup = `<m3e-text-highlight id="a" term="app" mode="starts-with">Apple app</m3e-text-highlight>
    <m3e-text-highlight id="b" term="ple" mode="starts-with">Apple</m3e-text-highlight>`;
});
Then("the first text highlighter ranges are {string}", async ({ highlight }, ranges: string) =>
  expect.poll(() => highlight.ranges("#a")).toEqual(expectedRanges(ranges)),
);
Then("the second text highlighter ranges are {string}", async ({ highlight }, ranges: string) =>
  expect.poll(() => highlight.ranges("#b")).toEqual(expectedRanges(ranges)),
);

Given("text highlighters testing ends-with matches", ({ highlight }) => {
  highlight.markup = `<m3e-text-highlight id="a" term="ple" mode="ends-with">Apple</m3e-text-highlight>
    <m3e-text-highlight id="b" term="app" mode="ends-with">Apple</m3e-text-highlight>`;
});
Given("a text highlighter containing nested text", ({ highlight }) => {
  highlight.markup = '<m3e-text-highlight term="an">Ba<b>nan</b>a</m3e-text-highlight>';
});
When("the application disables the text highlighter", async ({ highlight }) =>
  highlight.element.evaluate(async (element: M3eTextHighlightElement) => {
    element.disabled = true;
    await element.updateComplete;
  }),
);
Then("the text highlighter reflects disabled", async ({ highlight }) =>
  expect(highlight.element).toHaveAttribute("disabled", ""),
);
When("the application sets the highlight term to {string}", async ({ highlight }, term: string) =>
  highlight.element.evaluate(async (element: M3eTextHighlightElement, value) => {
    element.term = value;
    await element.updateComplete;
  }, term),
);
Then("the browser has {int} CSS highlight(s)", async ({ page }, count: number) =>
  expect.poll(() => page.evaluate(() => CSS.highlights.size)).toBe(count),
);
When(
  "the application observes the next highlight event and sets the term to {string}",
  async ({ highlight }, term: string) => {
    highlight.eventRanges = await highlight.element.evaluate(
      (element: M3eTextHighlightElement, value) =>
        new Promise<string[]>((resolve) => {
          element.addEventListener(
            "highlight",
            (event) => resolve((event as CustomEvent<Range[]>).detail.map((range) => range.toString())),
            { once: true },
          );
          element.term = value;
        }),
      term,
    );
  },
);
Then("the highlight event ranges are {string}", ({ highlight }, ranges: string) =>
  expect(highlight.eventRanges).toEqual(expectedRanges(ranges)),
);

Given("a text highlighter inside a parent", ({ highlight }) => {
  highlight.markup = '<div id="host"><m3e-text-highlight>Apple</m3e-text-highlight></div>';
});
When("the application observes highlight events on the parent", async ({ page }) =>
  page.locator("#host").evaluate((element) => {
    element.dataset.count = "0";
    element.addEventListener("highlight", () => {
      element.dataset.count = String(Number(element.dataset.count) + 1);
    });
  }),
);
Then("the parent has received no highlight events", async ({ page }) =>
  expect(page.locator("#host")).toHaveAttribute("data-count", "0"),
);
