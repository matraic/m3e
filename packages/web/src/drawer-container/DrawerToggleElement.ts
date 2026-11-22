import { LitElement } from "lit";

import { ActionElementBase, customElement, HtmlFor, waitForUpdate } from "@m3e/web/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/web/core/a11y";

import { M3eDrawerContainerElement } from "./DrawerContainerElement";

/**
 * An element, nested within a clickable element, used to toggle the opened state of a drawer.
 *
 * @example
 * Nest the drawer toggle in a toggleable icon button and match its `for` to the drawer's `id`. Place the button in the host element's `leading-icon` slot.
 *
 * ```html
 * <m3e-icon-button slot="leading-icon" aria-label="Menu" toggle>
 *   <m3e-icon name="menu"></m3e-icon>
 *   <m3e-icon slot="selected" name="menu_open"></m3e-icon>
 *   <m3e-drawer-toggle for="nav-drawer"></m3e-drawer-toggle>
 * </m3e-icon-button>
 * <m3e-drawer-container start-mode="over">
 *   <div slot="start" id="nav-drawer">Start drawer</div>
 *   <div>Main content</div>
 * </m3e-drawer-container>
 * ```
 *
 * @tag m3e-drawer-toggle
 */
@customElement("m3e-drawer-toggle")
export class M3eDrawerToggleElement extends HtmlFor(ActionElementBase) {
  /** @private */ readonly #drawerContainerChangeHandler = () => this.#handleDrawerContainerChange();
  /** @private */ #togglingDrawer = false;
  /** @private */ #trigger?: HTMLElement;
  /** @private */ #controlledId?: string;
  /** @private */ #container?: M3eDrawerContainerElement;

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    this.#trigger = this.parentElement ?? undefined;
    this.#controlledId = this.htmlFor ?? undefined;
    if (this.#controlledId && this.#trigger) {
      addAriaReferencedId(this.#trigger, "aria-controls", this.#controlledId);
    }

    const container = control.closest("m3e-drawer-container");
    if (container) {
      this.#container = container;
      container.addEventListener("change", this.#drawerContainerChangeHandler);
      this.#updateToggle(container, true);
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.#trigger) {
      if (this.#controlledId) {
        removeAriaReferencedId(this.#trigger, "aria-controls", this.#controlledId);
      }

      this.#trigger.ariaExpanded = null;
    }

    this.#container?.removeEventListener("change", this.#drawerContainerChangeHandler);
    this.#trigger = undefined;
    this.#controlledId = undefined;
    this.#container = undefined;

    super.detach();
  }

  /** @inheritdoc */
  override _onClick(): void {
    this.#toggleDrawer();
  }

  /** @private */
  #handleDrawerContainerChange(): void {
    if (this.control && !this.#togglingDrawer) {
      const container = this.control.closest("m3e-drawer-container");
      if (container) {
        this.#updateToggle(container, true);
      }
    }
  }

  /** @private */
  async #toggleDrawer(): Promise<void> {
    if (!this.parentElement || !this.control) {
      return;
    }

    const container = this.control.closest("m3e-drawer-container");
    if (container) {
      this.#togglingDrawer = true;
      try {
        let changed = false;
        if (this.control.slot === "start") {
          container.start = !container.start;
          changed = true;
        } else if (this.control.slot === "end") {
          container.end = !container.end;
          changed = true;
        }
        await waitForUpdate(container);
        if (changed) {
          container.dispatchEvent(new Event("change", { bubbles: true }));
        }
        await this.#updateToggle(container, false);
      } finally {
        this.#togglingDrawer = false;
      }
    }
  }

  /** @private */
  async #updateToggle(container: M3eDrawerContainerElement, syncToggle: boolean): Promise<void> {
    const trigger = this.#trigger;
    if (!trigger || !this.control) {
      return;
    }

    let selected = false;
    if (this.control.slot === "start") {
      selected = container.start;
    } else if (this.control.slot === "end") {
      selected = container.end;
    }

    trigger.ariaExpanded = `${selected}`;

    if (syncToggle && trigger.hasAttribute("toggle")) {
      trigger.toggleAttribute("selected", selected);
    }

    if (trigger instanceof LitElement) {
      // Wait for update and remove aria-pressed due to use of aria-expanded.
      await trigger.updateComplete;
      if (this.#trigger === trigger) trigger.ariaPressed = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-drawer-toggle": M3eDrawerToggleElement;
  }
}
