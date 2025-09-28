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
  const targetTop = element.offsetTop;
  const targetBottom = targetTop + element.offsetHeight;
  const scrollTop = scrollContainer.scrollTop;
  const parentHeight = scrollContainer.clientHeight;
  const parentTop = element.offsetParent === scrollContainer ? 0 : scrollContainer.offsetTop;
  const visibleTop = scrollTop;
  const visibleBottom = scrollTop + parentHeight;

  if (targetTop < visibleTop || targetBottom > visibleBottom) {
    const scrollTo = targetTop - parentTop;
    scrollContainer.scrollTo({ top: scrollTo, behavior: behavior });
  }
}
