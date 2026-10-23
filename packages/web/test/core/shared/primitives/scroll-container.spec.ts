import { expect, test } from "../../../fixtures";

type Container = HTMLElement & { dividers: string; thin: boolean; updateComplete: Promise<boolean> };

const container = (attrs = "") => `
  <m3e-scroll-container ${attrs} style="height: 100px">
    <div style="height: 500px">Tall content</div>
  </m3e-scroll-container>
`;

const state = (page: import("@playwright/test").Page, name: string) =>
  page.locator("m3e-scroll-container").evaluate((el, n) => el.matches(`:state(--${n})`), name);

const scrollTo = (page: import("@playwright/test").Page, top: number | "end") =>
  page
    .locator("m3e-scroll-container")
    .evaluate((el, t) => el.scrollTo({ top: t === "end" ? el.scrollHeight : t }), top);

test.describe("m3e-scroll-container", () => {
  test("defaults to above-below dividers", async ({ page, render }) => {
    await render(container());

    expect(await page.locator("m3e-scroll-container").evaluate((el) => (el as Container).dividers)).toBe("above-below");
  });

  test("reflects thin", async ({ page, render }) => {
    await render(container("thin"));

    await expect(page.locator("m3e-scroll-container")).toHaveAttribute("thin", "");
  });

  test("shows only the below divider at the top", async ({ page, render }) => {
    await render(container());

    await expect.poll(() => state(page, "below")).toBe(true);
    expect(await state(page, "above")).toBe(false);
  });

  test("shows both dividers when scrolled to the middle", async ({ page, render }) => {
    await render(container());
    await scrollTo(page, 150);

    await expect.poll(() => state(page, "above")).toBe(true);
    expect(await state(page, "below")).toBe(true);
  });

  test("shows only the above divider at the bottom", async ({ page, render }) => {
    await render(container());
    await scrollTo(page, "end");

    await expect.poll(() => state(page, "above")).toBe(true);
    await expect.poll(() => state(page, "below")).toBe(false);
  });

  test("shows no dividers when content fits", async ({ page, render }) => {
    await render(
      `<m3e-scroll-container style="height: 200px"><div style="height: 50px">Short</div></m3e-scroll-container>`,
    );
    await page.waitForTimeout(100);

    expect(await state(page, "above")).toBe(false);
    expect(await state(page, "below")).toBe(false);
  });

  test("dividers=above only shows the above divider", async ({ page, render }) => {
    await render(container('dividers="above"'));
    await scrollTo(page, 150);

    await expect.poll(() => state(page, "above")).toBe(true);
    expect(await state(page, "below")).toBe(false);
  });

  test("dividers=below only shows the below divider", async ({ page, render }) => {
    await render(container('dividers="below"'));
    await scrollTo(page, 150);

    await expect.poll(() => state(page, "below")).toBe(true);
    expect(await state(page, "above")).toBe(false);
  });

  test("dividers=none shows no dividers", async ({ page, render }) => {
    await render(container('dividers="none"'));
    await scrollTo(page, 150);
    await page.waitForTimeout(150);

    expect(await state(page, "above")).toBe(false);
    expect(await state(page, "below")).toBe(false);
  });

  test("an invalid dividers value falls back to above-below", async ({ page, render }) => {
    await render(container('dividers="bogus"'));

    await expect
      .poll(() => page.locator("m3e-scroll-container").evaluate((el) => (el as Container).dividers))
      .toBe("above-below");
  });

  test("updates dividers when content is added", async ({ page, render }) => {
    await render(
      `<m3e-scroll-container style="height: 100px"><div style="height: 50px">Short</div></m3e-scroll-container>`,
    );
    await page.waitForTimeout(100);
    expect(await state(page, "below")).toBe(false);

    await page.locator("m3e-scroll-container").evaluate((el) => {
      const d = document.createElement("div");
      d.style.height = "500px";
      el.appendChild(d);
    });

    await expect.poll(() => state(page, "below")).toBe(true);
  });
});
