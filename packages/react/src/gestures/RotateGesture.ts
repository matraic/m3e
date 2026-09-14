import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eRotateGestureElement, RotateGestureDetail } from "@m3e/web/gestures/rotate";
export type { RotateGestureDetail, RotateGestureOptions } from "@m3e/web/gestures/rotate";

/**
 * React binding for the `m3e-rotate-gesture` Web Component from `@m3e/web/gestures/rotate`.
 *
 * This component renders the underlying `<m3e-rotate-gesture>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-rotate-gesture>` instance for imperative access.
 *
 * See the `m3e-rotate-gesture` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eRotateGesture = createComponent({
  tagName: "m3e-rotate-gesture",
  elementClass: M3eRotateGestureElement,
  react: React,
  events: {
    onGesture: "gesture" as EventName<CustomEvent<RotateGestureDetail>>,
  },
});
