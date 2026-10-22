import { expect, test } from "./fixtures";

const items = (count = 10) =>
  Array.from(
    { length: count },
    (_, i) => `<div style="flex: none; width: 100px; height: 40px">Item ${i + 1}</div>`,
  ).join("");

const group = (attrs = "", width = 300) => `
  <m3e-slide-group style="width: ${width}px" ${attrs}>${items()}</m3e-slide-group>
`;

const scrollOf = (page: import("@playwright/test").Page, prop: "scrollLeft" | "scrollTop" = "scrollLeft") =>
  page.locator("m3e-slide-group").evaluate((el, p) => el.shadowRoot!.querySelector(".content")![p], prop);

test.describe("m3e-slide-group", () => {
  test("shows no paging buttons when the content fits", async ({ page, render }) => {
    await render(`<m3e-slide-group style="width: 600px">${items(2)}</m3e-slide-group>`);

    await expect(page.getByRole("button")).toHaveCount(0);
  });

  test("shows paging buttons when the content overflows", async ({ page, render }) => {
    await render(group());

    await expect(page.getByRole("button", { name: "Previous page" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Next page" })).toBeVisible();
  });

  test("disables previous at the start and enables next", async ({ page, render }) => {
    await render(group());

    await expect(page.getByRole("button", { name: "Previous page" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Next page" })).toBeEnabled();
  });

  test("scrolls forward when next is clicked", async ({ page, render }) => {
    await render(group());

    await page.getByRole("button", { name: "Next page" }).click();

    await expect.poll(() => scrollOf(page)).toBeGreaterThan(0);
    await expect(page.getByRole("button", { name: "Previous page" })).toBeEnabled();
  });

  test("scrolls back to the start when previous is clicked", async ({ page, render }) => {
    await render(group());
    await page.getByRole("button", { name: "Next page" }).click();
    await expect.poll(() => scrollOf(page)).toBeGreaterThan(0);

    await page.getByRole("button", { name: "Previous page" }).click();

    await expect.poll(() => scrollOf(page)).toBe(0);
    await expect(page.getByRole("button", { name: "Previous page" })).toBeDisabled();
  });

  test("disables next once the end is reached", async ({ page, render }) => {
    await render(group());
    const next = page.getByRole("button", { name: "Next page" });

    for (let i = 0; i < 6 && (await next.isEnabled()); i++) {
      await next.click();
      await page.waitForTimeout(400);
    }

    await expect(next).toBeDisabled();
  });

  test("uses custom button labels", async ({ page, render }) => {
    await render(group('previous-page-label="Back" next-page-label="Forward"'));

    await expect(page.getByRole("button", { name: "Back" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Forward" })).toBeVisible();
  });

  test("shows paging buttons when resized to overflow", async ({ page, render }) => {
    await render(group("", 1200));
    await expect(page.getByRole("button")).toHaveCount(0);

    await page.locator("m3e-slide-group").evaluate((el) => (el.style.width = "300px"));

    await expect(page.getByRole("button", { name: "Next page" })).toBeVisible();
  });

  test("scrolls vertically when vertical", async ({ page, render }) => {
    await render(`
      <m3e-slide-group vertical style="height: 150px">${items()}</m3e-slide-group>
    `);

    await page.getByRole("button", { name: "Next page" }).click();

    await expect.poll(() => scrollOf(page, "scrollTop")).toBeGreaterThan(0);
    expect(await scrollOf(page)).toBe(0);
  });

  test("is not displayed when hidden", async ({ page, render }) => {
    await render(group("hidden"));

    await expect(page.locator("m3e-slide-group")).toBeHidden();
  });
});
