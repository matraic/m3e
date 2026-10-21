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
