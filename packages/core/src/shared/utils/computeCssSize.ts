/**
 * Computes a CSS size expression (var(), %, rem, calc(), etc.) relative to the given host element.
 * @param {HTMLElement} host - The element whose coordinate system and CSS variables should be used to resolve the expression.
 * @param {string} expression - The CSS expression to evaluate.
 * @returns {number} The resolved pixel value.
 */
export function computeCssSize(host: HTMLElement, expression: string): number {
  if (!expression) return 0;

  const temp = document.createElement("div");
  temp.style.all = "inherit";
  temp.style.width = expression;
  temp.style.position = "absolute";
  temp.style.visibility = "hidden";
  temp.style.pointerEvents = "none";
  host.appendChild(temp);

  try {
    return parseFloat(getComputedStyle(temp).width);
  } finally {
    temp.remove();
  }
}
