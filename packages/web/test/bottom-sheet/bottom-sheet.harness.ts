import type { M3eBottomSheetElement } from "@m3e/web/bottom-sheet";
import type { Locator, Page } from "@playwright/test";

type SheetMethod = "show" | "hide" | "toggle";
type HandleGesture = {
  phase: "start" | "update" | "end" | "cancel";
  translationY: number;
  direction: "up" | "down";
};

type WindowWithSheetEvents = Window & {
  bottomSheetEvents?: string[];
};

export class BottomSheetHarness {
  private initialHeight = 0;
  private expandedHeight = 0;

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get sheet() {
    return this.page.locator("#sheet");
  }

  sheetById(id: string) {
    return this.page.locator(`#${id}`);
  }

  trigger(label: string) {
    return this.page.getByRole("button", { name: label, exact: true });
  }

  action(label: string) {
    return this.page.getByRole("button", { name: label, exact: true });
  }

  handle(label = "Drag handle") {
    return this.sheet.getByRole("button", { name: label, exact: true });
  }

  get primaryTrigger() {
    return this.page.locator("#primary-trigger");
  }

  get secondaryTrigger() {
    return this.page.locator("#secondary-trigger");
  }

  get backgroundButton() {
    return this.page.locator("#opener");
  }

  render(html: string) {
    return this.renderFixture(html);
  }

  preventEvent(eventName: "opening" | "closing" | "cancel") {
    return this.sheet.evaluate((sheet, name) => {
      sheet.addEventListener(name, (event) => event.preventDefault());
    }, eventName);
  }

  recordLifecycleEvents() {
    return this.sheet.evaluate((sheet) => {
      const names = ["opening", "opened", "closing", "closed"];
      const events: string[] = [];
      (window as WindowWithSheetEvents).bottomSheetEvents = events;
      for (const name of names) {
        sheet.addEventListener(name, () => events.push(name));
      }
    });
  }

  readLifecycleEvents() {
    return this.page.evaluate(() => (window as WindowWithSheetEvents).bottomSheetEvents ?? []);
  }

  call(method: SheetMethod) {
    return this.sheet.evaluate((sheet: M3eBottomSheetElement, name) => {
      switch (name) {
        case "show":
          sheet.show();
          break;
        case "hide":
          sheet.hide();
          break;
        case "toggle":
          sheet.toggle();
          break;
      }
    }, method);
  }

  removeOpenAttribute() {
    return this.sheet.evaluate((sheet) => sheet.removeAttribute("open"));
  }

  showDetent(detent: number) {
    return this.sheet.evaluate((sheet: M3eBottomSheetElement, index) => sheet.show(index), detent);
  }

  async captureInitialHeight() {
    this.initialHeight = await this.readHeight();
  }

  async captureExpandedHeight() {
    this.expandedHeight = await this.readHeight();
  }

  setContentHeight(height: number) {
    return this.page.locator("#resizable-content").evaluate((content, value) => {
      content.style.height = `${value}px`;
    }, height);
  }

  readHeight() {
    return this.sheet.evaluate((sheet) => sheet.getBoundingClientRect().height);
  }

  readViewportHeight() {
    return this.page.evaluate(() => window.innerHeight);
  }

  readBackgroundInert() {
    return this.backgroundButton.evaluate((button: HTMLButtonElement) => button.inert);
  }

  readContentInert() {
    return this.sheet.evaluate((sheet) => {
      const content = sheet.shadowRoot?.querySelector<HTMLElement>(".content");
      if (!content) throw new Error("Bottom sheet content is missing.");
      return content.inert;
    });
  }

  swipeDownOnHandle() {
    return this.dispatchHandleGesture([
      { phase: "start", translationY: 0, direction: "down" },
      { phase: "end", translationY: 40, direction: "down" },
    ]);
  }

  swipeUpOnHandle() {
    return this.dispatchHandleGesture([
      { phase: "start", translationY: 0, direction: "up" },
      { phase: "end", translationY: -140, direction: "up" },
    ]);
  }

  partiallyDragUpOnHandle() {
    return this.dispatchHandleGesture([
      { phase: "start", translationY: 0, direction: "up" },
      { phase: "update", translationY: -140, direction: "up" },
      { phase: "cancel", translationY: -140, direction: "up" },
    ]);
  }

  async dragUp(target: Locator) {
    const bounds = await target.boundingBox();
    if (!bounds) throw new Error("Bottom sheet drag target is not visible.");

    const x = bounds.x + bounds.width / 2;
    const y = bounds.y + bounds.height / 2;
    await this.page.mouse.move(x, y);
    await this.page.mouse.down();
    await this.page.mouse.move(x, y - 120, { steps: 5 });
    await this.page.mouse.up();
  }

  dragUpOnHeader() {
    return this.dragUp(this.page.locator("#sheet [slot='header']"));
  }

  dragUpOnHeaderButton() {
    return this.dragUp(this.page.getByRole("button", { name: "Header action", exact: true }));
  }

  async moveTriggerToNewParent(label: string) {
    return this.trigger(label).evaluate((trigger) => {
      const button = trigger.closest("button");
      if (!button) throw new Error("Bottom sheet trigger has no button parent.");

      const parent = document.createElement("div");
      parent.style.display = "contents";
      button.before(parent);
      parent.append(button);
    });
  }

  moveSheetToNewParent() {
    return this.sheet.evaluate((sheet) => {
      const parent = document.createElement("div");
      parent.style.display = "contents";
      sheet.before(parent);
      parent.append(sheet);
    });
  }

  activateHandle() {
    return this.handle().click();
  }

  isTallerThanInitial() {
    return this.readHeight().then((height) => height > this.initialHeight);
  }

  isShorterThanExpanded() {
    return this.readHeight().then((height) => height < this.expandedHeight);
  }

  isAtLargestDetent() {
    return this.readHeight().then(async (height) => height > (await this.readViewportHeight()) * 0.75);
  }

  private dispatchHandleGesture(events: HandleGesture[]) {
    return this.sheet.evaluate((sheet, gestures) => {
      const gesture = sheet.shadowRoot?.querySelector("m3e-swipe-gesture[for='handle']");
      if (!gesture) throw new Error("Bottom sheet handle gesture is missing.");

      for (const { phase, translationY, direction } of gestures) {
        gesture.dispatchEvent(
          new CustomEvent("gesture", {
            detail: {
              gestureName: "swipe",
              inputId: 1,
              timestamp: performance.now(),
              phase,
              axis: "y",
              direction,
              startClientX: 0,
              startClientY: 0,
              startLocalX: 0,
              startLocalY: 0,
              translationX: 0,
              translationY,
              velocityX: 0,
              velocityY: direction === "up" ? -1 : 1,
              speed: 1,
              displacement: Math.abs(translationY),
              duration: 50,
            },
          }),
        );
      }
    }, events);
  }
}
