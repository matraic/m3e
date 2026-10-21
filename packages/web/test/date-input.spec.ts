import { expect, test } from "./fixtures";

test.describe("m3e-date-input", () => {
  test("exposes accessible date segments and supports custom labels", async ({ page, render }) => {
    await render(`
      <m3e-date-input
        month-label="Month of year"
        day-label="Day of month"
        year-label="Calendar year"
      ></m3e-date-input>
    `);
    const input = page.getByRole("group");

    await expect(input).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Month of year" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Day of month" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Calendar year" })).toBeVisible();
  });

  test("renders segments for date, time, and datetime modes", async ({ page, render }) => {
    await render(`
      <m3e-date-input type="date"></m3e-date-input>
      <m3e-date-input type="time" time-format="24" show-seconds></m3e-date-input>
      <m3e-date-input type="datetime" time-format="24"></m3e-date-input>
    `);

    await expect(page.getByRole("spinbutton", { name: "Month" })).toHaveCount(2);
    await expect(page.getByRole("spinbutton", { name: "Day" })).toHaveCount(2);
    await expect(page.getByRole("spinbutton", { name: "Year" })).toHaveCount(2);
    await expect(page.getByRole("spinbutton", { name: "Hour" })).toHaveCount(2);
    await expect(page.getByRole("spinbutton", { name: "Minute" })).toHaveCount(2);
    await expect(page.getByRole("spinbutton", { name: "Second" })).toHaveCount(1);
    await expect(page.getByRole("spinbutton", { name: "Period" })).toHaveCount(0);
  });

  test("falls back to date mode for an unsupported type", async ({ page, render }) => {
    await render('<m3e-date-input type="invalid"></m3e-date-input>');

    await expect
      .poll(() => page.locator("m3e-date-input").evaluate((element) => (element as HTMLElement & { type: string }).type))
      .toBe("date");
    await expect(page.getByRole("spinbutton", { name: "Month" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Hour" })).toHaveCount(0);
  });

  test("updates its value from keyboard input and emits input and change events", async ({ page, render }) => {
    await render(
      '<m3e-date-input type="time" time-format="24" show-seconds value="2024-01-15T10:30:00.000Z"></m3e-date-input>',
    );
    const hour = page.getByRole("spinbutton", { name: "Hour" });
    const initialHour = Number(await hour.getAttribute("aria-valuenow"));
    await page.evaluate(() => {
      const events: string[] = [];
      const input = document.querySelector("m3e-date-input")!;
      for (const type of ["beforeinput", "input", "change"]) {
        input.addEventListener(type, () => events.push(type));
      }
      (window as unknown as { dateInputEvents: string[] }).dateInputEvents = events;
    });

    await hour.focus();
    await page.keyboard.press("ArrowUp");
    await expect(hour).toHaveAttribute("aria-valuenow", `${initialHour + 1}`);
    await page.locator("body").click();

    await expect
      .poll(() =>
        page
          .locator("m3e-date-input")
          .evaluate((element) => (element as HTMLElement & { value: Date | null }).value?.toISOString()),
      )
      .toBe(await page.evaluate((hour) => new Date(2024, 0, 15, hour + 1, 30).toISOString(), initialHour));
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { dateInputEvents: string[] }).dateInputEvents))
      .toEqual(["beforeinput", "input", "change"]);
  });

  test("does not change its value when read-only", async ({ page, render }) => {
    await render(
      '<m3e-date-input type="time" time-format="24" show-seconds readonly value="2024-01-15T10:30:00.000Z"></m3e-date-input>',
    );
    const hour = page.getByRole("spinbutton", { name: "Hour" });
    const initialHour = Number(await hour.getAttribute("aria-valuenow"));

    await expect(hour).toHaveAttribute("aria-readonly", "true");
    await hour.focus();
    await page.keyboard.press("ArrowUp");
    await expect(hour).toHaveAttribute("aria-valuenow", `${initialHour}`);
    await expect
      .poll(() =>
        page
          .locator("m3e-date-input")
          .evaluate((element) => (element as HTMLElement & { value: Date | null }).value?.toISOString()),
      )
      .toBe("2024-01-15T10:30:00.000Z");
  });

  test("submits its ISO value with its form name", async ({ page, render }) => {
    await render(`
      <form id="schedule">
        <m3e-date-input name="start" value="2024-01-15T10:30:00.000Z"></m3e-date-input>
      </form>
    `);
    const formValues = () =>
      page.locator("#schedule").evaluate((form) => Array.from(new FormData(form as HTMLFormElement).entries()));

    await expect.poll(formValues).toEqual([["start", "2024-01-15T10:30:00.000Z"]]);
  });
});
