import { expect, test } from "./fixtures";

test.describe("m3e-heading", () => {
  test("renders its content with the default variant and size", async ({ page, render }) => {
    await render(`<m3e-heading>Page title</m3e-heading>`);
    const heading = page.locator("m3e-heading");

    await expect(heading).toHaveText("Page title");
    expect(
      await heading.evaluate((element) => {
        const heading = element as HTMLElement & { variant: string; size: string };
        return { variant: heading.variant, size: heading.size };
      }),
    ).toEqual({ variant: "display", size: "medium" });
    await expect(heading).not.toHaveAttribute("variant");
    await expect(heading).not.toHaveAttribute("size");
    await expect(heading).not.toHaveAttribute("role", "heading");
  });

  test("supports variants, sizes, and emphasis", async ({ page, render }) => {
    await render(`
      <m3e-heading variant="headline" size="large" emphasized>Headline</m3e-heading>
      <m3e-heading variant="title" size="small">Title</m3e-heading>
      <m3e-heading variant="label" size="medium">Label</m3e-heading>
    `);
    const headings = page.locator("m3e-heading");

    await expect(headings.nth(0)).toHaveAttribute("variant", "headline");
    await expect(headings.nth(0)).toHaveAttribute("size", "large");
    await expect(headings.nth(0)).toHaveAttribute("emphasized", "");
    await expect(headings.nth(1)).toHaveAttribute("variant", "title");
    await expect(headings.nth(1)).toHaveAttribute("size", "small");
    await expect(headings.nth(2)).toHaveAttribute("variant", "label");
    await expect(headings.nth(2)).toHaveAttribute("size", "medium");
  });

  test("falls back to display and medium for unsupported variant and size values", async ({ page, render }) => {
    await render(`<m3e-heading variant="unsupported" size="extra-large">Fallback</m3e-heading>`);
    const heading = page.locator("m3e-heading");

    await expect(heading).toHaveAttribute("variant", "display");
    await expect(heading).toHaveAttribute("size", "medium");
  });

  test("applies and updates its accessible heading level", async ({ page, render }) => {
    await render(`<m3e-heading id="title" level="2">Section title</m3e-heading>`);
    const heading = page.getByRole("heading", { name: "Section title", level: 2 });

    await expect(heading).toBeVisible();
    await expect(heading).toHaveAttribute("aria-level", "2");

    await page.locator("#title").evaluate((element) => {
      element.setAttribute("level", "1");
    });
    await expect(page.getByRole("heading", { name: "Section title", level: 1 })).toBeVisible();

    await page.locator("#title").evaluate((element) => {
      element.removeAttribute("level");
    });
    await expect(page.locator("#title")).not.toHaveAttribute("role", "heading");
    await expect(page.locator("#title")).not.toHaveAttribute("aria-level");
  });
});
