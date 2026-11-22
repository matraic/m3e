import { mergeTests } from "@playwright/test";
import { createBdd, test as bddTest } from "playwright-bdd";
import type { M3eDialogElement } from "@m3e/web/dialog";

import { expect, test as componentTest } from "../fixtures";
import { DialogHarness } from "./dialog.harness";

export const test = mergeTests(componentTest, bddTest).extend<{ dialog: DialogHarness }>({
  dialog: async ({ page, render }, use) => use(new DialogHarness(page, render)),
});
const { Given, When, Then } = createBdd(test);

Given("a dialog with a trigger and title {string}", ({ dialog }, title: string) => {
  dialog.withTrigger = true;
  dialog.title = title;
});
When("the dialog renders", async ({ dialog }) => dialog.render());
When("the user clicks the dialog trigger", async ({ dialog }) => dialog.trigger.click());
Then("the dialog trigger has a dialog popup", async ({ dialog }) =>
  expect(dialog.trigger).toHaveAttribute("aria-haspopup", "dialog"),
);
Then("the dialog named {string} is visible", async ({ page }, title: string) =>
  expect(page.getByRole("dialog", { name: title, exact: true })).toBeVisible(),
);

Given("a dialog", () => {});
When("the application observes dialog events", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => {
    const events: string[] = [];
    for (const name of ["opening", "opened", "closing", "closed"]) {
      element.addEventListener(name, () => {
        events.push(name);
        element.setAttribute("data-events", events.join(","));
      });
    }
  }),
);
When("the application shows the dialog", async ({ dialog }) => dialog.show());
Then("the dialog is visible", async ({ page }) => expect(page.getByRole("dialog")).toBeVisible());
Then("the dialog events are {string}", async ({ dialog }, events: string) =>
  expect(dialog.dialog).toHaveAttribute("data-events", events),
);
When("the application hides the dialog", async ({ dialog }) => dialog.hide());
Then("the dialog is closed", async ({ dialog }) => expect(dialog.dialog.locator("dialog")).not.toHaveAttribute("open"));
When("the application prevents the dialog opening event", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => element.addEventListener("opening", (event) => event.preventDefault())),
);
When("the application prevents the dialog closing event", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => element.addEventListener("closing", (event) => event.preventDefault())),
);

Given("a dialog with an {string} action returning {string}", ({ dialog }, label: string, value: string) => {
  dialog.action = `<div slot="actions"><m3e-button><m3e-dialog-action return-value="${value}">${label}</m3e-dialog-action></m3e-button></div>`;
});
When("the user clicks the dialog action {string}", async ({ page }, label: string) =>
  page.getByRole("button", { name: label, exact: true }).click(),
);
Then("the dialog return value is {string}", async ({ dialog }, value: string) =>
  expect(dialog.dialog).toHaveJSProperty("returnValue", value),
);

Given("a dismissible dialog with close label {string}", ({ dialog }, label: string) => {
  dialog.attributes = `dismissible close-label="${label}"`;
});
When("the user dismisses the dialog using {string}", async ({ page }, method: string) => {
  switch (method) {
    case "Escape":
      await page.keyboard.press("Escape");
      break;
    case "backdrop":
      await page.mouse.click(5, 5);
      break;
    default:
      throw new Error(`Unknown dialog dismissal method: ${method}`);
  }
});

Given("a dialog with closing disabled", ({ dialog }) => {
  dialog.attributes = "disable-close";
});
When("the application prevents and counts dialog cancel events", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => {
    element.setAttribute("data-cancel-count", "0");
    element.addEventListener("cancel", (event) => {
      element.setAttribute("data-cancel-count", String(Number(element.getAttribute("data-cancel-count")) + 1));
      event.preventDefault();
    });
  }),
);
Then("the dialog cancel count is {int}", async ({ dialog }, count: number) =>
  expect(dialog.dialog).toHaveAttribute("data-cancel-count", String(count)),
);

Given("a dialog with focusable content and an action", ({ dialog }) => {
  dialog.content = '<input aria-label="First" />';
  dialog.action = '<div slot="actions"><m3e-button><m3e-dialog-action>Close</m3e-dialog-action></m3e-button></div>';
});
When("the user focuses dialog content", async ({ page }) => page.getByRole("textbox", { name: "First" }).focus());
When("the application sets the dialog open attribute", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => element.setAttribute("open", "")),
);
Then("the dialog does not have the open attribute", async ({ dialog }) =>
  expect(dialog.dialog).not.toHaveAttribute("open"),
);

