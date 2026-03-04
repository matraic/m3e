import React from "react";
import { createComponent } from "@lit/react";

import { M3eRippleElement } from "@m3e/web/core";
export type { M3eRippleElement } from "@m3e/web/core";

/**
 * React binding for the `m3e-ripple` Web Component from `@m3e/web/web/core`.
 *
 * This component renders the underlying `<m3e-ripple>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-ripple>` instance for imperative access.
 *
 * See the `m3e-ripple` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eRipple = createComponent({
  tagName: "m3e-ripple",
  elementClass: M3eRippleElement,
  react: React,
});
