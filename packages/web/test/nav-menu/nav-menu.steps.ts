import type {
  M3eNavMenuElement,
  M3eNavMenuItemElement,
} from "@m3e/web/nav-menu";
import type { Download, Page } from "@playwright/test";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { NavMenuHarness } from "./nav-menu.harness";

class LinkNavMenuHarness extends NavMenuHarness {
  popup?: Page;
  download?: Download;

  fixture(attributes = "", label = '<span slot="label">Home</span>') {
    this.html = `<button id="before-link-menu">Before</button><m3e-nav-menu id="menu" aria-label="Docs">
      <m3e-nav-menu-item id="home" ${attributes}>${label}</m3e-nav-menu-item>
    </m3e-nav-menu><button id="after-link-menu">After</button>`;
  }

  get anchor() {
    return this.item("home").locator(".base > a");
  }
}

export const test = mergeTests(componentTest, bddTest).extend<{
  navMenu: NavMenuHarness;
  links: LinkNavMenuHarness;
}>({
  navMenu: async ({ page, render }, use) =>
    use(new NavMenuHarness(page, render)),
  links: async ({ page, render }, use) =>
    use(new LinkNavMenuHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a navigation menu with nested destinations", ({ navMenu }) =>
  navMenu.standard(),
);
When("the navigation menu renders", async ({ navMenu }) => navMenu.render());
Then(
  "the navigation menu is a tree named {string}",
  async ({ page }, name: string) =>
    expect(page.getByRole("tree", { name, exact: true })).toBeVisible(),
);
Then("the tree exposes {int} items", async ({ navMenu }, count: number) =>
  expect(navMenu.menu.getByRole("treeitem")).toHaveCount(count),
);
Then("item {string} is collapsed", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).toHaveAttribute("aria-expanded", "false"),
);
Then("item {string} is not expandable", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).not.toHaveAttribute("aria-expanded"),
);
Then("item {string} is disabled", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).toHaveAttribute("aria-disabled", "true"),
);
When("the application expands all navigation menu items", async ({ navMenu }) =>
  navMenu.all("expand"),
);
Then("all navigation menu items have unique IDs", async ({ navMenu }) => {
  const ids = await navMenu.menu
    .locator("m3e-nav-menu-item")
    .evaluateAll((items) => items.map((item) => item.id));
  expect(ids.every(Boolean)).toBe(true);
  expect(new Set(ids).size).toBe(ids.length);
});
When(
  "the application collapses all navigation menu items",
  async ({ navMenu }) => navMenu.all("collapse"),
);
Then("item {string} is hidden", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).toBeHidden(),
);

Given("a navigation menu with a labelled group", ({ navMenu }) => {
  navMenu.html = `<m3e-nav-menu id="menu"><m3e-nav-menu-item-group id="group">
      <span slot="label">Reference</span>
      <m3e-nav-menu-item><span slot="label">API</span></m3e-nav-menu-item>
    </m3e-nav-menu-item-group></m3e-nav-menu><m3e-nav-menu id="second"></m3e-nav-menu>`;
});
Then(
  "a group named {string} contains the tree item {string}",
  async ({ page }, group: string, item: string) => {
    const locator = page.getByRole("group", { name: group, exact: true });
    await expect(locator).toBeVisible();
    await expect(
      locator.getByRole("treeitem", { name: item, exact: true }),
    ).toBeVisible();
  },
);

Given("a navigation menu with destinations without IDs", ({ navMenu }) => {
  navMenu.html = `<m3e-nav-menu id="menu"><m3e-nav-menu-item><span slot="label">First</span>
      <m3e-nav-menu-item><span slot="label">Nested</span></m3e-nav-menu-item>
    </m3e-nav-menu-item><m3e-nav-menu-item><span slot="label">Second</span></m3e-nav-menu-item></m3e-nav-menu>`;
});

When(
  "the user clicks navigation label {string}",
  async ({ page }, label: string) =>
    page.getByText(label, { exact: true }).click(),
);
Then("item {string} is expanded", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).toHaveAttribute("aria-expanded", "true"),
);
Then("item {string} is visible", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).toBeVisible(),
);

