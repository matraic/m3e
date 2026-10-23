import { expect, test } from "../../../fixtures";

type Ring = HTMLElement & { inward: boolean; disabled: boolean; htmlFor: string | null; show(): void; hide(): void };

const host = (attrs = "") => `
  <button id="c" style="position: relative; width: 200px; height: 100px; margin: 50px">
    Press
    <m3e-focus-ring for="c" ${attrs}></m3e-focus-ring>
  </button>
`;

const outline = (page: import("@playwright/test").Page) => page.locator("m3e-focus-ring .outline");

test.describe("m3e-focus-ring", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(host());

    await expect(page.locator("m3e-focus-ring")).toHaveAttribute("aria-hidden", "true");
  });

  test("defaults and reflection", async ({ page, render }) => {
    await render(host("inward disabled"));
    const el = page.locator("m3e-focus-ring");

    await expect(el).toHaveAttribute("inward", "");
    await expect(el).toHaveAttribute("disabled", "");
    await el.evaluate((x) => {
      (x as Ring).inward = false;
      (x as Ring).disabled = false;
    });
    await expect(el).not.toHaveAttribute("inward", "");
    await expect(el).not.toHaveAttribute("disabled", "");
  });

  test("show and hide toggle the outline", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-focus-ring");

    await el.evaluate((x) => (x as Ring).show());
    await expect(outline(page)).toHaveClass(/visible/);

    await el.evaluate((x) => (x as Ring).hide());
    await expect(outline(page)).not.toHaveClass(/visible/);
  });

  test("keyboard focus shows the ring", async ({ page, render }) => {
    await render(host());

    await page.keyboard.press("Tab");
    await expect(outline(page)).toHaveClass(/visible/);

    await page.keyboard.press("Shift+Tab");
    await expect(outline(page)).not.toHaveClass(/visible/);
  });

  test("pointer focus does not show the ring", async ({ page, render }) => {
    await render(host());

    await page.locator("#c").click();
    await expect(page.locator("#c")).toBeFocused();

    await expect(outline(page)).not.toHaveClass(/visible/);
  });

  test("disabled ignores focus", async ({ page, render }) => {
    await render(host("disabled"));

    await page.keyboard.press("Tab");
    await expect(page.locator("#c")).toBeFocused();

    await expect(outline(page)).not.toHaveClass(/visible/);
  });

  test("disabling hides a visible ring", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-focus-ring");
    await el.evaluate((x) => (x as Ring).show());

    await el.evaluate((x) => ((x as Ring).disabled = true));

    await expect(outline(page)).not.toHaveClass(/visible/);
  });

  test("removing the for association stops tracking focus", async ({ page, render }) => {
    await render(host());
    await page.locator("m3e-focus-ring").evaluate((x) => ((x as Ring).htmlFor = null));

    await page.keyboard.press("Tab");
    await expect(page.locator("#c")).toBeFocused();

    await expect(outline(page)).not.toHaveClass(/visible/);
  });

  test("the visible ring draws a solid outline", async ({ page, render }) => {
    await render(host());
    await page.keyboard.press("Tab");

    await expect.poll(() => outline(page).evaluate((x) => getComputedStyle(x).outlineStyle)).toBe("solid");
  });

  test("disconnecting hides the ring", async ({ page, render }) => {
    await render(host());
    const el = page.locator("m3e-focus-ring");
    await el.evaluate((x) => (x as Ring).show());

    const classes = await el.evaluate((x) => {
      const inner = x.shadowRoot!.querySelector(".outline")!;
      x.remove();
      return inner.className;
    });

    expect(classes).not.toMatch(/visible/);
  });
});
