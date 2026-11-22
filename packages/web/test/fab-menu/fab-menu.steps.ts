import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eFabMenuElement } from "@m3e/web/fab-menu";

import { expect, test as componentTest } from "../fixtures";
import { FabMenuHarness, ITEMS } from "./fab-menu.harness";

export const test = mergeTests(componentTest, bddTest).extend<{
  fabMenu: FabMenuHarness;
}>({
  hasTouch: async ({ $tags }, use) => use($tags.includes("@fab-menu-touch")),
  fabMenu: async ({ page, render }, use) => use(new FabMenuHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a FAB menu with two actions", ({ fabMenu }) => {
  fabMenu.html = fabMenu.markup();
});
When("the FAB menu renders", async ({ fabMenu }) => fabMenu.render());
Then("the FAB menu trigger announces a collapsed menu", async ({ fabMenu }) => {
  await expect(fabMenu.trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(fabMenu.trigger).toHaveAttribute("aria-expanded", "false");
  await expect(fabMenu.trigger).toHaveAttribute("aria-controls", "actions");
  await expect(fabMenu.trigger).toHaveAttribute("tabindex", "0");
});
Then("the FAB menu actions are excluded from the accessibility tree", async ({ page }) =>
  expect(page.getByRole("menuitem")).toHaveCount(0),
);
When("the user opens the FAB menu", async ({ fabMenu }) => fabMenu.trigger.click());
Then("the FAB menu trigger announces an expanded menu", async ({ fabMenu }) =>
  expect(fabMenu.trigger).toHaveAttribute("aria-expanded", "true"),
);
Then("the FAB menu is visible", async ({ page }) => expect(page.getByRole("menu")).toBeVisible());
Then("the FAB menu has {int} accessible action(s)", async ({ fabMenu }, count: number) =>
  expect(fabMenu.menu.getByRole("menuitem")).toHaveCount(count),
);
Then("the FAB menu action {string} is visible", async ({ fabMenu }, name: string) =>
  expect(fabMenu.action(name)).toBeVisible(),
);
When("the user selects FAB menu action {string}", async ({ fabMenu }, name: string) => fabMenu.action(name).click());
Then("the FAB menu is hidden", async ({ fabMenu }) => expect(fabMenu.menu).toBeHidden());
Then("the FAB menu trigger is focused", async ({ fabMenu }) => expect(fabMenu.trigger).toBeFocused());
When("the application cancels the next FAB menu action", async ({ fabMenu }) =>
  fabMenu.menu.evaluate((menu) => {
    menu.addEventListener(
      "click",
      (event) => {
        event.preventDefault();
        menu.setAttribute("data-canceled-action", "true");
      },
      { capture: true, once: true },
    );
  }),
);
Then("the FAB menu remains open", async ({ fabMenu }) => {
  await expect(fabMenu.menu).toBeVisible();
  await expect(fabMenu.trigger).toHaveAttribute("aria-expanded", "true");
});
Then("the FAB menu action was canceled", async ({ fabMenu }) =>
  expect(fabMenu.menu).toHaveAttribute("data-canceled-action", "true"),
);
When("the user presses {string} in the FAB menu", async ({ page }, key: string) => page.keyboard.press(key));

Given("a FAB menu with two actions and motion preference {string}", ({ fabMenu }, motion: string) => {
  if (motion !== "reduce" && motion !== "no-preference") throw new Error(`Unknown motion preference: ${motion}`);
  fabMenu.reducedMotion = motion;
  fabMenu.html = fabMenu.markup();
});
When("the application closes the FAB menu as soon as it opens", async ({ fabMenu }) =>
  fabMenu.menu.evaluate((menu) => {
    const fab = document.querySelector("m3e-fab");
    const item = menu.querySelector("m3e-fab-menu-item");
    if (!fab || !item) throw new Error("FAB menu trigger or action is missing.");
    item.addEventListener("focus", () => item.setAttribute("data-focused", ""));
    menu.addEventListener("toggle", (event) => {
      if ((event as ToggleEvent).newState === "open") {
        fab.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
      }
    });
  }),
);
Then("no FAB menu action receives delayed focus", async ({ page, fabMenu }) => {
  await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 100)));
  await expect(fabMenu.menu.locator("m3e-fab-menu-item").first()).not.toHaveAttribute("data-focused", "");
});
Then("FAB menu action {string} is focused", async ({ fabMenu }, name: string) =>
  expect(fabMenu.action(name)).toBeFocused(),
);