Then(
  "item {string} has level {int}, parent {string}, and path {string}",
  async (
    { navMenu },
    id: string,
    level: number,
    parent: string,
    path: string,
  ) => {
    await expect
      .poll(async () => {
        const hierarchy = await navMenu.hierarchy(id);
        return {
          level: hierarchy.level,
          parent: hierarchy.parent,
          path: hierarchy.path,
        };
      })
      .toEqual({ level, parent, path: path.split(", ") });
  },
);
Then(
  "item {string} has children {string}",
  async ({ navMenu }, id: string, children: string) =>
    expect
      .poll(async () => (await navMenu.hierarchy(id)).children)
      .toEqual(children.split(", ")),
);

Then("item {string} is current", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).toHaveAttribute("aria-current", "true"),
);
Then("item {string} is not current", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id)).toHaveAttribute("aria-current", "false"),
);
Then(
  "the navigation menu reports {string} as selected",
  async ({ navMenu }, id: string) =>
    expect.poll(() => navMenu.selected()).toBe(id),
);
Then(
  "item {string} is selected but not current",
  async ({ navMenu }, id: string) => {
    await expect(navMenu.item(id)).toHaveAttribute("selected");
    await expect(navMenu.item(id)).not.toHaveAttribute("aria-current", "true");
  },
);

When(
  "the user attempts to click navigation label {string}",
  async ({ page }, label: string) =>
    page.getByText(label, { exact: true }).click({ force: true }),
);
Then("the navigation menu has no selection", async ({ navMenu }) =>
  expect.poll(() => navMenu.selected()).toBeNull(),
);

When(
  "the application disables item {string}",
  async ({ navMenu }, id: string) =>
    navMenu.item(id).evaluate((item) => item.setAttribute("disabled", "")),
);

When("the user focuses the navigation menu", async ({ navMenu }) =>
  navMenu.menu.focus(),
);
Then(
  "item {string} is the active descendant",
  async ({ navMenu }, id: string) =>
    expect(navMenu.menu).toHaveAttribute("aria-activedescendant", id),
);
When(
  "the user presses {string} in the navigation menu",
  async ({ page }, key: string) => page.keyboard.press(key),
);

Given("a navigation menu with a linked destination", ({ navMenu }) => {
  navMenu.html = `<m3e-nav-menu id="menu">
    <m3e-nav-menu-item id="home"><a slot="label" href="#home-page">Home</a></m3e-nav-menu-item>
  </m3e-nav-menu>`;
});
Then(
  "the navigation menu link navigates to {string}",
  async ({ page }, hash: string) =>
    expect(page).toHaveURL(new RegExp(`${hash}$`)),
);

When(
  "the application adds a top-level destination {string}",
  async ({ navMenu }, label: string) =>
    navMenu.menu.evaluate((menu, label) => {
      const item = document.createElement("m3e-nav-menu-item");
      item.id = label.toLowerCase();
      const span = document.createElement("span");
      span.slot = "label";
      span.textContent = label;
      item.append(span);
      menu.append(item);
    }, label),
);
Then(
  "the navigation menu contains item {string}",
  async ({ navMenu }, id: string) =>
    expect.poll(() => navMenu.itemIds()).toContain(id),
);
When("the application removes item {string}", async ({ navMenu }, id: string) =>
  navMenu.item(id).evaluate((item) => item.remove()),
);
Then(
  "the navigation menu does not contain item {string}",
  async ({ navMenu }, id: string) =>
    expect.poll(() => navMenu.itemIds()).not.toContain(id),
);

When(
  "the application adds destination {string} under item {string}",
  async ({ navMenu }, label: string, parent: string) =>
    navMenu.item(parent).evaluate((element, label) => {
      const item = document.createElement("m3e-nav-menu-item");
      item.id = label.toLowerCase();
      const span = document.createElement("span");
      span.slot = "label";
      span.textContent = label;
      item.append(span);
      element.append(item);
    }, label),
);

Then("the navigation menu has no active descendant", async ({ navMenu }) =>
  expect(navMenu.menu).not.toHaveAttribute("aria-activedescendant"),
);

When(
  "the application moves item {string} under item {string}",
  async ({ navMenu }, id: string, parent: string) =>
    navMenu
      .item(id)
      .evaluate(
        (item, parent) => document.getElementById(parent)!.append(item),
        parent,
      ),
);

