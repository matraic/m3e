import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures";

const stepper = (attrs = "", stepAttrs: string[] = ["", "", ""]) => `
  <m3e-stepper ${attrs}>
    <m3e-step for="p1" ${stepAttrs[0]}>One</m3e-step>
    <m3e-step for="p2" ${stepAttrs[1]}>Two</m3e-step>
    <m3e-step for="p3" ${stepAttrs[2]}>Three</m3e-step>
    <m3e-step-panel id="p1">
      <form><input name="a" aria-label="A" required /></form>
      <div slot="actions"><m3e-button><m3e-stepper-next>Next</m3e-stepper-next></m3e-button></div>
    </m3e-step-panel>
    <m3e-step-panel id="p2">
      <form><input name="b" aria-label="B" /></form>
      <div slot="actions">
        <m3e-button><m3e-stepper-previous>Back</m3e-stepper-previous></m3e-button>
        <m3e-button><m3e-stepper-next>Next2</m3e-stepper-next></m3e-button>
      </div>
    </m3e-step-panel>
    <m3e-step-panel id="p3">
      Done
      <div slot="actions">
        <m3e-button><m3e-stepper-previous>Back3</m3e-stepper-previous></m3e-button>
        <m3e-button><m3e-stepper-reset>Reset</m3e-stepper-reset></m3e-button>
      </div>
    </m3e-step-panel>
  </m3e-stepper>
`;

type Stepper = HTMLElement & {
  selectedIndex: number;
  moveNext(): boolean;
  movePrevious(): boolean;
  moveTo(i: number): boolean;
  reset(): void;
};

const index = (page: Page) => page.locator("m3e-stepper").evaluate((el) => (el as Stepper).selectedIndex);
const call = (page: Page, method: "moveNext" | "movePrevious" | "moveTo" | "reset", ...args: number[]) =>
  page
    .locator("m3e-stepper")
    .evaluate((el, [m, a]) => (el as Stepper)[m as "moveTo"](...(a as [number])), [method, args] as [string, number[]]);

