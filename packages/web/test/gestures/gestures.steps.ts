import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { GesturesHarness } from "./gestures.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ gestures: GesturesHarness }>({
  gestures: async ({ page, render }, use) => use(new GesturesHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a tap gesture with a {int}px maximum displacement", ({ gestures }, displacement: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("tap", `max-displacement="${displacement}"`)}`;
});
When("the gesture fixture renders", async ({ gestures }) => gestures.render());
When("the user taps the target at {int}, {int}", async ({ gestures }, x: number, y: number) => {
  await gestures.dispatch("pointerdown", 1, x, y);
  await gestures.dispatch("pointerup", 1, x, y);
});
Then("the tap emits start and end phases", async ({ gestures }) =>
  expect(await gestures.phases("tap")).toEqual(["start", "end"]),
);
Then("the tap end detail reports the release coordinates and duration", async ({ gestures }) => {
  const [detail] = (await gestures.details("tap")).slice(-1);
  expect(detail.clientX).toBe(40);
  expect(detail.duration).toBeGreaterThan(0);
});
When("the user presses and moves {int}px before releasing", async ({ gestures }, distance: number) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointermove", 1, 40 + distance, 50);
  await gestures.dispatch("pointerup", 1, 40 + distance, 50);
});
Then("the tap emits start and cancel phases", async ({ gestures }) =>
  expect((await gestures.phases("tap")).slice(-2)).toEqual(["start", "cancel"]),
);

Given("a long press gesture requiring {int}ms", ({ gestures }, duration: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("long-press", `min-duration="${duration}"`)}`;
});
When("the user presses the target for {int}ms", async ({ gestures }, duration: number) => {
  await gestures.dispatch("pointerdown", 1, 40, 50, { timestamp: 1000 });
  await gestures.page.waitForTimeout(duration);
  await gestures.dispatch("pointerup", 1, 40, 50, { timestamp: 1000 + duration });
});
Then("the long press emits start and end phases", async ({ gestures }) =>
  expect(await gestures.phases("long-press")).toEqual(["start", "end"]),
);
Then("the long press duration is at least {int}ms", async ({ gestures }, duration: number) =>
  expect((await gestures.details("long-press"))[1].duration).toBeGreaterThanOrEqual(duration),
);
Then("the long press emits start and cancel phases", async ({ gestures }) =>
  expect(await gestures.phases("long-press")).toEqual(["start", "cancel"]),
);
Then("the long press duration is {int}ms", async ({ gestures }, duration: number) =>
  expect((await gestures.details("long-press"))[1].duration).toBe(duration),
);

Given("a pan gesture with a {int}px minimum displacement", ({ gestures }, displacement: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("pan", `min-displacement="${displacement}"`)}`;
});
When("the user pans the target {int}px to the right", async ({ gestures }, distance: number) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointermove", 1, 55, 50);
  await gestures.dispatch("pointermove", 1, 40 + distance, 50);
  await gestures.dispatch("pointerup", 1, 40 + distance, 50);
});
Then("the pan emits start, update and end phases", async ({ gestures }) =>
  expect(await gestures.phases("pan")).toEqual(["start", "update", "end"]),
);
Then("the pan reports {int}px of total horizontal translation", async ({ gestures }, distance: number) =>
  expect((await gestures.details("pan")).at(-1)?.totalDeltaX).toBe(distance),
);
When("the user pans the target and cancels the pointer", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointermove", 1, 55, 50);
  await gestures.dispatch("pointercancel", 1, 55, 50);
});
Then("the pan emits start and cancel phases", async ({ gestures }) =>
  expect(await gestures.phases("pan")).toEqual(["start", "cancel"]),
);

