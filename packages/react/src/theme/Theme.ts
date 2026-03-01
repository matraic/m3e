import React from "react";
import { createComponent } from "@lit/react";

import { M3eThemeElement } from "@m3e/web/theme";
export type { ColorScheme, ContrastLevel, MotionScheme, M3eThemeElement } from "@m3e/web/theme";

/**
 * React binding for the `m3e-theme` Web Component from `@m3e/web/theme`.
 *
 * This component renders the underlying `<m3e-theme>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-theme>` instance for imperative access.
 *
 * See the `m3e-theme` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */

// Checking if the code is running in the browser
const isBrowser = typeof window !== "undefined";

// Defining element
export const M3eTheme = isBrowser ? createComponent({
  tagName: "m3e-theme",
  elementClass: M3eThemeElement,
  react: React,
  events: {
    onChange: "change",
  },
});
