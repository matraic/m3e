import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ListHarness } from "./list.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ list: ListHarness }>({
  list: async ({ page, render }, use) => use(new ListHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a segmented action list with an expandable group in {string}", async ({ list }, direction: string) => {
  await list.page.emulateMedia({ reducedMotion: "reduce" });
  list.html = `<m3e-action-list variant="segmented" dir="${direction}" style="
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
  </m3e-action-list>`;
});
When("the expandable list fixture renders", async ({ list }) => list.render());
Then("the collapsed group has no outer corners", async ({ page }) => {
  const header = page.locator("m3e-expandable-list-item m3e-list-item-button.header .base");
  await expect(header).toHaveCSS("corner-shape", "superellipse(0)");
});
When("the group expands", async ({ page }) => {
  await page.locator("m3e-expandable-list-item m3e-list-item-button.header").click();
  await page.mouse.move(0, 0);
});
Then("the header and nested items use the expanded outer corners", async ({ page }) => {
  const header = page.locator("m3e-expandable-list-item m3e-list-item-button.header");
  const headerBase = header.locator(".base");
  await expect(header).toHaveAttribute("aria-expanded", "true");
  await expect(headerBase).toHaveCSS("corner-start-start-shape", "superellipse(1)");
  await expect(headerBase).toHaveCSS("corner-end-start-shape", "superellipse(0)");
  await expect(page.locator("#nested-first .base")).toHaveCSS("corner-shape", "superellipse(0)");
  await expect(page.locator("#nested-last .base")).toHaveCSS("corner-start-start-shape", "superellipse(0)");
  await expect(page.locator("#nested-last .base")).toHaveCSS("corner-end-start-shape", "superellipse(1)");
  await expect(headerBase).toHaveCSS("border-top-left-radius", "16px");
  await expect(page.locator("#nested-last .base")).toHaveCSS("border-bottom-left-radius", "16px");
  await expect(page.locator(".toggle-container")).toHaveCSS("corner-shape", "superellipse(1)");
});
When("the application changes segmented outer corner families", async ({ page }) => {
  await page.locator("m3e-action-list").evaluate((element) => {
    element.style.setProperty("--m3e-segmented-list-container-shape-family-start-start", "bevel");
    element.style.setProperty("--m3e-segmented-list-container-shape-family-end-end", "bevel");
  });
});
Then("the expanded group follows the custom corner families", async ({ page }) => {
  await expect(page.locator("m3e-expandable-list-item m3e-list-item-button.header .base")).toHaveCSS(
    "corner-start-start-shape",
    "superellipse(0)",
  );
  await expect(page.locator("#nested-last .base")).toHaveCSS("corner-end-end-shape", "superellipse(0)");
  await expect(page.locator("#nested-last .base")).toHaveCSS("corner-end-start-shape", "superellipse(1)");
});
When("the group collapses", async ({ page }) => {
  await page.locator("m3e-expandable-list-item m3e-list-item-button.header").click();
});
Then("the header returns to the collapsed shape", async ({ page }) => {
  await expect(page.locator("m3e-expandable-list-item m3e-list-item-button.header")).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  await expect(page.locator("m3e-expandable-list-item m3e-list-item-button.header .base")).toHaveCSS(
    "corner-shape",
    "superellipse(0)",
  );
});
Given("an expandable item with nested fruit", ({ list }) => {
  list.html = `<m3e-list>
    <m3e-expandable-list-item>
      Fruits
      <div slot="items">
        <m3e-list-item>Apples</m3e-list-item>
        <m3e-list-item>Oranges</m3e-list-item>
      </div>
    </m3e-expandable-list-item>
  </m3e-list>`;
});
Then("the fruit group is collapsed and its nested list is hidden", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Fruits" })).toHaveAttribute("aria-expanded", "false");
  await expect(page.locator("m3e-expandable-list-item m3e-collapsible")).toBeHidden();
});
Then("the fruit group controls its labelled nested list", async ({ page }) => {
  const toggle = page.getByRole("button", { name: "Fruits" });
  const nestedList = page.locator("m3e-expandable-list-item m3e-collapsible");
  await expect(toggle).toHaveAttribute("aria-controls", (await nestedList.getAttribute("id")) ?? "");
  await expect(nestedList).toHaveAttribute("aria-labelledby", (await toggle.getAttribute("id")) ?? "");
});
When("the user expands the fruit group", async ({ page }) => page.getByRole("button", { name: "Fruits" }).click());
Then("the fruit group is expanded and its nested list is visible", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Fruits" })).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("list", { name: "Fruits" })).toBeVisible();
  await expect(page.locator("m3e-list-item").filter({ hasText: "Apples" })).toBeVisible();
});
When("the user collapses the fruit group", async ({ page }) => page.getByRole("button", { name: "Fruits" }).click());
