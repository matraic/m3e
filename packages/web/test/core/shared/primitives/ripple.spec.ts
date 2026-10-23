import { expect, test } from "../../../fixtures";

type Ripple = HTMLElement & {
  disabled: boolean;
  centered: boolean;
  unbounded: boolean;
  radius: number | null;
  visible: boolean;
  htmlFor: string | null;
  show(x: number, y: number, persistent?: boolean): void;
  hide(): void;
};

const host = (attrs = "") => `
  <button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
    Press
    <m3e-ripple for="c" ${attrs}></m3e-ripple>
  </button>
`;

const ripples = (page: import("@playwright/test").Page) => page.locator("m3e-ripple .ripple");

test.describe("m3e-ripple", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(host());

    await expect(page.locator("m3e-ripple")).toHaveAttribute("aria-hidden", "true");
  });

  test("defaults", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");

    expect(await el.evaluate((x) => (x as Ripple).disabled)).toBe(false);
    expect(await el.evaluate((x) => (x as Ripple).centered)).toBe(false);
    expect(await el.evaluate((x) => (x as Ripple).unbounded)).toBe(false);
    expect(await el.evaluate((x) => (x as Ripple).radius)).toBeNull();
    expect(await el.evaluate((x) => (x as Ripple).visible)).toBe(false);
  });

  test("reflects disabled, centered and unbounded", async ({ page, render }) => {
    await render(host("disabled centered unbounded"));

    const el = page.locator("m3e-ripple");
    await expect(el).toHaveAttribute("disabled", "");
    await expect(el).toHaveAttribute("centered", "");
    await expect(el).toHaveAttribute("unbounded", "");
  });

  test("show launches a ripple and hide lets it exit", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");

    await el.evaluate((x) => (x as Ripple).show(100, 100, true));
    await expect(ripples(page)).toHaveCount(1);
    expect(await el.evaluate((x) => (x as Ripple).visible)).toBe(true);

    await el.evaluate((x) => (x as Ripple).hide());
    await expect(ripples(page)).toHaveCount(0);
    expect(await el.evaluate((x) => (x as Ripple).visible)).toBe(false);
  });

  test("a persistent ripple remains until hidden", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");

    await el.evaluate((x) => (x as Ripple).show(100, 100, true));
    await expect(ripples(page).first()).toHaveClass(/persistent/);
    await page.waitForTimeout(800);

    expect(await el.evaluate((x) => (x as Ripple).visible)).toBe(true);
  });

  test("a non-persistent ripple ends on its own", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");

    await el.evaluate((x) => (x as Ripple).show(100, 100));

    await expect.poll(() => el.evaluate((x) => (x as Ripple).visible)).toBe(false);
  });

  test("an explicit radius sets the ripple size", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");
    await el.evaluate((x) => ((x as Ripple).radius = 25));

    await el.evaluate((x) => (x as Ripple).show(100, 100, true));

    const size = await ripples(page)
      .first()
      .evaluate((r) => ({ w: (r as HTMLElement).style.width, h: (r as HTMLElement).style.height }));
    expect(size).toEqual({ w: "50px", h: "50px" });
  });

  test("the default radius reaches the farthest corner", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");
    const bounds = await el.evaluate((x) => {
      const b = x.getBoundingClientRect();
      return { left: b.left, top: b.top, width: b.width, height: b.height };
    });

    await el.evaluate((x, b) => (x as Ripple).show(b.left, b.top, true), bounds);

    const width = await ripples(page)
      .first()
      .evaluate((r) => parseFloat((r as HTMLElement).style.width));
    expect(width).toBeCloseTo(2 * Math.hypot(bounds.width, bounds.height), 0);
  });

  test("centered ripples originate from the centre", async ({ page, render }) => {
    await render(host("centered"));
    const el = page.locator("m3e-ripple");
    await el.evaluate((x) => ((x as Ripple).radius = 10));

    await el.evaluate((x) => (x as Ripple).show(0, 0, true));

    const pos = await ripples(page)
      .first()
      .evaluate((r) => ({ l: (r as HTMLElement).style.left, t: (r as HTMLElement).style.top }));
    const bounds = await el.evaluate((x) => ({
      w: x.getBoundingClientRect().width,
      h: x.getBoundingClientRect().height,
    }));
    expect(parseFloat(pos.l)).toBeCloseTo(bounds.w / 2 - 10, 0);
    expect(parseFloat(pos.t)).toBeCloseTo(bounds.h / 2 - 10, 0);
  });

  test("pressing the control launches a ripple that exits on release", async ({ page, render }) => {
    await render(host());
    await page.locator("#c").hover();

    await page.mouse.down();
    await expect(ripples(page)).toHaveCount(1);
    expect(await page.locator("m3e-ripple").evaluate((x) => (x as Ripple).visible)).toBe(true);

    await page.mouse.up();
    await expect(ripples(page)).toHaveCount(0);
  });

  test("pressing Space on the control launches a ripple", async ({ page, render }) => {
    await render(host());
    await page.locator("#c").focus();

    await page.keyboard.down(" ");
    await expect(ripples(page)).toHaveCount(1);

    await page.keyboard.up(" ");
    await expect(ripples(page)).toHaveCount(0);
  });

  test("disabled suppresses press ripples but not manual ones", async ({ page, render }) => {
    await render(host("disabled"));
    await page.locator("#c").hover();

    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(100);
    expect(await page.locator("m3e-ripple").evaluate((x) => (x as Ripple).visible)).toBe(false);

    await page.locator("m3e-ripple").evaluate((x) => (x as Ripple).show(10, 10, true));
    await expect(ripples(page)).toHaveCount(1);
  });

  test("disabling hides ripples in progress", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");
    await el.evaluate((x) => (x as Ripple).show(100, 100, true));

    await el.evaluate((x) => ((x as Ripple).disabled = true));

    await expect(ripples(page)).toHaveCount(0);
  });

  test("removing the for association stops press ripples", async ({ page, render }) => {
    await render(host());
    await page.locator("m3e-ripple").evaluate((x) => ((x as Ripple).htmlFor = null));
    await page.locator("#c").hover();

    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(100);

    expect(await page.locator("m3e-ripple").evaluate((x) => (x as Ripple).visible)).toBe(false);
  });

  test("ripples are cleaned up when disconnected", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-ripple");
    await el.evaluate((x) => (x as Ripple).show(100, 100, true));

    const visible = await el.evaluate((x) => {
      x.remove();
      return (x as Ripple).visible;
    });

    expect(visible).toBe(false);
  });
});
