import { css, CSSResultGroup, html, LitElement } from "lit";

import { customElement, Role } from "@m3e/web/core";

/**
 * Groups related items (such a radios) in a menu.
 *
 * @description
 * The `m3e-menu-item-group` component groups related items within a menu, establishing a shared
 * context for interaction and selection. It enables separation of concerns—such as organizing radio
 * items into mutually exclusive sets.
 *
 * @example
 * Showcase: Radios. Import `@m3e/web/menu`. Also import `@m3e/web/divider`.
 *
 * ```html
 * <!-- Trigger omitted for brevity -->
 * <m3e-menu id="menu">
 *   <m3e-menu-item-group>
 *     <m3e-menu-item-radio checked>Ascending</m3e-menu-item-radio>
 *     <m3e-menu-item-radio>Descending</m3e-menu-item-radio>
 *   </m3e-menu-item-group>
 *   <m3e-divider></m3e-divider>
 *   <m3e-menu-item-group>
 *     <m3e-menu-item-radio checked>Alphabetical</m3e-menu-item-radio>
 *     <m3e-menu-item-radio>By Date</m3e-menu-item-radio>
 *   </m3e-menu-item-group>
 * </m3e-menu>
 * ```
 *
 * @tag m3e-menu-item-group
 *
 * @slot - Renders the contents of the group.
 */
@customElement("m3e-menu-item-group")
export class M3eMenuItemGroupElement extends Role(LitElement, "group") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    :host([hidden]) {
      display: none;
    }
  `;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-menu-item-group": M3eMenuItemGroupElement;
  }
}
