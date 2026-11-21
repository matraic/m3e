import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import type { M3eBottomSheetElement } from "@m3e/web/bottom-sheet";

import { expect, test as componentTest } from "../fixtures";
import { BottomSheetHarness } from "./bottom-sheet.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ bottomSheet: BottomSheetHarness }>({
  bottomSheet: async ({ page, render }, use) => use(new BottomSheetHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a sheet that is open declaratively", async ({ bottomSheet }) =>
  bottomSheet.render('<m3e-bottom-sheet id="sheet" open>Sheet content</m3e-bottom-sheet>'),
);
Then("the sheet is open", async ({ bottomSheet }) => expect(bottomSheet.sheet).toHaveAttribute("open", ""));
When("the application removes the open attribute", async ({ bottomSheet }) => bottomSheet.removeOpenAttribute());
Then("the sheet is closed", async ({ bottomSheet }) => expect(bottomSheet.sheet).not.toHaveAttribute("open"));

Given("a sheet with a trigger and a close action", async ({ bottomSheet }) =>
  bottomSheet.render(`
    <m3e-button>
      <m3e-bottom-sheet-trigger for="sheet">Open actions</m3e-bottom-sheet-trigger>
    </m3e-button>
    <m3e-bottom-sheet id="sheet">
      <m3e-button>
        <m3e-bottom-sheet-action>Close sheet</m3e-bottom-sheet-action>
      </m3e-button>
    </m3e-bottom-sheet>
  `),
);
When("the user activates the {string} trigger", async ({ bottomSheet }, label: string) =>
  bottomSheet.trigger(label).click(),
);
Then("the {string} trigger reports expanded", async ({ bottomSheet }, label: string) =>
  expect(bottomSheet.trigger(label)).toHaveAttribute("aria-expanded", "true"),
);
When("the user activates the {string} action", async ({ bottomSheet }, label: string) =>
  bottomSheet.action(label).click(),
);

Given("a sheet whose opening event is canceled", async ({ bottomSheet }) => {
  await bottomSheet.render(`
    <m3e-button>
      <m3e-bottom-sheet-trigger for="sheet">Open sheet</m3e-bottom-sheet-trigger>
    </m3e-button>
    <m3e-bottom-sheet id="sheet">Sheet content</m3e-bottom-sheet>
  `);
  await bottomSheet.preventEvent("opening");
});

Given("a sheet with lifecycle event recording", async ({ bottomSheet }) => {
  await bottomSheet.render('<m3e-bottom-sheet id="sheet">Sheet content</m3e-bottom-sheet>');
  await bottomSheet.recordLifecycleEvents();
});
When("the application opens the sheet", async ({ bottomSheet }) => bottomSheet.call("show"));
Then("the lifecycle events are {string}", async ({ bottomSheet }, names: string) =>
  expect.poll(() => bottomSheet.readLifecycleEvents()).toEqual(names.split(", ")),
);
When("the application closes the sheet", async ({ bottomSheet }) => bottomSheet.call("hide"));

Given("an open sheet whose closing event is canceled", async ({ bottomSheet }) => {
  await bottomSheet.render('<m3e-bottom-sheet id="sheet" open>Sheet content</m3e-bottom-sheet>');
  await bottomSheet.preventEvent("closing");
});

Given("a closed sheet", async ({ bottomSheet }) =>
  bottomSheet.render('<m3e-bottom-sheet id="sheet">Sheet content</m3e-bottom-sheet>'),
);
When("the application calls {string} on the sheet", async ({ bottomSheet }, method: "show" | "hide" | "toggle") =>
  bottomSheet.call(method),
);

Given("a sheet with primary and secondary triggers", async ({ bottomSheet }) =>
  bottomSheet.render(`
    <button id="primary-trigger">
      <m3e-bottom-sheet-trigger for="sheet">Open primary</m3e-bottom-sheet-trigger>
    </button>
    <button id="secondary-trigger">
      <m3e-bottom-sheet-trigger for="sheet" secondary>Open secondary</m3e-bottom-sheet-trigger>
    </button>
    <m3e-bottom-sheet id="sheet">Sheet content</m3e-bottom-sheet>
  `),
);
Then("the primary trigger controls and labels the sheet", async ({ bottomSheet }) => {
  await expect(bottomSheet.primaryTrigger).toHaveAttribute("aria-controls", "sheet");
  await expect(bottomSheet.primaryTrigger).toHaveAttribute("aria-expanded", "false");
  await expect(bottomSheet.sheet).toHaveAttribute("aria-labelledby", "primary-trigger");
});
Then("the secondary trigger has no ARIA ownership", async ({ bottomSheet }) => {
  await expect(bottomSheet.secondaryTrigger).not.toHaveAttribute("aria-controls");
  await expect(bottomSheet.secondaryTrigger).not.toHaveAttribute("aria-expanded");
});

