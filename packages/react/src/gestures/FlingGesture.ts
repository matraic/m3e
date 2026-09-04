import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eFlingGestureElement, FlingGestureDetail } from "@m3e/web/gestures/fling";
export type { FlingGestureDetail } from "@m3e/web/gestures/fling";

/**
 * React binding for the `m3e-fling-gesture` Web Component from `@m3e/web/gestures/fling`.
 *
 * This component renders the underlying `<m3e-fling-gesture>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-fling-gesture>` instance for imperative access.
 *
 * See the `m3e-fling-gesture` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFlingGesture = createComponent({
  tagName: "m3e-fling-gesture",
  elementClass: M3eFlingGestureElement,
  react: React,
  events: {
    onGesture: "gesture" as EventName<CustomEvent<FlingGestureDetail>>,
  },
});
