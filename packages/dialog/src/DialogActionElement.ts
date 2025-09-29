import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

import { AttachInternals, Role } from "@m3e/core";

/**
 * An element, nested within a clickable element, used to close a parenting dialog.
 * @tag m3e-dialog-action
 *
 * @attr return-value - The value to return from the dialog.
 */
@customElement("m3e-dialog-action")
export class M3eDialogActionElement extends AttachInternals(Role(LitElement, "none")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
  `;

  /**
   * The value to return from the dialog.
   * @default ""
   */
  @property({ attribute: "return-value" }) returnValue = "";

  /** @private */
  readonly #clickHandler = (e: Event) => {
    if (!e.defaultPrevented) {
      this.closest("m3e-dialog")?.hide(this.returnValue);
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
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-dialog-action": M3eDialogActionElement;
  }
}
