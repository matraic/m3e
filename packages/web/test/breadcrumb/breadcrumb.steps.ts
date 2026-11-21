import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { BreadcrumbHarness } from "./breadcrumb.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ breadcrumb: BreadcrumbHarness }>({
  breadcrumb: async ({ page, render }, use) => use(new BreadcrumbHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a breadcrumb trail with linked ancestors and a linked final item", async ({ breadcrumb }) =>
  breadcrumb.render(`
    <m3e-breadcrumb>
      <m3e-breadcrumb-item href="/dashboard" target="_blank" rel="noopener">Dashboard</m3e-breadcrumb-item>
      <m3e-breadcrumb-item href="/reports">Reports</m3e-breadcrumb-item>
      <m3e-breadcrumb-item>Settings</m3e-breadcrumb-item>
      <m3e-breadcrumb-item href="/annual">Annual</m3e-breadcrumb-item>
    </m3e-breadcrumb>
  `),
);
Then("the breadcrumb is exposed as a navigation landmark", async ({ breadcrumb }) =>
  expect(breadcrumb.breadcrumb).toHaveRole("navigation"),
);
Then("the breadcrumb items are exposed as a list", async ({ breadcrumb }) => {
  const list = breadcrumb.breadcrumb.getByRole("list");
  await expect(list).toBeVisible();
  await expect(breadcrumb.items).toHaveCount(4);
  for (let index = 0; index < 4; index++) {
    await expect(breadcrumb.items.nth(index)).toHaveRole("listitem");
  }
});
Then(
  "the {string} link retains href {string}, target {string}, and rel {string}",
  async ({ breadcrumb }, label: string, href: string, target: string, rel: string) => {
    const link = breadcrumb.link(label);
    await expect(link).toHaveAttribute("href", href);
    await expect(link).toHaveAttribute("target", target);
    await expect(link).toHaveAttribute("rel", rel);
  },
);
Then("the {string} item is a link", async ({ breadcrumb }, label: string) =>
  expect(breadcrumb.link(label)).toBeVisible(),
);
Then("the {string} item is exposed as a button", async ({ breadcrumb }, label: string) =>
  expect(breadcrumb.button(label)).toBeVisible(),
);
Then("the {string} item is current and not interactive", async ({ breadcrumb }, label: string) => {
  const item = breadcrumb.item(label);
  await expect(item).toHaveAttribute("current", "page");
  await expect(item.locator('[aria-current="page"]')).toBeVisible();
  await expect(breadcrumb.link(label)).toHaveCount(0);
  await expect(breadcrumb.button(label)).toHaveCount(0);
});

Given("a breadcrumb with icons on linked ancestors and a linked final item", async ({ breadcrumb }) =>
  breadcrumb.render(`
    <m3e-breadcrumb>
      <m3e-breadcrumb-item href="/dashboard">
        <m3e-icon slot="icon" name="dashboard"></m3e-icon>Dashboard
      </m3e-breadcrumb-item>
      <m3e-breadcrumb-item href="/annual">
        <m3e-icon slot="icon" name="calendar_month"></m3e-icon>Annual
      </m3e-breadcrumb-item>
    </m3e-breadcrumb>
  `),
);
Then("the icon in the {string} item is not filled", async ({ breadcrumb }, label: string) =>
  expect(breadcrumb.icon(label)).not.toHaveAttribute("filled"),
);

Then("the icon in the {string} item is filled", async ({ breadcrumb }, label: string) =>
  expect(breadcrumb.icon(label)).toHaveAttribute("filled", ""),
);

Given("a breadcrumb with an icon-only item labelled {string}", async ({ breadcrumb }, label: string) =>
  breadcrumb.render(`
    <m3e-breadcrumb>
      <m3e-breadcrumb-item item-label="${label}"><span aria-hidden="true">⌂</span></m3e-breadcrumb-item>
      <m3e-breadcrumb-item>Settings</m3e-breadcrumb-item>
    </m3e-breadcrumb>
  `),
);
Then("the {string} breadcrumb item is exposed as a button", async ({ breadcrumb }, label: string) =>
  expect(breadcrumb.button(label)).toBeVisible(),
);

