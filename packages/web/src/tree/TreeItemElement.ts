/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { property, query, state } from "lit/decorators.js";
import { ifDefined } from "lit/directives/if-defined.js";

import {
  AttachInternals,
  customElement,
  DesignToken,
  Disabled,
  hasAssignedNodes,
  M3eFocusRingElement,
  M3eRippleElement,
  M3eStateLayerElement,
  MutationController,
  Role,
  Selected,
  setCustomState,
} from "@m3e/web/core";

import { selectionManager } from "@m3e/web/core/a11y";

import type { M3eTreeElement } from "./TreeElement";

/**
 * An expandable item in a tree.
 *
 * @description
 * The `m3e-tree-item` component represents a single item within an `m3e-tree`.
 * It supports nested child items, expand/collapse behavior, selection,
 * disabled state, and interaction styling. Items may contain a child group
 * that hosts additional `m3e-tree-item` elements.
 *
 * @tag m3e-tree-item
 *
 * @slot - Renders the nested child items.
 * @slot label - Renders the label of the item.
 * @slot icon - Renders the icon of the item.
 * @slot selected-icon - Renders the icon of the item when selected.
 * @slot toggle-icon - Renders the toggle icon.
 * @slot open-toggle-icon - Renders the toggle icon when selected.
 *
 * @attr disabled - Whether the element is disabled.
 * @attr indeterminate - Whether the element's checked state is indeterminate.
 * @attr open - Whether the item is expanded.
 * @attr selected - Whether the item is selected.
 *
 * @fires opening - Emitted when the item begins to open.
 * @fires opened - Emitted when the item has opened.
 * @fires closing - Emitted when the item begins to close.
 * @fires closed - Emitted when the item has closed.
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-tree-item-font-size - Font size for the item label.
 * @cssprop --m3e-tree-item-font-weight - Font weight for the item label.
 * @cssprop --m3e-tree-item-line-height - Line height for the item label.
 * @cssprop --m3e-tree-item-tracking - Letter spacing for the item label.
 * @cssprop --m3e-tree-item-padding - Inline padding for the item.
 * @cssprop --m3e-tree-item-height - Height of the item.
 * @cssprop --m3e-tree-item-shape - Border radius of the item and focus ring.
 * @cssprop --m3e-tree-item-icon-size - Size of the icon.
 * @cssprop --m3e-tree-item-inset - Indentation for nested items.
 * @cssprop --m3e-tree-item-label-color - Text color for the item label.
 * @cssprop --m3e-tree-item-selected-label-color - Text color for selected item label.
 * @cssprop --m3e-tree-item-selected-container-color - Background color for selected item.
 * @cssprop --m3e-tree-item-selected-container-focus-color - Focus color for selected item container.
 * @cssprop --m3e-tree-item-selected-container-hover-color - Hover color for selected item container.
 * @cssprop --m3e-tree-item-selected-ripple-color - Ripple color for selected item.
 * @cssprop --m3e-tree-item-unselected-container-focus-color - Focus color for unselected item container.
 * @cssprop --m3e-tree-item-unselected-container-hover-color - Hover color for unselected item container.
 * @cssprop --m3e-tree-item-unselected-ripple-color - Ripple color for unselected item.
 * @cssprop --m3e-tree-item-disabled-color - Text color for disabled item.
 * @cssprop --m3e-tree-item-disabled-color-opacity - Opacity for disabled item text color.
 */
