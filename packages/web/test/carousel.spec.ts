import { expect, test } from "./fixtures";
import { createCarouselGeometry } from "../src/carousel/CarouselGeometry";

const carousel = (variant = "multi-browse", count = 8, extra = "", withGutters = false, sizing = "") => `
  <m3e-carousel variant="${variant}" style="width: 420px; ${sizing.includes("--m3e-carousel-height:") ? "" : "height: 200px;"} --m3e-carousel-item-gap: 8px; ${withGutters ? "" : "--m3e-carousel-inline-gutter:0px;--m3e-carousel-block-gutter:0px;"} ${sizing}" ${extra}>
    ${Array.from({ length: count }, (_, i) => `<m3e-carousel-item>Item ${i + 1}</m3e-carousel-item>`).join("")}
  </m3e-carousel>
`;

const traceLayouts = async (
  page: import("@playwright/test").Page,
  action: () => Promise<void>,
  requireLayout = true,
) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Tracing.start", {
    categories: "devtools.timeline,disabled-by-default-devtools.timeline.stack",
    transferMode: "ReturnAsStream",
  });
  try {
    await action();
  } finally {
    const complete = new Promise<string | undefined>((resolve) =>
      cdp.once("Tracing.tracingComplete", ({ stream }) => resolve(stream)),
    );
    await cdp.send("Tracing.end");
    const stream = await complete;
    if (!stream) {
      await cdp.detach();
      // eslint-disable-next-line no-unsafe-finally
      throw new Error("Chrome tracing did not return a stream.");
    }
    let data = "";
    for (;;) {
      const chunk = await cdp.send("IO.read", { handle: stream });
      data += chunk.data;
      if (chunk.eof) break;
    }
    await cdp.send("IO.close", { handle: stream });
    await cdp.detach();
    const trace: { traceEvents: Array<{ name: string; args?: { beginData?: { stackTrace?: unknown[] } } }> } =
      JSON.parse(data);
    const layouts = trace.traceEvents.filter((event) => event.name === "Layout");
    if (requireLayout) expect(layouts.length).toBeGreaterThan(0);
    expect(layouts.filter((event) => event.args?.beginData?.stackTrace?.length)).toHaveLength(0);
  }
};

const geometry = async (page: import("@playwright/test").Page) => {
  const host = page.locator("m3e-carousel");
  await expect
    .poll(() =>
      host.evaluate((element) =>
        [...element.querySelectorAll<HTMLElement>("m3e-carousel-item")]
          .filter((item) => !item.hidden)
          .every((item) => item.style.flexBasis !== "" && item.getBoundingClientRect().width > 0),
      ),
    )
    .toBe(true);
  return host.evaluate((element) => {
    const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
    const bounds = viewport.getBoundingClientRect();
    return {
      scroll: Math.abs(viewport.scrollLeft),
      max: viewport.scrollWidth - viewport.clientWidth,
      items: [...element.querySelectorAll<HTMLElement>("m3e-carousel-item")].map((item) => {
        const rect = item.getBoundingClientRect();
        const inset = Number.parseFloat(item.style.getPropertyValue("--_carousel-clip").split(" ")[1]) || 0;
        return {
          width: rect.width,
          left: rect.left + inset - bounds.left,
          right: rect.right - inset - bounds.left,
          visible: rect.width - 2 * inset,
        };
      }),
    };
  });
};

const fling = (
  page: import("@playwright/test").Page,
  velocity: number,
  translation = Math.sign(velocity) * 40,
  axis: "x" | "y" = "x",
) =>
  page.locator("m3e-carousel").evaluate(
    (element, { velocity, translation, axis }) => {
      const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
      for (const phase of ["start", "update", "end"]) {
        gesture.dispatchEvent(
          new CustomEvent("gesture", {
            detail: {
              gestureName: "swipe",
              inputId: 1,
              timestamp: performance.now(),
              phase,
              axis,
              direction: axis === "x" ? (velocity < 0 ? "left" : "right") : velocity < 0 ? "up" : "down",
              startClientX: 0,
              startClientY: 0,
              startLocalX: 0,
              startLocalY: 0,
              translationX: axis === "x" && phase !== "start" ? translation : 0,
              translationY: axis === "y" && phase !== "start" ? translation : 0,
              velocityX: axis === "x" ? velocity : 0,
              velocityY: axis === "y" ? velocity : 0,
              speed: Math.abs(velocity),
              displacement: Math.abs(translation),
              duration: 50,
            },
          }),
        );
      }
    },
    { velocity, translation, axis },
  );

const swipePhase = (
  page: import("@playwright/test").Page,
  phase: "start" | "update" | "end" | "cancel",
  translation: number,
  axis: "x" | "y" = "x",
  velocity = 0,
) =>
  page.locator("m3e-carousel").evaluate(
    (element, { phase, translation, axis, velocity }) => {
      element.shadowRoot!.querySelector("m3e-swipe-gesture")!.dispatchEvent(
        new CustomEvent("gesture", {
          detail: {
            gestureName: "swipe",
            inputId: 1,
            timestamp: performance.now(),
            phase,
            axis,
            direction: axis === "x" ? (translation < 0 ? "left" : "right") : translation < 0 ? "up" : "down",
            startClientX: 0,
            startClientY: 0,
            startLocalX: 0,
            startLocalY: 0,
            translationX: axis === "x" ? translation : 0,
            translationY: axis === "y" ? translation : 0,
            velocityX: axis === "x" ? velocity : 0,
            velocityY: axis === "y" ? velocity : 0,
            speed: Math.abs(velocity),
            displacement: Math.abs(translation),
            duration: 100,
          },
        }),
      );
    },
    { phase, translation, axis, velocity },
  );