Given("two navigation menus with destinations", ({ navMenu }) => {
  navMenu.html = `<m3e-nav-menu id="menu"><m3e-nav-menu-item id="overview">
      <span slot="label">Overview</span></m3e-nav-menu-item></m3e-nav-menu>
    <m3e-nav-menu id="second"><m3e-nav-menu-item id="other">
      <span slot="label">Other</span></m3e-nav-menu-item></m3e-nav-menu>`;
});
When(
  "the application moves item {string} to the second menu",
  async ({ navMenu }, id: string) =>
    navMenu
      .item(id)
      .evaluate((item) => document.getElementById("second")!.append(item)),
);
Then("the second menu contains item {string}", async ({ page }, id: string) =>
  expect
    .poll(() =>
      page
        .locator("#second")
        .evaluate((menu) =>
          (menu as M3eNavMenuElement).items.map(
            (item: M3eNavMenuItemElement) => item.id,
          ),
        ),
    )
    .toContain(id),
);
Then(
  "the second menu reports {string} as selected",
  async ({ page }, id: string) =>
    expect
      .poll(() =>
        page
          .locator("#second")
          .evaluate((menu) => (menu as M3eNavMenuElement).selected?.id ?? null),
      )
      .toBe(id),
);

When("the application moves the group to another container", async ({ page }) =>
  page
    .locator("#group")
    .evaluate((group) => document.getElementById("second")!.append(group)),
);

When(
  "the application adds a nested destination while the menu is detached",
  async ({ navMenu }) =>
    navMenu.menu.evaluate((menu) => {
      menu.remove();
      const item = document.createElement("m3e-nav-menu-item");
      item.id = "news";
      item.innerHTML = '<span slot="label">News</span>';
      menu.querySelector("#guides")!.append(item);
      document.getElementById("destination")!.append(menu);
    }),
);

Given("a navigation menu with a first-class link", ({ links }) =>
  links.fixture('href="#home-page"'),
);
When("the link navigation menu renders", async ({ links }) => links.render());
Then(
  "the linked destination is a tree item named {string}",
  async ({ links }, name: string) =>
    expect(
      links.menu.getByRole("treeitem", { name, exact: true }),
    ).toBeVisible(),
);
Then(
  "the link navigation menu has one accessible tree item",
  async ({ links }) => expect(links.menu.getByRole("treeitem")).toHaveCount(1),
);
Then("the link destination is not current", async ({ links }) =>
  expect(links.item("home")).toHaveAttribute("aria-current", "false"),
);
When("the user focuses the link navigation menu", async ({ links }) =>
  links.menu.focus(),
);
Then(
  "the linked destination is the active descendant of the focused tree",
  async ({ links }) => {
    await expect(links.menu).toBeFocused();
    await expect(links.menu).toHaveAttribute("aria-activedescendant", "home");
  },
);

When(
  "the user presses {string} in the link navigation menu",
  async ({ links }, key: string) => links.page.keyboard.press(key),
);
Then("focus moves past the link navigation menu", async ({ links }) =>
  expect(links.page.locator("#after-link-menu")).toBeFocused(),
);

When("the user clicks the first-class destination", async ({ links }) =>
  links.anchor.click(),
);
Then("the link destination is current", async ({ links }) =>
  expect(links.item("home")).toHaveAttribute("aria-current", "true"),
);
Then(
  "the link navigation menu reports the destination as selected",
  async ({ links }) => expect.poll(() => links.selected()).toBe("home"),
);
Then(
  "the link navigation menu navigates to {string}",
  async ({ links }, hash: string) =>
    expect.poll(() => links.page.evaluate(() => location.hash)).toBe(hash),
);

Given("a navigation menu with a link targeting an iframe", ({ links }) => {
  links.fixture('href="#home-page" target="content-frame"');
  links.html += '<iframe name="content-frame" title="Destination"></iframe>';
});
When("the user focuses the control before the link navigation menu", async ({ links }) =>
  links.page.locator("#before-link-menu").focus(),
);
Then("the destination iframe navigates to the link", async ({ links }) =>
  expect.poll(() => links.page.frame({ name: "content-frame" })?.url()).toContain("#home-page"),
);

Then("the linked destination has a visible focus ring", async ({ links }) =>
  expect(links.item("home").locator("m3e-focus-ring .outline")).toHaveClass(/visible/),
);
Then("the linked destination does not have a visible focus ring", async ({ links }) =>
  expect(links.item("home").locator("m3e-focus-ring .outline")).not.toHaveClass(/visible/),
);

Given("forced colors are active for the link navigation menu", async ({ page }) =>
  page.emulateMedia({ forcedColors: "active" }),
);

When("the application clicks the linked item", async ({ links }) =>
  links.item("home").evaluate((item) => (item as HTMLElement).click()),
);

