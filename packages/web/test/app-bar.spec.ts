import { expect, test } from "./fixtures";

test.describe("m3e-app-bar", () => {
  test("exposes a banner and renders its slotted content", async ({ page, render }) => {
    await render(`
      <m3e-app-bar>
        <span slot="leading">Back</span>
        <span slot="title">Inbox</span>
        <span slot="subtitle">Recent messages</span>
        <span slot="trailing">More</span>
      </m3e-app-bar>
    `);

    await expect(page.getByRole("banner")).toBeVisible();
    for (const text of ["Back", "Inbox", "Recent messages", "More"]) {
      await expect(page.getByText(text, { exact: true })).toBeVisible();
    }
  });

  test("defaults to the small size", async ({ page, render }) => {
    await render("<m3e-app-bar></m3e-app-bar>");

    await expect
      .poll(() => page.locator("m3e-app-bar").evaluate((element) => (element as HTMLElement & { size: string }).size))
      .toBe("small");
  });

  for (const size of ["small", "medium", "large"]) {
    test(`accepts the ${size} size`, async ({ page, render }) => {
      await render(`<m3e-app-bar size="${size}"></m3e-app-bar>`);

      await expect
        .poll(() => page.locator("m3e-app-bar").evaluate((element) => (element as HTMLElement & { size: string }).size))
        .toBe(size);
    });
  }

  test("falls back to small for an unknown size", async ({ page, render }) => {
    await render('<m3e-app-bar size="extra-large"></m3e-app-bar>');

    await expect
      .poll(() => page.locator("m3e-app-bar").evaluate((element) => (element as HTMLElement & { size: string }).size))
      .toBe("small");
  });
});

