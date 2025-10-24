/**
 * If needed, scrolls an element into view within a given scroll container.
 * @param {HTMLElement} element The element to scroll into view.
 * @param {HTMLElement} scrollContainer The scrollable container.
 * @param {ScrollIntoViewOptions} [options=undefined] Options used to scroll into view.
 */
export function scrollIntoViewIfNeeded(
  element: HTMLElement,
  scrollContainer: HTMLElement,
  options?: ScrollIntoViewOptions
): void {
  const containerBounds = scrollContainer.getBoundingClientRect();
  const elementBounds = element.getBoundingClientRect();

  if (elementBounds.top < containerBounds.top || elementBounds.bottom > containerBounds.bottom) {
    element.scrollIntoView(options);
  }
}