When("the application observes clicks on the linked item", async ({ links }) =>
  links.item("home").evaluate((item) => {
    item.setAttribute("data-click-count", "0");
    item.addEventListener("click", (event) => {
      item.setAttribute("data-click-count", String(Number(item.getAttribute("data-click-count")) + 1));
      item.setAttribute("data-click-target", event.target === item ? "item" : "other");
      setTimeout(() => item.setAttribute("data-default-prevented", String(event.defaultPrevented)));
    });
  }),
);
Then("the linked item receives one click and the internal link default is prevented", async ({ links }) => {
  await expect(links.item("home")).toHaveAttribute("data-click-count", "1");
  await expect(links.item("home")).toHaveAttribute("data-click-target", "item");
  await expect(links.item("home")).toHaveAttribute("data-default-prevented", "true");
});

When("the application changes the current fragment", async ({ links }) =>
  links.page.evaluate(() => {
    location.hash = "#other";
  }),
);

Given("a navigation menu with a disabled first-class link", ({ links }) =>
  links.fixture('href="#home-page" disabled'),
);
Then("the linked destination is exposed as disabled", async ({ links }) =>
  expect(links.item("home")).toHaveAttribute("aria-disabled", "true"),
);
Then("the first-class destination has no internal link", async ({ links }) =>
  expect(links.anchor).toHaveCount(0),
);
When(
  "the user attempts to click the disabled link destination",
  async ({ links }) =>
    links.item("home").locator(".base").first().click({ force: true }),
);
Then(
  "the link navigation menu has no selected destination",
  async ({ links }) => expect.poll(() => links.selected()).toBeNull(),
);
Then("the link navigation menu has not navigated", async ({ links }) =>
  expect(links.page).toHaveURL("about:blank"),
);

Given("a navigation menu with a parent that has an href", ({ links }) => {
  links.html = `<m3e-nav-menu id="menu">
    <m3e-nav-menu-item id="home" href="#home-page">
      <span slot="label">Home</span>
      <m3e-nav-menu-item><span slot="label">Child</span></m3e-nav-menu-item>
    </m3e-nav-menu-item>
  </m3e-nav-menu>`;
});
When("the user clicks the parent destination", async ({ links }) =>
  links.page.getByText("Home", { exact: true }).click(),
);
Then("the parent destination is expanded", async ({ links }) =>
  expect(links.item("home")).toHaveAttribute("aria-expanded", "true"),
);
Then("the parent destination has no internal link", async ({ links }) =>
  expect(links.anchor).toHaveCount(0),
);

Given("a navigation menu with a parent and child that have hrefs", ({ links }) => {
  links.html = `<m3e-nav-menu id="menu">
    <m3e-nav-menu-item id="home" href="#home-page">
      <span slot="label">Home</span>
      <m3e-nav-menu-item id="child" href="#child-page"><span slot="label">Child</span></m3e-nav-menu-item>
    </m3e-nav-menu-item>
  </m3e-nav-menu>`;
});
When("the user clicks the child destination", async ({ links }) =>
  links.item("child").locator(".base > a").click(),
);
Then("the child destination is current", async ({ links }) =>
  expect(links.item("child")).toHaveAttribute("aria-current", "true"),
);

Given(
  "a navigation menu with link target, relationship, and download attributes",
  ({ links }) =>
    links.fixture(
      'href="#home-page" target="_blank" rel="noopener" download="guide.txt"',
    ),
);
Then(
  "the destination link has the specified link attributes",
  async ({ links }) => {
    await expect(links.anchor).toHaveAttribute("href", "#home-page");
    await expect(links.anchor).toHaveAttribute("target", "_blank");
    await expect(links.anchor).toHaveAttribute("rel", "noopener");
    await expect(links.anchor).toHaveAttribute("download", "guide.txt");
    await expect(links.anchor).toHaveAttribute("tabindex", "-1");
    await expect(links.anchor).toHaveAttribute("aria-hidden", "true");
  },
);

