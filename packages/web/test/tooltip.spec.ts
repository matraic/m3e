import type { Page } from "@playwright/test";

import { expect, test } from "./fixtures";

type Tip = HTMLElement & {
  isOpen: boolean;
  disabled: boolean;
  position: string;
  touchGestures: string;
  showDelay: number;
  hideDelay: number;
  show(): Promise<void>;
  hide(restoreFocus?: boolean): void;
};

const page_ = (page: Page, selector = "m3e-tooltip") => page.locator(selector);
const isOpen = (page: Page, selector = "m3e-tooltip") => page_(page, selector).evaluate((el) => (el as Tip).isOpen);
const popoverOpen = (page: Page, selector = "m3e-tooltip") =>
  page_(page, selector).evaluate((el) => el.shadowRoot!.querySelector(".base")!.matches(":popover-open"));

const standard = (attrs = "") => `
  <button id="btn" style="margin: 200px">Target</button>
  <m3e-tooltip for="btn" ${attrs}>Tooltip text</m3e-tooltip>
`;

test.describe("m3e-tooltip", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("has default delays and is hidden by default", async ({ page, render }) => {
    await render(standard());
    const el = page_(page);

    expect(await el.evaluate((e) => [(e as Tip).showDelay, (e as Tip).hideDelay, (e as Tip).position])).toEqual([
      0,
      200,
      "below",
    ]);
    expect(await isOpen(page)).toBe(false);
    await expect(el).toHaveAttribute("aria-hidden", "true");
  });

  test("shows when the control is hovered and hides when the pointer leaves", async ({ page, render }) => {
    await render(standard());

    await page.locator("#btn").hover();
    await expect.poll(() => isOpen(page)).toBe(true);
    await expect.poll(() => popoverOpen(page)).toBe(true);

    await page.mouse.move(0, 0);
    await expect.poll(() => isOpen(page)).toBe(false);
    expect(await popoverOpen(page)).toBe(false);
  });

  test("show-delay postpones showing", async ({ page, render }) => {
    await render(standard(`show-delay="600"`));

    await page.locator("#btn").hover();
    expect(await isOpen(page)).toBe(false);

    await expect.poll(() => isOpen(page)).toBe(true);
  });

  test("shows for keyboard focus and hides on blur", async ({ page, render }) => {
    await render(standard());

    await page.keyboard.press("Tab");
    await expect(page.locator("#btn")).toBeFocused();
    await expect.poll(() => isOpen(page)).toBe(true);

    await page.keyboard.press("Tab");
    await expect.poll(() => isOpen(page)).toBe(false);
  });

  test("does not show when the control is focused with the pointer", async ({ page, render }) => {
    await render(standard());

    await page.locator("#btn").click();
    await page.mouse.move(0, 0);

    await expect.poll(() => isOpen(page)).toBe(false);
  });

  test("Escape dismisses the tooltip", async ({ page, render }) => {
    await render(standard());
    await page.keyboard.press("Tab");
    await expect.poll(() => isOpen(page)).toBe(true);

    await page.keyboard.press("Escape");

    await expect.poll(() => isOpen(page)).toBe(false);
  });

  test("clicking the control dismisses the tooltip", async ({ page, render }) => {
    await render(standard());
    await page.locator("#btn").hover();
    await expect.poll(() => isOpen(page)).toBe(true);

    await page.locator("#btn").click();

    await expect.poll(() => isOpen(page)).toBe(false);
  });

  test("show and hide can be called manually", async ({ page, render }) => {
    await render(standard());
    const el = page_(page);

    await el.evaluate((e) => (e as Tip).show());
    expect(await isOpen(page)).toBe(true);
    expect(await popoverOpen(page)).toBe(true);

    await el.evaluate((e) => (e as Tip).hide());
    expect(await isOpen(page)).toBe(false);
    expect(await popoverOpen(page)).toBe(false);
  });

  test("a disabled tooltip does not show and disabling hides an open one", async ({ page, render }) => {
    await render(standard(`disabled`));
    const el = page_(page);

    await el.evaluate((e) => (e as Tip).show());
    expect(await isOpen(page)).toBe(false);

    await el.evaluate((e) => {
      (e as Tip).disabled = false;
    });
    await el.evaluate((e) => (e as Tip).show());
    expect(await isOpen(page)).toBe(true);

    await el.evaluate((e) => {
      (e as Tip).disabled = true;
    });
    await expect.poll(() => isOpen(page)).toBe(false);
  });

  test("does not show for a disabled control", async ({ page, render }) => {
    await render(`
      <m3e-button id="btn" disabled style="margin: 200px">Target</m3e-button>
      <m3e-tooltip for="btn">Tooltip text</m3e-tooltip>
    `);

    await page_(page).evaluate((e) => (e as Tip).show());

    expect(await isOpen(page)).toBe(false);
  });

  test("showing one tooltip hides another", async ({ page, render }) => {
    await render(`
      <button id="a" style="margin: 100px">A</button>
      <button id="b" style="margin: 100px">B</button>
      <m3e-tooltip id="ta" for="a">First</m3e-tooltip>
      <m3e-tooltip id="tb" for="b">Second</m3e-tooltip>
    `);

    await page_(page, "#ta").evaluate((e) => (e as Tip).show());
    await page_(page, "#tb").evaluate((e) => (e as Tip).show());

    expect(await isOpen(page, "#ta")).toBe(false);
    expect(await isOpen(page, "#tb")).toBe(true);
  });

  test("describes its control with its text", async ({ page, render }) => {
    await render(standard());

    await expect
      .poll(() =>
        page.locator("#btn").evaluate((el) => {
          const ids = (el.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean);
          return ids.map((id) => document.getElementById(id)?.textContent?.trim());
        }),
      )
      .toContain("Tooltip text");
  });

  test("removes the description when detached from its control", async ({ page, render }) => {
    await render(standard());
    await expect(page.locator("#btn")).toHaveAttribute("aria-describedby", /.+/);

    await page_(page).evaluate((el) => el.removeAttribute("for"));

    await expect(page.locator("#btn")).not.toHaveAttribute("aria-describedby", /.+/);
  });

  test("falls back to defaults for invalid position and touch-gestures", async ({ page, render }) => {
    await render(standard(`position="x" touch-gestures="x"`));

    await expect
      .poll(() => page_(page).evaluate((e) => [(e as Tip).position, (e as Tip).touchGestures]))
      .toEqual(["below", "auto"]);
  });

  for (const position of ["above", "below", "before", "after"] as const) {
    test(`position="${position}" places the tooltip on that side of the control`, async ({ page, render }) => {
      await render(standard(`position="${position}"`));
      await page_(page).evaluate((e) => (e as Tip).show());
      await expect.poll(() => popoverOpen(page)).toBe(true);

      const rects = await page.evaluate(() => {
        const base = document.querySelector("m3e-tooltip")!.shadowRoot!.querySelector(".base")!.getBoundingClientRect();
        const target = document.querySelector("#btn")!.getBoundingClientRect();
        return { base: base.toJSON(), target: target.toJSON() };
      });

      switch (position) {
        case "above":
          expect(rects.base.bottom).toBeLessThanOrEqual(rects.target.top + 1);
          break;
        case "below":
          expect(rects.base.top).toBeGreaterThanOrEqual(rects.target.bottom - 1);
          break;
        case "before":
          expect(rects.base.right).toBeLessThanOrEqual(rects.target.left + 1);
          break;
        case "after":
          expect(rects.base.left).toBeGreaterThanOrEqual(rects.target.right - 1);
          break;
      }
    });
  }
});

