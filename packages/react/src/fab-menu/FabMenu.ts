import React from "react";
import { createComponent } from "@lit/react";

import { M3eFabMenuElement } from "@m3e/fab-menu";
export type { FabMenuVariant, M3eFabMenuElement } from "@m3e/fab-menu";

/**
 * React wrapper for the `m3e-fab-menu` web component from `@m3e/fab-menu`.
 *
 * This component renders the underlying `<m3e-fab-menu>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-fab-menu>` instance for imperative access.
 *
 * See the `m3e-fab-menu` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFabMenu = createComponent({
  tagName: "m3e-fab-menu",
  elementClass: M3eFabMenuElement,
  react: React,
  events: {
    onBeforeToggle: "beforetoggle",
    onToggle: "toggle",
  },
});
