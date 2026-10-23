import { expect, test } from "../../../fixtures";

type Slide = HTMLElement & { selectedIndex: number | null };

const slide = (attrs = "") => `
  <m3e-slide ${attrs}>
    <div id="a">One</div>
    <div id="b">Two</div>
    <div id="c">Three</div>
  </m3e-slide>
`;

const classes = (page: import("@playwright/test").Page, id: string) =>
  page.locator(id).evaluate((el) => ({
    before: el.classList.contains("-before"),
    after: el.classList.contains("-after"),
    inert: el.hasAttribute("inert"),
  }));

test.describe("m3e-slide", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("defaults to no selected item", async ({ page, render }) => {
    await render(slide());

    expect(await page.locator("m3e-slide").evaluate((el) => (el as Slide).selectedIndex)).toBeNull();
  });

  test("with no selected item every item is parked before and inert", async ({ page, render }) => {
    await render(slide());

    for (const id of ["#a", "#b", "#c"]) {
      await expect.poll(() => classes(page, id)).toEqual({ before: true, after: false, inert: true });
    }
  });

  test("reflects selected-index", async ({ page, render }) => {
    await render(slide('selected-index="1"'));

    await page.locator("m3e-slide").evaluate((el) => ((el as Slide).selectedIndex = 2));
    await expect(page.locator("m3e-slide")).toHaveAttribute("selected-index", "2");
  });

  test("positions items relative to the selected index", async ({ page, render }) => {
    await render(slide('selected-index="1"'));

    await expect.poll(() => classes(page, "#a")).toEqual({ before: true, after: false, inert: true });
    expect(await classes(page, "#b")).toEqual({ before: false, after: false, inert: false });
    expect(await classes(page, "#c")).toEqual({ before: false, after: true, inert: true });
  });

  test("moves the selection when the index changes", async ({ page, render }) => {
    await render(slide('selected-index="0"'));
    await expect.poll(() => classes(page, "#a")).toEqual({ before: false, after: false, inert: false });

    await page.locator("m3e-slide").evaluate((el) => ((el as Slide).selectedIndex = 2));

    await expect.poll(() => classes(page, "#c")).toEqual({ before: false, after: false, inert: false });
    expect(await classes(page, "#a")).toEqual({ before: true, after: false, inert: true });
    expect(await classes(page, "#b")).toEqual({ before: true, after: false, inert: true });
  });

  test("only the selected item is visible", async ({ page, render }) => {
    await render(slide('selected-index="1"'));

    await expect(page.locator("#b")).toBeVisible();
    await expect(page.locator("#a")).toBeHidden();
    await expect(page.locator("#c")).toBeHidden();
  });

  test("clearing the selection parks all items", async ({ page, render }) => {
    await render(slide('selected-index="1"'));
    await expect.poll(() => classes(page, "#b")).toEqual({ before: false, after: false, inert: false });

    await page.locator("m3e-slide").evaluate((el) => ((el as Slide).selectedIndex = null));

    await expect.poll(() => classes(page, "#b")).toEqual({ before: true, after: false, inert: true });
  });

  test("a newly added item is positioned", async ({ page, render }) => {
    await render(slide('selected-index="0"'));
    await page.locator("m3e-slide").evaluate((el) => {
      const d = document.createElement("div");
      d.id = "d";
      d.textContent = "Four";
      el.appendChild(d);
    });

    await expect.poll(() => classes(page, "#d")).toEqual({ before: false, after: true, inert: true });
  });

  test("a removed item is restored", async ({ page, render }) => {
    await render(slide('selected-index="1"'));
    await expect.poll(() => classes(page, "#a")).toEqual({ before: true, after: false, inert: true });

    const removed = await page.locator("#a").evaluate((el) => {
      el.remove();
      document.body.appendChild(el);
      return true;
    });
    expect(removed).toBe(true);

    await expect.poll(() => classes(page, "#a")).toEqual({ before: false, after: false, inert: false });
  });
});
