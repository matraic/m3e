import type { Page } from "@playwright/test";

import type { M3eSwipeRevealElement, M3eSwipeRevealGroupElement } from "../src/swipe-reveal";
import { expect, test } from "./fixtures";

type Side = "leading" | "trailing";
type Method = "reveal" | "close" | "dismiss" | "restore";

const item = (id: string, attrs = "") => `
  <m3e-swipe-reveal id="${id}" ${attrs} style="display: block; width: 400px">
    <button slot="leading" style="width: 80px; height: 56px">Pin</button>
    <button slot="trailing" style="width: 80px; height: 56px">Delete</button>
    <div style="height: 56px; background: white">Content ${id}</div>
  </m3e-swipe-reveal>
`;

const state = (page: Page, id: string) => page.locator(`#${id}`).evaluate((el) => (el as M3eSwipeRevealElement).state);

const side = (page: Page, id: string) => page.locator(`#${id}`).evaluate((el) => (el as M3eSwipeRevealElement).side);

const call = (page: Page, id: string, method: Method, arg?: Side) =>
  page.locator(`#${id}`).evaluate(
    (el, input) => {
      const target = el as M3eSwipeRevealElement;
      if (input.method === "reveal" || input.method === "dismiss") target[input.method](input.arg);
      else target[input.method]();
    },
    { method, arg },
  );

const events = (page: Page, id: string, names: string[]) =>
  page.locator(`#${id}`).evaluate((el, list) => {
    const w = window as typeof window & { log: string[] };
    w.log = [];
    for (const name of list) el.addEventListener(name, () => w.log.push(name));
  }, names);

const log = (page: Page) => page.evaluate(() => (window as typeof window & { log: string[] }).log);

