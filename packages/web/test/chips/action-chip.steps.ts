import { createBdd } from "playwright-bdd";

import { expect } from "../fixtures";
import { test } from "./chips.steps";

const { Given, When, Then } = createBdd(test);

Given(/^(?:an|a) (assist|suggestion) action chip$/, ({ chips }, type: "assist" | "suggestion") =>
  chips.configureAction(type),
);
When("the action chip renders", async ({ chips }) => chips.show());
Then("the action chip is a button named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeVisible(),
);
When("the application observes action chip clicks", async ({ chips }) => chips.recordEvents(chips.chip, ["click"]));
When("the user focuses the action chip", async ({ chips }) => chips.chip.focus());
When("the user presses {string} on the action chip", async ({ page }, key: string) => page.keyboard.press(key));
Then("the action chip clicks are {string}", async ({ chips }, clicks: string) =>
  expect(chips.chip).toHaveAttribute("data-events", clicks),
);
When(
  "the application sets action chip attribute {string} to {string}",
  async ({ chips }, name: string, value: string) => chips.setAttribute(chips.chip, name, value),
);
Then("the action chip exposes disabled state", async ({ chips }) =>
  expect(chips.chip).toHaveAttribute("aria-disabled", "true"),
);
Then("the action chip has no keyboard tab stop", async ({ chips }) =>
  expect(chips.chip).not.toHaveAttribute("tabindex"),
);
When("the application clicks the action chip", async ({ chips }) =>
  chips.chip.evaluate((element: HTMLElement) => element.click()),
);
Then("the action chip has a keyboard tab stop", async ({ chips }) =>
  expect(chips.chip).toHaveAttribute("tabindex", "0"),
);
Then("the action chip has focus", async ({ chips }) => expect(chips.chip).toBeFocused());
When("the application removes action chip attribute {string}", async ({ chips }, name: string) =>
  chips.removeAttribute(chips.chip, name),
);
Then("the action chip is a link named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("link", { name, exact: true })).toBeVisible(),
);
When("the application moves the action chip to a new parent", async ({ chips }) => chips.moveToNewParent(chips.chip));
Then("the action chip is in the new parent", async ({ chips, page }) =>
  expect(page.locator(`#chip-parent-2 > ${chips.tag}`)).toBeVisible(),
);

Given(/^(?:an|a) (assist|suggestion) action chip that submits a form$/, ({ chips }, type: "assist" | "suggestion") =>
  chips.configureAction(type, true),
);
When("the application observes chip form submissions", async ({ chips }) => chips.observeSubmit());
When("the application reconnects the action chip inside its form", async ({ chips }) =>
  chips.chip.evaluate((element) => {
    const form = element.closest("form");
    if (!form) throw new Error("Action chip form is missing.");
    const parent = document.createElement("div");
    form.append(parent);
    parent.append(element);
  }),
);
Then("the chip form was submitted once with the action value", async ({ page }) => {
  await expect(page.locator("#chip-form")).toHaveAttribute("data-submissions", "1");
  await expect(page.locator("#chip-form")).toHaveAttribute("data-values", JSON.stringify([["action", "design"]]));
});
