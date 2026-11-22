import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eFabElement } from "@m3e/web/fab";

import { expect, test as componentTest } from "../fixtures";
import { FabHarness } from "./fab.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ fab: FabHarness }>({
  fab: async ({ page, render }, use) => use(new FabHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("an extended FAB labelled {string}", ({ fab }, label: string) => {
  fab.html = fab.markup(`extended aria-label="${label}"`, `<span slot="label">${label}</span>`);
});
When("the FAB renders", async ({ fab }) => fab.render());
Then("the FAB is a visible button named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("button", { name, exact: true })).toBeVisible(),
);
When("keyboard focus moves to the FAB", async ({ page }) => page.keyboard.press("Tab"));
Then("the FAB is focused", async ({ fab }) => expect(fab.fab).toBeFocused());

Given("extended and icon-only FABs with labels", ({ fab }) => {
  fab.html = `<m3e-fab id="extended-fab" extended><span slot="label">Compose</span></m3e-fab>
    ${fab.markup("", '<span slot="label">Hidden label</span>')}`;
});
Then("the extended FAB label is visible", async ({ page }) => expect(page.getByText("Compose")).toBeVisible());
Then("the icon-only FAB label is hidden", async ({ page }) => expect(page.getByText("Hidden label")).toBeHidden());

Given("an extended FAB with a decorative icon and label {string}", ({ fab }, label: string) => {
  fab.html = fab.markup(
    "extended",
    `<svg id="fab-icon" role="img" aria-label="Decorative star"></svg><span slot="label">${label}</span>`,
  );
});
Then("the FAB icon is excluded from the accessibility tree", async ({ fab }) =>
  expect.poll(() => fab.iconAccessibility()).toEqual({ ignored: true }),
);

Given("an icon-only FAB labelled {string} with a label slot", ({ fab }, label: string) => {
  fab.html = fab.markup(`aria-label="${label}"`, `<span slot="label">${label}</span>`);
});
Then("the FAB label is hidden", async ({ fab }) => expect(fab.fab.locator('[slot="label"]')).toBeHidden());
When("the application extends the FAB", async ({ fab }) =>
  fab.fab.evaluate((element: M3eFabElement) => {
    element.extended = true;
  }),
);
Then("the FAB label is visible", async ({ fab }) => expect(fab.fab.locator('[slot="label"]')).toBeVisible());
When("the application collapses the FAB label", async ({ fab }) =>
  fab.fab.evaluate((element: M3eFabElement) => {
    element.extended = false;
  }),
);

Given("a FAB labelled {string}", ({ fab }, label: string) => {
  fab.html = fab.markup(`aria-label="${label}"`);
});
When("the application observes FAB clicks", async ({ fab }) => fab.observeClicks());
When("the user presses {string} on the FAB", async ({ page }, key: string) => page.keyboard.press(key));
Then("the FAB click count is {int}", async ({ fab }, count: number) =>
  expect(fab.fab).toHaveAttribute("data-clicks", String(count)),
);

Given("a disabled FAB labelled {string}", ({ fab }, label: string) => {
  fab.html = fab.markup(`disabled aria-label="${label}"`);
});
Then("the FAB is disabled", async ({ fab }) => expect(fab.fab).toHaveAttribute("aria-disabled", "true"));
Then("the FAB is not in the tab order", async ({ fab }) => expect(fab.fab).not.toHaveAttribute("tabindex"));
Then("keyboard focus moves past the FAB", async ({ page }) => expect(page.locator("#after-fab")).toBeFocused());
When("the application clicks the FAB", async ({ fab }) => fab.fab.evaluate((element: HTMLElement) => element.click()));

Given("a disabled-interactive FAB labelled {string}", ({ fab }, label: string) => {
  fab.html = fab.markup(`disabled-interactive aria-label="${label}"`);
});
When("the user clicks the disabled-interactive FAB", async ({ fab, page }) => {
  const bounds = await fab.fab.boundingBox();
  if (!bounds) throw new Error("FAB has no bounds.");
  await page.mouse.click(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
});
When("the application disables the FAB", async ({ fab }) =>
  fab.fab.evaluate((element: M3eFabElement) => {
    element.disabled = true;
  }),
);
When("the application enables the FAB", async ({ fab }) =>
  fab.fab.evaluate((element: M3eFabElement) => {
    element.disabled = false;
  }),
);
Then("the FAB is enabled", async ({ fab }) => expect(fab.fab).not.toHaveAttribute("aria-disabled"));
When("the user clicks the FAB", async ({ fab }) => fab.fab.click());

Given("a FAB with unsupported appearance values", ({ fab }) => {
  fab.html = fab.markup('variant="unsupported" size="unsupported"');
});
Then("the FAB variant is {string}", async ({ fab }, variant: string) =>
  expect(fab.fab).toHaveAttribute("variant", variant),
);
Then("the FAB size is {string}", async ({ fab }, size: string) => expect(fab.fab).toHaveAttribute("size", size));

Given("a FAB with variant {string}", ({ fab }, variant: string) => {
  fab.html = fab.markup(`variant="${variant}"`);
});

Given("a FAB with size {string}", ({ fab }, size: string) => {
  fab.html = fab.markup(`size="${size}"`);
});

Given("FABs in all supported sizes", ({ fab }) => {
  fab.html = ["small", "medium", "large"]
    .map((size) => `<m3e-fab size="${size}" aria-label="${size}"></m3e-fab>`)
    .join("");
});
Then("each FAB size is taller than the previous size", async ({ page }) => {
  const heights = await page
    .locator("m3e-fab")
    .evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect().height));
  expect(heights).toHaveLength(3);
  expect(heights[0]).toBeGreaterThan(0);
  expect(heights[1]).toBeGreaterThan(heights[0]);
  expect(heights[2]).toBeGreaterThan(heights[1]);
});
Then("the FAB is not lowered", async ({ fab }) => expect(fab.fab).not.toHaveAttribute("lowered"));
When("the application lowers the FAB", async ({ fab }) =>
  fab.fab.evaluate((element: M3eFabElement) => {
    element.lowered = true;
  }),
);
Then("the FAB is lowered", async ({ fab }) => expect(fab.fab).toHaveAttribute("lowered", ""));
When("the application raises the FAB", async ({ fab }) =>
  fab.fab.evaluate((element: M3eFabElement) => {
    element.lowered = false;
  }),
);

