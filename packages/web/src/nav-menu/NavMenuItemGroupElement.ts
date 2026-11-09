import { css, CSSResultGroup, html, LitElement } from "lit";

import { AttachInternals, customElement, deleteCustomState, DesignToken, Role, setCustomState } from "@m3e/web/core";

/**
 * A top-level semantic grouping of items in a navigation menu.
 *
 * @description
 * The `m3e-nav-menu-item-group` is a top-level semantic grouping of items in a navigation menu.
 * It encapsulates related items under a shared heading or label, supporting visual hierarchy and accessibility.
 *
 * @example
 * Showcase: Personal folders. Import `@m3e/web/nav-menu`. Also import `@m3e/web/heading`, `@m3e/web/icon`, `@m3e/web/divider`. Load a matching Material Symbols font or register the icons.
 *
 * ```html
 * <m3e-nav-menu>
 *   <m3e-nav-menu-item-group>
 *     <m3e-heading slot="label" variant="label" size="large">Mail</m3e-heading>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="mail"></m3e-icon>
 *       <span slot="label">Inbox</span>
 *       <span slot="badge">24</span>
 *     </m3e-nav-menu-item>
 *     <!-- Additional items omitted for brevity -->
 *   </m3e-nav-menu-item-group>
 *   <m3e-divider></m3e-divider>
 *   <m3e-nav-menu-item-group>
 *     <m3e-heading slot="label" variant="label" size="large">Personal folders</m3e-heading>
 *     <!-- Items omitted for brevity -->;
 *   </m3e-nav-menu-item-group>
 * </m3e-nav-menu>
 * ```
 *
 * @tag m3e-nav-menu-item-group
 *
 * @slot - Renders the items of the group.
 * @slot label - Renders the label of the group.
 *
 * @cssprop --m3e-nav-menu-item-group-label-inset - Insets the label from the start edge of the group.
 * @cssprop --m3e-nav-menu-item-group-label-space - Vertical spacing around the group's label.
 */
@customElement("m3e-nav-menu-item-group")
export class M3eNavMenuItemGroupElement extends AttachInternals(Role(LitElement, "group")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:not(:is(:state(--with-label), :--with-label))) .label {
      display: none;
    }
    .label {
      margin-inline-start: var(--m3e-nav-menu-item-group-label-inset, ${DesignToken.measurement.space200});
      margin-block-end: var(--m3e-nav-menu-item-group-label-space, ${DesignToken.measurement.space200});
      flex: none;
    }
    :host(:is(:state(--divided), :--divided)) .label {
      margin-block-start: calc(
        var(--m3e-nav-menu-item-group-label-space, ${DesignToken.measurement.space200}) - var(
            --m3e-nav-menu-divider-margin,
            ${DesignToken.measurement.space50}
          )
      );
    }
    :host(:not(:is(:state(--divided), :--divided))) .label {
      margin-block-start: var(--m3e-nav-menu-item-group-label-space, ${DesignToken.measurement.space200});
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ #labelId = `m3e-nav-menu-item-group-label-${M3eNavMenuItemGroupElement.__nextId++}`;
  /** @private */ #label?: Element;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    setCustomState(this, "--divided", this.previousElementSibling?.tagName === "M3E-DIVIDER");
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    deleteCustomState(this, "--divided");
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="label">
        <slot name="label" @slotchange=${this.#handleLabelSlotChange}></slot>
      </div>
      <slot></slot>`;
  }

  /** @private */
  #handleLabelSlotChange(e: Event): void {
    const label = (e.target as HTMLSlotElement).assignedElements({ flatten: true })[0];
    if (label !== this.#label) {
      // If the label is changed and its id matched the reversed id,
      // clear the id in the event the element is moved elsewhere in the DOM.

      if (this.#label?.id === this.#labelId) {
        this.#label.id = "";
      }

      this.#label = label;

      if (this.#label) {
        this.#label.id = this.#label.id || this.#labelId;
        this.setAttribute("aria-labelledby", this.#label.id);
      } else {
        this.removeAttribute("aria-labelledby");
      }
    }
    setCustomState(this, "--with-label", this.#label !== undefined);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-menu-item-group": M3eNavMenuItemGroupElement;
  }
}
