import type { Page } from "@playwright/test";

import { expect } from "../fixtures";
import { createCarouselGeometry } from "../../src/carousel/CarouselGeometry";
import { carousel, geometry, fling, swipePhase } from "./carousel.helpers";

export class CarouselMotionHarness {
  private flow?: AsyncGenerator<string, void, unknown>;

  constructor(
    private readonly page: Page,
    private readonly render: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  // Checkpoints retain local measurements and browser sampling promises across behavioral steps.
  async begin(flow: AsyncGenerator<string, void, unknown>, checkpoint: string) {
    if (this.flow) throw new Error("A motion carousel flow is already active.");
    this.flow = flow;
    await this.advance(checkpoint);
  }

  async advance(checkpoint: string) {
    if (!this.flow) throw new Error("No motion carousel flow is active.");
    const result = await this.flow.next();
    expect(result.done, "The motion carousel flow ended before its behavioral checkpoint").toBe(false);
    expect(result.value).toBe(checkpoint);
  }

  async assertComplete() {
    if (this.flow) expect((await this.flow.next()).done, "All motion carousel phases must be exercised").toBe(true);
  }

  async close() {
    await this.flow?.return();
    this.flow = undefined;
  }

  async *edgeResistance(
    variant: "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel(variant, 5, "", false, "--m3e-carousel-height:240px"), direction);
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const vertical = variant === "fullscreen";
    const axis = vertical ? "y" : "x";
    const leadingSign = vertical || direction === "ltr" ? 1 : -1;
    const read = () =>
      viewport.evaluate((element, vertical) => {
        const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
        return {
          offset: vertical ? matrix.m42 : matrix.m41,
          scroll: vertical ? element.scrollTop : Math.abs(element.scrollLeft),
          max: vertical ? element.scrollHeight - element.clientHeight : element.scrollWidth - element.clientWidth,
        };
      }, vertical);
    await expect.poll(async () => (await read()).max).toBeGreaterThan(0);
    yield `a motion carousel with elastic edge resistance with variant "${variant}" and direction "${direction}"`;

    for (const edge of ["start", "end"] as const) {
      await host.evaluate(
        (element, index) => {
          (element as HTMLElement & { moveTo(index: number): void }).moveTo(index);
        },
        edge === "start" ? 0 : 4,
      );
      await expect
        .poll(async () => {
          const { scroll, max } = await read();
          return Math.abs(scroll - (edge === "start" ? 0 : max));
        })
        .toBeLessThan(1.5);
      await host.evaluate((element) => {
        element.removeAttribute("data-change");
        element.addEventListener("change", () => element.setAttribute("data-change", "true"), { once: true });
      });
      const before = await read();
      const sign = edge === "start" ? leadingSign : -leadingSign;
      await swipePhase(page, "start", 0, axis);
      const offsets: number[] = [];
      for (const distance of [40, 80, 400]) {
        await swipePhase(page, "update", sign * distance, axis);
        const state = await read();
        expect(state.offset * sign).toBeGreaterThan(0);
        expect(Math.abs(state.scroll - before.scroll)).toBeLessThan(1.5);
        expect(state.max).toBe(before.max);
        offsets.push(Math.abs(state.offset));
      }
      yield [
        "the motion carousel is pulled 40, 80 and 400 pixels beyond its start edge",
        "the motion carousel is pulled 40, 80 and 400 pixels beyond its end edge",
      ][["start", "end"].indexOf(edge)];
      expect(offsets[1] - offsets[0]).toBeLessThan(offsets[0]);
      expect(offsets[2]).toBeLessThan(48);
      expect(offsets[2]).toBeGreaterThan(offsets[1]);
      yield [
        "the motion carousel has diminishing resistance below 48 pixels at its start edge",
        "the motion carousel has diminishing resistance below 48 pixels at its end edge",
      ][["start", "end"].indexOf(edge)];
      await swipePhase(page, "end", sign * 400, axis, sign * 2);
      yield [
        "the motion carousel releases its start edge with outward velocity",
        "the motion carousel releases its end edge with outward velocity",
      ][["start", "end"].indexOf(edge)];
      expect((await read()).offset).toBe(0);
      await page.waitForTimeout(150);
      await expect(host).toHaveAttribute("selected-index", edge === "start" ? "0" : "4");
      await expect(host).not.toHaveAttribute("data-change");
      yield [
        "the motion carousel returns from its start edge without changing selection or emitting change",
        "the motion carousel returns from its end edge without changing selection or emitting change",
      ][["start", "end"].indexOf(edge)];
    }
  }

  async *pointerSpring(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 1));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    await host.evaluate((element) => {
      element.addEventListener("click", () =>
        element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1)),
      );
    });
    await expect.poll(async () => (await host.locator("m3e-carousel-item").boundingBox())!.width).toBeGreaterThan(0);
    const box = (await viewport.boundingBox())!;
    yield "a motion carousel with one hero item and click tracking";
    await page.mouse.move(box.x + 120, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 220, box.y + 100, { steps: 8 });
    await expect
      .poll(() => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41))
      .toBeGreaterThan(0);
    await page.mouse.up();
    yield "the motion carousel releases a real 100-pixel outward pointer drag";
    await expect.poll(() => viewport.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
    await expect(host).not.toHaveAttribute("data-clicks");
    yield "the motion carousel starts a return spring without activating an item";
    await page.mouse.move(box.x + 120, box.y + 100);
    await page.mouse.down();
    yield "the motion carousel receives a new pointer press during the return spring";
    expect(await viewport.evaluate((element) => getComputedStyle(element).transform)).toBe("none");
    await page.mouse.up();
    await expect(host).toHaveAttribute("data-clicks", "1");
    yield "the motion carousel cancels its transform and permits one stationary click";
    await page.mouse.move(box.x + 220, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 100, { steps: 8 });
    await expect
      .poll(() => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41))
      .toBeLessThan(0);
    await page.mouse.up();
    yield "the motion carousel releases a real 100-pixel drag in the opposite direction";
    await expect
      .poll(() => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41))
      .toBeCloseTo(0, 1);
    await expect(host).toHaveAttribute("data-clicks", "1");
    await expect(host).toHaveAttribute("selected-index", "0");
    yield "the motion carousel returns to zero without another click or selection change";
  }

  async *overscrollInvalidation(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 5));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const offset = () => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
    await expect
      .poll(async () => (await host.locator("m3e-carousel-item").first().boundingBox())!.width)
      .toBeGreaterThan(0);
    yield "a motion carousel with animated hero overscroll";
    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", 100);
    const pulled = await offset();
    yield "the motion carousel is pulled 100 pixels from the leading edge";
    expect(pulled).toBeGreaterThan(0);
    yield "the motion carousel has positive leading-edge displacement";
    await swipePhase(page, "update", 20);
    yield "the motion carousel reduces its outward pull to 20 pixels";
    expect(await offset()).toBeLessThan(pulled);
    yield "the motion carousel reduces its elastic displacement";
    await swipePhase(page, "update", -40);
    yield "the motion carousel crosses inward through the overscroll origin";
    expect(await offset()).toBe(0);
    expect(await viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    yield "the motion carousel clears its transform and scrolls inward";
    await swipePhase(page, "update", 100);
    await swipePhase(page, "cancel", 100);
    yield "the motion carousel cancels a renewed outward pull";
    await expect.poll(offset).toBeCloseTo(0, 1);
    yield "the motion carousel returns its cancelled overscroll to zero";
    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", 100);
    await host.evaluate((element) => (element as HTMLElement & { moveTo(index: number): void }).moveTo(0));
    await swipePhase(page, "update", 150);
    yield "the motion carousel navigates to the start during a pull and receives another update";
    expect(await offset()).toBe(0);
    yield "the motion carousel does not resume overscroll after navigation";
    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", 100);
    await page.evaluate(() => (document.body.dir = "rtl"));
    yield "the motion carousel changes document direction during an outward pull";
    await expect.poll(offset).toBe(0);
    await swipePhase(page, "update", 150);
    expect(await offset()).toBe(0);
    yield "the motion carousel clears direction-changed overscroll and ignores another update";
    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", -100);
    await host.evaluate((element) => element.setAttribute("variant", "fullscreen"));
    yield "the motion carousel changes to fullscreen during a reversed pull";
    await expect.poll(offset).toBe(0);
    yield "the motion carousel clears variant-changed overscroll";
    await host.evaluate((element) => element.setAttribute("variant", "hero"));
    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", -100);
    expect(await offset()).toBeLessThan(0);
    yield "the motion carousel returns to hero and pulls in the reversed document direction";
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(offset).toBe(0);
    yield "the motion carousel clears its reversed pull when reduced motion is enabled";
    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", -100);
    expect(await offset()).toBeLessThan(0);
    yield "the motion carousel is pulled again with reduced motion";
    await host.evaluate((element) => {
      element.remove();
      document.body.append(element);
    });
    expect(await offset()).toBe(0);
    yield "the motion carousel clears its transform when removed and reconnected";
  }

  async *frameHeights(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(`<div style="height:200px">${carousel("hero", 2, "", false, "--m3e-carousel-height:50%")}</div>`);
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const frame = host.locator(".viewport-frame");
    yield "a motion carousel inside a 200-pixel parent with a percentage height";
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(100);
    expect((await frame.boundingBox())!.height).toBe(100);
    yield "the motion carousel has matching 100-pixel viewport and overscroll frame heights";
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-height", "240px");
      element.setAttribute("variant", "fullscreen");
    });
    yield "the motion carousel switches to fullscreen with a 240-pixel height token";
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(240);
    expect((await frame.boundingBox())!.height).toBe(240);
    yield "the motion carousel has matching 240-pixel viewport and overscroll frame heights";
  }

  async *fullscreenResize(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("fullscreen", 3));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const item = host.locator("m3e-carousel-item").first();
    yield "a motion carousel with three fullscreen items";
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(200);
    await expect.poll(async () => (await item.boundingBox())!.height).toBe(200);
    yield "the motion carousel starts with 200-pixel fullscreen viewport and item heights";
    await host.evaluate((element: HTMLElement) => {
      element.style.height = "120px";
    });
    yield "the motion carousel sets its fullscreen host height to 120 pixels";
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(120);
    await expect.poll(async () => (await item.boundingBox())!.height).toBe(120);
    yield "the motion carousel resizes its fullscreen viewport and item to 120 pixels";
    await host.evaluate((element: HTMLElement) => {
      element.style.height = "60px";
    });
    yield "the motion carousel sets its fullscreen host height to 60 pixels";
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(60);
    await expect.poll(async () => (await item.boundingBox())!.height).toBe(60);
    yield "the motion carousel resizes its fullscreen viewport and item to 60 pixels";
  }

  async *explicitHeight(variant: "multi-browse" | "fullscreen"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel(variant, 3, "", false, "--m3e-carousel-height:256px"));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    yield `a motion carousel with a 256-pixel height token with variant "${variant}"`;

    for (const height of [320, 100]) {
      await host.evaluate((element: HTMLElement, value) => {
        element.style.height = `${value}px`;
      }, height);
      yield [
        "the motion carousel sets its explicit host height to 320 pixels",
        "the motion carousel sets its explicit host height to 100 pixels",
      ][[320, 100].indexOf(height)];
      await expect.poll(async () => (await host.boundingBox())!.height).toBe(height);
      await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(height);
      yield [
        "the motion carousel uses 320-pixel host and viewport heights instead of its token",
        "the motion carousel uses 100-pixel host and viewport heights instead of its token",
      ][[320, 100].indexOf(height)];
    }
  }

  async *rootFontHeight(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(
      `<style>html { font-size: 20px; }</style>${carousel("multi-browse", 3).replace("height: 200px;", "")}`,
    );
    const host = page.locator("m3e-carousel");
    yield "a motion carousel rendered at a 20-pixel root font size without explicit height";
    await expect.poll(async () => (await host.boundingBox())!.height).toBe(205);
    await expect.poll(async () => (await host.locator(".viewport").boundingBox())!.height).toBe(205);
    yield "the motion carousel retains its default 205-pixel host and viewport heights";
  }

  async *nativeOverscroll(mode: "ltr" | "rtl" | "fullscreen"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    const vertical = mode === "fullscreen";
    await render(
      carousel(vertical ? "fullscreen" : "hero", 5, "", false, "--m3e-carousel-height:240px"),
      mode === "rtl" ? "rtl" : "ltr",
    );
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    await expect
      .poll(() =>
        viewport.evaluate(
          (element, vertical) =>
            vertical ? element.scrollHeight - element.clientHeight : element.scrollWidth - element.clientWidth,
          vertical,
        ),
      )
      .toBeGreaterThan(0);
    yield `a motion carousel with native overscroll bounds with mode "${mode}"`;

    for (const index of [0, 4]) {
      await host.evaluate((element, index) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(index);
      }, index);
      await expect(host).toHaveAttribute("selected-index", String(index));
      await expect
        .poll(() =>
          viewport.evaluate(
            (element, { vertical, index }) => {
              const scroll = vertical ? element.scrollTop : Math.abs(element.scrollLeft);
              const max = vertical
                ? element.scrollHeight - element.clientHeight
                : element.scrollWidth - element.clientWidth;
              return Math.abs(scroll - (index === 0 ? 0 : max));
            },
            { vertical, index },
          ),
        )
        .toBeLessThan(1.5);
      const result = await host.evaluate(
        (element, { vertical, index, rtl }) => {
          const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
          const item = element.querySelectorAll<HTMLElement>("m3e-carousel-item")[index];
          const before = item.getBoundingClientRect();
          const property = vertical ? "scrollTop" : "scrollLeft";
          const scroll = viewport[property];
          const bounce = index === 0 ? -30 : 30;
          Object.defineProperty(viewport, property, {
            configurable: true,
            get: () => scroll + bounce * (rtl && !vertical ? -1 : 1),
          });
          try {
            viewport.dispatchEvent(new Event("scroll"));
            const after = item.getBoundingClientRect();
            return {
              before: vertical ? before.top : before.left,
              after: vertical ? after.top : after.left,
            };
          } finally {
            Reflect.deleteProperty(viewport, property);
          }
        },
        { vertical, index, rtl: mode === "rtl" },
      );
      yield [
        "the motion carousel simulates a 30-pixel native bounce at item 0",
        "the motion carousel simulates a 30-pixel native bounce at item 4",
      ][[0, 4].indexOf(index)];
      expect(result.after).toBeCloseTo(result.before, 1);
      yield [
        "the motion carousel keeps item 0 in its pre-bounce position",
        "the motion carousel keeps item 4 in its pre-bounce position",
      ][[0, 4].indexOf(index)];
    }
  }

  async *slowMouseDrag(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("hero", 5));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    yield "a motion carousel with five hero items for a slow pointer drag";
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 90, box.y + 100, { steps: 8 });
    yield "the motion carousel holds a 210-pixel pointer drag";
    expect((await geometry(page)).scroll).toBeGreaterThan(180);
    yield "the motion carousel scrolls continuously by more than 180 pixels while held";
    await page.waitForTimeout(400);
    await page.mouse.up();
    yield "the motion carousel releases the slow drag after 400 milliseconds";
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
    yield "the motion carousel settles the slow pointer drag at item 1";
  }

  async *textDrag(variant: "hero" | "hero-centered"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 5));
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 420,
      gap: 8,
      count: 5,
      baseSize: 280,
    })!;
    const host = page.locator("m3e-carousel");
    await host.evaluate((element: HTMLElement) => {
      element.style.marginLeft = "200px";
      const item = element.querySelector("m3e-carousel-item")!;
      item.innerHTML =
        '<div style="display:grid;place-items:center;height:100%"><span>Drag this carousel item</span></div>';
    });
    const viewport = host.locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const text = (await host.locator("span").boundingBox())!;
    const startX = text.x + text.width / 2;
    const y = text.y + text.height / 2;
    yield `a motion carousel with centered text in its first item and a left margin with variant "${variant}"`;
    await page.mouse.move(startX, y);
    await page.mouse.down();
    await page.mouse.move(startX - 2, y, { steps: 2 });
    await page.waitForTimeout(100);
    for (let distance = 10; distance < startX - box.x + 60; distance += 10) {
      await page.mouse.move(startX - distance, y);
      await page.waitForTimeout(20);
    }
    const held = (await geometry(page)).scroll;
    yield "the motion carousel drags its text gradually beyond the viewport boundary";
    expect(held).toBeGreaterThan(100);
    await page.waitForTimeout(600);
    expect((await geometry(page)).scroll).toBeCloseTo(held, 0);
    expect(await page.evaluate(() => getSelection()?.toString())).toBe("");
    yield "the motion carousel holds more than 100 pixels of scroll for 600 milliseconds without selecting text";
    await page.mouse.move(box.x + 60, y, { steps: 6 });
    yield "the motion carousel moves the held text drag back inside its bounds";
    await expect.poll(async () => (await geometry(page)).scroll).toBeLessThan(held - 50);
    yield "the motion carousel reduces the held text drag scroll by more than 50 pixels";
    await page.mouse.up();
    yield "the motion carousel releases the text-started drag";
    await expect
      .poll(async () => {
        const result = await geometry(page);
        const index = Number(await host.getAttribute("selected-index"));
        return Math.abs(result.scroll - layout.scrollForIndex(index));
      })
      .toBeLessThan(1.5);
    yield "the motion carousel settles the text-started drag at the selected geometry target";
  }

  async *rtlPointerSwipe(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("hero", 5), "rtl");
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    yield "a motion carousel with five hero items in right-to-left document direction";
    await page.mouse.move(box.x + 100, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 320, box.y + 100);
    await page.mouse.up();
    yield "the motion carousel releases a fast rightward pointer swipe";
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(0);
    yield "the motion carousel selects item 1 and advances its right-to-left scroll";
  }

  async *shortTouchSwipe(
    variant: "hero" | "hero-centered" | "multi-browse",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 8), direction);
    await geometry(page);
    const host = page.locator("m3e-carousel");
    yield `a motion carousel with eight items for a short fast touch swipe with variant "${variant}" and direction "${direction}"`;
    await host.locator(".viewport").evaluate((element, direction) => {
      element.setPointerCapture = () => {};
      element.hasPointerCapture = () => false;
      const sign = direction === "rtl" ? 1 : -1;
      for (const [type, distance, timestamp] of [
        ["pointerdown", 0, 1000],
        ["pointermove", 15, 1020],
        ["pointerup", 40, 1030],
      ] as const) {
        const event = new PointerEvent(type, {
          bubbles: true,
          composed: true,
          pointerId: 1,
          pointerType: "touch",
          isPrimary: true,
          button: 0,
          buttons: type === "pointerup" ? 0 : 1,
          clientX: 210 + sign * distance,
          clientY: 100,
        });
        Object.defineProperty(event, "timeStamp", { value: timestamp });
        element.dispatchEvent(event);
      }
    }, direction);
    yield "the motion carousel receives a 40-pixel touch swipe released after 30 milliseconds";
    await expect.poll(async () => Number(await host.getAttribute("selected-index"))).toBeGreaterThan(0);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(40);
    yield "the motion carousel advances selection and scrolls beyond 40 pixels";
  }

  async *distanceSettle(
    variant: "hero" | "hero-centered",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 8), direction);
    const host = page.locator("m3e-carousel");
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
    })!;
    const scroll = 600;
    const expectedIndex = Array.from({ length: 8 }, (_, index) => index).reduce(
      (nearest, index) =>
        Math.abs(layout.scrollForIndex(index) - scroll) < Math.abs(layout.scrollForIndex(nearest) - scroll)
          ? index
          : nearest,
      0,
    );
    const sign = direction === "rtl" ? 1 : -1;
    yield `a motion carousel with eight hero items and distance-based geometry with variant "${variant}" and direction "${direction}"`;
    await fling(page, sign * 0.1, sign * scroll);
    yield "the motion carousel releases a 600-pixel drag with velocity 0.1";
    await expect(host).toHaveAttribute("selected-index", `${expectedIndex}`);
    expect(expectedIndex).toBeGreaterThan(1);
    await expect
      .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(expectedIndex)))
      .toBeLessThan(1.5);
    yield "the motion carousel settles beyond item 1 at the nearest distance target";
  }

  async *directionReposition(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("hero-centered", 5));
    const host = page.locator("m3e-carousel");
    yield "a motion carousel with five centered-hero items for a direction change";
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      document.body.dir = "rtl";
    });
    yield "the motion carousel selects item 2 and changes document direction after 600 milliseconds";
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[2];
        return (item.left + item.right) / 2;
      })
      .toBeCloseTo(210, 0);
    yield "the motion carousel centers selected item 2 at 210 pixels in the new direction";
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(4);
    });
    await page.waitForTimeout(600);
    yield "the motion carousel navigates to item 4 and waits 600 milliseconds";
    expect(Math.abs((await geometry(page)).items[4].left)).toBeLessThan(1.5);
    yield "the motion carousel aligns the final item with the right-to-left leading edge";
  }

  async *documentNavigation(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("hero", 3, 'dir="rtl"'), "ltr");
    const host = page.locator("m3e-carousel");
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    yield "a motion carousel with a local rtl attribute in an ltr document";
    await page.keyboard.press("ArrowRight");
    yield "the motion carousel receives ArrowRight on its first action";
    await expect(host).toHaveAttribute("selected-index", "1");
    yield "the motion carousel navigates according to document direction to item 1";
  }

  async *realTouchDrag(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("hero", 5));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    yield "a motion carousel with five hero items for native touch dragging";
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + 300, y: box.y + 100 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + 220, y: box.y + 100 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + 80, y: box.y + 100 }],
    });
    yield "the motion carousel receives native touch moves from 300 through 220 to 80 pixels";
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(100);
    yield "the motion carousel scrolls more than 100 pixels before the touch ends";
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    yield "the motion carousel ends the native touch drag";
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
    await cdp.detach();
    yield "the motion carousel settles the native touch drag at item 1";
  }

  async *touchOwnership(variant: "uncontained" | "fullscreen"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel(variant, 5, "", false, "--m3e-carousel-height:200px"));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    await host.evaluate((element) => {
      element.addEventListener("pointerdown", (event) => {
        element.setAttribute("data-pointer-id", String((event as PointerEvent).pointerId));
      });
      element.addEventListener("touchmove", (event) => {
        element.setAttribute("data-prevented", String(event.defaultPrevented));
      });
    });
    const box = (await viewport.boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
    const x = box.x + 200;
    const y = box.y + 100;
    const vertical = variant === "fullscreen";
    yield `a motion carousel with touch cancellation tracking with variant "${variant}"`;
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - (vertical ? 0 : 40), y: y - (vertical ? 40 : 0) }],
    });
    yield "the motion carousel moves a native touch 40 pixels on its carousel axis";
    await expect(host).toHaveAttribute("data-prevented", "true");
    yield "the motion carousel prevents the carousel-axis touch move";
    const pointerId = Number(await host.getAttribute("data-pointer-id"));
    await viewport.dispatchEvent("pointercancel", {
      pointerId,
      pointerType: "touch",
      bubbles: true,
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - 60, y: y - 60 }],
    });
    yield "the motion carousel cancels its pointer and continues the same native touch";
    await expect(host).toHaveAttribute("data-prevented", "true");
    yield "the motion carousel retains ownership of the cancelled-pointer touch";
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: x - (vertical ? 40 : 0), y: y - (vertical ? 0 : 40) }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    yield "the motion carousel ends that touch and performs a perpendicular touch gesture";
    await expect(host).toHaveAttribute("data-prevented", "false");
    await cdp.detach();
    yield "the motion carousel releases touch ownership for the perpendicular gesture";
  }

  async *touchPageScroll(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(`<div id="scroller" style="height: 150px; overflow: auto">
      <div style="height: 100px"></div>
      ${carousel("uncontained", 5)}
      <div style="height: 700px"></div>
    </div>`);
    const host = page.locator("m3e-carousel");
    const scroller = page.locator("#scroller");
    await scroller.evaluate((element) => (element.scrollTop = 100));
    await host.evaluate((element) => {
      element.addEventListener("click", () => element.setAttribute("data-clicked", "true"));
      element.addEventListener("touchmove", (event) => {
        element.setAttribute("data-prevented", String(event.defaultPrevented));
      });
    });
    const box = (await host.boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Emulation.setTouchEmulationEnabled", { enabled: true });
    const x = box.x + 100;
    const y = box.y + 75;
    yield "a motion carousel inside a scrollable page with click and touch tracking";
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    yield "the motion carousel receives a native touch tap";
    await expect(host).toHaveAttribute("data-clicked", "true");
    yield "the motion carousel activates its tapped item";
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x, y }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y - 40 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x, y: y - 70 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchEnd",
      touchPoints: [],
    });
    yield "the motion carousel receives native perpendicular touch moves of 40 and 70 pixels";
    await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
    await expect(host).toHaveAttribute("data-prevented", "false");
    await cdp.detach();
    yield "the motion carousel allows the surrounding page to scroll beyond 100 pixels";
  }

  async *narrowFocalItems(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("hero-centered", 3));
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      element.style.width = "140px";
    });
    yield "a motion carousel with three centered-hero items in a 140-pixel viewport";
    await expect.poll(async () => (await geometry(page)).items[0].left).toBeCloseTo(0, 0);
    yield "the motion carousel keeps its first narrow focal item at the leading edge";
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await page.waitForTimeout(600);
    yield "the motion carousel navigates to the final narrow focal item and waits 600 milliseconds";
    expect((await geometry(page)).items[2].right).toBeCloseTo(140, 0);
    yield "the motion carousel keeps its final narrow focal item at the 140-pixel trailing edge";
  }

  async *keyboardChange(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("hero", 5));
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      element.addEventListener("change", (event) => {
        const detail = (event as CustomEvent<{ index: number; item: HTMLElement }>).detail;
        element.setAttribute("data-change", `${detail.index}:${detail.item.textContent}`);
      });
    });
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    yield "a motion carousel with selected-item change event tracking";
    await page.keyboard.press("ArrowRight");
    yield "the motion carousel receives ArrowRight while tracking selected-item changes";
    await expect(host).toHaveAttribute("data-change", "1:Item 2");
    yield "the motion carousel emits the detail 1:Item 2";
    await page.keyboard.press("End");
    yield "the motion carousel receives End while tracking selected-item changes";
    await expect(host).toHaveAttribute("data-change", "4:Item 5");
    yield "the motion carousel emits the detail 4:Item 5";
    await page.keyboard.press("Home");
    yield "the motion carousel receives Home while tracking selected-item changes";
    await expect(host).toHaveAttribute("data-change", "0:Item 1");
    yield "the motion carousel emits the detail 0:Item 1";
  }

  async *verticalKeyboard(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("fullscreen", 3));
    await page
      .locator("m3e-carousel")
      .evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-height", "200px"));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    await page.locator("m3e-carousel").getByRole("button", { name: "Item 1", exact: true }).focus();
    yield "a motion carousel with a 200-pixel fullscreen viewport and first action focused";
    await page.keyboard.press("ArrowDown");
    yield "the motion carousel receives ArrowDown on its first fullscreen action";
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
    await expect(page.locator("m3e-carousel")).toHaveAttribute("selected-index", "1");
    yield "the motion carousel selects item 1 and scrolls vertically beyond 100 pixels";
  }

  async *unsnappedDrag(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    yield "a motion carousel with 160-pixel uncontained items for slow dragging";
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 225, box.y + 100, { steps: 6 });
    await page.waitForTimeout(400);
    await page.mouse.up();
    await page.waitForTimeout(300);
    yield "the motion carousel releases a 75-pixel uncontained drag after a 400-millisecond hold";
    expect((await geometry(page)).scroll).toBeCloseTo(75, 0);
    yield "the motion carousel remains at the unsnapped 75-pixel drag position";
  }

  async *unsnappedWheel(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    yield "a motion carousel with 160-pixel uncontained items for wheel scrolling";
    await page.locator("m3e-carousel").locator(".viewport").hover();
    await page.mouse.wheel(75, 0);
    yield "the motion carousel receives 75 pixels of horizontal wheel movement";
    await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(75, 0);
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(75, 0);
    yield "the motion carousel remains at the unsnapped 75-pixel wheel position after 200 milliseconds";
  }

  async *releaseMovement(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    await geometry(page);
    yield "a motion carousel with reduced-motion uncontained release movement";
    await swipePhase(page, "start", -15);
    await swipePhase(page, "end", -80, "x", -0.5);
    yield "the motion carousel starts at minus 15 pixels and releases at minus 80 with velocity minus 0.5";
    expect((await geometry(page)).scroll).toBeCloseTo(80, 0);
    yield "the motion carousel applies all 80 pixels of release movement without a fling";
  }

  async *uncontainedFling(direction: "ltr" | "rtl"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"), direction);
    yield `a motion carousel with animated 160-pixel uncontained items with direction "${direction}"`;
    await fling(page, direction === "rtl" ? 0.85 : -0.85);
    const released = (await geometry(page)).scroll;
    yield "the motion carousel flings its uncontained items with speed 0.85";
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(released + 100);
    await page.waitForTimeout(1500);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    expect(Math.abs(stopped - Math.round(stopped / 168) * 168)).toBeGreaterThan(3);
    yield "the motion carousel continues beyond 100 pixels and stops away from the 168-pixel snap grid";
  }

  async *settleTimers(
    variant: "multi-browse" | "uncontained",
    programmatic: false | true,
  ): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 8, "", false, "--m3e-carousel-item-width:160px"));
    await geometry(page);
    yield `a motion carousel with scroll-settle timer instrumentation with variant "${variant}" and programmatic "${programmatic}"`;
    const result = await page.locator("m3e-carousel").evaluate(async (element, programmatic) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
      const browserWindow: Window = window;
      const set = browserWindow.setTimeout;
      const clear = browserWindow.clearTimeout;
      const pending = new Set<number>();
      const counts = { scheduled: 0, fired: 0 };
      const blockScroll = (event: Event) => event.stopImmediatePropagation();
      if (programmatic) viewport.addEventListener("scroll", blockScroll, true);
      browserWindow.setTimeout = function (handler, timeout, ...args) {
        if (timeout !== 100 || typeof handler !== "function") return set.call(window, handler, timeout, ...args);
        counts.scheduled++;
        const timer = set.call(
          window,
          () => {
            pending.delete(timer);
            counts.fired++;
            handler.call(window, ...args);
          },
          timeout,
        );
        pending.add(timer);
        return timer;
      };
      browserWindow.clearTimeout = function (timer) {
        if (timer !== undefined) pending.delete(timer);
        clear.call(window, timer);
      };
      try {
        if (programmatic) {
          (element as HTMLElement & { moveTo(index: number): void }).moveTo(3);
        } else {
          for (const phase of ["start", "update", "end"]) {
            gesture.dispatchEvent(
              new CustomEvent("gesture", {
                detail: {
                  phase,
                  axis: "x",
                  translationX: phase === "start" ? 0 : -40,
                  translationY: 0,
                  velocityX: -1.5,
                  velocityY: 0,
                },
              }),
            );
          }
        }
        await new Promise<void>((resolve) => set.call(window, resolve, 150));
        const during = { ...counts };
        await new Promise<void>((resolve) => set.call(window, resolve, 1750));
        return {
          during,
          after: { ...counts },
          pending: pending.size,
          scroll: viewport.scrollLeft,
        };
      } finally {
        browserWindow.setTimeout = set;
        browserWindow.clearTimeout = clear;
        viewport.removeEventListener("scroll", blockScroll, true);
      }
    }, programmatic);
    yield "the motion carousel records settle timers during and after its navigation or swipe fling";
    expect(result.during.scheduled).toBe(0);
    expect(result.after.scheduled).toBeGreaterThan(0);
    expect(result.after.scheduled).toBeLessThanOrEqual(2);
    expect(result.after.fired).toBe(1);
    expect(result.pending).toBe(0);
    expect(result.scroll).toBeGreaterThan(40);
    yield "the motion carousel defers 100-millisecond settle timers and fires exactly one after its fling";
  }

  async *nativeAfterSettle(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8));
    const host = page.locator("m3e-carousel");
    const layout = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
    })!;
    const target = layout.scrollForIndex(7);
    yield "a motion carousel with eight multi-browse items for post-settle momentum";
    await host.evaluate(
      (element, target) =>
        new Promise<void>((resolve) => {
          const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
          (element as HTMLElement & { moveTo(index: number): void }).moveTo(7);
          const check = () => {
            if (Math.abs(viewport.scrollLeft - target) < 1) {
              // Simulates native momentum continuing after the programmatic settle finishes.
              requestAnimationFrame(() => {
                viewport.scrollLeft = target - 20;
                resolve();
              });
            } else requestAnimationFrame(check);
          };
          check();
        }),
      target,
    );
    yield "the motion carousel continues native scrolling 20 pixels behind its final programmatic target";
    await expect(host).toHaveAttribute("selected-index", "7");
    await expect
      .poll(async () => Math.abs((await geometry(page)).scroll - target), {
        timeout: 3000,
      })
      .toBeLessThan(1.5);
    yield "the motion carousel snaps back to item 7 within 3000 milliseconds";
  }

  async *fastBrowseFling(direction: "ltr" | "rtl"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8), direction);
    yield `a motion carousel with eight multi-browse items for a fast fling with direction "${direction}"`;
    await fling(page, direction === "rtl" ? 1.8 : -1.8);
    yield "the motion carousel flings its multi-browse items with speed 1.8";
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")), { timeout: 5000 })
      .toBeGreaterThanOrEqual(2);
    const selected = Number(await page.locator("m3e-carousel").getAttribute("selected-index"));
    const layout = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
    })!;
    await expect
      .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(selected)))
      .toBeLessThan(1.5);
    yield "the motion carousel settles beyond one item at its selected multi-browse geometry target";
  }

  async *offscreenFocus(direction: "ltr" | "rtl"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 12), direction);
    const host = page.locator("m3e-carousel");
    const firstAction = host.getByRole("button", {
      name: "Item 1",
      exact: true,
    });
    await firstAction.focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    yield `a motion carousel with twelve multi-browse items and first action focused with direction "${direction}"`;
    await fling(page, direction === "rtl" ? 1.8 : -1.8);
    yield "the motion carousel swipes its focused multi-browse item offscreen at speed 1.8";
    await expect.poll(async () => Number(await host.getAttribute("selected-index"))).toBeGreaterThanOrEqual(2);
    const current = Number(await host.getAttribute("selected-index"));
    await expect(host.getByRole("button", { name: `Item ${current + 1}`, exact: true })).toBeFocused();
    yield "the motion carousel focuses the settled multi-browse item beyond item 1";
    await page.keyboard.press(direction === "rtl" ? "ArrowLeft" : "ArrowRight");
    yield "the motion carousel presses the forward arrow after offscreen focus recovery";
    await expect(host.getByRole("button", { name: `Item ${current + 2}`, exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", String(current + 1));
    yield "the motion carousel focuses and selects the next item after recovery";
  }

  async *visibleFocus(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    const host = page.locator("m3e-carousel");
    const action = host.getByRole("button", { name: "Item 1", exact: true });
    await action.focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    yield "a motion carousel with reduced-motion uncontained items and first action focused";
    await fling(page, -0.001, -75);
    yield "the motion carousel swipes its focused item only 75 pixels with velocity minus 0.001";
    await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(75, 0);
    await expect(action).toBeFocused();
    yield "the motion carousel keeps focus on the still-visible first item at 75 pixels";
  }

  async *externalFocus(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(`<button id="outside">Outside</button>${carousel("multi-browse", 8)}`);
    const outside = page.locator("#outside");
    await outside.focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    yield "a motion carousel with reduced-motion multi-browse items and external focus";
    await fling(page, -1.8);
    yield "the motion carousel flings while focus remains on an outside button";
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThanOrEqual(2);
    await expect(outside).toBeFocused();
    yield "the motion carousel advances beyond one item without stealing external focus";
  }

  async *focusLeavesFling(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(`<button id="outside">Outside</button>${carousel("multi-browse", 12)}`);
    const host = page.locator("m3e-carousel");
    const outside = page.locator("#outside");
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    yield "a motion carousel with an outside button and animated first-item focus";
    await fling(page, -1.8);
    await outside.focus();
    yield "the motion carousel starts a fling and the user immediately focuses the outside button";
    await expect.poll(async () => Number(await host.getAttribute("selected-index"))).toBeGreaterThanOrEqual(2);
    await expect(outside).toBeFocused();
    yield "the motion carousel does not restore carousel focus when that fling settles";
  }

  async *navigationInterruptFocus(method: "moveTo" | "selectedIndex"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 12));
    const host = page.locator("m3e-carousel");
    const action = host.getByRole("button", { name: "Item 1", exact: true });
    await action.focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    yield `a motion carousel with animated multi-browse focus and programmatic interruption with method "${method}"`;
    await fling(page, -1.8);
    await host.evaluate((element, method) => {
      const carousel = element as HTMLElement & {
        selectedIndex: number;
        moveTo(index: number): void;
      };
      if (method === "moveTo") carousel.moveTo(7);
      else carousel.selectedIndex = 7;
    }, method);
    yield "the motion carousel interrupts its focused fling with navigation to item 7";
    await expect(host).toHaveAttribute("selected-index", "7");
    await page.waitForTimeout(1300);
    await expect(action).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", "7");
    yield "the motion carousel retains first-item focus and selection 7 after 1300 milliseconds";
  }

  async *fullscreenPointerFocus(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("fullscreen", 3, "", false, "--m3e-carousel-height:200px"));
    const host = page.locator("m3e-carousel");
    yield "a motion carousel with reduced-motion fullscreen items ready for focused pointer swiping";
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await page.waitForTimeout(150);
    const box = (await host.locator(".viewport").boundingBox())!;
    await page.mouse.move(box.x + 100, box.y + 170);
    await page.mouse.down();
    await page.mouse.move(box.x + 100, box.y + 30, { steps: 5 });
    await page.mouse.up();
    yield "the motion carousel focuses its first action and releases a real vertical pointer swipe from 170 to 30 pixels";
    await expect(host).toHaveAttribute("selected-index", "1");
    await expect(host.getByRole("button", { name: "Item 2", exact: true })).toBeFocused();
    yield "the motion carousel selects and focuses its second fullscreen item";
    await page.keyboard.press("ArrowDown");
    yield "the motion carousel receives ArrowDown after fullscreen pointer focus recovery";
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    yield "the motion carousel focuses its third fullscreen item";
  }

  async *enabledVisibleFocus(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    const host = page.locator("m3e-carousel");
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await host
      .locator("m3e-carousel-item")
      .nth(1)
      .evaluate((item) => item.setAttribute("disabled", ""));
    await expect(host.getByRole("button", { name: "Item 2", exact: true })).toHaveAttribute("aria-disabled", "true");
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    yield "a motion carousel with uncontained first-item focus and the second item disabled";
    await fling(page, -0.001, -200);
    yield "the motion carousel swipes 200 pixels with velocity minus 0.001 past the disabled item";
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", "1");
    expect((await geometry(page)).scroll).toBeCloseTo(200, 0);
    yield "the motion carousel focuses enabled item 3 while keeping selection 1 and unsnapped scroll 200";
  }

  async *largeItemFling(
    variant: "hero" | "hero-centered",
    direction: "ltr" | "rtl",
    motion: "no-preference" | "reduce",
  ): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: motion });
    await render(carousel(variant, 12, "", false, "--m3e-carousel-item-width:320px"), direction);
    const host = page.locator("m3e-carousel");
    await host.evaluate((element: HTMLElement) => (element.style.width = "960px"));
    await expect
      .poll(
        async () =>
          (await geometry(page)).items.filter(
            (item) => item.left >= -0.5 && item.right <= 960.5 && Math.abs(item.width - item.visible) < 0.5,
          ).length,
      )
      .toBe(3);
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 960,
      gap: 8,
      count: 12,
      baseSize: 280,
      preferredSize: 320,
      reducedMotion: motion === "reduce",
    })!;
    const selected = async () => Number(await host.getAttribute("selected-index"));
    const sign = direction === "rtl" ? 1 : -1;
    yield `a motion carousel with three fully visible 320-pixel items in a 960-pixel viewport with variant "${variant}" and direction "${direction}" and motion "${motion}"`;
    await fling(page, sign * 0.5, sign * 40);
    yield "the motion carousel flings its large items with speed 0.5 and translation 40";
    await expect.poll(selected).toBeGreaterThan(0);
    const slowIndex = await selected();
    await expect
      .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(slowIndex)))
      .toBeLessThan(1.5);
    yield "the motion carousel settles its slow large-item fling beyond the first item";
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(0);
    });
    await expect.poll(async () => (await geometry(page)).scroll).toBeLessThan(1.5);
    await fling(page, sign * 20, sign * 40);
    yield "the motion carousel returns to the start and flings its large items with speed 20";
    await expect.poll(selected).toBeGreaterThan(Math.max(1, slowIndex));
    await expect.poll(async () => Math.abs((await geometry(page)).scroll - layout.maxScroll)).toBeLessThan(1.5);
    yield "the motion carousel travels farther than the slow fling and reaches maximum scroll";
    await fling(page, -sign * 20, -sign * 40);
    yield "the motion carousel reverses its large-item fling with speed 20";
    await expect(host).toHaveAttribute("selected-index", "0");
    await expect.poll(async () => (await geometry(page)).scroll).toBeLessThan(1.5);
    yield "the motion carousel returns its large-item selection and scroll to zero";
  }

  async *largeItemCount(variant: "hero" | "hero-centered"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 12, "", false, "--m3e-carousel-item-width:320px"));
    const host = page.locator("m3e-carousel");
    yield `a motion carousel with twelve 320-pixel items and a resizable viewport with variant "${variant}"`;

    for (const width of [420, 960, 420]) {
      await host.evaluate((element, width) => ((element as HTMLElement).style.width = `${width}px`), width);
      await expect
        .poll(
          async () =>
            (await geometry(page)).items.filter(
              (item) => item.left >= -0.5 && item.right <= width + 0.5 && Math.abs(item.width - item.visible) < 0.5,
            ).length,
        )
        .toBe(width === 420 ? 1 : 3);
      await fling(page, -3.5, -40);
      yield [
        "the motion carousel resizes to 420 pixels and flings with velocity minus 3.5",
        "the motion carousel resizes to 960 pixels and flings with velocity minus 3.5",
        "the motion carousel resizes to 420 pixels and flings with velocity minus 3.5",
      ][[420, 960, 420].indexOf(width)];
      if (width === 420) await expect(host).toHaveAttribute("selected-index", "1");
      else await expect.poll(async () => Number(await host.getAttribute("selected-index"))).toBeGreaterThan(1);
      const index = Number(await host.getAttribute("selected-index"));
      const layout = createCarouselGeometry({
        variant,
        viewportSize: width,
        gap: 8,
        count: 12,
        baseSize: 280,
        preferredSize: 320,
      })!;
      await expect
        .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(index)))
        .toBeLessThan(1.5);
      await host.evaluate((element) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(0);
      });
      await expect.poll(async () => (await geometry(page)).scroll).toBeLessThan(1.5);
      yield [
        "the motion carousel settles according to the 420-pixel large-item count and returns to the start",
        "the motion carousel settles according to the 960-pixel large-item count and returns to the start",
        "the motion carousel settles according to the 420-pixel large-item count and returns to the start",
      ][[420, 960, 420].indexOf(width)];
    }
  }

  async *releaseVelocity(
    variant: "hero" | "hero-centered" | "fullscreen",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(
      carousel(variant, 6).replace(
        "--m3e-carousel-item-gap: 8px",
        "--m3e-carousel-item-gap: 8px; --m3e-carousel-height: 200px",
      ),
      direction,
    );
    const host = page.locator("m3e-carousel");
    const vertical = variant === "fullscreen";
    const offset = async () =>
      vertical
        ? host.locator(".viewport").evaluate((element: HTMLElement) => element.scrollTop)
        : (await geometry(page)).scroll;
    const sign = direction === "rtl" ? 1 : -1;
    const axis = vertical ? "y" : "x";
    const layout = createCarouselGeometry({
      variant,
      viewportSize: vertical ? 200 : 420,
      gap: vertical ? 16 : 8,
      count: 6,
      baseSize: 280,
    })!;
    const translation = vertical ? 40 : Math.min(200, layout.scrollForIndex(1) * 0.6);
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    const samples: number[] = [];
    yield `a motion carousel with release-velocity sampling for six items with variant "${variant}" and direction "${direction}"`;

    for (const speed of [0.5, 2]) {
      const motion = host.evaluate(
        (element, vertical) =>
          new Promise<number>((resolve) => {
            const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
            const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
            const read = () => (vertical ? viewport.scrollTop : Math.abs(viewport.scrollLeft));
            const ended = (event: Event) => {
              if ((event as CustomEvent<{ phase: string }>).detail.phase !== "end") return;
              gesture.removeEventListener("gesture", ended);
              element.removeAttribute("data-settle-sampling");
              const released = read();
              const started = performance.now();
              const frame = () => {
                if (performance.now() - started < 80) requestAnimationFrame(frame);
                else resolve(read() - released);
              };
              requestAnimationFrame(frame);
            };
            gesture.addEventListener("gesture", ended);
            element.setAttribute("data-settle-sampling", "");
          }),
        vertical,
      );
      await expect(host).toHaveAttribute("data-settle-sampling", "");
      await fling(page, sign * speed, sign * translation, axis);
      yield [
        "the motion carousel samples the first 80 milliseconds of a release at speed 0.5",
        "the motion carousel samples the first 80 milliseconds of a release at speed 2",
      ][[0.5, 2].indexOf(speed)];
      await expect(host).toHaveAttribute("selected-index", "1");
      samples.push(await motion);
      await expect
        .poll(async () => Math.abs((await offset()) - layout.scrollForIndex(1)), { timeout: 5000 })
        .toBeLessThan(1.5);
      await page.waitForTimeout(150);
      await expect(host).toHaveAttribute("selected-index", "1");
      await host.evaluate((element) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(0);
      });
      await expect.poll(offset).toBeLessThan(1.5);
      yield [
        "the motion carousel settles its speed 0.5 release at item 1 and resets to the start",
        "the motion carousel settles its speed 2 release at item 1 and resets to the start",
      ][[0.5, 2].indexOf(speed)];
    }
    expect(samples[1]).toBeGreaterThan(samples[0] + 30);
    yield "the motion carousel moves at least 30 pixels farther with its faster release velocity";
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(3);
    });
    await expect.poll(async () => Math.abs((await offset()) - layout.scrollForIndex(3))).toBeLessThan(1.5);
    const reverseTranslation = vertical ? translation : (layout.scrollForIndex(3) - layout.scrollForIndex(2)) * 0.6;
    await fling(page, -sign * 3, -sign * reverseTranslation, axis);
    yield "the motion carousel navigates to item 3 and releases a reverse drag with speed 3";
    await expect(host).toHaveAttribute("selected-index", "2");
    await expect.poll(async () => Math.abs((await offset()) - layout.scrollForIndex(2))).toBeLessThan(1.5);
    yield "the motion carousel settles the reversed release at item 2";
  }

  async *immediateSettle(variant: "hero" | "hero-centered" | "fullscreen"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(
      carousel(variant, 6).replace(
        "--m3e-carousel-item-gap: 8px",
        "--m3e-carousel-item-gap: 8px; --m3e-carousel-height: 200px",
      ),
    );
    const vertical = variant === "fullscreen";
    await geometry(page);
    yield `a motion carousel with six items and reduced-motion immediate settling with variant "${variant}"`;
    await fling(page, -2, vertical ? -40 : -200, vertical ? "y" : "x");
    yield "the motion carousel releases its reduced-motion drag with velocity minus 2";
    await expect(page.locator("m3e-carousel")).toHaveAttribute("selected-index", "1");
    const offset = async () =>
      vertical
        ? page.locator("m3e-carousel .viewport").evaluate((element: HTMLElement) => element.scrollTop)
        : (await geometry(page)).scroll;
    const stopped = await offset();
    expect(stopped).toBeGreaterThan(40);
    await page.waitForTimeout(200);
    expect(await offset()).toBeCloseTo(stopped, 0);
    yield "the motion carousel selects item 1 immediately and remains stopped for 200 milliseconds";
  }

  async *pointerStopsHero(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero-centered", 6));
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    yield "a motion carousel with six centered-hero items for pointer interruption";
    await fling(page, -0.5, -200);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(65);
    const host = page.locator("m3e-carousel");
    const layout = createCarouselGeometry({
      variant: "hero-centered",
      viewportSize: 420,
      gap: 8,
      count: 6,
      baseSize: 280,
    })!;
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    await page.mouse.move(box.x + 200, box.y + 100);
    await page.mouse.down();
    const stopped = (await geometry(page)).scroll;
    yield "the motion carousel presses the pointer after its hero fling passes 65 pixels";
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    yield "the motion carousel holds the interrupted hero fling position for 200 milliseconds";
    await page.mouse.up();
    yield "the motion carousel releases the pointer that interrupted its hero fling";
    await expect
      .poll(async () =>
        Math.abs(
          (await geometry(page)).scroll - layout.scrollForIndex(Number(await host.getAttribute("selected-index"))),
        ),
      )
      .toBeLessThan(1.5);
    yield "the motion carousel settles that interrupted hero fling at the selected geometry target";
  }

  async *motionStopsHero(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 6));
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    yield "a motion carousel with six animated hero items for a motion-preference interruption";
    await fling(page, -0.5, -200);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(65);
    await page.emulateMedia({ reducedMotion: "reduce" });
    yield "the motion carousel enables reduced motion after its hero fling passes 65 pixels";
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[1];
        return item.width - item.visible;
      })
      .toBeCloseTo(0, 0);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    yield "the motion carousel makes item 1 fully visible and holds its stopped hero position";
  }

  async *singleAcceleration(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 6));
    await page.locator("m3e-carousel").evaluate(
      (element) =>
        new Promise<void>((resolve) => {
          const observer = new ResizeObserver(() => {
            observer.disconnect();
            resolve();
          });
          observer.observe(element.shadowRoot!.querySelector(".viewport")!);
        }),
    );
    await page.locator("m3e-carousel").evaluate((element) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const state = element as HTMLElement & {
        samples: { time: number; offset: number }[];
        sampler: number;
      };
      state.samples = [];
      state.sampler = window.setInterval(
        () =>
          state.samples.push({
            time: performance.now(),
            offset: viewport.scrollLeft,
          }),
        100,
      );
    });
    yield "a motion carousel with multi-browse scroll sampling every 100 milliseconds";
    await fling(page, -0.6);
    await page.waitForTimeout(1700);
    const offsets = await page.locator("m3e-carousel").evaluate((element) => {
      const state = element as HTMLElement & {
        samples: { time: number; offset: number }[];
        sampler: number;
      };
      window.clearInterval(state.sampler);
      return state.samples;
    });
    yield "the motion carousel samples a velocity minus 0.6 fling for 1700 milliseconds";
    const increments = offsets
      .slice(1)
      .map((sample, index) => ((sample.offset - offsets[index].offset) * 100) / (sample.time - offsets[index].time));
    expect(offsets[offsets.length - 1].offset, JSON.stringify(offsets)).toBeGreaterThan(offsets[0].offset + 100);
    for (let index = 5; index < increments.length; index++) {
      expect(increments[index]).toBeGreaterThanOrEqual(-1);
      expect(increments[index] - increments[index - 1]).toBeLessThan(6);
    }
    yield "the motion carousel travels more than 100 pixels without a second acceleration or backward motion";
  }

  async *pointerStopsInertia(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    yield "a motion carousel with animated uncontained items for pointer interruption";
    await fling(page, -2);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(200);
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    await page.mouse.move(box.x + 200, box.y + 100);
    await page.mouse.down();
    const stopped = (await geometry(page)).scroll;
    yield "the motion carousel presses the pointer after its uncontained fling passes 200 pixels";
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThan(0);
    await page.waitForTimeout(250);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    await page.mouse.up();
    yield "the motion carousel selects a progressed item and holds inertia stopped for 250 milliseconds";
  }

  async *reducedBrowseTarget(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("multi-browse", 8));
    yield "a motion carousel with reduced-motion multi-browse fling targets";
    await fling(page, -0.4);
    yield "the motion carousel flings its reduced-motion multi-browse items at speed 0.4";
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
    yield "the motion carousel selects item 1 for its slower reduced-motion fling";
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(0);
    });
    await expect.poll(async () => (await geometry(page)).scroll).toBe(0);
    await fling(page, -1.8);
    yield "the motion carousel returns to zero and flings its reduced-motion multi-browse items at speed 1.8";
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThanOrEqual(2);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(150);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    yield "the motion carousel advances beyond one item and remains stopped for 150 milliseconds";
  }

  async *fixedSizeMotion(variant: "multi-browse" | "hero" | "hero-centered"): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel(variant, 8));
    const initial = await geometry(page);
    initial.items.forEach((item) => expect(item.visible).toBeCloseTo(item.width, 1));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    yield `a motion carousel with reduced-motion fixed-size items with variant "${variant}"`;
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 200, box.y + 100, { steps: 4 });
    yield "the motion carousel holds a 100-pixel reduced-motion pointer drag";
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(80);
    const dragged = await geometry(page);
    dragged.items.forEach((item) => expect(item.visible).toBeCloseTo(item.width, 1));
    expect(dragged.items[0].left - initial.items[0].left).toBeCloseTo(-dragged.scroll, 0);
    yield "the motion carousel keeps every dragged item fully visible and translates by the scroll offset";
    await page.mouse.up();
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    yield "the motion carousel releases its fixed-size drag and navigates to item 2";
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("2");
    const selected = await geometry(page);
    if (variant === "hero-centered") {
      expect((selected.items[2].left + selected.items[2].right) / 2).toBeCloseTo(210, 0);
    } else {
      expect(selected.items[2].left).toBeCloseTo(0, 0);
    }
    yield "the motion carousel aligns item 2 using its fixed-size variant geometry";
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(7);
    });
    yield "the motion carousel navigates to the final fixed-size item";
    await expect.poll(async () => (await geometry(page)).items[7].right).toBeCloseTo(420, 0);
    await page.waitForTimeout(150);
    await expect(page.locator("m3e-carousel")).toHaveAttribute("selected-index", "7");
    yield "the motion carousel aligns item 7 at 420 pixels and keeps final selection after 150 milliseconds";
  }

  async *motionLayoutChange(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"));
    const host = page.locator("m3e-carousel");
    yield "a motion carousel with 186-pixel multi-browse items and animated layout";
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await expect.poll(() => host.getAttribute("selected-index")).toBe("2");
    await page.emulateMedia({ reducedMotion: "reduce" });
    yield "the motion carousel selects item 2 and enables reduced-motion layout";
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[3];
        return item.width - item.visible;
      })
      .toBeCloseTo(0, 0);
    expect((await geometry(page)).items[2].left).toBeCloseTo(0, 0);
    await expect(host).toHaveAttribute("selected-index", "2");
    yield "the motion carousel keeps selection 2 aligned and makes item 3 fully visible";
    await page.emulateMedia({ reducedMotion: "no-preference" });
    yield "the motion carousel restores its animated layout preference";
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[4];
        return item.width - item.visible;
      })
      .toBeGreaterThan(1);
    await expect(host).toHaveAttribute("selected-index", "2");
    yield "the motion carousel restores item 4 masking without changing selection 2";
  }

  async *motionStopsBrowse(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8));
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    yield "a motion carousel with eight animated multi-browse items for motion interruption";
    await fling(page, -1.5);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(100);
    await page.emulateMedia({ reducedMotion: "reduce" });
    yield "the motion carousel enables reduced motion after its multi-browse fling passes 100 pixels";
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[1];
        return item.width - item.visible;
      })
      .toBeCloseTo(0, 0);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    yield "the motion carousel makes item 1 fully visible and holds its stopped multi-browse position";
  }

  async *rtlReducedAlignment(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"), "rtl");
    const host = page.locator("m3e-carousel");
    yield "a motion carousel with reduced-motion 186-pixel items in right-to-left direction";
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    yield "the motion carousel navigates to item 2 in its reduced-motion rtl layout";
    await expect.poll(async () => (await geometry(page)).items[2].right).toBeCloseTo(420, 0);
    yield "the motion carousel aligns item 2 at the 420-pixel rtl leading edge";
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(7);
    });
    yield "the motion carousel navigates to item 7 in its reduced-motion rtl layout";
    await expect.poll(async () => (await geometry(page)).items[7].left).toBeCloseTo(0, 0);
    await page.waitForTimeout(150);
    await expect(host).toHaveAttribute("selected-index", "7");
    yield "the motion carousel aligns item 7 at zero and retains selection after 150 milliseconds";
  }

  async *unsnappedMotionChange(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    yield "a motion carousel with animated 160-pixel uncontained items for preference changes";
    await page
      .locator("m3e-carousel")
      .locator(".viewport")
      .evaluate((element) => {
        element.scrollLeft = 75;
      });
    await expect.poll(async () => (await geometry(page)).scroll).toBe(75);
    yield "the motion carousel is natively scrolled to an unsnapped 75-pixel position";
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(150);
    expect((await geometry(page)).scroll).toBe(75);
    yield "the motion carousel preserves its unsnapped 75-pixel position when reduced motion is enabled";
  }

  async *reverseReleaseVelocity(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("multi-browse", 8));
    yield "a motion carousel with reduced-motion multi-browse reversed release velocity";
    await fling(page, 0.3, -600);
    yield "the motion carousel releases a minus 600-pixel drag with positive velocity 0.3";
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThanOrEqual(1);
    yield "the motion carousel does not jump back to the drag origin and selects at least item 1";
  }

  async *reducedInertia(): AsyncGenerator<string, void, unknown> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    yield "a motion carousel with reduced-motion uncontained inertia";
    await fling(page, -1);
    const stopped = (await geometry(page)).scroll;
    yield "the motion carousel releases its reduced-motion uncontained fling at velocity minus 1";
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    expect(stopped).toBeCloseTo(40, 0);
    yield "the motion carousel stays at the 40-pixel release position without continuing inertia";
  }
}
