import { readFile } from "node:fs/promises";

import type { M3eButtonElement } from "@m3e/web/button";
import type { Download, Page } from "@playwright/test";

type Options = {
  download?: string;
  disabled?: boolean;
  disabledInteractive?: boolean;
  formType?: "button" | "reset" | "submit";
  href?: string;
  label?: string;
  leadingIcon?: string;
  name?: string;
  rel?: string;
  role?: string;
  selected?: boolean;
  selectedIcon?: string;
  selectedLabel?: string;
  shape?: string;
  size?: string;
  target?: string;
  toggle?: boolean;
  trailingIcon?: string;
  value?: string;
  variant?: string;
};

type FormSubmission = {
  submitter: string | null;
  values: [string, FormDataEntryValue][];
};

type ButtonTestWindow = Window & {
  buttonEvents?: string[];
  buttonSubmission?: FormSubmission;
};

const sizes = ["extra-small", "small", "medium", "large", "extra-large"];

export class ButtonHarness {
  options: Options = {};
  private popup?: Page;
  private download?: Download;

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get button() {
    return this.page.locator("m3e-button");
  }

  get leadingIcon() {
    return this.page.locator("#leading-icon");
  }

  get selectedIcon() {
    return this.page.locator("#selected-icon");
  }

  get trailingIcon() {
    return this.page.locator("#trailing-icon");
  }

  async show() {
    const button = this.#markup();
    if (this.options.formType === "reset") {
      await this.renderFixture(`<form><input id="name" value="Original" />${button}</form>`);
    } else if (this.options.formType) {
      await this.renderFixture(`<form>${button}</form>`);
    } else {
      await this.renderFixture(button);
    }
  }

  showDensity(size: string) {
    return this.renderFixture(
      [-3, -2, -1, 0]
        .map(
          (scale) =>
            `<m3e-button data-density="${scale}" size="${size}" variant="filled" style="--md-sys-density-scale: ${scale}; --md-sys-density-size: 4px">Go</m3e-button>`,
        )
        .join(""),
    );
  }

  showAllSizes() {
    return this.renderFixture(sizes.map((size) => `<m3e-button size="${size}">Go</m3e-button>`).join(""));
  }

  showShapeComparison() {
    return this.renderFixture(`
      <m3e-button id="rounded" shape="rounded" variant="filled">Go</m3e-button>
      <m3e-button id="square" shape="square" variant="filled">Go</m3e-button>
    `);
  }

  async recordInputEvents(cancelBeforeInput = false) {
    await this.button.evaluate((element, cancel) => {
      const state = window as ButtonTestWindow;
      const events: string[] = [];
      state.buttonEvents = events;
      for (const type of ["beforeinput", "input", "change"]) {
        element.addEventListener(type, (event) => {
          events.push(type);
          if (cancel && type === "beforeinput") event.preventDefault();
        });
      }
    }, cancelBeforeInput);
  }

  readInputEvents() {
    return this.page.evaluate(() => {
      const events = (window as ButtonTestWindow).buttonEvents;
      if (!events) throw new Error("Button input events have not been recorded.");
      return events;
    });
  }

  click() {
    return this.button.click();
  }

  clickProgrammatically() {
    return this.button.evaluate((element: M3eButtonElement) => element.click());
  }

  cancelClicks() {
    return this.button.evaluate((element) => {
      element.addEventListener("click", (event) => event.preventDefault());
    });
  }

  waitForDeferredActions() {
    return this.page.evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
  }

  setState(property: "selected" | "toggle" | "disabled", value: boolean) {
    return this.button.evaluate(async (element: M3eButtonElement, state) => {
      element[state.property] = state.value;
      await element.updateComplete;
    }, { property, value });
  }

  async openPopup() {
    const [popup] = await Promise.all([this.page.waitForEvent("popup"), this.click()]);
    this.popup = popup;
  }

  popupUrl() {
    if (!this.popup) throw new Error("The link did not open a new page.");
    return this.popup.url();
  }

  async downloadDestination() {
    const [download] = await Promise.all([this.page.waitForEvent("download"), this.click()]);
    this.download = download;
  }

  async readDownload() {
    if (!this.download) throw new Error("The link did not start a download.");
    const failure = await this.download.failure();
    if (failure) throw new Error(`Button download failed: ${failure}`);
    const path = await this.download.path();
    if (!path) throw new Error("The downloaded file is unavailable.");
    return { name: this.download.suggestedFilename(), content: await readFile(path, "utf8") };
  }

  moveToNewParent() {
    return this.button.evaluate(async (element) => {
      element.remove();
      await new Promise<void>((resolve) => setTimeout(resolve, 0));

      const parent = document.createElement("div");
      parent.style.display = "contents";
      document.body.append(parent);
      parent.append(element);
    });
  }

