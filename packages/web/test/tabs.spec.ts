import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

const tabs = (attrs = "", tabAttrs: string[] = ["", "", ""]) => `
  <m3e-tabs ${attrs} style="width: 400px">
    <m3e-tab for="p1" ${tabAttrs[0]}>Videos</m3e-tab>
    <m3e-tab for="p2" ${tabAttrs[1]}>Photos</m3e-tab>
    <m3e-tab for="p3" ${tabAttrs[2]}>Audio</m3e-tab>
    <m3e-tab-panel id="p1">Videos panel</m3e-tab-panel>
    <m3e-tab-panel id="p2">Photos panel</m3e-tab-panel>
    <m3e-tab-panel id="p3">Audio panel</m3e-tab-panel>
  </m3e-tabs>
`;

type Tabs = HTMLElement & { selectedIndex: number; tabs: unknown[] };

const index = (page: Page) => page.locator("m3e-tabs").evaluate((el) => (el as Tabs).selectedIndex);

test.describe("m3e-tabs", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("exposes a tablist, tabs and tab panels", async ({ page, render }) => {
    await render(tabs());

    await expect(page.getByRole("tablist")).toBeVisible();
    await expect(page.getByRole("tab")).toHaveCount(3);
    await expect(page.getByRole("tab", { name: "Photos" })).toHaveAttribute("aria-controls", "p2");
    await expect(page.locator("m3e-tab-panel").first()).toHaveAttribute("role", "tabpanel");
  });

  test("the selected attribute chooses the initial tab", async ({ page, render }) => {
    await render(tabs("", ["", "selected", ""]));

    expect(await index(page)).toBe(1);
    await expect(page.getByRole("tab", { name: "Photos" })).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: "Videos" })).toHaveAttribute("aria-selected", "false");
  });

  test("clicking a tab selects it, shows its panel and raises events", async ({ page, render }) => {
    await render(tabs("", ["selected", "", ""]));
    await page.locator("m3e-tabs").evaluate((el) => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      for (const t of ["beforeinput", "input", "change"]) el.addEventListener(t, () => w.events.push(t));
    });

    await page.getByRole("tab", { name: "Audio" }).click();

    expect(await index(page)).toBe(2);
    await expect(page.getByText("Audio panel")).toBeVisible();
    await expect(page.getByText("Videos panel")).toBeHidden();
    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual([
      "beforeinput",
      "input",
      "change",
    ]);
  });

  test("a cancelled beforeinput prevents selection", async ({ page, render }) => {
    await render(tabs("", ["selected", "", ""]));
    await page
      .getByRole("tab", { name: "Photos" })
      .evaluate((el) => el.addEventListener("beforeinput", (e) => e.preventDefault()));

    await page.getByRole("tab", { name: "Photos" }).click();

    expect(await index(page)).toBe(0);
  });

  test("selectedIndex selects a tab and out of range clears the selection", async ({ page, render }) => {
    await render(tabs("", ["selected", "", ""]));
    const el = page.locator("m3e-tabs");

    await el.evaluate((e) => ((e as Tabs).selectedIndex = 2));
    await expect.poll(() => index(page)).toBe(2);
    await expect(page.getByRole("tab", { name: "Audio" })).toHaveAttribute("aria-selected", "true");

    await el.evaluate((e) => ((e as Tabs).selectedIndex = -1));
    await expect.poll(() => index(page)).toBe(-1);
  });

  test("arrow keys move focus, wrap, and Home and End jump", async ({ page, render }) => {
    await render(tabs("", ["selected", "", ""]));
    const tabEls = page.getByRole("tab");
    await tabEls.first().focus();

    await page.keyboard.press("ArrowRight");
    await expect(tabEls.nth(1)).toBeFocused();
    await page.keyboard.press("End");
    await expect(tabEls.nth(2)).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(tabEls.first()).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(tabEls.nth(2)).toBeFocused();
    await page.keyboard.press("Home");
    await expect(tabEls.first()).toBeFocused();
  });

  test("Enter and Space activate the focused tab", async ({ page, render }) => {
    await render(tabs("", ["selected", "", ""]));
    const tabEls = page.getByRole("tab");

    await tabEls.first().focus();
    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Enter");
    await expect.poll(() => index(page)).toBe(1);

    await page.keyboard.press("ArrowRight");
    await page.keyboard.press("Space");
    await expect.poll(() => index(page)).toBe(2);
  });

  test("disabled tabs cannot be selected", async ({ page, render }) => {
    await render(tabs("", ["selected", "disabled", ""]));
    const photos = page.getByRole("tab", { name: "Photos" });

    await expect(photos).toHaveAttribute("aria-disabled", "true");
    await photos.dispatchEvent("click");
    expect(await index(page)).toBe(0);
  });

  test("keyboard navigation skips disabled tabs", async ({ page, render }) => {
    await render(tabs("", ["selected", "disabled", ""]));
    const tabEls = page.getByRole("tab");
    await tabEls.first().focus();

    await page.keyboard.press("ArrowRight");
    await expect(tabEls.nth(2)).toBeFocused();
  });

  test("variant defaults to secondary and invalid values fall back", async ({ page, render }) => {
    await render(tabs());
    const el = page.locator("m3e-tabs");

    expect(await el.evaluate((e) => (e as unknown as { variant: string }).variant)).toBe("secondary");
    await el.evaluate((e) => e.setAttribute("variant", "primary"));
    await expect(el).toHaveAttribute("variant", "primary");
    await el.evaluate((e) => e.setAttribute("variant", "bogus"));
    await expect(el).toHaveAttribute("variant", "secondary");
  });

  test("header position falls back to before", async ({ page, render }) => {
    await render(tabs(`header-position="bogus"`));
    await expect(page.locator("m3e-tabs")).toHaveAttribute("header-position", "before");
  });

  test("header position after renders the tablist below the panel", async ({ page, render }) => {
    await render(tabs(`header-position="after"`, ["selected", "", ""]));

    const list = (await page.getByRole("tablist").boundingBox())!;
    const panel = (await page.getByText("Videos panel").boundingBox())!;
    expect(list.y).toBeGreaterThan(panel.y);
  });

  test("stretch fills the header width", async ({ page, render }) => {
    await render(tabs(`stretch`, ["selected", "", ""]));
    const tabEls = page.getByRole("tab");

    const widths = await tabEls.evaluateAll((els) => els.map((e) => Math.round(e.getBoundingClientRect().width)));
    const total = widths.reduce((a, b) => a + b, 0);
    expect(total).toBeGreaterThanOrEqual(395);
  });

  test("disablePagination reads and writes the attribute", async ({ page, render }) => {
    await render(tabs());
    const el = page.locator("m3e-tabs");
    type P = { disablePagination: boolean | "auto" };

    expect(await el.evaluate((e) => (e as unknown as P).disablePagination)).toBe(false);
    await el.evaluate((e) => ((e as unknown as P).disablePagination = true));
    await expect(el).toHaveAttribute("disable-pagination", "");
    await el.evaluate((e) => ((e as unknown as P).disablePagination = "auto"));
    await expect(el).toHaveAttribute("disable-pagination", "auto");
    await el.evaluate((e) => ((e as unknown as P).disablePagination = false));
    await expect(el).not.toHaveAttribute("disable-pagination");
  });

  test("overflowing tabs show pagination buttons with custom labels", async ({ page, render }) => {
    await render(`
      <m3e-tabs style="width: 200px" previous-page-label="Back" next-page-label="Forward">
        ${Array.from({ length: 10 }, (_, i) => `<m3e-tab for="q${i}">Tab number ${i}</m3e-tab>`).join("")}
        ${Array.from({ length: 10 }, (_, i) => `<m3e-tab-panel id="q${i}">Panel ${i}</m3e-tab-panel>`).join("")}
      </m3e-tabs>
    `);

    await expect(page.getByRole("button", { name: "Forward" })).toBeVisible();
  });

  test("tabs added later are tracked", async ({ page, render }) => {
    await render(tabs("", ["selected", "", ""]));
    await page
      .locator("m3e-tab")
      .last()
      .evaluate((el) => {
        const t = document.createElement("m3e-tab");
        t.textContent = "Extra";
        el.after(t);
      });

    await expect.poll(() => page.locator("m3e-tabs").evaluate((e) => (e as Tabs).tabs.length)).toBe(4);
    expect(await index(page)).toBe(0);
  });
});