test.describe("m3e-stepper", () => {
  test("selects the first step and shows only its panel", async ({ page, render }) => {
    await render(stepper());

    expect(await index(page)).toBe(0);
    await expect(page.locator("m3e-step").first()).toHaveAttribute("selected", "");
    await expect(page.locator("#p1 input")).toBeVisible();
    await expect(page.locator("#p2 input")).toBeHidden();
  });

  test("steps link to their panels", async ({ page, render }) => {
    await render(stepper());

    await expect(page.locator("m3e-step").nth(1)).toHaveAttribute("aria-controls", "p2");
    await expect(page.locator("m3e-step-panel").first()).toHaveAttribute("role", "tabpanel");
    await expect(page.locator("m3e-step").first()).toHaveAttribute("role", "tab");
  });

  test("clicking a step moves to it and raises events", async ({ page, render }) => {
    await render(stepper());
    await page.locator("m3e-stepper").evaluate((el) => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      for (const t of ["beforeinput", "input", "change"]) el.addEventListener(t, () => w.events.push(t));
    });

    await page.locator("m3e-step").nth(1).click();

    expect(await index(page)).toBe(1);
    await expect(page.locator("#p2 input")).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual([
      "beforeinput",
      "input",
      "change",
    ]);
  });

  test("a cancelled beforeinput prevents moving", async ({ page, render }) => {
    await render(stepper());
    await page
      .locator("m3e-step")
      .nth(1)
      .evaluate((el) => el.addEventListener("beforeinput", (e) => e.preventDefault()));
    await page.locator("m3e-step").nth(1).click();

    expect(await index(page)).toBe(0);
  });

  test("the previous step is marked completed after moving on", async ({ page, render }) => {
    await render(stepper());
    await page.locator("m3e-step").nth(1).click();

    await expect(page.locator("m3e-step").first()).toHaveAttribute("completed", "");
  });

  test("next, previous and reset actions navigate", async ({ page, render }) => {
    await render(stepper());

    await page.getByText("Next", { exact: true }).click();
    await expect.poll(() => index(page)).toBe(1);
    await page.getByText("Next2").click();
    await expect.poll(() => index(page)).toBe(2);
    await page.getByText("Back3").click();
    await expect.poll(() => index(page)).toBe(1);
    await page.getByText("Back", { exact: true }).click();
    await expect.poll(() => index(page)).toBe(0);
    await page.getByText("Next", { exact: true }).click();
    await page.getByText("Next2").click();
    await page.getByText("Reset").click();

    await expect.poll(() => index(page)).toBe(0);
    await expect(page.locator("m3e-step").first()).not.toHaveAttribute("completed", "");
  });

  test("moveNext and movePrevious return whether they moved", async ({ page, render }) => {
    await render(stepper());

    expect(await call(page, "movePrevious")).toBe(false);
    expect(await call(page, "moveNext")).toBe(true);
    expect(await call(page, "moveNext")).toBe(true);
    expect(await call(page, "moveNext")).toBe(false);
    expect(await index(page)).toBe(2);
  });

  test("moveTo raises change and ignores out of range indexes", async ({ page, render }) => {
    await render(stepper());
    await page.locator("m3e-stepper").evaluate((el) => {
      const w = window as unknown as { changes: number };
      w.changes = 0;
      el.addEventListener("change", () => w.changes++);
    });

    expect(await call(page, "moveTo", 2)).toBe(true);
    expect(await call(page, "moveTo", 9)).toBe(false);
    expect(await call(page, "moveTo", -1)).toBe(false);
    expect(await page.evaluate(() => (window as unknown as { changes: number }).changes)).toBe(1);
  });

  test("arrow keys move focus between steps and Enter selects", async ({ page, render }) => {
    await render(stepper());
    const steps = page.locator("m3e-step");
    await steps.first().focus();

    await page.keyboard.press("ArrowRight");
    await expect(steps.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(steps.nth(2)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(steps.first()).toBeFocused();
    expect(await index(page)).toBe(0);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect.poll(() => index(page)).toBe(1);
  });

  test("disabled steps cannot be selected", async ({ page, render }) => {
    await render(stepper("", ["", "disabled", ""]));

    await page.locator("m3e-step").nth(1).dispatchEvent("click");
    expect(await index(page)).toBe(0);
    expect(await call(page, "moveTo", 1)).toBe(false);
    expect(await call(page, "moveNext")).toBe(false);
  });

  test("the first enabled step is initially selected", async ({ page, render }) => {
    await render(stepper("", ["disabled", "", ""]));
    expect(await index(page)).toBe(1);
  });

  test("linear mode blocks leaving an invalid step", async ({ page, render }) => {
    await render(stepper("linear"));

    expect(await call(page, "moveNext")).toBe(false);
    expect(await index(page)).toBe(0);
    await expect(page.locator("m3e-step").first()).toHaveAttribute("invalid", "");

    await page.locator("#p1 input").fill("x");
    expect(await call(page, "moveNext")).toBe(true);
    expect(await index(page)).toBe(1);
  });

  test("linear mode allows leaving an optional invalid step", async ({ page, render }) => {
    await render(stepper("linear", ["optional", "", ""]));

    expect(await call(page, "moveNext")).toBe(true);
    await expect(page.locator("m3e-step").first()).toContainText("(Optional)");
  });

  test("linear mode blocks skipping ahead", async ({ page, render }) => {
    await render(stepper("linear"));
    await page.locator("#p1 input").fill("x");

    expect(await call(page, "moveTo", 2)).toBe(false);
    expect(await index(page)).toBe(0);
  });

  test("linear mode blocks returning to a completed non-editable step", async ({ page, render }) => {
    await render(stepper("linear"));
    await page.locator("#p1 input").fill("x");
    await call(page, "moveNext");

    expect(await call(page, "movePrevious")).toBe(false);
    expect(await index(page)).toBe(1);
  });

  test("linear mode allows returning to a completed editable step", async ({ page, render }) => {
    await render(stepper("linear", ["editable", "", ""]));
    await page.locator("#p1 input").fill("x");
    await call(page, "moveNext");

    expect(await call(page, "movePrevious")).toBe(true);
    expect(await index(page)).toBe(0);
  });

  test("reset clears forms and completion state", async ({ page, render }) => {
    await render(stepper());
    await page.locator("#p1 input").fill("hello");
    await call(page, "moveNext");
    await call(page, "reset");

    expect(await index(page)).toBe(0);
    await expect(page.locator("#p1 input")).toHaveValue("");
    await expect(page.locator("m3e-step").first()).not.toHaveAttribute("completed", "");
  });

  test("orientation and positions fall back to defaults", async ({ page, render }) => {
    await render(stepper(`orientation="bogus" header-position="bogus" label-position="bogus"`));
    const el = page.locator("m3e-stepper");

    await expect(el).toHaveAttribute("orientation", "horizontal");
    await expect(el).toHaveAttribute("header-position", "above");
    await expect(el).toHaveAttribute("label-position", "end");
  });

  test("vertical orientation exposes aria-orientation", async ({ page, render }) => {
    await render(stepper(`orientation="vertical"`));

    await expect(page.getByRole("tablist")).toHaveAttribute("aria-orientation", "vertical");
    await expect(page.locator("m3e-step").nth(1)).toHaveCSS("order", "1");
  });

  test("header position below renders the header after the panels", async ({ page, render }) => {
    await render(stepper(`header-position="below"`));

    const tabs = (await page.getByRole("tablist").boundingBox())!;
    const panel = (await page.locator("#p1").boundingBox())!;
    expect(tabs.y).toBeGreaterThan(panel.y);
  });

  test("steps added later are numbered and the selection persists", async ({ page, render }) => {
    await render(stepper());
    await page
      .locator("m3e-step")
      .nth(2)
      .evaluate((el) => {
        const s = document.createElement("m3e-step");
        s.textContent = "Four";
        el.after(s);
      });

    await expect
      .poll(() => page.locator("m3e-stepper").evaluate((el) => (el as unknown as { steps: unknown[] }).steps.length))
      .toBe(4);
    expect(await index(page)).toBe(0);
  });
});
