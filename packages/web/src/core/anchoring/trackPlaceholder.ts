const SUPPORTS_ANCHOR_POSITIONING =
  typeof CSS !== "undefined" && CSS.supports("position-anchor", "--m3e-anchor") && CSS.supports("top", "anchor(top)");

let nextAnchor = 0;

/** Options for tracking an overlay's in-flow placeholder. */
export interface TrackPlaceholderOptions {
  /** Initial viewport-relative placeholder bounds, used by the JavaScript fallback. */
  initialBounds?: Pick<DOMRect, "top" | "left">;

  /** Whether the JavaScript fallback should update on each animation frame. Scroll and resize updates are unaffected. */
  shouldUpdate?: () => boolean;
}

/**
 * Keeps a fixed-position top-layer overlay aligned with an in-flow placeholder in the same tree scope.
 * The placeholder must not be shared with another tracking operation. The caller must stop tracking
 * before removing either element.
 * @param {HTMLElement} target The fixed-position top-layer overlay to align.
 * @param {HTMLElement} placeholder The in-flow element whose top-left corner the overlay follows.
 * @param {TrackPlaceholderOptions} options Optional initial bounds and a predicate controlling frame-by-frame fallback updates.
 * @returns {() => void} A function that stops tracking and restores the affected inline styles.
 */
export function trackPlaceholder(
  target: HTMLElement,
  placeholder: HTMLElement,
  options: TrackPlaceholderOptions = {},
): () => void {
  const properties = ["position-anchor", "top", "left"] as const;
  const original = properties.map((name) => ({
    name,
    value: target.style.getPropertyValue(name),
    priority: target.style.getPropertyPriority(name),
  }));

  const originalAnchor = placeholder.style.getPropertyValue("anchor-name");
  const anchorPriority = placeholder.style.getPropertyPriority("anchor-name");
  let stop = () => {};

  if (SUPPORTS_ANCHOR_POSITIONING) {
    const anchor = `--m3e-placeholder-${nextAnchor++}`;
    const names = originalAnchor && originalAnchor !== "none" ? `${originalAnchor}, ${anchor}` : anchor;
    placeholder.style.setProperty("anchor-name", names, anchorPriority);
    target.style.setProperty("position-anchor", anchor);
    target.style.top = "anchor(top)";
    target.style.left = "anchor(left)";
  } else {
    const setPosition = ({ top, left }: Pick<DOMRect, "top" | "left">) => {
      target.style.top = `${top}px`;
      target.style.left = `${left}px`;
    };

    const sync = () => setPosition(placeholder.getBoundingClientRect());
    setPosition(options.initialBounds ?? placeholder.getBoundingClientRect());

    const roots: (Window | ShadowRoot)[] = [window];
    let node: Node | null = placeholder;
    while (node) {
      if (node instanceof ShadowRoot) {
        roots.push(node);
        node = node.host;
      } else {
        node = node instanceof Element && node.assignedSlot ? node.assignedSlot : node.parentNode;
      }
    }

    for (const root of roots) {
      root.addEventListener("scroll", sync, { capture: true, passive: true });
    }

    window.addEventListener("resize", sync, { passive: true });
    const observer = new ResizeObserver(sync);
    observer.observe(placeholder);

    let frame = 0;
    const tick = () => {
      if (!options.shouldUpdate || options.shouldUpdate()) sync();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    stop = () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      for (const root of roots) root.removeEventListener("scroll", sync, { capture: true });
      window.removeEventListener("resize", sync);
    };
  }

  let stopped = false;
  return () => {
    if (stopped) return;
    stopped = true;
    stop();

    for (const { name, value, priority } of original) {
      if (value) {
        target.style.setProperty(name, value, priority);
      } else {
        target.style.removeProperty(name);
      }
    }

    if (SUPPORTS_ANCHOR_POSITIONING) {
      if (originalAnchor) {
        placeholder.style.setProperty("anchor-name", originalAnchor, anchorPriority);
      } else placeholder.style.removeProperty("anchor-name");
    }
  };
}
