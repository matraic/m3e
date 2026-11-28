import type { M3eSwipeRevealElement } from "@m3e/web/swipe-reveal";
import type { CDPSession, Page } from "@playwright/test";

export type SwipeSide = "leading" | "trailing";
export type SwipeMethod = "reveal" | "close" | "dismiss" | "restore";

export const swipeItem = (id: string, attrs = "") => `
  <m3e-swipe-reveal id="${id}" ${attrs} style="display: block; width: 400px">
    <button slot="leading" style="width: 80px; height: 56px">Pin</button>
    <button slot="trailing" style="width: 80px; height: 56px">Delete</button>
    <div style="height: 56px; background: white">Content ${id}</div>
  </m3e-swipe-reveal>
`;

export class SwipeRevealHarness {
  markup = "";
  #touchSession?: CDPSession;
  #touchOrigin?: { x: number; y: number };

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  item(id: string) {
    return this.page.locator(`#${id}`);
  }

  async render(markup = this.markup) {
    await this.renderFixture(markup);
  }

  state(id: string) {
    return this.item(id).evaluate((element) => (element as M3eSwipeRevealElement).state);
  }

  side(id: string) {
    return this.item(id).evaluate((element) => (element as M3eSwipeRevealElement).side);
  }

  call(id: string, method: SwipeMethod, side?: SwipeSide) {
    return this.item(id).evaluate(
      (element, input) => {
        const reveal = element as M3eSwipeRevealElement;
        if (input.method === "reveal" || input.method === "dismiss") {
          reveal[input.method](input.side);
        } else {
          reveal[input.method]();
        }
      },
      { method, side },
    );
  }

  recordEvents(id: string, names: string[], includeSide = false) {
    return this.item(id).evaluate(
      (element, input) => {
        element.setAttribute("data-event-log", "");
        for (const name of input.events) {
          element.addEventListener(name, (event) => {
            const entry =
              input.includeSide && event instanceof CustomEvent && event.detail?.side
                ? `${name}:${event.detail.side}`
                : name;
            element.setAttribute("data-event-log", `${element.getAttribute("data-event-log") ?? ""}${entry},`);
          });
        }
      },
      { events: names, includeSide },
    );
  }

  async eventLog(id: string) {
    const log = await this.item(id).getAttribute("data-event-log");
    return log?.split(",").filter(Boolean) ?? [];
  }

  async drag(id: string, dx: number, speed: "fast" | "slow" = "fast") {
    const box = await this.item(id).boundingBox();
    if (!box) throw new Error(`Swipe-reveal item "${id}" is not visible.`);
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;

    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    if (speed === "fast") {
      await this.page.mouse.move(x + dx, y, { steps: 6 });
    } else {
      for (let i = 1; i <= 10; i++) {
        await this.page.mouse.move(x + (dx * i) / 10, y);
        await this.page.waitForTimeout(40);
      }
      await this.page.waitForTimeout(250);
    }
    await this.page.mouse.up();
  }

  async press(id: string, dx: number) {
    const box = await this.item(id).boundingBox();
    if (!box) throw new Error(`Swipe-reveal item "${id}" is not visible.`);
    await this.page.evaluate(() => {
      const state = window as typeof window & {
        swipeRevealSnapshots?: Record<string, { left: number; leadingWidth: number; trailingWidth: number }>;
      };
      state.swipeRevealSnapshots = Object.fromEntries(
        [...document.querySelectorAll<HTMLElement>("m3e-swipe-reveal")].map((element) => [
          element.id,
          {
            left: element.getBoundingClientRect().left,
            leadingWidth: element.shadowRoot!.querySelector<HTMLElement>(".leading")!.getBoundingClientRect().width,
            trailingWidth: element.shadowRoot!.querySelector<HTMLElement>(".trailing")!.getBoundingClientRect().width,
          },
        ]),
      );
    });
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.mouse.move(x + dx, y, { steps: 8 });
  }

  async left(id: string) {
    const box = await this.item(id).boundingBox();
    if (!box) throw new Error(`Swipe-reveal item "${id}" is not visible.`);
    return box.x;
  }

  offset(id: string) {
    return this.item(id).evaluate((element) => {
      const content = element.shadowRoot?.querySelector<HTMLElement>(".content");
      if (!content) throw new Error("Swipe-reveal content is missing.");
      return new DOMMatrixReadOnly(getComputedStyle(content).transform).m41;
    });
  }

  async startTouch(id: string, targetSelector?: string, targetOffset?: { x: number; y: number }) {
    const target = targetSelector ? this.page.locator(targetSelector) : this.item(id);
    const box = await target.boundingBox();
    if (!box) throw new Error(`Touch target for swipe-reveal item "${id}" is not visible.`);

    this.#touchOrigin = targetOffset
      ? { x: box.x + targetOffset.x, y: box.y + targetOffset.y }
      : { x: box.x + box.width / 2, y: box.y + box.height / 2 };
    if (!this.#touchSession) {
      this.#touchSession = await this.page.context().newCDPSession(this.page);
      await this.#touchSession.send("Emulation.setTouchEmulationEnabled", {
        enabled: true,
      });
    }
    await this.#touchSession.send("Input.dispatchTouchEvent", {
      type: "touchStart",
      touchPoints: [{ ...this.#touchOrigin }],
    });
  }

  async moveTouch(dx: number, dy: number) {
    if (!this.#touchSession || !this.#touchOrigin) throw new Error("A swipe-reveal touch has not started.");
    await this.#touchSession.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: this.#touchOrigin.x + dx, y: this.#touchOrigin.y + dy }],
    });
  }

  async endTouch(type: "touchEnd" | "touchCancel" = "touchEnd", keepSession = false) {
    if (!this.#touchSession) throw new Error("A swipe-reveal touch has not started.");
    await this.#touchSession.send("Input.dispatchTouchEvent", {
      type,
      touchPoints: [],
    });
    this.#touchOrigin = undefined;
    if (!keepSession) {
      await this.#touchSession.detach();
      this.#touchSession = undefined;
    }
  }
}
