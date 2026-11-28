import type { M3eSelectionIndicatorElement, M3eStateLayerElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { SelectionIndicatorHarness } from "./selection-indicator.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ indicator: SelectionIndicatorHarness }>({
  indicator: async ({ page, render }, use) => use(new SelectionIndicatorHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a selection indicator associated with a button", ({ indicator }) => {
  indicator.attributes = "";
});
When("the selection indicator renders", async ({ indicator }) => indicator.show());
Then(
  "the selection indicator is hidden from assistive technology and has default properties",
  async ({ indicator }) => {
    await expect(indicator.element).toHaveAttribute("aria-hidden", "true");
    expect(
      await indicator.element.evaluate((element: M3eSelectionIndicatorElement) => [
        element.disabled,
        element.selected,
        element.bounce,
        element.centered,
      ]),
    ).toEqual([false, false, false, false]);
  },
);

Given("a selection indicator with {string}", ({ indicator }, attributes: string) => {
  indicator.attributes = attributes;
});
Then("the selection indicator reflects {string}", async ({ indicator }, attributes: string) => {
  for (const attribute of attributes.split(", ")) await expect(indicator.element).toHaveAttribute(attribute, "");
});
Then("the selection indicator opacity is {int}", async ({ indicator }, opacity: number) =>
  expect.poll(() => indicator.opacity()).toBe(opacity),
);
When("the application selects the indicator", async ({ indicator }) =>
  indicator.element.evaluate((element: M3eSelectionIndicatorElement) => {
    element.selected = true;
  }),
);
When("the application deselects the indicator", async ({ indicator }) =>
  indicator.element.evaluate((element: M3eSelectionIndicatorElement) => {
    element.selected = false;
  }),
);
When("the application shows the indicator hover state", async ({ indicator }) =>
  indicator.element.evaluate((element: M3eSelectionIndicatorElement) => element.show("hover")),
);
Then("the indicator layer shows {string}", async ({ indicator }, state: string) =>
  expect(indicator.layer).toHaveClass(new RegExp(state)),
);
When("the application hides the indicator hover state", async ({ indicator }) =>
  indicator.element.evaluate((element: M3eSelectionIndicatorElement) => element.hide("hover")),
);
Then("the indicator layer does not show {string}", async ({ indicator }, state: string) =>
  expect(indicator.layer).not.toHaveClass(new RegExp(state)),
);
When("the user hovers the indicator button", async ({ page }) => page.locator("#c").hover());
When("the pointer leaves the indicator button", async ({ page }) => page.mouse.move(0, 0));
When("the user tabs to the indicator button", async ({ page }) => page.keyboard.press("Tab"));
When("the user presses the indicator button", async ({ page }) => page.mouse.down());
When("the user releases the indicator button", async ({ page }) => page.mouse.up());
Then("the indicator state layer is disabled", async ({ indicator }) =>
  expect(indicator.element.locator("m3e-state-layer")).toHaveAttribute("disabled", ""),
);
Then("the indicator layer does not show hover after interaction", async ({ page, indicator }) => {
  await page.waitForTimeout(100);
  await expect(indicator.layer).not.toHaveClass(/hover/);
});
Then("the indicator state layer is attached to the button", async ({ indicator }) =>
  expect(
    await indicator.element.evaluate((element) => {
      const layer = element.shadowRoot?.querySelector<M3eStateLayerElement>("m3e-state-layer");
      return layer?.control === document.getElementById("c");
    }),
  ).toBe(true),
);
When("the application removes the indicator association", async ({ indicator }) =>
  indicator.element.evaluate((element: M3eSelectionIndicatorElement) => {
    element.htmlFor = null;
  }),
);
When("the selection indicator renders with motion enabled", async ({ indicator }) => indicator.show(true));
When("the user presses the indicator button at an offset", async ({ page }) => {
  await page.locator("#c").hover({ position: { x: 150, y: 50 } });
  await page.mouse.down();
});
Then("the indicator records the press origin", async ({ indicator }) =>
  expect.poll(() => indicator.origin()).not.toBe(""),
);
Then("the indicator does not record the press origin", async ({ page, indicator }) => {
  await page.waitForTimeout(100);
  expect(await indicator.origin()).toBe("");
});
