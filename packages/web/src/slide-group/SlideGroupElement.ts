import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import { debounce, ResizeController } from "@m3e/web/core";
import { M3eDirectionality } from "@m3e/web/core/bidi";

/**
 * Presents pagination controls used to scroll overflowing content.
 *
 * @description
 * The `m3e-slide-group` component presents directional pagination controls for navigating overflowing content.
 * It orchestrates scrollable layouts with expressive slot-based icons and adaptive orientation, revealing navigation
 * affordances only when content exceeds a defined threshold.  It supports both horizontal and vertical flows, and
 * encodes accessibility through customizable labels and interaction states.
 *
 * @example
 * The following example illustrates a horizontally scrollable group of items with directional pagination buttons.
 * The scroll controls appear when content exceeds the `48px` threshold.
 * ```html
 * <m3e-slide-group threshold="48">
 *  <div>Item 1</div>
 *  <div>Item 2</div>
 *  <div>Item 3</div>
 *  <div>Item 4</div>
 *  <div>Item 5</div>
 * </m3e-slide-group>
 * ```
 *
 * @tag m3e-slide-group
 *
 * @slot - Renders the content to paginate.
 * @slot next-icon - Renders the icon to present for the next button.
 * @slot prev-icon - Renders the icon to present for the previous button.
 *
 * @attr disabled - Whether scroll buttons are disabled.
 * @attr next-page-label - The accessible label given to the button used to move to the previous page.
 * @attr previous-page-label - The accessible label given to the button used to move to the next page.
 * @attr threshold - A value, in pixels, indicating the scroll threshold at which to begin showing pagination controls.
 * @attr vertical - Whether content is oriented vertically.
 *
 * @cssprop --m3e-slide-group-button-icon-size - Sets icon size for scroll buttons; overrides default small icon size.
 * @cssprop --m3e-slide-group-button-size - Defines scroll button size; used for width (horizontal) or height (vertical).
 * @cssprop --m3e-slide-group-divider-top - Adds top border to content container for visual separation.
 * @cssprop --m3e-slide-group-divider-bottom - Adds bottom border to content container for visual separation.
 */
