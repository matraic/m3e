import type { Page } from "@playwright/test";
import type { M3eLoadingIndicatorElement } from "@m3e/web/loading-indicator";

import { expect } from "../fixtures";

const tokens = [
  "--m3e-loading-indicator-active-indicator-size: 30px",
  "--m3e-loading-indicator-container-size: 60px",
  "--m3e-loading-indicator-active-indicator-color: rgb(0, 0, 255)",
  "--m3e-loading-indicator-contained-active-indicator-color: rgb(0, 128, 0)",
  "--m3e-loading-indicator-contained-container-color: rgb(255, 0, 0)",
].join("; ");

export class LoadingIndicatorHarness {
  html = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get indicator() {
    return this.page.locator("m3e-loading-indicator");
  }

  get progressbar() {
    return this.page.getByRole("progressbar");
  }

  prepare(attributes = "") {
    this.html = `<div id="host"><m3e-loading-indicator ${attributes} style="${tokens}"></m3e-loading-indicator></div>`;
  }

  preparePullTarget() {
    this.html = `<div id="pull-target" style="width: 200px; height: 300px; touch-action: none">
      <m3e-loading-indicator aria-label="Refreshing" variant="contained" style="${tokens}"></m3e-loading-indicator>
    </div>
    <m3e-pan-gesture for="pull-target" lock-axis="y"></m3e-pan-gesture>`;
  }

  trackPanGesture() {
    return this.page.evaluate(() => {
      const indicator = document.querySelector<M3eLoadingIndicatorElement>("m3e-loading-indicator")!;
      document.querySelector("m3e-pan-gesture")!.addEventListener("gesture", (e) => {
        const { phase, totalDeltaY } = (e as CustomEvent<{ phase: string; totalDeltaY: number }>).detail;
        if (phase === "start") indicator.pullProgress = 0;
        else if (phase === "update") indicator.pullProgress = Math.max(0, totalDeltaY / 120);
        else indicator.pullProgress = null;
      });
    });
  }

  async dragDown(distance: number) {
    const box = (await this.page.locator("#pull-target").boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + 20;
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.mouse.move(x, y + distance, { steps: 12 });
  }

  cancelPull() {
    return this.page.locator("#pull-target").dispatchEvent("pointercancel", { pointerId: 1, pointerType: "mouse" });
  }

  async render() {
    await this.renderFixture(this.html);
  }

  animationCount() {
    return this.indicator.evaluate((element) => element.shadowRoot!.getAnimations().length);
  }

  async expectAnimating(animating: boolean) {
    if (animating) {
      await expect.poll(() => this.animationCount()).toBeGreaterThan(0);
    } else {
      await expect.poll(() => this.animationCount()).toBe(0);
    }
  }

  setAttribute(name: string, value: string) {
    return this.indicator.evaluate((element, [n, v]) => element.setAttribute(n, v), [name, value]);
  }

  setPullProgress(value: number | null) {
    return this.indicator.evaluate((element: M3eLoadingIndicatorElement, v) => (element.pullProgress = v), value);
  }

  reconnect() {
    return this.indicator.evaluate((element) => {
      const parent = element.parentElement!;
      element.remove();
      parent.append(element);
    });
  }

  /** The visual rotation of the indicator in degrees, normalized to [0, 360). */
  rotation() {
    return this.indicator.locator(".active-indicator-wrapper").evaluate((element) => {
      const matrix = new DOMMatrixReadOnly(getComputedStyle(element).transform);
      return Math.round(((Math.atan2(matrix.b, matrix.a) * 180) / Math.PI + 360) % 360);
    });
  }

  forcedActiveIndicatorUsesCanvasText() {
    return this.indicator.evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.color = "CanvasText";
      document.body.append(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      const indicator = element.shadowRoot!.querySelector(".active-indicator")!;
      return getComputedStyle(indicator).backgroundColor === expected;
    });
  }
}
