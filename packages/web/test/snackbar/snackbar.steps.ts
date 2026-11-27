import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";

import { expect, test as componentTest } from "../fixtures";
import { SnackbarHarness } from "./snackbar.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ snackbar: SnackbarHarness }>({
  snackbar: async ({ page, render }, use) => use(new SnackbarHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a closed snackbar", ({ snackbar }) => {
  snackbar.html = "<m3e-snackbar>File deleted</m3e-snackbar>";
});
When("the snackbar renders", async ({ snackbar }) => snackbar.render());
Then("the snackbar is hidden", async ({ snackbar }) => expect(snackbar.snackbar).toBeHidden());

Given("an open snackbar with no timeout", ({ snackbar }) => {
  snackbar.html = '<m3e-snackbar open duration="0">File deleted</m3e-snackbar>';
});
Then("the snackbar is visible and announced politely", async ({ snackbar }) => {
  await expect(snackbar.snackbar).toBeVisible();
  await expect(snackbar.snackbar).toHaveAttribute("aria-live", "polite");
  await expect(snackbar.snackbar).toHaveAttribute("popover", "manual");
  await expect(snackbar.page.getByText("File deleted")).toBeVisible();
});
When("the application removes the snackbar open attribute", async ({ snackbar }) =>
  snackbar.snackbar.evaluate((element) => element.removeAttribute("open")),
);

Given("an open snackbar with a {int} millisecond duration", ({ snackbar }, duration: number) => {
  snackbar.html = `<m3e-snackbar open duration="${duration}">File deleted</m3e-snackbar>`;
});
Then("the snackbar is hidden and no longer open", async ({ snackbar }) => {
  await expect(snackbar.snackbar).toBeHidden();
  await expect(snackbar.snackbar).not.toHaveAttribute("open");
});
When("{int} milliseconds pass", async ({ page }, milliseconds: number) => page.waitForTimeout(milliseconds));
Then("the snackbar is visible", async ({ snackbar }) => expect(snackbar.snackbar).toBeVisible());

Given("a closed snackbar with no timeout", ({ snackbar }) => {
  snackbar.html = '<m3e-snackbar duration="0">File deleted</m3e-snackbar>';
});
When("the snackbar renders and records toggle events", async ({ snackbar }) => {
  await snackbar.render();
  await snackbar.recordToggleEvents();
});
When("the application opens and closes the snackbar", async ({ snackbar }) => {
  await snackbar.setOpen();
  await snackbar.setOpen("m3e-snackbar", false);
});
Then("the snackbar toggle events are {string} and {string}", async ({ snackbar }, opened: string, closed: string) =>
  expect(await snackbar.toggleEvents()).toEqual([opened, closed]),
);

Given("two snackbars with no timeout", ({ snackbar }) => {
  snackbar.html = `
    <m3e-snackbar id="first" duration="0">First</m3e-snackbar>
    <m3e-snackbar id="second" duration="0">Second</m3e-snackbar>`;
});
When("the first snackbar renders open", async ({ snackbar }) => {
  await snackbar.render();
  await snackbar.setOpen("#first");
});
When("the application opens the second snackbar", async ({ snackbar }) => snackbar.setOpen("#second"));
Then("the second snackbar is visible", async ({ page }) => expect(page.locator("#second")).toBeVisible());
Then("the first snackbar is hidden", async ({ page }) => expect(page.locator("#first")).toBeHidden());

Given("plain and actionable snackbars", ({ snackbar }) => {
  snackbar.html = `
    <m3e-snackbar id="plain" open duration="0">Plain</m3e-snackbar>
    <m3e-snackbar id="actionable" open duration="0" action="Undo">Actionable</m3e-snackbar>`;
});
When("the snackbars render", async ({ snackbar }) => snackbar.render());
Then("only the actionable snackbar has an action button", async ({ page }) => {
  await expect(page.locator("#plain").getByRole("button")).toHaveCount(0);
  await expect(page.locator("#actionable").getByRole("button", { name: "Undo" })).toBeVisible();
});

Given("an actionable open snackbar with no timeout", ({ snackbar }) => {
  snackbar.html = '<m3e-snackbar open duration="0" action="Undo">File deleted</m3e-snackbar>';
});
When("the user clicks the action button", async ({ page }) => page.getByRole("button", { name: "Undo" }).click());
Then("the snackbar is hidden and the action was taken", async ({ snackbar }) => {
  await expect(snackbar.snackbar).toBeHidden();
  expect(await snackbar.actionTaken()).toBe(true);
});

