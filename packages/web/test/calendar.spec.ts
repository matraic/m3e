import { expect, test } from "./fixtures";

test.describe("m3e-calendar", () => {
  test("selects a date and dispatches change", async ({ page, render }) => {
    await render('<m3e-calendar date="2026-01-15" start-at="2026-01-15"></m3e-calendar>');
    const calendar = page.locator("m3e-calendar");
    await page.evaluate(() => {
      (window as unknown as { calendarChanges: number }).calendarChanges = 0;
      document
        .querySelector("m3e-calendar")!
        .addEventListener("change", () => ((window as unknown as { calendarChanges: number }).calendarChanges += 1));
    });

    await calendar.evaluate((element) =>
      (element as HTMLElement & { focusActiveCell(): Promise<void> }).focusActiveCell(),
    );
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");

    await expect
      .poll(() => page.evaluate(() => (window as unknown as { calendarChanges: number }).calendarChanges))
      .toBe(1);
    expect(
      await calendar.evaluate((element) => {
        const date = (element as HTMLElement & { date: Date }).date;
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      }),
    ).toBe("2026-01-20");
    await expect(page.getByRole("grid").locator('[role="button"][aria-pressed="true"]')).toHaveCount(1);
  });

  test("navigates between months and respects date boundaries", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15" min-date="2026-01-10" max-date="2026-01-20"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });

    await expect(page.getByRole("button", { name: "Jan 2026" })).toBeVisible();
    await expect(page.getByRole("grid").locator('[role="button"][aria-disabled="true"]')).toHaveCount(20);
    await expect(page.getByRole("button", { name: "Previous month" })).toHaveAttribute("aria-disabled", "true");
    await expect(page.getByRole("button", { name: "Next month" })).toHaveAttribute("aria-disabled", "true");
  });

  test("navigates to the next month", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.getByRole("button", { name: "Next month" }).click();

    await expect(page.getByRole("button", { name: "Feb 2026" })).toBeVisible();
  });

  test("updates range start and end when selecting dates", async ({ page, render }) => {
    await render('<m3e-calendar range-start="2026-01-10" start-at="2026-01-10"></m3e-calendar>');
    const calendar = page.locator("m3e-calendar");

    await calendar.evaluate((element) =>
      (element as HTMLElement & { focusActiveCell(): Promise<void> }).focusActiveCell(),
    );
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");

    const range = await calendar.evaluate((element) => {
      const calendar = element as HTMLElement & { rangeStart: Date | null; rangeEnd: Date | null };
      const format = (date: Date | null) =>
        date &&
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      return [format(calendar.rangeStart), format(calendar.rangeEnd)];
    });

    expect(range).toEqual(["2026-01-10", "2026-01-15"]);
  });

  test("does not select blackout dates", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15"></m3e-calendar>');
    const calendar = page.locator("m3e-calendar");

    await calendar.evaluate((element) => {
      (element as HTMLElement & { blackoutDates: (date: Date) => boolean }).blackoutDates = (date) =>
        date.getDate() === 20;
    });
    await expect(page.getByRole("grid").locator('[role="button"][aria-disabled="true"]')).toHaveCount(1);

    await calendar.evaluate((element) =>
      (element as HTMLElement & { focusActiveCell(): Promise<void> }).focusActiveCell(),
    );
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");

    expect(await calendar.evaluate((element) => (element as HTMLElement & { date: Date | null }).date)).toBeNull();
  });

  test("defaults to the month view and falls back from an invalid start-view", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15" start-view="bogus"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });

    await expect(page.locator("m3e-calendar")).toHaveAttribute("start-view", "month");
    await expect(page.getByRole("button", { name: "Next month" })).toBeVisible();
  });

  test("start-view year shows year navigation", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15" start-view="year"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });

    await expect(page.getByRole("button", { name: "Next year" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous year" })).toBeVisible();
  });

  test("start-view multi-year shows multi-year navigation", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15" start-view="multi-year"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });

    await expect(page.getByRole("button", { name: "Next 24 years" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Previous 24 years" })).toBeVisible();
  });

  test("navigates years in the year view", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15" start-view="year"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });
    const calendar = page.locator("m3e-calendar");
    const year = () =>
      calendar.evaluate((el) => (el as HTMLElement & { _activeDate?: Date })._activeDate?.getFullYear() ?? null);

    await page.getByRole("button", { name: "Next year" }).click();
    await expect.poll(year).toBe(2027);

    await page.getByRole("button", { name: "Previous year" }).click();
    await page.getByRole("button", { name: "Previous year" }).click();
    await expect.poll(year).toBe(2025);
  });

  test("custom navigation labels are used", async ({ page, render }) => {
    await render(
      '<m3e-calendar start-at="2026-01-15" previous-month-label="Earlier" next-month-label="Later"></m3e-calendar>',
    );
    await page.emulateMedia({ reducedMotion: "reduce" });

    await expect(page.getByRole("button", { name: "Earlier" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Later" })).toBeVisible();
  });

  test("the period button switches between month and multi-year views", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page.getByRole("button", { name: "Jan 2026" }).click();
    await expect(page.getByRole("button", { name: "Next 24 years" })).toBeVisible();
  });

  test("blackoutDates marks matching dates disabled", async ({ page, render }) => {
    await render('<m3e-calendar start-at="2026-01-15"></m3e-calendar>');
    await page.emulateMedia({ reducedMotion: "reduce" });

    await page
      .locator("m3e-calendar")
      .evaluate(
        (el) =>
          ((el as HTMLElement & { blackoutDates: (d: Date) => boolean }).blackoutDates = (d) =>
            d.getDay() === 0 || d.getDay() === 6),
      );

    await expect(page.getByRole("grid").locator('[role="button"][aria-disabled="true"]').first()).toBeVisible();
    const disabled = await page.getByRole("grid").locator('[role="button"][aria-disabled="true"]').count();
    expect(disabled).toBeGreaterThanOrEqual(8);
  });
});
