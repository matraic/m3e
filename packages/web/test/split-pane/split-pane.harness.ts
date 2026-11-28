import type { Page } from "@playwright/test";

type SplitPaneElement = HTMLElement & {
  collapse(): void;
  expand(): void;
  snapToValue(value: number): void;
  value: number;
};

export class SplitPaneHarness {
  html = "";
  direction: "ltr" | "rtl" = "ltr";
  reducedMotion: "reduce" | "no-preference" = "reduce";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get pane() {
    return this.page.locator("m3e-split-pane").first();
  }

  get handle() {
    return this.page.getByRole("separator").first();
  }

  prepare(attributes = "", options: { start?: boolean; end?: boolean; direction?: "ltr" | "rtl" } = {}) {
    this.direction = options.direction ?? "ltr";
    const start = options.start === false ? "" : '<div slot="start">Start</div>';
    const end = options.end === false ? "" : '<div slot="end">End</div>';
    this.html = `<div style="width: 400px; height: 200px">
      <m3e-split-pane style="width: 100%; height: 100%" ${attributes}>${start}${end}</m3e-split-pane>
    </div>`;
  }

  prepareForm(value: number, disabled = false) {
    this.direction = "ltr";
    this.html = `<form><fieldset${disabled ? " disabled" : ""}>
      <div style="width: 400px; height: 200px">
        <m3e-split-pane style="width: 100%; height: 100%" name="split" value="${value}">
          <div slot="start">Start</div>
          <div slot="end">End</div>
        </m3e-split-pane>
      </div>
    </fieldset></form>`;
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: this.reducedMotion });
    await this.renderFixture(this.html, this.direction);
  }

  async renderWithMotion() {
    this.reducedMotion = "no-preference";
    await this.render();
  }

  value() {
    return this.pane.evaluate((element) => (element as SplitPaneElement).value);
  }

  setValue(value: number) {
    return this.pane.evaluate((element, value) => {
      (element as SplitPaneElement).value = value;
    }, value);
  }

  setAttribute(name: string, value: string) {
    return this.pane.evaluate((element, input) => element.setAttribute(input.name, input.value), { name, value });
  }

  recordResizeEvents() {
    return this.pane.evaluate((element) => {
      const state = window as typeof window & { splitPaneEvents: string[]; splitPaneChanges: number };
      state.splitPaneEvents = [];
      state.splitPaneChanges = 0;
      for (const type of ["beforeinput", "input", "change"]) {
        element.addEventListener(type, () => {
          state.splitPaneEvents.push(type);
          if (type === "change") state.splitPaneChanges++;
        });
      }
    });
  }

  cancelBeforeInput() {
    return this.pane.evaluate((element) => element.addEventListener("beforeinput", (event) => event.preventDefault()));
  }

  resizeEvents() {
    return this.page.evaluate(() => (window as typeof window & { splitPaneEvents: string[] }).splitPaneEvents);
  }

  changeCount() {
    return this.page.evaluate(() => (window as typeof window & { splitPaneChanges: number }).splitPaneChanges);
  }

  async press(...keys: string[]) {
    await this.handle.focus();
    for (const key of keys) {
      await this.page.keyboard.press(key);
      await this.pane.evaluate(
        (element) => (element as HTMLElement & { updateComplete: Promise<boolean> }).updateComplete,
      );
    }
  }

  async dragBy(dx: number, dy = 0) {
    const box = await this.handle.boundingBox();
    if (!box) throw new Error("Missing split-pane handle bounds");
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.mouse.move(x + dx, y + dy, { steps: 5 });
    await this.page.mouse.up();
  }

  hidePane(slot: "start" | "end") {
    return this.page.locator(`[slot=${slot}]`).evaluate((element) => element.setAttribute("hidden", ""));
  }

  restorePane(slot: "start" | "end") {
    return this.page.locator(`[slot=${slot}]`).evaluate((element) => element.removeAttribute("hidden"));
  }

  setDisabled(disabled: boolean) {
    return this.pane.evaluate((element, disabled) => element.toggleAttribute("disabled", disabled), disabled);
  }

  addEndPane() {
    return this.pane.evaluate((element) => {
      const pane = document.createElement("div");
      pane.slot = "end";
      pane.textContent = "Added end";
      element.append(pane);
    });
  }

  snapToValue(value: number) {
    return this.pane.evaluate((element, value) => (element as SplitPaneElement).snapToValue(value), value);
  }

  collapseAndExpand() {
    return this.pane.evaluate((element) => {
      const pane = element as SplitPaneElement;
      pane.collapse();
      pane.expand();
    });
  }

  formValue(name: string) {
    return this.page.locator("form").evaluate((form, name) => new FormData(form as HTMLFormElement).get(name), name);
  }

  resetForm() {
    return this.page.locator("form").evaluate((form) => (form as HTMLFormElement).reset());
  }

  setViewport(width: number) {
    return this.page.setViewportSize({ width, height: 800 });
  }

  snapAnimationRunning() {
    return this.pane.evaluate((element) =>
      element.shadowRoot
        ?.querySelector(".base")
        ?.getAnimations()
        .some((animation) => animation.playState === "running"),
    );
  }
}
