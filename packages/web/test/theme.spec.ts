import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

const SPRINGS = ["fast-spatial", "default-spatial", "slow-spatial", "fast-effects", "default-effects", "slow-effects"];

/** Spring durations, in milliseconds, from the "Web: Convert springs to curves" table of the Material 3 motion specs. */
const DURATIONS = {
  standard: [350, 500, 750, 150, 200, 300],
  expressive: [350, 500, 650, 150, 200, 300],
};

/** Reads the computed `--md-sys-motion-spring-*` values of the element matching `selector`. */
function readSprings(page: Page, selector: string): Promise<string[]> {
  return page.$eval(
    selector,
    (element, springs) =>
      springs.map((x) => getComputedStyle(element).getPropertyValue(`--md-sys-motion-spring-${x}`).trim()),
    SPRINGS,
  );
}

test.describe("m3e-theme motion", () => {
  for (const motion of ["standard", "expressive"] as const) {
    test(`applies valid ${motion} spring tokens`, async ({ page, render }) => {
      await render(`<m3e-theme motion="${motion}"><div id="probe"></div></m3e-theme>`);

      const values = await readSprings(page, "#probe");
      expect(values.map((x) => Number.parseFloat(x))).toEqual(DURATIONS[motion]);
      for (const value of values) {
        expect(await page.evaluate((x) => CSS.supports("transition", `opacity ${x}`), value), value).toBe(true);
      }
    });
  }

  test("scopes a nested motion scheme to its own content", async ({ page, render }) => {
    await render(`
      <m3e-theme motion="expressive">
        <div id="outer"></div>
        <m3e-theme motion="standard"><div id="inner"></div></m3e-theme>
      </m3e-theme>`);

    expect((await readSprings(page, "#outer")).map((x) => Number.parseFloat(x))).toEqual(DURATIONS.expressive);
    expect((await readSprings(page, "#inner")).map((x) => Number.parseFloat(x))).toEqual(DURATIONS.standard);
  });

  test("treats an unknown motion scheme as standard", async ({ page, render }) => {
    await render(`
      <m3e-theme motion="expressive">
        <m3e-theme id="standard" motion="standard"><div id="standard-probe"></div></m3e-theme>
        <m3e-theme id="unknown" motion="unknown"><div id="unknown-probe"></div></m3e-theme>
      </m3e-theme>`);

    expect(await page.$eval("#unknown", (x) => (x as HTMLElement & { motion: string }).motion)).toBe("standard");
    expect(await readSprings(page, "#unknown-probe")).toEqual(await readSprings(page, "#standard-probe"));
  });
});

test.describe("m3e-theme color", () => {
  test("derives color tokens from the source color and dispatches change", async ({ page, render }) => {
    await render(`<m3e-theme color="#6750A4" scheme="light"><div id="probe"></div></m3e-theme>`);
    const primary = () =>
      page.$eval("#probe", (x) => getComputedStyle(x).getPropertyValue("--md-sys-color-primary").trim());

    const before = await primary();
    expect(before).toMatch(/^#[0-9a-f]{6}$/i);

    const changed = await page.evaluate(
      () =>
        new Promise<boolean>((resolve) => {
          const theme = document.querySelector("m3e-theme")!;
          theme.addEventListener("change", () => resolve(true), { once: true });
          theme.setAttribute("color", "#006A6A");
        }),
    );
    expect(changed).toBe(true);
    expect(await primary()).not.toBe(before);
  });
});
