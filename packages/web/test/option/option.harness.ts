import type { Page } from "@playwright/test";

export type OptionState = HTMLElement & {
  value: string;
  label: string;
  isEmpty: boolean;
  selected: boolean;
  disabled: boolean;
  labelReady: Promise<void>;
  valueReady: Promise<void>;
};

export class OptionHarness {
  html = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get group() {
    return this.page.locator("m3e-optgroup");
  }

  get panel() {
    return this.page.locator("m3e-option-panel");
  }

  option(name: string) {
    return this.page.locator("m3e-option", { hasText: name });
  }

  async render() {
    await this.renderFixture(this.html);
  }

  async resolve(name: string) {
    return this.option(name).evaluate(async (element) => {
      const option = element as OptionState;
      await option.labelReady;
      await option.valueReady;
      return { value: option.value, label: option.label };
    });
  }

  setSelected(name: string, selected: boolean) {
    return this.option(name).evaluate((element, selected) => ((element as OptionState).selected = selected), selected);
  }

  setDisabled(name: string, disabled: boolean) {
    return this.option(name).evaluate((element, disabled) => ((element as OptionState).disabled = disabled), disabled);
  }

  countStateChanges() {
    return this.page.evaluate(() => {
      const w = window as unknown as { stateChanges: number };
      w.stateChanges = 0;
      document.getElementById("host")!.addEventListener("state-change", () => w.stateChanges++);
    });
  }

  stateChanges() {
    return this.page.evaluate(() => (window as unknown as { stateChanges: number }).stateChanges);
  }

  isEmpty(name: string) {
    return this.option(name).evaluate((element) => ({
      property: (element as OptionState).isEmpty,
      state: element.matches(":state(--empty)"),
    }));
  }

  marks(name: string) {
    return this.option(name).evaluate((element) => {
      const first = element.matches(":state(--first)");
      const last = element.matches(":state(--last)");
      return first && last ? "first and last" : first ? "first" : last ? "last" : "neither";
    });
  }

  isDisabledPart(name: string, part: "m3e-text-highlight" | "m3e-state-layer") {
    return this.option(name)
      .locator(part)
      .evaluate((element) => element.hasAttribute("disabled"));
  }

  appendOption(name: string) {
    return this.panel.evaluate((panel, name) => {
      const option = document.createElement("m3e-option");
      option.textContent = name;
      panel.appendChild(option);
    }, name);
  }
}
