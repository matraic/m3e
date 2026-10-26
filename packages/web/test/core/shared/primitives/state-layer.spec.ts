import { expect, test } from "../../../fixtures";

type Layer = HTMLElement & {
  disabled: boolean;
  disableHover: boolean;
  enablePressed: boolean;
  htmlFor: string | null;
  show(state: "hover" | "focused" | "pressed"): void;
  hide(state: "hover" | "focused" | "pressed"): void;
};

const host = (attrs = "") => `
  <button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
    Press
    <m3e-state-layer for="c" ${attrs}></m3e-state-layer>
  </button>
`;

const layer = (page: import("@playwright/test").Page) => page.locator("m3e-state-layer .layer");

test.describe("m3e-state-layer", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(host());

    await expect(page.locator("m3e-state-layer")).toHaveAttribute("aria-hidden", "true");
  });

  test("defaults", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-state-layer");

    expect(await el.evaluate((x) => (x as Layer).disabled)).toBe(false);
    expect(await el.evaluate((x) => (x as Layer).disableHover)).toBe(false);
    expect(await el.evaluate((x) => (x as Layer).enablePressed)).toBe(false);
  });

  test("reflects disabled, disable-hover and enable-pressed", async ({ page, render }) => {
    await render(host("disabled disable-hover enable-pressed"));
    const el = page.locator("m3e-state-layer");

    await expect(el).toHaveAttribute("disabled", "");
    await expect(el).toHaveAttribute("disable-hover", "");
    await expect(el).toHaveAttribute("enable-pressed", "");
  });

  test("show and hide toggle the matching state", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-state-layer");

    for (const state of ["hover", "focused", "pressed"] as const) {
      await el.evaluate((x, s) => (x as Layer).show(s), state);
      await expect(layer(page)).toHaveClass(new RegExp(state));
      await el.evaluate((x, s) => (x as Layer).hide(s), state);
      await expect(layer(page)).not.toHaveClass(new RegExp(state));
    }
  });

  test("hovering the control shows the hover state", async ({ page, render }) => {
    await render(host());

    await page.locator("#c").hover();
    await expect(layer(page)).toHaveClass(/hover/);

    await page.mouse.move(0, 0);
    await expect(layer(page)).not.toHaveClass(/hover/);
  });

  test("disable-hover ignores hovering", async ({ page, render }) => {
    await render(host("disable-hover"));

    await page.locator("#c").hover();
    await page.waitForTimeout(100);

    await expect(layer(page)).not.toHaveClass(/hover/);
  });

  test("keyboard focus shows the focused state", async ({ page, render }) => {
    await render(host());

    await page.keyboard.press("Tab");
    await expect(page.locator("#c")).toBeFocused();
    await expect(layer(page)).toHaveClass(/focused/);

    await page.keyboard.press("Shift+Tab");
    await expect(layer(page)).not.toHaveClass(/focused/);
  });

  test("pointer focus does not show the focused state", async ({ page, render }) => {
    await render(host());

    await page.locator("#c").click();
    await expect(page.locator("#c")).toBeFocused();

    await expect(layer(page)).not.toHaveClass(/focused/);
  });

  test("disabled ignores hover and focus", async ({ page, render }) => {
    await render(host("disabled"));

    await page.locator("#c").hover();
    await page.keyboard.press("Tab");
    await page.waitForTimeout(100);

    await expect(layer(page)).not.toHaveClass(/hover|focused/);
  });

  test("disabling clears hover and focused states", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-state-layer");
    await el.evaluate((x) => {
      (x as Layer).show("hover");
      (x as Layer).show("focused");
    });

    await el.evaluate((x) => ((x as Layer).disabled = true));

    await expect(layer(page)).not.toHaveClass(/hover|focused/);
  });

  test("enable-pressed shows the pressed state while pressed", async ({ page, render }) => {
    await render(host("enable-pressed"));
    await page.locator("#c").hover();

    await page.mouse.down();
    await expect(layer(page)).toHaveClass(/pressed/);

    await page.mouse.up();
    await expect(layer(page)).not.toHaveClass(/pressed/);
  });

  test("without enable-pressed the pressed state is not shown", async ({ page, render }) => {
    await render(host());
    await page.locator("#c").hover();

    await page.mouse.down();
    await page.waitForTimeout(100);

    await expect(layer(page)).not.toHaveClass(/pressed/);
    await page.mouse.up();
  });

  test("removing the for association stops tracking the control", async ({ page, render }) => {
    await render(host());
    await page.locator("m3e-state-layer").evaluate((x) => ((x as Layer).htmlFor = null));

    await page.locator("#c").hover();
    await page.waitForTimeout(100);

    await expect(layer(page)).not.toHaveClass(/hover/);
  });

  test("disconnecting clears the hover and focused states", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-state-layer");
    await el.evaluate((x) => {
      (x as Layer).show("hover");
      (x as Layer).show("focused");
    });

    const classes = await el.evaluate((x) => {
      const inner = x.shadowRoot!.querySelector(".layer")!;
      x.remove();
      return inner.className;
    });

    expect(classes).not.toMatch(/hover|focused/);
  });
});
