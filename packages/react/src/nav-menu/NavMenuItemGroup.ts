import React from "react";
import { createComponent } from "@lit/react";

import { M3eNavMenuItemGroupElement } from "@m3e/nav-menu";
export type { M3eNavMenuItemGroupElement } from "@m3e/nav-menu";

/**
 * React wrapper for the `m3e-nav-menu-item-group` web component from `@m3e/nav-menu`.
 *
 * This component renders the underlying `<m3e-nav-menu-item-group>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-nav-menu-item-group>` instance for imperative access.
 *
 * See the `m3e-nav-menu-item-group` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eNavMenuItemGroup = createComponent({
  tagName: "m3e-nav-menu-item-group",
  elementClass: M3eNavMenuItemGroupElement,
  react: React,
});
