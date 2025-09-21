import { css, CSSResultGroup, html, isServer, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";

import { Disabled, Role } from "../shared/mixins";

import { M3eInteractivityChecker } from "./InteractivityChecker";

/**
 * A non-visual element used to trap focus within nested content.
 * @tag m3e-focus-trap
 *
 * @slot - Renders content for which to trap focus.
 *
 * @attr disabled - Disables the focus trap.
 */
@customElement("m3e-focus-trap")
export class M3eFocusTrapElement extends Disabled(Role(LitElement, "none")) {
  /** The styles of the element. */
  static override styles: CSSResultGroup = css`
    :host {
      display: contents;
    }
    .trap {
      outline: none;
    }
  `;

  /** @private */ @query(".trap") private readonly _firstTrap!: HTMLElement | null;

  /** @inheritdoc */
  protected override render(): unknown {
    const trap = html`<div
      class="trap"
      .inert="${this.disabled}"
      tabindex="0"
      aria-hidden="true"
      @focus="${this.#onFocus}"
    ></div>`;
    return html`${trap}<slot></slot>${trap}`;
  }

  /** @private */
  #onFocus(e: FocusEvent): void {
    if (isServer) return;
    const [first, last] = this.#getFirstAndLastFocusableChild();
    const isFirst = e?.target === this._firstTrap;
    const fromFirst = e.relatedTarget === first;
    const fromLast = e.relatedTarget === last;
    const fromOutside = !fromFirst && !fromLast;

    if ((!isFirst && fromLast) || (isFirst && fromOutside)) {
      first?.focus();
      return;
    }
    if ((isFirst && fromFirst) || (!isFirst && fromOutside)) {
      last?.focus();
    }
  }

  /** @private */
  #getFirstAndLastFocusableChild(): [HTMLElement | null, HTMLElement | null] {
    let first: HTMLElement | null = null;
    let last: HTMLElement | null = null;

    this.#walkTree(this, [], (element, parents) => {
      if (M3eInteractivityChecker.isFocusable(element, parents) && element instanceof HTMLElement) {
        first = first ?? element;
        last = element;
      }
    });

    return [first, last];
  }

  /** @private */
  #walkTree(
    root: Element,
    parents: readonly Element[],
    callback: (element: Element, parents: readonly Element[]) => void
  ): void {
    parents = [...parents, root];

    for (const node of root.childNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const element = <HTMLElement>node;

      callback(element, parents);

      if (element.shadowRoot) {
        this.#walkShadowRoot(element, parents, callback);
      } else if (element instanceof HTMLSlotElement) {
        this.#walkSlot(element, parents, callback);
      } else if (element.hasChildNodes()) {
        this.#walkTree(element, parents, callback);
      }
    }
  }

  /** @private */
  #walkShadowRoot(
    root: Element,
    parents: readonly Element[],
    callback: (element: Element, parents: readonly Element[]) => void
  ): void {
    for (const node of root.shadowRoot?.childNodes ?? []) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const element = <HTMLElement>node;
      callback(element, parents);
      if (!element.hasChildNodes()) continue;
      this.#walkTree(element, parents, callback);
    }
  }

  /** @private */
  #walkSlot(
    slot: HTMLSlotElement,
    parents: readonly Element[],
    callback: (element: Element, parents: readonly Element[]) => void
  ) {
    for (const node of slot.assignedElements()) {
      callback(node, parents);
      if (!node.hasChildNodes()) continue;
      this.#walkTree(node, parents, callback);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-focus-trap": M3eFocusTrapElement;
  }
}
