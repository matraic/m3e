import type { M3eDialogElement } from "@m3e/web/dialog";
import type { Page } from "@playwright/test";

export class DialogHarness {
  attributes = "";
  title = "Dialog title";
  content = "Dialog content";
  action = "";
  withTrigger = false;
  secondDialog?: "nested" | "separate";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get dialog() {
    return this.page.locator("#dialog");
  }
  get trigger() {
    return this.page.locator("#trigger");
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    const second = '<m3e-dialog id="inner-dialog"><span slot="header">Inner dialog</span>Inner content</m3e-dialog>';
    await this.renderFixture(`
      <m3e-button id="trigger">Open dialog${this.withTrigger ? '<m3e-dialog-trigger for="dialog"></m3e-dialog-trigger>' : ""}</m3e-button>
      <m3e-button id="other-trigger">Other trigger</m3e-button>
      <button id="outside">Outside</button>
      <m3e-dialog id="dialog" ${this.attributes}>
        <span slot="header">${this.title}</span>
        ${this.content}
        ${this.secondDialog === "nested" ? `<button id="inner-trigger">Open inner</button>${second}` : ""}
        ${this.action}
      </m3e-dialog>
      ${this.secondDialog === "separate" ? second : ""}
    `);
    if (this.withTrigger) {
      await this.page.waitForFunction(
        () => document.querySelector("#trigger")?.getAttribute("aria-haspopup") === "dialog",
      );
    }
  }

  show() {
    return this.dialog.evaluate((dialog: M3eDialogElement) => dialog.show());
  }

  hide() {
    return this.dialog.evaluate((dialog: M3eDialogElement) => dialog.hide());
  }
}
