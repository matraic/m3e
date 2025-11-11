/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  AttachInternals,
  DesignToken,
  Disabled,
  EventAttribute,
  hasAssignedNodes,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  Role,
  Selected,
} from "@m3e/core";

import { selectionManager } from "@m3e/core/a11y";

import type { M3eNavMenuElement } from "./NavMenuElement";

/**
 * An expandable item, selectable item within a navigation menu.
 *
 * @description
 * The `m3e-nav-menu-item` component represents an expandable, selectable item within a navigation menu.
 * It supports nested child items, selection, disabled and indeterminate states, and emits events for
 * open/close transitions. The component is highly customizable via slots and CSS custom properties, and
 * is designed for accessible, keyboard-navigable menu structures.
 *
 *
 * @example
 * The following example illustrates a navigation menu with a top-level group of menu items.
 * ```html
 * <m3e-nav-menu>
 *   <m3e-nav-menu-item-group>
 *     <m3e-heading slot="label" variant="label" size="large">Mail</m3e-heading>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="mail"></m3e-icon>
 *       <span slot="label">Inbox</span>
 *       <span slot="badge">24</span>
 *     </m3e-nav-menu-item>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="send"></m3e-icon>
 *       <span slot="label">Outbox</span>
 *     </m3e-nav-menu-item>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="favorite"></m3e-icon>
 *       <span slot="label">Favorites</span>
 *     </m3e-nav-menu-item>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="delete"></m3e-icon>
 *       <span slot="label">Trash</span>
 *     </m3e-nav-menu-item>
 *   </m3e-nav-menu-item-group>
 * </m3e-nav-menu>
 * ```
 *
 * @example
 * The next example illustrates a multilevel navigation menu.
 * ```html
 * <m3e-nav-menu>
 *   <m3e-nav-menu-item open>
 *     <m3e-icon slot="icon" name="rocket_launch"></m3e-icon>
 *     <span slot="label">Getting Started</span>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="widgets"></m3e-icon>
 *       <span slot="label">Overview</span>
 *     </m3e-nav-menu-item>
 *     <m3e-nav-menu-item>
 *       <m3e-icon slot="icon" name="package_2"></m3e-icon>
 *       <span slot="label">Installation</span>
 *     </m3e-nav-menu-item>
 *   </m3e-nav-menu-item>
 *   <m3e-nav-menu-item>
 *     <span slot="label">Actions</span>
 *     <m3e-nav-menu-item><span slot="label">Button</span></m3e-nav-menu-item>
 *     <m3e-nav-menu-item><span slot="label">Icon</span></m3e-nav-menu-item>
 *     <m3e-nav-menu-item><span slot="label">Icon Button</span></m3e-nav-menu-item>
 *   </m3e-nav-menu-item>
 * </m3e-nav-menu>
 * ```
 *
 * @tag m3e-nav-menu-item
 *
 * @slot - Renders the nested child items.
 * @slot label - Renders the label of the item.
 * @slot icon - Renders the icon of the item.
 * @slot badge - Renders the badge of the item.
 * @slot selected-icon - Renders the icon of the item when selected.
 * @slot toggle-icon - Renders the toggle icon.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr indeterminate - Whether the element's selected / checked state is indeterminate.
 * @attr open - Whether the item is expanded.
 * @attr selected - Whether the item is selected.
 *
 * @fires opening - Emitted when the item begins to open.
 * @fires opened - Emitted when the item has opened.
 * @fires closing - Emitted when the item begins to close.
 * @fires closed - Emitted when the item has closed.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-nav-menu-item-font-size - Font size for the item label.
 * @cssprop --m3e-nav-menu-item-font-weight - Font weight for the item label.
 * @cssprop --m3e-nav-menu-item-line-height - Line height for the item label.
 * @cssprop --m3e-nav-menu-item-tracking - Letter spacing for the item label.
 * @cssprop --m3e-nav-menu-item-padding - Inline padding for the item.
 * @cssprop --m3e-nav-menu-item-height - Height of the item.
 * @cssprop --m3e-nav-menu-item-spacing - Spacing between icon and label.
 * @cssprop --m3e-nav-menu-item-shape - Border radius of the item and focus ring.
 * @cssprop --m3e-nav-menu-item-icon-size - Size of the icon.
 * @cssprop --m3e-nav-menu-item-inset - Indentation for nested items.
 * @cssprop --m3e-nav-menu-item-label-color - Text color for the item label.
 * @cssprop --m3e-nav-menu-item-selected-label-color - Text color for selected item label.
 * @cssprop --m3e-nav-menu-item-selected-container-color - Background color for selected item.
 * @cssprop --m3e-nav-menu-item-selected-container-focus-color - Focus color for selected item container.
 * @cssprop --m3e-nav-menu-item-selected-container-hover-color - Hover color for selected item container.
 * @cssprop --m3e-nav-menu-item-selected-ripple-color - Ripple color for selected item.
 * @cssprop --m3e-nav-menu-item-unselected-container-focus-color - Focus color for unselected item container.
 * @cssprop --m3e-nav-menu-item-unselected-container-hover-color - Hover color for unselected item container.
 * @cssprop --m3e-nav-menu-item-unselected-ripple-color - Ripple color for unselected item.
 * @cssprop --m3e-nav-menu-item-open-container-color - Background color for open item with children.
 * @cssprop --m3e-nav-menu-item-open-container-focus-color - Focus color for open item container.
 * @cssprop --m3e-nav-menu-item-open-container-hover-color - Hover color for open item container.
 * @cssprop --m3e-nav-menu-item-open-ripple-color - Ripple color for open item.
 * @cssprop --m3e-nav-menu-item-disabled-color - Text color for disabled item.
 * @cssprop --m3e-nav-menu-item-disabled-color-opacity - Opacity for disabled item text color.
 * @cssprop --m3e-nav-menu-item-badge-font-size - Font size for badge slot.
 * @cssprop --m3e-nav-menu-item-badge-font-weight - Font weight for badge slot.
 * @cssprop --m3e-nav-menu-item-badge-line-height - Line height for badge slot.
 * @cssprop --m3e-nav-menu-item-badge-tracking - Letter spacing for badge slot.
 * @cssprop --m3e-nav-menu-divider-margin - Margin for divider elements.
 * @cssprop --m3e-nav-menu-item-vertical-inset - Vertical margin for first/last child items.
 */
