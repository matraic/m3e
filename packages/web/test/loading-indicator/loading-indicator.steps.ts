import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { LoadingIndicatorHarness } from "./loading-indicator.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  loadingIndicator: LoadingIndicatorHarness;
}>({
  loadingIndicator: async ({ page, render }, use) => use(new LoadingIndicatorHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a loading indicator with attributes {string}", ({ loadingIndicator }, attributes: string) =>
  loadingIndicator.prepare(attributes),
);
When("the loading indicator renders", async ({ loadingIndicator }) => loadingIndicator.render());
Then("the loading indicator is a progressbar named {string}", async ({ loadingIndicator }, name: string) =>
  expect(loadingIndicator.page.getByRole("progressbar", { name, exact: true })).toBeVisible(),
);
Then(
  "the loading indicator has minimum {int} and maximum {int}",
  async ({ loadingIndicator }, minimum: number, maximum: number) => {
    await expect(loadingIndicator.progressbar).toHaveAttribute("aria-valuemin", String(minimum));
    await expect(loadingIndicator.progressbar).toHaveAttribute("aria-valuemax", String(maximum));
  },
);
Then("the loading indicator has no current value", async ({ loadingIndicator }) =>
  expect(loadingIndicator.progressbar).not.toHaveAttribute("aria-valuenow"),
);
Then("the visual indicator is hidden from assistive technology", async ({ loadingIndicator }) =>
  expect(loadingIndicator.indicator.locator(".container")).toHaveAttribute("aria-hidden", "true"),
);
Then("the loading indicator is not displayed", async ({ loadingIndicator }) =>
  expect(loadingIndicator.indicator).toHaveCSS("display", "none"),
);
Then("the variant is {string}", async ({ loadingIndicator }, variant: string) =>
  expect
    .poll(() => loadingIndicator.indicator.evaluate((element, v) => element.matches(`:state(--${v})`), variant))
    .toBe(true),
);
Then("the loading indicator is {int}px wide", async ({ loadingIndicator }, width: number) =>
  expect(loadingIndicator.indicator).toHaveCSS("width", `${width}px`),
);
Then("the container background is {string}", async ({ loadingIndicator }, color: string) =>
  expect(loadingIndicator.indicator.locator(".container")).toHaveCSS("background-color", color),
);
Then("the active indicator color is {string}", async ({ loadingIndicator }, color: string) =>
  expect(loadingIndicator.indicator.locator(".active-indicator")).toHaveCSS("background-color", color),
);
Then("the variant attribute is not {string}", async ({ loadingIndicator }, variant: string) =>
  expect(loadingIndicator.indicator).not.toHaveAttribute("variant", variant),
);

Given("a loading indicator", ({ loadingIndicator }) => loadingIndicator.prepare());
When("the application sets the variant to {string}", async ({ loadingIndicator }, variant: string) =>
  loadingIndicator.setAttribute("variant", variant),
);

Given("the user has forced colors enabled", async ({ page }) => page.emulateMedia({ forcedColors: "active" }));
Then("the active indicator uses the system text color", async ({ loadingIndicator }) =>
  expect.poll(() => loadingIndicator.forcedActiveIndicatorUsesCanvasText()).toBe(true),
);

Then("the loading indicator is animating", async ({ loadingIndicator }) => loadingIndicator.expectAnimating(true));
Then("the loading indicator is not animating", async ({ loadingIndicator }) => loadingIndicator.expectAnimating(false));
When("the application sets the pull progress to {float}", async ({ loadingIndicator }, progress: number) =>
  loadingIndicator.setPullProgress(progress),
);
When("the application removes the pull progress", async ({ loadingIndicator }) =>
  loadingIndicator.indicator.evaluate((element) => element.removeAttribute("pull-progress")),
);
When("the application clears the pull progress property", async ({ loadingIndicator }) =>
  loadingIndicator.setPullProgress(null),
);
Then("the indicator is rotated {int} degrees", async ({ loadingIndicator }, degrees: number) =>
  expect.poll(() => loadingIndicator.rotation()).toBe(degrees),
);
When("the application sets the pull progress attribute to {string}", async ({ loadingIndicator }, value: string) =>
  loadingIndicator.setAttribute("pull-progress", value),
);
When("the application sets the pull progress to infinity", async ({ loadingIndicator }) =>
  loadingIndicator.setPullProgress(Infinity),
);
Then("the pull progress attribute is {string}", async ({ loadingIndicator }, value: string) =>
  expect(loadingIndicator.indicator).toHaveAttribute("pull-progress", value),
);
Then("the loading indicator has no pull progress attribute", async ({ loadingIndicator }) =>
  expect(loadingIndicator.indicator).not.toHaveAttribute("pull-progress"),
);

Given("a loading indicator in a pull target with a vertical pan gesture", ({ loadingIndicator }) =>
  loadingIndicator.preparePullTarget(),
);
When("the application tracks the pan gesture as pull progress", async ({ loadingIndicator }) =>
  loadingIndicator.trackPanGesture(),
);
When("the user drags down {int}px on the pull target", async ({ loadingIndicator }, distance: number) =>
  loadingIndicator.dragDown(distance),
);
Then("the pull progress is about {float}", async ({ loadingIndicator }, progress: number) =>
  expect
    .poll(async () => Number(await loadingIndicator.indicator.getAttribute("pull-progress")))
    .toBeCloseTo(progress, 1),
);
When("the user releases the pull target", async ({ page }) => page.mouse.up());
When("the pull gesture is canceled", async ({ loadingIndicator }) => loadingIndicator.cancelPull());

When("the application moves the loading indicator", async ({ loadingIndicator }) => loadingIndicator.reconnect());
