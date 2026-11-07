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

  test("a single touch movement begins and completes a swipe", async ({ page, render }) => {
    await render(`<m3e-swipe-reveal id="a" style="width: 400px">
      <button slot="leading" style="width: 80px; height: 56px">Pin</button>
      <button id="child" style="width: 400px; height: 56px">Content</button>
    </m3e-swipe-reveal>`);
    await page.locator("#child").evaluate((el) => {
      el.addEventListener("pointerdown", (event) => {
        el.setAttribute("data-pointer-id", String((event as PointerEvent).pointerId));
      });
    });
    const box = (await page.locator("#a").boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 100, y }] });
    await expect.poll(() => state(page, "a")).toBe("revealing");
    const pointerId = Number(await page.locator("#child").getAttribute("data-pointer-id"));
    expect(
      await page.locator("#a").evaluate((el, id) => el.shadowRoot!.querySelector(".content")!.hasPointerCapture(id), pointerId),
    ).toBe(true);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => state(page, "a")).toBe("revealed");
    await cdp.detach();
  });

  test("a horizontal touch drag continues when reversed with slight vertical movement", async ({ page, render }) => {
    await render(item("a"));
    const box = (await page.locator("#a").boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 40, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 50, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 15, y: y + 20 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x + 65, y: y + 20 }] });
    expect(await state(page, "a")).toBe("revealing");
    await expect
      .poll(() =>
        page.locator("#a").evaluate((el) => {
          const content = el.shadowRoot!.querySelector<HTMLElement>(".content")!;
          return new DOMMatrixReadOnly(getComputedStyle(content).transform).m41;
        }),
      )
      .toBeGreaterThan(50);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => state(page, "a")).toBe("revealed");
    await cdp.detach();
  });

  test("touch taps reach content and vertical gestures scroll without revealing", async ({ page, render }) => {
    await render(`<div id="scroller" style="height: 150px; overflow: auto">
      <div style="height: 700px">
        <m3e-swipe-reveal id="a" style="width: 300px">
          <button slot="leading">Action</button>
          <button id="child" style="width: 200px; height: 56px">Content</button>
        </m3e-swipe-reveal>
      </div>
    </div>`);
    await page.locator("#child").evaluate((el) => {
      el.addEventListener("click", () => el.setAttribute("data-clicked", "true"));
    });
    const box = (await page.locator("#child").boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(page.locator("#child")).toHaveAttribute("data-clicked", "true");

    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 45 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 75 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => page.locator("#scroller").evaluate((el) => el.scrollTop)).toBeGreaterThan(0);
    expect(await state(page, "a")).toBe("covered");
    await cdp.detach();
  });

  test("suppresses the content tap highlight without disabling selection or focus", async ({ page, render }) => {
    await render(`<m3e-swipe-reveal id="a">
      <button slot="leading">Action</button>
      <a href="#target">Selectable content</a>
    </m3e-swipe-reveal>`);

    const styles = await page.locator("#a").evaluate((el) => {
      const content = el.shadowRoot!.querySelector<HTMLElement>(".content")!;
      const link = el.querySelector("a")!;
      return {
        contentHighlight: getComputedStyle(content).getPropertyValue("-webkit-tap-highlight-color"),
        linkHighlight: getComputedStyle(link).getPropertyValue("-webkit-tap-highlight-color"),
        selection: getComputedStyle(link).userSelect,
      };
    });
    expect(styles.contentHighlight).toBe("rgba(0, 0, 0, 0)");
    expect(styles.linkHighlight).toBe("rgba(0, 0, 0, 0)");
    expect(styles.selection).not.toBe("none");
    await page.keyboard.press("Tab");
    await expect(page.locator("#a a")).toBeFocused();
  });

  test("reveal() reveals the requested side", async ({ page, render }) => {
    await render(item("a"));
    await events(page, "a", ["revealing", "revealed"]);

    await call(page, "a", "reveal", "trailing");

    await expect.poll(() => state(page, "a")).toBe("revealed");
    expect(await side(page, "a")).toBe("trailing");
    expect(await log(page)).toEqual(["revealing", "revealed"]);
  });

  test("only the revealed side's actions are focusable", async ({ page, render }) => {
    await render(item("a"));

    const canFocus = (slot: Side) =>
      page.locator(`#a button[slot="${slot}"]`).evaluate((button) => {
        button.focus();
        return document.activeElement === button;
      });

    await call(page, "a", "reveal", "leading");
    await expect.poll(() => state(page, "a")).toBe("revealed");

    expect(await canFocus("leading")).toBe(true);
    expect(await canFocus("trailing")).toBe(false);

    await call(page, "a", "reveal", "trailing");
    await expect.poll(() => side(page, "a")).toBe("trailing");
    await expect.poll(() => state(page, "a")).toBe("revealed");

    expect(await canFocus("leading")).toBe(false);
    expect(await canFocus("trailing")).toBe(true);
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

  for (const scroller of ["window", "element", "shadow"] as const) {
    for (const positioning of ["anchor", "fallback"] as const) {
      test(`syncs promoted content during ${scroller} scrolling while revealing and revealed (${positioning})`, async ({
        page,
        render,
      }) => {
        if (positioning === "fallback") {
          await page.evaluate(() => {
            const supports = CSS.supports.bind(CSS);
            Object.defineProperty(CSS, "supports", {
              value: (property: string, value: string) =>
                property === "position-anchor" ? false : supports(property, value),
            });
          });
        }
        const contents = `<div style="width: 900px; height: 900px; padding: 80px; box-sizing: border-box">${item("a")}</div>`;
        await render(
          scroller === "window"
            ? contents
            : `<div id="host"><div id="scroller" style="width: 300px; height: 200px; overflow: auto">${contents}</div></div>`,
        );

        if (scroller === "shadow") {
          await page.locator("#host").evaluate((host) => {
            const root = host.attachShadow({ mode: "open" });
            root.append(...host.childNodes);
          });
        }

        const scroll = (offset: number, reveal = false) =>
          page.evaluate(
            async ({ kind, offset, reveal }) => {
              const root = kind === "shadow" ? document.querySelector("#host")!.shadowRoot! : document;
              const item = root.querySelector("#a") as M3eSwipeRevealElement;
              const content = item.shadowRoot!.querySelector<HTMLElement>(".content")!;
              const placeholder = item.shadowRoot!.querySelector<HTMLElement>(".placeholder")!;
              const element = root.querySelector<HTMLElement>("#scroller");
              const target = kind === "window" ? document : element!;

              const sample = new Promise<{
                state: string;
                top: number;
                left: number;
                scrollTop: number;
                anchor: string;
                eventTop: number;
              }>((resolve) => {
                target.addEventListener(
                  "scroll",
                  async () => {
                    const state = item.state;
                    const eventTop = content.getBoundingClientRect().top - placeholder.getBoundingClientRect().top;
                    await new Promise(requestAnimationFrame);
                    await new Promise(requestAnimationFrame);
                    const bounds = placeholder.getBoundingClientRect();
                    resolve({
                      state,
                      top: content.getBoundingClientRect().top - bounds.top,
                      left:
                        content.getBoundingClientRect().left -
                        bounds.left -
                        new DOMMatrixReadOnly(getComputedStyle(content).transform).m41,
                      scrollTop: kind === "window" ? window.scrollY : element!.scrollTop,
                      anchor: content.style.getPropertyValue("position-anchor"),
                      eventTop,
                    });
                  },
                  { once: true },
                );
              });

              if (reveal) {
                item.reveal("leading");
                await new Promise(requestAnimationFrame);
              }
              if (kind === "window") window.scrollTo(offset, offset);
              else element!.scrollTo(offset, offset);
              return sample;
            },
            { kind: scroller, offset, reveal },
          );

        const revealing = await scroll(40, true);
        expect(revealing.state).toBe("revealing");
        if (positioning === "anchor") expect(revealing.anchor).toMatch(/^--m3e-placeholder-\d+$/);
        else expect(revealing.anchor).toBe("");
        expect(revealing.scrollTop).toBe(40);
        expect(Math.abs(revealing.top)).toBeLessThan(0.5);
        expect(Math.abs(revealing.left)).toBeLessThan(0.5);
        if (positioning === "fallback") expect(Math.abs(revealing.eventTop)).toBeLessThan(0.5);

        await expect.poll(() => state(page, "a")).toBe("revealed");
        const revealed = await scroll(70);
        expect(revealed.state).toBe("revealed");
        expect(revealed.scrollTop).toBe(70);
        expect(Math.abs(revealed.top)).toBeLessThan(0.5);
        expect(Math.abs(revealed.left)).toBeLessThan(0.5);
        if (positioning === "fallback") expect(Math.abs(revealed.eventTop)).toBeLessThan(0.5);
      });
    }
  }

  test("anchors independently revealed items to their own placeholders", async ({ page, render }) => {
    await render(`<div id="one" style="height: 150px; overflow: auto">
      <div style="height: 500px; padding-top: 40px">${item("a")}</div></div>
      <div id="two" style="height: 150px; overflow: auto">
      <div style="height: 500px; padding-top: 60px">${item("b")}</div></div>`);
    await call(page, "a", "reveal", "leading");
    await call(page, "b", "reveal", "trailing");
    await expect.poll(() => state(page, "a")).toBe("revealed");
    await expect.poll(() => state(page, "b")).toBe("revealed");
    await page.locator("#one").evaluate((el) => (el.scrollTop = 25));
    await page.locator("#two").evaluate((el) => (el.scrollTop = 45));
    await page.evaluate(async () => {
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
    });

    for (const id of ["a", "b"]) {
      const offset = await page.locator(`#${id}`).evaluate((el) => {
        const content = el.shadowRoot!.querySelector<HTMLElement>(".content")!;
        const placeholder = el.shadowRoot!.querySelector<HTMLElement>(".placeholder")!;
        return content.getBoundingClientRect().top - placeholder.getBoundingClientRect().top;
      });
      expect(Math.abs(offset)).toBeLessThan(0.5);
    }
  });

  test("anchors content when revealed after scrolling", async ({ page, render }) => {
    await render(`<div id="scroller" style="height: 150px; overflow: auto">
      <div style="height: 500px; padding-top: 100px">${item("a")}</div></div>`);
    await page.locator("#scroller").evaluate((el) => (el.scrollTop = 40));
    await call(page, "a", "reveal", "leading");
    await expect.poll(() => state(page, "a")).toBe("revealed");
    const offset = await page.locator("#a").evaluate((el) => {
      const content = el.shadowRoot!.querySelector<HTMLElement>(".content")!;
      const placeholder = el.shadowRoot!.querySelector<HTMLElement>(".placeholder")!;
      return content.getBoundingClientRect().top - placeholder.getBoundingClientRect().top;
    });
    expect(Math.abs(offset)).toBeLessThan(0.5);
  });

  for (const positioning of ["anchor", "fallback"] as const) {
    test(`syncs promoted content and staggered siblings when scrolling a shadow root during a drag (${positioning})`, async ({
      page,
      render,
    }) => {
      if (positioning === "fallback") {
        await page.evaluate(() => {
          const supports = CSS.supports.bind(CSS);
          Object.defineProperty(CSS, "supports", {
            value: (property: string, value: string) =>
              property === "position-anchor" ? false : supports(property, value),
          });
        });
      }
      await render(`<div id="host"><div id="scroller" style="width: 500px; height: 200px; overflow: auto">
      <div style="height: 800px; padding-top: 40px">
        <m3e-swipe-reveal-group stagger="0.5">${item("a")}${item("b")}</m3e-swipe-reveal-group>
      </div>
    </div></div>`);
      await page.locator("#host").evaluate((host) => {
        const root = host.attachShadow({ mode: "open" });
        root.append(...host.childNodes);
      });

      await press(page, "a", 100);
      await page.evaluate(() => new Promise(requestAnimationFrame));
      const offsets = await page.locator("#host").evaluate(async (host) => {
        const root = host.shadowRoot!;
        const scroller = root.querySelector<HTMLElement>("#scroller")!;
        const item = root.querySelector("#a")!;
        const sibling = root.querySelector<HTMLElement>("#b")!;
        const content = item.shadowRoot!.querySelector<HTMLElement>(".content")!;
        const placeholder = item.shadowRoot!.querySelector<HTMLElement>(".placeholder")!;
        const spacer = sibling.previousElementSibling!;

        const sample = new Promise<{
          content: number;
          sibling: number;
          promoted: boolean;
        }>((resolve) => {
          scroller.addEventListener(
            "scroll",
            async () => {
              await new Promise(requestAnimationFrame);
              await new Promise(requestAnimationFrame);
              resolve({
                content: content.getBoundingClientRect().top - placeholder.getBoundingClientRect().top,
                sibling: sibling.getBoundingClientRect().top - spacer.getBoundingClientRect().top,
                promoted: sibling.matches(":popover-open"),
              });
            },
            { once: true },
          );
        });
        scroller.scrollTop = 30;
        return sample;
      });
      expect(offsets.promoted).toBe(true);
      expect(Math.abs(offsets.content)).toBeLessThan(0.5);
      expect(Math.abs(offsets.sibling)).toBeLessThan(0.5);
      await page.mouse.up();
    });
  }

  test("releases staggered siblings when the dragged item is removed", async ({ page, render }) => {
    await render(`<m3e-swipe-reveal-group stagger="0.5">${item("a")}${item("b")}</m3e-swipe-reveal-group>`);
    await press(page, "a", 100);
    expect(await page.locator("#b").evaluate((el) => el.matches(":popover-open"))).toBe(true);

    await page.locator("#a").evaluate((el) => el.remove());

    const sibling = page.locator("#b");
    expect(await sibling.evaluate((el) => el.matches(":popover-open"))).toBe(false);
    expect(await sibling.evaluate((el) => el.previousElementSibling)).toBeNull();
    expect(await sibling.getAttribute("style")).toBe("display: block; width: 400px");
    await page.mouse.up();
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

  test("a paused drag below the dismiss threshold does not dismiss after a fast final movement", async ({
    page,
    render,
  }) => {
    await render(item("a", 'dismissible="trailing"'));
    await page.locator("#a").evaluate((el) => {
      const content = el.shadowRoot!.querySelector<HTMLElement>(".content")!;
      content.setPointerCapture = () => {};
      content.hasPointerCapture = () => false;
      const dispatch = (type: string, x: number, timestamp: number) => {
        const event = new PointerEvent(type, {
          bubbles: true,
          pointerId: 1,
          pointerType: "touch",
          button: 0,
          buttons: type === "pointerup" ? 0 : 1,
          clientX: x,
          clientY: 28,
        });
        Object.defineProperty(event, "timeStamp", { value: timestamp });
        content.dispatchEvent(event);
      };
      dispatch("pointerdown", 200, 1000);
      dispatch("pointermove", 80, 1040);
      dispatch("pointermove", 50, 1080);
      dispatch("pointerup", 50, 1330);
    });

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

  test("an item dragged open beside a revealed sibling stays open on release", async ({ page, render }) => {
    await render(list('stagger="0.5"'));
    await press(page, "a", -120);
    await page.mouse.up();
    await expect.poll(() => state(page, "a")).toBe("revealed");

    const rest = await left(page, "b");
    await press(page, "b", -200);
    await page.mouse.up();
    await expect.poll(() => state(page, "a")).toBe("covered");
    await expect.poll(() => state(page, "b")).toBe("revealed");
    await page.waitForTimeout(800);
    expect(await state(page, "b")).toBe("revealed");
    expect(
      rest -
        (await page
          .locator("#b")
          .evaluate((el) => el.shadowRoot!.querySelector(".content")!.getBoundingClientRect().left)),
    ).toBeGreaterThan(40);
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

test.describe("m3e-swipe-reveal elastic", () => {
  const trailingWidth = (page: Page, id: string) =>
    page
      .locator(`#${id}`)
      .evaluate((el) => el.shadowRoot!.querySelector<HTMLElement>(".trailing")!.getBoundingClientRect().width);

  const buttonWidth = (page: Page, id: string, slot: Side) =>
    page.locator(`#${id} [slot=${slot}]`).evaluate((el) => el.getBoundingClientRect().width);

  test("defaults to both and inherits from the group", async ({ page, render }) => {
    await render(
      `<m3e-swipe-reveal-group elastic="leading">${item("a")}${item("b", 'elastic="none"')}</m3e-swipe-reveal-group>${item("c")}`,
    );
    const read = (id: string) => page.locator(`#${id}`).evaluate((el) => (el as M3eSwipeRevealElement).elastic);
    expect(await read("a")).toBe("leading");
    expect(await read("b")).toBe("none");
    expect(await read("c")).toBe("both");
  });

  test("dismissible defaults to none", async ({ page, render }) => {
    await render(item("a"));
    expect(await page.locator("#a").evaluate((el) => (el as M3eSwipeRevealElement).dismissible)).toBe("none");
  });

  test("elastic buttons squish while partially revealed", async ({ page, render }) => {
    await render(`
      <m3e-swipe-reveal id="a" style="display: block; width: 400px">
        <m3e-icon-button slot="trailing" id="b"><m3e-icon name="delete"></m3e-icon></m3e-icon-button>
        <div style="height: 56px; background: white">Content</div>
      </m3e-swipe-reveal>
    `);
    const natural = await buttonWidth(page, "a", "trailing");
    await press(page, "a", -20);
    await expect.poll(() => buttonWidth(page, "a", "trailing")).toBeLessThan(natural - 4);
    await page.mouse.up();
  });

  test("buttons keep their size when elastic is none", async ({ page, render }) => {
    await render(item("a", 'elastic="none"'));
    await press(page, "a", -40);
    await page.waitForTimeout(200);
    expect(await buttonWidth(page, "a", "trailing")).toBe(80);
    await page.mouse.up();
  });

  test("the container does not grow with overshoot when elastic is none", async ({ page, render }) => {
    await render(item("a", 'elastic="none"'));
    const rest = await trailingWidth(page, "a");
    await press(page, "a", -300);
    await page.waitForTimeout(200);
    expect(await trailingWidth(page, "a")).toBe(rest);
    await page.mouse.up();
  });

  test("elastic applies per side", async ({ page, render }) => {
    await render(item("a", 'elastic="leading"'));
    await press(page, "a", -40);
    await page.waitForTimeout(200);
    expect(await buttonWidth(page, "a", "trailing")).toBe(80);
    await page.mouse.up();
  });
});

test.describe("m3e-swipe-reveal underlap", () => {
  test("reserves the underlap beneath the content without adding to the reveal distance", async ({ page, render }) => {
    await render(item("a", 'style="--m3e-swipe-reveal-actions-underlap: 12px; width: 400px"'));
    await call(page, "a", "reveal", "trailing");
    await expect.poll(() => state(page, "a")).toBe("revealed");

    const info = await page.locator("#a").evaluate((el) => {
      const trailing = el.shadowRoot!.querySelector<HTMLElement>(".trailing")!;
      const content = el.shadowRoot!.querySelector<HTMLElement>(".content")!;
      return {
        width: trailing.getBoundingClientRect().width,
        margin: getComputedStyle(trailing).marginInlineStart,
        offset: content.getBoundingClientRect().left - el.getBoundingClientRect().left,
      };
    });
    expect(parseFloat(info.margin)).toBe(12);
    expect(Math.abs(info.offset)).toBeCloseTo(info.width - 12, 0);
  });
});
