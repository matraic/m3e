import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eCalendarElement } from "@m3e/web/calendar";
import type { M3eDatepickerElement } from "@m3e/web/datepicker";

import { expect, test as componentTest } from "../fixtures";
import { DatepickerHarness } from "./datepicker.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ datepicker: DatepickerHarness }>({
  datepicker: async ({ page, render }, use) => use(new DatepickerHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a datepicker starting at {string}", ({ datepicker }, date: string) => {
  datepicker.attributes = `start-at="${date}"`;
});
When("the datepicker renders", async ({ datepicker }) => datepicker.show());
When("the application opens the datepicker", async ({ datepicker }) => datepicker.open());
Then("the datepicker trigger is expanded", async ({ datepicker }) =>
  expect(datepicker.trigger).toHaveAttribute("aria-expanded", "true"),
);
Then("the datepicker shows the period {string}", async ({ page }, period: string) =>
  expect(page.getByRole("button", { name: period, exact: true })).toBeVisible(),
);
Then("the datepicker action {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeVisible(),
);

Given("a datepicker with date {string} starting at {string}", ({ datepicker }, date: string, start: string) => {
  datepicker.attributes = `date="${date}" start-at="${start}"`;
});
When("the application observes datepicker changes", async ({ datepicker }) => datepicker.observeChanges());
When("the user selects the date five days after the active date in the datepicker", async ({ datepicker }) =>
  datepicker.selectFiveDaysLater(),
);
Then("the datepicker date is {string}", async ({ datepicker }, date: string) =>
  expect.poll(async () => (await datepicker.dates()).date).toBe(date),
);
When("the user activates the datepicker action {string}", async ({ page }, name: string) =>
  page.getByRole("button", { name, exact: true }).click(),
);
Then("the datepicker trigger is collapsed", async ({ datepicker }) =>
  expect(datepicker.trigger).toHaveAttribute("aria-expanded", "false"),
);
Then("the datepicker dispatches {int} change event", async ({ datepicker }, count: number) =>
  expect(datepicker.picker).toHaveAttribute("data-changes", String(count)),
);

Given("a clearable datepicker with date {string}", ({ datepicker }, date: string) => {
  datepicker.attributes = `clearable date="${date}" start-at="${date}"`;
});
Then("the datepicker has no date", async ({ datepicker }) =>
  expect.poll(async () => (await datepicker.dates()).date).toBeNull(),
);

Given("a modal datepicker starting at {string}", ({ datepicker }, date: string) => {
  datepicker.attributes = `variant="modal" start-at="${date}"`;
});
Then("the datepicker is exposed as a modal dialog", async ({ datepicker }) => {
  await expect(datepicker.picker).toHaveRole("dialog");
  await expect(datepicker.picker).toHaveAttribute("aria-modal", "true");
  await expect(datepicker.picker).toHaveAccessibleName("Choose a date");
});
When("the user presses {string} in the datepicker", async ({ page }, key: string) => page.keyboard.press(key));
Then("the datepicker trigger has focus", async ({ datepicker }) => expect(datepicker.trigger).toBeFocused());

Given("a datepicker with a toggle", ({ datepicker }) => {
  datepicker.withToggle = true;
});
Then("the datepicker trigger has a dialog popup", async ({ datepicker }) =>
  expect(datepicker.trigger).toHaveAttribute("aria-haspopup", "dialog"),
);
When("the user clicks the datepicker trigger", async ({ datepicker }) => datepicker.trigger.click());
Then("the datepicker dialog named {string} is visible", async ({ page }, name: string) =>
  expect(page.getByRole("dialog", { name, exact: true })).toBeVisible(),
);
Then("the datepicker calendar grid is visible", async ({ datepicker }) =>
  expect(datepicker.picker.getByRole("grid")).toBeVisible(),
);

Given("a datepicker with custom labels", ({ datepicker }) => {
  datepicker.attributes = `start-at="2026-01-15" clearable confirm-label="Apply date" dismiss-label="Discard date"
    clear-label="Remove date" previous-month-label="Earlier month" next-month-label="Later month"`;
});

Given("a datepicker with custom navigation labels in {string} view", ({ datepicker }, view: string) => {
  datepicker.attributes = `start-at="2026-01-15" start-view="${view}"
    previous-year-label="Earlier year" next-year-label="Later year"
    previous-multi-year-label="Earlier years" next-multi-year-label="Later years"`;
});

Given("a datepicker starting at {string} in {string} view", ({ datepicker }, date: string, view: string) => {
  datepicker.attributes = `start-at="${date}" start-view="${view}"`;
});

Given("a datepicker with date limits and a blackout date", ({ datepicker }) => {
  datepicker.attributes = 'start-at="2026-01-15" min-date="2026-01-10" max-date="2026-01-20"';
});
When("the application blacks out January 15 in the datepicker", async ({ datepicker }) =>
  datepicker.picker.evaluate((picker: M3eDatepickerElement) => {
    picker.blackoutDates = (date) => date.getMonth() === 0 && date.getDate() === 15;
  }),
);
Then("datepicker date {string} is disabled", async ({ datepicker }, name: string) =>
  expect(datepicker.picker.getByRole("grid").getByRole("button", { name, exact: true })).toHaveAttribute(
    "aria-disabled",
    "true",
  ),
);
Then("datepicker date {string} is enabled", async ({ datepicker }, name: string) =>
  expect(datepicker.picker.getByRole("grid").getByRole("button", { name, exact: true })).not.toHaveAttribute(
    "aria-disabled",
    "true",
  ),
);

