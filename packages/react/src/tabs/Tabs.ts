import React from "react";
import { createComponent } from "@lit/react";

import { M3eTabsElement } from "@m3e/web/tabs";
export type { M3eTabsElement, TabVariant, TabHeaderPosition } from "@m3e/web/tabs";

/**
 * React binding for the `m3e-tabs` Web Component from `@m3e/web/tabs`.
 *
 * This component renders the underlying `<m3e-tabs>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-tabs>` instance for imperative access.
 *
 * See the `m3e-tabs` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eTabs = isBrowser ? createComponent({
  tagName: "m3e-tabs",
  elementClass: M3eTabsElement,
  react: React,
  events: {
    onChange: "change",
  },
}) : null;
