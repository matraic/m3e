import type { Page } from "@playwright/test";

export class ShapeHarness {
  html = "";
  previousClipPath = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get shape() {
    return this.page.locator("m3e-shape");
  }

  get wrapper() {
    return this.shape.locator(".wrapper");
  }

  render() {
    return this.renderFixture(this.html);
  }

  clipPath() {
    return this.wrapper.evaluate((wrapper) => getComputedStyle(wrapper).clipPath);
  }

  clipPaths() {
    return this.page
      .locator("m3e-shape .wrapper")
      .evaluateAll((wrappers) => wrappers.map((wrapper) => getComputedStyle(wrapper).clipPath));
  }

  async changeName(name: string) {
    this.previousClipPath = await this.clipPath();
    await this.shape.evaluate((shape, value) => shape.setAttribute("name", value), name);
  }
}
