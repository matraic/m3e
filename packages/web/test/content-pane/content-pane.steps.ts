import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ContentPaneHarness } from "./content-pane.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ contentPane: ContentPaneHarness }>({
  contentPane: async ({ page, render }, use) => use(new ContentPaneHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a content pane with document content", ({ contentPane }) => {
  contentPane.markup = "<m3e-content-pane><p>Scrollable document content</p></m3e-content-pane>";
});
When("the content pane renders", async ({ contentPane }) => contentPane.show());
Then("the document content is visible", async ({ page }) =>
  expect(page.getByText("Scrollable document content", { exact: true })).toBeVisible(),
);
Then("the content pane allows vertical scrolling and clips horizontal overflow", async ({ contentPane }) =>
  expect.poll(() => contentPane.overflow()).toEqual(["auto", "hidden"]),
);

Given("a content pane with oversized content", ({ contentPane }) => {
  contentPane.markup = `<m3e-content-pane style="display: block; width: 300px; height: 120px">
    <div style="width: 800px; height: 600px">Oversized content</div>
  </m3e-content-pane>`;
});
When("the application scrolls the content pane down {int} pixels", async ({ contentPane }, pixels: number) =>
  contentPane.scrollTo(pixels),
);
Then("the content pane has scrolled down {int} pixels", async ({ contentPane }, pixels: number) =>
  expect.poll(async () => (await contentPane.scrollMetrics()).scrollTop).toBe(pixels),
);
Then("the content pane overflows vertically and horizontally", async ({ contentPane }) => {
  const metrics = await contentPane.scrollMetrics();
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight);
  expect(metrics.scrollWidth).toBeGreaterThan(metrics.clientWidth);
});

Given("a hidden content pane", ({ contentPane }) => {
  contentPane.markup = "<m3e-content-pane hidden>Hidden content</m3e-content-pane>";
});
Then("the content pane is hidden", async ({ contentPane }) => expect(contentPane.pane).toBeHidden());
When("the application hides the content pane", async ({ contentPane }) =>
  contentPane.pane.evaluate((pane: HTMLElement) => {
    pane.hidden = true;
  }),
);
Then("the document content is hidden", async ({ page }) =>
  expect(page.getByText("Scrollable document content", { exact: true })).toBeHidden(),
);
When("the application shows the content pane", async ({ contentPane }) =>
  contentPane.pane.evaluate((pane: HTMLElement) => {
    pane.hidden = false;
  }),
);
When("the application replaces the document content", async ({ contentPane }) => contentPane.replaceContent());
Then("the replacement content is visible", async ({ page }) =>
  expect(page.getByText("Replacement document content", { exact: true })).toBeVisible(),
);
Then("the original document content is absent", async ({ page }) =>
  expect(page.getByText("Scrollable document content", { exact: true })).toHaveCount(0),
);

Given("a named content pane containing a heading and a link", ({ contentPane }) => {
  contentPane.markup = `<m3e-content-pane role="region" aria-label="Documentation">
    <h2>Getting started</h2><a href="#details">Read details</a>
  </m3e-content-pane>`;
});
Then("a region named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("region", { name, exact: true })).toBeVisible(),
);
Then("the document heading is visible inside the region", async ({ page }) =>
  expect(
    page.getByRole("region", { name: "Documentation" }).getByRole("heading", { name: "Getting started" }),
  ).toBeVisible(),
);
Then("the document link is visible inside the region", async ({ page }) =>
  expect(page.getByRole("region", { name: "Documentation" }).getByRole("link", { name: "Read details" })).toBeVisible(),
);
When("the user tabs to the document link", async ({ page }) => page.keyboard.press("Tab"));
Then("the document link has focus", async ({ page }) =>
  expect(page.getByRole("link", { name: "Read details" })).toBeFocused(),
);