test.describe("m3e-carousel", () => {
  for (const tag of ["m3e-carousel", "m3e-carousel-grid"] as const) {
    test(`${tag} supports selected-index and selectedIndex for navigation`, async ({ page, render }) => {
      await render(`
        <${tag} selected-index="1" style="width: 520px; height: 200px">
          ${Array.from({ length: 4 }, (_, i) => `<m3e-carousel-item>Item ${i + 1}</m3e-carousel-item>`).join("")}
        </${tag}>
      `);
      const host = page.locator(tag);
      expect(await host.evaluate((element) => (element as HTMLElement & { selectedIndex: number }).selectedIndex)).toBe(
        1,
      );
      await host.evaluate((element) => {
        element.addEventListener("change", (event) => {
          element.setAttribute("data-change", String((event as CustomEvent<{ index: number }>).detail.index));
        });
        (element as HTMLElement & { selectedIndex: number }).selectedIndex = 2;
      });
      await expect(host).toHaveAttribute("selected-index", "2");
      await expect(host).not.toHaveAttribute("data-change");
      await host.evaluate((element) => (element as HTMLElement & { moveNext(): void }).moveNext());
      await expect(host).toHaveAttribute("selected-index", "3");
      await expect(host).toHaveAttribute("data-change", "3");
    });
  }

  test("m3e-carousel-grid exposes responsive rows, the shared API, and two-dimensional focus", async ({
    page,
    render,
  }) => {
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

    await host.evaluate((element) => {
      element.addEventListener("change", (event) => {
        const detail = (event as CustomEvent<{ index: number }>).detail;
        element.setAttribute("data-change", `${detail.index}`);
      });
    });
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
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
    await expect(page.locator("#after")).toBeFocused();

    const itemCount = await host.evaluate(
      (element) => (element as HTMLElement & { items: readonly HTMLElement[] }).items.length,
    );
    expect(itemCount).toBe(5);
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(3);
    });
    await expect(host).toHaveAttribute("selected-index", "3");
    await expect(host).toHaveAttribute("data-change", "3");
    await host.evaluate((element) => {
      const grid = element as HTMLElement & { movePrevious(): void; moveNext(): void };
      grid.movePrevious();
      grid.moveNext();
    });
    await expect(host).toHaveAttribute("selected-index", "3");

    await host.evaluate((element) => ((element as HTMLElement).style.width = "300px"));
    await expect(host).toHaveAttribute("aria-colcount", "1");
    await expect(host).toHaveAttribute("aria-rowcount", "5");
    await expect(host.getByRole("row")).toHaveCount(5);
  });

  for (const direction of ["ltr", "rtl"] as const) {
    test(`m3e-carousel-grid tracks CSS sizing, fractional thresholds and reconnection in ${direction}`, async ({
      page,
      render,
    }) => {
      await render(
        `<div id="grid-container" style="--grid-min:200px;--grid-gap:16px">
          <m3e-carousel-grid style="width:520px;--m3e-carousel-grid-item-min-width:var(--grid-min);--m3e-carousel-grid-item-gap:var(--grid-gap)">
            ${Array.from({ length: 7 }, (_, index) => `<m3e-carousel-item>Item ${index + 1}</m3e-carousel-item>`).join("")}
          </m3e-carousel-grid>
        </div>`,
        direction,
      );
      const host = page.locator("m3e-carousel-grid");
      await expect(host).toHaveAttribute("aria-colcount", "2");
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
      await host.evaluate((element) => {
        const parent = element.parentElement!;
        element.remove();
        (element as HTMLElement).style.width = "632px";
        parent.style.setProperty("--grid-min", "200px");
        parent.style.setProperty("--grid-gap", "16px");
        parent.append(element);
      });
      await expect(host).toHaveAttribute("aria-colcount", "3");
      await expect(host.getByRole("row")).toHaveCount(3);
    });
  }

  test("m3e-carousel-grid updates simultaneous grids and inherited sizing without forcing layout", async ({
    page,
    render,
  }) => {
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
    for (const host of await page.locator("m3e-carousel-grid").all()) {
      await expect(host).toHaveAttribute("aria-colcount", "2");
    }
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
    for (const host of await page.locator("m3e-carousel-grid").all()) {
      await expect(host).toHaveAttribute("aria-colcount", "3");
    }
  });

  for (const direction of ["ltr", "rtl"] as const) {
    test(`m3e-carousel-grid pages within its scroll area in ${direction}`, async ({ page, render }) => {
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
      await expect(host).toHaveAttribute("aria-colcount", "3");
      const action = (index: number) => host.getByRole("button", { name: `Item ${index + 1}`, exact: true });
      await action(1).focus();
      await page.keyboard.press("PageDown");
      await expect(action(7)).toBeFocused();
      await expect(host).toHaveAttribute("selected-index", "7");
      await page.keyboard.press("PageUp");
      await expect(action(1)).toBeFocused();

      await host
        .locator("m3e-carousel-item")
        .nth(7)
        .evaluate((item) => item.setAttribute("disabled", ""));
      await expect(action(7)).toHaveAttribute("aria-disabled", "true");
      await page.keyboard.press("PageDown");
      await expect(action(6)).toBeFocused();
      await action(1).focus();
      for (const index of [6, 8]) {
        await host
          .locator("m3e-carousel-item")
          .nth(index)
          .evaluate((item) => item.setAttribute("disabled", ""));
        await expect(action(index)).toHaveAttribute("aria-disabled", "true");
      }
      await page.keyboard.press("PageDown");
      await expect(action(10)).toBeFocused();
      await page.keyboard.press("PageUp");
      await expect(action(4)).toBeFocused();

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
      await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
    });
  }

  test("m3e-carousel-grid pages by the document viewport height", async ({ page, render }) => {
    await page.setViewportSize({ width: 800, height: 360 });
    await render(`
      <m3e-carousel-grid style="width:400px;--m3e-carousel-grid-item-min-width:180px;--m3e-carousel-grid-item-gap:20px">
        ${Array.from({ length: 12 }, (_, index) => `<m3e-carousel-item style="height:100px">Item ${index + 1}</m3e-carousel-item>`).join("")}
      </m3e-carousel-grid>
    `);
    const host = page.locator("m3e-carousel-grid");
    await expect(host).toHaveAttribute("aria-colcount", "2");
    await host.getByRole("button", { name: "Item 2", exact: true }).focus();
    await page.keyboard.press("PageDown");
    await expect(host.getByRole("button", { name: "Item 8", exact: true })).toBeFocused();
    await page.keyboard.press("PageUp");
    await expect(host.getByRole("button", { name: "Item 2", exact: true })).toBeFocused();
  });

  test("m3e-carousel-grid follows document direction instead of a local dir attribute", async ({ page, render }) => {
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
    await host.getByRole("button", { name: "Coast", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(host).toHaveAttribute("selected-index", "1");
  });

  test("m3e-carousel-grid tracks hidden items and restores managed attributes when removed", async ({
    page,
    render,
  }) => {
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
    await expect(host).toHaveAttribute("aria-rowcount", "2");
    await items.nth(1).evaluate((item) => item.setAttribute("hidden", ""));
    await expect(host).toHaveAttribute("aria-rowcount", "1");
    await expect(host.getByRole("gridcell")).toHaveCount(2);
    await items.nth(1).evaluate((item) => item.removeAttribute("hidden"));
    await expect(host).toHaveAttribute("aria-rowcount", "2");

    await host.evaluate((element) => {
      const item = element.querySelector("m3e-carousel-item")!;
      document.querySelector("#destination")!.append(item);
      element.remove();
    });
    const detachedItem = page.locator("#destination m3e-carousel-item");
    await expect(detachedItem).not.toHaveAttribute("slot", /./);
    await expect(detachedItem).not.toHaveAttribute("aria-colindex", /./);
  });

  test("does not render built-in navigation buttons in any layout", async ({ page, render }) => {
    for (const variant of ["multi-browse", "uncontained", "hero", "hero-centered", "fullscreen"]) {
      await render(carousel(variant, 5));
      await expect(page.locator("m3e-carousel").getByRole("button", { name: /^(Next|Previous) item$/ })).toHaveCount(0);
    }
  });

  test("ignores direct children that are not carousel items", async ({ page, render }) => {
    await render(`
      <m3e-carousel aria-label="Destinations">
        <div id="unsupported">Not a carousel item</div>
        <m3e-carousel-item>Coast</m3e-carousel-item>
      </m3e-carousel>
    `);
    const host = page.locator("m3e-carousel");
    await expect(host.locator("m3e-carousel-item")).toHaveCount(1);
    await expect(page.locator("#unsupported")).toBeHidden();
    await expect(host).toHaveAttribute("aria-colcount", "1");
    await expect(host.getByRole("button", { name: "Coast" })).toHaveCount(1);
  });

  test("exposes a named grid containing a row of cells with named item actions", async ({ page, render }) => {
    await render(carousel("hero", 3, 'aria-label="Destinations"'));
    const host = page.locator("m3e-carousel");
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
  });

  test("exposes fullscreen as a column and updates grid structure when the variant changes", async ({
    page,
    render,
  }) => {
    await render(carousel("fullscreen", 3, 'aria-label="Destinations"'));
    const host = page.locator("m3e-carousel");
    const items = host.locator("m3e-carousel-item");
    await expect(host.getByRole("row")).toHaveCount(3);
    await expect(host.getByRole("gridcell")).toHaveCount(3);
    await expect(host).toHaveAttribute("aria-rowcount", "3");
    await expect(host).toHaveAttribute("aria-colcount", "1");
    await expect(items.nth(2)).toHaveAttribute("aria-rowindex", "3");
    await expect(items.nth(2)).toHaveRole("row");
    await host.evaluate((element) => element.setAttribute("variant", "hero"));
    await expect(host.getByRole("row")).toHaveCount(1);
    await expect(items.nth(2)).toHaveRole("gridcell");
    await expect(items.nth(2)).not.toHaveAttribute("aria-rowindex", /./);
    await expect(items.nth(2)).toHaveAttribute("aria-colindex", "3");
    await expect(host).toHaveAttribute("aria-colcount", "3");
  });

  test("supports link actions, explicit labels, and live changes to action type and disabled state", async ({
    page,
    render,
  }) => {
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
    await expect(page.locator("m3e-carousel-item").nth(1)).not.toHaveAttribute("aria-label", /./);
    await item.evaluate((element) => element.removeAttribute("href"));
    const button = item.getByRole("button", { name: "Coast Weekend escapes" });
    await expect(button).toHaveCount(1);
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    await expect(button).toBeDisabled();
    await item.evaluate((element) => element.setAttribute("href", "#coast"));
    await expect(link).toHaveAttribute("aria-disabled", "true");
    await expect(link.locator("a")).toHaveCount(0);
    await item.evaluate((element) => element.removeAttribute("disabled"));
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
    await expect(item).toHaveCSS("border-radius", "28px");
    await page.keyboard.up("Space");
    await expect(item).toHaveAttribute("data-clicks", "0");
    await page.keyboard.down("Enter");
    await expect(item).toHaveCSS("border-radius", "28px");
    await page.keyboard.up("Enter");
    await expect(item).toHaveAttribute("data-clicks", "1");
  });

  for (const variant of ["multi-browse", "hero", "hero-centered"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} pages by a viewport and skips disabled actions in ${direction}`, async ({ page, render }) => {
        await render(
          carousel(variant, 12, "", false, "--m3e-carousel-item-width:280px").replace("width: 420px", "width: 1200px"),
          direction,
        );
        const host = page.locator("m3e-carousel");
        await geometry(page);
        const destination = variant === "hero-centered" ? 5 : 4;
        const first = host.getByRole("button", { name: "Item 1", exact: true });
        await first.focus();
        await page.keyboard.press("PageDown");
        await expect(host.getByRole("button", { name: `Item ${destination + 1}`, exact: true })).toBeFocused();
        await expect(host).toHaveAttribute("selected-index", String(destination));
        await page.keyboard.press("PageUp");
        await expect(first).toBeFocused();
        await page.keyboard.press("PageUp");
        await expect(first).toBeFocused();

        await host
          .locator("m3e-carousel-item")
          .nth(destination)
          .evaluate((item) => item.setAttribute("disabled", ""));
        await expect(host.getByRole("button", { name: `Item ${destination + 1}`, exact: true })).toHaveAttribute(
          "aria-disabled",
          "true",
        );
        await page.keyboard.press("PageDown");
        await expect(host.getByRole("button", { name: `Item ${destination + 2}`, exact: true })).toBeFocused();
        await expect(host).toHaveAttribute("selected-index", String(destination + 1));
        await page.keyboard.press("End");
        await page.keyboard.press("PageUp");
        await expect(host.getByRole("button", { name: `Item ${destination}`, exact: true })).toBeFocused();
        await page.keyboard.press("End");
        await page.keyboard.press("PageDown");
        await expect(host.getByRole("button", { name: "Item 12", exact: true })).toBeFocused();
        await page.keyboard.press("Home");
        await page.keyboard.press("Shift+PageDown");
        await expect(first).toBeFocused();
        await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
      });
    }
  }

  for (const variant of ["uncontained", "fullscreen"] as const) {
    test(`${variant} pages by its fixed item geometry`, async ({ page, render }) => {
      await render(carousel(variant, 8, "", false, "--m3e-carousel-item-width:160px;--m3e-carousel-height:200px"));
      const host = page.locator("m3e-carousel");
      await geometry(page);
      const first = host.getByRole("button", { name: "Item 1", exact: true });
      await first.focus();
      await page.keyboard.press("PageDown");
      const destination = variant === "fullscreen" ? 1 : 2;
      const action = host.getByRole("button", { name: `Item ${destination + 1}`, exact: true });
      await expect(action).toBeFocused();
      await expect(host).toHaveAttribute("selected-index", String(destination));
      await expect
        .poll(async () =>
          variant === "fullscreen"
            ? host.locator(".viewport").evaluate((element: HTMLElement) => Math.abs(element.scrollTop - 216))
            : Math.abs((await geometry(page)).scroll - 336),
        )
        .toBeLessThan(1.5);
      await page.keyboard.press("PageUp");
      await expect(first).toBeFocused();
    });
  }

  for (const variant of ["multi-browse", "hero", "hero-centered", "uncontained", "fullscreen"]) {
    test(`${variant} uses one Tab stop and reveals arrow-focused actions without activation`, async ({
      page,
      render,
    }) => {
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
      await page.locator("#before").focus();
      await page.keyboard.press("Tab");
      for (let index = 0; index < 5; index++) {
        if (index > 0) await page.keyboard.press(forward);
        const action = host.getByRole("button", { name: `Item ${index + 1}`, exact: true });
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
      await page.keyboard.press(forward);
      await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
      await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
      await expect(host).toHaveAttribute("data-clicks", "0");
      await page.keyboard.press("Tab");
      await expect(page.locator("#after")).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
      await page.keyboard.press("Home");
      await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
      await page.keyboard.press("Home");
      await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
      await page.keyboard.press("Shift+Tab");
      await expect(page.locator("#before")).toBeFocused();
    });
  }

  for (const variant of ["multi-browse", "hero", "hero-centered", "uncontained", "fullscreen"] as const) {
    for (const direction of variant === "hero" ? (["ltr", "rtl"] as const) : (["ltr"] as const)) {
      test(`${variant} animates arrow navigation and retargets immediately in ${direction}`, async ({
        page,
        render,
      }) => {
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await render(carousel(variant, 5, "", true), direction);
        const host = page.locator("m3e-carousel");
        await host.getByRole("button", { name: "Item 1", exact: true }).focus();
        const forward = variant === "fullscreen" ? "ArrowDown" : direction === "rtl" ? "ArrowLeft" : "ArrowRight";
        const result = await host.evaluate(async (element, forward) => {
          const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
          const actions = [...element.querySelectorAll("m3e-carousel-item")].map(
            (item) => item.shadowRoot!.querySelector<HTMLElement>(".action")!,
          );
          const offset = () => Math.abs(viewport.scrollLeft) + viewport.scrollTop;
          const before = offset();
          actions[0].dispatchEvent(new KeyboardEvent("keydown", { key: forward, bubbles: true, composed: true }));
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
        expect(result.focused).toBe(true);
        expect(result.immediate).toBeCloseTo(result.before, 1);
        const settled = result.samples[result.samples.length - 1];
        expect(settled).toBeGreaterThan(1);
        expect(
          result.samples.filter((offset) => offset > result.before + 1 && offset < settled - 1).length,
        ).toBeGreaterThan(2);
        const retargeted = await host.evaluate((element, forward) => {
          const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
          const actions = [...element.querySelectorAll("m3e-carousel-item")].map(
            (item) => item.shadowRoot!.querySelector<HTMLElement>(".action")!,
          );
          const before = Math.abs(viewport.scrollLeft) + viewport.scrollTop;
          for (const key of ["End", "Home", forward, forward]) {
            actions
              .find((action) => action.matches(":focus-within"))!
              .dispatchEvent(new KeyboardEvent("keydown", { key, bubbles: true, composed: true }));
          }
          return {
            before,
            after: Math.abs(viewport.scrollLeft) + viewport.scrollTop,
            focused: actions[2].matches(":focus-within"),
          };
        }, forward);
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
              (await host
                .locator(".viewport")
                .evaluate((element) => Math.abs(element.scrollLeft) + element.scrollTop)) - layout.scrollForIndex(2),
            ),
          )
          .toBeLessThan(1);
        await expect(host).toHaveAttribute("selected-index", "2");
        await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
      });
    }
  }

  for (const variant of ["hero", "fullscreen"]) {
    test(`${variant} keeps arrow navigation instant with reduced motion`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await render(carousel(variant, 5));
      const host = page.locator("m3e-carousel");
      const action = host.getByRole("button", { name: "Item 1", exact: true });
      await action.focus();
      const remaining = await action.evaluate((element) => {
        element.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true, composed: true }));
        const viewport = (element.getRootNode() as ShadowRoot).host
          .closest("m3e-carousel")!
          .shadowRoot!.querySelector<HTMLElement>(".viewport")!;
        return Math.max(
          viewport.scrollWidth - viewport.clientWidth - Math.abs(viewport.scrollLeft),
          viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop,
        );
      });
      expect(remaining).toBeLessThan(1);
      await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
    });
  }

  test("skips disabled actions and repairs the entry point when items change", async ({ page, render }) => {
    await render(`
      <button id="before">Before</button>
      ${carousel("hero", 5)}
      <button id="after">After</button>
    `);
    const host = page.locator("m3e-carousel");
    const items = host.locator("m3e-carousel-item");
    await items.nth(1).evaluate((element) => element.setAttribute("disabled", ""));
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowRight");
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowLeft");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
    await items.first().evaluate((element) => element.setAttribute("disabled", ""));
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    await host.getByRole("button", { name: "Item 3", exact: true }).evaluate((element) => {
      (element.getRootNode() as ShadowRoot).host.remove();
    });
    await expect(host.getByRole("button", { name: "Item 4", exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("aria-colcount", "4");
    await items.nth(2).evaluate((element) => element.setAttribute("hidden", ""));
    await expect(host.getByRole("button", { name: "Item 5", exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("aria-colcount", "3");
    await items.first().evaluate((element) => element.removeAttribute("disabled"));
    await expect(host.locator("m3e-carousel-item-action[tabindex='0']")).toHaveCount(1);
    await page.keyboard.press("Home");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
  });

  test("scrolling does not steal action focus or change the remembered Tab entry", async ({ page, render }) => {
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
    await expect(host).toHaveAttribute("selected-index", "4");
    await expect(action).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.locator("#after")).toBeFocused();
    await page.keyboard.press("Shift+Tab");
    await expect(action).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", "1");
  });

  test("uses shared keyboard activation and feedback elements", async ({ page, render }) => {
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    await item.evaluate((element) => {
      element.setAttribute("data-clicks", "0");
      element.addEventListener("click", () => {
        element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1));
      });
    });
    const action = item.getByRole("button");
    await action.focus();
    await page.keyboard.press("Enter");
    await page.keyboard.press("Space");
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
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    await item.evaluate((element: HTMLElement) => element.click());
    await expect(item).toHaveAttribute("data-clicks", "2");
    await page.locator("m3e-carousel").locator(".viewport").focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Item 2", exact: true })).toBeFocused();
  });

  for (const direction of ["ltr", "rtl"] as const) {
    test(`uncontained clips the original rounded surface while resizing in ${direction}`, async ({ page, render }) => {
      await render(carousel("uncontained", 5, "", true, "--m3e-carousel-item-width:160px"), direction);
      const host = page.locator("m3e-carousel");
      const viewport = host.locator(".viewport");
      const items = host.locator("m3e-carousel-item");
      const leading = items.first().getByRole("button");
      const trailing = items.nth(2).getByRole("button");
      const left = direction === "ltr";
      const surface = trailing.locator(".base");
      await host.evaluate((element: HTMLElement) => {
        element.style.setProperty("--m3e-elevation-lift-duration", "0s");
        element.style.setProperty("--m3e-elevation-settle-duration", "0s");
      });
      const originalContent = await items.nth(2).locator(".content").boundingBox();
      await expect(surface).toHaveCSS("border-radius", "28px");
      expect((await surface.boundingBox())!.width).toBe(160);
      const viewportBounds = (await viewport.boundingBox())!;
      const actionBounds = (await trailing.boundingBox())!;
      const gutterClip = {
        x: left ? viewportBounds.x + viewportBounds.width - 15 : viewportBounds.x + 1,
        y: actionBounds.y + 80,
        width: 14,
        height: 8,
      };
      const beforeGutter = await page.screenshot({ clip: gutterClip });
      await items
        .nth(2)
        .locator(".content")
        .evaluate((element: HTMLElement) => {
          element.style.background = "rgb(0, 128, 255)";
        });
      expect(await page.screenshot({ clip: gutterClip })).toEqual(beforeGutter);
      const cutClip = {
        x: left ? actionBounds.x + actionBounds.width - 1 : actionBounds.x,
        y: actionBounds.y + 80,
        width: 1,
        height: 8,
      };
      const outlined = await page.screenshot({ clip: cutClip });
      await host.evaluate((element: HTMLElement) =>
        element.style.setProperty("--m3e-carousel-item-outline-width", "0px"),
      );
      expect(await page.screenshot({ clip: cutClip })).toEqual(outlined);
      await host.evaluate((element: HTMLElement) => element.style.removeProperty("--m3e-carousel-item-outline-width"));
      await trailing.hover();
      await expect(trailing.locator("m3e-elevation").locator(".shadow")).toHaveClass(/hover/);
      expect(await page.screenshot({ clip: gutterClip })).toEqual(beforeGutter);
      await page.mouse.move(0, 0);
      for (const visible of [100, 132, 148, 159, 160, 161, 159, 148, 132, 100]) {
        await host.evaluate((element: HTMLElement, visible) => {
          element.style.width = `${32 + 336 + visible}px`;
        }, visible);
        await expect.poll(async () => (await trailing.boundingBox())!.width).toBeCloseTo(Math.min(visible, 160), 1);
        await expect(surface).toHaveCSS("border-radius", "28px");
        const bounds = (await surface.boundingBox())!;
        expect(bounds.width).toBe(160);
        const hits = await surface.evaluate(
          (element, { left, visible }) => {
            const rect = element.getBoundingClientRect();
            const action = (element.getRootNode() as ShadowRoot).host;
            const item = (action.getRootNode() as ShadowRoot).host;
            const x = left ? rect.left + visible - 1 : rect.right - visible + 1;
            return document.elementFromPoint(x, rect.top + 1) === item;
          },
          { left, visible },
        );
        expect(hits).toBe(visible <= 132);
        expect((await items.nth(2).locator(".content").boundingBox())!.width).toBe(originalContent!.width);
      }
      await viewport.evaluate((element, left) => {
        element.scrollLeft = left ? 80 : -80;
      }, left);
      await expect.poll(async () => (await leading.boundingBox())!.width).toBe(80);
      await expect(leading.locator(".base")).toHaveCSS("border-radius", "28px");
      expect((await leading.locator(".base").boundingBox())!.width).toBe(160);
      const hits = await leading.evaluate((element, left) => {
        const rect = element.getBoundingClientRect();
        const item = (element.getRootNode() as ShadowRoot).host;
        return [left ? rect.left + 1 : rect.right - 1, left ? rect.right - 1 : rect.left + 1].map(
          (x) => document.elementFromPoint(x, rect.top + 1) === item,
        );
      }, left);
      expect(hits).toEqual([true, false]);
      await host.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-shape", "12px"));
      await expect(leading.locator(".base")).toHaveCSS("border-radius", "12px");
      await viewport.evaluate((element) => {
        element.scrollLeft = 0;
      });
      await expect.poll(async () => (await leading.boundingBox())!.width).toBe(160);
      await host.evaluate((element) => element.setAttribute("variant", "hero"));
      await expect(leading).toHaveCSS("clip-path", "none");
      await expect(trailing).toHaveCSS("clip-path", "none");
      await expect(trailing.locator(".base")).toHaveCSS("border-radius", "12px");
    });
  }

  for (const variant of ["multi-browse", "hero", "hero-centered", "uncontained"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} fits the gutter-adjusted item area and preserves scroll extents in ${direction}`, async ({
        page,
        render,
      }) => {
        await render(carousel(variant, 5, "", true, "--m3e-carousel-item-width:320px"), direction);
        const host = page.locator("m3e-carousel");
        await host.evaluate((element: HTMLElement) => {
          element.style.width = "452px";
          element.style.height = "216px";
        });
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
              Math.abs(
                (await viewport.evaluate((element) => Math.abs(element.scrollLeft))) - layout.scrollForIndex(index),
              ),
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
      });
    }
  }

  for (const direction of ["ltr", "rtl"] as const) {
    test(`keeps the full scroll extent while items morph and the item count changes in ${direction}`, async ({
      page,
      render,
    }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel("hero", 8), direction);
      const host = page.locator("m3e-carousel");
      const viewport = host.locator(".viewport");
      const extent = () => viewport.evaluate((element) => element.scrollWidth - element.clientWidth);
      const expected = (count: number) =>
        createCarouselGeometry({ variant: "hero", viewportSize: 420, count, baseSize: 280, gap: 8 })!.maxScroll;
      await expect.poll(async () => Math.abs((await extent()) - expected(8))).toBeLessThan(1);
      const sign = direction === "rtl" ? 1 : -1;
      await swipePhase(page, "start", 0);
      for (const distance of [200, 600]) {
        await swipePhase(page, "update", sign * distance);
        expect(Math.abs((await extent()) - expected(8))).toBeLessThan(1);
      }
      await swipePhase(page, "cancel", sign * 600);
      await host
        .locator("m3e-carousel-item")
        .last()
        .evaluate((element: HTMLElement) => (element.hidden = true));
      await expect.poll(async () => Math.abs((await extent()) - expected(7))).toBeLessThan(1);
    });
  }

  for (const variant of ["multi-browse", "hero", "hero-centered", "uncontained"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} keeps click-transition frames inside the gutters in ${direction}`, async ({ page, render }) => {
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await render(carousel(variant, 8, "", true, "--m3e-carousel-item-width:186px"), direction);
        const host = page.locator("m3e-carousel");
        await host.evaluate((element: HTMLElement & { moveTo(index: number): void }) => {
          element.style.width = "452px";
          element.moveTo(7);
        });
        const viewport = host.locator(".viewport");
        await expect
          .poll(() =>
            viewport.evaluate((element) =>
              Math.abs(Math.abs(element.scrollLeft) - element.scrollWidth + element.clientWidth),
            ),
          )
          .toBeLessThan(1);
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
              const rect = item.shadowRoot!.querySelector(".action")!.getBoundingClientRect();
              overflow = Math.max(overflow, bounds.left + 16 - rect.left, rect.right - bounds.right + 16);
            }
            element.dataset.frameOverflow = String(overflow);
            element.dataset.frameCount = String(Number(element.dataset.frameCount) + 1);
            requestAnimationFrame(sample);
          };
          requestAnimationFrame(sample);
          return index;
        });
        expect(index).toBeGreaterThanOrEqual(0);
        expect(index).toBeLessThan(7);
        const layout = createCarouselGeometry({
          variant,
          viewportSize: 420,
          count: 8,
          baseSize: variant === "uncontained" ? 186 : 280,
          preferredSize: 186,
          gap: 8,
        })!;
        await host.locator("m3e-carousel-item").nth(index).getByRole("button").click();
        await expect(host).toHaveAttribute("selected-index", String(index));
        await expect
          .poll(async () =>
            Math.abs(
              (await viewport.evaluate((element) => Math.abs(element.scrollLeft))) - layout.scrollForIndex(index),
            ),
          )
          .toBeLessThan(1);
        const result = await host.evaluate(async (element: HTMLElement) => {
          await new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          element.dataset.monitorFrames = "false";
          return { frames: Number(element.dataset.frameCount), overflow: Number(element.dataset.frameOverflow) };
        });
        expect(result.frames).toBeGreaterThan(3);
        expect(result.overflow).toBeLessThan(1);
      });
    }
  }

  for (const variant of ["hero", "uncontained", "grid"]) {
    const boundary = variant === "grid" ? "outside its bounds" : "in the default gutters";
    test(`${variant} renders shadows and the animated outward focus ring ${boundary}`, async ({ page, render }) => {
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
      const bounds = (await action.boundingBox())!;
      const shadowClip = { x: bounds.x + 80, y: bounds.y - 2, width: 20, height: 1 };
      const beforeShadow = await page.screenshot({ clip: shadowClip });
      await action.hover();
      await expect(host.locator("m3e-elevation").locator(".shadow")).toHaveClass(/hover/);
      expect(await page.screenshot({ clip: shadowClip })).not.toEqual(beforeShadow);
      await page.mouse.move(0, 0);
      const ringClip = { x: bounds.x + 80, y: bounds.y - 7, width: 20, height: 1 };
      const beforeRing = await page.screenshot({ clip: ringClip });
      await page.locator("#before").focus();
      await page.keyboard.press("Tab");
      const ring = host.locator("m3e-focus-ring");
      await expect(ring).not.toHaveAttribute("inward", "");
      const outline = ring.locator(".outline");
      await expect(outline).toHaveClass(/visible/);
      await outline.evaluate((element: HTMLElement) => {
        element.style.animation = "grow-shrink 1s linear paused";
        const animation = element.getAnimations()[0];
        animation.pause();
        animation.currentTime = 500;
      });
      await expect(outline).toHaveCSS("outline-width", "6px");
      expect(await page.screenshot({ clip: ringClip })).not.toEqual(beforeRing);
      expect(await action.boundingBox()).toEqual(bounds);
    });
  }

  test("keeps fullscreen edge-to-edge with inward focus and no hover elevation", async ({ page, render }) => {
    await render(carousel("fullscreen", 3, "", true));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const action = host.getByRole("button", { name: "Item 1", exact: true });
    const bounds = (await viewport.boundingBox())!;
    expect(await action.boundingBox()).toEqual(bounds);
    await expect(viewport).toHaveCSS("padding", "0px");
    await expect(action.locator("m3e-focus-ring")).toHaveAttribute("inward", "");
    const shadow = action.locator("m3e-elevation").locator(".shadow");
    const resting = await shadow.evaluate((element) => getComputedStyle(element).boxShadow);
    await action.hover();
    await expect(shadow).toHaveCSS("box-shadow", resting);
    await host.evaluate((element) => element.setAttribute("variant", "hero"));
    await expect(viewport).toHaveCSS("padding", "8px 0px");
    await expect(host.locator(".track")).toHaveCSS("padding-inline", "16px");
    await expect(action.locator("m3e-focus-ring")).not.toHaveAttribute("inward", "");
  });

  test("reflows selected items when gutter overrides change and focuses offscreen actions", async ({
    page,
    render,
  }) => {
    await render(carousel("hero", 5, "", true));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const bounds = (await viewport.boundingBox())!;
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await page.keyboard.press("End");
    const action = host.getByRole("button", { name: "Item 5", exact: true });
    await expect(action).toBeFocused();
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
    await page.keyboard.press("Home");
    await expect(host.getByRole("button", { name: "Item 1", exact: true })).toBeFocused();
  });

  for (const tag of ["img", "video"]) {
    test(`automatically sizes directly slotted ${tag} without resizing it during masking`, async ({ page, render }) => {
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
      expect((await action.boundingBox())!.width).toBeLessThan(content.width);
      await host.evaluate((element: HTMLElement & { moveTo(index: number): void }) => element.moveTo(1));
      await expect.poll(async () => Math.abs((await action.boundingBox())!.width - content.width)).toBeLessThan(0.1);
      await expect.poll(sizeError).toBeLessThan(0.1);
      await page.addStyleTag({
        content: `m3e-carousel-item > ${tag} { width: 80px; height: 60px; object-fit: contain; object-position: left top; }`,
      });
      await expect(media).toHaveCSS("width", "80px");
      await expect(media).toHaveCSS("height", "60px");
      await expect(media).toHaveCSS("object-fit", "contain");
      await expect(media).toHaveCSS("object-position", "0% 0%");
      await item.evaluate((element, markup) => {
        element.innerHTML = `<div>${markup}</div>`;
      }, markup);
      await expect(item.locator(tag)).toHaveCSS("object-fit", tag === "video" ? "contain" : "fill");
      await expect(item.locator(tag)).toHaveCSS("width", "640px");
    });
  }

  for (const direction of ["ltr", "rtl"] as const) {
    test(`fades title and subtitle overlays with mask sizes in ${direction}`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      const markup =
        '<img alt="" width="640" height="360"><span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>';
      await render(carousel("multi-browse", 8).replace(/Item \d+/g, markup), direction);
      const host = page.locator("m3e-carousel");
      const items = host.locator("m3e-carousel-item");
      await expect(items.nth(0).locator(".title")).toHaveCSS("opacity", "1");
      await expect(items.nth(0).locator(".subtitle")).toHaveCSS("opacity", "1");
      await expect(items.nth(1).locator(".title")).toHaveCSS("opacity", "0");
      await expect(items.nth(1).locator(".subtitle")).toHaveCSS("opacity", "1");
      await expect(items.nth(2).locator(".title")).toHaveCSS("opacity", "0");
      await expect(items.nth(2).locator(".subtitle")).toHaveCSS("opacity", "0");
      await expect(items.nth(2).getByRole("button")).toHaveAccessibleName("Coast Weekend escapes");
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
      expect(sample.titleOpacity).toBeGreaterThan(0);
      expect(sample.titleOpacity).toBeLessThan(1);
      expect(sample.subtitleOpacity).toBeGreaterThan(0);
      expect(sample.subtitleOpacity).toBeLessThan(1);
      for (const sizes of [sample.titleWidth, sample.titleHeight, sample.mediaWidth, sample.mediaHeight]) {
        expect(sizes[1]).toBeCloseTo(sizes[0], 1);
      }
      expect(sample.bottomInset).toBeCloseTo(16, 1);
      expect(sample.textAlign).toBe("start");
    });
  }

  test("restores overlay visibility for fixed-size layouts, reduced motion and removed items", async ({
    page,
    render,
  }) => {
    await render(
      carousel("hero", 5).replace(
        /Item \d+/g,
        '<span slot="title">Coast</span><span slot="subtitle">Weekend escapes</span>',
      ),
    );
    const host = page.locator("m3e-carousel");
    const preview = host.locator("m3e-carousel-item").nth(1);
    await expect(preview.locator(".title")).toHaveCSS("opacity", "0");
    await expect(preview.locator(".subtitle")).toHaveCSS("opacity", "0");
    for (const variant of ["uncontained", "fullscreen", "hero-centered", "hero"]) {
      await host.evaluate((element, variant) => element.setAttribute("variant", variant), variant);
      const opacity = variant === "uncontained" || variant === "fullscreen" ? "1" : "0";
      await expect(preview.locator(".title")).toHaveCSS("opacity", opacity);
      await expect(preview.locator(".subtitle")).toHaveCSS("opacity", opacity);
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(preview.locator(".title")).toHaveCSS("opacity", "1");
    await expect(preview.locator(".subtitle")).toHaveCSS("opacity", "1");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(preview.locator(".title")).toHaveCSS("opacity", "0");
    await preview.evaluate((element) => {
      element.id = "removed";
      document.body.append(element);
    });
    const removed = page.locator("#removed");
    await expect(removed.locator(".title")).toHaveCSS("opacity", "1");
    await expect(removed.locator(".subtitle")).toHaveCSS("opacity", "1");
  });

  test("customizes overlay font sizes and colors independently with inherited and item-specific properties", async ({
    page,
    render,
  }) => {
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
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-text-color", "rgb(10, 20, 30)");
      element.style.setProperty("--m3e-carousel-item-title-font-size", "30px");
      element.style.setProperty("--m3e-carousel-item-subtitle-font-size", "18px");
      element.style.setProperty("--m3e-carousel-item-title-text-color", "rgb(40, 50, 60)");
    });
    await expect(title).toHaveCSS("font-size", "30px");
    await expect(subtitle).toHaveCSS("font-size", "18px");
    await expect(title).toHaveCSS("color", "rgb(40, 50, 60)");
    await expect(subtitle).toHaveCSS("color", "rgb(10, 20, 30)");
    await item.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-subtitle-font-size", "12px");
      element.style.setProperty("--m3e-carousel-item-subtitle-text-color", "rgb(70, 80, 90)");
    });
    await expect(subtitle).toHaveCSS("font-size", "12px");
    await expect(subtitle).toHaveCSS("color", "rgb(70, 80, 90)");
    await expect(title).toHaveCSS("font-size", "30px");
    const otherSubtitle = host.locator("m3e-carousel-item").nth(1).locator('[slot="subtitle"]');
    await expect(otherSubtitle).toHaveCSS("font-size", "18px");
    await expect(otherSubtitle).toHaveCSS("color", "rgb(10, 20, 30)");
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
    await expect(title).toHaveCSS("font-size", defaults.title);
    await expect(subtitle).toHaveCSS("font-size", defaults.subtitle);
    await expect(title).toHaveCSS("color", "rgb(10, 20, 30)");
    await expect(subtitle).toHaveCSS("color", "rgb(10, 20, 30)");
  });

  test("renders an opt-in configurable scrim behind text without changing media or darkening its top", async ({
    page,
    render,
  }) => {
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
    await expect
      .poll(() => media.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0))
      .toBe(true);
    const scrimStyle = (property: string) =>
      item
        .locator(".text")
        .evaluate((element, property) => getComputedStyle(element, "::before").getPropertyValue(property), property);
    await expect.poll(() => scrimStyle("opacity")).toBe("0");
    const bounds = (await item.boundingBox())!;
    const mediaBounds = await media.boundingBox();
    const topClip = { x: bounds.x + 60, y: bounds.y + 10, width: 40, height: 20 };
    const bottomClip = { x: bounds.x + bounds.width - 48, y: bounds.y + bounds.height - 40, width: 20, height: 20 };
    const top = await page.screenshot({ clip: topClip });
    const bottom = await page.screenshot({ clip: bottomClip });
    await item.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-scrim-color", "rgb(0, 0, 255)");
      element.style.setProperty("--m3e-carousel-item-scrim-opacity", "0.65");
    });
    await expect.poll(() => scrimStyle("opacity")).toBe("0.65");
    expect(await scrimStyle("background-image")).toContain("rgb(0, 0, 255)");
    expect(await page.screenshot({ clip: topClip })).toEqual(top);
    expect(await page.screenshot({ clip: bottomClip })).not.toEqual(bottom);
    expect(await media.boundingBox()).toEqual(mediaBounds);
    await expect(item.getByRole("button")).toHaveAccessibleName("Coast Weekend escapes");
    await item.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-scrim-opacity", "0"));
    expect(await page.screenshot({ clip: bottomClip })).toEqual(bottom);
  });

  for (const slots of [["title"], ["subtitle"], ["title", "subtitle"]]) {
    test(`fades the scrim with assigned ${slots.join(" and ")} slots and clears it when removed`, async ({
      page,
      render,
    }) => {
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
      await expect.poll(() => opacity(0)).toBe("0.8");
      await expect.poll(() => opacity(1)).toBe(slots.includes("subtitle") ? "0.8" : "0");
      await expect.poll(() => opacity(2)).toBe("0");
      await host.evaluate((element: HTMLElement & { moveTo(index: number): void }) => element.moveTo(2));
      await expect.poll(() => opacity(2)).toBe("0.8");
      await items.nth(2).evaluate((element) => element.replaceChildren());
      await expect.poll(() => opacity(2)).toBe("0");
      await items.nth(2).evaluate((element, markup) => {
        element.innerHTML = markup;
      }, markup);
      await expect.poll(() => opacity(2)).toBe("0.8");
    });
  }

  test("uses spec outline and feedback colors without changing item content dimensions", async ({ page, render }) => {
    await render(`<button id="before">Before</button>${carousel("hero", 1)}`);
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
    const contentBounds = await item.locator(".content").boundingBox();
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(0, 0, 0)" });
    await action.hover();
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 1 0 0 / 0.08)",
    );
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(0, 0, 0)" });
    await page.mouse.move(0, 0);
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect(action).toBeFocused();
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(255, 0, 0)" });
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 1 0 0 / 0.1)",
    );
    await page.keyboard.down("Space");
    await expect.poll(outline).toEqual({ width: "1px", color: "rgb(0, 0, 0)" });
    const ripple = item.locator("m3e-ripple").locator(".ripple.pressed");
    await expect(ripple).toHaveCSS("background-color", "rgb(255, 0, 0)");
    await expect(ripple).toHaveCSS("opacity", "0.1");
    await expect(item.locator("m3e-state-layer").locator(".layer")).not.toHaveClass(/pressed/);
    await page.keyboard.up("Space");
    expect(await item.locator(".content").boundingBox()).toEqual(contentBounds);
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    await expect.poll(outline).toEqual({ width: "1px", color: "color(srgb 0 0 0 / 0.12)" });
  });

  test("inherits outline and feedback overrides and supports item-specific ripple overrides", async ({
    page,
    render,
  }) => {
    await render(`<button id="before">Before</button>${carousel("hero", 1)}`);
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      const properties = {
        "--m3e-carousel-item-outline-width": "2px",
        "--m3e-carousel-item-outline-color": "rgb(255, 128, 0)",
        "--m3e-carousel-item-hover-outline-color": "rgb(0, 255, 255)",
        "--m3e-carousel-item-focus-outline-color": "rgb(255, 0, 255)",
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
    const contentBounds = await item.locator(".content").boundingBox();
    await expect.poll(outline).toBe("rgb(255, 128, 0)");
    await action.hover();
    await expect.poll(outline).toBe("rgb(0, 255, 255)");
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 0 0 1 / 0.25)",
    );
    await page.mouse.move(0, 0);
    await page.locator("#before").focus();
    await page.keyboard.press("Tab");
    await expect.poll(outline).toBe("rgb(255, 0, 255)");
    await expect(item.locator("m3e-state-layer").locator(".layer")).toHaveCSS(
      "background-color",
      "color(srgb 0 1 0 / 0.2)",
    );
    await page.keyboard.down("Space");
    await expect.poll(outline).toBe("rgb(0, 255, 0)");
    const ripple = item.locator("m3e-ripple").locator(".ripple.pressed");
    await expect(ripple).toHaveCSS("background-color", "rgb(255, 255, 0)");
    await expect(ripple).toHaveCSS("opacity", "0.33");
    await item.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-item-ripple-color", "rgb(0, 0, 255)");
      element.style.setProperty("--m3e-carousel-item-ripple-opacity", "75%");
    });
    await expect(ripple).toHaveCSS("background-color", "rgb(0, 0, 255)");
    await expect(ripple).toHaveCSS("opacity", "0.75");
    await page.keyboard.up("Space");
    expect(await item.locator(".content").boundingBox()).toEqual(contentBounds);
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    await expect.poll(outline).toBe("color(srgb 0 0 1 / 0.5)");
    await item.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-outline-width", "0"));
    await expect
      .poll(() => action.locator(".base").evaluate((element) => getComputedStyle(element, "::after").borderTopWidth))
      .toBe("0px");
    expect(await item.locator(".content").boundingBox()).toEqual(contentBounds);
  });

  test("renders hover elevation outside a masked action without resizing content and clears it when disabled", async ({
    page,
    render,
  }) => {
    await render(carousel("multi-browse", 5));
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-elevation-lift-duration", "0s");
      element.style.setProperty("--m3e-elevation-settle-duration", "0s");
    });
    const item = page.locator("m3e-carousel-item").nth(1);
    const action = item.getByRole("button");
    const shadow = item.locator("m3e-elevation").locator(".shadow");
    const content = item.locator(".content");
    const contentBounds = await content.boundingBox();
    const bounds = (await action.boundingBox())!;
    const resting = await shadow.evaluate((element) => getComputedStyle(element).boxShadow);
    const clip = { x: Math.ceil(bounds.x + bounds.width) + 1, y: bounds.y + 70, width: 3, height: 40 };
    const before = await page.screenshot({ clip });
    await action.hover();
    await expect(shadow).toHaveClass(/hover/);
    await expect(shadow).not.toHaveCSS("box-shadow", resting);
    expect(await page.screenshot({ clip })).not.toEqual(before);
    expect(await content.boundingBox()).toEqual(contentBounds);
    expect(await action.boundingBox()).toEqual(bounds);
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    await expect(shadow).toHaveCSS("box-shadow", resting);
    expect(await page.screenshot({ clip })).toEqual(before);
  });

  test("morphs the visible pressed corners without resizing content and restores them on release or cancellation", async ({
    page,
    render,
  }) => {
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
    await expect.poll(cornerIsAction).toBe(false);
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect(action).toHaveCSS("border-radius", "16px");
    await expect.poll(cornerIsAction).toBe(true);
    expect(await content.boundingBox()).toEqual(originalContent);
    await page.mouse.up();
    await expect(action).toHaveCSS("border-radius", "28px");
    await expect.poll(cornerIsAction).toBe(false);

    await action.dispatchEvent("pointerdown", { pointerId: 42, pointerType: "touch", isPrimary: true, button: 0 });
    await expect(action).toHaveCSS("border-radius", "16px");
    await page.locator("m3e-carousel").locator(".viewport").dispatchEvent("pointercancel", {
      pointerId: 42,
      pointerType: "touch",
      isPrimary: true,
    });
    await expect(action).toHaveCSS("border-radius", "28px");
  });

  test("retains the pressed corner shape for 225ms after quick mouse and touch taps", async ({ page, render }) => {
    await render(carousel("hero", 3));
    await geometry(page);
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));

    for (const pointerType of ["mouse", "touch"]) {
      await action.evaluate((element, pointerType) => {
        const options = { pointerId: 42, pointerType, isPrimary: true, button: 0, bubbles: true, composed: true };
        element.dispatchEvent(new PointerEvent("pointerdown", options));
        element.dispatchEvent(new PointerEvent("pointerup", options));
        if (pointerType === "touch") {
          element.dispatchEvent(new TouchEvent("touchend", { bubbles: true, composed: true }));
        }
      }, pointerType);
      expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
      await page.clock.runFor(224);
      expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
      await page.clock.runFor(1);
      expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(false);
    }
  });

  test("retains a quick Space press shape but cancels it immediately when a swipe starts", async ({ page, render }) => {
    await render(carousel("hero", 3));
    await geometry(page);
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await action.focus();
    await page.clock.install();
    await page.clock.pauseAt(new Date(Date.now() + 1000));
    await page.keyboard.press("Space");
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
    await page.clock.runFor(224);
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
    await page.clock.runFor(1);
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(false);

    await action.dispatchEvent("pointerdown", {
      pointerId: 42,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
    });
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(true);
    await swipePhase(page, "start", -10);
    expect(await item.evaluate((element) => element.matches(":state(--pressed)"))).toBe(false);
    await swipePhase(page, "cancel", -10);
  });

  test("does not activate an item outside its rounded corner", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await item.evaluate((element) => {
      element.addEventListener("click", () => element.setAttribute("data-clicked", "true"));
    });
    await expect.poll(async () => (await action.boundingBox())!.width).toBeGreaterThan(0);
    const bounds = (await action.boundingBox())!;
    await page.mouse.click(bounds.x + 6, bounds.y + 6);
    await expect(item).not.toHaveAttribute("data-clicked");
    await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
    await expect(item).toHaveAttribute("data-clicked", "true");
  });

  test("restores keyboard pressed shapes on release, focus loss, and disabling", async ({ page, render }) => {
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await action.focus();
    await page.keyboard.down("Space");
    await expect(action).toHaveCSS("border-radius", "16px");
    await page.keyboard.up("Space");
    await expect(action).toHaveCSS("border-radius", "28px");
    await page.keyboard.down("Enter");
    await expect(action).toHaveCSS("border-radius", "28px");
    await page.keyboard.up("Enter");
    await page.keyboard.down("Space");
    await expect(action).toHaveCSS("border-radius", "16px");
    await page.locator("m3e-carousel").locator(".viewport").focus();
    await expect(action).toHaveCSS("border-radius", "28px");
    await page.keyboard.up("Space");
    await action.focus();
    await page.keyboard.down("Space");
    await expect(action).toHaveCSS("border-radius", "16px");
    await item.evaluate((element) => element.setAttribute("disabled", ""));
    await expect(action).toHaveCSS("border-radius", "28px");
    await page.keyboard.up("Space");
    await action.dispatchEvent("pointerdown", { isPrimary: true, button: 0, pointerType: "mouse" });
    await expect(action).toHaveCSS("border-radius", "28px");
  });

  test("caps pressed rounding at smaller resting shapes and honors custom shapes and reduced motion", async ({
    page,
    render,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("hero", 3));
    const item = page.locator("m3e-carousel-item").first();
    const action = item.getByRole("button");
    await item.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-shape", "8px"));
    await action.focus();
    await page.keyboard.down("Space");
    await expect(action).toHaveCSS("border-radius", "8px");
    await item.evaluate((element: HTMLElement) =>
      element.style.setProperty("--m3e-carousel-item-shape-pressed-morph", "4px"),
    );
    await expect(action).toHaveCSS("border-radius", "4px");
    await expect(item).toHaveCSS("transition-duration", "0s");
    await page.keyboard.up("Space");
    await expect(action).toHaveCSS("border-radius", "8px");
    await render(carousel("fullscreen", 3));
    const fullscreenAction = page.locator("m3e-carousel-item").first().getByRole("button");
    await fullscreenAction.focus();
    await page.keyboard.down("Space");
    await expect(fullscreenAction).toHaveCSS("border-radius", "0px");
    await page.keyboard.up("Space");
  });

  for (const variant of ["multi-browse", "hero", "hero-centered"]) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} selects and fully reveals clicked previews in ${direction}`, async ({ page, render }) => {
        await render(carousel(variant, 5), direction);
        const host = page.locator("m3e-carousel");
        await host.evaluate((element) => {
          element.setAttribute("data-clicks", "0");
          element.addEventListener("click", () => {
            element.setAttribute("data-clicks", String(Number(element.getAttribute("data-clicks")) + 1));
          });
        });
        const bounds = (await host.locator(".viewport").boundingBox())!;
        for (const [click, index] of [1, 1, 2].entries()) {
          const before = await geometry(page);
          const preview = before.items[index];
          const x = bounds.x + (Math.max(0, preview.left) + Math.min(bounds.width, preview.right)) / 2;
          await page.mouse.move(x, bounds.y + bounds.height / 2);
          await page.mouse.down();
          await expect(host).toHaveAttribute("selected-index", String(click === 0 ? 0 : 1));
          await page.mouse.up();
          await expect(host).toHaveAttribute("selected-index", String(index));
          await expect(host).toHaveAttribute("data-clicks", String(click + 1));
          await expect
            .poll(async () => {
              const result = await geometry(page);
              const item = result.items[index];
              return Math.max(Math.abs(item.width - item.visible), -item.left, item.right - bounds.width);
            })
            .toBeLessThan(1.5);
        }
      });
    }
  }

  test("does not select a disabled preview when clicked", async ({ page, render }) => {
    await render(carousel("hero", 5));
    const host = page.locator("m3e-carousel");
    const preview = host.locator("m3e-carousel-item").nth(1);
    await preview.evaluate((element) => element.setAttribute("disabled", ""));
    await expect(preview.getByRole("button")).toBeDisabled();
    const bounds = (await host.locator(".viewport").boundingBox())!;
    const item = (await geometry(page)).items[1];
    await page.mouse.click(bounds.x + (item.left + item.right) / 2, bounds.y + bounds.height / 2);
    await expect(host).toHaveAttribute("selected-index", "0");
    expect((await geometry(page)).scroll).toBe(0);
  });

  test("does not activate an item after dragging but permits the next click", async ({ page, render }) => {
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
    const box = (await host.locator(".viewport").boundingBox())!;
    const item = host.locator("m3e-carousel-item").first();
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 50, box.y + 100, { steps: 8 });
    await page.mouse.up();
    await expect(item).toHaveCSS("border-radius", "28px");
    await expect(host).toHaveAttribute("data-pressed-on-down", "true");
    await expect(host).toHaveAttribute("data-pressed-on-drag", "false");
    await expect(host).toHaveAttribute("data-clicks", "0");
    await expect
      .poll(async () => {
        const result = await geometry(page);
        return Math.abs(result.scroll - layout.scrollForIndex(1));
      })
      .toBeLessThan(1.5);
    await page.mouse.click(box.x + 150, box.y + 100);
    await expect(host).toHaveAttribute("data-clicks", "1");
  });

  test("fits a responsive start-aligned arrangement without reflowing item content", async ({ page, render }) => {
    await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"));
    const initial = await geometry(page);
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

    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      element.style.width = "800px";
    });
    await expect.poll(async () => (await geometry(page)).items[2].visible).toBeGreaterThan(initial.items[2].visible);
  });

  for (const direction of ["ltr", "rtl"] as const) {
    for (const preferredSize of [undefined, 186]) {
      test(`moves the leading multi-browse item outward throughout a ${direction} drag with ${
        preferredSize ? "preferred" : "default"
      } sizing`, async ({ page, render }) => {
        await render(
          carousel("multi-browse", 8, "", false, preferredSize ? `--m3e-carousel-item-width:${preferredSize}px` : ""),
          direction,
        );
        const viewport = page.locator("m3e-carousel").locator(".viewport");
        const box = (await viewport.boundingBox())!;
        const sign = direction === "rtl" ? 1 : -1;
        const startX = box.x + (direction === "rtl" ? 120 : 300);
        const leadingEdge = (item: { left: number; right: number }) => (direction === "rtl" ? item.right : item.left);
        let previous = leadingEdge((await geometry(page)).items[0]);

        await page.mouse.move(startX, box.y + 100);
        await page.mouse.down();
        for (const distance of [40, 80, 120, 160, 200]) {
          await page.mouse.move(startX + sign * distance, box.y + 100, { steps: 4 });
          await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(distance, 0);
          await page.evaluate(
            () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
          );
          const current = leadingEdge((await geometry(page)).items[0]);
          expect(sign * (current - previous)).toBeGreaterThan(0.5);
          previous = current;
        }
        await page.mouse.up();
      });
    }
  }

  test("continues after a real uncontained pointer swipe", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    const box = (await page.locator("m3e-carousel").locator(".viewport").boundingBox())!;
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 180, box.y + 100, { steps: 4 });
    await page.mouse.up();
    const released = (await geometry(page)).scroll;
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(released + 20);
  });

  test("shifts keylines at both ends and navigates to the last item", async ({ page, render }) => {
    await render(carousel("hero-centered", 5));
    let result = await geometry(page);
    expect(result.items[0].left).toBeCloseTo(0, 0);
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(0);
    await page.waitForTimeout(600);
    result = await geometry(page);
    expect((result.items[2].left + result.items[2].right) / 2).toBeCloseTo(210, 0);
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(4);
    });
    await page.waitForTimeout(600);
    result = await geometry(page);
    expect(result.scroll).toBeCloseTo(result.max, 0);
    expect(result.items[4].right).toBeCloseTo(420, 0);
  });

  for (const direction of ["ltr", "rtl"] as const) {
    for (const preferredSize of [280, 186, 400]) {
      test(`preserves multi-browse previews between selections and shifts them at the ${direction} end (${preferredSize}px)`, async ({
        page,
        render,
      }) => {
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
        const logicalEnd = (item: { left: number; right: number }) =>
          direction === "rtl" ? 420 - item.left : item.right;
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

        await host.evaluate((element) => {
          (element as HTMLElement & { moveTo(index: number): void }).moveTo(7);
        });
        await expect
          .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(7)))
          .toBeLessThan(1);
        await page.evaluate(
          () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
        );
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
      });
    }

    test(`fills the trailing edge throughout the final multi-browse swipe in ${direction}`, async ({
      page,
      render,
    }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(
        carousel("multi-browse", 6, "", false, "--m3e-carousel-item-width:198px").replace(
          "width: 420px",
          "width: 583px",
        ),
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
      const logicalEnd = (item: { left: number; right: number }) =>
        direction === "rtl" ? 583 - item.left : item.right;
      const expectTrailingContent = async () => {
        const result = await geometry(page);
        expect(logicalEnd(result.items[5])).toBeGreaterThan(581.5);
      };

      for (const index of [2, 3, 4, 5]) {
        await host.evaluate(async (element, itemIndex) => {
          const carousel = element as HTMLElement & { moveTo(index: number): void; updateComplete: Promise<unknown> };
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

      await host.evaluate(async (element) => {
        const carousel = element as HTMLElement & { moveTo(index: number): void; updateComplete: Promise<unknown> };
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
      for (const distance of [40, 80, 120, 160, 200]) {
        await page.mouse.move(startX + sign * distance, box.y + 100, { steps: 4 });
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
    });

    test(`brings every selected multi-browse item fully into view in ${direction}`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"), direction);
      const host = page.locator("m3e-carousel");
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
      const last = (await geometry(page)).items[7];
      expect(direction === "rtl" ? Math.abs(last.left) : Math.abs(last.right - 420)).toBeLessThan(1.5);
    });
  }

  test("shows a small preview beside a start-aligned hero", async ({ page, render }) => {
    await render(carousel("hero", 5));
    const result = await geometry(page);
    expect(result.items[0].left).toBeCloseTo(0, 0);
    expect(result.items[0].visible).toBeGreaterThan(result.items[1].visible);
    expect(result.items[1].visible).toBeGreaterThan(0);
    expect(result.items[1].right).toBeLessThanOrEqual(421);
    expect(result.items[1].left - result.items[0].right).toBeCloseTo(8, 0);
  });

  for (const variant of ["hero", "hero-centered"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} adds large items on wider screens in ${direction}`, async ({ page, render }) => {
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
        await expect.poll(counts).toEqual({ large: 1, small });
        await host.evaluate((element: HTMLElement) => (element.style.width = "960px"));
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
      });
    }
  }

  test("updates centered hero preview sizing when CSS limits change", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero-centered", 5));
    const host = page.locator("m3e-carousel");
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-small-item-min-width", "4rem");
      element.style.setProperty("--m3e-carousel-small-item-max-width", "4rem");
    });
    await expect.poll(async () => (await geometry(page)).items[1].visible).toBeCloseTo(64, 0);
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
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
  });

  test("keeps centered hero previews full-sized after two swipes", async ({ page, render }) => {
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
    const result = await geometry(page);
    expect(initialPreview).toBeGreaterThanOrEqual(39);
    expect(result.items[1].visible).toBeCloseTo(initialPreview, 0);
    expect(result.items[3].visible).toBeCloseTo(initialPreview, 0);
  });

  test("applies a percentage large-item limit in hero layouts", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 8));
    const host = page.locator("m3e-carousel");
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-large-item-max-width", "50%");
    });
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeLessThanOrEqual(210);
    const result = await geometry(page);
    expect(result.items[1].visible).toBeCloseTo(result.items[0].visible, 0);
    expect(result.items[2].visible).toBeGreaterThanOrEqual(39);
    expect(result.items[2].visible).toBeLessThanOrEqual(57);
    expect(result.items[2].right).toBeCloseTo(420, 0);
  });

  for (const variant of ["hero", "hero-centered"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} keeps rounded previews inside the viewport in ${direction}`, async ({ page, render }) => {
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
        for (const index of [0, 2, 4]) {
          await host.evaluate((element, selection) => {
            (element as HTMLElement & { moveTo(index: number): void }).moveTo(selection);
          }, index);
          await expect
            .poll(async () => {
              const result = await geometry(page);
              return Math.abs(result.scroll - layout.scrollForIndex(index));
            })
            .toBeLessThan(1.5);
          await expect
            .poll(async () => {
              const result = await geometry(page);
              return Math.max(
                ...result.items.filter((_, itemIndex) => itemIndex !== index).map((item) => item.visible),
              );
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
          if (index === 4) {
            expect(Math.abs(direction === "ltr" ? 420 - selected.right : selected.left)).toBeLessThan(1.5);
          }
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
      });
    }
  }

  test("aligns the last start-aligned hero item with the viewport end", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("hero", 5));
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(4);
    });
    await expect.poll(async () => Math.abs((await geometry(page)).items[4].right - 420)).toBeLessThan(1.5);
  });

  test("changes the visible hero masks during a drag without resizing content", async ({ page, render }) => {
    await render(carousel("hero", 5));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const before = await geometry(page);
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 210, box.y + 100, { steps: 6 });
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(50);
    const during = await geometry(page);
    expect(during.items[0].width).toBeCloseTo(before.items[0].width, 2);
    expect(during.items[1].visible - before.items[1].visible).toBeGreaterThan(1);
    await page.mouse.up();
  });

  for (const variant of ["hero", "hero-centered"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} grows the incoming item during a ${direction} drag`, async ({ page, render }) => {
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
        await page.mouse.move(startX, box.y + 100);
        await page.mouse.down();
        await page.mouse.move(startX + (direction === "ltr" ? -distance : distance), box.y + 100, { steps: 8 });
        await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(distance, 0);
        const during = await geometry(page);
        const halfwaySize = (initial.items[0].visible + initial.items[1].visible) / 2;
        expect(during.items[0].visible).toBeCloseTo(halfwaySize, 0);
        expect(during.items[1].visible).toBeCloseTo(halfwaySize, 0);
        expect(during.items[0].width).toBeCloseTo(initial.items[0].width, 2);
        expect(during.items[1].width).toBeCloseTo(initial.items[1].width, 2);
        expect(
          direction === "ltr"
            ? during.items[1].left - during.items[0].right
            : during.items[0].left - during.items[1].right,
        ).toBeCloseTo(8, 0);
        const third = during.items[2];
        const revealed = Math.min(third.right, 420) - Math.max(third.left, 0);
        expect(revealed).toBeGreaterThan(1);
        expect(revealed).toBeLessThanOrEqual(56.5);
        await page.mouse.up();
      });
    }
  }

  for (const variant of ["hero", "hero-centered"] as const) {
    for (const action of ["button", "swipe"] as const) {
      test(`${variant} does not restore a departed preview during ${action} settling`, async ({ page, render }) => {
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

        const frames = await host.evaluate(async (element, trigger) => {
          const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
          const preview = element.querySelector<HTMLElement>("m3e-carousel-item")!;
          const samples: { visible: number; scroll: number }[] = [];
          const record = () => {
            const bounds = viewport.getBoundingClientRect();
            const rect = preview.getBoundingClientRect();
            const inset = Number.parseFloat(preview.style.getPropertyValue("--_carousel-clip").split(" ")[1]) || 0;
            samples.push({
              visible: Math.max(
                0,
                Math.min(rect.right - inset, bounds.right) - Math.max(rect.left + inset, bounds.left),
              ),
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
      });
    }
  }

  test("keeps a single hero item fully visible", async ({ page, render }) => {
    await render(carousel("hero-centered", 1));
    const result = await geometry(page);
    expect(result.items[0].visible).toBeCloseTo(420, 0);
    expect(result.max).toBe(0);
  });

  test("lays out an item added to an initially empty carousel", async ({ page, render }) => {
    await render(carousel("hero", 0));
    await page.locator("m3e-carousel").evaluate((element) => {
      const item = document.createElement("m3e-carousel-item");
      item.textContent = "First";
      element.append(item);
    });
    await expect.poll(async () => (await geometry(page)).items[0]?.visible).toBeCloseTo(420, 0);
  });

  for (const variant of ["hero", "hero-centered"] as const) {
    test(`${variant} can show multiple large items when a smaller preferred size is requested`, async ({
      page,
      render,
    }) => {
      await render(carousel(variant, 8, "", false, "--m3e-carousel-item-width:180px"));
      const host = page.locator("m3e-carousel");
      await host.evaluate((element: HTMLElement) => {
        element.style.width = "800px";
      });
      await expect.poll(async () => (await geometry(page)).items[0].width).toBeLessThan(300);
      await host.evaluate((element) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(3);
      });
      await page.waitForTimeout(600);
      const result = await geometry(page);
      const visible = result.items.filter((item) => item.left >= -1 && item.right <= 801 && item.visible > 0);
      const largest = Math.max(...visible.map((item) => item.visible));
      expect(visible.filter((item) => item.visible >= largest - 1).length).toBeGreaterThanOrEqual(2);
    });
  }

  for (const direction of ["ltr", "rtl"] as const) {
    test(`wide short centered hero follows a small ${direction} drag without reversing`, async ({ page, render }) => {
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
      await page.mouse.move(start, box.y + box.height / 2);
      await page.mouse.down();
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
    });
  }

  test("caps uncontained item size to the viewport", async ({ page, render }) => {
    await render(carousel("uncontained", 3, "", false, "--m3e-carousel-item-width:600px"));
    const result = await geometry(page);
    expect(result.items[0].width).toBeCloseTo(420, 0);
    expect(result.items[0].visible).toBeCloseTo(420, 0);
  });

  test("uses one item width as fixed or preferred sizing when the layout changes", async ({ page, render }) => {
    await render(carousel("uncontained", 5, "", false, "--m3e-carousel-item-width:160px"));
    const host = page.locator("m3e-carousel");
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
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-height", "200px");
      element.setAttribute("variant", "fullscreen");
    });
    await expect.poll(async () => (await host.locator("m3e-carousel-item").first().boundingBox())!.height).toBe(200);
  });

  test("resolves inherited CSS lengths and container-query changes without resizing the viewport", async ({
    page,
    render,
  }) => {
    await render(`
      <style>
        #sizing { container-type: inline-size; width: 600px; --m3e-carousel-item-width: calc(10rem + 6px); }
        @container (max-width: 500px) { m3e-carousel { --m3e-carousel-item-width: 12rem; } }
      </style>
      <div id="sizing">${carousel("uncontained", 5)}</div>
    `);
    const host = page.locator("m3e-carousel");
    const width = async () => (await geometry(page)).items[0].width;
    await expect.poll(width).toBe(166);
    await page.locator("#sizing").evaluate((element: HTMLElement) => {
      element.style.width = "400px";
    });
    await expect.poll(width).toBe(192);
    expect(await host.locator(".viewport").evaluate((element) => element.clientWidth)).toBe(420);
    await host.evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-item-width", "50%"));
    await expect.poll(width).toBe(210);
    await host.evaluate((element: HTMLElement) => {
      element.style.width = "600px";
    });
    await expect.poll(width).toBe(300);
    await host.evaluate((element: HTMLElement) => element.style.removeProperty("--m3e-carousel-item-width"));
    await expect.poll(width).toBe(192);
  });

  for (const variant of ["multi-browse", "hero", "hero-centered"] as const) {
    test(`${variant} reflows on inherited CSS preference changes and restores its default`, async ({
      page,
      render,
    }) => {
      await render(`<div id="sizing" style="--m3e-carousel-item-width:186px">
        ${carousel(variant, 8)}
      </div>`);
      for (const preferredSize of [186, 328, undefined]) {
        await page.locator("#sizing").evaluate((element: HTMLElement, preferredSize) => {
          if (preferredSize === undefined) element.style.removeProperty("--m3e-carousel-item-width");
          else element.style.setProperty("--m3e-carousel-item-width", `calc(${preferredSize / 16}rem)`);
        }, preferredSize);
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
    });
  }

  test("skips duplicate scroll presentations and invariant style reads during uncontained dragging", async ({
    page,
    render,
  }) => {
    await render(carousel("uncontained", 32, "", false, "--m3e-carousel-item-width:160px"));
    await geometry(page);
    const result = await page.locator("m3e-carousel").evaluate((element) => {
      const viewport = element.shadowRoot!.querySelector<HTMLElement>(".viewport")!;
      const gesture = element.shadowRoot!.querySelector("m3e-swipe-gesture")!;
      const styles = new Set([...element.querySelectorAll<HTMLElement>("m3e-carousel-item")].map((item) => item.style));
      const invariant = new Set([
        "flex-basis",
        "--_carousel-translate-x",
        "--_carousel-translate-y",
        "--_carousel-inset-x",
        "--_carousel-inset-y",
        "--_carousel-title-opacity",
        "--_carousel-subtitle-opacity",
        "--_carousel-clip",
      ]);
      const counts = { reads: 0, invariantReads: 0, writes: 0 };
      const get = CSSStyleDeclaration.prototype.getPropertyValue;
      const set = CSSStyleDeclaration.prototype.setProperty;
      const send = (phase: string, translationX: number) =>
        gesture.dispatchEvent(
          new CustomEvent("gesture", {
            detail: { phase, axis: "x", translationX, translationY: 0, velocityX: 0, velocityY: 0 },
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
        const updated = { ...counts };
        viewport.dispatchEvent(new Event("scroll"));
        const duplicate = { ...counts };
        send("update", -80);
        return { updated, duplicate, next: { ...counts }, scroll: viewport.scrollLeft };
      } finally {
        CSSStyleDeclaration.prototype.getPropertyValue = get;
        CSSStyleDeclaration.prototype.setProperty = set;
        send("cancel", -80);
      }
    });
    expect(result.updated.writes).toBeGreaterThan(0);
    expect(result.duplicate).toEqual(result.updated);
    expect(result.next.invariantReads).toBe(0);
    expect(result.next.reads).toBeLessThan(32);
    expect(result.scroll).toBe(80);
  });

  for (const [variant, direction] of [
    ["uncontained", "ltr"],
    ["multi-browse", "ltr"],
    ["hero", "rtl"],
    ["fullscreen", "ltr"],
  ] as const) {
    test(`${variant} drags and flings without forcing layout in ${direction}`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel(variant, 8), direction);
      await geometry(page);
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
            {
              vertical: variant === "fullscreen",
              rtl: direction === "rtl",
            },
          ),
        false,
      );
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
    });
  }

  test("uses cached sizing measurements during animated navigation", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 8, "", false, "--m3e-carousel-item-width:186px"));
    const host = page.locator("m3e-carousel");
    await expect.poll(async () => (await geometry(page)).items[0].width).toBeGreaterThan(0);
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
    expect(result.scroll).toBeGreaterThan(0);
    expect(result.bounds).toBe(0);
    expect(result.dimensions).toBe(0);
    expect(result.styles).toBeLessThanOrEqual(2);
    await expect(host).toHaveAttribute("selected-index", "7");
  });

  for (const variant of ["multi-browse", "hero", "hero-centered", "uncontained", "fullscreen"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} realigns selection after resizing without forcing layout in ${direction}`, async ({
        page,
        render,
      }) => {
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
      });
    }
  }

  for (const direction of ["ltr", "rtl"] as const) {
    test(`batches simultaneous carousel resizes without forcing layout and reconnects independently in ${direction}`, async ({
      page,
      render,
    }) => {
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
      await checkSelection(465, 314);
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
      await checkSelection(600, 300, true);
      await detached.evaluate((element) => {
        element.style.width = "600px";
        document.body.append(element);
      });
      await checkSelection(600, 300);
      await detached.dispose();
    });
  }

  test("fits the large, medium and small multi-browse arrangement", async ({ page, render }) => {
    await render(carousel("multi-browse", 8));
    const result = await geometry(page);
    expect(result.items[0].visible).toBeGreaterThan(result.items[1].visible);
    expect(result.items[1].visible).toBeGreaterThan(result.items[2].visible);
    expect(result.items[2].visible).toBeGreaterThan(0);
    expect(result.items[2].right).toBeCloseTo(420, 0);
  });

  test("updates layout when an item is hidden and restores its styles when removed", async ({ page, render }) => {
    await render(carousel("hero-centered", 3));
    const item = page.locator("m3e-carousel-item").first();
    await item.evaluate((element: HTMLElement) => {
      element.hidden = true;
    });
    await expect
      .poll(() =>
        page
          .locator("m3e-carousel")
          .evaluate((element) => (element as HTMLElement & { items: readonly HTMLElement[] }).items.length),
      )
      .toBe(2);
    await expect(item).not.toHaveAttribute("aria-label", /./);
    expect(await item.evaluate((element: HTMLElement) => element.style.getPropertyValue("flex-basis"))).toBe("");
    await expect(item).toBeHidden();
    expect((await geometry(page)).items[1].left).toBeCloseTo(0, 0);
  });

  for (const variant of ["multi-browse", "hero", "hero-centered", "uncontained", "fullscreen"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} resists edge drags without changing its scroll bounds in ${direction}`, async ({
        page,
        render,
      }) => {
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
          expect(offsets[1] - offsets[0]).toBeLessThan(offsets[0]);
          expect(offsets[2]).toBeLessThan(48);
          expect(offsets[2]).toBeGreaterThan(offsets[1]);
          await swipePhase(page, "end", sign * 400, axis, sign * 2);
          expect((await read()).offset).toBe(0);
          await page.waitForTimeout(150);
          await expect(host).toHaveAttribute("selected-index", edge === "start" ? "0" : "4");
          await expect(host).not.toHaveAttribute("data-change");
        }
      });
    }
  }

  test("springs back after a real pointer drag and cancels the return on a new press", async ({ page, render }) => {
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
    await page.mouse.move(box.x + 120, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 220, box.y + 100, { steps: 8 });
    await expect
      .poll(() => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41))
      .toBeGreaterThan(0);
    await page.mouse.up();
    await expect.poll(() => viewport.evaluate((element) => element.getAnimations().length)).toBeGreaterThan(0);
    await expect(host).not.toHaveAttribute("data-clicks");
    await page.mouse.move(box.x + 120, box.y + 100);
    await page.mouse.down();
    expect(await viewport.evaluate((element) => getComputedStyle(element).transform)).toBe("none");
    await page.mouse.up();
    await expect(host).toHaveAttribute("data-clicks", "1");
    await page.mouse.move(box.x + 220, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 120, box.y + 100, { steps: 8 });
    await expect
      .poll(() => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41))
      .toBeLessThan(0);
    await page.mouse.up();
    await expect
      .poll(() => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41))
      .toBeCloseTo(0, 1);
    await expect(host).toHaveAttribute("data-clicks", "1");
    await expect(host).toHaveAttribute("selected-index", "0");
  });

  test("clears overscroll on cancellation, navigation, direction, variant, and motion changes", async ({
    page,
    render,
  }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 5));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const offset = () => viewport.evaluate((element) => new DOMMatrixReadOnly(getComputedStyle(element).transform).m41);
    await expect
      .poll(async () => (await host.locator("m3e-carousel-item").first().boundingBox())!.width)
      .toBeGreaterThan(0);

    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", 100);
    const pulled = await offset();
    expect(pulled).toBeGreaterThan(0);
    await swipePhase(page, "update", 20);
    expect(await offset()).toBeLessThan(pulled);
    await swipePhase(page, "update", -40);
    expect(await offset()).toBe(0);
    expect(await viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0);
    await swipePhase(page, "update", 100);
    await swipePhase(page, "cancel", 100);
    await expect.poll(offset).toBeCloseTo(0, 1);

    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", 100);
    await host.evaluate((element) => (element as HTMLElement & { moveTo(index: number): void }).moveTo(0));
    await swipePhase(page, "update", 150);
    expect(await offset()).toBe(0);

    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", 100);
    await page.evaluate(() => (document.body.dir = "rtl"));
    await expect.poll(offset).toBe(0);
    await swipePhase(page, "update", 150);
    expect(await offset()).toBe(0);

    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", -100);
    await host.evaluate((element) => element.setAttribute("variant", "fullscreen"));
    await expect.poll(offset).toBe(0);

    await host.evaluate((element) => element.setAttribute("variant", "hero"));
    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", -100);
    expect(await offset()).toBeLessThan(0);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect.poll(offset).toBe(0);

    await swipePhase(page, "start", 0);
    await swipePhase(page, "update", -100);
    expect(await offset()).toBeLessThan(0);
    await host.evaluate((element) => {
      element.remove();
      document.body.append(element);
    });
    expect(await offset()).toBe(0);
  });

  test("preserves configured viewport heights inside the overscroll frame", async ({ page, render }) => {
    await render(`<div style="height:200px">${carousel("hero", 2, "", false, "--m3e-carousel-height:50%")}</div>`);
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const frame = host.locator(".viewport-frame");
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(100);
    expect((await frame.boundingBox())!.height).toBe(100);
    await host.evaluate((element: HTMLElement) => {
      element.style.setProperty("--m3e-carousel-height", "240px");
      element.setAttribute("variant", "fullscreen");
    });
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(240);
    expect((await frame.boundingBox())!.height).toBe(240);
  });

  test("fullscreen follows the carousel height and updates its item geometry when resized", async ({
    page,
    render,
  }) => {
    await render(carousel("fullscreen", 3));
    const host = page.locator("m3e-carousel");
    const viewport = host.locator(".viewport");
    const item = host.locator("m3e-carousel-item").first();

    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(200);
    await expect.poll(async () => (await item.boundingBox())!.height).toBe(200);
    await host.evaluate((element: HTMLElement) => {
      element.style.height = "120px";
    });
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(120);
    await expect.poll(async () => (await item.boundingBox())!.height).toBe(120);

    await host.evaluate((element: HTMLElement) => {
      element.style.height = "60px";
    });
    await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(60);
    await expect.poll(async () => (await item.boundingBox())!.height).toBe(60);
  });

  for (const variant of ["multi-browse", "fullscreen"] as const) {
    test(`${variant} follows explicit host height even when the height token is set`, async ({ page, render }) => {
      await render(carousel(variant, 3, "", false, "--m3e-carousel-height:256px"));
      const host = page.locator("m3e-carousel");
      const viewport = host.locator(".viewport");

      for (const height of [320, 100]) {
        await host.evaluate((element: HTMLElement, value) => {
          element.style.height = `${value}px`;
        }, height);
        await expect.poll(async () => (await host.boundingBox())!.height).toBe(height);
        await expect.poll(async () => (await viewport.boundingBox())!.height).toBe(height);
      }
    });
  }

  test("default carousel height remains 205px when the root font size changes", async ({ page, render }) => {
    await render(
      `<style>html { font-size: 20px; }</style>${carousel("multi-browse", 3).replace("height: 200px;", "")}`,
    );
    const host = page.locator("m3e-carousel");
    await expect.poll(async () => (await host.boundingBox())!.height).toBe(205);
    await expect.poll(async () => (await host.locator(".viewport").boundingBox())!.height).toBe(205);
  });

  for (const mode of ["ltr", "rtl", "fullscreen"] as const) {
    test(`keeps item positions bounded during native overscroll in ${mode}`, async ({ page, render }) => {
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
              return { before: vertical ? before.top : before.left, after: vertical ? after.top : after.left };
            } finally {
              Reflect.deleteProperty(viewport, property);
            }
          },
          { vertical, index, rtl: mode === "rtl" },
        );
        expect(result.after).toBeCloseTo(result.before, 1);
      }
    });
  }

  test("drags continuously and settles after a slow mouse gesture", async ({ page, render }) => {
    await render(carousel("hero", 5));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 90, box.y + 100, { steps: 8 });
    expect((await geometry(page)).scroll).toBeGreaterThan(180);
    await page.waitForTimeout(400);
    await page.mouse.up();
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
  });

  for (const variant of ["hero", "hero-centered"] as const) {
    test(`${variant} holds its position while a text-started drag is held outside its bounds`, async ({
      page,
      render,
    }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel(variant, 5));
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
      await page.mouse.move(startX, y);
      await page.mouse.down();
      await page.mouse.move(startX - 2, y, { steps: 2 });
      await page.waitForTimeout(100);
      for (let distance = 10; distance < startX - box.x + 60; distance += 10) {
        await page.mouse.move(startX - distance, y);
        await page.waitForTimeout(20);
      }
      const held = (await geometry(page)).scroll;
      expect(held).toBeGreaterThan(100);
      await page.waitForTimeout(600);
      expect((await geometry(page)).scroll).toBeCloseTo(held, 0);
      expect(await page.evaluate(() => getSelection()?.toString())).toBe("");
      await page.mouse.move(box.x + 60, y, { steps: 6 });
      await expect.poll(async () => (await geometry(page)).scroll).toBeLessThan(held - 50);
      await page.mouse.up();
      await expect
        .poll(async () => {
          const result = await geometry(page);
          const index = Number(await host.getAttribute("selected-index"));
          return Math.abs(result.scroll - (result.max * index) / 4);
        })
        .toBeLessThan(1.5);
    });
  }

  test("settles to the nearest item on a fast right-to-left swipe", async ({ page, render }) => {
    await render(carousel("hero", 5), "rtl");
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    await page.mouse.move(box.x + 100, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 320, box.y + 100);
    await page.mouse.up();
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(0);
  });

  for (const variant of ["hero", "hero-centered", "multi-browse"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} advances after a short fast ${direction} touch swipe`, async ({ page, render }) => {
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await render(carousel(variant, 8), direction);
        await geometry(page);
        const host = page.locator("m3e-carousel");
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
        await expect.poll(async () => Number(await host.getAttribute("selected-index"))).toBeGreaterThan(0);
        await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(40);
      });
    }
  }

  for (const variant of ["hero", "hero-centered"] as const) {
    for (const direction of ["ltr", "rtl"] as const) {
      test(`${variant} settles according to drag distance in ${direction}`, async ({ page, render }) => {
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

        await fling(page, sign * 0.1, sign * scroll);

        await expect(host).toHaveAttribute("selected-index", `${expectedIndex}`);
        expect(expectedIndex).toBeGreaterThan(1);
        await expect
          .poll(async () => Math.abs((await geometry(page)).scroll - layout.scrollForIndex(expectedIndex)))
          .toBeLessThan(1.5);
      });
    }
  }

  test("repositions items when direction changes", async ({ page, render }) => {
    await render(carousel("hero-centered", 5));
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await page.waitForTimeout(600);
    await page.evaluate(() => {
      document.body.dir = "rtl";
    });
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[2];
        return (item.left + item.right) / 2;
      })
      .toBeCloseTo(210, 0);
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(4);
    });
    await page.waitForTimeout(600);
    expect(Math.abs((await geometry(page)).items[4].left)).toBeLessThan(1.5);
  });

  test("m3e-carousel navigation follows document direction instead of a local dir attribute", async ({
    page,
    render,
  }) => {
    await render(carousel("hero", 3, 'dir="rtl"'), "ltr");
    const host = page.locator("m3e-carousel");
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(host).toHaveAttribute("selected-index", "1");
  });

  test("drags with touch input", async ({ page, render }) => {
    await render(carousel("hero", 5));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    const cdp = await page.context().newCDPSession(page);
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ x: box.x + 300, y: box.y + 100 }],
    });
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: box.x + 220, y: box.y + 100 }],
    });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + 80, y: box.y + 100 }] });
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(100);
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
    await cdp.detach();
  });

  for (const variant of ["uncontained", "fullscreen"] as const) {
    test(`${variant} owns carousel-axis touches through pointer cancellation and releases them afterward`, async ({
      page,
      render,
    }) => {
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
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - (vertical ? 0 : 40), y: y - (vertical ? 40 : 0) }],
      });
      await expect(host).toHaveAttribute("data-prevented", "true");

      const pointerId = Number(await host.getAttribute("data-pointer-id"));
      await viewport.dispatchEvent("pointercancel", { pointerId, pointerType: "touch", bubbles: true });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - 60, y: y - 60 }],
      });
      await expect(host).toHaveAttribute("data-prevented", "true");
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });

      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      await cdp.send("Input.dispatchTouchEvent", {
        type: "touchMove",
        touchPoints: [{ x: x - (vertical ? 40 : 0), y: y - (vertical ? 0 : 40) }],
      });
      await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await expect(host).toHaveAttribute("data-prevented", "false");
      await cdp.detach();
    });
  }

  test("touch taps activate items and perpendicular touch gestures scroll the page", async ({ page, render }) => {
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
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect(host).toHaveAttribute("data-clicked", "true");

    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 40 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y: y - 70 }] });
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await expect.poll(() => scroller.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
    await expect(host).toHaveAttribute("data-prevented", "false");
    await cdp.detach();
  });

  test("keeps the first and last centered-hero items focal in a narrow viewport", async ({ page, render }) => {
    await render(carousel("hero-centered", 3));
    await page.locator("m3e-carousel").evaluate((element: HTMLElement) => {
      element.style.width = "140px";
    });
    await expect.poll(async () => (await geometry(page)).items[0].left).toBeCloseTo(0, 0);
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await page.waitForTimeout(600);
    expect((await geometry(page)).items[2].right).toBeCloseTo(140, 0);
  });

  test("emits the selected item when navigating with the keyboard", async ({ page, render }) => {
    await render(carousel("hero", 5));
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      element.addEventListener("change", (event) => {
        const detail = (event as CustomEvent<{ index: number; item: HTMLElement }>).detail;
        element.setAttribute("data-change", `${detail.index}:${detail.item.textContent}`);
      });
    });
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await page.keyboard.press("ArrowRight");
    await expect(host).toHaveAttribute("data-change", "1:Item 2");
    await page.keyboard.press("End");
    await expect(host).toHaveAttribute("data-change", "4:Item 5");
    await page.keyboard.press("Home");
    await expect(host).toHaveAttribute("data-change", "0:Item 1");
  });

  test("navigates vertically in fullscreen", async ({ page, render }) => {
    await render(carousel("fullscreen", 3));
    await page
      .locator("m3e-carousel")
      .evaluate((element: HTMLElement) => element.style.setProperty("--m3e-carousel-height", "200px"));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    await page.locator("m3e-carousel").getByRole("button", { name: "Item 1", exact: true }).focus();
    await page.keyboard.press("ArrowDown");
    await expect.poll(() => viewport.evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
    await expect(page.locator("m3e-carousel")).toHaveAttribute("selected-index", "1");
  });

  test("uncontained dragging remains unsnapped", async ({ page, render }) => {
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    await page.mouse.move(box.x + 300, box.y + 100);
    await page.mouse.down();
    await page.mouse.move(box.x + 225, box.y + 100, { steps: 6 });
    await page.waitForTimeout(400);
    await page.mouse.up();
    await page.waitForTimeout(300);
    expect((await geometry(page)).scroll).toBeCloseTo(75, 0);
  });

  test("uncontained wheel scrolling remains unsnapped", async ({ page, render }) => {
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    await page.locator("m3e-carousel").locator(".viewport").hover();
    await page.mouse.wheel(75, 0);
    await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(75, 0);
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(75, 0);
  });

  test("applies final release movement to an uncontained drag without a fling", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    await geometry(page);
    await swipePhase(page, "start", -15);
    await swipePhase(page, "end", -80, "x", -0.5);
    expect((await geometry(page)).scroll).toBeCloseTo(80, 0);
  });

  for (const direction of ["ltr", "rtl"] as const) {
    test(`continues an uncontained fling without snapping in ${direction}`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"), direction);
      await fling(page, direction === "rtl" ? 0.85 : -0.85);
      const released = (await geometry(page)).scroll;
      await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(released + 100);
      await page.waitForTimeout(1500);
      const stopped = (await geometry(page)).scroll;
      await page.waitForTimeout(200);
      expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
      expect(Math.abs(stopped - Math.round(stopped / 168) * 168)).toBeGreaterThan(3);
    });
  }

  test("snaps native scrolling that follows a programmatic settle", async ({ page, render }) => {
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
    await expect(host).toHaveAttribute("selected-index", "7");
    await expect
      .poll(async () => Math.abs((await geometry(page)).scroll - target), { timeout: 3000 })
      .toBeLessThan(1.5);
  });

  for (const direction of ["ltr", "rtl"] as const) {
    test(`snaps a fast multi-browse fling beyond one item in ${direction}`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel("multi-browse", 8), direction);
      await fling(page, direction === "rtl" ? 1.8 : -1.8);
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
    });
  }

  for (const direction of ["ltr", "rtl"] as const) {
    test(`focuses the settled item after a fast swipe moves focus offscreen in ${direction}`, async ({
      page,
      render,
    }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel("multi-browse", 12), direction);
      const host = page.locator("m3e-carousel");
      const firstAction = host.getByRole("button", { name: "Item 1", exact: true });
      await firstAction.focus();
      await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
      await page.waitForTimeout(150);
      await fling(page, direction === "rtl" ? 1.8 : -1.8);
      await expect.poll(async () => Number(await host.getAttribute("selected-index"))).toBeGreaterThanOrEqual(2);
      const current = Number(await host.getAttribute("selected-index"));
      await expect(host.getByRole("button", { name: `Item ${current + 1}`, exact: true })).toBeFocused();
      await page.keyboard.press(direction === "rtl" ? "ArrowLeft" : "ArrowRight");
      await expect(host.getByRole("button", { name: `Item ${current + 2}`, exact: true })).toBeFocused();
      await expect(host).toHaveAttribute("selected-index", String(current + 1));
    });
  }

  test("leaves focus on an item that remains visible after a swipe", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    const host = page.locator("m3e-carousel");
    const action = host.getByRole("button", { name: "Item 1", exact: true });
    await action.focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    await fling(page, -0.001, -75);
    await expect.poll(async () => (await geometry(page)).scroll).toBeCloseTo(75, 0);
    await expect(action).toBeFocused();
  });

  test("does not steal external focus after a swipe", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(`<button id="outside">Outside</button>${carousel("multi-browse", 8)}`);
    const outside = page.locator("#outside");
    await outside.focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    await fling(page, -1.8);
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThanOrEqual(2);
    await expect(outside).toBeFocused();
  });

  test("does not move focus back after the user leaves during a fling", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(`<button id="outside">Outside</button>${carousel("multi-browse", 12)}`);
    const host = page.locator("m3e-carousel");
    const outside = page.locator("#outside");
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
    await page.waitForTimeout(150);
    await fling(page, -1.8);
    await outside.focus();
    await expect.poll(async () => Number(await host.getAttribute("selected-index"))).toBeGreaterThanOrEqual(2);
    await expect(outside).toBeFocused();
  });

  for (const method of ["moveTo", "selectedIndex"] as const) {
    test(`does not move focus when ${method} interrupts a swipe`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "no-preference" });
      await render(carousel("multi-browse", 12));
      const host = page.locator("m3e-carousel");
      const action = host.getByRole("button", { name: "Item 1", exact: true });
      await action.focus();
      await expect.poll(async () => (await geometry(page)).items[0].visible).toBeGreaterThan(100);
      await page.waitForTimeout(150);
      await fling(page, -1.8);
      await host.evaluate((element, method) => {
        const carousel = element as HTMLElement & { selectedIndex: number; moveTo(index: number): void };
        if (method === "moveTo") carousel.moveTo(7);
        else carousel.selectedIndex = 7;
      }, method);
      await expect(host).toHaveAttribute("selected-index", "7");
      await page.waitForTimeout(1300);
      await expect(action).toBeFocused();
      await expect(host).toHaveAttribute("selected-index", "7");
    });
  }

  test("moves offscreen focus after a real fullscreen pointer swipe", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("fullscreen", 3, "", false, "--m3e-carousel-height:200px"));
    const host = page.locator("m3e-carousel");
    await host.getByRole("button", { name: "Item 1", exact: true }).focus();
    await page.waitForTimeout(150);
    const box = (await host.locator(".viewport").boundingBox())!;
    await page.mouse.move(box.x + 100, box.y + 170);
    await page.mouse.down();
    await page.mouse.move(box.x + 100, box.y + 30, { steps: 5 });
    await page.mouse.up();
    await expect(host).toHaveAttribute("selected-index", "1");
    await expect(host.getByRole("button", { name: "Item 2", exact: true })).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
  });

  test("focuses an enabled visible item without snapping an uncontained swipe", async ({ page, render }) => {
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
    await fling(page, -0.001, -200);
    await expect(host.getByRole("button", { name: "Item 3", exact: true })).toBeFocused();
    await expect(host).toHaveAttribute("selected-index", "1");
    expect((await geometry(page)).scroll).toBeCloseTo(200, 0);
  });

  for (const variant of ["hero", "hero-centered", "fullscreen"] as const) {
    for (const direction of variant === "fullscreen" ? (["ltr"] as const) : (["ltr", "rtl"] as const)) {
      test(`${variant} uses release velocity to settle the selected item in ${direction}`, async ({ page, render }) => {
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
        }
        expect(samples[1]).toBeGreaterThan(samples[0] + 30);
        await host.evaluate((element) => {
          (element as HTMLElement & { moveTo(index: number): void }).moveTo(3);
        });
        await expect.poll(async () => Math.abs((await offset()) - layout.scrollForIndex(3))).toBeLessThan(1.5);
        const reverseTranslation = vertical ? translation : (layout.scrollForIndex(3) - layout.scrollForIndex(2)) * 0.6;
        await fling(page, -sign * 3, -sign * reverseTranslation, axis);
        await expect(host).toHaveAttribute("selected-index", "2");
        await expect.poll(async () => Math.abs((await offset()) - layout.scrollForIndex(2))).toBeLessThan(1.5);
      });
    }

    test(`${variant} settles immediately with reduced motion`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await render(
        carousel(variant, 6).replace(
          "--m3e-carousel-item-gap: 8px",
          "--m3e-carousel-item-gap: 8px; --m3e-carousel-height: 200px",
        ),
      );
      const vertical = variant === "fullscreen";
      await geometry(page);
      await fling(page, -2, vertical ? -40 : -200, vertical ? "y" : "x");
      await expect(page.locator("m3e-carousel")).toHaveAttribute("selected-index", "1");
      const offset = async () =>
        vertical
          ? page.locator("m3e-carousel .viewport").evaluate((element: HTMLElement) => element.scrollTop)
          : (await geometry(page)).scroll;
      const stopped = await offset();
      expect(stopped).toBeGreaterThan(40);
      await page.waitForTimeout(200);
      expect(await offset()).toBeCloseTo(stopped, 0);
    });
  }

  test("interrupts a hero fling on a new pointer press", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero-centered", 6));
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
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
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    await page.mouse.up();
    await expect
      .poll(async () =>
        Math.abs(
          (await geometry(page)).scroll - layout.scrollForIndex(Number(await host.getAttribute("selected-index"))),
        ),
      )
      .toBeLessThan(1.5);
  });

  test("stops a hero fling when reduced motion is enabled", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("hero", 6));
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    await fling(page, -0.5, -200);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(65);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[1];
        return item.width - item.visible;
      })
      .toBeCloseTo(0, 0);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
  });

  test("settles a multi-browse fling without a second acceleration", async ({ page, render }) => {
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
      const state = element as HTMLElement & { samples: { time: number; offset: number }[]; sampler: number };
      state.samples = [];
      state.sampler = window.setInterval(
        () => state.samples.push({ time: performance.now(), offset: viewport.scrollLeft }),
        100,
      );
    });
    await fling(page, -0.6);
    await page.waitForTimeout(1700);
    const offsets = await page.locator("m3e-carousel").evaluate((element) => {
      const state = element as HTMLElement & { samples: { time: number; offset: number }[]; sampler: number };
      window.clearInterval(state.sampler);
      return state.samples;
    });
    const increments = offsets
      .slice(1)
      .map((sample, index) => ((sample.offset - offsets[index].offset) * 100) / (sample.time - offsets[index].time));
    expect(offsets[offsets.length - 1].offset, JSON.stringify(offsets)).toBeGreaterThan(offsets[0].offset + 100);
    for (let index = 5; index < increments.length; index++) {
      expect(increments[index]).toBeGreaterThanOrEqual(-1);
      expect(increments[index] - increments[index - 1]).toBeLessThan(6);
    }
  });

  test("interrupts uncontained inertia on a new pointer press", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    await fling(page, -2);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(200);
    const viewport = page.locator("m3e-carousel").locator(".viewport");
    const box = (await viewport.boundingBox())!;
    await page.mouse.move(box.x + 200, box.y + 100);
    await page.mouse.down();
    const stopped = (await geometry(page)).scroll;
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThan(0);
    await page.waitForTimeout(250);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    await page.mouse.up();
  });

  test("honors reduced motion while retaining the multi-browse fling target", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("multi-browse", 8));
    await fling(page, -0.4);
    await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("1");
    await page.locator("m3e-carousel").evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(0);
    });
    await expect.poll(async () => (await geometry(page)).scroll).toBe(0);
    await fling(page, -1.8);
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThanOrEqual(2);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(150);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
  });

  for (const variant of ["multi-browse", "hero", "hero-centered"] as const) {
    test(`uses fixed-size items throughout ${variant} scrolling with reduced motion`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await render(carousel(variant, 8));
      const initial = await geometry(page);
      initial.items.forEach((item) => expect(item.visible).toBeCloseTo(item.width, 1));

      const viewport = page.locator("m3e-carousel").locator(".viewport");
      const box = (await viewport.boundingBox())!;
      await page.mouse.move(box.x + 300, box.y + 100);
      await page.mouse.down();
      await page.mouse.move(box.x + 200, box.y + 100, { steps: 4 });
      await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(80);
      const dragged = await geometry(page);
      dragged.items.forEach((item) => expect(item.visible).toBeCloseTo(item.width, 1));
      expect(dragged.items[0].left - initial.items[0].left).toBeCloseTo(-dragged.scroll, 0);
      await page.mouse.up();

      await page.locator("m3e-carousel").evaluate((element) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
      });
      await expect.poll(() => page.locator("m3e-carousel").getAttribute("selected-index")).toBe("2");
      const selected = await geometry(page);
      if (variant === "hero-centered") {
        expect((selected.items[2].left + selected.items[2].right) / 2).toBeCloseTo(210, 0);
      } else {
        expect(selected.items[2].left).toBeCloseTo(0, 0);
      }

      await page.locator("m3e-carousel").evaluate((element) => {
        (element as HTMLElement & { moveTo(index: number): void }).moveTo(7);
      });
      await expect.poll(async () => (await geometry(page)).items[7].right).toBeCloseTo(420, 0);
      await page.waitForTimeout(150);
      await expect(page.locator("m3e-carousel")).toHaveAttribute("selected-index", "7");
    });
  }

  test("updates the layout when the reduced-motion preference changes", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"));
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await expect.poll(() => host.getAttribute("selected-index")).toBe("2");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[3];
        return item.width - item.visible;
      })
      .toBeCloseTo(0, 0);
    expect((await geometry(page)).items[2].left).toBeCloseTo(0, 0);
    await expect(host).toHaveAttribute("selected-index", "2");

    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[4];
        return item.width - item.visible;
      })
      .toBeGreaterThan(1);
    await expect(host).toHaveAttribute("selected-index", "2");
  });

  test("stops a multi-browse fling when reduced motion is enabled", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("multi-browse", 8));
    await page.evaluate(
      () => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))),
    );
    await fling(page, -1.5);
    await expect.poll(async () => (await geometry(page)).scroll).toBeGreaterThan(100);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect
      .poll(async () => {
        const item = (await geometry(page)).items[1];
        return item.width - item.visible;
      })
      .toBeCloseTo(0, 0);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
  });

  test("aligns reduced-motion items in right-to-left layouts", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("multi-browse", 8, "", false, "--m3e-carousel-item-width:186px"), "rtl");
    const host = page.locator("m3e-carousel");
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(2);
    });
    await expect.poll(async () => (await geometry(page)).items[2].right).toBeCloseTo(420, 0);
    await host.evaluate((element) => {
      (element as HTMLElement & { moveTo(index: number): void }).moveTo(7);
    });
    await expect.poll(async () => (await geometry(page)).items[7].left).toBeCloseTo(0, 0);
    await page.waitForTimeout(150);
    await expect(host).toHaveAttribute("selected-index", "7");
  });

  test("preserves an unsnapped uncontained position when reduced motion changes", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    await page
      .locator("m3e-carousel")
      .locator(".viewport")
      .evaluate((element) => {
        element.scrollLeft = 75;
      });
    await expect.poll(async () => (await geometry(page)).scroll).toBe(75);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(150);
    expect((await geometry(page)).scroll).toBe(75);
  });

  test("does not jump back to the drag origin when release velocity reverses", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("multi-browse", 8));
    await fling(page, 0.3, -600);
    await expect
      .poll(async () => Number(await page.locator("m3e-carousel").getAttribute("selected-index")))
      .toBeGreaterThanOrEqual(1);
  });

  test("does not continue uncontained inertia with reduced motion", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(carousel("uncontained", 8, "", false, "--m3e-carousel-item-width:160px"));
    await fling(page, -1);
    const stopped = (await geometry(page)).scroll;
    await page.waitForTimeout(200);
    expect((await geometry(page)).scroll).toBeCloseTo(stopped, 0);
    expect(stopped).toBeCloseTo(40, 0);
  });
});