Given(
  "a navigation menu with a first-class link opening in a new tab",
  async ({ links }) => {
    await links.page
      .context()
      .route("https://m3e.test/**", (route) =>
        route.fulfill({
          contentType: "text/html",
          body: "<title>Destination</title>",
        }),
      );
    links.fixture('href="https://m3e.test/destination" target="_blank"');
  },
);
When("the user opens the destination using Enter", async ({ links }) => {
  const [popup] = await Promise.all([
    links.page.context().waitForEvent("page"),
    links.page.keyboard.press("Enter"),
  ]);
  links.popup = popup;
});
Then("the new tab navigates to the link destination", async ({ links }) => {
  expect(links.popup).toBeDefined();
  await expect(links.popup!).toHaveURL("https://m3e.test/destination");
  await links.popup!.close();
});

Given("a navigation menu with an unnamed download link", ({ links }) =>
  links.fixture('href="data:text/plain,Navigation%20menu" download'),
);
Then(
  "the destination link has an empty download attribute",
  async ({ links }) => expect(links.anchor).toHaveAttribute("download", ""),
);
When("the user downloads the first-class destination", async ({ links }) => {
  const [download] = await Promise.all([
    links.page.waitForEvent("download"),
    links.anchor.click(),
  ]);
  links.download = download;
});
Then("the destination is downloaded", async ({ links }) => {
  expect(links.download).toBeDefined();
  expect(await links.download!.failure()).toBeNull();
});

When("the application sets an empty download property", async ({ links }) =>
  links.item("home").evaluate((item) => {
    (item as M3eNavMenuItemElement).download = "";
  }),
);
Then(
  "the linked destination has an empty download attribute",
  async ({ links }) =>
    expect(links.item("home")).toHaveAttribute("download", ""),
);

Given(
  "a navigation menu with an external first-class link",
  async ({ links }) => {
    await links.page
      .context()
      .route("https://m3e.test/**", (route) =>
        route.fulfill({
          contentType: "text/html",
          body: "<title>Destination</title>",
        }),
      );
    links.fixture('href="https://m3e.test/destination"');
  },
);
When("the user opens the destination in a new tab", async ({ links }) => {
  const [popup] = await Promise.all([
    links.page.context().waitForEvent("page"),
    links.anchor.click({ modifiers: ["Control"] }),
  ]);
  links.popup = popup;
});
When("the user opens the destination context menu", async ({ links }) => {
  await links.item("home").evaluate((item) => {
    item.addEventListener("contextmenu", (event) => {
      const target = event.composedPath()[0];
      item.setAttribute(
        "data-context-href",
        target instanceof HTMLAnchorElement
          ? (target.getAttribute("href") ?? "")
          : "",
      );
      event.preventDefault();
    });
  });
  await links.anchor.click({ button: "right" });
});
Then("the context menu targets the destination link", async ({ links }) =>
  expect(links.item("home")).toHaveAttribute("data-context-href", "#home-page"),
);

When(
  "the application cancels clicks on the linked destination",
  async ({ links }) =>
    links
      .item("home")
      .evaluate((item) =>
        item.addEventListener("click", (event) => event.preventDefault()),
      ),
);

When(
  "the application changes the link destination to {string}",
  async ({ links }, href: string) =>
    links
      .item("home")
      .evaluate((item, href) => item.setAttribute("href", href), href),
);

Given("a navigation menu with an existing slotted link", ({ links }) =>
  links.fixture("", '<a slot="label" href="#home-page">Home</a>'),
);
When("the application counts slotted link clicks", async ({ links }) =>
  links
    .item("home")
    .locator('a[slot="label"]')
    .evaluate((anchor) => {
      anchor.setAttribute("data-clicks", "0");
      anchor.addEventListener("click", () => {
        anchor.setAttribute(
          "data-clicks",
          String(Number(anchor.getAttribute("data-clicks")) + 1),
        );
      });
    }),
);
When("the user clicks the slotted link", async ({ links }) =>
  links.item("home").locator('a[slot="label"]').click(),
);
Then("the slotted link was clicked once", async ({ links }) =>
  expect(links.item("home").locator('a[slot="label"]')).toHaveAttribute(
    "data-clicks",
    "1",
  ),
);

Given("a navigation menu with an external slotted link", async ({ links }) => {
  await links.page.context().route("https://m3e.test/**", (route) =>
    route.fulfill({
      contentType: "text/html",
      body: "<title>Destination</title>",
    }),
  );
  links.fixture("", '<a slot="label" href="https://m3e.test/destination">Home</a>');
});
When("the user opens the slotted link in a new tab", async ({ links }) => {
  const [popup] = await Promise.all([
    links.page.context().waitForEvent("page"),
    links.item("home").locator('a[slot="label"]').click({ modifiers: ["Control"] }),
  ]);
  links.popup = popup;
});

