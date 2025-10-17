/**
 * If needed, scrolls an element into view within a given scroll container.
 * @param {HTMLElement} element The element to scroll into view.
 * @param {HTMLElement} scrollContainer The scrollable container.
 * @param {ScrollBehavior} [behavior="auto"] The scroll behavior.
 */
export function scrollIntoViewIfNeeded(
  element: HTMLElement,
  scrollContainer: HTMLElement,
  behavior: ScrollBehavior = "auto"
): void {
  const containerRect = scrollContainer.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  if (elementRect.top < containerRect.top || elementRect.bottom > containerRect.bottom) {
    element.scrollIntoView({ block: "nearest", behavior: behavior });
  }
}
