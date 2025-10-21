import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { HtmlFor } from "@m3e/core";

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
export class M3eDrawerToggleElement extends HtmlFor(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    ::slotted(.material-icons) {
      font-size: inherit !important;
    }
  `;

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @private */ readonly #drawerContainerChangeHandler = () => this.#handleDrawerContainerChange();

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.parentElement?.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.parentElement?.removeEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    const container = control.closest("m3e-drawer-container");
    if (container) {
      container.addEventListener("change", this.#drawerContainerChangeHandler);
      this.#updateToggle(container, control);
    }

    super.attach(control);
  }

  /** @inheritdoc */
  override detach(): void {
    this.control?.closest("m3e-drawer-container")?.removeEventListener("change", this.#drawerContainerChangeHandler);
    super.detach();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented && this.control && this.parentElement) {
      const container = this.control.closest("m3e-drawer-container");
      if (container) {
        if (this.control.slot === "start") {
          container.start = !container.start;
        } else if (this.control.slot === "end") {
          container.end = !container.end;
        }
      }
    }
  }

  /** @private */
  #handleDrawerContainerChange(): void {
    if (this.control) {
      const container = this.control.closest("m3e-drawer-container");
      if (container) {
        this.#updateToggle(container, this.control);
      }
    }
  }

  /** @private */
  #updateToggle(container: M3eDrawerContainerElement, control: HTMLElement) {
    if (control.slot === "start") {
      if (this.parentElement?.hasAttribute("toggle")) {
        this.parentElement.toggleAttribute("selected", container.start);
      }
    } else if (control.slot === "end") {
      if (this.parentElement?.hasAttribute("toggle")) {
        this.parentElement.toggleAttribute("selected", container.end);
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-drawer-toggle": M3eDrawerToggleElement;
  }
}