Given("a FAB menu with a disabled action between two enabled actions", ({ fabMenu }) => {
  fabMenu.html = fabMenu.markup(`<m3e-fab-menu-item>First action</m3e-fab-menu-item>
    <m3e-fab-menu-item disabled>Unavailable action</m3e-fab-menu-item>
    <m3e-fab-menu-item>Last action</m3e-fab-menu-item>`);
});
Then("FAB menu action {string} is disabled", async ({ fabMenu }, name: string) =>
  expect(fabMenu.action(name)).toHaveAttribute("aria-disabled", "true"),
);
When("the application clicks FAB menu action {string}", async ({ fabMenu }, name: string) =>
  fabMenu.action(name).evaluate((element: HTMLElement) => element.click()),
);
Then("focus moves past the FAB menu", async ({ page }) => expect(page.locator("#after-menu")).toBeFocused());

Given("a FAB menu with {string}", ({ fabMenu }, contents: string) => {
  if (contents === "no actions") {
    fabMenu.html = fabMenu.markup("");
  } else if (contents === "only hidden actions") {
    fabMenu.html = fabMenu.markup("<m3e-fab-menu-item hidden>Hidden action</m3e-fab-menu-item>");
  } else if (contents === "only disabled actions") {
    fabMenu.html = fabMenu.markup(`<m3e-fab-menu-item disabled>First unavailable action</m3e-fab-menu-item>
      <m3e-fab-menu-item disabled>Second unavailable action</m3e-fab-menu-item>`);
  } else {
    throw new Error(`Unknown FAB menu contents: ${contents}`);
  }
});
Then("all FAB menu actions are disabled", async ({ fabMenu }) => {
  for (const action of await fabMenu.menu.getByRole("menuitem").all()) {
    await expect(action).toHaveAttribute("aria-disabled", "true");
  }
});
When("the FAB menu settles its initial focus", async ({ page }) =>
  page.evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 100))),
);
When("the application opens the FAB menu through its API", async ({ fabMenu }) =>
  fabMenu.menu.evaluate(async (menu: M3eFabMenuElement) => {
    const trigger = document.querySelector("m3e-fab");
    if (!trigger) throw new Error("FAB menu trigger is missing.");
    await menu.show(trigger);
  }),
);

Given("a FAB menu with a disabled trigger", ({ fabMenu }) => {
  fabMenu.html = fabMenu.markup(undefined, { fabAttributes: "disabled" });
});
Then("the FAB menu trigger is disabled", async ({ fabMenu }) =>
  expect(fabMenu.trigger).toHaveAttribute("aria-disabled", "true"),
);
When("the application clicks the FAB menu trigger", async ({ fabMenu }) =>
  fabMenu.trigger.evaluate((element: HTMLElement) => element.click()),
);
Then("the FAB menu trigger remains collapsed", async ({ fabMenu }) =>
  expect(fabMenu.trigger).toHaveAttribute("aria-expanded", "false"),
);
When("the user clicks the disabled FAB menu trigger", async ({ fabMenu, page }) => {
  const bounds = await fabMenu.trigger.boundingBox();
  if (!bounds) throw new Error("FAB menu trigger has no bounds.");
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
});

