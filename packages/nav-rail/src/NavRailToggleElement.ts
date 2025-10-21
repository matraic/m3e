import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { HtmlFor, MutationController } from "@m3e/core";

import { M3eNavRailElement } from "./NavRailElement";

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
export class M3eNavRailToggleElement extends HtmlFor(LitElement) {
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
  /** @private */ readonly #mutationController = new MutationController(this, {
    target: null,
    config: { attributeFilter: ["class"] },
    callback: () => this.#updateToggle(),
  });

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
    if (control instanceof M3eNavRailElement) {
      this.#mutationController.observe(control);
    }
    super.attach(control);
    this.#updateToggle();
  }

  /** @inheritdoc */
  override detach(): void {
    for (const target of this.#mutationController.targets) {
      this.#mutationController.unobserve(target);
    }
    this.#updateToggle();
    super.detach();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented && this.control instanceof M3eNavRailElement) {
      this.control.currentMode = this.control.currentMode === "compact" ? "expanded" : "compact";
    }
  }

  /** @private */
  #updateToggle(): void {
    if (this.parentElement?.hasAttribute("toggle")) {
      this.parentElement.toggleAttribute(
        "selected",
        this.control instanceof M3eNavRailElement && this.control.currentMode === "expanded"
      );
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-rail-toggle": M3eNavRailToggleElement;
  }
}
