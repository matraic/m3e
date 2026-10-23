import { expect, test } from "./fixtures";

test.describe("m3e-button-group", () => {
  test("exposes a group containing its buttons", async ({ page, render }) => {
    await render(`
      <m3e-button-group>
        <m3e-button>Save</m3e-button>
        <m3e-button>Cancel</m3e-button>
      </m3e-button-group>
    `);

    await expect(page.getByRole("group")).toBeVisible();
    await expect(page.getByRole("button", { name: "Save" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Cancel" })).toBeVisible();
  });

  test("makes toggle buttons exclusive radio options by default", async ({ page, render }) => {
    await render(`
      <m3e-button-group>
        <m3e-button toggle>Day</m3e-button>
        <m3e-button toggle>Week</m3e-button>
        <m3e-button toggle>Month</m3e-button>
      </m3e-button-group>
    `);

    const day = page.getByRole("radio", { name: "Day" });
    const week = page.getByRole("radio", { name: "Week" });
    const month = page.getByRole("radio", { name: "Month" });
    await expect(page.getByRole("radiogroup")).toBeVisible();

    await week.click();
    await expect(week).toHaveAttribute("selected", "");
    await expect(day).not.toHaveAttribute("selected");

    await month.click();
    await expect(month).toHaveAttribute("selected", "");
    await expect(week).not.toHaveAttribute("selected");
  });

  test("allows multiple toggle buttons to be selected when multi is set", async ({ page, render }) => {
    await render(`
      <m3e-button-group multi>
        <m3e-button toggle>Bold</m3e-button>
        <m3e-button toggle>Italic</m3e-button>
      </m3e-button-group>
    `);

    const group = page.getByRole("group");
    const bold = page.getByRole("button", { name: "Bold" });
    const italic = page.getByRole("button", { name: "Italic" });
    await expect(group).toBeVisible();

    await bold.click();
    await italic.click();

    await expect(bold).toHaveAttribute("aria-pressed", "true");
    await expect(italic).toHaveAttribute("aria-pressed", "true");
  });

  test("accepts the connected variant and supported sizes", async ({ page, render }) => {
    await render('<m3e-button-group variant="connected" size="large"><m3e-button>One</m3e-button></m3e-button-group>');

    const group = page.locator("m3e-button-group");
    await expect(group).toHaveAttribute("variant", "connected");
    await expect(group).toHaveAttribute("size", "large");
  });

  for (const motion of ["standard", "expressive"] as const) {
    test(`resizes standard group buttons with the ${motion} fast spatial spring`, async ({ page, render }) => {
      await render(`
        <m3e-theme motion="${motion}">
          <div id="probe" style="transition: width var(--md-sys-motion-spring-fast-spatial)"></div>
          <m3e-button-group>
            <m3e-button>Save</m3e-button>
            <m3e-icon-button><m3e-icon name="share"></m3e-icon></m3e-icon-button>
          </m3e-button-group>
        </m3e-theme>
      `);

      const timings = await page.evaluate(() => {
        const timing = (element: Element) => {
          const style = getComputedStyle(element);
          return [style.transitionDuration, style.transitionTimingFunction];
        };
        return {
          spring: timing(document.querySelector("#probe")!),
          buttons: [...document.querySelectorAll("m3e-button-group > *")].flatMap((x) => [
            timing(x),
            timing(x.shadowRoot!.querySelector(".wrapper")!),
          ]),
        };
      });
      expect(timings.buttons).toEqual([timings.spring, timings.spring, timings.spring, timings.spring]);
    });
  }

  test("overshoots the width of pressed and adjacent buttons with the expressive scheme", async ({ page, render }) => {
    await render(`
      <m3e-theme motion="expressive">
        <m3e-button-group>
          <m3e-button>One</m3e-button>
          <m3e-button>Two</m3e-button>
          <m3e-button>Three</m3e-button>
        </m3e-button-group>
      </m3e-theme>
    `);

    await page.getByRole("button", { name: "Two" }).hover();
    await page.mouse.down();
    await page.waitForFunction(() =>
      [...document.querySelectorAll("m3e-button")].every((x) =>
        x.getAnimations().some((a) => (a as CSSTransition).transitionProperty === "width"),
      ),
    );

    // Peak progress of each width transition, sampled every millisecond while paused.
    const peaks = await page.evaluate(() =>
      [...document.querySelectorAll("m3e-button")].map((x) => {
        const transition = x.getAnimations().find((a) => (a as CSSTransition).transitionProperty === "width")!;
        transition.pause();
        let peak = 0;
        for (let time = 0; time < Number(transition.effect!.getComputedTiming().duration); time++) {
          transition.currentTime = time;
          peak = Math.max(peak, transition.effect!.getComputedTiming().progress ?? 0);
        }
        return peak;
      }),
    );
    await page.mouse.up();

    for (const peak of peaks) {
      expect(peak).toBeGreaterThan(1.05);
    }
  });

  test("resizes pressed buttons without a transition when reduced motion is preferred", async ({ page, render }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await render(`
      <m3e-button-group>
        <m3e-button>One</m3e-button>
        <m3e-button>Two</m3e-button>
      </m3e-button-group>
    `);

    const two = page.getByRole("button", { name: "Two" });
    const width = (await two.boundingBox())!.width;
    await two.hover();
    await page.mouse.down();

    await expect.poll(async () => (await two.boundingBox())!.width).toBeGreaterThan(width);
    expect(await two.evaluate((x) => x.getAnimations().length)).toBe(0);
    await page.mouse.up();
  });
});
