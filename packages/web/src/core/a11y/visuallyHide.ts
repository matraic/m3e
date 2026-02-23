/**
 * Visually hides an element.
 * @param {CSSStyleDeclaration} style The style of the element to visually hide.
 */
export function visuallyHide(style: CSSStyleDeclaration): void {
  style.position = "absolute";
  style.appearance = "none";
  style.visibility = "hidden";
  style.border = "0";
  style.outline = "0";
  style.overflow = "hidden";
  style.left = "0";
  style.height = "1px";
  style.width = "1px";
  style.margin = "-1px";
  style.padding = "0";
  style.whiteSpace = "nowrap";
}
