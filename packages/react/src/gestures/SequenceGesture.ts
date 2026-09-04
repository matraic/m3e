import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eSequenceGestureElement, SequenceGestureDetail } from "@m3e/web/gestures/composite";
export type { SequenceGestureDetail } from "@m3e/web/gestures/composite";

/**
 * React binding for the `m3e-sequence-gesture` Web Component from `@m3e/web/gestures/composite`.
 *
 * This component renders the underlying `<m3e-sequence-gesture>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-sequence-gesture>` instance for imperative access.
 *
 * See the `m3e-sequence-gesture` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSequenceGesture = createComponent({
  tagName: "m3e-sequence-gesture",
  elementClass: M3eSequenceGestureElement,
  react: React,
  events: {
    onGesture: "gesture" as EventName<CustomEvent<SequenceGestureDetail>>,
  },
});
