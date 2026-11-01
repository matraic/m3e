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
      // Ignoring `scrollend` listeners keeps the bar from snapping when scrolling finishes.
      const add = EventTarget.prototype.addEventListener;
      EventTarget.prototype.addEventListener = function (this: EventTarget, ...args: Parameters<typeof add>) {
        if (args[0] !== "scrollend") add.apply(this, args);
      };
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
    expect((await shadow(page)).split(",").every((part) => part.includes(" 0px 0px 0px 0px"))).toBe(true);
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

  test("compress does not snap while the mouse is held down, then snaps on release", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    const expanded = await barHeight(page);
    const range = expanded - 64;
    const top = () => page.locator("#sc").evaluate((el) => el.scrollTop);
    const partial = Math.round(range / 2);

    // Stands in for dragging the scrollbar thumb, which presses the pointer on the scroll container.
    await page
      .locator("#sc")
      .evaluate((el) => el.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse" })));
    await scrollTo(page, partial);
    await page.waitForTimeout(500);
    expect(await top()).toBe(partial);
    expect(await barHeight(page)).toBeGreaterThan(64);

    await page.evaluate(() => window.dispatchEvent(new PointerEvent("pointerup", { pointerType: "mouse" })));
    await expect.poll(() => barHeight(page)).toBe(64);
  });

  test("compress does not snap while a scroll key is held, then snaps on release", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    const expanded = await barHeight(page);
    const partial = Math.round((expanded - 64) / 2);
    const top = () => page.locator("#sc").evaluate((el) => el.scrollTop);

    await page.locator("#sc").evaluate((el) => el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" })));
    await scrollTo(page, partial);
    await page.waitForTimeout(500);
    expect(await top()).toBe(partial);

    await page.evaluate(() => window.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowDown" })));
    await expect.poll(() => barHeight(page)).toBe(64);
  });

  test("compress waits for scrollend when it is supported", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    test.skip(!(await page.evaluate(() => "onscrollend" in window)), "scrollend is not supported");
    const expanded = await barHeight(page);
    const partial = Math.round((expanded - 64) / 4);
    const top = () => page.locator("#sc").evaluate((el) => el.scrollTop);

    // Gaps between scroll events longer than the old idle delay must not be treated as the end of scrolling.
    const scroller$ = page.locator("#sc");
    await page.evaluate(() => window.addEventListener("scrollend", (e) => e.stopImmediatePropagation(), true));
    await scroller$.evaluate((el, t) => (el.scrollTop = t), partial);
    await page.waitForTimeout(400);
    await scroller$.evaluate((el, t) => (el.scrollTop = t), partial + 2);
    await page.waitForTimeout(400);
    expect(await top()).toBe(partial + 2);
    expect(await barHeight(page)).toBeGreaterThan(64);
  });

  test("compress snaps when scrollend fires", async ({ page, render }) => {
    await render(scroller("large", "compress"));
    test.skip(!(await page.evaluate(() => "onscrollend" in window)), "scrollend is not supported");

    await scrollTo(page, 10);
    await expect.poll(() => barHeight(page)).toBe(64);
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

  const wrapperTop = (page: import("@playwright/test").Page) =>
    page.locator("m3e-app-bar").evaluate((el) => el.shadowRoot!.querySelector(".wrapper")!.getBoundingClientRect().top);

  test("hide moves the bar by the amount scrolled and only returns near the top", async ({ page, render }) => {
    await render(scroller("small", "hide"));
    const height = await barHeight(page);
    const containerTop = await page.locator("#sc").evaluate((el) => el.getBoundingClientRect().top);

    await scrollTo(page, 10);
    await expect.poll(async () => (await wrapperTop(page)) - containerTop).toBe(-10);

    await scrollTo(page, 500);
    await expect.poll(async () => (await wrapperTop(page)) - containerTop).toBe(-height);

    await scrollTo(page, 400);
    await page.waitForTimeout(100);
    expect((await wrapperTop(page)) - containerTop).toBe(-height);

    await scrollTo(page, 20);
    await expect.poll(async () => (await wrapperTop(page)) - containerTop).toBe(-20);
  });

  test("hide is fully visible at the top and keeps the normal container", async ({ page, render }) => {
    await render(scroller("small", "hide"));
    const containerTop = await page.locator("#sc").evaluate((el) => el.getBoundingClientRect().top);
    const initialBackground = await background(page);

    expect((await wrapperTop(page)) - containerTop).toBe(0);

    await scrollTo(page, 30);
    await expect.poll(async () => (await wrapperTop(page)) - containerTop).toBe(-30);
    expect(await wrapperClasses(page)).not.toContain("on-scroll");
    expect(await background(page)).toBe(initialBackground);

    await scrollTo(page, 0);
    await expect.poll(async () => (await wrapperTop(page)) - containerTop).toBe(0);
  });

  test("hide does not apply to other behaviors", async ({ page, render }) => {
    await render(scroller("small", "elevate"));
    const containerTop = await page.locator("#sc").evaluate((el) => el.getBoundingClientRect().top);

    await scrollTo(page, 30);
    await page.waitForTimeout(100);
    expect(await wrapperClasses(page)).not.toContain("hide");
    expect((await wrapperTop(page)) - containerTop).toBe(0);
  });

  const background = (page: import("@playwright/test").Page) =>
    page
      .locator("m3e-app-bar")
      .evaluate((el) => getComputedStyle(el.shadowRoot!.querySelector(".wrapper")!).backgroundColor);
  const labelOpacity = (page: import("@playwright/test").Page) =>
    page
      .locator("m3e-app-bar")
      .evaluate((el) => Number(getComputedStyle(el.shadowRoot!.querySelector(".label")!).opacity));
  // Computed colors are `rgb()`/`rgba()` or `color(srgb r g b / a)`; the alpha follows a `/` or is the fourth channel.
  const alpha = (color: string) => {
    const slash = /\/\s*([\d.]+)/.exec(color);
    if (slash) return Number(slash[1]);
    const legacy = /rgba\([^,]+,[^,]+,[^,]+,\s*([\d.]+)\)/.exec(color);
    return legacy ? Number(legacy[1]) : 1;
  };
  // The transparent behavior suppresses color transitions via `transition-property`, so values settle immediately.

  test("transparent looks normal at the top", async ({ page, render }) => {
    await render(scroller("small"));
    const normal = alpha(await background(page));

    await page
      .locator("m3e-app-bar")
      .evaluate((el) => ((el as HTMLElement & { scrollBehavior: string }).scrollBehavior = "transparent"));
    await expect.poll(() => wrapperClasses(page)).toContain("transparent");
    expect(alpha(await background(page))).toBe(normal);
    expect(await labelOpacity(page)).toBe(1);
  });

  test("transparent fades the background and label with the scroll position", async ({ page, render }) => {
    await render(scroller("small", "transparent"));

    await scrollTo(page, 32);
    await expect.poll(async () => alpha(await background(page))).toBeCloseTo(0.5, 1);
    await expect.poll(() => labelOpacity(page)).toBeCloseTo(0.5, 1);

    await scrollTo(page, 200);
    await expect.poll(async () => alpha(await background(page))).toBe(0);
    await expect.poll(() => labelOpacity(page)).toBe(0);

    await scrollTo(page, 0);
    await expect.poll(() => labelOpacity(page)).toBe(1);
    await expect.poll(async () => alpha(await background(page))).toBe(1);
  });

  test("transparent does not fade leading and trailing content", async ({ page, render }) => {
    await render(scroller("small", "transparent"));
    await scrollTo(page, 200);
    await expect.poll(() => labelOpacity(page)).toBe(0);

    const opacity = await page.locator("m3e-app-bar").evaluate((el) => {
      const icons = el.shadowRoot!.querySelector(".leading-icon")!;
      return Number(getComputedStyle(icons).opacity);
    });
    expect(opacity).toBe(1);
  });

  test("transparent fades in a button container with the scroll position", async ({ page, render }) => {
    await render(scroller("small", "transparent"));
    const buttonColor = () =>
      page
        .locator("m3e-app-bar")
        .evaluate((el) =>
          getComputedStyle(el.shadowRoot!.querySelector(".wrapper")!).getPropertyValue("--_button-container").trim(),
        );

    await expect.poll(async () => buttonColor()).toContain("0 * 100%");
    await scrollTo(page, 200);
    await expect.poll(async () => buttonColor()).toContain("1 * 100%");
  });

  test("transparent does not elevate the bar", async ({ page, render }) => {
    await render(scroller("small", "transparent"));
    await scrollTo(page, 200);
    await page.waitForTimeout(100);
    expect(await shadow(page)).toBe("none");
  });

  test("transparent is removed when the behavior changes", async ({ page, render }) => {
    await render(scroller("small", "transparent"));
    await scrollTo(page, 200);
    await expect.poll(() => labelOpacity(page)).toBe(0);

    await page
      .locator("m3e-app-bar")
      .evaluate((el) => ((el as HTMLElement & { scrollBehavior: string }).scrollBehavior = "elevate"));
    await expect.poll(() => wrapperClasses(page)).not.toContain("transparent");
    expect(await labelOpacity(page)).toBe(1);
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
