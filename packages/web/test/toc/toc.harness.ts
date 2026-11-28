import type { M3eTocItemElement } from "@m3e/web/toc";
import type { Page } from "@playwright/test";

export function tocFixture() {
  return `<m3e-toc id="toc" for="content"></m3e-toc>
    <div id="content" style="height: 200px; overflow: auto; position: relative">
      <h2>Intro</h2><p style="height: 300px">text</p>
      <h3>Install</h3><p style="height: 300px">text</p>
      <h4>Deep</h4><p style="height: 300px">text</p>
      <h2>API</h2><p style="height: 600px">text</p>
    </div>`;
}

export class TocHarness {
  markup = "";
  outerScroll = 0;
  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}
  get toc() {
    return this.page.locator("m3e-toc");
  }
  get items() {
    return this.toc.locator("m3e-toc-item");
  }
  show() {
    return this.renderFixture(this.markup);
  }
  labels() {
    return this.items.evaluateAll((items) =>
      items.map((item) => ({
        text: item.textContent?.trim() ?? "",
        level: (item as M3eTocItemElement).node?.level,
      })),
    );
  }
  current() {
    return this.items.evaluateAll(
      (items) => items.find((item) => item.ariaCurrent === "true")?.textContent?.trim() ?? null,
    );
  }
}
