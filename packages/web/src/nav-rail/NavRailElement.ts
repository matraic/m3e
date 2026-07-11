import { css, CSSResultGroup, unsafeCSS } from "lit";

import {
  customElement,
  DesignToken,
  registerStyleSheet,
  setCustomState,
  SuppressInitialAnimation,
} from "@m3e/web/core";

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
 * @fires beforeinput - Dispatched before the selected state of an item changes.
 * @fires input - Dispatched when the selected state of an item changes.
 * @fires change - Dispatched when the selected state of an item changes.
 *
 * @cssprop --m3e-nav-rail-top-space - Top block padding for the nav rail.
 * @cssprop --m3e-nav-rail-bottom-space - Bottom block padding for the nav rail.
 * @cssprop --m3e-nav-rail-compact-width - Width of the nav rail in compact mode.
 * @cssprop --m3e-nav-rail-inline-padding - Inline padding for nav rail.
 * @cssprop --m3e-nav-rail-expanded-width - Width of the nav rail in expanded mode.
 * @cssprop --m3e-nav-rail-expanded-item-height - Height of nav items in expanded mode.
 * @cssprop --m3e-nav-rail-button-item-space - Space below icon buttons and FABs.
 * @cssprop --m3e-nav-rail-icon-button-inset - Inset for icon buttons.
 * @cssprop --m3e-nav-rail-expanded-inline-padding - Deprecated, use `--m3e-nav-rail-inline-padding`.
 * @cssprop --m3e-nav-rail-expanded-min-width - Deprecated, use `--m3e-nav-rail-expanded-width`.
 * @cssprop --m3e-nav-rail-expanded-max-width - Deprecated, use `--m3e-nav-rail-expanded-width`.
 * @cssprop --m3e-nav-rail-expanded-icon-button-inset - Deprecated, use `--m3e-nav-rail-icon-button-inset`.
 */
@customElement("m3e-nav-rail")
export class M3eNavRailElement extends SuppressInitialAnimation(M3eNavBarElement) {
  static {
    registerStyleSheet(css`
      m3e-nav-rail > m3e-icon-button,
      m3e-nav-rail > m3e-fab {
        margin-block-end: var(--m3e-nav-rail-button-item-space, 1rem);
      }
      m3e-nav-rail > m3e-icon-button {
        margin-inline-start: var(--m3e-nav-rail-icon-button-inset, 0.5rem);
      }
    `);
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
    :host(:not(:is(:state(--no-animate), :--no-animate))) {
      transition: ${unsafeCSS(`width ${DesignToken.motion.duration.medium2} ${DesignToken.motion.easing.standard}`)};
    }
    .base {
      contain: layout style;
      display: flex;
      width: inherit;
      flex-direction: column;
      align-items: flex-start;
      box-sizing: border-box;
      padding-block-start: var(--m3e-nav-rail-top-space, 2.75rem);
      padding-block-end: var(--m3e-nav-rail-bottom-space, 0.5rem);
      padding-inline: var(--m3e-nav-rail-inline-padding, 1.25rem);
    }
    :host(:is(:state(--compact), :--compact)) {
      width: var(--m3e-nav-rail-compact-width, 6rem);
    }
    :host(:is(:state(--compact), :--compact)) .base {
      --_vertical-nav-item-width: var(--m3e-nav-rail-compact-width, 6rem);
      --_vertical-nav-item-margin-inline: calc(0px - var(--m3e-nav-rail-inline-padding, 1.25rem));
      --_vertical-nav-item-inset-start: calc(
        50% - calc(var(--m3e-vertical-nav-item-active-indicator-width, 3.5rem)) / 2
      );
    }
    :host(:not(:is(:state(--compact), :--compact))) {
      width: var(--m3e-nav-rail-expanded-width, 13.75rem);
    }
    :host(:not(:is(:state(--compact), :--compact))) {
      --m3e-horizontal-nav-item-active-indicator-height: var(--m3e-nav-rail-expanded-item-height, 3.5rem);
      --_nav-item-align-self: stretch;
      --_nav-item-justify-content: flex-start;
    }
    ::slotted(*) {
      flex: none;
    }
    ::slotted(m3e-fab) {
      --m3e-fab-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-disabled-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-focus-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-pressed-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-hover-container-elevation: ${DesignToken.elevation.level1};
      --m3e-fab-lowered-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-lowered-disabled-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-lowered-focus-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-lowered-pressed-container-elevation: ${DesignToken.elevation.level0};
      --m3e-fab-lowered-hover-container-elevation: ${DesignToken.elevation.level1};
    }
    @media (prefers-reduced-motion) {
      :host(:not(:is(:state(--no-animate), :--no-animate))) {
        transition: none;
      }
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
    const items = M3eInteractivityChecker.findInteractiveElements(this, true);
    const { added } = this.#focusKeyManager.setItems(items);
    if (!this.#focusKeyManager.activeItem) {
      const active = added.find((x) => !x.hasAttribute("disabled"));
      if (active) {
        this.#focusKeyManager.updateActiveItem(active);
      }
    }

    this.items.forEach((x, i) => setCustomState(x, "--first", i === 0));

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
