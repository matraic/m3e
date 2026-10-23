import { expect, test } from "../../../fixtures";

type Elevation = HTMLElement & { disabled: boolean; level: number | null; htmlFor: string | null };

const host = (attrs = "") => `
  <button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
    Press
    <m3e-elevation for="c" ${attrs}></m3e-elevation>
  </button>
`;

const shadow = (page: import("@playwright/test").Page) => page.locator("m3e-elevation .shadow");

test.describe("m3e-elevation", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(host());

    await expect(page.locator("m3e-elevation")).toHaveAttribute("aria-hidden", "true");
  });

  test("defaults to no level and enabled", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-elevation");

    expect(await el.evaluate((x) => (x as Elevation).level)).toBeNull();
    expect(await el.evaluate((x) => (x as Elevation).disabled)).toBe(false);
  });

  test("reflects level and disabled", async ({ page, render }) => {
    await render(host('level="3" disabled'));
    const el = page.locator("m3e-elevation");

    await expect(el).toHaveAttribute("level", "3");
    await expect(el).toHaveAttribute("disabled", "");
  });

  test("an invalid level is reset to null", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-elevation");

    await el.evaluate(async (x) => {
      (x as Elevation).level = 9;
      await (x as Elevation & { updateComplete: Promise<boolean> }).updateComplete;
    });

    expect(await el.evaluate((x) => (x as Elevation).level)).toBeNull();
  });

  test("each level 0 to 5 is accepted", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-elevation");

    for (const level of [0, 1, 2, 3, 4, 5]) {
      await el.evaluate(async (x, l) => {
        (x as Elevation).level = l;
        await (x as Elevation & { updateComplete: Promise<boolean> }).updateComplete;
      }, level);
      expect(await el.evaluate((x) => (x as Elevation).level)).toBe(level);
    }
  });

  test("a higher level casts a different shadow", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-elevation");
    const shadowOf = async (level: number) => {
      await el.evaluate((x, l) => ((x as Elevation).level = l), level);
      await expect(el).toHaveAttribute("level", String(level));
      return shadow(page).evaluate((x) => getComputedStyle(x).boxShadow);
    };

    const low = await shadowOf(0);
    const high = await shadowOf(4);

    expect(high).not.toBe(low);
  });

  test("hovering the control lifts the shadow", async ({ page, render }) => {
    await render(host());

    await page.locator("#c").hover();
    await expect(shadow(page)).toHaveClass(/hover/);

    await page.mouse.move(0, 0);
    await expect(shadow(page)).not.toHaveClass(/hover/);
    await expect(shadow(page)).toHaveClass(/resting/);
  });

  test("keyboard focus applies the focus level", async ({ page, render }) => {
    await render(host());

    await page.keyboard.press("Tab");
    await expect(shadow(page)).toHaveClass(/focus/);

    await page.keyboard.press("Shift+Tab");
    await expect(shadow(page)).not.toHaveClass(/focus/);
  });

  test("pressing the control applies the pressed level", async ({ page, render }) => {
    await render(host());
    await page.locator("#c").hover();

    await page.mouse.down();
    await expect(shadow(page)).toHaveClass(/pressed/);

    await page.mouse.up();
    await expect(shadow(page)).not.toHaveClass(/pressed/);
  });

  test("disabled ignores hover, focus and press", async ({ page, render }) => {
    await render(host("disabled"));

    await page.locator("#c").hover();
    await page.mouse.down();
    await page.mouse.up();
    await page.waitForTimeout(100);

    await expect(shadow(page)).not.toHaveClass(/hover|focus|pressed/);
  });

  test("disabling resets to the resting level", async ({ page, render }) => {
    await render(host());
    await page.locator("#c").hover();
    await expect(shadow(page)).toHaveClass(/hover/);

    await page.locator("m3e-elevation").evaluate((x) => ((x as Elevation).disabled = true));

    await expect(shadow(page)).toHaveClass(/resting/);
    await expect(shadow(page)).not.toHaveClass(/hover/);
  });

  test("removing the for association stops tracking the control", async ({ page, render }) => {
    await render(host());
    await page.locator("m3e-elevation").evaluate((x) => ((x as Elevation).htmlFor = null));

    await page.locator("#c").hover();
    await page.waitForTimeout(100);

    await expect(shadow(page)).not.toHaveClass(/hover/);
  });
});
