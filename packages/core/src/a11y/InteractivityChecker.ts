/** Utility for checking the interactivity of an element, such as whether it is focusable. */
export class M3eInteractivityChecker {
  /**
   * Determines whether a given element can receive focus.
   * @param {Element} element The element to test.
   * @param {readonly Element[]} [parents = undefined] The known parent elements to test. The default value is `undefined`.
   * @returns {boolean} Whether `element` can receive focus.
   */
  static isFocusable(element: Element, parents?: readonly Element[]): boolean {
    if (
      element.matches(
        ":is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true]):not(:disabled,[disabled]):not([tabindex^='-'])"
      )
    ) {
      return !this.#cannotFocusParent(parents);
    }

    if (
      !element.localName.includes("-") ||
      !element.matches(":not(:disabled,[disabled])") ||
      element.getAttribute("aria-disabled") === "true" ||
      (element instanceof HTMLElement && element.tabIndex < 0)
    ) {
      return false;
    }

    if (element.shadowRoot?.delegatesFocus) {
      return !this.#cannotFocusParent(parents);
    }

    return false;
  }

  static #cannotFocusParent(parents?: readonly Element[]): boolean {
    return parents?.some((x) => x.matches(":is([aria-hidden='true'],:disabled,[disabled])")) ?? false;
  }

  /**
   * Finds interactive elements that descend from the specified element.
   * @param {HTMLElement} element The `HTMLElement` to search.
   * @returns {HTMLElement[]} The interactive elements that descend from `element`.
   */
  static findInteractiveElements(element: HTMLElement): HTMLElement[] {
    const elements = new Array<HTMLElement>();
    const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const element = <HTMLElement>walker.currentNode;
      if (this.isFocusable(element)) {
        elements.push(element);
      }
    }

    return elements;
  }
}

declare global {
  /** Utility for checking the interactivity of an element, such as whether it is focusable. */
  var M3eInteractivityChecker: M3eInteractivityChecker;
}

globalThis.M3eInteractivityChecker = M3eInteractivityChecker;