Given("a dialog with title {string} and content {string}", ({ dialog }, title: string, content: string) => {
  dialog.title = title;
  dialog.content = `<p>${content}</p>`;
});
Then("dialog content {string} is visible", async ({ page }, content: string) =>
  expect(page.getByText(content, { exact: true })).toBeVisible(),
);
Then("the dialog has slotted actions", async ({ dialog }) =>
  expect.poll(() => dialog.dialog.evaluate((element) => element.matches(":state(--with-actions)"))).toBe(true),
);
Then("the dialog does not have slotted actions", async ({ dialog }) =>
  expect.poll(() => dialog.dialog.evaluate((element) => element.matches(":state(--with-actions)"))).toBe(false),
);

Then("tabbing stays inside the dialog", async ({ page }) => {
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    await expect(page.locator("#outside")).not.toBeFocused();
    await expect.poll(() => page.evaluate(() => document.activeElement?.closest("m3e-dialog") !== null)).toBe(true);
  }
});

Given("a dialog with focus trapping disabled", ({ dialog }) => {
  dialog.attributes = "no-focus-trap";
});
Then("the dialog focus trap is disabled", async ({ dialog }) =>
  expect(dialog.dialog.locator("m3e-focus-trap")).toHaveAttribute("disabled"),
);

Given("a dismissible dialog with a trigger", ({ dialog }) => {
  dialog.attributes = "dismissible";
  dialog.withTrigger = true;
});
Then("the dialog trigger has focus", async ({ dialog }) => expect(dialog.trigger).toBeFocused());