Given("a modal sheet with primary and secondary triggers", async ({ bottomSheet }) =>
  bottomSheet.render(`
    <button id="primary-trigger">
      <m3e-bottom-sheet-trigger for="sheet">Open primary</m3e-bottom-sheet-trigger>
    </button>
    <button id="secondary-trigger">
      <m3e-bottom-sheet-trigger for="sheet" secondary>Open secondary</m3e-bottom-sheet-trigger>
    </button>
    <m3e-bottom-sheet id="sheet" modal aria-label="Choose a destination">Sheet content</m3e-bottom-sheet>
  `),
);
Then("the {string} trigger announces a dialog", async ({ bottomSheet }, label: string) =>
  expect(bottomSheet.trigger(label)).toHaveAttribute("aria-haspopup", "dialog"),
);
Then("the standard sheet is exposed as a labelled region", async ({ bottomSheet }) => {
  await expect(bottomSheet.sheet).toHaveRole("region");
  await expect(bottomSheet.sheet).toHaveAccessibleName("Open primary");
  await expect(bottomSheet.sheet).not.toHaveAttribute("aria-modal");
});
Then("the primary trigger reports collapsed", async ({ bottomSheet }) =>
  expect(bottomSheet.primaryTrigger).toHaveAttribute("aria-expanded", "false"),
);

Given("a modal sheet with a trigger", async ({ bottomSheet }) =>
  bottomSheet.render(`
    <button id="opener">
      <m3e-bottom-sheet-trigger for="sheet">Open sheet</m3e-bottom-sheet-trigger>
    </button>
    <m3e-bottom-sheet id="sheet" modal aria-labelledby="sheet-title">
      <h2 id="sheet-title" slot="header">Choose a destination</h2>
      <button>Sheet action</button>
    </m3e-bottom-sheet>
  `),
);
Then("the sheet is exposed as a modal dialog", async ({ bottomSheet }) => {
  await expect(bottomSheet.sheet).toHaveRole("dialog");
  await expect(bottomSheet.sheet).toHaveAttribute("aria-modal", "true");
  await expect(bottomSheet.sheet).toHaveAccessibleName("Choose a destination");
});
Then("content behind the modal sheet is inert", async ({ bottomSheet }) =>
  expect.poll(() => bottomSheet.readBackgroundInert()).toBe(true),
);

When("the user presses {string} to dismiss the sheet", async ({ page }, key: string) => page.keyboard.press(key));
Then("focus returns to the {string} trigger", async ({ bottomSheet }, label: string) =>
  expect(bottomSheet.trigger(label)).toBeFocused(),
);
When("the user clicks outside the sheet", async ({ page }) => page.mouse.click(10, 10));

Given("an open modal sheet whose cancel event is canceled", async ({ bottomSheet }) => {
  await bottomSheet.render(
    '<m3e-bottom-sheet id="sheet" modal open aria-label="Example sheet">Sheet content</m3e-bottom-sheet>',
  );
  await bottomSheet.preventEvent("cancel");
});

Given("a modal sheet with an autofocus control and another action", async ({ bottomSheet }) =>
  bottomSheet.render(`
    <button id="opener">
      <m3e-bottom-sheet-trigger for="sheet">Open sheet</m3e-bottom-sheet-trigger>
    </button>
    <m3e-bottom-sheet id="sheet" modal aria-label="Save changes">
      <button autofocus>Save</button>
      <button>Cancel</button>
    </m3e-bottom-sheet>
  `),
);
Then("focus is on {string}", async ({ bottomSheet }, label: string) => expect(bottomSheet.action(label)).toBeFocused());
When("the user tabs within the modal sheet", async ({ page }) => page.keyboard.press("Tab"));