  setHref(href: string | null) {
    return this.button.evaluate(async (element: M3eButtonElement, value) => {
      if (value) {
        element.setAttribute("href", value);
      } else {
        element.removeAttribute("href");
      }
      await element.updateComplete;
    }, href);
  }

  recordFormSubmission() {
    return this.page.evaluate(() => {
      const form = document.querySelector("form");
      if (!form) throw new Error("Form is missing.");

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const submitter = (event as SubmitEvent).submitter as HTMLElement | null;
        (window as ButtonTestWindow).buttonSubmission = {
          submitter: submitter?.localName ?? null,
          values: Array.from(new FormData(form).entries()),
        };
      });
    });
  }

  readFormSubmission() {
    return this.page.evaluate(() => (window as ButtonTestWindow).buttonSubmission);
  }

  readType() {
    return this.button.evaluate((element: M3eButtonElement) => element.type);
  }

  readLinkAttributes() {
    return this.button.evaluate((element) => {
      const link = element.shadowRoot?.querySelector("a");
      if (!link) throw new Error("The button's internal link is missing.");
      return {
        target: link.target,
        rel: link.rel,
        download: link.download,
        ariaHidden: link.getAttribute("aria-hidden"),
      };
    });
  }

  readDensityMeasurements() {
    return this.page.locator("m3e-button").evaluateAll((buttons) =>
      buttons.map((button) => {
        const surface = button.shadowRoot?.querySelector(".base");
        const touchTarget = button.shadowRoot?.querySelector(".touch");
        if (!surface || !touchTarget) throw new Error("Button surface or touch target is missing.");
        return {
          scale: Number(button.getAttribute("data-density")),
          visualHeight: surface.getBoundingClientRect().height,
          touchWidth: touchTarget.getBoundingClientRect().width,
          touchHeight: touchTarget.getBoundingClientRect().height,
        };
      }),
    );
  }

  readSize() {
    return this.button.evaluate((element: M3eButtonElement) => element.size);
  }

  readShape() {
    return this.button.evaluate((element: M3eButtonElement) => element.shape);
  }

  readHeights() {
    return this.page.locator("m3e-button").evaluateAll((buttons) =>
      buttons.map((button) => button.getBoundingClientRect().height),
    );
  }

  readCornerRadius(id?: string) {
    const button = id ? this.page.locator(`#${id}`) : this.button;
    return button.evaluate((element) => {
      const surface = element.shadowRoot?.querySelector(".base");
      if (!surface) throw new Error("Button surface is missing.");
      return Number.parseFloat(getComputedStyle(surface).borderTopLeftRadius);
    });
  }

  readHeight() {
    return this.button.evaluate((element) => element.getBoundingClientRect().height);
  }

  #markup() {
    const {
      disabled,
      disabledInteractive,
      download,
      formType,
      href,
      label = "Go",
      leadingIcon,
      name = "action",
      rel,
      role,
      selected,
      selectedIcon,
      selectedLabel,
      shape,
      size,
      target = "_self",
      toggle,
      trailingIcon,
      value = "save",
      variant,
    } = this.options;
    const attributes = [
      ...(variant ? [`variant="${variant}"`] : []),
      ...(shape ? [`shape="${shape}"`] : []),
      ...(size ? [`size="${size}"`] : []),
      ...(formType && formType !== "button" ? [`type="${formType}"`] : []),
      ...(formType === "submit" ? [`name="${name}"`, `value="${value}"`] : []),
      ...(href ? [`href="${href}"`, `target="${target}"`] : []),
      ...(rel ? [`rel="${rel}"`] : []),
      ...(role ? [`role="${role}"`] : []),
      ...(download ? [`download="${download}"`] : []),
      ...(toggle ? ["toggle"] : []),
      ...(selected ? ["selected"] : []),
      ...(disabled ? ["disabled"] : []),
      ...(disabledInteractive ? ["disabled-interactive"] : []),
    ].join(" ");
    const leadingIconMarkup = leadingIcon
      ? `<m3e-icon id="leading-icon" slot="icon" name="${leadingIcon}"></m3e-icon>`
      : "";
    const selectedLabelMarkup = selectedLabel ? `<span slot="selected">${selectedLabel}</span>` : "";
    const selectedIconMarkup = selectedIcon
      ? `<m3e-icon id="selected-icon" slot="selected-icon" name="${selectedIcon}"></m3e-icon>`
      : "";
    const trailingIconMarkup = trailingIcon
      ? `<m3e-icon id="trailing-icon" slot="trailing-icon" name="${trailingIcon}"></m3e-icon>`
      : "";
    return `<m3e-button ${attributes}>${leadingIconMarkup}${label}${selectedLabelMarkup}${selectedIconMarkup}${trailingIconMarkup}</m3e-button>`;
  }
}
