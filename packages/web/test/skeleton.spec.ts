import { expect, test } from "./fixtures";

const skeleton = (attrs = "") => `
  <m3e-skeleton ${attrs}>
    <button style="width: 120px; height: 40px">Action</button>
  </m3e-skeleton>
`;

const animationsOf = (page: import("@playwright/test").Page) =>
  page.locator("m3e-skeleton").evaluate((el) => el.getAnimations().length);

test.describe("m3e-skeleton", () => {
  test("hides its content while loading", async ({ page, render }) => {
    await render(skeleton());

    await expect(page.getByRole("button", { name: "Action" })).toBeHidden();
  });

  test("reveals its content when loaded", async ({ page, render }) => {
    await render(skeleton("loaded"));

    await expect(page.getByRole("button", { name: "Action" })).toBeVisible();
  });

  test("reveals its content when loaded is set later", async ({ page, render }) => {
    await render(skeleton());

    await page.locator("m3e-skeleton").evaluate((el) => el.setAttribute("loaded", ""));

    await expect(page.getByRole("button", { name: "Action" })).toBeVisible();
  });

  test("does not let hidden content receive clicks while loading", async ({ page, render }) => {
    await render(skeleton());
    await page.getByRole("button", { name: "Action", includeHidden: true }).evaluate((el) => {
      (window as unknown as { clicked: number }).clicked = 0;
      el.addEventListener("click", () => ((window as unknown as { clicked: number }).clicked += 1));
    });

    await page.mouse.click(60, 20);

    expect(await page.evaluate(() => (window as unknown as { clicked: number }).clicked)).toBe(0);
  });

  test("defaults to the wave animation and auto shape", async ({ page, render }) => {
    await render(skeleton());
    const element = page.locator("m3e-skeleton");

    expect(
      await element.evaluate((el) => {
        const { animation, shape } = el as HTMLElement & { animation: string; shape: string };
        return { animation, shape };
      }),
    ).toEqual({ animation: "wave", shape: "auto" });
  });

  test("falls back to defaults for invalid values", async ({ page, render }) => {
    await render(skeleton('animation="bogus" shape="bogus"'));
    const element = page.locator("m3e-skeleton");

    await expect(element).toHaveAttribute("animation", "wave");
    await expect(element).toHaveAttribute("shape", "auto");
  });

  for (const animation of ["wave", "pulse"]) {
    test(`runs an animation while loading with ${animation}`, async ({ page, render }) => {
      await render(skeleton(`animation="${animation}"`));

      await expect.poll(() => animationsOf(page)).toBeGreaterThan(0);
    });
  }

  test("does not animate when animation is none", async ({ page, render }) => {
    await render(skeleton('animation="none"'));

    expect(await animationsOf(page)).toBe(0);
  });

  test("stops animating once loaded", async ({ page, render }) => {
    await render(skeleton());
    await expect.poll(() => animationsOf(page)).toBeGreaterThan(0);

    await page.locator("m3e-skeleton").evaluate((el) => el.setAttribute("loaded", ""));

    await expect.poll(() => animationsOf(page)).toBe(0);
  });

  test("starts animating again when loaded is removed", async ({ page, render }) => {
    await render(skeleton("loaded"));
    expect(await animationsOf(page)).toBe(0);

    await page.locator("m3e-skeleton").evaluate((el) => el.removeAttribute("loaded"));

    await expect.poll(() => animationsOf(page)).toBeGreaterThan(0);
  });

  test("updates its animation when the attribute changes", async ({ page, render }) => {
    await render(skeleton('animation="none"'));

    await page.locator("m3e-skeleton").evaluate((el) => el.setAttribute("animation", "pulse"));

    await expect.poll(() => animationsOf(page)).toBeGreaterThan(0);
  });

  test("renders a placeholder for each slotted element", async ({ page, render }) => {
    await render(`
      <m3e-skeleton shape="rounded">
        <div style="width: 100px; height: 20px"></div>
        <div style="width: 100px; height: 20px"></div>
      </m3e-skeleton>
    `);

    await expect
      .poll(() => page.locator("m3e-skeleton").evaluate((el) => el.shadowRoot!.querySelectorAll(".shape").length))
      .toBe(2);
  });

  test("applies the circular shape radius token", async ({ page, render }) => {
    await render(`
      <m3e-skeleton shape="circular" style="--m3e-skeleton-circular-shape: 7px">
        <div style="width: 100px; height: 20px"></div>
      </m3e-skeleton>
    `);

    await expect
      .poll(() =>
        page
          .locator("m3e-skeleton")
          .evaluate((el) =>
            el.shadowRoot!.querySelector<HTMLElement>(".shape")?.computedStyleMap().get("border-radius")?.toString(),
          ),
      )
      .toBe("7px");
  });

  test("matches the border radius of its content when the shape is auto", async ({ page, render }) => {
    await render(`
      <m3e-skeleton>
        <div style="width: 100px; height: 20px; border-radius: 9px"></div>
      </m3e-skeleton>
    `);

    await expect
      .poll(() =>
        page
          .locator("m3e-skeleton")
          .evaluate((el) => el.shadowRoot!.querySelector<HTMLElement>(".shape")?.style.borderRadius),
      )
      .toBe("9px");
  });

  test("removes its placeholders when disconnected", async ({ page, render }) => {
    await render(skeleton());
    const element = page.locator("m3e-skeleton");
    await expect.poll(() => element.evaluate((el) => el.shadowRoot!.querySelectorAll(".shape").length)).toBe(1);

    const remaining = await element.evaluate((el) => {
      const root = el.shadowRoot!;
      el.remove();
      return root.querySelectorAll(".shape").length;
    });

    expect(remaining).toBe(0);
  });

  test("is not displayed when hidden", async ({ page, render }) => {
    await render(skeleton("hidden"));

    await expect(page.locator("m3e-skeleton")).toBeHidden();
  });
});
