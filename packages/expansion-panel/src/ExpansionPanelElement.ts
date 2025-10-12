/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */

import { CSSResultGroup, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { AttachInternals, Disabled, EventAttribute, Role } from "@m3e/core";

import { ExpansionTogglePosition } from "./ExpansionTogglePosition";
import { ExpansionToggleDirection } from "./ExpansionToggleDirection";

import { ExpansionPanelStyle } from "./styles";
import { M3eExpansionHeaderElement } from "./ExpansionHeaderElement";

/**
 * @summary
 * An expandable details-summary view.
 *
 * @description
 * The `m3e-expansion-panel` component provides an accessible, animated details-summary view for
 * organizing content in collapsible sections. It supports custom header, content, actions, and
 * toggle icon slots, and offers configurable toggle position and direction. The panel responds to
 * open/close states, emits lifecycle events, and supports rich theming via CSS custom properties
 * for elevation, shape, spacing, and color.
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
 * @tag m3e-expansion-panel
 *
 * @slot - Renders the detail of the panel.
 * @slot actions- Renders the actions bar of the panel.
 * @slot header - Renders the header content.
 * @slot toggle-icon - Renders the expansion toggle icon.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr hide-toggle - Whether to hide the expansion toggle.
 * @attr open - Whether the panel is expanded.
 * @attr toggle-direction - The direction of the expansion toggle.
 * @attr toggle-position - The position of the expansion toggle.
 *
 * @fires opening - Emitted when the expansion panel begins to open.
 * @fires opened - Emitted when the expansion panel has opened.
 * @fires closing - Emitted when the expansion panel begins to close.
 * @fires closed - Emitted when the expansion panel has closed.
 *
 * @cssprop --m3e-expansion-header-collapsed-height - Height of the header when the panel is collapsed.
 * @cssprop --m3e-expansion-header-expanded-height - Height of the header when the panel is expanded.
 * @cssprop --m3e-expansion-header-padding-left - Left padding inside the header.
 * @cssprop --m3e-expansion-header-padding-right - Right padding inside the header.
 * @cssprop --m3e-expansion-header-spacing - Spacing between header elements.
 * @cssprop --m3e-expansion-header-toggle-icon-size - Size of the toggle icon (e.g. chevron).
 * @cssprop --m3e-expansion-header-font-size - The font size of the header text.
 * @cssprop --m3e-expansion-header-font-weight - The font weight of the header text.
 * @cssprop --m3e-expansion-header-line-height - The line height of the header text.
 * @cssprop --m3e-expansion-header-tracking - Letter spacing (tracking) of the header text.
 * @cssprop --m3e-expansion-panel-text-color - Color of the panel's text content.
 * @cssprop --m3e-expansion-panel-disabled-text-color - Color of the panel's text content, when disabled.
 * @cssprop --m3e-expansion-panel-disabled-text-opacity - Opacity of the panel's text content, when disabled.
 * @cssprop --m3e-expansion-panel-container-color - Background color of the panel container.
 * @cssprop --m3e-expansion-panel-elevation - Elevation level when the panel is collapsed.
 * @cssprop --m3e-expansion-panel-shape - Shape (e.g. border radius) of the panel when collapsed.
 * @cssprop --m3e-expansion-panel-open-elevation - Elevation level when the panel is expanded.
 * @cssprop --m3e-expansion-panel-open-shape - Shape (e.g. border radius) of the panel when expanded.
 * @cssprop --m3e-expansion-panel-content-padding - Padding around the panel's content area.
 * @cssprop --m3e-expansion-panel-actions-spacing - Spacing between action buttons or elements.
 * @cssprop --m3e-expansion-panel-actions-padding - Padding around the actions section.
 * @cssprop --m3e-expansion-panel-actions-divider-thickness - Thickness of the divider above actions.
 * @cssprop --m3e-expansion-panel-actions-divider-color - Color of the divider above actions.
 */
@customElement("m3e-expansion-panel")
export class M3eExpansionPanelElement extends EventAttribute(
  Disabled(AttachInternals(Role(LitElement, "none"), true)),
  "opening",
  "opened",
  "closing",
  "closed"
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = ExpansionPanelStyle;

  /** @private */ private static __nextId = 0;
  /** @private */ #id = M3eExpansionPanelElement.__nextId++;
  /** @private */ #contentId = `m3e-expansion-panel-${this.#id}-content`;
  /** @private */ #headerId = `m3e-expansion-panel-${this.#id}-header`;

  /** @private */ @query("m3e-expansion-header") private readonly _header?: M3eExpansionHeaderElement;

  /**
   * Whether the panel is expanded.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * The direction of the expansion toggle.
   * @default "vertical"
   */
  @property({ attribute: "toggle-direction", reflect: true }) toggleDirection: ExpansionToggleDirection = "vertical";

  /**
   * The position of the expansion toggle.
   * @default "after"
   */
  @property({ attribute: "toggle-position", reflect: true }) togglePosition: ExpansionTogglePosition = "after";

  /**
   * Whether to hide the expansion toggle.
   * @default false
   */
  @property({ attribute: "hide-toggle", type: Boolean, reflect: true }) hideToggle = false;

  /** @inheritdoc */
  protected override render(): unknown {
    return html` <m3e-expansion-header
        id="${this.#headerId}"
        toggle-direction="${this.toggleDirection}"
        toggle-position="${this.togglePosition}"
        ?hide-toggle="${this.hideToggle}"
        ?disabled="${this.disabled}"
        aria-expanded="${this.open}"
        aria-controls="${this.#contentId}"
        @click="${this.#handleHeaderClick}"
        @keydown="${this.#handleKeyDown}"
      >
        <div slot="toggle-icon" class="toggle">
          <slot name="toggle-icon">${this.#renderToggleIcon()}</slot>
        </div>
        <slot name="header"></slot>
      </m3e-expansion-header>
      <m3e-collapsible
        id="${this.#contentId}"
        role="region"
        aria-labelledby="${this.#headerId}"
        aria-hidden="${!this.open}"
        ?open="${this.open}"
        @opening="${this.#handleCollapsibleEvent}"
        @opened="${this.#handleCollapsibleEvent}"
        @closing="${this.#handleCollapsibleEvent}"
        @closed="${this.#handleCollapsibleEvent}"
      >
        <div class="content">
          <slot></slot>
        </div>
        <slot name="actions"></slot>
      </m3e-collapsible>`;
  }

  /** @private */
  #renderToggleIcon(): unknown {
    return this.toggleDirection === "vertical"
      ? html`<svg viewBox="0 -960 960 960" fill="currentColor">
          <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
        </svg>`
      : html`<svg viewBox="0 -960 960 960" fill="currentColor">
          <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
        </svg>`;
  }

  /** @private */
  #handleHeaderClick() {
    this.open = !this.open;
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    switch (e.key) {
      case "ArrowUp":
        {
          e.preventDefault();
          const accordion = this.closest("m3e-accordion");
          if (accordion) {
            const panels = [...accordion.panels].reverse();
            const index = panels.indexOf(this);
            (
              panels.find((x, i) => !x.disabled && i > index) ?? panels.find((x, i) => !x.disabled && i < index)
            )?._header?.focus();
          } else {
            this.open = false;
          }
        }

        break;

      case "ArrowDown":
        {
          e.preventDefault();
          const accordion = this.closest("m3e-accordion");
          if (accordion) {
            const index = accordion.panels.indexOf(this);
            (
              accordion.panels.find((x, i) => !x.disabled && i > index) ??
              accordion.panels.find((x, i) => !x.disabled && i < index)
            )?._header?.focus();
          } else {
            this.open = true;
          }
        }

        break;
    }
  }

  /** @private */
  #handleCollapsibleEvent(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event(e.type, { bubbles: true }));
  }
}

interface M3eExpansionPanelElementEventMap extends HTMLElementEventMap {
  opening: Event;
  opened: Event;
  closing: Event;
  closed: Event;
}

export interface M3eExpansionPanelElement {
  addEventListener<K extends keyof M3eExpansionPanelElementEventMap>(
    type: K,
    listener: (this: M3eExpansionPanelElement, ev: M3eExpansionPanelElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eExpansionPanelElementEventMap>(
    type: K,
    listener: (this: M3eExpansionPanelElement, ev: M3eExpansionPanelElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-expansion-panel": M3eExpansionPanelElement;
  }
}
