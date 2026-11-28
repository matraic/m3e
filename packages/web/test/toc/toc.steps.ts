import type { M3eTocItemElement } from "@m3e/web/toc";
import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { TocHarness, tocFixture } from "./toc.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ toc: TocHarness }>({
  toc: async ({ page, render }, use) => use(new TocHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a table of contents for scrollable headings", ({ toc }) => {
  toc.markup = tocFixture();
});
When("the table of contents renders", async ({ toc }) => toc.show());
Then("the table of contents hierarchy is {string}", async ({ toc }, hierarchy: string) =>
  expect
    .poll(() => toc.labels())
    .toEqual(
      hierarchy.split(", ").map((item) => {
        const [text, level] = item.split(":");
        return { text, level: Number(level) };
      }),
    ),
);
When("the application sets table of contents depth to {int}", async ({ toc }, depth: number) =>
  toc.toc.evaluate((element, value) => element.setAttribute("max-depth", String(value)), depth),
);
Then("the table of contents labels are {string}", async ({ toc }, labels: string) =>
  expect.poll(async () => (await toc.labels()).map((item) => item.text)).toEqual(labels ? labels.split(", ") : []),
);

Given("a table of contents for headings starting at level 3", ({ toc }) => {
  toc.markup = '<m3e-toc for="content"></m3e-toc><div id="content"><h3>One</h3><h4>Two</h4></div>';
});
Given("a table of contents for custom headings", ({ toc }) => {
  toc.markup =
    '<m3e-toc for="content"></m3e-toc><div id="content"><m3e-heading level="2">Custom</m3e-heading><m3e-heading level="3">Child</m3e-heading></div>';
});
Given("a table of contents with an ignored heading", ({ toc }) => {
  toc.markup = '<m3e-toc for="content"></m3e-toc><div id="content"><h2>Keep</h2><h2 m3e-toc-ignore>Skip</h2></div>';
});
Given("a table of contents without a target", ({ toc }) => {
  toc.markup = "<m3e-toc></m3e-toc><h2>Heading</h2>";
});
When("the application adds the heading {string}", async ({ page }, label: string) =>
  page.locator("#content").evaluate((element, text) => {
    const heading = document.createElement("h2");
    heading.textContent = text;
    element.append(heading);
  }, label),
);
When("the application removes the table of contents target", async ({ toc }) =>
  toc.toc.evaluate((element) => element.removeAttribute("for")),
);
Given("a table of contents with overline and title", ({ toc }) => {
  toc.markup =
    '<m3e-toc for="content"><span slot="overline">Contents</span><span slot="title">Docs</span></m3e-toc><div id="content"><h2>A</h2></div>';
});
Then("the table of contents exposes both header states", async ({ toc }) =>
  expect
    .poll(() => toc.toc.evaluate((element) => element.matches(":state(--with-overline):state(--with-title)")))
    .toBe(true),
);

Then("the table of contents exposes {int} links", async ({ toc }, count: number) =>
  expect(toc.toc.getByRole("link")).toHaveCount(count),
);
Then("the table of contents link {string} is visible", async ({ toc }, name: string) =>
  expect(toc.toc.getByRole("link", { name, exact: true })).toBeVisible(),
);
Then("the current table of contents item is {string}", async ({ toc }, name: string) =>
  expect.poll(() => toc.current()).toBe(name),
);
Then("only the {string} table of contents item exposes the current state", async ({ toc }, name: string) =>
  expect
    .poll(() =>
      toc.items.evaluateAll((items) =>
        items.filter((item) => item.getAttribute("aria-current") === "true").map((item) => item.textContent?.trim()),
      ),
    )
    .toEqual([name]),
);

