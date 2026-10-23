import { Page } from "@playwright/test";

import { expect, test } from "../../../fixtures";

type Collapsible = HTMLElement & { open: boolean; orientation: string; noAnimate: boolean; slide: boolean };
type Recorded = HTMLElement & { __events?: string[] };

const collapsible = (attrs = "") => `
  <m3e-collapsible ${attrs}><div style="height: 100px; width: 100px">Content</div></m3e-collapsible>
`;

const recordEvents = (page: Page) =>
  page.evaluate(() => {
    const el = document.querySelector("m3e-collapsible") as Recorded;
    el.__events = [];
    for (const name of ["opening", "opened", "closing", "closed"]) {
      el.addEventListener(name, () => el.__events!.push(name));
    }
  });

const events = (page: Page) => page.evaluate(() => (document.querySelector("m3e-collapsible") as Recorded).__events);

test.describe("m3e-collapsible", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("defaults", async ({ page, render }) => {
    await render(collapsible());
    const el = page.locator("m3e-collapsible");

    expect(await el.evaluate((x) => (x as Collapsible).open)).toBe(false);
    expect(await el.evaluate((x) => (x as Collapsible).orientation)).toBe("vertical");
    expect(await el.evaluate((x) => (x as Collapsible).noAnimate)).toBe(false);
    expect(await el.evaluate((x) => (x as Collapsible).slide)).toBe(false);
  });

  test("reflects open, orientation, no-animate and slide", async ({ page, render }) => {
    await render(collapsible());
    const el = page.locator("m3e-collapsible");

    await el.evaluate((x) => {
      const c = x as Collapsible;
      c.open = true;
      c.orientation = "horizontal";
      c.noAnimate = true;
      c.slide = true;
    });

    await expect(el).toHaveAttribute("open", "");
    await expect(el).toHaveAttribute("orientation", "horizontal");
    await expect(el).toHaveAttribute("no-animate", "");
    await expect(el).toHaveAttribute("slide", "");
  });

  test("content is visible when open", async ({ page, render }) => {
    await render(collapsible("open"));

    await expect(page.getByText("Content")).toBeVisible();
    expect(await page.locator("m3e-collapsible").evaluate((x) => x.hasAttribute("inert"))).toBe(false);
  });

  test("content is hidden when closed", async ({ page, render }) => {
    await render(collapsible());

    await expect(page.getByText("Content")).toBeHidden();
    expect(await page.locator("m3e-collapsible").evaluate((x) => getComputedStyle(x).visibility)).toBe("hidden");
  });

  test("opening dispatches opening then opened", async ({ page, render }) => {
    await render(collapsible());
    await recordEvents(page);

    await page.locator("m3e-collapsible").evaluate((x) => ((x as Collapsible).open = true));

    await expect.poll(() => events(page)).toEqual(["opening", "opened"]);
    await expect(page.getByText("Content")).toBeVisible();
    await expect(page.locator("m3e-collapsible")).not.toHaveAttribute("inert", "");
  });

  test("closing dispatches closing then closed", async ({ page, render }) => {
    await render(collapsible("open"));
    await recordEvents(page);

    await page.locator("m3e-collapsible").evaluate((x) => ((x as Collapsible).open = false));

    await expect.poll(() => events(page)).toEqual(["closing", "closed"]);
    await expect(page.getByText("Content")).toBeHidden();
    await expect(page.locator("m3e-collapsible")).toHaveAttribute("inert", "");
  });

  test("an initially open collapsible dispatches no events", async ({ page, render }) => {
    await render(collapsible("open"));
    await recordEvents(page);

    expect(await events(page)).toEqual([]);
  });

  test("animates between states when motion is allowed", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(collapsible());
    await recordEvents(page);
    const el = page.locator("m3e-collapsible");

    await el.evaluate((x) => ((x as Collapsible).open = true));
    await expect.poll(() => events(page)).toEqual(["opening", "opened"]);
    await expect(page.getByText("Content")).toBeVisible();

    await el.evaluate((x) => ((x as Collapsible).open = false));
    await expect.poll(() => events(page)).toEqual(["opening", "opened", "closing", "closed"]);
    await expect(page.getByText("Content")).toBeHidden();
  });

  test("no-animate completes immediately without a transition", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(collapsible("no-animate"));
    await recordEvents(page);

    await page.locator("m3e-collapsible").evaluate((x) => ((x as Collapsible).open = true));

    await expect.poll(() => events(page)).toEqual(["opening", "opened"]);
  });

  test("orientation sets a matching custom state", async ({ page, render }) => {
    await render(collapsible('orientation="horizontal"'));
    const el = page.locator("m3e-collapsible");
    const state = (name: string) => el.evaluate((x, n) => x.matches(`:state(--${n})`), name);

    await expect.poll(() => state("horizontal")).toBe(true);
    expect(await state("vertical")).toBe(false);

    await el.evaluate((x) => ((x as Collapsible).orientation = "both"));
    await expect.poll(() => state("both")).toBe(true);
    expect(await state("horizontal")).toBe(false);
  });

  test("an invalid orientation falls back to horizontal", async ({ page, render }) => {
    await render(collapsible('orientation="bogus"'));

    await expect(page.locator("m3e-collapsible")).toHaveAttribute("orientation", "horizontal");
  });

  test("horizontal orientation collapses the width", async ({ page, render }) => {
    await render(collapsible('orientation="horizontal"'));
    const el = page.locator("m3e-collapsible");

    await expect.poll(() => el.evaluate((x) => x.getBoundingClientRect().width)).toBe(0);
    await el.evaluate((x) => ((x as Collapsible).open = true));
    await expect.poll(() => el.evaluate((x) => x.getBoundingClientRect().width)).toBeGreaterThan(0);
  });
});