/** Drags the content by `dx`. A fast drag is released while moving (a fling), a slow one after pausing. */
async function drag(page: Page, id: string, dx: number, speed: "fast" | "slow" = "fast") {
  const box = (await page.locator(`#${id}`).boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();

  if (speed === "fast") {
    await page.mouse.move(x + dx, y, { steps: 6 });
  } else {
    for (let i = 1; i <= 10; i++) {
      await page.mouse.move(x + (dx * i) / 10, y);
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(250);
  }

  await page.mouse.up();
}

/** Presses the content and drags it by `dx`, leaving the pointer down. */
async function press(page: Page, id: string, dx: number) {
  const box = (await page.locator(`#${id}`).boundingBox())!;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;

  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + dx, y, { steps: 8 });
}

const left = async (page: Page, id: string) => (await page.locator(`#${id}`).boundingBox())!.x;

test.describe("m3e-swipe-reveal", () => {
  test("starts covered", async ({ page, render }) => {
    await render(item("a"));

    expect(await state(page, "a")).toBe("covered");
    expect(await side(page, "a")).toBeNull();
  });

  test("reveal() reveals the requested side", async ({ page, render }) => {
    await render(item("a"));
    await events(page, "a", ["revealing", "revealed"]);

    await call(page, "a", "reveal", "trailing");

    await expect.poll(() => state(page, "a")).toBe("revealed");
    expect(await side(page, "a")).toBe("trailing");
    expect(await log(page)).toEqual(["revealing", "revealed"]);
  });

  test("revealing, revealed and covered events carry the side", async ({ page, render }) => {
    await render(item("a"));
    await page.locator("#a").evaluate((el) => {
      const w = window as typeof window & { sides: string[] };
      w.sides = [];
      for (const name of ["revealing", "revealed", "covered"]) {
        el.addEventListener(name, (e) => w.sides.push(`${name}:${(e as CustomEvent<{ side: string }>).detail.side}`));
      }
    });

    await call(page, "a", "reveal", "leading");
    await expect.poll(() => state(page, "a")).toBe("revealed");
    await call(page, "a", "close");
    await expect.poll(() => state(page, "a")).toBe("covered");
    await drag(page, "a", -120);
    await expect.poll(() => state(page, "a")).toBe("revealed");

    expect(await page.evaluate(() => (window as typeof window & { sides: string[] }).sides)).toEqual([
      "revealing:leading",
      "revealed:leading",
      "covered:leading",
      "revealing:trailing",
      "revealed:trailing",
    ]);
  });

  test("reveal() does nothing for a side without actions", async ({ page, render }) => {
    await render(
      `<m3e-swipe-reveal id="a"><button slot="trailing">Delete</button><div>Content</div></m3e-swipe-reveal>`,
    );

    await call(page, "a", "reveal", "leading");

    expect(await state(page, "a")).toBe("covered");
  });

  test("close() covers a revealed item and emits covered", async ({ page, render }) => {
    await render(item("a"));
    await call(page, "a", "reveal", "leading");
    await expect.poll(() => state(page, "a")).toBe("revealed");
    await events(page, "a", ["covered"]);

    await call(page, "a", "close");

    await expect.poll(() => state(page, "a")).toBe("covered");
    expect(await log(page)).toEqual(["covered"]);
  });

  test("a fling toward the trailing side reveals the trailing actions", async ({ page, render }) => {
    await render(item("a"));

    await drag(page, "a", -120);

    await expect.poll(() => state(page, "a")).toBe("revealed");
    expect(await side(page, "a")).toBe("trailing");
  });

  test("a fling toward the leading side reveals the leading actions", async ({ page, render }) => {
    await render(item("a"));

    await drag(page, "a", 120);

    await expect.poll(() => state(page, "a")).toBe("revealed");
    expect(await side(page, "a")).toBe("leading");
  });

  test("a slow drag past the threshold reveals", async ({ page, render }) => {
    await render(item("a"));

    await drag(page, "a", -70, "slow");

    await expect.poll(() => state(page, "a")).toBe("revealed");
  });

  test("a slow drag short of the threshold covers again", async ({ page, render }) => {
    await render(item("a"));

    await drag(page, "a", -20, "slow");

    await expect.poll(() => state(page, "a")).toBe("covered");
  });

  test("dragging back reveals nothing when covered by the opposite swipe", async ({ page, render }) => {
    await render(item("a"));
    await drag(page, "a", -120);
    await expect.poll(() => state(page, "a")).toBe("revealed");

    await drag(page, "a", 70);

    await expect.poll(() => state(page, "a")).toBe("covered");
  });

  test("only one item is revealed at a time in a group", async ({ page, render }) => {
    await render(`<m3e-swipe-reveal-group>${item("a")}${item("b")}</m3e-swipe-reveal-group>`);

    await call(page, "a", "reveal", "trailing");
    await expect.poll(() => state(page, "a")).toBe("revealed");
    await call(page, "b", "reveal", "trailing");

    await expect.poll(() => state(page, "b")).toBe("revealed");
    await expect.poll(() => state(page, "a")).toBe("covered");
  });

  test("a tap reveals only when the tap trigger is enabled", async ({ page, render }) => {
    await render(item("a") + item("b", 'triggers="tap"'));

    await page.locator("#a").click();
    expect(await state(page, "a")).toBe("covered");

    await page.locator("#b").click();
    await expect.poll(() => state(page, "b")).toBe("revealed");
  });

  test("inherits settings from the group unless overridden", async ({ page, render }) => {
    await render(`
      <m3e-swipe-reveal-group stagger="12" threshold="0.3" dismissible="trailing" dismiss-threshold="0.4">
        ${item("a")}${item("b", 'threshold="0.7"')}
      </m3e-swipe-reveal-group>
    `);

    const read = (id: string) =>
      page.locator(`#${id}`).evaluate((el) => {
        const reveal = el as M3eSwipeRevealElement;
        return {
          stagger: reveal.stagger,
          threshold: reveal.threshold,
          dismissible: reveal.dismissible,
          dismissThreshold: reveal.dismissThreshold,
        };
      });

    expect(await read("a")).toEqual({
      stagger: 12,
      threshold: 0.3,
      dismissible: "trailing",
      dismissThreshold: 0.4,
    });
    expect((await read("b")).threshold).toBe(0.7);
    expect((await read("b")).stagger).toBe(12);
  });

  test("the group exposes its reveals and the revealed item", async ({ page, render }) => {
    await render(`<m3e-swipe-reveal-group id="g">${item("a")}${item("b")}</m3e-swipe-reveal-group>`);
    const group = page.locator("#g");

    expect(await group.evaluate((el) => (el as M3eSwipeRevealGroupElement).reveals.length)).toBe(2);
    expect(await group.evaluate((el) => (el as M3eSwipeRevealGroupElement).revealed)).toBeNull();

    await call(page, "b", "reveal", "leading");
    await expect.poll(() => group.evaluate((el) => (el as M3eSwipeRevealGroupElement).revealed?.id)).toBe("b");
  });

  test("promotes content to the top layer while revealed and demotes afterward", async ({ page, render }) => {
    await render(`<div style="overflow: hidden; width: 300px">${item("a")}</div>`);
    const open = () =>
      page.locator("#a").evaluate((el) => el.shadowRoot!.querySelector(".content")!.matches(":popover-open"));

    expect(await open()).toBe(false);
    await call(page, "a", "reveal", "trailing");
    await expect.poll(() => state(page, "a")).toBe("revealed");
    expect(await open()).toBe(true);

    await call(page, "a", "close");
    await expect.poll(() => open()).toBe(false);
  });

  test("mirrors directions in right-to-left", async ({ page, render }) => {
    await render(item("a"));
    // Directionality is observed on the document, not on ancestors.
    await page.evaluate(() => (document.documentElement.dir = "rtl"));
    await page.waitForTimeout(100);

    await drag(page, "a", 120);

    await expect.poll(() => state(page, "a")).toBe("revealed");
    expect(await side(page, "a")).toBe("trailing");
  });
});

test.describe("m3e-swipe-reveal dismiss", () => {
  test("does nothing when not dismissible", async ({ page, render }) => {
    await render(item("a"));
    await call(page, "a", "reveal", "trailing");
    await events(page, "a", ["dismiss", "dismissed"]);

    await drag(page, "a", -380, "slow");

    expect(await log(page)).toEqual([]);
    expect(await state(page, "a")).not.toBe("dismissed");
  });

  test("a slow drag past the dismiss threshold dismisses", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));
    await events(page, "a", ["dismiss", "dismissed"]);

    await drag(page, "a", -300, "slow");

    await expect.poll(() => state(page, "a")).toBe("dismissed");
    expect(await log(page)).toEqual(["dismiss", "dismissed"]);
  });

  test("a slow drag short of the dismiss threshold reveals instead", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));
    await events(page, "a", ["dismiss", "dismissed"]);

    await drag(page, "a", -120, "slow");

    await expect.poll(() => state(page, "a")).toBe("revealed");
    expect(await log(page)).toEqual([]);
  });

  test("a fling from rest only reveals", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));

    await drag(page, "a", -70);

    await expect.poll(() => state(page, "a")).toBe("revealed");
  });

  test("a fling past the actions from rest dismisses", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));

    await drag(page, "a", -150);

    await expect.poll(() => state(page, "a")).toBe("dismissed");
  });

  test("a fling from a revealed item dismisses", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));
    await call(page, "a", "reveal", "trailing");
    await expect.poll(() => state(page, "a")).toBe("revealed");

    await drag(page, "a", -150);

    await expect.poll(() => state(page, "a")).toBe("dismissed");
  });

  test("does not dismiss on a side that is not dismissible", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));
    await events(page, "a", ["dismissed"]);

    await drag(page, "a", 300, "slow");

    expect(await log(page)).toEqual([]);
    expect(await state(page, "a")).not.toBe("dismissed");
  });

  test("dismiss() dismisses programmatically", async ({ page, render }) => {
    await render(item("a", 'dismissible="both"'));
    await events(page, "a", ["dismissed"]);

    await call(page, "a", "dismiss", "leading");

    await expect.poll(() => state(page, "a")).toBe("dismissed");
    expect(await log(page)).toEqual(["dismissed"]);
  });

  test("dismiss event is cancelable and returns the item to rest", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));
    await page.locator("#a").evaluate((el) => el.addEventListener("dismiss", (e) => e.preventDefault()));
    await events(page, "a", ["dismissed"]);

    await call(page, "a", "dismiss", "trailing");

    await expect.poll(() => state(page, "a")).not.toBe("dismissing");
    expect(await state(page, "a")).not.toBe("dismissed");
    expect(await log(page)).toEqual([]);
  });

  test("dismiss events bubble and carry the side", async ({ page, render }) => {
    await render(`<m3e-swipe-reveal-group id="g" dismissible="trailing">${item("a")}</m3e-swipe-reveal-group>`);
    await page.locator("#g").evaluate((g) => {
      const w = window as typeof window & { sides: string[] };
      w.sides = [];
      g.addEventListener("dismissed", (e) => w.sides.push((e as CustomEvent<{ side: string }>).detail.side));
    });

    await call(page, "a", "dismiss", "trailing");

    await expect
      .poll(() => page.evaluate(() => (window as typeof window & { sides: string[] }).sides))
      .toEqual(["trailing"]);
  });

  test("a dismissed item ignores reveal() and close()", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));
    await call(page, "a", "dismiss", "trailing");
    await expect.poll(() => state(page, "a")).toBe("dismissed");

    await call(page, "a", "reveal", "trailing");
    await call(page, "a", "close");

    expect(await state(page, "a")).toBe("dismissed");
  });

  test("restore() brings back a dismissed item", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));
    await call(page, "a", "dismiss", "trailing");
    await expect.poll(() => state(page, "a")).toBe("dismissed");

    await call(page, "a", "restore");

    await expect.poll(() => state(page, "a")).toBe("covered");
    await expect(page.locator("#a")).toBeVisible();
    expect((await page.locator("#a").boundingBox())!.height).toBeGreaterThan(0);
  });

  test("a dismissed item collapses its space", async ({ page, render }) => {
    await render(`<m3e-swipe-reveal-group>${item("a", 'dismissible="trailing"')}${item("b")}</m3e-swipe-reveal-group>`);
    const before = (await page.locator("#b").boundingBox())!.y;

    await call(page, "a", "dismiss", "trailing");
    await expect.poll(() => state(page, "a")).toBe("dismissed");

    await expect.poll(async () => (await page.locator("#b").boundingBox())!.y).toBeLessThan(before);
  });

  test("a slow drag toward either side dismisses when dismissible is both", async ({ page, render }) => {
    await render(item("a", 'dismissible="both"') + item("b", 'dismissible="both"'));

    await drag(page, "a", 300, "slow");
    await drag(page, "b", -300, "slow");

    await expect.poll(() => state(page, "a")).toBe("dismissed");
    await expect.poll(() => state(page, "b")).toBe("dismissed");
  });

  test("a lower dismiss-threshold dismisses on a shorter drag", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing" dismiss-threshold="0.3"'));

    await drag(page, "a", -150, "slow");

    await expect.poll(() => state(page, "a")).toBe("dismissed");
  });

  test("the default dismiss-threshold reveals on the drag a lower one dismisses", async ({ page, render }) => {
    await render(item("a", 'dismissible="trailing"'));

    await drag(page, "a", -150, "slow");

    await expect.poll(() => state(page, "a")).toBe("revealed");
  });

  test("dismissed items are skipped when staggering neighbors", async ({ page, render }) => {
    await render(`
      <m3e-swipe-reveal-group stagger="0.5">
        ${item("a")}${item("b", 'dismissible="trailing"')}${item("c")}
      </m3e-swipe-reveal-group>
    `);
    await call(page, "b", "dismiss", "trailing");
    await expect.poll(() => state(page, "b")).toBe("dismissed");
    const before = await left(page, "c");

    await press(page, "a", -70);

    // With b skipped, c is the nearest sibling and follows by the full amount.
    await expect.poll(async () => before - (await left(page, "c"))).toBeGreaterThan(25);
    await page.mouse.up();
  });
});

