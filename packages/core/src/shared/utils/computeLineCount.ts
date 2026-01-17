/**
 * Determines the number of textual lines presented by an element.
 * @param {HTMLElement} element The element for which to compute the number of lines.
 * @returns {number} The number of lines presented by an element.
 */
export function computeLineCount(element: HTMLElement): number {
  const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
  return isNaN(lineHeight) || lineHeight <= 0 ? 0 : Math.round(element.scrollHeight / lineHeight);
}
