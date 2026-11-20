import type { Page } from "@playwright/test";

export class BreadcrumbHarness {
  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get breadcrumb() {
    return this.page.locator("m3e-breadcrumb");
  }

  get items() {
    return this.breadcrumb.locator("m3e-breadcrumb-item");
  }

  item(label: string) {
    return this.items.filter({ hasText: label });
  }

  icon(label: string) {
    return this.item(label).locator("m3e-icon");
  }

  link(label: string) {
    return this.page.getByRole("link", { name: label, exact: true });
  }

  button(label: string) {
    return this.page.getByRole("button", { name: label, exact: true });
  }

  render(html: string) {
    return this.renderFixture(html);
  }

  moveToNewParent() {
    return this.breadcrumb.evaluate((breadcrumb) => {
      const parent = document.createElement("div");
      parent.style.display = "contents";
      breadcrumb.before(parent);
      parent.append(breadcrumb);
    });
  }

  moveItemToEnd(label: string) {
    return this.item(label).evaluate((item) => {
      if (!item.parentElement) throw new Error("Breadcrumb item is detached.");
      item.parentElement.append(item);
    });
  }

  renderManyItems(wrap: boolean) {
    const items = Array.from(
      { length: 12 },
      (_, index) => `<m3e-breadcrumb-item href="/${index}">Section number ${index}</m3e-breadcrumb-item>`,
    ).join("");
    return this.render(`<m3e-breadcrumb ${wrap ? "wrap" : ""} style="width: 300px">${items}</m3e-breadcrumb>`);
  }

  enableWrap() {
    return this.breadcrumb.evaluate((breadcrumb) => breadcrumb.toggleAttribute("wrap", true));
  }

  appendItem(label: string) {
    return this.breadcrumb.evaluate((breadcrumb, text) => {
      const item = document.createElement("m3e-breadcrumb-item");
      item.textContent = text;
      breadcrumb.append(item);
    }, label);
  }

  removeFinalItem() {
    return this.items.last().evaluate((item) => item.remove());
  }

  readLineCount() {
    return this.items.evaluateAll(
      (items) => new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size,
    );
  }

  readCurrentItemIndexes() {
    return this.items.evaluateAll((items) =>
      items.flatMap((item, index) => (item.hasAttribute("current") ? [index] : [])),
    );
  }

  readSeparators() {
    return this.items.evaluateAll((items) =>
      items.flatMap((item) => {
        const separator = item.shadowRoot?.querySelector(".separator");
        return separator
          ? [{ text: separator.textContent?.trim() ?? "", ariaHidden: separator.getAttribute("aria-hidden") }]
          : [];
      }),
    );
  }
}
