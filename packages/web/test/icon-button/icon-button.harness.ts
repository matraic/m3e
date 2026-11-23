import type { M3eIconButtonElement } from "@m3e/web/icon-button";
import type { Page } from "@playwright/test";

type FormSubmission = {
  submitter: string | null;
  values: [string, FormDataEntryValue][];
};

type IconButtonTestWindow = Window & {
  iconButtonEvents?: string[];
  iconButtonSubmission?: FormSubmission;
};

const sizes = ["extra-small", "small", "medium", "large", "extra-large"];

export class IconButtonHarness {
  html = "";

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get button() {
    return this.page.locator("m3e-icon-button").first();
  }

  get icon() {
    return this.page.locator("#icon");
  }

  get unselectedIcon() {
    return this.page.locator("#unselected-icon");
  }

  get selectedIcon() {
    return this.page.locator("#selected-icon");
  }

  markup(attributes = "", content = "") {
    return `<m3e-icon-button ${attributes}>${content}</m3e-icon-button>`;
  }

  async show() {
    await this.renderFixture(this.html);
  }

  showAllSizes() {
    this.html = sizes.map((size) => this.markup(`size="${size}"`)).join("");
    return this.show();
  }

  recordInputEvents(cancelBeforeInput = false) {
    return this.button.evaluate((element, cancel) => {
      const state = window as IconButtonTestWindow;
      state.iconButtonEvents = [];
      for (const type of ["beforeinput", "input", "change"]) {
        element.addEventListener(type, (event) => {
          state.iconButtonEvents?.push(type);
          if (cancel && type === "beforeinput") event.preventDefault();
        });
      }
    }, cancelBeforeInput);
  }

  readInputEvents() {
    return this.page.evaluate(() => {
      const events = (window as IconButtonTestWindow).iconButtonEvents;
      if (!events) throw new Error("Icon button input events have not been recorded.");
      return events;
    });
  }

  click() {
    return this.button.click();
  }

  clickProgrammatically() {
    return this.button.evaluate((element: M3eIconButtonElement) => element.click());
  }

  cancelClicks() {
    return this.button.evaluate((element) => {
      element.addEventListener("click", (event) => event.preventDefault());
    });
  }

  waitForDeferredActions() {
    return this.page.evaluate(() => new Promise<void>((resolve) => setTimeout(resolve, 0)));
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

  setState(property: "selected" | "toggle" | "disabled" | "disabledInteractive", value: boolean) {
    return this.button.evaluate(
      async (element: M3eIconButtonElement, state) => {
        element[state.property] = state.value;
        await element.updateComplete;
      },
      { property, value },
    );
  }

  setHref(href: string | null) {
    return this.button.evaluate(async (element: M3eIconButtonElement, value) => {
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
        (window as IconButtonTestWindow).iconButtonSubmission = {
          submitter: submitter?.localName ?? null,
          values: Array.from(new FormData(form).entries()),
        };
      });
    });
  }

  readFormSubmission() {
    return this.page.evaluate(() => (window as IconButtonTestWindow).iconButtonSubmission);
  }

  readType() {
    return this.button.evaluate((element: M3eIconButtonElement) => element.type);
  }

  readAppearance() {
    return this.button.evaluate((element: M3eIconButtonElement) => ({
      variant: element.variant,
      size: element.size,
      shape: element.shape,
      width: element.width,
    }));
  }

  readLinkAttributes() {
    return this.button.evaluate((element) => {
      const link = element.shadowRoot?.querySelector("a");
      if (!link) throw new Error("The icon button's internal link is missing.");
      return {
        target: link.target,
        rel: link.rel,
        download: link.download,
        ariaHidden: link.getAttribute("aria-hidden"),
      };
    });
  }

  readTouchTargets() {
    return this.page.locator("m3e-icon-button").evaluateAll((buttons) =>
      buttons.map((button) => {
        const touchTarget = button.shadowRoot?.querySelector(".touch");
        if (!touchTarget) throw new Error("Icon button touch target is missing.");
        const bounds = touchTarget.getBoundingClientRect();
        return { width: bounds.width, height: bounds.height };
      }),
    );
  }
}
