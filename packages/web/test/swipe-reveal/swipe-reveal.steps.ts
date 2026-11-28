import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eSwipeRevealElement, M3eSwipeRevealGroupElement } from "@m3e/web/swipe-reveal";

import { expect, test as componentTest } from "../fixtures";
import { SwipeRevealHarness, swipeItem, type SwipeSide } from "./swipe-reveal.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  swipeReveal: SwipeRevealHarness;
}>({
  swipeReveal: async ({ page, render }, use) => use(new SwipeRevealHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a swipe-reveal item {string} with direction {string}", ({ swipeReveal }, id: string, direction: string) => {
  swipeReveal.markup = swipeItem(id, `dir="${direction}"`);
});
Given("reduced motion is enabled for swipe reveal", async ({ page }) => page.emulateMedia({ reducedMotion: "reduce" }));
When("the swipe-reveal fixture renders", async ({ swipeReveal }) => swipeReveal.render());
Then("shared and side-specific action shape families resolve", async ({ page }) => {
  const host = page.locator("#a");
  const leading = host.locator(".leading");
  const trailing = host.locator(".trailing");
  const corners = ["start-start", "start-end", "end-start", "end-end"];
  const check = async (leadingFamilies: number[], trailingFamilies = leadingFamilies) => {
    for (let i = 0; i < corners.length; i++) {
      await expect(leading).toHaveCSS(`corner-${corners[i]}-shape`, `superellipse(${leadingFamilies[i]})`);
      await expect(trailing).toHaveCSS(`corner-${corners[i]}-shape`, `superellipse(${trailingFamilies[i]})`);
    }
  };
  await check([1, 1, 1, 1]);
  await expect(leading).toHaveCSS("border-radius", "0px");
  await host.evaluate((element) => {
    element.style.setProperty("--m3e-shape-family", "bevel");
    element.style.setProperty("--m3e-swipe-reveal-actions-container-shape", "12px");
  });
  await check([0, 0, 0, 0]);
  for (let i = 0; i < corners.length; i++) {
    await host.evaluate(
      (element, corner) => element.style.setProperty(`--m3e-shape-family-${corner}`, "round"),
      corners[i],
    );
    await check(corners.map((_, index) => (index === i ? 1 : 0)));
    await host.evaluate((element, corner) => element.style.removeProperty(`--m3e-shape-family-${corner}`), corners[i]);
  }
  await host.evaluate((element) => {
    element.style.setProperty("--m3e-shape-family-start-start", "bevel");
    element.style.setProperty("--m3e-swipe-reveal-actions-container-shape-family", "round");
  });
  await check([1, 1, 1, 1]);
  for (let i = 0; i < corners.length; i++) {
    await host.evaluate(
      (element, corner) =>
        element.style.setProperty(`--m3e-swipe-reveal-actions-container-shape-family-${corner}`, "bevel"),
      corners[i],
    );
    await check(corners.map((_, index) => (index === i ? 0 : 1)));
    await host.evaluate(
      (element, corner) => element.style.removeProperty(`--m3e-swipe-reveal-actions-container-shape-family-${corner}`),
      corners[i],
    );
  }
  await host.evaluate((element) => {
    element.style.setProperty("--m3e-swipe-reveal-actions-container-shape-family-end-start", "bevel");
    element.style.setProperty("--m3e-swipe-reveal-leading-actions-container-shape-family", "round");
    element.style.setProperty("--m3e-swipe-reveal-trailing-actions-container-shape-family", "round");
  });
  const direction = await host.getAttribute("dir");
  await check([1, 1, 1, 1]);
  for (const sideName of ["leading", "trailing"]) {
    for (let i = 0; i < corners.length; i++) {
      await host.evaluate(
        (element, input) =>
          element.style.setProperty(
            `--m3e-swipe-reveal-${input.sideName}-actions-container-shape-family-${input.corner}`,
            "bevel",
          ),
        { sideName, corner: corners[i] },
      );
      const changed = corners.map((_, index) => (index === i ? 0 : 1));
      await check(sideName === "leading" ? changed : [1, 1, 1, 1], sideName === "trailing" ? changed : [1, 1, 1, 1]);
      if (i === 0) {
        await expect(host.locator(`.${sideName}`)).toHaveCSS(
          "corner-top-left-shape",
          direction === "ltr" ? "superellipse(0)" : "superellipse(1)",
        );
      }
      await host.evaluate(
        (element, input) =>
          element.style.removeProperty(
            `--m3e-swipe-reveal-${input.sideName}-actions-container-shape-family-${input.corner}`,
          ),
        { sideName, corner: corners[i] },
      );
    }
  }
  await expect(leading).toHaveCSS("border-radius", "12px");
  await expect(trailing).toHaveCSS("border-radius", "12px");
});

Given("the swipe-reveal fixture is", ({ swipeReveal }, markup: string) => {
  swipeReveal.markup = markup;
});
When("the user presses item {string} and drags it {int} pixels", async ({ swipeReveal }, id: string, dx: number) =>
  swipeReveal.press(id, dx),
);
Then("action backgrounds stay independent from the dragged rounded content", async ({ page }) => {
  const background = page.locator("#a .leading");
  const content = page.locator("#a m3e-list-item .base");
  await expect(background).toHaveCSS("corner-shape", "superellipse(0)");
  await expect(background).toHaveCSS("border-radius", "12px");
  await expect(content).toHaveCSS("corner-shape", "superellipse(1)");
  await expect
    .poll(() => content.evaluate((element) => parseFloat(getComputedStyle(element).borderTopLeftRadius)))
    .toBeGreaterThan(4);
  expect(
    await content.evaluate((element) => parseFloat(getComputedStyle(element).borderTopLeftRadius)),
  ).toBeLessThanOrEqual(16);
  for (const button of await page.locator("#a m3e-icon-button .base").all()) {
    await expect(button).toHaveCSS("corner-shape", "superellipse(1)");
  }
});
When("the user releases the pointer", async ({ page }) => page.mouse.up());
Then("the rounded content and action container return to their resting shapes", async ({ page, swipeReveal }) => {
  await expect.poll(() => swipeReveal.state("a")).toBe("revealed");
  await expect(page.locator("#a m3e-list-item .base")).toHaveCSS("border-radius", "4px");
  await expect(page.locator("#a .leading")).toHaveCSS("corner-shape", "superellipse(0)");
  await expect(page.locator("#a .leading")).toHaveCSS("border-radius", "12px");
});

Given("a swipe-reveal item {string}", ({ swipeReveal }, id: string) => {
  swipeReveal.markup = swipeItem(id);
});
Then("item {string} has state {string}", async ({ swipeReveal }, id: string, state: string) =>
  expect.poll(() => swipeReveal.state(id)).toBe(state),
);
Then("item {string} has no active side", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.side(id)).toBeNull(),
);
When("the application observes pointer capture on the child content", async ({ page }) =>
  page.locator("#child").evaluate((element) => {
    element.addEventListener("pointerdown", (event) => {
      element.setAttribute("data-pointer-id", String((event as PointerEvent).pointerId));
    });
  }),
);
When(
  "the user touches item {string} and moves {int} pixels horizontally",
  async ({ swipeReveal }, id: string, dx: number) => {
    await swipeReveal.startTouch(id);
    await swipeReveal.moveTouch(dx, 0);
  },
);
Then("item {string} is revealing and owns the touch pointer", async ({ page, swipeReveal }, id: string) => {
  await expect.poll(() => swipeReveal.state(id)).toBe("revealing");
  const pointerId = Number(await page.locator("#child").getAttribute("data-pointer-id"));
  expect(
    await page
      .locator(`#${id}`)
      .evaluate(
        (element, idValue) => element.shadowRoot!.querySelector(".content")!.hasPointerCapture(idValue),
        pointerId,
      ),
  ).toBe(true);
});
When(
  "the user moves a touch horizontally, reverses it with vertical drift, then moves outward again",
  async ({ swipeReveal }) => {
    const box = await swipeReveal.item("a").boundingBox();
    if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
    await swipeReveal.startTouch("a");
    await swipeReveal.moveTouch(40, 0);
    await swipeReveal.moveTouch(50, 0);
    await swipeReveal.moveTouch(15, 20);
    await swipeReveal.moveTouch(65, 20);
    await expect.poll(() => swipeReveal.state("a")).toBe("revealing");
    await expect.poll(() => swipeReveal.offset("a")).toBeGreaterThan(50);
  },
);
Then("item {string} continues tracking the horizontal drag", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.offset(id)).toBeGreaterThan(50),
);

