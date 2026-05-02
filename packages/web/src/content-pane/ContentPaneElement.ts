import { css, CSSResultGroup, html, LitElement, PropertyValues } from "lit";

import { customElement, DesignToken, getScrollbarWidth, ReconnectedCallback } from "@m3e/web/core";

/**
 * A shaped surface for vertically scrollable content.
 *
 * @description
 * The `m3e-content-pane` component renders a shaped surface with padding and vertical
 * scrolling for document‑like content.
 *
 * @example
 * The following example illustrates basic usage of the content pane.
 * ```html
 * <m3e-content-pane>
 *   <p>This is some scrollable content.</p>
 *   <p>More content here...</p>
 * </m3e-content-pane>
 * ```
 *
 * @tag m3e-content-pane
 *
 * @slot - Renders the content of the pane.
 *
 * @cssprop --m3e-content-pane-container-shape - Corner radius applied to the pane’s outer surface.
 * @cssprop --m3e-content-pane-container-color - Background color of the pane’s surface.
 * @cssprop --m3e-content-pane-container-padding - Internal padding applied to all sides of the scrollable content.
 */
@customElement("m3e-content-pane")
export class M3eContentPaneElement extends ReconnectedCallback(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: block;
    }
    .base {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: var(--m3e-content-pane-container-shape, ${DesignToken.shape.corner.extraLarge});
      background-color: var(--m3e-content-pane-container-color, ${DesignToken.color.surface});
    }
    .scroll-container {
      width: inherit;
      height: inherit;
      border-radius: inherit;
      box-sizing: border-box;
      overflow-y: auto;
      outline: none;
      padding-block: var(--m3e-content-pane-container-padding, ${DesignToken.shape.corner.value.extraLarge});
      padding-inline-start: var(--m3e-content-pane-container-padding, ${DesignToken.shape.corner.value.extraLarge});
      padding-inline-end: calc(
        var(--m3e-content-pane-container-padding, ${DesignToken.shape.corner.value.extraLarge}) - var(
            --_scrollbar-width,
            0px
          )
      );
      scrollbar-color: ${DesignToken.scrollbar.color};
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
    }
  `;

  /** @inheritdoc */
  override reconnectedCallback(): void {
    super.reconnectedCallback();
    this.#updateScrollbarWidth();
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.#updateScrollbarWidth();
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="base">
      <div class="scroll-container"><slot></slot></div>
    </div>`;
  }

  /** @private */
  #updateScrollbarWidth(): void {
    const base = this.shadowRoot?.querySelector<HTMLElement>(".base");
    if (!base) return;

    const style = getComputedStyle(base);
    const scrollbarThinWidth = style.getPropertyValue("--m3e-scrollbar-thin-width");
    const scrollbarWidth = scrollbarThinWidth.endsWith("px")
      ? parseFloat(scrollbarThinWidth)
      : getScrollbarWidth(!scrollbarThinWidth || scrollbarThinWidth === "thin");

    base.style.setProperty("--_scrollbar-width", `${scrollbarWidth}px`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-content-pane": M3eContentPaneElement;
  }
}