Given("a FAB menu with a disabled-interactive trigger", ({ fabMenu }) => {
  fabMenu.html = fabMenu.markup(undefined, {
    fabAttributes: "disabled-interactive",
  });
});
When("the user focuses the FAB menu trigger", async ({ fabMenu }) => fabMenu.trigger.focus());
When("the application adds FAB menu action {string}", async ({ fabMenu }, name: string) =>
  fabMenu.menu.evaluate((element, label) => {
    const item = document.createElement("m3e-fab-menu-item");
    item.textContent = label;
    element.append(item);
  }, name),
);
When("the application removes FAB menu action {string}", async ({ fabMenu }, name: string) =>
  fabMenu.action(name).evaluate((element) => element.remove()),
);
When("the application disables FAB menu action {string}", async ({ fabMenu }, name: string) =>
  fabMenu.action(name).evaluate((element) => element.setAttribute("disabled", "")),
);
When("the application enables FAB menu action {string}", async ({ fabMenu }, name: string) =>
  fabMenu.action(name).evaluate((element) => element.removeAttribute("disabled")),
);
Then("FAB menu action {string} is enabled", async ({ fabMenu }, name: string) =>
  expect(fabMenu.action(name)).not.toHaveAttribute("aria-disabled"),
);

Given("a FAB menu with a link action", ({ fabMenu }) => {
  fabMenu.html = fabMenu.markup('<m3e-fab-menu-item href="#destination">Open destination</m3e-fab-menu-item>');
});
Then("the FAB menu navigates to {string}", async ({ page }, fragment: string) =>
  expect.poll(() => page.evaluate(() => window.location.hash)).toBe(fragment),
);
When("the application removes the last FAB menu action while opening", async ({ fabMenu }) =>
  fabMenu.menu.evaluate(async (menu: M3eFabMenuElement) => {
    const trigger = document.querySelector("m3e-fab");
    const item = menu.querySelector("m3e-fab-menu-item");
    if (!trigger || !item) throw new Error("FAB menu trigger or action is missing.");
    const opening = menu.show(trigger);
    item.remove();
    await opening;
  }),
);
When("deferred FAB menu link actions have completed", async ({ page }) =>
  page.evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 0))),
);

Given("a FAB menu with a disabled link action", ({ fabMenu }) => {
  fabMenu.html =
    fabMenu.markup(`<m3e-fab-menu-item disabled href="#destination">Unavailable destination</m3e-fab-menu-item>
    <m3e-fab-menu-item>Available action</m3e-fab-menu-item>`);
});
When("the user clicks the disabled FAB menu action {string}", async ({ fabMenu, page }, name: string) => {
  const bounds = await fabMenu.action(name).boundingBox();
  if (!bounds) throw new Error(`FAB menu action "${name}" has no bounds.`);
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
});

Given("a FAB menu link action with target, rel and download", ({ fabMenu }) => {
  fabMenu.html = fabMenu.markup(`<m3e-fab-menu-item href="https://example.test/report" target="_blank"
    rel="noopener noreferrer" download="report.txt">Download report</m3e-fab-menu-item>`);
});
When("the application observes native FAB menu link activation", async ({ fabMenu }) => {
  await fabMenu.menu.evaluate((menu) => {
    document.addEventListener("click", (event) => {
      const link = event.target;
      if (!(link instanceof HTMLAnchorElement) || link.parentElement !== document.body) return;
      event.preventDefault();
      menu.setAttribute(
        "data-native-link",
        JSON.stringify({
          href: link.href,
          target: link.target,
          rel: link.rel,
          download: link.download,
        }),
      );
    });
  });
});
Then("the FAB menu link exposes its attributes on the hidden native anchor", async ({ fabMenu, page }) => {
  const link = fabMenu.menu.locator("m3e-fab-menu-item").locator("a");
  await expect(link).toHaveAttribute("href", "https://example.test/report");
  await expect(link).toHaveAttribute("target", "_blank");
  await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  await expect(link).toHaveAttribute("download", "report.txt");
  await expect(link).toHaveAttribute("aria-hidden", "true");
  await expect(link).toHaveAttribute("tabindex", "-1");
  await expect(page.getByRole("link")).toHaveCount(0);
});
Then("native FAB menu link activation preserves its attributes", async ({ fabMenu }) =>
  expect(fabMenu.menu).toHaveAttribute(
    "data-native-link",
    JSON.stringify({
      href: "https://example.test/report",
      target: "_blank",
      rel: "noopener noreferrer",
      download: "report.txt",
    }),
  ),
);

