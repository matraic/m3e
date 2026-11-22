import type { Page } from "@playwright/test";

import { createCarouselGeometry } from "../../src/carousel/CarouselGeometry";
import { expect } from "../fixtures";
import { carousel, geometry, swipePhase, traceLayouts } from "./carousel.helpers";

type Direction = "ltr" | "rtl";
type Variant = "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen";
type Flow = AsyncGenerator<void, void, unknown>;
type Render = (html: string, direction?: Direction) => Promise<void>;

export class CarouselLayoutHarness {
  private flow?: Flow;

  constructor(
    readonly page: Page,
    readonly render: Render,
  ) {}

  // A suspended flow keeps measurements local across behavioral steps. Sampling
  // loops stay together so assertions cannot change their frame-sensitive timing.
  async start(flow: Flow) {
    if (this.flow) throw new Error("A layout carousel flow is already active.");
    this.flow = flow;
    await this.advance();
  }

  async advance() {
    if (!this.flow) throw new Error("No layout carousel flow has been started.");
    const result = await this.flow.next();
    if (result.done) this.flow = undefined;
  }

  async dispose() {
    await this.flow?.return();
    this.flow = undefined;
  }

  async assertComplete() {
    if (this.flow && !(await this.flow.next()).done) {
      throw new Error("The layout carousel scenario has unexecuted checkpoints.");
    }
  }

