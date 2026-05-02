/** Utility for checking the interactivity of an element, such as whether it is focusable. */
export class M3eInteractivityChecker {
  /**
   * Determines whether a given element can receive focus.
   * @param {Element} element The element to test.
   * @param {readonly Element[]} [parents = undefined] The known parent elements to test. The default value is `undefined`.
   * @param {boolean} [allowVisiblyHidden=false] Whether to allow visibly hidden elements as focusable.
   * @returns {boolean} Whether `element` can receive focus.
   */
  static isFocusable(element: Element, parents?: readonly Element[], allowVisiblyHidden: boolean = false): boolean {
    if (
      element.matches(
        `:is(button,input,select,textarea,object,:is(a,area)[href],[tabindex]:not([tabindex='-1']),[contenteditable=true]):not(:disabled,[disabled]${allowVisiblyHidden ? "" : ",[hidden]"})`,
      )
    ) {
      return (
        !this.#isVisiblyHidden(element, allowVisiblyHidden) && !this.#cannotFocusParent(parents, allowVisiblyHidden)
      );
    }

    if (
      !element.localName.includes("-") ||
      !element.matches(":not(:disabled,[disabled])") ||
      element.getAttribute("aria-disabled") === "true"
    ) {
      return false;
    }

    if (element.shadowRoot?.delegatesFocus) {
      return (
        !this.#isVisiblyHidden(element, allowVisiblyHidden) && !this.#cannotFocusParent(parents, allowVisiblyHidden)
      );
    }

    return false;
  }

  /** @private */
  static #cannotFocusParent(parents?: readonly Element[], allowVisiblyHidden = false): boolean {
    return (
      parents?.some(
        (x) =>
          x.matches(`:is([aria-hidden='true'],:disabled,[disabled],[inert]${allowVisiblyHidden ? "" : ",[hidden]"})`) ||
          this.#isVisiblyHidden(x, allowVisiblyHidden),
      ) ?? false
    );
  }

  /** @private */
  static #isVisiblyHidden(element: Element, allowVisiblyHidden: boolean): boolean {
    if (allowVisiblyHidden) return false;
    const style = getComputedStyle(element);
    return style.display === "none" || style.visibility === "hidden";
  }

  /**
   * Finds interactive elements that descend from the specified element.
   * @param {HTMLElement} element The `HTMLElement` to search.
   * @param {boolean} [allowVisiblyHidden=false] Whether to allow visibly hidden elements as focusable.
   * @returns {HTMLElement[]} The interactive elements that descend from `element`.
   */
  static findInteractiveElements(element: HTMLElement, allowVisiblyHidden: boolean = false): HTMLElement[] {
    const elements = new Array<HTMLElement>();
    const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_ELEMENT);

    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const element = <HTMLElement>walker.currentNode;
      if (this.isFocusable(element, undefined, allowVisiblyHidden)) {
        elements.push(element);
      }
    }

    return elements;
  }
}

// This is the class type, as opposed to an instance of the class.
type M3eInteractivityCheckerClass = typeof M3eInteractivityChecker;

declare global {
  /** Utility for checking the interactivity of an element, such as whether it is focusable. */
  var M3eInteractivityChecker: M3eInteractivityCheckerClass;
}

globalThis.M3eInteractivityChecker = M3eInteractivityChecker;
