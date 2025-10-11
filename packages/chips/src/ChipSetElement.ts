import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { Role, Vertical } from "@m3e/core";

/**
 * @summary
 * A container used to organize chips into a cohesive unit.
 *
 * @description
 * The `m3e-chip-set` component provides a flexible container for grouping chips, supporting both
 * horizontal and vertical layouts. It manages chip arrangement, spacing, and accessibility, and
 * serves as the foundation for chip set variants such as input and filter chip sets.
 *
 * @example
 * The following example illustrates use of the `m3e-chip` and `m3e-chip-set` components to present non-interactive chips.
 * ```html
 * <m3e-chip-set>
 *  <m3e-chip><m3e-icon slot="icon" name="palette"></m3e-icon>Design</m3e-chip>
 *  <m3e-chip><m3e-icon slot="icon" name="accessibility_new"></m3e-icon>Accessibility</m3e-chip>
 *  <m3e-chip><m3e-icon slot="icon" name="motion_photos_on"></m3e-icon>Motion</m3e-chip>
 *  <m3e-chip><m3e-icon slot="icon" name="description"></m3e-icon>Documentation</m3e-chip>
 * </m3e-chip-set>
 * ```
 *
 * @tag m3e-chip-set
 *
 * @slot - Renders the chips of the set.
 *
 * @attr vertical - Whether the element is oriented vertically.
 *
 * @cssprop --m3e-chip-set-spacing - The spacing (gap) between chips in the set.
 */
@customElement("m3e-chip-set")
export class M3eChipSetElement extends Vertical(Role(LitElement, "none")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      flex-wrap: wrap;
      vertical-align: middle;
      gap: var(--m3e-chip-set-spacing, 0.5rem);
      outline: none;
    }
    :host([vertical]) {
      flex-direction: column;
    }
  `;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-chip-set": M3eChipSetElement;
  }
}
