import React from "react";
import { createComponent } from "@lit/react";

import { M3eFocusRingElement } from "@m3e/web/core";
export type { M3eFocusRingElement } from "@m3e/web/core";

/**
 * React binding for the `m3e-focus-ring` Web Component from `@m3e/web/core`.
 *
 * This component renders the underlying `<m3e-focus-ring>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-focus-ring>` instance for imperative access.
 *
 * See the `m3e-focus-ring` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFocusRing = createComponent({
  tagName: "m3e-focus-ring",
  elementClass: M3eFocusRingElement,
  react: React,
});
