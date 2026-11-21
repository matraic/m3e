import type { M3eChipElement, M3eInputChipSetElement } from "@m3e/web/chips";
import type { Locator, Page } from "@playwright/test";

export class ChipsHarness {
  markup = "";
  tag = "m3e-chip";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get chip() {
    return this.page.locator(this.tag);
  }

  get filterSet() {
    return this.page.locator("m3e-filter-chip-set").first();
  }

  get inputSet() {
    return this.page.locator("m3e-input-chip-set").first();
  }

  get input() {
    return this.page.getByRole("textbox", { name: "New keyword", exact: true });
  }

  filterChip(name: string) {
    return this.page.getByRole("radio", { name, exact: true }).or(this.page.getByRole("button", { name, exact: true }));
  }

  show() {
    if (!this.markup) throw new Error("Chip scenario markup has not been configured.");
    return this.renderFixture(this.markup);
  }

  configureAction(type: "assist" | "suggestion", inForm = false) {
    this.tag = `m3e-${type}-chip`;
    this.markup = inForm
      ? `<form id="chip-form"><${this.tag} type="submit" name="action" value="design">Open suggestions</${this.tag}></form>`
      : `<${this.tag}>Open suggestions</${this.tag}>`;
  }

  recordEvents(target: Locator, types: string[], cancel?: string) {
    return target.evaluate(
      (element, options) => {
        const events: string[] = [];
        element.setAttribute("data-events", "");
        for (const type of options.types) {
          element.addEventListener(type, (event) => {
            events.push(event.type);
            element.setAttribute("data-events", events.join(", "));
            if (options.cancel === event.type) event.preventDefault();
          });
        }
      },
      { types, cancel },
    );
  }

  recordInputChanges(target = this.inputSet) {
    return target.evaluate((set: M3eInputChipSetElement) => {
      const changes: string[] = [];
      set.setAttribute("data-changes", "");
      set.setAttribute("data-removes", "0");
      let removes = 0;
      set.addEventListener("remove", () => set.setAttribute("data-removes", `${++removes}`), true);
      set.addEventListener("change", (event) => {
        if (!(event instanceof CustomEvent)) return;
        changes.push(`${event.detail.type}:${event.detail.value}`);
        set.setAttribute("data-changes", changes.join(", "));
      });
    });
  }

  setAttribute(target: Locator, name: string, value = "") {
    return target.evaluate((element, attribute) => element.setAttribute(attribute.name, attribute.value), {
      name,
      value,
    });
  }

  removeAttribute(target: Locator, name: string) {
    return target.evaluate((element, attribute) => element.removeAttribute(attribute), name);
  }

  moveToNewParent(target: Locator) {
    return target.evaluate((element) => {
      for (let i = 1; i <= 2; i++) {
        const parent = document.createElement("div");
        parent.id = `chip-parent-${i}`;
        document.body.append(parent);
        parent.append(element);
      }
    });
  }

  moveToSet(target: Locator, id: string) {
    return target.evaluate((element, destinationId) => {
      const destination = document.getElementById(destinationId);
      if (!destination) throw new Error(`Missing destination chip set: ${destinationId}`);
      destination.append(element);
    }, id);
  }

  value(target = this.chip) {
    return target.evaluate((chip: M3eChipElement) => chip.value);
  }

  formValues() {
    return this.page
      .locator("#chip-form")
      .evaluate((form: HTMLFormElement) => Array.from(new FormData(form).entries()));
  }

  observeSubmit() {
    return this.page.locator("#chip-form").evaluate((form: HTMLFormElement) => {
      form.setAttribute("data-submissions", "0");
      let count = 0;
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        form.setAttribute("data-submissions", `${++count}`);
        form.setAttribute("data-values", JSON.stringify(Array.from(new FormData(form).entries())));
      });
    });
  }
}
