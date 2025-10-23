import { css, CSSResultGroup, html, LitElement, nothing, PropertyValues, unsafeCSS } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import {
  AttachInternals,
  debounce,
  DesignToken,
  hasAssignedNodes,
  HtmlFor,
  IntersectionController,
  MutationController,
  Role,
  ScrollController,
} from "@m3e/core";

import { SelectionManager } from "@m3e/core/a11y";

import { M3eTocItemElement } from "./TocItemElement";
import { TocGenerator, TocNode } from "./TocGenerator";

/**
 * A table of contents that provides in-page scroll navigation.
 *
 * @description
 * The `m3e-toc` component generates a hierarchical table of contents for in-page navigation.
 * It automatically detects headings or sections in a target element, builds a navigable list,
 * and highlights the active section as the user scrolls. The component supports custom header
 * slots, depth limiting, smooth scrolling, and extensive theming via CSS custom properties.
 *
 * To exclude a heading from the generated table of contents, add the `m3e-toc-ignore` attribute
 * to that heading element.
 *
 * @example
 * ```html
 * <m3e-toc for="content" max-depth="3">
 *   <span slot="overline">Contents</span>
 *   <span slot="title">Documentation</span>
 * </m3e-toc>
 * <div id="content">
 *   <h2>Introduction</h2>
 *   <h2>Getting Started</h2>
 *   <h3>Installation</h3>
 *   <h3>Usage</h3>
 *   <h2>API Reference</h2>
 * </div>
 * ```
 *
 * @tag m3e-toc
 *
 * @slot - Renders content between the header and items.
 * @slot overline - Renders the overline of the table of contents.
 * @slot title - Renders the title of the table of contents.
 *
 * @attr for - The query selector used to specify the element related to this element.
 * @attr max-depth - The maximum depth of the table of contents.
 *
 * @cssprop --m3e-toc-width - Width of the table of contents.
 * @cssprop --m3e-toc-item-shape - Border radius of TOC items and active indicator.
 * @cssprop --m3e-toc-active-indicator-color - Border color of the active indicator.
 * @cssprop --m3e-toc-active-indicator-animation-duration - Animation duration for the active indicator.
 * @cssprop --m3e-toc-item-padding - Inline padding for TOC items and header.
 * @cssprop --m3e-toc-header-space - Block space below and between header elements.
 * @cssprop --m3e-toc-overline-font-size - Font size for the overline slot.
 * @cssprop --m3e-toc-overline-font-weight - Font weight for the overline slot.
 * @cssprop --m3e-toc-overline-line-height - Line height for the overline slot.
 * @cssprop --m3e-toc-overline-tracking - Letter spacing for the overline slot.
 * @cssprop --m3e-toc-overline-color - Text color for the overline slot.
 * @cssprop --m3e-toc-title-font-size - Font size for the title slot.
 * @cssprop --m3e-toc-title-font-weight - Font weight for the title slot.
 * @cssprop --m3e-toc-title-line-height - Line height for the title slot.
 * @cssprop --m3e-toc-title-tracking - Letter spacing for the title slot.
 * @cssprop --m3e-toc-title-color - Text color for the title slot.
 */