Given("a FAB menu action with a decorative icon", ({ fabMenu }) => {
  fabMenu.html = fabMenu.markup(
    '<m3e-fab-menu-item><svg id="menu-icon" slot="icon" role="img" aria-label="Decorative star"></svg>Share</m3e-fab-menu-item>',
  );
});
Then("the FAB menu icon is excluded from the accessibility tree", async ({ fabMenu }) =>
  expect.poll(() => fabMenu.iconIgnored()).toBe(true),
);

Given("a FAB menu with independent forced-color shapes", ({ fabMenu }) => {
  fabMenu.forcedColors = "active";
  fabMenu.html = fabMenu.markup("<m3e-fab-menu-item>Share</m3e-fab-menu-item>", {
    menuStyle: "--m3e-fab-menu-container-shape-family: round; --m3e-fab-menu-item-shape-family: bevel",
  });
});
Then("the FAB menu has the configured round container and beveled item shapes", async ({ fabMenu }) => {
  await expect(fabMenu.menu).toBeVisible();
  await expect(fabMenu.menu).toHaveCSS("corner-shape", "superellipse(1)");
  await expect(fabMenu.menu).toHaveCSS("border-radius", "12px");
  const layers = fabMenu.menu
    .locator("m3e-fab-menu-item")
    .locator(".base, .wrapper, .focus-ring, .state-layer, .ripple, .elevation");
  for (const layer of await layers.all()) {
    await expect(layer).toHaveCSS("corner-shape", "superellipse(0)");
    await expect(layer).toHaveCSS("border-radius", "9999px");
  }
});
When("the application changes the FAB menu container shape to bevel", async ({ fabMenu }) =>
  fabMenu.menu.evaluate((element) => element.style.setProperty("--m3e-fab-menu-container-shape-family", "bevel")),
);
Then("the FAB menu container is beveled", async ({ fabMenu }) => {
  await expect(fabMenu.menu).toHaveCSS("corner-shape", "superellipse(0)");
  await expect(fabMenu.menu).toHaveCSS("border-radius", "12px");
});

Given("a scrollable FAB menu in {string} direction", ({ fabMenu }, direction: string) => {
  if (direction !== "ltr" && direction !== "rtl") throw new Error(`Unknown direction: ${direction}`);
  fabMenu.direction = direction;
  fabMenu.viewport = { width: 390, height: 300 };
  fabMenu.html = fabMenu.markup(ITEMS.map((item) => `<m3e-fab-menu-item>${item}</m3e-fab-menu-item>`).join(""), {
    fabStyle: `position: fixed; ${direction === "ltr" ? "right" : "left"}: 16px; bottom: 16px`,
    menuStyle: "--m3e-focus-ring-thickness: 4px; --m3e-focus-ring-outward-offset: 3px",
  });
});
Then("the FAB menu scrolls", async ({ fabMenu }) =>
  expect.poll(() => fabMenu.menu.evaluate((element) => element.scrollHeight - element.clientHeight)).toBeGreaterThan(0),
);
When("the user navigates the scrollable FAB menu", async ({ fabMenu, page }) => {
  await fabMenu.menu.evaluate((element) => element.dispatchEvent(new WheelEvent("wheel")));
  await page.keyboard.press("ArrowDown");
});
Then("focus rings and FAB alignment remain visible for both ends of the menu", async ({ fabMenu }) =>
  fabMenu.assertFocusRingGeometry(),
);

