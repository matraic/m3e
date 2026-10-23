import { expect, test } from "../../../fixtures";

type Highlight = HTMLElement & {
  term: string;
  mode: string;
  caseSensitive: boolean;
  disabled: boolean;
  isSupported: boolean;
  ranges: readonly Range[];
  updateComplete: Promise<boolean>;
};

const highlighted = (page: import("@playwright/test").Page, selector = "m3e-text-highlight") =>
  page.locator(selector).evaluate((el) => (el as Highlight).ranges.map((r) => r.toString()));

test.describe("m3e-text-highlight", () => {
  test("is supported by the browser", async ({ page, render }) => {
    await render(`<m3e-text-highlight>Apple</m3e-text-highlight>`);

    expect(await page.locator("m3e-text-highlight").evaluate((el) => (el as Highlight).isSupported)).toBe(true);
  });

  test("has no ranges without a term", async ({ page, render }) => {
    await render(`<m3e-text-highlight>Apple</m3e-text-highlight>`);

    expect(await highlighted(page)).toEqual([]);
  });

  test("highlights every occurrence in contains mode, ignoring case by default", async ({ page, render }) => {
    await render(`<m3e-text-highlight term="AP">Apple apricot grape</m3e-text-highlight>`);

    await expect.poll(() => highlighted(page)).toEqual(["Ap", "ap", "ap"]);
  });

  test("honours case-sensitive", async ({ page, render }) => {
    await render(`<m3e-text-highlight term="Ap" case-sensitive>Apple apricot</m3e-text-highlight>`);

    await expect.poll(() => highlighted(page)).toEqual(["Ap"]);
  });

  test("starts-with highlights only a leading match", async ({ page, render }) => {
    await render(`
      <m3e-text-highlight id="a" term="app" mode="starts-with">Apple app</m3e-text-highlight>
      <m3e-text-highlight id="b" term="ple" mode="starts-with">Apple</m3e-text-highlight>
    `);

    await expect.poll(() => highlighted(page, "#a")).toEqual(["App"]);
    expect(await highlighted(page, "#b")).toEqual([]);
  });

  test("ends-with highlights only a trailing match", async ({ page, render }) => {
    await render(`
      <m3e-text-highlight id="a" term="ple" mode="ends-with">Apple</m3e-text-highlight>
      <m3e-text-highlight id="b" term="app" mode="ends-with">Apple</m3e-text-highlight>
    `);

    await expect.poll(() => highlighted(page, "#a")).toEqual(["ple"]);
    expect(await highlighted(page, "#b")).toEqual([]);
  });

  test("finds text inside nested elements", async ({ page, render }) => {
    await render(`<m3e-text-highlight term="an">Ba<b>nan</b>a</m3e-text-highlight>`);

    await expect.poll(() => highlighted(page)).toEqual(["an"]);
  });

  test("disabled removes highlights", async ({ page, render }) => {
    await render(`<m3e-text-highlight term="ap">Apple</m3e-text-highlight>`);
    await expect.poll(() => highlighted(page)).toEqual(["Ap"]);

    await page.locator("m3e-text-highlight").evaluate(async (el) => {
      (el as Highlight).disabled = true;
      await (el as Highlight).updateComplete;
    });

    expect(await highlighted(page)).toEqual([]);
    await expect(page.locator("m3e-text-highlight")).toHaveAttribute("disabled", "");
  });

  test("updates when the term changes", async ({ page, render }) => {
    await render(`<m3e-text-highlight term="ap">Apple grape</m3e-text-highlight>`);
    await expect.poll(() => highlighted(page)).toEqual(["Ap", "ap"]);

    await page.locator("m3e-text-highlight").evaluate(async (el) => {
      (el as Highlight).term = "gr";
      await (el as Highlight).updateComplete;
    });

    expect(await highlighted(page)).toEqual(["gr"]);
  });

  test("registers a CSS highlight and removes it when the term is cleared", async ({ page, render }) => {
    await render(`<m3e-text-highlight term="ap">Apple</m3e-text-highlight>`);
    await expect.poll(() => page.evaluate(() => CSS.highlights.size)).toBe(1);

    await page.locator("m3e-text-highlight").evaluate(async (el) => {
      (el as Highlight).term = "";
      await (el as Highlight).updateComplete;
    });

    expect(await page.evaluate(() => CSS.highlights.size)).toBe(0);
  });

  test("dispatches a highlight event with the matching ranges", async ({ page, render }) => {
    await render(`<m3e-text-highlight>Apple apricot</m3e-text-highlight>`);

    const detail = await page.locator("m3e-text-highlight").evaluate(
      (el) =>
        new Promise<string[]>((resolve) => {
          el.addEventListener(
            "highlight",
            (e) => resolve((e as CustomEvent<Range[]>).detail.map((r) => r.toString())),
            {
              once: true,
            },
          );
          (el as Highlight).term = "ap";
        }),
    );

    expect(detail).toEqual(["Ap", "ap"]);
  });

  test("the highlight event does not bubble", async ({ page, render }) => {
    await render(`<div id="host"><m3e-text-highlight>Apple</m3e-text-highlight></div>`);
    await page.evaluate(() => {
      (window as unknown as { count: number }).count = 0;
      document.getElementById("host")!.addEventListener("highlight", () => {
        (window as unknown as { count: number }).count++;
      });
    });

    await page.locator("m3e-text-highlight").evaluate(async (el) => {
      (el as Highlight).term = "ap";
      await (el as Highlight).updateComplete;
    });

    expect(await page.evaluate(() => (window as unknown as { count: number }).count)).toBe(0);
  });
});
