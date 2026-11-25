import type { Page } from "@playwright/test";
import type { M3eSearchBarElement, M3eSearchViewElement } from "@m3e/web/search";

type SearchHost = M3eSearchBarElement & M3eSearchViewElement;

export class SearchHarness {
  kind: "bar" | "view" = "view";
  attributes = "";
  term = "";
  direction: "ltr" | "rtl" | undefined;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get host() {
    return this.page.locator(this.kind === "bar" ? "m3e-search-bar" : "m3e-search-view");
  }

  get input() {
    return this.page.getByRole("searchbox");
  }

  get results() {
    return this.page.getByText("Result One");
  }

  get dialog() {
    return this.page.getByRole("dialog");
  }

  get outsideButton() {
    return this.page.getByRole("button", { name: "Outside", includeHidden: true });
  }

  get leadingButton() {
    return this.page.locator("m3e-icon-button.close");
  }

  get trailingButton() {
    return this.page.locator("m3e-icon-button.clear");
  }

  async press(key: string) {
    if (!(await this.host.evaluate((host) => host.matches(":focus-within")))) {
      await this.input.focus();
    }
    await this.page.keyboard.press(key);
  }

  button(name: string) {
    return this.page.getByRole("button", { name, exact: true }).first();
  }

  prepareBar(attributes: string) {
    this.kind = "bar";
    this.attributes = attributes;
  }

  prepareView(attributes: string) {
    this.kind = "view";
    this.attributes = attributes;
  }

  async render() {
    const inputValue = this.term ? ` value="${this.term}"` : "";
    const html =
      this.kind === "bar"
        ? `<m3e-search-bar ${this.attributes}>
             <m3e-icon name="search" slot="leading"></m3e-icon>
             <input slot="input" aria-label="Search"${inputValue} />
           </m3e-search-bar>`
        : `<button>Outside</button>
           <div id="home">
             <m3e-search-view ${this.attributes}>
               <input slot="input" aria-label="Search"${inputValue} />
               <span slot="open-leading">Open lead</span>
               <span slot="closed-leading">Closed lead</span>
               <m3e-list>
                 <m3e-list-item>Result One</m3e-list-item>
                 <m3e-list-item>Result Two</m3e-list-item>
               </m3e-list>
             </m3e-search-view>
           </div>
           <div id="away"></div>`;
    await this.renderFixture(html, this.direction);
  }

  recordEvents(types: string[]) {
    return this.host.evaluate((host, types) => {
      const events: string[] = [];
      (window as unknown as { searchEvents: string[] }).searchEvents = events;
      for (const type of types) {
        host.addEventListener(type, (e) => {
          const detail = (e as CustomEvent<{ term: string }>).detail;
          const state = (e as ToggleEvent).newState;
          events.push(detail ? `${type}:${detail.term}` : state ? `${type}:${state}` : type);
        });
      }
    }, types);
  }

  events() {
    return this.page.evaluate(() => (window as unknown as { searchEvents: string[] }).searchEvents.join(","));
  }

  cancelToggleTo(state: string) {
    return this.host.evaluate(
      (host, state) =>
        host.addEventListener("beforetoggle", (e) => (e as ToggleEvent).newState === state && e.preventDefault()),
      state,
    );
  }

  clear() {
    return this.host.evaluate((host) => (host as SearchHost).clear());
  }

  dispatchInput() {
    return this.input.dispatchEvent("input");
  }

  replaceInput() {
    return this.host.evaluate((host) => {
      host.querySelector("input")?.remove();
      const input = document.createElement("input");
      input.slot = "input";
      input.ariaLabel = "Replacement";
      host.append(input);
    });
  }

  setMode(mode: string) {
    return this.host.evaluate((host, mode) => ((host as SearchHost).mode = mode as SearchHost["mode"]), mode);
  }

  currentMode() {
    return this.host.evaluate((host) => (host as SearchHost).currentMode);
  }

  mode() {
    return this.host.evaluate((host) => (host as SearchHost).mode);
  }

  moveAway() {
    return this.page.evaluate(() =>
      document.getElementById("away")!.append(document.querySelector("m3e-search-view")!),
    );
  }

  blurFocus() {
    return this.page.evaluate(() => (document.activeElement as HTMLElement | null)?.blur());
  }

  readOverflow() {
    return this.page.evaluate(() => document.documentElement.style.overflow);
  }

  isOutsideInert() {
    return this.outsideButton.evaluate((button) => (button as HTMLElement).inert);
  }

  async readPanelAlignment() {
    const host = await this.host.boundingBox();
    const panel = await this.dialog.boundingBox();
    return { start: Math.abs(host!.x - panel!.x), end: Math.abs(host!.x + host!.width - (panel!.x + panel!.width)) };
  }

  async readPanelSize() {
    const panel = await this.dialog.boundingBox();
    const viewport = this.page.viewportSize()!;
    return { width: panel!.width - viewport.width, height: panel!.height - viewport.height };
  }
}