test.describe("m3e-swipe-reveal triggers", () => {
  test("a double tap reveals only when double-tap is enabled", async ({ page, render }) => {
    await render(item("a", 'triggers="double-tap"'));

    await page.locator("#a").click();
    await page.waitForTimeout(600);
    expect(await state(page, "a")).toBe("covered");

    await page.locator("#a").dblclick();
    await expect.poll(() => state(page, "a")).toBe("revealed");
  });

  test("a long press reveals while still pressed and the release does not close it", async ({ page, render }) => {
    await render(item("a", 'triggers="long-press tap"'));
    const box = (await page.locator("#a").boundingBox())!;

    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect.poll(() => state(page, "a")).toBe("revealed");
    await page.mouse.up();
    await page.waitForTimeout(200);

    expect(await state(page, "a")).toBe("revealed");
  });

  test("a short press does not long-press reveal", async ({ page, render }) => {
    await render(item("a", 'triggers="long-press"'));

    await page.locator("#a").click();
    await page.waitForTimeout(300);

    expect(await state(page, "a")).toBe("covered");
  });
});

test.describe("m3e-swipe-reveal stagger", () => {
  const list = (attrs: string) => `
    <m3e-swipe-reveal-group ${attrs}>${["a", "b", "c", "d"].map((id) => item(id)).join("")}</m3e-swipe-reveal-group>
  `;

  test("siblings follow the drag, tapering with distance and stopping at stagger-count", async ({ page, render }) => {
    await render(list('stagger="0.5" stagger-count="2"'));
    const before = {
      b: await left(page, "b"),
      c: await left(page, "c"),
      d: await left(page, "d"),
    };

    await press(page, "a", -70);

    await expect.poll(async () => before.b - (await left(page, "b"))).toBeGreaterThan(10);
    const b = before.b - (await left(page, "b"));
    const c = before.c - (await left(page, "c"));
    expect(c).toBeGreaterThan(3);
    expect(b).toBeGreaterThan(c);
    expect(await left(page, "d")).toBeCloseTo(before.d, 0);
    await page.mouse.up();
  });

  test("siblings return to rest after release", async ({ page, render }) => {
    await render(list('stagger="0.5"'));
    const before = await left(page, "b");

    await press(page, "a", -70);
    await expect.poll(async () => before - (await left(page, "b"))).toBeGreaterThan(10);
    await page.mouse.up();

    await expect.poll(async () => Math.abs((await left(page, "b")) - before)).toBeLessThan(1);
    expect(await page.locator("#b").evaluate((el) => el.hasAttribute("popover"))).toBe(false);
  });

  test("siblings do not move when stagger is 0", async ({ page, render }) => {
    await render(list(""));
    const before = await left(page, "b");

    await press(page, "a", -70);
    await page.waitForTimeout(300);

    expect(await left(page, "b")).toBeCloseTo(before, 0);
    await page.mouse.up();
  });
});

