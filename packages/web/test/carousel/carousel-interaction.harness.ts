import type { Page } from "@playwright/test";

import { createCarouselGeometry } from "../../src/carousel/CarouselGeometry";
import { expect } from "../fixtures";
import { carousel, traceLayouts, geometry, swipePhase } from "./carousel.helpers";

type Render = (html: string, direction?: "ltr" | "rtl") => Promise<void>;

/** Checkpoints retain browser-local samples and timing-sensitive state between behavioral steps. */
export class InteractionCarouselHarness {
  private flow?: AsyncGenerator<void>;

  constructor(
    readonly page: Page,
    readonly render: Render,
  ) {}

  async start(flow: AsyncGenerator<void>) {
    if (this.flow) throw new Error("An interaction carousel scenario is already active.");
    this.flow = flow;
    await this.advance();
  }

  async advance() {
    if (!this.flow) throw new Error("No interaction carousel scenario has been initialized.");
    const checkpoint = await this.flow.next();
    if (checkpoint.done) throw new Error("The interaction carousel scenario has no remaining checkpoint.");
  }

  async finish() {
    if (this.flow && !(await this.flow.next()).done) {
      throw new Error("The interaction carousel scenario has unexecuted checkpoints.");
    }
  }

  async dispose() {
    await this.flow?.return(undefined);
    this.flow = undefined;
  }