Given(
  "a swipe gesture with a {int}px minimum displacement and {int}px direction threshold",
  ({ gestures }, displacement: number, threshold: number) => {
    gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("swipe", `min-displacement="${displacement}" direction-threshold="${threshold}"`)}`;
  },
);
When("the user swipes the target to the right", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointermove", 1, 90, 50);
  await gestures.dispatch("pointermove", 1, 100, 50);
  await gestures.dispatch("pointerup", 1, 90, 50);
});
Then("the swipe emits start, update and end phases", async ({ gestures }) =>
  expect(await gestures.phases("swipe")).toEqual(["start", "update", "end"]),
);
Then("the swipe direction is {string}", async ({ gestures }, direction: string) =>
  expect((await gestures.details("swipe")).at(-1)?.direction).toBe(direction),
);

Given("a swipe gesture", ({ gestures }) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>${gestures.gestureMarkup("swipe")}`;
});
When("the user releases after a {int}ms pause following the last movement", async ({ gestures }, pause: number) => {
  await gestures.dispatch("pointerdown", 1, 40, 50, { timestamp: 1000 });
  await gestures.dispatch("pointermove", 1, 70, 50, { timestamp: 1040 });
  await gestures.dispatch("pointermove", 1, 85, 50, { timestamp: 1080 });
  await gestures.dispatch("pointerup", 1, 85, 50, { timestamp: 1080 + pause });
});
Then("the swipe ends with phase {string}", async ({ gestures }, phase: string) =>
  expect((await gestures.phases("swipe")).at(-1)).toBe(phase),
);
When("the user moves 15px and releases 30ms later", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50, { timestamp: 1000 });
  await gestures.dispatch("pointermove", 1, 55, 50, { timestamp: 1020 });
  await gestures.dispatch("pointerup", 1, 100, 50, { timestamp: 1030 });
});
Then(
  "the swipe reports {int}px total translation and {float}px per millisecond velocity",
  async ({ gestures }, distance: number, velocity: number) => {
    const detail = (await gestures.details("swipe")).at(-1);
    expect(detail?.translationX).toBe(distance);
    expect(detail?.velocityX).toBeCloseTo(velocity, 5);
  },
);
When("the user moves 60px, pauses 5ms, and releases 5ms later", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50, { timestamp: 1000 });
  await gestures.dispatch("pointermove", 1, 100, 50, { timestamp: 1020 });
  await gestures.dispatch("pointermove", 1, 100, 50, { timestamp: 1025 });
  await gestures.dispatch("pointerup", 1, 100, 50, { timestamp: 1030 });
});
When("the user moves 60px, pauses 250ms, and releases 5ms later", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50, { timestamp: 1000 });
  await gestures.dispatch("pointermove", 1, 100, 50, { timestamp: 1020 });
  await gestures.dispatch("pointermove", 1, 100, 50, { timestamp: 1270 });
  await gestures.dispatch("pointerup", 1, 100, 50, { timestamp: 1275 });
});
Then(
  "the swipe reports {int}px total translation and about {float}px per millisecond velocity",
  async ({ gestures }, distance: number, velocity: number) => {
    const detail = (await gestures.details("swipe")).at(-1);
    expect(detail?.translationX).toBe(distance);
    expect(detail?.velocityX).toBeCloseTo(velocity, 2);
  },
);
Given("a swipe gesture with a {int}px minimum displacement", ({ gestures }, displacement: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("swipe", `min-displacement="${displacement}"`)}`;
});
When("the user swipes the target and cancels the pointer", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointermove", 1, 60, 50);
  await gestures.dispatch("pointercancel", 1, 60, 50);
});
Then("the swipe emits start and cancel phases", async ({ gestures }) =>
  expect(await gestures.phases("swipe")).toEqual(["start", "cancel"]),
);

Given("a scale gesture with a {int}px minimum displacement", ({ gestures }, displacement: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("scale", `min-displacement="${displacement}"`)}`;
});
When("the user spreads two pointers apart", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointerdown", 2, 60, 50);
  await gestures.dispatch("pointermove", 2, 70, 55);
  await gestures.dispatch("pointermove", 2, 80, 60);
});
Then("the scale gesture emits start and update phases", async ({ gestures }) =>
  expect(await gestures.phases("scale")).toEqual(["start", "update"]),
);
Then("the scale factor is greater than {float}", async ({ gestures }, factor: number) =>
  expect((await gestures.details("scale")).at(-1)?.scale).toBeGreaterThan(factor),
);
When("the user spreads two pointers apart and cancels one", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointerdown", 2, 60, 50);
  await gestures.dispatch("pointermove", 2, 70, 55);
  await gestures.dispatch("pointermove", 2, 80, 60);
  await gestures.dispatch("pointercancel", 2, 80, 60);
});
Then("the scale gesture emits start, update and cancel phases", async ({ gestures }) =>
  expect(await gestures.phases("scale")).toEqual(["start", "update", "cancel"]),
);

