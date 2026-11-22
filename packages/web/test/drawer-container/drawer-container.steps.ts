import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eDrawerContainerElement } from "@m3e/web/drawer-container";

import { expect, test as componentTest } from "../fixtures";
import { DrawerContainerHarness } from "./drawer-container.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ drawer: DrawerContainerHarness }>({
  drawer: async ({ page, render }, use) => use(new DrawerContainerHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a drawer container", () => {});
When("the drawer container renders", async ({ drawer }) => drawer.render());
Then("the start drawer is attached but hidden", async ({ drawer }) => {
  await expect(drawer.start).toBeAttached();
  await expect(drawer.start).toBeHidden();
});
Then("the main drawer content is visible", async ({ page }) => expect(page.locator("#drawer-main")).toBeVisible());
Then("the closed start navigation is excluded from the accessibility tree", async ({ drawer }) =>
  expect.poll(() => drawer.accessibility("#navigation")).toMatchObject({ ignored: true }),
);
Then("the main landmark is accessible", async ({ drawer }) =>
  expect.poll(() => drawer.accessibility("main")).toMatchObject({ ignored: false, role: "main" }),
);
Then("the default drawer modes are side", async ({ drawer }) =>
  expect
    .poll(() =>
      drawer.container.evaluate((container: M3eDrawerContainerElement) => [container.startMode, container.endMode]),
    )
    .toEqual(["side", "side"]),
);
When("the drawer viewport is {int} pixels wide", async ({ page }, width: number) =>
  page.setViewportSize({ width, height: 640 }),
);
Then("the start drawer width is {string}", async ({ drawer }, width: string) =>
  expect(drawer.start).toHaveCSS("width", width),
);
When("the application sets the drawer scrim minimum space to {string}", async ({ drawer }, size: string) =>
  drawer.container.evaluate(
    (container, value) => container.style.setProperty("--m3e-drawer-container-scrim-min-space", value),
    size,
  ),
);

Given("a drawer container with oversized start drawer widths", ({ drawer }) => {
  drawer.containerStyle = "--m3e-drawer-container-width: 400px";
  drawer.startStyle = "width: 400px";
});

Given("a drawer container with both side drawers open", ({ drawer }) => {
  drawer.attributes = "start end start-mode=side end-mode=side";
});
Then("the start drawer is open", async ({ drawer }) => expect(drawer.container).toHaveAttribute("start", ""));
Then("the end drawer is open", async ({ drawer }) => expect(drawer.container).toHaveAttribute("end", ""));
Then("the start drawer is visible", async ({ drawer }) => expect(drawer.start).toBeVisible());
Then("the end drawer is visible", async ({ drawer }) => expect(drawer.end).toBeVisible());
Then("the main drawer content is interactive", async ({ page, drawer }) => {
  await expect(drawer.container.locator(".content")).not.toHaveAttribute("inert");
  await expect(page.locator("#drawer-main")).toBeEnabled();
});
Then("the start navigation landmark is accessible", async ({ drawer }) =>
  expect
    .poll(() => drawer.accessibility("#navigation"))
    .toMatchObject({
      ignored: false,
      role: "navigation",
      name: "Primary navigation",
    }),
);

Given("a drawer container with an open start over drawer and an end push drawer", ({ drawer }) => {
  drawer.attributes = 'start start-mode="over" end-mode="push"';
});
When("the application opens the end drawer", async ({ drawer }) =>
  drawer.container.evaluate((container: M3eDrawerContainerElement) => {
    container.end = true;
  }),
);
Then("the start drawer is closed", async ({ drawer }) => expect(drawer.container).not.toHaveAttribute("start"));

Given("a drawer container with both modes set to {string}", ({ drawer }, mode: string) => {
  drawer.attributes = `start end start-mode="${mode}" end-mode="${mode}"`;
});
Then("the drawer modes are {string} and {string}", async ({ drawer }, start: string, end: string) => {
  await expect
    .poll(() =>
      drawer.container.evaluate((container: M3eDrawerContainerElement) => [container.startMode, container.endMode]),
    )
    .toEqual([start, end]);
  await expect(drawer.container).toHaveAttribute("start-mode", start);
  await expect(drawer.container).toHaveAttribute("end-mode", end);
});

Given("a drawer container with an open automatic start drawer", ({ drawer }) => {
  drawer.attributes = 'start start-mode="auto"';
});
When("the application observes drawer changes", async ({ drawer }) => drawer.observeChanges());
Then("the start drawer uses {string} mode", async ({ drawer }, mode: string) =>
  expect
    .poll(() => drawer.container.evaluate((container, state) => container.matches(`:state(--start-${state})`), mode))
    .toBe(true),
);
Then("the drawer container dispatches {int} change event(s)", async ({ drawer }, count: number) =>
  expect(drawer.container).toHaveAttribute("data-changes", String(count)),
);
When("the application opens the start drawer", async ({ drawer }) =>
  drawer.container.evaluate((container: M3eDrawerContainerElement) => {
    container.start = true;
  }),
);

Given("a drawer container with both side dividers", ({ drawer }) => {
  drawer.attributes = "start end start-divider end-divider";
});
Then("both drawer divider attributes are present", async ({ drawer }) => {
  await expect(drawer.container).toHaveAttribute("start-divider", "");
  await expect(drawer.container).toHaveAttribute("end-divider", "");
});
Then("the side drawers draw divider borders", async ({ drawer }) =>
  expect.poll(() => drawer.borders()).toEqual({ start: true, end: true }),
);
Then("both drawer divider attributes are absent", async ({ drawer }) => {
  await expect(drawer.container).not.toHaveAttribute("start-divider");
  await expect(drawer.container).not.toHaveAttribute("end-divider");
});
Then("the side drawers do not draw divider borders", async ({ drawer }) =>
  expect.poll(() => drawer.borders()).toEqual({ start: false, end: false }),
);

Given("a drawer container with only the {word} divider", ({ drawer }, side: string) => {
  if (side !== "start" && side !== "end") throw new Error(`Unknown drawer side: ${side}`);
  drawer.attributes = `start end ${side}-divider`;
});
Then("only the {word} drawer draws a divider border", async ({ drawer }, side: string) => {
  if (side !== "start" && side !== "end") throw new Error(`Unknown drawer side: ${side}`);
  await expect.poll(() => drawer.borders()).toEqual({ start: side === "start", end: side === "end" });
});

Given("a start over drawer with a toggle", ({ drawer }) => {
  drawer.attributes = 'start-mode="over"';
  drawer.toggleSide = "start";
});
Then("the drawer toggle controls {string}", async ({ drawer }, id: string) =>
  expect(drawer.toggle).toHaveAttribute("aria-controls", id),
);
Then("the drawer toggle is collapsed", async ({ drawer }) =>
  expect(drawer.toggle).toHaveAttribute("aria-expanded", "false"),
);
Then("the drawer toggle has no pressed state", async ({ drawer }) =>
  expect(drawer.toggle).not.toHaveAttribute("aria-pressed"),
);
When("the user clicks the drawer toggle", async ({ drawer }) => drawer.toggle.click());
Then("the drawer toggle is expanded and selected", async ({ drawer }) => {
  await expect(drawer.toggle).toHaveAttribute("aria-expanded", "true");
  await expect(drawer.toggle).toHaveAttribute("selected", "");
});
Then("the drawer toggle is collapsed and unselected", async ({ drawer }) => {
  await expect(drawer.toggle).toHaveAttribute("aria-expanded", "false");
  await expect(drawer.toggle).not.toHaveAttribute("selected");
});

Given("an end over drawer with a toggle", ({ drawer }) => {
  drawer.attributes = 'end-mode="over"';
  drawer.toggleSide = "end";
});
When("the user clicks the drawer scrim", async ({ drawer }) => drawer.container.locator(".scrim").click());

Given("an open start {string} drawer with focusable content", ({ drawer }, mode: string) => {
  drawer.attributes = `start start-mode="${mode}"`;
  drawer.focusable = true;
});
Then("the main drawer content is inert", async ({ drawer }) =>
  expect(drawer.container.locator(".content")).toHaveAttribute("inert", ""),
);
Then("the main landmark is excluded from the accessibility tree", async ({ drawer }) =>
  expect.poll(() => drawer.accessibility("main")).toMatchObject({ ignored: true }),
);
When("the user tabs from the last start drawer action", async ({ page }) => {
  await page.locator("#drawer-last").focus();
  await page.keyboard.press("Tab");
});
Then("focus remains in the start drawer", async ({ page }) => expect(page.locator("#drawer-first")).toBeFocused());

Given("an open side start drawer and a closed over end drawer", ({ drawer }) => {
  drawer.attributes = 'start start-mode="side" end-mode="over"';
});

Given("an open side end drawer and a closed push start drawer", ({ drawer }) => {
  drawer.attributes = 'end start-mode="push" end-mode="side"';
});
When("the application moves the drawer container to a new parent", async ({ drawer }) =>
  drawer.container.evaluate((container) => {
    const parent = document.createElement("div");
    parent.id = "drawer-new-parent";
    document.body.append(parent);
    parent.append(container);
  }),
);
Then("the drawer container is in its new parent", async ({ page }) =>
  expect(page.locator("#drawer-new-parent > m3e-drawer-container")).toHaveCount(1),
);
Then("the main drawer content is offset for the start drawer", async ({ drawer }) =>
  expect
    .poll(() =>
      drawer.container
        .locator(".content")
        .evaluate((content) => parseFloat(getComputedStyle(content).marginInlineStart)),
    )
    .toBeGreaterThan(0),
);
When("the application moves the drawer toggle to a new button", async ({ page }) =>
  page.locator("m3e-drawer-toggle").evaluate((toggle) => {
    const target = document.querySelector("#drawer-other-trigger");
    if (!target) throw new Error("New drawer toggle button is missing.");
    target.append(toggle);
  }),
);
Then("the original drawer toggle has no drawer semantics", async ({ drawer }) => {
  await expect(drawer.toggle).not.toHaveAttribute("aria-controls");
  await expect(drawer.toggle).not.toHaveAttribute("aria-expanded");
});
Then("the new drawer toggle controls {string}", async ({ page }, id: string) =>
  expect(page.locator("#drawer-other-trigger")).toHaveAttribute("aria-controls", id),
);
When("the user clicks the original drawer toggle", async ({ drawer }) => drawer.toggle.click());
When("the user clicks the new drawer toggle", async ({ page }) => page.locator("#drawer-other-trigger").click());
Then("the new drawer toggle is expanded", async ({ page }) =>
  expect(page.locator("#drawer-other-trigger")).toHaveAttribute("aria-expanded", "true"),
);
When("the application retargets the drawer toggle to {string}", async ({ page }, id: string) =>
  page.locator("m3e-drawer-toggle").evaluate((toggle, value) => toggle.setAttribute("for", value), id),
);

Given("an open end {string} drawer with focusable content", ({ drawer }, mode: string) => {
  drawer.attributes = `end end-mode="${mode}"`;
  drawer.endFocusable = true;
});
When("the user tabs from the last end drawer action", async ({ page }) => {
  await page.locator("#end-last").focus();
  await page.keyboard.press("Tab");
});
Then("focus moves to the first end drawer action", async ({ page }) =>
  expect(page.locator("#end-first")).toBeFocused(),
);
When("the user shift-tabs from the first end drawer action", async ({ page }) => {
  await page.locator("#end-first").focus();
  await page.keyboard.press("Shift+Tab");
});
Then("focus moves to the last end drawer action", async ({ page }) => expect(page.locator("#end-last")).toBeFocused());
Then("the end drawer is closed", async ({ drawer }) => expect(drawer.container).not.toHaveAttribute("end"));

Given("an open start side drawer {int} pixels wide", ({ drawer }, width: number) => {
  drawer.attributes = 'start start-mode="side"';
  drawer.startStyle = `width: ${width}px`;
});
Then("the main drawer content has a left offset of {int} pixels", async ({ drawer }, offset: number) =>
  expect(drawer.container.locator(".content")).toHaveCSS("margin-left", `${offset}px`),
);
When("the application changes the start drawer mode to {string}", async ({ drawer }, mode: string) =>
  drawer.container.evaluate((container, value) => container.setAttribute("start-mode", value), mode),
);
Then("the drawer scrim is visible", async ({ drawer }) => expect(drawer.container.locator(".scrim")).toBeVisible());
Then("the drawer scrim is hidden", async ({ drawer }) => expect(drawer.container.locator(".scrim")).toBeHidden());
When("the application changes the start drawer width to {int} pixels", async ({ drawer }, width: number) =>
  drawer.start.evaluate((element, value) => {
    element.style.width = `${value}px`;
  }, width),
);

Given("a right-to-left drawer container with open side drawers", ({ drawer }) => {
  drawer.attributes = "start end";
  drawer.direction = "rtl";
});
Then("the start drawer is at the right edge and the end drawer is at the left edge", async ({ drawer }) => {
  await expect
    .poll(() =>
      drawer.container.evaluate((container) => {
        const start = container.querySelector("#navigation");
        const end = container.querySelector("#details");
        if (!start || !end) throw new Error("Drawer content is missing.");
        const bounds = container.getBoundingClientRect();
        return {
          start: Math.abs(start.getBoundingClientRect().right - bounds.right),
          end: Math.abs(end.getBoundingClientRect().left - bounds.left),
        };
      }),
    )
    .toEqual({ start: 0, end: 0 });
});
Then("the main content offsets match the drawer widths in right-to-left layout", async ({ drawer }) => {
  await expect
    .poll(() =>
      drawer.container.evaluate((container) => {
        const start = container.querySelector("#navigation");
        const end = container.querySelector("#details");
        const content = container.shadowRoot?.querySelector(".content");
        if (!start || !end || !content) throw new Error("Drawer layout elements are missing.");
        const style = getComputedStyle(content);
        return {
          start: parseFloat(style.marginRight) - start.getBoundingClientRect().width,
          end: parseFloat(style.marginLeft) - end.getBoundingClientRect().width,
        };
      }),
    )
    .toEqual({ start: 0, end: 0 });
});
Then("the new drawer toggle is selected", async ({ page }) =>
  expect(page.locator("#drawer-other-trigger")).toHaveAttribute("selected", ""),
);
Then("the new drawer toggle is collapsed and unselected", async ({ page }) => {
  await expect(page.locator("#drawer-other-trigger")).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("#drawer-other-trigger")).not.toHaveAttribute("selected");
});

