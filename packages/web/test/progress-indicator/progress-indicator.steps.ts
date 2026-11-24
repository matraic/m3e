import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ProgressIndicatorHarness } from "./progress-indicator.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  progressIndicator: ProgressIndicatorHarness;
}>({
  progressIndicator: async ({ page, render }, use) => use(new ProgressIndicatorHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given(
  "a {string} progress indicator with attributes {string}",
  ({ progressIndicator }, kind: string, attributes: string) => {
    if (kind !== "linear" && kind !== "circular") throw new Error(`Unknown progress indicator kind: ${kind}`);
    progressIndicator.kind = kind;
    progressIndicator.html = progressIndicator.markup(kind, attributes);
  },
);
When("the progress indicator renders", async ({ progressIndicator }) => progressIndicator.render());
Then(
  "the progress indicator is an accessible progressbar named {string}",
  async ({ progressIndicator }, name: string) =>
    expect(progressIndicator.page.getByRole("progressbar", { name, exact: true })).toBeVisible(),
);
Then(
  "the progress indicator has minimum {int}, maximum {int} and current value {int}",
  async ({ progressIndicator }, minimum: number, maximum: number, value: number) => {
    await expect(progressIndicator.progressbar).toHaveAttribute("aria-valuemin", String(minimum));
    await expect(progressIndicator.progressbar).toHaveAttribute("aria-valuemax", String(maximum));
    await expect(progressIndicator.progressbar).toHaveAttribute("aria-valuenow", String(value));
  },
);
When("the application changes its value to {int}", async ({ progressIndicator }, value: number) =>
  progressIndicator.indicator.evaluate((element, nextValue) => element.setAttribute("value", String(nextValue)), value),
);
Then("the visual progress is {int} percent", async ({ progressIndicator }, percent: number) => {
  if (progressIndicator.kind === "linear") {
    await expect
      .poll(async () => {
        const width = await progressIndicator.indicator.evaluate((element) => element.getBoundingClientRect().width);
        const primary = await progressIndicator.indicator
          .locator(".primary")
          .evaluate((element) => element.getBoundingClientRect().width);
        return (primary / width) * 100;
      })
      .toBeCloseTo(percent, 0);
  } else {
    await expect
      .poll(async () => {
        const dash = await progressIndicator.indicator.locator(".active-track path").getAttribute("stroke-dasharray");
        if (!dash) throw new Error("Missing circular progress dash array");
        return Number.parseFloat(dash);
      })
      .toBeCloseTo(percent, 1);
  }
});
When("the application changes its maximum to {int}", async ({ progressIndicator }, maximum: number) =>
  progressIndicator.indicator.evaluate((element, value) => element.setAttribute("max", String(value)), maximum),
);

Given("two {string} progress indicators with valid and invalid variants", ({ progressIndicator }, kind: string) => {
  if (kind !== "linear" && kind !== "circular") throw new Error(`Unknown progress indicator kind: ${kind}`);
  progressIndicator.kind = kind;
  progressIndicator.html = `
    ${progressIndicator.markup(kind, 'id="valid-variant" variant="wavy" aria-label="Wavy"')}
    ${progressIndicator.markup(kind, 'id="invalid-variant" variant="bogus" aria-label="Invalid"')}`;
});
Then("the valid variant is {string}", async ({ page }, variant: string) =>
  expect(page.locator("#valid-variant")).toHaveAttribute("variant", variant),
);
Then("the invalid variant falls back to {string}", async ({ page }, variant: string) =>
  expect(page.locator("#invalid-variant")).toHaveAttribute("variant", variant),
);

Given("a hidden {string} progress indicator", ({ progressIndicator }, kind: string) => {
  if (kind !== "linear" && kind !== "circular") throw new Error(`Unknown progress indicator kind: ${kind}`);
  progressIndicator.kind = kind;
  progressIndicator.html = progressIndicator.markup(kind, 'hidden aria-label="Progress"');
});
Then("the progress indicator is hidden", async ({ progressIndicator }) =>
  expect(progressIndicator.indicator).toBeHidden(),
);

Given(
  "a circular wavy indicator in a closed expansion panel with mode {string}",
  ({ progressIndicator }, mode: string) => progressIndicator.prepareCollapsedCircularWave(mode),
);
When("the expansion panel opens", async ({ progressIndicator }) => progressIndicator.openCircularWavePanel());
Then("the circular indicator renders valid geometry without SVG errors", async ({ progressIndicator }) =>
  progressIndicator.verifyCollapsedCircularWave(),
);

Given("a linear progress indicator with mode {string}", ({ progressIndicator }, mode: string) => {
  progressIndicator.kind = "linear";
  progressIndicator.html = progressIndicator.markup("linear", `aria-label="Progress" value="40" mode="${mode}"`);
});
Then("the progressbar has no current value", async ({ progressIndicator }) =>
  expect(progressIndicator.progressbar).not.toHaveAttribute("aria-valuenow"),
);

Given(
  "a linear progress indicator with mode {string} and value {int}",
  ({ progressIndicator }, mode: string, value: number) => {
    progressIndicator.kind = "linear";
    progressIndicator.html = progressIndicator.markup(
      "linear",
      `aria-label="Progress" value="${value}" mode="${mode}"`,
    );
  },
);
When("the application changes the linear mode to {string}", async ({ progressIndicator }, mode: string) =>
  progressIndicator.indicator.evaluate((element, nextMode) => element.setAttribute("mode", nextMode), mode),
);
Then("the progressbar has current value {int}", async ({ progressIndicator }, value: number) =>
  expect(progressIndicator.progressbar).toHaveAttribute("aria-valuenow", String(value)),
);

Given(
  "a linear progress indicator with buffer mode, value {int} and buffer {int}",
  ({ progressIndicator }, value: number, buffer: number) => {
    progressIndicator.kind = "linear";
    progressIndicator.html = progressIndicator.markup(
      "linear",
      `aria-label="Progress" value="${value}" buffer-value="${buffer}" mode="buffer"`,
    );
  },
);
Then("the buffer segment is {int} percent of the indicator width", async ({ progressIndicator }, percent: number) => {
  await expect
    .poll(async () => {
      const width = await progressIndicator.indicator.evaluate((element) => element.getBoundingClientRect().width);
      const buffer = await progressIndicator.indicator
        .locator(".secondary")
        .evaluate((element) => element.getBoundingClientRect().width);
      return (buffer / width) * 100;
    })
    .toBeCloseTo(percent, 0);
});
When("the application changes its buffer value to {int}", async ({ progressIndicator }, buffer: number) =>
  progressIndicator.indicator.evaluate((element, value) => element.setAttribute("buffer-value", String(value)), buffer),
);

Given("a linear progress indicator with an invalid mode", ({ progressIndicator }) => {
  progressIndicator.kind = "linear";
  progressIndicator.html = progressIndicator.markup("linear", 'aria-label="Progress" mode="bogus"');
});
Then("the linear mode is {string}", async ({ progressIndicator }, mode: string) =>
  expect(progressIndicator.indicator).toHaveAttribute("mode", mode),
);

When("the application moves the progress indicator to another parent", async ({ progressIndicator }) =>
  progressIndicator.indicator.evaluate((element) => {
    const destination = document.querySelector("#progress-destination");
    if (!destination) throw new Error("Missing progress indicator destination");
    destination.append(element);
  }),
);

Given("a wavy indeterminate circular progress indicator", ({ progressIndicator }) => {
  progressIndicator.kind = "circular";
  progressIndicator.html = progressIndicator.markup("circular", 'variant="wavy" indeterminate aria-label="Progress"');
});
Then("the circular indeterminate wave continues animating", async ({ progressIndicator }) => {
  const active = progressIndicator.indicator.locator(".spinner.active-track");
  const before = await active.getAttribute("stroke-dasharray");
  await expect.poll(() => active.getAttribute("stroke-dasharray")).not.toBe(before);
});

Given("a circular progress indicator with a label", ({ progressIndicator }) => {
  progressIndicator.kind = "circular";
  progressIndicator.html = progressIndicator.markup("circular", 'aria-label="Loading" value="40"');
});
Then("the visual progress graphic is hidden from assistive technology", async ({ progressIndicator }) =>
  expect(progressIndicator.indicator.locator(".progress")).toHaveAttribute("aria-hidden", "true"),
);

Given(
  "a linear progress indicator in {string} mode and {string} direction",
  ({ progressIndicator }, mode: string, direction: string) => {
    if (!["determinate", "buffer", "indeterminate", "query"].includes(mode))
      throw new Error(`Unknown progress mode: ${mode}`);
    if (direction !== "ltr" && direction !== "rtl") throw new Error(`Unknown direction: ${direction}`);
    progressIndicator.kind = "linear";
    progressIndicator.direction = direction;
    progressIndicator.html = progressIndicator.markup(
      "linear",
      `mode="${mode}" value="25" buffer-value="60" style="width: 200px"`,
    );
  },
);
Then("the progress starts at the {string} inline start edge", async ({ progressIndicator }, direction: string) => {
  if (direction !== "ltr" && direction !== "rtl") throw new Error(`Unknown direction: ${direction}`);
  await expect
    .poll(() =>
      progressIndicator.indicator.evaluate((element, dir) => {
        const primary = element.shadowRoot?.querySelector(".primary");
        if (!primary) throw new Error("Missing linear primary segment");
        const outer = element.getBoundingClientRect();
        const inner = primary.getBoundingClientRect();
        return dir === "rtl" ? Math.abs(outer.right - inner.right) : Math.abs(outer.left - inner.left);
      }, direction),
    )
    .toBeLessThan(1);
  if ((await progressIndicator.indicator.getAttribute("mode")) === "buffer") {
    await expect
      .poll(() =>
        progressIndicator.indicator.evaluate((element, dir) => {
          const primary = element.shadowRoot?.querySelector(".primary");
          const secondary = element.shadowRoot?.querySelector(".secondary");
          const buffer = element.shadowRoot?.querySelector(".buffer");
          if (!primary || !secondary || !buffer) throw new Error("Missing linear buffer segments");
          const active = primary.getBoundingClientRect();
          const buffered = secondary.getBoundingClientRect();
          const remaining = buffer.getBoundingClientRect();
          return dir === "rtl"
            ? buffered.right <= active.left && remaining.right <= buffered.left
            : buffered.left >= active.right && remaining.left >= buffered.right;
        }, direction),
      )
      .toBe(true);
  }
});
Then(
  "the {string} animation follows the {string} direction",
  async ({ progressIndicator }, mode: string, direction: string) => {
    if (mode !== "indeterminate" && mode !== "query") throw new Error(`Unknown progress mode: ${mode}`);
    if (direction !== "ltr" && direction !== "rtl") throw new Error(`Unknown direction: ${direction}`);
    const expectedSign = (mode === "indeterminate") === (direction === "ltr") ? 1 : -1;
    await expect
      .poll(
        async () =>
          expectedSign *
          (await progressIndicator.indicator.evaluate((element) => {
            const progress = element.shadowRoot?.querySelector<HTMLElement>(".progress");
            const primary = element.shadowRoot?.querySelector<HTMLElement>(".primary");
            if (!progress || !primary) throw new Error("Missing indeterminate linear segments");
            const animation = primary.getAnimations().find((item) => item instanceof CSSAnimation);
            if (!animation) throw new Error("Missing indeterminate progress animation");
            animation.pause();
            animation.currentTime = 900;
            const firstBounds = primary.getBoundingClientRect();
            const first = firstBounds.left + firstBounds.width / 2;
            animation.currentTime = 1200;
            const secondBounds = primary.getBoundingClientRect();
            const second = secondBounds.left + secondBounds.width / 2;
            return second - first;
          })),
      )
      .toBeGreaterThan(1);
  },
);

Given("a resizable wavy {string} indeterminate progress indicator", ({ progressIndicator }, kind: string) => {
  if (kind !== "linear" && kind !== "circular") throw new Error(`Unknown progress indicator kind: ${kind}`);
  progressIndicator.kind = kind;
  const sizing =
    kind === "linear"
      ? 'mode="indeterminate" style="width: 100px"'
      : 'indeterminate style="--m3e-circular-wavy-progress-indicator-diameter: 100px"';
  progressIndicator.html = progressIndicator.markup(kind, `variant="wavy" ${sizing}`);
});
Then("its geometry matches a size of {int} pixels", async ({ progressIndicator }, size: number) => {
  if (progressIndicator.kind === "linear") {
    await expect(progressIndicator.indicator.locator("svg.wave")).toHaveAttribute("width", String(size));
  } else {
    await expect(progressIndicator.indicator.locator(".progress > svg")).toHaveAttribute(
      "viewBox",
      `0 0 ${size} ${size}`,
    );
  }
});
When("the application resizes the progress indicator to {int} pixels", async ({ progressIndicator }, size: number) =>
  progressIndicator.indicator.evaluate(
    (element, options) => {
      if (options.kind === "linear") {
        element.style.width = `${options.size}px`;
      } else {
        element.style.setProperty("--m3e-circular-wavy-progress-indicator-diameter", `${options.size}px`);
      }
    },
    { kind: progressIndicator.kind, size },
  ),
);
Then("its indeterminate animation continues", async ({ progressIndicator }) => {
  if (progressIndicator.kind === "linear") {
    const wave = progressIndicator.indicator.locator(".wave-path");
    const currentTime = () =>
      wave.evaluate((path) => {
        const animation = path.getAnimations()[0];
        if (!animation || typeof animation.currentTime !== "number") throw new Error("Missing linear wave animation");
        return animation.currentTime;
      });
    const before = await currentTime();
    await expect.poll(currentTime).toBeGreaterThan(before);
  } else {
    const active = progressIndicator.indicator.locator(".spinner.active-track");
    const before = await active.getAttribute("stroke-dasharray");
    await expect.poll(() => active.getAttribute("stroke-dasharray")).not.toBe(before);
  }
});

Given("a paused wavy indeterminate circular progress indicator", async ({ page, progressIndicator }) => {
  const start = new Date("2026-01-01T00:00:00Z");
  await page.clock.install({ time: start });
  await page.clock.pauseAt(start);
  progressIndicator.kind = "circular";
  progressIndicator.html = progressIndicator.markup("circular", 'variant="wavy" indeterminate');
});
Then("the wavy spinner follows its six-second sweep and rotation cycle", async ({ progressIndicator }) =>
  progressIndicator.verifyWavySweepAndRotation(),
);

Given("a flat indeterminate circular progress indicator", ({ progressIndicator }) => {
  progressIndicator.kind = "circular";
  progressIndicator.html = progressIndicator.markup("circular", "indeterminate");
});
Then("the flat spinner path is circular", async ({ progressIndicator }) =>
  progressIndicator.verifyFlatCircularSpinner(),
);

Given(
  "a circular progress indicator with value {int} and indeterminate state",
  ({ progressIndicator }, value: number) => {
    progressIndicator.kind = "circular";
    progressIndicator.html = progressIndicator.markup(
      "circular",
      `aria-label="Progress" value="${value}" indeterminate`,
    );
  },
);
When("the application removes indeterminate state", async ({ progressIndicator }) =>
  progressIndicator.indicator.evaluate((element) => element.removeAttribute("indeterminate")),
);
Then("the spinner wave and track endpoints stay synchronized across repeated wraps", async ({ progressIndicator }) =>
  progressIndicator.verifySynchronizedWraps(),
);
When("the application changes the circular variant to {string}", async ({ progressIndicator }, variant: string) =>
  progressIndicator.indicator.evaluate((element, nextVariant) => element.setAttribute("variant", nextVariant), variant),
);
Then("the wavy spinner resumes animating", async ({ progressIndicator }) => {
  const active = progressIndicator.indicator.locator(".spinner.active-track");
  await expect(active).toHaveAttribute("d", / C /);
  const before = await active.getAttribute("stroke-dasharray");
  await expect.poll(() => active.getAttribute("stroke-dasharray")).not.toBe(before);
});

Given(
  "linear wavy indicators at values {int}, {int}, {int}, {int} and {int}",
  ({ progressIndicator }, first: number, second: number, third: number, fourth: number, fifth: number) => {
    progressIndicator.kind = "linear";
    progressIndicator.html = [first, second, third, fourth, fifth]
      .map((value) => progressIndicator.markup("linear", `variant="wavy" value="${value}"`))
      .join("");
  },
);
Then("only the middle linear wave has a wavy path", async ({ progressIndicator }) =>
  progressIndicator.verifyLinearWaveThresholds(),
);

Given("a linear wavy progress indicator at value {int}", ({ progressIndicator }, value: number) => {
  progressIndicator.kind = "linear";
  progressIndicator.html = progressIndicator.markup("linear", `variant="wavy" value="${value}"`);
});
Then("its wave animation lasts one second", async ({ progressIndicator }) =>
  expect(progressIndicator.indicator.locator(".wave-path")).toHaveCSS("animation-duration", "1s"),
);

Given(
  "a paused linear wavy progress indicator in {string} mode at value {int}",
  async ({ page, progressIndicator }, mode: string, value: number) => {
    if (mode !== "determinate" && mode !== "buffer") throw new Error(`Unknown progress mode: ${mode}`);
    const start = new Date("2026-01-01T00:00:00Z");
    await page.clock.install({ time: start });
    await page.clock.pauseAt(start);
    progressIndicator.kind = "linear";
    progressIndicator.html = progressIndicator.markup(
      "linear",
      `variant="wavy" mode="${mode}" value="${value}" buffer-value="80" style="--m3e-linear-progress-indicator-thickness: 6px"`,
    );
  },
);
Then(
  "its linear wave morphs over 500 milliseconds without changing its stroke or height",
  async ({ progressIndicator }) => progressIndicator.verifyLinearWaveMorph(),
);
Then("its linear wave smoothly flattens after jumping directly to completion", async ({ progressIndicator }) =>
  progressIndicator.verifyLinearCompletionMorph(),
);
Then(
  "its interrupted linear morph retargets from its current shape and resumes after moving",
  async ({ progressIndicator }) => progressIndicator.verifyInterruptedLinearMorph(),
);
Then(
  "its linear wave smoothly morphs when switching to {string} mode and back",
  async ({ progressIndicator }, mode: string) => progressIndicator.verifyLinearModeMorph(mode),
);
Then(
  "reducing its configured amplitude smoothly flattens the linear wave without clipping",
  async ({ progressIndicator }) => progressIndicator.verifyLinearAmplitudeMorph(),
);

Given("a circular wavy progress indicator at value {int}", ({ progressIndicator }, value: number) => {
  progressIndicator.kind = "circular";
  progressIndicator.html = progressIndicator.markup("circular", `variant="wavy" value="${value}"`);
});
Then("its wave path is continuous and its animation lasts nine seconds", async ({ progressIndicator }) =>
  progressIndicator.verifyContinuousCircularWave(),
);
Then("its rounded star has nine lobes and the expected contained geometry", async ({ progressIndicator }) =>
  progressIndicator.verifyRoundedStarGeometry(),
);

Given(
  "a paused circular wavy progress indicator at value {int}",
  async ({ page, progressIndicator }, value: number) => {
    const start = new Date("2026-01-01T00:00:00Z");
    await page.clock.install({ time: start });
    await page.clock.pauseAt(start);
    progressIndicator.kind = "circular";
    progressIndicator.html = progressIndicator.markup("circular", `variant="wavy" value="${value}"`);
  },
);
Then("its wave morphs between circle and star over 500 milliseconds without snapping", async ({ progressIndicator }) =>
  progressIndicator.verifyWaveMorph(),
);
Then("its interrupted wave morph retargets from its current shape", async ({ progressIndicator }) =>
  progressIndicator.verifyInterruptedWaveMorph(),
);

Given("circular wavy indicators with custom amplitude and wavelength", ({ progressIndicator }) => {
  progressIndicator.kind = "circular";
  progressIndicator.html = `
    ${progressIndicator.markup(
      "circular",
      'variant="wavy" value="50" style="--m3e-circular-wavy-progress-indicator-wavelength: 30px; --m3e-circular-wavy-progress-indicator-amplitude: 3.2px"',
    )}
    ${progressIndicator.markup(
      "circular",
      'variant="wavy" value="50" style="--m3e-circular-wavy-progress-indicator-amplitude: 100px"',
    )}`;
});
Then("both rounded stars remain contained without folding", async ({ progressIndicator }) =>
  progressIndicator.verifyCustomStarsContained(),
);
Then("its amplitude morphs while indeterminate motion continues", async ({ progressIndicator }) =>
  progressIndicator.verifyIndeterminateAmplitudeMorph(),
);
Then("its rounded wave ends stay aligned during motion", async ({ progressIndicator }) =>
  progressIndicator.verifyRoundedWaveAlignment(),
);

Given(
  "a circular wavy indicator in {string} mode with fractional stroke width",
  ({ progressIndicator }, mode: string) => {
    if (mode !== "determinate" && mode !== "indeterminate") throw new Error(`Unknown progress mode: ${mode}`);
    progressIndicator.kind = "circular";
    const state = mode === "indeterminate" ? "indeterminate" : 'value="50"';
    progressIndicator.html = progressIndicator.markup(
      "circular",
      `variant="wavy" ${state} style="--m3e-circular-progress-indicator-thickness: 2.5px"`,
    );
  },
);
Then("its track and active stroke retain the configured width", async ({ progressIndicator }) =>
  progressIndicator.verifyWavyStrokeWidth(),
);
When("the application changes its stroke width to 8 pixels", async ({ progressIndicator }) => {
  progressIndicator.strokeWidth = 8;
  await progressIndicator.indicator.evaluate((element) =>
    element.style.setProperty("--m3e-circular-progress-indicator-thickness", "8px"),
  );
});

Given("a flat indeterminate circular indicator with zero wavy amplitude", ({ progressIndicator }) => {
  progressIndicator.kind = "circular";
  progressIndicator.html = progressIndicator.markup(
    "circular",
    'indeterminate style="--m3e-circular-wavy-progress-indicator-amplitude: 0px"',
  );
});
Then("the circular wavy spinner has a curved path and continues animating", async ({ progressIndicator }) =>
  progressIndicator.verifyZeroAmplitudeMotion(),
);

Given(
  "circular wavy indicators at values {int}, {int}, {int}, {int} and {int}",
  ({ progressIndicator }, first: number, second: number, third: number, fourth: number, fifth: number) => {
    progressIndicator.kind = "circular";
    progressIndicator.html = [first, second, third, fourth, fifth]
      .map((value) => progressIndicator.markup("circular", `variant="wavy" value="${value}"`))
      .join("");
  },
);
Then("only the middle circular indicator has a wave path", async ({ progressIndicator }) =>
  progressIndicator.verifyCircularWaveThresholds(),
);

Given(
  "a paused linear progress control in a {int} pixel wide viewport",
  async ({ page, progressIndicator }, width: number) => {
    const start = new Date("2026-01-01T00:00:00Z");
    await page.clock.install({ time: start });
    await page.clock.pauseAt(start);
    await progressIndicator.prepareCompletion(width);
  },
);
When("the completion control renders", async ({ progressIndicator }) => progressIndicator.renderCompletion());
Then(
  "the linear indicator keeps its width and end position through completion and replay",
  async ({ progressIndicator }) => progressIndicator.verifyCompletionWidth(),
);

Given(
  "progress indicators with a shared thickness control in a {int} pixel wide viewport",
  async ({ progressIndicator }, width: number) => progressIndicator.prepareThickness(width),
);
When("the thickness control renders", async ({ progressIndicator }) => progressIndicator.renderThickness());
Then("the shared thickness control changes both indicator shapes and variants", async ({ progressIndicator }) =>
  progressIndicator.verifyThickness(),
);