Given("a scrollable FAB menu above a page action", ({ fabMenu }) => {
  fabMenu.viewport = { width: 390, height: 600 };
  fabMenu.html = `<button id="under" style="position: fixed; right: 20px; bottom: 20px">Page action</button>
    ${fabMenu.markup(ITEMS.map((item) => `<m3e-fab-menu-item>${item}</m3e-fab-menu-item>`).join(""), {
      fabStyle: "position: fixed; right: 16px; bottom: 60vh",
    })}`;
});
Then("the last FAB menu action begins above the trigger", async ({ fabMenu }) => {
  const last = fabMenu.menu.locator("m3e-fab-menu-item").last();
  await expect
    .poll(() =>
      last.evaluate(
        (element) =>
          document.querySelector("m3e-fab")!.getBoundingClientRect().top - element.getBoundingClientRect().bottom,
      ),
    )
    .toBeCloseTo(8, 0);
});
When("the user scrolls the FAB menu to the beginning", async ({ fabMenu, page }) => {
  const box = await fabMenu.menu.locator("m3e-fab-menu-item").last().boundingBox();
  if (!box) throw new Error("Last FAB menu item has no bounds.");
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.wheel(0, -1000);
  await expect.poll(() => fabMenu.menu.evaluate((element) => element.scrollTop)).toBe(0);
});
Then("the last FAB menu action is reachable below the trigger at the viewport edge", async ({ fabMenu }) =>
  fabMenu.assertRaisedScrollGeometry(),
);
When("the user clicks the page action behind the FAB menu", async ({ page }) =>
  page.getByRole("button", { name: "Page action" }).click(),
);

Given("a touch-scrollable FAB menu", ({ fabMenu }) => {
  fabMenu.viewport = { width: 390, height: 600 };
  fabMenu.html = fabMenu.markup(ITEMS.map((item) => `<m3e-fab-menu-item>${item}</m3e-fab-menu-item>`).join(""), {
    fabStyle: "position: fixed; right: 16px; bottom: 60vh",
  });
});
When("the user taps the FAB menu trigger", async ({ fabMenu }) => fabMenu.trigger.tap());
Then("the empty FAB menu area receives pointer input", async ({ fabMenu }) => {
  await expect(fabMenu.menu).toHaveCSS("pointer-events", "auto");
  expect(
    await fabMenu.menu.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return document.elementFromPoint(rect.right - 2, rect.bottom - 2) === element;
    }),
  ).toBe(true);
});

Given("a scrollable FAB menu with a maximum width", ({ fabMenu }) => {
  fabMenu.viewport = { width: 390, height: 300 };
  fabMenu.reducedMotion = "no-preference";
  fabMenu.html = fabMenu.markup(
    ITEMS.map((item) => `<m3e-fab-menu-item>${item} with a long label</m3e-fab-menu-item>`).join(""),
    { menuStyle: "--m3e-fab-menu-max-width: 200px" },
  );
});
Then("the FAB menu retains its constrained width when closing", async ({ fabMenu }) => {
  await expect
    .poll(() =>
      fabMenu.menu.evaluate((element) =>
        [...element.querySelectorAll("m3e-fab-menu-item")].some((item) => item.getAnimations().length > 0),
      ),
    )
    .toBe(false);
  const widths = await fabMenu.menu.evaluate((element: M3eFabMenuElement) => {
    const before = element.getBoundingClientRect().width;
    element.hide();
    return { before, after: element.getBoundingClientRect().width };
  });
  expect(widths.before).toBeLessThanOrEqual(200);
  expect(widths.after).toBeCloseTo(widths.before, 1);
});

Given("a FAB menu with variant {string}", ({ fabMenu }, variant: string) => {
  fabMenu.html = `<m3e-fab-menu id="actions" variant="${variant}"></m3e-fab-menu>`;
});
Then("the FAB menu variant is {string}", async ({ fabMenu }, variant: string) =>
  expect(fabMenu.menu).toHaveAttribute("variant", variant),
);

