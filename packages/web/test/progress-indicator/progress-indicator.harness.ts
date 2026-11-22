import type { Locator, Page } from "@playwright/test";
import type { M3eLinearProgressIndicatorElement } from "@m3e/web/progress-indicator";
import type { M3eSliderThumbElement } from "@m3e/web/slider";

import { expect } from "../fixtures";

export type ProgressIndicatorKind = "linear" | "circular";

export class ProgressIndicatorHarness {
  html = "";
  kind: ProgressIndicatorKind = "linear";
  direction?: "ltr" | "rtl";
  strokeWidth = 2.5;
  readonly selector = () => `m3e-${this.kind}-progress-indicator`;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get indicator() {
    return this.page.locator(this.selector()).first();
  }

  get progressbar() {
    return this.page.getByRole("progressbar", { name: "Progress", exact: true });
  }

  markup(kind: ProgressIndicatorKind, attributes = "", content = "") {
    return `<m3e-${kind}-progress-indicator ${attributes}>${content}</m3e-${kind}-progress-indicator>`;
  }

  async render() {
    await this.renderFixture(
      `${this.html}<div id="progress-destination"></div><button id="after-progress">After</button>`,
      this.direction,
    );
  }

  async circularWaveDepth(indicator = this.indicator): Promise<number> {
    return indicator.locator(".active-track path, path.active-track").evaluate((path: SVGPathElement) => {
      const svg = path.ownerSVGElement;
      if (!svg) throw new Error("Missing circular indicator SVG");
      const center = svg.viewBox.baseVal.width / 2;
      const length = path.getTotalLength();
      const radii = Array.from({ length: 360 }, (_, i) => {
        const point = path.getPointAtLength((length * i) / 360);
        return Math.hypot(point.x - center, point.y - center);
      });
      return Math.max(...radii) - Math.min(...radii);
    });
  }

  async verifyWavySweepAndRotation() {
    const indicator = this.indicator;
    await this.page.clock.runFor(32);
    const sample = () =>
      indicator.evaluate((element) => {
        const svg = element.shadowRoot?.querySelector<SVGSVGElement>(".progress > svg");
        const path = svg?.querySelector<SVGPathElement>(".active-track");
        if (!svg || !path) throw new Error("Missing wavy spinner paths");
        return {
          sweep: Number.parseFloat(path.getAttribute("stroke-dasharray") ?? "") * 3.6,
          rotation: Number.parseFloat(svg.style.transform.replace("rotate(", "")),
        };
      });
    const initial = await sample();
    await this.page.clock.runFor(150);
    const firstTurn = await sample();
    await this.page.clock.runFor(1350);
    const quarter = await sample();
    await this.page.clock.runFor(1500);
    const half = await sample();
    await this.page.clock.runFor(1500);
    const threeQuarters = await sample();
    await this.page.clock.runFor(1500);
    const full = await sample();
    expect(initial.sweep).toBeGreaterThanOrEqual(36);
    expect(initial.sweep).toBeLessThan(42);
    expect(firstTurn.rotation).toBeGreaterThan(65);
    expect(firstTurn.rotation).toBeLessThan(90);
    expect(quarter.sweep).toBeCloseTo(174.6, -1);
    expect(half.sweep).toBeCloseTo(313.2, -1);
    expect(threeQuarters.sweep).toBeCloseTo(69.86, -1);
    expect(full.sweep).toBeGreaterThanOrEqual(36);
    expect(full.sweep).toBeLessThan(42);
    for (const point of [quarter, half, threeQuarters, full]) {
      expect(Math.abs(((point.rotation + 180) % 360) - 180)).toBeLessThan(20);
    }
  }

