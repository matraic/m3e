import React from "react";
import { createComponent } from "@lit/react";

import { M3eDrawerToggleElement } from "@m3e/web/drawer-container";
export type { M3eDrawerToggleElement } from "@m3e/web/drawer-container";

/**
 * React binding for the `m3e-drawer-toggle` Web Component from `@m3e/web/drawer-container`.
 *
 * This component renders the underlying `<m3e-drawer-toggle>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-drawer-toggle>` instance for imperative access.
 *
 * See the `m3e-drawer-toggle` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eDrawerToggle = createComponent({
  tagName: "m3e-drawer-toggle",
  elementClass: M3eDrawerToggleElement,
  react: React,
});
