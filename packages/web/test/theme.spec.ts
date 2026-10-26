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

const VARIANTS = [
  "monochrome",
  "neutral",
  "tonal-spot",
  "vibrant",
  "expressive",
  "fidelity",
  "content",
  "rainbow",
  "fruit-salad",
] as const;

/** Reads a computed custom property from the element matching `selector`. */
function readToken(page: Page, selector: string, token: string): Promise<string> {
  return page.$eval(selector, (element, name) => getComputedStyle(element).getPropertyValue(name).trim(), token);
}

test.describe("m3e-theme options", () => {
  for (const variant of VARIANTS) {
    test(`derives a primary color for the ${variant} variant`, async ({ page, render }) => {
      await render(`<m3e-theme color="#6750A4" scheme="light" variant="${variant}"><div id="probe"></div></m3e-theme>`);

      expect(await readToken(page, "#probe", "--md-sys-color-primary")).toMatch(/^#[0-9a-f]{6}$/i);
    });
  }

  const changesPrimary = async (
    page: Page,
    render: (html: string) => Promise<void>,
    attr: string,
    from: string,
    to: string,
  ) => {
    await render(`<m3e-theme color="#6750A4" ${attr}="${from}"><div id="probe"></div></m3e-theme>`);
    const before = await readToken(page, "#probe", "--md-sys-color-primary");
    await page.locator("m3e-theme").evaluate((el, [name, value]) => el.setAttribute(name, value), [attr, to]);
    await expect.poll(() => readToken(page, "#probe", "--md-sys-color-primary")).not.toBe(before);
  };

  test("changing the variant changes the palette", async ({ page, render }) => {
    await changesPrimary(page, render, "variant", "tonal-spot", "monochrome");
  });

  test("changing the contrast to high changes the palette", async ({ page, render }) => {
    await changesPrimary(page, render, "contrast", "standard", "high");
  });

  test("changing the contrast to medium changes the palette", async ({ page, render }) => {
    await changesPrimary(page, render, "contrast", "standard", "medium");
  });

  test("changing the scheme from light to dark changes the palette", async ({ page, render }) => {
    await changesPrimary(page, render, "scheme", "light", "dark");
  });
  test("an unknown variant still yields a valid palette", async ({ page, render }) => {
    await render(`<m3e-theme color="#6750A4" scheme="light" variant="bogus"><div id="probe"></div></m3e-theme>`);

    expect(await readToken(page, "#probe", "--md-sys-color-primary")).toMatch(/^#[0-9a-f]{6}$/i);
  });

  test("auto scheme follows prefers-color-scheme", async ({ page, render }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await render(`
      <m3e-theme scheme="auto"><div id="auto"></div></m3e-theme>
      <m3e-theme scheme="dark"><div id="dark"></div></m3e-theme>
    `);

    await expect
      .poll(() => readToken(page, "#auto", "--md-sys-color-surface"))
      .toBe(await readToken(page, "#dark", "--md-sys-color-surface"));
  });

  test("auto scheme follows a light preference", async ({ page, render }) => {
    await page.emulateMedia({ colorScheme: "light" });
    await render(`
      <m3e-theme scheme="auto"><div id="auto"></div></m3e-theme>
      <m3e-theme scheme="light"><div id="light"></div></m3e-theme>
    `);

    await expect
      .poll(() => readToken(page, "#auto", "--md-sys-color-surface"))
      .toBe(await readToken(page, "#light", "--md-sys-color-surface"));
  });

  for (const density of [0, -1, -2]) {
    test(`applies density scale ${density}`, async ({ page, render }) => {
      await render(`<m3e-theme density="${density}"><div id="probe"></div></m3e-theme>`);

      expect(Number.parseFloat(await readToken(page, "#probe", "--md-sys-density-scale"))).toBe(density);
    });
  }

  test("strong-focus makes focus rings visible", async ({ page, render }) => {
    await render(`<m3e-theme strong-focus><div id="probe"></div></m3e-theme>`);

    expect(await readToken(page, "#probe", "--m3e-focus-ring-visibility")).toBe("visible");
  });

  test("focus rings are hidden without strong-focus", async ({ page, render }) => {
    await render(`<m3e-theme><div id="probe"></div></m3e-theme>`);

    expect(await readToken(page, "#probe", "--m3e-focus-ring-visibility")).toBe("hidden");
  });

  test("updating the color re-derives tokens", async ({ page, render }) => {
    await render(`<m3e-theme color="#6750A4" scheme="light"><div id="probe"></div></m3e-theme>`);
    const before = await readToken(page, "#probe", "--md-sys-color-primary");

    await page.locator("m3e-theme").evaluate((el) => {
      (el as HTMLElement & { color: string }).color = "#00897B";
    });

    await expect.poll(() => readToken(page, "#probe", "--md-sys-color-primary")).not.toBe(before);
  });

  test("updating density at runtime changes the scale", async ({ page, render }) => {
    await render(`<m3e-theme density="0"><div id="probe"></div></m3e-theme>`);

    await page.locator("m3e-theme").evaluate((el) => {
      (el as HTMLElement & { density: number }).density = -2;
    });

    await expect
      .poll(async () => Number.parseFloat(await readToken(page, "#probe", "--md-sys-density-scale")))
      .toBe(-2);
  });

  test("toggling strong-focus at runtime updates the token", async ({ page, render }) => {
    await render(`<m3e-theme><div id="probe"></div></m3e-theme>`);

    await page.locator("m3e-theme").evaluate((el) => {
      (el as HTMLElement & { strongFocus: boolean }).strongFocus = true;
    });

    await expect.poll(() => readToken(page, "#probe", "--m3e-focus-ring-visibility")).toBe("visible");
  });
});