  async verifySynchronizedWraps() {
    await this.page.clock.runFor(32);
    for (const duration of [8800, 200, 100, 8700, 200, 100, 8700, 200, 100]) {
      await this.page.clock.runFor(duration);
      const sample = await this.indicator.evaluate((element) => {
        const active = element.shadowRoot?.querySelector<SVGPathElement>(".spinner.active-track");
        const track = element.shadowRoot?.querySelector<SVGPathElement>(".spinner.track");
        const svg = active?.ownerSVGElement;
        if (!active || !track || !svg) throw new Error("Missing wavy spinner geometry");
        const style = getComputedStyle(active);
        const offset = Number.parseFloat(style.strokeDashoffset);
        const sweep = Number.parseFloat(style.strokeDasharray);
        const matrix = new DOMMatrix(style.transform);
        const center = svg.viewBox.baseVal.width / 2;
        const length = active.getTotalLength();
        const angle = (point: DOMPoint, rotate = false) => {
          const x = point.x - center;
          const y = point.y - center;
          const rotatedX = rotate ? matrix.a * x + matrix.c * y : x;
          const rotatedY = rotate ? matrix.b * x + matrix.d * y : y;
          return ((Math.atan2(rotatedY, rotatedX) * 180) / Math.PI + 450) % 360;
        };
        const wavePoint = (fraction: number) =>
          active.getPointAtLength(((((fraction % 100) + 100) % 100) * length) / 100);
        const startGap = (angle(wavePoint(-offset), true) - angle(track.getPointAtLength(0)) + 360) % 360;
        const endGap =
          (angle(track.getPointAtLength(track.getTotalLength())) - angle(wavePoint(-offset + sweep), true) + 360) % 360;
        return {
          offset,
          targetOffset: Number.parseFloat(active.getAttribute("stroke-dashoffset") ?? ""),
          startGap,
          endGap,
        };
      });
      expect(sample.offset).toBeCloseTo(sample.targetOffset, 3);
      for (const gap of [sample.startGap, sample.endGap]) {
        expect(gap).toBeGreaterThan(18);
        expect(gap).toBeLessThan(24);
      }
    }
  }

  async verifyFlatCircularSpinner() {
    const path = await this.indicator.evaluate((indicator) =>
      indicator.shadowRoot?.querySelector(".spinner .active-track")?.getAttribute("d"),
    );
    expect(path).toContain(" A ");
    expect(path).not.toContain(" L ");
  }

  async verifyLinearWaveThresholds() {
    const paths = await this.page
      .locator("m3e-linear-progress-indicator")
      .evaluateAll((indicators) =>
        indicators.map((indicator) => indicator.shadowRoot?.querySelector(".wave-path")?.getAttribute("d")),
      );
    expect(paths[0]).not.toContain("Q ");
    expect(paths[1]).not.toContain("Q ");
    expect(paths[2]).toContain("Q ");
    expect(paths[3]).not.toContain("Q ");
    expect(paths[4]).not.toContain("Q ");
  }

  async linearWaveDepth(): Promise<number> {
    return this.indicator.evaluate((element) => {
      const path = element.shadowRoot?.querySelector<SVGPathElement>(".wave-path");
      if (path) return path.getBBox().height;
      if (element.shadowRoot?.querySelector(".complete")) return 0;
      throw new Error("Missing linear wave or completion graphic");
    });
  }

  async verifyLinearWaveMorph() {
    const height = await this.indicator.evaluate((element) => element.getBoundingClientRect().height);
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
    await this.indicator.evaluate((element) => element.setAttribute("value", "50"));
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
    await this.page.clock.runFor(128);
    const growing = await this.linearWaveDepth();
    expect(growing).toBeGreaterThan(0.5);
    expect(growing).toBeLessThan(3);
    await this.page.clock.runFor(384);
    const full = await this.linearWaveDepth();
    expect(full).toBeCloseTo(3, 2);
    const renderedStroke = await this.indicator.locator(".wave-path").evaluate((path: SVGPathElement) => {
      const matrix = path.getScreenCTM();
      if (!matrix) throw new Error("Missing linear wave transform");
      return Number(path.getAttribute("stroke-width")) * Math.hypot(matrix.c, matrix.d);
    });
    expect(renderedStroke).toBeCloseTo(6, 2);
    await this.indicator.evaluate((element) => element.setAttribute("value", "95"));
    expect(await this.linearWaveDepth()).toBeCloseTo(full, 2);
    await this.page.clock.runFor(240);
    const shrinking = await this.linearWaveDepth();
    expect(shrinking).toBeGreaterThan(full * 0.7);
    expect(shrinking).toBeLessThan(full);
    await this.page.clock.runFor(272);
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
    expect(await this.indicator.evaluate((element) => element.getBoundingClientRect().height)).toBe(height);
  }

