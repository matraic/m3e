import type { Page } from "@playwright/test";
import type { M3eSegmentedButtonElement } from "@m3e/web/segmented-button";

interface Segment {
  label: string;
  value: string;
  attributes: string[];
  icon: boolean;
}

const single = [
  ["Small", "s"],
  ["Medium", "m"],
  ["Large", "l"],
];
const multi = [
  ["Alpha", "a"],
  ["Beta", "b"],
  ["Gamma", "c"],
];

export class SegmentedButtonHarness {
  label = "Size";
  name = "size";
  groupAttributes: string[] = [];
  segments: Segment[] = [];
  form = false;
  direction: "ltr" | "rtl" | undefined;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {
    this.prepare(false, "Size");
  }

  get group() {
    return this.page.locator("m3e-segmented-button");
  }

  get formElement() {
    return this.page.locator("form");
  }

  segment(label: string) {
    return this.page.locator("m3e-button-segment", { hasText: label });
  }

  prepare(multiple: boolean, label: string) {
    this.label = label;
    this.name = label.toLowerCase();
    this.groupAttributes = multiple ? ["multi"] : [];
    this.segments = (multiple ? multi : single).map(([text, value]) => ({
      label: text,
      value,
      attributes: [],
      icon: false,
    }));
  }

  setGroupAttribute(attribute: string) {
    this.groupAttributes.push(attribute);
  }

  setSegmentAttribute(label: string, attribute: string) {
    this.find(label).attributes.push(attribute);
  }

  giveIcon(label: string) {
    this.find(label).icon = true;
  }

  async render() {
    const segments = this.segments
      .map(
        (x) =>
          `<m3e-button-segment value="${x.value}" ${x.attributes.join(" ")}>${
            x.icon ? '<m3e-icon slot="icon" name="palette"></m3e-icon>' : ""
          }${x.label}</m3e-button-segment>`,
      )
      .join("");
    const group = `<m3e-segmented-button name="${this.name}" aria-label="${this.label}" ${this.groupAttributes.join(" ")}>${segments}</m3e-segmented-button>`;
    const content = this.form ? `<form>${group}</form>` : group;
    await this.renderFixture(`<button>Before</button>${content}<button>After</button>`, this.direction);
  }

  value() {
    return this.group.evaluate((group) => (group as M3eSegmentedButtonElement).value);
  }

  isSelected(label: string) {
    return this.segment(label).evaluate((segment) => (segment as HTMLInputElement).checked);
  }

  check(label: string) {
    return this.segment(label).evaluate((segment) => ((segment as HTMLInputElement).checked = true));
  }

  add(label: string, value: string, checked: boolean) {
    return this.group.evaluate(
      (group, [label, value, checked]) => {
        const segment = document.createElement("m3e-button-segment");
        segment.setAttribute("value", value as string);
        segment.toggleAttribute("checked", checked as boolean);
        segment.textContent = label as string;
        group.append(segment);
      },
      [label, value, checked] as const,
    );
  }

  remove(label: string) {
    return this.segment(label).evaluate((segment) => segment.remove());
  }

  toggleGroupAttribute(attribute: string, present: boolean) {
    return this.group.evaluate(
      (group, [attribute, present]) => group.toggleAttribute(attribute as string, present as boolean),
      [attribute, present] as const,
    );
  }

  setSegmentDisabled(label: string, disabled: boolean) {
    return this.segment(label).evaluate(
      (segment, disabled) => ((segment as HTMLInputElement).disabled = disabled),
      disabled,
    );
  }

  recordEvents(types: string[]) {
    return this.group.evaluate((group, types) => {
      const events: string[] = [];
      (window as unknown as { segmentEvents: string[] }).segmentEvents = events;
      for (const type of types) {
        group.addEventListener(type, () => events.push(type));
      }
    }, types);
  }

  events() {
    return this.page.evaluate(() => (window as unknown as { segmentEvents: string[] }).segmentEvents.join(","));
  }

  cancelBeforeInput() {
    return this.group.evaluate((group) => group.addEventListener("beforeinput", (e) => e.preventDefault()));
  }

  formValues(name: string) {
    return this.formElement.evaluate((form, name) => new FormData(form as HTMLFormElement).getAll(name), name);
  }

  resetForm() {
    return this.formElement.evaluate((form) => (form as HTMLFormElement).reset());
  }

  readRadius(label: string, side: "start" | "end") {
    return this.segment(label).evaluate((segment, side) => {
      const style = getComputedStyle(segment);
      return side === "start" ? style.borderStartStartRadius : style.borderStartEndRadius;
    }, side);
  }

  readDivider(label: string) {
    return this.segment(label).evaluate((segment) =>
      (segment as HTMLElement).style.getPropertyValue("--_segmented-button-disabled-outline-color"),
    );
  }

  private find(label: string) {
    return this.segments.find((x) => x.label === label)!;
  }
}
