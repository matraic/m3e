import type { Page } from "@playwright/test";

type ArmedButton = HTMLElement & { widthTransition?: Promise<void> };

type MotionTimings = {
  spring: [string, string];
  buttons: [string, string][];
};

type NeighborMeasurements = {
  rest: { width: number; endPadding: number }[];
  held: { width: number; endPadding: number }[];
};

function armWidthTransition(button: ArmedButton): void {
  button.widthTransition = new Promise((resolve) => {
    const listener = (event: TransitionEvent) => {
      if (event.propertyName !== "width") return;
      button.removeEventListener("transitionrun", listener);
      [button, button.shadowRoot!.querySelector(".wrapper")!].forEach((element) =>
        element.getAnimations().forEach((animation) => animation.pause()),
      );
      resolve();
    };
    button.addEventListener("transitionrun", listener);
  });
}

export class ButtonGroupHarness {
  markup = "";
  motion?: string;
  motionTimings?: MotionTimings;
  widthPeaks?: number[];
  labelOverflow?: number;
  neighborMeasurements?: NeighborMeasurements;
  connectedWidthChange?: number;
  quickPressDeviation?: number;
  reducedMotionResult?: { pressedWidth: number; restWidth: number; animations: number };

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get group() {
    return this.page.locator("m3e-button-group");
  }

  button(name: string) {
    return this.page.locator("m3e-button").filter({ has: this.page.getByText(name, { exact: true }) });
  }

  radio(name: string) {
    return this.page.getByRole("radio", { name, exact: true });
  }

  async pressButton(name: string) {
    await this.button(name).hover();
    await this.page.mouse.down();
  }

  render() {
    return this.renderFixture(this.markup);
  }

  async renderWithReducedMotion() {
    await this.page.emulateMedia({ reducedMotion: "reduce" });
    await this.render();
  }

  async readMotionTimings(motion: string): Promise<MotionTimings> {
    await this.renderFixture(`
      <m3e-theme motion="${motion}">
        <div id="probe" style="transition: width var(--md-sys-motion-spring-fast-spatial)"></div>
        <m3e-button-group>
          <m3e-button>Save</m3e-button>
          <m3e-icon-button aria-label="Share"><m3e-icon name="share"></m3e-icon></m3e-icon-button>
        </m3e-button-group>
      </m3e-theme>
    `);
    return this.page.evaluate(() => {
      const timing = (element: Element): [string, string] => {
        const style = getComputedStyle(element);
        return [style.transitionDuration, style.transitionTimingFunction];
      };
      return {
        spring: timing(document.querySelector("#probe")!),
        buttons: [...document.querySelectorAll("m3e-button-group > *")].flatMap((element) => [
          timing(element),
          timing(element.shadowRoot!.querySelector(".wrapper")!),
        ]),
      };
    });
  }

  async pressMiddleButtonForWidthPeaks(): Promise<number[]> {
    await this.button("Two").hover();
    await this.page.mouse.down();
    await this.page.waitForFunction(() =>
      [...document.querySelectorAll("m3e-button")].every((button) =>
        button.getAnimations().some((animation) => (animation as CSSTransition).transitionProperty === "width"),
      ),
    );
    const peaks = await this.page.evaluate(() =>
      [...document.querySelectorAll("m3e-button")].map((button) => {
        const transition = button
          .getAnimations()
          .find((animation) => (animation as CSSTransition).transitionProperty === "width");
        if (!transition) throw new Error("Button width transition is missing.");
        transition.pause();
        let peak = 0;
        const duration = Number(transition.effect!.getComputedTiming().duration);
        for (let time = 0; time < duration; time++) {
          transition.currentTime = time;
          peak = Math.max(peak, transition.effect!.getComputedTiming().progress ?? 0);
        }
        return peak;
      }),
    );
    await this.page.mouse.up();
    return peaks;
  }