Given("a rotate gesture with a {int}px minimum displacement", ({ gestures }, displacement: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("rotate", `min-displacement="${displacement}"`)}`;
});
When("the user rotates two pointers", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointerdown", 2, 60, 50);
  await gestures.dispatch("pointermove", 1, 50, 35);
  await gestures.dispatch("pointermove", 2, 50, 45);
});
Then("the rotate gesture emits start and update phases", async ({ gestures }) =>
  expect(await gestures.phases("rotate")).toEqual(["start", "update"]),
);
Then("the rotation is finite and non-zero", async ({ gestures }) => {
  const rotation = (await gestures.details("rotate")).at(-1)?.rotation;
  expect(typeof rotation).toBe("number");
  expect(Number.isFinite(rotation)).toBe(true);
  expect(Math.abs(rotation as number)).toBeGreaterThan(0);
});
When("the user rotates two pointers and cancels one", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointerdown", 2, 60, 50);
  await gestures.dispatch("pointermove", 1, 50, 35);
  await gestures.dispatch("pointermove", 2, 50, 45);
  await gestures.dispatch("pointercancel", 1, 50, 35);
});
Then("the rotate gesture emits start, update and cancel phases", async ({ gestures }) =>
  expect(await gestures.phases("rotate")).toEqual(["start", "update", "cancel"]),
);

Given("a repeat gesture requiring {int} taps", ({ gestures }, count: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("repeat", `count="${count}"`, "<m3e-tap-gesture></m3e-tap-gesture>")}`;
});
When("the user taps the target twice", async ({ gestures }) => {
  await gestures.page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  for (let index = 0; index < 2; index++) {
    await gestures.dispatch("pointerdown", 1, 40, 50);
    await gestures.dispatch("pointerup", 1, 40, 50);
  }
});
Then("the repeat emits start and end phases", async ({ gestures }) =>
  expect(await gestures.phases("repeat")).toEqual(["start", "end"]),
);
Then("the repeat contains {int} completed taps", async ({ gestures }, count: number) =>
  expect((await gestures.details("repeat")).at(-1)?.details).toHaveLength(count),
);
When("the user completes one tap and interrupts the next", async ({ gestures }) => {
  await gestures.page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointerup", 1, 40, 50);
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointermove", 1, 80, 50);
});
Then("the repeat emits start and cancel phases", async ({ gestures }) =>
  expect(await gestures.phases("repeat")).toEqual(["start", "cancel"]),
);

Given("a sequence gesture requiring {int} taps", ({ gestures }, count: number) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    ${gestures.gestureMarkup("sequence", "", Array.from({ length: count }, () => "<m3e-tap-gesture></m3e-tap-gesture>").join(""))}`;
});
Then("the sequence emits start and end phases", async ({ gestures }) =>
  expect(await gestures.phases("sequence")).toEqual(["start", "end"]),
);
Then("the sequence emits start and cancel phases", async ({ gestures }) =>
  expect(await gestures.phases("sequence")).toEqual(["start", "cancel"]),
);
Then("the sequence contains {int} completed child details", async ({ gestures }, count: number) =>
  expect((await gestures.details("sequence")).at(-1)?.details).toHaveLength(count),
);

Given("a disabled tap gesture", ({ gestures }) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>${gestures.gestureMarkup("tap", "disabled")}`;
});
Then("the tap emits no phases", async ({ gestures }) => expect(await gestures.phases("tap")).toEqual([]));
Given("a tap gesture accepting only pen input", ({ gestures }) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>${gestures.gestureMarkup("tap", 'pointer-types="pen"')}`;
});
When('the user taps the target using "{word}" input', async ({ gestures }, pointerType: string) => {
  await gestures.dispatch("pointerdown", 1, 40, 50, { pointerType });
  await gestures.dispatch("pointerup", 1, 40, 50, { pointerType });
});
Given("a tap gesture attached to an accessible button", ({ gestures }) => {
  gestures.html = `<button id="target" aria-label="Activate">Activate</button>${gestures.gestureMarkup("tap")}`;
});
Then("the target remains an accessible button named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeVisible(),
);
Then("the gesture element is not visible", async ({ gestures }) => expect(gestures.page.locator("#tap")).toBeHidden());
Given("a tap gesture", ({ gestures }) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>${gestures.gestureMarkup("tap")}`;
});
When("the application moves the gesture element to another parent", async ({ page }) =>
  page.locator("#tap").evaluate((element) => {
    const destination = document.querySelector("#destination");
    if (!destination) throw new Error("Missing gesture destination");
    destination.append(element);
  }),
);

