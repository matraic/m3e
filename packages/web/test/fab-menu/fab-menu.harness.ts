import type { Page } from "@playwright/test";
import type { M3eFabMenuItemElement } from "@m3e/web/fab-menu";

import { expect } from "../fixtures";

export const ITEMS = ["Share", "Edit details", "Duplicate", "Move to folder", "Download", "Delete permanently"];

export class FabMenuHarness {
  html = "";
  reducedMotion: "reduce" | "no-preference" = "reduce";
  forcedColors: "active" | "none" = "none";
  direction: "ltr" | "rtl" = "ltr";
  viewport?: { width: number; height: number };
  widthBefore = 0;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get menu() {
    return this.page.locator("#actions");
  }

  get trigger() {
    return this.page.getByRole("button", { name: "More actions", exact: true });
  }

  action(name: string) {
    return this.page.getByRole("menuitem", { name, exact: true });
  }

  markup(
    items = "<m3e-fab-menu-item>First action</m3e-fab-menu-item><m3e-fab-menu-item>Second action</m3e-fab-menu-item>",
    options: {
      fabStyle?: string;
      fabAttributes?: string;
      menuStyle?: string;
    } = {},
  ) {
    return `<m3e-fab ${options.fabAttributes ?? ""} aria-label="More actions" style="${options.fabStyle ?? "position: fixed; right: 16px; bottom: 16px"}">
      <m3e-fab-menu-trigger for="actions"></m3e-fab-menu-trigger>
    </m3e-fab>
    <m3e-fab-menu id="actions" style="${options.menuStyle ?? ""}">${items}</m3e-fab-menu>`;
  }

  motionMenu(motion: "standard" | "expressive") {
    const items = ITEMS.map((item) => `<m3e-fab-menu-item>${item}</m3e-fab-menu-item>`).join("");
    return `<m3e-theme motion="${motion}">
      <div id="probe" style="margin: 50%; width: 0; transition: width var(--md-sys-motion-spring-fast-spatial)"></div>
      ${this.markup(items)}
    </m3e-theme>`;
  }

  async render() {
    if (this.viewport) await this.page.setViewportSize(this.viewport);
    await this.page.emulateMedia({
      reducedMotion: this.reducedMotion,
      forcedColors: this.forcedColors,
    });
    await this.renderFixture(`${this.html}<div id="menu-destination"></div><button id="after-menu">After</button>`);
    await this.page.evaluate((direction) => (document.documentElement.dir = direction), this.direction);
  }