Given("a datepicker with range start {string}", ({ datepicker }, start: string) => {
  datepicker.attributes = `range-start="${start}" start-at="${start}"`;
});
When("the user selects {string} in the datepicker", async ({ datepicker }, name: string) =>
  datepicker.picker.getByRole("grid").getByRole("button", { name, exact: true }).click(),
);
Then("the datepicker range is {string} through {string}", async ({ datepicker }, start: string, end: string) =>
  expect
    .poll(async () => {
      const dates = await datepicker.dates();
      return [dates.start, dates.end];
    })
    .toEqual([start, end]),
);

Given("a clearable datepicker with range {string} through {string}", ({ datepicker }, start: string, end: string) => {
  datepicker.attributes = `clearable range-start="${start}" range-end="${end}" start-at="${start}"`;
});
Then("the datepicker range is empty", async ({ datepicker }) =>
  expect
    .poll(async () => {
      const dates = await datepicker.dates();
      return [dates.start, dates.end];
    })
    .toEqual([null, null]),
);

Given("a datepicker associated with a date input", ({ datepicker }) => {
  datepicker.withInput = true;
});
When("the application observes datepicker and date input changes", async ({ datepicker }) =>
  datepicker.observeChanges(true),
);
Then("the associated date input date is {string}", async ({ datepicker }, date: string) =>
  expect.poll(() => datepicker.inputDate()).toBe(date),
);
Then("the associated date input dispatches {int} change event", async ({ datepicker }, count: number) =>
  expect(datepicker.input).toHaveAttribute("data-changes", String(count)),
);

Given("a clearable datepicker associated with a date input", ({ datepicker }) => {
  datepicker.withInput = true;
  datepicker.attributes = 'clearable start-at="2026-01-15"';
});
Then("the associated date input has no date", async ({ datepicker }) =>
  expect.poll(() => datepicker.inputDate()).toBeNull(),
);

Given("a datepicker with a toggle and a selected date", ({ datepicker }) => {
  datepicker.withToggle = true;
  datepicker.attributes = 'date="2026-01-15" start-at="2026-01-15"';
});
When("the application moves the datepicker to a new DOM parent", async ({ datepicker }) =>
  datepicker.picker.evaluate((picker) => {
    const parent = document.createElement("div");
    parent.id = "datepicker-new-parent";
    document.body.append(parent);
    parent.append(picker);
  }),
);
Then("the datepicker is in the new DOM parent", async ({ page }) =>
  expect(page.locator("#datepicker-new-parent > m3e-datepicker")).toHaveCount(1),
);
When("the application moves the datepicker toggle to a new trigger", async ({ page }) =>
  page.locator("m3e-datepicker-toggle").evaluate((toggle) => {
    const trigger = document.querySelector("#other-trigger");
    if (!trigger) throw new Error("New datepicker trigger is missing.");
    trigger.append(toggle);
  }),
);
Then("the original datepicker trigger has no popup", async ({ datepicker }) =>
  expect(datepicker.trigger).not.toHaveAttribute("aria-haspopup"),
);
Then("the new datepicker trigger has a dialog popup", async ({ page }) =>
  expect(page.locator("#other-trigger")).toHaveAttribute("aria-haspopup", "dialog"),
);
Then("the datepicker is closed", async ({ datepicker }) => {
  await expect.poll(() => datepicker.picker.evaluate((picker: M3eDatepickerElement) => picker.isOpen)).toBe(false);
  await expect.poll(() => datepicker.picker.evaluate((picker) => picker.matches(":popover-open"))).toBe(false);
});
When("the user clicks the new datepicker trigger", async ({ page }) => page.locator("#other-trigger").click());
Then("the new datepicker trigger is expanded", async ({ page }) =>
  expect(page.locator("#other-trigger")).toHaveAttribute("aria-expanded", "true"),
);
Then("the modal background is interactive again", async ({ page, datepicker }) => {
  await expect(datepicker.trigger).not.toHaveAttribute("inert");
  await expect(page.locator("html")).not.toHaveCSS("overflow", "hidden");
});

