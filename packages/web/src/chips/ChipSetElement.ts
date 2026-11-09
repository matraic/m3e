import { css, CSSResultGroup, html, LitElement } from "lit";

import { customElement, DesignToken, Vertical } from "@m3e/web/core";

/**
 * A container used to organize chips into a cohesive unit.
 *
 * @description
 * The `m3e-chip-set` component provides a flexible container for grouping chips, supporting both
 * horizontal and vertical layouts. It manages chip arrangement, spacing, and accessibility, and
 * serves as the foundation for chip set variants such as input and filter chip sets.
 *
 * @example
 * Group non-interactive chips in a chip set.
 *
 * ```html
 * <m3e-chip-set>
 *   <m3e-chip>Confidential</m3e-chip>
 *   <m3e-chip>Draft</m3e-chip>
 *   <m3e-chip>Finance</m3e-chip>
 *   <m3e-chip>Presentation</m3e-chip>
 * </m3e-chip-set>
 * ```
 *
 * @example
 * Use `vertical` to stack chips in a set.
 *
 * ```html
 * <m3e-chip-set vertical>
 *   <m3e-chip>Confidential</m3e-chip>
 *   <m3e-chip>Draft</m3e-chip>
 *   <m3e-chip>Finance</m3e-chip>
 *   <m3e-chip>Presentation</m3e-chip>
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
export class M3eChipSetElement extends Vertical(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-flex;
      flex-wrap: wrap;
      vertical-align: middle;
      gap: var(--m3e-chip-set-spacing, ${DesignToken.measurement.space100});
      outline: none;
    }
    :host([hidden]) {
      display: none;
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