Given("a hidden named content pane containing a heading and a link", ({ contentPane }) => {
  contentPane.markup = `<m3e-content-pane hidden role="region" aria-label="Documentation">
    <h2>Getting started</h2><a href="#details">Read details</a>
  </m3e-content-pane>`;
});
Then("the documentation region is not exposed", async ({ page }) =>
  expect(page.getByRole("region", { name: "Documentation" })).toHaveCount(0),
);
Then("the document link is not exposed", async ({ page }) =>
  expect(page.getByRole("link", { name: "Read details" })).toHaveCount(0),
);

Given("a content pane with an offscreen button", ({ contentPane }) => {
  contentPane.markup = `<m3e-content-pane style="height: 120px; width: 300px">
    <div style="height: 600px"></div><button>Continue</button>
  </m3e-content-pane>`;
});
When("the user tabs to the offscreen button", async ({ page }) => page.keyboard.press("Tab"));
Then("the offscreen button has focus", async ({ page }) =>
  expect(page.getByRole("button", { name: "Continue" })).toBeFocused(),
);
Then("the content pane has scrolled to reveal the button", async ({ contentPane }) => {
  await expect.poll(async () => (await contentPane.scrollMetrics()).scrollTop).toBeGreaterThan(0);
  await expect.poll(() => contentPane.buttonIsWithinScroller()).toBe(true);
});

Given("a content pane with custom surface styles", ({ contentPane }) => {
  contentPane.markup = `<m3e-content-pane style="--m3e-content-pane-container-padding: 24px;
    --m3e-content-pane-container-color: rgb(1, 2, 3); --m3e-content-pane-container-shape: 12px;
    --m3e-scrollbar-thin-width: 4px"><p>Document</p></m3e-content-pane>`;
});
Then("the content pane uses the custom surface styles", async ({ contentPane }) => {
  await expect(contentPane.surface).toHaveCSS("background-color", "rgb(1, 2, 3)");
  await expect(contentPane.surface).toHaveCSS("border-radius", "12px");
  await expect(contentPane.scroller).toHaveCSS("padding-block-start", "24px");
  await expect(contentPane.scroller).toHaveCSS("padding-inline-start", "24px");
  await expect(contentPane.scroller).toHaveCSS("padding-inline-end", "20px");
});
Given("reduced motion is enabled for the content pane", async ({ page }) =>
  page.emulateMedia({ reducedMotion: "reduce" }),
);
Then("the content pane surface has no transition", async ({ contentPane }) =>
  expect(contentPane.surface).toHaveCSS("transition-property", "none"),
);
Given("forced colors are enabled for the content pane", async ({ page }) =>
  page.emulateMedia({ forcedColors: "active" }),
);
Then("the content pane surface has no corner radius or transition", async ({ contentPane }) => {
  await expect(contentPane.surface).toHaveCSS("border-radius", "0px");
  await expect(contentPane.surface).toHaveCSS("transition-property", "none");
});
When("the application moves the content pane to a new DOM parent", async ({ contentPane }) =>
  contentPane.moveToNewParent(),
);
Then("the content pane is in the new DOM parent", async ({ page }) =>
  expect(page.locator("#content-pane-new-parent > m3e-content-pane")).toBeVisible(),
);
Then("the oversized content is visible", async ({ page }) => expect(page.getByText("Oversized content")).toBeVisible());

Given("a content pane inheriting a 4 pixel scrollbar width", ({ contentPane }) => {
  contentPane.markup = `<div style="--m3e-scrollbar-thin-width: 4px">
    <m3e-content-pane><p>Scrollable document content</p></m3e-content-pane>
  </div>`;
});
Then("the content pane scrollbar compensation is {string}", async ({ contentPane }, width: string) =>
  expect(contentPane.surface).toHaveCSS("--_scrollbar-width", width),
);
When("the application moves the content pane to a parent with a 10 pixel scrollbar width", async ({ contentPane }) =>
  contentPane.moveToNewParent("10px"),
);
When("the application moves the content pane to a parent with a 6 pixel scrollbar width", async ({ contentPane }) =>
  contentPane.moveToNewParent("6px"),
);
