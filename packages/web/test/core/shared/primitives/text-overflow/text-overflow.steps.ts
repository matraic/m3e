import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { TextOverflowHarness } from "./text-overflow.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ textOverflow: TextOverflowHarness }>({
  textOverflow: async ({ page, render }, use) => use(new TextOverflowHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a text overflow element with long text in a 100 pixel container", ({ textOverflow }) => {
  textOverflow.markup = `<div style="display: flex; width: 100px">
    <m3e-text-overflow>A very long piece of text that cannot possibly fit in the container</m3e-text-overflow>
  </div>`;
});
When("the text overflow element renders", async ({ textOverflow }) => textOverflow.show());
Then("the text overflow uses a single-line ellipsis", async ({ textOverflow }) => {
  const style = await textOverflow.base.evaluate((element) => {
    const computed = getComputedStyle(element);
    return { textOverflow: computed.textOverflow, whiteSpace: computed.whiteSpace, overflow: computed.overflowX };
  });
  expect(style).toEqual({ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" });
});
Then("the text overflow fits its container and its content overflows", async ({ textOverflow }) => {
  expect(await textOverflow.element.evaluate((element) => element.getBoundingClientRect().width)).toBeLessThanOrEqual(
    100,
  );
  expect(await textOverflow.base.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
});

Given("a text overflow element with short text", ({ textOverflow }) => {
  textOverflow.markup = '<div style="display: flex; width: 300px"><m3e-text-overflow>Short</m3e-text-overflow></div>';
});
Then("the text overflow content does not overflow", async ({ textOverflow }) =>
  expect(await textOverflow.base.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(false),
);

Given("a text overflow element containing {string}", ({ textOverflow }, text: string) => {
  textOverflow.markup = `<m3e-text-overflow>${text}</m3e-text-overflow>`;
});
Then("the text overflow content {string} is visible", async ({ page }, text: string) =>
  expect(page.getByText(text)).toBeVisible(),
);

Given("a hidden text overflow element containing {string}", ({ textOverflow }, text: string) => {
  textOverflow.markup = `<m3e-text-overflow hidden>${text}</m3e-text-overflow>`;
});
Then("the text overflow element is hidden", async ({ textOverflow }) => expect(textOverflow.element).toBeHidden());
