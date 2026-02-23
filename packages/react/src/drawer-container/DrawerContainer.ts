import React from "react";
import { createComponent } from "@lit/react";

import { M3eDrawerContainerElement } from "@m3e/web/drawer-container";
export type { DrawerMode, DrawerPosition, M3eDrawerContainerElement } from "@m3e/web/drawer-container";

/**
 * React binding for the `m3e-drawer-container` Web Component from `@m3e/drawer-container`.
 *
 * This component renders the underlying `<m3e-drawer-container>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-drawer-container>` instance for imperative access.
 *
 * See the `m3e-drawer-container` documentation in `@m3e/drawer-container` for full details on behavior,
 * styling, accessibility, and supported events.
 */
export const M3eDrawerContainer = createComponent({
  tagName: "m3e-drawer-container",
  elementClass: M3eDrawerContainerElement,
  react: React,
  events: {
    onChange: "change",
  },
});
