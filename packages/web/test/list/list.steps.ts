import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { ListHarness } from "./list.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ list: ListHarness }>({
  list: async ({ page, render }, use) => use(new ListHarness(page, render)),
});

const { Given, When, Then } = createBdd(test);
Given("list surfaces with different item and media families in {string}", async ({ list }, direction: string) => {
  await list.page.emulateMedia({ reducedMotion: "reduce" });
  list.html = `<div id="surfaces" dir="${direction}">
    <m3e-list>
      <m3e-list-item><img slot="leading" alt="" />Item<video slot="trailing"></video></m3e-list-item>
    </m3e-list>
    <m3e-list variant="segmented"><m3e-list-item>Segment</m3e-list-item></m3e-list>
    <m3e-action-list><m3e-list-action>Action</m3e-list-action></m3e-action-list>
    <m3e-selection-list><m3e-list-option selected>Option</m3e-list-option></m3e-selection-list>
    <m3e-action-list><m3e-expandable-list-item>Expand<div slot="items"></div></m3e-expandable-list-item></m3e-action-list>
  </div>`;
});
When("the list fixture renders", async ({ list }) => list.render());
Then("the default item and media surfaces use the expected shape families", async ({ page }) => {
  const bases = page.locator("m3e-list-item .base, m3e-list-item-button .base, m3e-list-option .base");
  await expect(bases).toHaveCount(5);
  for (const base of await bases.all()) {
    await expect(base).toHaveCSS("corner-shape", "superellipse(1)");
  }
  await expect(page.locator("m3e-list-option .base")).toHaveCSS("border-radius", "16px");
});
When("custom shape families are applied to the list surfaces", async ({ page }) => {
  await page.locator("#surfaces").evaluate((element) => {
    element.style.setProperty("--m3e-shape-family", "bevel");
    element.style.setProperty("--m3e-shape-family-start-end", "round");
  });
  const surfaces = page.locator(".state-layer, .focus-ring, .ripple, img, video, .toggle-container");
  for (const surface of await surfaces.all()) {
    for (const corner of ["start-start", "start-end", "end-start", "end-end"]) {
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
});
Then("each item and media surface uses its configured shape family", async ({ page }) => {
  const bases = page.locator("m3e-list-item .base, m3e-list-item-button .base, m3e-list-option .base");
  for (const base of await bases.all()) {
    await expect(base).toHaveCSS("corner-start-start-shape", "superellipse(1)");
    await expect(base).toHaveCSS("corner-end-start-shape", "superellipse(0)");
  }
  await expect(page.locator("img")).toHaveCSS("corner-shape", "superellipse(1)");
  await expect(page.locator("video")).toHaveCSS("corner-end-end-shape", "superellipse(0)");
  await expect(page.locator("video")).toHaveCSS("corner-end-start-shape", "superellipse(1)");
  await expect(page.locator(".toggle-container")).toHaveCSS("corner-end-start-shape", "superellipse(0)");
  await expect(page.locator("img")).toHaveCSS("border-radius", "0px");
});
Given("a segmented list with labelled rich items", ({ list }) => {
  list.html = `<m3e-list variant="segmented" aria-label="Settings">
    <m3e-list-item>
      <span slot="overline">Account</span>
      Profile
      <span slot="supporting-text">Manage your details</span>
      <span slot="trailing">Updated</span>
    </m3e-list-item>
    <m3e-list-item>Preferences</m3e-list-item>
  </m3e-list>`;
});
Then("the list exposes both items and their slotted content", async ({ page }) => {
  const list = page.getByRole("list", { name: "Settings" });
  const items = list.getByRole("listitem");
  await expect(items).toHaveCount(2);
  await expect(items.nth(0)).toContainText("Profile");
  await expect(items.nth(0)).toContainText("Account");
  await expect(items.nth(0)).toContainText("Manage your details");
  await expect(items.nth(0)).toContainText("Updated");
  await expect(list).toHaveAttribute("variant", "segmented");
});
