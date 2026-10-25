import { expect, test } from "./fixtures";

/** The items of the menus that check motion. */
const ITEMS = ["Share", "Edit details", "Duplicate", "Move to folder", "Download", "Delete permanently"];

/**
 * A FAB menu with `ITEMS`, and a probe that resolves the fast spatial spring of `motion`. The FAB sits at the bottom end
 * of the page, so that the menu opens above it, aligned to its end, as in use.
 */
function motionMenu(motion: "standard" | "expressive"): string {
  return `
    <m3e-theme motion="${motion}">
      <div id="probe" style="margin: 50%; width: 0; transition: width var(--md-sys-motion-spring-fast-spatial)"></div>
      <m3e-fab aria-label="More actions" style="position: fixed; right: 16px; bottom: 16px">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        ${ITEMS.map((x) => `<m3e-fab-menu-item>${x}</m3e-fab-menu-item>`).join("")}
      </m3e-fab-menu>
    </m3e-theme>
  `;
}

test.describe("m3e-fab-menu", () => {
  test("opens from its FAB trigger and exposes menu items", async ({ page, render }) => {
    await render(`
      <m3e-fab style="margin-top: 50%;" aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>First action</m3e-fab-menu-item>
        <m3e-fab-menu-item>Second action</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const fab = page.getByRole("button", { name: "More actions" });
    const menu = page.getByRole("menu");

    await expect(fab).toHaveAttribute("aria-haspopup", "menu");
    await expect(fab).toHaveAttribute("aria-expanded", "false");
    await expect(fab).toHaveAttribute("aria-controls", "actions");

    await fab.click();

    await expect(fab).toHaveAttribute("aria-expanded", "true");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("menuitem")).toHaveCount(2);
    await expect(menu.getByRole("menuitem", { name: "First action" })).toBeVisible();
  });

  test("closes when a menu item is selected and restores focus to the FAB", async ({ page, render }) => {
    await render(`
      <m3e-fab style="margin-top: 50%;" aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>New document</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    const fab = page.getByRole("button", { name: "More actions" });
    const menu = page.getByRole("menu");

    await fab.click();
    await page.getByRole("menuitem", { name: "New document" }).click();

    await expect(menu).toBeHidden();
    await expect(fab).toHaveAttribute("aria-expanded", "false");
    await expect(fab).toBeFocused();
  });

  test("closes on Escape and restores focus to the FAB", async ({ page, render }) => {
    await render(`
      <m3e-fab style="margin-top: 50%;" aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>First action</m3e-fab-menu-item>
        <m3e-fab-menu-item>Second action</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    const fab = page.getByRole("button", { name: "More actions" });

    await fab.click();
    await expect(page.getByRole("menu")).toBeVisible();
    await page.keyboard.press("Escape");

    await expect(page.getByRole("menu")).toBeHidden();
    await expect(fab).toHaveAttribute("aria-expanded", "false");
    await expect(fab).toBeFocused();
  });

  test("moves focus through menu items with arrow keys", async ({ page, render }) => {
    await render(`
      <m3e-fab style="margin-top: 50%;" aria-label="More actions">
        <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
      </m3e-fab>
      <m3e-fab-menu id="actions">
        <m3e-fab-menu-item>First action</m3e-fab-menu-item>
        <m3e-fab-menu-item disabled>Unavailable action</m3e-fab-menu-item>
        <m3e-fab-menu-item>Last action</m3e-fab-menu-item>
      </m3e-fab-menu>
    `);
    const fab = page.getByRole("button", { name: "More actions" });
    const first = page.getByRole("menuitem", { name: "First action" });
    const last = page.getByRole("menuitem", { name: "Last action" });

    await fab.click();
    await expect(first).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(last).toBeFocused();
    await page.keyboard.press("ArrowUp");
    await expect(first).toBeFocused();
  });

  test("accepts supported variants and falls back for an unsupported variant", async ({ page, render }) => {
    await render(`
      <m3e-fab-menu variant="primary"></m3e-fab-menu>
      <m3e-fab-menu variant="secondary"></m3e-fab-menu>
      <m3e-fab-menu variant="tertiary"></m3e-fab-menu>
      <m3e-fab-menu variant="unsupported"></m3e-fab-menu>
    `);
    const menus = page.locator("m3e-fab-menu");

    for (const [index, variant] of ["primary", "secondary", "tertiary", "primary"].entries()) {
      await expect.poll(() => menus.nth(index).getAttribute("variant")).toBe(variant);
    }
  });

  test("staggers its items as Compose does, from the bottom when opening and from the top when closing", async ({
    page,
    render,
  }) => {
    await render(motionMenu("expressive"));

    const delays = await page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];
      const widthDelays = () =>
        items.map((x) => {
          const delay = x.style.getPropertyValue("--_fab-menu-item-delay");
          return delay ? parseFloat(delay) : undefined;
        });

      await menu.show(document.querySelector("m3e-fab")!);
      const open = widthDelays();
      document.getAnimations().forEach((a) => a.finish());
      menu.hide();
      return { open, close: widthDelays() };
    });

    // The first millisecond at which Compose shows or hides each item, top to bottom: its stagger counter animates with
    // the slow effects spring and is truncated to an integer (FloatingActionButtonMenu.kt, androidx ccf537e8, L208-L283).
    // The top item hides at once when closing.
    expect(delays.open).toEqual([114, 114, 81, 60, 43, 26]);
    expect(delays.close).toEqual([0, 26, 43, 60, 81, 114]);
  });

  for (const motion of ["standard", "expressive"] as const) {
    test(`grows each item from zero to its natural width with the ${motion} fast spatial spring`, async ({
      page,
      render,
    }) => {
      await render(motionMenu(motion));

      const result = await page.evaluate(async () => {
        const timing = (x: Animation) => [x.effect!.getTiming().duration, x.effect!.getTiming().easing];
        const probe = document.querySelector<HTMLElement>("#probe")!;
        probe.style.width = "1px";
        const spring = timing(probe.getAnimations()[0]);

        const menu = document.querySelector("m3e-fab-menu")!;
        const items = [...menu.querySelectorAll("m3e-fab-menu-item")];

        await menu.show(document.querySelector("m3e-fab")!);
        const transitions = items.map(
          (x) => x.getAnimations().find((a) => (a as CSSTransition).transitionProperty === "width")!,
        );
        const timings = transitions.map(timing);
        const keyframes = transitions.map((x) =>
          (x.effect as KeyframeEffect).getKeyframes().map((k) => parseFloat(String(k.width))),
        );

        // Once grown, the items are back at their natural widths.
        document.getAnimations().forEach((a) => a.finish());
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        return {
          spring,
          timings,
          keyframes,
          natural: items.map((x) => x.getBoundingClientRect().width),
        };
      });

      expect(result.timings).toEqual(ITEMS.map(() => result.spring));
      result.keyframes.forEach(([from, to], i) => {
        expect(from).toBe(0);
        expect(to).toBeCloseTo(result.natural[i], 2);
      });
    });
  }

  test("keeps the labels and the menu's width in place while the items grow", async ({ page, render }) => {
    await render(motionMenu("expressive"));

    const result = await page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const fab = document.querySelector("m3e-fab")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];
      const settle = async () => {
        document.getAnimations().forEach((a) => a.finish());
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      };
      // Positions relative to the end edge of the menu, which is anchored to the FAB.
      const geometry = () => {
        const end = menu.getBoundingClientRect().right;
        return items.map((x) => {
          const text = document.createRange();
          text.selectNodeContents(x);
          const box = x.getBoundingClientRect();
          return { width: box.width, end: box.right - end, label: text.getBoundingClientRect().right - end };
        });
      };

      await menu.show(fab);
      await settle();
      const rest = geometry();
      const menuWidth = menu.getBoundingClientRect().width;
      menu.hide();
      await settle();

      // Largest drift from the rest geometry and peak width of each item, sampled every millisecond while paused.
      await menu.show(fab);
      const transitions = items.map(
        (x) => x.getAnimations().find((a) => (a as CSSTransition).transitionProperty === "width")!,
      );
      transitions.forEach((x) => x.pause());
      const end = Math.max(...transitions.map((x) => Number(x.effect!.getComputedTiming().endTime)));
      const drift = { end: 0, label: 0, menu: 0 };
      const peaks = items.map(() => 0);
      for (let time = 0; time <= end; time++) {
        transitions.forEach((x) => (x.currentTime = time));
        geometry().forEach((x, i) => {
          if (x.width > 0) drift.end = Math.max(drift.end, Math.abs(x.end - rest[i].end));
          drift.label = Math.max(drift.label, Math.abs(x.label - rest[i].label));
          peaks[i] = Math.max(peaks[i], x.width / rest[i].width);
        });
        drift.menu = Math.max(drift.menu, Math.abs(menu.getBoundingClientRect().width - menuWidth));
      }
      return { drift, peaks };
    });

    expect(result.drift.end).toBeLessThan(0.01);
    expect(result.drift.label).toBeLessThan(0.01);
    expect(result.drift.menu).toBeLessThan(0.01);
    for (const peak of result.peaks) {
      expect(peak).toBeGreaterThan(1.05);
    }
  });

  test("grows items back from where they are when reopened while closing", async ({ page, render }) => {
    await render(motionMenu("expressive"));

    const result = await page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const fab = document.querySelector("m3e-fab")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];
      const widthTransitions = () =>
        items.map((x) => x.getAnimations().find((a) => (a as CSSTransition).transitionProperty === "width")!);

      await menu.show(fab);
      document.getAnimations().forEach((a) => a.finish());
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const natural = items.map((x) => x.getBoundingClientRect().width);

      menu.hide();
      widthTransitions().forEach((x) => {
        x.pause();
        x.currentTime = 150;
      });
      const before = items.map((x) => x.getBoundingClientRect().width);
      await menu.show(fab);
      const after = items.map((x) => x.getBoundingClientRect().width);
      const targets = widthTransitions().map((x) => {
        const keyframes = (x.effect as KeyframeEffect).getKeyframes();
        return parseFloat(String(keyframes[keyframes.length - 1]!.width));
      });
      return { natural, before, after, targets };
    });

    result.after.forEach((x, i) => expect(x).toBeCloseTo(result.before[i], 2));
    result.targets.forEach((x, i) => expect(x).toBeCloseTo(result.natural[i], 2));
  });

  test("lets an open item follow later changes to its content", async ({ page, render }) => {
    await render(motionMenu("expressive"));
    const share = page.locator("m3e-fab-menu-item").first();

    await page.getByRole("button", { name: "More actions" }).click();
    await page.evaluate(() => document.getAnimations().forEach((a) => a.finish()));
    await expect.poll(() => share.evaluate((x) => x.getAnimations().length)).toBe(0);
    const before = await share.evaluate((x) => x.getBoundingClientRect().width);

    await share.evaluate((x) => (x.textContent = "Share with your team"));

    await expect.poll(() => share.evaluate((x) => x.getBoundingClientRect().width)).toBeGreaterThan(before + 40);
  });

  test("opens and closes its items without motion when reduced motion is preferred", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(motionMenu("expressive"));

    const result = await page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];

      await menu.show(document.querySelector("m3e-fab")!);
      const open = {
        animations: items.flatMap((x) => x.getAnimations()).length,
        widths: items.map((x) => x.getBoundingClientRect().width),
      };
      menu.hide();
      return { open, display: getComputedStyle(menu).display };
    });

    expect(result.open.animations).toBe(0);
    for (const width of result.open.widths) {
      expect(width).toBeGreaterThan(40);
    }
    expect(result.display).toBe("none");
  });
});
