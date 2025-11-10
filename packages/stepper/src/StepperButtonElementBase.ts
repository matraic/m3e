import { css, CSSResultGroup, html, LitElement } from "lit";

import { AttachInternals } from "@m3e/core";

/** A base implementation for a button used to move to a step in a stepper. This class must be inherited. */
export abstract class StepperButtonElementBase extends AttachInternals(LitElement) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    ::slotted(.material-icons) {
      font-size: inherit !important;
    }
  `;

  /** @private */ readonly #clickHandler = (e: Event) => this.#handleClick(e);
  /** @private */ readonly #action: "next" | "previous" | "reset";

  constructor(action: "next" | "previous" | "reset") {
    super();
    this.#action = action;
  }

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

  /** @private */
  #handleClick(e: Event): void {
    if (!e.defaultPrevented) {
      switch (this.#action) {
        case "next":
          this.closest("m3e-stepper")?.moveNext();
          break;
        case "previous":
          this.closest("m3e-stepper")?.movePrevious();
          break;

        case "reset":
          this.closest("m3e-stepper")?.reset();
          break;
      }
    }
  }
}
