import { expect, test } from "../../../fixtures";

const overflow = (width: number) => `
  <div style="display: flex; width: ${width}px">
    <m3e-text-overflow>A very long piece of text that cannot possibly fit in the container</m3e-text-overflow>
  </div>
`;

const base = (page: import("@playwright/test").Page) => page.locator("m3e-text-overflow .base");

test.describe("m3e-text-overflow", () => {
  test("truncates with an ellipsis on a single line", async ({ page, render }) => {
    await render(overflow(100));

    const style = await base(page).evaluate((x) => {
      const s = getComputedStyle(x);
      return { textOverflow: s.textOverflow, whiteSpace: s.whiteSpace, overflow: s.overflowX };
    });
    expect(style).toEqual({ textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" });
  });

  test("shrinks to the container and overflows its content", async ({ page, render }) => {
    await render(overflow(100));

    const el = page.locator("m3e-text-overflow");
    expect(await el.evaluate((x) => x.getBoundingClientRect().width)).toBeLessThanOrEqual(100);
    expect(await base(page).evaluate((x) => x.scrollWidth > x.clientWidth)).toBe(true);
  });

  test("short content is not truncated", async ({ page, render }) => {
    await render(`<div style="display: flex; width: 300px"><m3e-text-overflow>Short</m3e-text-overflow></div>`);

    expect(await base(page).evaluate((x) => x.scrollWidth > x.clientWidth)).toBe(false);
  });

  test("renders the slotted content", async ({ page, render }) => {
    await render(`<m3e-text-overflow>Hello</m3e-text-overflow>`);

    await expect(page.getByText("Hello")).toBeVisible();
  });

  test("is hidden with the hidden attribute", async ({ page, render }) => {
    await render(`<m3e-text-overflow hidden>Hello</m3e-text-overflow>`);

    await expect(page.locator("m3e-text-overflow")).toBeHidden();
  });
});
