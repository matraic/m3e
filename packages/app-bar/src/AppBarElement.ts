import { CSSResultGroup, html, LitElement, PropertyValues } from "lit";
import { customElement, property, query } from "lit/decorators.js";

import { debounce, hasAssignedNodes, HtmlFor, Role } from "@m3e/core";

import { AppBarSize } from "./AppBarSize";

import { AppBarSizeStyle, AppBarStyle } from "./styles";

/**
 * @summary
 * A bar, placed a the top of a screen, used to help users navigate through an application.
 *
 * @description
 * The `m3e-app-bar` component is a prominent user interface component that provides consistent
 * access to key actions, navigation, and contextual information at the top of an application screen.
 * Designed according to Material 3 principles, it organizes content with clear hierarchy, supports
 * dynamic color, elevation, and shape, and adapts to scrolling behavior.
 *
 * @example
 * ```html
 * <m3e-app-bar size="medium">
 *  <m3e-icon-button slot="leading-icon" aria-label="Back">
 *    <m3e-icon name="arrow_back"></m3e-icon>
 *  </m3e-icon-button>
 *  <span slot="title">Top 10 hiking trails</span>
 *  <span slot="subtitle">Discover popular trails</span>
 *  <m3e-icon-button slot="trailing-icon" aria-label="Bookmark" variant="tonal">
 *    <m3e-icon name="bookmark" filled></m3e-icon>
 *  </m3e-icon-button>
 * <m3e-app-bar>
 * ```
 * @example
 * The next example illustrates how to attach an app bar to a parenting scroll container
 * to produce elevation on scroll. In this example, the `for` attribute is used to attach a
 * sticky positioned `m3e-app-bar` to a parenting container styled to overflow vertically.
 * When scrolled, the app bar will automatically transition to an elevated state.
 * ```html
 * <div style="overflow-y: auto; height: 300px" id="scrollContainer">
 *  <m3e-app-bar for="scrollContainer" style="position: sticky; top: 0">
 *    <span slot="title">Title</span>
 *  </m3e-app-bar>
 *  <div style="height: 400px; display: flex; align-items: center; justify-content: center">
 *    I am scrolling content
 *  </div>
 * </div>
 * ```
 *
 * @tag m3e-app-bar
 *
 * @slot leading-icon - Renders a leading icon.
 * @slot subtitle - Renders the subtitle.
 * @slot title - Renders the title.
 * @slot trailing-icon - Renders a trailing icon.
 *
 * @attr centered - Whether the title and subtitle are centered.
 * @attr for - The identifier of the interactive control to which this element is attached.
 * @attr size - The size of the bar.
 *
 * @cssprop --m3e-app-bar-container-color - Background color of the app bar container.
 * @cssprop --m3e-app-bar-container-color-on-scroll - Background color of the app bar container when scrolled.
 * @cssprop --m3e-app-bar-container-elevation - Elevation (shadow) of the app bar container.
 * @cssprop --m3e-app-bar-container-elevation-on-scroll - Elevation (shadow) of the app bar container when scrolled.
 * @cssprop --m3e-app-bar-title-text-color - Color of the app bar title text.
 * @cssprop --m3e-app-bar-subtitle-text-color - Color of the app bar subtitle text.
 * @cssprop --m3e-app-bar-padding-left - Left padding for the app bar container.
 * @cssprop --m3e-app-bar-padding-right - Right padding for the app bar container.
 * @cssprop --m3e-app-bar-small-container-height - Height of the small app bar container.
 * @cssprop --m3e-app-bar-small-title-text-font-size - Font size for the small app bar title text.
 * @cssprop --m3e-app-bar-small-title-text-font-weight - Font weight for the small app bar title text.
 * @cssprop --m3e-app-bar-small-title-text-line-height - Line height for the small app bar title text.
 * @cssprop --m3e-app-bar-small-subtitle-text-tracking - Letter spacing (tracking) for the small app bar title text.
 * @cssprop --m3e-app-bar-small-subtitle-text-font-size - Font size for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-subtitle-text-font-weight - Font weight for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-subtitle-text-line-height - Line height for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-subtitle-text-tracking - Letter spacing (tracking) for the small app bar subtitle text.
 * @cssprop --m3e-app-bar-small-heading-padding-left - Left padding for the small app bar heading.
 * @cssprop --m3e-app-bar-small-heading-padding-right - Right padding for the small app bar heading.
 * @cssprop --m3e-app-bar-medium-container-height - Height of the medium app bar container.
 * @cssprop --m3e-app-bar-medium-container-height-with-subtitle - Height of the medium app bar container with subtitle.
 * @cssprop --m3e-app-bar-medium-title-text-font-size - Font size for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-title-text-font-weight - Font weight for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-title-text-line-height - Line height for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-tracking - Letter spacing (tracking) for the medium app bar title text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-font-size - Font size for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-font-weight - Font weight for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-line-height - Line height for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-subtitle-text-tracking - Letter spacing (tracking) for the medium app bar subtitle text.
 * @cssprop --m3e-app-bar-medium-heading-padding-left - Left padding for the medium app bar heading.
 * @cssprop --m3e-app-bar-medium-heading-padding-right - Right padding for the medium app bar heading.
 * @cssprop --m3e-app-bar-medium-padding-top - Top padding for the medium app bar.
 * @cssprop --m3e-app-bar-medium-padding-bottom - Bottom padding for the medium app bar.
 * @cssprop --m3e-app-bar-medium-title-max-lines - Maximum number of lines for the medium app bar title.
 * @cssprop --m3e-app-bar-medium-subtitle-max-lines - Maximum number of lines for the medium app bar subtitle.
 * @cssprop --m3e-app-bar-large-container-height - Height of the large app bar container.
 * @cssprop --m3e-app-bar-large-container-height-with-subtitle - Height of the large app bar container with subtitle.
 * @cssprop --m3e-app-bar-large-title-text-font-size - Font size for the large app bar title text.
 * @cssprop --m3e-app-bar-large-title-text-font-weight - Font weight for the large app bar title text.
 * @cssprop --m3e-app-bar-large-title-text-line-height - Line height for the large app bar title text.
 * @cssprop --m3e-app-bar-large-subtitle-text-tracking - Letter spacing (tracking) for the large app bar title text.
 * @cssprop --m3e-app-bar-large-subtitle-text-font-size - Font size for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-subtitle-text-font-weight - Font weight for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-subtitle-text-line-height - Line height for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-subtitle-text-tracking - Letter spacing (tracking) for the large app bar subtitle text.
 * @cssprop --m3e-app-bar-large-heading-padding-left - Left padding for the large app bar heading.
 * @cssprop --m3e-app-bar-large-heading-padding-right - Right padding for the large app bar heading.
 * @cssprop --m3e-app-bar-large-padding-top - Top padding for the large app bar.
 * @cssprop --m3e-app-bar-large-padding-bottom - Bottom padding for the large app bar.
 * @cssprop --m3e-app-bar-large-title-max-lines - Maximum number of lines for the large app bar title.
 * @cssprop --m3e-app-bar-large-subtitle-max-lines - Maximum number of lines for the large app bar subtitle.
 */
