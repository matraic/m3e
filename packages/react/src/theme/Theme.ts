import React from "react";
import { createComponent } from "@lit/react";

import { M3eThemeElement } from "@m3e/theme";
export type { ColorScheme, ContrastLevel, MotionScheme, M3eThemeElement } from "@m3e/theme";

/**
 * React wrapper for the `m3e-theme` web component from `@m3e/theme`.
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
export const M3eTheme = createComponent({
  tagName: "m3e-theme",
  elementClass: M3eThemeElement,
  react: React,
  events: {
    onChange: "change",
  },
});
