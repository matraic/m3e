import React from "react";
import { createComponent, EventName } from "@lit/react";

import { M3eSwipeRevealElement, SwipeRevealEventDetail } from "@m3e/web/swipe-reveal";

export type {
  M3eSwipeRevealElement,
  SwipeRevealElastic,
  SwipeRevealDismiss,
  SwipeRevealEventDetail,
  SwipeRevealSide,
  SwipeRevealState,
  SwipeRevealTrigger,
} from "@m3e/web/swipe-reveal";

/**
 * React binding for the `m3e-swipe-reveal` Web Component from `@m3e/web/swipe-reveal`.
 *
 * This component renders the underlying `<m3e-swipe-reveal>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-swipe-reveal>` instance for imperative access.
 *
 * See the `m3e-swipe-reveal` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSwipeReveal = createComponent({
  tagName: "m3e-swipe-reveal",
  elementClass: M3eSwipeRevealElement,
  react: React,
  events: {
    onRevealing: "revealing" as EventName<CustomEvent<SwipeRevealEventDetail>>,
    onRevealed: "revealed" as EventName<CustomEvent<SwipeRevealEventDetail>>,
    onCovered: "covered" as EventName<CustomEvent<SwipeRevealEventDetail>>,
    onDismiss: "dismiss" as EventName<CustomEvent<SwipeRevealEventDetail>>,
    onDismissed: "dismissed" as EventName<CustomEvent<SwipeRevealEventDetail>>,
  },
});
