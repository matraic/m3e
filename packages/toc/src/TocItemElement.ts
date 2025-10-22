import { css, CSSResultGroup, html, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, query, state } from "lit/decorators.js";

import { AttachInternals, DesignToken, Disabled, M3eStateLayerElement, Role, Selected } from "@m3e/core";

import { TocNode } from "./TocGenerator";

/**
 * An item in a table of contents.
 * @tag m3e-toc-item
 *
 * @slot - Renders the label of the item.
 *
 * @attr disabled - A value indicating whether the element is disabled.
 *
 * @fires click - Emitted when the element is clicked.
 *
 * @cssprop --m3e-toc-item-shape - Border radius of the TOC item.
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
export class M3eTocItemElement extends Selected(Disabled(AttachInternals(Role(LitElement, "link")))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      position: relative;
      user-select: none;
      outline: none;
      border-radius: var(--m3e-toc-item-shape, ${DesignToken.shape.corner.largeIncreased});
      padding-block: var(--m3e-toc-item-padding-block, 0.5rem);
    }
    :host(:not(:disabled)) {
      cursor: pointer;
    }
    .base {
      padding-inline-start: calc(
        var(--m3e-toc-item-padding, 1rem) + calc(var(--m3e-toc-item-inset, 0.75rem) * var(--_level, 0))
      );
      padding-inline-end: var(--m3e-toc-item-padding, 1rem);
      transition: ${unsafeCSS(
        `color var(--m3e-toc-active-indicator-animation-duration, ${DesignToken.motion.duration.long1}) ${DesignToken.motion.easing.standard}`
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
      color: var(--m3e-toc-item-selected-color, ${DesignToken.color.onSecondaryContainer});
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
  /** @private */ @query(".state-layer") private readonly _stateLayer?: M3eStateLayerElement;
  /** @internal */ @state() node?: TocNode;

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
    this._stateLayer?.attach(this);
  }

  /** @inheritdoc */
  override render(): unknown {
    return html`<m3e-state-layer class="state-layer"></m3e-state-layer>
      <div class="base"><slot></slot></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-toc-item": M3eTocItemElement;
  }
}
