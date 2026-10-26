import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

const LINE = 20;

const field = (attrs = "", value = "", textareaAttrs = "") => `
  <style>
    textarea { width: 200px; font: 16px/${LINE}px monospace; padding: 0; border: 0; margin: 0; box-sizing: content-box; display: block; }
  </style>
  <textarea id="t" rows="1" ${textareaAttrs}>${value}</textarea>
  <m3e-textarea-autosize for="t" ${attrs}></m3e-textarea-autosize>
`;

const lines = (n: number) => Array.from({ length: n }, (_, i) => `line ${i}`).join("\n");

const height = (page: Page) => page.locator("#t").evaluate((el) => el.getBoundingClientRect().height);

test.describe("m3e-textarea-autosize", () => {
  test("is hidden from assistive technology", async ({ page, render }) => {
    await render(field());

    await expect(page.locator("m3e-textarea-autosize")).toHaveAttribute("aria-hidden", "true");
    await expect(page.locator("m3e-textarea-autosize")).toBeHidden();
  });

  test("disables manual resizing of the textarea", async ({ page, render }) => {
    await render(field());
    await expect(page.locator("#t")).toHaveCSS("resize", "none");
  });

  test("sizes the textarea to its initial content", async ({ page, render }) => {
    await render(field("", lines(4)));

    await expect.poll(() => height(page)).toBe(LINE * 4);
  });

  test("grows and shrinks as the user types", async ({ page, render }) => {
    await render(field());
    const t = page.locator("#t");

    await t.fill(lines(3));
    await expect.poll(() => height(page)).toBe(LINE * 3);

    await t.fill(lines(6));
    await expect.poll(() => height(page)).toBe(LINE * 6);

    await t.fill("one");
    await expect.poll(() => height(page)).toBe(LINE);
  });

  test("max-rows caps the height", async ({ page, render }) => {
    await render(field(`max-rows="3"`));

    await page.locator("#t").fill(lines(8));
    await expect.poll(() => height(page)).toBe(LINE * 3);
    await expect(page.locator("#t")).toHaveCSS("max-height", `${LINE * 3}px`);
  });

  test("min-rows sets a minimum height", async ({ page, render }) => {
    await render(field(`min-rows="4"`));

    await expect.poll(() => height(page)).toBe(LINE * 4);
    await page.locator("#t").fill(lines(2));
    await expect.poll(() => height(page)).toBe(LINE * 4);
    await page.locator("#t").fill(lines(6));
    await expect.poll(() => height(page)).toBe(LINE * 6);
  });

  test("wrapping text increases the height", async ({ page, render }) => {
    await render(field());

    await page.locator("#t").fill("word ".repeat(60));
    await expect.poll(() => height(page)).toBeGreaterThan(LINE * 2);
  });

  test("a placeholder sets the minimum height", async ({ page, render }) => {
    await render(field("", "", `placeholder="${lines(3)}"`));

    await expect.poll(() => height(page)).toBeGreaterThanOrEqual(LINE * 3);
  });

  test("resizeToFitContent picks up programmatic value changes", async ({ page, render }) => {
    await render(field());
    await page.locator("#t").evaluate((el) => {
      (el as HTMLTextAreaElement).value = "a\nb\nc\nd\ne";
    });
    await page
      .locator("m3e-textarea-autosize")
      .evaluate((el) => (el as unknown as { resizeToFitContent(): void }).resizeToFitContent());

    await expect.poll(() => height(page)).toBe(LINE * 5);
  });

  test("disabled stops resizing and restores the original height", async ({ page, render }) => {
    await render(field(`disabled`, "", `style="height: 50px"`));

    await page.locator("#t").fill(lines(5));
    expect(await height(page)).toBe(50);
  });

  test("disabling restores the initial height and enabling resizes again", async ({ page, render }) => {
    await render(field("", lines(4), `style="height: 50px"`));
    await expect.poll(() => height(page)).toBe(LINE * 4);

    await page.locator("m3e-textarea-autosize").evaluate((el) => el.setAttribute("disabled", ""));
    await expect.poll(() => height(page)).toBe(50);

    await page.locator("m3e-textarea-autosize").evaluate((el) => el.removeAttribute("disabled"));
    await expect.poll(() => height(page)).toBe(LINE * 4);
  });

  test("reset restores the original height", async ({ page, render }) => {
    await render(field("", lines(4), `style="height: 50px"`));
    await expect.poll(() => height(page)).toBe(LINE * 4);

    await page.locator("m3e-textarea-autosize").evaluate((el) => (el as unknown as { reset(): void }).reset());
    await expect.poll(() => height(page)).toBe(50);
  });

  test("changing max-rows after the first resize updates the cap", async ({ page, render }) => {
    await render(field(`max-rows="5"`, lines(8)));
    await expect.poll(() => height(page)).toBe(LINE * 5);

    await page.locator("m3e-textarea-autosize").evaluate((el) => el.setAttribute("max-rows", "2"));

    await expect.poll(() => height(page)).toBe(LINE * 2);
  });

  test("disabling removes the limits and enabling restores them", async ({ page, render }) => {
    await render(field(`max-rows="3"`, lines(8)));
    const auto = page.locator("m3e-textarea-autosize");
    await expect.poll(() => height(page)).toBe(LINE * 3);

    await auto.evaluate((el) => el.setAttribute("disabled", ""));
    await expect.poll(() => page.locator("#t").evaluate((el) => el.style.maxHeight)).toBe("");

    await auto.evaluate((el) => el.setAttribute("max-rows", "2"));
    await page.waitForTimeout(100);
    expect(await page.locator("#t").evaluate((el) => el.style.maxHeight)).toBe("");

    await auto.evaluate((el) => el.removeAttribute("disabled"));
    await expect.poll(() => height(page)).toBe(LINE * 2);
    await expect(page.locator("#t")).toHaveCSS("max-height", `${LINE * 2}px`);
  });

  test("keeps inline min and max heights the component did not set", async ({ page, render }) => {
    await render(field("", lines(8), `style="max-height: 60px; min-height: 30px"`));

    await expect.poll(() => height(page)).toBe(60);
    await expect(page.locator("#t")).toHaveCSS("max-height", "60px");
    await expect(page.locator("#t")).toHaveCSS("min-height", "30px");
  });

  test("removes limits it applied when the row counts are cleared", async ({ page, render }) => {
    await render(field(`min-rows="2" max-rows="3"`, lines(8)));
    await expect.poll(() => height(page)).toBe(LINE * 3);

    await page.locator("m3e-textarea-autosize").evaluate((el) => {
      el.removeAttribute("min-rows");
      el.removeAttribute("max-rows");
    });

    await expect.poll(() => height(page)).toBe(LINE * 8);
    expect(await page.locator("#t").evaluate((el) => [el.style.minHeight, el.style.maxHeight])).toEqual(["", ""]);
  });

  test("changing min-rows after the first resize updates the minimum", async ({ page, render }) => {
    await render(field(`min-rows="2"`, "one"));
    await expect.poll(() => height(page)).toBe(LINE * 2);

    await page.locator("m3e-textarea-autosize").evaluate((el) => el.setAttribute("min-rows", "5"));

    await expect.poll(() => height(page)).toBe(LINE * 5);
  });

  test("resizes again when the window width changes", async ({ page, render }) => {
    await render(field("", "word ".repeat(40)));
    const before = await height(page);

    await page.locator("#t").evaluate((el) => (el.style.width = "100px"));
    await page.setViewportSize({ width: 700, height: 500 });

    await expect.poll(() => height(page)).toBeGreaterThan(before);
  });

  test("ignores a target that is not a textarea", async ({ page, render }) => {
    await render(`<input id="i" /><m3e-textarea-autosize for="i"></m3e-textarea-autosize>`);
    expect(await page.locator("#i").evaluate((el) => el.style.resize)).toBe("");
  });
});
