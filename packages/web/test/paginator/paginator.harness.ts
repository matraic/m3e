import type { Page } from "@playwright/test";
import type { M3ePaginatorElement } from "@m3e/web/paginator";

export class PaginatorHarness {
  readonly attributes = new Map<string, string>();
  content = "";
  direction: "ltr" | "rtl" | undefined;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get paginator() {
    return this.page.locator("m3e-paginator");
  }

  get sizeSelector() {
    return this.page.getByRole("combobox", { name: "Items per page:" });
  }

  button(name: string) {
    return this.page.getByRole("button", { name, exact: true });
  }

  configure(length: number, pageSize: string, pageIndex = 0, label?: string) {
    this.attributes.set("length", `${length}`);
    this.attributes.set("page-size", pageSize);
    this.attributes.set("page-index", `${pageIndex}`);
    if (label) this.attributes.set("aria-label", label);
  }

  async render() {
    const attributes = [...this.attributes].map(([name, value]) => (value === "" ? name : `${name}="${value}"`));
    await this.renderFixture(`<m3e-paginator ${attributes.join(" ")}>${this.content}</m3e-paginator>`, this.direction);
  }

  setPageSize(value: number | "all") {
    return this.paginator.evaluate((element, value) => ((element as M3ePaginatorElement).pageSize = value), value);
  }

  setPageIndex(value: number) {
    return this.paginator.evaluate((element, value) => ((element as M3ePaginatorElement).pageIndex = value), value);
  }

  empty() {
    return this.paginator.evaluate((element) => {
      const paginator = element as M3ePaginatorElement;
      paginator.length = 0;
      paginator.pageIndex = 0;
    });
  }

  formatRangeAsPages() {
    return this.paginator.evaluate((element) => {
      (element as M3ePaginatorElement).rangeLabelFormatter = (index, size, length) =>
        `Page ${index + 1} of ${Math.ceil(length / (size as number))}`;
    });
  }

  availability() {
    return this.paginator.evaluate((element) => {
      const paginator = element as M3ePaginatorElement;
      return {
        count: paginator.pageCount,
        previous: paginator.hasPreviousPage ? "available" : "unavailable",
        next: paginator.hasNextPage ? "available" : "unavailable",
      };
    });
  }

  pageSize() {
    return this.paginator.evaluate((element) => (element as M3ePaginatorElement).pageSize);
  }

  recordPageEvents() {
    return this.paginator.evaluate((element) => {
      const events: unknown[] = [];
      (window as unknown as { pageEvents: unknown[] }).pageEvents = events;
      element.addEventListener("page", (event) => events.push((event as CustomEvent).detail));
    });
  }

  pageEvents() {
    return this.page.evaluate(
      () =>
        (
          window as unknown as {
            pageEvents: { previousPageIndex: number; pageIndex: number; pageSize: number; length: number }[];
          }
        ).pageEvents,
    );
  }

  attemptImpossibleNavigation() {
    return this.paginator.evaluate((element) => {
      const paginator = element as M3ePaginatorElement;
      paginator.previousPage();
      paginator.firstPage();
      paginator.pageIndex = paginator.pageCount - 1;
      paginator.nextPage();
      paginator.lastPage();
    });
  }

  async chooseSize(name: string) {
    await this.sizeSelector.click();
    await this.page.getByRole("option", { name, exact: true }).click();
  }

  iconTransform(name: string) {
    return this.button(name)
      .locator("svg")
      .evaluate((svg) => getComputedStyle(svg).transform);
  }
}
