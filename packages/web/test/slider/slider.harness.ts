import type { M3eSliderElement, M3eSliderThumbElement } from "@m3e/web/slider";
import type { Page } from "@playwright/test";

export class SliderHarness {
  html = "";
  direction: "ltr" | "rtl" = "ltr";
  reducedMotion: "reduce" | "no-preference" = "reduce";

  constructor(
    readonly page: Page,
    private readonly renderFixture: (html: string, direction?: "ltr" | "rtl") => Promise<void>,
  ) {}

  get slider() {
    return this.page.locator("#slider");
  }

  thumb(name = "Volume") {
    return this.page.getByRole("slider", { name, exact: true });
  }

  single(attributes = "", value = 50, thumbAttributes = "") {
    this.html = `<m3e-slider id="slider" ${attributes} style="width: 300px">
      <m3e-slider-thumb id="volume" value="${value}" aria-label="Volume" ${thumbAttributes}></m3e-slider-thumb>
    </m3e-slider>`;
  }

  range(attributes = "", upperAttributes = "", lowerAttributes = "") {
    this.html = `<m3e-slider id="slider" ${attributes} style="width: 300px">
      <m3e-slider-thumb id="minimum" value="25" aria-label="Minimum" ${lowerAttributes}></m3e-slider-thumb>
      <m3e-slider-thumb id="maximum" value="75" aria-label="Maximum" ${upperAttributes}></m3e-slider-thumb>
    </m3e-slider>`;
  }

  async render() {
    await this.page.emulateMedia({ reducedMotion: this.reducedMotion });
    await this.renderFixture(
      `<button id="before">Before</button>${this.html}<button id="after">After</button><div id="destination"></div>`,
      this.direction,
    );
  }

  async recordEvents(cancel = false, selector = "#slider") {
    await this.page.locator(selector).evaluate((slider, cancel) => {
      slider.setAttribute("data-events", "");
      for (const type of ["beforeinput", "input", "change"]) {
        slider.addEventListener(type, (event) => {
          const previous = slider.getAttribute("data-events");
          slider.setAttribute("data-events", previous ? `${previous},${type}` : type);
          if (cancel && type === "beforeinput") event.preventDefault();
        });
      }
    }, cancel);
  }

  async point(value: number, name = "Volume") {
    const box = await this.slider.boundingBox();
    const thumbBox = await this.thumb(name).boundingBox();
    if (!box || !thumbBox) throw new Error("Missing slider bounds");
    const vertical = (await this.slider.getAttribute("orientation")) === "vertical";
    const size = vertical ? box.height : box.width;
    const thumbSize = vertical ? thumbBox.height : thumbBox.width;
    const { min, max } = await this.slider.evaluate((slider: M3eSliderElement) => ({
      min: slider.min,
      max: slider.max,
    }));
    const offset = thumbSize / 2 + (size - thumbSize) * ((value - min) / (max - min));
    return {
      x: vertical ? box.x + box.width / 2 : this.direction === "rtl" ? box.x + box.width - offset : box.x + offset,
      y: vertical ? box.y + box.height - offset : box.y + box.height / 2,
    };
  }

  async click(value: number, name = "Volume") {
    const point = await this.point(value, name);
    await this.page.mouse.click(point.x, point.y);
  }

  async startDrag(name: string) {
    const thumb = this.thumb(name);
    await thumb.evaluate((element: HTMLElement) => {
      element.addEventListener(
        "pointerdown",
        (event) => {
          element.setAttribute("data-pointer-id", String(event.pointerId));
          element.setAttribute("data-pointer-time", String(event.timeStamp));
        },
        { once: true },
      );
    });
    const box = await thumb.boundingBox();
    if (!box) throw new Error("Missing slider thumb bounds");
    await this.page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await this.page.mouse.down();
  }

  async deliverMovement(value: number, elapsed: number) {
    const point = await this.point(value);
    await this.thumb().evaluate(
      (thumb, { point, elapsed }) => {
        const pointerId = Number(thumb.getAttribute("data-pointer-id"));
        if (!thumb.hasPointerCapture(pointerId)) throw new Error("Slider pointer is not captured");
        const timestamp = Number(thumb.getAttribute("data-pointer-time")) + elapsed;
        const init: PointerEventInit = {
          bubbles: true,
          composed: true,
          pointerId,
          pointerType: "mouse",
          buttons: 1,
          clientX: point.x,
          clientY: point.y,
        };
        const sample = new PointerEvent("pointermove", init);
        // Browser automation does not guarantee coalescing, so control the sample timing.
        Object.defineProperty(sample, "timeStamp", { value: timestamp });
        const event = new PointerEvent("pointermove", init);
        Object.defineProperty(event, "getCoalescedEvents", { value: () => [sample] });
        thumb.setAttribute("data-pointer-time", String(timestamp));
        thumb.dispatchEvent(event);
      },
      { point, elapsed },
    );
  }

  async setValue(name: string, value: number) {
    await this.thumb(name).evaluate((thumb: M3eSliderThumbElement, value) => (thumb.value = value), value);
  }

  async moveSlider() {
    await this.slider.evaluate((slider) => {
      const destination = document.getElementById("destination");
      if (!destination) throw new Error("Missing slider destination");
      destination.appendChild(slider);
    });
  }

  async thumbIds(selector = "#slider") {
    return this.page.locator(selector).evaluate((slider: M3eSliderElement) => slider.thumbs.map((thumb) => thumb.id));
  }

  async monitorMeasurements() {
    await this.page.evaluate(() => {
      const reads: string[] = [];
      Object.defineProperty(window, "sliderMeasurementReads", { value: reads });
      let deliveringResize = false;
      const NativeResizeObserver = window.ResizeObserver;
      window.ResizeObserver = class extends NativeResizeObserver {
        constructor(callback: ResizeObserverCallback) {
          super((entries, observer) => {
            deliveringResize = true;
            try {
              callback(entries, observer);
            } finally {
              deliveringResize = false;
            }
          });
        }
      };
      for (const name of ["clientWidth", "clientHeight"]) {
        const descriptor = Object.getOwnPropertyDescriptor(Element.prototype, name);
        if (!descriptor?.get) throw new Error(`Missing native ${name} getter`);
        const getter = descriptor.get;
        Object.defineProperty(Element.prototype, name, {
          ...descriptor,
          get: function (this: Element) {
            if (this.matches("m3e-slider, m3e-slider-thumb") && !deliveringResize) reads.push(name);
            return getter.call(this);
          },
        });
      }
      const getRect = Element.prototype.getBoundingClientRect;
      Element.prototype.getBoundingClientRect = function () {
        if (this.matches("m3e-slider, m3e-slider-thumb") && !deliveringResize) reads.push("getBoundingClientRect");
        return getRect.call(this);
      };
    });
  }
}
