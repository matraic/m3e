import type { M3ePseudoCheckboxElement, M3ePseudoRadioElement } from "@m3e/web/core";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../../../../fixtures";
import { PseudoHarness } from "./pseudo.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ pseudo: PseudoHarness }>({
  pseudo: async ({ page, render }, use) => use(new PseudoHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a pseudo checkbox", ({ pseudo }) => {
  pseudo.tag = "m3e-pseudo-checkbox";
});
When("the pseudo control renders", async ({ pseudo }) => pseudo.show());
Then("the pseudo control is hidden from assistive technology", async ({ pseudo }) =>
  expect(pseudo.element).toHaveAttribute("aria-hidden", "true"),
);
Then("the pseudo checkbox has no icon", async ({ pseudo }) => expect(pseudo.element.locator("svg")).toHaveCount(0));

Given("a pseudo checkbox with {string}", ({ pseudo }, attributes: string) => {
  pseudo.tag = "m3e-pseudo-checkbox";
  pseudo.attributes = attributes;
});
Then("the pseudo checkbox shows a check mark", async ({ pseudo }) =>
  expect(
    await pseudo.element.locator("svg path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d"))),
  ).toEqual(["M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"]),
);
Then("no checkbox control is exposed", async ({ page }) => expect(page.getByRole("checkbox")).toHaveCount(0));
Then("the pseudo checkbox shows a dash", async ({ pseudo }) =>
  expect(
    await pseudo.element.locator("svg path").evaluateAll((paths) => paths.map((path) => path.getAttribute("d"))),
  ).toEqual(["M240-440v-80h480v80H240Z"]),
);
Then("the pseudo control reflects {string}", async ({ pseudo }, attributes: string) => {
  for (const attribute of attributes.split(", ")) await expect(pseudo.element).toHaveAttribute(attribute, "");
});

When("the application checks the pseudo control", async ({ pseudo }) =>
  pseudo.element.evaluate((element: M3ePseudoCheckboxElement | M3ePseudoRadioElement) => {
    element.checked = true;
  }),
);
Then("the pseudo checkbox has an icon", async ({ pseudo }) => expect(pseudo.element.locator("svg")).toHaveCount(1));
When("the application unchecks the pseudo control", async ({ pseudo }) =>
  pseudo.element.evaluate((element: M3ePseudoCheckboxElement | M3ePseudoRadioElement) => {
    element.checked = false;
  }),
);

Given("a pseudo radio", ({ pseudo }) => {
  pseudo.tag = "m3e-pseudo-radio";
});
Then("the pseudo radio dot is hidden", async ({ pseudo }) =>
  expect(await pseudo.element.locator(".inner").evaluate((element) => getComputedStyle(element).opacity)).toBe("0"),
);
Then("the pseudo radio dot is visible", async ({ pseudo }) =>
  expect
    .poll(() => pseudo.element.locator(".inner").evaluate((element) => getComputedStyle(element).opacity))
    .toBe("1"),
);

Given("a pseudo radio with {string}", ({ pseudo }, attributes: string) => {
  pseudo.tag = "m3e-pseudo-radio";
  pseudo.attributes = attributes;
});
Then("no radio control is exposed", async ({ page }) => expect(page.getByRole("radio")).toHaveCount(0));
