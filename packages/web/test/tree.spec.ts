import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

type Item = HTMLElement & {
  open: boolean;
  selected: boolean;
  indeterminate: boolean;
  disabled: boolean;
  level: number;
  visible: boolean;
  hasChildItems: boolean;
  parentItem: Item | null;
  childItems: Item[];
  path: Item[];
  expand(descendants?: boolean): void;
  collapse(descendants?: boolean): void;
  toggle(): void;
};

type Tree = HTMLElement & {
  multi: boolean;
  cascade: boolean;
  selected: Item[];
  items: Item[];
  expand(descendants?: boolean): void;
  collapse(descendants?: boolean): void;
  select(item: Item, activate?: boolean): void;
  deselect(item: Item): void;
};

const tree = (attrs = "", itemAttrs: Record<string, string> = {}) => `
  <m3e-tree ${attrs}>
    <m3e-tree-item id="a" ${itemAttrs.a ?? ""}>
      <span slot="label">Alpha</span>
      <m3e-tree-item id="a1" ${itemAttrs.a1 ?? ""}><span slot="label">Apple</span></m3e-tree-item>
      <m3e-tree-item id="a2" ${itemAttrs.a2 ?? ""}>
        <span slot="label">Avocado</span>
        <m3e-tree-item id="a2x"><span slot="label">Deep</span></m3e-tree-item>
      </m3e-tree-item>
    </m3e-tree-item>
    <m3e-tree-item id="b" ${itemAttrs.b ?? ""}>
      <span slot="label">Beta</span>
      <m3e-tree-item id="b1"><span slot="label">Banana</span></m3e-tree-item>
    </m3e-tree-item>
    <m3e-tree-item id="c" ${itemAttrs.c ?? ""}><span slot="label">Gamma</span></m3e-tree-item>
  </m3e-tree>
`;

const label = (id: string) => `#${id} > [slot=label]`;

const selectedIds = (page: Page) => page.locator("m3e-tree").evaluate((el) => (el as Tree).selected.map((x) => x.id));

const activeId = (page: Page) => page.locator("m3e-tree").evaluate((el) => el.getAttribute("aria-activedescendant"));

const itemProp = <K extends keyof Item>(page: Page, id: string, prop: K) =>
  page.locator(`#${id}`).evaluate((el, p) => (el as Item)[p as K], prop);

