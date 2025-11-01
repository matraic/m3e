import { css, CSSResultGroup, html, LitElement } from "lit";
import { customElement } from "lit/decorators.js";

import { AttachInternals, HtmlFor } from "@m3e/core";

import { M3eDialogElement } from "./DialogElement";

/**
 * An element, nested within a clickable element, used to open a dialog.
 * @tag m3e-dialog-trigger
 */
@customElement("m3e-dialog-trigger")
export class M3eDialogTriggerElement extends HtmlFor(AttachInternals(LitElement)) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
  `;

  /** @private */
  #clickHandler = (e: Event) => {
    if (!e.defaultPrevented && this.control instanceof M3eDialogElement) {
      this.control.show();
    }
  };

  /** @inheritdoc */
  override connectedCallback(): void {
    super.connectedCallback();

    if (this.parentElement) {
      this.parentElement.addEventListener("click", this.#clickHandler);
      this.parentElement.ariaHasPopup = "dialog";
    }
  }

  /** @inheritdoc */
  override disconnectedCallback(): void {
    super.disconnectedCallback();

    if (this.parentElement) {
      this.parentElement.removeEventListener("click", this.#clickHandler);
      this.parentElement.ariaHasPopup = null;
    }
  }

  /** @inheritdoc */
  protected override render(): unknown {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-dialog-trigger": M3eDialogTriggerElement;
  }
}