Given("two sheets", async ({ bottomSheet }) =>
  bottomSheet.render(`
    <m3e-bottom-sheet id="first">First sheet</m3e-bottom-sheet>
    <m3e-bottom-sheet id="second">Second sheet</m3e-bottom-sheet>
  `),
);
When("the application opens the {string} sheet", async ({ bottomSheet }, id: string) =>
  bottomSheet.sheetById(id.toLowerCase()).evaluate((sheet: M3eBottomSheetElement) => sheet.show()),
);
Then("the {string} sheet is open", async ({ bottomSheet }, id: string) =>
  expect(bottomSheet.sheetById(id.toLowerCase())).toHaveAttribute("open", ""),
);
Then("the {string} sheet is closed", async ({ bottomSheet }, id: string) =>
  expect(bottomSheet.sheetById(id.toLowerCase())).not.toHaveAttribute("open"),
);

Given("a modal sheet with a trigger targeting the half detent", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <button id="opener">
      <m3e-bottom-sheet-trigger for="sheet" detent="1">Open sheet</m3e-bottom-sheet-trigger>
    </button>
    <m3e-bottom-sheet id="sheet" modal handle detents="fit half full" aria-label="Choose a destination">
      <div slot="header">Choose an option</div>
      <div style="height: 400px">Sheet content</div>
    </m3e-bottom-sheet>
  `);
});
Then("the sheet opens at about half the viewport height", async ({ bottomSheet }) => {
  const viewportHeight = await bottomSheet.readViewportHeight();
  await expect.poll(() => bottomSheet.readHeight()).toBeGreaterThan(viewportHeight * 0.4);
  await expect.poll(() => bottomSheet.readHeight()).toBeLessThan(viewportHeight * 0.6);
});

Given("a modal sheet configured to open at its half detent", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" modal handle detents="fit half full" detent="1" open aria-label="Example sheet">
      <div style="height: 400px">Sheet content</div>
    </m3e-bottom-sheet>
  `);
});

Given("a sheet with the detent {string}", async ({ bottomSheet, page }, detent: string) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" detents="${detent} full">Sheet content</m3e-bottom-sheet>
  `);
});
Then("the sheet height matches the detent {string}", async ({ bottomSheet }, detent: string) => {
  const height = await bottomSheet.readHeight();
  if (detent.endsWith("px")) {
    expect(height).toBeCloseTo(parseFloat(detent), 0);
    return;
  }

  await bottomSheet.showDetent(1);
  const fullHeight = await bottomSheet.readHeight();
  expect(height / fullHeight).toBeCloseTo(parseFloat(detent) / 100, 1);
});

Given("an open sheet with a keyboard-operable handle and detents", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" handle detents="collapsed half full" open>
      <div style="height: 400px">Sheet content</div>
    </m3e-bottom-sheet>
  `);
  await bottomSheet.captureInitialHeight();
});
When("the user presses {string} on the sheet handle", async ({ bottomSheet }, key: string) => {
  await bottomSheet.handle().focus();
  await bottomSheet.handle().press(key);
  if (key === "ArrowUp") await bottomSheet.captureExpandedHeight();
});
Then("the sheet is taller than its initial height", async ({ bottomSheet }) =>
  expect.poll(() => bottomSheet.isTallerThanInitial()).toBe(true),
);
Then("the sheet is shorter than its expanded height", async ({ bottomSheet }) =>
  expect.poll(() => bottomSheet.isShorterThanExpanded()).toBe(true),
);
When("the user activates the sheet handle", async ({ bottomSheet }) => bottomSheet.activateHandle());
Then("the sheet reaches its largest detent", async ({ bottomSheet }) =>
  expect.poll(() => bottomSheet.isAtLargestDetent()).toBe(true),
);

Given("an open hideable sheet with a keyboard-operable handle and detents", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" handle hideable detents="collapsed half full" open>
      <div style="height: 400px">Sheet content</div>
    </m3e-bottom-sheet>
  `);
});

Given("an open sheet with a handle and explicit detents", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" handle detents="100px 300px 500px" open>
      <div style="height: 400px">Sheet content</div>
    </m3e-bottom-sheet>
  `);
});
When("the user swipes up on the sheet handle", async ({ bottomSheet }) => bottomSheet.swipeUpOnHandle());
When("the user partially drags up on the sheet handle", async ({ bottomSheet }) =>
  bottomSheet.partiallyDragUpOnHandle(),
);