  async *selectedIndexNavigation(tag: "m3e-carousel" | "m3e-carousel-grid"): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <${tag} selected-index="1" style="width: 520px; height: 200px">
        ${Array.from({ length: 4 }, (_, i) => `<m3e-carousel-item>Item ${i + 1}</m3e-carousel-item>`).join("")}
      </${tag}>
    `);
    const host = page.locator(tag);
    yield;
    expect(await host.evaluate((element) => (element as HTMLElement & { selectedIndex: number }).selectedIndex)).toBe(
      1,
    );
    yield;
    await host.evaluate((element) => {
      element.addEventListener("change", (event) => {
        element.setAttribute("data-change", String((event as CustomEvent<{ index: number }>).detail.index));
      });
      (element as HTMLElement & { selectedIndex: number }).selectedIndex = 2;
    });
    yield;
    await expect(host).toHaveAttribute("selected-index", "2");
    await expect(host).not.toHaveAttribute("data-change");
    yield;
    await host.evaluate((element) => (element as HTMLElement & { moveNext(): void }).moveNext());
    yield;
    await expect(host).toHaveAttribute("selected-index", "3");
    await expect(host).toHaveAttribute("data-change", "3");
    yield;
  }

  async *responsiveGridNavigation(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <button id="before">Before</button>
      <m3e-carousel-grid
        aria-label="All destinations"
        style="width: 520px; --m3e-carousel-grid-item-min-width: 200px"
      >
        ${Array.from({ length: 5 }, (_, i) => `<m3e-carousel-item>Item ${i + 1}</m3e-carousel-item>`).join("")}
      </m3e-carousel-grid>
      <button id="after">After</button>
    `);
    const host = page.locator("m3e-carousel-grid");
    const items = host.locator("m3e-carousel-item");
    yield;
    await expect(host).toHaveRole("grid");
    await expect(host).toHaveAccessibleName("All destinations");
    await expect(host).toHaveAttribute("aria-rowcount", "3");
    await expect(host).toHaveAttribute("aria-colcount", "2");
    await expect(host.getByRole("row")).toHaveCount(3);
    await expect(host.getByRole("gridcell")).toHaveCount(5);
    await expect(items.nth(1)).toHaveAttribute("aria-colindex", "2");
    await expect(items.nth(2)).toHaveAttribute("aria-colindex", "1");
    const aspectRatio = await items.first().evaluate((item) => {
      const { width, height } = item.getBoundingClientRect();
      return width / height;
    });
    expect(aspectRatio).toBeCloseTo(4 / 3, 1);
    const gridBounds = (await host.boundingBox())!;
    const lastItemBounds = (await items.last().boundingBox())!;
    expect(gridBounds.height).toBeCloseTo(lastItemBounds.y + lastItemBounds.height - gridBounds.y, 0);
    expect((await page.locator("#after").boundingBox())!.y).toBeGreaterThanOrEqual(gridBounds.y + gridBounds.height);
    yield;
    await host.evaluate((element) => {
      element.addEventListener("change", (event) => {
        const detail = (event as CustomEvent<{ index: number }>).detail;
        element.setAttribute("data-change", `${detail.index}`);
      });
    });
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    yield;
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    yield;
    await page.keyboard.press("ArrowRight");
    await expect(host.getByRole("button", { name: "Item 2", exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("data-change", "1");
    await page.keyboard.press("ArrowDown");
    await expect(host.getByRole("button", { name: "Item 4", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
    await page.keyboard.press("Tab");
    yield;
    await expect(page.locator("#after")).toBeFocused();
    yield;
    const itemCount = await host.evaluate(
      (element) => (element as HTMLElement & { items: readonly HTMLElement[] }).items.length,
    );
    expect(itemCount).toBe(5);
    yield;
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(3);
    });
    yield;
    await expect(host).toHaveAttribute("selected-index", "3");
    await expect(host).toHaveAttribute("data-change", "3");
    yield;
    await host.evaluate((element) => {
      const grid = element as HTMLElement & {
        movePrevious(): void;
        moveNext(): void;
      };
      grid.movePrevious();
      grid.moveNext();
    });
    yield;
    await expect(host).toHaveAttribute("selected-index", "3");
    yield;
    await host.evaluate((element) => ((element as HTMLElement).style.width = "300px"));
    yield;
    await expect(host).toHaveAttribute("aria-colcount", "1");
    await expect(host).toHaveAttribute("aria-rowcount", "5");
    await expect(host.getByRole("row")).toHaveCount(5);
    yield;
  }

  async *gridSizingThresholds(direction: "ltr" | "rtl"): AsyncGenerator<void> {
    const { page, render } = this;
    await render(
      `<div id="grid-container" style="--grid-min:200px;--grid-gap:16px">
        <m3e-carousel-grid style="width:520px;--m3e-carousel-grid-item-min-width:var(--grid-min);--m3e-carousel-grid-item-gap:var(--grid-gap)">
          ${Array.from({ length: 7 }, (_, index) => `<m3e-carousel-item>Item ${index + 1}</m3e-carousel-item>`).join("")}
        </m3e-carousel-grid>
      </div>`,
      direction,
    );
    const host = page.locator("m3e-carousel-grid");
    yield;
    await expect(host).toHaveAttribute("aria-colcount", "2");
    yield;
    for (const [width, min, gap, columns] of [
      ["632px", "200px", "16px", 3],
      ["631.5px", "200px", "16px", 2],
      ["631.5px", "25%", "2%", 3],
      ["631.5px", "calc(50% - 8px)", "16px", 2],
      ["632px", "200px", "8px 24px", 2],
      ["648px", "200px", "8px 24px", 3],
      ["648px", "200px", "8px 2%", 3],
      ["631.5px", "150%", "0px", 1],
      ["600.5px", "100px", "0px", 6],
      ["99px", "100px", "0px", 1],
      ["750.5px", "4px", "0px", 187],
      ["750.5px", "1px", "0.5px", 500],
      ["750.5px", "0.5px", "0px", 750],
    ] as const) {
      await host.evaluate(
        (element, { width, min, gap }) => {
          (element as HTMLElement).style.width = width;
          element.parentElement!.style.setProperty("--grid-min", min);
          element.parentElement!.style.setProperty("--grid-gap", gap);
        },
        { width, min, gap },
      );
      await expect(host).toHaveAttribute("aria-colcount", `${columns}`);
      await expect(host.getByRole("row")).toHaveCount(Math.ceil(7 / columns));
      await expect(host.locator("m3e-carousel-item").nth(Math.min(7, columns) - 1)).toHaveAttribute(
        "aria-colindex",
        `${Math.min(7, columns)}`,
      );
    }
    yield;
    await host.evaluate((element) => {
      const parent = element.parentElement!;
      element.remove();
      (element as HTMLElement).style.width = "632px";
      parent.style.setProperty("--grid-min", "200px");
      parent.style.setProperty("--grid-gap", "16px");
      parent.append(element);
    });
    yield;
    await expect(host).toHaveAttribute("aria-colcount", "3");
    await expect(host.getByRole("row")).toHaveCount(3);
    yield;
  }

  async *simultaneousGridSizing(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <div id="grid-container" style="--m3e-carousel-grid-item-min-width:200px;--m3e-carousel-grid-item-gap:16px">
        ${Array.from(
          { length: 3 },
          () => `
          <m3e-carousel-grid style="width:520px">
            ${Array.from({ length: 7 }, (_, index) => `<m3e-carousel-item>Item ${index + 1}</m3e-carousel-item>`).join("")}
          </m3e-carousel-grid>`,
        ).join("")}
      </div>
    `);
    yield;
    for (const host of await page.locator("m3e-carousel-grid").all()) {
      await expect(host).toHaveAttribute("aria-colcount", "2");
    }
    yield;
    await traceLayouts(page, () =>
      page.locator("#grid-container").evaluate(async (container) => {
        const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
        await frame();
        await frame();
        for (const width of ["632px", "631.5px"]) {
          for (const grid of container.querySelectorAll<HTMLElement>("m3e-carousel-grid")) {
            grid.style.width = width;
          }
          await frame();
          await frame();
        }
        container.style.setProperty("--m3e-carousel-grid-item-min-width", "25%");
        container.style.setProperty("--m3e-carousel-grid-item-gap", "8px 2%");
        await frame();
        await frame();
      }),
    );
    yield;
    for (const host of await page.locator("m3e-carousel-grid").all()) {
      await expect(host).toHaveAttribute("aria-colcount", "3");
    }
    yield;
  }

  async *scrollContainerGridPaging(direction: "ltr" | "rtl"): AsyncGenerator<void> {
    const { page, render } = this;
    await render(
      `
      <div style="height:240px;overflow-y:auto">
        <div id="grid-host">
        <m3e-carousel-grid style="width:600px;--m3e-carousel-grid-item-min-width:180px;--m3e-carousel-grid-item-gap:20px">
          ${Array.from({ length: 20 }, (_, index) => `<m3e-carousel-item style="height:100px">Item ${index + 1}</m3e-carousel-item>`).join("")}
        </m3e-carousel-grid>
        </div>
      </div>
    `,
      direction,
    );
    if (direction === "rtl") {
      await page.locator("#grid-host").evaluate((element) => {
        const grid = element.querySelector("m3e-carousel-grid")!;
        element.attachShadow({ mode: "open" }).append(grid);
      });
    }
    const host = page.locator("m3e-carousel-grid");
    yield;
    await expect(host).toHaveAttribute("aria-colcount", "3");
    yield;
    const action = (index: number) => host.getByRole("button", { name: `Item ${index + 1}`, exact: true });
    await action(1).focus();
    await page.keyboard.press("PageDown");
    yield;
    await expect(action(7)).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", "7");
    yield;
    await page.keyboard.press("PageUp");
    yield;
    await expect(action(1)).toBeFocused();
    yield;
    await host
      .locator("m3e-carousel-item")
      .nth(7)
      .evaluate((item) => item.setAttribute("disabled", ""));
    yield;
    await expect(action(7)).toHaveAttribute("aria-disabled", "true");
    yield;
    await page.keyboard.press("PageDown");
    yield;
    await expect(action(6)).toBeFocused();
    yield;
    await action(1).focus();
    for (const index of [6, 8]) {
      await host
        .locator("m3e-carousel-item")
        .nth(index)
        .evaluate((item) => item.setAttribute("disabled", ""));
      await expect(action(index)).toHaveAttribute("aria-disabled", "true");
    }
    await page.keyboard.press("PageDown");
    yield;
    await expect(action(10)).toBeFocused();
    yield;
    await page.keyboard.press("PageUp");
    yield;
    await expect(action(4)).toBeFocused();
    yield;
    await action(14).focus();
    await page.keyboard.press("PageDown");
    await expect(action(19)).toBeFocused();
    await page.keyboard.press("PageDown");
    await expect(action(19)).toBeFocused();
    await action(1).focus();
    await page.keyboard.press("PageUp");
    await expect(action(1)).toBeFocused();
    await page.keyboard.press("Shift+PageDown");
    await expect(action(1)).toBeFocused();
    yield;
    await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
    yield;
  }

  async *documentViewportGridPaging(): AsyncGenerator<void> {
    const { page, render } = this;
    await page.setViewportSize({ width: 800, height: 360 });
    await render(`
      <m3e-carousel-grid style="width:400px;--m3e-carousel-grid-item-min-width:180px;--m3e-carousel-grid-item-gap:20px">
        ${Array.from({ length: 12 }, (_, index) => `<m3e-carousel-item style="height:100px">Item ${index + 1}</m3e-carousel-item>`).join("")}
      </m3e-carousel-grid>
    `);
    const host = page.locator("m3e-carousel-grid");
    yield;
    await expect(host).toHaveAttribute("aria-colcount", "2");
    yield;
    await host.getByRole("button", { name: "Item 2", exact: true }).focus();
    await page.keyboard.press("PageDown");
    yield;
    await expect(host.getByRole("button", { name: "Item 8", exact: true })).toBeFocused();
    yield;
    await page.keyboard.press("PageUp");
    yield;
    await expect(host.getByRole("button", { name: "Item 2", exact: true })).toBeFocused();
    yield;
  }

  async *documentDirectionGridNavigation(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(
      `
      <m3e-carousel-grid dir="rtl" aria-label="All destinations">
        <m3e-carousel-item>Coast</m3e-carousel-item>
        <m3e-carousel-item>Forest</m3e-carousel-item>
      </m3e-carousel-grid>
    `,
      "ltr",
    );
    const host = page.locator("m3e-carousel-grid");
    yield;
    await host.getByRole("button", { name: "Coast", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    yield;
    await expect(host).toHaveAttribute("selected-index", "1");
    yield;
  }

  async *hiddenAndRemovedGridItems(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <div id="destination"></div>
      <m3e-carousel-grid aria-label="All destinations" style="width: 520px; --m3e-carousel-grid-item-min-width: 200px">
        <m3e-carousel-item>Coast</m3e-carousel-item>
        <m3e-carousel-item>Forest</m3e-carousel-item>
        <m3e-carousel-item>Mountains</m3e-carousel-item>
      </m3e-carousel-grid>
    `);
    const host = page.locator("m3e-carousel-grid");
    const items = host.locator("m3e-carousel-item");
    yield;
    await expect(host).toHaveAttribute("aria-rowcount", "2");
    yield;
    await items.nth(1).evaluate((item) => item.setAttribute("hidden", ""));
    yield;
    await expect(host).toHaveAttribute("aria-rowcount", "1");
    await expect(host.getByRole("gridcell")).toHaveCount(2);
    yield;
    await items.nth(1).evaluate((item) => item.removeAttribute("hidden"));
    yield;
    await expect(host).toHaveAttribute("aria-rowcount", "2");
    yield;
    await host.evaluate((element) => {
      const item = element.querySelector("m3e-carousel-item")!;
      document.querySelector("#destination")!.append(item);
      element.remove();
    });
    yield;
    const detachedItem = page.locator("#destination m3e-carousel-item");
    await expect(detachedItem).not.toHaveAttribute("slot", /./);
    await expect(detachedItem).not.toHaveAttribute("aria-colindex", /./);
    yield;
  }

  async *absentBuiltInNavigation(): AsyncGenerator<void> {
    const { page, render } = this;
    yield;
    for (const variant of ["multi-browse", "uncontained", "hero", "hero-centered", "fullscreen"]) {
      await render(carousel(variant, 5));
      yield;
      await expect(page.locator("m3e-carousel").getByRole("button", { name: /^(Next|Previous) item$/ })).toHaveCount(0);
      yield;
    }
  }

  async *unsupportedChildren(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <m3e-carousel aria-label="Destinations">
        <div id="unsupported">Not a carousel item</div>
        <m3e-carousel-item>Coast</m3e-carousel-item>
      </m3e-carousel>
    `);
    const host = page.locator("m3e-carousel");
    yield;
    await expect(host.locator("m3e-carousel-item")).toHaveCount(1);
    await expect(page.locator("#unsupported")).toBeHidden();
    await expect(host).toHaveAttribute("aria-colcount", "1");
    await expect(host.getByRole("button", { name: "Coast" })).toHaveCount(1);
    yield;
  }

  async *horizontalGridSemantics(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 3, 'aria-label="Destinations"'));
    const host = page.locator("m3e-carousel");
    yield;
    await expect(host).toHaveRole("grid");
    await expect(host).toHaveAccessibleName("Destinations");
    await expect(host.getByRole("row")).toHaveCount(1);
    await expect(host.getByRole("gridcell")).toHaveCount(3);
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toHaveCount(1);
    await expect(host).not.toHaveAttribute("aria-roledescription", /./);
    const item = host.locator("m3e-carousel-item").first();
    await expect(item).not.toHaveAttribute("aria-roledescription", /./);
    await expect(item).not.toHaveAttribute("aria-label", /./);
    await expect(item).toHaveAttribute("aria-colindex", "1");
    await expect(host).toHaveAttribute("aria-rowcount", "1");
    await expect(host).toHaveAttribute("aria-colcount", "3");
    await expect(item).not.toHaveAttribute("aria-selected", /./);
    await expect(host.locator(".viewport")).toHaveAttribute("tabindex", "-1");
    yield;
  }

  async *fullscreenGridSemantics(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("fullscreen", 3, 'aria-label="Destinations"'));
    const host = page.locator("m3e-carousel");
    const items = host.locator("m3e-carousel-item");
    yield;
    await expect(host.getByRole("row")).toHaveCount(3);
    await expect(host.getByRole("gridcell")).toHaveCount(3);
    await expect(host).toHaveAttribute("aria-rowcount", "3");
    await expect(host).toHaveAttribute("aria-colcount", "1");
    await expect(items.nth(2)).toHaveAttribute("aria-rowindex", "3");
    await expect(items.nth(2)).toHaveRole("row");
    yield;
    await host.evaluate((element) => element.setAttribute("variant", "hero"));
    yield;
    await expect(host.getByRole("row")).toHaveCount(1);
    await expect(items.nth(2)).toHaveRole("gridcell");
    await expect(items.nth(2)).not.toHaveAttribute("aria-rowindex", /./);
    await expect(items.nth(2)).toHaveAttribute("aria-colindex", "3");
    await expect(host).toHaveAttribute("aria-colcount", "3");
    yield;
  }

  async *liveLinkActions(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <m3e-carousel aria-label="Destinations" style="width:420px;height:200px">
        <m3e-carousel-item href="#coast" target="_blank" rel="noopener">
          <img alt="" />
          <span slot="title">Coast</span>
          <span slot="subtitle">Weekend escapes</span>
        </m3e-carousel-item>
        <m3e-carousel-item label="Play coastal tour"><img alt="" /></m3e-carousel-item>
      </m3e-carousel>
    `);
    const item = page.locator("m3e-carousel-item").first();
    const link = item.getByRole("link");
    const accessibility = await page.context().newCDPSession(page);
    yield;
    await expect
      .poll(async () => {
        const { nodes } = await accessibility.send("Accessibility.getFullAXTree");
        return nodes.filter((node) => node.role?.value === "link").map((node) => node.name?.value);
      })
      .toContain("Coast Weekend escapes");
    await accessibility.detach();
    await expect(link.locator("a")).toHaveAttribute("href", "#coast");
    await expect(link.locator("a")).toHaveAttribute("target", "_blank");
    await expect(link.locator("a")).toHaveAttribute("rel", "noopener");
    await expect(page.getByRole("button", { name: "Play coastal tour" })).toHaveCount(1);
    yield;
    await expect(page.locator("m3e-carousel-item").nth(1)).not.toHaveAttribute("aria-label", /./);
    yield;
    await item.evaluate((element) => element.removeAttribute("href"));
    const button = item.getByRole("button", { name: "Coast Weekend escapes" });
    yield;
    await expect(button).toHaveCount(1);
    yield;
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await expect(button).toBeDisabled();
    yield;
    await item.evaluate((element) => element.setAttribute("href", "#coast"));
    await expect(link).toHaveAttribute("aria-disabled", "true");
    yield;
    await expect(link.locator("a")).toHaveCount(0);
    yield;
    await item.evaluate((element) => element.removeAttribute("disabled"));
    yield;
    await expect(link.locator("a")).toHaveAttribute("href", "#coast");
    await item.evaluate((element) => {
      element.setAttribute("data-clicks", "0");
      element.addEventListener("click", (event) => {
        event.preventDefault();
        element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1));
      });
    });
    await link.focus();
    await page.keyboard.down("Space");
    yield;
    await expect(item).toHaveCSS("border-radius", "28px");
    yield;
    await page.keyboard.up("Space");
    yield;
    await expect(item).toHaveAttribute("data-clicks", "0");
    yield;
    await page.keyboard.down("Enter");
    yield;
    await expect(item).toHaveCSS("border-radius", "28px");
    yield;
    await page.keyboard.up("Enter");
    yield;
    await expect(item).toHaveAttribute("data-clicks", "1");
    yield;
  }

  async *viewportPaging(
    variant: "multi-browse" | "hero" | "hero-centered",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<void> {
    const { page, render } = this;
    await render(
      carousel(variant, 12, "", false, "--m3e-carousel-item-width:280px").replace("width: 420px", "width: 1200px"),
      direction,
    );
    const host = page.locator("m3e-carousel");
    await geometry(page);
    const destination = variant === "hero-centered" ? 5 : 4;
    const first = host.getByRole("button", { name: "Item 1", exact: true });
    yield;
    await first.focus();
    await page.keyboard.press("PageDown");
    yield;
    await expect(
      host.getByRole("button", {
        name: `Item ${destination + 1}`,
        exact: true,
      }),
    ).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", String(destination));
    yield;
    await page.keyboard.press("PageUp");
    await expect(first).toBeFocused();
    await page.keyboard.press("PageUp");
    await expect(first).toBeFocused();
    yield;
    await host
      .locator("m3e-carousel-item")
      .nth(destination)
      .evaluate((item) => item.setAttribute("disabled", ""));
    yield;
    await expect(
      host.getByRole("button", {
        name: `Item ${destination + 1}`,
        exact: true,
      }),
    ).toHaveAttribute("aria-disabled", "true");
    yield;
    await page.keyboard.press("PageDown");
    yield;
    await expect(
      host.getByRole("button", {
        name: `Item ${destination + 2}`,
        exact: true,
      }),
    ).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", String(destination + 1));
    yield;
    await page.keyboard.press("End");
    await page.keyboard.press("PageUp");
    await expect(host.getByRole("button", { name: `Item ${destination}`, exact: true })).toBeFocused();
    await page.keyboard.press("End");
    await page.keyboard.press("PageDown");
    await expect(host.getByRole("button", { name: "Item 12", exact: true })).toBeFocused();
    await page.keyboard.press("Home");
    await page.keyboard.press("Shift+PageDown");
    await expect(first).toBeFocused();
    yield;
    await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
    yield;
  }

  async *fixedGeometryPaging(variant: "uncontained" | "fullscreen"): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel(variant, 8, "", false, "--m3e-carousel-item-width:160px;--m3e-carousel-height:200px"));
    const host = page.locator("m3e-carousel");
    await geometry(page);
    const first = host.getByRole("button", { name: "Item 1", exact: true });
    yield;
    await first.focus();
    await page.keyboard.press("PageDown");
    const destination = variant === "fullscreen" ? 1 : 2;
    const action = host.getByRole("button", {
      name: `Item ${destination + 1}`,
      exact: true,
    });
    yield;
    await expect(action).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", String(destination));
    await expect
      .poll(async () =>
        variant === "fullscreen"
          ? host.locator(".viewport").evaluate((element: HTMLElement) => Math.abs(element.scrollTop - 216))
          : Math.abs((await geometry(page)).scroll - 336),
      )
      .toBeLessThan(1.5);
    yield;
    await page.keyboard.press("PageUp");
    yield;
    await expect(first).toBeFocused();
    yield;
  }

  async *singleTabStopNavigation(
    variant: "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen",
  ): AsyncGenerator<void> {
    const { page, render } = this;
    const rtl = variant === "multi-browse" || variant === "fullscreen";
    const forward = variant === "fullscreen" ? "ArrowDown" : rtl ? "ArrowLeft" : "ArrowRight";
    await render(
      `
      <button id="before">Before</button>
      ${carousel(variant, 5)}
      <button id="after">After</button>
    `,
      rtl ? "rtl" : "ltr",
    );
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      element.setAttribute("data-clicks", "0");
      element.addEventListener("click", () => {
        element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1));
      });
    });
    yield;
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    yield;
    for (let index = 0; index < 5; index++) {
      if (index > 0) await page.keyboard.press(forward);
      const action = host.getByRole("button", {
        name: `Item ${index + 1}`,
        exact: true,
      });
      await expect(action).toBeFocused();
      await expect(host).toHaveAttribute("selected-index", String(index));
      await expect
        .poll(() =>
          action.evaluate((element) => {
            const item = (element.getRootNode() as ShadowRoot).host;
            const viewport = item.closest("m3e-carousel")!.shadowRoot!.querySelector(".viewport")!;
            const rect = element.getBoundingClientRect();
            const bounds = viewport.getBoundingClientRect();
            return Math.max(
              bounds.left - rect.left,
              rect.right - bounds.right,
              bounds.top - rect.top,
              rect.bottom - bounds.bottom,
            );
          }),
        )
        .toBeLessThan(1.5);
    }
    yield;
    await page.keyboard.press(forward);
    yield;
    await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
    await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
    await expect(host).toHaveAttribute("data-clicks", "0");
    yield;
    await page.keyboard.press("Tab");
    await expect(page.locator("#after")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    yield;
    await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
    yield;
    await page.keyboard.press("Home");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    await page.keyboard.press("Home");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    yield;
    await expect(page.locator("#before")).toBeFocused();
    yield;
  }

  async *animatedArrowRetargeting(
    variant: "multi-browse" | "hero" | "hero-centered" | "uncontained" | "fullscreen",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<void> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 5, "", true), direction);
    await geometry(page);
    const host = page.locator("m3e-carousel");
    yield;
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    const forward = variant === "fullscreen" ? "ArrowDown" : direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const result = await host.evaluate(async (element, forward) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const actions = [...element.querySelectorAll("m3e-carousel-item")].map(
        (item) => item.shadowRoot!.querySelector<HTMLElement>(".action")!,
      );
      const offset = () => Math.abs(viewport.scrollLeft) + viewport.scrollTop;
      const before = offset();
      actions[0].dispatchEvent(
        new KeyboardEvent("keydown", {
          key: forward,
          bubbles: true,
          composed: true,
        }),
      );
      const immediate = offset();
      const focused = actions[1].matches(":focus-within");
      const samples: number[] = [];
      const started = performance.now();
      await new Promise<void>((resolve) => {
        const sample = () => {
          samples.push(offset());
          if (performance.now() - started < 450) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      return { before, immediate, focused, samples };
    }, forward);
    yield;
    expect(result.focused).toBe(true);
    expect(result.immediate).toBeCloseTo(result.before, 1);
    const settled = result.samples[result.samples.length - 1];
    expect(settled).toBeGreaterThan(1);
    expect(
      result.samples.filter((offset) => offset > result.before + 1 && offset < settled - 1).length,
    ).toBeGreaterThan(2);
    yield;
    const retargeted = await host.evaluate((element, forward) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const actions = [...element.querySelectorAll("m3e-carousel-item")].map(
        (item) => item.shadowRoot!.querySelector<HTMLElement>(".action")!,
      );
      const before = Math.abs(viewport.scrollLeft) + viewport.scrollTop;
      for (const key of ["End", "Home", forward, forward]) {
        actions
          .find((action) => action.matches(":focus-within"))!
          .dispatchEvent(
            new KeyboardEvent("keydown", {
              key,
              bubbles: true,
              composed: true,
            }),
          );
      }
      return {
        before,
        after: Math.abs(viewport.scrollLeft) + viewport.scrollTop,
        focused: actions[2].matches(":focus-within"),
      };
    }, forward);
    yield;
    expect(retargeted.focused).toBe(true);
    expect(retargeted.after).toBeCloseTo(retargeted.before, 1);
    const viewportSize = await host
      .locator(".viewport")
      .evaluate(
        (element, vertical) => (vertical ? element.clientHeight : element.clientWidth - 32),
        variant === "fullscreen",
      );
    const layout = createCarouselGeometry({
      variant,
      viewportSize,
      count: 5,
      baseSize: 280,
      gap: variant === "fullscreen" ? 16 : 8,
    })!;
    await expect
      .poll(async () =>
        Math.abs(
          (await host.locator(".viewport").evaluate((element) => Math.abs(element.scrollLeft) + element.scrollTop)) -
            layout.scrollForIndex(2),
        ),
      )
      .toBeLessThan(1);
    await expect(host).toHaveAttribute("selected-index", "2");
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    yield;
  }

  async *reducedMotionArrowNavigation(variant: "hero" | "fullscreen"): AsyncGenerator<void> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel(variant, 5));
    const host = page.locator("m3e-carousel");
    const action = host.getByRole("button", { name: "Item 1", exact: true });
    yield;
    await action.focus();
    const remaining = await action.evaluate((element) => {
      element.dispatchEvent(
        new KeyboardEvent("keydown", {
          key: "End",
          bubbles: true,
          composed: true,
        }),
      );
      const viewport = (element.getRootNode() as ShadowRoot).host
        .closest("m3e-carousel")!
        .shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      return Math.max(
        viewport.scrollWidth - viewport.clientWidth - Math.abs(viewport.scrollLeft),
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop,
      );
    });
    yield;
    expect(remaining).toBeLessThan(1);
    await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
    yield;
  }

  async *repairingKeyboardEntry(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <button id="before">Before</button>
      ${carousel("hero", 5)}
      <button id="after">After</button>
    `);
    const host = page.locator("m3e-carousel");
    const items = host.locator("m3e-carousel-item");
    await items.nth(1).evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    yield;
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    yield;
    await items.first().evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    yield;
    await host.getByRole("button", { name: "Item 3", exact: true }).evaluate((element) => {
      (element.getRootNode() as ShadowRoot).host.remove();
    });
    yield;
    await expect(host.getByRole("button", { name: "Item 4", exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("aria-colcount", "4");
    yield;
    await items.nth(2).evaluate((element) => element.setAttribute("hidden", ""));
    yield;
    await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("aria-colcount", "3");
    yield;
    await items.first().evaluate((element) => element.removeAttribute("disabled"));
    yield;
    await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
    await page.keyboard.press("Home");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    yield;
  }

  async *rememberedTabEntry(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`
      <button id="before">Before</button>
      ${carousel("hero", 5)}
      <button id="after">After</button>
    `);
    const host = page.locator("m3e-carousel");
    const action = host.getByRole("button", { name: "Item 2", exact: true });
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await page.keyboard.press("ArrowRight");
    yield;
    await host.evaluate((element) => {
      const carousel = element as HTMLElement & {
        moveTo(index: number): void;
        moveNext(): void;
        movePrevious(): void;
      };
      carousel.moveTo(4);
      carousel.movePrevious();
      carousel.moveNext();
    });
    yield;
    await expect(host).toHaveAttribute("selected-index", "4");
    await expect(action).toBeFocused();
    yield;
    await page.keyboard.press("Tab");
    await expect(page.locator("#after")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    yield;
    await expect(action).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", "1");
    yield;
  }

  async *sharedKeyboardFeedback(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    await item.evaluate((element) => {
      element.setAttribute("data-clicks", "0");
      element.addEventListener("click", () => {
        element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1));
      });
    });
    const action = item.getByRole("button");
    yield;
    await action.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
    yield;
    await expect(item).toHaveAttribute("data-clicks", "2");
    for (const tag of ["m3e-ripple", "m3e-focus-ring", "m3e-state-layer"]) {
      await expect
        .poll(() =>
          item
            .locator(tag)
            .evaluate((element) => (element as HTMLElement & { control: HTMLElement | null }).control?.id),
        )
        .toBe("action");
    }
    await expect(item.locator("m3e-focus-ring").locator(".outline")).toHaveClass(/visible/);
    yield;
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    await item.evaluate((element: HTMLElement) => element.click());
    yield;
    await expect(item).toHaveAttribute("data-clicks", "2");
    yield;
    await page.locator("m3e-carousel").locator(".viewport").focus();
    await page.keyboard.press("Tab");
    yield;
    await expect(page.getByRole("button", { name: "Item 2", exact: true })).toBeFocused();
    yield;
  }

  async *uncontainedEdgeMasks(direction: "ltr" | "rtl"): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("uncontained", 5, "", false, "--m3e-carousel-item-width:160px"), direction);
    await geometry(page);
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const items = host.locator("m3e-carousel-item");
    yield;
    const layout = createCarouselGeometry({
      variant: "uncontained",
      viewportSize: 420,
      gap: 8,
      count: 5,
      baseSize: 160,
    })!;
    const viewportBounds = (await viewport.boundingBox())!;
    yield;
    for (const scroll of [0, 20, 80, 150, layout.maxScroll - 80, layout.maxScroll, 80, 0]) {
      await viewport.evaluate(
        (element, offset) => (element.scrollLeft = offset),
        direction === "rtl" ? -scroll : scroll,
      );
      const expected = layout.itemsAt(scroll);
      await expect
        .poll(async () => (await items.first().getByRole("button").boundingBox())!.width)
        .toBeCloseTo(expected[0].size, 1);
      for (let index = 0; index < 5; index++) {
        const item = items.nth(index);
        const action = item.getByRole("button");
        const bounds = (await action.boundingBox())!;
        const left =
          direction === "rtl"
            ? viewportBounds.x + viewportBounds.width - bounds.x - bounds.width
            : bounds.x - viewportBounds.x;
        expect(bounds.width).toBeCloseTo(expected[index].size, 1);
        expect(left).toBeCloseTo(expected[index].position - expected[index].size / 2, 1);
        expect((await action.locator(".base").boundingBox())!.width).toBeCloseTo(expected[index].size, 1);
        expect((await item.locator(".content").boundingBox())!.width).toBeCloseTo(160, 1);
        await expect(action.locator(".base")).toHaveCSS("border-radius", "28px");
      }
    }
    yield;
  }

  async *gutterAdjustedGeometry(
    variant: "multi-browse" | "hero" | "hero-centered" | "uncontained",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel(variant, 5, "", true, "--m3e-carousel-item-width:320px"), direction);
    const host = page.locator("m3e-carousel");
    yield;
    await host.evaluate((element: HTMLElement) => {
      element.style.width = "452px";
      element.style.height = "216px";
    });
    yield;
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 420,
      count: 5,
      baseSize: variant === "uncontained" ? 320 : 280,
      preferredSize: 320,
      gap: 8,
    })!;
    const viewport = host.locator(".viewport");
    const bounds = (await viewport.boundingBox())!;
    for (const index of [0, 2, 4]) {
      await host.evaluate((element, index) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(index);
      }, index);
      await expect
        .poll(async () =>
          Math.abs((await viewport.evaluate((element) => Math.abs(element.scrollLeft))) - layout.scrollForIndex(index)),
        )
        .toBeLessThan(1);
      await expect
        .poll(async () =>
          Math.abs(
            (await viewport.evaluate((element) => element.scrollWidth - element.clientWidth)) - layout.maxScroll,
          ),
        )
        .toBeLessThan(1);
      const expected = layout.itemsAt(layout.scrollForIndex(index))[index];
      const action = host.locator("m3e-carousel-item").nth(index).getByRole("button");
      await expect
        .poll(async () => {
          const rect = (await action.boundingBox())!;
          const left =
            direction === "rtl"
              ? bounds.x + 436 - expected.position - expected.size / 2
              : bounds.x + 16 + expected.position - expected.size / 2;
          return Math.max(
            Math.abs(rect.x - left),
            Math.abs(rect.width - expected.size),
            Math.abs(rect.y - bounds.y - 8),
            Math.abs(rect.height - 200),
          );
        })
        .toBeLessThan(1);
      const gutterHitsItem = await viewport.evaluate((element) => {
        const rect = element.getBoundingClientRect();
        return [rect.left + 4, rect.right - 4].some((x) =>
          Boolean(document.elementFromPoint(x, rect.top + rect.height / 2)?.closest("m3e-carousel-item")),
        );
      });
      expect(gutterHitsItem).toBe(false);
    }
    yield;
  }

  async *completeScrollExtent(direction: "ltr" | "rtl"): AsyncGenerator<void> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 8), direction);
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const extent = () => viewport.evaluate((element) => element.scrollWidth - element.clientWidth);
    const expected = (count: number) =>
      createCarouselGeometry({
        variant: "hero",
        viewportSize: 420,
        count,
        baseSize: 280,
        gap: 8,
      })!.maxScroll;
    yield;
    await expect.poll(async () => Math.abs((await extent()) - expected(8))).toBeLessThan(1);
    yield;
    const sign = direction === "rtl" ? 1 : -1;
    await swipePhase(page, "start", 0);
    for (const distance of [200, 600]) {
      await swipePhase(page, "update", sign * distance);
      expect(Math.abs((await extent()) - expected(8))).toBeLessThan(1);
    }
    yield;
    await swipePhase(page, "cancel", sign * 600);
    await host
      .locator("m3e-carousel-item")
      .last()
      .evaluate((element: HTMLElement) => (element.hidden = true));
    yield;
    await expect.poll(async () => Math.abs((await extent()) - expected(7))).toBeLessThan(1);
    yield;
  }

  async *gutteredClickTransitionFrames(
    variant: "multi-browse" | "hero" | "hero-centered" | "uncontained",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<void> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel(variant, 8, "", true, "--m3e-carousel-item-width:186px"), direction);
    const host = page.locator("m3e-carousel");
    yield;
    await host.evaluate((element: HTMLElement & { moveTo(index: number): void }) => {
      element.style.width = "452px";
      element.moveTo(7);
    });
    const viewport = host.locator(".viewport");
    yield;
    await expect
      .poll(() =>
        viewport.evaluate((element) =>
          Math.abs(Math.abs(element.scrollLeft) - element.scrollWidth + element.clientWidth),
        ),
      )
      .toBeLessThan(1);
    yield;
    const index = await host.evaluate((element: HTMLElement) => {
      const viewport = element.shadowRoot!.querySelector(".viewport")!;
      const bounds = viewport.getBoundingClientRect();
      const items = [...element.querySelectorAll<HTMLElement>("m3e-carousel-item")];
      const index = items.findIndex(
        (item) =>
          getComputedStyle(item).opacity !== "0" &&
          item.shadowRoot!.querySelector(".action")!.getBoundingClientRect().width > 1,
      );
      element.dataset.monitorFrames = "true";
      element.dataset.frameCount = "0";
      element.dataset.frameOverflow = "0";
      const sample = () => {
        if (element.dataset.monitorFrames !== "true") return;
        let overflow = Number(element.dataset.frameOverflow);
        for (const item of items) {
          if (getComputedStyle(item).opacity === "0") continue;
          const action = item.shadowRoot!.querySelector(".action")!;
          const rect = action.getBoundingClientRect();
          const clips = getComputedStyle(action)
            .clipPath.match(/-?[\d.]+px/g)
            ?.map(Number.parseFloat) ?? [0];
          const right = Math.max(0, clips[1] ?? clips[0]);
          const left = Math.max(0, clips[3] ?? clips[1] ?? clips[0]);
          overflow = Math.max(overflow, bounds.left + 16 - rect.left - left, rect.right - right - bounds.right + 16);
        }
        element.dataset.frameOverflow = String(overflow);
        element.dataset.frameCount = String(Number(element.dataset.frameCount) + 1);
        requestAnimationFrame(sample);
      };
      requestAnimationFrame(sample);
      return index;
    });
    yield;
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThan(7);
    yield;
    const layout = createCarouselGeometry({
      variant,
      viewportSize: 420,
      count: 8,
      baseSize: variant === "uncontained" ? 186 : 280,
      preferredSize: 186,
      gap: 8,
    })!;
    await host.locator("m3e-carousel-item").nth(index).getByRole("button").click();
    yield;
    await expect(host).toHaveAttribute("selected-index", String(index));
    await expect
      .poll(async () =>
        Math.abs((await viewport.evaluate((element) => Math.abs(element.scrollLeft))) - layout.scrollForIndex(index)),
      )
      .toBeLessThan(1);
    yield;
    const result = await host.evaluate(async (element: HTMLElement) => {
      await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
      element.dataset.monitorFrames = "false";
      return {
        frames: Number(element.dataset.frameCount),
        overflow: Number(element.dataset.frameOverflow),
      };
    });
    yield;
    expect(result.frames).toBeGreaterThan(3);
    expect(result.overflow).toBeLessThan(1);
    yield;
  }

  async *outwardFocusAndShadows(variant: "hero" | "uncontained" | "grid"): AsyncGenerator<void> {
    const { page, render } = this;
    const tag = variant === "grid" ? "m3e-carousel-grid" : "m3e-carousel";
    const example =
      variant === "grid"
        ? `<m3e-carousel-grid style="width:420px"><m3e-carousel-item>Item 1</m3e-carousel-item></m3e-carousel-grid>`
        : carousel(variant, 1, "", true);
    await render(`<button id="before">Before</button>${example}`);
    const host = page.locator(tag);
    const action = host.getByRole("button");
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-shape", "0px");
      element.style.setProperty("--m3e-focus-ring-color", "rgb(255, 0, 0)");
      element.style.setProperty("--m3e-elevation-lift-duration", "0s");
      element.style.setProperty("--m3e-elevation-settle-duration", "0s");
    });
    yield;
    const bounds = (await action.boundingBox())!;
    const shadowClip = {
      x: bounds.x + 80,
      y: bounds.y - 2,
      width: 20,
      height: 1,
    };
    const beforeShadow = await page.screenshot({ clip: shadowClip });
    await action.hover();
    yield;
    await expect(host.locator("m3e-elevation").locator(".shadow")).toHaveClass(/hover/);
    expect(await page.screenshot({ clip: shadowClip })).not.toEqual(beforeShadow);
    yield;
    await page.mouse.move(0, 0);
    const ringClip = {
      x: bounds.x + 80,
      y: bounds.y - 7,
      width: 20,
      height: 1,
    };
    const beforeRing = await page.screenshot({ clip: ringClip });
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    const ring = host.locator("m3e-focus-ring");
    yield;
    await expect(ring).not.toHaveAttribute("inward", "");
    const outline = ring.locator(".outline");
    await expect(outline).toHaveClass(/visible/);
    yield;
    await outline.evaluate((element: HTMLElement) => {
      element.style.animation = "grow-shrink 1s linear paused";
      const animation = element.getAnimations()[0];
      animation.pause();
      animation.currentTime = 500;
    });
    yield;
    await expect(outline).toHaveCSS("outline-width", "6px");
    expect(await page.screenshot({ clip: ringClip })).not.toEqual(beforeRing);
    expect(await action.boundingBox()).toEqual(bounds);
    yield;
  }

  async *edgeToEdgeFullscreen(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("fullscreen", 3, "", true));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const action = host.getByRole("button", { name: "Item 1", exact: true });
    const bounds = (await viewport.boundingBox())!;
    yield;
    expect(await action.boundingBox()).toEqual(bounds);
    await expect(viewport).toHaveCSS("padding", "0px");
    await expect(action.locator("m3e-focus-ring")).toHaveAttribute("inward", "");
    yield;
    const shadow = action.locator("m3e-elevation").locator(".shadow");
    const resting = await shadow.evaluate((element) => getComputedStyle(element).boxShadow);
    await action.hover();
    yield;
    await expect(shadow).toHaveCSS("box-shadow", resting);
    yield;
    await host.evaluate((element) => element.setAttribute("variant", "hero"));
    yield;
    await expect(viewport).toHaveCSS("padding", "8px 0px");
    await expect(host.locator(".track")).toHaveCSS("padding-inline", "16px");
    await expect(action.locator("m3e-focus-ring")).not.toHaveAttribute("inward", "");
    yield;
  }

  async *liveGutterOverrides(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 5, "", true));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const bounds = (await viewport.boundingBox())!;
    yield;
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await page.keyboard.press("End");
    const action = host.getByRole("button", { name: "Item 5", exact: true });
    yield;
    await expect(action).toBeFocused();
    yield;
    for (const [inline, block] of [
      [16, 8],
      [24, 12],
      [0, 0],
    ]) {
      await host.evaluate(
        (element: HTMLElement, { inline, block }) => {
          element.style.setProperty("--m3e-carousel-inline-gutter", `${inline}px`);
          element.style.setProperty("--m3e-carousel-block-gutter", `${block}px`);
        },
        { inline, block },
      );
      await expect
        .poll(async () => {
          const rect = (await action.boundingBox())!;
          return Math.max(
            Math.abs(rect.x + rect.width - bounds.x - bounds.width + inline),
            Math.abs(rect.y - bounds.y - block),
            Math.abs(rect.height - bounds.height + 2 * block),
          );
        })
        .toBeLessThan(1);
      await expect(action).toBeFocused();
      await expect(host).toHaveAttribute("selected-index", "4");
    }
    yield;
    await page.keyboard.press("Home");
    yield;
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    yield;
  }

  async *slottedMediaSizing(tag: "img" | "video"): AsyncGenerator<void> {
    const { page, render } = this;
    const poster = `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="blue"/></svg>',
    )}`;
    const markup =
      tag === "img"
        ? `<img src="${poster}" alt="" width="640" height="360" draggable="false">`
        : `<video poster="${poster}" width="640" height="360" muted playsinline preload="none"></video>`;
    await render(
      carousel("hero", 5, "", true)
        .replace(/<m3e-carousel-item>/g, '<m3e-carousel-item label="View the coast">')
        .replace(/Item \d+/g, markup),
    );
    const host = page.locator("m3e-carousel");
    const item = host.locator("m3e-carousel-item").nth(1);
    const media = item.locator(tag);
    yield;
    await expect(media).toHaveCSS("display", "block");
    await expect(media).toHaveCSS("object-fit", "cover");
    await expect(media).toHaveCSS("object-position", "50% 50%");
    const content = (await item.locator(".content").boundingBox())!;
    const sizeError = async () => {
      const bounds = (await media.boundingBox())!;
      return Math.max(Math.abs(bounds.width - content.width), Math.abs(bounds.height - content.height));
    };
    await expect.poll(sizeError).toBeLessThan(0.1);
    const action = item.getByRole("button");
    yield;
    expect((await action.boundingBox())!.width).toBeLessThan(content.width);
    yield;
    await host.evaluate((element: HTMLElement & { moveTo(index: number): void }) => element.moveTo(1));
    await expect.poll(async () => Math.abs((await action.boundingBox())!.width - content.width)).toBeLessThan(0.1);
    yield;
    await expect.poll(sizeError).toBeLessThan(0.1);
    await page.addStyleTag({
      content: `m3e-carousel-item > ${tag} { width: 80px; height: 60px; object-fit: contain; object-position: left top; }`,
    });
    yield;
    await expect(media).toHaveCSS("width", "80px");
    await expect(media).toHaveCSS("height", "60px");
    await expect(media).toHaveCSS("object-fit", "contain");
    await expect(media).toHaveCSS("object-position", "0% 0%");
    yield;
    await item.evaluate((element, markup) => {
      element.innerHTML = `<div>${markup}</div>`;
    }, markup);
    yield;
    await expect(item.locator(tag)).toHaveCSS("object-fit", tag === "video" ? "contain" : "fill");
    await expect(item.locator(tag)).toHaveCSS("width", "640px");
    yield;
  }

  async *maskDrivenOverlayFading(direction: "ltr" | "rtl"): AsyncGenerator<void> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const markup =
      '<img alt="" width="640" height="360"><span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>';
    await render(carousel("multi-browse", 8).replace(/Item \d+/g, markup), direction);
    const host = page.locator("m3e-carousel");
    const items = host.locator("m3e-carousel-item");
    yield;
    await expect(items.nth(0).locator(".title")).toHaveCSS("opacity", "1");
    await expect(items.nth(0).locator(".subtitle")).toHaveCSS("opacity", "1");
    await expect(items.nth(1).locator(".title")).toHaveCSS("opacity", "0");
    await expect(items.nth(1).locator(".subtitle")).toHaveCSS("opacity", "1");
    await expect(items.nth(2).locator(".title")).toHaveCSS("opacity", "0");
    await expect(items.nth(2).locator(".subtitle")).toHaveCSS("opacity", "0");
    await expect(items.nth(2).getByRole("button")).toHaveAccessibleName("Coast Weekend escapes");
    yield;
    const layout = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 280,
    })!;
    const sample = await host.evaluate(
      (element, scroll) => {
        const item = element.querySelectorAll("m3e-carousel-item")[1];
        const title = item.querySelector<HTMLElement>('[slot="title"]')!;
        const media = item.querySelector("img")!;
        const text = item.shadowRoot!.querySelector<HTMLElement>(".text")!;
        const before = {
          title: title.getBoundingClientRect().toJSON(),
          media: media.getBoundingClientRect().toJSON(),
        };
        const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
        viewport.scrollLeft = getComputedStyle(element).direction === "rtl" ? -scroll : scroll;
        viewport.dispatchEvent(new Event("scroll"));
        const afterTitle = title.getBoundingClientRect();
        const afterMedia = media.getBoundingClientRect();
        return {
          titleOpacity: Number(getComputedStyle(item.shadowRoot!.querySelector(".title")!).opacity),
          subtitleOpacity: Number(
            getComputedStyle(element.querySelectorAll("m3e-carousel-item")[2].shadowRoot!.querySelector(".subtitle")!)
              .opacity,
          ),
          titleWidth: [before.title.width, afterTitle.width],
          titleHeight: [before.title.height, afterTitle.height],
          mediaWidth: [before.media.width, afterMedia.width],
          mediaHeight: [before.media.height, afterMedia.height],
          bottomInset:
            item.shadowRoot!.querySelector(".content")!.getBoundingClientRect().bottom -
            text.getBoundingClientRect().bottom,
          textAlign: getComputedStyle(text).textAlign,
        };
      },
      layout.scrollForIndex(1) / 2,
    );
    yield;
    expect(sample.titleOpacity).toBeGreaterThan(0);
    expect(sample.titleOpacity).toBeLessThan(1);
    expect(sample.subtitleOpacity).toBeGreaterThan(0);
    expect(sample.subtitleOpacity).toBeLessThan(1);
    for (const sizes of [sample.titleWidth, sample.titleHeight, sample.mediaWidth, sample.mediaHeight]) {
      expect(sizes[1]).toBeCloseTo(sizes[0], 1);
    }
    expect(sample.bottomInset).toBeCloseTo(16, 1);
    expect(sample.textAlign).toBe("start");
    yield;
  }

  async *restoredOverlayVisibility(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(
      carousel("hero", 5).replace(
        /Item \d+/g,
        '<span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>',
      ),
    );
    const host = page.locator("m3e-carousel");
    const preview = host.locator("m3e-carousel-item").nth(1);
    yield;
    await expect(preview.locator(".title")).toHaveCSS("opacity", "0");
    await expect(preview.locator(".subtitle")).toHaveCSS("opacity", "0");
    yield;
    for (const variant of ["uncontained", "fullscreen", "hero-centered", "hero"]) {
      await host.evaluate((element, variant) => element.setAttribute("variant", variant), variant);
      const opacity = variant === "uncontained" || variant === "fullscreen" ? "1" : "0";
      await expect(preview.locator(".title")).toHaveCSS("opacity", opacity);
      await expect(preview.locator(".subtitle")).toHaveCSS("opacity", opacity);
    }
    yield;
    await page.emulateMedia({ reducedMotion: "reduce" });
    yield;
    await expect(preview.locator(".title")).toHaveCSS("opacity", "1");
    await expect(preview.locator(".subtitle")).toHaveCSS("opacity", "1");
    yield;
    await page.emulateMedia({ reducedMotion: "no-preference" });
    yield;
    await expect(preview.locator(".title")).toHaveCSS("opacity", "0");
    yield;
    await preview.evaluate((element) => {
      element.id = "removed";
      document.body.append(element);
    });
    yield;
    const removed = page.locator("#removed");
    await expect(removed.locator(".title")).toHaveCSS("opacity", "1");
    await expect(removed.locator(".subtitle")).toHaveCSS("opacity", "1");
    yield;
  }

  async *overlayTypographyOverrides(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(
      carousel("hero", 2).replace(
        /Item \d+/g,
        '<span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>',
      ),
    );
    const host = page.locator("m3e-carousel");
    const item = host.locator("m3e-carousel-item").first();
    const title = item.locator('[slot="title"]');
    const subtitle = item.locator('[slot="subtitle"]');
    const defaults = {
      title: await title.evaluate((element) => getComputedStyle(element).fontSize),
      subtitle: await subtitle.evaluate((element) => getComputedStyle(element).fontSize),
    };
    yield;
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-text-color", "rgb(10, 20, 30)");
      element.style.setProperty("--m3e-carousel-item-title-font-size", "30px");
      element.style.setProperty("--m3e-carousel-item-subtitle-font-size", "18px");
      element.style.setProperty("--m3e-carousel-item-title-text-color", "rgb(40, 50, 60)");
    });
    yield;
    await expect(title).toHaveCSS("font-size", "30px");
    await expect(subtitle).toHaveCSS("font-size", "18px");
    await expect(title).toHaveCSS("color", "rgb(40, 50, 60)");
    await expect(subtitle).toHaveCSS("color", "rgb(10, 20, 30)");
    yield;
    await item.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-subtitle-font-size", "12px");
      element.style.setProperty("--m3e-carousel-item-subtitle-text-color", "rgb(70, 80, 90)");
    });
    yield;
    await expect(subtitle).toHaveCSS("font-size", "12px");
    await expect(subtitle).toHaveCSS("color", "rgb(70, 80, 90)");
    await expect(title).toHaveCSS("font-size", "30px");
    const otherSubtitle = host.locator("m3e-carousel-item").nth(1).locator('[slot="subtitle"]');
    await expect(otherSubtitle).toHaveCSS("font-size", "18px");
    await expect(otherSubtitle).toHaveCSS("color", "rgb(10, 20, 30)");
    yield;
    await item.evaluate((element: HTMLElement) => {
      element.style.removeProperty("--m3e-carousel-item-subtitle-font-size");
      element.style.removeProperty("--m3e-carousel-item-subtitle-text-color");
    });
    await host.evaluate((element: HTMLElement) => {
      for (const slot of ["title", "subtitle"]) {
        element.style.removeProperty(`--m3e-carousel-item-${slot}-font-size`);
        element.style.removeProperty(`--m3e-carousel-item-${slot}-text-color`);
      }
    });
    yield;
    await expect(title).toHaveCSS("font-size", defaults.title);
    await expect(subtitle).toHaveCSS("font-size", defaults.subtitle);
    await expect(title).toHaveCSS("color", "rgb(10, 20, 30)");
    await expect(subtitle).toHaveCSS("color", "rgb(10, 20, 30)");
    yield;
  }

  async *configurableTextScrim(): AsyncGenerator<void> {
    const { page, render } = this;
    const source = `data:image/svg+xml,${encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360" fill="white"/></svg>',
    )}`;
    await render(
      carousel("hero", 1).replace(
        "Item 1",
        `<img src="${source}" alt=""><span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>`,
      ),
    );
    const item = page.locator("m3e-carousel-item");
    const media = item.locator("img");
    yield;
    await expect
      .poll(() => media.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
      .toBe(true);
    const scrimStyle = (property: string) =>
      item
        .locator(".text")
        .evaluate((element, property) => getComputedStyle(element, "::before").getPropertyValue(property), property);
    yield;
    await expect.poll(() => scrimStyle("opacity")).toBe("0");
    const bounds = (await item.boundingBox())!;
    const mediaBounds = await media.boundingBox();
    const topClip = {
      x: bounds.x + 60,
      y: bounds.y + 10,
      width: 40,
      height: 20,
    };
    const bottomClip = {
      x: bounds.x + bounds.width - 48,
      y: bounds.y + bounds.height - 40,
      width: 20,
      height: 20,
    };
    const top = await page.screenshot({ clip: topClip });
    const bottom = await page.screenshot({ clip: bottomClip });
    await item.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-scrim-color", "rgb(0, 0, 255)");
      element.style.setProperty("--m3e-carousel-item-scrim-opacity", "0.65");
    });
    yield;
    await expect.poll(() => scrimStyle("opacity")).toBe("0.65");
    expect(await scrimStyle("background-image")).toContain("rgb(0, 0, 255)");
    expect(await page.screenshot({ clip: topClip })).toEqual(top);
    expect(await page.screenshot({ clip: bottomClip })).not.toEqual(bottom);
    expect(await media.boundingBox()).toEqual(mediaBounds);
    await expect(item.getByRole("button")).toHaveAccessibleName("Coast Weekend escapes");
    yield;
    await item.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-scrim-opacity", "0"));
    yield;
    expect(await page.screenshot({ clip: bottomClip })).toEqual(bottom);
    yield;
  }

  async *assignedTextScrims(assignedSlots: "title" | "subtitle" | "title and subtitle"): AsyncGenerator<void> {
    const { page, render } = this;
    const slots = assignedSlots.split(" and ");
    const markup = slots.map((slot) => `<span slot="${slot}">${slot}</span>`).join("");
    await render(
      carousel("multi-browse", 8, "", false, "--m3e-carousel-item-scrim-opacity:0.8").replace(/Item \d+/g, markup),
    );
    const host = page.locator("m3e-carousel");
    const items = host.locator("m3e-carousel-item");
    const opacity = (index: number) =>
      items
        .nth(index)
        .locator(".text")
        .evaluate((element) => getComputedStyle(element, "::before").opacity);
    yield;
    await expect.poll(() => opacity(0)).toBe("0.8");
    await expect.poll(() => opacity(1)).toBe(slots.includes("subtitle") ? "0.8" : "0");
    await expect.poll(() => opacity(2)).toBe("0");
    yield;
    await host.evaluate((element: HTMLElement & { moveTo(index: number): void }) => element.moveTo(2));
    yield;
    await expect.poll(() => opacity(2)).toBe("0.8");
    yield;
    await items.nth(2).evaluate((element) => element.replaceChildren());
    yield;
    await expect.poll(() => opacity(2)).toBe("0");
    yield;
    await items.nth(2).evaluate((element, markup) => {
      element.innerHTML = markup;
    }, markup);
    yield;
    await expect.poll(() => opacity(2)).toBe("0.8");
    yield;
  }

  async *specificationFeedbackColors(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`<button id="before">Before</button>${carousel("hero", 1)}`);
    await geometry(page);
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      element.style.setProperty("--md-sys-color-outline", "rgb(0, 0, 0)");
      element.style.setProperty("--md-sys-color-on-surface", "rgb(255, 0, 0)");
      element.style.setProperty("--m3e-state-layer-duration", "0s");
    });
    const item = page.locator("m3e-carousel-item");
    const action = item.getByRole("button");
    const outline = () =>
      action.locator(".base").evaluate((element) => {
        const style = getComputedStyle(element, "::after");
        return { width: style.borderTopWidth, color: style.borderTopColor };
      });
    yield;
    const contentBounds = await item.locator(".content").boundingBox();
    yield;
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(0, 0, 0)" });
    yield;
    await action.hover();
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 1 0 0 / 0.08)",
    );
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(0, 0, 0)" });
    yield;
    await page.mouse.move(0, 0);
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    yield;
    await expect(action).toBeFocused();
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(0, 0, 0)" });
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 1 0 0 / 0.1)",
    );
    yield;
    await page.keyboard.down("Space");
    yield;
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(0, 0, 0)" });
    const ripple = item.locator("m3e-ripple").locator(".ripple.pressed");
    await expect(ripple).toHaveCSS("background-color", "rgb(255, 0, 0)");
    await expect(ripple).toHaveCSS("opacity", "0.1");
    await expect(item.locator("m3e-state-layer").locator(".layer")).not.toHaveClass(/pressed/);
    yield;
    await page.keyboard.up("Space");
    yield;
    expect(await item.locator(".content").boundingBox()).toEqual(contentBounds);
    yield;
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await expect.poll(outline).toEqual({ width: "1px", color: "color(srgb 0 0 0 / 0.12)" });
    yield;
  }

  async *pointerActivationOutlines(input: "mouse" | "touch", actionType: "button" | "link"): AsyncGenerator<void> {
    const { page, render } = this;
    const touch = input === "touch";
    const link = actionType === "link";
    await render(`
      <button id="before">Before</button>
      <m3e-carousel variant="hero" style="width: 420px; height: 200px;
        --m3e-carousel-item-outline-color: rgb(0, 0, 0);
        --md-sys-color-on-surface: rgb(255, 0, 0)">
        <m3e-carousel-item label="Coast" ${link ? 'href="#coast"' : ""}>
          <img alt="" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='420' height='200'%3E%3Crect width='420' height='200' fill='skyblue'/%3E%3C/svg%3E" />
        </m3e-carousel-item>
      </m3e-carousel>
    `);
    const item = page.locator("m3e-carousel-item");
    const action = item.getByRole(link ? "link" : "button");
    await item.evaluate((element) => element.addEventListener("click", (event) => event.preventDefault()));
    const outline = () =>
      action.locator(".base").evaluate((element) => getComputedStyle(element, "::after").borderTopColor);
    yield;
    if (touch) {
      await action.tap();
    } else {
      await action.click();
    }
    yield;
    if (!link) {
      await expect(action).toBeFocused();
    }
    await expect.poll(() => item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(false);
    await expect.poll(outline).toBe("rgb(0, 0, 0)");
    await expect(item.locator("m3e-focus-ring").locator(".outline")).not.toHaveClass(/visible/);
    yield;
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    yield;
    await expect(action).toBeFocused();
    await expect.poll(outline).toBe("rgb(0, 0, 0)");
    await expect(item.locator("m3e-focus-ring").locator(".outline")).toHaveClass(/visible/);
    yield;
  }

  async *inheritedFeedbackOverrides(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(`<button id="before">Before</button>${carousel("hero", 1)}`);
    await geometry(page);
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      const properties = {
        "--m3e-carousel-item-outline-width": "2px",
        "--m3e-carousel-item-outline-color": "rgb(255, 128, 0)",
        "--m3e-carousel-item-hover-outline-color": "rgb(0, 255, 255)",
        "--m3e-carousel-item-pressed-outline-color": "rgb(0, 255, 0)",
        "--m3e-carousel-item-disabled-outline-color": "rgb(0, 0, 255)",
        "--m3e-carousel-item-disabled-outline-opacity": "50%",
        "--m3e-carousel-item-hover-state-layer-color": "rgb(0, 0, 255)",
        "--m3e-carousel-item-hover-state-layer-opacity": "25%",
        "--m3e-carousel-item-focus-state-layer-color": "rgb(0, 255, 0)",
        "--m3e-carousel-item-focus-state-layer-opacity": "20%",
        "--m3e-carousel-item-pressed-state-layer-color": "rgb(255, 255, 0)",
        "--m3e-carousel-item-pressed-state-layer-opacity": "33%",
        "--m3e-state-layer-duration": "0s",
      };
      for (const [name, value] of Object.entries(properties)) element.style.setProperty(name, value);
    });
    const item = page.locator("m3e-carousel-item");
    const action = item.getByRole("button");
    const outline = () =>
      action.locator(".base").evaluate((element) => getComputedStyle(element, "::after").borderTopColor);
    yield;
    const contentBounds = await item.locator(".content").boundingBox();
    yield;
    await expect.poll(outline).toBe("rgb(255, 128, 0)");
    yield;
    await action.hover();
    await expect.poll(outline).toBe("rgb(0, 255, 255)");
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 0 0 1 / 0.25)",
    );
    yield;
    await page.mouse.move(0, 0);
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    yield;
    await expect.poll(outline).toBe("rgb(255, 128, 0)");
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 0 1 0 / 0.2)",
    );
    yield;
    await page.keyboard.down("Space");
    yield;
    await expect.poll(outline).toBe("rgb(0, 255, 0)");
    const ripple = item.locator("m3e-ripple").locator(".ripple.pressed");
    await expect(ripple).toHaveCSS("background-color", "rgb(255, 255, 0)");
    await expect(ripple).toHaveCSS("opacity", "0.33");
    yield;
    await item.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-ripple-color", "rgb(0, 0, 255)");
      element.style.setProperty("--m3e-carousel-item-ripple-opacity", "75%");
    });
    yield;
    await expect(ripple).toHaveCSS("background-color", "rgb(0, 0, 255)");
    await expect(ripple).toHaveCSS("opacity", "0.75");
    yield;
    await page.keyboard.up("Space");
    yield;
    expect(await item.locator(".content").boundingBox()).toEqual(contentBounds);
    yield;
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await expect.poll(outline).toBe("color(srgb 0 0 1 / 0.5)");
    yield;
    await item.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-outline-width", "0"));
    yield;
    await expect
      .poll(() => action.locator(".base").evaluate((element) => getComputedStyle(element, "::after").borderTopWidth))
      .toBe("0px");
    expect(await item.locator(".content").boundingBox()).toEqual(contentBounds);
    yield;
  }

  async *maskedHoverElevation(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("multi-browse", 5));
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-elevation-lift-duration", "0s");
      element.style.setProperty("--m3e-elevation-settle-duration", "0s");
    });
    const item = page.locator("m3e-carousel-item").nth(1);
    const action = item.getByRole("button");
    const shadow = item.locator("m3e-elevation").locator(".shadow");
    const content = item.locator(".content");
    yield;
    const contentBounds = await content.boundingBox();
    const bounds = (await action.boundingBox())!;
    const resting = await shadow.evaluate((element) => getComputedStyle(element).boxShadow);
    const clip = {
      x: Math.ceil(bounds.x + bounds.width) + 1,
      y: bounds.y + 70,
      width: 3,
      height: 40,
    };
    const before = await page.screenshot({ clip });
    await action.hover();
    await expect(shadow).toHaveClass(/hover/);
    yield;
    await expect(shadow).not.toHaveCSS("box-shadow", resting);
    expect(await page.screenshot({ clip })).not.toEqual(before);
    expect(await content.boundingBox()).toEqual(contentBounds);
    expect(await action.boundingBox()).toEqual(bounds);
    yield;
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await expect(shadow).toHaveCSS("box-shadow", resting);
    expect(await page.screenshot({ clip })).toEqual(before);
    yield;
  }

  async *visiblePressedCorners(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 3));
    await geometry(page);
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    const content = item.locator(".content");
    const originalContent = await content.boundingBox();
    const box = (await action.boundingBox())!;
    const cornerIsAction = () =>
      action.evaluate((element) => {
        const bounds = element.getBoundingClientRect();
        const item = (element.getRootNode() as ShadowRoot).host;
        return document.elementFromPoint(bounds.left + 6, bounds.top + 6) === item;
      });
    yield;
    await expect.poll(cornerIsAction).toBe(false);
    yield;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    yield;
    await expect(action).toHaveCSS("border-radius", "16px");
    await expect.poll(cornerIsAction).toBe(true);
    expect(await content.boundingBox()).toEqual(originalContent);
    yield;
    await page.mouse.up();
    yield;
    await expect(action).toHaveCSS("border-radius", "28px");
    await expect.poll(cornerIsAction).toBe(false);
    yield;
    await action.dispatchEvent("pointerdown", {
      pointerId: 42,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
    });
    yield;
    await expect(action).toHaveCSS("border-radius", "16px");
    yield;
    await page.locator("m3e-carousel").locator(".viewport").dispatchEvent("pointercancel", {
      pointerId: 42,
      pointerType: "touch",
      isPrimary: true,
    });
    yield;
    await expect(action).toHaveCSS("border-radius", "28px");
    yield;
  }

  async *quickPointerPressDuration(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 3));
    await geometry(page);
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    yield;
    for (const pointerType of ["mouse", "touch"]) {
      await action.evaluate((element, pointerType) => {
        const options = {
          pointerId: 42,
          pointerType,
          isPrimary: true,
          button: 0,
          bubbles: true,
          composed: true,
        };
        element.dispatchEvent(new PointerEvent("pointerdown", options));
        element.dispatchEvent(new PointerEvent("pointerup", options));
        if (pointerType === "touch") {
          element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, composed: true }));
        }
      }, pointerType);
      yield;
      expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
      await page.clock.runFor(224);
      expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
      await page.clock.runFor(1);
      expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(false);
      yield;
    }
  }

  async *quickSpaceAndSwipeCancellation(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 3));
    await geometry(page);
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await action.focus();
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    yield;
    await page.keyboard.press("Space");
    yield;
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
    await page.clock.runFor(224);
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
    await page.clock.runFor(1);
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(false);
    yield;
    await action.dispatchEvent("pointerdown", {
      pointerId: 42,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
    });
    yield;
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
    yield;
    await swipePhase(page, "start", -10);
    yield;
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(false);
    yield;
    await swipePhase(page, "cancel", -10);
    yield;
  }

  async *roundedCornerActivation(): AsyncGenerator<void> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await item.evaluate((element) => {
      element.addEventListener("click", () => element.setAttribute("data-clicked", "true"));
    });
    yield;
    await expect.poll(async () => (await action.boundingBox())!.width).toBeGreaterThan(0);
    const bounds = (await action.boundingBox())!;
    await page.mouse.click(bounds.x + 6, bounds.y + 6);
    yield;
    await expect(item).not.toHaveAttribute("data-clicked");
    yield;
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    yield;
    await expect(item).toHaveAttribute("data-clicked", "true");
    yield;
  }

  async *keyboardPressedShapeRestoration(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await action.focus();
    yield;
    await page.keyboard.down("Space");
    yield;
    await expect(action).toHaveCSS("border-radius", "16px");
    yield;
    await page.keyboard.up("Space");
    yield;
    await expect(action).toHaveCSS("border-radius", "28px");
    yield;
    await page.keyboard.down("Enter");
    yield;
    await expect(action).toHaveCSS("border-radius", "28px");
    yield;
    await page.keyboard.up("Enter");
    await page.keyboard.down("Space");
    await expect(action).toHaveCSS("border-radius", "16px");
    await page.locator("m3e-carousel").locator(".viewport").focus();
    yield;
    await expect(action).toHaveCSS("border-radius", "28px");
    yield;
    await page.keyboard.up("Space");
    await action.focus();
    await page.keyboard.down("Space");
    yield;
    await expect(action).toHaveCSS("border-radius", "16px");
    yield;
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await expect(action).toHaveCSS("border-radius", "28px");
    yield;
    await page.keyboard.up("Space");
    await action.dispatchEvent("pointerdown", {
      isPrimary: true,
      button: 0,
      pointerType: "mouse",
    });
    yield;
    await expect(action).toHaveCSS("border-radius", "28px");
    yield;
  }

  async *customPressedShapes(): AsyncGenerator<void> {
    const { page, render } = this;
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    yield;
    await item.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-shape", "8px"));
    await action.focus();
    await page.keyboard.down("Space");
    yield;
    await expect(action).toHaveCSS("border-radius", "8px");
    yield;
    await item.evaluate((element: HTMLElement) =>
      element.style.setProperty("--m3e-carousel-item-shape-pressed-morph", "4px"),
    );
    yield;
    await expect(action).toHaveCSS("border-radius", "4px");
    await expect(item).toHaveCSS("transition-duration", "0s");
    yield;
    await page.keyboard.up("Space");
    yield;
    await expect(action).toHaveCSS("border-radius", "8px");
    yield;
    await render(carousel("fullscreen", 3));
    const fullscreenAction = page.locator("m3e-carousel-item").first().getByRole("button");
    await fullscreenAction.focus();
    await page.keyboard.down("Space");
    yield;
    await expect(fullscreenAction).toHaveCSS("border-radius", "0px");
    yield;
    await page.keyboard.up("Space");
    yield;
  }

  async *clickedPreviewSelection(
    variant: "multi-browse" | "hero" | "hero-centered",
    direction: "ltr" | "rtl",
  ): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel(variant, 5), direction);
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      element.setAttribute("data-clicks", "0");
      element.addEventListener("click", () => {
        element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1));
      });
    });
    yield;
    const bounds = (await host.locator(".viewport").boundingBox())!;
    for (const [click, index] of [1, 1, 2].entries()) {
      const before = await geometry(page);
      const preview = before.items[index];
      const x = bounds.x + (Math.max(0, preview.left) + Math.min(bounds.width, preview.right)) / 2;
      await page.mouse.move(x, bounds.y + bounds.height / 2);
      await page.mouse.down();
      yield;
      await expect(host).toHaveAttribute("selected-index", String(click === 0 ? 0 : 1));
      yield;
      await page.mouse.up();
      yield;
      await expect(host).toHaveAttribute("selected-index", String(index));
      await expect(host).toHaveAttribute("data-clicks", String(click + 1));
      await expect
        .poll(async () => {
          const result = await geometry(page);
          const item = result.items[index];
          return Math.max(Math.abs(item.width - item.visible), -item.left, item.right - bounds.width);
        })
        .toBeLessThan(1.5);
      yield;
    }
  }

  async *disabledPreviewSelection(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 5));
    const host = page.locator("m3e-carousel");
    const preview = host.locator("m3e-carousel-item").nth(1);
    await preview.evaluate((element) => element.setAttribute("disabled", ""));
    yield;
    await expect(preview.getByRole("button")).toBeDisabled();
    yield;
    const bounds = (await host.locator(".viewport").boundingBox())!;
    const item = (await geometry(page)).items[1];
    await page.mouse.click(bounds.x + (item.left + item.right) / 2, bounds.y + bounds.height / 2);
    yield;
    await expect(host).toHaveAttribute("selected-index", "0");
    expect((await geometry(page)).scroll).toBe(0);
    yield;
  }

  async *dragClickSuppression(): AsyncGenerator<void> {
    const { page, render } = this;
    await render(carousel("hero", 5));
    const layout = createCarouselGeometry({
      variant: "hero",
      viewportSize: 420,
      gap: 8,
      count: 5,
      baseSize: 280,
    })!;
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      element.setAttribute("data-clicks", "0");
      element.addEventListener("click", () => {
        element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1));
      });
      const item = element.querySelector("m3e-carousel-item")!;
      element.addEventListener("pointerdown", () => {
        element.setAttribute("data-pressed-on-down", String(item.matches(":state(--pressed)")));
      });
      element.shadowRoot!.querySelector("m3e-swipe-gesture")!.addEventListener("gesture", (event) => {
        if ((event as CustomEvent<{ phase: string }>).detail.phase === "start") {
          element.setAttribute("data-pressed-on-drag", String(item.matches(":state(--pressed)")));
        }
      });
    });
    yield;
    const box = (await host.locator(".viewport").boundingBox())!;
    const item = host.locator("m3e-carousel-item").first();
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 50, box.y + 100, { steps: 8 });
    await page.mouse.up();
    await expect(item).toHaveCSS("border-radius", "28px");
    yield;
    await expect(host).toHaveAttribute("data-pressed-on-down", "true");
    await expect(host).toHaveAttribute("data-pressed-on-drag", "false");
    await expect(host).toHaveAttribute("data-clicks", "0");
    await expect
      .poll(async () => {
        const result = await geometry(page);
        return Math.abs(result.scroll - layout.scrollForIndex(1));
      })
      .toBeLessThan(1.5);
    yield;
    await page.mouse.click(box.x + 150, box.y + 100);
    yield;
    await expect(host).toHaveAttribute("data-clicks", "1");
    yield;
  }
}
