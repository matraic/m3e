import type { M3eTextareaAutosizeElement } from "@m3e/web/textarea-autosize";
import type { Page } from "@playwright/test";

export const lineHeight = 20;
export const lines = (count: number) => Array.from({ length: count }, (_, index) => `line ${index}`).join("\n");

export function textareaFixture(attrs = "", value = "", textareaAttrs = "") {
  return `<style>
    textarea { width: 200px; font: 16px/${lineHeight}px monospace; padding: 0; border: 0; margin: 0; box-sizing: content-box; display: block; }
  </style>
  <label for="t">Notes</label><textarea id="t" rows="1" ${textareaAttrs}>${value}</textarea>
  <m3e-textarea-autosize id="autosize" for="t" ${attrs}></m3e-textarea-autosize>`;
}

export class TextareaAutosizeHarness {
  markup = "";
  previousHeight = 0;
  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}
  get textarea() {
    return this.page.locator("#t");
  }
  get helper() {
    return this.page.locator("m3e-textarea-autosize");
  }
  show() {
    return this.renderFixture(this.markup);
  }
  height() {
    return this.textarea.evaluate((element) => element.getBoundingClientRect().height);
  }
  call(method: "reset" | "resizeToFitContent") {
    return this.helper.evaluate((element: M3eTextareaAutosizeElement, name) => element[name](), method);
  }
}
