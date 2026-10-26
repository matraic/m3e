import type { M3ePaginatorElement } from "../src/paginator";
import { expect, test } from "./fixtures";

test.describe("m3e-paginator", () => {
  test("exposes a group and shows the range label for the current page", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10" aria-label="Pagination"></m3e-paginator>`);

    await expect(page.getByRole("group", { name: "Pagination" })).toBeVisible();
    await expect(page.getByText("1 - 10 of 95")).toBeVisible();
    await expect(page.getByText("Items per page:")).toBeVisible();
  });

  test("clamps the last range to the length and reports an empty list", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10" page-index="9"></m3e-paginator>`);
    const paginator = page.locator("m3e-paginator");

    await expect(page.getByText("91 - 95 of 95")).toBeVisible();

    await paginator.evaluate((element) => {
      const p = element as M3ePaginatorElement;
      p.length = 0;
      p.pageIndex = 0;
    });
    await expect(page.getByText("0 of 0")).toBeVisible();
  });

  test("computes the page count and whether previous and next pages exist", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10"></m3e-paginator>`);
    const paginator = page.locator("m3e-paginator");
    const state = () =>
      paginator.evaluate((element) => {
        const p = element as M3ePaginatorElement;
        return { count: p.pageCount, previous: p.hasPreviousPage, next: p.hasNextPage };
      });

    expect(await state()).toEqual({ count: 10, previous: false, next: true });

    await paginator.evaluate((element) => ((element as M3ePaginatorElement).pageIndex = 9));
    expect(await state()).toEqual({ count: 10, previous: true, next: false });

    await paginator.evaluate((element) => ((element as M3ePaginatorElement).pageSize = "all"));
    expect(await state()).toEqual({ count: 0, previous: false, next: false });
  });

  test("navigates with the next and previous buttons and dispatches page events", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10"></m3e-paginator>`);
    const previous = page.getByRole("button", { name: "Previous page" });
    const next = page.getByRole("button", { name: "Next page" });
    await page.evaluate(() => {
      const events: unknown[] = [];
      (window as unknown as { pageEvents: unknown[] }).pageEvents = events;
      document.querySelector("m3e-paginator")!.addEventListener("page", (e) => events.push((e as CustomEvent).detail));
    });

    await expect(previous).toBeDisabled();
    await next.click();
    await expect(page.getByText("11 - 20 of 95")).toBeVisible();
    await expect(previous).toBeEnabled();

    await previous.click();
    await expect(page.getByText("1 - 10 of 95")).toBeVisible();

    expect(await page.evaluate(() => (window as unknown as { pageEvents: unknown[] }).pageEvents)).toEqual([
      { previousPageIndex: 0, pageIndex: 1, pageSize: 10, length: 95 },
      { previousPageIndex: 1, pageIndex: 0, pageSize: 10, length: 95 },
    ]);
  });

  test("disables next on the last page", async ({ page, render }) => {
    await render(`<m3e-paginator length="25" page-size="10" page-index="2"></m3e-paginator>`);

    await expect(page.getByRole("button", { name: "Next page" })).toBeDisabled();
    await expect(page.getByRole("button", { name: "Previous page" })).toBeEnabled();
  });

  test("shows first and last buttons only when requested and jumps to the ends", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10"></m3e-paginator>`);
    const paginator = page.locator("m3e-paginator");

    await expect(page.getByRole("button", { name: "First page" })).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Last page" })).toHaveCount(0);

    await paginator.evaluate((element) => element.setAttribute("show-first-last-buttons", ""));
    const first = page.getByRole("button", { name: "First page" });
    const last = page.getByRole("button", { name: "Last page" });

    await expect(first).toBeDisabled();
    await last.click();
    await expect(page.getByText("91 - 95 of 95")).toBeVisible();
    await expect(last).toBeDisabled();

    await first.click();
    await expect(page.getByText("1 - 10 of 95")).toBeVisible();
  });

  test("does not dispatch page events when navigation is not possible", async ({ page, render }) => {
    await render(`<m3e-paginator length="25" page-size="10"></m3e-paginator>`);
    const count = await page.locator("m3e-paginator").evaluate((element) => {
      const p = element as M3ePaginatorElement;
      let events = 0;
      p.addEventListener("page", () => events++);
      p.previousPage();
      p.firstPage();
      p.pageIndex = 2;
      p.nextPage();
      p.lastPage();
      return events;
    });

    expect(count).toBe(0);
  });

  test("applies custom labels", async ({ page, render }) => {
    await render(`
      <m3e-paginator
        length="95"
        page-size="10"
        show-first-last-buttons
        items-per-page-label="Rows:"
        first-page-label="Start"
        previous-page-label="Back"
        next-page-label="Forward"
        last-page-label="End"
      ></m3e-paginator>
    `);

    await expect(page.getByText("Rows:")).toBeVisible();
    for (const name of ["Start", "Back", "Forward", "End"]) {
      await expect(page.getByRole("button", { name })).toHaveCount(1);
    }
  });

  test("uses a custom range label formatter", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10"></m3e-paginator>`);

    await page.locator("m3e-paginator").evaluate((element) => {
      (element as M3ePaginatorElement).rangeLabelFormatter = (index, size, length) =>
        `Page ${index + 1} of ${Math.ceil(length / (size as number))}`;
    });

    await page.locator("m3e-paginator").evaluate((element) => ((element as M3ePaginatorElement).pageIndex = 1));
    await expect(page.getByText("Page 2 of 10")).toBeVisible();
  });

  test("hides the page size selector and range when appropriate", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10" hide-page-size></m3e-paginator>`);

    await expect(page.getByText("Items per page:")).toBeHidden();
    await expect(page.getByText("1 - 10 of 95")).toBeVisible();

    await page.locator("m3e-paginator").evaluate((element) => ((element as M3ePaginatorElement).pageSize = "all"));
    await expect(page.getByText("1 - 10 of 95")).toBeHidden();
  });

  test("changes the page size from the selector, resets to the first page, and dispatches a page event", async ({
    page,
    render,
  }) => {
    await render(`<m3e-paginator length="95" page-size="10" page-index="3" page-sizes="5,10,25"></m3e-paginator>`);
    await page.evaluate(() => {
      const events: unknown[] = [];
      (window as unknown as { pageEvents: unknown[] }).pageEvents = events;
      document.querySelector("m3e-paginator")!.addEventListener("page", (e) => events.push((e as CustomEvent).detail));
    });
    await expect(page.getByText("31 - 40 of 95")).toBeVisible();

    await page.getByRole("combobox", { name: "Items per page:" }).click();
    await page.getByRole("option", { name: "25" }).click();

    await expect(page.getByText("1 - 25 of 95")).toBeVisible();
    expect(await page.evaluate(() => (window as unknown as { pageEvents: unknown[] }).pageEvents)).toEqual([
      { previousPageIndex: 3, pageIndex: 0, pageSize: 25, length: 95 },
    ]);
  });

  test("supports an all page size that hides the range actions", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="10" page-sizes="5,10,all"></m3e-paginator>`);

    await page.getByRole("combobox", { name: "Items per page:" }).click();
    await page.getByRole("option", { name: "All" }).click();

    await expect(page.getByRole("button", { name: "Next page" })).toBeHidden();
    expect(await page.locator("m3e-paginator").evaluate((element) => (element as M3ePaginatorElement).pageSize)).toBe(
      "all",
    );
  });

  test("includes the current page size in the available sizes", async ({ page, render }) => {
    await render(`<m3e-paginator length="95" page-size="7" page-sizes="5,10"></m3e-paginator>`);

    await page.getByRole("combobox", { name: "Items per page:" }).click();

    await expect(page.getByRole("option")).toHaveText(["5", "7", "10"]);
  });

  test("disables all controls when disabled", async ({ page, render }) => {
    await render(
      `<m3e-paginator length="95" page-size="10" page-index="2" show-first-last-buttons disabled></m3e-paginator>`,
    );

    for (const name of ["First page", "Previous page", "Next page", "Last page"]) {
      await expect(page.getByRole("button", { name })).toBeDisabled();
    }
    await expect(page.getByRole("combobox", { name: "Items per page:" })).toHaveAttribute("aria-disabled", "true");
  });
});