const rich = (content: string, attrs = "") => `
  <button id="btn" style="margin: 200px">Target</button>
  <m3e-rich-tooltip for="btn" ${attrs}>${content}</m3e-rich-tooltip>
`;

const interactive = (attrs = "") =>
  rich(
    `<span slot="subhead">Subhead</span>Supporting text
     <m3e-button slot="actions"><m3e-rich-tooltip-action>Done</m3e-rich-tooltip-action></m3e-button>`,
    attrs,
  );

test.describe("m3e-rich-tooltip", () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
  });

  test("a non-interactive rich tooltip behaves like a standard tooltip", async ({ page, render }) => {
    await render(rich("Plain text"));
    const el = page_(page, "m3e-rich-tooltip");

    await expect(el).toHaveAttribute("aria-hidden", "true");
    await page.locator("#btn").hover();
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(true);

    await page.mouse.move(0, 0);
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(false);
    await expect(page.locator("#btn")).not.toHaveAttribute("aria-haspopup");
  });

  test("an interactive rich tooltip is a dialog opened by clicking its control", async ({ page, render }) => {
    await render(interactive());
    const el = page_(page, "m3e-rich-tooltip");

    await expect(page.locator("#btn")).toHaveAttribute("aria-haspopup", "dialog");
    await expect(el).not.toHaveAttribute("aria-hidden");

    await page.locator("#btn").hover();
    await page.waitForTimeout(100);
    expect(await isOpen(page, "m3e-rich-tooltip")).toBe(false);

    await page.locator("#btn").click();
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(true);
    expect(await el.evaluate((e) => e.shadowRoot!.querySelector(".base")!.getAttribute("role"))).toBe("dialog");

    await page.locator("#btn").click();
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(false);
  });

  test("the subhead labels the dialog", async ({ page, render }) => {
    await render(interactive());

    const labelledBy = await page_(page, "m3e-rich-tooltip").evaluate((e) => {
      const base = e.shadowRoot!.querySelector(".base")!;
      const id = base.getAttribute("aria-labelledby");
      return id && e.shadowRoot!.getElementById(id)?.querySelector("slot")?.assignedNodes()[0]?.textContent?.trim();
    });

    expect(labelledBy).toBe("Subhead");
  });

  test("Escape closes the dialog and restores focus to the control", async ({ page, render }) => {
    await render(interactive());
    await page.locator("#btn").click();
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(true);

    await page.keyboard.press("Tab");
    await expect(page.getByRole("button", { name: "Done" })).toBeFocused();
    await page.keyboard.press("Escape");

    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(false);
    await expect(page.locator("#btn")).toBeFocused();
  });

  test("Escape closes the dialog while focus is still on the control", async ({ page, render }) => {
    await render(interactive());
    await page.locator("#btn").click();
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(true);
    await expect(page.locator("#btn")).toBeFocused();

    await page.keyboard.press("Escape");

    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(false);
    await expect(page.locator("#btn")).toBeFocused();
  });

  test("clicking outside closes the dialog", async ({ page, render }) => {
    await render(interactive());
    await page.locator("#btn").click();
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(true);

    await page.mouse.click(5, 5);

    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(false);
  });

  test("an action closes the dialog and restores focus by default", async ({ page, render }) => {
    await render(interactive());
    await page.locator("#btn").click();
    await expect.poll(() => popoverOpen(page, "m3e-rich-tooltip")).toBe(true);

    await page.getByRole("button", { name: "Done" }).click();

    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(false);
    await expect(page.locator("#btn")).toBeFocused();
  });

  test("disable-restore-focus leaves focus where it is", async ({ page, render }) => {
    await render(
      rich(
        `Supporting text
         <m3e-button slot="actions"><m3e-rich-tooltip-action disable-restore-focus>Done</m3e-rich-tooltip-action></m3e-button>`,
      ),
    );
    await page.locator("#btn").click();
    await expect.poll(() => popoverOpen(page, "m3e-rich-tooltip")).toBe(true);

    await page.getByRole("button", { name: "Done" }).click();

    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(false);
    await expect(page.locator("#btn")).not.toBeFocused();
  });

  test("raises beforetoggle and toggle, and beforetoggle can cancel opening", async ({ page, render }) => {
    await render(interactive());
    const el = page_(page, "m3e-rich-tooltip");
    await el.evaluate((e) => {
      const w = window as unknown as { events: string[] };
      w.events = [];
      e.addEventListener("beforetoggle", (ev) => w.events.push(`before:${(ev as ToggleEvent).newState}`));
      e.addEventListener("toggle", (ev) => w.events.push(`toggle:${(ev as ToggleEvent).newState}`));
    });

    await page.locator("#btn").click();
    await expect.poll(() => isOpen(page, "m3e-rich-tooltip")).toBe(true);
    await page.locator("#btn").click();
    await expect
      .poll(() => page.evaluate(() => (window as unknown as { events: string[] }).events))
      .toEqual(["before:open", "toggle:open", "before:closed", "toggle:closed"]);
    expect(await isOpen(page, "m3e-rich-tooltip")).toBe(false);

    await el.evaluate((e) => e.addEventListener("beforetoggle", (ev) => ev.preventDefault()));
    await page.locator("#btn").click();
    await expect.poll(() => popoverOpen(page, "m3e-rich-tooltip")).toBe(false);
  });

  test("describes its control with its text when not interactive", async ({ page, render }) => {
    await render(rich(`<span slot="subhead">Head</span>Body text`));

    await expect
      .poll(() =>
        page.locator("#btn").evaluate((el) => {
          const ids = (el.getAttribute("aria-describedby") ?? "").split(" ").filter(Boolean);
          return ids.map((id) => document.getElementById(id)?.textContent?.trim()).join("|");
        }),
      )
      .toMatch(/^Head(?!\/n)\s*Body text$/);
  });

  test("falls back to the default position when invalid", async ({ page, render }) => {
    await render(rich("Text", `position="x"`));

    await expect.poll(() => page_(page, "m3e-rich-tooltip").evaluate((e) => (e as Tip).position)).toBe("below-after");
  });
});
