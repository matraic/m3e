import React from "react";
import { createComponent } from "@lit/react";

import { M3eSliderThumbElement } from "@m3e/slider";
export type { M3eSliderThumbElement } from "@m3e/slider";

/**
 * React wrapper for the `m3e-slider-thumb` web component from `@m3e/slider`.
 *
 * This component renders the underlying `<m3e-slider-thumb>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-slider-thumb>` instance for imperative access.
 *
 * See the `m3e-slider-thumb` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSliderThumb = createComponent({
  tagName: "m3e-slider-thumb",
  elementClass: M3eSliderThumbElement,
  react: React,
  events: {
    onInput: "input",
    onChange: "change",
    onClick: "click",
  },
});