test.describe("m3e-app-bar scroll behavior", () => {
  const content = `
    <span slot="leading">Back</span>
    <span slot="title">Inbox</span>
    <span slot="subtitle">Recent messages</span>
  `;
  const scroller = (size: string, effect?: string) => `
    <div id="sc" style="overflow-y: auto; height: 300px">
      <m3e-app-bar for="sc" size="${size}" ${effect ? `scroll-behavior="${effect}"` : ""} style="position: sticky; top: 0">
        ${content}
      </m3e-app-bar>
      <div style="height: 1000px">filler</div>
    </div>
  `;
  const scrollTo = (page: import("@playwright/test").Page, top: number) =>
    page.locator("#sc").evaluate((el, t) => (el.scrollTop = t), top);
  // Stops the bar snapping when idle so partial collapse positions can be observed. Must run before render.
  const disableSnap = (page: import("@playwright/test").Page) =>
    page.evaluate(() => {
      const set = window.setTimeout;
      window.setTimeout = ((fn: TimerHandler, ms?: number, ...args: unknown[]) =>
        ms === 150 ? 0 : set(fn, ms, ...args)) as typeof set;
    });
  const wrapperClasses = (page: import("@playwright/test").Page) =>
    page.locator("m3e-app-bar").evaluate((el) => el.shadowRoot!.querySelector(".wrapper")!.className);
  const barHeight = (page: import("@playwright/test").Page) =>
    page
      .locator("m3e-app-bar")
      .evaluate((el) => el.shadowRoot!.querySelector(".wrapper")!.getBoundingClientRect().height);
  const hostHeight = (page: import("@playwright/test").Page) =>
    page.locator("m3e-app-bar").evaluate((el) => el.getBoundingClientRect().height);
  const shadow = (page: import("@playwright/test").Page) =>
    page.locator("m3e-app-bar").evaluate((el) => getComputedStyle(el.shadowRoot!.querySelector(".wrapper")!).boxShadow);

  test("defaults to the elevate behavior", async ({ page, render }) => {
    await render(scroller("medium"));

    await expect(page.locator("m3e-app-bar")).not.toHaveAttribute("scroll-behavior");
    expect(
      await page
        .locator("m3e-app-bar")
        .evaluate((el) => (el as HTMLElement & { scrollBehavior: string }).scrollBehavior),
    ).toBe("elevate");
  });

  test("falls back to elevate for an unknown behavior", async ({ page, render }) => {
    await render(scroller("medium", "bogus"));

    await expect
      .poll(() =>
        page.locator("m3e-app-bar").evaluate((el) => (el as HTMLElement & { scrollBehavior: string }).scrollBehavior),
      )
      .toBe("elevate");
  });

  test("elevate does not collapse a medium bar", async ({ page, render }) => {
    await render(scroller("medium", "elevate"));
    const initial = await barHeight(page);

    await scrollTo(page, 100);
    await expect.poll(() => wrapperClasses(page)).toContain("on-scroll");
    expect(await barHeight(page)).toBe(initial);
    expect(await wrapperClasses(page)).not.toContain("compressed");
  });

  for (const size of ["medium", "large"]) {
    test(`compress collapses a ${size} bar to the small height and expands again`, async ({ page, render }) => {
      await render(scroller(size, "compress"));
      const expanded = await barHeight(page);
      expect(expanded).toBeGreaterThan(64);

      await scrollTo(page, 100);
      await expect.poll(() => barHeight(page)).toBe(64);
      expect(await wrapperClasses(page)).toContain("compressed");
      expect(await wrapperClasses(page)).toContain("on-scroll");

      await scrollTo(page, 0);
      await expect.poll(() => barHeight(page)).toBe(expanded);
      expect(await wrapperClasses(page)).not.toContain("compressed");
    });
  }

  test("compress keeps the host height so content does not shift", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    const expanded = await hostHeight(page);

    await scrollTo(page, 100);
    await expect.poll(() => barHeight(page)).toBe(64);
    expect(await hostHeight(page)).toBe(expanded);
  });

  test("compress uses the on-scroll background without elevation", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    await page
      .locator("m3e-app-bar")
      .evaluate((el) => el.style.setProperty("--m3e-app-bar-container-elevation-on-scroll", "0 0 0 0 #000"));
    const background = (p: import("@playwright/test").Page) =>
      p
        .locator("m3e-app-bar")
        .evaluate((el) => getComputedStyle(el.shadowRoot!.querySelector(".wrapper")!).backgroundColor);
    const flatBackground = await background(page);

    await scrollTo(page, 100);
    await expect.poll(() => barHeight(page)).toBe(64);
    await expect.poll(() => background(page)).not.toBe(flatBackground);
    expect(await shadow(page)).toMatch(/^(?:[^,]*? 0px 0px 0px 0px(?:, )?)+$/);
  });

  test("elevate applies the on-scroll elevation token", async ({ page, render }) => {
    await render(scroller("medium", "elevate"));
    await page
      .locator("m3e-app-bar")
      .evaluate((el) => el.style.setProperty("--m3e-app-bar-container-elevation-on-scroll", "0 2px 4px rgb(0, 0, 0)"));
    const flatShadow = await shadow(page);

    await scrollTo(page, 100);
    await expect.poll(() => shadow(page)).not.toBe(flatShadow);
  });

  test("compress swaps to the small layout and restores the label", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    const label = page.getByText("Inbox", { exact: true });

    await scrollTo(page, 100);
    await expect.poll(() => wrapperClasses(page)).toContain("compact");
    await expect(label).toBeVisible();
    await expect
      .poll(() => label.evaluate((el) => getComputedStyle(el.closest(".label") ?? el.parentElement!).opacity))
      .toBe("1");

    await scrollTo(page, 0);
    await expect.poll(() => wrapperClasses(page)).not.toContain("compact");
    await expect(label).toBeVisible();
  });

  test("compress height follows the scroll position", async ({ page, render }) => {
    await disableSnap(page);
    await render(scroller("large", "compress"));
    const expanded = await barHeight(page);
    const range = expanded - 64;

    await scrollTo(page, Math.round(range / 2));
    await expect.poll(() => barHeight(page)).toBeCloseTo(expanded - Math.round(range / 2), 0);
    expect(await hostHeight(page)).toBe(expanded);

    await scrollTo(page, 10);
    await expect.poll(() => barHeight(page)).toBe(expanded - 10);
  });

  test("compress snaps when scrolling goes idle and moves the scroll position", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    const expanded = await barHeight(page);
    const range = expanded - 64;
    const top = () => page.locator("#sc").evaluate((el) => el.scrollTop);

    await scrollTo(page, Math.round(range / 4));
    await expect.poll(() => barHeight(page)).toBe(64);
    expect(await top()).toBeGreaterThanOrEqual(range);

    await scrollTo(page, (await top()) - 2);
    await expect.poll(() => barHeight(page)).toBe(expanded);
    expect(await top()).toBeLessThan(range / 2);
  });
  test("compress shadow follows the collapse progress", async ({ page, render }) => {
    await disableSnap(page);
    await render(scroller("large", "compress"));
    await page
      .locator("m3e-app-bar")
      .evaluate((el) => el.style.setProperty("--m3e-app-bar-container-elevation-on-scroll", "0 10px 0 0 rgb(0, 0, 0)"));
    const expanded = await barHeight(page);
    const range = expanded - 64;

    await scrollTo(page, Math.round(range / 2));
    await expect.poll(() => shadow(page)).toContain("5px");

    await scrollTo(page, range);
    await expect.poll(() => shadow(page)).toContain("10px");
  });

  test("compress label slides with the collapse and returns when expanded", async ({ page, render }) => {
    await disableSnap(page);
    await render(scroller("large", "compress"));
    const expanded = await barHeight(page);
    const range = expanded - 64;
    const labelTop = () =>
      page.locator("m3e-app-bar").evaluate((el) => el.shadowRoot!.querySelector(".label")!.getBoundingClientRect().top);
    const start = await labelTop();

    await scrollTo(page, Math.round(range / 4));
    await expect.poll(async () => (await labelTop()) < start - 5).toBe(true);

    await scrollTo(page, 0);
    await expect.poll(labelTop).toBeCloseTo(start, 0);
  });

  test("compress label fades out then back in as the bar collapses", async ({ page, render }) => {
    await disableSnap(page);
    await render(scroller("large", "compress"));
    const expanded = await barHeight(page);
    const range = expanded - 64;
    const opacity = () =>
      page
        .locator("m3e-app-bar")
        .evaluate((el) => parseFloat(getComputedStyle(el.shadowRoot!.querySelector(".label")!).opacity));

    await scrollTo(page, Math.round(range / 2));
    await expect.poll(opacity).toBeLessThan(0.1);
    await scrollTo(page, Math.round(range / 4));
    await expect.poll(async () => (await opacity()) > 0.3 && (await opacity()) < 0.7).toBe(true);
    expect(await wrapperClasses(page)).not.toContain("compact");
    await scrollTo(page, range);
    await expect.poll(opacity).toBe(1);
    expect(await wrapperClasses(page)).toContain("compact");
  });

  test("compress has no effect on a small bar", async ({ page, render }) => {
    await render(scroller("small", "compress"));
    const initial = await barHeight(page);

    await scrollTo(page, 100);
    await page.waitForTimeout(300);
    const classes = await wrapperClasses(page);
    expect(classes).not.toContain("compressed");
    expect(classes).not.toContain("on-scroll");
    expect(await barHeight(page)).toBe(initial);
  });

  test("compress does not leave the bar clipped after repeated scrolling", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    const expanded = await barHeight(page);

    for (let i = 0; i < 3; i++) {
      await scrollTo(page, 100);
      await expect.poll(() => barHeight(page)).toBe(64);
      await scrollTo(page, 0);
      await expect.poll(() => barHeight(page)).toBe(expanded);
    }
  });
});

