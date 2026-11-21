import type { M3eCheckboxElement } from "@m3e/web/checkbox";
import type { Page } from "@playwright/test";

export class CheckboxHarness {
  markup = '<m3e-checkbox aria-label="Receive updates"></m3e-checkbox>';

  constructor(
    private readonly page: Page,
    private readonly renderFixture: (html: string) => Promise<void>,
  ) {}

  get checkbox() {
    return this.page.locator("m3e-checkbox");
  }

  show() {
    return this.renderFixture(this.markup);
  }

  recordEvents(cancelBeforeInput = false) {
    return this.checkbox.evaluate((element, cancel) => {
      const events: string[] = [];
      element.setAttribute("data-events", "");
      for (const type of ["beforeinput", "input", "change"]) {
        element.addEventListener(type, (event) => {
          events.push(type);
          element.setAttribute("data-events", events.join(", "));
          if (cancel && type === "beforeinput") event.preventDefault();
        });
      }
    }, cancelBeforeInput);
  }

  formValues(id = "preferences") {
    return this.page.locator(`#${id}`).evaluate((form: HTMLFormElement) => Array.from(new FormData(form).entries()));
  }

  formIsValid() {
    return this.page.locator("#preferences").evaluate((form: HTMLFormElement) => form.checkValidity());
  }

  setAttribute(name: string) {
    return this.checkbox.evaluate((element, attribute) => element.setAttribute(attribute, ""), name);
  }

  removeAttribute(name: string) {
    return this.checkbox.evaluate((element, attribute) => element.removeAttribute(attribute), name);
  }

  clickProgrammatically() {
    return this.checkbox.evaluate((element: M3eCheckboxElement) => element.click());
  }

  enableFieldset() {
    return this.page.locator("fieldset").evaluate((fieldset: HTMLFieldSetElement) => {
      fieldset.disabled = false;
    });
  }

  moveToNewParent() {
    return this.checkbox.evaluate((element) => {
      const parent = document.createElement("div");
      parent.id = "checkbox-new-parent";
      document.body.append(parent);
      parent.append(element);
    });
  }

  moveToDestinationForm() {
    return this.checkbox.evaluate((element) => {
      const form = document.getElementById("destination");
      if (!form) throw new Error("Checkbox destination form is missing.");
      form.append(element);
    });
  }

  moveToNewLabel() {
    return this.checkbox.evaluate((element) => {
      const label = document.createElement("label");
      label.textContent = "Destination updates";
      document.body.append(label);
      label.prepend(element);
    });
  }

  async nativeAccessibleNames() {
    // Playwright's name computation does not include native labels of form-associated custom elements.
    const session = await this.page.context().newCDPSession(this.page);
    try {
      const tree = await session.send("Accessibility.getFullAXTree");
      return tree.nodes.filter((node) => node.role?.value === "checkbox").map((node) => node.name?.value);
    } finally {
      await session.detach();
    }
  }

  readOutlineColors() {
    return this.checkbox.locator(".wrapper").evaluate((wrapper) => {
      const probe = document.createElement("span");
      probe.style.color = "CanvasText";
      document.body.append(probe);
      const expected = getComputedStyle(probe).color;
      probe.remove();
      const style = getComputedStyle(wrapper);
      return { color: style.borderColor, width: style.borderWidth, expected };
    });
  }
}
