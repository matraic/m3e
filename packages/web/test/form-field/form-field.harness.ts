import type { Page } from "@playwright/test";

export class FormFieldHarness {
  html = "";
  floatingFontSize = "";
  notchWidth = 0;
  nativeValidationMessage = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get field() {
    return this.page.locator("m3e-form-field").first();
  }

  get control() {
    return this.field.locator("input").first();
  }

  markup(label: string, fieldAttributes = "", inputAttributes = "", content = "") {
    return `<m3e-form-field ${fieldAttributes}>
      <label slot="label" for="field-control">${label}</label>
      <input id="field-control" ${inputAttributes}>
      ${content}
    </m3e-form-field>`;
  }

  requiredMarkup(attributes = "") {
    return this.markup(
      "Required field",
      attributes,
      "required",
      '<span slot="hint">Helpful hint</span><span slot="error">This field is required</span>',
    );
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(`${this.html}<div id="field-destination"></div><div id="removed-controls"></div>
      <button id="after-field">After</button>`);
  }

  async state(name: string) {
    return this.field.evaluate((element, state) => element.matches(`:state(--${state})`), name);
  }

  async subscriptStyle() {
    return this.field.locator(".subscript").evaluate((element) => {
      const style = getComputedStyle(element);
      return { display: style.display, opacity: style.opacity };
    });
  }
}
