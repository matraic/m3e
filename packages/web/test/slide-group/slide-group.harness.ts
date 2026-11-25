import type { Page } from "@playwright/test";

import { expect } from "../fixtures";

export class SlideGroupHarness {
  count = 10;
  width = 300;
  height = 150;
  itemWidth = 100;
  direction: "ltr" | "rtl" = "ltr";
  attributes = new Map<string, string>();
  customIcons = false;
  focusableItems = false;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get group() {
    return this.page.locator("m3e-slide-group");
  }

  get content() {
    return this.group.locator(".content");
  }

  get previous() {
    return this.group.getByRole("button", { name: "Previous page", exact: true });
  }

  get next() {
    return this.group.getByRole("button", { name: "Next page", exact: true });
  }

  async render() {
    const attributes = [...this.attributes].map(([key, value]) => `${key}="${value}"`).join(" ");
    const tag = this.focusableItems ? "button" : "div";
    const items = Array.from(
      { length: this.count },
      (_, i) =>
        `<${tag} style="flex: none; box-sizing: border-box; width: ${this.itemWidth}px; height: 40px">Item ${i + 1}</${tag}>`,
    ).join("");
    await this.renderFixture(
      `<button id="before">Before group</button>
       <div id="first"><m3e-slide-group style="width: ${this.width}px; height: ${this.height}px" ${attributes}>
         ${items}
         ${this.customIcons ? '<span slot="prev-icon">Back icon</span><span slot="next-icon">Forward icon</span>' : ""}
       </m3e-slide-group></div><div id="second"></div>
       <button id="after">After group</button>`,
      this.direction,
    );
  }

  metrics() {
    return this.content.evaluate((content) => {
      const root = content.getRootNode();
      const vertical = root instanceof ShadowRoot && root.host.hasAttribute("vertical");
      return {
        position: vertical ? content.scrollTop : Math.abs(content.scrollLeft),
        extent: vertical ? content.clientHeight : content.clientWidth,
        max: vertical ? content.scrollHeight - content.clientHeight : content.scrollWidth - content.clientWidth,
        crossPosition: vertical ? content.scrollLeft : content.scrollTop,
      };
    });
  }

  async pageOnce(direction: "next" | "previous") {
    const button = direction === "next" ? this.next : this.previous;
    await expect(button).toBeEnabled();
    const { position, extent, max } = await this.metrics();
    const threshold = Number((await this.group.getAttribute("threshold")) ?? 0);
    let target = direction === "next" ? Math.min(position + extent, max) : Math.max(position - extent, 0);
    if (direction === "next" && target >= max - threshold) target = max;
    if (direction === "previous" && target <= threshold) target = 0;
    await button.click();
    await expect.poll(async () => Math.abs((await this.metrics()).position - target)).toBeLessThan(1);
  }

  async pageToEnd() {
    await expect(this.next).toBeEnabled();
    const { position, max, extent } = await this.metrics();
    for (let i = 0; i < Math.ceil((max - position) / extent); i++) {
      await this.pageOnce("next");
    }
    await expect(this.next).toBeDisabled();
  }

  setAttribute(name: string, value: string) {
    return this.group.evaluate((group, { name, value }) => group.setAttribute(name, value), { name, value });
  }

  resize(width: number) {
    return this.group.evaluate((group, width) => (group.style.width = `${width}px`), width);
  }

  setItemCount(count: number) {
    return this.group.evaluate((group, count) => {
      const template = group.querySelector<HTMLElement>(":scope > :not([slot])")!;
      while (group.children.length > count) group.lastElementChild!.remove();
      while (group.children.length < count) {
        const item = template.cloneNode(true) as HTMLElement;
        item.textContent = `Item ${group.children.length + 1}`;
        group.append(item);
      }
    }, count);
  }

  move() {
    return this.group.evaluate((group) => {
      document.querySelector("#second")!.append(group);
      document.querySelector("#first")!.append(group);
    });
  }
}