Given("two drawer containers and a start drawer toggle", ({ drawer }) => {
  drawer.attributes = 'start-mode="over"';
  drawer.toggleSide = "start";
  drawer.secondContainer = true;
});
When("the other container opens without dispatching a change event", async ({ page }) =>
  page.locator("#other-container").evaluate(async (container: M3eDrawerContainerElement) => {
    container.start = true;
    await container.updateComplete;
  }),
);
When("the original container dispatches a change event", async ({ drawer }) =>
  drawer.container.evaluate((container) => container.dispatchEvent(new Event("change", { bubbles: true }))),
);
When("the other container dispatches a change event", async ({ page }) =>
  page
    .locator("#other-container")
    .evaluate((container) => container.dispatchEvent(new Event("change", { bubbles: true }))),
);
Then("the other start drawer is closed", async ({ page }) =>
  expect(page.locator("#other-container")).not.toHaveAttribute("start"),
);

Given("a drawer container with an open automatic end drawer", ({ drawer }) => {
  drawer.attributes = 'end end-mode="auto"';
});
Then("the end drawer uses {string} mode", async ({ drawer }, mode: string) =>
  expect
    .poll(() => drawer.container.evaluate((container, state) => container.matches(`:state(--end-${state})`), mode))
    .toBe(true),
);
When("the user activates the drawer toggle with {string}", async ({ drawer, page }, key: string) => {
  await drawer.toggle.focus();
  await page.keyboard.press(key);
});
