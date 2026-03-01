import React from "react";
import { createComponent } from "@lit/react";

import { M3eSliderElement } from "@m3e/web/slider";
export type { M3eSliderElement, SliderSize } from "@m3e/web/slider";

/**
 * React binding for the `m3e-slider` Web Component from `@m3e/web/slider`.
 *
 * This component renders the underlying `<m3e-slider>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-slider>` instance for imperative access.
 *
 * See the `m3e-slider` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eSlider = isBrowser ? createComponent({
  tagName: "m3e-slider",
  elementClass: M3eSliderElement,
  react: React,
}) : null;
