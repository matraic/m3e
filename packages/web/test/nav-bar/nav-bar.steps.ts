import { mergeTests } from "@playwright/test";
import type { M3eNavBarElement } from "@m3e/web/nav-bar";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { NavBarHarness } from "./nav-bar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ navBar: NavBarHarness }>({
  navBar: async ({ page, render }, use) => use(new NavBarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a navigation bar with home, search, and disabled settings destinations", ({ navBar }) => navBar.standard());
When("the navigation bar renders", async ({ navBar }) => navBar.render());
Then("the bar is exposed as the {string} navigation landmark", async ({ page }, name: string) =>
  expect(page.getByRole("navigation", { name })).toBeVisible(),
);
Then("destination {string} is the current page", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toHaveAttribute("aria-current", "true"),
);
Then("destination {string} is not the current page", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toHaveAttribute("aria-current", "false"),
);
Then("destinations do not expose selected or pressed states", async ({ navBar }) => {
  for (const item of await navBar.items.all()) {
    await expect(item).not.toHaveAttribute("aria-selected");
    await expect(item).not.toHaveAttribute("aria-pressed");
  }
});
Then("destination {string} is exposed as disabled", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toHaveAttribute("aria-disabled", "true"),
);
Then("only the icon of destination {string} is filled", async ({ navBar }, name: string) => {
  await expect(navBar.bar.locator("m3e-icon[filled]")).toHaveCount(1);
  await expect(navBar.destination(name).locator("m3e-icon")).toHaveAttribute("filled");
});

Given("a navigation bar with a linked destination", ({ navBar }) => navBar.linked());
Then("destination link {string} points to {string}", async ({ page }, name: string, href: string) =>
  expect(page.getByRole("link", { name })).toHaveAttribute("href", href),
);

When("the application listens for navigation events", async ({ navBar }) => navBar.recordEvents());
When("the user clicks destination {string}", async ({ navBar }, name: string) => navBar.destination(name).click());
Then("the bar reports {string} as selected", async ({ navBar }, value: string) =>
  expect.poll(() => navBar.selectedValue()).toBe(value),
);
Then("the navigation events {string} were dispatched", async ({ navBar }, events: string) =>
  expect.poll(() => navBar.events()).toEqual(events.split(", ")),
);

When("the user focuses destination {string}", async ({ navBar }, name: string) => navBar.destination(name).focus());
When("the user presses {string} on the navigation bar", async ({ page }, key: string) => page.keyboard.press(key));

When("the application cancels navigation changes", async ({ navBar }) =>
  navBar.bar.evaluate((bar) => bar.addEventListener("beforeinput", (e) => e.preventDefault())),
);

When("the user attempts to click disabled destination {string}", async ({ navBar }, name: string) =>
  navBar.destination(name).dispatchEvent("click"),
);
Then("no navigation events were dispatched", async ({ navBar }) => expect(await navBar.events()).toEqual([]));

Given("a navigation bar with a disabled interactive search destination", ({ navBar }) => navBar.disabledInteractive());
Then("destination {string} is focused", async ({ navBar }, name: string) =>
  expect(navBar.destination(name)).toBeFocused(),
);

When("the user focuses the control before the bar", async ({ page }) => page.locator("#before").focus());
Then("focus moves past the navigation bar", async ({ page }) => expect(page.locator("#after")).toBeFocused());

When("the application adds destination {string}", async ({ navBar }, name: string) => navBar.appendDestination(name));

When("the application adds selected destination {string}", async ({ navBar }, name: string) =>
  navBar.appendDestination(name, true),
);

When("the application removes destination {string}", async ({ navBar }, name: string) =>
  navBar.destination(name).evaluate((item) => item.remove()),
);
Then("the bar reports no selection", async ({ navBar }) => expect.poll(() => navBar.selectedValue()).toBeNull());
Then("the bar has {int} destinations", async ({ navBar }, count: number) => expect(navBar.items).toHaveCount(count));

Given("a compact primary bar and an expanded secondary bar", ({ navBar }) => navBar.primaryAndSecondary());
When("the application moves destination {string} to the secondary bar", async ({ navBar }, name: string) =>
  navBar.destination(name).evaluate((item) => document.querySelector("#secondary")!.append(item)),
);
Then("the primary bar has {int} destination", async ({ navBar }, count: number) =>
  expect(navBar.items).toHaveCount(count),
);
Then("destination {string} is laid out {string}", async ({ navBar }, name: string, orientation: string) =>
  expect(navBar.destination(name)).toHaveAttribute("orientation", orientation),
);

const small = { width: 400, height: 800 };
const large = { width: 1400, height: 800 };

Given("a navigation bar layout fixture", ({ navBar }) => navBar.layout());
When("the navigation bar layout renders", async ({ navBar }) => navBar.render());
Then("every destination is laid out {string}", async ({ navBar }, orientation: string) => {
  for (const item of await navBar.items.all()) {
    await expect(item).toHaveAttribute("orientation", orientation);
  }
});
When("the application sets the bar mode to {string}", async ({ navBar }, mode: string) =>
  navBar.bar.evaluate((bar, mode) => bar.setAttribute("mode", mode), mode),
);

Given("a navigation bar layout fixture in mode {string}", ({ navBar }, mode: string) =>
  navBar.layout(`mode="${mode}"`),
);
Then("the bar mode is {string}", async ({ navBar }, mode: string) => expect(navBar.bar).toHaveAttribute("mode", mode));

When("the application adds a layout destination", async ({ navBar }) => navBar.appendDestination("Added"));

Given("a small viewport", async ({ page }) => page.setViewportSize(small));
When("the viewport becomes large", async ({ page }) => page.setViewportSize(large));
When("the viewport becomes small", async ({ page }) => page.setViewportSize(small));

When("the application moves the bar to another container", async ({ navBar }) =>
  navBar.bar.evaluate((bar) => document.querySelector("#destination")!.append(bar)),
);

Given("a navigation bar layout fixture with bevel items and a round focus ring", ({ navBar }) =>
  navBar.layout(`style="--m3e-nav-item-shape-family: bevel; --m3e-nav-item-focus-ring-shape-family: round"`),
);
Then("the destination layers use the bevel shape", async ({ navBar }) => {
  for (const surface of await navBar.items.first().locator(".outer, .inner, m3e-selection-indicator.indicator").all()) {
    await expect(surface).toHaveCSS("corner-shape", "superellipse(0)");
  }
});
Then(
  "the destination focus ring is {word} with a {int}px radius",
  async ({ navBar }, shape: string, radius: number) => {
    const ring = navBar.items.first().locator(".focus-ring");
    await expect(ring).toHaveCSS("corner-shape", shape === "round" ? "superellipse(1)" : "superellipse(0)");
    await expect(ring).toHaveCSS("border-radius", `${radius}px`);
  },
);

Then("destination {string} has a visible navigation focus ring", async ({ navBar }, name: string) =>
  expect(navBar.destination(name).locator("m3e-focus-ring .outline")).toHaveClass(/visible/),
);
Then("destination {string} has no visible navigation focus ring", async ({ navBar }, name: string) =>
  expect(navBar.destination(name).locator("m3e-focus-ring .outline")).not.toHaveClass(/visible/),
);

When("the application enables destination {string}", async ({ navBar }, name: string) =>
  navBar.destination(name).evaluate((item) => item.removeAttribute("disabled")),
);

Given("a navigation bar with a separate selected icon", ({ navBar }) => {
  navBar.html = `<m3e-nav-bar id="bar">
    <m3e-nav-item value="home">
      <m3e-icon slot="icon" aria-hidden="true">home</m3e-icon>
      <m3e-icon id="selected-home-icon" slot="selected-icon" aria-hidden="true">favorite</m3e-icon>Home
    </m3e-nav-item>
    <m3e-nav-item value="search" selected>Search</m3e-nav-item>
  </m3e-nav-bar>`;
});
Then("the default Home icon is visible", async ({ navBar }) =>
  expect(navBar.destination("Home").locator('m3e-icon[slot="icon"]')).toBeVisible(),
);
Then("the selected Home icon is hidden", async ({ page }) => expect(page.locator("#selected-home-icon")).toBeHidden());
Then("the selected Home icon is visible", async ({ page }) =>
  expect(page.locator("#selected-home-icon")).toBeVisible(),
);
Then("the default Home icon is hidden", async ({ navBar }) =>
  expect(navBar.destination("Home").locator('m3e-icon[slot="icon"]')).toBeHidden(),
);

When("the application adds a selected Home icon", async ({ navBar }) =>
  navBar.destination("Home").evaluate((item) => {
    const icon = document.createElement("m3e-icon");
    icon.id = "selected-home-icon";
    icon.slot = "selected-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "favorite";
    item.append(icon);
  }),
);
When("the application removes the selected Home icon", async ({ page }) =>
  page.locator("#selected-home-icon").evaluate((icon) => icon.remove()),
);

Given("a navigation bar with a fragment link", ({ navBar }) => {
  navBar.html = `<m3e-nav-bar id="bar" aria-label="Primary">
    <m3e-nav-item id="home-link" value="home" href="#home-page">Home</m3e-nav-item>
  </m3e-nav-bar>`;
});
When("the user activates the Home link using {string}", async ({ page }, activation: string) => {
  const link = page.getByRole("link", { name: "Home", exact: true });
  if (activation === "pointer") {
    await link.locator(".outer > a").click();
  } else {
    await link.focus();
    await page.keyboard.press(activation);
  }
});
Then("the navigation bar page fragment is {string}", async ({ page }, hash: string) =>
  expect.poll(() => page.evaluate(() => location.hash)).toBe(hash),
);
Then("the Home navigation link is current", async ({ page }) =>
  expect(page.getByRole("link", { name: "Home", exact: true })).toHaveAttribute("aria-current", "true"),
);

Given("a navigation bar with an external link", async ({ navBar, page }) => {
  await page
    .context()
    .route("https://m3e.test/**", (route) =>
      route.fulfill({ contentType: "text/html", body: "<title>Destination</title>" }),
    );
  navBar.html = `<m3e-nav-bar id="bar">
    <m3e-nav-item id="home-link" href="https://m3e.test/home">Home</m3e-nav-item>
  </m3e-nav-bar>`;
});
When("the user opens the Home link in a new tab", async ({ page }) => {
  const [popup] = await Promise.all([
    page.context().waitForEvent("page"),
    page.locator("#home-link .outer > a").click({ modifiers: ["Control"] }),
  ]);
  await expect(popup).toHaveURL("https://m3e.test/home");
  await popup.close();
  await expect(page).toHaveURL("about:blank");
});

Given("a navigation bar with a disabled fragment link", ({ navBar }) => {
  navBar.html = `<m3e-nav-bar id="bar">
    <m3e-nav-item id="home-link" value="home" href="#home-page" disabled>Home</m3e-nav-item>
  </m3e-nav-bar>`;
});
When("the application dispatches a click on the Home link", async ({ page }) =>
  page.locator("#home-link").dispatchEvent("click"),
);

Then("the primary bar tracks destinations {string} with matching owners", async ({ navBar }, values: string) =>
  expect.poll(() => navBar.membership()).toEqual({ values: values.split(", "), ownersMatch: true }),
);

Then("the secondary bar tracks destinations {string} with matching owners", async ({ navBar }, values: string) =>
  expect.poll(() => navBar.membership("#secondary")).toEqual({ values: values.split(", "), ownersMatch: true }),
);

Then("the effective navigation bar mode is {string}", async ({ navBar }, mode: string) =>
  expect.poll(() => navBar.bar.evaluate((bar: M3eNavBarElement) => bar.currentMode)).toBe(mode),
);
