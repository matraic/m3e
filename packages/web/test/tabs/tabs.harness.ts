import type { Page } from "@playwright/test";
import type { M3eTabElement, M3eTabsElement } from "@m3e/web/tabs";

import { expect } from "../fixtures";

export class TabsHarness {
  attributes = new Map<string, string>();
  selected = -1;
  disabled = new Set<number>();
  width = 400;
  count = 3;
  direction: "ltr" | "rtl" = "ltr";
  reducedMotion = true;
  icons = false;
  customPagingIcons = false;
  interactivePanels = false;
  empty = false;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get group() {
    return this.page.locator("m3e-tabs");
  }

  get tabs() {
    return this.group.getByRole("tab");
  }

  get panels() {
    return this.group.locator("m3e-tab-panel");
  }

  get indicator() {
    return this.group.locator(".active-indicator");
  }

  get slide() {
    return this.group.locator("m3e-slide");
  }

  get scroller() {
    return this.group.locator("m3e-slide-group .content");
  }

  name(index: number) {
    return ["Videos", "Photos", "Audio"][index] ?? `Tab number ${index}`;
  }

  tab(name: string) {
    return this.group.getByRole("tab", { name, exact: true });
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: this.reducedMotion ? "reduce" : "no-preference" });
    const attributes = [...this.attributes].map(([key, value]) => `${key}="${value}"`).join(" ");
    const tabs = Array.from(
      { length: this.empty ? 0 : this.count },
      (_, i) =>
        `<m3e-tab for="p${i + 1}" ${i === this.selected ? "selected" : ""} ${this.disabled.has(i) ? "disabled" : ""}>
        ${this.icons ? '<span slot="icon">Decorative icon</span>' : ""}${this.name(i)}
      </m3e-tab>`,
    ).join("");
    const panels = Array.from(
      { length: this.empty ? 0 : this.count },
      (_, i) =>
        `<m3e-tab-panel id="p${i + 1}"><div style="height: 120px; touch-action: pan-y">${this.name(i)} panel</div>
        ${this.interactivePanels ? `<button>${this.name(i)} action</button>` : ""}
      </m3e-tab-panel>`,
    ).join("");
    await this.renderFixture(
      `<button id="before">Before tabs</button><div id="first">
         <m3e-tabs style="width: ${this.width}px" ${attributes}>${tabs}${panels}
           ${this.customPagingIcons ? '<span slot="prev-icon">Back icon</span><span slot="next-icon">Forward icon</span>' : ""}
         </m3e-tabs>
       </div><div id="second"></div><button id="after">After tabs</button>`,
      this.direction,
    );
  }

  index() {
    return this.group.evaluate((group) => (group as M3eTabsElement).selectedIndex);
  }

  setIndex(index: number) {
    return this.group.evaluate((group, index) => ((group as M3eTabsElement).selectedIndex = index), index);
  }

  setAttribute(name: string, value: string) {
    return this.group.evaluate((group, { name, value }) => group.setAttribute(name, value), { name, value });
  }

  recordEvents() {
    return this.group.evaluate((group) => {
      group.dataset.events = "";
      const details: { type: string; index: number; target: string; cancelable: boolean }[] = [];
      group.dataset.eventDetails = JSON.stringify(details);
      for (const name of ["beforeinput", "input", "change"]) {
        group.addEventListener(name, (event) => {
          group.dataset.events += `${name},`;
          details.push({
            type: name,
            index: (group as M3eTabsElement).selectedIndex,
            target: event.target instanceof HTMLElement ? event.target.id : "",
            cancelable: event.cancelable,
          });
          group.dataset.eventDetails = JSON.stringify(details);
        });
      }
    });
  }

  events() {
    return this.group.evaluate((group) => group.dataset.events!.split(",").filter(Boolean));
  }

  addTab(selected = false) {
    return this.group.evaluate((group, selected) => {
      const tab = document.createElement("m3e-tab");
      tab.textContent = "Extra";
      tab.setAttribute("for", "extra");
      tab.toggleAttribute("selected", selected);
      const panel = document.createElement("m3e-tab-panel");
      panel.id = "extra";
      panel.textContent = "Extra panel";
      const last = group.querySelector("m3e-tab:last-of-type");
      if (last) last.after(tab);
      else group.prepend(tab);
      group.append(panel);
    }, selected);
  }

  move() {
    return this.group.evaluate((group) => {
      document.querySelector("#second")!.append(group);
      document.querySelector("#first")!.append(group);
    });
  }

  async swipe(direction: "left" | "right", end: "touchEnd" | "touchCancel" = "touchEnd", onButton = false) {
    const target = onButton
      ? this.group.getByRole("button", { name: `${this.name(await this.index())} action`, exact: true })
      : this.panels.nth(await this.index()).locator("div");
    await expect(target).toBeVisible();
    await target.scrollIntoViewIfNeeded();
    const box = (await target.boundingBox())!;
    const x = box.x + box.width / 2;
    const y = box.y + box.height / 2;
    const dx = direction === "left" ? -100 : 100;
    const cdp = await this.page.context().newCDPSession(this.page);
    try {
      await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x, y }] });
      for (let i = 1; i <= 4; i++) {
        await cdp.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [{ x: x + (dx * i) / 4, y }],
        });
      }
      await cdp.send("Input.dispatchTouchEvent", { type: end, touchPoints: [] });
    } finally {
      await cdp.detach();
    }
  }

  select(name: string, selected: boolean) {
    return this.tab(name).evaluate((tab, selected) => ((tab as M3eTabElement).selected = selected), selected);
  }
}