test.describe("m3e-swipe-reveal overshoot", () => {
  const shift = async (page: Page, id: string, from: number) =>
    from -
    (await page
      .locator(`#${id}`)
      .evaluate((el) => el.shadowRoot!.querySelector(".content")!.getBoundingClientRect().left));

  const actionsWidth = (page: Page, id: string) =>
    page
      .locator(`#${id}`)
      .evaluate((el) => el.shadowRoot!.querySelector<HTMLElement>(".trailing")!.getBoundingClientRect().width);

  test("content cannot be dragged far past the actions", async ({ page, render }) => {
    await render(item("a"));
    const from = await left(page, "a");
    // The actions include their padding; the default overshoot is 8px.
    const width = await actionsWidth(page, "a");

    await press(page, "a", -300);

    await expect.poll(() => shift(page, "a", from)).toBeGreaterThan(width + 4);
    expect(await shift(page, "a", from)).toBeLessThan(width + 8.5);
    await page.mouse.up();
  });

  test("overshoot of 0 stops the content at the actions", async ({ page, render }) => {
    await render(item("a", 'overshoot="0"'));
    const from = await left(page, "a");
    const width = await actionsWidth(page, "a");

    await press(page, "a", -300);

    await expect.poll(() => shift(page, "a", from)).toBeGreaterThan(width - 2);
    expect(await shift(page, "a", from)).toBeLessThan(width + 0.5);
    await page.mouse.up();
  });
});
