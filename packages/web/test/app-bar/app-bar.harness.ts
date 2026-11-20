import type { M3eAppBarElement } from "@m3e/web/app-bar";
import { expect, type Page } from "@playwright/test";

type Options = {
  size?: string;
  mode?: string;
  centered?: boolean;
  role?: string;
  content?: string;
  container?: "linked" | "unlinked";
  secondContainer?: boolean;
  useDefaultSmallHeight?: boolean;
};

export const normalColor = 240;
export const scrolledColor = 40;
export const smallHeight = 72;
export const fullScroll = 300;
const content = `
  <button slot="leading">Back</button>
  <span slot="title">Inbox</span>
  <span slot="subtitle">Recent messages</span>
  <button slot="trailing" style="width: 120px">More</button>
`;
const containerStyle = "position: relative; overflow-y: auto; height: 240px; width: 600px";

function markup(options: Options) {
  const { size, mode, centered, role, container, secondContainer } = options;
  const bar = `
    <m3e-app-bar ${size ? `size="${size}"` : ""} ${mode ? `scroll-behavior="${mode}"` : ""}
      ${centered ? "centered" : ""} ${container === "linked" ? 'for="scroll-area"' : ""}
      style="position: sticky; top: 0; width: 600px;
        ${options.useDefaultSmallHeight ? "" : `--m3e-app-bar-small-container-height: ${smallHeight}px;`}
        --m3e-app-bar-container-color: rgb(${normalColor}, 0, 0);
        --m3e-app-bar-container-color-on-scroll: rgb(${scrolledColor}, 0, 0)">
      ${options.content ?? content}
    </m3e-app-bar>`;
  if (role) return `<div role="${role}" aria-label="App context">${bar}</div>`;
  if (!container) return bar;
  return `
    <div id="scroll-area" style="${containerStyle}" tabindex="0">
      ${bar}<div id="scroll-content" style="height: 1200px">Page content</div>
    </div>
    ${secondContainer ? `<div id="other-area" style="${containerStyle}"><div style="height: 1200px"></div></div>` : ""}
  `;
}

export class AppBarHarness {
  options: Options = {};
  initial!: Awaited<ReturnType<AppBarHarness["read"]>>;
  snapStart = 0;
  snapStartHeight = 0;
  private gesture = "";

  constructor(
    private readonly page: Page,
    private readonly render: (html: string) => Promise<void>,
  ) {}

  get bar() {
    return this.page.locator("m3e-app-bar");
  }

  private get scroller() {
    return this.page.locator("#scroll-area");
  }

  useDeprecatedSideSlots() {
    this.options.content = content.replace('"leading"', '"leading-icon"').replace('"trailing"', '"trailing-icon"');
  }

  async show(options: Options = this.options, customElevation = false) {
    await this.render(markup(options));
    if (customElevation) {
      await this.bar.evaluate((el) =>
        el.style.setProperty("--m3e-app-bar-container-elevation-on-scroll", "0 10px 0 0 black"),
      );
    }
    if (options.container === "linked") {
      await expect.poll(() => this.bar.evaluate((el: M3eAppBarElement) => el.control?.id)).toBe("scroll-area");
    }
    this.initial = await this.read();
  }

  related(options: Options) {
    return this.show({ container: "linked", ...options }, true);
  }

  showWithTextAndIconButtons() {
    return this.related({
      mode: "transparent",
      content: `
        <m3e-icon-button slot="leading" variant="standard" aria-label="Back">&larr;</m3e-icon-button>
        <m3e-button slot="trailing" variant="text">More</m3e-button>
      `,
    });
  }

  attach() {
    return this.bar.evaluate((bar: M3eAppBarElement) => bar.attach(bar.closest<HTMLElement>("#scroll-area")!));
  }

  moveToNewParent() {
    return this.bar.evaluate((bar) => {
      const parent = document.createElement("div");
      parent.style.display = "contents";
      bar.before(parent);
      parent.append(bar);
    });
  }

  detach() {
    return this.bar.evaluate((bar: M3eAppBarElement) => bar.detach());
  }

  setScrollBehavior(mode: M3eAppBarElement["scrollBehavior"]) {
    return this.bar.evaluate((bar: M3eAppBarElement, value) => (bar.scrollBehavior = value), mode);
  }

  enableCentering() {
    return this.bar.evaluate((bar: M3eAppBarElement) => { bar.centered = true; });
  }

  scrollOtherContainer(top: number) {
    return this.scroll(top, this.page.locator("#other-area"));
  }

  async scroll(top: number, container = this.scroller) {
    await container.evaluate(async (el, y) => {
      if (el.scrollTop === y) return;
      const scrolled = new Promise<void>((resolve) => el.addEventListener("scroll", () => resolve(), { once: true }));
      el.scrollTop = y;
      await scrolled;
    }, top);
  }

