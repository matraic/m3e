import React from "react";
import { createComponent } from "@lit/react";

import { M3eButtonSegmentElement } from "@m3e/segmented-button";
export type { M3eButtonSegmentElement } from "@m3e/segmented-button";

/**
 * React wrapper for the `m3e-button-segment` web component from `@m3e/segmented-button`.
 *
 * This component renders the underlying `<m3e-button-segment>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-button-segment>` instance for imperative access.
 *
 * See the `m3e-button-segment` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eButtonSegment = createComponent({
  tagName: "m3e-button-segment",
  elementClass: M3eButtonSegmentElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
