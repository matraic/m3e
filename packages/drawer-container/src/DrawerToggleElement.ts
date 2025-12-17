import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { ActionElementBase, HtmlFor } from "@m3e/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/core/a11y";

import { M3eDrawerContainerElement } from "./DrawerContainerElement";

/**
 * An element, nested within a clickable element, used to toggle the opened state of a drawer.
 *
 * @example
 * The following example illustrates the use of a `m3e-drawer-toggle`, nested inside a `m3e-icon-button` component,
 * which toggles the open state of the start drawer.
 *
 * ```html
 * <m3e-icon-button slot="leading-icon" aria-label="Menu" toggle selected>
 *   <m3e-drawer-toggle for="startDrawer"></m3e-drawer-toggle>
 *   <m3e-icon name="menu"></m3e-icon>
 *   <m3e-icon slot="selected" name="menu_open"></m3e-icon>
 * </m3e-icon-button>
 *
 * <m3e-drawer-container start>
 *   <nav slot="start" id="startDrawer" aria-label="Navigation">
 *     <!-- Start drawer content -->
 *   </nav>
 *   <!-- Container content -->
 * </m3e-drawer-container>
 * ```
 *
 * @tag m3e-drawer-toggle
 */
@customElement("m3e-drawer-toggle")
export class M3eDrawerToggleElement extends HtmlFor(ActionElementBase) {
  /** @private */ readonly #drawerContainerChangeHandler = () => this.#handleDrawerContainerChange();

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (this.htmlFor && this.parentElement) {
      addAriaReferencedId(this.parentElement, "aria-controls", this.htmlFor);
    }

    const container = control.closest("m3e-drawer-container");
    if (container) {
      container.addEventListener("change", this.#drawerContainerChangeHandler);
      this.#updateToggle(container);
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.parentElement) {
      if (this.htmlFor) {
        removeAriaReferencedId(this.parentElement, "aria-controls", this.htmlFor);
      }

      this.parentElement.ariaExpanded = null;
    }

    this.control?.closest("m3e-drawer-container")?.removeEventListener("change", this.#drawerContainerChangeHandler);

    super.detach();
  }

  /** @inheritdoc */
  override _onClick(): void {
    if (this.control && this.parentElement) {
      const container = this.control.closest("m3e-drawer-container");
      if (container) {
        if (this.control.slot === "start") {
          container.start = !container.start;
        } else if (this.control.slot === "end") {
          container.end = !container.end;
        }
        this.#updateToggle(container);
      }
    }
  }

  /** @private */
  #handleDrawerContainerChange(): void {
    if (this.control) {
      const container = this.control.closest("m3e-drawer-container");
      if (container) {
        this.#updateToggle(container);
      }
    }
  }

  /** @private */
  async #updateToggle(container: M3eDrawerContainerElement): Promise<void> {
    if (!this.parentElement || !this.control) {
      return;
    }

    let selected = false;
    if (this.control.slot === "start") {
      selected = container.start;
    } else if (this.control.slot === "end") {
      selected = container.end;
    }

    this.parentElement.ariaExpanded = `${selected}`;

    if (this.parentElement.hasAttribute("toggle")) {
      this.parentElement.toggleAttribute("selected", selected);
    }

    if (this.parentElement instanceof LitElement) {
      // Wait for update and remove aria-pressed due to use of aria-expanded.
      await (this.parentElement as LitElement).updateComplete;
      this.parentElement.ariaPressed = null;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-drawer-toggle": M3eDrawerToggleElement;
  }
}
