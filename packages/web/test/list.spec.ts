import type { M3eSelectionListElement } from "@m3e/web/list";

import { expect, test } from "./fixtures";

test.describe("list shape families", () => {
  for (const direction of ["ltr", "rtl"]) {
    test(`resolves item and media families independently in ${direction}`, async ({ page, render }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await render(`
        <div id="surfaces" dir="${direction}">
          <m3e-list>
            <m3e-list-item><img slot="leading" alt="" />Item<video slot="trailing"></video></m3e-list-item>
          </m3e-list>
          <m3e-list variant="segmented"><m3e-list-item>Segment</m3e-list-item></m3e-list>
          <m3e-action-list><m3e-list-action>Action</m3e-list-action></m3e-action-list>
          <m3e-selection-list><m3e-list-option selected>Option</m3e-list-option></m3e-selection-list>
          <m3e-action-list><m3e-expandable-list-item>Expand<div slot="items"></div></m3e-expandable-list-item></m3e-action-list>
        </div>
      `);
      const bases = page.locator("m3e-list-item .base, m3e-list-item-button .base, m3e-list-option .base");
      await expect(bases).toHaveCount(5);
      for (const base of await bases.all()) {
        await expect(base).toHaveCSS("corner-shape", "superellipse(1)");
      }
      await page.locator("#surfaces").evaluate((element) => {
        element.style.setProperty("--m3e-shape-family", "bevel");
        element.style.setProperty("--m3e-shape-family-start-end", "round");
      });
      const corners = ["start-start", "start-end", "end-start", "end-end"];
      for (const surface of await bases
        .or(page.locator(".state-layer, .focus-ring, .ripple, img, video, .toggle-container"))
        .all()) {
        for (const corner of corners) {
          await expect(surface).toHaveCSS(
            `corner-${corner}-shape`,
            corner === "start-end" ? "superellipse(1)" : "superellipse(0)",
          );
        }
      }
      await page.locator("#surfaces").evaluate((element) => {
        element.style.setProperty("--m3e-list-item-container-shape-family", "round");
        element.style.setProperty("--m3e-list-item-container-shape-family-end-start", "bevel");
        element.style.setProperty("--m3e-list-item-image-shape-family", "round");
        element.style.setProperty("--m3e-list-item-video-shape-family", "round");
        element.style.setProperty("--m3e-list-item-video-shape-family-end-end", "bevel");
      });
      for (const base of await bases.all()) {
        await expect(base).toHaveCSS("corner-start-start-shape", "superellipse(1)");
        await expect(base).toHaveCSS("corner-end-start-shape", "superellipse(0)");
      }
      await expect(page.locator("img")).toHaveCSS("corner-shape", "superellipse(1)");
      await expect(page.locator("video")).toHaveCSS("corner-end-end-shape", "superellipse(0)");
      await expect(page.locator("video")).toHaveCSS("corner-end-start-shape", "superellipse(1)");
      await expect(page.locator(".toggle-container")).toHaveCSS("corner-end-start-shape", "superellipse(0)");
      await expect(page.locator("m3e-list-option .base")).toHaveCSS("border-radius", "16px");
      await expect(page.locator("img")).toHaveCSS("border-radius", "0px");
    });

    test(`keeps segmented outer families on the correct expanded surfaces in ${direction}`, async ({
      page,
      render,
    }) => {
      await page.emulateMedia({ reducedMotion: "reduce" });
      await render(`
        <m3e-action-list variant="segmented" dir="${direction}" style="
          --m3e-list-item-container-shape-family: bevel;
          --m3e-segmented-list-container-shape-family: round;
          --m3e-expandable-list-item-toggle-icon-container-shape-family: round">
          <m3e-list-action id="first">First</m3e-list-action>
          <m3e-expandable-list-item>
            Expand
            <div slot="items">
              <m3e-list-action id="nested-first">Nested first</m3e-list-action>
              <m3e-list-action id="nested-last">Nested last</m3e-list-action>
            </div>
          </m3e-expandable-list-item>
          <m3e-list-action id="last">Last</m3e-list-action>
        </m3e-action-list>
      `);
      const first = page.locator("#first .base");
      const last = page.locator("#last .base");
      const header = page.locator("m3e-expandable-list-item m3e-list-item-button.header");
      const headerBase = header.locator(".base");
      await expect(first).toHaveCSS("corner-start-start-shape", "superellipse(1)");
      await expect(first).toHaveCSS("corner-end-start-shape", "superellipse(0)");
      await expect(last).toHaveCSS("corner-start-start-shape", "superellipse(0)");
      await expect(last).toHaveCSS("corner-end-start-shape", "superellipse(1)");
      await expect(headerBase).toHaveCSS("corner-shape", "superellipse(0)");
      await header.click();
      await page.mouse.move(0, 0);
      await expect(header).toHaveAttribute("aria-expanded", "true");
      await expect(headerBase).toHaveCSS("corner-start-start-shape", "superellipse(1)");
      await expect(headerBase).toHaveCSS("corner-end-start-shape", "superellipse(0)");
      await expect(page.locator("#nested-first .base")).toHaveCSS("corner-shape", "superellipse(0)");
      await expect(page.locator("#nested-last .base")).toHaveCSS("corner-start-start-shape", "superellipse(0)");
      await expect(page.locator("#nested-last .base")).toHaveCSS("corner-end-start-shape", "superellipse(1)");
      await expect(headerBase).toHaveCSS("border-top-left-radius", "16px");
      await expect(page.locator("#nested-last .base")).toHaveCSS("border-bottom-left-radius", "16px");
      await expect(page.locator(".toggle-container")).toHaveCSS("corner-shape", "superellipse(1)");
      await page.locator("m3e-action-list").evaluate((element) => {
        element.style.setProperty("--m3e-segmented-list-container-shape-family-start-start", "bevel");
        element.style.setProperty("--m3e-segmented-list-container-shape-family-end-end", "bevel");
      });
      await expect(headerBase).toHaveCSS("corner-start-start-shape", "superellipse(0)");
      await expect(headerBase).toHaveCSS("corner-start-end-shape", "superellipse(1)");
      await expect(page.locator("#nested-last .base")).toHaveCSS("corner-end-end-shape", "superellipse(0)");
      await expect(page.locator("#nested-last .base")).toHaveCSS("corner-end-start-shape", "superellipse(1)");
      await header.click();
      await expect(header).toHaveAttribute("aria-expanded", "false");
      await expect(headerBase).toHaveCSS("corner-shape", "superellipse(0)");
    });
  }
});