  async iconIgnored() {
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const { root } = await session.send("DOM.getDocument");
      const { nodeId } = await session.send("DOM.querySelector", {
        nodeId: root.nodeId,
        selector: "#menu-icon",
      });
      if (!nodeId) throw new Error("FAB menu icon is missing.");
      const { nodes } = await session.send("Accessibility.getPartialAXTree", {
        nodeId,
        fetchRelatives: false,
      });
      if (!nodes[0]) throw new Error("FAB menu icon accessibility node is missing.");
      return nodes[0].ignored;
    } finally {
      await session.detach();
    }
  }

  async assertFocusRingGeometry() {
    const menu = this.menu;
    for (const index of [ITEMS.length - 1, 0, ITEMS.length - 1]) {
      const item = menu.locator("m3e-fab-menu-item").nth(index);
      await item.focus();
      await expect(item).toBeFocused();
      await expect
        .poll(() =>
          item.evaluate((el) =>
            el.shadowRoot
              ?.querySelector("m3e-focus-ring")
              ?.shadowRoot?.querySelector(".outline")
              ?.classList.contains("visible"),
          ),
        )
        .toBe(true);
      const geometry = await item.evaluate((el) => {
        const menuRect = el.parentElement!.getBoundingClientRect();
        const itemRect = el.getBoundingClientRect();
        const fabRect = document.querySelector("m3e-fab")!.getBoundingClientRect();
        return {
          left: itemRect.left - menuRect.left,
          right: menuRect.right - itemRect.right,
          top: itemRect.top - menuRect.top,
          bottom: menuRect.bottom - itemRect.bottom,
          fabGap: fabRect.top - itemRect.bottom,
          alignment:
            document.documentElement.dir === "rtl" ? itemRect.left - fabRect.left : fabRect.right - itemRect.right,
        };
      });
      expect(geometry.left).toBeGreaterThanOrEqual(10.9);
      expect(geometry.right).toBeGreaterThanOrEqual(10.9);
      expect(geometry.top).toBeGreaterThanOrEqual(10.9);
      expect(geometry.bottom).toBeGreaterThanOrEqual(10.9);
      expect(geometry.fabGap).toBeGreaterThanOrEqual(10.9);
      expect(Math.abs(geometry.alignment)).toBeLessThan(1);
    }
  }

  async assertRaisedScrollGeometry() {
    const menu = this.menu;
    const last = menu.locator("m3e-fab-menu-item").last();
    const bounds = await last.evaluate((el) => ({
      item: el.getBoundingClientRect().toJSON(),
      menu: el.parentElement!.getBoundingClientRect().toJSON(),
      fab: document.querySelector("m3e-fab")!.getBoundingClientRect().toJSON(),
      pageScroll: window.scrollY,
    }));
    expect(bounds.item.top).toBeGreaterThan(bounds.fab.bottom);
    expect(bounds.item.bottom).toBeLessThan(bounds.menu.bottom);
    expect(bounds.menu.bottom).toBeCloseTo(600, 0);
    expect(bounds.pageScroll).toBe(0);

    await last.focus();
    await expect
      .poll(() =>
        last.evaluate(
          (el) => document.querySelector("m3e-fab")!.getBoundingClientRect().top - el.getBoundingClientRect().bottom,
        ),
      )
      .toBeGreaterThanOrEqual(7.9);

    await menu.evaluate((el) => (el.scrollTop = 0));
    await expect(last).toBeVisible();
    const box = await last.boundingBox();
    if (!box) throw new Error("Last FAB menu item has no bounds.");
    expect(
      await this.page.evaluate(
        ({ x, y }) => document.elementFromPoint(x, y)?.closest("m3e-fab-menu-item")?.textContent?.trim(),
        { x: box.x + box.width / 2, y: box.y + box.height / 2 },
      ),
    ).toBe(ITEMS[ITEMS.length - 1]);
  }

  async staggerDelays() {
    return this.page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const items = [...menu.querySelectorAll<M3eFabMenuItemElement>("m3e-fab-menu-item")];
      const widthDelays = () =>
        items.map((item) => {
          const delay = item.style.getPropertyValue("--_fab-menu-item-delay");
          return delay ? parseFloat(delay) : undefined;
        });
      await menu.show(document.querySelector("m3e-fab")!);
      const open = widthDelays();
      document.getAnimations().forEach((animation) => animation.finish());
      menu.hide();
      return { open, close: widthDelays() };
    });
  }

  async growth() {
    return this.page.evaluate(async () => {
      const timing = (animation: Animation) => [
        animation.effect!.getTiming().duration,
        animation.effect!.getTiming().easing,
      ];
      const probe = document.querySelector<HTMLElement>("#probe")!;
      probe.style.width = "1px";
      const spring = timing(probe.getAnimations()[0]);
      const menu = document.querySelector("m3e-fab-menu")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];
      await menu.show(document.querySelector("m3e-fab")!);
      const transitions = items.map(
        (item) =>
          item.getAnimations().find((animation) => (animation as CSSTransition).transitionProperty === "width")!,
      );
      const timings = transitions.map(timing);
      const keyframes = transitions.map((transition) =>
        (transition.effect as KeyframeEffect).getKeyframes().map((keyframe) => parseFloat(String(keyframe.width))),
      );
      document.getAnimations().forEach((animation) => animation.finish());
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      return {
        spring,
        timings,
        keyframes,
        natural: items.map((item) => item.getBoundingClientRect().width),
      };
    });
  }

  async growthGeometry() {
    return this.page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const fab = document.querySelector<HTMLElement>("m3e-fab")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];
      const settle = async () => {
        document.getAnimations().forEach((animation) => animation.finish());
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      };
      const geometry = () => {
        const end = menu.getBoundingClientRect().right;
        return items.map((item) => {
          const text = document.createRange();
          text.selectNodeContents(item);
          const box = item.getBoundingClientRect();
          return {
            width: box.width,
            end: box.right - end,
            label: text.getBoundingClientRect().right - end,
          };
        });
      };
      await menu.show(fab);
      await settle();
      const rest = geometry();
      const menuWidth = menu.getBoundingClientRect().width;
      menu.hide();
      await settle();
      await menu.show(fab);
      const transitions = items.map(
        (item) =>
          item.getAnimations().find((animation) => (animation as CSSTransition).transitionProperty === "width")!,
      );
      transitions.forEach((transition) => transition.pause());
      const end = Math.max(...transitions.map((transition) => Number(transition.effect!.getComputedTiming().endTime)));
      const drift = { end: 0, label: 0, menu: 0 };
      const peaks = items.map(() => 0);
      for (let time = 0; time <= end; time++) {
        transitions.forEach((transition) => (transition.currentTime = time));
        geometry().forEach((item, index) => {
          if (item.width > 0) drift.end = Math.max(drift.end, Math.abs(item.end - rest[index].end));
          drift.label = Math.max(drift.label, Math.abs(item.label - rest[index].label));
          peaks[index] = Math.max(peaks[index], item.width / rest[index].width);
        });
        drift.menu = Math.max(drift.menu, Math.abs(menu.getBoundingClientRect().width - menuWidth));
      }
      return { drift, peaks };
    });
  }

  async interruptedGrowth() {
    return this.page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const fab = document.querySelector<HTMLElement>("m3e-fab")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];
      const transitions = () =>
        items.map(
          (item) =>
            item.getAnimations().find((animation) => (animation as CSSTransition).transitionProperty === "width")!,
        );
      await menu.show(fab);
      document.getAnimations().forEach((animation) => animation.finish());
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const natural = items.map((item) => item.getBoundingClientRect().width);
      menu.hide();
      transitions().forEach((transition) => {
        transition.pause();
        transition.currentTime = 150;
      });
      const before = items.map((item) => item.getBoundingClientRect().width);
      await menu.show(fab);
      const after = items.map((item) => item.getBoundingClientRect().width);
      const targets = transitions().map((transition) => {
        const keyframes = (transition.effect as KeyframeEffect).getKeyframes();
        return parseFloat(String(keyframes[keyframes.length - 1]!.width));
      });
      return { natural, before, after, targets };
    });
  }

  async reducedMotionResult() {
    return this.page.evaluate(async () => {
      const menu = document.querySelector("m3e-fab-menu")!;
      const items = [...menu.querySelectorAll("m3e-fab-menu-item")];
      await menu.show(document.querySelector("m3e-fab")!);
      const open = {
        animations: items.flatMap((item) => item.getAnimations()).length,
        widths: items.map((item) => item.getBoundingClientRect().width),
      };
      menu.hide();
      return { open, display: getComputedStyle(menu).display };
    });
  }
}
