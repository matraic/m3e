import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { DesignToken, Role } from "@m3e/core";
import { addAriaReferencedId, removeAriaReferencedId } from "@m3e/core/a11y";

/**
 * Groups options under a subheading.
 *
 * @description
 * The `m3e-option-group` component organizes related options within an option list,
 * providing visual and semantic grouping through a customizable label. It manages `aria-labelledby`
 * associations automatically and applies Material Design 3 typography and spacing conventions to
 * the group label. The component maintains proper semantic structure by utilizing the ARIA `group` role,
 * ensuring that assistive technologies correctly interpret the hierarchical relationship between the label
 * and contained options.
 *
 * @tag m3e-option-group
 *
 * @slot - Renders the options of the group.
 * @slot label - Renders the label of the group.
 *
 * @cssprop --m3e-option-height - The height of the group label container.
 * @cssprop --m3e-option-font-size - The font size of the group label.
 * @cssprop --m3e-option-font-weight - The font weight of the group label.
 * @cssprop --m3e-option-line-height - The line height of the group label.
 * @cssprop --m3e-option-tracking - The letter spacing of the group label.
 * @cssprop --m3e-option-padding-end - The right padding of the label.
 * @cssprop --m3e-option-padding-start - The left padding of the label.
 * @cssprop --m3e-option-color - The text color of the group label.
 */
@customElement("m3e-option-group")
export class M3eOptionGroupElement extends Role(LitElement, "group") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      --_option-padding-start: calc(var(--m3e-option-padding-start, 0.75rem) * 2);
    }
    .label {
      height: var(--m3e-option-height, 3rem);
      font-size: var(--m3e-option-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-option-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-option-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-option-tracking, ${DesignToken.typescale.standard.label.large.tracking});
      padding-inline-end: var(--m3e-option-padding-end, 0.75rem);
      padding-inline-start: var(--m3e-option-padding-start, 0.75rem);
      color: var(--m3e-option-color, ${DesignToken.color.onSurface});
      flex: none;
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ #labelId = `m3e-option-group-label-${M3eOptionGroupElement.__nextId++}`;
  /** @private */ #label?: Element;

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-text-overflow class="label">
        <slot name="label" @slotchange="${this.#handleLabelSlotChange}"></slot>
      </m3e-text-overflow>
      <slot></slot>`;
  }

  /** @private */
  #handleLabelSlotChange(e: Event): void {
    const label = (<HTMLSlotElement>e.target).assignedElements({ flatten: true })[0] ?? undefined;
    if (label === this.#label) return;

    if (this.#label?.id) {
      removeAriaReferencedId(this, "aria-labelledby", this.#label.id);
      if (this.#label.id === this.#labelId) {
        this.#label.id = "";
      }
    }

    this.#label = label;

    if (this.#label) {
      this.#label.id = this.#label.id || this.#labelId;
      addAriaReferencedId(this, "aria-labelledby", this.#label.id);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-option-group": M3eOptionGroupElement;
  }
}
