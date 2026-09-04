import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3ePanGestureElement, PanGestureDetail } from "@m3e/web/gestures/pan";
export type { PanGestureDetail } from "@m3e/web/gestures/pan";

/**
 * React binding for the `m3e-pan-gesture` Web Component from `@m3e/web/gestures/pan`.
 *
 * This component renders the underlying `<m3e-pan-gesture>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-pan-gesture>` instance for imperative access.
 *
 * See the `m3e-pan-gesture` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3ePanGesture = createComponent({
  tagName: "m3e-pan-gesture",
  elementClass: M3ePanGestureElement,
  react: React,
  events: {
    onGesture: "gesture" as EventName<CustomEvent<PanGestureDetail>>,
  },
});