When("the application cancels clicks on the slotted link", async ({ links }) =>
  links.item("home").locator('a[slot="label"]').evaluate((anchor) =>
    anchor.addEventListener("click", (event) => event.preventDefault()),
  ),
);

Given("a navigation menu with a disabled slotted link", ({ links }) =>
  links.fixture("disabled", '<a slot="label" href="#home-page">Home</a>'),
);
When(
  "the user attempts to click the disabled slotted link",
  async ({ links }) =>
    links.item("home").locator('a[slot="label"]').click({ force: true }),
);

Given("a navigation menu with nested destinations in RTL", ({ navMenu }) => {
  navMenu.standard();
  navMenu.direction = "rtl";
});

When("the application replaces the group label with {string}", async ({ page }, text: string) =>
  page.locator("#group").evaluate((group, text) => {
    const oldLabel = group.querySelector('[slot="label"]');
    const destination = document.getElementById("destination");
    if (!oldLabel || !destination) throw new Error("Missing group label or destination");
    const label = document.createElement("span");
    label.slot = "label";
    label.textContent = text;
    oldLabel.replaceWith(label);
    destination.append(oldLabel);
  }, text),
);
Then("the group references its current label", async ({ page }) => {
  await expect.poll(() => page.locator("#group").evaluate((group) => {
    const id = group.querySelector('[slot="label"]')?.id;
    return Boolean(id) && group.getAttribute("aria-labelledby") === id;
  })).toBe(true);
});
Then("the old group label has no generated ID", async ({ page }) =>
  expect(page.locator('#destination [slot="label"]')).not.toHaveAttribute("id", /.+/),
);

Given("a navigation menu with a group label using a consumer ID", ({ navMenu }) => {
  navMenu.html = `<m3e-nav-menu id="menu"><m3e-nav-menu-item-group id="group">
    <span id="reference-label" slot="label">Reference</span>
    <m3e-nav-menu-item><span slot="label">API</span></m3e-nav-menu-item>
  </m3e-nav-menu-item-group></m3e-nav-menu>`;
});
Then("the old group label retains ID {string}", async ({ page }, id: string) =>
  expect(page.locator('#destination [slot="label"]')).toHaveAttribute("id", id),
);

When("the application removes the group label", async ({ page }) =>
  page.locator('#group > [slot="label"]').evaluate((label) => {
    const destination = document.getElementById("destination");
    if (!destination) throw new Error("Missing group label destination");
    destination.append(label);
  }),
);
Then("the group has no labelled-by reference", async ({ page }) =>
  expect(page.locator("#group")).not.toHaveAttribute("aria-labelledby"),
);
Then("the group label presentation is hidden", async ({ page }) =>
  expect.poll(() => page.locator("#group").evaluate((group) => {
    const label = group.shadowRoot?.querySelector(".label");
    if (!label) throw new Error("Missing group label presentation");
    return getComputedStyle(label).display;
  })).toBe("none"),
);
When("the application adds group label {string} with ID {string}", async ({ page }, text: string, id: string) =>
  page.locator("#group").evaluate((group, { text, id }) => {
    const label = document.createElement("span");
    label.slot = "label";
    label.id = id;
    label.textContent = text;
    group.prepend(label);
  }, { text, id }),
);
Then("the group references label ID {string}", async ({ page }, id: string) =>
  expect(page.locator("#group")).toHaveAttribute("aria-labelledby", id),
);

When("the application expands item {string} without descendants", async ({ navMenu }, id: string) =>
  navMenu.targeted("expand", id, false),
);
When("the application expands item {string} with descendants", async ({ navMenu }, id: string) =>
  navMenu.targeted("expand", id, true),
);

When("the application collapses item {string} without descendants", async ({ navMenu }, id: string) =>
  navMenu.targeted("collapse", id, false),
);
When("the application collapses item {string} with descendants", async ({ navMenu }, id: string) =>
  navMenu.targeted("collapse", id, true),
);

Given("a navigation menu with destination icons", ({ navMenu }) => {
  navMenu.html = `<m3e-nav-menu id="menu">
    <m3e-nav-menu-item id="overview"><m3e-icon slot="icon" aria-hidden="true">home</m3e-icon>
      <span slot="label">Overview</span></m3e-nav-menu-item>
    <m3e-nav-menu-item id="archive"><m3e-icon slot="icon" aria-hidden="true">archive</m3e-icon>
      <span slot="label">Archive</span></m3e-nav-menu-item>
  </m3e-nav-menu>`;
});
Then("the icon in item {string} is filled", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id).locator('m3e-icon[slot="icon"]')).toHaveAttribute("filled"),
);
Then("the icon in item {string} is not filled", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id).locator('m3e-icon[slot="icon"]')).not.toHaveAttribute("filled"),
);

