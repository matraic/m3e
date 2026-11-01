import React from "react";
import { createComponent } from "@lit/react";

import { M3eSwipeRevealGroupElement } from "@m3e/web/swipe-reveal";

/**
 * React binding for the `m3e-swipe-reveal-group` Web Component from `@m3e/web/swipe-reveal`.
 *
 * This component renders the underlying `<m3e-swipe-reveal-group>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-swipe-reveal-group>` instance for imperative access.
 *
 * See the `m3e-swipe-reveal-group` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSwipeRevealGroup = createComponent({
  tagName: "m3e-swipe-reveal-group",
  elementClass: M3eSwipeRevealGroupElement,
  react: React,
});