Given("plain and dismissible snackbars", ({ snackbar }) => {
  snackbar.html = `
    <m3e-snackbar id="plain" open duration="0">Plain</m3e-snackbar>
    <m3e-snackbar id="dismissible" open duration="0" dismissible>Dismissible</m3e-snackbar>`;
});
Then("only the dismissible snackbar has a close button", async ({ page }) => {
  await expect(page.locator("#plain").getByRole("button")).toHaveCount(0);
  await expect(page.locator("#dismissible").getByRole("button", { name: "Close" })).toBeVisible();
});

Given("an actionable dismissible snackbar with no timeout", ({ snackbar }) => {
  snackbar.html = '<m3e-snackbar open duration="0" dismissible action="Undo">File deleted</m3e-snackbar>';
});
When("the user clicks the close button", async ({ page }) =>
  page.getByRole("button", { name: /close|dismiss/i }).click(),
);
Then("the snackbar is hidden and the action was not taken", async ({ snackbar }) => {
  await expect(snackbar.snackbar).toBeHidden();
  expect(await snackbar.actionTaken()).toBe(false);
});

Given("a dismissible snackbar with close label {string}", ({ snackbar }, closeLabel: string) => {
  snackbar.html = `<m3e-snackbar open duration="0" dismissible close-label="${closeLabel}">File deleted</m3e-snackbar>`;
});
Then("the close button is named {string}", async ({ page }, label: string) =>
  expect(page.getByRole("button", { name: label })).toBeVisible(),
);

Given("a dismissible snackbar with no timeout", ({ snackbar }) => {
  snackbar.html = '<m3e-snackbar open duration="0" dismissible>File deleted</m3e-snackbar>';
});

Given("an empty snackbar page", ({ snackbar }) => {
  snackbar.html = "<div></div>";
});
When("the snackbar page renders", async ({ snackbar }) => snackbar.render());
Then("the global snackbar service is available", async ({ page }) =>
  expect(
    await page.evaluate(() => typeof (window as typeof window & { M3eSnackbar: { open: unknown } }).M3eSnackbar.open),
  ).toBe("function"),
);
When(
  "the service opens a snackbar saying {string} with a {int} millisecond duration",
  async ({ snackbar }, message: string, duration: number) => snackbar.openViaService(message, { duration }),
);
Then("the service snackbar says {string}", async ({ page }, message: string) =>
  expect(page.getByText(message)).toBeVisible(),
);
Then("the service snackbar is removed after it closes", async ({ snackbar }) =>
  expect(snackbar.snackbar).toHaveCount(0),
);

When("the service opens a snackbar saying {string} with no timeout", async ({ snackbar }, message: string) =>
  snackbar.openViaService(message, { duration: 0 }),
);

When("the service opens a snackbar with an action callback", async ({ snackbar }) =>
  snackbar.openViaServiceWithCallback(),
);
Then("the service snackbar is removed", async ({ snackbar }) => expect(snackbar.snackbar).toHaveCount(0));
Then("the service action callback ran once", async ({ snackbar }) => expect(await snackbar.callbackCount()).toBe(1));

When("the service opens a dismissible snackbar with an action callback", async ({ snackbar }) =>
  snackbar.openViaServiceWithCallback(true),
);
Then("the service action callback did not run", async ({ snackbar }) => expect(await snackbar.callbackCount()).toBe(0));

When("the service opens a dismissible snackbar without an action", async ({ snackbar }) =>
  snackbar.openViaService("File deleted", true, { duration: 0 }),
);

When("the service opens an actionable dismissible snackbar", async ({ snackbar }) =>
  snackbar.openViaService("File deleted", "Undo", true, { duration: 0 }),
);
Then("the action and close buttons are visible", async ({ page }) => {
  await expect(page.getByRole("button", { name: "Undo" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close" })).toBeVisible();
});

When("the service opens a dismissible snackbar with close label {string}", async ({ snackbar }, closeLabel: string) =>
  snackbar.openViaService("File deleted", true, { duration: 0, closeLabel }),
);

When("the service dismisses the current snackbar", async ({ snackbar }) => snackbar.dismissViaService());
Then("no service snackbar exists", async ({ snackbar }) => expect(snackbar.snackbar).toHaveCount(0));

Given("an empty snackbar page with reduced motion", ({ snackbar }) => {
  snackbar.html = "<div></div>";
  snackbar.reducedMotion = "reduce";
});
