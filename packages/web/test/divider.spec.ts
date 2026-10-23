import { expect, test } from "./fixtures";

test.describe("m3e-divider", () => {
  test("exposes a horizontal separator by default", async ({ page, render }) => {
    await render('<m3e-divider style="width: 300px"></m3e-divider>');
    const divider = page.getByRole("separator");

    await expect(divider).toBeVisible();
    await expect(divider).not.toHaveAttribute("vertical");
    await expect
      .poll(() =>
        page.locator("m3e-divider").evaluate((element) => {
          const style = getComputedStyle(element);
          return [style.display, style.height, style.width];
        }),
      )
      .toEqual(["block", "1px", "300px"]);
  });

  test("renders a vertical separator when vertical is set", async ({ page, render }) => {
    await render('<m3e-divider vertical style="height: 100px"></m3e-divider>');
    const divider = page.getByRole("separator");

    await expect(divider).toHaveAttribute("vertical", "");
    await expect
      .poll(() =>
        page.locator("m3e-divider").evaluate((element) => {
          const style = getComputedStyle(element);
          return [style.width, style.height];
        }),
      )
      .toEqual(["1px", "100px"]);
  });

  test("can be hidden", async ({ page, render }) => {
    await render("<m3e-divider hidden></m3e-divider>");

    await expect(page.getByRole("separator")).toBeHidden();
  });

  const lineInsets = (page: import("@playwright/test").Page) =>
    page.locator("m3e-divider").evaluate((element) => {
      const host = element.getBoundingClientRect();
      const line = element.shadowRoot!.querySelector(".line")!.getBoundingClientRect();
      return {
        start: line.left - host.left,
        end: host.right - line.right,
        top: line.top - host.top,
        bottom: host.bottom - line.bottom,
      };
    });

  test("has no inset by default", async ({ page, render }) => {
    await render('<m3e-divider style="width: 300px"></m3e-divider>');

    const insets = await lineInsets(page);
    expect(insets.start).toBe(0);
    expect(insets.end).toBe(0);
  });

  test("inset indents both ends", async ({ page, render }) => {
    await render('<m3e-divider inset style="width: 300px; --m3e-divider-inset-size: 20px"></m3e-divider>');

    const insets = await lineInsets(page);
    expect(insets.start).toBe(20);
    expect(insets.end).toBe(20);
  });

  test("inset-start and inset-end indent a single side", async ({ page, render }) => {
    await render(`
      <m3e-divider id="s" inset-start style="width: 300px; --m3e-divider-inset-start-size: 12px"></m3e-divider>
      <m3e-divider id="e" inset-end style="width: 300px; --m3e-divider-inset-end-size: 8px"></m3e-divider>
    `);
    const insets = (id: string) =>
      page.locator(id).evaluate((element) => {
        const host = element.getBoundingClientRect();
        const line = element.shadowRoot!.querySelector(".line")!.getBoundingClientRect();
        return { start: line.left - host.left, end: host.right - line.right };
      });

    expect(await insets("#s")).toEqual({ start: 12, end: 0 });
    expect(await insets("#e")).toEqual({ start: 0, end: 8 });
  });

  test("insets apply along the vertical axis for a vertical divider", async ({ page, render }) => {
    await render('<m3e-divider vertical inset style="height: 200px; --m3e-divider-inset-size: 16px"></m3e-divider>');

    const insets = await lineInsets(page);
    expect(insets.top).toBe(16);
    expect(insets.bottom).toBe(16);
  });

  test("reflects inset, inset-start and inset-end", async ({ page, render }) => {
    await render("<m3e-divider inset inset-start inset-end></m3e-divider>");
    const divider = page.locator("m3e-divider");

    await expect(divider).toHaveAttribute("inset", "");
    await expect(divider).toHaveAttribute("inset-start", "");
    await expect(divider).toHaveAttribute("inset-end", "");
  });
});
