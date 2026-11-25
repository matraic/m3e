import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import type { M3eSkeletonElement } from "@m3e/web/skeleton";

import { expect, test as componentTest } from "../fixtures";
import { SkeletonHarness } from "./skeleton.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ skeleton: SkeletonHarness }>({
  skeleton: async ({ page, render }, use) => use(new SkeletonHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a skeleton", ({ skeleton }) => {
  skeleton.html = '<m3e-skeleton><button style="width: 120px; height: 40px">Action</button></m3e-skeleton>';
});
Given("a loaded skeleton", ({ skeleton }) => {
  skeleton.html = '<m3e-skeleton loaded><button style="width: 120px; height: 40px">Action</button></m3e-skeleton>';
});
Given("a hidden skeleton", ({ skeleton }) => {
  skeleton.html = '<m3e-skeleton hidden><button style="width: 120px; height: 40px">Action</button></m3e-skeleton>';
});
Given("a skeleton with animation {string}", ({ skeleton }, animation: string) => {
  skeleton.html = `<m3e-skeleton animation="${animation}"><button style="width: 120px; height: 40px">Action</button></m3e-skeleton>`;
});
Given("a skeleton with shape {string}", ({ skeleton }, shape: string) => {
  skeleton.html = `<m3e-skeleton shape="${shape}"><div style="width: 100px; height: 20px">Item</div></m3e-skeleton>`;
});
Given("a skeleton with invalid animation and shape", ({ skeleton }) => {
  skeleton.html =
    '<m3e-skeleton animation="bogus" shape="bogus"><button style="width: 120px; height: 40px">Action</button></m3e-skeleton>';
});
Given("a skeleton with two slotted elements", ({ skeleton }) => {
  skeleton.html =
    '<m3e-skeleton shape="rounded"><div style="width: 100px; height: 20px"></div><div style="width: 100px; height: 20px"></div></m3e-skeleton>';
});
Given("a skeleton with a circular radius token", ({ skeleton }) => {
  skeleton.html =
    '<m3e-skeleton shape="circular" style="--m3e-skeleton-circular-shape: 7px"><div style="width: 100px; height: 20px"></div></m3e-skeleton>';
});
Given("a skeleton with mixed auto corner content", ({ skeleton }) => {
  skeleton.html =
    '<m3e-skeleton><div style="width: 100px; height: 20px; border-radius: 9px; corner-shape: bevel round"></div></m3e-skeleton>';
});
Given("a skeleton with RTL avatar content", ({ skeleton }) => {
  skeleton.html =
    '<m3e-skeleton dir="rtl" animation="none" style="--m3e-skeleton-shape-family: round"><m3e-avatar style="--m3e-avatar-shape: 9px; --m3e-avatar-shape-family: bevel; --m3e-avatar-shape-family-start-end: round">AB</m3e-avatar></m3e-skeleton>';
});
Given("a skeleton with explicit rounded shape and zero-radius cut content", ({ skeleton }) => {
  skeleton.html =
    '<m3e-skeleton shape="rounded"><div style="width: 100px; height: 20px; corner-shape: bevel"></div></m3e-skeleton>';
});
Given("the skeleton user prefers reduced motion", ({ skeleton }) => {
  skeleton.reducedMotion = "reduce";
});
Given("the skeleton user has forced colors enabled", ({ skeleton }) => {
  skeleton.forcedColors = "active";
});

When("the skeleton renders", async ({ skeleton }) => skeleton.render());
Then("the skeleton content is hidden", async ({ skeleton }) => expect(skeleton.button).toBeHidden());
Then("the skeleton content is visible", async ({ skeleton }) => expect(skeleton.button).toBeVisible());

When("the application loads the skeleton", async ({ skeleton }) => skeleton.setAttribute("loaded"));
When("the application unloads the skeleton", async ({ skeleton }) => skeleton.removeAttribute("loaded"));
Then("the skeleton is hidden", async ({ skeleton }) => expect(skeleton.skeleton).toBeHidden());

When("the user clicks hidden skeleton content", async ({ skeleton }) => {
  await skeleton.recordClick();
  await skeleton.button.click({ force: true });
});
Then("hidden skeleton content receives no click", async ({ skeleton }) => expect(await skeleton.clickCount()).toBe(0));

When("the application loads and records a click", async ({ skeleton }) => {
  await skeleton.setAttribute("loaded");
  await skeleton.recordClick();
});
When("the user clicks loaded skeleton content", async ({ skeleton }) => skeleton.button.click());
Then("loaded skeleton content receives one click", async ({ skeleton }) => expect(await skeleton.clickCount()).toBe(1));

