import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

type Picker = HTMLElement & {
  date: Date | null;
  isOpen: boolean;
  show(trigger: HTMLElement): Promise<void>;
  toggle(trigger: HTMLElement): Promise<void>;
  hide(restoreFocus?: boolean): void;
  blackoutTimes?: (t: { hour: number; minute: number; second: number }) => boolean;
};

const picker = (attrs = "") => {
  const base = { format: "24", mode: "input" };
  const defaults = Object.entries(base)
    .filter(([k]) => !new RegExp(`\\b${k}=`).test(attrs))
    .map(([k, v]) => `${k}="${v}"`)
    .join(" ");
  return `
  <button id="trigger">Choose time</button>
  <m3e-timepicker date="2026-01-15T14:30:00"   ${defaults} ${attrs}></m3e-timepicker>
`;
};
const show = (page: Page) =>
  page.locator("m3e-timepicker").evaluate(async (el) => {
    await (el as Picker).show(document.querySelector("#trigger")!);
  });

const open = async (page: Page) => {
  await show(page);
  await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
};

const time = (page: Page) =>
  page.locator("m3e-timepicker").evaluate((el) => {
    const d = (el as Picker).date;
    return d && `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });

const countChanges = (page: Page) =>
  page.locator("m3e-timepicker").evaluate((el) => {
    const w = window as unknown as { changes: number };
    w.changes = 0;
    el.addEventListener("change", () => w.changes++);
  });

const changes = (page: Page) => page.evaluate(() => (window as unknown as { changes: number }).changes);

test.describe("m3e-timepicker", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("opens and updates its trigger state", async ({ page, render }) => {
    await render(picker());

    await open(page);

    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "true");
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
    await expect(page.getByText("Edit time")).toBeVisible();
    expect(await page.locator("m3e-timepicker").evaluate((el) => (el as Picker).isOpen)).toBe(true);
  });

  test("input mode shows the current time in 24-hour format", async ({ page, render }) => {
    await render(picker());
    await open(page);

    await expect(page.getByRole("spinbutton", { name: "Hour" })).toHaveValue("14");
    await expect(page.getByRole("spinbutton", { name: "Minute" })).toHaveValue("30");
    await expect(page.getByRole("radiogroup")).toHaveCount(0);
  });

  test("12-hour format shows the hour of the period and a period toggle", async ({ page, render }) => {
    await render(picker(`format="12"`));
    await open(page);

    await expect(page.getByRole("spinbutton", { name: "Hour" })).toHaveValue("02");
    await expect(page.getByRole("radio", { name: "PM" })).toHaveAttribute("aria-checked", "true");
    await expect(page.getByRole("radio", { name: "AM" })).toHaveAttribute("aria-checked", "false");
  });

  test("shows seconds when requested", async ({ page, render }) => {
    await render(picker(`show-seconds`));
    await open(page);

    await expect(page.getByRole("spinbutton", { name: "Second" })).toHaveValue("00");
  });

  test("commits a changed time and raises change on confirm", async ({ page, render }) => {
    await render(picker());
    await countChanges(page);
    await open(page);

    await page.getByRole("spinbutton", { name: "Minute" }).press("PageUp");
    expect(await time(page)).toBe("14:30");
    await page.getByRole("button", { name: "OK" }).click();

    expect(await time(page)).toBe("14:35");
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
    expect(await changes(page)).toBe(1);
  });

  test("discards a pending change when dismissed", async ({ page, render }) => {
    await render(picker());
    await countChanges(page);
    await open(page);

    await page.getByRole("spinbutton", { name: "Hour" }).press("ArrowUp");
    await page.getByRole("button", { name: "Cancel" }).click();

    expect(await time(page)).toBe("14:30");
    expect(await changes(page)).toBe(0);
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
  });

  test("arrow keys adjust a field and Backspace clears it", async ({ page, render }) => {
    await render(picker());
    await open(page);
    const minute = page.getByRole("spinbutton", { name: "Minute" });

    await minute.press("ArrowUp");
    await expect(minute).toHaveValue("31");
    await minute.press("ArrowDown");
    await minute.press("ArrowDown");
    await expect(minute).toHaveValue("29");
    await minute.press("Backspace");
    await expect(minute).toHaveValue("");
  });

  test("only digits can be typed into a field", async ({ page, render }) => {
    await render(picker());
    await open(page);
    const minute = page.getByRole("spinbutton", { name: "Minute" });

    await minute.focus();
    await page.keyboard.press("x");
    await expect(minute).toHaveValue("30");
    await page.keyboard.press("5");
    await expect(minute).toHaveValue("05");
  });

  for (const [field, keys, expected] of [
    ["Hour", "10", "10"],
    ["Hour", "07", "07"],
    ["Hour", "25", "05"],
    ["Minute", "59", "59"],
    ["Minute", "75", "05"],
    ["Minute", "5", "05"],
  ]) {
    test(`typing "${keys}" into an empty ${field.toLowerCase()} field gives ${expected}`, async ({ page, render }) => {
      await render(picker());
      await open(page);
      const input = page.getByRole("spinbutton", { name: field });

      await input.press("Backspace");
      await input.pressSequentially(keys);

      await expect(input).toHaveValue(expected);
    });
  }

  test("filling a whole value sets it without typing", async ({ page, render }) => {
    await render(picker());
    await open(page);
    const hour = page.getByRole("spinbutton", { name: "Hour" });
    const minute = page.getByRole("spinbutton", { name: "Minute" });

    await hour.fill("10");
    await minute.fill("45");
    await expect(hour).toHaveValue("10");
    await expect(minute).toHaveValue("45");

    await hour.fill("99");
    await expect(hour).toHaveValue("09");
  });

  test("typing a digit into a populated field replaces its value", async ({ page, render }) => {
    await render(picker());
    await open(page);
    const minute = page.getByRole("spinbutton", { name: "Minute" });

    await minute.focus();
    await page.keyboard.press("End");
    await page.keyboard.press("3");

    await expect(minute).toHaveValue("03");
  });

  test("the period toggle changes AM and PM", async ({ page, render }) => {
    await render(picker(`format="12"`));
    await countChanges(page);
    await open(page);

    await page.getByRole("radio", { name: "AM" }).click();
    await page.getByRole("button", { name: "OK" }).click();

    expect(await time(page)).toBe("02:30");
    expect(await changes(page)).toBe(1);
  });

  test("a clear field disables confirm", async ({ page, render }) => {
    await render(picker());
    await open(page);

    await page.getByRole("spinbutton", { name: "Hour" }).press("Backspace");

    await expect(page.getByRole("button", { name: "OK" })).toBeDisabled();
  });

  test("times before min-time disable confirm", async ({ page, render }) => {
    await render(picker(`min-time="09:00"`));
    await open(page);
    const hour = page.getByRole("spinbutton", { name: "Hour" });

    await expect(page.getByRole("button", { name: "OK" })).toBeEnabled();
    await hour.press("Backspace");
    await hour.pressSequentially("08");
    await expect(page.getByRole("button", { name: "OK" })).toBeDisabled();
    await hour.press("Backspace");
    await hour.pressSequentially("10");
    await expect(page.getByRole("button", { name: "OK" })).toBeEnabled();
  });

  test("times after max-time disable confirm", async ({ page, render }) => {
    await render(picker(`max-time="15:00"`));
    await open(page);

    const hour = page.getByRole("spinbutton", { name: "Hour" });
    await hour.press("Backspace");
    await hour.pressSequentially("16");
    await expect(page.getByRole("button", { name: "OK" })).toBeDisabled();
  });

  test("blackout times disable confirm", async ({ page, render }) => {
    await render(picker());
    await page.locator("m3e-timepicker").evaluate((el) => {
      (el as Picker).blackoutTimes = (t) => t.hour === 9;
    });
    await open(page);

    const hour = page.getByRole("spinbutton", { name: "Hour" });
    await hour.press("Backspace");
    await hour.pressSequentially("09");
    await expect(page.getByRole("button", { name: "OK" })).toBeDisabled();
    await hour.press("Backspace");
    await hour.pressSequentially("10");
    await expect(page.getByRole("button", { name: "OK" })).toBeEnabled();
  });

  test("the mode toggle switches between dial and input", async ({ page, render }) => {
    await render(picker(`mode="dial"`));
    await open(page);
    const toggle = page.getByRole("button", { name: "Toggle input picker" });

    await expect(page.getByText("Select time")).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");

    await toggle.click();
    await expect(page.getByText("Edit time")).toBeVisible();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
  });

  test("hide-mode-toggle removes the mode toggle", async ({ page, render }) => {
    await render(picker(`hide-mode-toggle`));
    await open(page);

    await expect(page.getByRole("button", { name: "Toggle input picker" })).toHaveCount(0);
  });

  test("uses custom labels", async ({ page, render }) => {
    await render(
      picker(`confirm-label="Apply" dismiss-label="Close" input-label="Type time" hour-label="HH" minute-label="MM"`),
    );
    await open(page).catch(() => undefined);

    await expect(page.getByRole("button", { name: "Apply" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
    await expect(page.getByText("Type time")).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "HH" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "MM" })).toBeVisible();
  });

  test("falls back to defaults for invalid attribute values", async ({ page, render }) => {
    await render(`<m3e-timepicker variant="x" orientation="x" format="x" mode="x"></m3e-timepicker>`);
    const el = page.locator("m3e-timepicker");

    await expect
      .poll(() =>
        el.evaluate((e) => {
          const p = e as unknown as { variant: string; orientation: string; format: string; mode: string };
          return [p.variant, p.orientation, p.format, p.mode];
        }),
      )
      .toEqual(["docked", "vertical", "12", "dial"]);
  });

  test("hide closes the picker and can restore focus to the trigger", async ({ page, render }) => {
    await render(picker());
    await open(page);

    await page.locator("m3e-timepicker").evaluate((el) => (el as Picker).hide(true));

    await expect(page.locator("#trigger")).toBeFocused();
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
    expect(await page.locator("m3e-timepicker").evaluate((el) => (el as Picker).isOpen)).toBe(false);
  });

  test("clicking outside closes a docked picker", async ({ page, render }) => {
    await render(`${picker()}<p id="outside" style="margin-top: 400px">Outside</p>`);
    await open(page);

    await page.locator("#outside").click();

    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
  });

  test("Escape closes a modal picker", async ({ page, render }) => {
    await render(picker(`variant="modal"`));
    await open(page);
    await expect(page.locator("m3e-timepicker")).toHaveAttribute("aria-modal", "true");

    await page.keyboard.press("Escape");

    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#trigger")).toBeFocused();
  });

  test("toggle opens and closes the picker", async ({ page, render }) => {
    await render(picker());
    const toggle = () =>
      page.locator("m3e-timepicker").evaluate(async (el) => {
        await (el as Picker).toggle(document.querySelector("#trigger")!);
      });

    await toggle();
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "true");
    await toggle();
    await expect(page.locator("#trigger")).toHaveAttribute("aria-expanded", "false");
  });

  test("m3e-timepicker-toggle opens the picker from its parent", async ({ page, render }) => {
    await render(`
      <m3e-button id="opener">Pick<m3e-timepicker-toggle for="tp"></m3e-timepicker-toggle></m3e-button>
      <m3e-timepicker id="tp" date="2026-01-15T14:30:00" format="24" mode="input"></m3e-timepicker>
    `);

    await expect(page.locator("#opener")).toHaveAttribute("aria-haspopup", "dialog");
    await page.locator("#opener").click();

    await expect(page.getByRole("button", { name: "OK" })).toBeVisible();
    await expect(page.locator("#opener")).toHaveAttribute("aria-expanded", "true");
  });
});
