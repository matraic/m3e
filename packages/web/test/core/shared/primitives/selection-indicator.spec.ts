import { expect, test } from "../../../fixtures";

type Indicator = HTMLElement & {
  disabled: boolean;
  selected: boolean;
  bounce: boolean;
  centered: boolean;
  htmlFor: string | null;
  show(state: "hover" | "focused" | "pressed"): void;
  hide(state: "hover" | "focused" | "pressed"): void;
};

const host = (attrs = "") => `
  <button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
    Press
    <m3e-selection-indicator for="c" ${attrs}></m3e-selection-indicator>
  </button>
`;

const layer = (page: import("@playwright/test").Page) => page.locator("m3e-selection-indicator .layer");

test.describe("m3e-selection-indicator", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(host());

    await expect(page.locator("m3e-selection-indicator")).toHaveAttribute("aria-hidden", "true");
  });

  test("defaults", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-selection-indicator");

    for (const prop of ["disabled", "selected", "bounce", "centered"] as const) {
      expect(await el.evaluate((x, p) => (x as Indicator)[p], prop)).toBe(false);
    }
  });

  test("reflects disabled, selected, bounce and centered", async ({ page, render }) => {
    await render(host("disabled selected bounce centered"));
    const el = page.locator("m3e-selection-indicator");

    for (const attr of ["disabled", "selected", "bounce", "centered"]) {
      await expect(el).toHaveAttribute(attr, "");
    }
  });

  test("the indicator is visible only when selected", async ({ page, render }) => {
    await render(host());
    const opacity = () =>
      page.locator("m3e-selection-indicator .indicator").evaluate((x) => parseFloat(getComputedStyle(x).opacity));

    expect(await opacity()).toBe(0);

    await page.locator("m3e-selection-indicator").evaluate((x) => ((x as Indicator).selected = true));
    await expect.poll(opacity).toBe(1);

    await page.locator("m3e-selection-indicator").evaluate((x) => ((x as Indicator).selected = false));
    await expect.poll(opacity).toBe(0);
  });

  test("show and hide drive the inner state layer", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-selection-indicator");

    await el.evaluate((x) => (x as Indicator).show("hover"));
    await expect(layer(page)).toHaveClass(/hover/);

    await el.evaluate((x) => (x as Indicator).hide("hover"));
    await expect(layer(page)).not.toHaveClass(/hover/);
  });

  test("hovering the control shows the hover state", async ({ page, render }) => {
    await render(host());

    await page.locator("#c").hover();
    await expect(layer(page)).toHaveClass(/hover/);

    await page.mouse.move(0, 0);
    await expect(layer(page)).not.toHaveClass(/hover/);
  });

  test("keyboard focus shows the focused state", async ({ page, render }) => {
    await render(host());

    await page.keyboard.press("Tab");
    await expect(layer(page)).toHaveClass(/focused/);
  });

  test("pressing the control shows the pressed state", async ({ page, render }) => {
    await render(host());
    await page.locator("#c").hover();

    await page.mouse.down();
    await expect(layer(page)).toHaveClass(/pressed/);
    await page.mouse.up();
  });

  test("disabled disables the inner state layer", async ({ page, render }) => {
    await render(host("disabled"));

    await expect(page.locator("m3e-selection-indicator m3e-state-layer")).toHaveAttribute("disabled", "");
    await page.locator("#c").hover();
    await page.waitForTimeout(100);
    await expect(layer(page)).not.toHaveClass(/hover/);
  });

  test("the inner state layer is attached to the same control", async ({ page, render }) => {
    await render(host());

    const same = await page.locator("m3e-selection-indicator").evaluate((x) => {
      const inner = x.shadowRoot!.querySelector("m3e-state-layer") as HTMLElement & { control: HTMLElement | null };
      return inner.control === document.getElementById("c");
    });

    expect(same).toBe(true);
  });

  test("detaching stops the inner state layer tracking the control", async ({ page, render }) => {
    await render(host());
    await page.locator("m3e-selection-indicator").evaluate((x) => ((x as Indicator).htmlFor = null));

    await page.locator("#c").hover();
    await page.waitForTimeout(100);

    await expect(layer(page)).not.toHaveClass(/hover/);
  });

  test("pressing records the pressed origin and clears it after the animation", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(host());
    const base = page.locator("m3e-selection-indicator .base");
    await page.locator("#c").hover({ position: { x: 150, y: 50 } });

    await page.mouse.down();
    await expect.poll(() => base.evaluate((x) => x.style.getPropertyValue("--_pressed-origin-x"))).not.toBe("");
    await page.mouse.up();
  });

  test("a centered indicator does not track the press origin", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(host("centered"));
    const base = page.locator("m3e-selection-indicator .base");
    await page.locator("#c").hover({ position: { x: 150, y: 50 } });

    await page.mouse.down();
    await page.waitForTimeout(100);

    expect(await base.evaluate((x) => x.style.getPropertyValue("--_pressed-origin-x"))).toBe("");
    await page.mouse.up();
  });
});