Given("a FAB menu with {string} motion", ({ fabMenu }, motion: string) => {
  if (motion !== "standard" && motion !== "expressive") throw new Error(`Unknown motion scheme: ${motion}`);
  fabMenu.reducedMotion = "no-preference";
  fabMenu.html = fabMenu.motionMenu(motion);
});
Then("FAB menu action stagger delays match the opening and closing sequences", async ({ fabMenu }) => {
  const delays = await fabMenu.staggerDelays();
  expect(delays.open).toEqual([114, 114, 81, 60, 43, 26]);
  expect(delays.close).toEqual([0, 26, 43, 60, 81, 114]);
});
Then("FAB menu actions grow to their natural widths using the selected fast spatial spring", async ({ fabMenu }) => {
  const result = await fabMenu.growth();
  expect(result.timings).toEqual(ITEMS.map(() => result.spring));
  result.keyframes.forEach(([from, to], index) => {
    expect(from).toBe(0);
    expect(to).toBeCloseTo(result.natural[index], 2);
  });
});
Then("FAB menu labels and width remain anchored throughout the growing animation", async ({ fabMenu }) => {
  const result = await fabMenu.growthGeometry();
  expect(result.drift.end).toBeLessThan(0.01);
  expect(result.drift.label).toBeLessThan(0.01);
  expect(result.drift.menu).toBeLessThan(0.01);
  for (const peak of result.peaks) expect(peak).toBeGreaterThan(1.05);
});
Then("FAB menu actions reopen from their current widths to their natural widths", async ({ fabMenu }) => {
  const result = await fabMenu.interruptedGrowth();
  result.after.forEach((width, index) => expect(width).toBeCloseTo(result.before[index], 2));
  result.targets.forEach((width, index) => expect(width).toBeCloseTo(result.natural[index], 2));
});
When("the FAB menu finishes its animations", async ({ fabMenu, page }) => {
  await page.evaluate(() => document.getAnimations().forEach((animation) => animation.finish()));
  const first = fabMenu.menu.locator("m3e-fab-menu-item").first();
  await expect.poll(() => first.evaluate((element) => element.getAnimations().length)).toBe(0);
  fabMenu.widthBefore = await first.evaluate((element) => element.getBoundingClientRect().width);
});
When("the application lengthens the first FAB menu action", async ({ fabMenu }) =>
  fabMenu.menu
    .locator("m3e-fab-menu-item")
    .first()
    .evaluate((element) => (element.textContent = "Share with your team")),
);
Then("the first FAB menu action grows with its content", async ({ fabMenu }) =>
  expect
    .poll(() =>
      fabMenu.menu
        .locator("m3e-fab-menu-item")
        .first()
        .evaluate((element) => element.getBoundingClientRect().width),
    )
    .toBeGreaterThan(fabMenu.widthBefore + 40),
);

Given("a FAB menu with expressive motion and reduced motion", ({ fabMenu }) => {
  fabMenu.html = fabMenu.motionMenu("expressive");
});
Then("FAB menu actions open and close without animation", async ({ fabMenu }) => {
  const result = await fabMenu.reducedMotionResult();
  expect(result.open.animations).toBe(0);
  for (const width of result.open.widths) expect(width).toBeGreaterThan(40);
  expect(result.display).toBe("none");
});
When("the application moves the FAB menu to another parent", async ({ fabMenu }) =>
  fabMenu.menu.evaluate((element) => {
    const destination = document.querySelector("#menu-destination");
    if (!destination) throw new Error("FAB menu destination is missing.");
    destination.append(element);
  }),
);
When("the application moves the FAB menu while it is opening", async ({ fabMenu }) =>
  fabMenu.menu.evaluate(async (menu: M3eFabMenuElement) => {
    const fab = document.querySelector("m3e-fab");
    const destination = document.querySelector("#menu-destination");
    if (!fab || !destination) throw new Error("FAB menu trigger or destination is missing.");
    const opening = menu.show(fab);
    destination.append(menu);
    await opening;
  }),
);

