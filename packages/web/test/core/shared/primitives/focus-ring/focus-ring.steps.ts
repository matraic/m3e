import type { M3eFocusRingElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { FocusRingHarness } from "./focus-ring.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ focusRing: FocusRingHarness }>({
  focusRing: async ({ page, render }, use) => use(new FocusRingHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a focus ring associated with a button", ({ focusRing }) => {
  focusRing.attributes = "";
});
When("the focus ring renders", async ({ focusRing }) => focusRing.show());
Then("the focus ring is hidden from assistive technology", async ({ focusRing }) =>
  expect(focusRing.ring).toHaveAttribute("aria-hidden", "true"),
);

Given("a focus ring associated with a button with {string}", ({ focusRing }, attributes: string) => {
  focusRing.attributes = attributes;
});
Then("the focus ring reflects {string}", async ({ focusRing }, attributes: string) => {
  for (const attribute of attributes.split(", ")) await expect(focusRing.ring).toHaveAttribute(attribute, "");
});
When("the application clears the focus ring properties", async ({ focusRing }) =>
  focusRing.ring.evaluate((ring: M3eFocusRingElement) => {
    ring.inward = false;
    ring.disabled = false;
  }),
);
Then("the focus ring does not reflect {string}", async ({ focusRing }, attributes: string) => {
  for (const attribute of attributes.split(", ")) await expect(focusRing.ring).not.toHaveAttribute(attribute, "");
});

When("the application shows the focus ring", async ({ focusRing }) =>
  focusRing.ring.evaluate((ring: M3eFocusRingElement) => ring.show()),
);
Then("the focus ring outline is visible", async ({ focusRing }) => expect(focusRing.outline).toHaveClass(/visible/));
When("the application hides the focus ring", async ({ focusRing }) =>
  focusRing.ring.evaluate((ring: M3eFocusRingElement) => ring.hide()),
);
Then("the focus ring outline is not visible", async ({ focusRing }) =>
  expect(focusRing.outline).not.toHaveClass(/visible/),
);

When("the user tabs to the focus ring button", async ({ page }) => page.keyboard.press("Tab"));
When("the user tabs away from the focus ring button", async ({ page }) => page.keyboard.press("Shift+Tab"));

When("the user clicks the focus ring button", async ({ page }) => page.locator("#c").click());
Then("the focus ring button is focused", async ({ page }) => expect(page.locator("#c")).toBeFocused());

When("the application disables the focus ring", async ({ focusRing }) =>
  focusRing.ring.evaluate((ring: M3eFocusRingElement) => {
    ring.disabled = true;
  }),
);
When("the application removes the focus ring association", async ({ focusRing }) =>
  focusRing.ring.evaluate((ring: M3eFocusRingElement) => {
    ring.htmlFor = null;
  }),
);
Then("the focus ring outline is solid", async ({ focusRing }) =>
  expect.poll(() => focusRing.outline.evaluate((outline) => getComputedStyle(outline).outlineStyle)).toBe("solid"),
);
When("the application disconnects the focus ring", async ({ focusRing }) => {
  focusRing.disconnectedClasses = await focusRing.ring.evaluate((ring) => {
    const outline = ring.shadowRoot?.querySelector(".outline");
    if (!outline) throw new Error("Focus ring outline is missing.");
    ring.remove();
    return outline.className;
  });
});
Then("the disconnected focus ring outline is not visible", ({ focusRing }) =>
  expect(focusRing.disconnectedClasses).not.toMatch(/visible/),
);