  async verifyLinearCompletionMorph() {
    const full = await this.linearWaveDepth();
    expect(full).toBeCloseTo(3, 2);
    await this.indicator.evaluate((element) => element.setAttribute("value", "100"));
    expect(await this.linearWaveDepth()).toBeCloseTo(full, 2);
    await expect(this.indicator.locator(".complete")).toHaveCount(0);
    await this.page.clock.runFor(240);
    const shrinking = await this.linearWaveDepth();
    expect(shrinking).toBeGreaterThan(full * 0.7);
    expect(shrinking).toBeLessThan(full);
    await this.page.clock.runFor(272);
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
    await expect(this.indicator.locator(".complete")).toHaveCSS("height", "6px");
    await expect(this.indicator.locator(".wave")).toHaveCount(0);
  }

  async verifyInterruptedLinearMorph() {
    const full = await this.linearWaveDepth();
    await this.indicator.evaluate((element) => element.setAttribute("value", "5"));
    await this.page.clock.runFor(256);
    const partial = await this.linearWaveDepth();
    expect(partial).toBeGreaterThan(0);
    expect(partial).toBeLessThan(full);
    await this.indicator.evaluate((element) => {
      element.setAttribute("value", "50");
      const destination = document.getElementById("progress-destination");
      if (!destination) throw new Error("Missing progress destination");
      destination.append(element);
    });
    expect(await this.linearWaveDepth()).toBeCloseTo(partial, 2);
    await this.page.clock.runFor(128);
    const returning = await this.linearWaveDepth();
    expect(returning).toBeGreaterThan(partial);
    expect(returning).toBeLessThan(full);
    await this.page.clock.runFor(384);
    expect(await this.linearWaveDepth()).toBeCloseTo(full, 2);
  }

  async verifyLinearModeMorph(mode: string) {
    if (mode !== "indeterminate" && mode !== "query") throw new Error(`Unknown progress mode: ${mode}`);
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
    await this.indicator.evaluate((element, nextMode) => element.setAttribute("mode", nextMode), mode);
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
    await this.page.clock.runFor(128);
    const growing = await this.linearWaveDepth();
    expect(growing).toBeGreaterThan(0.5);
    expect(growing).toBeLessThan(3);
    await this.page.clock.runFor(384);
    expect(await this.linearWaveDepth()).toBeCloseTo(3, 2);
    await expect(this.indicator.locator(".wave-path")).toHaveCSS("animation-duration", "1s");
    await this.indicator.evaluate((element) => element.setAttribute("mode", "determinate"));
    expect(await this.linearWaveDepth()).toBeCloseTo(3, 2);
    await this.page.clock.runFor(512);
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
  }

  async verifyLinearAmplitudeMorph() {
    const full = await this.linearWaveDepth();
    await this.indicator.evaluate(
      (element) =>
        new Promise<void>((resolve) => {
          const measurement = element.shadowRoot?.querySelector(".amplitude-and-wavelength");
          if (!measurement) throw new Error("Missing linear amplitude measurement");
          const observer = new ResizeObserver(() => {
            observer.disconnect();
            resolve();
          });
          observer.observe(measurement);
          element.style.setProperty("--m3e-linear-wavy-progress-indicator-amplitude", "0px");
        }),
    );
    await this.page.clock.runFor(240);
    const partial = await this.linearWaveDepth();
    expect(partial).toBeGreaterThan(0);
    expect(partial).toBeLessThan(full);
    const bounds = await this.indicator.locator(".wave-path").evaluate((path: SVGPathElement) => {
      const svg = path.ownerSVGElement;
      if (!svg) throw new Error("Missing linear wave SVG");
      const box = path.getBBox();
      const radius = Number(path.getAttribute("stroke-width")) / 2;
      return {
        top: box.y - radius,
        bottom: box.y + box.height + radius,
        height: svg.viewBox.baseVal.height,
        visibleHeight: svg.parentElement?.getBoundingClientRect().height,
      };
    });
    expect(bounds.top).toBeGreaterThanOrEqual(0);
    expect(bounds.bottom).toBeLessThanOrEqual(bounds.height);
    expect(bounds.visibleHeight).toBeCloseTo(bounds.height, 1);
    await this.page.clock.runFor(512);
    expect(await this.linearWaveDepth()).toBeLessThan(0.002);
    await expect(this.indicator).toHaveCSS("height", "6px");
  }

