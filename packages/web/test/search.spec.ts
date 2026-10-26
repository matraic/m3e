import { expect, test } from "./fixtures";

const bar = `
  <m3e-search-bar clearable clear-label="Clear search">
    <m3e-icon name="search" slot="leading"></m3e-icon>
    <input slot="input" aria-label="Search" />
  </m3e-search-bar>
`;

const view = (attrs = "") => `
  <m3e-search-view ${attrs}>
    <input slot="input" aria-label="Search" />
    <m3e-list>
      <m3e-list-item>Result One</m3e-list-item>
      <m3e-list-item>Result Two</m3e-list-item>
    </m3e-list>
  </m3e-search-view>
`;

test.describe("m3e-search-bar", () => {
  test("gives the slotted input searchbox semantics", async ({ page, render }) => {
    await render(bar);
    const input = page.getByRole("searchbox", { name: "Search" });

    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("inputmode", "search");
  });

  test("focuses the input when the bar is clicked", async ({ page, render }) => {
    await render(bar);

    await page.locator("m3e-search-bar").click({ position: { x: 150, y: 20 } });

    await expect(page.getByRole("searchbox")).toBeFocused();
  });

  test("shows the clear button only when clearable and the input has text", async ({ page, render }) => {
    await render(bar);
    const clear = page.getByRole("button", { name: "Clear search" });

    await expect(clear).toBeHidden();

    await page.getByRole("searchbox").fill("apple");
    await expect(clear).toBeVisible();

    await page.getByRole("searchbox").fill("");
    await expect(clear).toBeHidden();
  });

  test("does not render a clear button when not clearable", async ({ page, render }) => {
    await render(`<m3e-search-bar><input slot="input" aria-label="Search" /></m3e-search-bar>`);
    await page.getByRole("searchbox").fill("apple");

    await expect(page.getByRole("button")).toHaveCount(0);
  });

  test("clears the term, refocuses the input and dispatches clear", async ({ page, render }) => {
    await render(bar);
    await page.locator("m3e-search-bar").evaluate((el) => {
      (window as unknown as { clears: number }).clears = 0;
      el.addEventListener("clear", () => (window as unknown as { clears: number }).clears++);
    });
    const input = page.getByRole("searchbox");

    await input.fill("apple");
    await page.getByRole("button", { name: "Clear search" }).click();

    await expect(input).toHaveValue("");
    await expect(input).toBeFocused();
    expect(await page.evaluate(() => (window as unknown as { clears: number }).clears)).toBe(1);
  });

  test("does not dispatch clear when the input is already empty", async ({ page, render }) => {
    await render(bar);
    await page.locator("m3e-search-bar").evaluate((el) => {
      (window as unknown as { clears: number }).clears = 0;
      el.addEventListener("clear", () => (window as unknown as { clears: number }).clears++);
      (el as HTMLElement & { clear(): void }).clear();
    });

    expect(await page.evaluate(() => (window as unknown as { clears: number }).clears)).toBe(0);
  });
});

