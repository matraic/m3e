import type { M3eAutocompleteElement } from "@m3e/web/autocomplete";
import type { JSHandle, Page } from "@playwright/test";

type Options = {
  attributes?: string;
  hasSuggestions?: boolean;
  readOnly?: boolean;
  disabled?: string;
  grouped?: boolean;
  orangeValue?: string;
  customStateContent?: boolean;
};

export class AutocompleteHarness {
  private changes?: JSHandle<{ count: number }>;

  constructor(
    private readonly page: Page,
    private readonly render: (html: string) => Promise<void>,
  ) {}

  get component() {
    return this.page.locator("m3e-autocomplete");
  }

  get input() {
    return this.page.getByRole("combobox", { name: "Fruit" });
  }

  get detachedInput() {
    return this.page.getByRole("textbox", { name: "Fruit" });
  }

  get nextControl() {
    return this.page.getByRole("button", { name: "Continue" });
  }

  get panel() {
    return this.page.locator("m3e-option-panel");
  }

  get suggestions() {
    return this.panel.getByRole("option");
  }

  get liveRegion() {
    return this.page.locator('[aria-live="polite"]');
  }

  suggestion(label: string) {
    return this.panel.getByRole("option", { name: label, exact: true });
  }

  group(label: string) {
    return this.panel.getByRole("group", { name: label, exact: true });
  }

  async clickDisabledSuggestion(label: string) {
    const option = this.suggestion(label);
    // Hover waits for the opening panel to be stable and hit-testable without requiring an enabled option.
    await option.hover();
    await option.click({ force: true });
  }

  show({
    attributes = "",
    hasSuggestions = true,
    readOnly = false,
    disabled,
    grouped = false,
    orangeValue,
    customStateContent = false,
  }: Options = {}) {
    const option = (fruit: string) => {
      const value = fruit === "Oranges" && orangeValue ? ` value="${orangeValue}"` : "";
      return `<m3e-option${value}${disabled === fruit ? " disabled" : ""}>${fruit}</m3e-option>`;
    };
    const options = !hasSuggestions
      ? ""
      : grouped
        ? `<m3e-optgroup><span slot="label">Orchard</span>${option("Apples")}</m3e-optgroup>
           <m3e-optgroup><span slot="label">Tropical</span>${option("Oranges")}${option("Bananas")}</m3e-optgroup>`
        : ["Apples", "Oranges", "Bananas"].map(option).join("");
    const stateContent = customStateContent
      ? `<span slot="loading">Searching for fruit</span>
         <span slot="no-data">Try another fruit</span>`
      : "";

    return this.render(`
      <label for="fruit">Fruit</label>
      <input id="fruit" ${readOnly ? "readonly" : ""} />
      <m3e-autocomplete for="fruit" ${attributes}>${options}${stateContent}</m3e-autocomplete>
      <button>Continue</button>
    `);
  }

  originalOption(label: string) {
    return this.component.locator("m3e-option").filter({ hasText: label });
  }

  disableOption(label: string) {
    return this.originalOption(label).evaluate((option) => option.setAttribute("disabled", ""));
  }

  async activeSuggestion() {
    const activeId = await this.input.getAttribute("aria-activedescendant");
    if (!activeId) return null;

    return this.panel.evaluate((panel, id) => {
      const option = panel.ownerDocument.getElementById(id);
      return option && panel.contains(option) ? option.textContent?.trim() : null;
    }, activeId);
  }

  setCustomPrefixFilter() {
    return this.component.evaluate((element: M3eAutocompleteElement) => {
      element.filter = (option, term) => option.value.toLowerCase().startsWith(term.toLowerCase());
    });
  }

  recordQueries() {
    return this.component.evaluateHandle((element) => {
      const terms: string[] = [];
      element.addEventListener("query", (event) => {
        terms.push((event as CustomEvent<{ term: string }>).detail.term);
      });
      return terms;
    });
  }

  async recordChanges() {
    this.changes = await this.component.evaluateHandle((element) => {
      const state = { count: 0 };
      element.addEventListener("change", () => state.count++);
      return state;
    });
  }

  async changeCount() {
    if (!this.changes) throw new Error("Change recording has not started.");
    return this.changes.evaluate((state) => state.count);
  }

  async dispose() {
    await this.changes?.dispose();
  }

  startLoading() {
    return this.component.evaluate((element: M3eAutocompleteElement) => {
      element.loading = true;
      element.querySelectorAll(":scope > m3e-option, :scope > m3e-optgroup").forEach((option) => option.remove());
    });
  }

  hideMenuWhileLoading() {
    return this.component.evaluate((element: M3eAutocompleteElement) => {
      element.hideLoading = true;
      element.loading = true;
    });
  }

  receiveSuggestions(labels: string[]) {
    return this.component.evaluate((element: M3eAutocompleteElement, results) => {
      const options = results.map((label) => {
        const option = document.createElement("m3e-option");
        option.textContent = label;
        return option;
      });
      element.querySelectorAll(":scope > m3e-option, :scope > m3e-optgroup").forEach((option) => option.remove());
      element.append(...options);
      element.loading = false;
    }, labels);
  }

  receivedSuggestions() {
    return this.component.evaluate((element: M3eAutocompleteElement) => element.options.map((option) => option.label));
  }

  leaveInput() {
    return this.nextControl.focus();
  }

  refocusInput() {
    return this.input.evaluate((input: HTMLInputElement) => {
      input.blur();
      input.focus();
    });
  }

  remove() {
    return this.component.evaluate((element) => element.remove());
  }

  moveToNewParent() {
    return this.component.evaluate((element) => {
      const parent = document.createElement("div");
      parent.style.display = "contents";
      element.before(parent);
      parent.append(element);
    });
  }

  clear(restoreFocus?: boolean) {
    return this.component.evaluate((element: M3eAutocompleteElement, restoreFocus) => {
      element.clear(restoreFocus);
    }, restoreFocus);
  }
}