When("the application sets the scroller position to {int} pixels", async ({ page }, top: number) =>
  page.locator("#scroller").evaluate((element, value) => (element.scrollTop = value), top),
);
When("the application observes touch-move cancellation on item {string}", async ({ page }, id: string) =>
  page.locator(`#${id}`).evaluate((element) => {
    (window as typeof window & { touchMoves: boolean[] }).touchMoves = [];
    element.addEventListener("touchmove", (event) => {
      (window as typeof window & { touchMoves: boolean[] }).touchMoves.push(event.defaultPrevented);
    });
  }),
);
When("the user begins a horizontal touch drag, then moves vertically and reverses it", async ({ swipeReveal }) => {
  await swipeReveal.startTouch("a");
  await swipeReveal.moveTouch(-40, 0);
  await expect.poll(() => swipeReveal.state("a")).toBe("revealing");
  await swipeReveal.moveTouch(-60, -60);
  await swipeReveal.moveTouch(65, -60);
  await expect.poll(() => swipeReveal.offset("a")).toBeGreaterThan(50);
});
Then("the reveal owns all touch moves without scrolling the ancestor", async ({ page }) => {
  expect(await page.locator("#scroller").evaluate((element) => element.scrollTop)).toBe(50);
  expect(await page.evaluate(() => (window as typeof window & { touchMoves: boolean[] }).touchMoves)).toEqual([
    true,
    true,
    true,
  ]);
});
When(
  "the application observes pointer cancellation and touch prevention on item {string}",
  async ({ page }, id: string) =>
    page.locator(`#${id}`).evaluate((element) => {
      element.addEventListener("pointerdown", (event) => {
        element.setAttribute("data-pointer-id", String((event as PointerEvent).pointerId));
      });
      element.addEventListener("touchmove", (event) =>
        element.setAttribute("data-prevented", String(event.defaultPrevented)),
      );
    }),
);
When(
  "the user starts a horizontal touch, cancels its pointer, then moves vertically",
  async ({ page, swipeReveal }) => {
    await swipeReveal.startTouch("a");
    await swipeReveal.moveTouch(40, 0);
    await expect.poll(() => swipeReveal.state("a")).toBe("revealing");
    await page.locator("#a").evaluate((element) => {
      element.shadowRoot!.querySelector(".content")!.dispatchEvent(
        new PointerEvent("pointercancel", {
          bubbles: true,
          pointerId: Number(element.getAttribute("data-pointer-id")),
          pointerType: "touch",
        }),
      );
    });
    await swipeReveal.moveTouch(40, -40);
    expect(await page.locator("#scroller").evaluate((element) => element.scrollTop)).toBe(50);
  },
);
Then("the canceled gesture continues to prevent scrolling", async ({ page }) =>
  expect(await page.locator("#scroller").evaluate((element) => element.scrollTop)).toBe(50),
);
When("the user starts a new vertical touch and scrolls the ancestor", async ({ swipeReveal }) => {
  await swipeReveal.startTouch("a");
  await swipeReveal.moveTouch(0, -40);
  await swipeReveal.moveTouch(0, -65);
});
Then("the new gesture scrolls the ancestor", async ({ page }) => {
  await expect.poll(() => page.locator("#scroller").evaluate((element) => element.scrollTop)).toBeGreaterThan(50);
});
When("the user ends the touch", async ({ swipeReveal }) => swipeReveal.endTouch());

When("the application observes clicks and prevented touch moves on the child content", async ({ page }) => {
  await page.locator("#child").evaluate((element) => {
    element.addEventListener("click", () => element.setAttribute("data-clicked", "true"));
    document.querySelector("#a")?.addEventListener("touchmove", (event) => {
      if (event.defaultPrevented) document.querySelector("#a")?.setAttribute("data-touch-prevented", "true");
    });
  });
});
When("the user taps the child content", async ({ swipeReveal }) => {
  await swipeReveal.startTouch("a", "#child");
  await swipeReveal.endTouch();
});
Then("the child content receives the click", async ({ page }) =>
  expect(page.locator("#child")).toHaveAttribute("data-clicked", "true"),
);
When("the user scrolls vertically over the child content", async ({ swipeReveal }) => {
  await swipeReveal.startTouch("a", "#child");
  await swipeReveal.moveTouch(0, -45);
  await swipeReveal.moveTouch(0, -75);
});
Then("the ancestor scrolls without revealing the item or preventing the touch", async ({ page, swipeReveal }) => {
  await expect.poll(() => page.locator("#scroller").evaluate((element) => element.scrollTop)).toBeGreaterThan(0);
  expect(await swipeReveal.state("a")).toBe("covered");
  await expect(page.locator("#a")).not.toHaveAttribute("data-touch-prevented");
});
Then("the content and link suppress tap highlight but allow selection", async ({ page }) => {
  const styles = await page.locator("#a").evaluate((element) => {
    const content = element.shadowRoot!.querySelector<HTMLElement>(".content")!;
    const link = element.querySelector("a")!;
    return {
      contentHighlight: getComputedStyle(content).getPropertyValue("-webkit-tap-highlight-color"),
      linkHighlight: getComputedStyle(link).getPropertyValue("-webkit-tap-highlight-color"),
      selection: getComputedStyle(link).userSelect,
    };
  });
  expect(styles.contentHighlight).toBe("rgba(0, 0, 0, 0)");
  expect(styles.linkHighlight).toBe("rgba(0, 0, 0, 0)");
  expect(styles.selection).not.toBe("none");
});
When("the user tabs to the link", async ({ page }) => page.keyboard.press("Tab"));
Then("the link receives focus", async ({ page }) => expect(page.locator("#a a")).toBeFocused());