Given("a tap gesture with a child button and native pointer capture", ({ gestures }) => {
  gestures.pointerCapture = "native";
  gestures.html = `<div id="target" style="width: 200px; height: 100px"><button id="child">Child</button></div>
    ${gestures.gestureMarkup("tap")}`;
});
When("the user clicks the child button", async ({ page }) => page.locator("#child").click());
Then("the child receives the click without pointer capture", async ({ gestures }) =>
  expect(await gestures.captureResult()).toEqual({ captures: 0, clicks: ["child"] }),
);
Given("a long press gesture with a {int}ms minimum and a child button", ({ gestures }, duration: number) => {
  gestures.pointerCapture = "native";
  gestures.html = `<div id="target" style="width: 200px; height: 100px"><button id="child">Child</button></div>
    ${gestures.gestureMarkup("long-press", `min-duration="${duration}"`)}`;
});
Given("a discrete long press gesture with a {int}ms minimum and a child button", ({ gestures }, duration: number) => {
  gestures.pointerCapture = "native";
  gestures.html = `<div id="target" style="width: 200px; height: 100px"><button id="child">Child</button></div>
    ${gestures.gestureMarkup("long-press", `min-duration="${duration}" discrete`)}`;
});
When("the user holds the child button for {int}ms", async ({ page }, duration: number) => {
  const box = await page.locator("#child").boundingBox();
  if (!box) throw new Error("Missing child button bounds");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.waitForTimeout(duration);
  await page.mouse.move(x + 1, y);
  await page.mouse.up();
});
Then("the gesture captures the pointer", async ({ gestures }) =>
  expect((await gestures.captureResult()).captures).toBeGreaterThan(0),
);
Given("pan and swipe gestures with a child button", ({ gestures }) => {
  gestures.pointerCapture = "native";
  gestures.html = `<div id="target" style="width: 200px; height: 100px"><button id="child">Child</button></div>
    ${gestures.gestureMarkup("pan")}${gestures.gestureMarkup("swipe", 'directions="left right"')}`;
});
Given("a pan gesture with a child button and native pointer capture", ({ gestures }) => {
  gestures.pointerCapture = "native";
  gestures.html = `<div id="target" style="width: 200px; height: 100px"><button id="child">Child</button></div>
    ${gestures.gestureMarkup("pan")}`;
});
When("the user drags the child button {int}px", async ({ page }, distance: number) => {
  const box = await page.locator("#child").boundingBox();
  if (!box) throw new Error("Missing child button bounds");
  const x = box.x + box.width / 2;
  const y = box.y + box.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.mouse.move(x + distance, y, { steps: 6 });
  await page.mouse.up();
});

Given("low- and high-priority pan gestures", ({ gestures }) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    <m3e-pan-gesture id="low" for="target" min-displacement="1" priority="1"></m3e-pan-gesture>
    <m3e-pan-gesture id="high" for="target" min-displacement="1" priority="10"></m3e-pan-gesture>`;
});
When("the user pans the target", async ({ gestures }) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.dispatch("pointermove", 1, 60, 50);
  await gestures.dispatch("pointerup", 1, 60, 50);
});
Then("both pan gestures start", async ({ gestures }) => {
  expect(await gestures.phases("low")).toContain("start");
  expect(await gestures.phases("high")).toContain("start");
});
Then("the high-priority pan ends while the low-priority pan cancels", async ({ gestures }) => {
  expect(await gestures.phases("high")).toContain("end");
  expect(await gestures.phases("low")).toContain("cancel");
});
Given("an eager pan and a deferred long press", ({ gestures }) => {
  gestures.html = `<div id="target" style="width: 200px; height: 100px"></div>
    <m3e-pan-gesture id="pan" for="target" min-displacement="0" priority="10"></m3e-pan-gesture>
    <m3e-long-press-gesture id="long-press" for="target" min-duration="50" priority="1"></m3e-long-press-gesture>`;
});
When("the user holds the target for {int}ms", async ({ gestures }, duration: number) => {
  await gestures.dispatch("pointerdown", 1, 40, 50);
  await gestures.page.waitForTimeout(duration);
  await gestures.dispatch("pointerup", 1, 40, 50);
});
Then("the long press ends while the pan cancels", async ({ gestures }) => {
  expect(await gestures.phases("long-press")).toContain("end");
  expect(await gestures.phases("pan")).toContain("cancel");
});
