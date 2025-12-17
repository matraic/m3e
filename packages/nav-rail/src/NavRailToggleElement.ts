import { LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { ActionElementBase, HtmlFor, MutationController } from "@m3e/core";

import { M3eNavRailElement } from "./NavRailElement";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/core/a11y";

/**
 * An element, nested within a clickable element, used to toggle the expanded state of a navigation rail.
 *
 * @example
 * The following example illustrates a nav rail whose expanded state is automatically determined by the
 * current screen size.  In addition, a toggle button is used to allow the user to manually toggle the
 * expanded state.
 *
 * ```html
 * <m3e-nav-rail id="nav-rail" mode="auto">
 *   <m3e-icon-button toggle>
 *     <m3e-icon name="menu"></m3e-icon>
 *     <m3e-icon slot="selected" name="menu_open"></m3e-icon>
 *     <m3e-nav-rail-toggle for="nav-rail"></m3e-nav-rail-toggle>
 *   </m3e-icon-button>
 *   <m3e-fab size="small">
 *     <m3e-icon name="edit"></m3e-icon>
 *     <span slot="label">Extended</span>
 *   </m3e-fab>
 *   <m3e-nav-item><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="star"></m3e-icon>For you</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="newsstand"></m3e-icon>Trending</m3e-nav-item>
 * </m3e-nav-rail>
 * ```
 *
 * @tag m3e-nav-rail-toggle
 */
@customElement("m3e-nav-rail-toggle")
export class M3eNavRailToggleElement extends HtmlFor(ActionElementBase) {
  /** @private */ readonly #mutationController = new MutationController(this, {
    target: null,
    config: { attributeFilter: ["class"] },
    callback: () => this.#updateToggle(),
  });

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    if (control instanceof M3eNavRailElement) {
      this.#mutationController.observe(control);
    }
    if (this.htmlFor && this.parentElement) {
      addAriaReferencedId(this.parentElement, "aria-controls", this.htmlFor);
    }
    super.attach(control);
    this.#updateToggle();
  }

  /** @inheritdoc */
  override detach(): void {
    for (const target of this.#mutationController.targets) {
      this.#mutationController.unobserve(target);
    }

    if (this.parentElement) {
      if (this.htmlFor) {
        removeAriaReferencedId(this.parentElement, "aria-controls", this.htmlFor);
      }
      this.parentElement.ariaExpanded = null;
    }

    super.detach();
  }

  /** @inheritdoc */
  override _onClick(): void {
    if (this.control instanceof M3eNavRailElement) {
      this.control.currentMode = this.control.currentMode === "compact" ? "expanded" : "compact";
    }
  }

  /** @private */
  async #updateToggle(): Promise<void> {
    if (!this.parentElement) return;

    const selected = this.control instanceof M3eNavRailElement && this.control.currentMode === "expanded";
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
    "m3e-nav-rail-toggle": M3eNavRailToggleElement;
  }
}