Given("raised and lowered FABs", ({ fab }) => {
  fab.html = '<m3e-fab id="raised" aria-label="Add"></m3e-fab><m3e-fab id="low" lowered aria-label="Add"></m3e-fab>';
});
Then("the lowered FAB has a different shadow from the raised FAB", async ({ page, fab }) => {
  await expect(page.locator("#low")).toHaveAttribute("lowered", "");
  expect(await fab.shadow("#raised")).not.toBe(await fab.shadow("#low"));
});

Given("a form with a submit FAB named {string} and value {string}", ({ fab }, name: string, value: string) => {
  fab.html = `<form id="fab-form">${fab.markup(`type="submit" name="${name}" value="${value}" aria-label="Create"`)}</form>`;
});
When("the application observes FAB form submissions", async ({ fab }) => fab.observeSubmissions());
Then("the form has {int} FAB submission(s)", async ({ page }, count: number) =>
  expect(page.locator("#fab-form")).toHaveAttribute("data-submissions", String(count)),
);
Then("the form submission contains {string} and {string}", async ({ page }, name: string, value: string) =>
  expect(page.locator("#fab-form")).toHaveAttribute("data-values", JSON.stringify([[name, value]])),
);

Given("a form with a reset FAB and a text field", ({ fab }) => {
  fab.html = `<form id="fab-form"><input id="fab-field" value="Original">${fab.markup('type="reset" aria-label="Reset"')}</form>`;
});
When("the user changes the FAB form field to {string}", async ({ page }, value: string) =>
  page.locator("#fab-field").fill(value),
);
Then("the FAB form field value is {string}", async ({ page }, value: string) =>
  expect(page.locator("#fab-field")).toHaveValue(value),
);