test.describe("m3e-app-bar centered", () => {
  const content = `
    <span slot="leading">Back</span>
    <span slot="title">Inbox</span>
    <span slot="trailing">More</span>
  `;
  const titleOffset = (page: import("@playwright/test").Page) =>
    page.getByText("Inbox", { exact: true }).evaluate((el) => {
      const bar = el.closest("m3e-app-bar")!.getBoundingClientRect();
      const rect = el.getBoundingClientRect();
      return Math.abs(rect.left + rect.width / 2 - (bar.left + bar.width / 2));
    });

  test("reflects the centered attribute", async ({ page, render }) => {
    await render(`<m3e-app-bar centered>${content}</m3e-app-bar>`);

    await expect(page.locator("m3e-app-bar")).toHaveAttribute("centered", "");
  });

  test("is not centered by default", async ({ page, render }) => {
    await render(`<m3e-app-bar style="width: 600px">${content}</m3e-app-bar>`);

    await expect(page.locator("m3e-app-bar")).not.toHaveAttribute("centered");
    expect(await titleOffset(page)).toBeGreaterThan(20);
  });

  test("centers the title in a small bar", async ({ page, render }) => {
    await render(`<m3e-app-bar centered style="width: 600px">${content}</m3e-app-bar>`);

    await expect.poll(() => titleOffset(page)).toBeLessThan(10);
  });

  test("centers the title when a compress bar is compressed", async ({ page, render }) => {
    await render(`
      <div id="sc" style="overflow-y: auto; height: 300px; width: 600px">
        <m3e-app-bar for="sc" size="large" centered scroll-behavior="compress" style="position: sticky; top: 0">
          ${content}
        </m3e-app-bar>
        <div style="height: 1000px">filler</div>
      </div>
    `);

    await page.locator("#sc").evaluate((el) => (el.scrollTop = 100));
    await expect.poll(() => titleOffset(page)).toBeLessThan(10);
  });
});
