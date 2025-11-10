import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, queryAssignedElements } from "lit/decorators.js";

import { DesignToken } from "../tokens";

/**
 * A carousel-like container used to horizontally cycle through slotted items.
 *
 * @example
 * The following example illustrates the use of `m3e-slide` to cycle through content.
 * In this example, `selected-index` is set to `1` so that "Content at index 1" is presented
 * by the component.
 * ```html
 * <m3e-slide selected-index="1">
 *  <div>Content at index 0</div>
 *  <div>Content at index 1</div>
 *  <div>Content at index 2</div>
 *  <div>Content at index 3</div>
 * </m3e-slide>
 * ```
 *
 * @tag m3e-slide
 *
 * @attr selected-index - The zero-based index of the visible item.
 *
 * @cssprop --m3e-slide-animation-duration - The duration of transitions between slotted items.
 */
@customElement("m3e-slide")
export class M3eSlideElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
      position: relative;
      overflow: hidden;
    }
    ::slotted(*) {
      width: 100%;
      top: 0;
      transition: ${unsafeCSS(
        `left var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard},
        visibility var(--m3e-slide-animation-duration, ${DesignToken.motion.duration.long2}) ${DesignToken.motion.easing.standard} allow-discrete`
      )};
    }
    ::slotted(.-before),
    ::slotted(.-after) {
      visibility: hidden;
      position: absolute;
    }
    ::slotted(.-before) {
      left: -100%;
    }
    ::slotted(.-after) {
      left: 100%;
    }
    ::slotted(:not(.-before):not(.-after)) {
      visibility: visible;
      position: relative;
      left: 0;
    }
    :host(.-no-animate) ::slotted(*) {
      transition: none;
    }
    @media (prefers-reduced-motion) {
      ::slotted(*) {
        transition: none;
      }
    }
  `;

  /** @private */ @queryAssignedElements({ flatten: true }) private readonly _items!: Element[];

  /**
   * The zero-based index of the visible item.
   * @default null
   */
  @property({ attribute: "selected-index", type: Number, reflect: true }) selectedIndex: number | null = null;

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.classList.toggle("-no-animate", true);
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selectedIndex")) {
      if (this.selectedIndex === null) {
        this.classList.toggle("-no-animate", true);
      }

      this.#updateItems();

      if (this.selectedIndex !== null && this.classList.contains("-no-animate")) {
        requestAnimationFrame(() => {
          if (this.selectedIndex !== null) {
            this.classList.toggle("-no-animate", false);
          }
        });
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#updateItems}"></slot>`;
  }

  /** @private */
  #updateItems(): void {
    const selectedIndex = this.selectedIndex ?? this._items.length;
    for (let i = 0; i < this._items.length; i++) {
      const item = this._items[i];
      item.classList.toggle("-before", i < selectedIndex);
      item.classList.toggle("-after", i > selectedIndex);
      item.toggleAttribute("inert", i !== selectedIndex);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-slide": M3eSlideElement;
  }
}