@customElement("m3e-tree-item")
export class M3eTreeItemElement extends Selected(Disabled(AttachInternals(Role(LitElement, "treeitem"), true))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      flex: none;
      outline: none;
      user-select: none;
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .base {
      display: flex;
      align-items: center;
      position: relative;
      height: calc(var(--m3e-tree-item-height, 3rem) + ${DesignToken.density.calc(-3)});
      padding-inline: var(--m3e-tree-item-padding, 1rem);
      font-size: var(--m3e-tree-item-font-size, ${DesignToken.typescale.standard.label.large.fontSize});
      font-weight: var(--m3e-tree-item-font-weight, ${DesignToken.typescale.standard.label.large.fontWeight});
      line-height: var(--m3e-tree-item-line-height, ${DesignToken.typescale.standard.label.large.lineHeight});
      letter-spacing: var(--m3e-tree-item-tracking, ${DesignToken.typescale.standard.label.large.tracking});
      transition: ${unsafeCSS(
        `color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard},
        background-color ${DesignToken.motion.duration.short4} ${DesignToken.motion.easing.standard}`,
      )};
    }
    .base,
    .focus-ring {
      border-radius: var(--m3e-tree-item-shape, ${DesignToken.shape.corner.none});
    }
    .label {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      position: relative;
      overflow: hidden;
      vertical-align: middle;
    }
    .checkbox {
      flex: none;
      margin-inline-end: 0.5rem;
    }
    .icon,
    .toggle {
      flex: none;
      align-items: center;
      justify-content: center;
      position: relative;
      vertical-align: middle;
      margin-inline-end: 0.5rem;
    }
    .toggle {
      display: var(--_tree-item-toggle-display, none);
    }
    :host(:not(:state(-with-icon))) .icon {
      display: none;
    }
    .inset {
      margin-inline-start: calc(var(--m3e-tree-item-inset, 2rem) * var(--_tree-item-level, 0));
    }
    :host([open]) .toggle-icon {
      transform: rotate(90deg);
    }
    :host(:not(:state(-with-items))) .toggle {
      visibility: hidden;
    }
    :host(:not(:state(-with-items))) .group {
      display: none;
    }
    ::slotted([slot="selected-icon"]),
    ::slotted([slot="icon"]),
    ::slotted([slot="toggle-icon"]),
    ::slotted([slot="open-toggle-icon"]),
    .toggle-icon {
      vertical-align: middle;
      width: 1em;
      height: 1em;
      font-size: var(--m3e-tree-item-icon-size, 1.5rem);
    }
    .toggle-icon {
      transition: ${unsafeCSS(`transform var(--m3e-collapsible-animation-duration, ${DesignToken.motion.duration.medium1})
        ${DesignToken.motion.easing.standard}`)};
    }
    :host(:state(-with-open-toggle-icon)[open]) slot[name="toggle-icon"],
    :host(:state(-with-open-toggle-icon):not([open])) slot[name="open-toggle-icon"] {
      display: none;
    }
    :host(:not(:disabled)) .base {
      cursor: pointer;
    }
    :host(:not(:disabled)) .base {
      color: var(--m3e-tree-item-label-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host(:disabled) .base {
      color: color-mix(
        in srgb,
        var(--m3e-tree-item-disabled-color, ${DesignToken.color.onSurface})
          var(--m3e-tree-item-disabled-color-opacity, 38%),
        transparent
      );
    }
    :host([selected]:not(:disabled)) .base {
      color: var(--m3e-tree-item-selected-label-color, ${DesignToken.color.onSecondaryContainer});
      background-color: var(--m3e-tree-item-selected-container-color, ${DesignToken.color.secondaryContainer});
      --m3e-state-layer-focus-color: var(
        --m3e-tree-item-selected-container-focus-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-state-layer-hover-color: var(
        --m3e-tree-item-selected-container-hover-color,
        ${DesignToken.color.onSecondaryContainer}
      );
      --m3e-ripple-color: var(--m3e-tree-item-selected-ripple-color, ${DesignToken.color.onSecondaryContainer});
    }
    :host(:not([selected]):not(:disabled)) .base {
      --m3e-state-layer-focus-color: var(
        --m3e-tree-item-unselected-container-focus-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-state-layer-hover-color: var(
        --m3e-tree-item-unselected-container-hover-color,
        ${DesignToken.color.onSurface}
      );
      --m3e-ripple-color: var(--m3e-tree-item-unselected-ripple-color, ${DesignToken.color.onSurface});
    }
    .state-layer {
      margin-inline: auto;
    }
    ::slotted(a[slot="label"]) {
      all: unset;
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
      :host(:not(:disabled)) .base {
        color: CanvasText;
        background-color: Canvas;
      }
      :host([selected]:not(:state(-multi)):not(:disabled)) slot[name="icon"],
      :host([selected]:not(:state(-multi)):not(:disabled)) slot[name="label"] {
        color: Highlight;
      }
    }
  `;

  /** @internal */ @query(".state-layer") readonly stateLayer?: M3eStateLayerElement;
  /** @internal */ @query(".focus-ring") readonly focusRing?: M3eFocusRingElement;
  /** @internal */ @query(".ripple") readonly ripple?: M3eRippleElement;
  /** @private */ @query(".base") private readonly _base?: HTMLElement;

  /** @private */ @state() private _hasChildItems = false;
  /** @private */ @state() private _multi = false;
  /** @private */
  readonly #treeMutationController = new MutationController(this, {
    target: null,
    skipInitial: true,
    config: {
      attributeFilter: ["multi"],
    },
    callback: () => this.#handleTreeChange(),
  });

  /** @private */ #items: M3eTreeItemElement[] = [];
  /** @private */ #tree: M3eTreeElement | null = null;
  /** @private */ #path = new Array<M3eTreeItemElement>();
  /** @private */ #link: HTMLAnchorElement | null = null;

  /**
   * Whether the item is expanded.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) open = false;

  /**
   * A value indicating whether the element's selected / checked state is indeterminate.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) indeterminate = false;

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
  get path(): ReadonlyArray<M3eTreeItemElement> {
    return [...this.#path, this];
  }

  /** Whether the item has child items. */
  get hasChildItems(): boolean {
    return this._hasChildItems;
  }

  /** The parenting item. */
  get parentItem(): M3eTreeItemElement | null {
    return this.#path[this.#path.length - 1] ?? null;
  }

  /** The items that immediately descend from this item. */
  get childItems(): readonly M3eTreeItemElement[] {
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
   * @param {boolean} [descendants=false] Whether to collapse all descendants.
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
      let item = this.parentElement?.closest("m3e-tree-item");
      item;
      item = item.parentElement?.closest("m3e-tree-item")
    ) {
      this.#path.push(item);
    }
    this.#path.reverse();

    this.style.setProperty("--_tree-item-level", `${this.level - 1}`);
    this.#tree = this.closest("m3e-tree");
    if (this.#tree) {
      this.#treeMutationController.observe(this.#tree);
      this.#handleTreeChange();
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#path.length = 0;

    if (this.#tree) {
      this.#treeMutationController.unobserve(this.#tree);
    }
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (
      changedProperties.has("selected") ||
      changedProperties.has("indeterminate") ||
      changedProperties.has("_multi")
    ) {
      if (this.#tree?.multi) {
        this.ariaSelected = null;
        this.ariaChecked = this.indeterminate ? "mixed" : `${this.selected}`;
      } else {
        this.ariaSelected = `${this.selected}`;
      }
    }

    if (changedProperties.has("selected")) {
      for (const icon of this.querySelectorAll(
        ":scope > m3e-icon[slot]:not([slot='toggle-icon']):not([slot='open-toggle-icon'])",
      )) {
        icon.toggleAttribute("filled", this.selected);
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
        <m3e-ripple class="ripple" ?disabled="${this.disabled}"></m3e-ripple>
        <div aria-hidden="true" class="inset"></div>
        <div aria-hidden="true" class="toggle">
          <slot name="toggle-icon">
            <svg class="toggle-icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M504-480 320-664l56-56 240 240-240 240-56-56 184-184Z" />
            </svg>
          </slot>
          <slot name="open-toggle-icon" @slotchange="${this.#handleOpenToggleIconSlotChange}"></slot>
        </div>
        ${this._multi
          ? html`<m3e-pseudo-checkbox
              class="checkbox"
              ?checked="${this.selected}"
              ?indeterminate="${this.indeterminate}"
              ?disabled="${this.disabled}"
              @click="${this.#handleCheckboxClick}"
            >
            </m3e-pseudo-checkbox>`
          : nothing}
        <div class="icon" aria-hidden="true">${this.#renderIcon()}</div>
        <div class="label">
          <slot name="label" @slotchange="${this.#handleSlotChange}"></slot>
        </div>
      </div>
      <m3e-collapsible
        class="group"
        role="group"
        aria-hidden="${ifDefined(this._hasChildItems ? undefined : "true")}"
        ?open="${this.open}"
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
  #handleOpenToggleIconSlotChange(e: Event): void {
    setCustomState(this, "-with-open-toggle-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleIconSlotChange(e: Event): void {
    setCustomState(this, "-with-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
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
      .filter((x) => x instanceof M3eTreeItemElement);

    const hadChildItems = this._hasChildItems;
    this._hasChildItems = this.#items.length > 0;
    setCustomState(this, "-with-items", this._hasChildItems);

    if (hadChildItems || this._hasChildItems) {
      if (this._multi && this.#tree?.cascade) {
        let anySelected = false,
          anyDeselected = false;

        for (const child of this.querySelectorAll("m3e-tree-item")) {
          anySelected = anySelected || child.selected;
          anyDeselected = anyDeselected || !child.selected;
          if (anySelected && anyDeselected) {
            break;
          }
        }
        if (anyDeselected) {
          this.#tree?.[selectionManager].deselect(this);
          this.indeterminate = anySelected;
        } else {
          this.#tree?.[selectionManager].select(this, false);
          this.indeterminate = false;
        }
      }
    }
  }

  /** @private */
  #handleTreeChange(): void {
    this._multi = this.#tree?.multi === true;
    setCustomState(this, "-multi", this._multi);
  }

  /** @private */
  #handleClick(): void {
    if (this.disabled) return;

    this.#tree?.[selectionManager].setActiveItem(this);
    if (!this._hasChildItems) {
      if (this._multi) {
        if (this.selected) {
          this.#tree?.deselect(this);
        } else {
          this.#tree?.select(this);
        }
      } else {
        this.#tree?.select(this);
      }
      this.#link?.click();
    } else {
      if (!this._multi) {
        this.#tree?.select(this);
      }
      this.toggle();
    }
  }

  /** @private */
  #handleCheckboxClick(e: Event): void {
    e.stopPropagation();

    if (!this.selected) {
      this.#tree?.select(this);
    } else {
      this.#tree?.deselect(this);
    }
  }

  /** @private */
  #handleCollapsibleEvent(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event(e.type, { bubbles: true }));
  }
}

interface M3eTreeItemElementEventMap extends HTMLElementEventMap {
  opening: Event;
  opened: Event;
  closing: Event;
  closed: Event;
}

export interface M3eTreeItemElement {
  addEventListener<K extends keyof M3eTreeItemElementEventMap>(
    type: K,
    listener: (this: M3eTreeItemElement, ev: M3eTreeItemElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;

  removeEventListener<K extends keyof M3eTreeItemElementEventMap>(
    type: K,
    listener: (this: M3eTreeItemElement, ev: M3eTreeItemElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions,
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-tree-item": M3eTreeItemElement;
  }
}
