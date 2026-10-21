import { expect, test } from "./fixtures";

test.describe("m3e-badge", () => {
  test("renders its slotted content", async ({ page, render }) => {
    await render("<m3e-badge>10</m3e-badge>");

    await expect(page.locator("m3e-badge")).toBeVisible();
    await expect(page.getByText("10", { exact: true })).toBeVisible();
  });

  test("defaults to medium size and above-after position", async ({ page, render }) => {
    await render("<m3e-badge>10</m3e-badge>");

    const badge = page.locator("m3e-badge");
    await expect
      .poll(() => badge.evaluate((element) => (element as HTMLElement & { size: string }).size))
      .toBe("medium");
    await expect
      .poll(() => badge.evaluate((element) => (element as HTMLElement & { position: string }).position))
      .toBe("above-after");
  });

  for (const size of ["small", "medium", "large"]) {
    test(`accepts the ${size} size`, async ({ page, render }) => {
      await render(`<m3e-badge size="${size}">10</m3e-badge>`);

      await expect
        .poll(() =>
          page.locator("m3e-badge").evaluate((element) => (element as HTMLElement & { size: string }).size),
        )
        .toBe(size);
    });
  }

  test("falls back to medium for an unknown size", async ({ page, render }) => {
    await render('<m3e-badge size="extra-large">10</m3e-badge>');

    await expect
      .poll(() => page.locator("m3e-badge").evaluate((element) => (element as HTMLElement & { size: string }).size))
      .toBe("medium");
  });

  for (const position of [
    "above-after",
    "above-before",
    "below-before",
    "below-after",
    "before",
    "after",
    "above",
    "below",
  ]) {
    test(`accepts the ${position} position`, async ({ page, render }) => {
      await render(`<m3e-badge position="${position}">10</m3e-badge>`);

      await expect
        .poll(() =>
          page.locator("m3e-badge").evaluate((element) => (element as HTMLElement & { position: string }).position),
        )
        .toBe(position);
    });
  }

  test("falls back to above-after for an unknown position", async ({ page, render }) => {
    await render('<m3e-badge position="center">10</m3e-badge>');

    await expect
      .poll(() =>
        page.locator("m3e-badge").evaluate((element) => (element as HTMLElement & { position: string }).position),
      )
      .toBe("above-after");
  });
});
