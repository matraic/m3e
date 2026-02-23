import { Role } from "@m3e/web/core";
import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

/**
 * Groups related items (such a radios) in a menu.
 *
 * @description
 * The `m3e-menu-item-group` component groups related items within a menu, establishing a shared
 * context for interaction and selection. It enables separation of concerns—such as organizing radio
 * items into mutually exclusive sets.
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
