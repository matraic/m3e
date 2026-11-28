import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import type { M3eThemeIconElement } from "@m3e/web/theme";

import { expect, test as componentTest } from "../fixtures";
import { ThemeHarness } from "./theme.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ theme: ThemeHarness }>({
  theme: async ({ page, render }, use) => use(new ThemeHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a theme icon named {string}", async ({ theme }, name: string) => {
  await theme.show(`<m3e-theme-icon id="icon" aria-label="${name}"></m3e-theme-icon>`);
});
Then("the theme icon is a visible named image", async ({ page }) => {
  await expect(page.getByRole("img", { name: "Theme preview", exact: true })).toBeVisible();
});
Then("the theme icon has valid surface and primary fills", async ({ theme }) => {
  for (const fill of await theme.readIconFills("#icon")) expect(fill).toMatch(/^rgb\(\d+, \d+, \d+\)$/);
});

Given("a theme icon with variant {string}", async ({ theme }, variant: string) => {
  await theme.show(`<m3e-theme-icon id="icon" variant="${variant}"></m3e-theme-icon>`);
});
Then("the theme icon uses variant {string}", async ({ page }, variant: string) => {
  await expect.poll(() => page.locator("#icon").evaluate((icon: M3eThemeIconElement) => icon.variant)).toBe(variant);
});

Given("a light theme icon with source color {string}", async ({ theme }, color: string) => {
  await theme.show(`<m3e-theme-icon id="icon" color="${color}" scheme="light"></m3e-theme-icon>`);
  theme.initialIconFills = await theme.readIconFills("#icon");
});
When("the theme icon source color changes to {string}", async ({ page }, color: string) => {
  await page.locator("#icon").evaluate((icon: M3eThemeIconElement, value) => (icon.color = value), color);
});
Then("the theme icon primary fill changes", async ({ theme }) => {
  await expect.poll(async () => (await theme.readIconFills("#icon"))[1]).not.toBe(theme.initialIconFills[1]);
});

When("the theme icon variant changes to {string}", async ({ page }, variant: string) => {
  await page.locator("#icon").evaluate((icon, value) => icon.setAttribute("variant", value), variant);
});

When("the theme icon scheme changes to {string}", async ({ page }, scheme: string) => {
  await page.locator("#icon").evaluate((icon, value) => icon.setAttribute("scheme", value), scheme);
});
Then("the theme icon uses a dark scheme", async ({ page }) => {
  await expect.poll(() => page.locator("#icon").evaluate((icon: M3eThemeIconElement) => icon.isDark)).toBe(true);
});
Then("the theme icon surface fill changes", async ({ theme }) => {
  await expect.poll(async () => (await theme.readIconFills("#icon"))[0]).not.toBe(theme.initialIconFills[0]);
});
Then("the theme icon uses a light scheme", async ({ page }) => {
  await expect.poll(() => page.locator("#icon").evaluate((icon: M3eThemeIconElement) => icon.isDark)).toBe(false);
});
Then("the theme icon surface fill returns to its original color", async ({ theme }) => {
  await expect.poll(async () => (await theme.readIconFills("#icon"))[0]).toBe(theme.initialIconFills[0]);
});

Given("a theme icon with invalid options and a default theme icon", async ({ theme }) => {
  await theme.show(`<div><m3e-theme-icon id="icon" variant="invalid" scheme="invalid"></m3e-theme-icon>
    <m3e-theme-icon id="default"></m3e-theme-icon></div>`);
});
Then("the invalid theme icon uses neutral and auto", async ({ page }) => {
  expect(await page.locator("#icon").evaluate((icon: M3eThemeIconElement) => [icon.variant, icon.scheme])).toEqual([
    "neutral",
    "auto",
  ]);
});
Then("the invalid theme icon matches the default preview", async ({ theme }) => {
  await expect.poll(() => theme.readIconFills("#icon")).toEqual(await theme.readIconFills("#default"));
});

Given("a theme icon with custom preview colors", async ({ theme }) => {
  await theme.show(`<m3e-theme-icon id="icon" style="--m3e-theme-icon-container-color: rgb(1, 2, 3);
    --m3e-theme-icon-color: rgb(4, 5, 6)"></m3e-theme-icon>`);
});
Then("the theme icon displays the custom preview colors", async ({ theme }) => {
  expect(await theme.readIconFills("#icon")).toEqual(["rgb(1, 2, 3)", "rgb(4, 5, 6)"]);
});

Given("auto, light, and dark theme icons with a light system preference", async ({ theme, page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await theme.show(`<div id="icons"><m3e-theme-icon id="auto"></m3e-theme-icon>
    <m3e-theme-icon id="light" scheme="light"></m3e-theme-icon>
    <m3e-theme-icon id="dark" scheme="dark"></m3e-theme-icon></div>`);
});
Then("the auto theme icon matches the light preview", async ({ theme }) => {
  await expect.poll(() => theme.readIconFills("#auto")).toEqual(await theme.readIconFills("#light"));
});
When("the auto theme icon is reconnected", async ({ page }) => {
  await page.locator("#auto").evaluate((icon) => {
    const parent = icon.parentElement;
    if (!parent) throw new Error("Theme icon parent is missing.");
    icon.remove();
    parent.append(icon);
  });
});
When("the system changes to a {string} color scheme", async ({ page }, scheme: string) => {
  if (scheme !== "light" && scheme !== "dark") throw new RangeError(`Unknown color scheme: ${scheme}`);
  await page.emulateMedia({ colorScheme: scheme });
});
Then("the auto theme icon matches the dark preview", async ({ theme }) => {
  await expect.poll(() => theme.readIconFills("#auto")).toEqual(await theme.readIconFills("#dark"));
});

Then("the light theme icon uses a light scheme", async ({ page }) => {
  expect(await page.locator("#light").evaluate((icon: M3eThemeIconElement) => icon.isDark)).toBe(false);
});
Then("the dark theme icon uses a dark scheme", async ({ page }) => {
  expect(await page.locator("#dark").evaluate((icon: M3eThemeIconElement) => icon.isDark)).toBe(true);
});
