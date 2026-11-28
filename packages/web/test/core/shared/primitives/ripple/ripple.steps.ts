import type { M3eRippleElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { RippleHarness } from "./ripple.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ ripple: RippleHarness }>({
  ripple: async ({ page, render }, use) => use(new RippleHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a ripple associated with a button", ({ ripple }) => {
  ripple.attributes = "";
});
When("the ripple renders", async ({ ripple }) => ripple.show());
Then("the ripple is hidden from assistive technology and has default properties", async ({ ripple }) => {
  await expect(ripple.element).toHaveAttribute("aria-hidden", "true");
  expect(
    await ripple.element.evaluate((element: M3eRippleElement) => [
      element.disabled,
      element.centered,
      element.unbounded,
      element.radius,
      element.visible,
    ]),
  ).toEqual([false, false, false, null, false]);
});

Given("a ripple with {string}", ({ ripple }, attributes: string) => {
  ripple.attributes = attributes;
});
Then("the ripple reflects {string}", async ({ ripple }, attributes: string) => {
  for (const attribute of attributes.split(", ")) await expect(ripple.element).toHaveAttribute(attribute, "");
});
When("the application shows a persistent ripple", async ({ ripple }) =>
  ripple.element.evaluate((element: M3eRippleElement) => element.show(100, 100, true)),
);
Then("there is one visible persistent ripple", async ({ ripple }) => {
  await expect(ripple.ripples).toHaveCount(1);
  await expect(ripple.ripples.first()).toHaveClass(/persistent/);
  expect(await ripple.visible()).toBe(true);
});
Then("the ripple remains visible", async ({ page, ripple }) => {
  await page.waitForTimeout(800);
  expect(await ripple.visible()).toBe(true);
});
When("the application hides the ripple", async ({ ripple }) =>
  ripple.element.evaluate((element: M3eRippleElement) => element.hide()),
);
Then("there are no visible ripples", async ({ ripple }) => {
  await expect(ripple.ripples).toHaveCount(0);
  expect(await ripple.visible()).toBe(false);
});

When("the application shows a non-persistent ripple", async ({ ripple }) =>
  ripple.element.evaluate((element: M3eRippleElement) => element.show(100, 100)),
);
Then("the ripple eventually becomes invisible", async ({ ripple }) => expect.poll(() => ripple.visible()).toBe(false));
When("the application sets ripple radius to {int}", async ({ ripple }, radius: number) =>
  ripple.element.evaluate((element: M3eRippleElement, value) => {
    element.radius = value;
  }, radius),
);
Then("the ripple dimensions are {int} pixels", async ({ ripple }, size: number) =>
  expect(
    await ripple.ripples.first().evaluate((element: HTMLElement) => ({
      width: element.style.width,
      height: element.style.height,
    })),
  ).toEqual({ width: `${size}px`, height: `${size}px` }),
);
When("the application shows a persistent ripple at the top left", async ({ ripple }) => {
  ripple.bounds = await ripple.element.evaluate((element) => {
    const bounds = element.getBoundingClientRect();
    return { left: bounds.left, top: bounds.top, width: bounds.width, height: bounds.height };
  });
  await ripple.element.evaluate(
    (element: M3eRippleElement, bounds) => element.show(bounds.left, bounds.top, true),
    ripple.bounds,
  );
});
Then("the ripple reaches the farthest corner", async ({ ripple }) => {
  const width = await ripple.ripples.first().evaluate((element: HTMLElement) => parseFloat(element.style.width));
  expect(width).toBeCloseTo(2 * Math.hypot(ripple.bounds.width, ripple.bounds.height), 0);
});
When("the application shows a persistent ripple at zero", async ({ ripple }) =>
  ripple.element.evaluate((element: M3eRippleElement) => element.show(0, 0, true)),
);
Then("the ripple starts in the center", async ({ ripple }) => {
  const position = await ripple.ripples.first().evaluate((element: HTMLElement) => ({
    left: element.style.left,
    top: element.style.top,
  }));
  const bounds = await ripple.element.evaluate((element) => ({
    width: element.getBoundingClientRect().width,
    height: element.getBoundingClientRect().height,
  }));
  expect(parseFloat(position.left)).toBeCloseTo(bounds.width / 2 - 10, 0);
  expect(parseFloat(position.top)).toBeCloseTo(bounds.height / 2 - 10, 0);
});
When("the user hovers the ripple button", async ({ page }) => page.locator("#c").hover());
When("the user presses the ripple button", async ({ page }) => page.mouse.down());
Then("there is one visible ripple", async ({ ripple }) => {
  await expect(ripple.ripples).toHaveCount(1);
  expect(await ripple.visible()).toBe(true);
});
When("the user releases the ripple button", async ({ page }) => page.mouse.up());
When("the user focuses the ripple button", async ({ page }) => page.locator("#c").focus());
When("the user holds Space on the ripple button", async ({ page }) => page.keyboard.down(" "));
Then("there is one ripple", async ({ ripple }) => expect(ripple.ripples).toHaveCount(1));
When("the user releases Space on the ripple button", async ({ page }) => page.keyboard.up(" "));
Then("there are no ripples", async ({ ripple }) => expect(ripple.ripples).toHaveCount(0));
Then("the ripple is not visible after interaction", async ({ page, ripple }) => {
  await page.waitForTimeout(100);
  expect(await ripple.visible()).toBe(false);
});
When("the application disables the ripple", async ({ ripple }) =>
  ripple.element.evaluate((element: M3eRippleElement) => {
    element.disabled = true;
  }),
);
When("the application removes the ripple association", async ({ ripple }) =>
  ripple.element.evaluate((element: M3eRippleElement) => {
    element.htmlFor = null;
  }),
);
When("the application disconnects the ripple", async ({ ripple }) => {
  ripple.detachedVisible = await ripple.element.evaluate((element: M3eRippleElement) => {
    element.remove();
    return element.visible;
  });
});
Then("the disconnected ripple is not visible", ({ ripple }) => expect(ripple.detachedVisible).toBe(false));
