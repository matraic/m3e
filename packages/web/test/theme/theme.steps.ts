import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import type { M3eThemeElement } from "@m3e/web/theme";

import { expect, test as componentTest } from "../fixtures";
import { ThemeHarness } from "./theme.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ theme: ThemeHarness }>({
  theme: async ({ page, render }, use) => use(new ThemeHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a theme with motion scheme {string}", async ({ theme }, scheme: string) => {
  await theme.show(`<m3e-theme motion="${scheme}"><div id="probe"></div></m3e-theme>`);
});
Then("its spring durations are {string} milliseconds", async ({ theme }, durations: string) => {
  expect((await theme.readSprings("#probe")).map(Number.parseFloat)).toEqual(durations.split(",").map(Number));
});
Then("each spring token is a valid CSS transition", async ({ theme, page }) => {
  for (const value of await theme.readSprings("#probe")) {
    expect(await page.evaluate((token) => CSS.supports("transition", `opacity ${token}`), value), value).toBe(true);
  }
});

Given("an expressive theme containing a standard theme", async ({ theme }) => {
  await theme.show(`
    <m3e-theme motion="expressive">
      <div id="outer"></div>
      <m3e-theme motion="standard"><div id="inner"></div></m3e-theme>
    </m3e-theme>`);
});
Then("the outer content uses expressive spring durations", async ({ theme }) => {
  expect((await theme.readSprings("#outer")).map(Number.parseFloat)).toEqual([350, 500, 650, 150, 200, 300]);
});
Then("the inner content uses standard spring durations", async ({ theme }) => {
  expect((await theme.readSprings("#inner")).map(Number.parseFloat)).toEqual([350, 500, 750, 150, 200, 300]);
});

Given("an expressive theme containing standard and unknown motion schemes", async ({ theme }) => {
  await theme.show(`
    <m3e-theme motion="expressive">
      <m3e-theme id="standard" motion="standard"><div id="standard-probe"></div></m3e-theme>
      <m3e-theme id="unknown" motion="unknown"><div id="unknown-probe"></div></m3e-theme>
    </m3e-theme>`);
});
Then("the unknown motion scheme becomes {string}", async ({ theme }, value: string) => {
  expect(await theme.readProperty("#unknown", "motion")).toBe(value);
});
Then("its spring tokens match the standard theme", async ({ theme }) => {
  expect(await theme.readSprings("#unknown-probe")).toEqual(await theme.readSprings("#standard-probe"));
});

Given("an expressive theme containing a standard theme without linear easing support", async ({ render }) => {
  await render(
    `<m3e-theme motion="expressive"><div id="fallback-expressive"></div>
      <m3e-theme motion="standard"><div id="fallback-standard"></div></m3e-theme></m3e-theme>`,
    undefined,
    `const nativeSupports = CSS.supports.bind(CSS);
     CSS.supports = (property, value) =>
       property === "transition-timing-function" && value === "linear(0, 1)"
         ? false : nativeSupports(property, value);`,
  );
});
Then("both themes provide valid cubic-bezier spring transitions", async ({ theme, page }) => {
  for (const selector of ["#fallback-expressive", "#fallback-standard"]) {
    const springs = await theme.readSprings(selector);
    expect(springs).toHaveLength(6);
    for (const spring of springs) {
      expect(spring).toContain("cubic-bezier(");
      expect(await page.evaluate((value) => CSS.supports("transition", `opacity ${value}`), spring)).toBe(true);
    }
  }
});
Then("the nested standard springs differ from the expressive springs", async ({ theme }) => {
  expect(await theme.readSprings("#fallback-standard")).not.toEqual(await theme.readSprings("#fallback-expressive"));
});