Given("a {string} datepicker with date {string}", ({ datepicker }, variant: string, date: string) => {
  datepicker.attributes = `variant="${variant}" date="${date}" start-at="${date}"`;
});
When("the user dismisses the datepicker using {string}", async ({ page }, method: string) => {
  switch (method) {
    case "Cancel":
      await page.getByRole("button", { name: "Cancel", exact: true }).click();
      break;
    case "outside":
      await page.locator("#other-trigger").click();
      break;
    case "Escape":
      await page.keyboard.press("Escape");
      break;
    default:
      throw new Error(`Unknown datepicker dismissal method: ${method}`);
  }
});
Then("datepicker date {string} is selected", async ({ datepicker }, name: string) =>
  expect(datepicker.picker.getByRole("grid").getByRole("button", { name, exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  ),
);
Then("datepicker date {string} is not selected", async ({ datepicker }, name: string) =>
  expect(datepicker.picker.getByRole("grid").getByRole("button", { name, exact: true })).toHaveAttribute(
    "aria-pressed",
    "false",
  ),
);

Given("an automatic datepicker starting at {string}", ({ datepicker }, date: string) => {
  datepicker.attributes = `variant="auto" start-at="${date}"`;
});
When("the viewport is {int} pixels wide", async ({ page }, width: number) =>
  page.setViewportSize({ width, height: 800 }),
);
Then("the datepicker uses the {string} variant", async ({ datepicker }, variant: string) =>
  expect.poll(() => datepicker.picker.evaluate((picker: M3eDatepickerElement) => picker.currentVariant)).toBe(variant),
);
Then("the modal background is inert and scrolling is locked", async ({ page, datepicker }) => {
  await expect(datepicker.trigger).toHaveAttribute("inert");
  await expect(page.locator("html")).toHaveCSS("overflow", "hidden");
});
Then("the datepicker is no longer modal", async ({ datepicker }) =>
  expect(datepicker.picker).not.toHaveAttribute("aria-modal"),
);
When("the user tabs through the datepicker in both directions", async ({ page, datepicker }) => {
  const confirm = datepicker.picker.getByRole("button", { name: "OK", exact: true });
  await confirm.focus();
  await page.keyboard.press("Tab");
  await expect.poll(() => datepicker.picker.evaluate((picker) => document.activeElement === picker)).toBe(true);
  await expect(confirm).not.toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(confirm).toBeFocused();
});
Then("focus remains inside the datepicker", async ({ datepicker }) =>
  expect.poll(() => datepicker.picker.evaluate((picker) => document.activeElement === picker)).toBe(true),
);
When("the user clicks the other datepicker trigger", async ({ page }) => page.locator("#other-trigger").click());
Then("the other datepicker trigger has focus", async ({ page }) =>
  expect(page.locator("#other-trigger")).toBeFocused(),
);

Given("an empty range datepicker starting at {string}", ({ datepicker }, date: string) => {
  datepicker.attributes = `range start-at="${date}"`;
});
When(
  "the application begins opening and {string} the datepicker {string}",
  async ({ datepicker }, movement: string, stage: string) =>
    datepicker.picker.evaluate(
      async (picker: M3eDatepickerElement, { action, phase }) => {
        const trigger = document.querySelector<HTMLElement>("#trigger");
        if (!trigger || !picker.parentElement) throw new Error("Datepicker fixture is incomplete.");
        const parent = picker.parentElement;
        const opening = picker.show(trigger);
        if (phase === "after calendar render" || phase === "after calendar update") {
          await picker.updateComplete;
          const calendar = picker.shadowRoot?.querySelector<M3eCalendarElement>("m3e-calendar");
          if (!calendar || picker.isOpen) {
            throw new Error("Datepicker is not in the expected opening phase.");
          }
          if (phase === "after calendar update") {
            await calendar.updateComplete;
            for (let i = 0; i < 100 && !picker.isOpen; i++) await Promise.resolve();
            if (!picker.isOpen || picker.matches(":popover-open")) {
              throw new Error("Datepicker is not in the expected positioning phase.");
            }
          }
        } else if (phase !== "before calendar render") {
          throw new Error(`Unknown datepicker opening phase: ${phase}`);
        }
        if (action === "moves") {
          const newParent = document.createElement("div");
          document.body.append(newParent);
          newParent.append(picker);
        } else if (action === "removes") {
          picker.remove();
        } else {
          throw new Error(`Unknown datepicker movement: ${action}`);
        }
        await opening;
        if (action === "removes") parent.append(picker);
      },
      { action: movement, phase: stage },
    ),
);
Then("the datepicker trigger is not expanded", async ({ datepicker }) =>
  expect(datepicker.trigger).not.toHaveAttribute("aria-expanded", "true"),
);
Then("the disconnected datepicker has no active anchoring", async ({ page, datepicker }) => {
  await datepicker.trigger.evaluate((trigger) => {
    trigger.style.marginLeft = "40px";
  });
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
  });
  await expect
    .poll(() => datepicker.picker.evaluate((picker) => [picker.style.left, picker.style.right, picker.style.top]))
    .toEqual(["", "", ""]);
});
When("the application moves the datepicker during opening and immediately opens it again", async ({ datepicker }) =>
  datepicker.picker.evaluate(async (picker: M3eDatepickerElement) => {
    const trigger = document.querySelector<HTMLElement>("#trigger");
    if (!trigger) throw new Error("Datepicker trigger is missing.");
    const first = picker.show(trigger);
    const parent = document.createElement("div");
    document.body.append(parent);
    parent.append(picker);
    await Promise.all([first, picker.show(trigger)]);
  }),
);