When("the user tabs to the first table of contents link", async ({ page, toc }) => {
  await expect(toc.toc.getByRole("link", { name: "Intro", exact: true })).toBeVisible();
  await page.keyboard.press("Tab");
});
Then("the table of contents link {string} has focus", async ({ toc }, name: string) =>
  expect(toc.toc.getByRole("link", { name, exact: true })).toBeFocused(),
);
Then("the table of contents link {string} shows keyboard focus", async ({ toc }, name: string) =>
  expect(toc.toc.getByRole("link", { name, exact: true }).locator("m3e-focus-ring .outline")).toHaveClass(
    /(?:^|\s)visible(?:\s|$)/,
  ),
);
When("the user tabs to the next table of contents link", async ({ page }) => page.keyboard.press("Tab"));
When("the user presses Enter on the table of contents link", async ({ page }) => page.keyboard.press("Enter"));
When("the user clicks the table of contents link {string}", async ({ toc }, name: string) =>
  toc.toc.getByRole("link", { name, exact: true }).click(),
);
Then("the target scroll position exceeds {int} pixels", async ({ page }, position: number) =>
  expect.poll(() => page.locator("#content").evaluate((element) => element.scrollTop)).toBeGreaterThan(position),
);
When("the application scrolls the target to its last heading", async ({ page }) =>
  page.locator("#content").evaluate((element) => {
    const headings = element.querySelectorAll<HTMLElement>("h2");
    element.scrollTo({ top: headings[headings.length - 1].offsetTop });
  }),
);
When("the application scrolls the target to the top", async ({ page }) =>
  page.locator("#content").evaluate((element) => element.scrollTo({ top: 0 })),
);
Given("a standalone table of contents item", ({ toc }) => {
  toc.markup = "<m3e-toc-item>Item</m3e-toc-item>";
});
When("the application selects the table of contents item", async ({ page }) =>
  page.locator("m3e-toc-item").evaluate((item: M3eTocItemElement) => {
    item.selected = true;
  }),
);
Then("the item exposes current state without aria-selected", async ({ page }) => {
  await expect(page.locator("m3e-toc-item")).toHaveAttribute("aria-current", "true");
  await expect(page.locator("m3e-toc-item")).not.toHaveAttribute("aria-selected");
});
When("the application deselects the table of contents item", async ({ page }) =>
  page.locator("m3e-toc-item").evaluate((item: M3eTocItemElement) => {
    item.selected = false;
  }),
);
Then("the item no longer exposes current state", async ({ page }) =>
  expect(page.locator("m3e-toc-item")).not.toHaveAttribute("aria-current"),
);
When("the application observes item activations", async ({ page }) =>
  page.locator("m3e-toc-item").evaluate((item) => {
    item.dataset.activations = "0";
    item.addEventListener("click", () => {
      item.dataset.activations = String(Number(item.dataset.activations) + 1);
    });
  }),
);
When("the application disables the table of contents item", async ({ page }) => {
  await page.locator("m3e-toc-item").evaluate((item: M3eTocItemElement) => {
    item.disabled = true;
  });
  await expect(page.locator("m3e-toc-item")).toHaveAttribute("aria-disabled", "true");
});
When("Enter is dispatched to the table of contents item", async ({ page }) =>
  page.locator("m3e-toc-item").dispatchEvent("keydown", { key: "Enter", bubbles: true, cancelable: true }),
);
Then("the item has no tab stop and no activations", async ({ page }) => {
  await expect(page.locator("m3e-toc-item")).not.toHaveAttribute("tabindex");
  await expect(page.locator("m3e-toc-item")).toHaveAttribute("data-activations", "0");
});

When("the application reconnects the table of contents item twice", async ({ page }) =>
  page.locator("m3e-toc-item").evaluate((item) => {
    const parent = item.parentElement;
    if (!parent) throw new Error("Item parent is missing.");
    for (let i = 0; i < 2; i++) {
      item.remove();
      parent.append(item);
    }
  }),
);
When("the user tabs to the standalone item", async ({ page }) => page.keyboard.press("Tab"));
Then("the standalone item shows keyboard focus", async ({ page }) =>
  expect(page.locator("m3e-toc-item m3e-focus-ring .outline")).toHaveClass(/(?:^|\s)visible(?:\s|$)/),
);
Then("the item has exactly one activation", async ({ page }) =>
  expect(page.locator("m3e-toc-item")).toHaveAttribute("data-activations", "1"),
);

