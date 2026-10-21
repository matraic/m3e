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

    await calendar.evaluate((element) => (element as HTMLElement & { focusActiveCell(): Promise<void> }).focusActiveCell());
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");

    await expect.poll(() => page.evaluate(() => (window as unknown as { calendarChanges: number }).calendarChanges)).toBe(1);
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

    await calendar.evaluate((element) => (element as HTMLElement & { focusActiveCell(): Promise<void> }).focusActiveCell());
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");

    const range = await calendar.evaluate((element) => {
      const calendar = element as HTMLElement & { rangeStart: Date | null; rangeEnd: Date | null };
      const format = (date: Date | null) =>
        date && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
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

    await calendar.evaluate((element) => (element as HTMLElement & { focusActiveCell(): Promise<void> }).focusActiveCell());
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");

    expect(await calendar.evaluate((element) => (element as HTMLElement & { date: Date | null }).date)).toBeNull();
  });
});
