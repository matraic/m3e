import { expect, test } from "./fixtures";

test.describe("m3e-callout", () => {
  test("renders its label, icon, and supporting content", async ({ page, render }) => {
    await render(`
      <m3e-callout>
        <span slot="icon" aria-hidden="true">i</span>
        <span slot="label">Account notice</span>
        Your profile needs attention.
      </m3e-callout>
    `);

    await expect(page.getByRole("complementary")).toBeVisible();
    await expect(page.getByText("Account notice", { exact: true })).toBeVisible();
    await expect(page.getByText("Your profile needs attention.")).toBeVisible();
    await expect(page.getByText("i", { exact: true })).toBeVisible();
  });

  test("defaults to the secondary variant and rounded shape", async ({ page, render }) => {
    await render("<m3e-callout>Information</m3e-callout>");

    const callout = page.locator("m3e-callout");
    await expect
      .poll(() =>
        callout.evaluate((element) => {
          const component = element as HTMLElement & { variant: string; shape: string };
          return [component.variant, component.shape];
        }),
      )
      .toEqual(["secondary", "rounded"]);
  });

  for (const variant of ["primary", "secondary", "tertiary", "error", "surface"]) {
    test(`accepts the ${variant} variant`, async ({ page, render }) => {
      await render(`<m3e-callout variant="${variant}">Information</m3e-callout>`);

      await expect(page.locator("m3e-callout")).toHaveAttribute("variant", variant);
    });
  }

  test("falls back to the secondary variant when given an unknown variant", async ({ page, render }) => {
    await render('<m3e-callout variant="unknown">Information</m3e-callout>');

    await expect
      .poll(() =>
        page.locator("m3e-callout").evaluate((element) => (element as HTMLElement & { variant: string }).variant),
      )
      .toBe("secondary");
  });

  for (const shape of ["rounded", "square"]) {
    test(`accepts the ${shape} shape`, async ({ page, render }) => {
      await render(`<m3e-callout shape="${shape}">Information</m3e-callout>`);

      await expect(page.locator("m3e-callout")).toHaveAttribute("shape", shape);
    });
  }

  test("falls back to the rounded shape when given an unknown shape", async ({ page, render }) => {
    await render('<m3e-callout shape="pill">Information</m3e-callout>');

    await expect
      .poll(() =>
        page.locator("m3e-callout").evaluate((element) => (element as HTMLElement & { shape: string }).shape),
      )
      .toBe("rounded");
  });
});