@customElement("m3e-slide-group")
export class M3eSlideGroupElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      flex-wrap: nowrap;
      overflow: hidden;
    }
    :host([vertical]) {
      flex-direction: column;
    }
    .prev-button,
    .next-button {
      flex: none;
      --m3e-icon-button-small-shape-round: 0px;
      --m3e-icon-button-small-shape-square: 0px;
      --m3e-icon-button-small-shape-pressed-morph: 0px;
      --m3e-focus-ring-visibility: hidden;
    }
    ::slotted(prev-icon),
    ::slotted(next-icon),
    .icon {
      width: 1em;
      font-size: var(--m3e-slide-group-button-icon-size, var(--m3e-icon-button-small-icon-size, 1.5rem)) !important;
    }
    :host(:not([vertical])) .prev-button,
    :host(:not([vertical])) .next-button {
      --m3e-icon-button-small-container-height: 100%;
      width: var(--m3e-slide-group-button-size, 2.5rem);
    }
    :host([vertical]) .prev-button,
    :host([vertical]) .next-button {
      width: unset;
      --m3e-icon-button-small-container-height: var(--m3e-slide-group-button-size, 2.5rem);
    }
    :host([vertical]) .prev-button .icon,
    :host([vertical]) .next-button .icon {
      transform: rotate(90deg);
    }
    .content {
      flex: 1 1 auto;
      display: inherit;
      flex-wrap: inherit;
      flex-direction: inherit;
      overflow: inherit;
      position: relative;
      border-top: var(--m3e-slide-group-divider-top);
      border-bottom: var(--m3e-slide-group-divider-bottom);
    }
  `;

  /** @private */ #directionalitySubscription?: () => void;

  /** @private */
  readonly #resizeController = new ResizeController(this, {
    target: null,
    callback: () => this._updatePaging(),
  });

  /** @internal A reference to the container used to scroll content. */
  @query(".content") scrollContainer!: HTMLElement;

  /** @private */ @state() private _canPage = false;
  /** @private */ @state() private _canPageStart = false;
  /** @private */ @state() private _canPageEnd = false;

  /**
   * Whether scroll buttons are disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * Whether content is oriented vertically.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) vertical = false;

  /**
   * A value, in pixels, indicating the scroll threshold at which to begin showing pagination controls.
   * @default 0
   */
  @property({ type: Number }) threshold = 0;

  /**
   * The accessible label given to the button used to move to the previous page.
   * @default "Previous page"
   */
  @property({ attribute: "previous-page-label" }) previousPageLabel = "Previous page";

  /**
   * The accessible label given to the button used to move to the next page.
   * @default "Next page"
   */
  @property({ attribute: "next-page-label" }) nextPageLabel = "Next page";

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.#directionalitySubscription = M3eDirectionality.observe(() => this.requestUpdate());
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#directionalitySubscription?.();
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.#resizeController.observe(this.scrollContainer);
  }

  /** @inheritdoc */
  protected override render(): unknown {
    const prevButton = html`<m3e-icon-button
      class="prev-button"
      tabindex="-1"
      aria-label="${this.previousPageLabel}"
      ?disabled="${!this._canPageStart}"
      @click="${this.#pageStart}"
    >
      <slot name="prev-icon">
        ${M3eDirectionality.current === "ltr" || this.vertical
          ? html`<svg class="icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>`
          : html`<svg class="icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>`}
      </slot>
    </m3e-icon-button>`;

    const nextButton = html`<m3e-icon-button
      class="next-button"
      tabindex="-1"
      aria-label="${this.nextPageLabel}"
      ?disabled="${!this._canPageEnd}"
      @click="${this.#pageEnd}"
    >
      <slot name="next-icon">
        ${M3eDirectionality.current === "ltr" || this.vertical
          ? html`<svg class="icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />
            </svg>`
          : html`<svg class="icon" viewBox="0 -960 960 960" fill="currentColor">
              <path d="M640-80 240-480l400-400 71 71-329 329 329 329-71 71Z" />
            </svg>`}
      </slot>
    </m3e-icon-button>`;

    return html`${this._canPage ? prevButton : nothing}
      <div class="content" @scroll="${this._updatePaging}"><slot></slot></div>
      ${this._canPage ? nextButton : nothing}`;
  }

  /** @private */
  #pageStart(): void {
    if (!this.vertical) {
      let left = this.scrollContainer.scrollLeft - this.scrollContainer.clientWidth;
      if (left <= this.threshold) {
        left = 0;
      }
      this.scrollContainer.scrollTo({ left, behavior: "smooth" });
    } else {
      let top = this.scrollContainer.scrollTop - this.scrollContainer.clientHeight;
      if (top <= this.threshold) {
        top = 0;
      }
      this.scrollContainer.scrollTo({ top, behavior: "smooth" });
    }
  }

  /** @private */
  #pageEnd(): void {
    if (!this.vertical) {
      let left = this.scrollContainer.scrollLeft + this.scrollContainer.clientWidth;
      if (left >= this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth - this.threshold) {
        left = this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth;
      }
      this.scrollContainer.scrollTo({ left, behavior: "smooth" });
    } else {
      let top = this.scrollContainer.scrollTop + this.scrollContainer.clientHeight;
      if (top >= this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight - this.threshold) {
        top = this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight;
      }
      this.scrollContainer.scrollTo({ top, behavior: "smooth" });
    }
  }

  /** @private */
  @debounce(40)
  private _updatePaging(): void {
    if (this.disabled) {
      this._canPage = false;
    } else if (!this.vertical) {
      this._canPage =
        Math.round(this.scrollContainer.scrollWidth) > Math.round(this.scrollContainer.clientWidth) + this.threshold;
      if (this._canPage) {
        this._canPageStart = Math.round(this.scrollContainer.scrollLeft) > this.threshold;
        this._canPageEnd =
          Math.round(this.scrollContainer.scrollLeft) + this.threshold <
          Math.round(this.scrollContainer.scrollWidth - this.scrollContainer.clientWidth);
      }
    } else {
      this._canPage =
        Math.round(this.scrollContainer.scrollHeight) > Math.round(this.scrollContainer.clientHeight) + this.threshold;
      if (this._canPage) {
        this._canPageStart = Math.round(this.scrollContainer.scrollTop) > this.threshold;
        this._canPageEnd =
          Math.round(this.scrollContainer.scrollTop) + +this.threshold <
          Math.round(this.scrollContainer.scrollHeight - this.scrollContainer.clientHeight);
      }
    }

    if (!this._canPage) {
      this._canPageStart = this._canPageEnd = false;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-slide-group": M3eSlideGroupElement;
  }
}
