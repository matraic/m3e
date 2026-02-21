import React from "react";
import { createComponent } from "@lit/react";

import { M3eSlideGroupElement } from "@m3e/slide-group";
export type { M3eSlideGroupElement } from "@m3e/slide-group";

/**
 * React wrapper for the `m3e-slide-group` web component from `@m3e/slide-group`.
 *
 * This component renders the underlying `<m3e-slide-group>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-slide-group>` instance for imperative access.
 *
 * See the `m3e-slide-group` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eSlideGroup = createComponent({
  tagName: "m3e-slide-group",
  elementClass: M3eSlideGroupElement,
  react: React,
});