Given("an open sheet with a collapsed detent and custom peek height", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet
      id="sheet"
      handle
      open
      detents="collapsed half full"
      style="--m3e-bottom-sheet-peek-height: 36px">
      <h2 slot="header">Choose a destination</h2>
      <button>Continue</button>
    </m3e-bottom-sheet>
  `);
});
Then("the sheet content is inert", async ({ bottomSheet }) =>
  expect.poll(() => bottomSheet.readContentInert()).toBe(true),
);
When("the application expands the sheet to the next detent", async ({ bottomSheet }) => bottomSheet.showDetent(1));
Then("the sheet content is interactive", async ({ bottomSheet }) =>
  expect.poll(() => bottomSheet.readContentInert()).toBe(false),
);

Given("an open sheet at its fit detent with resizable content", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" detents="fit full" open>
      <div id="resizable-content" style="height: 100px"></div>
    </m3e-bottom-sheet>
  `);
  await bottomSheet.captureInitialHeight();
});
When("the application changes the sheet content height to {int} pixels", async ({ bottomSheet }, height: number) =>
  bottomSheet.setContentHeight(height),
);
When("the application resizes the viewport to {int} pixels high", async ({ page }, height: number) =>
  page.setViewportSize({ width: 1280, height }),
);
Then("the sheet remains at about half the viewport height", async ({ bottomSheet }) => {
  const viewportHeight = await bottomSheet.readViewportHeight();
  await expect.poll(() => bottomSheet.readHeight()).toBeGreaterThan(viewportHeight * 0.4);
  await expect.poll(() => bottomSheet.readHeight()).toBeLessThan(viewportHeight * 0.6);
});

Given("an open sheet with a handle and no detents", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render('<m3e-bottom-sheet id="sheet" handle open>Sheet content</m3e-bottom-sheet>');
});

Given("an open hideable modal sheet with a handle", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" modal handle hideable open aria-label="Hideable sheet">
      <button>Continue</button>
    </m3e-bottom-sheet>
  `);
});
When("the user swipes down on the sheet handle", async ({ bottomSheet }) => bottomSheet.swipeDownOnHandle());

Given("an open sheet with the handle label {string}", async ({ bottomSheet }, label: string) =>
  bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" handle handle-label="${label}" open>
      <button>Continue</button>
    </m3e-bottom-sheet>
  `),
);
Then("the sheet handle has the accessible name {string}", async ({ bottomSheet }, label: string) =>
  expect(bottomSheet.handle(label)).toBeVisible(),
);

Given("a sheet with a movable trigger", async ({ bottomSheet }) =>
  bottomSheet.render(`
    <button id="opener">
      <m3e-bottom-sheet-trigger for="sheet">Open sheet</m3e-bottom-sheet-trigger>
    </button>
    <m3e-bottom-sheet id="sheet">Sheet content</m3e-bottom-sheet>
  `),
);
When("the application moves the trigger to a new DOM parent", async ({ bottomSheet }) =>
  bottomSheet.moveTriggerToNewParent("Open sheet"),
);
When("the application moves the sheet to a new DOM parent", async ({ bottomSheet }) =>
  bottomSheet.moveSheetToNewParent(),
);

Given("an open sheet with draggable header content and no handle", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" detents="100px 300px 500px" open>
      <div slot="header">Choose a destination</div>
      <div style="height: 400px">Sheet content</div>
    </m3e-bottom-sheet>
  `);
});
When("the user drags up on the sheet header", async ({ bottomSheet }) => bottomSheet.dragUpOnHeader());

Given("an open sheet with a button in its header and no handle", async ({ bottomSheet, page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await bottomSheet.render(`
    <m3e-bottom-sheet id="sheet" detents="100px 300px 500px" open>
      <button slot="header">Header action</button>
      <div style="height: 400px">Sheet content</div>
    </m3e-bottom-sheet>
  `);
});
When("the user drags up on the header button", async ({ bottomSheet }) => bottomSheet.dragUpOnHeaderButton());
