import { css, CSSResultGroup, html, LitElement } from "lit";

import { customElement, DesignToken, Role } from "@m3e/web/core";

import type { M3eNavItemElement } from "./NavItemElement";

/**
 * A panel presented for a navigation item.
 *
 * @description
 * The `m3e-nav-panel` component represents the content region associated with a selected navigation item.
 * Nested within an `m3e-nav-bar` or `m3e-nav-rail`, it is conditionally rendered based on the selection
 * state of the `m3e-nav-item` linked to it via the `for` attribute, providing a structured surface for
 * displaying contextual information, media, or interactive elements. Panels not linked by any item are
 * always presented.
 *
 * @example
 * The following example illustrates using `m3e-nav-bar`, `m3e-nav-item`, and `m3e-nav-panel` components to
 * switch between views.  The `for` attribute of each item designates the panel to present.
 * ```html
 * <m3e-nav-bar>
 *   <m3e-nav-item selected for="news"><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
 *   <m3e-nav-item for="global"><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
 *   <m3e-nav-panel id="news">News</m3e-nav-panel>
 *   <m3e-nav-panel id="global">Global</m3e-nav-panel>
 * </m3e-nav-bar>
 * ```
 *
 * @tag m3e-nav-panel
 *
 * @slot - Renders the content of the panel.
 */
@customElement("m3e-nav-panel")
export class M3eNavPanelElement extends Role(LitElement, "tabpanel") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      contain: layout style paint;
      display: block;
      flex: 1 1 auto;
      overflow-y: auto;
      scrollbar-width: ${DesignToken.scrollbar.width};
      scrollbar-color: ${DesignToken.scrollbar.color};
    }
    :host([hidden]) {
      display: none;
    }
  `;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.slot = "panel";
    this.refresh();
  }

  /**
   * Presents the panel when an `m3e-nav-item` linked to it is selected, otherwise hides it. A panel not
   * linked by any item is presented, and the visibility of a linked panel is owned by its items.
   */
  refresh(): void {
    if (!this.id) {
      return;
    }

    const root = this.getRootNode() as ParentNode | null;
    const items = root ? root.querySelectorAll<M3eNavItemElement>("m3e-nav-item") : [];
    const linked = [...items].filter((x) => x.htmlFor === this.id);

    // The item may have resolved `for` before this panel existed.
    for (const item of linked) {
      if (item.control !== this) {
        item.attach(this);
      }
    }

    this.hidden = linked.length > 0 && !linked.some((x) => x.selected);
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-panel": M3eNavPanelElement;
  }
}