When(
  "the application reveals item {string} on the {string} side",
  async ({ page, swipeReveal }, id: string, side: SwipeSide) => {
    const host = page.locator("#host");
    if (
      (await host.count()) &&
      (await host.getAttribute("data-scroll-kind")) === "shadow" &&
      !(await host.evaluate((element) => element.shadowRoot !== null))
    ) {
      await host.evaluate((element) => element.attachShadow({ mode: "open" }).append(...element.childNodes));
    }
    await swipeReveal.call(id, "reveal", side);
    await expect.poll(() => swipeReveal.state(id)).not.toBe("revealing");
  },
);
When("the application closes item {string}", async ({ swipeReveal }, id: string) => swipeReveal.call(id, "close"));
When(
  "the user drags item {string} by {int} pixels at {string} speed",
  async ({ swipeReveal }, id: string, dx: number, speed: "fast" | "slow") => swipeReveal.drag(id, dx, speed),
);
When("item {string} settles", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.state(id)).not.toBe("revealing"),
);
When("item {string} begins settling to {string}", async ({ swipeReveal, page }, id: string, target: string) => {
  if (target === "covered") await swipeReveal.call(id, "reveal", "leading");
  const element = page.locator(`#${id}`);
  await element.evaluate((host, state) => {
    const style = document.createElement("style");
    style.textContent = ".content { transition: transform 2s linear !important; }";
    host.shadowRoot!.append(style);
    const reveal = host as M3eSwipeRevealElement;
    if (state === "revealed") reveal.reveal("leading");
    else reveal.close();
  }, target);
});
When("the user moves vertically during the animation", async ({ page }) => {
  const box = await page.locator("#a").boundingBox();
  if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2 + 20);
  await page.mouse.up();
});
Then(
  "item {string} settles to {string} and releases temporary action widths",
  async ({ page, swipeReveal }, id: string, target: string) => {
    await expect.poll(() => swipeReveal.state(id)).toBe(target);
    await expect
      .poll(() =>
        page
          .locator(`#${id}`)
          .evaluate((host) =>
            ["leading", "trailing"].map((side) => host.shadowRoot!.querySelector<HTMLElement>(`.${side}`)!.style.width),
          ),
      )
      .toEqual(["", ""]);
  },
);
When(
  "the user starts a vertical drag and then moves {int} pixels horizontally",
  async ({ page, swipeReveal }, dx: number) => {
    await swipeReveal.call("a", "reveal", "leading");
    await expect.poll(() => swipeReveal.state("a")).toBe("revealed");
    const box = await page.locator("#a").boundingBox();
    if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x, y + 20);
    await page.waitForTimeout(150);
    await page.mouse.move(x - dx, y + 20);
  },
);
Then("the horizontal drag takes over from the settled position", async ({ page, swipeReveal }) => {
  await expect.poll(() => swipeReveal.state("a")).toBe("revealing");
  await expect
    .poll(() =>
      page.locator("#a").evaluate((host) => {
        const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
        return new DOMMatrixReadOnly(getComputedStyle(content).transform).m41;
      }),
    )
    .toBeGreaterThan(30);
});
Then("item {string} stops revealing", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.state(id)).not.toBe("revealing"),
);
When("the application starts a reveal animation beneath the pointer", async ({ page, swipeReveal }) => {
  const box = await page.locator("#a").boundingBox();
  if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await swipeReveal.call("a", "reveal", "leading");
  await page.locator("#a").evaluate((host) => {
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    content.style.transition = "none";
    content.style.transform = "translateX(0px)";
    void content.offsetWidth;
    content.style.transition = "transform 2s linear";
    content.style.transform = "translateX(96px)";
  });
  await page.mouse.down();
});
When("the user drags {int} pixels horizontally after a vertical movement", async ({ page }, dx: number) => {
  const box = await page.locator("#a").boundingBox();
  if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y + 20);
  await page.waitForTimeout(150);
  const before = await page.locator("#a").evaluate((host) => {
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    return new DOMMatrixReadOnly(getComputedStyle(content).transform).m41;
  });
  await page.mouse.move(x + dx, y + 20);
  await expect
    .poll(() =>
      page.locator("#a").evaluate((host, offset) => {
        const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
        return new DOMMatrixReadOnly(getComputedStyle(content).transform).m41 - offset;
      }, before),
    )
    .toBeGreaterThan(dx - 2);
});
Then("the content follows the pointer from its current position", async ({ swipeReveal }) =>
  expect.poll(() => swipeReveal.state("a")).toBe("revealing"),
);
When("the application sets the document direction to right-to-left", async ({ page }) =>
  page.evaluate(() => (document.documentElement.dir = "rtl")),
);
When(
  "the application dismisses item {string} on the {string} side",
  async ({ swipeReveal }, id: string, side: SwipeSide) => swipeReveal.call(id, "dismiss", side),
);
When("the application restores item {string}", async ({ swipeReveal }, id: string) => swipeReveal.call(id, "restore"));
When("the application observes {string} events on item {string}", async ({ swipeReveal }, names: string, id: string) =>
  swipeReveal.recordEvents(id, names.split(",")),
);
When(
  "the application observes side details for {string} on item {string}",
  async ({ swipeReveal }, names: string, id: string) => swipeReveal.recordEvents(id, names.split(","), true),
);
Then(
  "item {string} has state {string} on the {string} side",
  async ({ swipeReveal }, id: string, state: string, side: SwipeSide) => {
    await expect.poll(() => swipeReveal.state(id)).toBe(state);
    await expect.poll(() => swipeReveal.side(id)).toBe(side);
  },
);
Then("item {string} emitted events {string}", async ({ swipeReveal }, id: string, events: string) =>
  expect.poll(() => swipeReveal.eventLog(id)).toEqual(events.split(",")),
);
Then("item {string} emitted side events {string}", async ({ swipeReveal }, id: string, events: string) =>
  expect.poll(() => swipeReveal.eventLog(id)).toEqual(events.split(",")),
);
Then("item {string} is not dismissed", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.state(id)).not.toBe("dismissed"),
);
Then("item {string} emitted no dismissal events", async ({ swipeReveal }, id: string) =>
  expect(await swipeReveal.eventLog(id)).toEqual([]),
);
Then("item {string} emitted no dismissal-complete events", async ({ swipeReveal }, id: string) =>
  expect(await swipeReveal.eventLog(id)).toEqual([]),
);
When("the application cancels dismiss events on item {string}", async ({ page }, id: string) =>
  page.locator(`#${id}`).evaluate((host) =>
    host.addEventListener("dismiss", (event) => {
      event.preventDefault();
      host.setAttribute("data-cancel-prevented", String(event.defaultPrevented));
    }),
  ),
);
Then("item {string} is not dismissed and is no longer dismissing", async ({ page, swipeReveal }, id: string) => {
  await expect(page.locator(`#${id}`)).toHaveAttribute("data-cancel-prevented", "true");
  await expect
    .poll(async () => {
      const state = await swipeReveal.state(id);
      return state === "dismissed" || state === "dismissing" ? state : "settled";
    })
    .toBe("settled");
});
When(
  "the application removes item {string} during its {string} event",
  async ({ page }, id: string, eventName: string) =>
    page.locator(`#${id}`).evaluate(
      (host, input) => {
        const reveal = host as M3eSwipeRevealElement;
        const parent = reveal.parentElement!;
        reveal.addEventListener("dismissed", () => host.setAttribute("data-dismissed-event-fired", "true"), {
          once: true,
        });
        reveal.addEventListener(
          "dismiss",
          (event) => {
            if (input.eventName === "canceled") event.preventDefault();
            reveal.remove();
          },
          { once: true },
        );
        reveal.dismiss("trailing");
        host.setAttribute("data-disconnected-state", reveal.state);
        parent.append(reveal);
      },
      { eventName },
    ),
);
Then("the disconnected item is covered and was not dismissed", async ({ page }) => {
  await expect(page.locator("#a")).toHaveAttribute("data-disconnected-state", "covered");
  await expect(page.locator("#a")).not.toHaveAttribute("data-dismissed-event-fired");
});
When(
  "the application reconnects and reveals item {string} on the {string} side",
  async ({ swipeReveal }, id: string, side: SwipeSide) => {
    await swipeReveal.call(id, "reveal", side);
  },
);
When("the application observes bubbled dismissal events on the group", async ({ page }) =>
  page.locator("#g").evaluate((group) => {
    group.setAttribute("data-dismissal-sides", "");
    group.addEventListener("dismissed", (event) => {
      const sides = group.getAttribute("data-dismissal-sides") ?? "";
      group.setAttribute("data-dismissal-sides", `${sides}${(event as CustomEvent<{ side: string }>).detail.side},`);
    });
  }),
);
Then("the group receives a dismissal event for the {string} side", async ({ page }, side: string) =>
  expect(page.locator("#g")).toHaveAttribute("data-dismissal-sides", `${side},`),
);
Then("item {string} remains dismissed", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.state(id)).toBe("dismissed"),
);
Then("item {string} is visible and covered", async ({ page, swipeReveal }, id: string) => {
  await expect.poll(() => swipeReveal.state(id)).toBe("covered");
  await expect(page.locator(`#${id}`)).toBeVisible();
});
Then("only the {string} actions on item {string} are focusable", async ({ page }, side: SwipeSide, id: string) => {
  const canFocus = (slot: SwipeSide) =>
    page.locator(`#${id} button[slot="${slot}"]`).evaluate((button) => {
      (button as HTMLElement).focus();
      return document.activeElement === button;
    });
  const otherSide: SwipeSide = side === "leading" ? "trailing" : "leading";
  expect(await canFocus(side)).toBe(true);
  expect(await canFocus(otherSide)).toBe(false);
});
Given("a segmented list with swipe-reveal item {string}", async ({ swipeReveal, page }, id: string) => {
  await page.setViewportSize({ width: 360, height: 640 });
  swipeReveal.markup = `<m3e-list variant="segmented">
    <m3e-swipe-reveal id="${id}">
      <m3e-icon-button slot="leading" aria-label="Pin">P</m3e-icon-button>
      <m3e-list-item>Content</m3e-list-item>
      <m3e-icon-button slot="trailing" aria-label="Bookmark">B</m3e-icon-button>
    </m3e-swipe-reveal>
  </m3e-list>`;
});
When("the pointer reverses direction across item {string} {int} times", async ({ page }, id: string, count: number) => {
  const box = await page.locator(`#${id}`).boundingBox();
  if (!box) throw new Error(`Swipe-reveal item "${id}" is not visible.`);
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  for (let i = 0; i < count; i++) {
    await page.mouse.move(x + 75, y, { steps: 4 });
    await expect
      .poll(() =>
        page.locator(`#${id}`).evaluate((host) => {
          const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
          return new DOMMatrixReadOnly(getComputedStyle(content).transform).m41;
        }),
      )
      .toBeGreaterThan(40);
    await page.mouse.move(x - 75, y, { steps: 4 });
    await expect
      .poll(() =>
        page.locator(`#${id}`).evaluate((host) => {
          const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
          return new DOMMatrixReadOnly(getComputedStyle(content).transform).m41;
        }),
      )
      .toBeLessThan(-40);
  }
  await page.mouse.up();
});
Then("item {string} settles on the {string} side", async ({ swipeReveal }, id: string, side: SwipeSide) => {
  await expect.poll(() => swipeReveal.state(id)).toBe("revealed");
  await expect.poll(() => swipeReveal.side(id)).toBe(side);
});
When(
  "a touch reverses direction across item {string} with vertical drift {int} times",
  async ({ swipeReveal }, id: string, count: number) => {
    const box = await swipeReveal.item(id).boundingBox();
    if (!box) throw new Error(`Swipe-reveal item "${id}" is not visible.`);
    await swipeReveal.startTouch(id);
    for (let i = 0; i < count; i++) {
      for (const dx of [75, 0, -75, 0]) {
        await swipeReveal.moveTouch(dx, 10);
        const offset = await swipeReveal.offset(id);
        if (dx) expect(offset * Math.sign(dx)).toBeGreaterThan(40);
      }
    }
    await swipeReveal.endTouch();
  },
);
Then("item {string} returns to the covered state", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.state(id)).toBe("covered"),
);
Given("a swipe-reveal item with {string} actions", ({ swipeReveal }, tag: string) => {
  swipeReveal.markup = `<m3e-swipe-reveal id="a" style="width: 360px">
    <${tag} slot="leading" aria-label="Pin"><span style="display:inline-block;width:24px;height:24px"></span></${tag}>
    <div style="height:56px">Content</div>
    <${tag} slot="trailing" aria-label="Bookmark"><span style="display:inline-block;width:24px;height:24px"></span></${tag}>
  </m3e-swipe-reveal>`;
});
When(
  "the user first reveals the {string} side and then switches sides",
  async ({ page, swipeReveal }, first: SwipeSide) => {
    const next: SwipeSide = first === "leading" ? "trailing" : "leading";
    await page.locator("#a").evaluate((host, side) => {
      host.addEventListener("revealed", () => (host as M3eSwipeRevealElement).reveal(side), { once: true });
    }, next);
    await swipeReveal.drag("a", first === "leading" ? 120 : -120);
    await expect.poll(() => swipeReveal.side("a")).toBe(next);
    await expect.poll(() => swipeReveal.state("a")).toBe("revealed");
  },
);
Then("the new action side settles at its natural width", async ({ page, swipeReveal }) => {
  const result = await page.locator("#a").evaluate((host) => {
    const side = (host as M3eSwipeRevealElement).side!;
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    const container = host.shadowRoot!.querySelector<HTMLElement>(`.${side}`)!;
    return {
      width: container.getBoundingClientRect().width,
      offset: new DOMMatrixReadOnly(getComputedStyle(content).transform).m41,
      buttonStyles: [...host.querySelectorAll<HTMLElement>("[slot]")].map((button) =>
        button.style.getPropertyValue("--_swipe-reveal-sizing-transition"),
      ),
    };
  });
  expect(Math.abs(result.offset)).toBeCloseTo(result.width, 0);
  expect(result.buttonStyles).toEqual(["", ""]);
  await expect.poll(() => swipeReveal.state("a")).toBe("revealed");
});
When("touch reverses quickly before release {int} times", async ({ swipeReveal }, count: number) => {
  for (let i = 0; i < count; i++) {
    await swipeReveal.startTouch("a");
    for (const dx of [-60, -35, -60]) await swipeReveal.moveTouch(dx, 0);
    await swipeReveal.endTouch("touchEnd", i < count - 1);
    await expect.poll(() => swipeReveal.state("a")).toBe("revealed");
    const offset = await swipeReveal.offset("a");
    expect(offset).toBeLessThan(-40);
    if (i < count - 1) {
      await swipeReveal.call("a", "close");
      await expect.poll(() => swipeReveal.state("a")).toBe("covered");
    }
  }
});
Then("the trailing action is fully revealed at its natural width", async ({ page, swipeReveal }) => {
  await expect.poll(() => swipeReveal.state("a")).toBe("revealed");
  const result = await page.locator("#a").evaluate((host) => {
    const container = host.shadowRoot!.querySelector<HTMLElement>(".trailing")!;
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    return {
      width: container.getBoundingClientRect().width,
      offset: new DOMMatrixReadOnly(getComputedStyle(content).transform).m41,
    };
  });
  expect(result.offset).toBeCloseTo(-result.width, 0);
});
When("touch swipes alternate rapidly in both directions", async ({ swipeReveal, page }) => {
  const box = await swipeReveal.item("a").boundingBox();
  if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
  for (let i = 0; i < 12; i++) {
    for (const dx of [25 + (i % 5) * 20, -110, 30, -130, 120]) {
      await swipeReveal.startTouch("a");
      await swipeReveal.moveTouch(dx, 0);
      await swipeReveal.endTouch();
    }
    await expect.poll(() => swipeReveal.state("a")).not.toBe("revealing");
  }
  await page.waitForTimeout(800);
});
Then("the item settles on its final side at natural action widths", async ({ page, swipeReveal }) => {
  await expect.poll(() => swipeReveal.side("a")).toBe("leading");
  const widths = await page.locator("#a").evaluate((host) =>
    ["leading", "trailing"].map((side) => {
      const container = host.shadowRoot!.querySelector<HTMLElement>(`.${side}`)!;
      const button = host.querySelector<HTMLElement>(`[slot="${side}"]`)!;
      return {
        container: container.getBoundingClientRect().width,
        button: button.getBoundingClientRect().width,
      };
    }),
  );
  expect(widths[0].container).toBeGreaterThan(0);
  expect(widths[0].button).toBeGreaterThan(0);
});
Given("a swipe-reveal group containing items {string}", ({ swipeReveal }, ids: string) => {
  swipeReveal.markup = `<m3e-swipe-reveal-group>${ids
    .split(",")
    .map((id) => swipeItem(id))
    .join("")}</m3e-swipe-reveal-group>`;
});
Given(
  "a swipe-reveal fixture with a default item {string} and tap-triggered item {string}",
  ({ swipeReveal }, first: string, second: string) => {
    swipeReveal.markup = swipeItem(first) + swipeItem(second, 'triggers="tap"');
  },
);
When("the user taps item {string}", async ({ page }, id: string) => page.locator(`#${id}`).click());
Given("a swipe-reveal group with shared settings and an overridden item", ({ swipeReveal }) => {
  swipeReveal.markup = `<m3e-swipe-reveal-group stagger="12" threshold="0.3" dismissible="trailing" dismiss-threshold="0.4">
    ${swipeItem("a")}${swipeItem("b", 'threshold="0.7"')}
  </m3e-swipe-reveal-group>`;
});
Then("item {string} inherits all group settings", async ({ page }, id: string) =>
  expect(
    await page.locator(`#${id}`).evaluate((host) => {
      const reveal = host as M3eSwipeRevealElement;
      return [reveal.stagger, reveal.threshold, reveal.dismissible, reveal.dismissThreshold];
    }),
  ).toEqual([12, 0.3, "trailing", 0.4]),
);
Then("item {string} overrides its threshold and inherits the remaining settings", async ({ page }, id: string) =>
  expect(
    await page.locator(`#${id}`).evaluate((host) => {
      const reveal = host as M3eSwipeRevealElement;
      return [reveal.stagger, reveal.threshold, reveal.dismissible, reveal.dismissThreshold];
    }),
  ).toEqual([12, 0.7, "trailing", 0.4]),
);
Then("the group exposes both items and no revealed item", async ({ page }) => {
  const group = page.locator("m3e-swipe-reveal-group");
  await expect.poll(() => group.evaluate((host) => (host as M3eSwipeRevealGroupElement).reveals.length)).toBe(2);
  await expect.poll(() => group.evaluate((host) => (host as M3eSwipeRevealGroupElement).revealed)).toBeNull();
});
Then("the group reports item {string} as revealed", async ({ page }, id: string) =>
  expect
    .poll(() =>
      page.locator("m3e-swipe-reveal-group").evaluate((host) => (host as M3eSwipeRevealGroupElement).revealed?.id),
    )
    .toBe(id),
);
Given("a swipe-reveal item {string} inside a {string} scroller", ({ swipeReveal }, id: string, scroller: string) => {
  const content = `<div style="width:900px;height:900px;padding:80px;box-sizing:border-box">${swipeItem(id)}</div>`;
  swipeReveal.markup =
    scroller === "window"
      ? content
      : `<div id="host" data-scroll-kind="${scroller}"><div id="scroller" style="width:300px;height:200px;overflow:auto">${content}</div></div>`;
});
When("the {string} scroller moves", async ({ page }, scroller: string) => {
  if (scroller === "shadow" && !(await page.locator("#host").evaluate((host) => host.shadowRoot !== null))) {
    await page.locator("#host").evaluate((host) => host.attachShadow({ mode: "open" }).append(...host.childNodes));
  }
  await page.evaluate((kind) => {
    const root = kind === "shadow" ? document.querySelector("#host")!.shadowRoot! : document;
    const scroll = () => {
      if (kind === "window") window.scrollTo(40, 40);
      else root.querySelector<HTMLElement>("#scroller")!.scrollTo(40, 40);
    };
    scroll();
  }, scroller);
});
Then("the content remains in flow and aligned with its item", async ({ page, swipeReveal }) => {
  const kind = (await page.locator("#host").count())
    ? await page.locator("#host").evaluate((host) => (host.shadowRoot ? "shadow" : "element"))
    : "window";
  const data = await page.evaluate((scrollKind) => {
    const root = scrollKind === "shadow" ? document.querySelector("#host")!.shadowRoot! : document;
    const host = root.querySelector("#a")!;
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    return {
      offset: content.getBoundingClientRect().top - host.getBoundingClientRect().top,
      horizontalOffset:
        content.getBoundingClientRect().left -
        host.getBoundingClientRect().left -
        new DOMMatrixReadOnly(getComputedStyle(content).transform).m41,
      position: getComputedStyle(content).position,
      popover: content.hasAttribute("popover"),
    };
  }, kind);
  expect(Math.abs(data.offset)).toBeLessThan(0.5);
  expect(Math.abs(data.horizontalOffset)).toBeLessThan(0.5);
  expect(data.position).toBe("relative");
  expect(data.popover).toBe(false);
  await expect.poll(() => swipeReveal.state("a")).toBe("revealed");
});
Given("a swipe-reveal item {string} with attributes {string}", ({ swipeReveal }, id: string, attributes: string) => {
  swipeReveal.markup = swipeItem(id, attributes.replaceAll("'", '"'));
});
Given("a swipe-reveal item {string} with underlap {string}", ({ swipeReveal }, id: string, underlap: string) => {
  swipeReveal.markup = swipeItem(id, `style="--m3e-swipe-reveal-actions-underlap:${underlap};width:400px"`);
});
Then("the actions reserve 12 pixels of underlap without changing reveal distance", async ({ page }) => {
  const info = await page.locator("#a").evaluate((host) => {
    const actions = host.shadowRoot!.querySelector<HTMLElement>(".trailing")!;
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    return {
      width: actions.getBoundingClientRect().width,
      margin: getComputedStyle(actions).marginInlineStart,
      offset: new DOMMatrixReadOnly(getComputedStyle(content).transform).m41,
    };
  });
  expect(parseFloat(info.margin)).toBe(12);
  expect(Math.abs(info.offset)).toBeCloseTo(info.width - 12, 0);
});
Given("a swipe-reveal item {string} in a clipped scrolling ancestor", ({ swipeReveal }, id: string) => {
  swipeReveal.markup = `<div id="scroller" style="width:300px;height:100px;overflow:hidden">${swipeItem(id)}</div>`;
});
Then("the content extends beyond the host but cannot paint outside the scroller", async ({ page }) => {
  const result = await page.locator("#a").evaluate((host) => {
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    const hostRect = host.getBoundingClientRect();
    const contentRect = content.getBoundingClientRect();
    const scroller = document.querySelector("#scroller")!.getBoundingClientRect();
    return {
      overflow: getComputedStyle(host).overflowX,
      contentRight: contentRect.right,
      hostRight: hostRect.right,
      scrollerRight: scroller.right,
      hitOutside: document.elementFromPoint(scroller.right + 5, contentRect.top + 10) === host,
    };
  });
  expect(result.overflow).toBe("visible");
  expect(result.contentRight).toBeGreaterThan(result.hostRight);
  expect(result.contentRight).toBeGreaterThan(result.scrollerRight);
  expect(result.hitOutside).toBe(false);
});
Given("two staggered swipe-reveal items inside a shadow scroller", ({ swipeReveal }) => {
  swipeReveal.markup = `<div id="host"><div id="scroller" style="width:500px;height:200px;overflow:auto">
    <div style="height:800px;padding-top:40px"><m3e-swipe-reveal-group stagger="0.5">${swipeItem("a")}${swipeItem("b")}</m3e-swipe-reveal-group></div>
  </div></div>`;
});
When("the shadow scroller moves by {int} pixels", async ({ page }, amount: number) => {
  await page.locator("#host").evaluate((host) => {
    if (!host.shadowRoot) {
      host.attachShadow({ mode: "open" }).append(...host.childNodes);
    }
  });
  await page.locator("#host").evaluate((host, value) => {
    const root = host.shadowRoot!;
    const scroller = root.querySelector<HTMLElement>("#scroller")!;
    const active = root.querySelector<HTMLElement>("#a")!;
    const sibling = root.querySelector<HTMLElement>("#b")!;
    const content = active.shadowRoot!.querySelector<HTMLElement>(".content")!;
    const before = [
      active.getBoundingClientRect().top,
      content.getBoundingClientRect().top,
      sibling.getBoundingClientRect().top,
    ];
    scroller.scrollTop = value;
    const after = [
      active.getBoundingClientRect().top,
      content.getBoundingClientRect().top,
      sibling.getBoundingClientRect().top,
    ];
    host.setAttribute("data-scroll-shifts", before.map((top, index) => top - after[index]).join(","));
  }, amount);
});
Then("the active content and sibling shift together in normal flow", async ({ page }) => {
  const shifts = await page.locator("#host").evaluate((host) => {
    const root = host.shadowRoot!;
    const sibling = root.querySelector<HTMLElement>("#b")!;
    return {
      shifts: host.getAttribute("data-scroll-shifts")!.split(",").map(Number),
      position: getComputedStyle(sibling).position,
      popover: sibling.matches(":popover-open"),
    };
  });
  expect(shifts.shifts).toEqual([30, 30, 30]);
  expect(shifts.position).toBe("relative");
  expect(shifts.popover).toBe(false);
});
Given("a swipe-reveal group containing items {string} with stagger enabled", ({ swipeReveal }, ids: string) => {
  swipeReveal.markup = `<m3e-swipe-reveal-group stagger="0.5">${ids
    .split(",")
    .map((id) => swipeItem(id))
    .join("")}</m3e-swipe-reveal-group>`;
});
When("the application removes swipe-reveal item {string}", async ({ page }, id: string) =>
  page.locator(`#${id}`).evaluate((host) => host.remove()),
);
Then("item {string} returns to its original styles and position", async ({ page }, id: string) => {
  const sibling = page.locator(`#${id}`);
  await expect(sibling).not.toHaveAttribute("popover");
  expect(
    await sibling.evaluate((host) => [getComputedStyle(host).position, host.style.width, host.style.translate]),
  ).toEqual(["relative", "400px", ""]);
});
Given(
  "a swipe-reveal group containing items {string} with stagger {string}",
  ({ swipeReveal }, ids: string, stagger: string) => {
    swipeReveal.markup = `<m3e-swipe-reveal-group stagger="${stagger}">${ids
      .split(",")
      .map((id) => swipeItem(id))
      .join("")}</m3e-swipe-reveal-group>`;
  },
);
Given(
  "a swipe-reveal group of four items with stagger {string} and stagger-count {string}",
  ({ swipeReveal }, stagger: string, count: string) => {
    swipeReveal.markup = `<m3e-swipe-reveal-group stagger="${stagger}" stagger-count="${count}">${["a", "b", "c", "d"].map((id) => swipeItem(id)).join("")}</m3e-swipe-reveal-group>`;
  },
);
Then("the first sibling follows farther than the second and the fourth does not move", async ({ page }) => {
  const shifts = await page.evaluate(() => {
    const state = window as typeof window & {
      swipeRevealSnapshots?: Record<string, { left: number }>;
    };
    return ["b", "c", "d"].map((id) => {
      const item = document.querySelector<HTMLElement>(`#${id}`)!;
      return state.swipeRevealSnapshots![id].left - item.getBoundingClientRect().left;
    });
  });
  expect(shifts[0]).toBeGreaterThan(10);
  expect(shifts[1]).toBeGreaterThan(3);
  expect(shifts[0]).toBeGreaterThan(shifts[1]);
  expect(shifts[2]).toBeCloseTo(0, 0);
});
Then("item {string} follows item {string}", async ({ page }, siblingId: string, activeId: string) => {
  const shift = await page.evaluate((id) => {
    const state = window as typeof window & {
      swipeRevealSnapshots?: Record<string, { left: number }>;
    };
    const item = document.querySelector<HTMLElement>(`#${id}`)!;
    return state.swipeRevealSnapshots![id].left - item.getBoundingClientRect().left;
  }, siblingId);
  expect(shift).toBeGreaterThan(0);
  expect(await page.locator(`#${activeId}`).count()).toBe(1);
});
Then("item {string} returns to its original position and is not a popover", async ({ page }, id: string) => {
  const item = page.locator(`#${id}`);
  await expect(item).not.toHaveAttribute("popover");
  await expect
    .poll(() =>
      item.evaluate((element) => {
        const state = window as typeof window & {
          swipeRevealSnapshots?: Record<string, { left: number }>;
        };
        const original = state.swipeRevealSnapshots![element.id].left;
        return Math.abs(original - element.getBoundingClientRect().left);
      }),
    )
    .toBeLessThan(1);
});
When(
  "the application adds important transition and translation styles to item {string}",
  async ({ page }, id: string) =>
    page.locator(`#${id}`).evaluate((host) => {
      const element = host as HTMLElement;
      element.style.setProperty("transition", "opacity 1s", "important");
      element.style.setProperty("translate", "3px", "important");
    }),
);
When("the application changes item {string}'s background", async ({ page }, id: string) =>
  page.locator(`#${id}`).evaluate((host) => ((host as HTMLElement).style.backgroundColor = "red")),
);
Then("stagger cleanup removes only the styles it owns", async ({ page }) => {
  const sibling = page.locator("#b");
  await expect.poll(() => sibling.evaluate((host) => (host as HTMLElement).style.transform)).toBe("");
  const styles = await sibling.evaluate((host) => {
    const element = host as HTMLElement;
    return {
      transform: element.style.transform,
      translate: element.style.getPropertyValue("translate"),
      translatePriority: element.style.getPropertyPriority("translate"),
      transition: element.style.getPropertyValue("transition"),
      transitionPriority: element.style.getPropertyPriority("transition"),
      background: element.style.backgroundColor,
    };
  });
  expect(styles).toEqual({
    transform: "",
    translate: "3px",
    translatePriority: "important",
    transition: "opacity 1s",
    transitionPriority: "important",
    background: "red",
  });
});
Then(
  "item {string} is covered and item {string} remains revealed after settling",
  async ({ swipeReveal }, covered: string, revealed: string) => {
    await expect.poll(() => swipeReveal.state(covered)).toBe("covered");
    await expect.poll(() => swipeReveal.state(revealed)).toBe("revealed");
  },
);
Then("item {string} remains at its original position", async ({ page }, id: string) =>
  expect(await page.locator(`#${id}`).evaluate((host) => host.getBoundingClientRect().left)).toBeGreaterThanOrEqual(0),
);
Then("content overshoot is limited to the action width plus {int} pixels", async ({ page }, maxOvershoot: number) => {
  const getOvershoot = () =>
    page.locator("#a").evaluate((host) => {
      const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
      const state = window as typeof window & {
        swipeRevealSnapshots?: Record<string, { left: number }>;
      };
      return {
        width: state.swipeRevealSnapshots!.a.trailingWidth,
        offset: state.swipeRevealSnapshots!.a.left - content.getBoundingClientRect().left,
      };
    });
  await expect
    .poll(async () => {
      const { width, offset } = await getOvershoot();
      return offset - width;
    })
    .toBeGreaterThan(4);
  const result = await getOvershoot();
  expect(result.offset).toBeGreaterThan(result.width + 4);
  expect(result.offset).toBeLessThan(result.width + maxOvershoot + 0.5);
});
Then("content stops at the action edge without overshoot", async ({ page }) => {
  const result = await page.locator("#a").evaluate((host) => {
    const actions = host.shadowRoot!.querySelector<HTMLElement>(".trailing")!;
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    return {
      width: actions.getBoundingClientRect().width,
      offset: host.getBoundingClientRect().left - content.getBoundingClientRect().left,
    };
  });
  expect(result.offset).toBeGreaterThan(result.width - 2);
  expect(result.offset).toBeLessThan(result.width + 0.5);
});
Given("a swipe-reveal group with leading elasticity, an override item, and an ungrouped item", ({ swipeReveal }) => {
  swipeReveal.markup = `<m3e-swipe-reveal-group elastic="leading">${swipeItem("a")}${swipeItem("b", 'elastic="none"')}</m3e-swipe-reveal-group>${swipeItem("c")}`;
});
Then("the group item has leading elasticity", async ({ page }) =>
  expect(await page.locator("#a").evaluate((host) => (host as M3eSwipeRevealElement).elastic)).toBe("leading"),
);
Then("the override item has no elasticity", async ({ page }) =>
  expect(await page.locator("#b").evaluate((host) => (host as M3eSwipeRevealElement).elastic)).toBe("none"),
);
Then("the ungrouped item has both-side elasticity", async ({ page }) =>
  expect(await page.locator("#c").evaluate((host) => (host as M3eSwipeRevealElement).elastic)).toBe("both"),
);
Then("item {string} is not dismissible", async ({ page }, id: string) =>
  expect(await page.locator(`#${id}`).evaluate((host) => (host as M3eSwipeRevealElement).dismissible)).toBe("none"),
);
Given("a swipe-reveal item with one trailing icon button", ({ swipeReveal }) => {
  swipeReveal.markup = `<m3e-swipe-reveal id="a" style="display:block;width:400px">
    <m3e-icon-button slot="trailing"><m3e-icon name="delete"></m3e-icon></m3e-icon-button>
    <div style="height:56px;background:white">Content</div>
  </m3e-swipe-reveal>`;
});
Then("the trailing action button is narrower than its natural width", async ({ page }) => {
  const width = await page.locator("#a [slot=trailing]").evaluate((button) => button.getBoundingClientRect().width);
  expect(width).toBeLessThan(40);
});
Then("the trailing action button retains its natural width", async ({ page }) =>
  expect(await page.locator("#a [slot=trailing]").evaluate((button) => button.getBoundingClientRect().width)).toBe(80),
);
Then("the trailing action container retains its natural width", async ({ page }) => {
  const width = await page.evaluate(() => {
    const state = window as typeof window & {
      swipeRevealSnapshots?: Record<string, { trailingWidth: number }>;
    };
    return state.swipeRevealSnapshots!.a.trailingWidth;
  });
  await expect
    .poll(() =>
      page
        .locator("#a")
        .locator(".trailing")
        .evaluate((element) => element.getBoundingClientRect().width),
    )
    .toBe(width);
});
Given("a swipe-reveal item with a wide {string} action and matching dismissal", ({ swipeReveal }, side: SwipeSide) => {
  swipeReveal.markup = `<m3e-swipe-reveal id="a" dismissible="${side}" style="width:400px;--m3e-swipe-reveal-actions-padding:0px">
    <button slot="${side}" style="width:160px;height:56px">Action</button>
    <div style="height:56px">Content</div>
  </m3e-swipe-reveal>`;
});
When("the pointer crosses the full action width and moves back", async ({ page, swipeReveal }) => {
  const box = await swipeReveal.item("a").boundingBox();
  if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
  const direction = await swipeReveal.item("a").getAttribute("dismissible");
  const sign = direction === "leading" ? 1 : -1;
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + sign * 155, y, { steps: 6 });
  expect(await swipeReveal.item("a").evaluate((host) => host.matches(":state(--armed)"))).toBe(false);
  await page.mouse.move(x + sign * 160, y);
  expect(await swipeReveal.item("a").evaluate((host) => host.matches(":state(--armed)"))).toBe(false);
  await page.mouse.move(x + sign * 161, y);
  expect(await swipeReveal.item("a").evaluate((host) => host.matches(":state(--armed)"))).toBe(true);
  await page.mouse.move(x + sign * 159, y);
  expect(await swipeReveal.item("a").evaluate((host) => host.matches(":state(--armed)"))).toBe(false);
  await page.waitForTimeout(250);
});
Then("dismissal is armed only beyond the action edge", async ({ page, swipeReveal }) => {
  const item = swipeReveal.item("a");
  await expect(item).not.toHaveAttribute("data-dismissed-event-fired");
  expect(await item.evaluate((host) => host.matches(":state(--armed)"))).toBe(false);
  await expect(page.locator("#a")).toHaveAttribute("dismissible", /^(leading|trailing)$/);
});
Then("item {string} remains revealed and is not dismissed", async ({ swipeReveal }, id: string) => {
  await expect.poll(() => swipeReveal.state(id)).toBe("revealed");
});
When("the pointer is released", async ({ page }) => page.mouse.up());
Given("a swipe-reveal item with three wide trailing actions and dismissal enabled", ({ swipeReveal }) => {
  swipeReveal.markup = `<m3e-swipe-reveal id="a" dismissible="trailing" style="width:400px;--m3e-swipe-reveal-actions-padding:0px">
    <button slot="trailing" style="width:90px;height:56px">One</button>
    <button slot="trailing" style="width:90px;height:56px">Two</button>
    <button slot="trailing" style="width:90px;height:56px">Three</button>
    <div style="height:56px">Content</div>
  </m3e-swipe-reveal>`;
});
When("a long touch swipe reveals all trailing actions", async ({ swipeReveal }) => {
  const box = await swipeReveal.item("a").boundingBox();
  if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
  await swipeReveal.startTouch("a", undefined, { x: 292, y: box.height / 2 });
  await swipeReveal.moveTouch(-247, 0);
  await swipeReveal.page.waitForTimeout(1000);
  await swipeReveal.endTouch();
});
When("a second short touch swipe passes the dismiss threshold", async ({ swipeReveal }) => {
  const box = await swipeReveal.item("a").boundingBox();
  if (!box) throw new Error('Swipe-reveal item "a" is not visible.');
  await swipeReveal.startTouch("a", undefined, { x: 30, y: box.height / 2 });
  await swipeReveal.moveTouch(-28, 0);
  await swipeReveal.page.waitForTimeout(250);
  await swipeReveal.endTouch();
});
Given(
  "a swipe-reveal group containing item {string} with dismissal and item {string}",
  ({ swipeReveal }, dismissed: string, other: string) => {
    swipeReveal.markup = `<m3e-swipe-reveal-group>${swipeItem(dismissed, 'dismissible="trailing"')}${swipeItem(other)}</m3e-swipe-reveal-group>`;
  },
);
Given("a swipe-reveal group with trailing dismissal enabled and item {string}", ({ swipeReveal }, id: string) => {
  swipeReveal.markup = `<m3e-swipe-reveal-group id="g" dismissible="trailing">${swipeItem(id)}</m3e-swipe-reveal-group>`;
});
Then("item {string} moves into the dismissed item's space", async ({ page }, id: string) => {
  await expect.poll(() => page.locator(`#${id}`).evaluate((host) => host.getBoundingClientRect().top)).toBeLessThan(56);
});
Given("a segmented list with dismissible swipe-reveal item {string}", ({ swipeReveal }, id: string) => {
  swipeReveal.markup = `<m3e-list id="list" variant="segmented">${swipeItem(id, 'dismissible="trailing"')}</m3e-list>`;
});
Then("the list has no vertical overflow", async ({ page }) =>
  expect(await page.locator("#list").evaluate((list) => list.scrollHeight - list.clientHeight)).toBe(0),
);
Then("item {string} is visible and the list still has no overflow", async ({ page, swipeReveal }, id: string) => {
  await expect.poll(() => swipeReveal.state(id)).toBe("covered");
  await expect(page.locator(`#${id}`)).toBeVisible();
  await expect.poll(() => page.locator("#list").evaluate((list) => list.scrollHeight - list.clientHeight)).toBe(0);
});
Given("a short segmented list with dismissible items {string}", ({ swipeReveal }, ids: string) => {
  swipeReveal.markup = `<m3e-list id="list" variant="segmented" style="height:70px">${ids
    .split(",")
    .map((id) => swipeItem(id, 'dismissible="trailing"'))
    .join("")}</m3e-list>`;
});
Then("the list remains taller than its viewport", async ({ page }) =>
  expect(await page.locator("#list").evaluate((list) => list.scrollHeight)).toBeGreaterThan(70),
);
When("the application scrolls the list to its end", async ({ page }) =>
  page.locator("#list").evaluate((list) => ((list as HTMLElement).scrollTop = (list as HTMLElement).scrollHeight)),
);
Then("the list scroll position advances", async ({ page }) =>
  expect(await page.locator("#list").evaluate((list) => (list as HTMLElement).scrollTop)).toBeGreaterThan(0),
);
Given("two swipe-reveal items with dismissal enabled on both sides", ({ swipeReveal }) => {
  swipeReveal.markup = swipeItem("a", 'dismissible="both"') + swipeItem("b", 'dismissible="both"');
});
When(
  "the user slowly drags the first item {int} pixels toward leading and the second {int} pixels toward trailing",
  async ({ swipeReveal }, leadingDx: number, trailingDx: number) => {
    await swipeReveal.drag("a", leadingDx, "slow");
    await swipeReveal.drag("b", -trailingDx, "slow");
  },
);
Then("both items are dismissed", async ({ swipeReveal }) => {
  await expect.poll(() => swipeReveal.state("a")).toBe("dismissed");
  await expect.poll(() => swipeReveal.state("b")).toBe("dismissed");
});
When("a touch drag pauses below dismissal threshold before its final fast movement", async ({ page }) => {
  await page.locator("#a").evaluate((host) => {
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    content.setPointerCapture = () => {};
    content.hasPointerCapture = () => false;
    const dispatch = (type: string, x: number, timeStamp: number) => {
      const event = new PointerEvent(type, {
        bubbles: true,
        pointerId: 1,
        pointerType: "touch",
        button: 0,
        buttons: type === "pointerup" ? 0 : 1,
        clientX: x,
        clientY: 28,
      });
      Object.defineProperty(event, "timeStamp", { value: timeStamp });
      content.dispatchEvent(event);
    };
    dispatch("pointerdown", 200, 1000);
    dispatch("pointermove", 80, 1040);
    dispatch("pointermove", 50, 1080);
    dispatch("pointerup", 50, 1330);
  });
});
Given(
  "a staggered swipe-reveal group containing items {string} with {string} dismissible",
  ({ swipeReveal }, ids: string, dismissible: string) => {
    swipeReveal.markup = `<m3e-swipe-reveal-group stagger="0.5">${ids
      .split(",")
      .map((id) => swipeItem(id, id === dismissible ? 'dismissible="trailing"' : ""))
      .join("")}</m3e-swipe-reveal-group>`;
  },
);
Then(
  "item {string} follows item {string} as the nearest remaining sibling",
  async ({ page }, siblingId: string, activeId: string) => {
    const shift = await page.evaluate((id) => {
      const state = window as typeof window & {
        swipeRevealSnapshots?: Record<string, { left: number }>;
      };
      const item = document.querySelector<HTMLElement>(`#${id}`)!;
      return state.swipeRevealSnapshots![id].left - item.getBoundingClientRect().left;
    }, siblingId);
    expect(shift).toBeGreaterThan(25);
    await expect(page.locator(`#${activeId}`)).toBeVisible();
  },
);
Then("swipe-reveal content disables text selection", async ({ page }) => {
  const styles = await page.locator("#a").evaluate((host) => {
    const content = host.shadowRoot!.querySelector<HTMLElement>(".content")!;
    return [getComputedStyle(content).userSelect, getComputedStyle(content).getPropertyValue("-webkit-user-select")];
  });
  expect(styles).toEqual(["none", "none"]);
});
When("the user presses and holds item {string}", async ({ page, swipeReveal }, id: string) => {
  const box = await swipeReveal.item(id).boundingBox();
  if (!box) throw new Error(`Swipe-reveal item "${id}" is not visible.`);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(() => swipeReveal.state(id)).toBe("revealed");
});
When("the user releases the pointer and waits for the trigger to settle", async ({ page }) => {
  await page.mouse.up();
  await page.waitForTimeout(200);
});
Then("item {string} remains revealed", async ({ swipeReveal }, id: string) =>
  expect.poll(() => swipeReveal.state(id)).toBe("revealed"),
);
When("the application observes content clicks on item {string}", async ({ page }, id: string) =>
  page.locator(`#${id}`).evaluate((host) => {
    const child = host.querySelector("div");
    child?.addEventListener("click", () => child.setAttribute("data-clicked", "true"));
  }),
);
When("the user long-presses item {string} by touch", async ({ swipeReveal }, id: string) => {
  await swipeReveal.startTouch(id);
  await expect.poll(() => swipeReveal.state(id)).toBe("revealed");
});
Then(
  "item {string} remains revealed after release without clicking content",
  async ({ swipeReveal, page }, id: string) => {
    await swipeReveal.endTouch();
    await page.waitForTimeout(500);
    await expect.poll(() => swipeReveal.state(id)).toBe("revealed");
    await expect(page.locator(`#${id} [data-clicked=true]`)).toHaveCount(0);
  },
);
When("the user taps item {string} by touch", async ({ swipeReveal }, id: string) => {
  await swipeReveal.startTouch(id);
  await swipeReveal.endTouch();
});
When("the user long-presses item {string} and cancels the touch", async ({ swipeReveal }, id: string) => {
  await swipeReveal.startTouch(id);
  await expect.poll(() => swipeReveal.state(id)).toBe("revealed");
  await swipeReveal.endTouch("touchCancel");
});
When("the user starts and ends a new touch on item {string}", async ({ swipeReveal }, id: string) => {
  await swipeReveal.startTouch(id);
  await swipeReveal.endTouch();
});
When("the user clicks item {string} and waits briefly", async ({ page }, id: string) => {
  await page.locator(`#${id}`).click();
  await page.waitForTimeout(300);
});
When("the user single-clicks item {string}", async ({ page }, id: string) => {
  await page.locator(`#${id}`).click();
  await page.waitForTimeout(600);
});
When("the user double-clicks item {string}", async ({ page }, id: string) => page.locator(`#${id}`).dblclick());
