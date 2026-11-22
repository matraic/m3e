import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest, type DataTable } from "playwright-bdd";
import type { M3eDividerElement } from "@m3e/web/divider";

import { expect, test as componentTest } from "../fixtures";
import { DividerHarness } from "./divider.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ divider: DividerHarness }>({
  divider: async ({ page, render }, use) => use(new DividerHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a horizontal divider", ({ divider }) => {
  divider.html = '<m3e-divider style="width: 300px"></m3e-divider>';
});
When("the divider renders", async ({ divider }) => divider.render());
Then("the divider is exposed as a visible separator", async ({ page }) =>
  expect(page.getByRole("separator")).toBeVisible(),
);
Then("the divider is not vertical", async ({ divider }) => expect(divider.divider).not.toHaveAttribute("vertical"));
Then(
  "the divider has display {string} and dimensions {string} by {string}",
  async ({ divider }, display: string, width: string, height: string) => {
    await expect(divider.divider).toHaveCSS("display", display);
    await expect(divider.divider).toHaveCSS("width", width);
    await expect(divider.divider).toHaveCSS("height", height);
  },
);

Given("a vertical divider", ({ divider }) => {
  divider.html = '<m3e-divider vertical style="height: 100px"></m3e-divider>';
});
Then("the divider has the {string} attribute", async ({ divider }, attribute: string) =>
  expect(divider.divider).toHaveAttribute(attribute, ""),
);

Given("a hidden divider", ({ divider }) => {
  divider.html = "<m3e-divider hidden></m3e-divider>";
});
Then("the divider separator is hidden", async ({ page }) => expect(page.getByRole("separator")).toBeHidden());
Then(
  "the divider line has left and right insets of {int} and {int} pixels",
  async ({ divider }, left: number, right: number) =>
    expect.poll(() => divider.insets()).toMatchObject({ left, right }),
);

Given("a horizontal divider with a {int} pixel inset", ({ divider }, size: number) => {
  divider.html = `<m3e-divider inset style="width: 300px; --m3e-divider-inset-size: ${size}px"></m3e-divider>`;
});

Given("a horizontal divider with {string} of {int} pixels", ({ divider }, attribute: string, size: number) => {
  if (attribute !== "inset-start" && attribute !== "inset-end") throw new Error(`Unknown divider inset: ${attribute}`);
  divider.html = `<m3e-divider ${attribute} style="width: 300px; --m3e-divider-${attribute}-size: ${size}px"></m3e-divider>`;
});

Given("dividers with directional insets", ({ divider }) => {
  divider.html = `
    <m3e-divider id="start" inset-start style="width: 300px; --m3e-divider-inset-start-size: 12px"></m3e-divider>
    <m3e-divider id="end" inset-end style="width: 300px; --m3e-divider-inset-end-size: 8px"></m3e-divider>
    <m3e-divider id="both" inset style="width: 300px; --m3e-divider-inset-start-size: 12px; --m3e-divider-inset-end-size: 8px"></m3e-divider>
    <m3e-divider id="none" style="width: 300px"></m3e-divider>
  `;
});
Then("the divider lines have physical insets:", async ({ page, divider }, table: DataTable) => {
  for (const row of table.hashes()) {
    const target = page.locator(`m3e-divider#${row.divider}`);
    await expect.poll(() => divider.insets(target)).toMatchObject({ left: Number(row.left), right: Number(row.right) });
  }
});
When("the application changes divider page direction to {string}", async ({ page }, direction: string) =>
  page.evaluate((value) => {
    document.documentElement.dir = value;
  }, direction),
);

Given("a vertical divider with a {int} pixel inset", ({ divider }, size: number) => {
  divider.html = `<m3e-divider vertical inset style="height: 200px; --m3e-divider-inset-size: ${size}px"></m3e-divider>`;
});
Then(
  "the divider line has top and bottom insets of {int} and {int} pixels",
  async ({ divider }, top: number, bottom: number) =>
    expect.poll(() => divider.insets()).toMatchObject({ top, bottom }),
);

Given("a divider with all inset attributes", ({ divider }) => {
  divider.html = "<m3e-divider inset inset-start inset-end></m3e-divider>";
});
Then("assistive technology sees a {string} separator", async ({ divider }, orientation: string) =>
  expect.poll(() => divider.accessibility()).toMatchObject({ ignored: false, role: "separator", orientation }),
);
Then("the divider is not keyboard focusable", async ({ divider }) =>
  expect(divider.divider).toHaveJSProperty("tabIndex", -1),
);
When("the application sets the divider vertical property to {word}", async ({ divider }, value: string) => {
  if (value !== "true" && value !== "false") throw new Error(`Unknown vertical value: ${value}`);
  await divider.divider.evaluate(async (element: M3eDividerElement, vertical) => {
    element.vertical = vertical;
    await element.updateComplete;
  }, value === "true");
});
When("the application moves the divider to a new DOM parent", async ({ divider }) =>
  divider.divider.evaluate((element) => {
    const parent = document.createElement("div");
    parent.id = "divider-new-parent";
    document.body.append(parent);
    parent.append(element);
  }),
);
Then("the divider is in the new DOM parent", async ({ page }) =>
  expect(page.locator("#divider-new-parent > m3e-divider")).toHaveCount(1),
);

Given("a vertical divider with role {string}", ({ divider }, role: string) => {
  if (role !== "none" && role !== "presentation") throw new Error(`Unknown presentational role: ${role}`);
  divider.html = `<m3e-divider role="${role}" vertical style="height: 100px"></m3e-divider>`;
});
Then("the divider has role {string}", async ({ divider }, role: string) =>
  expect(divider.divider).toHaveAttribute("role", role),
);
Then("the divider has no accessible orientation attribute", async ({ divider }) =>
  expect(divider.divider).not.toHaveAttribute("aria-orientation"),
);
Then("assistive technology ignores the divider", async ({ divider }) =>
  expect.poll(async () => (await divider.accessibility()).ignored).toBe(true),
);
When("the application sets the divider role to {string}", async ({ divider }, role: string) =>
  divider.divider.evaluate((element, value) => {
    element.role = value;
  }, role),
);
