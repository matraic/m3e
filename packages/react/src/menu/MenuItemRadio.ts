import React from "react";
import { createComponent } from "@lit/react";

import { M3eMenuItemRadioElement } from "@m3e/menu";
export type { M3eMenuItemRadioElement } from "@m3e/menu";

/**
 * React wrapper for the `m3e-menu-item-radio` web component from `@m3e/menu`.
 *
 * This component renders the underlying `<m3e-menu-item-radio>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-menu-item-radio>` instance for imperative access.
 *
 * See the `m3e-menu-item-radio` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eMenuItemRadio = createComponent({
  tagName: "m3e-menu-item-radio",
  elementClass: M3eMenuItemRadioElement,
  react: React,
  events: {
    onClick: "click",
  },
});
