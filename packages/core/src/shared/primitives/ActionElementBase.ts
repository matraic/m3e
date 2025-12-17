import { css, CSSResultGroup, html, LitElement } from "lit";

/**
 * A base implementation for an element, nested within a clickable element, used to
 * perform an action. This class must be inherited.
 */
export abstract class ActionElementBase extends LitElement {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    ::slotted(.material-icons) {
      font-size: inherit !important;
    }
  `;

  /** @private */ readonly #clickHandler = (e: Event) => {
    if (!e.defaultPrevented) {
      this._onClick(e);
    }
  };

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();
    this.parentElement?.addEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.parentElement?.removeEventListener("click", this.#clickHandler);
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }

  /**
   * When implemented by a derived class, handles the specified click event.
   * @param {Event} e The click event to handle.
   */
  protected abstract _onClick(e: Event): void;
}
