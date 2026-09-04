import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eScaleGestureElement, ScaleGestureDetail } from "@m3e/web/gestures/scale";
export type { ScaleGestureDetail } from "@m3e/web/gestures/scale";

/**
 * React binding for the `m3e-scale-gesture` Web Component from `@m3e/web/gestures/scale`.
 *
 * This component renders the underlying `<m3e-scale-gesture>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-scale-gesture>` instance for imperative access.
 *
 * See the `m3e-scale-gesture` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eScaleGesture = createComponent({
  tagName: "m3e-scale-gesture",
  elementClass: M3eScaleGestureElement,
  react: React,
  events: {
    onGesture: "gesture" as EventName<CustomEvent<ScaleGestureDetail>>,
  },
});
