import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { IconHarness } from "./icon.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ icon: IconHarness }>({
  icon: async ({ page, render }, use) => use(new IconHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an icon named {string}", ({ icon }, name: string) => {
  icon.html = icon.markup(name);
});
When("the icon renders", async ({ icon }) => icon.render());
Then("the icon displays {string}", async ({ icon }, name: string) => expect(icon.glyph()).toHaveText(name));
Then("the icon is hidden from assistive technology", async ({ icon }) => {
  await expect(icon.icon()).toHaveAttribute("aria-hidden", "true");
  await expect(icon.glyph()).toHaveAttribute("aria-hidden", "true");
  await expect(icon.page.getByRole("img")).toHaveCount(0);
});
Then("the icon glyph is marked as non-translatable", async ({ icon }) =>
  expect(icon.glyph()).toHaveAttribute("translate", "no"),
);

Given("an icon with its presentation settings configured", ({ icon }) => {
  icon.html = icon.markup("favorite", 'variant="rounded" filled grade="high" weight="600" optical-size="32"');
});
Then("the icon uses the configured presentation settings", async ({ icon }) => {
  const element = icon.icon();
  await expect(element).toHaveAttribute("variant", "rounded");
  await expect(element).toHaveAttribute("filled", "");
  await expect(element).toHaveJSProperty("grade", "high");
  await expect(element).toHaveJSProperty("weight", 600);
  await expect(element).toHaveJSProperty("opticalSize", 32);
  await expect(icon.glyph()).toHaveCSS("--_icon-fill", "1");
  await expect(icon.glyph()).toHaveCSS("--_icon-grade", "200");
  await expect(icon.glyph()).toHaveCSS("--_icon-weight", "600");
  await expect(icon.glyph()).toHaveCSS("--_icon-optical-size", "32");
  expect(await element.evaluate((element) => element.matches(":state(--rounded)"))).toBe(true);
});

Given("an icon with unsupported presentation settings", ({ icon }) => {
  icon.html = icon.markup("home", 'variant="unsupported" grade="unsupported" weight="450"');
});
Then("the icon uses the default presentation settings", async ({ icon }) => {
  await expect(icon.icon()).toHaveJSProperty("variant", "outlined");
  await expect(icon.icon()).toHaveJSProperty("grade", "medium");
  await expect(icon.icon()).toHaveJSProperty("weight", 400);
  expect(await icon.icon().evaluate((element) => element.matches(":state(--outlined)"))).toBe(true);
});

Given("an icon named {string} with accessible label {string}", ({ icon }, name: string, label: string) => {
  icon.html = icon.markup(name, `aria-label="${label}"`);
});
Then("the icon is exposed as an image named {string}", async ({ page }, label: string) => {
  const image = page.getByRole("img", { name: label, exact: true });
  await expect(image).toBeVisible();
  await expect(image).not.toHaveAttribute("aria-hidden", "true");
});
When("the application changes the icon name to {string}", async ({ icon }, name: string) =>
  icon.icon().evaluate((element, value) => element.setAttribute("name", value), name),
);

Given("an icon named {string} labelled by referenced text {string}", ({ icon }, name: string, label: string) => {
  icon.html = `<span id="icon-label">${label}</span>${icon.markup(name, 'aria-labelledby="icon-label"')}`;
});
Given("an icon with explicit aria-hidden value {string}", ({ icon }, value: string) => {
  icon.html = icon.markup("home", `aria-hidden="${value}"`);
});
Then("the icon preserves aria-hidden value {string}", async ({ icon, page }, value: string) => {
  await expect(icon.icon()).toHaveAttribute("aria-hidden", value);
  await expect(page.getByRole("img")).toHaveCount(value === "true" ? 0 : 1);
});

Given("outlined and filled SVG icons are registered", ({ icon }) => {
  icon.html = `<m3e-icon name="registered-icon"></m3e-icon>
    <m3e-icon name="registered-icon" filled></m3e-icon>`;
  icon.setupScript = `registerIcon("registered-icon", "outlined", {
    outlined: { viewBox: "0 0 24 24", path: "M0 0h10v10H0z" },
    filled: { viewBox: "0 0 24 24", path: "M2 2h20v20H2z" }
  });`;
});
Then("the outlined and filled icons render their registered SVG paths", async ({ icon }) => {
  await expect(icon.icon(0).locator("svg")).toHaveAttribute("viewBox", "0 0 24 24");
  await expect(icon.icon(0).locator("svg path")).toHaveAttribute("d", "M0 0h10v10H0z");
  await expect(icon.icon(1).locator("svg path")).toHaveAttribute("d", "M2 2h20v20H2z");
});

Given("an icon waiting for SVG registration", ({ icon }) => {
  icon.html = icon.markup("late-icon");
  icon.setupScript = "window.registerTestIcon = registerIcon;";
});
When("the application registers the icon", async ({ page }) => {
  await page.evaluate(() => {
    const target = window as Window & {
      registerTestIcon?: (
        name: string,
        variant: "outlined",
        fillSet: {
          outlined: { viewBox: string; path: string };
          filled: { viewBox: string; path: string };
        },
      ) => void;
    };
    if (!target.registerTestIcon) {
      throw new Error("The icon registration helper is unavailable.");
    }
    target.registerTestIcon("late-icon", "outlined", {
      outlined: { viewBox: "0 0 24 24", path: "M1 1h8v8H1z" },
      filled: { viewBox: "0 0 24 24", path: "M3 3h18v18H3z" },
    });
  });
});
Then("the icon renders the registered SVG path", async ({ icon }) =>
  expect(icon.icon().locator("svg path")).toHaveAttribute("d", "M1 1h8v8H1z"),
);
