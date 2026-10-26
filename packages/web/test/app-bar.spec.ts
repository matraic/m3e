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
});