Given("a table of contents in a nested scroller with scroll spacing", ({ toc }) => {
  toc.markup = `<div id="outer" style="height:400px;overflow:auto"><div style="height:150px"></div>
    <m3e-toc for="content"></m3e-toc>
    <div id="content" style="height:150px;overflow:auto;border:5px solid;scroll-padding-top:10%">
      <h2 style="margin:0">Intro</h2><div style="height:250px"></div>
      <div><h2 id="destination" style="margin:0;scroll-margin-top:8px">Destination</h2></div><div style="height:300px"></div>
    </div><div style="height:700px"></div></div>`;
});
When(
  "the application scrolls the outer table of contents container to {int} pixels",
  async ({ toc, page }, position: number) => {
    await expect(toc.items).toHaveCount(2);
    toc.outerScroll = await page.locator("#outer").evaluate((element, value) => {
      element.scrollTop = value;
      return element.scrollTop;
    }, position);
  },
);
Then("the destination is {int} pixels from the target top", async ({ page }, offset: number) =>
  expect
    .poll(() =>
      page.locator("#content").evaluate((element) => {
        const heading = element.querySelector("#destination");
        if (!heading) throw new Error("Destination heading is missing.");
        return Math.round(heading.getBoundingClientRect().top - element.getBoundingClientRect().top);
      }),
    )
    .toBe(offset),
);
Then("the outer table of contents container remains at its original scroll position", async ({ page, toc }) =>
  expect(await page.locator("#outer").evaluate((element) => element.scrollTop)).toBe(toc.outerScroll),
);

Given("a table of contents for a non-scrolling target", ({ toc }) => {
  toc.markup = `<div id="outer" style="height:250px;overflow:auto"><m3e-toc for="content"></m3e-toc>
    <div id="content"><h2>Intro</h2><div style="height:400px"></div><h2>Destination</h2><div style="height:400px"></div></div></div>`;
});
Then("the outer table of contents container scrolls beyond {int} pixels", async ({ page }, position: number) =>
  expect.poll(() => page.locator("#outer").evaluate((element) => element.scrollTop)).toBeGreaterThan(position),
);

Given("a table of contents for a heading in nested target scrollers", ({ toc }) => {
  toc.markup = `<div id="outer" style="height:400px;overflow:auto"><div style="height:150px"></div><m3e-toc for="content"></m3e-toc>
    <div id="content" style="height:180px;overflow:auto"><h2>Intro</h2><div style="height:250px"></div>
      <div id="inner" style="height:100px;overflow:auto"><div style="height:200px"></div><h2 id="destination">Destination</h2><div style="height:150px"></div></div>
      <div style="height:200px"></div></div><div style="height:700px"></div></div>`;
});
Then("the inner and target scrollers move to reveal the destination", async ({ page }) => {
  await expect.poll(() => page.locator("#inner").evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
  await expect.poll(() => page.locator("#content").evaluate((element) => element.scrollTop)).toBeGreaterThan(100);
});
Then("the destination heading is in the viewport", async ({ page }) =>
  expect(page.locator("#destination")).toBeInViewport(),
);

When("the application disconnects the table of contents", async ({ toc }) =>
  toc.toc.evaluate((element) => {
    (window as typeof window & { detachedToc?: Element }).detachedToc = element;
    element.remove();
  }),
);
When("the application reconnects the table of contents", async ({ page }) =>
  page.evaluate(() => {
    const element = (window as typeof window & { detachedToc?: Element }).detachedToc;
    if (!element) throw new Error("Table of contents was not disconnected.");
    document.body.prepend(element);
  }),
);
