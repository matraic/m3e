import type { Page } from "@playwright/test";

type SnackbarService = {
  open(...args: unknown[]): void;
  dismiss(): void;
};

export class SnackbarHarness {
  html = "";
  reducedMotion: "reduce" | "no-preference" = "no-preference";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get snackbar() {
    return this.page.locator("m3e-snackbar");
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: this.reducedMotion });
    await this.renderFixture(this.html);
  }

  setOpen(selector = "m3e-snackbar", open = true) {
    return this.page.locator(selector).evaluate((element, open) => {
      (element as HTMLElement & { open: boolean }).open = open;
    }, open);
  }

  recordToggleEvents() {
    return this.snackbar.evaluate((element) => {
      const state = window as typeof window & { snackbarToggleStates: string[] };
      state.snackbarToggleStates = [];
      element.addEventListener("toggle", (event) => state.snackbarToggleStates.push((event as ToggleEvent).newState));
    });
  }

  toggleEvents() {
    return this.page.evaluate(
      () => (window as typeof window & { snackbarToggleStates: string[] }).snackbarToggleStates,
    );
  }

  actionTaken() {
    return this.snackbar.evaluate((element) => (element as HTMLElement & { isActionTaken: boolean }).isActionTaken);
  }

  openViaService(...args: unknown[]) {
    return this.page.evaluate((args) => {
      (window as typeof window & { M3eSnackbar: SnackbarService }).M3eSnackbar.open(...args);
    }, args);
  }

  openViaServiceWithCallback(dismissible = false) {
    return this.page.evaluate((dismissible) => {
      const state = window as typeof window & { M3eSnackbar: SnackbarService; snackbarCallbackCount: number };
      state.snackbarCallbackCount = 0;
      const options = {
        duration: 0,
        actionCallback: () => state.snackbarCallbackCount++,
      };
      if (dismissible) {
        state.M3eSnackbar.open("File deleted", "Undo", true, options);
      } else {
        state.M3eSnackbar.open("File deleted", "Undo", options);
      }
    }, dismissible);
  }

  callbackCount() {
    return this.page.evaluate(
      () => (window as typeof window & { snackbarCallbackCount: number }).snackbarCallbackCount,
    );
  }

  dismissViaService() {
    return this.page.evaluate(() => (window as typeof window & { M3eSnackbar: SnackbarService }).M3eSnackbar.dismiss());
  }
}
