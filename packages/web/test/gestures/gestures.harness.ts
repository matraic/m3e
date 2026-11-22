import type { Page } from "@playwright/test";

type PointerEventType = "pointerdown" | "pointermove" | "pointerup" | "pointercancel";
type GestureEventDetail = { phase: string; [key: string]: unknown };
type ResolverEvent = { name: string; phase: string };

export class GesturesHarness {
  html = "";
  pointerCapture: "disabled" | "native" = "disabled";
  private pointerTimestamp = 0;

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  gestureMarkup(name: string, attributes = "", nested = "") {
    return `<m3e-${name}-gesture id="${name}" for="target" ${attributes}>${nested}</m3e-${name}-gesture>`;
  }

  async render() {
    if (this.pointerCapture === "disabled") {
      await this.page.evaluate(() => {
        HTMLElement.prototype.setPointerCapture = () => {};
        HTMLElement.prototype.releasePointerCapture = () => {};
        HTMLElement.prototype.hasPointerCapture = () => false;
      });
    }

    await this.renderFixture(`${this.html}<div id="destination"></div>`);
    await this.page
      .locator(
        "m3e-tap-gesture, m3e-long-press-gesture, m3e-pan-gesture, m3e-swipe-gesture, m3e-scale-gesture, m3e-rotate-gesture, m3e-repeat-gesture, m3e-sequence-gesture",
      )
      .evaluateAll((elements) => {
        elements.forEach((element, index) => {
          const id = element.id || `gesture-${index}`;
          element.setAttribute("data-gesture-id", id);
          element.setAttribute("data-events", "[]");
          element.addEventListener("gesture", (event) => {
            const events = JSON.parse(element.getAttribute("data-events") ?? "[]") as GestureEventDetail[];
            events.push((event as CustomEvent<GestureEventDetail>).detail);
            element.setAttribute("data-events", JSON.stringify(events));
          });
        });
      });

    if (this.pointerCapture === "native") {
      await this.page.evaluate(() => {
        const state = document.body as HTMLBodyElement & { captures?: number; clicks?: string[] };
        state.captures = 0;
        state.clicks = [];
        const original = HTMLElement.prototype.setPointerCapture;
        HTMLElement.prototype.setPointerCapture = function (pointerId: number) {
          state.captures!++;
          return original.call(this, pointerId);
        };
        document.addEventListener(
          "click",
          (event) => state.clicks!.push((event.composedPath()[0] as Element).id),
          true,
        );
      });
    }
  }

  async dispatch(
    type: PointerEventType,
    pointerId: number,
    clientX: number,
    clientY: number,
    options: { timestamp?: number; pointerType?: string; button?: number } = {},
  ) {
    const timestamp = options.timestamp ?? (this.pointerTimestamp += 10);
    this.pointerTimestamp = Math.max(this.pointerTimestamp, timestamp);
    await this.page.locator("#target").evaluate(
      (element, input) => {
        const event = new PointerEvent(input.type, {
          bubbles: true,
          cancelable: true,
          pointerId: input.pointerId,
          pointerType: input.pointerType,
          isPrimary: input.pointerId === 1,
          button: input.button,
          buttons: input.type === "pointerup" || input.type === "pointercancel" ? 0 : 1,
          clientX: input.clientX,
          clientY: input.clientY,
        });
        Object.defineProperty(event, "timeStamp", { value: input.timestamp });
        element.dispatchEvent(event);
      },
      {
        type,
        pointerId,
        clientX,
        clientY,
        timestamp,
        pointerType: options.pointerType ?? "touch",
        button: options.button ?? 0,
      },
    );
  }

  async details(id: string): Promise<GestureEventDetail[]> {
    return this.gesture(id)
      .getAttribute("data-events")
      .then((value) => JSON.parse(value ?? "[]") as GestureEventDetail[]);
  }

  async phases(id: string): Promise<string[]> {
    return (await this.details(id)).map(({ phase }) => phase);
  }

  async resolverEvents(): Promise<ResolverEvent[]> {
    const ids = await this.page
      .locator("[data-gesture-id]")
      .evaluateAll((elements) => elements.map((element) => element.getAttribute("data-gesture-id") ?? ""));
    const events: ResolverEvent[] = [];
    for (const id of ids) {
      for (const { phase } of await this.details(id)) events.push({ name: id, phase });
    }
    return events;
  }

  async captureResult() {
    return this.page.evaluate(() => {
      const state = document.body as HTMLBodyElement & { captures?: number; clicks?: string[] };
      return { captures: state.captures ?? 0, clicks: state.clicks ?? [] };
    });
  }

  private gesture(id: string) {
    return this.page.locator(`[data-gesture-id="${id}"]`);
  }
}