Given("a breadcrumb item marked current as {string}", async ({ breadcrumb }, current: string) =>
  breadcrumb.render(
    `<m3e-breadcrumb><m3e-breadcrumb-item current="${current}">Current</m3e-breadcrumb-item></m3e-breadcrumb>`,
  ),
);
Then("the breadcrumb item reflects current value {string}", async ({ breadcrumb }, current: string) => {
  const item = breadcrumb.items.first();
  await expect(item).toHaveAttribute("current", current);
  await expect(item.locator(`[aria-current="${current}"]`)).toBeVisible();
});

Given("a breadcrumb with a disabled link", async ({ breadcrumb }) =>
  breadcrumb.render(`
    <m3e-breadcrumb>
      <m3e-breadcrumb-item href="/dashboard" disabled>Dashboard</m3e-breadcrumb-item>
      <m3e-breadcrumb-item>Current</m3e-breadcrumb-item>
    </m3e-breadcrumb>
  `),
);
Then("the {string} link is disabled and not in the tab order", async ({ breadcrumb }, label: string) => {
  const link = breadcrumb.link(label);
  await expect(link).toHaveAttribute("aria-disabled", "true");
  await expect(link).not.toHaveAttribute("tabindex");
});

Given("a breadcrumb with many items and no wrap", async ({ breadcrumb }) => breadcrumb.renderManyItems(false));
Then("the breadcrumb items occupy one line", async ({ breadcrumb }) =>
  expect.poll(() => breadcrumb.readLineCount()).toBe(1),
);

Given("a breadcrumb with many items and wrap enabled", async ({ breadcrumb }) => breadcrumb.renderManyItems(true));
Then("the breadcrumb items occupy multiple lines", async ({ breadcrumb }) =>
  expect.poll(() => breadcrumb.readLineCount()).toBeGreaterThan(1),
);
When("the application enables wrapping", async ({ breadcrumb }) => breadcrumb.enableWrap());

Given("a breadcrumb with a custom slash separator", async ({ breadcrumb }) =>
  breadcrumb.render(`
    <m3e-breadcrumb>
      <span slot="separator">/</span>
      <m3e-breadcrumb-item>Dashboard</m3e-breadcrumb-item>
      <m3e-breadcrumb-item>Reports</m3e-breadcrumb-item>
      <m3e-breadcrumb-item>Annual</m3e-breadcrumb-item>
    </m3e-breadcrumb>
  `),
);
Then("each separator is a slash hidden from assistive technology", async ({ breadcrumb }) =>
  expect
    .poll(() => breadcrumb.readSeparators())
    .toEqual([
      { text: "/", ariaHidden: "true" },
      { text: "/", ariaHidden: "true" },
    ]),
);

Given("a breadcrumb with two items", async ({ breadcrumb }) =>
  breadcrumb.render(`
    <m3e-breadcrumb>
      <m3e-breadcrumb-item>Dashboard</m3e-breadcrumb-item>
      <m3e-breadcrumb-item>Settings</m3e-breadcrumb-item>
    </m3e-breadcrumb>
  `),
);
Then("only the final breadcrumb item is current", async ({ breadcrumb }) => {
  const count = await breadcrumb.items.count();
  await expect.poll(() => breadcrumb.readCurrentItemIndexes()).toEqual([count - 1]);
});
When("the application appends the item {string}", async ({ breadcrumb }, label: string) =>
  breadcrumb.appendItem(label),
);
When("the application removes the final breadcrumb item", async ({ breadcrumb }) => breadcrumb.removeFinalItem());
When("the application moves the {string} item to the end", async ({ breadcrumb }, label: string) =>
  breadcrumb.moveItemToEnd(label),
);
When("the application moves the breadcrumb to a new DOM parent", async ({ breadcrumb }) =>
  breadcrumb.moveToNewParent(),
);
