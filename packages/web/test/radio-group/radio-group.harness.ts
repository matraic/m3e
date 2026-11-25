import type { Page } from "@playwright/test";
import type { M3eRadioGroupElement } from "@m3e/web/radio-group";

const values: Record<string, string> = { Small: "s", Medium: "m", Large: "l" };

export class RadioGroupHarness {
  private label = "";
  private readonly radioAttributes = new Map<string, string[]>();
  private readonly groupAttributes: string[] = [];
  private wrapped = false;
  private form = false;
  private standalone = "";
  direction: "ltr" | "rtl" | undefined;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get group() {
    return this.page.locator("m3e-radio-group");
  }

  get radios() {
    return this.page.locator("m3e-radio");
  }

  radio(name: string) {
    return this.page.getByRole("radio", { name, exact: true });
  }

  prepare(label: string) {
    this.label = label;
  }

  prepareStandalone(name: string) {
    this.standalone = `<m3e-radio name="${name}" value="cat">Cat</m3e-radio><m3e-radio name="${name}" value="dog">Dog</m3e-radio>`;
  }

  setRadioAttribute(name: string, attribute: string) {
    this.radioAttributes.set(name, [...(this.radioAttributes.get(name) ?? []), attribute]);
  }

  setGroupAttribute(attribute: string) {
    this.groupAttributes.push(attribute);
  }

  wrapRadios() {
    this.wrapped = true;
  }

  insideForm() {
    this.form = true;
  }

  async render() {
    let content = this.standalone;
    if (!content) {
      const radios = Object.entries(values).map(([name, value]) => {
        const attributes = (this.radioAttributes.get(name) ?? []).join(" ");
        return this.wrapped
          ? `<label><m3e-radio value="${value}" ${attributes}></m3e-radio> ${name}</label>`
          : `<m3e-radio value="${value}" ${attributes}>${name}</m3e-radio>`;
      });
      content = `<m3e-radio-group name="${this.label.toLowerCase()}" aria-label="${this.label}" ${this.groupAttributes.join(" ")}>${radios.join("")}</m3e-radio-group>`;
    }
    const body = `<button id="before">Before</button>${content}<button id="after">After</button>`;
    await this.renderFixture(this.form ? `<form>${body}</form>` : body, this.direction);
  }

  value() {
    return this.group.evaluate((element) => (element as M3eRadioGroupElement).value);
  }

  add(label: string, value: string, checked: boolean) {
    return this.group.evaluate(
      (group, [label, value, checked]) => {
        const radio = document.createElement("m3e-radio");
        radio.setAttribute("value", value as string);
        radio.toggleAttribute("checked", checked as boolean);
        radio.textContent = label as string;
        group.append(radio);
      },
      [label, value, checked] as const,
    );
  }

  names() {
    return this.radios.evaluateAll((radios) => radios.map((radio) => (radio as HTMLInputElement).name));
  }

  recordEvents() {
    return this.group.evaluate((group) => {
      const events: string[] = [];
      (window as unknown as { events: string[] }).events = events;
      for (const type of ["beforeinput", "input", "change"]) {
        group.addEventListener(type, () => events.push(type));
      }
    });
  }

  cancelBeforeInput() {
    return this.group.evaluate((group) => group.addEventListener("beforeinput", (event) => event.preventDefault()));
  }

  events() {
    return this.page.evaluate(() => (window as unknown as { events: string[] }).events.join(", "));
  }

  async tabIntoGroup() {
    await this.page.locator("#before").focus();
    await this.page.keyboard.press("Tab");
  }

  formValue(name: string) {
    return this.page.locator("form").evaluate((form, name) => new FormData(form as HTMLFormElement).get(name), name);
  }

  isValid() {
    return this.group.evaluate((group) => (group as HTMLInputElement).checkValidity());
  }

  states(...states: string[]) {
    return this.radios.evaluateAll(
      (radios, states) => radios.map((radio) => states.every((state) => radio.matches(`:state(${state})`))),
      states,
    );
  }

  markTouchedAndDirty(active: boolean) {
    return this.group.evaluate((element, active) => {
      const group = element as M3eRadioGroupElement;
      if (active) {
        group.markAsTouched();
        group.markAsDirty();
      } else {
        group.markAsUntouched();
        group.markAsPristine();
      }
    }, active);
  }

  async isDrawnWith(name: string, color: string) {
    return this.radio(name).evaluate((radio, color) => {
      const probe = document.createElement("span");
      probe.style.color = color;
      document.body.append(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      const actual = getComputedStyle(radio.shadowRoot!.querySelector(".base")!).color;
      return { actual, expected };
    }, color);
  }
}
