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
});
