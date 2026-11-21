import type { M3eCardElement } from "@m3e/web/card";
import type { Page } from "@playwright/test";

export class CardHarness {
  markup = "<m3e-card>Card content</m3e-card>";
  styles = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get card() {
    return this.page.locator("m3e-card").last();
  }

  get surface() {
    return this.card.locator(".base");
  }

  show() {
    return this.renderFixture(`${this.styles ? `<style>${this.styles}</style>` : ""}${this.markup}`);
  }

  readVariant() {
    return this.card.evaluate((element: M3eCardElement) => element.variant);
  }

  readOrientation() {
    return this.card.evaluate((element: M3eCardElement) => element.orientation);
  }

  readInline() {
    return this.card.evaluate((element: M3eCardElement) => element.inline);
  }

  setAttribute(name: string, value: string) {
    return this.card.evaluate(
      (element, attribute) => {
        element.setAttribute(attribute.name, attribute.value);
      },
      { name, value },
    );
  }

  removeAttribute(name: string) {
    return this.card.evaluate((element, attribute) => element.removeAttribute(attribute), name);
  }

  setStyle(name: string, value: string) {
    return this.card.evaluate(
      (element: HTMLElement, property) => {
        element.style.setProperty(property.name, property.value);
      },
      { name, value },
    );
  }

  removeStyle(name: string) {
    return this.card.evaluate((element: HTMLElement, property) => element.style.removeProperty(property), name);
  }

  observeClicks() {
    return this.page.evaluate(() => {
      document.body.dataset.cardClicks = "0";
      document.body.addEventListener("click", (event) => {
        if (event.target instanceof Element && event.target.closest("m3e-card")) {
          document.body.dataset.cardClicks = String(Number(document.body.dataset.cardClicks) + 1);
        }
      });
    });
  }

  readClicks() {
    return this.page.locator("body").getAttribute("data-card-clicks");
  }

  clickProgrammatically() {
    return this.card.evaluate((element: HTMLElement) => element.click());
  }

  removeContent() {
    return this.card.locator('[slot="content"]').evaluate((element) => element.remove());
  }

  moveToNewParent() {
    return this.card.evaluate((element) => {
      const previousParent = document.getElementById("card-new-parent");
      previousParent?.removeAttribute("id");
      const parent = document.createElement("div");
      parent.id = "card-new-parent";
      document.body.append(parent);
      parent.append(element);
    });
  }

  readDisabledColors() {
    return this.surface.evaluate((element) => {
      const probe = document.createElement("span");
      probe.style.color = "GrayText";
      document.body.append(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      const style = getComputedStyle(element);
      return { color: style.color, borderColor: style.borderColor, expected };
    });
  }
}
