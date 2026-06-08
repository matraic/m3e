import React from "react";
import { createComponent } from "@lit/react";

import { M3eThemeIconElement } from "@m3e/web/theme";

/**
 * React binding for the `m3e-theme-icon` Web Component from `@m3e/web/theme`.
 *
 * This component renders the underlying `<m3e-theme-icon>` element and exposes its
 * properties, attributes, and events through an idiomatic React interface.
 *
 * Props map directly to element properties, and event handlers receive the
 * native DOM events dispatched by the component. Refs are forwarded to the
 * underlying `<m3e-theme-icon>` instance for imperative access.
 *
 * See the `m3e-theme-icon` documentation for full details on behavior, styling,
 * accessibility, and supported events.
 */
export const M3eThemeIcon = createComponent({
  tagName: "m3e-theme-icon",
  elementClass: M3eThemeIconElement,
  react: React,
});
