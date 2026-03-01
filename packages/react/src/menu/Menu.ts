import React from "react";
import { createComponent } from "@lit/react";

import { M3eMenuElement } from "@m3e/web/menu";
export type { MenuPositionX, MenuPositionY, MenuVariant, M3eMenuElement } from "@m3e/web/menu";

/**
 * React binding for the `m3e-menu` Web Component from `@m3e/web/menu`.
 *
 * This component renders the underlying `<m3e-menu>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-menu>` instance for imperative access.
 *
 * See the `m3e-menu` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eMenu = isBrowser ? createComponent({
  tagName: "m3e-menu",
  elementClass: M3eMenuElement,
  react: React,
  events: {
    onBeforeToggle: "beforetoggle",
    onToggle: "toggle",
  },
}) : null;
