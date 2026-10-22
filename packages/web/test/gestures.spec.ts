import { expect, test } from "./fixtures";

let pointerTimestamp = 0;

async function dispatchPointer(
  page: import("@playwright/test").Page,
  type: "pointerdown" | "pointermove" | "pointerup" | "pointercancel",
  pointerId: number,
  clientX: number,
  clientY: number,
  timestamp = (pointerTimestamp += 10),
): Promise<void> {
  await page.locator("#target").evaluate(
    (element, input) => {
      const event = new PointerEvent(input.type, {
        bubbles: true,
        cancelable: true,
        pointerId: input.pointerId,
        pointerType: "touch",
        isPrimary: input.pointerId === 1,
        button: 0,
        buttons: input.type === "pointerup" || input.type === "pointercancel" ? 0 : 1,
        clientX: input.clientX,
        clientY: input.clientY,
      });
      Object.defineProperty(event, "timeStamp", { value: input.timestamp });
      element.dispatchEvent(event);
    },
    { type, pointerId, clientX, clientY, timestamp },
  );
}

async function disablePointerCapture(page: import("@playwright/test").Page): Promise<void> {
  await page.evaluate(() => {
    HTMLElement.prototype.setPointerCapture = () => {};
    HTMLElement.prototype.releasePointerCapture = () => {};
    HTMLElement.prototype.hasPointerCapture = () => false;
  });
}

async function captureResolverEvents(page: import("@playwright/test").Page, ids: readonly string[]): Promise<void> {
  await page.evaluate((elementIds) => {
    (window as typeof window & { resolverEvents: Array<{ name: string; phase: string }> }).resolverEvents = [];
    for (const id of elementIds) {
      document.querySelector(`#${id}`)!.addEventListener("gesture", (event) => {
        (window as typeof window & { resolverEvents: Array<{ name: string; phase: string }> }).resolverEvents.push({
          name: id,
          phase: (event as CustomEvent).detail.phase,
        });
      });
    }
  }, ids);
}

