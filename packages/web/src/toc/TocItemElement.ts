import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { query, state } from "lit/decorators.js";

import {
  AttachInternals,
  customElement,
  DesignToken,
  Disabled,
  Focusable,
  M3eFocusRingElement,
  M3eStateLayerElement,
  Role,
  Selected,
} from "@m3e/web/core";

import { TocNode } from "./TocGenerator";

/**
 * An item in a table of contents.
 *
 * @example
 * A table of contents generates its items from headings in the target; items are not authored manually.
 *
 * ```html
 * <div id="d1">
 *   <m3e-toc for="d1">
 *     <span slot="overline">Overline</span>
 *     <span slot="title">Title</span>
 *   </m3e-toc>
 *   <div>
 *     <h2 id="h1">Heading 1</h2>
 *     <h3 id="h1.1">Heading 1.1</h3>
 *     <h4 id="h1.1.1">Heading 1.1.1</h4>
 *     <h3 id="h2">Heading 1.2</h3>
 *     <h2 id="h2.1">Heading 2</h2>
 *   </div>
 * </div>
 * ```
 *
 * @tag m3e-toc-item
 *
 * @slot - Renders the label of the item.
 *
 * @attr disabled - Whether the element is disabled.
 *
 * @fires click - Dispatched when the element is clicked.
 *
 * @cssprop --m3e-toc-item-shape - Border radius of the TOC item.
 * @cssprop --m3e-toc-item-shape-family - Corner family applied to all corners of the TOC item.
 * @cssprop --m3e-toc-item-shape-family-start-start - Corner family of the block-start, inline-start corner.
 * @cssprop --m3e-toc-item-shape-family-start-end - Corner family of the block-start, inline-end corner.
 * @cssprop --m3e-toc-item-shape-family-end-start - Corner family of the block-end, inline-start corner.
 * @cssprop --m3e-toc-item-shape-family-end-end - Corner family of the block-end, inline-end corner.
 * @cssprop --m3e-toc-item-padding-block - Block padding for the TOC item.
 * @cssprop --m3e-toc-item-padding - Inline padding for the TOC item.
 * @cssprop --m3e-toc-item-inset - Indentation per level for the TOC item.
 * @cssprop --m3e-toc-active-indicator-animation-duration - Animation duration for the active indicator.
 * @cssprop --m3e-toc-item-font-size - Font size for unselected items.
 * @cssprop --m3e-toc-item-font-weight - Font weight for unselected items.
 * @cssprop --m3e-toc-item-line-height - Line height for unselected items.
 * @cssprop --m3e-toc-item-tracking - Letter spacing for unselected items.
 * @cssprop --m3e-toc-item-color - Text color for unselected items.
 * @cssprop --m3e-toc-item-selected-font-size - Font size for selected items.
 * @cssprop --m3e-toc-item-selected-font-weight - Font weight for selected items.
 * @cssprop --m3e-toc-item-selected-line-height - Line height for selected items.
 * @cssprop --m3e-toc-item-selected-tracking - Letter spacing for selected items.
 * @cssprop --m3e-toc-item-selected-color - Text color for selected items.
 */
