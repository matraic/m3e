import React from "react";
import { createComponent } from "@lit/react";

import { M3eMenuItemElement } from "@m3e/web/menu";
export type { M3eMenuItemElement } from "@m3e/web/menu";

/**
 * React binding for the `m3e-menu-item` Web Component from `@m3e/menu`.
 *
 * This component renders the underlying `<m3e-menu-item>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-menu-item>` instance for imperative access.
 *
 * See the `m3e-menu-item` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eMenuItem = createComponent({
  tagName: "m3e-menu-item",
  elementClass: M3eMenuItemElement,
  react: React,
  events: {
    onClick: "click",
  },
});