  async *responsive() {
    const { page, render } = this;
    await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"));
    const initial = await geometry(page);
    yield;
    expect(initial.items[0].left).toBeCloseTo(0, 0);
    expect(initial.items[0].visible).toBeCloseTo(initial.items[0].width, 0);
    expect(initial.items[1].visible).toBeCloseTo(initial.items[0].visible, 0);
    expect(initial.items[2].visible).toBeLessThan(initial.items[1].visible);
    expect(initial.items[2].visible).toBeCloseTo(40, 0);
    expect(initial.items[2].right).toBeCloseTo(420, 0);
    expect(initial.items[3].left).toBeGreaterThanOrEqual(420);
    expect(initial.items[1].left - initial.items[0].right).toBeCloseTo(8, 0);
    expect(initial.items[2].left - initial.items[1].right).toBeCloseTo(8, 0);
    initial.items.forEach((item) => expect(item.width).toBeCloseTo(initial.items[0].width, 2));
    yield;
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      element.style.width = "800px";
    });
    yield;
    await expect.poll(async () => (await geometry(page)).items[2].visible).toBeGreaterThan(initial.items[2].visible);
  }

  async *leadingShrink(direction: Direction, sizing: string) {
    const { page, render } = this;
    const preferredSize = sizing === "preferred" ? 186 : undefined;
    await render(
      carousel("multi-browse", 8, "", false, preferredSize ? `--m3e-carousel-item-width:${preferredSize}px` : ""),
      direction,
    );
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const layout = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
      preferredSize,
    })!;
    const sign = direction === "rtl" ? 1 : -1;
    const startX = box.x + (direction === "rtl" ? 120 : 300);
    const leadingEdge = (item: { left: number; right: number }) => (direction === "rtl" ? 420 - item.right : item.left);
    let previous = (await geometry(page)).items[0];
    let partiallyClipped = false;
    yield;
    await page.mouse.move(startX, box.y + 100);
    await page.mouse.down();
    yield;
    for (const fraction of [0.25, 0.5, 0.75, 0.9, 0.98, 1]) {
      const distance = Math.round(layout.scrollForIndex(1) * fraction);
      await page.mouse.move(startX + sign * distance, box.y + 100, {
        steps: 4,
      });
      await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(distance, 0);
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      const current = (await geometry(page)).items[0];
      const edge = leadingEdge(current);
      expect(current.visible).toBeLessThanOrEqual(previous.visible + 0.5);
      expect(current.visible).toBeGreaterThanOrEqual(layout.smallSize - 0.5);
      expect(edge).toBeLessThanOrEqual(leadingEdge(previous) + 0.5);
      if (current.visible > layout.smallSize + 0.5) expect(edge).toBeCloseTo(0, 0);
      else partiallyClipped ||= edge < -0.5 && edge + current.visible > 0.5;
      previous = current;
    }
    expect(partiallyClipped).toBe(true);
    await page.mouse.up();
  }

  async *uncontainedSwipe() {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    const box = (await page.locator("m3e-carousel").locator(".viewport").boundingBox())!;
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    yield;
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    // Advance event timestamps explicitly so runner delays cannot slow the swipe.
    for (let step = 1; step <= 4; step++) {
      await page.clock.runFor(16);
      await page.mouse.move(box.x + 300 - step * 30, box.y + 100);
    }
    await page.clock.runFor(16);
    await page.mouse.up();
    const released = (await geometry(page)).scroll;
    yield;
    await page.clock.runFor(100);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(released + 20);
  }

  async *keylines() {
    const { page, render } = this;
    await render(carousel("hero-centered", 5));
    let result = await geometry(page);
    yield;
    expect(result.items[0].left).toBeCloseTo(0, 0);
    yield;
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    yield;
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(0);
    await page.waitForTimeout(600);
    result = await geometry(page);
    expect((result.items[2].left + result.items[2].right) / 2).toBeCloseTo(210, 0);
    yield;
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(4);
    });
    await page.waitForTimeout(600);
    yield;
    result = await geometry(page);
    expect(result.scroll).toBeCloseTo(result.max, 0);
    expect(result.items[4].right).toBeCloseTo(420, 0);
  }

  async *multiPreviews(direction: Direction, preferredSize: number) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8, "", false, `--m3e-carousel-item-width:${preferredSize}px`), direction);
    const host = page.locator("m3e-carousel");
    const layout = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
      preferredSize,
    })!;
    const largeCount = preferredSize === 186 ? 2 : 1;
    const previewCount = preferredSize === 280 ? 2 : 1;
    const logicalStart = (item: { left: number; right: number }) =>
      direction === "rtl" ? 420 - item.right : item.left;
    const logicalEnd = (item: { left: number; right: number }) => (direction === "rtl" ? 420 - item.left : item.right);
    yield;
    for (const index of [0, 1, 3, 4]) {
      await host.evaluate((element, itemIndex) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(itemIndex);
      }, index);
      await expect
        .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(index)))
        .toBeLessThan(1);
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      const result = await geometry(page);
      const visible = result.items.slice(index, index + largeCount + previewCount);
      expect(logicalStart(visible[0])).toBeCloseTo(0, 0);
      for (const item of visible.slice(0, largeCount)) expect(item.visible).toBeCloseTo(item.width, 0);
      const small = visible[visible.length - 1];
      expect(small.visible).toBeLessThan(visible[0].visible);
      if (previewCount === 2) {
        const medium = visible[largeCount];
        expect(medium.visible).toBeLessThan(visible[0].visible);
        expect(medium.visible).toBeGreaterThan(small.visible);
      }
      expect(small.visible).toBeGreaterThan(1);
      expect(logicalEnd(small)).toBeCloseTo(420, 0);
    }
    yield;
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(7);
    });
    await expect.poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(7))).toBeLessThan(1);
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    yield;
    const last = (await geometry(page)).items;
    const small = last[8 - largeCount - previewCount];
    expect(small.visible).toBeGreaterThan(1);
    expect(small.visible).toBeLessThan(last[7].visible);
    if (previewCount === 2) {
      const medium = last[7 - largeCount];
      expect(small.visible).toBeLessThan(medium.visible);
      expect(medium.visible).toBeLessThan(last[7].visible);
    }
    expect(logicalStart(small)).toBeCloseTo(0, 0);
    expect(logicalEnd(last[7])).toBeCloseTo(420, 0);
    for (const item of last.slice(8 - largeCount)) expect(item.visible).toBeCloseTo(item.width, 0);
  }

  async *trailingSwipe(direction: Direction) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(
      carousel("multi-browse", 6, "", false, "--m3e-carousel-item-width:198px").replace("width: 420px", "width: 583px"),
      direction,
    );
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const layout = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 583,
      gap: 8,
      count: 6,
      baseSize: 280,
      preferredSize: 198,
    })!;
    const logicalStart = (item: { left: number; right: number }) =>
      direction === "rtl" ? 583 - item.right : item.left;
    const logicalEnd = (item: { left: number; right: number }) => (direction === "rtl" ? 583 - item.left : item.right);
    const expectTrailingContent = async () => {
      const result = await geometry(page);
      expect(logicalEnd(result.items[5])).toBeGreaterThan(581.5);
    };
    yield;
    for (const index of [2, 3, 4, 5]) {
      await host.evaluate(async (element, itemIndex) => {
        const carousel = element as HTMLElement & {
          moveTo(index: number): void;
          updateComplete: Promise<unknown>;
        };
        carousel.moveTo(itemIndex);
        await carousel.updateComplete;
      }, index);
      await expect
        .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(index)))
        .toBeLessThan(1);
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      await expectTrailingContent();
    }
    yield;
    await host.evaluate(async (element) => {
      const carousel = element as HTMLElement & {
        moveTo(index: number): void;
        updateComplete: Promise<unknown>;
      };
      carousel.moveTo(2);
      await carousel.updateComplete;
    });
    await expect.poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(2))).toBeLessThan(1);
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    const initial = await geometry(page);
    const startScroll = initial.scroll;
    let previousPosition = logicalStart(initial.items[4]);
    const box = (await viewport.boundingBox())!;
    const sign = direction === "rtl" ? 1 : -1;
    const startX = box.x + (direction === "rtl" ? 130 : 450);
    await page.mouse.move(startX, box.y + 100);
    await page.mouse.down();
    yield;
    for (const distance of [40, 80, 120, 160, 200]) {
      await page.mouse.move(startX + sign * distance, box.y + 100, {
        steps: 4,
      });
      await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(startScroll + distance, 0);
      await page.evaluate(
        () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
      );
      await expectTrailingContent();
      const position = logicalStart((await geometry(page)).items[4]);
      expect(position).toBeLessThan(previousPosition - 0.5);
      previousPosition = position;
    }
    await page.mouse.up();
  }

  async *everySelection(direction: Direction) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"), direction);
    const host = page.locator("m3e-carousel");
    yield;
    for (let index = 0; index < 8; index++) {
      await host.evaluate((element, itemIndex) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(itemIndex);
      }, index);
      await expect
        .poll(async () => {
          const item = (await geometry(page)).items[index];
          return Math.max(-item.left, item.right - 420, item.width - item.visible);
        })
        .toBeLessThan(1.5);
    }
    yield;
    const last = (await geometry(page)).items[7];
    expect(direction === "rtl" ? Math.abs(last.left) : Math.abs(last.right - 420)).toBeLessThan(1.5);
  }

  async *startHero() {
    const { page, render } = this;
    await render(carousel("hero", 5));
    yield;
    const result = await geometry(page);
    yield;
    expect(result.items[0].left).toBeCloseTo(0, 0);
    expect(result.items[0].visible).toBeGreaterThan(result.items[1].visible);
    expect(result.items[1].visible).toBeGreaterThan(0);
    expect(result.items[1].right).toBeLessThanOrEqual(421);
    expect(result.items[1].left - result.items[0].right).toBeCloseTo(8, 0);
  }

  async *roundedCuts(variant: Variant, direction: Direction) {
    const { page, render } = this;
    await render(carousel(variant, 8, 'selected-index="2"'), direction);
    await geometry(page);
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
    })!;
    const start = layout.scrollForIndex(2);
    await expect
      .poll(async () => Math.abs((await viewport.evaluate((element) => Math.abs(element.scrollLeft))) - start))
      .toBeLessThan(1);
    const distance = layout.scrollForIndex(3) - start;
    const cuts = { leading: 0, trailing: 0 };
    yield;
    await swipePhase(page, "start", 0);
    yield;
    for (const fraction of [0.05, 0.25, 0.75, 0.95, 0.75, 0.25, 0.05]) {
      await swipePhase(page, "update", (direction === "ltr" ? -1 : 1) * distance * fraction);
      const scroll = await viewport.evaluate((element) => Math.abs(element.scrollLeft));
      const expected = layout.itemsAt(scroll);
      for (const [index, item] of expected.entries()) {
        const left = item.position - item.size / 2;
        const right = item.position + item.size / 2;
        const visible = Math.min(420, right) - Math.max(0, left);
        if (visible <= 1 || visible >= item.size - 1) continue;
        cuts[left < 0 ? "leading" : "trailing"]++;
        const action = host.locator("m3e-carousel-item").nth(index).getByRole("button");
        const bounds = (await action.boundingBox())!;
        expect(bounds.width).toBeCloseTo(item.size, 0);
        expect(bounds.width).toBeGreaterThanOrEqual(layout.smallSize - 0.1);
        expect((await action.locator(".base").boundingBox())!.width).toBeCloseTo(item.size, 0);
        expect((await action.locator(".content").boundingBox())!.width).toBeCloseTo(layout.itemSize, 0);
        const hits = await action.evaluate(
          (element, { cutLeft, visible }) => {
            const rect = element.getBoundingClientRect();
            const item = (element.getRootNode() as ShadowRoot).host;
            const inner = cutLeft ? rect.right - 1 : rect.left + 1;
            const outside = cutLeft ? rect.right - visible - 1 : rect.left + visible + 1;
            return [
              [inner, rect.top + 1],
              [inner, rect.bottom - 1],
              [inner, rect.top + rect.height / 2],
              [outside, rect.top + rect.height / 2],
            ].map(([x, y]) => document.elementFromPoint(x, y) === item);
          },
          { cutLeft: left < 0 === (direction === "ltr"), visible },
        );
        expect(hits).toEqual([false, false, true, false]);
      }
    }
    await swipePhase(page, "cancel", 0);
    expect(cuts.leading).toBeGreaterThan(0);
    expect(cuts.trailing).toBeGreaterThan(0);
  }

  async *firstActionClip(direction: Direction) {
    const { page, render } = this;
    await render(carousel("multi-browse"), direction);
    await geometry(page);
    const layout = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
    })!;
    const action = page.locator("m3e-carousel-item").first().getByRole("button");
    const surface = action.locator(".base");
    let previousWidth = (await surface.boundingBox())!.width;
    let partiallyClipped = false;
    const viewport = (await page.locator("m3e-carousel").locator(".viewport").boundingBox())!;
    yield;
    await swipePhase(page, "start", 0);
    yield;
    for (const fraction of [0.25, 0.5, 0.75, 0.9, 0.98, 1]) {
      await swipePhase(page, "update", (direction === "ltr" ? -1 : 1) * layout.scrollForIndex(1) * fraction);
      const bounds = (await action.boundingBox())!;
      const width = (await surface.boundingBox())!.width;
      const visible = Math.min(bounds.x + bounds.width, viewport.x + viewport.width) - Math.max(bounds.x, viewport.x);
      partiallyClipped ||= visible > 1 && visible < layout.smallSize - 1;
      expect(bounds.width).toBeGreaterThanOrEqual(layout.smallSize - 0.1);
      expect(width).toBeLessThanOrEqual(previousWidth + 0.1);
      expect(width).toBeGreaterThanOrEqual(layout.smallSize - 0.1);
      if (width > layout.smallSize + 0.1) {
        expect(visible).toBeCloseTo(bounds.width, 0);
        await expect(action).toHaveCSS("clip-path", "none");
      }
      previousWidth = width;
    }
    expect(previousWidth).toBeCloseTo(layout.smallSize, 0);
    expect(partiallyClipped).toBe(true);
    await swipePhase(page, "cancel", 0);
  }

  async *wideHero(variant: Variant, direction: Direction) {
    const { page, render } = this;
    await render(carousel(variant, 8, "", false, "--m3e-carousel-item-width:320px"), direction);
    const host = page.locator("m3e-carousel");
    const counts = async () => {
      const result = await geometry(page);
      const extent = await host.evaluate((element) => element.clientWidth);
      const visible = result.items.filter((item) => item.right > 0.5 && item.left < extent - 0.5);
      return {
        large: visible.filter((item) => Math.abs(item.visible - item.width) < 0.5).length,
        small: visible.filter((item) => item.visible >= 39.5 && item.visible <= 56.5).length,
      };
    };
    const small = variant === "hero-centered" ? 2 : 1;
    yield;
    await expect.poll(counts).toEqual({ large: 1, small });
    yield;
    await host.evaluate((element: HTMLElement) => (element.style.width = "960px"));
    yield;
    await expect.poll(counts).toEqual({ large: 3, small });
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 960,
      gap: 8,
      count: 8,
      baseSize: 280,
      preferredSize: 320,
    })!;
    for (const index of [3, 7]) {
      await host.evaluate((element, index) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(index);
      }, index);
      await expect
        .poll(async () => {
          const result = await geometry(page);
          return Math.abs(result.scroll - layout.scrollForIndex(index));
        })
        .toBeLessThan(1);
      await expect.poll(counts).toEqual({ large: 3, small });
    }
  }

  async *cssLimits() {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero-centered", 5));
    const host = page.locator("m3e-carousel");
    yield;
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-small-item-min-width", "4rem");
      element.style.setProperty("--m3e-carousel-small-item-max-width", "4rem");
    });
    yield;
    await expect.poll(async () => (await geometry(page)).items[1].visible).toBeCloseTo(64, 0);
    yield;
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    yield;
    await expect
      .poll(async () => {
        const result = await geometry(page);
        return Math.abs(result.scroll - result.max / 2);
      })
      .toBeLessThan(1.5);
    const result = await geometry(page);
    expect(result.items[1].visible).toBeCloseTo(64, 0);
    expect(result.items[3].visible).toBeCloseTo(64, 0);
    expect(result.items[2].visible).toBeGreaterThan(64);
  }

  async *twoSwipes() {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero-centered", 5));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const initialPreview = (await geometry(page)).items[1].visible;
    const layout = createCarouselGeometry({
      variant: "hero-centered",
      viewportSize: 420,
      gap: 8,
      count: 5,
      baseSize: 280,
    })!;
    yield;
    for (const index of [1, 2]) {
      await page.mouse.move(box.x + 340, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 80, box.y + 100, { steps: 8 });
      await page.mouse.up();
      await expect.poll(() => host.getAttribute("selected-index")).toBe(String(index));
      await expect
        .poll(async () => {
          const result = await geometry(page);
          return Math.abs(result.scroll - layout.scrollForIndex(index));
        })
        .toBeLessThan(1.5);
      await expect.poll(async () => (await geometry(page)).items[index - 1].visible).toBeCloseTo(initialPreview, 0);
      await expect.poll(async () => (await geometry(page)).items[index + 1].visible).toBeCloseTo(initialPreview, 0);
    }
    yield;
    const result = await geometry(page);
    expect(initialPreview).toBeGreaterThanOrEqual(39);
    expect(result.items[1].visible).toBeCloseTo(initialPreview, 0);
    expect(result.items[3].visible).toBeCloseTo(initialPreview, 0);
  }

  async *percentageLimit() {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 8));
    const host = page.locator("m3e-carousel");
    yield;
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-large-item-max-width", "50%");
    });
    yield;
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeLessThanOrEqual(210);
    const result = await geometry(page);
    expect(result.items[1].visible).toBeCloseTo(result.items[0].visible, 0);
    expect(result.items[2].visible).toBeGreaterThanOrEqual(39);
    expect(result.items[2].visible).toBeLessThanOrEqual(57);
    expect(result.items[2].right).toBeCloseTo(420, 0);
  }

  async *roundedPreviews(variant: Variant, direction: Direction) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 5), direction);
    const host = page.locator("m3e-carousel");
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 420,
      gap: 8,
      count: 5,
      baseSize: 280,
    })!;
    yield;
    for (const index of [0, 2, 4]) {
      await host.evaluate((element, selection) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(selection);
      }, index);
      if (index === 0) yield;
      await expect
        .poll(async () => {
          const result = await geometry(page);
          return Math.abs(result.scroll - layout.scrollForIndex(index));
        })
        .toBeLessThan(1.5);
      await expect
        .poll(async () => {
          const result = await geometry(page);
          return Math.max(...result.items.filter((_, itemIndex) => itemIndex !== index).map((item) => item.visible));
        })
        .toBeLessThanOrEqual(57);
      const result = await geometry(page);
      const selected = result.items[index];
      if (variant === "hero" && index < 4) {
        expect(Math.abs(direction === "ltr" ? selected.left : 420 - selected.right)).toBeLessThan(1.5);
        if (index > 0) {
          const previous = result.items[index - 1];
          expect(direction === "ltr" ? previous.right : 420 - previous.left).toBeLessThanOrEqual(1.5);
        }
      }
      if (index === 4) expect(Math.abs(direction === "ltr" ? 420 - selected.right : selected.left)).toBeLessThan(1.5);
      const previews = result.items
        .map((item, itemIndex) => ({ ...item, index: itemIndex }))
        .filter(
          (item) => item.visible < selected.visible - 1 && Math.min(item.right, 420) - Math.max(item.left, 0) > 1,
        );
      expect(previews).toHaveLength(variant === "hero-centered" ? 2 : 1);
      for (const preview of previews) {
        expect(preview.visible).toBeLessThanOrEqual(57);
        expect(preview.left).toBeGreaterThanOrEqual(-1.5);
        expect(preview.right).toBeLessThanOrEqual(421.5);
        const corners = await host
          .locator("m3e-carousel-item")
          .nth(preview.index)
          .evaluate((item) => {
            const element = item as HTMLElement;
            const rect = element.getBoundingClientRect();
            const inset = Number.parseFloat(element.style.getPropertyValue("--_carousel-clip").split(" ")[1]);
            const hit = (x: number, y: number) =>
              document.elementFromPoint(x, y)?.closest("m3e-carousel-item") === item;
            return {
              center: hit(rect.left + rect.width / 2, rect.top + rect.height / 2),
              left: hit(rect.left + inset + 1, rect.top + 1),
              right: hit(rect.right - inset - 1, rect.top + 1),
            };
          });
        expect(corners).toEqual({ center: true, left: false, right: false });
      }
    }
  }

  async *lastHero() {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("hero", 5));
    yield;
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(4);
    });
    yield;
    await expect.poll(async () => Math.abs((await geometry(page)).items[4].right - 420)).toBeLessThan(1.5);
  }

  async *heroMasks() {
    const { page, render } = this;
    await render(carousel("hero", 5));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const before = await geometry(page);
    yield;
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 210, box.y + 100, { steps: 6 });
    yield;
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(50);
    const during = await geometry(page);
    expect(during.items[0].width).toBeCloseTo(before.items[0].width, 2);
    expect(during.items[1].visible - before.items[1].visible).toBeGreaterThan(1);
    await page.mouse.up();
  }

  async *incomingHero(variant: Variant, direction: Direction) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 5), direction);
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const initial = await geometry(page);
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 420,
      gap: 8,
      count: 5,
      baseSize: 280,
    })!;
    const distance = layout.scrollForIndex(1) / 2;
    const startX = box.x + (direction === "ltr" ? 350 : 70);
    yield;
    await page.mouse.move(startX, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(startX + (direction === "ltr" ? -distance : distance), box.y + 100, { steps: 8 });
    yield;
    await expect.poll(async () => Math.abs((await geometry(page)).scroll - distance)).toBeLessThan(2);
    const during = await geometry(page);
    const expected = layout.itemsAt(during.scroll);
    for (const index of [0, 1]) expect(during.items[index].visible).toBeCloseTo(expected[index].size, 0);
    expect(during.items[0].visible).toBeLessThan(initial.items[0].visible);
    expect(during.items[1].visible).toBeGreaterThan(initial.items[1].visible);
    expect(during.items[0].width).toBeCloseTo(initial.items[0].width, 2);
    expect(during.items[1].width).toBeCloseTo(initial.items[1].width, 2);
    expect(
      direction === "ltr" ? during.items[1].left - during.items[0].right : during.items[0].left - during.items[1].right,
    ).toBeCloseTo(8, 0);
    const third = during.items[2];
    const revealed = Math.min(third.right, 420) - Math.max(third.left, 0);
    expect(revealed).toBeGreaterThan(1);
    expect(revealed).toBeLessThanOrEqual(56.5);
    await page.mouse.up();
  }

  async *departedPreview(variant: Variant, action: "button" | "swipe") {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 5));
    const host = page.locator("m3e-carousel");
    await host.evaluate((element: HTMLElement) => {
      element.style.width = "800px";
    });
    await expect.poll(async () => (await geometry(page)).items[0].width).toBeGreaterThan(700);
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 800,
      gap: 8,
      count: 5,
      baseSize: 280,
    })!;
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(1);
    });
    await expect
      .poll(async () => {
        const result = await geometry(page);
        return Math.abs(result.scroll - layout.scrollForIndex(1));
      })
      .toBeLessThan(1.5);
    await page.waitForTimeout(100);
    yield;
    const frames = await host.evaluate(async (element, trigger) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const preview = element.querySelector<HTMLElement>("m3e-carousel-item")!;
      const samples: { visible: number; scroll: number }[] = [];
      const record = () => {
        const bounds = viewport.getBoundingClientRect();
        const rect = preview.getBoundingClientRect();
        const inset = Number.parseFloat(preview.style.getPropertyValue("--_carousel-clip").split(" ")[1]) || 0;
        samples.push({
          visible: Math.max(0, Math.min(rect.right - inset, bounds.right) - Math.max(rect.left + inset, bounds.left)),
          scroll: Math.abs(viewport.scrollLeft),
        });
      };
      record();
      if (trigger === "button") {
        const button = document.createElement("button");
        button.textContent = "Next item";
        button.addEventListener("click", () => {
          (element as HTMLElement & { moveNext(): void }).moveNext();
        });
        element.after(button);
        button.click();
      } else {
        const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
        for (const phase of ["start", "update", "end"]) {
          gesture.dispatchEvent(
            new CustomEvent("gesture", {
              detail: {
                gestureName: "swipe",
                inputId: 1,
                timestamp: performance.now(),
                phase,
                axis: "x",
                direction: "left",
                startClientX: 0,
                startClientY: 0,
                startLocalX: 0,
                startLocalY: 0,
                translationX: phase === "start" ? 0 : -500,
                translationY: 0,
                velocityX: -1.5,
                velocityY: 0,
                speed: 1.5,
                displacement: 500,
                duration: 50,
              },
            }),
          );
        }
      }
      const started = performance.now();
      await new Promise<void>((resolve) => {
        const frame = () => {
          record();
          if (performance.now() - started < 900) requestAnimationFrame(frame);
          else resolve();
        };
        requestAnimationFrame(frame);
      });
      return samples;
    }, action);
    yield;
    expect(frames[frames.length - 1].scroll - frames[0].scroll).toBeGreaterThan(100);
    if (variant === "hero-centered") expect(frames[0].visible).toBeGreaterThan(39);
    let departed = false;
    let previousVisible = frames[0].visible;
    for (const frame of frames) {
      expect(frame.visible).toBeLessThanOrEqual(previousVisible + 0.5);
      previousVisible = frame.visible;
      if (frame.visible < 1) departed = true;
      if (departed) expect(frame.visible).toBeLessThan(1.5);
    }
    expect(departed).toBe(true);
  }

  async *singleHero() {
    const { page, render } = this;
    await render(carousel("hero-centered", 1));
    yield;
    const result = await geometry(page);
    yield;
    expect(result.items[0].visible).toBeCloseTo(420, 0);
    expect(result.max).toBe(0);
  }

  async *emptyHero() {
    const { page, render } = this;
    await render(carousel("hero", 0));
    yield;
    await page.locator("m3e-carousel").evaluate((element) => {
      const item = document.createElement("m3e-carousel-item");
      item.textContent = "First";
      element.append(item);
    });
    yield;
    await expect.poll(async () => (await geometry(page)).items[0]?.visible).toBeCloseTo(420, 0);
  }

  async *smallerPreferredHero(variant: Variant) {
    const { page, render } = this;
    await render(carousel(variant, 8, "", false, "--m3e-carousel-item-width:180px"));
    const host = page.locator("m3e-carousel");
    yield;
    await host.evaluate((element: HTMLElement) => {
      element.style.width = "800px";
    });
    await expect.poll(async () => (await geometry(page)).items[0].width).toBeLessThan(300);
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(3);
    });
    await page.waitForTimeout(600);
    yield;
    const result = await geometry(page);
    const visible = result.items.filter((item) => item.left >= -1 && item.right <= 801 && item.visible > 0);
    const largest = Math.max(...visible.map((item) => item.visible));
    expect(visible.filter((item) => item.visible >= largest - 1).length).toBeGreaterThanOrEqual(2);
  }

  async *shortWideHero(direction: Direction) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero-centered", 4, "", true, "--m3e-carousel-item-width:320px"), direction);
    const host = page.locator("m3e-carousel");
    await host.evaluate((element: HTMLElement) => {
      element.style.width = "932px";
    });
    await expect.poll(async () => (await geometry(page)).items[0].width).toBeGreaterThan(240);
    const viewport = host.locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const sign = direction === "rtl" ? 1 : -1;
    const start = box.x + box.width / 2;
    const first = await geometry(page);
    let previous = first.items.map((item) => (item.left + item.right) / 2);
    expect(first.items[3].visible).toBeLessThan(first.items[0].visible);
    yield;
    await page.mouse.move(start, box.y + box.height / 2);
    await page.mouse.down();
    yield;
    for (const distance of [12, 24, 36, 48]) {
      await page.mouse.move(start + sign * distance, box.y + box.height / 2);
      await expect.poll(async () => Math.abs((await geometry(page)).scroll - distance)).toBeLessThan(1.5);
      const current = (await geometry(page)).items.map((item) => (item.left + item.right) / 2);
      current.forEach((position, index) => {
        expect((position - previous[index]) * sign).toBeGreaterThan(0.1);
      });
      previous = current;
    }
    await page.mouse.up();
  }

  async *uncontainedCap() {
    const { page, render } = this;
    await render(carousel("uncontained", 3, "", false, "--m3e-carousel-item-width:600px"));
    yield;
    const result = await geometry(page);
    yield;
    expect(result.items[0].width).toBeCloseTo(420, 0);
    expect(result.items[0].visible).toBeCloseTo(420, 0);
  }

  async *variantSizing() {
    const { page, render } = this;
    await render(carousel("uncontained", 5, "", false, "--m3e-carousel-item-width:160px"));
    const host = page.locator("m3e-carousel");
    yield;
    for (const variant of ["uncontained", "multi-browse", "hero", "hero-centered"] as const) {
      await host.evaluate((element, variant) => element.setAttribute("variant", variant), variant);
      const layout = createCarouselGeometry({
        variant,
        viewportSize: 420,
        count: 5,
        gap: 8,
        baseSize: 160,
        preferredSize: 160,
      })!;
      await expect
        .poll(async () => Math.abs((await geometry(page)).items[0].width - layout.itemSize))
        .toBeLessThan(0.1);
    }
    yield;
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-height", "200px");
      element.setAttribute("variant", "fullscreen");
    });
    yield;
    await expect.poll(async () => (await host.locator("m3e-carousel-item").first().boundingBox())!.height).toBe(200);
  }

  async *containerSizing() {
    const { page, render } = this;
    await render(`
      <style>
        #sizing { container-type: inline-size; width: 600px; --m3e-carousel-item-width: calc(10rem + 6px); }
        @container (max-width: 500px) { m3e-carousel { --m3e-carousel-item-width: 12rem; } }
      </style>
      <div id="sizing">${carousel("uncontained", 5)}</div>
    `);
    const host = page.locator("m3e-carousel");
    const width = async () => (await geometry(page)).items[0].width;
    yield;
    await expect.poll(width).toBe(166);
    yield;
    await page.locator("#sizing").evaluate((element: HTMLElement) => {
      element.style.width = "400px";
    });
    yield;
    await expect.poll(width).toBe(192);
    expect(await host.locator(".viewport").evaluate((element) => element.clientWidth)).toBe(420);
    yield;
    await host.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-width", "50%"));
    yield;
    await expect.poll(width).toBe(210);
    yield;
    await host.evaluate((element: HTMLElement) => {
      element.style.width = "600px";
    });
    yield;
    await expect.poll(width).toBe(300);
    yield;
    await host.evaluate((element: HTMLElement) => element.style.removeProperty("--m3e-carousel-item-width"));
    yield;
    await expect.poll(width).toBe(192);
  }

  async *inheritedPreference(variant: Variant) {
    const { page, render } = this;
    await render(`<div id="sizing" style="--m3e-carousel-item-width:186px">
        ${carousel(variant, 8)}
      </div>`);
    yield;
    for (const preferredSize of [186, 328, undefined]) {
      await page.locator("#sizing").evaluate((element: HTMLElement, preferredSize) => {
        if (preferredSize === undefined) element.style.removeProperty("--m3e-carousel-item-width");
        else element.style.setProperty("--m3e-carousel-item-width", `calc(${preferredSize / 16}rem)`);
      }, preferredSize);
      if (preferredSize === 186) yield;
      const layout = createCarouselGeometry({
        variant,
        viewportSize: 420,
        count: 8,
        gap: 8,
        baseSize: 280,
        preferredSize,
      })!;
      await expect
        .poll(async () => Math.abs((await geometry(page)).items[0].width - layout.itemSize))
        .toBeLessThan(0.1);
    }
  }

  async *duplicatePresentation() {
    const { page, render } = this;
    await render(carousel("uncontained", 32, "", false, "--m3e-carousel-item-width:160px"));
    await geometry(page);
    yield;
    const result = await page.locator("m3e-carousel").evaluate(async (element) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
      const styles = new Set([...element.querySelectorAll<HTMLElement>("m3e-carousel-item")].map((item) => item.style));
      const invariant = new Set([
        "flex-basis",
        "--_carousel-inset-y",
        "--_carousel-inset-left",
        "--_carousel-inset-right",
        "--_carousel-surface-left",
        "--_carousel-surface-right",
        "--_carousel-title-opacity",
        "--_carousel-subtitle-opacity",
      ]);
      const counts = { reads: 0, invariantReads: 0, writes: 0 };
      const get = CSSStyleDeclaration.prototype.getPropertyValue;
      const set = CSSStyleDeclaration.prototype.setProperty;
      const send = (phase: string, translationX: number) =>
        gesture.dispatchEvent(
          new CustomEvent("gesture", {
            detail: {
              phase,
              axis: "x",
              translationX,
              translationY: 0,
              velocityX: 0,
              velocityY: 0,
            },
          }),
        );
      send("start", 0);
      CSSStyleDeclaration.prototype.getPropertyValue = function (name) {
        if (styles.has(this)) {
          counts.reads++;
          if (invariant.has(name)) counts.invariantReads++;
        }
        return get.call(this, name);
      };
      CSSStyleDeclaration.prototype.setProperty = function (name, value, priority) {
        if (styles.has(this)) counts.writes++;
        return set.call(this, name, value, priority);
      };
      try {
        send("update", -40);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        const updated = { ...counts };
        viewport.dispatchEvent(new Event("scroll"));
        const duplicate = { ...counts };
        send("update", -80);
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        return {
          updated,
          duplicate,
          next: { ...counts },
          scroll: viewport.scrollLeft,
        };
      } finally {
        CSSStyleDeclaration.prototype.getPropertyValue = get;
        CSSStyleDeclaration.prototype.setProperty = set;
        send("cancel", -80);
      }
    });
    yield;
    expect(result.updated.writes).toBeGreaterThan(0);
    expect(result.duplicate).toEqual(result.updated);
    expect(result.next.invariantReads).toBe(0);
    expect(result.next.reads).toBeLessThan(32);
    expect(result.scroll).toBe(80);
  }

  async *descendantStyles() {
    const { page, render } = this;
    await render(carousel("hero-centered", 32, 'selected-index="3"'));
    await geometry(page);
    yield;
    const maxStyledElements = await traceLayouts(
      page,
      () =>
        page.locator("m3e-carousel").evaluate(async (element) => {
          const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
          const send = (phase: string, distance: number) =>
            gesture.dispatchEvent(
              new CustomEvent("gesture", {
                detail: {
                  phase,
                  axis: "x",
                  translationX: -distance,
                  velocityX: 0,
                  velocityY: 0,
                },
              }),
            );
          await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          send("start", 0);
          for (let frame = 1; frame <= 8; frame++) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            send("update", frame * 4);
          }
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        }),
      false,
    );
    yield;
    expect(maxStyledElements).toBeGreaterThan(0);
    expect(maxStyledElements).toBeLessThan(128);
  }

  async *tracedFling(variant: Variant, direction: Direction) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(
      carousel(variant, 8, "", false, variant === "hero-centered" ? "--m3e-carousel-item-width:160px" : ""),
      direction,
    );
    const initial = await geometry(page);
    if (variant === "hero-centered") {
      expect(initial.items.filter((item) => Math.abs(item.width - item.visible) < 0.5).length).toBe(2);
    }
    yield;
    await traceLayouts(
      page,
      () =>
        page.locator("m3e-carousel").evaluate(
          async (element, { vertical, rtl }) => {
            const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
            const sign = rtl ? 1 : -1;
            const send = (phase: string, distance: number) =>
              gesture.dispatchEvent(
                new CustomEvent("gesture", {
                  detail: {
                    phase,
                    axis: vertical ? "y" : "x",
                    translationX: vertical ? 0 : sign * distance,
                    translationY: vertical ? -distance : 0,
                    velocityX: vertical ? 0 : sign * 0.3,
                    velocityY: vertical ? -0.3 : 0,
                  },
                }),
              );
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            send("start", 0);
            for (let frame = 1; frame <= 20; frame++) {
              await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
              send("update", frame * 4);
            }
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            send("end", 80);
            await new Promise<void>((resolve) => setTimeout(resolve, 1500));
          },
          { vertical: variant === "fullscreen", rtl: direction === "rtl" },
        ),
      false,
    );
    yield;
    await expect
      .poll(() =>
        page
          .locator("m3e-carousel")
          .locator(".viewport")
          .evaluate(
            (element, vertical) => (vertical ? element.scrollTop : Math.abs(element.scrollLeft)),
            variant === "fullscreen",
          ),
      )
      .toBeGreaterThan(80);
  }

  async *tracedPointer(direction: Direction) {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 16, "", true, "width:800px"), direction);
    await geometry(page);
    const bounds = await page.locator("m3e-carousel").boundingBox();
    const y = bounds!.y + bounds!.height / 2;
    const start = bounds!.x + (direction === "rtl" ? 70 : bounds!.width - 70);
    const end = bounds!.x + (direction === "rtl" ? bounds!.width - 70 : 70);
    await page.mouse.move(start, y);
    const firstItem = page.locator("m3e-carousel-item").first();
    yield;
    await traceLayouts(page, async () => {
      await page.mouse.down();
      await page.mouse.move(end, y, { steps: 30 });
      expect(
        await firstItem.evaluate((element: HTMLElement) => element.style.getPropertyValue("--_carousel-surface-clip")),
      ).not.toBe("none");
      await page.mouse.move(start + (direction === "rtl" ? -40 : 40), y, {
        steps: 30,
      });
      await page.mouse.move(start + (direction === "rtl" ? 40 : -40), y, {
        steps: 30,
      });
      expect(
        await firstItem.evaluate((element: HTMLElement) => element.style.getPropertyValue("--_carousel-surface-clip")),
      ).toBe("none");
    });
    await page.mouse.up();
    yield;
    await expect
      .poll(() =>
        page
          .locator("m3e-carousel")
          .locator(".viewport")
          .evaluate((element) => Math.abs(element.scrollLeft)),
      )
      .toBeGreaterThan(0);
  }

  async *rapidReversal(variant: Variant) {
    const { page, render } = this;
    await render(carousel(variant));
    yield;
    await geometry(page);
    yield;
    await traceLayouts(page, () =>
      page.locator("m3e-carousel").evaluate(async (element) => {
        const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
        const send = (phase: string, distance: number) =>
          gesture.dispatchEvent(
            new CustomEvent("gesture", {
              detail: {
                phase,
                axis: "x",
                translationX: -distance,
                velocityX: 0,
                velocityY: 0,
              },
            }),
          );
        send("start", 0);
        for (let pass = 0; pass < 8; pass++) {
          for (let frame = 0; frame < 8; frame++) {
            await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
            for (let update = 1; update <= 3; update++) {
              const progress = (frame * 3 + update) / 24;
              send("update", (pass % 2 ? 1 - progress : progress) * 320);
            }
          }
        }
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        send("end", 0);
      }),
    );
  }

  async *cachedNavigation() {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 8, "", false, "--m3e-carousel-item-width:186px"));
    const host = page.locator("m3e-carousel");
    await expect.poll(async () => (await geometry(page)).items[0].width).toBeGreaterThan(0);
    yield;
    const result = await host.evaluate(async (element: HTMLElement & { moveTo(index: number): void }) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const computedStyle = window.getComputedStyle;
      const bounds = Element.prototype.getBoundingClientRect;
      const counts = { styles: 0, bounds: 0, dimensions: 0 };
      window.getComputedStyle = (target, pseudo) => {
        if (target === element || target.getRootNode() === element.shadowRoot) counts.styles++;
        return computedStyle(target, pseudo);
      };
      Element.prototype.getBoundingClientRect = function () {
        if (this.getRootNode() === element.shadowRoot) counts.bounds++;
        return bounds.call(this);
      };
      for (const name of ["clientWidth", "clientHeight"]) {
        const getter = Object.getOwnPropertyDescriptor(Element.prototype, name)!.get!;
        Object.defineProperty(viewport, name, {
          configurable: true,
          get() {
            counts.dimensions++;
            return getter.call(this);
          },
        });
      }
      try {
        element.moveTo(7);
        await new Promise<void>((resolve) => {
          const started = performance.now();
          const sample = () => {
            if (performance.now() - started < 450) requestAnimationFrame(sample);
            else resolve();
          };
          requestAnimationFrame(sample);
        });
        return { ...counts, scroll: Math.abs(viewport.scrollLeft) };
      } finally {
        window.getComputedStyle = computedStyle;
        Element.prototype.getBoundingClientRect = bounds;
        for (const name of ["clientWidth", "clientHeight"]) Reflect.deleteProperty(viewport, name);
      }
    });
    yield;
    expect(result.scroll).toBeGreaterThan(0);
    expect(result.bounds).toBe(0);
    expect(result.dimensions).toBe(0);
    expect(result.styles).toBeLessThanOrEqual(2);
    await expect(host).toHaveAttribute("selected-index", "7");
  }

  async *resizeSelection(variant: Variant, direction: Direction) {
    const { page, render } = this;
    await render(
      carousel(
        variant,
        8,
        'selected-index="2"',
        false,
        "--m3e-carousel-item-width:320px;--m3e-carousel-height:256px;--m3e-carousel-item-scrim-opacity:0.65",
      )
        .replace("width: 420px", "width: 900px")
        .replace(
          /Item \d+/g,
          '<img alt=""><span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>',
        ),
      direction,
    );
    const host = page.locator("m3e-carousel");
    const initial = createCarouselGeometry({
      variant,
      viewportSize: variant === "fullscreen" ? 256 : 900,
      count: 8,
      gap: variant === "fullscreen" ? 16 : 8,
      baseSize: 320,
      preferredSize: 320,
    })!;
    const offset = () =>
      host
        .locator(".viewport")
        .evaluate(
          (element, vertical) => (vertical ? element.scrollTop : Math.abs(element.scrollLeft)),
          variant === "fullscreen",
        );
    await expect.poll(async () => Math.abs((await offset()) - initial.scrollForIndex(2))).toBeLessThan(1);
    yield;
    await traceLayouts(page, () =>
      host.evaluate(async (element: HTMLElement) => {
        for (let index = 0; index < 20; index++) {
          element.style.width = `${900 - index * 20}px`;
          element.style.setProperty("--m3e-carousel-height", `${256 + index * 2}px`);
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        }
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }),
    );
    yield;
    const resized = createCarouselGeometry({
      variant,
      viewportSize: variant === "fullscreen" ? 294 : 520,
      count: 8,
      gap: variant === "fullscreen" ? 16 : 8,
      baseSize: 320,
      preferredSize: 320,
    })!;
    await expect.poll(async () => Math.abs((await offset()) - resized.scrollForIndex(2))).toBeLessThan(1);
    await expect(host).toHaveAttribute("selected-index", "2");
    await expect(host.locator("m3e-carousel-item").nth(2).locator(".title")).toHaveCSS("opacity", "1");
  }

  async *simultaneousResize(direction: Direction) {
    const { page, render } = this;
    const variants = ["multi-browse", "hero", "hero-centered", "uncontained", "fullscreen"] as const;
    await render(
      variants
        .map((variant) =>
          carousel(
            variant,
            8,
            'selected-index="2"',
            false,
            "--m3e-carousel-item-width:320px;--m3e-carousel-height:256px;--m3e-carousel-item-scrim-opacity:0.65",
          )
            .replace("width: 420px", "width: 900px")
            .replace(
              /Item \d+/g,
              '<img alt=""><span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>',
            ),
        )
        .join(""),
      direction,
    );
    const hosts = page.locator("m3e-carousel");
    const checkSelection = async (width: number, height: number, skipFirst = false) => {
      for (const [index, variant] of variants.entries()) {
        if (skipFirst && index === 0) continue;
        const layout = createCarouselGeometry({
          variant,
          viewportSize: variant === "fullscreen" ? height : width,
          count: 8,
          gap: variant === "fullscreen" ? 16 : 8,
          baseSize: 320,
          preferredSize: 320,
        })!;
        const host = page.locator(`m3e-carousel[variant="${variant}"]`);
        await expect
          .poll(async () =>
            Math.abs(
              (await host
                .locator(".viewport")
                .evaluate(
                  (element, vertical) => (vertical ? element.scrollTop : Math.abs(element.scrollLeft)),
                  variant === "fullscreen",
                )) - layout.scrollForIndex(2),
            ),
          )
          .toBeLessThan(1);
        await expect(host).toHaveAttribute("selected-index", "2");
        await expect(host.locator("m3e-carousel-item").nth(2).locator(".title")).toHaveCSS("opacity", "1");
      }
    };
    await checkSelection(900, 256);
    yield;
    await traceLayouts(page, () =>
      hosts.evaluateAll(async (elements) => {
        for (let index = 0; index < 30; index++) {
          for (const element of elements) {
            element.style.width = `${900 - index * 15}px`;
            element.style.setProperty("--m3e-carousel-height", `${256 + index * 2}px`);
          }
          await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        }
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }),
    );
    yield;
    await checkSelection(465, 314);
    yield;
    const detached = await hosts.first().evaluateHandle((element) => {
      element.remove();
      return element;
    });
    await hosts.evaluateAll((elements) =>
      elements.forEach((element) => {
        element.style.width = "600px";
        element.style.setProperty("--m3e-carousel-height", "300px");
      }),
    );
    yield;
    await checkSelection(600, 300, true);
    yield;
    await detached.evaluate((element) => {
      element.style.width = "600px";
      document.body.append(element);
    });
    yield;
    await checkSelection(600, 300);
    await detached.dispose();
  }

  async *multiArrangement() {
    const { page, render } = this;
    await render(carousel("multi-browse", 8));
    yield;
    const result = await geometry(page);
    yield;
    expect(result.items[0].visible).toBeGreaterThan(result.items[1].visible);
    expect(result.items[1].visible).toBeGreaterThan(result.items[2].visible);
    expect(result.items[2].visible).toBeGreaterThan(0);
    expect(result.items[2].right).toBeCloseTo(420, 0);
  }

  async *hiddenItem() {
    const { page, render } = this;
    await render(
      carousel("hero-centered", 3).replace(
        "<m3e-carousel-item>",
        '<m3e-carousel-item style="transform:scale(0.9) !important">',
      ),
    );
    const item = page.locator("m3e-carousel-item").first();
    yield;
    await item.evaluate((element: HTMLElement) => {
      element.hidden = true;
    });
    yield;
    await expect
      .poll(() =>
        page
          .locator("m3e-carousel")
          .evaluate((element) => (element as HTMLElement & { items: readonly HTMLElement[] }).items.length),
      )
      .toBe(2);
    await expect(item).not.toHaveAttribute("aria-label", /./);
    expect(await item.evaluate((element: HTMLElement) => element.style.getPropertyValue("flex-basis"))).toBe("");
    expect(await item.evaluate((element: HTMLElement) => element.style.getPropertyValue("transform"))).toBe(
      "scale(0.9)",
    );
    expect(await item.evaluate((element: HTMLElement) => element.style.getPropertyPriority("transform"))).toBe(
      "important",
    );
    await expect(item).toBeHidden();
    expect((await geometry(page)).items[1].left).toBeCloseTo(0, 0);
  }
}