test.describe("gesture elements", () => {
  test.beforeEach(async ({ page }) => {
    await disablePointerCapture(page);
  });

  test("emits tap start and end details and cancels after excessive movement", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-tap-gesture for="target"></m3e-tap-gesture>
    `);
    await page.locator("m3e-tap-gesture").evaluate((gesture) => {
      (window as typeof window & { gestureDetails: Array<{ phase: string; clientX: number; duration: number }> })
        .gestureDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { gestureDetails: Array<{ phase: string; clientX: number; duration: number }> })
          .gestureDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointerup", 1, 40, 50);

    const tapDetails = await page.evaluate(
      () => (window as typeof window & { gestureDetails: Array<{ phase: string; clientX: number; duration: number }> })
        .gestureDetails,
    );
    expect(tapDetails.map(({ phase }) => phase)).toEqual(["start", "end"]);
    expect(tapDetails[1].clientX).toBe(40);
    expect(tapDetails[1].duration).toBeGreaterThan(0);

    await page.evaluate(() => {
      (window as typeof window & { gestureDetails: Array<{ phase: string }> }).gestureDetails = [];
    });
    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 80, 50);
    await dispatchPointer(page, "pointerup", 1, 80, 50);

    expect(
      await page.evaluate(
        () => (window as typeof window & { gestureDetails: Array<{ phase: string }> }).gestureDetails.map(({ phase }) => phase),
      ),
    ).toEqual(["start", "cancel"]);
  });

  test("recognizes a long press only after its minimum duration", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-long-press-gesture for="target" min-duration="100"></m3e-long-press-gesture>
    `);
    await page.locator("m3e-long-press-gesture").evaluate((gesture) => {
      (window as typeof window & { longPressDetails: Array<{ phase: string; duration: number }> }).longPressDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { longPressDetails: Array<{ phase: string; duration: number }> })
          .longPressDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50, 1000);
    await page.waitForTimeout(20);
    expect(
      await page.evaluate(
        () => (window as typeof window & { longPressDetails: Array<{ phase: string }> }).longPressDetails.map(({ phase }) => phase),
      ),
    ).toEqual(["start"]);

    await page.waitForTimeout(100);
    await dispatchPointer(page, "pointerup", 1, 40, 50, 1120);

    const details = await page.evaluate(
      () => (window as typeof window & { longPressDetails: Array<{ phase: string; duration: number }> }).longPressDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "end"]);
    expect(details[1].duration).toBeGreaterThanOrEqual(100);
  });

  test("cancels a long press released before its minimum duration", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-long-press-gesture for="target" min-duration="300"></m3e-long-press-gesture>
    `);
    await page.locator("m3e-long-press-gesture").evaluate((gesture) => {
      (window as typeof window & { longPressDetails: Array<{ phase: string; duration: number }> }).longPressDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { longPressDetails: Array<{ phase: string; duration: number }> })
          .longPressDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50, 2000);
    await dispatchPointer(page, "pointerup", 1, 40, 50, 2030);

    const details = await page.evaluate(
      () => (window as typeof window & { longPressDetails: Array<{ phase: string; duration: number }> }).longPressDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "cancel"]);
    expect(details[1].duration).toBe(30);
  });

  test("reports pan start, updates, and end with the total translation", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-pan-gesture for="target" min-displacement="2"></m3e-pan-gesture>
    `);
    await page.locator("m3e-pan-gesture").evaluate((gesture) => {
      (window as typeof window & { panDetails: Array<{ phase: string; totalDeltaX: number }> }).panDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { panDetails: Array<{ phase: string; totalDeltaX: number }> })
          .panDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 55, 50);
    await dispatchPointer(page, "pointermove", 1, 65, 50);
    await dispatchPointer(page, "pointerup", 1, 65, 50);

    const details = await page.evaluate(
      () => (window as typeof window & { panDetails: Array<{ phase: string; totalDeltaX: number }> }).panDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "update", "end"]);
    expect(details[2].totalDeltaX).toBe(25);
  });

  test("cancels an active pan when its pointer is cancelled", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-pan-gesture for="target" min-displacement="2"></m3e-pan-gesture>
    `);
    await page.locator("m3e-pan-gesture").evaluate((gesture) => {
      (window as typeof window & { panDetails: Array<{ phase: string }> }).panDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { panDetails: Array<{ phase: string }> }).panDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 55, 50);
    await dispatchPointer(page, "pointercancel", 1, 55, 50);

    expect(
      await page.evaluate(
        () => (window as typeof window & { panDetails: Array<{ phase: string }> }).panDetails.map(({ phase }) => phase),
      ),
    ).toEqual(["start", "cancel"]);
  });

  test("recognizes a rightward swipe and reports its direction", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-swipe-gesture for="target" min-displacement="10" direction-threshold="5"></m3e-swipe-gesture>
    `);
    await page.locator("m3e-swipe-gesture").evaluate((gesture) => {
      (window as typeof window & { swipeDetails: Array<{ phase: string; direction: string }> }).swipeDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { swipeDetails: Array<{ phase: string; direction: string }> })
          .swipeDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 90, 50);
    await dispatchPointer(page, "pointermove", 1, 100, 50);
    await dispatchPointer(page, "pointerup", 1, 90, 50);

    const details = await page.evaluate(
      () => (window as typeof window & { swipeDetails: Array<{ phase: string; direction: string }> }).swipeDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "update", "end"]);
    expect(details[2].direction).toBe("right");
  });

  test("cancels a swipe when its pointer is cancelled before completion", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-swipe-gesture for="target" min-displacement="10"></m3e-swipe-gesture>
    `);
    await page.locator("m3e-swipe-gesture").evaluate((gesture) => {
      (window as typeof window & { swipeDetails: Array<{ phase: string }> }).swipeDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { swipeDetails: Array<{ phase: string }> }).swipeDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 60, 50);
    await dispatchPointer(page, "pointercancel", 1, 60, 50);

    expect(
      await page.evaluate(
        () => (window as typeof window & { swipeDetails: Array<{ phase: string }> }).swipeDetails.map(({ phase }) => phase),
      ),
    ).toEqual(["start", "cancel"]);
  });

  test("reports scale changes from two pointers", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-scale-gesture for="target" min-displacement="1"></m3e-scale-gesture>
    `);
    await page.locator("m3e-scale-gesture").evaluate((gesture) => {
      (window as typeof window & { scaleDetails: Array<{ phase: string; scale: number }> }).scaleDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { scaleDetails: Array<{ phase: string; scale: number }> })
          .scaleDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointerdown", 2, 60, 50);
    await dispatchPointer(page, "pointermove", 2, 70, 55);
    await dispatchPointer(page, "pointermove", 2, 80, 60);

    const details = await page.evaluate(
      () => (window as typeof window & { scaleDetails: Array<{ phase: string; scale: number }> }).scaleDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "update"]);
    expect(details[1].scale).toBeGreaterThan(1.2);
  });

  test("cancels a scale gesture when a pointer is cancelled", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-scale-gesture for="target" min-displacement="1"></m3e-scale-gesture>
    `);
    await page.locator("m3e-scale-gesture").evaluate((gesture) => {
      (window as typeof window & { scaleDetails: Array<{ phase: string }> }).scaleDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { scaleDetails: Array<{ phase: string }> }).scaleDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointerdown", 2, 60, 50);
    await dispatchPointer(page, "pointermove", 2, 70, 55);
    await dispatchPointer(page, "pointermove", 2, 80, 60);
    await dispatchPointer(page, "pointercancel", 2, 80, 60);

    expect(
      await page.evaluate(
        () => (window as typeof window & { scaleDetails: Array<{ phase: string }> }).scaleDetails.map(({ phase }) => phase),
      ),
    ).toEqual(["start", "update", "cancel"]);
  });

  test("reports rotation from two pointers", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-rotate-gesture for="target" min-displacement="1"></m3e-rotate-gesture>
    `);
    await page.locator("m3e-rotate-gesture").evaluate((gesture) => {
      (window as typeof window & { rotateDetails: Array<{ phase: string; rotation: number }> }).rotateDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { rotateDetails: Array<{ phase: string; rotation: number }> })
          .rotateDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointerdown", 2, 60, 50);
    await dispatchPointer(page, "pointermove", 1, 50, 35);
    await dispatchPointer(page, "pointermove", 2, 50, 45);

    const details = await page.evaluate(
      () => (window as typeof window & { rotateDetails: Array<{ phase: string; rotation: number }> }).rotateDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "update"]);
    expect(Number.isFinite(details[1].rotation)).toBe(true);
    expect(Math.abs(details[1].rotation)).toBeGreaterThan(0);
  });

  test("cancels a rotation gesture when a pointer is cancelled", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-rotate-gesture for="target" min-displacement="1"></m3e-rotate-gesture>
    `);
    await page.locator("m3e-rotate-gesture").evaluate((gesture) => {
      (window as typeof window & { rotateDetails: Array<{ phase: string }> }).rotateDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { rotateDetails: Array<{ phase: string }> }).rotateDetails.push((event as CustomEvent).detail);
      });
    });

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointerdown", 2, 60, 50);
    await dispatchPointer(page, "pointermove", 1, 50, 35);
    await dispatchPointer(page, "pointermove", 2, 50, 45);
    await dispatchPointer(page, "pointercancel", 1, 50, 35);

    expect(
      await page.evaluate(
        () => (window as typeof window & { rotateDetails: Array<{ phase: string }> }).rotateDetails.map(({ phase }) => phase),
      ),
    ).toEqual(["start", "update", "cancel"]);
  });

  test("recognizes repeated taps as one repeat gesture", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-repeat-gesture for="target" count="2">
        <m3e-tap-gesture></m3e-tap-gesture>
      </m3e-repeat-gesture>
    `);
    await page.locator("m3e-repeat-gesture").evaluate((gesture) => {
      (window as typeof window & { repeatDetails: Array<{ phase: string; details: unknown[] }> }).repeatDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { repeatDetails: Array<{ phase: string; details: unknown[] }> })
          .repeatDetails.push((event as CustomEvent).detail);
      });
    });

    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    for (let i = 0; i < 2; i++) {
      await dispatchPointer(page, "pointerdown", 1, 40, 50);
      await dispatchPointer(page, "pointerup", 1, 40, 50);
    }

    const details = await page.evaluate(
      () => (window as typeof window & { repeatDetails: Array<{ phase: string; details: unknown[] }> }).repeatDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "end"]);
    expect(details[1].details).toHaveLength(2);
  });

  test("cancels a repeat when a subsequent tap is interrupted", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-repeat-gesture for="target" count="2">
        <m3e-tap-gesture></m3e-tap-gesture>
      </m3e-repeat-gesture>
    `);
    await page.locator("m3e-repeat-gesture").evaluate((gesture) => {
      (window as typeof window & { repeatDetails: Array<{ phase: string; details: unknown[] }> }).repeatDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { repeatDetails: Array<{ phase: string; details: unknown[] }> })
          .repeatDetails.push((event as CustomEvent).detail);
      });
    });

    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointerup", 1, 40, 50);
    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 80, 50);

    const details = await page.evaluate(
      () => (window as typeof window & { repeatDetails: Array<{ phase: string; details: unknown[] }> }).repeatDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "cancel"]);
    expect(details[1].details).toHaveLength(1);
  });

  test("recognizes an ordered sequence of taps", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-sequence-gesture for="target">
        <m3e-tap-gesture></m3e-tap-gesture>
        <m3e-tap-gesture></m3e-tap-gesture>
      </m3e-sequence-gesture>
    `);
    await page.locator("m3e-sequence-gesture").evaluate((gesture) => {
      (window as typeof window & { sequenceDetails: Array<{ phase: string; details: unknown[] }> }).sequenceDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { sequenceDetails: Array<{ phase: string; details: unknown[] }> })
          .sequenceDetails.push((event as CustomEvent).detail);
      });
    });

    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    for (let i = 0; i < 2; i++) {
      await dispatchPointer(page, "pointerdown", 1, 40, 50);
      await dispatchPointer(page, "pointerup", 1, 40, 50);
    }

    const details = await page.evaluate(
      () => (window as typeof window & { sequenceDetails: Array<{ phase: string; details: unknown[] }> }).sequenceDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "end"]);
    expect(details[1].details).toHaveLength(2);
  });

  test("cancels a sequence when a subsequent tap is interrupted", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-sequence-gesture for="target">
        <m3e-tap-gesture></m3e-tap-gesture>
        <m3e-tap-gesture></m3e-tap-gesture>
      </m3e-sequence-gesture>
    `);
    await page.locator("m3e-sequence-gesture").evaluate((gesture) => {
      (window as typeof window & { sequenceDetails: Array<{ phase: string; details: unknown[] }> }).sequenceDetails = [];
      gesture.addEventListener("gesture", (event) => {
        (window as typeof window & { sequenceDetails: Array<{ phase: string; details: unknown[] }> })
          .sequenceDetails.push((event as CustomEvent).detail);
      });
    });

    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointerup", 1, 40, 50);
    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 80, 50);

    const details = await page.evaluate(
      () => (window as typeof window & { sequenceDetails: Array<{ phase: string; details: unknown[] }> }).sequenceDetails,
    );
    expect(details.map(({ phase }) => phase)).toEqual(["start", "cancel"]);
    expect(details[1].details).toHaveLength(1);
  });
});

test.describe("gesture resolver", () => {
  test.beforeEach(async ({ page }) => {
    await disablePointerCapture(page);
  });

  test("accepts the highest-priority recognizer regardless of registration order", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-pan-gesture id="low" for="target" min-displacement="1" priority="1"></m3e-pan-gesture>
      <m3e-pan-gesture id="high" for="target" min-displacement="1" priority="10"></m3e-pan-gesture>
    `);
    await captureResolverEvents(page, ["low", "high"]);

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await dispatchPointer(page, "pointermove", 1, 60, 50);
    await dispatchPointer(page, "pointerup", 1, 60, 50);

    const events = await page.evaluate(
      () => (window as typeof window & { resolverEvents: Array<{ name: string; phase: string }> }).resolverEvents,
    );
    expect(events.filter(({ phase }) => phase === "start")).toHaveLength(2);
    expect(events.filter(({ phase }) => phase === "end")).toEqual([{ name: "high", phase: "end" }]);
    expect(events.filter(({ phase }) => phase === "cancel")).toEqual([{ name: "low", phase: "cancel" }]);
  });

  test("prefers an eager recognizer over a higher-priority deferred recognizer", async ({ page, render }) => {
    await render(`
      <div id="target" style="width: 200px; height: 100px"></div>
      <m3e-pan-gesture id="pan" for="target" min-displacement="0" priority="10"></m3e-pan-gesture>
      <m3e-long-press-gesture id="long-press" for="target" min-duration="50" priority="1"></m3e-long-press-gesture>
    `);
    await captureResolverEvents(page, ["pan", "long-press"]);

    await dispatchPointer(page, "pointerdown", 1, 40, 50);
    await page.waitForTimeout(80);
    await dispatchPointer(page, "pointerup", 1, 40, 50);

    const events = await page.evaluate(
      () => (window as typeof window & { resolverEvents: Array<{ name: string; phase: string }> }).resolverEvents,
    );
    expect(events.filter(({ phase }) => phase === "end")).toEqual([{ name: "long-press", phase: "end" }]);
    expect(events.filter(({ phase }) => phase === "cancel")).toEqual([{ name: "pan", phase: "cancel" }]);
  });
});