test.describe("m3e-tree", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("has the tree role and is focusable", async ({ page, render }) => {
    await render(tree());

    await expect(page.getByRole("tree")).toBeVisible();
    await expect(page.locator("m3e-tree")).toHaveAttribute("tabindex", "0");
    await expect(page.getByRole("treeitem")).toHaveCount(3);
    await expect(page.locator("m3e-tree")).not.toHaveAttribute("aria-multiselectable");
  });

  test("multi sets aria-multiselectable", async ({ page, render }) => {
    await render(tree());
    const el = page.locator("m3e-tree");

    await el.evaluate((e) => ((e as Tree).multi = true));
    await expect(el).toHaveAttribute("aria-multiselectable", "true");

    await el.evaluate((e) => ((e as Tree).multi = false));
    await expect(el).not.toHaveAttribute("aria-multiselectable");
  });

  test("items expose their hierarchy", async ({ page, render }) => {
    await render(tree());

    expect(await itemProp(page, "a", "level")).toBe(1);
    expect(await itemProp(page, "a2x", "level")).toBe(3);
    expect(await itemProp(page, "a", "hasChildItems")).toBe(true);
    expect(await itemProp(page, "c", "hasChildItems")).toBe(false);
    expect(await page.locator("#a2x").evaluate((e) => (e as Item).parentItem?.id)).toBe("a2");
    expect(await page.locator("#a2x").evaluate((e) => (e as Item).path.map((x) => x.id))).toEqual(["a", "a2", "a2x"]);
    expect(await page.locator("#a").evaluate((e) => (e as Item).childItems.map((x) => x.id))).toEqual(["a1", "a2"]);
    expect(await page.locator("m3e-tree").evaluate((e) => (e as Tree).items.length)).toBe(7);
  });

  test("aria-expanded is only present on items with children", async ({ page, render }) => {
    await render(tree());

    await expect(page.locator("#a")).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator("#c")).not.toHaveAttribute("aria-expanded");

    await page.locator("#a").evaluate((e) => ((e as Item).open = true));
    await expect(page.locator("#a")).toHaveAttribute("aria-expanded", "true");
  });

  test("a leaf item gaining children becomes expandable", async ({ page, render }) => {
    await render(tree());
    await expect(page.locator("#c")).not.toHaveAttribute("aria-expanded");

    await page.locator("#c").evaluate((e) => e.insertAdjacentHTML("beforeend", `<m3e-tree-item>Child</m3e-tree-item>`));

    await expect(page.locator("#c")).toHaveAttribute("aria-expanded", "false");
    expect(await itemProp(page, "c", "hasChildItems")).toBe(true);
  });

  test("items expand, collapse and toggle, but only with children", async ({ page, render }) => {
    await render(tree());
    const a = page.locator("#a");

    await a.evaluate((e) => (e as Item).expand());
    expect(await itemProp(page, "a", "open")).toBe(true);
    await a.evaluate((e) => (e as Item).collapse());
    expect(await itemProp(page, "a", "open")).toBe(false);
    await a.evaluate((e) => (e as Item).toggle());
    expect(await itemProp(page, "a", "open")).toBe(true);

    await page.locator("#c").evaluate((e) => (e as Item).expand());
    expect(await itemProp(page, "c", "open")).toBe(false);
  });

  test("expand and collapse can include descendants", async ({ page, render }) => {
    await render(tree());
    const el = page.locator("m3e-tree");

    await el.evaluate((e) => (e as Tree).expand(true));
    expect(await page.locator("m3e-tree-item").evaluateAll((xs) => xs.map((x) => (x as Item).open))).toEqual([
      true,
      false,
      true,
      false,
      true,
      false,
      false,
    ]);

    await el.evaluate((e) => (e as Tree).collapse(true));
    expect(await page.locator("m3e-tree-item").evaluateAll((xs) => xs.every((x) => !(x as Item).open))).toBe(true);
  });

  test("an item is visible only when all ancestors are open", async ({ page, render }) => {
    await render(tree());

    expect(await itemProp(page, "a1", "visible")).toBe(false);
    await page.locator("#a").evaluate((e) => (e as Item).expand());
    expect(await itemProp(page, "a1", "visible")).toBe(true);
    expect(await itemProp(page, "a2x", "visible")).toBe(false);
  });

  test("raises opening, opened, closing and closed", async ({ page, render }) => {
    await render(tree());
    const a = page.locator("#a");
    await a.evaluate((e) => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      for (const type of ["opening", "opened", "closing", "closed"]) {
        e.addEventListener(type, () => w.events.push(type));
      }
    });
    const events = () => page.evaluate(() => (window as unknown as { events: string[] }).events);

    await a.evaluate((e) => (e as Item).expand());
    await expect.poll(events).toEqual(["opening", "opened"]);

    await a.evaluate((e) => (e as Item).collapse());
    await expect.poll(events).toEqual(["opening", "opened", "closing", "closed"]);
  });

  test("clicking a parent toggles it and selects it in single selection", async ({ page, render }) => {
    await render(tree());

    await page.locator(label("a")).click();

    expect(await itemProp(page, "a", "open")).toBe(true);
    expect(await selectedIds(page)).toEqual(["a"]);
    await expect(page.locator("#a")).toHaveAttribute("aria-selected", "true");

    await page.locator(label("a")).click();
    expect(await itemProp(page, "a", "open")).toBe(false);
    expect(await selectedIds(page)).toEqual(["a"]);
  });

  test("single selection keeps one selected item and raises change", async ({ page, render }) => {
    await render(tree());
    await page.locator("m3e-tree").evaluate((el) => {
      const w = window as unknown as { changes: number };
      w.changes = 0;
      el.addEventListener("change", () => w.changes++);
    });

    await page.locator(label("c")).click();
    expect(await selectedIds(page)).toEqual(["c"]);

    await page.locator(label("b")).click();
    expect(await selectedIds(page)).toEqual(["b"]);
    await expect(page.locator("#c")).toHaveAttribute("aria-selected", "false");
    expect(await page.evaluate(() => (window as unknown as { changes: number }).changes)).toBeGreaterThanOrEqual(2);
  });

  test("selecting a leaf in single selection stays selected when clicked again", async ({ page, render }) => {
    await render(tree());

    await page.locator(label("c")).click();
    await page.locator(label("c")).click();

    expect(await selectedIds(page)).toEqual(["c"]);
  });

  test("multi selection toggles items and uses aria-checked", async ({ page, render }) => {
    await render(tree(`multi`));

    await page.locator(label("c")).click();
    await expect(page.locator("#c")).toHaveAttribute("aria-checked", "true");
    await expect(page.locator("#c")).not.toHaveAttribute("aria-selected");

    await page.locator(label("b")).click();
    await page.locator("#b").evaluate((e) => (e as Item).expand());
    await page.locator(label("b1")).click();
    expect((await selectedIds(page)).sort()).toEqual(["b1", "c"]);

    await page.locator(label("c")).click();
    await expect(page.locator("#c")).toHaveAttribute("aria-checked", "false");
    expect((await selectedIds(page)).sort()).toEqual(["b1"]);
  });

  test("multi selection renders a checkbox that selects its item", async ({ page, render }) => {
    await render(tree(`multi`));

    const checkbox = page.locator("#c").locator("m3e-pseudo-checkbox");
    await expect(checkbox).toBeVisible();
    await checkbox.click();

    expect(await selectedIds(page)).toEqual(["c"]);
    await checkbox.click();
    expect(await selectedIds(page)).toEqual([]);
  });

  test("cascade selects descendants and marks partial parents indeterminate", async ({ page, render }) => {
    await render(tree(`multi cascade`));
    await page.locator("m3e-tree").evaluate((e) => (e as Tree).expand(true));

    await page.locator("#a1 m3e-pseudo-checkbox").click();
    expect((await selectedIds(page)).sort()).toEqual(["a1"]);
    expect(await itemProp(page, "a", "indeterminate")).toBe(true);
    await expect(page.locator("#a")).toHaveAttribute("aria-checked", "mixed");

    await page.locator("#a2x m3e-pseudo-checkbox").click();
    expect((await selectedIds(page)).sort()).toEqual(["a", "a1", "a2", "a2x"]);
    expect(await itemProp(page, "a", "indeterminate")).toBe(false);
    await expect(page.locator("#a")).toHaveAttribute("aria-checked", "true");

    await page.locator("#a1 m3e-pseudo-checkbox").click();
    expect((await selectedIds(page)).sort()).toEqual(["a2", "a2x"]);
    await expect(page.locator("#a")).toHaveAttribute("aria-checked", "mixed");
  });

  test("cascade selects and deselects all descendants of a parent", async ({ page, render }) => {
    await render(tree(`multi cascade`));

    await page.locator("#a > m3e-pseudo-checkbox, #a > .base m3e-pseudo-checkbox").first().click();
    expect((await selectedIds(page)).sort()).toEqual(["a", "a1", "a2", "a2x"]);

    await page.locator("#a .base m3e-pseudo-checkbox").first().click();
    expect(await selectedIds(page)).toEqual([]);
  });

  test("select and deselect work programmatically and raise change", async ({ page, render }) => {
    await render(tree());
    await page.locator("m3e-tree").evaluate((el) => {
      const w = window as unknown as { changes: number };
      w.changes = 0;
      el.addEventListener("change", () => w.changes++);
    });

    await page.locator("m3e-tree").evaluate((el) => (el as Tree).select(document.querySelector("#c") as Item));
    expect(await selectedIds(page)).toEqual(["c"]);

    await page.locator("m3e-tree").evaluate((el) => (el as Tree).deselect(document.querySelector("#c") as Item));
    expect(await selectedIds(page)).toEqual([]);
    expect(await page.evaluate(() => (window as unknown as { changes: number }).changes)).toBe(2);
  });

  test("disabled items ignore clicks", async ({ page, render }) => {
    await render(tree("", { c: "disabled" }));

    await page.locator(label("c")).click({ force: true });

    expect(await selectedIds(page)).toEqual([]);
  });

  test("disabling a parent disables its descendants", async ({ page, render }) => {
    await render(tree());

    await page.locator("#a").evaluate((e) => ((e as Item).disabled = true));

    await expect.poll(() => itemProp(page, "a1", "disabled")).toBe(true);
    expect(await itemProp(page, "a2x", "disabled")).toBe(true);
  });

  test("arrow keys move the active item through visible items", async ({ page, render }) => {
    await render(tree());
    await page.locator(label("c")).click();
    await page.locator("m3e-tree").focus();

    await page.keyboard.press("Home");
    expect(await activeId(page)).toBe("a");
    await page.keyboard.press("ArrowDown");
    expect(await activeId(page)).toBe("b");
    await page.keyboard.press("ArrowDown");
    expect(await activeId(page)).toBe("c");
    await page.keyboard.press("ArrowUp");
    expect(await activeId(page)).toBe("b");
    await page.keyboard.press("End");
    expect(await activeId(page)).toBe("c");
  });

  test("Right expands, Left collapses then moves to the parent", async ({ page, render }) => {
    await render(tree());
    await page.locator(label("c")).click();
    await page.locator("m3e-tree").focus();
    await page.keyboard.press("Home");

    await page.keyboard.press("ArrowRight");
    expect(await itemProp(page, "a", "open")).toBe(true);

    await page.keyboard.press("ArrowDown");
    expect(await activeId(page)).toBe("a1");
    await page.keyboard.press("ArrowLeft");
    expect(await activeId(page)).toBe("a");

    await page.keyboard.press("ArrowLeft");
    await expect.poll(() => itemProp(page, "a", "open")).toBe(false);
  });

  test("keyboard navigation skips collapsed and disabled items", async ({ page, render }) => {
    await render(tree("", { b: "disabled" }));
    await page.locator(label("c")).click();
    await page.locator("m3e-tree").focus();
    await page.keyboard.press("Home");

    await page.keyboard.press("ArrowDown");

    expect(await activeId(page)).toBe("c");
  });

  test("the asterisk key expands the item and its descendants", async ({ page, render }) => {
    await render(tree());
    await page.locator(label("c")).click();
    await page.locator("m3e-tree").focus();
    await page.keyboard.press("Home");

    await page.keyboard.press("*");

    expect(await itemProp(page, "a", "open")).toBe(true);
    expect(await itemProp(page, "a2", "open")).toBe(true);
  });

  test("Enter and Space select the active item", async ({ page, render }) => {
    await render(tree());
    await page.locator(label("c")).click();
    await page.locator("m3e-tree").focus();
    await page.keyboard.press("Home");

    await page.keyboard.press("Enter");
    expect(await selectedIds(page)).toEqual(["a"]);

    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Space");
    expect(await selectedIds(page)).toEqual(["b"]);
  });

  test("Space toggles selection in multi selection", async ({ page, render }) => {
    await render(tree(`multi`));
    await page.locator("m3e-tree").focus();
    await page.keyboard.press("Home");

    await page.keyboard.press("Space");
    expect(await selectedIds(page)).toEqual(["a"]);
    await page.keyboard.press("Space");
    expect(await selectedIds(page)).toEqual([]);
  });

  test("typing jumps to a matching item", async ({ page, render }) => {
    await render(tree());
    await page.locator(label("c")).click();
    await page.locator("m3e-tree").focus();
    await page.keyboard.press("Home");

    await page.keyboard.type("g");

    await expect.poll(() => activeId(page)).toBe("c");
  });

  test("collapsing an ancestor moves the active item to the nearest visible parent", async ({ page, render }) => {
    await render(tree());
    await page.locator("m3e-tree").evaluate((e) => (e as Tree).expand(true));
    await page.locator(label("a2x")).click();
    expect(await activeId(page)).toBe("a2x");

    await page.locator("m3e-tree").evaluate((e) => (e as Tree).collapse(true));

    expect(await activeId(page)).toBe("a");
  });

  test("selecting an item clicks its nested link", async ({ page, render }) => {
    await render(`
      <m3e-tree>
        <m3e-tree-item id="l"><a slot="label" href="#target">Link</a></m3e-tree-item>
      </m3e-tree>
    `);

    await page.locator(label("l")).click();

    expect(await page.evaluate(() => location.hash)).toBe("#target");
    await expect(page.locator("#l a")).toHaveAttribute("tabindex", "-1");
  });

  test("a selected item marks its slotted icons as filled", async ({ page, render }) => {
    await render(`
      <m3e-tree>
        <m3e-tree-item id="i"><m3e-icon slot="icon" name="home"></m3e-icon><span slot="label">Home</span></m3e-tree-item>
      </m3e-tree>
    `);

    await page.locator(label("i")).click();

    await expect(page.locator("#i > m3e-icon")).toHaveAttribute("filled", "");
  });
});
