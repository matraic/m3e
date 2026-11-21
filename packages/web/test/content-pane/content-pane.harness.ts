import type { Page } from "@playwright/test";

export class ContentPaneHarness {
  markup = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get pane() {
    return this.page.locator("m3e-content-pane");
  }

  get scroller() {
    return this.pane.locator(".scroll-container");
  }

  get surface() {
    return this.pane.locator(".base");
  }

  show() {
    if (!this.markup) throw new Error("Content pane markup is missing.");
    return this.renderFixture(this.markup);
  }

  scrollTo(top: number) {
    return this.scroller.evaluate((scroller: HTMLElement, value) => {
      scroller.scrollTop = value;
    }, top);
  }

  scrollMetrics() {
    return this.scroller.evaluate((scroller: HTMLElement) => ({
      scrollTop: scroller.scrollTop,
      scrollHeight: scroller.scrollHeight,
      clientHeight: scroller.clientHeight,
      scrollWidth: scroller.scrollWidth,
      clientWidth: scroller.clientWidth,
    }));
  }

  overflow() {
    return this.scroller.evaluate((scroller) => {
      const style = getComputedStyle(scroller);
      return [style.overflowY, style.overflowX];
    });
  }

  moveToNewParent(scrollbarWidth?: string) {
    return this.pane.evaluate((pane, width) => {
      document.getElementById("content-pane-new-parent")?.removeAttribute("id");
      const parent = document.createElement("div");
      parent.id = "content-pane-new-parent";
      if (width) parent.style.setProperty("--m3e-scrollbar-thin-width", width);
      document.body.append(parent);
      parent.append(pane);
    }, scrollbarWidth);
  }

  buttonIsWithinScroller() {
    return this.pane.evaluate((pane) => {
      const scroller = pane.shadowRoot?.querySelector(".scroll-container");
      const button = pane.querySelector("button");
      if (!scroller || !button) throw new Error("Content pane scroller or button is missing.");
      const bounds = scroller.getBoundingClientRect();
      const buttonBounds = button.getBoundingClientRect();
      return buttonBounds.top >= bounds.top && buttonBounds.bottom <= bounds.bottom;
    });
  }

  replaceContent() {
    return this.pane.evaluate((pane) => {
      const content = pane.querySelector("p");
      if (!content) throw new Error("Original document content is missing.");
      const replacement = document.createElement("p");
      replacement.textContent = "Replacement document content";
      content.replaceWith(replacement);
    });
  }
}