Given("a light theme with source color {string}", async ({ theme }, color: string) => {
  await theme.show(`<m3e-theme color="${color}" scheme="light"><div id="probe"></div></m3e-theme>`);
  theme.initialPrimary = await theme.readPrimary();
});
Then("its primary color is a valid hex color", async ({ theme }) => {
  expect(await theme.readPrimary()).toMatch(/^#[0-9a-f]{6}$/i);
});
When("its color attribute changes to {string}", async ({ theme, page }, color: string) => {
  theme.changeDispatched = await page.evaluate(
    (value) =>
      new Promise<boolean>((resolve) => {
        const element = document.querySelector("m3e-theme")!;
        element.addEventListener("change", () => resolve(true), { once: true });
        element.setAttribute("color", value);
      }),
    color,
  );
});
Then("it dispatches a change event", ({ theme }) => {
  expect(theme.changeDispatched).toBe(true);
});
Then("its primary color changes", async ({ theme }) => {
  await expect.poll(() => theme.readPrimary()).not.toBe(theme.initialPrimary);
});

Given("a nested light theme with source color {string}", async ({ theme }, color: string) => {
  await theme.show(`
    <div id="nested">
      <m3e-theme id="theme" color="${color}" scheme="light"><div id="probe"></div></m3e-theme>
    </div>`);
  theme.initialPrimary = await theme.readPrimary();
});
When("the theme moves directly under the body", async ({ page }) => {
  await page.locator("#theme").evaluate((element) => document.body.append(element));
});
Then("its primary color remains unchanged", async ({ theme }) => {
  await expect.poll(() => theme.readPrimary()).toBe(theme.initialPrimary);
});
When("the theme moves back to its nested parent", async ({ page }) => {
  await page.locator("#theme").evaluate((element) => document.querySelector("#nested")!.append(element));
});

Given(
  "a light theme with source color {string} and variant {string}",
  async ({ theme }, color: string, variant: string) => {
    await theme.show(
      `<m3e-theme color="${color}" scheme="light" variant="${variant}"><div id="probe"></div></m3e-theme>`,
    );
  },
);

Given(
  "a theme with source color {string} and {string} set to {string}",
  async ({ theme }, color: string, attribute: string, value: string) => {
    await theme.show(`<m3e-theme color="${color}" ${attribute}="${value}"><div id="probe"></div></m3e-theme>`);
    theme.initialPrimary = await theme.readPrimary();
  },
);
When("its {string} attribute changes to {string}", async ({ page }, attribute: string, value: string) => {
  await page
    .locator("m3e-theme")
    .evaluate((element, [name, next]) => element.setAttribute(name, next), [attribute, value]);
});

When("its color property changes to {string}", async ({ page }, color: string) => {
  await page.locator("m3e-theme").evaluate((element: M3eThemeElement, value) => (element.color = value), color);
});

Given("the system prefers the {string} color scheme", async ({ page }, scheme: string) => {
  if (scheme !== "light" && scheme !== "dark") throw new RangeError(`Unknown color scheme: ${scheme}`);
  await page.emulateMedia({ colorScheme: scheme });
});
Given("an auto theme and a {string} theme", async ({ theme }, scheme: string) => {
  await theme.show(`
    <m3e-theme scheme="auto"><div id="auto"></div></m3e-theme>
    <m3e-theme scheme="${scheme}"><div id="explicit"></div></m3e-theme>`);
});
Then("their surface colors match", async ({ theme }) => {
  await expect
    .poll(() => theme.readToken("#auto", "--md-sys-color-surface"))
    .toBe(await theme.readToken("#explicit", "--md-sys-color-surface"));
});

Given("auto, light, and dark themes with a light system preference", async ({ theme, page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await theme.show(`<div><m3e-theme scheme="auto"><div id="auto"></div></m3e-theme>
    <m3e-theme scheme="light"><div id="light"></div></m3e-theme>
    <m3e-theme scheme="dark"><div id="dark"></div></m3e-theme></div>`);
});
Then("the auto theme matches the light theme", async ({ theme }) => {
  await expect
    .poll(() => theme.readToken("#auto", "--md-sys-color-surface"))
    .toBe(await theme.readToken("#light", "--md-sys-color-surface"));
});
When("the theme system preference changes to {string}", async ({ page }, scheme: string) => {
  if (scheme !== "light" && scheme !== "dark") throw new RangeError(`Unknown color scheme: ${scheme}`);
  await page.emulateMedia({ colorScheme: scheme });
});
Then("the auto theme matches the dark theme", async ({ theme }) => {
  await expect
    .poll(() => theme.readToken("#auto", "--md-sys-color-surface"))
    .toBe(await theme.readToken("#dark", "--md-sys-color-surface"));
});

Given("a theme with invalid scheme and contrast", async ({ theme }) => {
  await theme.show(`<m3e-theme id="live" scheme="invalid" contrast="invalid"></m3e-theme>`);
});
Then("the theme uses auto scheme and standard contrast", async ({ theme }) => {
  expect(await theme.readProperty("#live", "scheme")).toBe("auto");
  expect(await theme.readProperty("#live", "contrast")).toBe("standard");
});

Given("a theme with density {int}", async ({ theme }, density: number) => {
  await theme.show(`<m3e-theme density="${density}"><div id="probe"></div></m3e-theme>`);
});
Then("its density token is {int}", async ({ theme }, density: number) => {
  await expect
    .poll(async () => Number.parseFloat(await theme.readToken("#probe", "--md-sys-density-scale")))
    .toBe(density);
});

Given("a theme with strong focus {string}", async ({ theme }, state: string) => {
  if (state !== "enabled" && state !== "disabled") throw new RangeError(`Unknown strong focus state: ${state}`);
  await theme.show(`<m3e-theme ${state === "enabled" ? "strong-focus" : ""}><div id="probe"></div></m3e-theme>`);
});
Then("its focus ring visibility is {string}", async ({ theme }, visibility: string) => {
  await expect.poll(() => theme.readToken("#probe", "--m3e-focus-ring-visibility")).toBe(visibility);
});

When("its density property changes to {int}", async ({ page }, density: number) => {
  await page.locator("m3e-theme").evaluate((element: M3eThemeElement, value) => (element.density = value), density);
});

When("its strong focus property is enabled", async ({ page }) => {
  await page.locator("m3e-theme").evaluate((element: M3eThemeElement) => (element.strongFocus = true));
});

Given("a theme with invalid variant {string}", async ({ theme }, variant: string) => {
  await theme.show(`<m3e-theme id="live" variant="${variant}"></m3e-theme>`);
});
Then("its variant is {string}", async ({ theme }, variant: string) => {
  expect(await theme.readProperty("#live", "variant")).toBe(variant);
});
When("its {string} attribute is removed", async ({ theme }, attribute: string) => {
  await theme.removeAttribute("#live", attribute);
});

Given(
  "a fresh theme and a theme with {string} set to {string}",
  async ({ theme, page }, attribute: string, value: string) => {
    await page.emulateMedia({ colorScheme: "light" });
    await theme.show(`
    <m3e-theme id="fresh"><div id="fresh-probe"></div></m3e-theme>
    <m3e-theme id="live" ${attribute}="${value}"><div id="live-probe"></div></m3e-theme>`);
  },
);
Given(
  "the configured property {string} differs from the fresh theme",
  async ({ theme }, property: keyof M3eThemeElement) => {
    expect(await theme.readProperty("#live", property)).not.toBe(await theme.readProperty("#fresh", property));
  },
);
When("the configured theme's {string} attribute is removed", async ({ theme }, attribute: string) => {
  await theme.removeAttribute("#live", attribute);
});
Then(
  "its {string} property and derived tokens match the fresh theme",
  async ({ theme }, property: keyof M3eThemeElement) => {
    expect(await theme.readProperty("#live", property)).toBe(await theme.readProperty("#fresh", property));
    await expect.poll(() => theme.readTokens("#live-probe")).toEqual(await theme.readTokens("#fresh-probe"));
  },
);

Given("an image filled with {string}", async ({ page, render }, color: string) => {
  await render('<img id="source" alt="Source color">', undefined, "window.extractThemeColor = getColorFromImage;");
  await page.locator("#source").evaluate(async (image: HTMLImageElement, value) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 32;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas context is unavailable.");
    context.fillStyle = value;
    context.fillRect(0, 0, canvas.width, canvas.height);
    image.src = canvas.toDataURL();
    await image.decode();
  }, color);
});
When("its theme source color is extracted", async ({ theme, page }) => {
  theme.extractedColor = await page.locator("#source").evaluate((image: HTMLImageElement) => {
    const extract = (window as typeof window & { extractThemeColor: (image: HTMLImageElement) => Promise<string> })
      .extractThemeColor;
    return extract(image);
  });
});
Then("the extracted theme color is {string}", ({ theme }, color: string) => {
  expect(theme.extractedColor.toLowerCase()).toBe(color.toLowerCase());
});
