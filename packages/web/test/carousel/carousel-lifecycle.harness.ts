import type { M3eCarouselElement, M3eCarouselGridElement } from "@m3e/web/carousel";
import type { Page } from "@playwright/test";

export class CarouselLifecycleHarness {
  tag = "m3e-carousel";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get host() {
    return this.page.locator(this.tag);
  }

  action(name: string) {
    return this.host.getByRole("button", { name, exact: true });
  }

  async show() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(`
      <${this.tag} aria-label="Destinations"
        style="width:520px; --m3e-carousel-grid-item-min-width:200px">
        ${Array.from({ length: 4 }, (_, i) => `<m3e-carousel-item>Item ${i + 1}</m3e-carousel-item>`).join("")}
      </${this.tag}>
    `);
  }

  selectItem(number: number) {
    return this.host.evaluate((element: M3eCarouselElement | M3eCarouselGridElement, index) => {
      element.selectedIndex = index;
    }, number - 1);
  }

  observeChanges() {
    return this.host.evaluate((element) => {
      element.dataset.lifecycleChanges = "0";
      element.addEventListener("change", () => {
        element.dataset.lifecycleChanges = String(Number(element.dataset.lifecycleChanges) + 1);
      });
    });
  }

  move() {
    return this.host.evaluate((element) => {
      const parent = document.createElement("div");
      parent.id = "lifecycle-parent";
      document.body.append(parent);
      parent.append(element);
    });
  }

  resize(width: number) {
    return this.host.evaluate((element: HTMLElement, value) => {
      element.style.width = `${value}px`;
    }, width);
  }

  readItemDimensions() {
    return this.host.locator("m3e-carousel-item").evaluateAll((items) =>
      items.map((item) => {
        const bounds = item.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      }),
    );
  }
}
