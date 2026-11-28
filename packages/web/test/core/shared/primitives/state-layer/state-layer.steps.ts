import type { M3eStateLayerElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { StateLayerHarness } from "./state-layer.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ stateLayer: StateLayerHarness }>({
  stateLayer: async ({ page, render }, use) => use(new StateLayerHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);
type LayerState = "hover" | "focused" | "pressed";

Given("a state layer associated with a button", ({ stateLayer }) => {
  stateLayer.attributes = "";
});
When("the state layer renders", async ({ stateLayer }) => stateLayer.show());
Then("the state layer is hidden from assistive technology and has default properties", async ({ stateLayer }) => {
  await expect(stateLayer.element).toHaveAttribute("aria-hidden", "true");
  expect(
    await stateLayer.element.evaluate((element: M3eStateLayerElement) => [
      element.disabled,
      element.disableHover,
      element.enablePressed,
    ]),
  ).toEqual([false, false, false]);
});

Given("a state layer with {string}", ({ stateLayer }, attributes: string) => {
  stateLayer.attributes = attributes;
});
Then("the state layer reflects {string}", async ({ stateLayer }, attributes: string) => {
  for (const attribute of attributes.split(", ")) await expect(stateLayer.element).toHaveAttribute(attribute, "");
});

When("the application shows state layer {string}", async ({ stateLayer }, state: LayerState) =>
  stateLayer.element.evaluate((element: M3eStateLayerElement, value) => element.show(value), state),
);
Then("the state layer shows {string}", async ({ stateLayer }, state: string) =>
  expect(stateLayer.layer).toHaveClass(new RegExp(state)),
);
When("the application hides state layer {string}", async ({ stateLayer }, state: LayerState) =>
  stateLayer.element.evaluate((element: M3eStateLayerElement, value) => element.hide(value), state),
);
Then("the state layer does not show {string}", async ({ stateLayer }, state: string) =>
  expect(stateLayer.layer).not.toHaveClass(new RegExp(state)),
);

When("the user hovers the state layer button", async ({ page }) => page.locator("#c").hover());
When("the pointer leaves the state layer button", async ({ page }) => page.mouse.move(0, 0));
Then("the state layer does not show {string} after interaction", async ({ page, stateLayer }, state: string) => {
  await page.waitForTimeout(100);
  await expect(stateLayer.layer).not.toHaveClass(new RegExp(state));
});
When("the user tabs to the state layer button", async ({ page }) => page.keyboard.press("Tab"));
Then("the state layer button is focused", async ({ page }) => expect(page.locator("#c")).toBeFocused());
When("the user tabs away from the state layer button", async ({ page }) => page.keyboard.press("Shift+Tab"));
When("the user clicks the state layer button", async ({ page }) => page.locator("#c").click());
When("the application disables the state layer", async ({ stateLayer }) =>
  stateLayer.element.evaluate((element: M3eStateLayerElement) => {
    element.disabled = true;
  }),
);
When("the user presses the state layer button", async ({ page }) => page.mouse.down());
When("the user releases the state layer button", async ({ page }) => page.mouse.up());
When("the application removes the state layer association", async ({ stateLayer }) =>
  stateLayer.element.evaluate((element: M3eStateLayerElement) => {
    element.htmlFor = null;
  }),
);
When("the application disconnects the state layer", async ({ stateLayer }) => {
  stateLayer.disconnectedClasses = await stateLayer.element.evaluate((element) => {
    const layer = element.shadowRoot?.querySelector(".layer");
    if (!layer) throw new Error("State layer is missing.");
    element.remove();
    return layer.className;
  });
});
Then("the disconnected state layer has no hover or focus state", ({ stateLayer }) =>
  expect(stateLayer.disconnectedClasses).not.toMatch(/hover|focused/),
);
