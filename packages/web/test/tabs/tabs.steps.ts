import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eTabsElement } from "@m3e/web/tabs";

import { expect, test as componentTest } from "../fixtures";
import { TabsHarness } from "./tabs.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ tabs: TabsHarness }>({
  tabs: async ({ page, render }, use) => use(new TabsHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("tabs with {string} initially selected", ({ tabs }, name: string) => {
  tabs.selected = ["Videos", "Photos", "Audio"].indexOf(name);
});
Given("the tabs attribute {string} is {string}", ({ tabs }, name: string, value: string) => {
  tabs.attributes.set(name, value);
});
When("the tabs component renders", async ({ tabs }) => tabs.render());
When("the application sets the tabs shape families", async ({ tabs }) =>
  tabs.group.evaluate((group) => {
    group.style.setProperty("--m3e-tabs-primary-active-indicator-shape-family", "bevel");
    group.style.setProperty("--m3e-tab-focus-ring-shape-family", "round");
  }),
);
Then("the primary tabs indicator has {string} corners", async ({ tabs }, radius: string) => {
  await expect(tabs.indicator).toHaveCSS("corner-shape", "superellipse(0)");
  await expect(tabs.indicator).toHaveCSS("border-radius", radius);
});
When("the application sets tabs {string} to {string}", async ({ tabs }, name: string, value: string) =>
  tabs.setAttribute(name, value),
);
Then("tab focus rings and state layers keep their own shapes", async ({ tabs }) => {
  for (const ring of await tabs.group.locator("m3e-tab .focus-ring").all()) {
    await expect(ring).toHaveCSS("corner-shape", "superellipse(1)");
    await expect(ring).toHaveCSS("border-radius", "16px");
  }
  await expect(tabs.group.locator("m3e-tab .state-layer").first()).toHaveCSS("border-radius", "0px");
});
Then("the secondary tabs indicator has square round-family corners", async ({ tabs }) => {
  await expect(tabs.indicator).toHaveCSS("corner-shape", "superellipse(1)");
  await expect(tabs.indicator).toHaveCSS("border-radius", "0px");
});

Given("a tabs component", ({ tabs }) => {
  tabs.selected = -1;
});
Then("the tabs expose a tablist and three tabs with panel relationships", async ({ tabs }) => {
  await expect(tabs.group.getByRole("tablist")).toBeVisible();
  await expect(tabs.tabs).toHaveCount(3);
  await expect(tabs.tab("Photos")).toHaveAttribute("aria-controls", "p2");
  await expect(tabs.panels.first()).toHaveAttribute("role", "tabpanel");
});

Then("the selected tab index is {int}", async ({ tabs }, index: number) => expect.poll(() => tabs.index()).toBe(index));
Then("only the tab named {string} is selected", async ({ tabs }, name: string) => {
  await expect(tabs.tab(name)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.group.locator('m3e-tab[aria-selected="true"]')).toHaveCount(1);
  await expect(tabs.group.locator('m3e-tab[aria-selected="false"]')).toHaveCount((await tabs.tabs.count()) - 1);
});
When("the application records tab selection events", async ({ tabs }) => tabs.recordEvents());
When("the user clicks the tab named {string}", async ({ tabs }, name: string) => tabs.tab(name).click());
Then("only the panel named {string} is visible", async ({ tabs }, name: string) => {
  const id = await tabs.tab(name).getAttribute("aria-controls");
  for (const panel of await tabs.panels.all()) {
    if ((await panel.getAttribute("id")) === id) {
      await expect(panel).toBeVisible();
      await expect(panel).not.toHaveAttribute("inert");
    } else {
      await expect(panel).toBeHidden();
      await expect(panel).toHaveAttribute("inert", "");
    }
  }
});
Then("the tabs emit beforeinput, input, and change in order", async ({ tabs }) =>
  expect.poll(() => tabs.events()).toEqual(["beforeinput", "input", "change"]),
);

When("the application cancels activation of the tab named {string}", async ({ tabs }, name: string) =>
  tabs.tab(name).evaluate((tab) => tab.addEventListener("beforeinput", (event) => event.preventDefault())),
);
Then("the tabs emit only beforeinput", async ({ tabs }) => expect(await tabs.events()).toEqual(["beforeinput"]));
When("the application selects tab index {int}", async ({ tabs }, index: number) => tabs.setIndex(index));
Then("no tab is selected and all panels are hidden", async ({ tabs }) => {
  await expect(tabs.group.locator("m3e-tab[selected]")).toHaveCount(0);
  for (const panel of await tabs.panels.all()) {
    await expect(panel).toBeHidden();
    await expect(panel).toHaveAttribute("inert", "");
  }
});

When("the user focuses the tab named {string}", async ({ tabs }, name: string) => tabs.tab(name).focus());
When("the user presses {string} in the tabs", async ({ tabs }, key: string) => tabs.page.keyboard.press(key));
Then("the tab named {string} has focus", async ({ tabs }, name: string) => expect(tabs.tab(name)).toBeFocused());

Given("the tab named {string} is disabled", ({ tabs }, name: string) => {
  tabs.disabled.add(["Videos", "Photos", "Audio"].indexOf(name));
});
Then("the tab named {string} is unavailable", async ({ tabs }, name: string) =>
  expect(tabs.tab(name)).toHaveAttribute("aria-disabled", "true"),
);
When("a click is dispatched to the tab named {string}", async ({ tabs }, name: string) =>
  tabs.tab(name).dispatchEvent("click"),
);

Then("the tabs variant is {string}", async ({ tabs }, value: string) =>
  expect.poll(() => tabs.group.evaluate((group) => (group as M3eTabsElement).variant)).toBe(value),
);
Then("the tabs attribute {string} equals {string}", async ({ tabs }, name: string, value: string) =>
  expect(tabs.group).toHaveAttribute(name, value),
);
Then("the tablist is below the selected panel", async ({ tabs }) => {
  const list = (await tabs.group.getByRole("tablist").boundingBox())!;
  const panel = (await tabs.panels.nth(await tabs.index()).boundingBox())!;
  expect(list.y).toBeGreaterThan(panel.y);
});
Then("the tabs fill their header width", async ({ tabs }) => {
  const widths = await tabs.tabs.evaluateAll((elements) => elements.map((tab) => tab.getBoundingClientRect().width));
  expect(widths.reduce((sum, width) => sum + width, 0)).toBeGreaterThanOrEqual(tabs.width - 5);
});

Then("tabs pagination is enabled", async ({ tabs }) =>
  expect.poll(() => tabs.group.evaluate((group) => (group as M3eTabsElement).disablePagination)).toBe(false),
);
When("the application sets tabs pagination mode to {string}", async ({ tabs }, mode: string) =>
  tabs.group.evaluate((group, mode) => {
    (group as M3eTabsElement).disablePagination = mode === "auto" ? "auto" : mode === "disabled";
  }, mode),
);
Then("tabs pagination mode is automatic", async ({ tabs }) =>
  expect.poll(() => tabs.group.evaluate((group) => (group as M3eTabsElement).disablePagination)).toBe("auto"),
);
Then("the tabs have no disable-pagination attribute", async ({ tabs }) =>
  expect(tabs.group).not.toHaveAttribute("disable-pagination"),
);

Given("overflowing tabs", ({ tabs }) => {
  tabs.count = 10;
  tabs.width = 300;
});
Then("the tabs paging buttons are named {string} and {string}", async ({ tabs }, previous: string, next: string) => {
  await expect(tabs.group.getByRole("button", { name: previous, exact: true })).toBeVisible();
  await expect(tabs.group.getByRole("button", { name: next, exact: true })).toBeVisible();
});
When("the application adds an unselected tab", async ({ tabs }) => tabs.addTab());
Then("the tabs track {int} tabs", async ({ tabs }, count: number) =>
  expect.poll(() => tabs.group.evaluate((group) => (group as M3eTabsElement).tabs.length)).toBe(count),
);

Then("the selected tab identifies its panel and the panel is named by its tab", async ({ tabs }) => {
  const tab = tabs.tabs.nth(await tabs.index());
  const panel = tabs.group.locator(`#${await tab.getAttribute("aria-controls")}`);
  await expect(panel).toHaveAccessibleName((await tab.textContent())!.trim());
});
Given("the tabs have decorative icons", ({ tabs }) => {
  tabs.icons = true;
});
Then("the tab names exclude decorative icons", async ({ tabs }) => {
  for (let i = 0; i < 3; i++) await expect(tabs.tabs.nth(i)).toHaveAccessibleName(tabs.name(i));
});
Then("only the tab named {string} is in the tab order", async ({ tabs }, name: string) => {
  await expect(tabs.tab(name)).toHaveAttribute("tabindex", "0");
  await expect(tabs.group.locator('m3e-tab[tabindex="0"]')).toHaveCount(1);
});
Then("the tabs emit no selection events", async ({ tabs }) => expect(await tabs.events()).toEqual([]));

Given("the tab panels contain buttons", ({ tabs }) => {
  tabs.interactivePanels = true;
});
When("the user tabs into the tabs component", async ({ tabs }) => {
  await tabs.page.locator("#before").focus();
  await tabs.page.keyboard.press("Tab");
});
Then("the selected panel action has focus", async ({ tabs }) => {
  await expect(
    tabs.group.getByRole("button", { name: `${tabs.name(await tabs.index())} action`, exact: true }),
  ).toBeFocused();
});
Then("focus is after the tabs component", async ({ tabs }) => expect(tabs.page.locator("#after")).toBeFocused());
When("the application selects the tab named {string}", async ({ tabs }, name: string) => tabs.select(name, true));
When("the application deselects the tab named {string}", async ({ tabs }, name: string) => tabs.select(name, false));
Then("the tabs indicator has no width", async ({ tabs }) => expect(tabs.indicator).toHaveCSS("width", "0px"));

Given("the tabs document reads right to left", ({ tabs }) => {
  tabs.direction = "rtl";
});
When("the tabs document changes to right to left", async ({ tabs }) =>
  tabs.page.locator("body").evaluate((body) => body.setAttribute("dir", "rtl")),
);

When("the application disables the tab named {string}", async ({ tabs }, name: string) =>
  tabs.tab(name).evaluate((tab) => tab.setAttribute("disabled", "")),
);
When("the application enables the tab named {string}", async ({ tabs }, name: string) =>
  tabs.tab(name).evaluate((tab) => tab.removeAttribute("disabled")),
);
Then("the tab named {string} is available", async ({ tabs }, name: string) =>
  expect(tabs.tab(name)).not.toHaveAttribute("aria-disabled", "true"),
);
Then("no tab is in the tab order", async ({ tabs }) =>
  expect(tabs.group.locator('m3e-tab[tabindex="0"]')).toHaveCount(0),
);

When("the application adds a selected tab", async ({ tabs }) => tabs.addTab(true));
When("the application removes the tab named {string}", async ({ tabs }, name: string) =>
  tabs.tab(name).evaluate((tab) => tab.remove()),
);
Then("the tabs panel {string} has no tab label references", async ({ tabs }, id: string) => {
  await expect(tabs.group.locator(`#${id}`)).not.toHaveAttribute("aria-labelledby");
});
When("the application reconnects the tab named {string}", async ({ tabs }, name: string) =>
  tabs.tab(name).evaluate((tab) => {
    const next = tab.nextSibling;
    const parent = tab.parentNode!;
    tab.remove();
    parent.insertBefore(tab, next);
  }),
);
Then("the tab named {string} controls only panel {string}", async ({ tabs }, name: string, id: string) =>
  expect(tabs.tab(name)).toHaveAttribute("aria-controls", id),
);
When("the application moves the tabs component twice", async ({ tabs }) => {
  await tabs.move();
  await tabs.move();
});
When(
  "the application links the tab named {string} to the {string} panel",
  async ({ tabs }, name: string, panel: string) => {
    const id = await tabs.tab(panel).getAttribute("aria-controls");
    await tabs.tab(name).evaluate((tab, id) => tab.setAttribute("for", id!), id);
  },
);
Then(
  "the tabs panel {string} is labelled by tabs {string} and {string}",
  async ({ tabs }, id: string, first: string, second: string) => {
    const firstId = await tabs.tab(first).getAttribute("id");
    const secondId = await tabs.tab(second).getAttribute("id");
    await expect(tabs.group.locator(`#${id}`)).toHaveAttribute("aria-labelledby", `${firstId} ${secondId}`);
  },
);

Then("the selected tab is fully within the tabs scroll viewport", async ({ tabs }) => {
  await expect
    .poll(async () => {
      const tab = (await tabs.tabs.nth(await tabs.index()).boundingBox())!;
      const viewport = (await tabs.scroller.boundingBox())!;
      return tab.x >= viewport.x - 1 && tab.x + tab.width <= viewport.x + viewport.width + 1;
    })
    .toBe(true);
});
Then("the tabs have no paging controls", async ({ tabs }) =>
  expect(tabs.group.locator("m3e-slide-group .prev-button, m3e-slide-group .next-button")).toHaveCount(0),
);
Given("the tabs have custom paging icons", ({ tabs }) => {
  tabs.customPagingIcons = true;
});
Then("the custom tabs paging icons are visible", async ({ tabs }) => {
  await expect(tabs.group.getByText("Back icon")).toBeVisible();
  await expect(tabs.group.getByText("Forward icon")).toBeVisible();
});

Given("an empty tabs component", ({ tabs }) => {
  tabs.empty = true;
});

When("the user swipes the selected tab panel {string}", async ({ tabs }, direction: "left" | "right") =>
  tabs.swipe(direction),
);
When("the user cancels a left swipe on the selected tab panel", async ({ tabs }) => tabs.swipe("left", "touchCancel"));
Then("tab panels have no lingering swipe offsets", async ({ tabs }) => {
  await expect(tabs.slide).not.toHaveClass(/sliding/);
  for (const panel of await tabs.panels.all()) {
    expect(await panel.evaluate((panel) => panel.style.getPropertyValue("--_tabs-slide-offset-x"))).toBe("");
    expect(await panel.evaluate((panel) => panel.style.getPropertyValue("--_tabs-slide-visibility"))).toBe("");
  }
});
Then(
  "swipe selection events describe a change from index {int} to {int} on tab {string}",
  async ({ tabs }, previous: number, selected: number, name: string) => {
    const target = await tabs.tab(name).getAttribute("id");
    const details = await tabs.group.evaluate((group) => JSON.parse(group.dataset.eventDetails!));
    expect(details).toEqual([
      { type: "beforeinput", index: previous, target, cancelable: true },
      { type: "input", index: selected, target, cancelable: false },
      { type: "change", index: selected, target: "", cancelable: false },
    ]);
  },
);
When("the user swipes left on the selected panel button", async ({ tabs }) => tabs.swipe("left", "touchEnd", true));

Given("the tabs allow motion", ({ tabs }) => {
  tabs.reducedMotion = false;
});
Then("the tabs indicator aligns with the selected tab", async ({ tabs }) => {
  await expect
    .poll(async () => {
      const indicator = (await tabs.indicator.boundingBox())!;
      const tab = tabs.tabs.nth(await tabs.index());
      const label = (await tab.locator(".label").boundingBox())!;
      return Math.abs(indicator.x + indicator.width / 2 - label.x - label.width / 2);
    })
    .toBeLessThan(3);
});
Then("the tabs indicator has no transition", async ({ tabs }) =>
  expect(tabs.indicator).toHaveCSS("transition-duration", "0s"),
);
