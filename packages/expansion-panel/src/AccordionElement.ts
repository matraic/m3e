import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken, Role } from "@m3e/core";

import { M3eExpansionPanelElement } from "./ExpansionPanelElement";

/**
 * @summary
 * Combines multiple expansion panels in to an accordion.
 *
 * @description
 * The `m3e-accordion` component organizes multiple expansion panels into a coordinated, accessible group.
 * It supports single or multiple open panels via the `multi` attribute, and provides expressive theming
 * and shape control for grouped layouts. The accordion manages open/close state across its child panels,
 * enabling interactive disclosure patterns for complex content.
 *
 * @example
 * The following example illustrates the basic use of the `m3e-accordion` and `m3e-expansion-panel` components.
 *
 * ```html
 * <m3e-accordion>
 *   <m3e-expansion-panel>
 *     <span slot="header">Panel 1</span>
 *     I am content for the first expansion panel
 *   </m3e-expansion-panel>
 *   <m3e-expansion-panel>
 *     <span slot="header">Panel 2</span>
 *     I am content for the second expansion panel
 *   </m3e-expansion-panel>
 * </m3e-accordion>
 * ```
 *
 * @tag m3e-accordion
 *
 * @slot - Renders the panels of the accordion.
 *
 * @attr multi - Whether multiple expansion panels can be open at the same time.
 */
@customElement("m3e-accordion")
export class M3eAccordionElement extends Role(LitElement, "none") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    ::slotted(m3e-expansion-panel) {
      --m3e-expansion-panel-container-color: ${DesignToken.color.surfaceContainerLow};
      --m3e-expansion-panel-elevation: ${DesignToken.elevation.level2};
      --m3e-expansion-panel-open-shape: ${DesignToken.shape.corner.medium};
      --_expansion-panel-open-spacing: 1rem;
    }
    ::slotted(m3e-expansion-panel:first-of-type:last-of-type) {
      --m3e-expansion-panel-shape: ${DesignToken.shape.corner.medium};
    }
    ::slotted(m3e-expansion-panel:first-of-type:not(:last-of-type)) {
      --m3e-expansion-panel-shape: ${DesignToken.shape.corner.value.medium} ${DesignToken.shape.corner.value.medium}
        ${DesignToken.shape.corner.value.none} ${DesignToken.shape.corner.value.none};
    }
    ::slotted(m3e-expansion-panel:last-of-type:not(:first-of-type)) {
      --m3e-expansion-panel-shape: ${DesignToken.shape.corner.value.none} ${DesignToken.shape.corner.value.none}
        ${DesignToken.shape.corner.value.medium} ${DesignToken.shape.corner.value.medium};
    }
  `;

  /** @private */ #panels: Array<M3eExpansionPanelElement> = [];

  /**
   * Whether multiple expansion panels can be open at the same time.
   * @default false
   */
  @property({ type: Boolean }) multi = false;

  /** The panels of the accordion. */
  get panels() {
    return this.#panels;
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#handleSlotChange}" @opening="${this.#handleOpening}"></slot>`;
  }

  /** @private */
  #handleSlotChange() {
    this.#panels = [...this.querySelectorAll("m3e-expansion-panel")];

    if (this.multi) {
      return;
    }

    let alreadyOpen = false;
    for (const panel of this.#panels.filter((x) => !x.open)) {
      if (alreadyOpen) {
        panel.open = false;
      }
      alreadyOpen = true;
    }
  }

  /** @private */
  #handleOpening(e: Event): void {
    if (!this.multi) {
      for (const panel of this.#panels.filter((x) => x !== e.target && x.open)) {
        panel.open = false;
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-accordion": M3eAccordionElement;
  }
}
