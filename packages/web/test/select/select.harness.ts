import type { Page } from "@playwright/test";
import type { M3eSelectElement } from "@m3e/web/select";

export class SelectHarness {
  label = "Fruit";
  multi = false;
  attributes = new Map<string, string>();
  inForm = false;
  scrolling = false;
  listboxY = 0;
  labelOnly = false;
  empty = false;
  modal = false;
  optionsHtml?: string;
  emptyChoice = false;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get select() {
    return this.page.locator("m3e-select");
  }

  get combobox() {
    return this.page.getByRole("combobox", { name: this.label, exact: true });
  }

  get listbox() {
    return this.page.getByRole("listbox");
  }

  option(name: string) {
    return this.page.getByRole("option", { name, exact: true });
  }

  async render() {
    const id = this.multi ? "lang" : "fruit";
    const options = this.multi
      ? `<m3e-option value="js">JavaScript</m3e-option>
         <m3e-option value="ts">TypeScript</m3e-option>
         <m3e-option value="py">Python</m3e-option>`
      : `<m3e-option value="apple">Apples</m3e-option>
         <m3e-option value="orange" disabled>Oranges</m3e-option>
         <m3e-option value="banana">Bananas</m3e-option>`;
    const attributes = [...this.attributes].map(([key, value]) => `${key}="${value}"`).join(" ");
    let markup = `<m3e-form-field>
      ${this.labelOnly ? "" : `<label slot="label" for="${id}">${this.label}</label>`}
      <m3e-select id="${id}" name="${id}" ${this.labelOnly ? "" : `aria-label="${this.label}"`} ${this.multi ? "multi" : ""} ${attributes}>
        ${this.emptyChoice ? '<m3e-option value="">None</m3e-option>' : ""}
        ${this.empty ? "" : (this.optionsHtml ?? options)}
      </m3e-select>
    </m3e-form-field>`;
    if (this.labelOnly) markup = `<label for="${id}">${this.label}</label>${markup}`;
    if (this.inForm) markup = `<form>${markup}</form>`;
    if (this.scrolling) {
      markup = `<div id="scroller" style="height: 300px; overflow: auto">
        <div style="height: 100px"></div>${markup}<div style="height: 600px"></div>
      </div>`;
    }
    if (this.modal) markup = `<dialog aria-label="Choose fruit">${markup}</dialog>`;
    await this.renderFixture(`<button>Before select</button>${markup}<button>After select</button>`);
    if (this.modal) await this.page.locator("dialog").evaluate((dialog) => (dialog as HTMLDialogElement).showModal());
  }

  value() {
    return this.select.evaluate((select) => (select as M3eSelectElement).value);
  }

  setValue(value: string) {
    return this.select.evaluate((select, value) => ((select as M3eSelectElement).value = value), value);
  }

  recordEvents() {
    return this.select.evaluate((select) => {
      select.setAttribute("data-events", "");
      for (const type of ["beforeinput", "input", "change"]) {
        select.addEventListener(type, () => {
          const events = select.getAttribute("data-events");
          select.setAttribute("data-events", events ? `${events},${type}` : type);
        });
      }
    });
  }

  clearTwice() {
    return this.select.evaluate((select) => {
      (select as M3eSelectElement).clear();
      (select as M3eSelectElement).clear();
    });
  }

  validity() {
    return this.select.evaluate((select) => (select as M3eSelectElement).checkValidity());
  }

  formValues(name: string) {
    return this.page.locator("form").evaluate((form, name) => new FormData(form as HTMLFormElement).getAll(name), name);
  }

  async scroll(pixels: number) {
    const box = await this.listbox.boundingBox();
    if (!box) throw new Error("The select listbox must be visible before scrolling.");
    this.listboxY = box.y;
    await this.page.locator("#scroller").evaluate((scroller, pixels) => (scroller.scrollTop = pixels), pixels);
  }

  async listboxMovement() {
    const box = await this.listbox.boundingBox();
    return box ? Math.round(this.listboxY - box.y) : null;
  }

  activeOption() {
    return this.select.evaluate((select) => {
      const id = select.getAttribute("aria-activedescendant");
      const option = id ? document.getElementById(id) : null;
      return option?.getAttribute("role") === "option" ? option.textContent?.trim() : null;
    });
  }

  async nativeAccessibleName() {
    // Playwright's name computation omits labels associated with custom form controls.
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector: "m3e-select" });
      if (!nodeId) throw new Error("Select is missing from the DOM.");
      const { nodes } = await session.send("Accessibility.getPartialAXTree", { nodeId, fetchRelatives: false });
      return nodes[0]?.name?.value;
    } finally {
      await session.detach();
    }
  }

  move(toForm = false) {
    return this.select.evaluate((select, toForm) => {
      const field = select.closest("m3e-form-field");
      if (!field) throw new Error("The select must be inside a form field.");
      const destination = document.createElement(toForm ? "form" : "div");
      if (toForm) destination.id = "select-destination";
      document.body.append(destination);
      destination.append(field);
    }, toForm);
  }

  addOption(label: string, value: string) {
    return this.select.evaluate(
      (select, { label, value }) => {
        const option = document.createElement("m3e-option");
        option.value = value;
        option.textContent = label;
        select.append(option);
      },
      { label, value },
    );
  }

  optionCount() {
    return this.select.evaluate((select) => (select as M3eSelectElement).options.length);
  }

  sourceOption(name: string) {
    return this.select.locator("m3e-option").filter({ hasText: name });
  }

  moveWithinForm() {
    return this.select.evaluate((select) => {
      const field = select.closest("m3e-form-field");
      const form = select.closest("form");
      if (!field || !form) throw new Error("The select must be inside a form field and form.");
      const destination = document.createElement("div");
      form.append(destination);
      destination.append(field);
    });
  }
}