  readScrollLimits() {
    return this.scroller.evaluate((el) => ({
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
    }));
  }

  supportsScrollEnd() {
    return this.page.evaluate(() => "onscrollend" in window);
  }

  suppressScrollEnd() {
    return this.scroller.evaluate((el) => {
      window.addEventListener("scrollend", (event) => {
        if (event.target === el) event.stopImmediatePropagation();
      }, true);
    });
  }

  scrollUntilEnd(top: number) {
    return this.scroller.evaluate(async (el, y) => {
      const ended = new Promise<void>((resolve) => el.addEventListener("scrollend", () => resolve(), { once: true }));
      el.scrollTop = y;
      await ended;
    }, top);
  }

  installClock() {
    return this.page.clock.install();
  }

  advanceClock(ms: number) {
    return this.page.clock.runFor(ms);
  }

  async hold(gesture = "dragging the scrollbar thumb") {
    this.gesture = gesture;
    await this.scroller.evaluate((el, input) => {
      if (input === "holding down a scroll key") {
        el.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowDown" }));
      } else if (input === "holding a finger on the screen") {
        el.dispatchEvent(new TouchEvent("touchstart"));
      } else {
        el.dispatchEvent(new PointerEvent("pointerdown", { pointerType: "mouse" }));
      }
    }, gesture);
  }

  async release() {
    await this.scroller.evaluate((el, input) => {
      if (input === "holding down a scroll key") {
        window.dispatchEvent(new KeyboardEvent("keyup", { key: "ArrowDown" }));
      } else if (input === "holding a finger on the screen") {
        el.dispatchEvent(new TouchEvent("touchend"));
      } else {
        window.dispatchEvent(new PointerEvent("pointerup", { pointerType: "mouse" }));
      }
    }, this.gesture);
  }

  read() {
    return this.bar.evaluate((bar) => {
      const surface = bar.shadowRoot!.querySelector(".wrapper")!;
      const label = bar.shadowRoot!.querySelector(".label")!;
      const style = getComputedStyle(surface);
      const rect = surface.getBoundingClientRect();
      const scroller = bar.closest("#scroll-area");
      const scrollTop = scroller?.scrollTop ?? 0;
      const offset = (selector: string) => {
        const bounds = bar.querySelector(selector)?.getBoundingClientRect();
        return bounds ? bounds.left + bounds.width / 2 - (rect.left + rect.width / 2) : 0;
      };
      const canvas = document.createElement("canvas");
      const pixel = canvas.getContext("2d")!;
      const rgba = (color: string) => {
        pixel.clearRect(0, 0, 1, 1);
        pixel.fillStyle = color;
        pixel.fillRect(0, 0, 1, 1);
        return pixel.getImageData(0, 0, 1, 1).data;
      };
      const background = rgba(style.backgroundColor);
      const bounds = scroller?.getBoundingClientRect();
      const pageContent = scroller?.querySelector("#scroll-content")?.getBoundingClientRect();
      return {
        height: rect.height,
        top: rect.top - (bounds?.top ?? 0),
        contentTop: pageContent && bounds ? pageContent.top - bounds.top + scrollTop : 0,
        scrollTop,
        red: background[0],
        backgroundOpacity: background[3] / 255,
        shadowOffset: Number(style.boxShadow.match(/\)\s+-?[\d.]+px\s+(-?[\d.]+)px/)?.[1] ?? 0),
        shadowVisible: [...style.boxShadow.matchAll(/(-?[\d.]+)px/g)].some((length) => Number(length[1]) !== 0),
        labelTop: label.getBoundingClientRect().top - rect.top,
        labelOpacity: Number(getComputedStyle(label).opacity),
        titleOffset: offset('[slot="title"]'),
        subtitleOffset: offset('[slot="subtitle"]'),
        controlOpacity: [...bar.querySelectorAll('[slot="leading"], [slot="trailing"]')].map((control) => {
          const slotParent = control.assignedSlot?.parentElement;
          return Number(getComputedStyle(control).opacity) * (slotParent ? Number(getComputedStyle(slotParent).opacity) : 1);
        }),
        buttonOpacity: [...bar.querySelectorAll("m3e-button, m3e-icon-button")].map((button) =>
          rgba(getComputedStyle(button.shadowRoot!.querySelector(".base")!).backgroundColor)[3] / 255,
        ),
      };
    });
  }

  partialCollapse(fraction = 0.5) {
    return this.scroll(Math.round((this.initial.height - smallHeight) * fraction));
  }

  expectState(state: Partial<Awaited<ReturnType<AppBarHarness["read"]>>>) {
    return expect.poll(() => this.read()).toMatchObject(state);
  }
}
