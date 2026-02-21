import React from "react";
import { createComponent } from "@lit/react";

import { M3eFabMenuItemElement } from "@m3e/fab-menu";
export type { M3eFabMenuItemElement } from "@m3e/fab-menu";

/**
 * React wrapper for the `m3e-fab-menu-item` web component from `@m3e/fab-menu`.
 *
 * This component renders the underlying `<m3e-fab-menu-item>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-fab-menu-item>` instance for imperative access.
 *
 * See the `m3e-fab-menu-item` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFabMenuItem = createComponent({
  tagName: "m3e-fab-menu-item",
  elementClass: M3eFabMenuItemElement,
  react: React,
  events: {
    onClick: "click",
  },
});