@customElement("m3e-nav-menu-item")
export class M3eNavMenuItemElement extends Selected(
  Disabled(
    EventAttribute(AttachInternals(Role(LitElement, "treeitem"), true), "opening", "opened", "closing", "closed")
  )
) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      flex: none;
      outline: none;
      user-select: none;
      position: relative;
      font-size: var(--m3e-nav-menu-item-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-nav-menu-item-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-nav-menu-item-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-nav-menu-item-tracking, ${DesignToken.typescale.standard.label.large.tracking});
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .base {
      display: flex;
      align-items: center;
      position: relative;
      padding-inline: var(--m3e-nav-menu-item-padding, 1.5rem);
      height: calc(var(--m3e-nav-menu-item-height, 3.5rem) + ${DesignToken.density.calc(-3)});
      column-gap: var(--m3e-nav-menu-item-spacing, 0.75rem);
      transition: ${unsafeCSS(
        `color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
        background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`
      )};
    }
    .base,
    .focus-ring {
      border-radius: var(--m3e-nav-menu-item-shape, ${DesignToken.shape.corner.full});
    }
    .label {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      vertical-align: middle;
    }
    .icon,
    .toggle {
      flex: none;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      vertical-align: middle;
    }
    ::slotted([slot="badge"]) {
      flex: none;
      position: relative;
      font-size: var(--m3e-nav-menu-item-badge-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-nav-menu-item-badge-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-nav-menu-item-badge-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-nav-menu-item-badge-tracking, ${DesignToken.typescale.standard.label.large.tracking});
    }
    .toggle {
      transition: ${unsafeCSS(`transform var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
        ${DesignToken.motion.easing.standard}`)};
    }
    :host(:not(.-with-icon)) .icon {
      display: none;
    }
    .icon {
      margin-inline-start: -0.5rem;
    }
    .toggle {
      margin-inline-end: -0.5rem;
    }
    .group {
      padding-inline-start: var(--m3e-nav-menu-item-inset, 1rem);
    }
    :host([open]) .toggle {
      transform: rotate(180deg);
    }
    :host(:not(.-has-items)) .toggle,
    :host(:not(.-has-items)) .group {
      display: none;
    }
    ::slotted([slot="selected-icon"]),
    ::slotted([slot="icon"]),
    ::slotted([slot="toggle-icon"]),
    .toggle-icon {
      vertical-align: middle;
      width: 1em;
      height: 1em;
      font-size: var(--m3e-nav-menu-item-icon-size, 1.5rem);
    }
    :host(:not(:disabled)) .base {
      cursor: pointer;
    }
    :host(:not(:disabled)) .base {
      color: var(--m3e-nav-menu-item-label-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:disabled) .base {
      color: color-mix(
        in srgb,
        var(--m3e-nav-menu-item-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-nav-menu-item-disabled-color-opacity, 38%),
        transparent
      );
    }
    :host([selected]:not(.-has-items):not(:disabled)) .base {
      color: var(--m3e-nav-menu-item-selected-label-color, ${DesignToken.color.onSecondaryContainer});
      background-color: var(--m3e-nav-menu-item-selected-container-color, ${DesignToken.color.secondaryContainer});
      --m3e-state-layer-focus-color: var(
        --m3e-nav-menu-item-selected-container-focus-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-state-layer-hover-color: var(
        --m3e-nav-menu-item-selected-container-hover-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-ripple-color: var(--m3e-nav-menu-item-selected-ripple-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:not([selected]):not(.-has-items):not(:disabled)) .base {
      --m3e-state-layer-focus-color: var(
        --m3e-nav-menu-item-unselected-container-focus-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-hover-color: var(
        --m3e-nav-menu-item-unselected-container-hover-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-ripple-color: var(--m3e-nav-menu-item-unselected-ripple-color, ${DesignToken.color.onSurface});
    }
    .state-layer {
      margin-inline: auto;
    }
    :host([selected].-has-items:not(:disabled)) .base {
      background-color: var(--m3e-nav-menu-item-open-container-color, ${DesignToken.color.surfaceContainerHighest});
      --m3e-state-layer-focus-color: var(
        --m3e-nav-menu-item-open-container-focus-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-hover-color: var(
        --m3e-nav-menu-item-open-container-hover-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-ripple-color: var(--m3e-nav-menu-item-open-ripple-color, ${DesignToken.color.onSurface});
    }
    ::slotted(a[slot="label"]) {
      all: unset;
    }
    ::slotted(m3e-divider) {
      margin-block: var(--m3e-nav-menu-divider-margin, 0.25rem);
    }
    ::slotted(m3e-nav-menu-item:first-of-type) {
      margin-block-start: var(--m3e-nav-menu-item-vertical-inset, 0.25rem);
    }
    ::slotted(m3e-nav-menu-item:last-of-type) {
      margin-block-end: var(--m3e-nav-menu-item-vertical-inset, 0.25rem);
    }
    @media (prefers-reduced-motion) {
      .base,
      .toggle,
      .state-layer {
        transition: none !important;
      }
    }
    @media (forced-colors: active) {
      .base,
      .state-layer {
        transition: none !important;
      }

      :host(:disabled) .base {
        color: GrayText;
      }
      :host(:not([selected]):not(:disabled)) .base {
        color: ButtonText;
      }
      :host([selected]:not(.-has-items):not(:disabled)) .base {
        forced-color-adjust: none;
        color: ButtonFace;
        background-color: ButtonText;
      }
      :host([selected].-has-items:not(:disabled)) .base {
        background-color: unset;
        color: ButtonText;
      }
    }
  `;

  /** @internal */ @query(".state-layer") readonly stateLayer?: M3eStateLayerElement;
  /** @internal */ @query(".focus-ring") readonly focusRing?: M3eFocusRingElement;
  /** @internal */ @query(".ripple") readonly ripple?: M3eRippleElement;
  /** @private */ @query(".base") private readonly _base?: HTMLElement;

  /** @private */ @state() private _hasChildItems = false;

  /** @private */ #items: M3eNavMenuItemElement[] = [];
  /** @private */ #menu: M3eNavMenuElement | null = null;
  /** @private */ #path = new Array<M3eNavMenuItemElement>();
  /** @private */ #link: HTMLAnchorElement | null = null;

  /**
   * Whether the item is expanded.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /** A reference to the nested `HTMLAnchorElement`. */
  get link(): HTMLAnchorElement | null {
    return this.#link;
  }

  /** A reference to the element used to present the label of the item. */
  get label(): HTMLElement | null {
    return this._base ?? null;
  }

  /** Whether the item is visible. */
  get visible(): boolean {
    return !this.#path.some((x) => !x.open);
  }

  /** The full path of the item, starting with the top-most ancestor, including this item. */
  get path(): ReadonlyArray<M3eNavMenuItemElement> {
    return [...this.#path, this];
  }

  /** Whether the item has child items. */
  get hasChildItems(): boolean {
    return this._hasChildItems;
  }

  /** The parenting item. */
  get parentItem(): M3eNavMenuItemElement | null {
    return this.#path[this.#path.length - 1] ?? null;
  }

  /** The items that immediately descend from this item. */
  get childItems(): readonly M3eNavMenuItemElement[] {
    return this.#items;
  }

  /** The one-based level of the item. */
  get level(): number {
    return this.#path.length + 1;
  }

  /**
   * Expands this item, and optionally, all descendants.
   * @param {boolean} [descendants=false] Whether to expand all descendants.
   */
  expand(descendants: boolean = false): void {
    if (this.hasChildItems) {
      this.open = true;
      if (descendants) {
        this.childItems.forEach((x) => x.expand(true));
      }
    }
  }

  /**
   * Collapses this item, and optionally, all descendants.
   * @param {boolean} [descendants=false] Whether to expand all descendants.
   */
  collapse(descendants: boolean = false): void {
    if (this.hasChildItems) {
      this.open = false;
      if (descendants) {
        this.childItems.forEach((x) => x.collapse(true));
      }
    }
  }

  /** Toggles the expanded state of the item. */
  toggle(): void {
    if (this.hasChildItems) {
      this.open = !this.open;
    }
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    this.#path.length = 0;
    for (
      let item = this.parentElement?.closest("m3e-nav-menu-item");
      item;
      item = item.parentElement?.closest("m3e-nav-menu-item")
    ) {
      this.#path.push(item);
    }
    this.#path.reverse();

    this.style.setProperty("--_nav-menu-item-level", `${this.level}`);
    this.#menu = this.closest("m3e-nav-menu");
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#path.length = 0;
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has("selected")) {
      // Remove aria-selected and just use aria-current.
      this.ariaSelected = null;
      this.ariaCurrent = this.hasChildItems ? null : `${this.selected}`;
      for (const icon of this.querySelectorAll(":scope > m3e-icon[slot]")) {
        icon.toggleAttribute("filled", this.selected);
      }

      this.#path.forEach((x) => (x.selected = this.selected));
      if (this.selected && !this.hasChildItems) {
        this.closest("m3e-nav-menu")?.[selectionManager].notifySelectionChange(this);
      }
    }

    if (changedProperties.has("open") || changedProperties.has("_hasChildItems")) {
      this.ariaExpanded = this._hasChildItems ? `${this.open}` : null;
    }

    if ((changedProperties.has("_hasChildItems") && this.disabled) || changedProperties.has("disabled")) {
      this.#items.forEach((x) => (x.disabled = this.disabled));
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);

    const base = this._base;
    if (base) {
      [this.focusRing, this.stateLayer, this.ripple].forEach((x) => x?.attach(base));
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base" @click="${this.#handleClick}">
        <m3e-state-layer class="state-layer" ?disabled="${this.disabled}"></m3e-state-layer>
        <m3e-focus-ring class="focus-ring" inward ?disabled="${this.disabled}"></m3e-focus-ring>
        <m3e-ripple class="ripple" centered ?disabled="${this.disabled}"></m3e-ripple>
        <div class="icon" aria-hidden="true">${this.#renderIcon()}</div>
        <div class="label">
          <slot name="label" @slotchange="${this.#handleSlotChange}"></slot>
        </div>
        <slot name="badge"></slot>
        <div aria-hidden="true" class="toggle">
          <slot name="toggle-icon">
            <svg class="toggle-icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M480-360 280-560h400L480-360Z" />
            </svg>
          </slot>
        </div>
      </div>
      <m3e-collapsible
        class="group"
        role="group"
        aria-hidden="${ifDefined(this._hasChildItems ? undefined : "true")}"
        ?open="${this._hasChildItems && this.open}"
        @opening="${this.#handleCollapsibleEvent}"
        @opened="${this.#handleCollapsibleEvent}"
        @closing="${this.#handleCollapsibleEvent}"
        @closed="${this.#handleCollapsibleEvent}"
      >
        <slot @slotchange="${this.#handleItemSlotChange}"></slot>
      </m3e-collapsible>`;
  }

  /** @private */
  #renderIcon(): unknown {
    const icon = html`<slot name="icon" @slotchange="${this.#handleIconSlotChange}"></slot>`;
    return this.selected && !this.hasChildItems
      ? html`<slot name="selected-icon" @slotchange="${this.#handleIconSlotChange}">${icon}</slot>`
      : icon;
  }

  /** @private */
  #handleIconSlotChange(e: Event) {
    this.classList.toggle("-with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleSlotChange(e: Event): void {
    this.#link =
      (<HTMLSlotElement>e.target).assignedElements({ flatten: true }).find((x) => x instanceof HTMLAnchorElement) ??
      null;

    this.#link?.setAttribute("tabindex", "-1");
  }

  /** @private */
  #handleItemSlotChange(e: Event): void {
    this.#items = (<HTMLSlotElement>e.target)
      .assignedElements({ flatten: true })
      .filter((x) => x instanceof M3eNavMenuItemElement);

    const hadChildItems = this._hasChildItems;
    this._hasChildItems = this.#items.length > 0;
    this.classList.toggle("-has-items", this._hasChildItems);

    if (hadChildItems || this._hasChildItems) {
      this.selected = this.#items.some((x) => x.selected);
    }
  }

  /** @private */
  #handleClick(): void {
    if (this.disabled) return;

    this.#menu?.[selectionManager].setActiveItem(this);
    if (!this._hasChildItems) {
      this.#menu?.[selectionManager].select(this);
      this.#path.forEach((x) => (x.selected = this.selected));
      this.#link?.click();

      const drawerContainer = this.closest("m3e-drawer-container");
      if (drawerContainer) {
        const drawer = this.closest("[slot='start']") ?? this.closest("[slot='end')");
        if (
          drawer &&
          (drawerContainer.classList.contains(`-${drawer.slot}-push`) ||
            drawerContainer.classList.contains(`-${drawer.slot}-over`))
        ) {
          setTimeout(() => drawerContainer.removeAttribute(drawer.slot), 300);
        }
      }
    } else {
      this.toggle();
    }
  }

  /** @private */
  #handleCollapsibleEvent(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event(e.type, { bubbles: true }));
  }
}

interface M3eNavMenuItemElementEventMap extends HTMLElementEventMap {
  opening: Event;
  opened: Event;
  closing: Event;
  closed: Event;
}

export interface M3eNavMenuItemElement {
  addEventListener<K extends keyof M3eNavMenuItemElementEventMap>(
    type: K,
    listener: (this: M3eNavMenuItemElement, ev: M3eNavMenuItemElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eNavMenuItemElementEventMap>(
    type: K,
    listener: (this: M3eNavMenuItemElement, ev: M3eNavMenuItemElementEventMap[K]) => void,
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
    "m3e-nav-menu-item": M3eNavMenuItemElement;
  }
}
