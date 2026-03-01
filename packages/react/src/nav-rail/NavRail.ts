import React from "react";
import { createComponent } from "@lit/react";

import { M3eNavRailElement } from "@m3e/web/nav-rail";
export type { M3eNavRailElement } from "@m3e/web/nav-rail";

/**
 * React binding for the `m3e-nav-rail` Web Component from `@m3e/web/nav-rail`.
 *
 * This component renders the underlying `<m3e-nav-rail>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-nav-rail>` instance for imperative access.
 *
 * See the `m3e-nav-rail` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eNavRail = isBrowser ? createComponent({
  tagName: "m3e-nav-rail",
  elementClass: M3eNavRailElement,
  react: React,
  events: {
    onChange: "change",
  },
}) : null;
