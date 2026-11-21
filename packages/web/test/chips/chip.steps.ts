import { createBdd } from "playwright-bdd";

import { expect } from "../fixtures";
import { test } from "./chips.steps";

const { Given, When, Then } = createBdd(test);

Given("a chip labeled Design with leading and trailing icons", ({ chips }) => {
  chips.markup =
    '<m3e-chip><span slot="icon" aria-hidden="true">*</span><span>Design</span>' +
    '<span slot="trailing-icon" aria-hidden="true">&gt;</span></m3e-chip>';
});
When("the base chips render", async ({ chips }) => chips.show());
Then("the Design chip and both icons are visible", async ({ chips }) => {
  await expect(chips.chip).toBeVisible();
  await expect(chips.chip).toContainText("Design");
  await expect(chips.chip.locator('> [slot="icon"]')).toBeVisible();
  await expect(chips.chip.locator('> [slot="trailing-icon"]')).toBeVisible();
});
Then("the base chip value is {string}", async ({ chips }, value: string) =>
  expect.poll(() => chips.value()).toBe(value),
);

Given("base chips with elevated, outlined, and unknown variants", ({ chips }) => {
  chips.markup = `<m3e-chip variant="elevated">Elevated</m3e-chip>
    <m3e-chip variant="outlined">Outlined</m3e-chip><m3e-chip variant="unknown">Fallback</m3e-chip>`;
});
Then("the base chips use elevated, outlined, and outlined variants", async ({ chips }) => {
  await expect(chips.chip.nth(0)).toHaveAttribute("variant", "elevated");
  await expect(chips.chip.nth(1)).toHaveAttribute("variant", "outlined");
  await expect
    .poll(() => chips.chip.nth(2).evaluate((element: HTMLElementTagNameMap["m3e-chip"]) => element.variant))
    .toBe("outlined");
});

Given("a vertical base chip set", ({ chips }) => {
  chips.markup = `<m3e-chip-set vertical>
    <m3e-chip>Design</m3e-chip><m3e-chip>Accessibility</m3e-chip>
  </m3e-chip-set>`;
});
Then("the base chip set has two chips and vertical orientation", async ({ page }) => {
  await expect(page.locator("m3e-chip-set")).toHaveAttribute("vertical", "");
  await expect(page.locator("m3e-chip-set m3e-chip")).toHaveCount(2);
  await expect(page.locator("m3e-chip-set")).toHaveCSS("flex-direction", "column");
});
When("the application replaces the base chip label with {string}", async ({ chips }, label: string) =>
  chips.chip.locator("> span:not([slot])").evaluate((element, text) => {
    const replacement = document.createElement("span");
    replacement.textContent = text;
    element.replaceWith(replacement);
  }, label),
);
When("the application sets the base chip value to {string}", async ({ chips }, value: string) =>
  chips.setAttribute(chips.chip, "value", value),
);

Given("a base chip followed by a focusable button", ({ chips }) => {
  chips.markup = "<m3e-chip>Design</m3e-chip><button>Continue</button>";
});
Then("the base chip has no keyboard tab stop", async ({ chips }) => expect(chips.chip).not.toHaveAttribute("tabindex"));
When("the user tabs past the base chip", async ({ page }) => page.keyboard.press("Tab"));
Then("the following button has focus", async ({ page }) =>
  expect(page.getByRole("button", { name: "Continue" })).toBeFocused(),
);
When("the application moves the base chip set to a new parent", async ({ chips, page }) =>
  chips.moveToNewParent(page.locator("m3e-chip-set")),
);
Then("the base chip set is in the new parent", async ({ page }) =>
  expect(page.locator("#chip-parent-2 > m3e-chip-set")).toBeVisible(),
);
When("the application appends a base chip labeled {string}", async ({ page }, label: string) =>
  page.locator("m3e-chip-set").evaluate((set, text) => {
    const chip = document.createElement("m3e-chip");
    chip.textContent = text;
    set.append(chip);
  }, label),
);
Then("the base chip set contains three chips", async ({ page }) =>
  expect(page.locator("m3e-chip-set m3e-chip")).toHaveCount(3),
);
