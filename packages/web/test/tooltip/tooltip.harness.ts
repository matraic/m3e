import type { Page } from "@playwright/test";

export type Tooltip = HTMLElement & {
  isOpen: boolean;
  disabled: boolean;
  position: string;
  touchGestures: string;
  showDelay: number;
  hideDelay: number;
  show(): Promise<void>;
  hide(): void;
};

export class TooltipHarness {
  html = "";
  kind: "standard" | "rich" = "standard";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get tooltip() {
    return this.page.locator(this.kind === "standard" ? "m3e-tooltip" : "m3e-rich-tooltip").first();
  }

  get control() {
    return this.page.locator("#btn");
  }

  markup(kind: string, attributes = "", content = "Tooltip text", controlAttributes = "") {
    if (kind !== "standard" && kind !== "rich") throw new Error(`Unknown tooltip kind: ${kind}`);
    this.kind = kind;
    const tag = kind === "standard" ? "m3e-tooltip" : "m3e-rich-tooltip";
    return `<button id="btn" ${controlAttributes} style="margin: 200px">Target</button>
      <${tag} for="btn" ${attributes}>${content}</${tag}>`;
  }

  interactive(actionAttributes = "", controlAttributes = "") {
    return this.markup(
      "rich",
      "",
      `<span slot="subhead">Subhead</span>Supporting text
      <m3e-button slot="actions"><m3e-rich-tooltip-action ${actionAttributes}>Done</m3e-rich-tooltip-action></m3e-button>`,
      controlAttributes,
    );
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(this.html);
  }

  async isOpen() {
    return this.tooltip.evaluate((element) => (element as Tooltip).isOpen);
  }

  async popoverOpen() {
    return this.tooltip.evaluate((element) => {
      const base = element.shadowRoot?.querySelector(".base");
      if (!base) throw new Error("Missing tooltip popover");
      return base.matches(":popover-open");
    });
  }
}
