import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eTapGestureElement, TapGestureDetail } from "@m3e/web/gestures/tap";
export type { TapGestureDetail } from "@m3e/web/gestures/tap";

/**
 * React binding for the `m3e-tap-gesture` Web Component from `@m3e/web/gestures/tap`.
 *
 * This component renders the underlying `<m3e-tap-gesture>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-tap-gesture>` instance for imperative access.
 *
 * See the `m3e-tap-gesture` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eTapGesture = createComponent({
  tagName: "m3e-tap-gesture",
  elementClass: M3eTapGestureElement,
  react: React,
  events: {
    onGesture: "gesture" as EventName<CustomEvent<TapGestureDetail>>,
  },
});
