import type { M3eBadgeElement } from "@m3e/web/badge";
import type { Page } from "@playwright/test";

type Options = {
  attached?: boolean;
  content?: string;
  style?: string;
  size?: string;
  position?: string;
};

export class BadgeHarness {
  options: Options = {};

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get badge() {
    return this.page.locator("m3e-badge");
  }

  get surface() {
    return this.badge.locator(".outer");
  }

  show() {
    const { attached, content = "10", size, position, style } = this.options;
    const target = attached
      ? '<button id="badge-target" style="position: fixed; top: 200px; left: 200px; width: 80px; height: 40px">Target</button>'
      : "";
    return this.renderFixture(
      `${target}<m3e-badge ${attached ? 'for="badge-target"' : ""} ${size ? `size="${size}"` : ""} ${position ? `position="${position}"` : ""} ${style ? `style="${style}"` : ""}>${content}</m3e-badge>`,
    );
  }

  readSize() {
    return this.badge.evaluate((element: M3eBadgeElement) => element.size);
  }

  readPosition() {
    return this.badge.evaluate((element: M3eBadgeElement) => element.position);
  }

  readAnchorId() {
    return this.badge.evaluate((element: M3eBadgeElement) => element.control?.id ?? null);
  }

  readAnchorRelations(position: string, targetId = "badge-target") {
    return this.surface.evaluate((surface, { position, targetId }) => {
      const target = document.querySelector(`#${targetId}`);
      if (!target) throw new Error("Badge anchor target is missing.");

      const badgeBounds = surface.getBoundingClientRect();
      const targetBounds = target.getBoundingClientRect();
      const badgeCenterX = badgeBounds.left + badgeBounds.width / 2;
      const badgeCenterY = badgeBounds.top + badgeBounds.height / 2;
      const rtl = document.body.dir.toLowerCase() === "rtl";
      const logicalBefore = position.includes("before") && position !== "before";
      const logicalAfter = position.includes("after") && position !== "after";
      return {
        above: Math.abs(badgeCenterY - targetBounds.top) <= 1.5,
        below: Math.abs(badgeCenterY - targetBounds.bottom) <= 1.5,
        before: Math.abs(badgeCenterX - (rtl && logicalBefore ? targetBounds.right : targetBounds.left)) <= 1.5,
        after: Math.abs(badgeCenterX - (rtl && logicalAfter ? targetBounds.left : targetBounds.right)) <= 1.5,
      };
    }, { position, targetId });
  }

  readSurfaceSize() {
    return this.surface.evaluate((surface) => {
      const bounds = surface.getBoundingClientRect();
      return { width: Math.round(bounds.width), height: Math.round(bounds.height) };
    });
  }

  readFontSize() {
    return this.surface.evaluate((surface) => getComputedStyle(surface).fontSize);
  }

  readPadding() {
    return this.badge.evaluate((element) => {
      const selector = element.hasAttribute("for") ? ".inner" : ".outer";
      const surface = element.shadowRoot?.querySelector(selector);
      if (!surface) throw new Error("Badge surface is missing.");
      return getComputedStyle(surface).paddingLeft;
    });
  }

  readColors() {
    return this.surface.evaluate((surface) => {
      const style = getComputedStyle(surface);
      return { foreground: style.color, background: style.backgroundColor };
    });
  }

  setContent(content: string) {
    return this.badge.evaluate((element, value) => {
      element.textContent = value;
    }, content);
  }

  setPageDirection(direction: string) {
    return this.page.evaluate((value) => {
      document.body.dir = value;
    }, direction);
  }

  moveToNewParent() {
    return this.badge.evaluate((element) => {
      const parent = document.createElement("div");
      parent.style.display = "contents";
      element.before(parent);
      parent.append(element);
    });
  }

  disconnectUpdateAndMove(content: string) {
    return this.badge.evaluate(async (element, value) => {
      element.remove();
      element.textContent = value;
      await new Promise<void>((resolve) => setTimeout(resolve, 0));

      const parent = document.createElement("div");
      parent.style.display = "contents";
      document.body.append(parent);
      parent.append(element);
    }, content);
  }

  changeTarget() {
    return this.badge.evaluate((element: M3eBadgeElement) => {
      const target = document.createElement("button");
      target.id = "badge-target-next";
      target.style.cssText = "position: fixed; top: 300px; left: 400px; width: 80px; height: 40px";
      document.body.append(target);
      element.htmlFor = target.id;
    });
  }
}