@customElement("m3e-app-bar")
export class M3eAppBarElement extends HtmlFor(Role(LitElement, "banner")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = [AppBarStyle, AppBarSizeStyle];

  /** @private */ readonly #scrollHandler = (e: Event) => this._updateScroll(e);
  /** @private */ readonly #frameLoadHandler = () => this.#handleFrameLoad();
  /** @private */ @query(".base") private readonly _base?: HTMLElement;
  /** @private */ @query(".leading-icon") private readonly _leadingIcon?: HTMLElement;
  /** @private */ @query(".trailing-icon") private readonly _trailingIcon?: HTMLElement;

  /**
   * Whether the title and subtitle are centered.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) centered = false;

  /**
   * The size of the bar.
   * @default "small"
   */
  @property({ reflect: true }) size: AppBarSize = "small";

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);

    if (control instanceof HTMLIFrameElement) {
      control.addEventListener("load", this.#frameLoadHandler);
      this.#handleFrameLoad();
    } else {
      control.addEventListener("scroll", this.#scrollHandler);
    }
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control instanceof HTMLIFrameElement) {
      this.control.removeEventListener("load", this.#frameLoadHandler);
      this.control.contentDocument?.removeEventListener("scroll", this.#scrollHandler);
    }
    if (this.control) {
      this.control.removeEventListener("scroll", this.#scrollHandler);
    }
    super.detach();
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("centered") || _changedProperties.has("size")) {
      if (this.centered && this.size === "small") {
        this.#computeCentered();
      } else {
        this.#clearCentered();
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    switch (this.size) {
      case "small":
        return html`<div class="base">
          <div class="leading-icon">
            <slot name="leading-icon" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
          </div>
          <div class="heading">
            <div class="label">
              <div class="title">
                <slot name="title" @slotchange="${this.#handleTitleSlotChange}"></slot>
              </div>
              <div class="subtitle">
                <slot name="subtitle" @slotchange="${this.#handleSubtitleSlotChange}"></slot>
              </div>
            </div>
          </div>
          <div class="trailing-icon">
            <slot name="trailing-icon" @slotchange="${this.#handleTrailingIconsSlotChange}"></slot>
          </div>
        </div>`;

      default:
        return html`<div class="base">
          <div class="heading">
            <div class="leading-icon">
              <slot name="leading-icon" @slotchange="${this.#handleLeadingIconSlotChange}"></slot>
            </div>
            <div class="spacer"></div>
            <div class="trailing-icon">
              <slot name="trailing-icon" @slotchange="${this.#handleTrailingIconsSlotChange}"></slot>
            </div>
          </div>
          <div class="spacer"></div>
          <div class="label">
            <div class="title">
              <slot name="title" @slotchange="${this.#handleTitleSlotChange}"></slot>
            </div>
            <div class="subtitle">
              <slot name="subtitle" @slotchange="${this.#handleSubtitleSlotChange}"></slot>
            </div>
          </div>
        </div>`;
    }
  }

  /** @private */
  #handleTitleSlotChange(e: Event): void {
    this._base?.classList.toggle("-with-title", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleSubtitleSlotChange(e: Event): void {
    this._base?.classList.toggle("-with-subtitle", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleLeadingIconSlotChange(e: Event): void {
    this._base?.classList.toggle("-with-leading-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
    if (this.centered && this.size === "small") {
      setTimeout(() => this.#computeCentered(), 40);
    }
  }

  /** @private */
  #handleTrailingIconsSlotChange(e: Event): void {
    this._base?.classList.toggle("-with-trailing-icon", hasAssignedNodes(<HTMLSlotElement>e.target));
    if (this.centered && this.size === "small") {
      setTimeout(() => this.#computeCentered(), 40);
    }
  }

  /** @private */
  #clearCentered() {
    this._base?.style.removeProperty("--_leading-icon-min-width");
    this._base?.style.removeProperty("--_trailing-icon-min-width");
  }

  /** @private */
  #computeCentered(): void {
    this.#clearCentered();

    const leadingWidth = this._leadingIcon?.getBoundingClientRect().width ?? 0;
    const trailingWidth = this._trailingIcon?.getBoundingClientRect().width ?? 0;

    if (leadingWidth < trailingWidth) {
      this._base?.style.setProperty("--_leading-icon-min-width", `${trailingWidth}px`);
    } else if (leadingWidth > trailingWidth) {
      this._base?.style.setProperty("--_trailing-icon-min-width", `${leadingWidth}px`);
    }
  }

  /** @private */
  @debounce(40)
  private _updateScroll(e: Event): void {
    let scrollTop = 0;

    if (this.control instanceof HTMLIFrameElement) {
      // Both document element (<html>) and body are tested for scroll top, taking the maximum.
      scrollTop = Math.max(
        this.control.contentDocument?.documentElement.scrollTop ?? 0,
        this.control.contentDocument?.body.scrollTop ?? 0
      );
    } else if (e.target instanceof HTMLElement) {
      scrollTop = e.target.scrollTop;
    }

    this._base?.classList.toggle("-on-scroll", scrollTop > 0);
  }

  /** @private */
  #handleFrameLoad(): void {
    if (this.control instanceof HTMLIFrameElement) {
      this.control.contentDocument?.addEventListener("scroll", this.#scrollHandler);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-app-bar": M3eAppBarElement;
  }
}
