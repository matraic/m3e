import type { Page } from "@playwright/test";

export class SkeletonHarness {
  html = "";
  reducedMotion: "reduce" | "no-preference" = "no-preference";
  forcedColors: "active" | "none" = "none";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get skeleton() {
    return this.page.locator("m3e-skeleton");
  }

  get shapes() {
    return this.skeleton.locator(".shape");
  }

  get button() {
    return this.page.getByRole("button", { name: "Action", exact: true, includeHidden: true });
  }

  async render() {
    await this.page.emulateMedia({
      reducedMotion: this.reducedMotion,
      forcedColors: this.forcedColors,
    });
    await this.renderFixture(this.html);
  }

  setAttribute(name: string, value = "") {
    return this.skeleton.evaluate((skeleton, input) => skeleton.toggleAttribute(input.name, input.value !== "remove"), {
      name,
      value,
    });
  }

  removeAttribute(name: string) {
    return this.skeleton.evaluate((skeleton, name) => skeleton.removeAttribute(name), name);
  }

  animationCount() {
    return this.skeleton.evaluate((skeleton) => skeleton.getAnimations().length);
  }

  animationState() {
    return this.skeleton.evaluate((skeleton) => skeleton.getAnimations().map((animation) => animation.playState));
  }

  shapeCount() {
    return this.shapes.count();
  }

  shapeCSS(name: string) {
    return this.shapes.first().evaluate((shape, name) => getComputedStyle(shape).getPropertyValue(name), name);
  }

  shapeBox() {
    return this.shapes.first().boundingBox();
  }

  addSlottedElement(width = 100, height = 20) {
    return this.skeleton.evaluate(
      (skeleton, input) => {
        const element = document.createElement("div");
        element.textContent = "Added";
        element.style.width = `${input.width}px`;
        element.style.height = `${input.height}px`;
        skeleton.append(element);
      },
      { width, height },
    );
  }

  removeLastSlottedElement() {
    return this.skeleton.evaluate((skeleton) => skeleton.lastElementChild?.remove());
  }

  resizeSlottedElement(width: number) {
    return this.skeleton
      .locator("xpath=./*")
      .first()
      .evaluate((element, width) => {
        (element as HTMLElement).style.width = `${width}px`;
      }, width);
  }

  move() {
    return this.skeleton.evaluate((skeleton) => {
      skeleton.remove();
      document.body.append(skeleton);
    });
  }

  setMotionPreference(motion: "reduce" | "no-preference") {
    return this.page.emulateMedia({ reducedMotion: motion });
  }

  setForcedColors(colors: "active" | "none") {
    return this.page.emulateMedia({ forcedColors: colors });
  }

  recordClick() {
    return this.button.evaluate((button) => {
      const state = window as typeof window & { skeletonClicks: number };
      state.skeletonClicks = 0;
      button.addEventListener("click", () => state.skeletonClicks++);
    });
  }

  clickCount() {
    return this.page.evaluate(() => (window as typeof window & { skeletonClicks: number }).skeletonClicks);
  }
}
