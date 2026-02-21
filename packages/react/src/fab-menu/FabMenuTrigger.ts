import React from "react";
import { createComponent } from "@lit/react";

import { M3eFabMenuTriggerElement } from "@m3e/fab-menu";
export type { M3eFabMenuTriggerElement } from "@m3e/fab-menu";

/**
 * React wrapper for the `m3e-fab-menu-trigger` web component from `@m3e/fab-menu`.
 *
 * This component renders the underlying `<m3e-fab-menu-trigger>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-fab-menu-trigger>` instance for imperative access.
 *
 * See the `m3e-fab-menu-trigger` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eFabMenuTrigger = createComponent({
  tagName: "m3e-fab-menu-trigger",
  elementClass: M3eFabMenuTriggerElement,
  react: React,
});