Then("item {string} has no visible icon presentation", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id).locator(".base > .icon")).toBeHidden(),
);
When("the application adds an icon to item {string}", async ({ navMenu }, id: string) =>
  navMenu.item(id).evaluate((item) => {
    const icon = document.createElement("m3e-icon");
    icon.slot = "icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "home";
    item.prepend(icon);
  }),
);
Then("item {string} has visible icon presentation", async ({ navMenu }, id: string) =>
  expect(navMenu.item(id).locator(".base > .icon")).toBeVisible(),
);
Then("item {string} is a tree item named {string}", async ({ navMenu }, id: string, name: string) =>
  expect(navMenu.menu.getByRole("treeitem", { name, exact: true })).toHaveAttribute("id", id),
);
When("the application removes the icon from item {string}", async ({ navMenu }, id: string) =>
  navMenu.item(id).locator('m3e-icon[slot="icon"]').evaluate((icon) => icon.remove()),
);

Given("a navigation menu with a divider between destinations", ({ navMenu }) => {
  navMenu.html = `<m3e-nav-menu id="menu">
    <m3e-nav-menu-item id="overview"><span slot="label">Overview</span></m3e-nav-menu-item>
    <m3e-divider id="divider"></m3e-divider>
    <m3e-nav-menu-item id="archive"><span slot="label">Archive</span></m3e-nav-menu-item>
  </m3e-nav-menu>`;
});
Then("the navigation divider is hidden from accessibility", async ({ navMenu, page }) => {
  await expect(page.locator("#divider")).toHaveAttribute("aria-hidden", "true");
  await expect(navMenu.menu.getByRole("separator")).toHaveCount(0);
});

Given("a navigation menu with an initially selected destination", ({ navMenu }) =>
  navMenu.initialSelection(false),
);

Given("a navigation menu with an initially selected disabled destination", ({ navMenu }) =>
  navMenu.initialSelection(true),
);

Given("a navigation menu with a disabled {string} destination", ({ navMenu }, approach: string) => {
  navMenu.html = `<m3e-nav-menu id="menu">
    <m3e-nav-menu-item id="home" disabled ${approach === "href" ? 'href="#home-page"' : ""}>
      ${approach === "href" ? '<span slot="label">Home</span>' : '<a slot="label" href="#home-page">Home</a>'}
    </m3e-nav-menu-item>
  </m3e-nav-menu>`;
});
When("the application clicks navigation item {string}", async ({ navMenu }, id: string) =>
  navMenu.item(id).evaluate((item: HTMLElement) => item.click()),
);
When("the application dispatches a navigation click on item {string}", async ({ navMenu }, id: string) =>
  navMenu.item(id).evaluate((item) => {
    const event = new MouseEvent("click", { bubbles: true, composed: true, cancelable: true });
    item.dispatchEvent(event);
    item.setAttribute("data-click-prevented", String(event.defaultPrevented));
  }),
);
Then("the disabled navigation click is prevented", async ({ navMenu }) =>
  expect(navMenu.item("home")).toHaveAttribute("data-click-prevented", "true"),
);
Then("the navigation page has not navigated", async ({ page }) => expect(page).toHaveURL("about:blank"));

Given("a disabled navigation destination in a {string} {string} drawer", ({ navMenu }, side: string, mode: string) => {
  navMenu.html = `<m3e-drawer-container id="drawer" ${side} ${side}-mode="${mode}" style="height: 300px">
    <nav slot="${side}" style="width: 240px"><m3e-nav-menu id="menu">
      <m3e-nav-menu-item id="home" href="#home-page" disabled><span slot="label">Home</span></m3e-nav-menu-item>
    </m3e-nav-menu></nav><main>Content</main>
  </m3e-drawer-container>`;
});
Then("the {string} navigation drawer stays open", async ({ page }, side: string) => {
  // Closing a drawer after selection is delayed by 300ms.
  await page.waitForTimeout(400);
  await expect(page.locator("#drawer")).toHaveAttribute(side);
});
