import { expect } from "../fixtures";

export const carousel = (variant = "multi-browse", count = 8, extra = "", withGutters = false, sizing = "") => `
  <m3e-carousel variant="${variant}" style="width: 420px; ${sizing.includes("--m3e-carousel-height:") ? "" : "height: 200px;"} --m3e-carousel-item-gap: 8px; ${withGutters ? "" : "--m3e-carousel-inline-gutter:0px;--m3e-carousel-block-gutter:0px;"} ${sizing}" ${extra}>
    ${Array.from({ length: count }, (_, i) => `<m3e-carousel-item>Item ${i + 1}</m3e-carousel-item>`).join("")}
  </m3e-carousel>
`;

export const traceLayouts = async (
  page: import("@playwright/test").Page,
  action: () => Promise<void>,
  requireLayout = true,
) => {
  const cdp = await page.context().newCDPSession(page);
  let maxStyledElements = 0;
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
    const trace: {
      traceEvents: Array<{ name: string; args?: { beginData?: { stackTrace?: unknown[] }; elementCount?: number } }>;
    } = JSON.parse(data);
    const layouts = trace.traceEvents.filter((event) => event.name === "Layout");
    if (requireLayout) expect(layouts.length).toBeGreaterThan(0);
    expect(layouts.filter((event) => event.args?.beginData?.stackTrace?.length)).toHaveLength(0);
    for (const event of trace.traceEvents) {
      if (event.name === "UpdateLayoutTree") {
        maxStyledElements = Math.max(maxStyledElements, event.args?.elementCount ?? 0);
      }
    }
  }
  return maxStyledElements;
};

export const geometry = async (page: import("@playwright/test").Page) => {
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

export const fling = (
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

export const swipePhase = (
  page: import("@playwright/test").Page,
  phase: "start" | "update" | "end" | "cancel",
  translation: number,
  axis: "x" | "y" = "x",
  velocity = 0,
) =>
  page.locator("m3e-carousel").evaluate(
    async (element, { phase, translation, axis, velocity }) => {
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
      if (phase === "update") {
        await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      }
    },
    { phase, translation, axis, velocity },
  );
