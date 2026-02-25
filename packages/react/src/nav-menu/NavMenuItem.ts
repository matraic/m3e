import React from "react";
import { createComponent } from "@lit/react";

import { M3eNavMenuItemElement } from "@m3e/web/nav-menu";
export type { M3eNavMenuItemElement } from "@m3e/web/nav-menu";

/**
 * React binding for the `m3e-nav-menu-item` Web Component from `@m3e/web/nav-menu`.
 *
 * This component renders the underlying `<m3e-nav-menu-item>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-nav-menu-item>` instance for imperative access.
 *
 * See the `m3e-nav-menu-item` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eNavMenuItem = createComponent({
  tagName: "m3e-nav-menu-item",
  elementClass: M3eNavMenuItemElement,
  react: React,
  events: {
    onOpening: "opening",
    onOpened: "opened",
    onClosing: "closing",
    onClosed: "closed",
    onClick: "click",
  },
});