@customElement("m3e-toc-item")
export class M3eTocItemElement extends Selected(Focusable(Disabled(AttachInternals(Role(LitElement, "link"))))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      contain: layout style;
      display: inline-block;
      position: relative;
      outline: none;
      border-radius: var(--m3e-toc-item-shape, ${DesignToken.shape.corner.largeIncreased});
      corner-start-start-shape: var(
        --m3e-toc-item-shape-family-start-start,
        var(--m3e-toc-item-shape-family, ${DesignToken.shape.family.startStart})
      );
      corner-start-end-shape: var(
        --m3e-toc-item-shape-family-start-end,
        var(--m3e-toc-item-shape-family, ${DesignToken.shape.family.startEnd})
      );
      corner-end-start-shape: var(
        --m3e-toc-item-shape-family-end-start,
        var(--m3e-toc-item-shape-family, ${DesignToken.shape.family.endStart})
      );
      corner-end-end-shape: var(
        --m3e-toc-item-shape-family-end-end,
        var(--m3e-toc-item-shape-family, ${DesignToken.shape.family.endEnd})
      );
      padding-block: var(--m3e-toc-item-padding-block, ${DesignToken.measurement.space100});
      -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      -webkit-user-select: none;
      user-select: none;
    }
    :host([hidden]) {
      display: none;
    }
    :host(:not(:disabled)) {
      cursor: pointer;
    }
    .base {
      padding-inline-start: calc(
        var(--m3e-toc-item-padding, ${DesignToken.measurement.space200}) +
          calc(var(--m3e-toc-item-inset, ${DesignToken.measurement.space150}) * var(--_level, 0))
      );
      padding-inline-end: var(--m3e-toc-item-padding, ${DesignToken.measurement.space200});
      transition: ${unsafeCSS(
        `color var(--m3e-toc-active-indicator-animation-duration, ${DesignToken.motion.duration.long1}) ${DesignToken.motion.easing.standard}`,
      )};
    }
    :host(:not([selected])) {
      font-size: var(--m3e-toc-item-font-size, ${DesignToken.typescale.standard.body.large.fontSize});
      font-weight: var(--m3e-toc-item-font-weight, ${DesignToken.typescale.standard.body.large.fontWeight});
      line-height: var(--m3e-toc-item-line-height, ${DesignToken.typescale.standard.body.large.lineHeight});
      letter-spacing: var(--m3e-toc-item-tracking, ${DesignToken.typescale.standard.body.large.tracking});
      color: var(--m3e-toc-item-color, ${DesignToken.color.onSurfaceVariant});
    }
    :host([selected]) {
      font-size: var(--m3e-toc-item-selected-font-size, ${DesignToken.typescale.emphasized.body.large.fontSize});
      font-weight: var(--m3e-toc-item-selected-font-weight, ${DesignToken.typescale.emphasized.body.large.fontWeight});
      line-height: var(--m3e-toc-item-selected-line-height, ${DesignToken.typescale.emphasized.body.large.lineHeight});
      letter-spacing: var(--m3e-toc-item-selected-tracking, ${DesignToken.typescale.emphasized.body.large.tracking});
      color: var(--m3e-toc-item-selected-color, ${DesignToken.color.onSurface});
    }
    .base {
      justify-content: unset;
    }
    .state-layer {
      --m3e-state-layer-focus-opacity: 0;
    }
    @media (prefers-reduced-motion) {
      .base {
        transition: none;
      }
    }
  `;

  /** @private */ @query(".base") private readonly _base?: HTMLElement;
  /** @private */ @query(".focus-ring") private readonly _focusRing?: M3eFocusRingElement;
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @internal */ @state() node?: TocNode;

  /** @private */
  readonly #keyDownHandler = (event: KeyboardEvent) => {
    if (event.target === this && event.key === "Enter" && !event.repeat && !event.defaultPrevented && !this.disabled) {
      event.preventDefault();
      this.click();
    }
  };

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

  /** @internal */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("selected")) {
      this.ariaSelected = null;
      this.ariaCurrent = this.selected ? "true" : null;
    }

    if (changedProperties.has("node")) {
      if (this.node) {
        this._base?.style.setProperty("--_level", `${this.node.level - 1}`);
      } else {
        this._base?.style.removeProperty("--_level");
      }
    }
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues<this>): void {
    super.firstUpdated(_changedProperties);
    this._focusRing?.attach(this);
    this._stateLayer?.attach(this);
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<m3e-focus-ring class="focus-ring" ?disabled=${this.disabled}></m3e-focus-ring>
      <m3e-state-layer class="state-layer"></m3e-state-layer>
      <div class="base"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-toc-item": M3eTocItemElement;
  }
}