  async releaseLabelOverflow(name: string): Promise<number> {
    const button = this.button(name);
    const waitForWidthTransition = () => button.evaluate((element: ArmedButton) => element.widthTransition);

    await button.hover();
    await button.evaluate(armWidthTransition);
    await this.page.mouse.down();
    await waitForWidthTransition();
    await button.evaluate((element) =>
      [element, element.shadowRoot!.querySelector(".wrapper")!].forEach((item) =>
        item.getAnimations().forEach((animation) => animation.finish()),
      ),
    );
    await button.evaluate(armWidthTransition);
    await this.page.mouse.up();
    await waitForWidthTransition();

    return button.evaluate((element) => {
      const transitions = [element, element.shadowRoot!.querySelector(".wrapper")!].flatMap((item) =>
        item.getAnimations(),
      );
      const label = element.shadowRoot!.querySelector(".label");
      if (!label) throw new Error("Button label is missing.");
      const text = document.createRange();
      text.selectNodeContents(element);
      const end = Math.max(...transitions.map((animation) => Number(animation.effect!.getComputedTiming().endTime)));
      let maxOverflow = 0;
      for (let time = 0; time <= end; time++) {
        transitions.forEach((animation) => (animation.currentTime = time));
        maxOverflow = Math.max(maxOverflow, text.getBoundingClientRect().width - label.getBoundingClientRect().width);
      }
      return maxOverflow;
    });
  }

  async holdFirstButton(): Promise<NeighborMeasurements> {
    const measure = () =>
      this.page.evaluate(() =>
        [...document.querySelectorAll("m3e-button")].map((button) => {
          const wrapper = button.shadowRoot?.querySelector(".wrapper");
          if (!wrapper) throw new Error("Button wrapper is missing.");
          return {
            width: button.getBoundingClientRect().width,
            endPadding: parseFloat(getComputedStyle(wrapper).paddingInlineEnd),
          };
        }),
      );
    const rest = await measure();
    const day = this.button("Day");
    await this.button("Start turn-by-turn navigation").hover();
    await day.evaluate(armWidthTransition);
    await this.page.mouse.down();
    await day.evaluate((element: ArmedButton) => element.widthTransition);
    await this.page.evaluate(() =>
      document.querySelectorAll("m3e-button").forEach((button) => button.getAnimations().forEach((x) => x.finish())),
    );
    const held = await measure();
    await this.page.mouse.up();
    return { rest, held };
  }

  async pressConnectedButton(name: string): Promise<number> {
    const measure = () =>
      this.page.evaluate(() =>
        [...document.querySelectorAll("m3e-button")].map((button) => button.getBoundingClientRect().width),
      );
    const rest = await measure();
    await this.button(name).hover();
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);
    const held = await measure();
    await this.page.mouse.up();
    return Math.max(...held.map((width, index) => Math.abs(width - rest[index])));
  }

  async quickSuccessivePressDeviation(): Promise<number> {
    const rest = await this.page.evaluate(() =>
      [...document.querySelectorAll("m3e-button")].map((button) => button.getBoundingClientRect().width),
    );

    for (const name of ["Start turn-by-turn navigation", "Day", "Day", "Week"]) {
      await this.button(name).hover();
      await this.page.mouse.down();
      await this.page.waitForTimeout(50);
      await this.page.mouse.up();
      await this.page.waitForTimeout(50);
    }

    await this.page.waitForFunction(
      (restWidths) =>
        [...document.querySelectorAll("m3e-button")].every(
          (button, index) => Math.abs(button.getBoundingClientRect().width - restWidths[index]) < 0.5,
        ),
      rest,
    );
    return this.page.evaluate(
      (restWidths) =>
        Math.max(
          ...[...document.querySelectorAll("m3e-button")].map((button, index) =>
            Math.abs(button.getBoundingClientRect().width - restWidths[index]),
          ),
        ),
      rest,
    );
  }

  async pressWithReducedMotion(): Promise<{ pressedWidth: number; restWidth: number; animations: number }> {
    const button = this.button("Two");
    const restWidth = (await button.boundingBox())!.width;
    await button.hover();
    await this.page.mouse.down();
    const handle = await this.page.waitForFunction(
      ({ tag, name, width }) => {
        const element = [...document.querySelectorAll(tag)].find((x) => x.textContent?.trim() === name);
        return element && element.getBoundingClientRect().width > width ? element.getBoundingClientRect().width : false;
      },
      { tag: "m3e-button", name: "Two", width: restWidth },
    );
    const pressedWidth = await handle.jsonValue();
    if (typeof pressedWidth !== "number") throw new Error("Pressed button width did not increase.");
    const animations = await button.evaluate((element) => element.getAnimations().length);
    await this.page.mouse.up();
    return { pressedWidth, restWidth, animations };
  }
}