Given("two FABs and a FAB menu trigger in the first", ({ fabMenu }) => {
  fabMenu.html = `${fabMenu.markup()}
    <m3e-fab id="other-fab" aria-label="Other actions" style="position: fixed; right: 100px; bottom: 16px"></m3e-fab>`;
});
When("the application moves the FAB menu trigger to the second FAB", async ({ page }) =>
  page.locator("m3e-fab-menu-trigger").evaluate((element) => {
    const destination = document.querySelector("#other-fab");
    if (!destination) throw new Error("Second FAB is missing.");
    destination.append(element);
  }),
);
Then("the first FAB no longer announces a FAB menu", async ({ fabMenu }) => {
  await expect(fabMenu.trigger).not.toHaveAttribute("aria-haspopup");
  await expect(fabMenu.trigger).not.toHaveAttribute("aria-expanded");
  await expect(fabMenu.trigger).not.toHaveAttribute("aria-controls");
});
Then("the second FAB announces a collapsed FAB menu", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Other actions" });
  await expect(trigger).toHaveAttribute("aria-haspopup", "menu");
  await expect(trigger).toHaveAttribute("aria-controls", "actions");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});
When("the user opens the FAB menu from the second FAB", async ({ page }) =>
  page.getByRole("button", { name: "Other actions" }).click(),
);
Then("the second FAB announces an expanded FAB menu", async ({ page }) =>
  expect(page.getByRole("button", { name: "Other actions" })).toHaveAttribute("aria-expanded", "true"),
);
When("the application moves the FAB menu trigger while the menu is opening", async ({ fabMenu }) =>
  fabMenu.menu.evaluate(async (menu: M3eFabMenuElement) => {
    const first = document.querySelector("m3e-fab");
    const trigger = first?.querySelector("m3e-fab-menu-trigger");
    const second = document.querySelector("#other-fab");
    if (!first || !trigger || !second) throw new Error("FAB menu trigger or destination is missing.");
    const opening = menu.show(first);
    second.append(trigger);
    await opening;
  }),
);

Given("two FABs sharing a FAB menu", ({ fabMenu }) => {
  fabMenu.html = `${fabMenu.markup()}
    <m3e-fab id="other-fab" aria-label="Other actions">
      <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
    </m3e-fab>
    <m3e-fab id="third-fab" aria-label="Third actions"></m3e-fab>`;
});
When("the application moves the inactive FAB menu trigger", async ({ page }) =>
  page.locator("#other-fab m3e-fab-menu-trigger").evaluate((element) => {
    const destination = document.querySelector("#third-fab");
    if (!destination) throw new Error("Third FAB is missing.");
    destination.append(element);
  }),
);

Given("two FAB menus with an action in the first", ({ fabMenu }) => {
  fabMenu.html = `${fabMenu.markup("<m3e-fab-menu-item>First action</m3e-fab-menu-item>")}
    <m3e-fab id="other-fab" aria-label="Other actions" style="position: fixed; right: 100px; bottom: 16px">
      <m3e-fab-menu-trigger for="second-actions"></m3e-fab-menu-trigger>
    </m3e-fab>
    <m3e-fab-menu id="second-actions"></m3e-fab-menu>`;
});
When("the application moves the action to the second FAB menu", async ({ page }) =>
  page.locator("#actions m3e-fab-menu-item").evaluate((element) => {
    const destination = document.querySelector("#second-actions");
    if (!destination) throw new Error("Second FAB menu is missing.");
    destination.append(element);
  }),
);
Then("the second FAB menu is hidden", async ({ page }) => expect(page.locator("#second-actions")).toBeHidden());
Then("the second FAB menu trigger is focused", async ({ page }) =>
  expect(page.getByRole("button", { name: "Other actions" })).toBeFocused(),
);