const expectSeparatedByGap = (items: { position: number; size: number }[], gap: number): void => {
  for (let index = 1; index < items.length; index++) {
    const centerDistance = items[index].position - items[index - 1].position;
    expect(centerDistance).toBeCloseTo(items[index - 1].size / 2 + gap + items[index].size / 2);
  }
};

test.describe("carousel geometry", () => {
  for (const variant of ["multi-browse", "hero", "hero-centered"] as const) {
    test(`${variant} reuses only adjacent responsive arrangements`, () => {
      const count = 32;
      const layout = createCarouselGeometry({
        variant,
        count,
        viewportSize: 420,
        gap: 8,
        baseSize: 280,
        preferredSize: 186,
      })!;
      const sample = (index: number, fraction = 0.25) =>
        layout.itemsAt(
          layout.scrollForIndex(index) + (layout.scrollForIndex(index + 1) - layout.scrollForIndex(index)) * fraction,
        );
      const OriginalArray = globalThis.Array;
      let builds = 0;
      const counts: number[] = [];
      globalThis.Array = new Proxy(OriginalArray, {
        construct(target, args, newTarget) {
          if (args.length === 1 && args[0] === count) builds++;
          return Reflect.construct(target, args, newTarget);
        },
      });
      try {
        for (const [index, fraction] of [
          [5, 0.25],
          [5, 0.75],
          [6, 0.25],
          [5, 0.25],
          [20, 0.25],
          [5, 0.25],
        ]) {
          sample(index, fraction);
          counts.push(builds);
        }
      } finally {
        globalThis.Array = OriginalArray;
      }
      expect(counts).toEqual([2, 2, 3, 4, 6, 8]);
    });

    test(`${variant} keeps cached geometry independent across calls and geometry instances`, () => {
      for (const count of [2, 8, 32]) {
        const options = { variant, count, viewportSize: 800, gap: 8, baseSize: 280, preferredSize: 180 };
        const layout = createCarouselGeometry(options)!;
        const offsets = Array.from({ length: count }, (_, index) => layout.scrollForIndex(index));
        const samples = offsets.flatMap((offset, index) =>
          index + 1 < count ? [offset, (offset + offsets[index + 1]) / 2] : [offset],
        );
        for (const offset of [...samples, ...samples.reverse()]) {
          const expected = createCarouselGeometry(options)!.itemsAt(offset);
          const items = layout.itemsAt(offset);
          expect(items).toEqual(expected);
          items[0].position = -999;
          items[0].size = -1;
          items.splice(1);
        }
        const resized = createCarouselGeometry({ ...options, viewportSize: 420 })!;
        expect(resized.itemsAt(0)).toEqual(createCarouselGeometry({ ...options, viewportSize: 420 })!.itemsAt(0));
        expect(layout.itemsAt(0)).toEqual(createCarouselGeometry(options)!.itemsAt(0));
      }
    });
  }

  test("matches Compose arrangement counts and fitted widths rather than fixed slot counts", () => {
    const cases = [
      { variant: "hero", viewportSize: 420, preferredSize: 220, gap: 8, sizes: [182, 182, 40] },
      { variant: "hero", viewportSize: 800, preferredSize: 180, gap: 8, sizes: [180, 180, 180, 180, 48] },
      { variant: "hero-centered", viewportSize: 420, preferredSize: 220, gap: 8, sizes: [158, 158, 40, 40] },
      { variant: "hero-centered", viewportSize: 800, preferredSize: 180, gap: 8, sizes: [170, 170, 170, 170, 40, 40] },
      { variant: "hero-centered", viewportSize: 980, preferredSize: 300, gap: 0, sizes: [300, 300, 300, 40, 40] },
      { variant: "multi-browse", viewportSize: 420, preferredSize: 186, gap: 8, sizes: [182, 182, 40] },
      { variant: "multi-browse", viewportSize: 420, preferredSize: 400, gap: 8, sizes: [372, 40] },
      { variant: "multi-browse", viewportSize: 800, preferredSize: 280, gap: 8, sizes: [280, 280, 168, 48] },
    ] as const;
    for (const { sizes, ...options } of cases) {
      const layout = createCarouselGeometry({ ...options, count: 10, baseSize: 280 })!;
      const visible = layout
        .itemsAt(0)
        .filter(
          (item) =>
            item.position + item.size / 2 > 0.001 && item.position - item.size / 2 < options.viewportSize - 0.001,
        );
      expect(visible).toHaveLength(sizes.length);
      visible.forEach((item, index) => expect(item.size).toBeCloseTo(sizes[index]));
      expectSeparatedByGap(visible, options.gap);
    }
  });

  test("moves the first multi-browse item outward until it leaves the viewport", () => {
    for (const baseSize of [186, 280]) {
      const layout = createCarouselGeometry({
        variant: "multi-browse",
        viewportSize: 420,
        gap: 8,
        count: 8,
        baseSize,
      })!;
      let previous = 0;
      let exited = false;
      for (let scroll = 10; scroll <= layout.maxScroll; scroll += 10) {
        const first = layout.itemsAt(scroll)[0];
        const leading = first.position - first.size / 2;
        expect(leading).toBeLessThan(previous - 0.01);
        previous = leading;
        if (first.position + first.size / 2 <= 0) {
          exited = true;
          break;
        }
      }
      expect(exited).toBe(true);
    }
  });

  test("a single default hero or centered hero fills the viewport", () => {
    for (const variant of ["hero", "hero-centered"] as const) {
      const geometry = createCarouselGeometry({
        variant,
        viewportSize: 420,
        gap: 8,
        count: 1,
        baseSize: 160,
      })!;

      expect(geometry.itemSize).toBe(420);
      expect(geometry.maxScroll).toBe(0);
      expect(geometry.itemsAt(0)).toEqual([{ position: 210, size: 420 }]);
    }
  });

  test("multi-browse omits the medium preview when two large items fit better", () => {
    const geometry = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 150,
      preferredSize: 186,
    })!;
    const items = geometry.itemsAt(0);

    expect(items).toHaveLength(8);
    expect(items[0].size).toBeCloseTo(geometry.itemSize);
    expect(items[1].size).toBeCloseTo(geometry.itemSize);
    expect(items[2].size).toBeLessThan(items[1].size);
    expect(items[2].size).toBe(40);
    expect(items[2].position + items[2].size / 2).toBeCloseTo(420);
    expect(items[3].position - items[3].size / 2).toBeGreaterThan(420);
    expectSeparatedByGap(items, 8);
  });

  test("fits a large item and a small preview when the preference nearly fills the viewport", () => {
    for (const viewportSize of [100, 420]) {
      const layout = createCarouselGeometry({
        variant: "multi-browse",
        viewportSize,
        gap: 8,
        count: 8,
        baseSize: 400,
      })!;
      const [large, small] = layout.itemsAt(0);
      expect(large.size).toBeGreaterThan(small.size);
      expect(small.size).toBeGreaterThan(1);
      expect(small.position + small.size / 2).toBeCloseTo(viewportSize);
    }
  });

  test("keeps short multi-browse lists visible at both ends", () => {
    for (const count of [2, 3]) {
      const layout = createCarouselGeometry({
        variant: "multi-browse",
        viewportSize: 420,
        gap: 8,
        count,
        baseSize: 280,
      })!;
      const first = layout.itemsAt(0);
      const last = layout.itemsAt(layout.maxScroll);
      expect(first[0].position - first[0].size / 2).toBeCloseTo(0);
      expect(last[count - 1].position + last[count - 1].size / 2).toBeCloseTo(420);
      expect(last[count - 1].size).toBeCloseTo(layout.itemSize);
      expectSeparatedByGap(first, 8);
      expectSeparatedByGap(last, 8);
    }
  });

  test("multi-browse fills the viewport with a large-medium-small progression", () => {
    const geometry = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 180,
      preferredSize: 280,
    })!;
    const [large, medium, small] = geometry.itemsAt(0);

    expect(large.size).toBeCloseTo(242.8);
    expect(medium.size).toBeCloseTo(121.2);
    expect(large.size).toBeGreaterThan(medium.size);
    expect(medium.size).toBeGreaterThan(small.size);
    expect(small.position + small.size / 2).toBeCloseTo(420);
    expectSeparatedByGap([large, medium, small], 8);
  });

  test("default start hero preview fits beside the large item", () => {
    const geometry = createCarouselGeometry({
      variant: "hero",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 160,
    })!;
    const [large, preview] = geometry.itemsAt(0);

    expect(large.size).toBe(geometry.itemSize);
    expect(preview.size).toBeLessThan(large.size);
    expect(preview.position - preview.size / 2).toBeCloseTo(large.position + large.size / 2 + 8);
    expect(preview.position + preview.size / 2).toBeCloseTo(420);
  });

  test("every multi-browse selection is fully visible at full focal size", () => {
    const geometry = createCarouselGeometry({
      variant: "multi-browse",
      viewportSize: 420,
      gap: 8,
      count: 8,
      baseSize: 160,
      preferredSize: 186,
    })!;

    for (let index = 0; index < 8; index++) {
      const scroll = geometry.scrollForIndex(index);
      const items = geometry.itemsAt(scroll);
      const selected = items[index];

      expect(items).toHaveLength(8);
      expect(selected.size).toBeCloseTo(geometry.itemSize);
      expect(selected.position - selected.size / 2).toBeGreaterThanOrEqual(0);
      expect(selected.position + selected.size / 2).toBeLessThanOrEqual(420);
      if (index === 0) expect(selected.position - selected.size / 2).toBeCloseTo(0);
      if (index === 7) expect(selected.position + selected.size / 2).toBeCloseTo(420);
      expect(scroll).toBeGreaterThanOrEqual(0);
      expect(scroll).toBeLessThanOrEqual(geometry.maxScroll);
      expectSeparatedByGap(items, 8);
    }

    const midpoint = (geometry.scrollForIndex(3) + geometry.scrollForIndex(4)) / 2;
    const before = geometry.itemsAt(midpoint);
    const after = geometry.itemsAt(midpoint + 0.01);
    expect(Math.max(...before.map((item, index) => Math.abs(item.position - after[index].position)))).toBeLessThan(0.1);
    expect(Math.max(...before.map((item, index) => Math.abs(item.size - after[index].size)))).toBeLessThan(0.1);
    expectSeparatedByGap(before, 8);
    expectSeparatedByGap(after, 8);
  });

  test("hero variants shrink nonfocal items and keep their gaps while scrolling smoothly", () => {
    for (const variant of ["hero", "hero-centered"] as const) {
      const geometry = createCarouselGeometry({
        variant,
        viewportSize: 420,
        gap: 8,
        count: 6,
        baseSize: 200,
        preferredSize: 220,
      })!;
      const selectedScroll = geometry.scrollForIndex(2);
      const selected = geometry.itemsAt(selectedScroll);
      const halfway = geometry.itemsAt((geometry.scrollForIndex(2) + geometry.scrollForIndex(3)) / 2);
      const nearHalfway = geometry.itemsAt((geometry.scrollForIndex(2) + geometry.scrollForIndex(3)) / 2 + 0.1);
      expect(selected[2].size).toBeCloseTo(geometry.itemSize);
      if (variant === "hero") {
        expect(selected[2].position).toBeCloseTo(geometry.itemSize / 2);
      } else {
        expect(selected[3].size).toBeCloseTo(geometry.itemSize);
        expect((selected[2].position + selected[3].position) / 2).toBeCloseTo(210);
      }
      expect(selected.some((item, index) => index !== 2 && item.size < geometry.itemSize)).toBe(true);
      expect(nearHalfway.some((item, index) => Math.abs(item.size - halfway[index].size) > 0)).toBe(true);
      expect(nearHalfway.some((item, index) => Math.abs(item.position - halfway[index].position) > 0)).toBe(true);
      expectSeparatedByGap(selected, 8);
      expectSeparatedByGap(halfway, 8);

      if (variant === "hero") {
        const finalItems = geometry.itemsAt(geometry.scrollForIndex(5));
        expect(finalItems[5].position + finalItems[5].size / 2).toBeCloseTo(420);
      }
    }
  });

  test("grows hero masks while preserving space for additional previews", () => {
    for (const variant of ["hero", "hero-centered"] as const) {
      for (const count of [2, 5]) {
        const layout = createCarouselGeometry({ variant, viewportSize: 420, gap: 8, count, baseSize: 280 })!;
        for (let index = 0; index < count - 1; index++) {
          const start = layout.scrollForIndex(index);
          const end = layout.scrollForIndex(index + 1);
          const from = layout.itemsAt(start);
          const to = layout.itemsAt(end);
          const halfway = layout.itemsAt((start + end) / 2);
          expect(halfway[index].size).toBeGreaterThan(from[index + 1].size);
          let previousSize = from[index + 1].size;
          for (const fraction of [0.01, 0.25, 0.5, 0.75, 0.99]) {
            const items = layout.itemsAt(start + (end - start) * fraction);
            expectSeparatedByGap(items, 8);
            expect(items.every((item) => item.size <= layout.itemSize + 0.001)).toBe(true);
            const incoming = items[index + 1];
            const revealed = 420 - (incoming.position - incoming.size / 2);
            expect(incoming.size).toBeLessThanOrEqual(Math.min(to[index + 1].size, revealed) + 0.001);
            expect(incoming.size).toBeGreaterThanOrEqual(previousSize);
            previousSize = incoming.size;
          }
          const nearEnd = layout.itemsAt(end - 0.001);
          nearEnd.forEach((item, i) => {
            expect(Math.abs(item.position - to[i].position)).toBeLessThan(0.01);
            expect(Math.abs(item.size - to[i].size)).toBeLessThan(0.01);
          });
        }
      }
    }
  });

  test("does not bring an outgoing leading hero preview back into view", () => {
    for (const variant of ["hero", "hero-centered"] as const) {
      for (const viewportSize of [420, 800]) {
        const layout = createCarouselGeometry({ variant, viewportSize, gap: 8, count: 5, baseSize: 280 })!;
        for (let index = 1; index < 4; index++) {
          const start = layout.scrollForIndex(index);
          const end = layout.scrollForIndex(index + 1);
          let leftViewport = false;
          let previousRight = Number.POSITIVE_INFINITY;
          for (let step = 0; step <= 300; step++) {
            const preview = layout.itemsAt(start + ((end - start) * step) / 300)[index - 1];
            const right = preview.position + preview.size / 2;
            expect(right).toBeLessThanOrEqual(previousRight + 0.001);
            previousRight = right;
            if (right <= 0) leftViewport = true;
            if (leftViewport) expect(right).toBeLessThanOrEqual(0.001);
          }
        }
      }
    }
  });

  test("start hero remains start-aligned until the end and shifts its preview to the leading edge", () => {
    for (const count of [2, 5]) {
      const layout = createCarouselGeometry({
        variant: "hero",
        viewportSize: 420,
        gap: 8,
        count,
        baseSize: 160,
      })!;
      for (let index = 0; index < count; index++) {
        const items = layout.itemsAt(layout.scrollForIndex(index));
        const selected = items[index];
        if (index < count - 1) {
          expect(selected.position - selected.size / 2).toBeCloseTo(0);
          if (index > 0) expect(items[index - 1].position + items[index - 1].size / 2).toBeLessThanOrEqual(0);
          expect(items[index + 1].position + items[index + 1].size / 2).toBeCloseTo(420);
        } else {
          expect(selected.position + selected.size / 2).toBeCloseTo(420);
          expect(items[index - 1].position - items[index - 1].size / 2).toBeCloseTo(0);
        }
        expectSeparatedByGap(items, 8);
      }
    }
  });

  test("centered hero retains both previews at the ends and start-aligns two-item lists", () => {
    for (const count of [2, 5]) {
      const layout = createCarouselGeometry({
        variant: "hero-centered",
        viewportSize: 420,
        gap: 8,
        count,
        baseSize: 160,
      })!;
      for (const index of count === 2 ? [0, 1] : [0, 2, 4]) {
        const items = layout.itemsAt(layout.scrollForIndex(index));
        const visible = items.filter(
          (item) => item.position + item.size / 2 > 0 && item.position - item.size / 2 < 420,
        );
        const previewCount = count === 2 ? 1 : 2;
        expect(visible).toHaveLength(previewCount + 1);
        expect(visible[0].position - visible[0].size / 2).toBeCloseTo(0);
        expect(visible[visible.length - 1].position + visible[visible.length - 1].size / 2).toBeCloseTo(420);
        expect(visible.filter((item) => item.size < items[index].size)).toHaveLength(previewCount);
        expectSeparatedByGap(items, 8);
      }
      if (count > 2) {
        for (const index of [1, count - 2]) {
          const snap = layout.scrollForIndex(index);
          const before = layout.itemsAt(snap - 0.01);
          const after = layout.itemsAt(snap + 0.01);
          expect(Math.max(...before.map((item, i) => Math.abs(item.position - after[i].position)))).toBeLessThan(0.1);
          expect(Math.max(...before.map((item, i) => Math.abs(item.size - after[i].size)))).toBeLessThan(0.1);
        }
      }
    }
  });

  test("centered hero keeps its small previews the same size after scrolling", () => {
    for (const viewportSize of [334, 420, 800]) {
      const layout = createCarouselGeometry({
        variant: "hero-centered",
        viewportSize,
        gap: 8,
        count: 5,
        baseSize: 280,
      })!;
      const first = layout.itemsAt(0);
      const initialPreview = first[1].size;
      expect(initialPreview).toBeGreaterThanOrEqual(40);
      expect(initialPreview).toBeLessThanOrEqual(56);
      for (const index of [1, 2, 3]) {
        const items = layout.itemsAt(layout.scrollForIndex(index));
        expect(items[index - 1].size).toBeCloseTo(initialPreview);
        expect(items[index + 1].size).toBeCloseTo(initialPreview);
        expect(items[index].size).toBeGreaterThan(initialPreview);
        expect(items[index - 1].position - items[index - 1].size / 2).toBeCloseTo(0);
        expect(items[index + 1].position + items[index + 1].size / 2).toBeCloseTo(viewportSize);
        expectSeparatedByGap(items, 8);
      }
    }
  });

  test("uses configured small-item limits for multi-browse and hero previews", () => {
    for (const variant of ["multi-browse", "hero", "hero-centered"] as const) {
      const layout = createCarouselGeometry({
        variant,
        viewportSize: 420,
        gap: 8,
        count: 8,
        baseSize: 280,
        minSmallSize: 60,
        maxSmallSize: 72,
        maxLargeSize: 220,
      })!;
      const items = layout.itemsAt(0);
      const visible = items.filter((item) => item.position + item.size / 2 > 0 && item.position - item.size / 2 < 420);
      const smallest = Math.min(...visible.map((item) => item.size));
      expect(smallest).toBeGreaterThanOrEqual(60);
      expect(smallest).toBeLessThanOrEqual(72);
      expect(layout.itemSize).toBeLessThanOrEqual(220);
      expectSeparatedByGap(items, 8);
    }
  });

  test("fits the default small-item range in multi-browse layouts", () => {
    for (const preferredSize of [186, 280, 400]) {
      const layout = createCarouselGeometry({
        variant: "multi-browse",
        viewportSize: 420,
        gap: 8,
        count: 8,
        baseSize: 280,
        preferredSize,
      })!;
      const visible = layout.itemsAt(0).filter((item) => item.position - item.size / 2 < 420 - 0.001);
      const small = visible[visible.length - 1];
      expect(small.size).toBeGreaterThanOrEqual(40);
      expect(small.size).toBeLessThanOrEqual(56);
      expect(small.position + small.size / 2).toBeCloseTo(420);
    }
  });

  for (const variant of ["multi-browse", "hero", "hero-centered"] as const) {
    for (const count of [8, 64]) {
      test(`${variant} large items follow inward drags equally at both ends with ${count} items`, () => {
        const layout = createCarouselGeometry({
          variant,
          viewportSize: 1200,
          gap: 8,
          count,
          baseSize: 280,
          preferredSize: 280,
        })!;
        const start = layout.itemsAt(0);
        const end = layout.itemsAt(layout.maxScroll);
        expect(start.slice(0, 4).every((item) => item.size === layout.itemSize)).toBe(true);
        expect(end.slice(count - 4).every((item) => item.size === layout.itemSize)).toBe(true);
        for (const distance of [5, 30, 50]) {
          const fromStart = layout.itemsAt(distance);
          const fromEnd = layout.itemsAt(layout.maxScroll - distance);
          expect(start[3].position - fromStart[3].position).toBeCloseTo(distance);
          expect(fromEnd[count - 4].position - end[count - 4].position).toBeCloseTo(distance);
        }
        for (const index of [0, 1, 2, Math.floor(count / 2), count - 2, count - 1]) {
          const offset = layout.scrollForIndex(index);
          const before = layout.itemsAt(Math.max(0, offset - 0.001));
          const after = layout.itemsAt(Math.min(layout.maxScroll, offset + 0.001));
          after.forEach((item, itemIndex) => {
            expect(item.position).toBeLessThanOrEqual(before[itemIndex].position + 1e-8);
            expect(Math.abs(item.position - before[itemIndex].position)).toBeLessThan(0.01);
            expect(Math.abs(item.size - before[itemIndex].size)).toBeLessThan(0.01);
          });
          expectSeparatedByGap(after, 8);
        }
      });
    }
  }

  test("drops hero previews below Compose's fullscreen threshold", () => {
    for (const viewportSize of [40, 60, 100]) {
      const layout = createCarouselGeometry({
        variant: "hero-centered",
        viewportSize,
        gap: 8,
        count: 5,
        baseSize: 280,
      })!;
      const items = layout.itemsAt(layout.scrollForIndex(2));
      const visible = items.filter(
        (item) => item.position + item.size / 2 > 0.001 && item.position - item.size / 2 < viewportSize - 0.001,
      );
      expect(visible).toHaveLength(1);
      expect(visible[0].size).toBe(viewportSize);
      expect(visible[0].position).toBe(viewportSize / 2);
    }
  });

  test("preserves preferred widths when a short hero list already fits", () => {
    for (const variant of ["hero", "hero-centered"] as const) {
      const layout = createCarouselGeometry({
        variant,
        viewportSize: 800,
        gap: 8,
        count: 2,
        baseSize: 280,
        preferredSize: 180,
      })!;
      expect(layout.itemSize).toBe(180);
      expect(layout.maxScroll).toBe(0);
      expect(layout.itemsAt(0).every((item) => item.size === 180)).toBe(true);
    }
  });

  test("short centered hero arrangements never reverse direction while revealing the last item", () => {
    for (const [count, viewportSize] of [
      [3, 510],
      [4, 900],
      [5, 1200],
    ]) {
      const layout = createCarouselGeometry({
        variant: "hero-centered",
        viewportSize,
        gap: 8,
        count,
        baseSize: 280,
        preferredSize: 320,
      })!;
      let previous = layout.itemsAt(0);
      expect(previous[count - 1].size).toBeLessThan(layout.itemSize);
      for (let step = 1; step <= 100; step++) {
        const items = layout.itemsAt((layout.maxScroll * step) / 100);
        items.forEach((item, index) => {
          expect(item.position).toBeLessThanOrEqual(previous[index].position + 1e-8);
          expect(item.position - item.size / 2).toBeLessThanOrEqual(
            previous[index].position - previous[index].size / 2 + 1e-8,
          );
        });
        expectSeparatedByGap(items, 8);
        previous = items;
      }
      expect(previous[count - 1].size).toBeCloseTo(layout.itemSize);
      expect(previous[count - 1].position + previous[count - 1].size / 2).toBeCloseTo(viewportSize);
    }
  });

  test("start-aligns a short centered arrangement and fully reveals its last item", () => {
    const layout = createCarouselGeometry({
      variant: "hero-centered",
      viewportSize: 420,
      gap: 8,
      count: 3,
      baseSize: 280,
      preferredSize: 180,
    })!;
    const first = layout.itemsAt(0);
    expect(first.map((item) => item.size)).toEqual([180, 180, 44]);
    expect(first[0].position - first[0].size / 2).toBe(0);
    const last = layout.itemsAt(layout.maxScroll)[2];
    expect(last.size).toBe(180);
    expect(last.position + last.size / 2).toBe(420);

    const fitting = createCarouselGeometry({
      variant: "hero-centered",
      viewportSize: 420,
      gap: 8,
      count: 5,
      baseSize: 280,
      preferredSize: 80,
    })!;
    expect(fitting.maxScroll).toBe(0);
    expect(fitting.itemsAt(0).map((item) => item.size)).toEqual([75, 75, 75, 75, 75]);
  });

  test("hero layouts reserve their small preview counts across viewport and preferred sizes", () => {
    for (const variant of ["hero", "hero-centered"] as const) {
      for (const { viewportSize, preferredSize } of [
        { viewportSize: 420, preferredSize: undefined },
        { viewportSize: 800, preferredSize: undefined },
        { viewportSize: 420, preferredSize: 220 },
        { viewportSize: 800, preferredSize: 180 },
      ]) {
        const layout = createCarouselGeometry({
          variant,
          viewportSize,
          gap: 8,
          count: 8,
          baseSize: 160,
          preferredSize,
        })!;
        const items = layout.itemsAt(0);
        const visible = items.filter(
          (item) => item.position + item.size / 2 > 0 && item.position - item.size / 2 < viewportSize,
        );
        const previews = visible.filter((item) => item.size < layout.itemSize - 0.01);
        expect(previews).toHaveLength(variant === "hero-centered" ? 2 : 1);
        for (const preview of previews) {
          expect(preview.size).toBeGreaterThanOrEqual(40);
          expect(preview.size).toBeLessThanOrEqual(56);
        }
        const last = previews[previews.length - 1];
        expect(last.position + last.size / 2).toBeCloseTo(viewportSize);
        expectSeparatedByGap(items, 8);
      }
    }
  });

  test("centered hero aligns its first, intermediate, and last selections", () => {
    const geometry = createCarouselGeometry({
      variant: "hero-centered",
      viewportSize: 140,
      gap: 8,
      count: 3,
      baseSize: 80,
    })!;
    const first = geometry.itemsAt(geometry.scrollForIndex(0))[0];
    const intermediate = geometry.itemsAt(geometry.scrollForIndex(1))[1];
    const last = geometry.itemsAt(geometry.scrollForIndex(2))[2];

    expect(first.position - first.size / 2).toBe(0);
    expect(first.position + first.size / 2).toBeLessThanOrEqual(140);
    expect(intermediate.position).toBeCloseTo(70);
    expect(last.position + last.size / 2).toBeCloseTo(140);
    expect(geometry.scrollForIndex(2)).toBe(geometry.maxScroll);
  });

  test("centered hero can show multiple large items with a preferred width", () => {
    const geometry = createCarouselGeometry({
      variant: "hero-centered",
      viewportSize: 800,
      gap: 8,
      count: 8,
      baseSize: 240,
      preferredSize: 180,
    })!;
    const items = geometry.itemsAt(0);
    const fullyVisible = items.filter(
      (item) => item.position - item.size / 2 >= 0 && item.position + item.size / 2 <= 800,
    );

    expect(fullyVisible.filter((item) => item.size === geometry.itemSize).length).toBeGreaterThan(1);
    expectSeparatedByGap(items, 8);
  });

  test("start hero can show multiple large items with a preferred width", () => {
    const geometry = createCarouselGeometry({
      variant: "hero",
      viewportSize: 800,
      gap: 8,
      count: 8,
      baseSize: 240,
      preferredSize: 180,
    })!;
    const visible = geometry
      .itemsAt(0)
      .filter((item) => item.position - item.size / 2 >= 0 && item.position + item.size / 2 <= 800);

    expect(visible.filter((item) => item.size === geometry.itemSize).length).toBeGreaterThan(1);
    expectSeparatedByGap(geometry.itemsAt(0), 8);
  });

  test("start hero keeps the viewport filled near the end with multiple large items", () => {
    const layout = createCarouselGeometry({
      variant: "hero",
      viewportSize: 800,
      gap: 8,
      count: 8,
      baseSize: 240,
      preferredSize: 180,
    })!;
    for (let index = 0; index < 8; index++) {
      const items = layout.itemsAt(layout.scrollForIndex(index));
      const selected = items[index];
      expect(selected.size).toBeCloseTo(layout.itemSize);
      expect(selected.position - selected.size / 2).toBeGreaterThanOrEqual(-0.001);
      expect(selected.position + selected.size / 2).toBeLessThanOrEqual(800.001);
      expect(items.some((item) => Math.abs(item.position - item.size / 2) < 0.001)).toBe(true);
      expect(items.some((item) => Math.abs(item.position + item.size / 2 - 800) < 0.001)).toBe(true);
      expectSeparatedByGap(items, 8);
    }
  });

  test("uncontained and fullscreen preserve fixed tracks and clamp both edges", () => {
    const uncontained = createCarouselGeometry({
      variant: "uncontained",
      viewportSize: 100,
      gap: 7.5,
      count: 5,
      baseSize: 140,
    })!;
    expect(uncontained.itemSize).toBe(100);
    expect(uncontained.maxScroll).toBe(430);
    expect(uncontained.itemsAt(0)).toHaveLength(5);
    expect(uncontained.itemsAt(-10)[0].position).toBe(50);
    expect(uncontained.itemsAt(uncontained.maxScroll)[4].position + 50).toBe(100);

    const uncontainedWithPreferredSize = createCarouselGeometry({
      variant: "uncontained",
      viewportSize: 100,
      gap: 8,
      count: 4,
      baseSize: 60,
      preferredSize: 25,
    })!;
    expect(uncontainedWithPreferredSize.itemSize).toBe(60);
    expect(uncontainedWithPreferredSize.maxScroll).toBe(164);

    const fullscreen = createCarouselGeometry({
      variant: "fullscreen",
      viewportSize: 500,
      gap: 20,
      count: 4,
      baseSize: 120,
    })!;
    expect(fullscreen.itemSize).toBe(500);
    expect(fullscreen.maxScroll).toBe(1560);
    expect(fullscreen.scrollForIndex(2)).toBe(1040);
    expect(fullscreen.itemsAt(fullscreen.maxScroll)[3].position).toBe(250);
    expect(fullscreen.itemsAt(fullscreen.maxScroll + 1)).toHaveLength(4);
  });

  test("reduced motion keeps item sizes and movement uniform while snapping to fixed tracks", () => {
    for (const variant of ["multi-browse", "hero", "hero-centered"] as const) {
      const geometry = createCarouselGeometry({
        variant,
        viewportSize: 420,
        gap: 8,
        count: 8,
        baseSize: 280,
        reducedMotion: true,
      })!;
      const start = geometry.itemsAt(0);
      const middle = geometry.itemsAt(100);
      start.forEach((item, index) => {
        expect(item.size).toBe(geometry.itemSize);
        expect(middle[index].size).toBe(item.size);
        expect(middle[index].position).toBeCloseTo(item.position - 100);
      });
      const selected = geometry.itemsAt(geometry.scrollForIndex(2))[2];
      if (variant === "hero-centered") expect(selected.position).toBeCloseTo(210);
      else expect(selected.position - selected.size / 2).toBeCloseTo(0);
      const last = geometry.itemsAt(geometry.scrollForIndex(7))[7];
      expect(last.position + last.size / 2).toBeCloseTo(420);
    }
  });

  test("returns undefined for empty content or a zero viewport", () => {
    const options = {
      variant: "multi-browse" as const,
      viewportSize: 400,
      gap: 12,
      count: 0,
      baseSize: 160,
    };

    expect(createCarouselGeometry(options)).toBeUndefined();
    expect(createCarouselGeometry({ ...options, count: 3, viewportSize: 0 })).toBeUndefined();
  });
});
