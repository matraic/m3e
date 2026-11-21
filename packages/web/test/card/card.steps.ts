import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { CardHarness } from "./card.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ card: CardHarness }>({
  card: async ({ page, render }, use) => use(new CardHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an actionable media card with variant {string} and cut shapes", ({ card }, variant: string) => {
  card.styles = ":root { --m3e-shape-family: bevel; }";
  card.markup = `<m3e-card actionable variant="${variant}">
    <img slot="header" alt="Product" />
    <video slot="header"></video>
    <div slot="content">Product details</div>
  </m3e-card>`;
});
When("the card renders", async ({ card }) => card.show());
Then("the card surface, media, and visual primitives use cut corners", async ({ card }) => {
  for (const selector of [
    ".base",
    "img",
    "video",
    ".elevation",
    ".elevation .shadow",
    ".state-layer",
    ".state-layer .layer",
    ".ripple",
    ".focus-ring",
    ".focus-ring .outline",
  ]) {
    await expect(card.card.locator(selector)).toHaveCSS("corner-shape", "superellipse(0)");
  }
});
Then("the card surface has CSS {string} of {string}", async ({ card }, property: string, value: string) =>
  expect(card.surface).toHaveCSS(property, value),
);

Given("a card with mixed logical corner defaults", ({ card }) => {
  card.styles = `:root {
    --m3e-shape-family: bevel;
    --m3e-shape-family-start-start: round;
    --m3e-shape-family-end-end: round;
  }`;
});
When("the application sets the card attribute {string} to {string}", async ({ card }, name: string, value: string) =>
  card.setAttribute(name, value),
);
When("the application sets card CSS property {string} to {string}", async ({ card }, name: string, value: string) =>
  card.setStyle(name, value),
);
When("the application removes card CSS property {string}", async ({ card }, name: string) => card.removeStyle(name));

Given("a card with header, content, actions, and footer", ({ card }) => {
  card.markup = `<m3e-card>
    <div slot="header">Product name</div>
    <div slot="content">Product details</div>
    <div slot="actions">Buy now</div>
    <div slot="footer">In stock</div>
  </m3e-card>`;
});
Then("card text {string} is visible", async ({ card }, text: string) =>
  expect(card.card.getByText(text, { exact: true })).toBeVisible(),
);

Given("a card with default content {string}", ({ card }, content: string) => {
  card.markup = `<m3e-card>${content}</m3e-card>`;
});
Then("the card's effective variant is {string}", async ({ card }, variant: string) =>
  expect.poll(() => card.readVariant()).toBe(variant),
);
Then("the card's effective orientation is {string}", async ({ card }, orientation: string) =>
  expect.poll(() => card.readOrientation()).toBe(orientation),
);
Then("the card uses block presentation", async ({ card }) => {
  await expect.poll(() => card.readInline()).toBe(false);
  await expect(card.card).toHaveCSS("display", "block");
});

Given("an inline card", ({ card }) => {
  card.markup = "<m3e-card inline>Card content</m3e-card>";
});
Then("the card reflects attribute {string} with value {string}", async ({ card }, name: string, value: string) =>
  expect(card.card).toHaveAttribute(name, value),
);
Then("the card has CSS {string} of {string}", async ({ card }, property: string, value: string) =>
  expect(card.card).toHaveCSS(property, value),
);

Given("a card with variant {string}", ({ card }, variant: string) => {
  card.markup = `<m3e-card variant="${variant}">Card content</m3e-card>`;
});

Given("a card with orientation {string}", ({ card }, orientation: string) => {
  card.markup = `<m3e-card orientation="${orientation}">Card content</m3e-card>`;
});

Given("a static card and an actionable card", ({ card }) => {
  card.markup = "<m3e-card>Static card</m3e-card><m3e-card actionable>Actionable card</m3e-card>";
});
Then("a card button named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeVisible(),
);
Then("the static card is not keyboard focusable", async ({ page }) =>
  expect(page.locator("m3e-card").first()).not.toHaveAttribute("tabindex"),
);
Then("the actionable card has tabindex {string}", async ({ card }, value: string) =>
  expect(card.card).toHaveAttribute("tabindex", value),
);

Given("an actionable card named {string}", ({ card }, name: string) => {
  card.markup = `<m3e-card actionable>${name}</m3e-card>`;
});
When("the application observes card clicks", async ({ card }) => card.observeClicks());
When("the user clicks the card", async ({ card }) => card.card.click());
Then(/^the card dispatches (\d+) clicks?$/, async ({ card }, count: number) =>
  expect.poll(() => card.readClicks()).toBe(String(count)),
);
When("the user focuses the card", async ({ card }) => card.card.focus());
When("the user presses {string} on the card", async ({ page }, key: string) => page.keyboard.press(key));

Given("a disabled actionable card", ({ card }) => {
  card.markup = "<m3e-card actionable disabled>Unavailable card</m3e-card>";
});
Then("the card is not keyboard focusable", async ({ card }) => expect(card.card).not.toHaveAttribute("tabindex"));
When("the application clicks the card", async ({ card }) => card.clickProgrammatically());

Given("an actionable link card", ({ card }) => {
  card.markup = '<m3e-card actionable href="#details">View details</m3e-card>';
});
Then("a card link named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("link", { name, exact: true })).toBeVisible(),
);
Then("the actionable card has keyboard focus", async ({ card }) => expect(card.card).toBeFocused());

Given("a disabled-interactive actionable card", ({ card }) => {
  card.markup = "<m3e-card actionable disabled-interactive>Unavailable card</m3e-card>";
});
When("the application removes card attribute {string}", async ({ card }, name: string) => card.removeAttribute(name));
Then("the card is not exposed as disabled", async ({ card }) =>
  expect(card.card).not.toHaveAttribute("aria-disabled", "true"),
);

Given("forced colors are active for cards", async ({ page }) => page.emulateMedia({ forcedColors: "active" }));
Then("the card surface uses the disabled system color", async ({ card }) => {
  const { color, borderColor, expected } = await card.readDisabledColors();
  expect(color).toBe(expected);
  expect(borderColor).toBe(expected);
});

Given("a card with dedicated and default content", ({ card }) => {
  card.markup = '<m3e-card>Fallback content<div slot="content">Product details</div></m3e-card>';
});
Then("card text {string} is not visible", async ({ card }, text: string) =>
  expect(card.card.getByText(text, { exact: true })).not.toBeVisible(),
);
When("the application removes the card content slot", async ({ card }) => card.removeContent());

Given("the card has variant {string} and orientation {string}", ({ card }, variant: string, orientation: string) => {
  card.markup = card.markup.replace("<m3e-card", `<m3e-card variant="${variant}" orientation="${orientation}"`);
});
When("the application moves the card to a new DOM parent", async ({ card }) => card.moveToNewParent());
Then("the card is in the new DOM parent", async ({ page }) =>
  expect(page.locator("#card-new-parent > m3e-card")).toBeVisible(),
);
When("the user holds Space on the card", async ({ page }) => page.keyboard.down("Space"));
Then("the card surface is pressed", async ({ card }) => expect(card.surface).toHaveClass(/\bpressed\b/));
Then("the card surface is not pressed", async ({ card }) => expect(card.surface).not.toHaveClass(/\bpressed\b/));
When("the user releases Space on the card", async ({ page }) => page.keyboard.up("Space"));
