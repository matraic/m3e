import { expect, test } from "./fixtures";

const clipPathOf = (el: Element) => getComputedStyle(el.shadowRoot!.querySelector(".wrapper")!).clipPath;

test.describe("m3e-shape", () => {
  test("has no clip path when unnamed", async ({ page, render }) => {
    await render(`<m3e-shape></m3e-shape>`);

    expect(await page.locator("m3e-shape").evaluate(clipPathOf)).toBe("none");
  });

  test("clips to a polygon for a named shape", async ({ page, render }) => {
    await render(`<m3e-shape name="sunny"></m3e-shape>`);

    expect(await page.locator("m3e-shape").evaluate(clipPathOf)).toContain("polygon(");
  });

  test("uses a different clip path for each shape", async ({ page, render }) => {
    await render(`
      <m3e-shape name="sunny"></m3e-shape>
      <m3e-shape name="heart"></m3e-shape>
      <m3e-shape name="square"></m3e-shape>
    `);

    const paths = await page
      .locator("m3e-shape")
      .evaluateAll((els) => els.map((el) => getComputedStyle(el.shadowRoot!.querySelector(".wrapper")!).clipPath));

    expect(new Set(paths).size).toBe(3);
  });

  test("updates the clip path when the name changes", async ({ page, render }) => {
    await render(`<m3e-shape name="sunny"></m3e-shape>`);
    const shape = page.locator("m3e-shape");
    const before = await shape.evaluate(clipPathOf);

    await shape.evaluate((el) => el.setAttribute("name", "heart"));

    await expect.poll(() => shape.evaluate(clipPathOf)).not.toBe(before);
  });

  test("removes the clip path when the name is removed", async ({ page, render }) => {
    await render(`<m3e-shape name="sunny"></m3e-shape>`);
    const shape = page.locator("m3e-shape");

    await shape.evaluate((el) => el.removeAttribute("name"));

    await expect.poll(() => shape.evaluate(clipPathOf)).toBe("none");
  });

  test("applies no clip path to an unknown name", async ({ page, render }) => {
    await render(`<m3e-shape name="bogus"></m3e-shape>`);

    expect(await page.locator("m3e-shape").evaluate(clipPathOf)).toBe("none");
  });

  test("sizes itself from the size token as a square", async ({ page, render }) => {
    await render(`<m3e-shape name="circle" style="--m3e-shape-size: 120px"></m3e-shape>`);
    const shape = page.locator("m3e-shape");

    await expect(shape).toHaveCSS("width", "120px");
    await expect(shape).toHaveCSS("height", "120px");
  });

  test("renders slotted content within the shape", async ({ page, render }) => {
    await render(`<m3e-shape name="circle" style="--m3e-shape-size: 100px"><span>Inside</span></m3e-shape>`);

    await expect(page.getByText("Inside")).toBeVisible();
  });

  test("is not displayed when hidden", async ({ page, render }) => {
    await render(`<m3e-shape name="circle" hidden></m3e-shape>`);

    await expect(page.locator("m3e-shape")).toBeHidden();
  });

  test("applies the container color token", async ({ page, render }) => {
    await render(`<m3e-shape name="circle" style="--m3e-shape-container-color: rgb(255, 0, 0)"></m3e-shape>`);

    expect(
      await page
        .locator("m3e-shape")
        .evaluate((el) => getComputedStyle(el.shadowRoot!.querySelector(".wrapper")!).backgroundColor),
    ).toBe("rgb(255, 0, 0)");
  });
});