Then("the skeleton defaults are {string} and {string}", async ({ skeleton }, animation: string, shape: string) =>
  expect
    .poll(() =>
      skeleton.skeleton.evaluate((element) => {
        const target = element as M3eSkeletonElement;
        return { animation: target.animation, shape: target.shape };
      }),
    )
    .toEqual({ animation, shape }),
);
Then(
  "the skeleton attributes fall back to {string} and {string}",
  async ({ skeleton }, animation: string, shape: string) => {
    await expect(skeleton.skeleton).toHaveAttribute("animation", animation);
    await expect(skeleton.skeleton).toHaveAttribute("shape", shape);
  },
);

Then("the skeleton animation is active", async ({ skeleton }) =>
  expect.poll(() => skeleton.animationCount()).toBeGreaterThan(0),
);
Then("the skeleton animation is stopped", async ({ skeleton }) => expect.poll(() => skeleton.animationCount()).toBe(0));
Then("the skeleton animation is paused", async ({ skeleton }) =>
  expect.poll(() => skeleton.animationState()).toEqual(["paused"]),
);
Then("the skeleton animation is running", async ({ skeleton }) =>
  expect.poll(async () => (await skeleton.animationState()).every((state) => state === "running")).toBe(true),
);
When("the application changes the skeleton animation to {string}", async ({ skeleton }, animation: string) =>
  skeleton.skeleton.evaluate((element, animation) => element.setAttribute("animation", animation), animation),
);
When(
  "the application changes the skeleton motion preference to {string}",
  async ({ skeleton }, motion: "reduce" | "no-preference") => skeleton.setMotionPreference(motion),
);
When("the application changes forced colors to {string}", async ({ skeleton }, colors: "active" | "none") =>
  skeleton.setForcedColors(colors),
);

Then("the skeleton has {int} placeholders", async ({ skeleton }, count: number) =>
  expect.poll(() => skeleton.shapeCount()).toBe(count),
);
When("the application adds a slotted element", async ({ skeleton }) => skeleton.addSlottedElement());
When("the application removes the last slotted element", async ({ skeleton }) => skeleton.removeLastSlottedElement());

Then("the first placeholder has circular radius {string}", async ({ skeleton }, radius: string) =>
  expect(skeleton.shapes.first()).toHaveCSS("border-radius", radius),
);
Then("the first placeholder has border radius {string}", async ({ skeleton }, radius: string) =>
  expect(skeleton.shapes.first()).toHaveCSS("border-radius", radius),
);
Then("the first placeholder has corner shape {string}", async ({ skeleton }, shape: string) =>
  expect(skeleton.shapes.first()).toHaveCSS("corner-shape", shape),
);
Then("the first placeholder has top-left corner shape {string}", async ({ skeleton }, shape: string) =>
  expect(skeleton.shapes.first()).toHaveCSS("corner-top-left-shape", shape),
);
Then("the first placeholder has top-right corner shape {string}", async ({ skeleton }, shape: string) =>
  expect(skeleton.shapes.first()).toHaveCSS("corner-top-right-shape", shape),
);
Then("the first placeholder has bottom-left corner shape {string}", async ({ skeleton }, shape: string) =>
  expect(skeleton.shapes.first()).toHaveCSS("corner-bottom-left-shape", shape),
);
Then("the first placeholder has bottom-right corner shape {string}", async ({ skeleton }, shape: string) =>
  expect(skeleton.shapes.first()).toHaveCSS("corner-bottom-right-shape", shape),
);

When("the application changes the skeleton shape to {string}", async ({ skeleton }, shape: string) =>
  skeleton.skeleton.evaluate((element, shape) => element.setAttribute("shape", shape), shape),
);
When("the application changes the slotted element width to {int}", async ({ skeleton }, width: number) =>
  skeleton.resizeSlottedElement(width),
);
Then("the first placeholder matches the slotted element width", async ({ skeleton }) => {
  await expect
    .poll(async () => {
      const shape = await skeleton.shapeBox();
      const element = await skeleton.skeleton.locator("xpath=./*").first().boundingBox();
      return shape && element ? Math.abs(shape.width - element.width) : -1;
    })
    .toBeLessThan(1);
});

When("the application reconnects the skeleton", async ({ skeleton }) => skeleton.move());
Then("the skeleton placeholders remain synchronized", async ({ skeleton }) =>
  expect.poll(() => skeleton.shapeCount()).toBe(1),
);