test.describe("m3e-search-view", () => {
  test("gives the input searchbox semantics with a dialog popup", async ({ page, render }) => {
    await render(view());
    const input = page.getByRole("searchbox", { name: "Search" });

    await expect(input).toHaveAttribute("aria-haspopup", "dialog");
  });

  test("is closed by default and hides its results", async ({ page, render }) => {
    await render(view());

    await expect(page.locator("m3e-search-view")).not.toHaveAttribute("open");
    await expect(page.getByText("Result One")).toBeHidden();
  });

  test("opens when the input is focused and shows its results", async ({ page, render }) => {
    await render(view());

    await page.getByRole("searchbox").focus();

    await expect(page.locator("m3e-search-view")).toHaveAttribute("open", "");
    await expect(page.getByText("Result One")).toBeVisible();
    await expect(page.getByRole("dialog")).toBeVisible();
  });

  test("opens when the open attribute is set", async ({ page, render }) => {
    await render(view("open"));

    await expect(page.getByText("Result One")).toBeVisible();
  });

  test("dispatches query events as the term changes while open", async ({ page, render }) => {
    await render(view());
    await page.locator("m3e-search-view").evaluate((el) => {
      const terms: string[] = [];
      (window as unknown as { terms: string[] }).terms = terms;
      el.addEventListener("query", (e) => terms.push((e as CustomEvent<{ term: string }>).detail.term));
    });

    await page.getByRole("searchbox").focus();
    await expect(page.getByText("Result One")).toBeVisible();
    await page.getByRole("searchbox").pressSequentially("ab");

    expect(await page.evaluate(() => (window as unknown as { terms: string[] }).terms)).toEqual(
      expect.arrayContaining(["a", "ab"]),
    );
  });

  test("opens when the user types into a closed view", async ({ page, render }) => {
    await render(view());

    await page.getByRole("searchbox").dispatchEvent("input");

    await expect(page.locator("m3e-search-view")).toHaveAttribute("open", "");
  });

  test("shows the clear button only when there is a term", async ({ page, render }) => {
    await render(view("open"));
    const clear = page.getByRole("button", { name: "Clear" });

    await expect(clear).toHaveCount(0);

    await page.getByRole("searchbox").fill("apple");
    await expect(clear).toBeVisible();
  });

  test("clears the term and dispatches query and clear when the clear button is clicked", async ({ page, render }) => {
    await render(view("open"));
    await page.locator("m3e-search-view").evaluate((el) => {
      const events: string[] = [];
      (window as unknown as { events: string[] }).events = events;
      el.addEventListener("query", (e) => events.push(`query:${(e as CustomEvent<{ term: string }>).detail.term}`));
      el.addEventListener("clear", () => events.push("clear"));
    });
    const input = page.getByRole("searchbox");

    await input.fill("apple");
    await page.getByRole("button", { name: "Clear" }).click();

    await expect(input).toHaveValue("");
    const events = await page.evaluate(() => (window as unknown as { events: string[] }).events);
    expect(events.slice(-2)).toEqual(["query:", "clear"]);
  });

  test("clears the term with Escape and then closes", async ({ page, render }) => {
    await render(view("open"));
    const input = page.getByRole("searchbox");

    await input.fill("apple");
    await input.press("Escape");

    await expect(input).toHaveValue("");
    await expect(page.getByText("Result One")).toBeHidden();
  });

  test("closes with Escape when the term is empty", async ({ page, render }) => {
    await render(view("open"));

    await page.getByRole("searchbox").press("Escape");

    await expect(page.locator("m3e-search-view")).not.toHaveAttribute("open");
  });

  test("closes with the close button", async ({ page, render }) => {
    await render(view("open"));

    await page.getByRole("button", { name: "Close" }).first().click();

    await expect(page.locator("m3e-search-view")).not.toHaveAttribute("open");
    await expect(page.getByText("Result One")).toBeHidden();
  });

  test("dispatches beforetoggle and toggle when opened", async ({ page, render }) => {
    await render(view());
    await page.locator("m3e-search-view").evaluate((el) => {
      const events: string[] = [];
      (window as unknown as { events: string[] }).events = events;
      for (const type of ["beforetoggle", "toggle"]) {
        el.addEventListener(type, (e) => events.push(`${type}:${(e as ToggleEvent).newState}`));
      }
    });

    await page.getByRole("searchbox").focus();
    await expect(page.getByText("Result One")).toBeVisible();

    expect(await page.evaluate(() => (window as unknown as { events: string[] }).events)).toEqual([
      "beforetoggle:open",
      "toggle:open",
    ]);
  });

  test("stays closed when beforetoggle is canceled", async ({ page, render }) => {
    await render(view());
    await page
      .locator("m3e-search-view")
      .evaluate((el) => el.addEventListener("beforetoggle", (e) => e.preventDefault()));

    await page.getByRole("searchbox").focus();

    await expect(page.locator("m3e-search-view")).not.toHaveAttribute("open");
    await expect(page.getByText("Result One")).toBeHidden();
  });

  test("uses custom clear and close labels", async ({ page, render }) => {
    await render(view("open clear-label='Erase' close-label='Dismiss'"));

    await page.getByRole("searchbox").fill("apple");

    await expect(page.getByRole("button", { name: "Erase" })).toBeVisible();
  });

  test("reports its current mode", async ({ page, render }) => {
    await render(`${view()}${view("mode='fullscreen'")}`);
    const modes = await page
      .locator("m3e-search-view")
      .evaluateAll((els) => els.map((x) => (x as HTMLElement & { currentMode: string }).currentMode));

    expect(modes).toEqual(["docked", "fullscreen"]);
  });
});
