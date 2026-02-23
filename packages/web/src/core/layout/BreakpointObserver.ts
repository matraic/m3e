import { isServer } from "lit";

import { Breakpoint } from "./Breakpoint";

/** The callback function invoked when the viewport size changes. */
export type BreakpointObserverCallback = (matches: Map<Breakpoint | string, boolean>) => void;

/** Utility used to detect changes to viewport sizes. */
export class M3eBreakpointObserver {
  /**
   * Observes changes to viewport sizes.
   * @param {Array<Breakpoint | string>} breakpoints The breakpoints to observe.
   * @param {BreakpointObserverCallback} callback The callback function invoked when the viewport size changes.
   * @returns {() => void} A function used to stop observing changes to viewport sizes.
   */
  static observe(breakpoints: Array<Breakpoint | string>, callback: BreakpointObserverCallback): () => void {
    if (isServer || breakpoints.length == 0) {
      return () => {};
    }

    const mediaQueries = breakpoints.map((x) => matchMedia(x));
    const changeHandler = () => {
      const map = new Map<Breakpoint | string, boolean>();
      breakpoints.forEach((x, i) => map.set(x, mediaQueries[i].matches));
      callback(map);
    };

    mediaQueries.forEach((x) => x.addEventListener("change", changeHandler));

    changeHandler();

    return () => {
      mediaQueries.forEach((x) => x.removeEventListener("change", changeHandler));
      mediaQueries.length = 0;
    };
  }
}

declare global {
  /** Utility used to detect changes to viewport sizes. */
  var M3eBreakpointObserver: M3eBreakpointObserver;
}

globalThis.M3eBreakpointObserver = M3eBreakpointObserver;