test.describe("m3e-list", () => {
  test("exposes list and listitem semantics and supports segmented styling", async ({ page, render }) => {
    await render(`
      <m3e-list variant="segmented" aria-label="Settings">
        <m3e-list-item>
          <span slot="overline">Account</span>
          Profile
          <span slot="supporting-text">Manage your details</span>
          <span slot="trailing">Updated</span>
        </m3e-list-item>
        <m3e-list-item>Preferences</m3e-list-item>
      </m3e-list>
    `);
    const list = page.getByRole("list", { name: "Settings" });
    const items = list.getByRole("listitem");

    await expect(items).toHaveCount(2);
    await expect(items.nth(0)).toContainText("Profile");
    await expect(items.nth(0)).toContainText("Account");
    await expect(items.nth(0)).toContainText("Manage your details");
    await expect(items.nth(0)).toContainText("Updated");
    await expect(list).toHaveAttribute("variant", "segmented");
  });

  test("supports actions as buttons, links, and disabled items", async ({ page, render }) => {
    await render(`
      <m3e-action-list aria-label="Commands">
        <m3e-list-action id="action">Run command</m3e-list-action>
        <m3e-list-action href="#details">View details</m3e-list-action>
        <m3e-list-action disabled>Unavailable</m3e-list-action>
      </m3e-action-list>
    `);
    const list = page.getByRole("list", { name: "Commands" });

    await expect(list.getByRole("button", { name: "Run command" })).toBeVisible();
    await expect(list.getByRole("link", { name: "View details" })).toHaveAttribute("href", "#details");
    await expect(list.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });
});

test.describe("m3e-selection-list", () => {
  test("selects one option, updates its value, and dispatches input and change", async ({ page, render }) => {
    await render(`
      <m3e-selection-list aria-label="Color">
        <m3e-list-option value="blue">Blue</m3e-list-option>
        <m3e-list-option value="green">Green</m3e-list-option>
      </m3e-selection-list>
    `);
    await page.evaluate(() => {
      const list = document.querySelector("m3e-selection-list")! as HTMLElement & { value: string | null };
      const events: Array<{ type: string; value: string | null }> = [];
      (window as typeof window & { selectionEvents: typeof events }).selectionEvents = events;
      list.addEventListener("input", () => events.push({ type: "input", value: list.value }));
      list.addEventListener("change", () => events.push({ type: "change", value: list.value }));
    });
    const list = page.getByRole("listbox", { name: "Color" });
    const blue = list.getByRole("option", { name: "Blue" });
    const green = list.getByRole("option", { name: "Green" });

    await expect(blue).toHaveAttribute("tabindex", "0");
    await expect(green).toHaveAttribute("tabindex", "-1");
    await blue.click();

    await expect(blue).toHaveAttribute("aria-selected", "true");
    await expect(green).toHaveAttribute("aria-selected", "false");
    expect(await list.evaluate((element) => (element as HTMLElement & { value: string }).value)).toBe("blue");
    expect(
      await page.evaluate(
        () =>
          (window as typeof window & { selectionEvents: Array<{ type: string; value: string | null }> })
            .selectionEvents,
      ),
    ).toEqual([
      { type: "input", value: "blue" },
      { type: "change", value: "blue" },
    ]);

    await green.click();
    await expect(blue).toHaveAttribute("aria-selected", "false");
    await expect(green).toHaveAttribute("aria-selected", "true");
    expect(await list.evaluate((element) => (element as HTMLElement & { value: string }).value)).toBe("green");
  });

  test("supports multi-selection and exposes its accessible state", async ({ page, render }) => {
    await render(`
      <m3e-selection-list multi aria-label="Features">
        <m3e-list-option value="search">Search</m3e-list-option>
        <m3e-list-option value="share">Share</m3e-list-option>
      </m3e-selection-list>
    `);
    await page.evaluate(() => {
      const list = document.querySelector<M3eSelectionListElement>("m3e-selection-list")!;
      const snapshots: Array<{ value: string | readonly string[] | null; selected: string[] }> = [];
      (window as typeof window & { selectionChangeSnapshots: typeof snapshots }).selectionChangeSnapshots = snapshots;
      list.addEventListener("change", () => {
        const value = list.value;
        snapshots.push({
          value: Array.isArray(value) ? [...value] : value,
          selected: list.selected.map((option) => option.value),
        });
      });
    });
    const list = page.getByRole("listbox", { name: "Features" });
    const search = list.getByRole("option", { name: "Search" });
    const share = list.getByRole("option", { name: "Share" });

    await expect(list).toHaveAttribute("aria-multiselectable", "true");
    await expect(search).toHaveAttribute("tabindex", "0");
    await expect(share).toHaveAttribute("tabindex", "-1");
    await search.click();
    expect(
      await list.evaluate((element) =>
        (element as HTMLElement & { selected: Array<{ value: string }> }).selected.map((option) => option.value),
      ),
    ).toEqual(["search"]);
    await share.click();

    await expect(search).toHaveAttribute("aria-selected", "true");
    await expect(share).toHaveAttribute("aria-selected", "true");
    expect(await list.evaluate((element) => (element as HTMLElement & { value: string[] }).value)).toEqual([
      "search",
      "share",
    ]);
    expect(
      await page.evaluate(
        () =>
          (
            window as typeof window & {
              selectionChangeSnapshots: Array<{ value: string | readonly string[] | null; selected: string[] }>;
            }
          ).selectionChangeSnapshots,
      ),
    ).toEqual([
      { value: "search", selected: ["search"] },
      { value: ["search", "share"], selected: ["search", "share"] },
    ]);
  });

  test("does not change selection when beforeinput is canceled or a disabled option is clicked", async ({
    page,
    render,
  }) => {
    await render(`
      <m3e-selection-list aria-label="Options">
        <m3e-list-option value="first">First</m3e-list-option>
        <m3e-list-option value="disabled" disabled>Disabled option</m3e-list-option>
      </m3e-selection-list>
    `);
    const list = page.getByRole("listbox", { name: "Options" });
    await page.evaluate(() => {
      document.querySelector("m3e-list-option")!.addEventListener("beforeinput", (event) => event.preventDefault());
    });

    await list.getByRole("option", { name: "First" }).click();
    await expect(list.getByRole("option", { name: "First" })).toHaveAttribute("aria-selected", "false");

    await list.getByRole("option", { name: "Disabled option" }).evaluate((option) => (option as HTMLElement).click());
    await expect(list.getByRole("option", { name: "Disabled option" })).toHaveAttribute("aria-selected", "false");
    expect(await list.evaluate((element) => (element as HTMLElement & { value: string | null }).value)).toBeNull();
  });

  test("moves the active option with arrow keys and selects it with Space", async ({ page, render }) => {
    await render(`
      <m3e-selection-list aria-label="Navigation">
        <m3e-list-option>First</m3e-list-option>
        <m3e-list-option>Second</m3e-list-option>
        <m3e-list-option disabled>Unavailable</m3e-list-option>
        <m3e-list-option>Last</m3e-list-option>
      </m3e-selection-list>
    `);
    const list = page.getByRole("listbox", { name: "Navigation" });
    const first = list.getByRole("option", { name: "First" });
    const second = list.getByRole("option", { name: "Second" });
    const last = list.getByRole("option", { name: "Last" });

    await first.focus();
    await page.keyboard.press("ArrowDown");
    await expect(second).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(last).toBeFocused();
    await page.keyboard.press("Space");
    await expect(last).toHaveAttribute("aria-selected", "true");
  });
});

test.describe("m3e-expandable-list-item", () => {
  test("toggles nested items and updates expanded state", async ({ page, render }) => {
    await render(`
      <m3e-list>
        <m3e-expandable-list-item>
          Fruits
          <div slot="items">
            <m3e-list-item>Apples</m3e-list-item>
            <m3e-list-item>Oranges</m3e-list-item>
          </div>
        </m3e-expandable-list-item>
      </m3e-list>
    `);
    const toggle = page.getByRole("button", { name: "Fruits" });
    const apples = page.locator("m3e-list-item").filter({ hasText: "Apples" });

    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(apples).toBeHidden();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "true");
    await expect(apples).toBeVisible();
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-expanded", "false");
    await expect(apples).toBeHidden();
  });
});
