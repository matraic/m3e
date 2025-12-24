import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { DesignToken, Role } from "@m3e/core";

import { SelectionManager, selectionManager } from "@m3e/core/a11y";
import { Breakpoint, M3eBreakpointObserver } from "@m3e/core/layout";

import { M3eNavItemElement } from "./NavItemElement";
import { NavItemOrientation } from "./NavItemOrientation";
import { NavBarMode } from "./NavBarMode";

/**
 * A horizontal bar, typically used on smaller devices, that allows a user to switch between 3-5 views.
 *
 * @description
 * The `m3e-nav-bar` component provides a horizontal navigation bar for switching between primary destinations in
 * an application. Designed for smaller devices, it supports 3-5 interactive items, orientation, and theming
 * via CSS custom properties.
 *
 * @example
 * The following example illustrates a nav bar with vertically oriented items.
 * ```html
 * <m3e-nav-bar>
 *   <m3e-nav-item><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="star"></m3e-icon>For you</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="newsstand"></m3e-icon>Trending</m3e-nav-item>
 * </m3e-nav-bar>
 * ```
 *
 * @tag m3e-nav-bar
 *
 * @slot - Renders the items of the bar.
 *
 * @attr mode - The mode in which items in the bar are presented.
 *
 * @fires change - Emitted when the selected state of an item changes.
 *
 * @cssprop --m3e-nav-bar-height - Height of the navigation bar.
 * @cssprop --m3e-nav-bar-container-color - Background color of the navigation bar container.
 * @cssprop --m3e-nav-bar-vertical-item-width - Minimum width of vertical nav items.
 */
@customElement("m3e-nav-bar")
export class M3eNavBarElement extends Role(LitElement, "navigation") {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      overflow-x: auto;
      overflow-y: hidden;
      align-items: stretch;
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
      scrollbar-color: ${DesignToken.scrollbar.color};
      min-height: var(--m3e-nav-bar-height, 4rem);
      background-color: var(--m3e-nav-bar-container-color, ${DesignToken.color.surfaceContainer});
      justify-content: center;
      --_nav-item-min-width: var(--m3e-nav-bar-vertical-item-width, 7rem);
    }
  `;

  /** @internal */ readonly [selectionManager] = new SelectionManager<M3eNavItemElement>().disableRovingTabIndex();
  /** @private */ #breakpointUnobserve?: () => void;
  /** @private */ @state() private _mode?: Exclude<NavBarMode, "auto">;

  /**
   * The mode in which items in the bar are presented.
   * @default "compact"
   */
  @property({ reflect: true }) mode: NavBarMode = "compact";

  /** The items of the bar. */
  get items(): readonly M3eNavItemElement[] {
    return this[selectionManager].items;
  }

  /** The selected item. */
  get selected(): M3eNavItemElement | null {
    return this[selectionManager].selectedItems[0] ?? null;
  }

  /** The current mode applied to the bar. */
  get currentMode(): Exclude<NavBarMode, "auto"> {
    return this._mode ?? (this.mode !== "compact" ? "expanded" : "compact");
  }
  set currentMode(value: Exclude<NavBarMode, "auto">) {
    this._mode = value;
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    this._mode = undefined;
    this.#breakpointUnobserve?.();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues): void {
    super.update(changedProperties);

    if (changedProperties.has("mode")) {
      this.#breakpointUnobserve?.();

      if (this.mode === "auto") {
        this.#breakpointUnobserve = M3eBreakpointObserver.observe([Breakpoint.XSmall, Breakpoint.Small], (matches) => {
          this._mode = matches.get(Breakpoint.XSmall) || matches.get(Breakpoint.Small) ? "compact" : "expanded";
          this._updateItems();
        });
      } else {
        this._mode = undefined;
        this._updateItems();
      }
    }
    if (changedProperties.has("_mode")) {
      this._updateItems();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @change="${this.#handleChange}" @slotchange="${this.#handleSlotChange}"></slot>`;
  }

  /** @private */
  #handleSlotChange(): void {
    this[selectionManager].setItems([...this.querySelectorAll("m3e-nav-item")]);
    this._updateItems();
  }

  /** @private */
  #handleChange(e: Event): void {
    e.stopPropagation();
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  /** @internal */
  protected _updateItems(): void {
    const orientation: NavItemOrientation = this.currentMode === "compact" ? "vertical" : "horizontal";
    this._updateOrientation(orientation);
    this.classList.toggle("-compact", orientation === "vertical");
  }

  /** @internal */
  protected _updateOrientation(orientation: NavItemOrientation): void {
    this[selectionManager].items.forEach((x) => (x.orientation = orientation));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-bar": M3eNavBarElement;
  }
}
