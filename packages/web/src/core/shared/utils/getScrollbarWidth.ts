let _cachedScrollbarWidth: number | null = null;
let _cachedThinScrollbarWidth: number | null = null;

/**
 * Computes the width of a scrollbar.
 * @param {boolean} [thin=false] Whether to get the width of a thin scrollbar.
 * @returns {number} The width of a scrollbar.
 */
export function getScrollbarWidth(thin = false): number {
  if (thin) {
    if (_cachedThinScrollbarWidth !== null) {
      return _cachedThinScrollbarWidth;
    }
  }
  if (_cachedScrollbarWidth !== null) {
    return _cachedScrollbarWidth;
  }

  const outer = document.createElement("div");
  outer.style.visibility = "hidden";
  outer.style.overflow = "scroll";

  if (thin) {
    outer.style.scrollbarWidth = "thin";
  }

  outer.style.width = "100px";
  outer.style.position = "absolute";
  outer.style.top = "-9999px";

  document.body.appendChild(outer);

  const inner = document.createElement("div");
  inner.style.width = "100%";
  outer.appendChild(inner);

  let scrollbarWidth;
  if (thin) {
    scrollbarWidth = _cachedThinScrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  } else {
    scrollbarWidth = _cachedScrollbarWidth = outer.offsetWidth - inner.offsetWidth;
  }

  outer.remove();
  return scrollbarWidth;
}
