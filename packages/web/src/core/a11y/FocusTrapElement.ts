import { css, CSSResultGroup, html, LitElement } from "lit";
import { query } from "lit/decorators.js";

import { customElement, Disabled } from "@m3e/web/core";

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
export class M3eFocusTrapElement extends Disabled(LitElement) {
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
    function matchesRelatedTarget(relatedTarget: EventTarget | null, test: HTMLElement | null): boolean {
      return (
        relatedTarget === test ||
        (relatedTarget instanceof HTMLElement &&
          relatedTarget.shadowRoot !== null &&
          relatedTarget.shadowRoot.contains(test))
      );
    }

    const [first, last] = this.#getFirstAndLastFocusableChild();
    const isFirst = e?.target === this._firstTrap;
    const fromFirst = matchesRelatedTarget(e.relatedTarget, first);
    const fromLast = matchesRelatedTarget(e.relatedTarget, last);
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
      if (
        M3eInteractivityChecker.isFocusable(element, parents) &&
        element instanceof HTMLElement &&
        element.tabIndex >= 0
      ) {
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
    callback: (element: Element, parents: readonly Element[]) => void,
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
    callback: (element: Element, parents: readonly Element[]) => void,
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
    callback: (element: Element, parents: readonly Element[]) => void,
  ) {
    parents = [...parents, slot];
    let childNodes: Array<Element> | NodeListOf<ChildNode> = slot.assignedElements();
    if (childNodes.length == 0 && slot.hasChildNodes()) {
      childNodes = slot.childNodes;
    }
    for (const node of childNodes) {
      if (node.nodeType !== Node.ELEMENT_NODE) continue;
      const element = <HTMLElement>node;

      if (element instanceof HTMLSlotElement) {
        this.#walkSlot(element, parents, callback);
        continue;
      }

      callback(element, parents);
      if (!element.hasChildNodes()) continue;
      this.#walkTree(element, parents, callback);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "m3e-focus-trap": M3eFocusTrapElement;
  }
}
