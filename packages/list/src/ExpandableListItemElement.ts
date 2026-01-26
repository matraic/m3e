import { css, CSSResultGroup, html, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { DesignToken } from "@m3e/core";
import { selectionManager } from "@m3e/core/a11y";

import type { M3eListElement } from "./ListElement";
import { M3eListItemButtonElement } from "./ListItemButtonElement";
import { M3eListItemElement } from "./ListItemElement";

/**
 * An item in a list that can be expanded to show more items.
 *
 * @description
 * The `m3e-expandable-list-item` provides a hierarchical navigation structure that allows
 * users to expand and collapse content sections. It follows Material 3 design principles
 * with smooth animations, semantic color tokens, and accessible interactions. The component
 * extends the base `m3e-list-item` functionality with toggle state management and nested
 * content support.
 *
 * @example
 * The following example illustrates an expandable list item.
 * ```html
 * <m3e-action-list>
 *  <m3e-expandable-list-item>
 *    Pick up supplies
 *    <span slot="supporting-text">Due monday</span>
 *    <div slot="items">
 *      <m3e-list-action>
 *        Dry-erase board
 *        <span slot="supporting-text">$35.99</span>
 *      </m3e-list-action>
 *      <m3e-list-action>
 *        Markers
 *        <span slot="supporting-text">$8.99</span>
 *      </m3e-list-action>
 *    </div>
 *  </m3e-expandable-list-item>
 * </m3e-action-list>
 * ```
 *
 * @tag m3e-expandable-list-item
 *
 * @slot - Renders the content of the list item.
 * @slot leading - Renders the leading content of the list item.
 * @slot overline - Renders the overline of the list item.
 * @slot supporting-text - Renders the supporting text of the list item.
 * @slot toggle-icon - Renders a custom icon for the expand/collapse toggle.
 * @slot items - Container for child list items displayed when expanded.
 * @slot trailing - This component does not expose the base trailing slot.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr open - Whether the item is expanded.
 *
 * @fires opening - Emitted when the item begins to open.
 * @fires opened - Emitted when the item has opened.
 * @fires closing - Emitted when the item begins to close.
 * @fires closed - Emitted when the item has closed.
 *
 * @cssprop --m3e-expandable-list-item-toggle-icon-container-width - Width of the toggle icon container.
 * @cssprop --m3e-expandable-list-item-toggle-icon-container-shape - Border radius of the toggle icon container.
 * @cssprop --m3e-expandable-list-item-toggle-icon-size - Size of the toggle icon.
 * @cssprop --m3e-expandable-list-item-expanded-toggle-icon-container-color - Background color of the toggle icon container when expanded.
 * @cssprop --m3e-expandable-list-item-bounce-duration - Duration of the bounce animation when expanding.
 * @cssprop --m3e-expandable-list-item-bounce-factor - Multiplication factor for the bounce effect.
 * @cssprop --m3e-expandable-list-item-expand-duration - Duration of the expand/collapse animation.
 * @cssprop --m3e-list-item-between-space - Horizontal gap between elements.
 * @cssprop --m3e-list-item-padding-inline - Horizontal padding for the list item.
 * @cssprop --m3e-list-item-padding-block - Vertical padding for the list item.
 * @cssprop --m3e-list-item-height - Minimum height of the list item.
 * @cssprop --m3e-list-item-font-size - Font size for main content.
 * @cssprop --m3e-list-item-font-weight - Font weight for main content.
 * @cssprop --m3e-list-item-line-height - Line height for main content.
 * @cssprop --m3e-list-item-tracking - Letter spacing for main content.
 * @cssprop --m3e-list-item-overline-font-size - Font size for overline slot.
 * @cssprop --m3e-list-item-overline-font-weight - Font weight for overline slot.
 * @cssprop --m3e-list-item-overline-line-height - Line height for overline slot.
 * @cssprop --m3e-list-item-overline-tracking - Letter spacing for overline slot.
 * @cssprop --m3e-list-item-supporting-text-font-size - Font size for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-font-weight - Font weight for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-line-height - Line height for supporting text slot.
 * @cssprop --m3e-list-item-supporting-text-tracking - Letter spacing for supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-font-size - Font size for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-font-weight - Font weight for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-line-height - Line height for trailing supporting text slot.
 * @cssprop --m3e-list-item-trailing-text-tracking - Letter spacing for trailing supporting text slot.
 * @cssprop --m3e-list-item-icon-size - Size for leading/trailing icons.
 * @cssprop --m3e-list-item-label-text-color - Color for the main content.
 * @cssprop --m3e-list-item-overline-color - Color for the overline slot.
 * @cssprop --m3e-list-item-supporting-text-color - Color for the supporting text slot.
 * @cssprop --m3e-list-item-leading-color - Color for the leading content.
 * @cssprop --m3e-list-item-trailing-color - Color for the trailing content.
 * @cssprop --m3e-list-item-container-color - Background color of the list item.
 * @cssprop --m3e-list-item-container-shape - Border radius of the list item.
 * @cssprop --m3e-list-item-hover-container-shape - Border radius of the list item on hover.
 * @cssprop --m3e-list-item-focus-container-shape - Border radius of the list item on focus.
 * @cssprop --m3e-list-item-video-width - Width of the video slot.
 * @cssprop --m3e-list-item-video-height - Height of the video slot.
 * @cssprop --m3e-list-item-video-shape - Border radius of the video slot.
 * @cssprop --m3e-list-item-image-width - Width of the image slot.
 * @cssprop --m3e-list-item-image-height - Height of the image slot.
 * @cssprop --m3e-list-item-image-shape - Border radius of the image slot.
 * @cssprop --m3e-list-item-disabled-label-text-color - Color for the main content when disabled.
 * @cssprop --m3e-list-item-disabled-label-text-opacity - Opacity for the main content when disabled.
 * @cssprop --m3e-list-item-disabled-overline-color - Color for the overline slot when disabled.
 * @cssprop --m3e-list-item-disabled-overline-opacity - Opacity for the overline slot when disabled.
 * @cssprop --m3e-list-item-disabled-supporting-text-color - Color for the supporting text slot when disabled.
 * @cssprop --m3e-list-item-disabled-supporting-text-opacity - Opacity for the supporting text slot when disabled.
 * @cssprop --m3e-list-item-disabled-leading-color - Color for the leading icon when disabled.
 * @cssprop --m3e-list-item-disabled-leading-opacity - Opacity for the leading icon when disabled.
 * @cssprop --m3e-list-item-disabled-trailing-color - Color for the trailing icon when disabled.
 * @cssprop --m3e-list-item-disabled-trailing-opacity - Opacity for the trailing icon when disabled.
 * @cssprop --m3e-list-item-hover-state-layer-color - Color for the hover state layer.
 * @cssprop --m3e-list-item-hover-state-layer-opacity - Opacity for the hover state layer.
 * @cssprop --m3e-list-item-focus-state-layer-color - Color for the focus state layer.
 * @cssprop --m3e-list-item-focus-state-layer-opacity - Opacity for the focus state layer.
 * @cssprop --m3e-list-item-pressed-state-layer-color - Color for the pressed state layer.
 * @cssprop --m3e-list-item-pressed-state-layer-opacity - Opacity for the pressed state layer.
 * @cssprop --m3e-segmented-list-container-shape - Border radius of the segmented list container shape.
 * @cssprop --m3e-segmented-list-segment-gap - Gap between list item segments.
 * @cssprop --m3e-list-item-three-line-top-offset - Top offset for media in three line items.
 * @cssprop --m3e-list-item-disabled-media-opacity - Opacity for media when disabled.
 */
@customElement("m3e-expandable-list-item")
export class M3eExpandableListItem extends M3eListItemElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    .header {
      width: 100%;
      margin-bottom: 0px;
      transition: ${unsafeCSS(
        `margin-bottom 
        var(--m3e-expandable-list-item-bounce-duration, ${DesignToken.motion.duration.medium1})
        ${DesignToken.motion.easing.standard}`,
      )};
      --_list-item-button-trailing-align-self: stretch;
    }
    .toggle-container {
      display: flex;
      align-items: center;
      justify-content: center;
      align-self: stretch;
      width: var(--m3e-expandable-list-item-toggle-icon-container-width, 2rem);
      border-radius: var(--m3e-expandable-list-item-toggle-icon-container-shape, ${DesignToken.shape.corner.full});
      transition: ${unsafeCSS(
        `background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
      )};
    }
    .toggle {
      display: flex;
      align-items: center;
      justify-content: center;
      vertical-align: middle;
      font-size: var(--m3e-expandable-list-item-toggle-icon-size, 1.5rem);
      transition: ${unsafeCSS(`transform ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`)};
    }
    .toggle svg,
    ::slotted(svg[slot="toggle-icon"]) {
      width: 1em;
      height: 1em;
    }
    :host([open]) .toggle-container {
      background-color: var(
        --_expandable-list-item-expanded-toggle-icon-container-color,
        var(--m3e-expandable-list-item-expanded-toggle-icon-container-color, ${DesignToken.color.surfaceContainer})
      );
    }
    :host([open]) .toggle {
      transform: rotate(180deg);
    }
    :host([open]) .header {
      --_list-item-top-container-shape: var(--_expandable-list-item-expanded-top-shape, initial);
      --_list-item-bottom-container-shape: initial;
      margin-bottom: var(--_expandable-list-item-items-segment-gap, 0px);
    }
    :host([open]) .header.opening {
      margin-bottom: calc(
        var(--_expandable-list-item-items-segment-gap, 0px) * var(--m3e-expandable-list-item-bounce-factor, 4)
      );
    }
    :host([open]) .header,
    :host([open]) .items {
      --_list-item-container-color: var(
        --m3e-expandable-list-item-expanded-container-color,
        var(--m3e-list-item-container-color, transparent)
      );
    }
    :host,
    ::slotted([slot="items"]) {
      flex: none;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
    }
    ::slotted([slot="items"]) {
      --_list-item-top-container-shape: initial;
      --_list-item-bottom-container-shape: initial;
      row-gap: var(--_expandable-list-item-items-segment-gap, 0px);
    }
    .items {
      --m3e-collapsible-animation-duration: var(
        --m3e-expandable-list-item-expand-duration,
        ${DesignToken.motion.duration.medium1}
      );
    }
    @media (forced-colors: active) {
      .header {
        transition: none;
      }
      :host([open]) .header.opening {
        margin-bottom: var(--_expandable-list-item-items-segment-gap, 0px);
      }
    }
    @media (prefers-reduced-motion) {
      .header,
      .toggle-container,
      .toggle {
        transition: none;
      }
    }
  `;

  /** @private */ private static __nextId = 0;
  /** @private */ #id = M3eExpandableListItem.__nextId++;
  /** @private */ #contentId = `m3e-expandable-list-item-${this.#id}-content`;
  /** @private */ #headerId = `m3e-expandable-list-item-${this.#id}-header`;
  /** @private */ #items = new Array<M3eListItemElement>();

  /**
   * Whether the element is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether the item is expanded.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /** @internal */
  @query(".header") readonly button!: M3eListItemButtonElement;

  /** The direct child items of this item. */
  get items(): ReadonlyArray<M3eListItemElement> {
    return this.#items;
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("open")) {
      for (let sibling = this.previousElementSibling; sibling; sibling = sibling.previousElementSibling) {
        if (sibling instanceof M3eListItemElement) {
          sibling.classList.toggle("-has-next-open", this.open);
          break;
        }
      }
      for (let sibling = this.nextElementSibling; sibling; sibling = sibling.nextElementSibling) {
        if (sibling instanceof M3eListItemElement) {
          sibling.classList.toggle("-has-previous-open", this.open);
          break;
        }
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<m3e-list-item-button
        id="${this.#headerId}"
        class="header"
        ?disabled="${this.disabled}"
        aria-expanded="${this.open}"
        aria-controls="${this.#contentId}"
        @click="${this.#handleHeaderClick}"
      >
        <slot name="leading" slot="leading" @slotchange="${this._handleLeadingSlotChange}"></slot>
        <slot name="overline" slot="overline"></slot>
        <slot></slot>
        <slot name="supporting-text" slot="supporting-text"></slot>
        <div class="toggle-container" slot="trailing" aria-hidden="true">
          <div class="toggle">
            <slot name="toggle-icon">
              <svg viewBox="0 -960 960 960" fill="currentColor">
                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
              </svg>
            </slot>
          </div>
        </div>
      </m3e-list-item-button>
      <m3e-collapsible
        id="${this.#contentId}"
        class="items"
        role="list"
        aria-labelledby="${this.#headerId}"
        aria-hidden="${!this.open}"
        ?open="${this.open}"
        @opening="${this.#handleCollapsibleEvent}"
        @opened="${this.#handleCollapsibleEvent}"
        @closing="${this.#handleCollapsibleEvent}"
        @closed="${this.#handleCollapsibleEvent}"
      >
        <slot name="items" @slotchange="${this.#handleSlotChange}"></slot>
      </m3e-collapsible>`;
  }

  /** @private */
  #handleHeaderClick(e: Event) {
    if (!e.defaultPrevented) {
      this.open = !this.open;
      this.closest("m3e-action-list")?.[selectionManager].updateActiveItem(this.button);
    }
  }

  /** @private */
  #handleCollapsibleEvent(e: Event): void {
    e.stopPropagation();
    ["opening", "opened", "closing", "closed"].forEach((x) => {
      this.button?.classList.toggle(x, e.type === x);
    });

    this.dispatchEvent(new Event(e.type, { bubbles: true }));
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#items = (e.target as HTMLSlotElement)
      .assignedElements({ flatten: true })
      .flatMap((x) => [...x.childNodes].filter((x) => x instanceof M3eListItemElement));

    this.#items.forEach((x, i) => {
      if (i == this.#items.length - 1) {
        x.style.setProperty(
          "--_list-item-bottom-container-shape",
          `var(--m3e-segmented-list-container-shape, ${DesignToken.shape.corner.large})`,
        );
      } else {
        x.style.removeProperty("--_list-item-bottom-container-shape");
      }
    });

    this.closest<M3eListElement>("m3e-list, m3e-action-list, m3e-selection-list")?.notifyItemsChange();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-expandable-list-item": M3eExpandableListItem;
  }
}
