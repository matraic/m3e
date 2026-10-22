import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const pane = (attrs = "", end = true) => `
  <div style="width: 400px; height: 200px">
    <m3e-split-pane ${attrs}>
      <div slot="start">Start</div>
      ${end ? `<div slot="end">End</div>` : ""}
    </m3e-split-pane>
  </div>
`;

type Pane = HTMLElement & {
  value: number;
  collapse(): void;
  expand(): void;
  snapToValue(value: number): void;
};

const value = (page: Page) => page.locator("m3e-split-pane").evaluate((el) => (el as Pane).value);

test.describe("m3e-split-pane", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("exposes a separator with default label and values", async ({ page, render }) => {
    await render(pane());
    const handle = page.getByRole("separator", { name: "Resize panes" });

    await expect(handle).toBeVisible();
    await expect(handle).toHaveAttribute("aria-valuenow", "50");
    await expect(handle).toHaveAttribute("aria-valuemin", "0");
    await expect(handle).toHaveAttribute("aria-valuemax", "100");
    await expect(handle).toHaveAttribute("aria-orientation", "vertical");
    await expect(handle).toHaveAttribute("aria-valuetext", "Panes equally sized");
  });

  test("uses a custom label", async ({ page, render }) => {
    await render(pane(`label="Sidebar width"`));
    await expect(page.getByRole("separator", { name: "Sidebar width" })).toBeVisible();
  });

  test("reflects the value attribute", async ({ page, render }) => {
    await render(pane(`value="30"`));
    await expect(page.getByRole("separator")).toHaveAttribute("aria-valuenow", "30");
    await expect(page.getByRole("separator")).toHaveAttribute("aria-valuetext", "Left pane 30%, right pane 70%");
  });

  test("describes collapsed panes", async ({ page, render }) => {
    await render(pane(`value="0"`));
    await expect(page.getByRole("separator")).toHaveAttribute("aria-valuetext", "Left pane collapsed");

    await page.locator("m3e-split-pane").evaluate((el) => ((el as Pane).value = 100));
    await expect(page.getByRole("separator")).toHaveAttribute("aria-valuetext", "Right pane collapsed");
  });

  test("uses a vertical orientation", async ({ page, render }) => {
    await render(pane(`orientation="vertical" value="25"`));
    const handle = page.getByRole("separator");

    await expect(handle).toHaveAttribute("aria-orientation", "horizontal");
    await expect(handle).toHaveAttribute("aria-valuetext", "Top pane 25%, bottom pane 75%");
  });

  test("falls back to horizontal for an invalid orientation", async ({ page, render }) => {
    await render(pane(`orientation="diagonal"`));
    await expect(page.locator("m3e-split-pane")).toHaveAttribute("orientation", "horizontal");
  });

  test("uses a custom value formatter", async ({ page, render }) => {
    await render(pane());
    await page.locator("m3e-split-pane").evaluate((el) => {
      (el as unknown as { valueFormatter: (v: number) => string }).valueFormatter = (v) => `${v} percent`;
      (el as Pane).value = 40;
    });

    await expect(page.getByRole("separator")).toHaveAttribute("aria-valuetext", "40 percent");
  });

  test("arrow keys adjust the value by step and raise events", async ({ page, render }) => {
    await render(pane(`value="50" step="1"`));
    await page.locator("m3e-split-pane").evaluate((el) => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      for (const t of ["beforeinput", "input", "change"]) el.addEventListener(t, () => w.events.push(t));
    });

    const handle = page.getByRole("separator");
    await handle.focus();
    await page.keyboard.press("ArrowRight");
    expect(await value(page)).toBe(51);
    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    expect(await value(page)).toBe(49);

    const events = await page.evaluate(() => (window as unknown as { events: string[] }).events);
    expect(events.slice(0, 3)).toEqual(["beforeinput", "input", "change"]);
    expect(events.filter((e) => e === "change")).toHaveLength(3);
  });

  test("Home and End move to min and max", async ({ page, render }) => {
    await render(pane(`value="50" min="20" max="80"`));
    await page.getByRole("separator").focus();

    await page.keyboard.press("End");
    await expect.poll(() => value(page)).toBe(80);
    await page.keyboard.press("Home");
    await expect.poll(() => value(page)).toBe(20);
  });

  test("PageUp and PageDown move by at least 10", async ({ page, render }) => {
    await render(pane(`value="50"`));
    await page.getByRole("separator").focus();

    await page.keyboard.press("PageDown");
    await expect.poll(() => value(page)).toBe(60);
    await page.keyboard.press("PageUp");
    await page.keyboard.press("PageUp");
    await expect.poll(() => value(page)).toBe(40);
  });

  test("clamps keyboard changes to min and max", async ({ page, render }) => {
    await render(pane(`value="21" min="20" max="80"`));
    await page.getByRole("separator").focus();

    await page.keyboard.press("ArrowLeft");
    await page.keyboard.press("ArrowLeft");
    expect(await value(page)).toBe(20);
  });

  test("a cancelled beforeinput prevents the change", async ({ page, render }) => {
    await render(pane(`value="50"`));
    await page
      .locator("m3e-split-pane")
      .evaluate((el) => el.addEventListener("beforeinput", (e) => e.preventDefault()));
    await page.getByRole("separator").focus();
    await page.keyboard.press("ArrowRight");

    expect(await value(page)).toBe(50);
  });

  test("keyboard moves between detents", async ({ page, render }) => {
    await render(pane(`value="50" detents="0 25 50 75 100"`));
    await page.getByRole("separator").focus();

    await page.keyboard.press("ArrowRight");
    await expect.poll(() => value(page)).toBe(75);
    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => value(page)).toBe(50);
    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => value(page)).toBe(25);
  });

  test("Enter cycles detents and wraps when enabled", async ({ page, render }) => {
    await render(pane(`value="0" detents="0 50 100" wrap-detents`));
    await page.getByRole("separator").focus();

    await page.keyboard.press("Enter");
    await expect.poll(() => value(page)).toBe(50);
    await page.keyboard.press("Enter");
    await expect.poll(() => value(page)).toBe(100);
    await page.keyboard.press("Enter");
    await expect.poll(() => value(page)).toBe(0);
  });

  test("Enter does not wrap by default", async ({ page, render }) => {
    await render(pane(`value="100" detents="0 50 100"`));
    await page.getByRole("separator").focus();

    await page.keyboard.press("Enter");
    expect(await value(page)).toBe(100);
  });

  test("collapse and expand move to min and max", async ({ page, render }) => {
    await render(pane(`value="50" min="10" max="90"`));
    const el = page.locator("m3e-split-pane");

    await el.evaluate((e) => (e as Pane).collapse());
    await expect.poll(() => value(page)).toBe(10);
    await el.evaluate((e) => (e as Pane).expand());
    await expect.poll(() => value(page)).toBe(90);
  });

  test("snapToValue snaps to the closest detent", async ({ page, render }) => {
    await render(pane(`value="50" detents="0 25 75"`));
    await page.locator("m3e-split-pane").evaluate((e) => (e as Pane).snapToValue(70));

    await expect.poll(() => value(page)).toBe(75);
  });

  test("pixel detents are converted to a percentage of the width", async ({ page, render }) => {
    await render(pane(`value="50" detents="100px 300px"`));
    await page.locator("m3e-split-pane").evaluate((e) => (e as Pane).snapToValue(0));

    await expect.poll(() => value(page)).toBe(25);
  });

  test("dragging the handle changes the value and raises change", async ({ page, render }) => {
    await render(pane(`value="50"`));
    await page.locator("m3e-split-pane").evaluate((el) => {
      const w = window as unknown as { changes: number };
      w.changes = 0;
      el.addEventListener("change", () => w.changes++);
    });

    const box = (await page.getByRole("separator").boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 20, y, { steps: 5 });
    await page.mouse.move(x + 40, y, { steps: 5 });
    await page.mouse.up();

    await expect.poll(() => value(page)).toBeGreaterThan(55);
    expect(await page.evaluate(() => (window as unknown as { changes: number }).changes)).toBe(1);
  });

  test("dragging past the maximum settles at the maximum", async ({ page, render }) => {
    await render(pane(`value="50" max="70"`));

    const box = (await page.getByRole("separator").boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 100, y, { steps: 10 });
    await page.mouse.up();

    await expect.poll(() => value(page)).toBe(70);
  });

  test("disabled removes the handle from the tab order", async ({ page, render }) => {
    await render(pane(`disabled`));
    const handle = page.getByRole("separator");

    await expect(handle).toHaveAttribute("aria-disabled", "true");
    await expect(handle).not.toHaveAttribute("tabindex", /.*/);
  });

  test("disabled ignores dragging", async ({ page, render }) => {
    await render(pane(`disabled value="50"`));

    const box = (await page.getByRole("separator").boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 60, y, { steps: 5 });
    await page.mouse.up();

    expect(await value(page)).toBe(50);
  });

  test("hides the drag handle when there is only one pane", async ({ page, render }) => {
    await render(pane(`value="50"`, false));
    await expect(page.getByRole("separator")).toBeHidden();
  });

  test("hides the drag handle when the end pane is hidden", async ({ page, render }) => {
    await render(pane());
    await expect(page.getByRole("separator")).toBeVisible();

    await page.locator("[slot=end]").evaluate((el) => el.setAttribute("hidden", ""));
    await expect(page.getByRole("separator")).toBeHidden();
  });

  test("participates in forms with its value", async ({ page, render }) => {
    await render(
      `<form><m3e-split-pane name="split" value="35"><div slot="start">A</div><div slot="end">B</div></m3e-split-pane></form>`,
    );

    const data = await page.locator("form").evaluate((f) => new FormData(f as HTMLFormElement).get("split"));
    expect(data).toBe("35");
  });
});
