import { expect, test } from "./fixtures";

async function showDatepicker(page: import("@playwright/test").Page): Promise<void> {
  await page.locator("m3e-datepicker").evaluate(async (element) => {
    const picker = element as HTMLElement & { show(trigger: HTMLElement): Promise<void> };
    await picker.show(document.querySelector("#trigger")!);
  });
}

async function readDate(page: import("@playwright/test").Page): Promise<string | null> {
  return page.locator("m3e-datepicker").evaluate((element) => {
    const date = (element as HTMLElement & { date: Date | null }).date;
    return date && `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  });
}

test.describe("m3e-datepicker", () => {
  test("opens with a calendar and updates its trigger state", async ({ page, render }) => {
    await render(`
      <button id="trigger">Choose date</button>
      <m3e-datepicker start-at="2026-01-15"></m3e-datepicker>
    `);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const trigger = page.locator("#trigger");

    await showDatepicker(page);

    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Jan 2026" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
  });

  test("commits a selected date and dispatches change on confirm", async ({ page, render }) => {
    await render(`
      <button id="trigger">Choose date</button>
      <m3e-datepicker date="2026-01-15" start-at="2026-01-15"></m3e-datepicker>
    `);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => {
      (window as unknown as { datepickerChanges: number }).datepickerChanges = 0;
      document
        .querySelector("m3e-datepicker")!
        .addEventListener("change", () => ((window as unknown as { datepickerChanges: number }).datepickerChanges += 1));
    });

    await showDatepicker(page);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");

    expect(await readDate(page)).toBe("2026-01-15");
    await page.getByRole("button", { name: "OK" }).click();

    expect(await readDate(page)).toBe("2026-01-20");
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => (window as unknown as { datepickerChanges: number }).datepickerChanges)).toBe(1);
  });

  test("discards a pending selection when dismissed", async ({ page, render }) => {
    await render(`
      <button id="trigger">Choose date</button>
      <m3e-datepicker date="2026-01-15" start-at="2026-01-15"></m3e-datepicker>
    `);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => {
      (window as unknown as { datepickerChanges: number }).datepickerChanges = 0;
      document
        .querySelector("m3e-datepicker")!
        .addEventListener("change", () => ((window as unknown as { datepickerChanges: number }).datepickerChanges += 1));
    });

    await showDatepicker(page);
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press("ArrowRight");
    }
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Cancel" }).click();

    expect(await readDate(page)).toBe("2026-01-15");
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => (window as unknown as { datepickerChanges: number }).datepickerChanges)).toBe(0);
  });

  test("clears the selected date and dispatches change", async ({ page, render }) => {
    await render(`
      <button id="trigger">Choose date</button>
      <m3e-datepicker clearable date="2026-01-15" start-at="2026-01-15"></m3e-datepicker>
    `);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.evaluate(() => {
      (window as unknown as { datepickerChanges: number }).datepickerChanges = 0;
      document
        .querySelector("m3e-datepicker")!
        .addEventListener("change", () => ((window as unknown as { datepickerChanges: number }).datepickerChanges += 1));
    });

    await showDatepicker(page);
    await page.getByRole("button", { name: "Clear" }).click();

    expect(await readDate(page)).toBeNull();
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
    expect(await page.evaluate(() => (window as unknown as { datepickerChanges: number }).datepickerChanges)).toBe(1);
  });

  test("closes a modal picker on Escape and restores trigger focus", async ({ page, render }) => {
    await render(`
      <button id="trigger">Choose date</button>
      <m3e-datepicker variant="modal" start-at="2026-01-15"></m3e-datepicker>
    `);
    await page.emulateMedia({ reducedMotion: "reduce" });

    await showDatepicker(page);
    await expect(page.locator("m3e-datepicker")).toHaveAttribute("aria-modal", "true");
    await page.keyboard.press("Escape");

    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#trigger")).toBeFocused();
  });
});
