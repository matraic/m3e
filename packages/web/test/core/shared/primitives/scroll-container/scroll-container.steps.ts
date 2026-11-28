import type { M3eScrollContainerElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { ScrollContainerHarness } from "./scroll-container.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ scrollContainer: ScrollContainerHarness }>({
  scrollContainer: async ({ page, render }, use) => use(new ScrollContainerHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a scroll container with tall content", ({ scrollContainer }) => {
  scrollContainer.short = false;
});
When("the scroll container renders", async ({ scrollContainer }) => scrollContainer.show());
Then("the scroll container defaults to above-below dividers", async ({ scrollContainer }) =>
  expect
    .poll(() => scrollContainer.element.evaluate((element: M3eScrollContainerElement) => element.dividers))
    .toBe("above-below"),
);
Then("only the below divider is visible", async ({ scrollContainer }) => {
  await expect.poll(() => scrollContainer.state("below")).toBe(true);
  expect(await scrollContainer.state("above")).toBe(false);
});
When("the scroll container is scrolled to the middle", async ({ scrollContainer }) =>
  scrollContainer.element.evaluate((element) => element.scrollTo({ top: 150 })),
);
Then("both scroll dividers are visible", async ({ scrollContainer }) => {
  await expect.poll(() => scrollContainer.state("above")).toBe(true);
  await expect.poll(() => scrollContainer.state("below")).toBe(true);
});
When("the scroll container is scrolled to the end", async ({ scrollContainer }) =>
  scrollContainer.element.evaluate((element) => element.scrollTo({ top: element.scrollHeight })),
);
Then("only the above divider is visible", async ({ scrollContainer }) => {
  await expect.poll(() => scrollContainer.state("above")).toBe(true);
  await expect.poll(() => scrollContainer.state("below")).toBe(false);
});

Given("a scroll container with tall content and attributes {string}", ({ scrollContainer }, attributes: string) => {
  scrollContainer.short = false;
  scrollContainer.attributes = attributes;
});
Then("the scroll container reflects thin", async ({ scrollContainer }) =>
  expect(scrollContainer.element).toHaveAttribute("thin", ""),
);

Given("a scroll container with short content", ({ scrollContainer }) => {
  scrollContainer.short = true;
});
Then("neither scroll divider is visible", async ({ scrollContainer }) => {
  await expect.poll(() => scrollContainer.state("above")).toBe(false);
  await expect.poll(() => scrollContainer.state("below")).toBe(false);
});
Then("above scroll dividers are visible", async ({ scrollContainer }) => {
  await expect.poll(() => scrollContainer.state("above")).toBe(true);
  expect(await scrollContainer.state("below")).toBe(false);
});
Then("below scroll dividers are visible", async ({ scrollContainer }) => {
  await expect.poll(() => scrollContainer.state("below")).toBe(true);
  expect(await scrollContainer.state("above")).toBe(false);
});
Then("neither scroll dividers are visible", async ({ page, scrollContainer }) => {
  await page.waitForTimeout(150);
  await expect.poll(() => scrollContainer.state("above")).toBe(false);
  await expect.poll(() => scrollContainer.state("below")).toBe(false);
});
When("the application adds tall content to the scroll container", async ({ scrollContainer }) =>
  scrollContainer.element.evaluate((element) => {
    const content = document.createElement("div");
    content.style.height = "500px";
    element.appendChild(content);
  }),
);
