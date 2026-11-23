import type { Page } from "@playwright/test";

export class ListHarness {
  html = "";
  formData: Array<[string, string]> = [];

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  async render() {
    await this.renderFixture(this.html);
  }

  async observeSelectionEvents() {
    await this.page.evaluate(() => {
      const list = document.querySelector("m3e-selection-list") as HTMLElement & {
        value: string | readonly string[] | null;
      };
      const events: Array<{ type: string; value: string | readonly string[] | null }> = [];
      (window as typeof window & { listSelectionEvents: typeof events }).listSelectionEvents = events;
      for (const type of ["input", "change"]) {
        list.addEventListener(type, () => {
          const value = list.value;
          events.push({ type, value: Array.isArray(value) ? [...value] : value });
        });
      }
    });
  }

  async selectionEvents() {
    return this.page.evaluate(
      () =>
        (
          window as typeof window & {
            listSelectionEvents: Array<{ type: string; value: string | readonly string[] | null }>;
          }
        ).listSelectionEvents,
    );
  }

  async selectionValue() {
    return this.page.locator("m3e-selection-list").evaluate(
      (element) => (element as HTMLElement & { value: string | readonly string[] | null }).value,
    );
  }

  async readFormData() {
    this.formData = await this.page.locator("form").evaluate((form: HTMLFormElement) =>
      Array.from(new FormData(form).entries(), ([name, value]): [string, string] => [name, String(value)]),
    );
  }

  async addOption(label: string, value: string) {
    await this.page.locator("m3e-selection-list").evaluate(
      (list, optionData) => {
        const option = document.createElement("m3e-list-option") as HTMLElement & { value: string };
        option.value = optionData.value;
        option.textContent = optionData.label;
        list.append(option);
      },
      { label, value },
    );
  }

  async removeOption(label: string) {
    await this.page
      .locator("m3e-selection-list > m3e-list-option")
      .filter({ hasText: label })
      .evaluate((option) => option.remove());
  }

  async setDisabled(disabled: boolean) {
    await this.page.locator("m3e-selection-list").evaluate(
      (element, value) => {
        (element as HTMLElement & { disabled: boolean }).disabled = value;
      },
      disabled,
    );
  }

  async resetForm() {
    await this.page.locator("form").evaluate((form: HTMLFormElement) => form.reset());
  }

  formValues(name: string) {
    return this.formData.filter(([entryName]) => entryName === name).map(([, value]) => value);
  }
}