@customElement("m3e-toc")
export class M3eTocElement extends HtmlFor(AttachInternals(Role(LitElement, "navigation"))) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      position: relative;
      overflow-y: auto;
      scrollbar-width: ${DesignToken.scrollbar.thinWidth};
      scrollbar-color: ${DesignToken.scrollbar.color};
      width: var(--m3e-toc-width, 9.75rem);
    }
    ul {
      list-style: none;
      padding-inline-start: unset;
      margin-block-start: unset;
      margin-block-end: unset;
    }
    ul,
    li {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    m3e-toc-item {
      flex: none;
    }
    .active-indicator {
      position: absolute;
      pointer-events: none;
      box-sizing: border-box;
      left: 0;
      right: 0;

      border-radius: var(--m3e-toc-item-shape, ${DesignToken.shape.corner.largeIncreased});
      border: 1px solid var(--m3e-toc-active-indicator-color, ${DesignToken.color.outline});
      transition: ${unsafeCSS(`visibility var(--m3e-toc-active-indicator-animation-duration, ${DesignToken.motion.duration.long1})
          ${DesignToken.motion.easing.standard},
        height var(--m3e-toc-active-indicator-animation-duration, ${DesignToken.motion.duration.long1})
          ${DesignToken.motion.easing.standard},
        top var(--m3e-toc-active-indicator-animation-duration, ${DesignToken.motion.duration.long1})
          ${DesignToken.motion.easing.standard}`)};
    }
    .header {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      padding-inline-start: var(--m3e-toc-item-padding, 1rem);
      padding-block-end: var(--m3e-toc-header-space, 0.5rem);
      row-gap: var(--m3e-toc-header-space, 0.5rem);
    }
    .overline {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      line-clamp: 2;
    }
    :host(:not(.-with-overline)) .overline,
    :host(:not(.-with-title)) .title,
    :host(:not(.-with-overline):not(.-with-title)) .header {
      display: none;
    }
    ::slotted([slot="overline"]) {
      font-size: var(--m3e-toc-overline-font-size, ${DesignToken.typescale.standard.label.small.fontSize});
      font-weight: var(--m3e-toc-overline-font-weight, ${DesignToken.typescale.standard.label.small.fontWeight});
      line-height: var(--m3e-toc-overline-line-height, ${DesignToken.typescale.standard.label.small.lineHeight});
      letter-spacing: var(--m3e-toc-overline-tracking, ${DesignToken.typescale.standard.label.small.tracking});
      color: var(--m3e-toc-overline-color, ${DesignToken.color.onSurfaceVariant});
    }
    ::slotted([slot="title"]) {
      font-size: var(--m3e-toc-title-font-size, ${DesignToken.typescale.standard.headline.small.fontSize});
      font-weight: var(--m3e-toc-title-font-weight, ${DesignToken.typescale.standard.headline.small.fontWeight});
      line-height: var(--m3e-toc-title-line-height, ${DesignToken.typescale.standard.headline.small.lineHeight});
      letter-spacing: var(--m3e-toc-title-tracking, ${DesignToken.typescale.standard.headline.small.tracking});
      color: var(--m3e-toc-title-color, ${DesignToken.color.onSurface});
    }
    :host(.-no-animate) .active-indicator {
      transition: none;
    }
    @media (prefers-reduced-motion) {
      .active-indicator {
        transition: none;
      }
    }
  `;

  /** @private */ @state() private _toc: Array<TocNode> = [];
  /** @private */ @query(".active-indicator") private readonly _activeIndicator!: HTMLElement;
  /** @private */ #ignoreScroll = false;

  /** @private */ readonly #selectionManager = new SelectionManager<M3eTocItemElement>()
    .withHomeAndEnd()
    .withVerticalOrientation()
    .disableRovingTabIndex()
    .onSelectedItemsChange(() => {
      if (this._activeIndicator) {
        const item = this.#selectionManager.selectedItems[0];
        if (!item) {
          this.classList.toggle("-no-animate", true);
          this._activeIndicator.style.top = `0px`;
          this._activeIndicator.style.height = `0px`;
          this._activeIndicator.style.visibility = "hidden";
        } else {
          this._activeIndicator.style.top = `${item.offsetTop}px`;
          this._activeIndicator.style.height = `${item.clientHeight}px`;
          this._activeIndicator.style.visibility = item.clientHeight == 0 ? "hidden" : "";

          if (this.classList.contains("-no-animate")) {
            setTimeout(() => this.classList.toggle("-no-animate", false), 40);
          }
        }
      }
    });

  /** @private */
  readonly #intersectionController = new IntersectionController(this, {
    target: null,
    callback: (entries) => {
      if (!this.control || this.#ignoreScroll) return;

      const targetOffset = this.control.scrollTop;
      let closestElement: HTMLElement | null = null;
      let closestDistance = Number.POSITIVE_INFINITY;

      entries
        .filter((x) => x.isIntersecting)
        .map((x) => <HTMLElement>x.target)
        .forEach((item) => {
          const offsetTop = item.offsetTop;
          const distance = Math.abs(offsetTop - targetOffset);
          if (distance < closestDistance) {
            closestDistance = distance;
            closestElement = item;
          }
        });

      if (closestElement) {
        const item = this.#selectionManager.items.find((x) => x.node?.element === closestElement);
        if (item) {
          this.#selectionManager.select(item);
        }
      }
    },
  });

  /** @private */
  readonly #scrollController = new ScrollController(this, {
    target: null,
    callback: () => (this.#ignoreScroll = false),
    debounce: true,
  });

  /** @private */
  readonly #mutationController = new MutationController(this, {
    target: null,
    config: {
      childList: true,
      subtree: true,
    },
    callback: () => this._updateToc(),
  });

  /**
   * The maximum depth of the table of contents.
   * @default 2
   */
  @property({ attribute: "max-depth", type: Number }) maxDepth = 2;

  /** @inheritdoc */
  override attach(control: HTMLElement): void {
    super.attach(control);
    this.#mutationController.observe(control);
    this.#scrollController.observe(control);
    this.#generateToc();
  }

  /** @inheritdoc */
  override detach(): void {
    if (this.control) {
      this.#mutationController.unobserve(this.control);
      this.#scrollController.unobserve(this.control);
    }
    super.detach();
    this.#generateToc();
  }

  /** @inheritdoc */
  protected override update(changedProperties: PropertyValues<this>): void {
    super.update(changedProperties);

    if (changedProperties.has("maxDepth")) {
      this.#generateToc();
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    if (_changedProperties.has("_toc")) {
      const { added, removed } = this.#selectionManager.setItems([
        ...(this.shadowRoot?.querySelectorAll("m3e-toc-item") ?? []),
      ]);

      if (!this.#selectionManager.activeItem) {
        this.classList.toggle("-no-animate", true);
        this.#selectionManager.updateActiveItem(added.find((x) => !x.disabled));
      }

      for (const item of added) {
        if (item.node) {
          this.#intersectionController.observe(item.node.element);
        }
      }

      for (const item of removed) {
        if (item.node) {
          this.#intersectionController.unobserve(item.node.element);
        }
      }
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<div class="header">
        <div class="overline">
          <slot name="overline" @slotchange="${this.#handleOverlineSlotChange}"></slot>
        </div>
        <div class="title">
          <slot name="title" @slotchange="${this.#handleTitleSlotChange}"></slot>
        </div>
      </div>
      <slot></slot>
      <ul class="list">
        ${this._toc.map((x) => this.#renderNode(x))}
      </ul>
      <div class="active-indicator" aria-hidden="true"></div>`;
  }

  /** @private */
  #renderNode(node: TocNode): unknown {
    return html`<li>
      <m3e-toc-item tabindex="-1" .node="${node}" @click="${this.#handleClick}">${node.label}</m3e-toc-item>
      ${node.nodes.length == 0
        ? nothing
        : html`<ul>
            ${node.nodes.map((x) => this.#renderNode(x))}
          </ul>`}
    </li>`;
  }

  /** @private */
  #handleOverlineSlotChange(e: Event): void {
    this.classList.toggle("-with-overline", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleTitleSlotChange(e: Event): void {
    this.classList.toggle("-with-title", hasAssignedNodes(<HTMLSlotElement>e.target));
  }

  /** @private */
  #handleClick(e: Event): void {
    if (e.target instanceof M3eTocItemElement && !e.target.disabled && e.target.node?.element) {
      this.#ignoreScroll = true;
      e.target.node.element.scrollIntoView({ block: "start", inline: "start", behavior: "smooth" });
      this.#selectionManager.updateActiveItem(e.target);
      this.#selectionManager.select(e.target);
    }
  }

  /** @private */
  #generateToc(): void {
    this._toc = this.control ? TocGenerator.generate(this.control, Math.max(1, Math.min(this.maxDepth, 6))) : [];
    this.requestUpdate();
  }

  /** @private */
  @debounce(40)
  private _updateToc(): void {
    this.#generateToc();
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-toc": M3eTocElement;
  }
}
