import type { M3eElevationElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { ElevationHarness } from "./elevation.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ elevation: ElevationHarness }>({
  elevation: async ({ page, render }, use) => use(new ElevationHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an elevation associated with a button", ({ elevation }) => {
  elevation.attributes = "";
});
When("the elevation renders", async ({ elevation }) => elevation.show());
Then("the elevation is hidden from assistive technology and has default properties", async ({ elevation }) => {
  await expect(elevation.element).toHaveAttribute("aria-hidden", "true");
  expect(await elevation.element.evaluate((element: M3eElevationElement) => [element.level, element.disabled])).toEqual(
    [null, false],
  );
});

Given("an elevation with {string}", ({ elevation }, attributes: string) => {
  elevation.attributes = attributes;
});
Then("the elevation reflects level 3 and disabled", async ({ elevation }) => {
  await expect(elevation.element).toHaveAttribute("level", "3");
  await expect(elevation.element).toHaveAttribute("disabled", "");
});
When("the application sets elevation level {int}", async ({ elevation }, level: number) => elevation.setLevel(level));
Then("the elevation has no level", async ({ elevation }) =>
  expect(await elevation.element.evaluate((element: M3eElevationElement) => element.level)).toBeNull(),
);
Then("the elevation level is {int}", async ({ elevation }, level: number) =>
  expect(await elevation.element.evaluate((element: M3eElevationElement) => element.level)).toBe(level),
);
Then("levels 0 and 4 cast different elevation shadows", async ({ elevation }) => {
  await elevation.setLevel(0);
  await expect(elevation.element).toHaveAttribute("level", "0");
  const low = await elevation.shadow.evaluate((shadow) => getComputedStyle(shadow).boxShadow);
  await elevation.setLevel(4);
  await expect(elevation.element).toHaveAttribute("level", "4");
  const high = await elevation.shadow.evaluate((shadow) => getComputedStyle(shadow).boxShadow);
  expect(high).not.toBe(low);
});
When("the user hovers the elevation button", async ({ page }) => page.locator("#c").hover());
Then("the elevation shadow shows {string}", async ({ elevation }, state: string) =>
  expect(elevation.shadow).toHaveClass(new RegExp(state)),
);
When("the pointer leaves the elevation button", async ({ page }) => page.mouse.move(0, 0));
Then("the elevation shadow does not show {string}", async ({ elevation }, state: string) =>
  expect(elevation.shadow).not.toHaveClass(new RegExp(state)),
);
When("the user tabs to the elevation button", async ({ page }) => page.keyboard.press("Tab"));
When("the user tabs away from the elevation button", async ({ page }) => page.keyboard.press("Shift+Tab"));
When("the user presses the elevation button", async ({ page }) => page.mouse.down());
When("the user releases the elevation button", async ({ page }) => page.mouse.up());
Then("the elevation shadow does not show interaction states", async ({ page, elevation }) => {
  await page.waitForTimeout(100);
  await expect(elevation.shadow).not.toHaveClass(/hover|focus|pressed/);
});
When("the application disables the elevation", async ({ elevation }) =>
  elevation.element.evaluate((element: M3eElevationElement) => {
    element.disabled = true;
  }),
);
When("the application removes the elevation association", async ({ elevation }) =>
  elevation.element.evaluate((element: M3eElevationElement) => {
    element.htmlFor = null;
  }),
);