Given("an alert dialog with title {string}", ({ dialog }, title: string) => {
  dialog.attributes = "alert";
  dialog.title = title;
});
Then("the alert dialog named {string} is visible", async ({ page }, title: string) =>
  expect(page.getByRole("alertdialog", { name: title, exact: true })).toBeVisible(),
);
When("the application moves the dialog trigger to another button", async ({ page }) =>
  page.locator("m3e-dialog-trigger").evaluate((trigger) => {
    const parent = document.querySelector("#other-trigger");
    if (!parent) throw new Error("New dialog trigger is missing.");
    parent.append(trigger);
  }),
);
Then("the original dialog trigger has no popup", async ({ dialog }) =>
  expect(dialog.trigger).not.toHaveAttribute("aria-haspopup"),
);
Then("the new dialog trigger has a dialog popup", async ({ page }) =>
  expect(page.locator("#other-trigger")).toHaveAttribute("aria-haspopup", "dialog"),
);
When("the user clicks the new dialog trigger", async ({ page }) => page.locator("#other-trigger").click());
When("the application begins opening and {string} the dialog", async ({ dialog }, movement: string) =>
  dialog.dialog.evaluate(async (element: M3eDialogElement, action) => {
    const parent = element.parentElement;
    if (!parent) throw new Error("Dialog parent is missing.");
    const opening = element.show();
    if (action === "moves") {
      const newParent = document.createElement("div");
      document.body.append(newParent);
      newParent.append(element);
    } else if (action === "removes") {
      element.remove();
    } else {
      throw new Error(`Unknown dialog movement: ${action}`);
    }
    await opening;
    if (action === "removes") parent.append(element);
  }, movement),
);
Then("dialog background scrolling is unlocked", async ({ page }) =>
  expect(page.locator("html")).not.toHaveCSS("overflow", "hidden"),
);
When("the application moves the open dialog", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => {
    const parent = document.createElement("div");
    document.body.append(parent);
    parent.append(element);
  }),
);
When("the application moves the dialog during its opening event", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => {
    element.addEventListener(
      "opening",
      () => {
        const parent = document.createElement("div");
        document.body.append(parent);
        parent.append(element);
      },
      { once: true },
    );
  }),
);
When("the application moves the dialog during opening and immediately opens it again", async ({ dialog }) =>
  dialog.dialog.evaluate(async (element: M3eDialogElement) => {
    const first = element.show();
    const parent = document.createElement("div");
    document.body.append(parent);
    parent.append(element);
    await Promise.all([first, element.show()]);
  }),
);
When("the application sets the open attribute and immediately moves the dialog", async ({ dialog }) =>
  dialog.dialog.evaluate(async (element: M3eDialogElement) => {
    element.setAttribute("open", "");
    const parent = document.createElement("div");
    document.body.append(parent);
    parent.append(element);
    await element.updateComplete;
  }),
);
When("the application begins hiding, moves, and reopens the dialog", async ({ dialog }) =>
  dialog.dialog.evaluate(async (element: M3eDialogElement) => {
    const closing = element.hide();
    const parent = document.createElement("div");
    document.body.append(parent);
    parent.append(element);
    await Promise.all([closing, element.show()]);
  }),
);
Then("dialog background scrolling is locked", async ({ page }) =>
  expect(page.locator("html")).toHaveCSS("overflow", "hidden"),
);
When("the application tries to open the disconnected dialog", async ({ dialog }) =>
  dialog.dialog.evaluate(async (element: M3eDialogElement) => {
    const parent = element.parentElement;
    if (!parent) throw new Error("Dialog parent is missing.");
    element.remove();
    await element.updateComplete;
    let rejected = false;
    try {
      await element.show();
    } catch (error) {
      if (!(error instanceof DOMException) || error.name !== "InvalidStateError") throw error;
      rejected = true;
    }
    if (!rejected) throw new Error("Opening a disconnected dialog should fail.");
    parent.append(element);
  }),
);
When("the application sets the dialog return value to {string}", async ({ dialog }, value: string) =>
  dialog.dialog.evaluate((element: M3eDialogElement, result) => {
    element.returnValue = result;
  }, value),
);
When("the application hides the dialog with return value {string}", async ({ dialog }, value: string) =>
  dialog.dialog.evaluate((element: M3eDialogElement, result) => element.hide(result), value),
);
Then("the dialog open property and attribute are true", async ({ dialog }) => {
  await expect(dialog.dialog).toHaveJSProperty("open", true);
  await expect(dialog.dialog).toHaveAttribute("open");
});
Then("the dialog open property and attribute are false", async ({ dialog }) => {
  await expect(dialog.dialog).toHaveJSProperty("open", false);
  await expect(dialog.dialog).not.toHaveAttribute("open");
});
When("the application clears the dialog open property", async ({ dialog }) =>
  dialog.dialog.evaluate((element: M3eDialogElement) => {
    element.open = false;
  }),
);

Given("an outer dialog containing an inner dialog", ({ dialog }) => {
  dialog.secondDialog = "nested";
});
When("the user focuses the inner dialog trigger", async ({ page }) => page.locator("#inner-trigger").focus());
When("the application shows the inner dialog", async ({ page }) =>
  page.locator("#inner-dialog").evaluate((element: M3eDialogElement) => element.show()),
);
Then("the inner dialog is modal", async ({ page }) =>
  expect
    .poll(() =>
      page
        .locator("#inner-dialog")
        .locator("dialog")
        .evaluate((element) => element.matches(":modal")),
    )
    .toBe(true),
);
When("the application hides the inner dialog", async ({ page }) =>
  page.locator("#inner-dialog").evaluate((element: M3eDialogElement) => element.hide()),
);
Then("the outer dialog is modal", async ({ dialog }) =>
  expect
    .poll(() => dialog.dialog.evaluate((element) => element.shadowRoot?.querySelector("dialog")?.matches(":modal")))
    .toBe(true),
);
Then("the inner dialog trigger has focus", async ({ page }) => expect(page.locator("#inner-trigger")).toBeFocused());

Given("two separate dialogs", ({ dialog }) => {
  dialog.secondDialog = "separate";
});
When("the application sets the original page overflow to {string}", async ({ page }, value: string) =>
  page.locator("html").evaluate((element, overflow) => {
    element.style.overflow = overflow;
  }, value),
);
Then("the original page overflow is restored to {string}", async ({ page }, value: string) =>
  expect(page.locator("html")).toHaveCSS("overflow", value),
);
When("the application removes the outer dialog", async ({ dialog }) =>
  dialog.dialog.evaluate((element) => element.remove()),
);
