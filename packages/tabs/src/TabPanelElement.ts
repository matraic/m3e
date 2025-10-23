import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { DesignToken, Role } from "@m3e/core";

/**
 * A panel presented for a tab.
 *
 * @description
 * The `m3e-tab-panel` component represents the content region associated with a selected tab.
 * It is conditionally rendered based on tab selection and provides a structured surface for
 * displaying contextual information, media, or interactive elements. Panels are linked to their
 * corresponding tabs via the `for` attribute on `m3e-tab`, enabling declarative control and
 * accessible navigation consistent with Material 3 guidance.
 *
 * @example
 * The following example illustrates using the `m3e-tabs`, `m3e-tab`, and `m3e-tab-panel` components to present
 * secondary tabs.
 * ```html
 * <m3e-tabs>
 *  <m3e-tab selected for="videos"><m3e-icon slot="icon" name="videocam"></m3e-icon>Video</m3e-tab>
 *  <m3e-tab for="photos"><m3e-icon slot="icon" name="photo"></m3e-icon>Photos</m3e-tab>
 *  <m3e-tab for="audio"><m3e-icon slot="icon" name="music_note"></m3e-icon>Audio</m3e-tab>
 *  <m3e-tab-panel id="videos">Videos</m3e-tab-panel>
 *  <m3e-tab-panel id="photos">Photos</m3e-tab-panel>
 *  <m3e-tab-panel id="audio">Audio</m3e-tab-panel>
 * </m3e-tabs>
 * ```
 *
 * @tag m3e-tab-panel
 *
 * @slot - Renders the content of the panel.
 */
@customElement("m3e-tab-panel")
export class M3eTabPanelElement extends Role(LitElement, "tabpanel") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      overflow-y: auto;
      scrollbar-width: ${DesignToken.scrollbar.width};
      scrollbar-color: ${DesignToken.scrollbar.color};
    }
  `;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.slot = "panel";
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tab-panel": M3eTabPanelElement;
  }
}
