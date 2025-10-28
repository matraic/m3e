/* eslint-disable @typescript-eslint/no-unsafe-declaration-merging */
import { css, CSSResultGroup, html, isServer, LitElement, PropertyValues, unsafeCSS } from "lit";
import { customElement, property } from "lit/decorators.js";

import { DesignToken } from "../tokens";

/**
 * Highlights text which matches a given search term.
 *
 * @description
 * Highlights all text ranges in slotted content that match a given search term using the CSS Custom Highlight API.
 *
 * @example
 * The following example illustrates highlighting "Lor".
 * ```html
 * <m3e-text-highlight term="Lor">
 *  <p>
 *    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
 *    ut labore et dolore magna aliqua.
 *  </p>
 * </m3e-text-highlight>
 * ```
 *
 * @tag m3e-text-highlight
 *
 * @slot - Renders the content to highlight.
 *
 * @attr case-sensitive - A value indicating whether matching is case sensitive.
 * @attr disabled - A value indicating whether text highlighting is disabled.
 * @attr term - The term to highlight.
 *
 * @fires highlight - Emitted when content is highlighted.
 *
 * @cssprop --m3e-text-highlight-container-color - Background color applied to highlighted text ranges.
 * @cssprop --m3e-text-highlight-color - Foreground color of highlighted text content.
 * @cssprop --m3e-text-highlight-decoration - Optional text decoration (e.g., underline, line-through) for highlighted text.
 * @cssprop --m3e-text-highlight-shadow - Optional text shadow for emphasis or contrast.
 */
@customElement("m3e-text-highlight")
export class M3eTextHighlightElement extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
  `;

  /** @private */ private static __nextId = 0;

  /** @private */ #id = `m3e-text-highlight-${M3eTextHighlightElement.__nextId++}`;
  /** @private */ #ranges = new Array<Range>();
  /** @private */ #styles: CSSStyleSheet | null = null;

  constructor() {
    super();

    if (this.isSupported) {
      this.#styles = new CSSStyleSheet();
      this.#styles.replaceSync(
        css`
          ::highlight(${unsafeCSS(this.#id)}) {
            background-color: var(--m3e-text-highlight-container-color, ${DesignToken.color.secondaryContainer});
            color: var(--m3e-text-highlight-color, ${DesignToken.color.onSecondaryContainer});
            text-decoration: var(--m3e-text-highlight-decoration);
            text-shadow: var(--m3e-text-highlight-shadow);
          }
        `.toString()
      );
    }
  }

  /**
   * A value indicating whether text highlighting is disabled.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /**
   * The term to highlight.
   * @default ""
   */
  @property() term = "";

  /**
   * A value indicating whether matching is case sensitive.
   * @default false
   */
  @property({ attribute: "case-sensitive", type: Boolean }) caseSensitive = false;

  /** A value indicating whether text highlighting is supported by the browser. */
  get isSupported(): boolean {
    return !isServer && CSS.highlights ? true : false;
  }

  /** The ranges that match the current term. */
  get ranges(): readonly Range[] {
    return this.#ranges;
  }

  /** @inheritdoc */
  protected override firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);

    if (this.shadowRoot && this.#styles && !this.shadowRoot.adoptedStyleSheets.includes(this.#styles)) {
      this.shadowRoot.adoptedStyleSheets.push(this.#styles);
    }
  }

  /** @inheritdoc */
  protected override updated(_changedProperties: PropertyValues<this>): void {
    super.updated(_changedProperties);

    if (
      _changedProperties.has("term") ||
      _changedProperties.has("caseSensitive") ||
      _changedProperties.has("disabled")
    ) {
      this.#highlight();
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot @slotchange="${this.#highlight}"></slot>`;
  }

  /** @private */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #isTextNode(node: any): boolean {
    return /^(\\s|\\n)+$/gi.test(node.data) ? false : true;
  }

  /** @private */
  #findTextNodes(parent: Node, nodes: Node[]): void {
    if (parent instanceof HTMLSlotElement) {
      parent.assignedElements({ flatten: true }).forEach((x) => {
        switch (x.nodeType) {
          case Node.TEXT_NODE:
            if (this.#isTextNode(x)) {
              nodes.push(x);
            }
            break;
          case Node.ELEMENT_NODE:
            this.#findTextNodes(x, nodes);
            break;
        }
      });
    } else {
      parent.childNodes.forEach((x) => {
        switch (x.nodeType) {
          case Node.TEXT_NODE:
            if (this.#isTextNode(x)) {
              nodes.push(x);
            }
            break;
          case Node.ELEMENT_NODE:
            this.#findTextNodes(x, nodes);
            break;
        }
      });
    }
  }

  /** @private */
  #highlight(): void {
    if (!this.isSupported || !this.isConnected) return;
    CSS.highlights.delete(this.#id);
    this.#ranges.length = 0;

    if (this.disabled) return;

    if (!this.term) {
      this.dispatchEvent(
        new CustomEvent<readonly Range[]>("highlight", {
          detail: [...this.#ranges],
          bubbles: false,
          composed: false,
        })
      );
      return;
    }

    const texts = new Array<Node>();
    this.#findTextNodes(this, texts);

    const term = !this.caseSensitive ? this.term.toLowerCase() : this.term;
    this.#ranges = texts
      .map((x) => {
        return {
          el: x,
          text: (!this.caseSensitive ? x.textContent?.toLowerCase() : x.textContent) ?? "",
        };
      })
      .map(({ el, text }) => {
        const indices = new Array<number>();
        let startPos = 0;
        while (startPos < text.length) {
          const index = text.indexOf(term, startPos);
          if (index === -1) break;
          indices.push(index);
          startPos = index + term.length;
        }
        return indices.map((index) => {
          const range = new Range();
          range.setStart(el, index);
          range.setEnd(el, index + term.length);
          return range;
        });
      })
      .flat();

    if (this.#ranges.length > 0) {
      CSS.highlights.set(this.#id, new Highlight(...this.#ranges));
    }

    this.dispatchEvent(
      new CustomEvent<readonly Range[]>("highlight", {
        detail: [...this.#ranges],
        bubbles: false,
        composed: false,
      })
    );
  }
}

interface M3eTextHighlightElementEventMap extends HTMLElementEventMap {
  highlight: CustomEvent<readonly Range[]>;
}

export interface M3eTextHighlightElement {
  addEventListener<K extends keyof M3eTextHighlightElementEventMap>(
    type: K,
    listener: (this: M3eTextHighlightElement, ev: M3eTextHighlightElementEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;

  removeEventListener<K extends keyof M3eTextHighlightElementEventMap>(
    type: K,
    listener: (this: M3eTextHighlightElement, ev: M3eTextHighlightElementEventMap[K]) => void,
    options?: boolean | EventListenerOptions
  ): void;

  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-text-highlight": M3eTextHighlightElement;
  }
}