Given("a form with a disabled submit FAB", ({ fab }) => {
  fab.html = `<form id="fab-form">${fab.markup('type="submit" disabled aria-label="Submit"')}</form>`;
});
When("deferred FAB actions have completed", async ({ page }) =>
  page.evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 0))),
);

Given("a form with a disabled-interactive submit FAB", ({ fab }) => {
  fab.html = `<form id="fab-form">${fab.markup('type="submit" disabled-interactive aria-label="Submit"')}</form>`;
});

Given("a FAB link labelled {string} with destination {string}", ({ fab }, label: string, destination: string) => {
  fab.html = fab.markup(`href="${destination}" aria-label="${label}"`);
});
Then("the FAB is a visible link named {string}", async ({ page }, name: string) =>
  expect(page.getByRole("link", { name, exact: true })).toBeVisible(),
);
Then("the FAB link has one accessible link", async ({ page }) => expect(page.getByRole("link")).toHaveCount(1));
Then("the browser fragment is {string} after FAB navigation", async ({ page }, fragment: string) =>
  expect.poll(() => page.evaluate(() => window.location.hash)).toBe(fragment),
);
When("the application sets the FAB destination to {string}", async ({ fab }, destination: string) =>
  fab.fab.evaluate((element: M3eFabElement, value) => {
    element.href = value;
  }, destination),
);
When("the application removes the FAB destination", async ({ fab }) =>
  fab.fab.evaluate((element: M3eFabElement) => {
    element.href = "";
  }),
);
Then("the FAB link is absent", async ({ page }) => expect(page.getByRole("link")).toHaveCount(0));

Given("a {string} FAB link labelled {string}", ({ fab }, state: string, label: string) => {
  if (state !== "disabled" && state !== "disabled-interactive") throw new Error(`Unknown FAB disabled state: ${state}`);
  fab.html = fab.markup(`${state} href="#destination" aria-label="${label}"`);
});
When("the application moves the FAB to a new parent", async ({ fab }) =>
  fab.fab.evaluate((element) => {
    const parent = document.querySelector("#fab-destination");
    if (!parent) throw new Error("FAB destination is missing.");
    parent.append(element);
  }),
);
Then("the FAB is in its new parent", async ({ page }) =>
  expect(page.locator("#fab-destination > #fab")).toHaveCount(1),
);
When("the user focuses the FAB", async ({ fab }) => fab.fab.focus());
When("the user presses and holds the FAB", async ({ fab, page }) => {
  const bounds = await fab.fab.boundingBox();
  if (!bounds) throw new Error("FAB has no bounds.");
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + bounds.height / 2);
  await page.mouse.down();
});
Then("the FAB is visually pressed", async ({ fab }) => expect(fab.fab.locator(".base")).toHaveClass(/pressed/));
When("the user releases the FAB", async ({ page }) => page.mouse.up());
Then("the FAB is not visually pressed", async ({ fab }) => expect(fab.fab.locator(".base")).not.toHaveClass(/pressed/));

Given("two forms with a submit FAB in the first", ({ fab }) => {
  fab.html = `<form id="first-fab-form">${fab.markup('type="submit" name="action" value="create" aria-label="Create"')}</form>
    <form id="second-fab-form"></form>`;
});
When("the application observes both FAB form submissions", async ({ fab }) => fab.observeSubmissions());
Then("the first form has {int} FAB submission(s)", async ({ page }, count: number) =>
  expect(page.locator("#first-fab-form")).toHaveAttribute("data-submissions", String(count)),
);
Then("the second form has {int} FAB submission(s)", async ({ page }, count: number) =>
  expect(page.locator("#second-fab-form")).toHaveAttribute("data-submissions", String(count)),
);
When("the application moves the FAB into the second form", async ({ fab }) =>
  fab.fab.evaluate((element) => {
    const form = document.querySelector("#second-fab-form");
    if (!form) throw new Error("Second FAB form is missing.");
    form.append(element);
  }),
);
Then("the second form submission contains {string} and {string}", async ({ page }, name: string, value: string) =>
  expect(page.locator("#second-fab-form")).toHaveAttribute("data-values", JSON.stringify([[name, value]])),
);
