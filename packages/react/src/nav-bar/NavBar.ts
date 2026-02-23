import React from "react";
import { createComponent } from "@lit/react";

import { M3eNavBarElement } from "@m3e/web/nav-bar";
export type { NavBarMode, NavItemOrientation, M3eNavBarElement } from "@m3e/web/nav-bar";

/**
 * React binding for the `m3e-nav-bar` Web Component from `@m3e/nav-bar`.
 *
 * This component renders the underlying `<m3e-nav-bar>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-nav-bar>` instance for imperative access.
 *
 * See the `m3e-nav-bar` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eNavBar = createComponent({
  tagName: "m3e-nav-bar",
  elementClass: M3eNavBarElement,
  react: React,
  events: {
    onChange: "change",
  },
});
