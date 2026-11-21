import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { CalendarHarness } from "./calendar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ calendar: CalendarHarness }>({
  calendar: async ({ page, render }, use) => use(new CalendarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a calendar starting at {string} with selected date {string}", ({ calendar }, startAt: string, date: string) => {
  calendar.options.startAt = startAt;
  calendar.options.date = date;
});
When("the calendar renders", async ({ calendar }) => calendar.show());
When("the application observes calendar changes", async ({ calendar }) => calendar.observeChanges());
When("the user selects the date five days after the active date", async ({ calendar }) =>
  calendar.selectFiveDaysLater(),
);
Then("the calendar dispatches {int} change event", async ({ calendar }, count: number) =>
  expect(calendar.calendar).toHaveAttribute("data-change-count", String(count)),
);
Then("the selected date is {string}", async ({ calendar }, date: string) =>
  expect.poll(async () => (await calendar.readDates()).date).toBe(date),
);
Then("exactly {int} date is marked as pressed", async ({ page }, count: number) =>
  expect(page.getByRole("grid").locator('[role="button"][aria-pressed="true"]')).toHaveCount(count),
);

Given(
  "a calendar starting at {string} with dates limited to {string} through {string}",
  ({ calendar }, startAt: string, minDate: string, maxDate: string) => {
    calendar.options = { startAt, minDate, maxDate };
  },
);
Then("the calendar shows the period {string}", async ({ page }, period: string) =>
  expect(page.getByRole("button", { name: period, exact: true })).toBeVisible(),
);
Then("{int} dates are disabled", async ({ calendar }, count: number) =>
  expect(calendar.disabledDates).toHaveCount(count),
);
Then("the {string} navigation button is disabled", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toHaveAttribute("aria-disabled", "true"),
);

Given("a calendar starting at {string}", ({ calendar }, startAt: string) => {
  calendar.options.startAt = startAt;
});
When("the user activates the {string} navigation button", async ({ page }, name: string) =>
  page.getByRole("button", { name, exact: true }).click(),
);

Given(
  "a calendar starting at {string} with range start {string}",
  ({ calendar }, startAt: string, rangeStart: string) => {
    calendar.options = { startAt, rangeStart };
  },
);
Then("the selected range is {string} through {string}", async ({ calendar }, start: string, end: string) =>
  expect
    .poll(async () => {
      const { rangeStart, rangeEnd } = await calendar.readDates();
      return [rangeStart, rangeEnd];
    })
    .toEqual([start, end]),
);
When("the application blacks out the {int}th day of the month", async ({ calendar }, day: number) =>
  calendar.blackoutDay(day),
);
Then("{int} date is disabled", async ({ calendar }, count: number) =>
  expect(calendar.disabledDates).toHaveCount(count),
);
Then("no date is selected", async ({ calendar }) =>
  expect.poll(async () => (await calendar.readDates()).date).toBeNull(),
);
When("the user selects the date five days before the active date", async ({ calendar }) =>
  calendar.selectFiveDays("ArrowLeft"),
);
Then("the range starts at {string} with no end", async ({ calendar }, start: string) =>
  expect
    .poll(async () => {
      const { rangeStart, rangeEnd } = await calendar.readDates();
      return [rangeStart, rangeEnd];
    })
    .toEqual([start, null]),
);

Given("a calendar with range {string} through {string}", ({ calendar }, rangeStart: string, rangeEnd: string) => {
  calendar.options = { rangeStart, rangeEnd };
});
When("the user selects {string} in the calendar grid", async ({ calendar }, name: string) =>
  calendar.gridItem(name).click(),
);
When("the user focuses the active date", async ({ calendar }) => calendar.focusActiveDate());
When("the user presses {string} in the calendar", async ({ page }, key: string) => page.keyboard.press(key));
Then("the calendar grid focuses {string}", async ({ calendar }, name: string) =>
  expect(calendar.gridItem(name)).toBeFocused(),
);

Given(
  "a calendar starting at {string} with start view {string}",
  ({ calendar }, startAt: string, startView: string) => {
    calendar.options = { startAt, startView };
  },
);
Then("the start view is {string}", async ({ calendar }, view: string) =>
  expect(calendar.calendar).toHaveAttribute("start-view", view),
);
Then("the {string} navigation button is visible", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeVisible(),
);
Then("the active year is {int}", async ({ calendar }, year: number) =>
  expect.poll(() => calendar.readActiveYear()).toBe(year),
);

Given(
  "a calendar starting at {string} with month navigation labels {string} and {string}",
  ({ calendar }, startAt: string, previousMonthLabel: string, nextMonthLabel: string) => {
    calendar.options = { startAt, previousMonthLabel, nextMonthLabel };
  },
);
When("the application blacks out weekends", async ({ calendar }) => calendar.blackoutWeekends());
Then("at least {int} dates are disabled", async ({ calendar }, count: number) => {
  await expect(calendar.disabledDates.first()).toBeVisible();
  await expect.poll(() => calendar.disabledDates.count()).toBeGreaterThanOrEqual(count);
});
When("the application clears blackout dates", async ({ calendar }) => calendar.clearBlackoutDates());

Given("normal calendar motion is enabled", ({ calendar }) => {
  calendar.reducedMotion = false;
});
Then("the calendar has finished sliding", async ({ calendar }) =>
  expect.poll(() => calendar.readSlideState()).toEqual({ overflow: "", animations: 0 }),
);

Given("the calendar starts in {string} view", ({ calendar }, view: string) => {
  calendar.options.startView = view;
});
Then("the calendar grid item {string} is disabled", async ({ calendar }, name: string) =>
  expect(calendar.gridItem(name)).toHaveAttribute("aria-disabled", "true"),
);
When(
  "the application sets the calendar attribute {string} to {string}",
  async ({ calendar }, name: string, value: string) => calendar.setAttribute(name, value),
);

Given("today's date is {string}", async ({ page }, date: string) =>
  page.clock.setFixedTime(new Date(`${date}T12:00:00`)),
);
Then("the calendar marks {string} as today", async ({ calendar }, name: string) =>
  expect(calendar.gridItem(name)).toHaveAttribute("aria-current", "date"),
);
When("the application refreshes today's date to {string}", async ({ page, calendar }, date: string) => {
  await page.clock.setFixedTime(new Date(`${date}T12:00:00`));
  await calendar.refreshToday();
});
