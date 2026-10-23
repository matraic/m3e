import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

const content = (extra = "") => `
  <m3e-toc id="toc" for="content"></m3e-toc>
  <div id="content" style="height: 200px; overflow: auto; position: relative">
    <h2>Intro</h2>
    <p style="height: 300px">text</p>
    <h3>Install</h3>
    <p style="height: 300px">text</p>
    <h4>Deep</h4>
    <p style="height: 300px">text</p>
    <h2>API</h2>
    <p style="height: 600px">text</p>
    ${extra}
  </div>
`;

const labels = (page: Page) =>
  page.locator("m3e-toc").evaluate((el) =>
    [...el.shadowRoot!.querySelectorAll("m3e-toc-item")].map((x) => ({
      text: x.textContent!.trim(),
      level: (x as unknown as { node: { level: number } }).node.level,
    })),
  );

const current = (page: Page) =>
  page.locator("m3e-toc").evaluate((el) => {
    const item = [...el.shadowRoot!.querySelectorAll("m3e-toc-item")].find((x) => x.ariaCurrent === "true");
    return item?.textContent?.trim() ?? null;
  });

test.describe("m3e-toc", () => {
  test("builds a hierarchy from the headings of the target, limited by max-depth", async ({ page, render }) => {
    await render(content());

    await expect
      .poll(() => labels(page))
      .toEqual([
        { text: "Intro", level: 1 },
        { text: "Install", level: 2 },
        { text: "API", level: 1 },
      ]);
  });

  test("max-depth controls how many levels are shown", async ({ page, render }) => {
    await render(content());
    const toc = page.locator("m3e-toc");

    await toc.evaluate((el) => el.setAttribute("max-depth", "3"));
    await expect.poll(async () => (await labels(page)).map((x) => x.text)).toEqual(["Intro", "Install", "Deep", "API"]);

    await toc.evaluate((el) => el.setAttribute("max-depth", "1"));
    await expect.poll(async () => (await labels(page)).map((x) => x.text)).toEqual(["Intro", "API"]);
  });

  test("max-depth is clamped to at least one level", async ({ page, render }) => {
    await render(content());

    await page.locator("m3e-toc").evaluate((el) => el.setAttribute("max-depth", "0"));

    await expect.poll(async () => (await labels(page)).map((x) => x.text)).toEqual(["Intro", "API"]);
  });

  test("levels are relative to the shallowest heading", async ({ page, render }) => {
    await render(`
      <m3e-toc for="content"></m3e-toc>
      <div id="content"><h3>One</h3><h4>Two</h4></div>
    `);

    await expect
      .poll(() => labels(page))
      .toEqual([
        { text: "One", level: 1 },
        { text: "Two", level: 2 },
      ]);
  });

  test("m3e-heading elements with a level are included", async ({ page, render }) => {
    await render(`
      <m3e-toc for="content"></m3e-toc>
      <div id="content"><m3e-heading level="2">Custom</m3e-heading><m3e-heading level="3">Child</m3e-heading></div>
    `);

    await expect.poll(async () => (await labels(page)).map((x) => x.text)).toEqual(["Custom", "Child"]);
  });

  test("headings with m3e-toc-ignore are excluded", async ({ page, render }) => {
    await render(`
      <m3e-toc for="content"></m3e-toc>
      <div id="content"><h2>Keep</h2><h2 m3e-toc-ignore>Skip</h2></div>
    `);

    await expect.poll(async () => (await labels(page)).map((x) => x.text)).toEqual(["Keep"]);
  });

  test("renders no items without a target", async ({ page, render }) => {
    await render(`<m3e-toc></m3e-toc><h2>Heading</h2>`);

    expect(await labels(page)).toEqual([]);
  });

  test("regenerates when headings are added to the target", async ({ page, render }) => {
    await render(content());
    await expect.poll(async () => (await labels(page)).length).toBe(3);

    await page.locator("#content").evaluate((el) => el.insertAdjacentHTML("beforeend", "<h2>Added</h2>"));

    await expect.poll(async () => (await labels(page)).map((x) => x.text)).toContain("Added");
  });

  test("the first item is current initially", async ({ page, render }) => {
    await render(content());

    await expect.poll(() => current(page)).toBe("Intro");
  });

  test("items are exposed as links", async ({ page, render }) => {
    await render(content());

    await expect(page.getByRole("link")).toHaveCount(3);
    await expect(page.getByRole("link", { name: "Install" })).toBeVisible();
  });

  test("clicking an item scrolls its heading into view and marks it current", async ({ page, render }) => {
    await render(content());
    await expect.poll(() => current(page)).toBe("Intro");

    await page.getByRole("link", { name: "API" }).click();

    await expect.poll(() => current(page)).toBe("API");
    await expect.poll(() => page.locator("#content").evaluate((el) => el.scrollTop)).toBeGreaterThan(300);
  });

  test("scrolling the target updates the current item", async ({ page, render }) => {
    await render(content());
    await expect.poll(() => current(page)).toBe("Intro");

    await page.locator("#content").evaluate((el) => {
      const headings = el.querySelectorAll<HTMLElement>("h2");
      el.scrollTo({ top: headings[headings.length - 1].offsetTop });
    });

    await expect.poll(() => current(page)).toBe("API");

    await page.locator("#content").evaluate((el) => el.scrollTo({ top: 0 }));

    await expect.poll(() => current(page)).toBe("Intro");
  });

  test("clears items when detached from its target", async ({ page, render }) => {
    await render(content());
    await expect.poll(async () => (await labels(page)).length).toBe(3);

    await page.locator("m3e-toc").evaluate((el) => el.removeAttribute("for"));

    await expect.poll(async () => (await labels(page)).length).toBe(0);
  });

  test("overline and title slots toggle their custom states", async ({ page, render }) => {
    await render(`
      <m3e-toc for="content"><span slot="overline">Contents</span><span slot="title">Docs</span></m3e-toc>
      <div id="content"><h2>A</h2></div>
    `);

    await expect
      .poll(() => page.locator("m3e-toc").evaluate((el) => el.matches(":state(--with-overline):state(--with-title)")))
      .toBe(true);
  });
});

test.describe("m3e-toc-item", () => {
  test("selected maps to aria-current and not aria-selected", async ({ page, render }) => {
    await render(`<m3e-toc-item>Item</m3e-toc-item>`);
    const item = page.locator("m3e-toc-item");

    await item.evaluate((el) => ((el as unknown as { selected: boolean }).selected = true));

    await expect(item).toHaveAttribute("aria-current", "true");
    await expect(item).not.toHaveAttribute("aria-selected");

    await item.evaluate((el) => ((el as unknown as { selected: boolean }).selected = false));

    await expect(item).not.toHaveAttribute("aria-current");
  });
});
