import React from "react";
import { createComponent } from "@lit/react";

import { M3eToolbarElement } from "@m3e/toolbar";
export type { M3eToolbarElement, ToolbarVariant, ToolbarShape } from "@m3e/toolbar";

/**
 * React wrapper for the `m3e-toolbar` web component from `@m3e/toolbar`.
 *
 * This component renders the underlying `<m3e-toolbar>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-toolbar>` instance for imperative access.
 *
 * See the `m3e-toolbar` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eToolbar = createComponent({
  tagName: "m3e-toolbar",
  elementClass: M3eToolbarElement,
  react: React,
});