  async verifyContinuousCircularWave() {
    const wave = this.indicator.locator(".wave");
    const path = await wave.getAttribute("d");
    const coordinates = path?.match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)?.map(Number) ?? [];
    const start = coordinates.slice(0, 2);
    const end = coordinates.slice(-2);
    expect(Math.hypot(start[0] - end[0], start[1] - end[1])).toBeLessThan(0.000001);
    await expect(wave).toHaveCSS("animation-duration", "9s");
  }

  async verifyRoundedStarGeometry() {
    const wave = this.indicator.locator(".wave");
    await expect(wave).toHaveAttribute("d", / C /);
    const geometry = await wave.evaluate((path: SVGPathElement) => {
      const length = path.getTotalLength();
      const radii = Array.from({ length: 900 }, (_, i) => {
        const point = path.getPointAtLength((length * i) / 900);
        return Math.hypot(point.x - 24, point.y - 24);
      });
      return {
        min: Math.min(...radii),
        max: Math.max(...radii),
        peaks: radii.filter((radius, i) => radius > radii[(i + 899) % 900] && radius > radii[(i + 1) % 900]).length,
      };
    });
    expect(geometry.peaks).toBe(9);
    expect(geometry.max).toBeCloseTo(22, 1);
    expect(geometry.min).toBeCloseTo(19.47, 1);
    const cornerRadii = await wave.evaluate((path: SVGPathElement) => {
      const coordinates = path
        .getAttribute("d")
        ?.match(/-?\d+(?:\.\d+)?(?:e[-+]?\d+)?/gi)
        ?.map(Number);
      if (!coordinates) throw new Error("Missing rounded-star geometry");
      const radiusAtStart = (offset: number) => {
        const [x, y, x1, y1, x2, y2] = coordinates.slice(offset, offset + 6);
        const dx = 3 * (x1 - x);
        const dy = 3 * (y1 - y);
        const ddx = 6 * (x2 - 2 * x1 + x);
        const ddy = 6 * (y2 - 2 * y1 + y);
        return Math.pow(Math.hypot(dx, dy), 3) / Math.abs(dx * ddy - dy * ddx);
      };
      return [radiusAtStart(0), radiusAtStart(6), radiusAtStart(12)];
    });
    expect(cornerRadii[0]).toBeCloseTo(cornerRadii[1], 1);
    expect(cornerRadii[2]).toBeGreaterThan(cornerRadii[0] * 1.3);
  }

  async verifyWaveMorph() {
    const indicator = this.indicator;
    expect(await this.circularWaveDepth()).toBeLessThan(0.002);
    await indicator.evaluate((element) => element.setAttribute("value", "50"));
    expect(await this.circularWaveDepth()).toBeLessThan(0.002);
    await this.page.clock.runFor(128);
    const growing = await this.circularWaveDepth();
    expect(growing).toBeGreaterThan(0.5);
    expect(growing).toBeLessThan(2.5);
    await this.page.clock.runFor(384);
    const full = await this.circularWaveDepth();
    expect(full).toBeCloseTo(2.53, 1);
    await indicator.evaluate((element) => element.setAttribute("value", "95"));
    expect(await this.circularWaveDepth()).toBeCloseTo(full, 2);
    await this.page.clock.runFor(240);
    const shrinking = await this.circularWaveDepth();
    expect(shrinking).toBeGreaterThan(full * 0.7);
    expect(shrinking).toBeLessThan(full);
    await this.page.clock.runFor(272);
    expect(await this.circularWaveDepth()).toBeLessThan(0.002);
    const dash = (await indicator.locator(".active-track path").getAttribute("stroke-dasharray"))
      ?.split(" ")
      .map(Number);
    expect(dash?.[0]).toBeCloseTo(95);
    expect(dash?.[1]).toBeCloseTo(5);
  }

  async verifyInterruptedWaveMorph() {
    const indicator = this.indicator;
    const full = await this.circularWaveDepth();
    await indicator.evaluate((element) => element.setAttribute("value", "5"));
    await this.page.clock.runFor(256);
    const partial = await this.circularWaveDepth();
    expect(partial).toBeLessThan(full);
    await indicator.evaluate((element) => element.setAttribute("value", "50"));
    expect(await this.circularWaveDepth()).toBeCloseTo(partial, 2);
    await this.page.clock.runFor(128);
    const returning = await this.circularWaveDepth();
    expect(returning).toBeGreaterThan(partial);
    expect(returning).toBeLessThan(full);
    await this.page.clock.runFor(384);
    expect(await this.circularWaveDepth()).toBeCloseTo(full, 2);
  }

  async verifyCustomStarsContained() {
    const paths = this.page.locator("m3e-circular-progress-indicator .wave");
    await expect(paths.first()).toHaveCSS("animation-duration", "5s");
    for (const path of await paths.all()) {
      const geometry = await path.evaluate((element: SVGPathElement) => {
        const length = element.getTotalLength();
        const points = Array.from({ length: 900 }, (_, i) => {
          const point = element.getPointAtLength((length * i) / 900);
          return { x: point.x - 24, y: point.y - 24 };
        });
        return {
          radius: Math.max(...points.map((point) => Math.hypot(point.x, point.y))),
          minTurn: Math.min(
            ...points.map((point, i) => {
              const next = points[(i + 1) % points.length];
              return point.x * next.y - point.y * next.x;
            }),
          ),
        };
      });
      expect(geometry.radius).toBeLessThanOrEqual(22.001);
      expect(geometry.minTurn).toBeGreaterThanOrEqual(-0.001);
    }
  }

  async verifyIndeterminateAmplitudeMorph() {
    await this.page.clock.runFor(32);
    const active = this.indicator.locator(".active-track");
    const full = await this.circularWaveDepth();
    const before = await active.getAttribute("stroke-dasharray");
    await this.indicator.evaluate((element) =>
      element.style.setProperty("--m3e-circular-wavy-progress-indicator-amplitude", "0px"),
    );
    await this.page.clock.runFor(128);
    const partial = await this.circularWaveDepth();
    expect(partial).toBeGreaterThan(0);
    expect(partial).toBeLessThan(full);
    await this.page.clock.runFor(512);
    expect(await this.circularWaveDepth()).toBeLessThan(0.002);
    expect(await active.getAttribute("stroke-dasharray")).not.toBe(before);
  }

  async verifyRoundedWaveAlignment() {
    const wave = this.indicator.locator(".wave");
    await expect(wave).toHaveAttribute("stroke-dasharray", "50 50");
    await expect(wave).toHaveAttribute("stroke-linecap", "round");
    const motion = await wave.evaluate((path: SVGPathElement) => {
      const animation = path.getAnimations()[0];
      animation.pause();
      animation.currentTime = 4500;
      const style = getComputedStyle(path);
      return { offset: parseFloat(style.strokeDashoffset), transform: style.transform };
    });
    expect(motion.offset).toBeCloseTo(-50);
    expect(motion.transform).toBe("matrix(-1, 0, 0, -1, 0, 0)");
  }

  async verifyWavyStrokeWidth() {
    const active = this.indicator.locator(".active-track path, path.active-track");
    const track = this.indicator.locator("path.track");
    const renderedStroke = () =>
      active.evaluate((path: SVGPathElement) => {
        const matrix = path.getScreenCTM();
        if (!matrix) throw new Error("Missing SVG transform");
        return Number(path.getAttribute("stroke-width")) * Math.hypot(matrix.a, matrix.b);
      });
    await expect(active).toHaveAttribute("stroke-width", String(this.strokeWidth));
    await expect(track).toHaveAttribute("stroke-width", String(this.strokeWidth));
    expect(await renderedStroke()).toBeCloseTo(this.strokeWidth, 2);
  }

  async verifyZeroAmplitudeMotion() {
    const active = this.indicator.locator(".spinner.active-track");
    await expect(active).toHaveAttribute("d", / C /);
    await this.indicator.evaluate((element) =>
      element.style.setProperty("--m3e-circular-progress-indicator-thickness", "7.5px"),
    );
    await expect(active).toHaveAttribute("stroke-width", "7.5");
    const before = await active.getAttribute("stroke-dasharray");
    await expect.poll(() => active.getAttribute("stroke-dasharray")).not.toBe(before);
  }

  async verifyCircularWaveThresholds() {
    const waves = await this.page
      .locator("m3e-circular-progress-indicator")
      .evaluateAll((indicators) =>
        indicators.map((indicator) => Boolean(indicator.shadowRoot?.querySelector("path.wave"))),
      );
    expect(waves).toEqual([false, false, true, false, false]);
  }

  async prepareCompletion(width: number) {
    await this.page.setViewportSize({ width, height: 720 });
    this.kind = "linear";
    this.html = `<div style="display: flex; align-items: center; gap: 16px">
      <m3e-linear-progress-indicator variant="wavy" value="0" aria-label="Progress"
        style="flex: 1; min-width: 0"></m3e-linear-progress-indicator>
      <span id="linear-progress-value" style="flex: none; width: 5ch; text-align: right">0%</span>
      <m3e-button id="run-linear-progress" style="flex: none; min-width: 128px">Run progress</m3e-button>
    </div>`;
  }

  async renderCompletion() {
    await this.render();
    await this.page.evaluate(() => {
      const progress = document.querySelector<M3eLinearProgressIndicatorElement>("m3e-linear-progress-indicator");
      const run = document.querySelector("m3e-button");
      const display = document.querySelector("#linear-progress-value");
      if (!progress || !run || !display) throw new Error("Missing completion test controls");
      run.addEventListener("click", () => {
        run.disabled = true;
        progress.value = 0;
        display.textContent = "0%";
        const timer = setInterval(() => {
          progress.value += 1;
          display.textContent = `${progress.value}%`;
          if (progress.value === 100) {
            clearInterval(timer);
            run.disabled = false;
            run.textContent = "Replay";
          }
        }, 100);
      });
    });
  }

  async verifyCompletionWidth() {
    const width = await this.indicator.evaluate((element) => element.getBoundingClientRect().width);
    expect(width).toBeGreaterThan(0);
    const run = this.page.locator("#run-linear-progress");
    for (let i = 0; i < 2; i++) {
      await run.evaluate((element: HTMLElement) => element.click());
      await this.page.clock.runFor(9500);
      await expect(this.indicator).toHaveAttribute("value", "95");
      const stop = await this.indicator.locator(".stop").evaluate((element) => element.getBoundingClientRect().right);
      expect(await this.indicator.evaluate((element) => element.getBoundingClientRect().width)).toBeCloseTo(width, 2);
      await this.page.clock.runFor(532);
      await expect(this.indicator).toHaveAttribute("value", "100");
      await expect(run).toHaveText("Replay");
      const complete = await this.indicator
        .locator(".complete")
        .evaluate((element) => element.getBoundingClientRect().right);
      expect(complete).toBeCloseTo(stop, 2);
      expect(await this.indicator.evaluate((element) => element.getBoundingClientRect().width)).toBeCloseTo(width, 2);
      expect(
        await this.page
          .locator("#linear-progress-value")
          .evaluate((element) => element.scrollWidth <= element.clientWidth),
      ).toBe(true);
    }
  }

  async prepareThickness(width: number) {
    await this.page.setViewportSize({ width, height: 720 });
    this.html = `<div id="progress-thickness-demo" style="display: grid; gap: 24px">
      <div style="display: flex; align-items: center; gap: 16px">
        <m3e-slider min="1" max="12" step="1" style="flex: 1; min-width: 0">
          <m3e-slider-thumb id="progress-thickness-thumb" value="4" aria-label="Stroke thickness"></m3e-slider-thumb>
        </m3e-slider>
        <span id="progress-thickness-value" style="flex: none; width: 5ch; text-align: right">4px</span>
      </div>
      <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px">
        <m3e-linear-progress-indicator value="50" aria-label="Flat linear thickness example"></m3e-linear-progress-indicator>
        <m3e-linear-progress-indicator value="50" variant="wavy" aria-label="Wavy linear thickness example"></m3e-linear-progress-indicator>
        <m3e-circular-progress-indicator value="50" aria-label="Flat circular thickness example"></m3e-circular-progress-indicator>
        <m3e-circular-progress-indicator value="50" variant="wavy" aria-label="Wavy circular thickness example"></m3e-circular-progress-indicator>
      </div>
    </div>`;
  }

  async renderThickness() {
    await this.render();
    await this.page.evaluate(() => {
      const demo = document.querySelector<HTMLElement>("#progress-thickness-demo");
      const thumb = document.querySelector<M3eSliderThumbElement>("m3e-slider-thumb");
      const display = document.querySelector("#progress-thickness-value");
      if (!demo || !thumb || !display) throw new Error("Missing thickness test controls");
      const updateThickness = () => {
        const thickness = `${thumb.value}px`;
        demo.style.setProperty("--m3e-linear-progress-indicator-thickness", thickness);
        demo.style.setProperty("--m3e-circular-progress-indicator-thickness", thickness);
        display.textContent = thickness;
        thumb.ariaValueText = `${thumb.value} pixels`;
      };
      thumb.addEventListener("input", updateThickness);
      updateThickness();
    });
  }

  async verifyThickness() {
    const demo = this.page.locator("#progress-thickness-demo");
    const thumb = demo.getByRole("slider", { name: "Stroke thickness" });
    const display = demo.locator("#progress-thickness-value");
    const flatLinear = demo.getByRole("progressbar", { name: "Flat linear thickness example", exact: true });
    const wavyLinear = demo.getByRole("progressbar", { name: "Wavy linear thickness example", exact: true });
    const flatCircular = demo.getByRole("progressbar", { name: "Flat circular thickness example", exact: true });
    const wavyCircular = demo.getByRole("progressbar", { name: "Wavy circular thickness example", exact: true });
    const flatActive = flatCircular.locator(".active-track");
    const renderedStroke = (path: Locator) =>
      path.evaluate((element: SVGPathElement) => {
        const matrix = element.getScreenCTM();
        if (!matrix) throw new Error("Missing thickness example SVG transform");
        return Number(element.getAttribute("stroke-width")) * Math.hypot(matrix.a, matrix.b);
      });

    await expect(display).toHaveText("4px");
    await expect(flatActive).toHaveAttribute("stroke-width", "4");
    const initialFlatStroke = await renderedStroke(flatActive);

    for (const [key, thickness] of [
      ["End", 12],
      ["Home", 1],
    ] as const) {
      await thumb.press(key);
      await expect(display).toHaveText(`${thickness}px`);
      await expect(thumb).toHaveAttribute("aria-valuetext", `${thickness} pixels`);
      await expect(flatLinear.locator(".primary")).toHaveCSS("height", `${thickness}px`);

      for (const path of [
        wavyLinear.locator(".wave-path"),
        wavyCircular.locator(".active-track path"),
        wavyCircular.locator("path.track"),
      ]) {
        await expect(path).toHaveAttribute("stroke-width", `${thickness}`);
        await expect.poll(() => renderedStroke(path)).toBeCloseTo(thickness, 2);
      }

      await expect(flatActive).toHaveAttribute("stroke-width", `${thickness}`);
      await expect(flatCircular.locator(".track")).toHaveAttribute("stroke-width", `${thickness}`);
      const flatStroke = await renderedStroke(flatActive);
      if (thickness > 4) {
        expect(flatStroke).toBeGreaterThan(initialFlatStroke);
      } else {
        expect(flatStroke).toBeLessThan(initialFlatStroke);
      }

      expect(await demo.evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
    }
  }
}
