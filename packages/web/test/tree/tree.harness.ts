import type { Page } from "@playwright/test";

type TreeItem = HTMLElement & {
  open: boolean;
  selected: boolean;
  indeterminate: boolean;
  disabled: boolean;
  level: number;
  visible: boolean;
  hasChildItems: boolean;
  parentItem: TreeItem | null;
  childItems: TreeItem[];
  path: TreeItem[];
  expand(descendants?: boolean): void;
  collapse(descendants?: boolean): void;
  toggle(): void;
};

type TreeElement = HTMLElement & {
  multi: boolean;
  cascade: boolean;
  selected: TreeItem[];
  items: TreeItem[];
  expand(descendants?: boolean): void;
  collapse(descendants?: boolean): void;
  select(item: TreeItem, activate?: boolean): void;
  deselect(item: TreeItem): void;
};

type TreeItemState = "open" | "selected" | "indeterminate" | "disabled" | "level" | "visible" | "hasChildItems";

const itemNames = ["a", "a1", "a2", "a2x", "b", "b1", "c"];

export class TreeHarness {
  markup = "";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get tree() {
    return this.page.locator("m3e-tree");
  }

  item(id: string) {
    return this.page.locator(`#${id}`);
  }

  label(id: string) {
    return this.page.locator(`#${id} > [slot=label]`);
  }

  checkbox(id: string) {
    return this.page.locator(`#${id} > m3e-pseudo-checkbox, #${id} > .base m3e-pseudo-checkbox`).first();
  }

  prepare(attributes = "", itemAttributes: Record<string, string> = {}) {
    this.markup = `
      <m3e-tree aria-label="Project files" ${attributes}>
        <m3e-tree-item id="a" ${itemAttributes.a ?? ""}>
          <span slot="label">Alpha</span>
          <m3e-tree-item id="a1" ${itemAttributes.a1 ?? ""}><span slot="label">Apple</span></m3e-tree-item>
          <m3e-tree-item id="a2" ${itemAttributes.a2 ?? ""}>
            <span slot="label">Avocado</span>
            <m3e-tree-item id="a2x"><span slot="label">Deep</span></m3e-tree-item>
          </m3e-tree-item>
        </m3e-tree-item>
        <m3e-tree-item id="b" ${itemAttributes.b ?? ""}>
          <span slot="label">Beta</span>
          <m3e-tree-item id="b1"><span slot="label">Banana</span></m3e-tree-item>
        </m3e-tree-item>
        <m3e-tree-item id="c" ${itemAttributes.c ?? ""}><span slot="label">Gamma</span></m3e-tree-item>
      </m3e-tree>`;
  }

  async render(markup = this.markup) {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.renderFixture(markup);
  }

  async selectedIds() {
    return this.tree.evaluate((element) => (element as TreeElement).selected.map((item) => item.id));
  }

  activeId() {
    return this.tree.getAttribute("aria-activedescendant");
  }

  itemState(id: string, state: TreeItemState) {
    return this.item(id).evaluate((element, state) => {
      const item = element as TreeItem;
      return item[state];
    }, state);
  }

  async hierarchy(id: string) {
    return this.item(id).evaluate((element) => {
      const item = element as TreeItem;
      return {
        level: item.level,
        parent: item.parentItem?.id ?? null,
        path: item.path.map((part) => part.id),
        children: item.childItems.map((child) => child.id),
      };
    });
  }

  itemCount() {
    return this.tree.evaluate((element) => (element as TreeElement).items.length);
  }

  openStates() {
    return this.page.locator("m3e-tree-item").evaluateAll((items) => items.map((item) => (item as TreeItem).open));
  }

  setMulti(enabled: boolean) {
    return this.tree.evaluate((element, enabled) => ((element as TreeElement).multi = enabled), enabled);
  }

  expandAll() {
    return this.tree.evaluate((element) => (element as TreeElement).expand(true));
  }

  collapseAll() {
    return this.tree.evaluate((element) => (element as TreeElement).collapse(true));
  }

  expandItem(id: string) {
    return this.item(id).evaluate((element) => (element as TreeItem).expand());
  }

  collapseItem(id: string) {
    return this.item(id).evaluate((element) => (element as TreeItem).collapse());
  }

  toggleItem(id: string) {
    return this.item(id).evaluate((element) => (element as TreeItem).toggle());
  }

  addRootItem(id: string, name: string) {
    return this.tree.evaluate(
      (element, { id, name }) => {
        const item = document.createElement("m3e-tree-item");
        item.id = id;
        const label = document.createElement("span");
        label.slot = "label";
        label.textContent = name;
        item.append(label);
        element.append(item);
      },
      { id, name },
    );
  }

  addChild(id: string) {
    return this.item(id).evaluate((element) =>
      element.insertAdjacentHTML("beforeend", `<m3e-tree-item>Child</m3e-tree-item>`),
    );
  }

  recordItemEvents(id: string) {
    return this.item(id).evaluate((element) => {
      element.dataset.events = "";
      for (const name of ["opening", "opened", "closing", "closed"]) {
        element.addEventListener(name, () => {
          element.dataset.events = `${element.dataset.events ?? ""}${name},`;
        });
      }
    });
  }

  itemEvents(id: string) {
    return this.item(id).evaluate((element) => element.dataset.events?.split(",").filter(Boolean) ?? []);
  }

  recordChangeEvents() {
    return this.tree.evaluate((element) => {
      element.dataset.changeCount = "0";
      element.addEventListener("change", () => {
        element.dataset.changeCount = `${Number(element.dataset.changeCount ?? "0") + 1}`;
      });
    });
  }

  changeCount() {
    return this.tree.evaluate((element) => Number(element.dataset.changeCount ?? "0"));
  }

  async select(id: string) {
    return this.tree.evaluate((element, id) => {
      const item = element.querySelector(`#${id}`);
      if (!(item instanceof HTMLElement)) {
        throw new Error(`Tree item "${id}" was not found`);
      }
      (element as TreeElement).select(item as TreeItem);
    }, id);
  }

  async deselect(id: string) {
    return this.tree.evaluate((element, id) => {
      const item = element.querySelector(`#${id}`);
      if (!(item instanceof HTMLElement)) {
        throw new Error(`Tree item "${id}" was not found`);
      }
      (element as TreeElement).deselect(item as TreeItem);
    }, id);
  }

  focus() {
    return this.tree.focus();
  }

  press(key: string) {
    return this.page.keyboard.press(key);
  }

  type(text: string) {
    return this.page.keyboard.type(text);
  }

  setRightToLeft() {
    return this.page.evaluate(() => document.documentElement.setAttribute("dir", "rtl"));
  }

  async hierarchyIsExpected() {
    const [a, deep] = await Promise.all([this.hierarchy("a"), this.hierarchy("a2x")]);
    return (
      a.level === 1 &&
      deep.level === 3 &&
      deep.parent === "a2" &&
      deep.path.join(",") === "a,a2,a2x" &&
      a.children.join(",") === "a1,a2" &&
      (await this.itemCount()) === itemNames.length
    );
  }
}
