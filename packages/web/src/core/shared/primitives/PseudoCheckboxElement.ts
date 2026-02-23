import { css, CSSResultGroup, html, LitElement, nothing } from "lit";
import { customElement } from "lit/decorators.js";

import { CheckedIndeterminate, Disabled, Role } from "../mixins";
import { DesignToken } from "../tokens";

/**
 * An element which looks like a checkbox.
 *
 * @description
 * The `m3e-pseudo-checkbox` component is a pseudo-checkbox supporting checked, indeterminate, and disabled
 * states. It is customizable via CSS properties for expressive, accessible UI design.
 *
 * @example
 * The following example illustrates how to render a checked pseudo-checkbox.
 * ```html
 * <m3e-pseudo-checkbox checked></m3e-pseudo-checkbox>
 * ```
 *
 * @tag m3e-pseudo-checkbox
 *
 * @attr checked - A value indicating whether the element is checked.
 * @attr disabled - A value indicating whether the element is disabled.
 * @attr indeterminate - A value indicating whether the element's checked state is indeterminate.
 *
 * @cssprop --m3e-checkbox-icon-size - Size of the checkbox icon.
 * @cssprop --m3e-checkbox-container-shape - Border radius of the checkbox container.
 * @cssprop --m3e-checkbox-unselected-outline-thickness - Outline thickness for unselected state.
 * @cssprop --m3e-checkbox-unselected-outline-color - Outline color for unselected state.
 * @cssprop --m3e-checkbox-selected-container-color - Background color for selected state.
 * @cssprop --m3e-checkbox-selected-icon-color - Icon color for selected state.
 * @cssprop --m3e-checkbox-unselected-disabled-outline-color - Outline color for unselected disabled state.
 * @cssprop --m3e-checkbox-unselected-disabled-outline-opacity - Outline opacity for unselected disabled state.
 * @cssprop --m3e-checkbox-selected-disabled-container-color - Background color for selected disabled state.
 * @cssprop --m3e-checkbox-selected-disabled-container-opacity - Background opacity for selected disabled state.
 * @cssprop --m3e-checkbox-selected-disabled-icon-color - Icon color for selected disabled state.
 * @cssprop --m3e-checkbox-selected-disabled-icon-opacity - Icon opacity for selected disabled state.
 */
@customElement("m3e-pseudo-checkbox")
export class M3ePseudoCheckboxElement extends CheckedIndeterminate(Disabled(Role(LitElement, "none"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      vertical-align: middle;
      width: var(--m3e-checkbox-icon-size, 1.125rem);
      height: var(--m3e-checkbox-icon-size, 1.125rem);
      border-radius: var(--m3e-checkbox-container-shape, 0.125rem);
      box-sizing: border-box;
      flex: none;
    }
    :host(:not([checked]):not([indeterminate])) {
      border-width: var(--m3e-checkbox-unselected-outline-thickness, 0.125rem);
      border-style: solid;
    }
    :host(:not([disabled])[checked]),
    :host(:not([disabled])[indeterminate]) {
      background-color: var(--m3e-checkbox-selected-container-color, ${DesignToken.color.primary});
      color: var(--m3e-checkbox-selected-icon-color, ${DesignToken.color.onPrimary});
    }
    :host(:not([disabled]):not([checked]):not([indeterminate])) {
      border-color: var(--m3e-checkbox-unselected-outline-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host([disabled]:not([checked]):not([indeterminate])) {
      border-color: color-mix(
        in srgb,
        var(--m3e-checkbox-unselected-disabled-outline-color, ${DesignToken.color.onSurface})
          var(--m3e-checkbox-unselected-disabled-outline-opacity, 38%),
        transparent
      );
    }
    :host([disabled][checked]),
    :host([disabled][indeterminate]) {
      background-color: color-mix(
        in srgb,
        var(--m3e-checkbox-selected-disabled-container-color, ${DesignToken.color.onSurface})
          var(--m3e-checkbox-selected-disabled-container-opacity, 38%),
        transparent
      );
      color: color-mix(
        in srgb,
        var(--m3e-checkbox-selected-disabled-icon-color, ${DesignToken.color.surface})
          var(--m3e-checkbox-selected-disabled-icon-opacity, 100%),
        transparent
      );
    }
  `;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.ariaHidden = "true";
  }

  /** @inheritdoc */
  protected override render(): unknown {
    if (this.indeterminate) {
      return html`<svg viewBox="0 -960 960 960" fill="currentColor">
        <path Required d="M240-440v-80h480v80H240Z" />
      </svg>`;
    }
    if (this.checked) {
      return html`<svg viewBox="0 -960 960 960" fill="currentColor">
        <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
      </svg>`;
    }
    return nothing;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-pseudo-checkbox": M3ePseudoCheckboxElement;
  }
}
