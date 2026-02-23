import { css, CSSResultGroup } from "lit";
import { customElement } from "lit/decorators.js";

import { DesignToken } from "@m3e/web/core";
import { M3eInteractivityChecker, RovingTabIndexManager, selectionManager } from "@m3e/web/core/a11y";
import { M3eNavBarElement, NavItemOrientation } from "@m3e/web/nav-bar";

/**
 * A vertical bar, typically used on larger devices, that allows a user to switch between views.
 *
 * @description
 * The `m3e-nav-rail` component provides a vertical navigation rail for switching between views in
 * an application. Designed for larger devices, it supports compact and expanded modes, interactive
 * items, and theming via CSS custom properties.
 *
 * @example
 * The following example illustrates a nav rail whose expanded state is automatically determined by the
 * current screen size.  In addition, a toggle button is used to allow the user to manually toggle the
 * expanded state.
 *
 * ```html
 * <m3e-nav-rail id="nav-rail" mode="auto">
 *   <m3e-icon-button toggle>
 *     <m3e-icon name="menu"></m3e-icon>
 *     <m3e-icon slot="selected" name="menu_open"></m3e-icon>
 *     <m3e-nav-rail-toggle for="nav-rail"></m3e-nav-rail-toggle>
 *   </m3e-icon-button>
 *   <m3e-fab size="small">
 *     <m3e-icon name="edit"></m3e-icon>
 *     <span slot="label">Extended</span>
 *   </m3e-fab>
 *   <m3e-nav-item><m3e-icon slot="icon" name="news"></m3e-icon>News</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="globe"></m3e-icon>Global</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="star"></m3e-icon>For you</m3e-nav-item>
 *   <m3e-nav-item><m3e-icon slot="icon" name="newsstand"></m3e-icon>Trending</m3e-nav-item>
 * </m3e-nav-rail>
 * ```
 *
 * @tag m3e-nav-rail
 *
 * @attr mode - The mode in which items in the rail are presented.
 *
 * @fires change - Emitted when the selected state of an item changes.
 *
 * @cssprop --m3e-nav-rail-top-space - Top block padding for the nav rail.
 * @cssprop --m3e-nav-rail-bottom-space - Bottom block padding for the nav rail.
 * @cssprop --m3e-nav-rail-compact-width - Width of the nav rail in compact mode.
 * @cssprop --m3e-nav-rail-expanded-inline-padding - Inline padding for expanded nav rail.
 * @cssprop --m3e-nav-rail-expanded-min-width - Minimum width of the nav rail in expanded mode.
 * @cssprop --m3e-nav-rail-expanded-max-width - Maximum width of the nav rail in expanded mode.
 * @cssprop --m3e-nav-rail-expanded-item-height - Height of nav items in expanded mode.
 * @cssprop --m3e-nav-rail-button-item-space - Space below icon buttons and FABs.
 * @cssprop --m3e-nav-rail-expanded-icon-button-inset - Inset for icon buttons in expanded mode.
 */
@customElement("m3e-nav-rail")
export class M3eNavRailElement extends M3eNavBarElement {
  static {
    if (document) {
      const lightDomStyle = new CSSStyleSheet();
      lightDomStyle.replaceSync(
        css`
          m3e-nav-rail > m3e-icon-button,
          m3e-nav-rail > m3e-fab {
            margin-block-end: var(--m3e-nav-rail-button-item-space, 1rem);
          }
          m3e-nav-rail:not(.-compact) > m3e-icon-button {
            margin-inline-start: var(--m3e-nav-rail-expanded-icon-button-inset, 0.5rem);
          }
        `.toString(),
      );

      document.adoptedStyleSheets = [...document.adoptedStyleSheets, lightDomStyle];
    }
  }

  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
      overflow-x: hidden;
      overflow-y: auto;
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
      scrollbar-color: ${DesignToken.scrollbar.color};
    }
    .base {
      display: flex;
      width: 100%;
      min-width: inherit;
      max-width: inherit;
      flex-direction: column;
      padding-block-start: var(--m3e-nav-rail-top-space, 2.75rem);
      padding-block-end: var(--m3e-nav-rail-bottom-space, 0.5rem);
    }
    :host(.-compact) {
      width: var(--m3e-nav-rail-compact-width, 6rem);
    }
    :host(.-compact) ::slotted(m3e-fab) {
      align-self: center;
    }
    :host(:not(.-compact)) {
      min-width: var(--m3e-nav-rail-expanded-min-width, 13.75rem);
      max-width: var(--m3e-nav-rail-expanded-max-width, 22.5rem);
    }
    :host(:not(.-compact)) .base {
      padding-inline: var(--m3e-nav-rail-expanded-inline-padding, 1.25rem);
      align-items: flex-start;
      --m3e-horizontal-nav-item-active-indicator-height: var(--m3e-nav-rail-expanded-item-height, 3.5rem);
      --_nav-item-align-self: stretch;
      --_nav-item-justify-content: flex-start;
    }
    ::slotted(*) {
      flex: none;
    }
    :host(.-compact) ::slotted(m3e-icon-button) {
      align-self: center;
    }
  `;

  /** @private */ #focusKeyManager = new RovingTabIndexManager().withHomeAndEnd().withWrap();
  /** @private */ readonly #keyDownHandler = (e: KeyboardEvent) => this.#handleKeyDown(e);

  constructor() {
    super();

    this[selectionManager].onSelectedItemsChange(() => {
      this.#focusKeyManager.updateActiveItem(this[selectionManager].activeItem);
    });
  }

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("keydown", this.#keyDownHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("keydown", this.#keyDownHandler);
  }

  /** @private */
  #handleKeyDown(e: KeyboardEvent): void {
    this.#focusKeyManager.onKeyDown(e);
  }

  /** @inheritdoc @internal */
  protected override _updateItems(): void {
    const items = M3eInteractivityChecker.findInteractiveElements(this);
    const { added } = this.#focusKeyManager.setItems(items);
    if (!this.#focusKeyManager.activeItem) {
      const active = added.find((x) => !x.hasAttribute("disabled"));
      if (active) {
        this.#focusKeyManager.updateActiveItem(active);
      }
    }

    super._updateItems();
  }

  /** @inheritdoc @internal */
  protected override _updateOrientation(orientation: NavItemOrientation): void {
    super._updateOrientation(orientation);
    this.querySelectorAll("m3e-fab").forEach((x) => x.toggleAttribute("extended", orientation === "horizontal"));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-nav-rail": M3eNavRailElement;
  }
}
