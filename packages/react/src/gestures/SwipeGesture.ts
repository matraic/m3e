import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eSwipeGestureElement, SwipeGestureDetail } from "@m3e/web/gestures/swipe";
export type { SwipeGestureDetail } from "@m3e/web/gestures/swipe";

/**
 * React binding for the `m3e-swipe-gesture` Web Component from `@m3e/web/gestures/swipe`.
 *
 * This component renders the underlying `<m3e-swipe-gesture>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-swipe-gesture>` instance for imperative access.
 *
 * See the `m3e-swipe-gesture` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSwipeGesture = createComponent({
  tagName: "m3e-swipe-gesture",
  elementClass: M3eSwipeGestureElement,
  react: React,
  events: {
    onGesture: "gesture" as EventName<CustomEvent<SwipeGestureDetail>>,
  },
});
